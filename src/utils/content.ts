import { getCollection } from 'astro:content';

export async function getTeamMap() {
  const teams = await getCollection('teams');

  return new Map(
    teams.map((team) => [team.id, team])
  );
}

export async function getPlayerMap() {
  const players = await getCollection('players');

  return new Map(
    players.map((player) => [player.id, player])
  );
}

export async function getTournamentMap() {
  const tournaments = await getCollection('tournaments');

  return new Map(
    tournaments.map((tournament) => [tournament.id, tournament])
  );
}

export async function getMapMap() {
  const maps = await getCollection('maps');

  return new Map(
    maps.map((map) => [map.id, map])
  );
}

export function getMatchTournamentId(match: any) {
  return match.data.tournamentId ?? null;
}

export function getMatchTeam1Id(match: any) {
  return match.data.team1Id ?? match.data.team1 ?? null;
}

export function getMatchTeam2Id(match: any) {
  return match.data.team2Id ?? match.data.team2 ?? null;
}

export function getMatchWinnerId(match: any) {
  return match.data.winnerId ?? match.data.winner ?? null;
}

export function getRoundMapId(round: any) {
  return round.mapId ?? slugify(round.map ?? '');
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}