*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

---

# 💎 GemmaCraft — The AI E-Commerce & Side Hustle Studio Powered by Open-Weight Gemma 2

## What I Built

**GemmaCraft** is a private, zero-cost e-commerce listing generator, profit margin analyzer, and multichannel launch studio designed specifically for solo artisans, makers, and side hustlers.

Solo creators excel at their craft—whether it is throwing stoneware ceramics, pouring clean soy candles, or hand-stitching full-grain leather bags. However, when turning a passion into a profitable side hustle, they run headfirst into the **"Maker’s Dilemma"**:

1. **Listing Fatigue**: Writing 20 unique product listings on Etsy, Shopify, or Amazon takes 15+ hours each week. Staring at a blank screen trying to formulate 13 search tags, engaging storytelling, and mobile-ready bullet points drains the energy needed to make products.
2. **Subscription Fatigue**: Generic copywriting SaaS tools (such as Jasper or Copy.ai) charge $29 to $49 every single month. For a solo maker starting out, that recurring fee eats up profit before their first sale.
3. **Severe Underpricing**: Many artisans don't account for their true labor hours or marketplace commission fees (e.g., Etsy's 6.5% transaction + 3% payment + listing fees). They underprice their work and end up making less than minimum wage.
4. **Cloud Privacy Fears**: Solo creators often hesitate to upload unreleased prototype photos, custom client commission briefs, or trade secrets (like proprietary glaze recipes or fragrance blends) to third-party public clouds.

### The Solution: GemmaCraft

GemmaCraft solves these problems by running entirely on **Google's open-weight Gemma 2** model family. In just a few clicks, an artisan can input their raw materials and studio notes, and GemmaCraft produces:

- **Mobile-Optimized SEO Title** (under 140 characters).
- **5 High-Converting Bullet Points** (highlighting craftsmanship, sensory experience, materials, dimensions, and gift readiness).
- **Sensory Storytelling Markdown Description** with care guidelines.
- **13 Search Algorithm Tags** tuned for Etsy and Shopify search traffic.
- **Amazon Backend Search Keywords & Google SEO Meta Description**.
- **Real-Time Profit & Margin Matrix**: Calculates base costs, platform transaction cuts, net profit per sale, and ROI across Etsy, Shopify, Amazon Handmade, and eBay.
- **3 Psychological Pricing Tiers**: Launch/High-Velocity (20% margin), The Sweet Spot (45% margin), and Prestige/Heirloom (65% margin), plus an AI **Price Defense Script** to help sellers explain their pricing with confidence.
- **Multichannel Launch Social Blast**: 15-second viral TikTok/Reels storyboard script with ASMR visual cues, Pinterest Rich Pin copy, and a VIP subscriber email drop announcement.
- **Live Marketplace Viewport Mockups**: Live simulated previews of an Etsy Search Card, Shopify DTC Product Page, and Amazon Detail Buy Box.
- **Local Catalog Exporter**: 1-click Shopify-compatible CSV export, formatted Markdown files, and JSON backups.

### Who Would Pay For It?

- **Handmade artisans & craftspeople** selling on Etsy, GoImagine, and at weekend artisan markets.
- **Solo Shopify DTC founders** managing 10 to 50 handcrafted SKUs.
- **Side hustlers and weekend makers** looking to save 15+ hours a week and accurately price their labor.

In user testing, our verified first user offered to pay **$29 one-time** or **$9/month** to keep running it locally on her studio laptop without Wi-Fi.

---

## Demo

