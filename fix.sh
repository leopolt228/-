#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
export CI=true

# Install Node 24 LTS if needed
if ! node -v 2>/dev/null | grep -qE "v(22|24|25)"; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi

cd /root && npm install -g pnpm pm2 2>/dev/null || npx -y pnpm@latest install --prod 2>/dev/null
pnpm config set confirmModulesPurge false 2>/dev/null || true

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
      "allowFrom": ["*"]
    }
  }
}
EOF

# Create run.sh executable script
cat << EOF > /root/openclaw/run.sh
#!/bin/bash
cd /root/openclaw || exit 1
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="${KEY}"
export GOOGLE_API_KEY="${KEY}"
export ALLOW_FROM="*"
exec node openclaw.mjs gateway run --allow-unconfigured
EOF

chmod +x /root/openclaw/run.sh

# Copy templates into src/agents/templates
mkdir -p /root/openclaw/src/agents/templates
cp -r /root/openclaw/docs/reference/templates/* /root/openclaw/src/agents/templates/ 2>/dev/null || true

# 1. Duplicate all .mjs to .js in packages first
find /root/openclaw/packages -type f -name "*.mjs" | while read f; do cp "$f" "${f%.mjs}.js"; done 2>/dev/null || true

# 2. Copy packages to node_modules/@openclaw
mkdir -p /root/openclaw/node_modules/@openclaw
cp -r /root/openclaw/packages/* /root/openclaw/node_modules/@openclaw/ 2>/dev/null || true

# 3. Duplicate all .mjs to .js in node_modules
find /root/openclaw/node_modules -type f -name "*.mjs" | while read f; do cp "$f" "${f%.mjs}.js"; done 2>/dev/null || true

pm2 kill 2>/dev/null || true
rm -f /root/.pm2/dump.pm2 /root/.pm2/logs/* 2>/dev/null || true

pm2 start /root/openclaw/run.sh --name openclaw
pm2 save

echo "=========================================="
echo "FIX COMPLETE! PRINTING LIVE GATEWAY LOGS..."
echo "=========================================="
sleep 4
pm2 logs openclaw --lines 20 --raw | head -n 20
