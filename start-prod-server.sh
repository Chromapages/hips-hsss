#!/bin/bash
# Production PM2 startup script
export PATH=/home/deploy/.nvm/versions/node/v20.20.2/bin:$PATH
export NODE_ENV=production
cd /home/deploy/hips-hsss/apps/web

# Load .env.local if it exists
if [ -f /home/deploy/hips-hsss/apps/web/.env.local ]; then
  set -a
  source /home/deploy/hips-hsss/apps/web/.env.local
  set +a
fi

# Extract Firebase Admin credentials from firebase-admin.json
export FIREBASE_PROJECT_ID=$(node -e "const fs=require('fs');console.log(JSON.parse(fs.readFileSync('/home/deploy/hips-hsss/firebase-admin.json','utf8')).project_id)")
export FIREBASE_CLIENT_EMAIL=$(node -e "const fs=require('fs');console.log(JSON.parse(fs.readFileSync('/home/deploy/hips-hsss/firebase-admin.json','utf8')).client_email)")
export FIREBASE_PRIVATE_KEY=$(node -e "const fs=require('fs');console.log(JSON.parse(fs.readFileSync('/home/deploy/hips-hsss/firebase-admin.json','utf8')).private_key)")

echo "Starting HIPS Web in production mode"
echo "FIREBASE_PROJECT_ID: $FIREBASE_PROJECT_ID"

exec pnpm exec next start -p 3000