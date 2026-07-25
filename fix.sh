#!/bin/bash
cd /root && npm install -g pnpm 2>/dev/null || npx -y pnpm@latest install --prod 2>/dev/null

cd /root/openclaw && git fetch origin && git reset --hard origin/master

mkdir -p /root/.openclaw
cat << 'EOF' > /root/.openclaw/openclaw.json
{
  "gateway": {
    "mode": "local"
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

cat << 'EOF' > /root/openclaw/run.sh
#!/bin/bash
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export GOOGLE_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export ALLOW_FROM="8146735349"
node openclaw.mjs gateway run --allow-unconfigured
EOF

cd /root/openclaw && (pnpm install --prod --no-frozen-lockfile 2>/dev/null || npx -y pnpm@latest install --prod --no-frozen-lockfile)

find /root/openclaw/packages /root/openclaw/node_modules/@openclaw -name "*.mjs" -exec sh -c 'for f; do cp -n "$f" "${f%.mjs}.js"; done' _ {} + 2>/dev/null || true

pm2 restart openclaw
echo "FIX COMPLETE! OPENCLAW IS RUNNING!"
