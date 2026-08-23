# CFL Tournament Hub (Astro)

A Crossfire tournament hub built with [Astro](https://astro.build) and deployed on Cloudflare Pages.

## Features 

- **Teams** — Browse all teams with stats, rosters, and match history
- **Players** — Player profiles with KDA stats, K/D ratio, MVP awards, and socials
- **Matches** — Match results with scores, MVPs, and team KDA breakdowns
- **Type-safe data** — Content Collections with Zod schemas for all data
- **Zero JS by default** — Pure static HTML output, fastest possible load times
- **No request limits** — Static assets are free and unlimited on Cloudflare

## Data Structure

All data is stored as JSON files in `src/data/`:

```
src/data/
  teams/       — One JSON file per team
  players/     — One JSON file per player
  matches/     — One JSON file per match
```

### Adding a new team

Create `src/data/teams/my-team.json`:

```json
{
  "name": "My Team",
  "tag": "MYT",
  "region": "SEA",
  "players": ["player-id-1", "player-id-2"],
  "stats": { "wins": 0, "losses": 0, "draws": 0, "matchesPlayed": 0 }
}
```

### Adding a new player

Create `src/data/players/my-player.json`:

```json
{
  "name": "Real Name",
  "ign": "myPlayer",
  "team": "my-team",
  "role": "Rifler",
  "stats": { "kills": 0, "deaths": 0, "assists": 0, "matchesPlayed": 0, "mvpCount": 0 }
}
```

### Adding a new match

Create `src/data/matches/m04.json`:

```json
{
  "tournament": "CFL Monthly #2",
  "round": "Group Stage",
  "date": "2026-09-20",
  "team1": "black-ops",
  "team2": "crimson-wolves",
  "score1": 0,
  "score2": 0,
  "status": "upcoming"
}
```

## Development

```bash
npm install
npm run dev      # Local dev server at http://localhost:4321
npm run build     # Build to dist/
npm run preview   # Preview the built site
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create)
3. Connect your Git repository
4. Build settings (auto-detected):
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
5. Deploy — every push to `main` triggers a new build

## Why Astro?

- **Zero JS by default** — ships pure HTML, smallest possible output
- **Type-safe data** — Content Collections validate your data at build time
- **Automatic pages** — each player and team gets its own page automatically
- **No request limits** — static assets are free and unlimited on Cloudflare
- **Scales well** — handles hundreds of teams, players, and matches with no performance impact
