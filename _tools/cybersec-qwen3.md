---
title: "CyberSec Qwen3"
tagline: "Fine-tuned Qwen3 14B for offensive security — tool calling, recon, exploitation."
tags: [llm, fine-tuning, qlora, ollama]
repo: "https://github.com/BuggInYourCloud/Personal-LLM"
---

## Overview

A QLoRA fine-tuned Qwen3 14B model specialized in cybersecurity operations. Runs locally on an RTX 3090 via Ollama, integrated with 12 MCP tool servers for automated security workflows.

## Architecture

- **Base Model**: `unsloth/Qwen3-14B-unsloth-bnb-4bit`
- **Training**: QLoRA rank 32, alpha 64, 2 epochs on 3,913 curated samples
- **Eval Loss**: 0.7681 at best checkpoint
- **Inference**: q4_k_m GGUF quantization via Ollama
- **Tool Calling**: MCP bridge harness (text mode) connecting to nmap, sqlmap, hashcat, radare2, and more

## Training Data

Curated from Fenrir v2.0 dataset — aggressive quality filtering (score >= 6, word count >= 200, echo rate < 70%). ShareGPT format, ChatML-compatible.

## Eval Pipeline

Custom harness bridges Ollama with MCP servers. Claude Code acts as "big brother" — observing every command, output, and decision the model makes during live HTB/THM box testing.
