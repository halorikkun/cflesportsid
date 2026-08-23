#!/bin/bash

mkdir -p src/data/matches

cat > src/data/matches/m01.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Top 16","date":"2026-08-22","team1":"team-69","team2":"endevour-tvj","score1":3,"score2":0,"winner":"team-69","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m02.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Top 16","date":"2026-08-22","team1":"g2c-prmx","team2":"anv","score1":3,"score2":0,"winner":"g2c-prmx","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m03.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Top 16","date":"2026-08-22","team1":"familia-nova","team2":"brotherhood","score1":3,"score2":0,"winner":"familia-nova","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m04.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Top 16","date":"2026-08-22","team1":"unclex-sederhana","team2":"scissor-rex","score1":0,"score2":3,"winner":"scissor-rex","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m05.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Top 16","date":"2026-08-22","team1":"tvj-ghoib","team2":"howl-tvj","score1":1,"score2":2,"winner":"howl-tvj","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m06.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Quarter Final","date":"2026-08-22","team1":"cha-tra-mue","team2":"team-69","score1":3,"score2":0,"winner":"cha-tra-mue","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m07.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Quarter Final","date":"2026-08-22","team1":"g2c-prmx","team2":"familia-nova","score1":0,"score2":3,"winner":"familia-nova","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m08.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Quarter Final","date":"2026-08-22","team1":"glory-solidarity","team2":"scissor-rex","score1":0,"score2":3,"winner":"scissor-rex","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m09.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Quarter Final","date":"2026-08-22","team1":"solidarity","team2":"howl-tvj","score1":1,"score2":2,"winner":"howl-tvj","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m10.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Semi Final","date":"2026-08-23","team1":"cha-tra-mue","team2":"familia-nova","score1":3,"score2":0,"winner":"cha-tra-mue","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m11.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Semi Final","date":"2026-08-23","team1":"scissor-rex","team2":"howl-tvj","score1":3,"score2":0,"winner":"scissor-rex","status":"completed","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m12.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Bronze Match","date":"2026-08-23","team1":"familia-nova","team2":"howl-tvj","score1":0,"score2":0,"status":"upcoming","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

cat > src/data/matches/m13.json << 'EOF'
{"tournament":"Clash for Glory: Road to All-Star S1","round":"Final","date":"2026-08-23","team1":"cha-tra-mue","team2":"scissor-rex","score1":0,"score2":0,"status":"upcoming","stats1":{"kills":0,"deaths":0,"assists":0},"stats2":{"kills":0,"deaths":0,"assists":0}}
EOF

echo "Created 13 match files in src/data/matches/"
ls src/data/matches/ | wc -l
