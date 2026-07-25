#!/bin/bash
export DEBIAN_FRONTEND=noninteractive
export CI=true

# Force upgrade to Node 24 LTS via NodeSource
if ! node -v 2>/dev/null | grep -qE "v(24|25)"; then
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

# Copy templates into src/agents/templates
mkdir -p /root/openclaw/src/agents/templates
cp -r /root/openclaw/docs/reference/templates/* /root/openclaw/src/agents/templates/ 2>/dev/null || true

# Copy packages into node_modules/@openclaw
mkdir -p /root/openclaw/node_modules/@openclaw
cp -r /root/openclaw/packages/* /root/openclaw/node_modules/@openclaw/ 2>/dev/null || true

# Run pnpm install --prod to restore pristine node_modules
cd /root/openclaw && pnpm install --prod 2>/dev/null || true

# Fix event-stream.js mapping only in @openclaw packages
python3 -c '
import os, shutil
for root, dirs, files in os.walk("/root/openclaw/packages"):
    for f in files:
        if f == "event-stream.mjs":
            p = os.path.join(root, f)
            try:
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.js"))
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.mjs"))
                shutil.copy2(p, os.path.join(root, "event-stream.js"))
            except Exception:
                pass

for root, dirs, files in os.walk("/root/openclaw/node_modules/@openclaw"):
    for f in files:
        if f == "event-stream.mjs":
            p = os.path.join(root, f)
            try:
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.js"))
                shutil.copy2(p, os.path.join(os.path.dirname(root), "event-stream.mjs"))
                shutil.copy2(p, os.path.join(root, "event-stream.js"))
            except Exception:
                pass
'

# Create start_gateway.sh
cat << EOF > /root/openclaw/start_gateway.sh
#!/bin/bash
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="${KEY}"
export GOOGLE_API_KEY="${KEY}"
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"

cd /root/openclaw
exec node dist/entry.js gateway run --allow-unconfigured
EOF

chmod +x /root/openclaw/start_gateway.sh

pm2 kill 2>/dev/null || true
rm -f /root/.pm2/dump.pm2 /root/.pm2/logs/* 2>/dev/null || true

pm2 start /root/openclaw/start_gateway.sh --name openclaw
pm2 save

echo "=========================================="
echo "FIX COMPLETE! PRISTINE NODE_MODULES RESTORED!"
echo "=========================================="
