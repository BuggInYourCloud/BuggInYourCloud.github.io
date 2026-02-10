---
title: "Stegger"
tagline: "Professional steganography analysis tool — 10-module pipeline with suspicion scoring for CTF and forensics."
tags: [steganography, forensics, ctf, bash]
---

## Overview

Stegger is a Bash-based steganography analysis tool that runs 10 detection modules against image and media files. Built for CTF competitions and digital forensics workflows, it automates the tedious first-pass analysis that most analysts do manually.

Each module feeds into a **weighted suspicion scoring engine** that produces a final verdict (CLEAN / LOW / MODERATE / HIGH / CRITICAL), so you get an at-a-glance risk assessment instead of sifting through raw output.

## Suspicion Scoring

Every module contributes weighted signals to a 0-100 suspicion score:

| Signal | Weight | Example |
|--------|--------|---------|
| File type mismatch | +40 | `.png` extension but MIME is `application/zip` |
| Steghide/Stegseek extraction | +50 | Hidden data extracted with empty passphrase |
| Trailing data after end marker | +35 | 2048 bytes appended after PNG IEND |
| PNG height manipulation | +30 | IHDR decompressed data exceeds declared dimensions |
| Flag-pattern strings | +25 | `HTB{...}` or MD5 hash found in strings |
| Zsteg file signatures | +25 | Whitelisted file type detected in LSB channels |
| Zsteg flag/secret text | +25 | LSB text contains flag formats, passwords, or URLs |
| Binwalk unexpected signatures | +20 | Embedded signatures after filtering format's own |
| Entropy anomaly (format-aware) | 0-25 | Abnormal entropy for the specific file format |
| Post-IDAT text chunks | +15 | PNG text chunk placed after image data (suspicious) |
| Notable metadata | +5 | EXIF comment, GPS data, or thumbnail present |

Entropy scoring uses **per-format baselines** — a 7.95 entropy PNG is normal (deflate-compressed), but the same value in a BMP is suspicious since BMPs are uncompressed. Small files (<50KB) get relaxed lower bounds to account for header overhead diluting entropy.

## Modules

| # | Module | What It Does |
|---|--------|-------------|
| 1 | **File Type Verification** | Compares file extension against magic bytes — catches disguised files |
| 2 | **File Info Card** | Size, dimensions, hashes, PNG IHDR height manipulation via zlib decompression |
| 3 | **Exiftool Metadata** | Full metadata extraction with auto-highlighting of comments, GPS, thumbnails |
| 4 | **Chunk / Marker Analysis** | PNG chunk enumeration with post-IDAT placement detection, IHDR integrity check, JPEG COM scanning |
| 5 | **Strings Flag Search** | Two-pass Python filtering — CTF flags, base64 (30+ chars, mixed types), hex hashes, URLs, paths |
| 6 | **Trailing Data Detection** | Detects appended data after PNG IEND, JPEG EOI, or GIF trailer with readability scoring |
| 7 | **Entropy Analysis** | Shannon entropy with format-aware baselines and color-coded gauge (green/yellow/red) |
| 8 | **Binwalk Embedded Scan** | Filters out format's own signatures, reports only unexpected embedded files |
| 9 | **Zsteg LSB Analysis** | Whitelisted file sig detection + readability-scored text extraction, noise filtered |
| 10 | **Steghide + Stegseek** | Empty passphrase check + wordlist brute-force for JPEG/BMP/WAV/AU |

## Usage

```bash
# Basic scan
stegger image.png

# Verbose with report output
stegger -v -o report.txt challenge.jpg

# Custom wordlist
stegger -w /opt/wordlists/custom.txt *.jpg

# Skip brute-force (faster)
stegger --no-crack suspicious.bmp

# Quiet mode — findings only
stegger -q flag1.png flag2.png flag3.png
```

## Features

- **Suspicion scoring** — weighted 0-100 score with CLEAN/LOW/MODERATE/HIGH/CRITICAL verdicts
- **Format-aware entropy** — per-format baselines (PNG, JPG, BMP, WAV, GIF, TIFF) with small-file relaxation
- **IHDR integrity check** — decompresses IDAT data and compares against declared dimensions to catch hidden rows
- **Smart binwalk** — filters out the file's own format signatures (PNG Zlib, JPEG JFIF, etc.) before reporting
- **Zsteg whitelisting** — only flags known real file types (PNG, ZIP, PDF, ELF, etc.), rejects false magic matches from random data
- **Smart string filtering** — two-pass Python regex with tightened base64 detection (30+ chars, requires mixed case + digits)
- **Post-IDAT detection** — flags PNG text chunks placed after image data as higher suspicion than pre-IDAT chunks
- **Color-coded entropy bar** — green (normal), yellow (elevated), red (extreme) at a glance
- **Multi-file support** — scan entire directories with glob patterns
- **Summary dashboard** — suspicion gauge, scoring breakdown, finding details, and targeted recommendations
- **Report export** — `-o` flag saves ANSI-stripped plaintext report
- **Graceful degradation** — missing tools are skipped, not fatal errors

## Dependencies

| Tool | Required For |
|------|-------------|
| `file`, `strings`, `xxd` | Core analysis (usually pre-installed) |
| `python3` + Pillow | Dimensions, entropy, zlib decompression, string/zsteg filtering |
| `exiftool` | Metadata extraction |
| `binwalk` | Embedded file detection |
| `zsteg` | LSB analysis (PNG/BMP) |
| `steghide` | Passphrase extraction |
| `stegseek` | Wordlist brute-force |
| `foremost` | File carving (verbose mode) |
