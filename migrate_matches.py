import json
import os
import re

MATCH_DIR = "src/data/matches"

def slugify(value):
    return re.sub(r'[^a-z0-9]+', '-', value.strip().lower()).strip('-')

for filename in sorted(os.listdir(MATCH_DIR)):
    if not filename.endswith(".json"):
        continue

    # Skip m01 because we've already migrated it
    if filename == "m01.json":
        continue

    path = os.path.join(MATCH_DIR, filename)

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Tournament
    data["tournamentId"] = "clash-for-glory-s1"

    # Teams
    if "team1" in data:
        data["team1Id"] = data["team1"]

    if "team2" in data:
        data["team2Id"] = data["team2"]

    # Winner
    if data.get("winner"):
        data["winnerId"] = data["winner"]

    # Maps
    for round_detail in data.get("roundDetails", []):
        if round_detail.get("map"):
            round_detail["mapId"] = slugify(round_detail["map"])

    with open(path, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=2,
            ensure_ascii=False
        )

        f.write("\n")

    print(f"Updated {filename}")

print("Done.")