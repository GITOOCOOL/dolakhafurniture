# 🛰️ Dolakha Content Engine (V4.1)
## The Omnichannel Broadcast Infrastructure

This engine is a production-grade, multimodal automation system designed to handle high-fidelity social distribution across Web, Facebook, and Instagram.

---

### 🚀 Core Architecture

#### 1. **The Multimodal Handshake (Autonomous Detection)**
The engine automatically distinguishes between **Photo** and **Video** assets.
- **Videos**: Routed to specialized `video_stories` or `video_reels` endpoints for maximum precision.
- **Photos**: Routed to standard `photos` (Feed) or specialized `photo_stories` (Story Circle) endpoints.

#### 2. **Tactical Timezone Intelligence**
The Heartbeat Bot (**Bot V6.1**) is globally aware.
- **Australia/Sydney**: Synchronized for morning/evening tactical launches.
- **Nepal (UTC/Custom)**: Aligned with the local business clock for regional relevance.

#### 3. **The "Shadow Upload" Protocol (FB Story Circle)**
To reach the Facebook **Story Circle**, the engine uses a secretive two-phase process:
- **Phase A**: Upload to `/photos` with `published: false` to obtain a Shadow ID.
- **Phase B**: Publish that ID to the `photo_stories` endpoint.

---

### 🕹️ Mission Control (Sanity Dashboard)

#### **Targets & Handshakes**
The system uses **Target Injected Credentials**. It ignores local `.env` files and pulls the real **Platform ID** and **Access Token** directly from the Sanity Distribution Channel document selected.

#### **Tactical Launch Actions**
- **Manual Launch**: Instant deployment via the Broadcast Dashboard.
- **Automated Pulse**: Scheduled launches handled by the Cloud Heartbeat (every 5 minutes).

---

### 🛡️ Cloud Sovereignty

The bot no longer relies on a local Mac. It is powered by **GitHub Actions** (`.github/workflows/heartbeat.yml`).
- **Trigger**: Every 5 minutes (Cron).
- **Execution**: Pings the internal Heartbeat API with a secure `CRON_SECRET`.

---

### 🛠 Troubleshooting & OPS
- **403 Forbidden?** Check the "Business Manager" and ensure the **SanityBot (System User)** is assigned as an Asset to the Page.
- **Not in Story Circle?** Ensure the mission `Placement Type` is set to `Story`.
- **Bot Sleeping?** Check the **Actions** tab in GitHub to ensure the pulse is firing.

*Final System Hardening Completed: 2026-04-25* 🏘️🚣‍♂️🏔️🇳🇵✨🚀
