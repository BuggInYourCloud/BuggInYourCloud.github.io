---
title: "OnlyHacks"
platform: "HTB"
difficulty: "Easy"
os: "Web"
date: 2026-02-14
status: "rooted"
user_flag: true
root_flag: false
tags: [web, idor, broken-access-control, flask, socketio, owasp-top-10]
tools: [nmap, burpsuite, flask-unsign]
ttl: "30m"
---

OnlyHacks is a Valentine's Day themed HTB web challenge — a Tinder-style dating app built on Flask + Socket.IO. The core vulnerability is an IDOR on the chat room endpoint that lets you read other users' private messages.

## Reconnaissance

### Port Scan

```
PORT      STATE SERVICE
32652/tcp open  http    Flask web application
```

Login page redirects to `/login`. Registered an account to explore authenticated functionality.

### Application Overview

"OnlyHacks — Where Love is the Ultimate Life Hack" — dating app with:
- Registration with profile picture upload
- Swipe-style dashboard showing 4 profiles
- Like functionality that opens Socket.IO chat rooms
- Chat rooms identified by sequential integer `rid` parameter

## Exploitation

### IDOR on Chat Rooms

After liking a profile and landing in `/chat/?rid=6`, noticed the room ID is just a GET parameter with no server-side authorization check.

Enumerated rooms `rid=1` through `rid=10`:
- Rooms 3 and 6 returned HTTP 200
- All others returned 500

Accessed `/chat/?rid=3` — read another user's private conversation containing the flag embedded in a scam message.

### Other Vectors Tested

- **SSTI in bio/chat**: `{%raw%}{{7*7}}{%endraw%}` rendered literally — not vulnerable
- **File upload abuse**: Profile picture rejected non-image uploads
- **Flask session cracking**: flask-unsign available but not needed — the IDOR was sufficient

## Key Takeaway

IDOR is OWASP #1 (Broken Access Control) for a reason. Sequential integer IDs on chat endpoints are trivially enumerable. Always check whether the server validates that the authenticated user actually belongs to the resource they're requesting.
