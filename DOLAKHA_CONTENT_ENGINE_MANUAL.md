# 🚀 The Dolakha Content Engine & Strategy Manual

Welcome to the **Dolakha Multimodal Content Engine** blueprint. This document serves as both a low-level technical manual for the automated broadcasting system built into Sanity, and a high-level strategic guide for modern content marketing.

---

## ⚙️ PART 1: Low-Level Technical Architecture

The Content Engine (v4.1) transforms Sanity CMS from a simple website database into a **headless, autonomous social media broadcasting station**.

### 1.1 The "Mission Control" Triad
The architecture is built on three deeply integrated Sanity schemas:

1. **`socialMedia.ts` (The Payload)**
   - Holds the raw creative assets.
   - Detects the `mediaType` (Photo vs. Video) to ensure the payload is correctly formatted for the destination platform.
   - Houses the core caption, hashtags, and raw media files.

2. **`socialChannel.tsx` (The Gateway)**
   - Contains **Target Injected Credentials**. 
   - Instead of hardcoding Facebook or Instagram tokens into `.env` files (which limits you to one account), this schema dynamically stores the `platformId` and `accessToken` for unlimited distribution endpoints.
   - *Security Note:* Passwords/Tokens are visually masked in the Studio.

3. **`broadcast.ts` (The Autopilot)**
   - The central command deck (`BroadcastControlDeck`). 
   - Connects a `socialMedia` payload to specific `socialChannel` targets.
   - Features the **Bot Brain**: Configures execution times, frequency (daily/weekly/monthly), and timezone-aware launches.

### 1.2 Advanced Operational Protocols

#### The "Two-Step Shadow Upload" (Story Circle Protocol)
Facebook's Graph API heavily restricts direct uploads to Page Stories without blasting the main feed. Our engine bypasses this using the shadow protocol:
1. **Step 1 (Shadow Upload):** The engine uploads the photo to the Page's album with `published: false`. The asset exists on Facebook's servers but is completely invisible to the public feed.
2. **Step 2 (Story Binding):** The engine takes the hidden `photo_id` and binds it specifically to the Page's 24-hour Story Circle.
*Result:* High-fidelity stories without feed clutter.

#### Cloud Sovereignty (Bot v6.1)
The engine does not rely on a developer's laptop to run. It uses a **GitHub Actions CRON job** that acts as a heartbeat.
- Every 5 minutes (`*/5 * * * *`), the cloud pings the Next.js API.
- The API queries Sanity for any `broadcast` marked as `pending` where the `scheduledTime` has passed.
- If a match is found, the engine executes the payload, updates the Sanity status to `success` or `failed`, and goes back to sleep.

---

## 📈 PART 2: Content Marketing Strategies

To extract maximum value from this engine, the content fed into it must be strategically sound. Here is the research-backed approach for furniture retail.

### 2.1 The Three-Tier Funnel Strategy

**1. Top of Funnel (Awareness): Reels & TikToks**
- *Objective:* Maximum reach and brand discovery.
- *Format:* Vertical Video (Under 30 seconds).
- *Content Strategy:* The algorithm favors watch time. Do not make "ads". Make visually satisfying content. 
  - *Examples:* A 15-second time-lapse of a sofa being upholstered. A fast-paced tour of the showroom. "3 Space-Saving Hacks for Kathmandu Apartments."
  - *Engine Execution:* Set the Broadcast Hub to target `Video Platforms` with the `Reel` placement.

**2. Middle of Funnel (Consideration): Stories**
- *Objective:* Building trust, urgency, and human connection.
- *Format:* Ephemeral (24-hour) Photos/Videos.
- *Content Strategy:* Stories are for people who already follow you. They want authenticity, not polish.
  - *Examples:* "Behind the scenes" factory updates, daily inventory drops, "Q&A" boxes about custom sizing, or immediate customer delivery photos.
  - *Engine Execution:* Utilize the **Story Circle Protocol** to push daily updates without spamming your permanent feed.

**3. Bottom of Funnel (Decision): Feed Posts**
- *Objective:* Brand authority and cataloging.
- *Format:* High-resolution Carousels & Photos.
- *Content Strategy:* The permanent feed is your digital showroom. If someone discovers a Reel and clicks your profile, the Feed must look premium.
  - *Examples:* Professional lighting, staged room aesthetics, detailed close-ups of wood grain or fabric texture.
  - *Engine Execution:* Schedule these sparingly (2-3 times a week) targeting `Feed Post (Permanent)`.

### 2.2 Chrono-Optimization (Timing & Frequency)

The `broadcast.ts` Bot Brain allows you to target specific timezones. 
- **The "Commuter Window":** Schedule broadcasts for **7:30 AM - 8:30 AM**. People check their phones heavily before starting work.
- **The "Downtime Spike":** Schedule high-impact Reels for **7:00 PM - 9:00 PM** (Asia/Kathmandu). This is when active engagement (comments, shares) peaks.
- **Consistency over Frequency:** The algorithm prefers a brand that posts 1 Reel reliably every 3 days over a brand that posts 5 Reels in one day and goes silent for a week. Use the `Bot Brain` to queue a month of content to drip out evenly.

### 2.3 The "Elevation" Workflow (Turning Likes into Sales)

Once the engine publishes the content, human intervention takes over:
1. **Engagement:** Monitor comments closely.
2. **Triage:** If a user comments "Price please" on an automated Reel, reply publicly with a friendly acknowledgment, but immediately send them a Direct Message.
3. **Admin Dashboard Capture:** Manually log high-intent DMs into the `/admin/leads` section of your Admin Dashboard. Move the conversation from casual social media to a formalized sales pipeline.

---

*This manual guarantees that Dolakha Furniture is not just posting randomly, but operating a mechanized, highly strategic media corporation.*
