#!/bin/bash
set -euo pipefail

# Config
CINETRACKER_API_URL="${CINETRACKER_API_URL:-https://movie-trackerh.vercel.app/api/v1/export}"
CINETRACKER_API_KEY="${CINETRACKER_API_KEY:-${CINEMA_API_KEY:-}}"
TMDB_API_KEY="${TMDB_API_KEY:-61c9bbbefe48beed3b4f02f0cc4794e7}"
DATA_DIR="assets/cinetracker"
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

# 1. Fetch CineTracker Data
log "Fetching fresh data from CineTracker..."

fetch_cinetracker() {
  local output="$DATA_DIR/export.json"
  local tmp_file="${output}.tmp"

  local auth_args=()
  if [ -n "$CINETRACKER_API_KEY" ]; then
    auth_args=(-H "Authorization: Bearer $CINETRACKER_API_KEY")
  fi

  if curl -s -f -L -H "Content-Type: application/json" \
       "${auth_args[@]}" \
       "$CINETRACKER_API_URL?include=profile,stats,movies,tv,episodes,watchlist" > "$tmp_file" 2>/dev/null; then
    if node -e "const d = JSON.parse(require('fs').readFileSync(process.argv[1])); if(!d.movies && !d.tv_shows) process.exit(1);" "$tmp_file" 2>/dev/null; then
      mv "$tmp_file" "$output"
      log "Successfully updated $output"
      return 0
    fi
  fi

  rm -f "$tmp_file"
  log "Notice: Could not fetch live CineTracker data. Preserving existing cache."
  if [ ! -f "$output" ] || [ ! -s "$output" ]; then
    echo '{"movies":[],"tv_shows":[],"episodes":[]}' > "$output"
  fi
}

fetch_cinetracker

mkdir -p data
node -e "
try {
  const exportData = require('./$DATA_DIR/export.json');
  const episodes = exportData.episodes || [];
  episodes.sort((a, b) => new Date(b.watched_date || b.created_at || 0) - new Date(a.watched_date || a.created_at || 0));
  const recent = episodes.slice(0, 10);
  require('fs').writeFileSync('data/cinetracker.json', JSON.stringify(recent, null, 2));
} catch (e) {
  console.error('Failed to update data/cinetracker.json:', e);
}
"

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
MOVIE_IDS=$(node -e "try { const d = require('./$DATA_DIR/export.json'); console.log((d.movies || []).map(m => m.movie_id).filter(id => id).join(' ')) } catch(e) { console.log('') }")
SHOW_IDS=$(node -e "try { const d = require('./$DATA_DIR/export.json'); console.log((d.tv_shows || []).map(s => s.tv_show_id).filter(id => id).join(' ')) } catch(e) { console.log('') }")

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
hugo version
ROOT_BUILD_DIR="/tmp/hugo-build-root"
rm -rf "$ROOT_BUILD_DIR" || true
mkdir -p "$ROOT_BUILD_DIR"
hugo -d "$ROOT_BUILD_DIR"


# 5. Finalize
mkdir -p public
cp -a "$ROOT_BUILD_DIR/." public/

log "Updating persistent cache..."
mkdir -p "$CACHE_DIR/posters"
cp -r "$IMG_DIR/." "$CACHE_DIR/posters/"

log "Build complete."
