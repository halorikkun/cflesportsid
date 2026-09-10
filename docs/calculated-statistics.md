# Calculated statistics — Step 10

`src/utils/statistics.ts` calculates player, historical team, and map statistics from completed match records. Upcoming/live matches do not contribute to career totals. Player/team JSON profile totals are retained for reference but are no longer used by the career statistics pages.

## Definitions

- Kills/deaths/assists: sum recorded player-round values.
- Player matches: count each completed match with player participation once, regardless of the number of maps played.
- Team matches/wins/losses: use the match participants and winner. Byes are not played matches.
- Historical team kills: use `playerStats[].teamId`, never the player's current roster.
- K/D: kills divided by `max(deaths, 1)`.
- KDA: (kills + assists) divided by `max(deaths, 1)`.
- MVP counts: recorded `roundDetails[].mvp` awards, not the calculated best KDA performer. The match page labels the latter “Top Match KDA”.
- Placement points retain the current rule: champion 10, runner-up 6, bronze winner 4, fourth place 2, accumulated across tournaments.

Current completed-match totals: **2,726 kills, 2,731 deaths, 1,185 assists, 13 matches, 39 map games, 39 round MVP awards**. Five G2C PRMx profiles previously had lower manual totals; their pages now reflect match data. Kills and deaths are not forced to balance or adjusted to invent missing data.

## Map attribution

Each player-round object can include `round_number`, matching `roundDetails[].round_number`. All complete three-map arrays were numbered in their existing map order. A shorter array is not assumed to start at map 1.

When the map number is unknown:

- The recorded values still count in player and historical team totals.
- They do not count toward a particular map's combat totals.
- The match page leaves map cells unassigned and keeps the total.
- The map overview reports the unassigned coverage.

All 18 formerly unassigned entries were confirmed on 2026-09-10; see `docs/missing-map-numbers.md` for the completed mapping record. There are now zero unassigned player rounds. Do not assign a map number from a player's current roster, MVP identity, or array position alone.

## Map results and win rates

`roundDetails[].winnerId` is optional and must be a participant in that match. Explicit winners must not contradict the aggregate match score. Because every map is played, a completed 3–0 or 0–3 result establishes every map winner without storing duplicate fields.

A 2–1 or 1–2 result cannot identify which maps each team won. Those map outcomes remain unknown until entered explicitly. Team map win rates use **known map results only**, with a dash when there are none. All 39 map outcomes are now known. In m05, TVJ Ghoib won map 2; Howl TVJ won maps 1 and 3. Map 1 was awarded to Howl TVJ following TVJ Ghoib’s disqualification despite TVJ Ghoib winning on score; `resultNote` preserves this explanation on the match page. Recorded combat statistics are retained. In m09, Solidarity won map 1 and Howl TVJ won maps 2 and 3.

## Pages and checks

- `/maps`: appearances, distinct matches, assigned combat totals, MVP awards, outcome coverage.
- `/maps/{map-id}`: per-player and historical team breakdowns, known-result win rates, and match links.
- Homepage, player list/detail, and team list/detail: calculated career totals.

Run:

```bash
npm test
npm run build
```

Tests cover transfers, repeated map appearances, correct map assignment for substitutes, unknown attribution, zero deaths, excluded unfinished matches, and reconciliation of real player/team/map totals.
