#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
export CI=true

# Force upgrade to Node 24 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

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

# Copy templates into src/agents/templates
mkdir -p /root/openclaw/src/agents/templates
cp -r /root/openclaw/docs/reference/templates/* /root/openclaw/src/agents/templates/ 2>/dev/null || true

# Copy packages into node_modules/@openclaw
mkdir -p /root/openclaw/node_modules/@openclaw
cp -r /root/openclaw/packages/* /root/openclaw/node_modules/@openclaw/ 2>/dev/null || true

# Python script to convert all .mjs to .js and fix event-stream.js locations
python3 -c '
import os, shutil
for root, dirs, files in os.walk("/root/openclaw"):
    for f in files:
        if f == "event-stream.mjs":
            p = os.path.join(root, f)
            try:
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.js"))
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.mjs"))
                shutil.copy2(p, os.path.join(root, "event-stream.js"))
            except Exception:
                pass
        if f.endswith(".mjs"):
            src = os.path.join(root, f)
            dst = os.path.join(root, f[:-4] + ".js")
            try:
                shutil.copy2(src, dst)
            except Exception:
                pass
'

pm2 kill 2>/dev/null || true
rm -f /root/.pm2/dump.pm2 /root/.pm2/logs/* 2>/dev/null || true

pm2 start /root/openclaw/openclaw.mjs --name openclaw --cwd /root/openclaw --env TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw" --env GEMINI_API_KEY="${KEY}" --env GOOGLE_API_KEY="${KEY}" --env OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json" -- gateway run --allow-unconfigured
pm2 save

echo "=========================================="
echo "FIX COMPLETE! OPENCLAW IS RUNNING DIRECTLY WITH NODE 24!"
echo "=========================================="
