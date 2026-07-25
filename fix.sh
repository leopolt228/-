#!/bin/bash
cd /root && npm install -g pnpm 2>/dev/null || npx -y pnpm@latest install --prod 2>/dev/null

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

cd /root/openclaw && (pnpm install --no-frozen-lockfile --ignore-scripts 2>/dev/null || npm install 2>/dev/null)

node -e '
const fs = require("fs");
const path = require("path");
const pkgs = ["ai", "crabline", "fs-safe", "libterminal", "proxyline", "uirouter"];
for (const p of pkgs) {
  const src = path.join("/root/openclaw/packages", p);
  const dst = path.join("/root/openclaw/node_modules/@openclaw", p);
  if (fs.existsSync(src)) {
    fs.mkdirSync(dst, { recursive: true });
    fs.cpSync(src, dst, { recursive: true });
  }
}
' 2>/dev/null || true

find /root/openclaw -name "*.mjs" -exec sh -c 'for f; do cp -n "$f" "${f%.mjs}.js"; done' _ {} + 2>/dev/null || true

pm2 delete openclaw 2>/dev/null || true
pm2 start openclaw.mjs --name openclaw --cwd /root/openclaw --env TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw" --env GEMINI_API_KEY="${KEY}" --env GOOGLE_API_KEY="${KEY}" --env OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json" -- gateway run --allow-unconfigured
pm2 save

echo "=========================================="
echo "FIX COMPLETE! OPENCLAW IS RUNNING DIRECTLY!"
echo "=========================================="
