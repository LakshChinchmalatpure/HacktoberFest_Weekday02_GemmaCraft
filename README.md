# 💎 GemmaCraft — The AI E-Commerce & Side Hustle Studio

> **Built for Hacktoberfest 2026 (Week 2: Side Hustle)**  
> **Target Category:** *Best Use of Gemma* — 100% Local, Open-Weight AI for Solo Artisans, Makers & Side Hustlers.

[![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemma 2](https://img.shields.io/badge/Google_Gemma_2-Open--Weight_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/gemma)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026_Week_2-FF7518?style=for-the-badge&logo=hacktoberfest&logoColor=white)](https://hacktoberfest.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**GemmaCraft** empowers independent creators, craftspeople, and solo e-commerce sellers to turn rough studio notes, materials lists, and product photos into high-converting 6-figure marketplace listings on **Etsy**, **Shopify DTC**, and **Amazon**.

Powered by Google's open-weight **Gemma 2** family (`gemma2:9b`, `gemma2:2b`, and `paligemma`), GemmaCraft eliminates recurring monthly SaaS copywriter fees and safeguards proprietary artisan techniques with 100% on-device privacy.

---

## 💡 Why Open Innovation Matters (Gemma vs Closed SaaS)

Solo side hustlers and independent makers often operate on razor-thin initial margins. Traditional copywriting SaaS tools charge $29–$49/month, log proprietary craft formulas on third-party cloud servers, and stop functioning when you are offline at a craft market or pop-up fair.

| Feature / Benefit | 🌟 GemmaCraft (Open-Weight Gemma 2) | ❌ Proprietary SaaS (Jasper / Copy.ai) |
| :--- | :--- | :--- |
| **Token & Subscription Cost** | **$0.00 Running Cost** (Run unlimited locally) | $29 – $49/mo recurring subscription |
| **Data Privacy & IP** | **100% On-Device Local Privacy** (Zero leaks) | Drafts & photos sent to external cloud |
| **Offline Capability** | **Works without internet** at artisan fairs | Completely inoperable without Wi-Fi |
| **Rate Caps & Throttles** | **Zero limits** (Batch export hundreds of SKUs) | Strict monthly word counts & credit tiers |
| **Model Customization** | Supports `9B`, `2B`, and `PaliGemma` vision models | Locked into closed vendor APIs |

---

## 🚀 Key Features

### 1. 📝 High-Converting Marketplace Listing Generator
- **SEO Optimized Title**: Engineered under 140 characters for mobile marketplace algorithms.
- **5 High-Conversion Bullet Points**: Highlighting craftsmanship, sensory daily experience, materials, dimensions, and gift presentation.
- **Sensory Storytelling Description**: Rich markdown description tailored to your brand tone of voice (*Artisan & Story-Driven*, *Luxury & Heirloom*, *Minimalist Modern*, *Etsy Warm & Playful*, or *Amazon Feature-Rich*).
- **13 Search Algorithm Tags**: Targeted long-tail keywords optimized for Etsy & Shopify search engines.
- **Amazon Backend Search Terms & Google Meta**: Hidden search terms and SEO descriptions ready for copy-pasting.

### 2. 💰 Profit Matrix & Psychological Pricing Calculator
- Real-time marketplace fee deductions for **Etsy** (6.5% transaction + 3% payment + $0.45 flat), **Shopify DTC** (2.9% + $0.30), **Amazon Handmade** (15%), and **eBay Direct** (13.25%).
- Computes true manufacturing cost based on **COGS**, **artisan labor hours**, **target hourly wage**, and **packaging/shipping**.
- Dynamic psychological pricing tiers:
  - **Launch / High-Velocity Tier** (20% Net Margin)
  - **The Sweet Spot Tier** (45% Net Margin, Recommended)
  - **Prestige / Heirloom Tier** (65% Net Margin)
- **Gemma Price Defense Script**: Persuasive rationale to help artisans confidently explain their price point to discerning buyers.

### 3. 📣 Multichannel Launch Social Blast
- **15-Second TikTok & Instagram Reel Storyboard**: 3-second hook with ASMR visual cues and audio narration scripts.
- **Pinterest Rich Pin**: Search-matched titles, keywords, and craft hashtags.
- **VIP Subscriber Email**: Direct-to-fan newsletter drop announcement.

### 4. 🛍️ Live Marketplace Viewport Mockups
- Interactive preview toggles replicating exact real-world interfaces:
  - **Etsy Search Card** (bestseller badges, star ratings, review counts, and tag pills)
  - **Shopify DTC Product Page** (vendor metadata, dynamic Shop Pay CTA, and highlights)
  - **Amazon Detail Buy Box** (Prime badge, review rating breakdowns, and Buy Box checkout)

### 5. 🔌 Multi-Backend Gemma 2 Inference
- **Gemma Edge Engine**: High-fidelity in-browser streaming simulation (~38 tok/s) with authentic Gemma 2 tokenizer output.
- **Local Ollama Integration**: Direct connection to your local GPU (`http://localhost:11434`) running `gemma2:9b` or `gemma2:2b`.
- **Google AI Studio API**: Optional direct API connection with local storage encryption.
- **Prompt Inspector**: View raw Google Gemma 2 turn templates (`<start_of_turn>user ... <end_of_turn><start_of_turn>model`).

### 6. 📦 Local Catalog Persistence & Exporters
- Auto-saves products locally via `localStorage`.
- **1-Click Shopify CSV Bulk Export**: Import listings directly into your Shopify store catalog.
- **Markdown Listing Export**: Save clean, formatted product documentation.
- **JSON Backup**: Backup and restore your catalog.

---

## 🎨 Curated Presets Included

1. **Cozy Hearth Lavender & Cedar Soy Candle** (Home & Living / Candles)
2. **Heritage Full-Grain Leather Messenger Bag** (Apparel & Accessories / Bags)
3. **Artisan Speckled Ceramic Pour-Over Dripper** (Kitchen & Specialty Coffee)

---

## 🛠️ Tech Stack

- **Core:** HTML5, Modern Vanilla JavaScript (ES Modules)
- **Styling:** Vanilla CSS with custom Design System (Obsidian Dark Theme, Glassmorphism, Micro-animations)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Libraries:** `canvas-confetti`, `lucide`
- **Typography:** Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*)

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- (Optional for full local GPU execution) [Ollama](https://ollama.com/) with Gemma 2 installed:
  ```bash
  ollama run gemma2:9b
  ```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LakshChinchmalatpure/HacktoberFest_Weekday02_GemmaCraft.git
   cd HacktoberFest_Weekday02_GemmaCraft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173/
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
weekday02_Hacktoberfest26/
├── index.html                   # Semantic HTML5 layout and modals
├── package.json                 # Project dependencies & scripts
├── public/                      # Static assets & sample product imagery
│   ├── favicon.svg
│   ├── icons.svg
│   └── products/
│       ├── botanical_candle.jpg
│       ├── ceramic_dripper.jpg
│       └── leather_bag.jpg
└── src/
    ├── main.js                  # Master application controller & event wiring
    ├── style.css                # Obsidian Dark Design System & responsive styles
    ├── gemma-engine.js          # Google Gemma 2 prompt builder & backend drivers
    ├── pricing-calculator.js    # Marketplace economics & margin calculator
    ├── presets.js               # Handcrafted product presets with sample outputs
    └── catalog-manager.js       # LocalStorage manager & Shopify CSV exporter
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use for independent makers, artisans, and side hustlers everywhere.
