#!/bin/bash
set -euo pipefail

# Config
TRAKT_USERNAME="bpx"
TRAKT_CLIENT_ID="a52c9cdfbdddb8ba4ffe12a70c5591e05c985eddea6cd0fb53f998fee6c59dd0"
TMDB_API_KEY="61c9bbbefe48beed3b4f02f0cc4794e7"
DATA_DIR="assets/trakt"
IMG_DIR="assets/cinema/posters"
CACHE_DIR="node_modules/.cache/cinema_assets"

log() {
  echo "[vercel-build] $*"
}

# 0. Setup and Restore Cache
mkdir -p "$DATA_DIR"
mkdir -p "$IMG_DIR"
mkdir -p "$CACHE_DIR/posters"

if [ -d "$CACHE_DIR/posters" ]; then
  log "Restoring posters from cache..."
  cp -r "$CACHE_DIR/posters/." "$IMG_DIR/" 2>/dev/null || true
fi

if [ -f "package.json" ]; then
  log "Installing node dependencies..."
  npm install --silent
  export PATH="$PWD/node_modules/.bin:$PATH"
fi

# 1. Fetch Trakt Data
log "Fetching fresh data from Trakt..."

fetch_trakt() {
  local endpoint=$1
  local output=$2
  curl -s -L -H "Content-Type: application/json" \
       -H "trakt-api-version: 2" \
       -H "trakt-api-key: $TRAKT_CLIENT_ID" \
       "https://api.trakt.tv/$endpoint" > "$output"
}

fetch_trakt "users/$TRAKT_USERNAME/watched/movies?extended=full" "$DATA_DIR/watched_movies.json"
fetch_trakt "users/$TRAKT_USERNAME/watched/shows?extended=full" "$DATA_DIR/watched_shows.json"
fetch_trakt "users/$TRAKT_USERNAME/ratings/movies" "$DATA_DIR/movie_ratings.json"
fetch_trakt "users/$TRAKT_USERNAME/ratings/shows" "$DATA_DIR/show_ratings.json"
fetch_trakt "users/$TRAKT_USERNAME/comments/all/all?extended=full" "$DATA_DIR/comments.json"
fetch_trakt "users/$TRAKT_USERNAME/lists/favorites/items?extended=full" "$DATA_DIR/favorites.json"

mkdir -p data
cp "$DATA_DIR/favorites.json" data/trakt_favorites.json
fetch_trakt "users/$TRAKT_USERNAME/history/episodes?limit=3" "data/trakt.json"

# 2. Download Posters from TMDB
log "Syncing posters from TMDB..."

download_poster() {
  local type=$1 
  local tmdb_id=$2
  local target="$IMG_DIR/${type}_${tmdb_id}.jpg"
  
  if [ -f "$target" ] && [ -s "$target" ]; then
    return 0
  fi

  # Get poster path
  local meta_url="https://api.themoviedb.org/3/$type/$tmdb_id?api_key=$TMDB_API_KEY"
  local meta_json=$(curl -s -L "$meta_url")
  local poster_path=$(node -e "try { console.log(JSON.parse(process.argv[1]).poster_path || '') } catch(e) { console.log('') }" "$meta_json")
  
  if [ -n "$poster_path" ] && [ "$poster_path" != "null" ]; then
    local img_url="https://image.tmdb.org/t/p/w500$poster_path"
    if curl -s -f -L "$img_url" -o "$target"; then
      log "Downloaded: $type $tmdb_id"
    else
      log "Error: Failed $type $tmdb_id"
      return 1
    fi
  fi
}

# Extract IDs and Download
MOVIE_IDS=$(node -e "try { const d = require('./$DATA_DIR/watched_movies.json'); console.log(d.map(m => m.movie.ids.tmdb).filter(id => id).join(' ')) } catch(e) { console.log('') }")
SHOW_IDS=$(node -e "try { const d = require('./$DATA_DIR/watched_shows.json'); console.log(d.map(s => s.show.ids.tmdb).filter(id => id).join(' ')) } catch(e) { console.log('') }")

for id in $MOVIE_IDS; do download_poster "movie" "$id" || true; done
for id in $SHOW_IDS; do download_poster "tv" "$id" || true; done

# 3. Verify Poster Presence
MISSING_COUNT=0
TOTAL_COUNT=0

for id in $MOVIE_IDS; do
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  if [ ! -f "$IMG_DIR/movie_${id}.jpg" ]; then MISSING_COUNT=$((MISSING_COUNT + 1)); fi
done
for id in $SHOW_IDS; do
  TOTAL_COUNT=$((TOTAL_COUNT + 1))
  if [ ! -f "$IMG_DIR/tv_${id}.jpg" ]; then MISSING_COUNT=$((MISSING_COUNT + 1)); fi
done

log "Posters: $TOTAL_COUNT total, $MISSING_COUNT missing."

# 4. Hugo build
log "Running Hugo build..."
ROOT_BUILD_DIR="/tmp/hugo-build-root"
rm -rf "$ROOT_BUILD_DIR" || true
mkdir -p "$ROOT_BUILD_DIR"
hugo -d "$ROOT_BUILD_DIR" --quiet

# 5. Finalize
mkdir -p public
cp -a "$ROOT_BUILD_DIR/." public/

log "Updating persistent cache..."
mkdir -p "$CACHE_DIR/posters"
cp -r "$IMG_DIR/." "$CACHE_DIR/posters/"

log "Build complete."
