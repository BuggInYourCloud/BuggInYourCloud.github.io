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
| PNG height manipulation | +30 | IHDR dimensions differ from rendered |
| Flag-pattern strings | +25 | `HTB{...}` or MD5 hash found in strings |
| Zsteg file signatures | +25 | Embedded file detected in LSB channels |
| Binwalk embedded signatures | +20 | Multiple file signatures at different offsets |
| Entropy anomaly (format-aware) | 0-25 | High entropy in BMP (uncompressed format) |
| Notable metadata | +5 | EXIF comment, GPS data, or thumbnail present |

Entropy scoring uses **per-format baselines** — a 7.95 entropy PNG is normal (deflate-compressed), but a 7.95 BMP is highly suspicious since BMPs are uncompressed.

## Modules

| # | Module | What It Does |
|---|--------|-------------|
| 1 | **File Type Verification** | Compares file extension against magic bytes — catches disguised files |
| 2 | **File Info Card** | Size, dimensions, MD5/SHA-256 hashes, PNG IHDR height manipulation check |
| 3 | **Exiftool Metadata** | Full metadata extraction with auto-highlighting of comments, GPS, thumbnails |
| 4 | **Chunk / Marker Analysis** | PNG chunk enumeration (tEXt/zTXt/iTXt) and JPEG marker scanning (COM fields) |
| 5 | **Strings Flag Search** | Two-pass Python filtering — CTF flags, base64, hex hashes, URLs, file paths |
| 6 | **Trailing Data Detection** | Detects appended data after PNG IEND, JPEG EOI, or GIF trailer |
| 7 | **Entropy Analysis** | Shannon entropy with format-aware baselines per file type |
| 8 | **Binwalk Embedded Scan** | Signature scan for embedded files, optional Foremost carving in verbose mode |
| 9 | **Zsteg LSB Analysis** | Quality-filtered LSB extraction — separates real findings from noise channels |
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
- **Format-aware entropy** — per-format baselines (PNG, JPG, BMP, WAV, GIF) instead of fixed thresholds
- **Smart string filtering** — two-pass Python regex pipeline eliminates false positives from raw `strings` output
- **Zsteg noise filtering** — separates file signatures and readable text from garbage LSB channels
- **Multi-file support** — scan entire directories with glob patterns
- **Progress tracking** — visual progress bar and per-module timing
- **Summary dashboard** — suspicion gauge, scoring breakdown, finding details, and targeted recommendations
- **Report export** — `-o` flag saves ANSI-stripped plaintext report
- **Graceful degradation** — missing tools are skipped, not fatal errors

## Dependencies

| Tool | Required For |
|------|-------------|
| `file`, `strings`, `xxd` | Core analysis (usually pre-installed) |
| `python3` + Pillow | Dimensions, entropy, chunk parsing, string filtering |
| `exiftool` | Metadata extraction |
| `binwalk` | Embedded file detection |
| `zsteg` | LSB analysis (PNG/BMP) |
| `steghide` | Passphrase extraction |
| `stegseek` | Wordlist brute-force |
| `foremost` | File carving (verbose mode) |
