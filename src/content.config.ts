import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teams = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/teams' }),
  schema: z.object({
    name: z.string(),
    tag: z.string(),
    logo: z.string().optional(),
    region: z.string(),
    founded: z.string().optional(),
    description: z.string().optional(),
    placementPoints: z.number().default(0),
    players: z.array(z.string()).default([]),
    stats: z.object({
      wins: z.number().default(0),
      losses: z.number().default(0),
      draws: z.number().default(0),
      matchesPlayed: z.number().default(0),
    }).default({ wins: 0, losses: 0, draws: 0, matchesPlayed: 0 }),
  }),
});

const players = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/players' }),
  schema: z.object({
    name: z.string(),
    ign: z.string(),
    uid: z.string().nullable().optional(),
    team: z.string().optional(),
    role: z.string().default('Player'),
    avatar: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    socials: z.object({
      discord: z.string().optional(),
      twitter: z.string().optional(),
      youtube: z.string().optional(),
      twitch: z.string().optional(),
    }).default({}),
    stats: z.object({
      kills: z.number().default(0),
      deaths: z.number().default(0),
      assists: z.number().default(0),
      matchesPlayed: z.number().default(0),
      mvpCount: z.number().default(0),
    }).default({ kills: 0, deaths: 0, assists: 0, matchesPlayed: 0, mvpCount: 0 }),
  }),
});

const matches = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/matches' }),
  schema: z.object({
    tournament: z.string(),
    round: z.string(),
    date: z.string(),
    team1: z.string(),
    team2: z.string(),
    score1: z.number().default(0),
    score2: z.number().default(0),
    winner: z.string().optional(),
    status: z.enum(['upcoming', 'live', 'completed']).default('upcoming'),
    bracketSlot: z.number().optional(),
    map: z.string().optional(),
    maps: z.array(z.string()).default([]),
    roundDetails: z.array(z.object({
      round_number: z.number(),
      map: z.string().default(''),
      mvp: z.string().nullable().optional(),
    })).default([]),
    duration: z.string().optional(),
    mvp: z.string().optional(),
    stats1: z.object({
      kills: z.number().default(0),
      deaths: z.number().default(0),
      assists: z.number().default(0),
    }).default({ kills: 0, deaths: 0, assists: 0 }),
    stats2: z.object({
      kills: z.number().default(0),
      deaths: z.number().default(0),
      assists: z.number().default(0),
    }).default({ kills: 0, deaths: 0, assists: 0 }),
    playerStats: z.array(z.object({
      uid: z.string().nullable().optional(),
      ign: z.string().optional(),
      rounds: z.array(z.object({
        kills: z.number().default(0),
        deaths: z.number().default(0),
        assists: z.number().default(0),
      })).default([]),
    })).default([]),
  }),
});

export const collections = { teams, players, matches };
