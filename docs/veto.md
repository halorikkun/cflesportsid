# Tournament map veto — Step 11

Each tournament stage can define `veto` with canonical `mapPoolIds`, ordered `steps` (team A/B and ban/pick), `actionSeconds`, `reserveSeconds`, and `finalMap: "random"`. Team A is match team 1; team B is match team 2. Map display names come from the maps collection. An omitted configuration disables veto for that stage.

The existing Clash for Glory configuration is preserved: ten maps, A ban/B ban/A ban/B ban/A pick/B pick/A ban/B ban, followed by a wheel selection from the remaining maps. Each action has 20 seconds and each team has its own 90-second reserve, retained across that team’s actions. All three selected maps are played.

Build validation rejects missing or duplicate map IDs, a pool too small for the sequence, anything other than one pick per team, and unsupported series formats. This implementation supports fixed three-map stages. Global map activity does not rewrite a historical tournament's explicit pool.

Match pages link to `/veto?match=m01` using the match ID. Matches without known participants or configured veto settings cannot start a session. Only upcoming matches are available. Scrim mode accepts two custom team names using the pool and rules in `src/data/veto/scrim.json`. Veto runs locally and Copy Result copies readable text; it does not save official match records or change statistics.

Switching or clearing the selected match cancels timers and pending wheel callbacks and resets the wheel. Tests cover configuration validation and switching matches during a spin.

When a pick expires after available reserve time is exhausted, the tool randomly selects an available map for that team and proceeds. Expired bans remain skipped. Automatic picks are recorded in the copied result.
