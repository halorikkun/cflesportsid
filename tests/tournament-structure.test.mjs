import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/utils/tournament.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const context = { exports: {} };
vm.runInNewContext(code, context);
const { validateTournament, resolveSourceTeam, getParticipantLabel, getMatchRound, getSourceNode } = context.exports;
const read = path => JSON.parse(fs.readFileSync(new URL('../src/data/' + path, import.meta.url)));
const tournament = { id: 'clash-for-glory-s1', data: read('tournaments/clash-for-glory-s1.json') };
const matches = fs.readdirSync(new URL('../src/data/matches/', import.meta.url)).filter(f => f.endsWith('.json'))
  .map(f => ({ id: f.slice(0, -5), data: read('matches/' + f) }));
const teamIds = new Set(tournament.data.teams);
const match = (items, id) => items.find(m => m.id === id);
const check = items => validateTournament(tournament, items, teamIds);

test('existing tournament validates with 13 matches and three explicit byes', () => {
  assert.equal(matches.length, 13);
  assert.equal(tournament.data.stages[0].byes.length, 3);
  assert.doesNotThrow(() => check(matches));
  assert.equal(getSourceNode(match(matches, 'm06'), 1), 'playoffs:bye-1');
  assert.equal(resolveSourceTeam(match(matches, 'm12'), 1, tournament, matches), 'familia-nova');
  assert.equal(resolveSourceTeam(match(matches, 'm12'), 2, tournament, matches), 'howl-tvj');
});

test('all four fixed-three-map scores are valid for an opening match', () => {
  for (const [score1, score2] of [[3, 0], [2, 1], [1, 2], [0, 3]]) {
    const m = structuredClone(match(matches, 'm01'));
    Object.assign(m.data, { score1, score2, winnerId: score1 > score2 ? m.data.team1Id : m.data.team2Id });
    const inProgress = structuredClone(tournament); inProgress.data.status = 'ongoing';
    assert.doesNotThrow(() => validateTournament(inProgress, [m], teamIds));
  }
});

test('unfinished bracket resolves completed sources and labels undecided ones', () => {
  const fixtures = structuredClone(matches);
  const upcoming = structuredClone(tournament); upcoming.data.status = 'upcoming';
  for (const m of fixtures) {
    m.data.status = 'upcoming'; m.data.score1 = 0; m.data.score2 = 0;
    delete m.data.winnerId; m.data.roundDetails = []; m.data.playerStats = [];
    if (m.data.team1Source) delete m.data.team1Id;
    if (m.data.team2Source) delete m.data.team2Id;
  }
  assert.doesNotThrow(() => validateTournament(upcoming, fixtures, teamIds));
  const qf = match(fixtures, 'm06');
  assert.equal(resolveSourceTeam(qf, 1, tournament, fixtures), 'cha-tra-mue');
  assert.equal(resolveSourceTeam(qf, 2, tournament, fixtures), undefined);
  assert.equal(getParticipantLabel(qf, 2), 'Winner of m01');
  Object.assign(match(fixtures, 'm01'), structuredClone(match(matches, 'm01')));
  assert.equal(resolveSourceTeam(qf, 2, tournament, fixtures), 'team-69');
  assert.doesNotThrow(() => validateTournament(upcoming, fixtures, teamIds));
});

for (const [name, mutate, message] of [
  ['missing source', f => { match(f, 'm06').data.team2Source.matchId = 'missing'; }, /invalid source match/],
  ['circular source', f => { match(f, 'm06').data.team2Source.matchId = 'm06'; }, /no cycles/],
  ['duplicate slot', f => { match(f, 'm02').data.bracketSlot = 1; }, /duplicate slot/],
  ['wrong participant', f => { match(f, 'm06').data.team2Id = 'anv'; }, /disagrees with its source/],
  ['wrong winner', f => { match(f, 'm01').data.winnerId = 'endeavours-tvj'; }, /winner disagrees/],
  ['incomplete score', f => { match(f, 'm01').data.score1 = 2; }, /scores must total 3/],
  ['missing map', f => { match(f, 'm01').data.roundDetails.pop(); }, /record all 3 maps/],
  ['winner sent to bronze', f => { match(f, 'm12').data.team1Source.type = 'winner'; }, /bronze needs semifinal losers|source used more than once/],
]) {
  test(`rejects ${name}`, () => {
    const fixtures = structuredClone(matches); mutate(fixtures);
    assert.throws(() => check(fixtures), message);
  });
}

test('round display names can change without breaking placement identification', () => {
  const renamed = structuredClone(tournament);
  renamed.data.stages[0].rounds.find(r => r.id === 'final').name = 'Grand Final';
  assert.equal(getMatchRound(match(matches, 'm13'), renamed).placement, 1);
  assert.doesNotThrow(() => validateTournament(renamed, matches, teamIds));
});


test('completed tournaments cannot silently omit the final', () => {
  assert.throws(() => check(matches.filter(m => m.id !== 'm13')), /empty slot/);
});
