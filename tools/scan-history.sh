#!/usr/bin/env bash
set -euo pipefail

# Scan git history for committed MongoDB URIs that contain credentials.
# Usage: ./tools/scan-history.sh

echo "Scanning git history for embedded MongoDB credentials..."

PATTERNS=(
  "mongodb\+srv:\/\/[^\s:\/]+:[^\s@]+@"
  "mongodb:\/\/[^\s:\/]+:[^\s@]+@"
)

for p in "${PATTERNS[@]}"; do
  echo "Searching for pattern: ${p}"
  git log --all -p -S"@" --pretty=format:%H | while read -r commit; do
    git show "$commit" | grep -nE -- "${p}" && echo "Found in commit: $commit"
  done || true
done

echo "History scan complete. Review any matches above." 
