# 🛰️ Fleet Operational Manual: Omni-Channel Protocol

This document outlines the "Sanctity of the Fleet." It ensures that the Universal Content Engine can power an infinite number of websites while maintaining 100% design independence.

---

## 🏛️ Law #1: The Raw Data Mandate (Separation of Powers)
The Sanity Studio (The Factory) only stores **Semantic Intent.** It does NOT store visual styles.
- **Rule**: Never add a field like "textColor" or "fontSize" to the Studio. 
- **Freedom**: The Frontend is the sole artist. It decides how the data looks based on the brand's unique identity.

## 🧱 Law #2: The Universal Content Port (Portable Text)
All rich-text content is served as **Structured JSON.**
- **Requirement**: Every frontend connected to the fleet MUST implement a **Portable Text Renderer** (e.g., `@portabletext/react`).
- **Variants**: Handle `variant-a`, `variant-b`, and `variant-c` callouts with distinct styles per project. 
- **Tables**: Use the official Sanity Table renderer to display specification grids.

## 📡 Law #3: The Channel Registry Navigation
The **Channel Registry** determines where the signal goes.
- **Testing**: Maintain a "SANDBOX" channel for every brand targeting `localhost:3000`.
- **Production**: Maintain a "LIVE" channel targeting the production domain.
- **Zero Code Change**: To switch environments, you swap the **Target Webhook URL** in the Studio UI. No code deployments required to change distribution logic.

## 🤖 Law #4: The Autopilot Heartbeat
The Bot Scheduler (`bot_watch.js`) is the heartbeat of the fleet.
- **Consistency**: The bot must trigger the `/api/social/cron/heartbeat` endpoint periodically.
- **Intelligence**: The bot reads the **Channel Registry** in real-time. If you add a new website to the registry, the bot will find it and begin broadcasting to it automatically.

---
**Status**: ACTIVE PROTOCOL
**Version**: 1.0 (April 2026)
**Master Architect**: ZeroCool & Antigravity
