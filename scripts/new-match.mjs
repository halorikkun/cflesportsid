import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { root, checkData } from './data-tools.mjs';
if (process.argv.includes('--help')) {
  console.log('npm run data:new-match\nAnswer the prompts to create an upcoming match draft in drafts/matches. Live match files are never overwritten.');
  process.exit(0);
}
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
async function ask(label, valid) {
  while (true) {
    const answer = (await rl.question(`${label}: `)).trim();
    if (valid(answer)) return answer;
    console.log('Please enter one of the listed IDs or a valid value.');
  }
}
try {
  const { errors, data } = checkData();
  if (errors.length) throw new Error('Fix data errors with npm run data:check before creating a match.');
  const id = await ask('New match ID (for example m14)', s => /^m\d+$/.test(s) && !data.matches.has(s) && !fs.existsSync(path.join(root, 'drafts/matches', `${s}.json`)));
  console.log('Tournaments:', [...data.tournaments.keys()].join(', '));
  const tournamentId = await ask('Tournament ID', s => data.tournaments.has(s));
  const tournament = data.tournaments.get(tournamentId).data;
  if (tournament.status === 'completed') console.log('This tournament is completed. A new upcoming match cannot be added to it without reviewing its status and bracket.');
  console.log('Stages:', tournament.stages.map(s => s.id).join(', '));
  const stageId = await ask('Stage ID', s => tournament.stages.some(stage => stage.id === s));
  const stage = tournament.stages.find(s => s.id === stageId);
  console.log('Rounds:', stage.rounds.map(r => r.id).join(', '));
  const roundId = await ask('Round ID', s => stage.rounds.some(r => r.id === s));
  const mainRounds = stage.rounds.filter(r => r.placement !== 3).sort((a, b) => a.order - b.order);
  const round = stage.rounds.find(r => r.id === roundId);
  const capacity = round.placement === 3 ? 1 : stage.bracketSize / 2 ** (mainRounds.findIndex(r => r.id === roundId) + 1);
  const occupied = new Set([...data.matches.values()].filter(m => m.data.tournamentId === tournamentId && m.data.stageId === stageId && m.data.roundId === roundId).map(m => m.data.bracketSlot));
  stage.byes.filter(b => b.roundId === roundId).forEach(b => occupied.add(b.slot));
  const slots = Array.from({ length: capacity }, (_, i) => i + 1).filter(n => !occupied.has(n));
  if (!slots.length) throw new Error('This round has no empty bracket slots. Create/configure the next tournament first; existing matches were not changed.');
  console.log('Available slots:', slots.join(', '));
  const bracketSlot = Number(await ask('Bracket slot', s => slots.includes(Number(s))));
  const date = await ask('Match date (YYYY-MM-DD)', s => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s);
  const draft = { tournamentId, stageId, roundId, bracketSlot, date, status: 'upcoming', score1: 0, score2: 0, roundDetails: [], playerStats: [] };
  if (roundId === mainRounds[0].id) {
    console.log('Registered teams:', tournament.teams.join(', '));
    draft.team1Id = await ask('Team 1 ID', s => tournament.teams.includes(s));
    draft.team2Id = await ask('Team 2 ID', s => tournament.teams.includes(s) && s !== draft.team1Id);
  } else {
    for (const side of [1, 2]) {
      const type = await ask(`Team ${side} source type (winner, loser, bye)`, s => ['winner', 'loser', 'bye'].includes(s));
      if (type === 'bye') {
        console.log('Bye IDs:', stage.byes.map(b => b.id).join(', '));
        draft[`team${side}Source`] = { type, byeId: await ask('Bye ID', s => stage.byes.some(b => b.id === s)) };
      } else {
        const candidates = [...data.matches.values()].filter(m => m.data.tournamentId === tournamentId && m.data.stageId === stageId);
        console.log('Match IDs:', candidates.map(m => m.id).join(', '));
        draft[`team${side}Source`] = { type, matchId: await ask('Source match ID', s => candidates.some(m => m.id === s)) };
      }
    }
  }
  const destination = path.join(root, 'drafts/matches', `${id}.json`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(draft, null, 2) + '\n', { flag: 'wx' });
  console.log(`Draft created: ${destination}\nReview it before copying into src/data/matches, then run npm run data:check. No results or player statistics were invented.`);
} catch (e) { console.error(e.message); process.exitCode = 1; }
finally { rl.close(); }
