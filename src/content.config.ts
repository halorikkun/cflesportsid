import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teams = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/teams' }),
  schema: z.object({
    name: z.string(),
    tag: z.string(),
    placement_points: z.number().default(0),
    members: z.array(z.object({
      uid: z.string(),
      ign: z.string(),
    })).default([]),
  }),
});

const players = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/players' }),
  schema: z.object({
    ign: z.string(),
    name: z.string().optional(),
    uid: z.string(),
    team: z.string().optional(),
    country: z.string().optional(),
    bio: z.string().optional(),
    stats: z.object({
      kills: z.number().default(0),
      deaths: z.number().default(0),
      assists: z.number().default(0),
    }),
    socials: z.object({
      discord: z.string().optional(),
      youtube: z.string().optional(),
      twitch: z.string().optional(),
    }).partial().default({}),
  }),
});

const matches = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/matches' }),
  schema: z.object({
    tournament: z.string(),
    round: z.string(),
    bracketSlot: z.number().optional(),
    date: z.string(),
    team1: z.string(),
    team2: z.string(),
    score1: z.number().default(0),
    score2: z.number().default(0),
    winner: z.string().optional(),
    status: z.string().default('upcoming'),
    map: z.string().optional(),
    maps: z.array(z.string()).default([]),
    roundDetails: z.array(z.object({
      round_number: z.number(),
      map: z.string().default(''),
      mvp: z.string().nullable().optional(),
    })).default([]),
    duration: z.string().optional(),
    mvp: z.string().optional(),
    playerStats: z.array(z.object({
      uid: z.string(),
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
