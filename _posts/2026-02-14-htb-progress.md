---
title: "HackTheBox — Progress Tracker"
date: 2026-02-14
tags: [htb, pentesting, progress]
---

Tracking my HackTheBox journey — boxes completed, techniques learned, and patterns I keep seeing.

## Stats

| Metric | Count |
|--------|-------|
| Boxes Rooted | 4 |
| User Only | 0 |
| Active Streak | — |

## Completed Boxes

| Box | OS | Difficulty | Key Techniques |
|-----|----|-----------|----------------|
| Facts | Linux | Easy | CameleonCMS 2.9.0, S3 cred leak, SSH key extraction |
| CodePartTwo | Linux | Medium | Flask app, Js2Py RCE, SQLite credential reuse |
| Pterodactyl | Linux | Medium | Panel v1.11.10 exploit, PAM + XFS quota race |
| Cap | Linux | Easy | PCAP analysis, credential reuse, SUID Python |

## Patterns & Takeaways

- **Credential reuse is everywhere** — database creds often work for SSH
- **Always check SUID binaries** — `find / -perm -4000 2>/dev/null` before anything fancy
- **Read the source** — web app source code is usually the fastest path to user
- **PCAP files are goldmines** — cleartext creds hiding in captured traffic

*Updated as I complete more boxes.*
