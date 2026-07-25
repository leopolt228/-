import paramiko
import time

host = "31.76.45.190"
port = 22
username = "root"
password = "94ml342m7OaU"

print(f"Connecting to VPS {host}...")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, port=port, username=username, password=password, timeout=15)
    print("SSH CONNECTED AS ROOT!")

    def run_cmd(cmd, timeout=60):
        print(f"\n[RUNNING]: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        print(out)
        if err:
            print("[ERR]:", err)
        return out, err

    # 1. Create openclaw.json config
    run_cmd("mkdir -p /root/.openclaw")
    config_content = """{
  "gateway": {
    "mode": "local"
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw",
      "allowFrom": ["8146735349"]
    }
  },
  "providers": {
    "google": {
      "apiKey": "AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
    }
  }
}"""
    run_cmd(f"cat << 'EOF' > /root/.openclaw/openclaw.json\n{config_content}\nEOF")

    # 2. Update run.sh
    run_sh_content = """#!/bin/bash
export OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH="1"
export OPENCLAW_STATE_DIR="/root/.openclaw"
export OPENCLAW_CONFIG_PATH="/root/.openclaw/openclaw.json"
export TELEGRAM_BOT_TOKEN="8754163681:AAE1FLnikHL0Mlr2VrtPoVbaiMea-LQiWkw"
export GEMINI_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export GOOGLE_API_KEY="AIzaSyBqonVnA2cQbAk0D24yKMHgjyo4nQlW0mI"
export ALLOW_FROM="8146735349"
node openclaw.mjs gateway run --allow-unconfigured
"""
    run_cmd(f"cat << 'EOF' > /root/openclaw/run.sh\n{run_sh_content}\nEOF")
    run_cmd("chmod +x /root/openclaw/run.sh")

    # 3. Restart PM2 process
    run_cmd("cd /root/openclaw && pm2 restart openclaw || pm2 start run.sh --name openclaw --interpreter bash")
    run_cmd("pm2 save")
    run_cmd("pm2 logs openclaw --lines 20 --raw")

    print("\n===============================================")
    print("CONFIGURED AND RESTARTED OPENCLAW SUCCESSFULLY!")
    print("===============================================")

except Exception as e:
    print("SSH error:", e)
finally:
    client.close()
