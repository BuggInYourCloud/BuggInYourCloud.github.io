---
title: "Stegger"
tagline: "Professional steganography analysis tool — 10-module automated pipeline for CTF and forensics."
tags: [steganography, forensics, ctf, bash]
---

## Overview

Stegger is a Bash-based steganography analysis tool that runs 10 detection modules against image and media files. Built for CTF competitions and digital forensics workflows, it automates the tedious first-pass analysis that most analysts do manually.

## Modules

| # | Module | What It Does |
|---|--------|-------------|
| 1 | **File Type Verification** | Compares file extension against magic bytes — catches disguised files |
| 2 | **File Info Card** | Size, dimensions, MD5/SHA-256 hashes, PNG IHDR height manipulation check |
| 3 | **Exiftool Metadata** | Full metadata extraction with auto-highlighting of comments, GPS, thumbnails |
| 4 | **Chunk / Marker Analysis** | PNG chunk enumeration (tEXt/zTXt/iTXt) and JPEG marker scanning (COM fields) |
| 5 | **Strings Flag Search** | Regex pattern matching for flags, hashes, secrets, and CTF-style markers |
| 6 | **Trailing Data Detection** | Detects appended data after PNG IEND, JPEG EOI, or GIF trailer |
| 7 | **Entropy Analysis** | Shannon entropy calculation with visual bar — flags encrypted/compressed payloads |
| 8 | **Binwalk Embedded Scan** | Signature scan for embedded files, optional Foremost carving in verbose mode |
| 9 | **Zsteg LSB Analysis** | Least Significant Bit extraction for PNG/BMP files |
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

- **Multi-file support** — scan entire directories with glob patterns
- **Progress tracking** — visual progress bar and per-module timing
- **Summary dashboard** — findings count, module breakdown, and targeted recommendations
- **Report export** — `-o` flag saves ANSI-stripped plaintext report
- **Graceful degradation** — missing tools are skipped, not fatal errors

## Dependencies

| Tool | Required For |
|------|-------------|
| `file`, `strings`, `xxd` | Core analysis (usually pre-installed) |
| `python3` + Pillow | Dimensions, entropy, chunk parsing |
| `exiftool` | Metadata extraction |
| `binwalk` | Embedded file detection |
| `zsteg` | LSB analysis (PNG/BMP) |
| `steghide` | Passphrase extraction |
| `stegseek` | Wordlist brute-force |
| `foremost` | File carving (verbose mode) |
