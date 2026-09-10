import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

const source = fs.readFileSync(new URL('../src/utils/content.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {}, require: () => ({ getCollection: () => { throw new Error('Historical totals must not read current rosters'); } }) };
vm.runInNewContext(compiled, context);
const { getTeamMatchStats } = context.exports;
const files = fs.readdirSync(new URL('../src/data/matches/', import.meta.url)).filter(f => f.endsWith('.json'));
const matches = files.map(file => ({ id: file.slice(0, -5), data: JSON.parse(fs.readFileSync(new URL('../src/data/matches/' + file, import.meta.url))) }));
const schemaSource = fs.readFileSync(new URL('../src/content.config.ts', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace('export const collections =', 'globalThis.collections =');
const schemaContext = { z, defineCollection: value => value, glob: value => value };
vm.runInNewContext(ts.transpileModule(schemaSource, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, schemaContext);
const schema = schemaContext.collections.matches.schema;

test('every migrated row has an explicit match-time team or null', () => {
  for (const match of matches) assert.equal(schema.safeParse(match.data).success, true, match.id);
});

test('a player can represent different teams without moving old stats', () => {
  const player = { uid: 'player-1', team: 'team-a' };
  const fixtures = [
    { data: { playerStats: [{ uid: player.uid, teamId: 'team-a', rounds: [{ kills: 10, deaths: 4, assists: 2 }] }] } },
    { data: { playerStats: [{ uid: player.uid, teamId: 'team-b', rounds: [{ kills: 7, deaths: 3, assists: 1 }] }] } },
    { data: { playerStats: [{ uid: null, teamId: null, rounds: [{ kills: 99, deaths: 99, assists: 99 }] }] } },
  ];
  player.team = 'team-b';
  assert.equal(JSON.stringify(getTeamMatchStats(fixtures, 'team-a')), JSON.stringify({ kills: 10, deaths: 4, assists: 2 }));
  assert.equal(JSON.stringify(getTeamMatchStats(fixtures, 'team-b')), JSON.stringify({ kills: 7, deaths: 3, assists: 1 }));
});

test('schema rejects missing attribution and teams outside the match', () => {
  const match = structuredClone(matches[0].data);
  delete match.playerStats[0].teamId;
  assert.equal(schema.safeParse(match).success, false);
  match.playerStats[0].teamId = 'unrelated-team';
  assert.equal(schema.safeParse(match).success, false);
  match.playerStats[0].teamId = null;
  assert.equal(schema.safeParse(match).success, true);
});


test('schema rejects duplicate players and invalid player map numbers', () => {
  const match = structuredClone(matches[0].data);
  match.playerStats.push(structuredClone(match.playerStats[0]));
  assert.equal(schema.safeParse(match).success, false);
  match.playerStats.pop();
  match.playerStats[0].rounds[0].round_number = 99;
  assert.equal(schema.safeParse(match).success, false);
  match.playerStats[0].rounds[0].round_number = match.playerStats[0].rounds[1].round_number;
  assert.equal(schema.safeParse(match).success, false);
});
