import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

const source = fs.readFileSync(new URL('../src/content.config.ts', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace('export const collections =', 'globalThis.collections =');
const context = { z, defineCollection: value => value, glob: value => value };
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, context);
const schema = context.collections.teams.schema;

test('team identity colors survive content collection parsing', () => {
  for (const [id, color] of [['anv', '#FF5A1F'], ['howl-tvj', '#009DFF'], ['familia-nova', '#BFC5CC']]) {
    const team = JSON.parse(fs.readFileSync(new URL(`../src/data/teams/${id}.json`, import.meta.url)));
    assert.equal(schema.parse(team).color, color, id);
  }
});

test('team color is optional and rejects malformed CSS values', () => {
  const team = { name: 'Test', tag: 'T', region: 'ID' };
  assert.equal(schema.parse(team).color, undefined);
  assert.equal(schema.parse({ ...team, color: '#aBc123' }).color, '#aBc123');
  for (const color of ['', 'orange', '#12345', '#GGGGGG', '#FF5A1F; background: red']) {
    assert.equal(schema.safeParse({ ...team, color }).success, false, color);
  }
});
