import paramiko
import time

host = "31.76.45.190"
port = 22
username = "root"
password = "94ml342m7OaU"

print(f"Connecting to VPS {host} with password '{password}'...")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, port=port, username=username, password=password, timeout=15)
    print("SUCCESS! SSH CONNECTED AS ROOT!")

    def run_cmd(cmd, timeout=300):
        print(f"\n[RUNNING]: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
        while not stdout.channel.exit_status_ready():
            if stdout.channel.recv_ready():
                print(stdout.channel.recv(1024).decode('utf-8', errors='replace'), end='')
            if stdout.channel.recv_stderr_ready():
                print(stderr.channel.recv(1024).decode('utf-8', errors='replace'), end='')
            time.sleep(0.1)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        print(out)
        return out, err

    run_cmd("apt-get update -y && apt-get install -y curl git")
    run_cmd("curl -fsSL https://deb.nodesource.com/setup_22.x | bash -")
    run_cmd("apt-get install -y nodejs")
    run_cmd("npm install -g pm2")
    run_cmd("rm -rf /root/openclaw && git clone https://github.com/leopolt228/-.git /root/openclaw")
    run_cmd("cd /root/openclaw && pm2 delete openclaw 2>/dev/null || true")
    run_cmd("cd /root/openclaw && pm2 start run.sh --name openclaw --interpreter bash")
    run_cmd("pm2 save")
    run_cmd("pm2 startup")

    print("\n==============================================")
    print("SUCCESS! OPENCLAW DEPLOYED 24/7 ON VPS!")
    print("==============================================")

except Exception as e:
    print("SSH error:", e)
finally:
    client.close()
