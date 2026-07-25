import paramiko

host = "31.76.45.190"
port = 22
username = "root"
password = "94ml342m7OaU"

print(f"Connecting to VPS {host}...")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(host, port=port, username=username, password=password, timeout=10)
    print("SSH CONNECTED AS ROOT!")

    def run_cmd(cmd):
        print(f"\n[RUNNING]: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        print(out)
        if err:
            print("[ERR]:", err)
        return out, err

    run_cmd("curl -fsSL https://raw.githubusercontent.com/leopolt228/-/master/fix.sh | bash")
    run_cmd("pm2 logs openclaw --lines 20 --raw")

except Exception as e:
    print("SSH Error:", e)
finally:
    client.close()
