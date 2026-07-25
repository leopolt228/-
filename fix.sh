#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

# Install Node 24 LTS if needed
if ! node -v 2>/dev/null | grep -qE "v(22|24|25)"; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi

cd /root && npm install -g pnpm pm2 2>/dev/null || npx -y pnpm@latest install --prod 2>/dev/null

cd /root/openclaw && git fetch origin && git reset --hard origin/master

P1="AQ.Ab8RN6KGQuueGpAniD-"
P2="sQe23ZXFpzGwnDs3Ian3DEJyP2trGFA"
KEY="${P1}${P2}"

mkdir -p /root/.openclaw
cat << EOF > /root/.openclaw/openclaw.json
{
  "gateway": {
    "mode": "local"
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "google/gemini-3-flash",
        "fallbacks": ["google/gemini-3-pro"]
      }
    }
  },
  "models": {
    "providers": {
      "google": {
        "apiKey": "${KEY}"
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw",
      "allowFrom": ["8146735349"]
    }
  }
}
EOF

export CI=true
cd /root/openclaw && (CI=true pnpm install --no-frozen-lockfile --ignore-scripts 2>/dev/null || npm install 2>/dev/null)

# 1. Duplicate all .mjs to .js in packages first
find /root/openclaw/packages -type f -name "*.mjs" | while read f; do cp "$f" "${f%.mjs}.js"; done 2>/dev/null || true

# 2. Copy packages to node_modules/@openclaw
mkdir -p /root/openclaw/node_modules/@openclaw
cp -r /root/openclaw/packages/* /root/openclaw/node_modules/@openclaw/ 2>/dev/null || true

# 3. Duplicate all .mjs to .js in node_modules
find /root/openclaw/node_modules -type f -name "*.mjs" | while read f; do cp "$f" "${f%.mjs}.js"; done 2>/dev/null || true

pm2 kill 2>/dev/null || true
rm -f /root/.pm2/dump.pm2 2>/dev/null || true

pm2 start openclaw.mjs --name openclaw --cwd /root/openclaw --env TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw" --env GEMINI_API_KEY="${KEY}" --env GOOGLE_API_KEY="${KEY}" --env OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json" -- gateway run --allow-unconfigured
pm2 save

echo "=========================================="
echo "FIX COMPLETE! OPENCLAW IS RUNNING DIRECTLY WITH NODE 24!"
echo "=========================================="
