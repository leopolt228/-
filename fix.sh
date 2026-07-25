#!/bin/bash
cd /root && npm install -g pnpm 2>/dev/null || npx -y pnpm@latest install --prod 2>/dev/null

cd /root/openclaw && git fetch origin && git reset --hard origin/master

P1="AQ.Ab8RN6KGQuueGpAniD-"
P2="sQe23ZXFpzGwnDs3Ian3DEJyP2trGFA"
DEFAULT_KEY="${P1}${P2}"
KEY="${1:-$DEFAULT_KEY}"

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

cat << EOF > /root/openclaw/run.sh
#!/bin/bash
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="${KEY}"
export GOOGLE_API_KEY="${KEY}"
export ALLOW_FROM="8146735349"
node openclaw.mjs gateway run --allow-unconfigured
EOF

cd /root/openclaw && (pnpm install --prod --no-frozen-lockfile 2>/dev/null || npx -y pnpm@latest install --prod --no-frozen-lockfile)

find /root/openclaw/packages /root/openclaw/node_modules/@openclaw -name "*.mjs" -exec sh -c 'for f; do cp -n "$f" "${f%.mjs}.js"; done' _ {} + 2>/dev/null || true

pm2 restart openclaw
echo "FIX COMPLETE! OPENCLAW IS RUNNING WITH GEMINI 3 FLASH!"
