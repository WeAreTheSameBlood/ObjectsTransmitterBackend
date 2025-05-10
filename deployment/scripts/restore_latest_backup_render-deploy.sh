#!/usr/bin/env bash
set -euo pipefail

# Get local .env
if [ -f "./.env" ]; then
  echo "📥 Loading environment variables from .env"
  set -a
  source "./.env"
  set +a
fi

export DATABASE_URL="$DATABASE_DEPLOY_URL"

# Set Environments
: "${APPWRITE_ENDPOINT:?Need to set APPWRITE_ENDPOINT}"
: "${APPWRITE_PROJECT_ID:?Need to set APPWRITE_PROJECT_ID}"
: "${APPWRITE_API_KEY:?Need to set APPWRITE_API_KEY}"
: "${APPWRITE_BACKUP_BUCKET_ID:?Need to set APPWRITE_BACKUP_BUCKET_ID}"
: "${POSTGRES_CONTAINER_NAME:=objects-transmitter-db}"
: "${POSTGRES_USER:=postgres}"
: "${POSTGRES_DATABASE:=objects_transmitter_db}"

echo "🔍 Listing backups in bucket..."

# Get all files from bucket
files_json=$(curl -s \
  -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
  -H "X-Appwrite-Key:   $APPWRITE_API_KEY" \
  "$APPWRITE_ENDPOINT/storage/buckets/$APPWRITE_BACKUP_BUCKET_ID/files")

if [[ "$(echo "$files_json" | jq 'has("files")')" != "true" ]]; then
  echo "❌ Unexpected response, missing 'files':"
  echo "$files_json" | jq .
  exit 1
fi

echo "🔍 Filtering backups starting with 'db_backup_'"

# Filter last backup if it's possible
latest=$(echo "$files_json" | jq -r '
  .files
  | map(select(.name | startswith("db_backup_")))
  | sort_by(.name)
  | last')
fileId=$(echo "$latest"   | jq -r '.["$id"]')
fileName=$(echo "$latest" | jq -r '.name')

if [[ -z "$fileId" || "$fileId" == "null" ]]; then
  echo "⚠️ No backups found."
  exit 1
fi

echo "✅ Latest backup: $fileName (ID: $fileId)"

# Create a unique temp file with .sql extension
tmpfile="$(mktemp -t db_backup_XXXXXXXX.sql)"

echo "⬇️  Downloading to $tmpfile..."

# Download dump to temp file
curl -s \
  -H "X-Appwrite-Project: $APPWRITE_PROJECT_ID" \
  -H "X-Appwrite-Key:   $APPWRITE_API_KEY" \
  "$APPWRITE_ENDPOINT/storage/buckets/$APPWRITE_BACKUP_BUCKET_ID/files/$fileId/download?project=$APPWRITE_PROJECT_ID" \
  -o "$tmpfile"

echo "🐳 Restoring into database via psql using \$DATABASE_URL..."

# Restore dump directly using psql
PGPASSWORD="${DATABASE_URL#*:*:/*@*/*:}" psql "$DATABASE_URL" < "$tmpfile"

echo "🎉 Restore complete."

# Remove injected dump
rm -f "$tmpfile"