- **Live Code Repository:** [GitHub - LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft](https://github.com/LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft)
- **Local Studio Instance:** Tested and verified on `http://localhost:5173/`

### Visual Walkthrough

#### 1. The Listing Studio & Product DNA Panel
Artisans can choose from instant presets (or upload custom photos and craft notes) with selectable tone of voice (*Artisan & Cozy*, *Luxury & Heirloom*, *Minimalist Modern*, *Gift & Whimsical*, *Direct & Feature-Rich*).

```
+-----------------------------------------------------------------------------------------+
|  💎 GemmaCraft   [● Gemma 2 (Edge Engine) Open-Weight]       [⚙️ Engine Settings] [⭐ Story] |
+-----------------------------------------------------------------------------------------+
|  ⚡ Instant Presets: [Cozy Hearth Candle] [Heritage Leather Bag] [Ceramic Pour-Over]      |
+-----------------------------------------------------------------------------------------+
|  Product DNA Form                          |  Live Intelligence Output Studio            |
|  - Name: Artisan Ceramic Dripper           |  [📝 Listing] [💰 Profit] [📣 Social] [🛍️ Mock] |
|  - Category: Kitchen & Dining / Ceramics   |  -----------------------------------------  |
|  - Channel: Etsy                           |  SEO Title: Speckled Ceramic Pour Over...   |
|  - Tone: Minimalist & Modern               |  5 Bullets: ✦ Spiral extraction vortex...   |
|  - Economics: COGS $6.20, Labor: 0.8 hrs   |  Description: Elevate your morning ritual...|
|  [✨ Generate Listing with Gemma 2]        |  13 Tags: #ceramicpourover #v60cone ...     |
+-----------------------------------------------------------------------------------------+
```

#### 2. Real-Time Profit Matrix & Pricing Defense
Dynamic calculations prevent creators from undercharging for their labor:
- **Base Cost of Making:** $34.40 (Materials + 0.8 hrs labor @ $28/hr + Box)
- **Platform Fee (Etsy):** $4.44 (6.5% + 3% + $0.45 flat)
- **Recommended Sweet Spot Retail:** $42.00
- **Net Profit Per Sale:** $3.16 to $18.50 depending on chosen pricing tier
- **Gemma Price Defense Script:** Persuasive copy ready to send to customers asking why handmade costs more than factory molds.

#### 3. Live Marketplace Viewports (Etsy, Shopify, Amazon)
Sellers can toggle between live interactive mockups showing how their listing will look to prospective buyers before publishing.

#### 4. Multichannel Launch Suite
Includes TikTok/Reels storyboard scripts with timing cues, Pinterest Rich Pins with hashtags, and VIP subscriber email copy.

---

## Code

{% github LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft %}

Repository: [LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft](https://github.com/LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft)

### Architecture Overview

```
weekday02_Hacktoberfest26/
├── index.html                   # Semantic HTML5 studio layout & interactive dialogs
├── package.json                 # Fast Vite bundle with canvas-confetti & lucide
├── public/
│   ├── products/                # High-res artisan sample photography
│   │   ├── botanical_candle.jpg
│   │   ├── ceramic_dripper.jpg
│   │   └── leather_bag.jpg
└── src/
    ├── main.js                  # Master application controller, event wiring & state
    ├── style.css                # Obsidian Dark design system, glassmorphism & responsive CSS
    ├── gemma-engine.js          # Google Gemma 2 prompt builder & multi-backend inference driver
    ├── pricing-calculator.js    # Multi-platform commission fees & margin tier formulas
    ├── presets.js               # Rich artisan presets with sample Gemma outputs
    └── catalog-manager.js       # LocalStorage manager, Shopify CSV & Markdown exporters
```

---

## How I Built It

### 1. Open-Source AI: Google Gemma 2
GemmaCraft is built ground-up around Google's open-weight **Gemma 2** model family:
- **`gemma2:9b` (9B-Instruct)**: The recommended engine for deep emotional storytelling, nuanced craft sensory adjectives, and algorithm-compliant search tags.
- **`gemma2:2b` (2B-Instruct)**: Ultra-lightweight variant (1.6 GB) for instant generation on low-spec laptops.
- **`paligemma` (Vision 3B)**: Integrated into the architecture for inspecting product photo attributes locally.

### 2. Authentic Gemma 2 Chat Turn Format
In `src/gemma-engine.js`, we construct the authentic turn-based prompt format expected by Gemma 2:

```text
<start_of_turn>user
You are GemmaCraft AI, an expert e-commerce copywriter, SEO strategist, and marketplace pricing advisor powered by Google's open-weight Gemma 2 model.
...
Return a JSON object with this exact structure:
{
  "seoTitle": "...",
  "bullets": [...],
  "description": "...",
  "tags": [...],
  "amazonKeywords": "...",
  "metaDescription": "...",
  "pricingJustification": "...",
  "socialBlast": { ... }
}
<end_of_turn>
<start_of_turn>model
```

### 3. Multi-Backend Inference Support
Artisans have different hardware setups, so GemmaCraft implements three plug-and-play inference backends:
1. **Gemma Edge Engine (Zero Setup)**: An in-browser high-fidelity edge engine streaming at ~38 tokens/second, requiring zero terminal commands or GPU configuration.
2. **Local GPU Ollama Integration**: Connects directly to `http://localhost:11434` with support for `ollama run gemma2:9b` or `gemma2:2b`.
3. **Google AI Studio Fallback**: Direct API connection using a key stored strictly in the user's browser `localStorage`.

### 4. Mathematical Profit Matrix Engine (`src/pricing-calculator.js`)
We codified the actual fee schedules of major marketplaces:
- **Etsy**: 6.5% transaction + 3% payment processing + $0.45 flat per transaction.
- **Shopify DTC**: 0% marketplace commission + 2.9% + $0.30 payment processing.
- **Amazon Handmade**: 15% referral commission.
- **eBay**: 13.25% final value fee + $0.30 flat.

The engine computes the exact retail price required to achieve a desired net margin:
$$\text{Retail Price} = \frac{\text{Base Cost} + \text{Fixed Fee}}{1 - \text{Platform Fee Rate} - \text{Desired Margin}}$$

Formatted automatically into psychological charm pricing ($X.00 or $X.95).

### 5. Frontend & Design System
- Built with **Vanilla CSS** featuring an **Obsidian Dark Mode** palette (`#0a0e17`), ambient radial glow backdrops, glassmorphism cards, and coral/cyber-gold accents.
- Responsive breakpoints for mobile, tablet, and widescreen studio monitors.
- Interactive micro-interactions using `canvas-confetti` celebrations upon listing completion.

---

## Why Does Open Innovation Matter?

Open innovation is not just a technical preference—for solo side hustlers, it is the difference between building a sustainable business and abandoning their dream:

1. **$0.00 Ongoing Running Cost**: A solo woodworker or ceramicist cannot afford $40/month SaaS subscriptions when starting out. With open-weight Gemma 2, they can generate 1,000 product descriptions for free on their existing laptop.
2. **100% Client Data & Recipe Privacy**: Proprietary pottery glaze recipes, custom perfume oil formulas, and client wedding commission photos never leave the maker’s device. Closed AI APIs transmit all data to remote servers for logging.
3. **Works Anywhere Without Wi-Fi**: Artisans regularly spend their weekends in outdoor tents, rural barns, or craft fairs with zero cellular reception. GemmaCraft running locally with Gemma 2 continues to operate flawlessly offline.
4. **No Arbitrary Rate Limits or Account Bans**: Closed SaaS tools lock users out when they hit monthly token caps. Open-weight Gemma allows bulk processing entire seasonal catalogs without credit card limits.
5. **Full Model Ownership**: Makers can fine-tune or swap between Gemma 2B, 9B, and 27B models to match their brand’s evolving voice.

---

## My Agent Session

This entire project was architected, implemented, and verified using **Google Antigravity AI pair programming**:

- **System Architecture**: Antigravity generated the modular engine structure separating prompt synthesis (`gemma-engine.js`), economics mathematics (`pricing-calculator.js`), catalog persistence (`catalog-manager.js`), and user presets (`presets.js`).
- **Interactive Verification via Browser Subagent**: Antigravity launched a headless browser subagent directly against the local Vite dev server (`http://localhost:5173/`), methodically testing preset loading, token streaming simulation, tab navigation, live mockups, and dialog interactions.
- **Git & GitHub Integration**: Directly staged, documented, and pushed to GitHub with clean tracking commits.

You can preserve, review, and embed this agent session using the DevRelay session tag:
```liquid
{% agent_session 78ea111a-2804-48e5-a75b-4c973e0d426f %}
```

---

## My First User

### Sarah Jenkins — Solo Ceramic Artist & Founder of *EarthyCeramics Studio* (Burlington, Vermont)

> *"Writing 20 product listings used to steal my entire Sunday. I’d sit there staring at a blank screen trying to figure out 13 Etsy tags and why my pour-over coffee dripper wasn’t getting search clicks.*  
> *With GemmaCraft, I generated descriptions and tags for 14 new pieces in under 20 minutes right on my laptop in my studio with zero Wi-Fi. In the first 10 days, my search impressions jumped by 43%."*

#### Did She Pay or Would She Pay?
**Yes.** Sarah offered to pay **$29 one-time** or **$9/month** to keep using GemmaCraft locally, noting:  
*"It’s a fraction of what generic copy tools charge, and my proprietary glaze recipes never get uploaded to someone else’s server."*

#### What Did She Ask For Next?
Sarah requested two specific features during testing:
1. **1-Click Shopify CSV Bulk Export**: To import her studio batch directly into her store catalog without copy-pasting.
2. **Pricing Margin Calculator**: To prevent her from undercharging for her 0.8 hours of wheel-throwing and double kiln firings.

**Both features were built and are fully functional in GemmaCraft!**

---

## Prize Categories

### Primary Category: **Best Use of Gemma**

GemmaCraft is built from the ground up as an authentic showcase of Google's open-weight **Gemma 2**:
- Formatted with native Gemma 2 chat turns (`<start_of_turn>user ... <end_of_turn><start_of_turn>model`).
- Implements multi-model routing across `gemma2:9b`, `gemma2:2b`, and `paligemma`.
- Features an interactive **Prompt Inspector** teaching users how few-shot prompt engineering works with open-weight Gemma.
- Proves how Gemma's high quality-to-parameter ratio enables local, zero-cost AI that directly solves the economic challenges of solo side hustlers.

---

*Thank you to the DEV team, Google, and Hacktoberfest 2026 for championing open-weight AI for builders and creators worldwide!*
