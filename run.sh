#!/bin/bash
echo "Starting OpenClaw Telegram Bot..."
if [ ! -f vendor.tgz ] && [ -f vendor.tgz.part001 ]; then
  cat vendor.tgz.part* > vendor.tgz
fi
tar -xzf dist.tgz 2>/dev/null
tar -xzf vendor.tgz 2>/dev/null
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"
export OPENCLAW_STATE_DIR="/home/leopolt2222/.openclaw"
export OPENCLAW_CONFIG_PATH="/home/leopolt2222/.openclaw/openclaw.json"
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export GOOGLE_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export ALLOW_FROM="8146735349"
node openclaw.mjs gateway run
