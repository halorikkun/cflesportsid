#!/bin/bash

set -e

SRC="public"
OUT="public-optimized"

mkdir -p "$OUT"

find "$SRC" -type f \( \
  -iname "*.png" -o \
  -iname "*.jpg" -o \
  -iname "*.jpeg" \
\) | while read -r file; do

  relative="${file#$SRC/}"
  dir=$(dirname "$relative")
  filename=$(basename "$relative")
  name="${filename%.*}"

  mkdir -p "$OUT/$dir"

  case "$relative" in
    players/*)
      SIZE="512x512>"
      QUALITY=80
      ;;
    logos/*)
      SIZE="512x512>"
      QUALITY=85
      ;;
    brand/*)
      SIZE="800x800>"
      QUALITY=85
      ;;
    icons/*)
      SIZE="256x256>"
      QUALITY=85
      ;;
    *)
      SIZE="1200x1200>"
      QUALITY=82
      ;;
  esac

  echo "Optimizing: $relative"

  magick "$file" \
    -resize "$SIZE" \
    -quality "$QUALITY" \
    "$OUT/$dir/$name.webp"

done

echo ""
echo "Done."
echo "Original size:"
du -sh "$SRC"

echo "Optimized size:"
du -sh "$OUT"