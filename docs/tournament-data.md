# Tournament and bracket data — Step 9

The current implementation supports single-elimination stages with optional bronze matches and fixed odd-numbered map series. Clash for Glory S1 uses **all three maps**, including when one team wins the first two. It is not a best-of-three series.

## Tournament definitions

Edit `src/data/tournaments/clash-for-glory-s1.json` in Sublime Text.

- `teams` lists registered canonical team IDs.
- `stages` defines stage IDs, round IDs and display names, bracket size, series format, and explicit byes.
- `series.type` is `fixed-maps`; `series.mapCount` is `3` for this event.
- `rounds[].order` controls chronological sorting. Bronze is before the final; the bracket displays bronze below the final.
- `placement: 1` identifies the championship round. `placement: 3` identifies bronze. Labels may be renamed without breaking placement calculations.
- A bye has its own ID, team ID, round ID, and slot. It is not a match, adds no win/stat entry, and does not count toward matches played.

## Match definitions

Existing match IDs and URLs remain m01–m13. IDs are filenames and must remain unique across the site; a future tournament must use unused match IDs rather than creating a second m01.

Every match specifies `tournamentId`, `stageId`, `roundId`, and `bracketSlot`. Do not add the old `round` display-name field.

An opening match records its two team IDs directly. A later match also records its participant sources. For example, m06 has:

```json
{
  "team1Source": { "type": "bye", "byeId": "bye-1" },
  "team2Source": { "type": "winner", "matchId": "m01" }
}
```

This is a field example, not a replacement for the complete m06 file. Keep its scores, map details, date, team IDs, and player stats.

Source types:

- `winner`: winner of the named match.
- `loser`: loser of the named semifinal, for bronze.
- `bye`: the explicitly defined bye in the same stage.

Record `team1Id` and `team2Id` when the participants are confirmed. These IDs must agree with the results of their sources. For an undecided participant, omit its team ID and keep the source. The bracket displays a source label until the result is available, and then resolves the team. Do not invent a team ID such as `tbd`.

## Completing a match

1. Confirm both participants and their source results.
2. Set `status` to `completed`.
3. Record one of `3–0`, `2–1`, `1–2`, or `0–3` in `score1` and `score2`.
4. Set `winnerId` to the team with the higher score.
5. Record all three `roundDetails` entries, numbered 1, 2, and 3, with canonical map IDs.
6. Preserve each player's match-time `teamId`; do not change it after a transfer. Individual player entries may cover fewer maps if they were substituted.

## Verification

Run these from the project Terminal:

```bash
node --test tests/*.test.mjs
npm run build
```

The build checks registered teams, stage/round IDs, duplicate slots and sources, advancement order, source-result agreement, completed scores, and three recorded maps. A completed tournament must fill all defined bracket slots with matches or explicit byes. Missing source matches, circular connections, and invalid bronze paths stop the build with a message identifying the tournament and match.

Preview `/tournament/clash-for-glory-s1` to check the bracket. Solid connectors show winner/bye advancement; dashed connectors show semifinal losers going to bronze. `/tournament/1` remains a compatibility route.

This step does not implement group stages, double elimination, cross-stage qualification, tournament-specific veto rules, or automated result entry.
