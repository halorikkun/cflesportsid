# Adding and checking data

Run commands in the project folder from Terminal.

## Check existing data

```bash
npm run data:check
```

Errors identify the file, field, and problem. Field indexes start at zero: `playerStats.0.rounds.1` means the first player's second recorded entry. Errors return a failing exit code. Warnings identify incomplete statistical coverage without inventing values. This command reads data only.

Checks reuse the site's content schemas, tournament bracket validator, and veto validator. They also check canonical references, player UID filenames, real match dates, duplicate map numbers, and missing player/map attribution. Historical teams are checked against match participants, not current rosters. Tournament validation reports the first bracket error per tournament; rerun after fixing it.

## Create a match draft

```bash
npm run data:new-match
```

Follow the prompts for match ID, tournament, stage, round, free bracket slot, date, and participants or advancement sources. The file is saved under `drafts/matches`, outside the site's content collection. Existing files are never overwritten. Open the printed file path in Sublime Text and review it.

The current Clash for Glory bracket is full. To add the next event, create its tournament JSON and register its teams and stages first. The generator will explain when a selected round has no free slot.

Copy a reviewed draft into `src/data/matches`, then run `npm run data:check`. Fix any source or bracket errors before publishing. An upcoming draft deliberately has no winner, played maps, or player stats.

## Record a completed result

Set status to `completed`, enter both scores and the winner ID, and add all three played maps to `roundDetails`. For a split score, record each map's official winner. Use `resultNote` for an administrative result such as a disqualification. Preserve the recorded combat stats.

Each round detail has this shape (replace the example IDs with the actual IDs):

```json
{
  "round_number": 1,
  "mapId": "desert",
  "winnerId": "howl-tvj"
}
```

Add a player's stats using their UID and team at the time of the match. This example describes participation on map 2 only; replace the numbers with recorded results:

```json
{
  "uid": "1756514782",
  "teamId": "howl-tvj",
  "rounds": [
    {
      "round_number": 2,
      "kills": 8,
      "deaths": 6,
      "assists": 3
    }
  ]
}
```

Do not insert zero-stat rounds for maps a substitute did not play. Do not guess missing map numbers. An optional round `mvp` uses the player's UID.

Before committing:

```bash
npm run data:check
npm test
npm run build
```

Review the affected pages locally before pushing. These tools do not commit or publish changes.
