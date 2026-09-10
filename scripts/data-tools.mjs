import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';
export const root = path.resolve(import.meta.dirname, '..');
function loadTS(file, imports) {
  const context = { exports: {}, require(name) {
    if (!(name in imports)) throw new Error(`Unsupported import: ${name}`);
    return imports[name];
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, context);
  return context.exports;
}
const { collections } = loadTS('src/content.config.ts', { 'astro:content': { z, defineCollection: value => value }, 'astro/loaders': { glob: value => value } });
const { validateTournament } = loadTS('src/utils/tournament.ts', {});
const { resolveVeto } = loadTS('src/utils/veto.ts', {});
export function checkData(dataRoot = path.join(root, 'src/data')) {
  const errors = [], warnings = [], data = {};
  const issue = (list, entry, field, message) => list.push(`${entry.file}${field ? ` → ${field}` : ''}: ${message}`);
  for (const [name, collection] of Object.entries(collections)) {
    data[name] = new Map();
    for (const filename of fs.readdirSync(path.join(dataRoot, name)).filter(f => f.endsWith('.json')).sort()) {
      const entry = { id: filename.slice(0, -5), file: `${name}/${filename}` };
      try {
        const parsed = collection.schema.safeParse(JSON.parse(fs.readFileSync(path.join(dataRoot, entry.file), 'utf8')));
        if (!parsed.success) {
          for (const e of parsed.error.issues) issue(errors, entry, e.path.join('.'), e.message);
        } else data[name].set(entry.id, { ...entry, data: parsed.data });
      } catch (e) { issue(errors, entry, '', e.message); }
    }
  }
  const ref = (entry, field, value, collection) => {
    if (value && !data[collection].has(value)) issue(errors, entry, field, `Unknown ${collection} ID "${value}". Use its JSON filename without .json.`);
  };
  for (const p of data.players.values()) {
    if (p.data.uid !== p.id) issue(errors, p, 'uid', 'Must equal the player JSON filename.');
    ref(p, 'team', p.data.team, 'teams');
  }
  for (const t of data.teams.values()) t.data.players.forEach((uid, i) => ref(t, `players.${i}`, uid, 'players'));
  for (const m of data.matches.values()) {
    ref(m, 'tournamentId', m.data.tournamentId, 'tournaments');
    for (const field of ['team1Id', 'team2Id', 'winnerId']) ref(m, field, m.data[field], 'teams');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(m.data.date) || !Number.isFinite(Date.parse(m.data.date)) || new Date(m.data.date).toISOString().slice(0, 10) !== m.data.date) issue(errors, m, 'date', 'Use a real date in YYYY-MM-DD format.');
    const numbers = new Set();
    for (const [i, r] of m.data.roundDetails.entries()) {
      ref(m, `roundDetails.${i}.mapId`, r.mapId, 'maps');
      ref(m, `roundDetails.${i}.mvp`, r.mvp, 'players');
      if (!Number.isInteger(r.round_number) || r.round_number < 1 || numbers.has(r.round_number)) issue(errors, m, `roundDetails.${i}.round_number`, 'Use a unique positive map number.');
      numbers.add(r.round_number);
      if (r.mvp && !m.data.playerStats.some(p => p.uid === r.mvp && p.rounds.some(pr => pr.round_number === r.round_number))) issue(warnings, m, `roundDetails.${i}.mvp`, 'MVP has no recorded stats on this map.');
      if (m.data.status === 'completed' && m.data.score1 > 0 && m.data.score2 > 0 && !r.winnerId) issue(warnings, m, `roundDetails.${i}.winnerId`, 'Map winner is unknown for this split result.');
    }
    m.data.playerStats.forEach((p, i) => {
      ref(m, `playerStats.${i}.uid`, p.uid, 'players');
      if (!p.uid || !p.teamId) issue(warnings, m, `playerStats.${i}`, 'Player or historical team attribution is unknown.');
      p.rounds.forEach((r, j) => { if (r.round_number === undefined) issue(warnings, m, `playerStats.${i}.rounds.${j}.round_number`, 'Map attribution is missing; do not guess from array order.'); });
    });
  }
  for (const t of data.tournaments.values()) {
    ref(t, 'winner', t.data.winner, 'teams');
    try { validateTournament(t, [...data.matches.values()], new Set(data.teams.keys())); }
    catch (e) { issue(errors, t, 'stages', e.message); }
    t.data.stages.forEach((stage, i) => {
      try { resolveVeto(stage, data.maps); } catch (e) { issue(errors, t, `stages.${i}.veto`, e.message); }
    });
  }
  return { errors, warnings, data };
}
