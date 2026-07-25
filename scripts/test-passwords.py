import paramiko

host = "31.76.45.190"
port = 22
username = "root"

passwords = [
    "94mI342m7OaJ",
    "94ml342m7OaJ",
    "94m1342m7OaJ",
    "94mI342m70aJ",
    "94ml342m70aJ",
    "94m1342m70aJ",
    "94mI342m7Oaj",
    "94ml342m7Oaj",
]

for pwd in passwords:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print(f"Trying password: '{pwd}'...")
        client.connect(host, port=port, username=username, password=pwd, timeout=5)
        print(f"SUCCESS! CORRECT PASSWORD IS: '{pwd}'")
        client.close()
        break
    except Exception as e:
        print("Failed:", e)
        client.close()
