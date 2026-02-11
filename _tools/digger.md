---
title: "Digger"
tagline: "Subdomain enumeration and fuzzing tool — multi-phase pipeline with scan profiles."
tags: [recon, subdomain, enumeration, fuzzing, python]
---

## Overview

Digger is a Python-based subdomain enumeration tool that chains passive OSINT, vhost fuzzing, active DNS brute-force, and permutation generation into a single pipeline. Built for pentesting and bug bounty recon, it aggregates results from multiple tools, deduplicates, resolves live hosts, and detects wildcard DNS.

Supports three **scan profiles** (quick/medium/full) for one-command operation, or interactive mode where you choose each phase.

## Architecture

```
digger.py          CLI + orchestrator + summary dashboard
core/
  config.py        Scan profiles, tool discovery, wordlist paths
  deps.py          Dependency checker with auto-install (go install)
  runner.py        Subprocess runner with timeout + output parsing
  ui.py            Rich-based box drawing (stegger-style dashboard)
phases/
  passive.py       subfinder, amass, crt.sh
  vhost.py         ffuf or gobuster vhost fuzzing
  active.py        ffuf or gobuster DNS brute-force
  permutations.py  altdns-style prefix/suffix mutations
  resolve.py       Bulk DNS resolution with wildcard filtering
data/
  subdomains.txt   Bundled fallback wordlist
  resolvers.txt    Curated resolver list
```

## Phases

| # | Phase | Tools Used | What It Does |
|---|-------|-----------|-------------|
| 0 | **Dependency Check** | go, pip | Auto-discovers and optionally installs missing tools |
| 1 | **Passive Recon** | subfinder, amass, crt.sh | Certificate transparency logs + OSINT aggregation |
| 2 | **Vhost Fuzzing** | ffuf or gobuster | HTTP Host header fuzzing with baseline filtering |
| 3 | **Active DNS** | ffuf or gobuster | DNS brute-force against target nameservers |
| 4 | **Permutations** | built-in | altdns-style prefix/suffix mutations on discovered subs |
| 5 | **DNS Resolution** | dnsx, puredns, or socket | Bulk resolve + wildcard detection and filtering |

## Scan Profiles

| Profile | Phases | Threads | Timeout | Typical Runtime |
|---------|--------|---------|---------|----------------|
| `quick` | subfinder + crt.sh only | 25 | 120s | ~30s |
| `medium` | All passive + vhost fuzzing | 50 | 300s | ~2-5min |
| `full` | Everything including brute-force + permutations | 100 | 600s | ~5-15min |

## Usage

```bash
# Interactive mode — prompts for each phase
digger target.com

# Profile-driven (no prompts)
digger target.com -p quick
digger target.com -p medium -v
digger target.com -p full --threads 100

# Passive only
digger target.com --passive-only

# Custom wordlist + high concurrency
digger target.com --wordlist /path/to/list.txt --threads 100

# Run everything non-interactively
digger target.com --all
```

## Features

- **Multi-tool aggregation** — deduplicates results across subfinder, amass, crt.sh, ffuf, gobuster
- **Scan profiles** — quick/medium/full presets for one-command operation
- **Wildcard detection** — probes random subdomains to identify and filter wildcard DNS
- **Hosts-file awareness** — detects HTB/lab environments where DNS won't resolve vhosts
- **Auto-install** — missing Go tools (subfinder, dnsx, puredns, ffuf) installed via `go install`
- **Tool fallback** — ffuf preferred, falls back to gobuster; dnsx > puredns > Python socket
- **Permutation engine** — 50+ prefixes and suffixes for altdns-style subdomain mutations
- **JSON output** — structured results with per-subdomain source tracking and metadata
- **Summary dashboard** — stegger-style box drawing with phase breakdown and top results
- **Verbose mode** — shows commands, timing, raw tool output, and sample results

## Output

Results are saved as JSON with full metadata:

```json
{
  "meta": {
    "tool": "digger",
    "domain": "target.com",
    "duration_seconds": 42.3,
    "phases_run": ["passive", "vhost", "resolve"]
  },
  "stats": {
    "passive_count": 127,
    "vhost_count": 3,
    "resolved_count": 89,
    "wildcard_detected": false
  },
  "results": [
    {
      "subdomain": "api.target.com",
      "ips": ["10.0.0.1"],
      "sources": ["subfinder", "crt.sh"]
    }
  ]
}
```

## Dependencies

| Tool | Phase | Install |
|------|-------|---------|
| `subfinder` | Passive | `go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest` |
| `amass` | Passive | `go install github.com/owasp-amass/amass/v4/...@master` |
| `ffuf` | Vhost + Active | `go install github.com/ffuf/ffuf/v2@latest` |
| `gobuster` | Vhost + Active (fallback) | `go install github.com/OJ/gobuster/v3@latest` |
| `dnsx` | Resolve | `go install github.com/projectdiscovery/dnsx/cmd/dnsx@latest` |
| `puredns` | Resolve (fallback) | `go install github.com/d3mondev/puredns/v2@latest` |
| `python3` + rich | Core | `pip install rich` |
