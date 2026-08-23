#!/bin/bash

mkdir -p src/data/teams

cat > src/data/teams/cha-tra-mue.json << 'EOF'
{"name":"ChaTraMue","tag":"CTM","region":"SEA","placementPoints":0,"players":["1120432314","1345266890","1741846753","1962941896","1099707998"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/solidarity.json << 'EOF'
{"name":"Solidarity","tag":"S","region":"SEA","placementPoints":0,"players":["1500132162","1465434411","1168546633","1240400080","1404929791","1761727327","1085527004"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/glory-solidarity.json << 'EOF'
{"name":"Glory Solidarity","tag":"GS","region":"SEA","placementPoints":0,"players":["1138196067","1469516662","1058015660","1677933945","1223657312","1665270296","1132797822"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/howl-tvj.json << 'EOF'
{"name":"Howl TVJ","tag":"HOWL","region":"SEA","placementPoints":0,"players":["1225759000","1096392869","1756514782","1422279951","1083796629","1090087169","1968963523"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/unclex-sederhana.json << 'EOF'
{"name":"UnclexSederhana","tag":"USD","region":"SEA","placementPoints":0,"players":["1832910230","1796322136","1631757441","1637977616","1826951529","1057307840","1103150751"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/brotherhood.json << 'EOF'
{"name":"Brotherhood","tag":"BRO","region":"SEA","placementPoints":0,"players":["1267912229","1611824237","1671462718","1652164082","1574679867","1698375202","1609342928"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/familia-nova.json << 'EOF'
{"name":"Familia Nova","tag":"FNOV","region":"SEA","placementPoints":0,"players":["1203260549","1347741365","1240413385","1871603006","1730158436","1314377026","1896132194"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/scissor-rex.json << 'EOF'
{"name":"Scissor Rex","tag":"SRX","region":"SEA","placementPoints":0,"players":["1687813060","1741464352","1991717590","1865383788","1185225620","1442396500","1786643099"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/team-69.json << 'EOF'
{"name":"Team 69","tag":"69","region":"SEA","placementPoints":0,"players":["1161370373","1656689899","1078362342","1074600957","1192380567","1285860853","1613117529"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/tvj-ghoib.json << 'EOF'
{"name":"TVJ Ghoib","tag":"TVJ","region":"SEA","placementPoints":0,"players":["1683183634","1885517837","1663336378","1604459118","1933423444","1510845345","1080417050"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/endevour-tvj.json << 'EOF'
{"name":"Endevour TVJ","tag":"ENV","region":"SEA","placementPoints":0,"players":["1370124271","1105151021","1895789462","1047666366","1246129555","1213356890"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/anv.json << 'EOF'
{"name":"ANV","tag":"ANV","region":"SEA","placementPoints":0,"players":["1725554211","1741676947","1677388751","1121853330","1909691954"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

cat > src/data/teams/g2c-prmx.json << 'EOF'
{"name":"G2C PRMX","tag":"PRMX","region":"SEA","placementPoints":0,"players":["1710216868","1087933161","1654611590","1310319299","1551933778","1080212105"],"stats":{"wins":0,"losses":0,"draws":0,"matchesPlayed":0}}
EOF

echo "Created 13 team files in src/data/teams/"
ls -la src/data/teams/
