import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root, checkData } from '../scripts/data-tools.mjs';
test('current data passes the shared schema and reference checker', () => {
  const result = checkData();
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.warnings, []);
});
test('data checker identifies broken references, malformed JSON and missing map attribution with paths', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cfl-data-'));
  try {
    fs.cpSync(path.join(root, 'src/data'), temp, { recursive: true });
    const file = path.join(temp, 'matches/m01.json');
    const match = JSON.parse(fs.readFileSync(file));
    match.roundDetails[0].mapId = 'unknown-map';
    delete match.playerStats[0].rounds[0].round_number;
    fs.writeFileSync(file, JSON.stringify(match));
    fs.writeFileSync(path.join(temp, 'players/broken.json'), '{');
    const result = checkData(temp);
    assert.ok(result.errors.some(e => e.includes('matches/m01.json → roundDetails.0.mapId')));
    assert.ok(result.errors.some(e => e.includes('players/broken.json')));
    assert.ok(result.warnings.some(e => e.includes('playerStats.0.rounds.0.round_number')));
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
