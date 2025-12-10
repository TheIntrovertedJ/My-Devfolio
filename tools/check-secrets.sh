#!/usr/bin/env bash
set -euo pipefail

# This script searches the working tree for patterns that look like
# MongoDB connection strings with embedded credentials and exits non-zero
# if any matches are found.

echo "Running secrets check..."

PATTERNS=(
  # Matches: mongodb+srv://username:password@... or mongodb://username:password@...
  "mongodb\+srv:\/\/[^\s:\/]+:[^\s@]+@"
  "mongodb:\/\/[^\s:\/]+:[^\s@]+@"
)

EXIT_CODE=0

for p in "${PATTERNS[@]}"; do
  if git grep -nE -- "${p}" -- "*" >/dev/null 2>&1; then
    echo "Potential secret found matching pattern: ${p}" >&2
    git grep -nE -- "${p}" -- "*" | sed -n '1,20p' >&2
    EXIT_CODE=2
  fi
done

if [[ "$EXIT_CODE" -ne 0 ]]; then
  echo "Secret check FAILED. Remove any embedded credentials and use environment variables (.env)." >&2
  exit $EXIT_CODE
fi

echo "Secret check passed. No obvious embedded MongoDB credentials found."
