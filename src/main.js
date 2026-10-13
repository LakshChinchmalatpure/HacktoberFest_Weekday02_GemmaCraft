/**
 * GemmaCraft — Main Application Controller
 * Connects open-weight Gemma 2 intelligence engine, dynamic pricing matrix,
 * preset library, catalog persistence, and multi-channel commerce studio.
 */

import './style.css';
import confetti from 'canvas-confetti';
import { PRESETS } from './presets.js';
import { GemmaEngine } from './gemma-engine.js';
import { calculateEconomics } from './pricing-calculator.js';
import { CatalogManager } from './catalog-manager.js';

// Application Instances
const engine = new GemmaEngine();
const catalogManager = new CatalogManager();

// Global Application State
let activePresetId = 'botanical-candle';
let activeTone = 'Artisan & Story-Driven';
let currentProductImage = '/products/botanical_candle.jpg';
let activeCustomPrice = null;
let currentOutput = null;
let isGenerating = false;

// Simple Markdown to HTML Formatter for Description Box
function renderMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^1\. (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/g, '<p></p>')
    .replace(/\n/g, '<br/>');
}

// Toast Notification Utility
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

// Seed Initial Catalog if Empty
function seedCatalogIfEmpty() {
  if (catalogManager.getAll().length === 0) {
    PRESETS.forEach(preset => {
      const econ = calculateEconomics({
        cogs: preset.economics.cogs,
        laborHours: preset.economics.laborHours,
        hourlyWage: preset.economics.hourlyWage,
        packagingShipping: preset.economics.packagingShipping,
        targetMarketplace: preset.marketplace.toLowerCase().includes('etsy') ? 'etsy' : 'shopify',
        customRetailPrice: preset.economics.currentMarketPrice
      });
      catalogManager.saveListing({
        id: preset.id,
        name: preset.name,
        category: preset.category,
        marketplace: preset.marketplace,
        image: preset.image,
        economics: preset.economics,
        pricing: econ,
        output: preset.sampleGemmaOutput
      });
    });
  }
  updateCatalogBadge();
}

// Update Header Catalog Badges
function updateCatalogBadge() {
  const count = catalogManager.getAll().length;
  const badge = document.getElementById('catalog-counter');
  const modalCount = document.getElementById('catalog-modal-count');
  if (badge) badge.textContent = count;
  if (modalCount) modalCount.textContent = `(${count} items stored locally)`;
}

// Render Presets Quick Switcher Strip
function renderPresetStrip() {
  const container = document.getElementById('preset-container');
  if (!container) return;

  container.innerHTML = PRESETS.map(p => `
    <div class="preset-card ${p.id === activePresetId ? 'active' : ''}" data-preset-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="preset-thumbnail" />
      <div class="preset-card-content">
        <div class="preset-top-row">
          <span class="preset-category-tag">${p.category.split('/')[0].trim()}</span>
          <span class="preset-price-tag">$${p.economics.currentMarketPrice.toFixed(2)}</span>
        </div>
        <h4 class="preset-name">${p.name}</h4>
        <div class="preset-footer-row">
          <span class="preset-channel-tag">📌 ${p.marketplace}</span>
          <button type="button" class="btn btn-xs btn-outline btn-load-preset" data-preset-id="${p.id}">Load Preset</button>
        </div>
      </div>
    </div>
  `).join('');

  // Attach card and button click listeners
  container.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const id = card.dataset.presetId;
      loadPreset(id);
    });
  });
}

// Load Preset Data into Workspace
function loadPreset(presetId) {
  const preset = PRESETS.find(p => p.id === presetId);
  if (!preset) return;

  activePresetId = presetId;
  activeTone = preset.tone;
  currentProductImage = preset.image;
  activeCustomPrice = preset.economics.currentMarketPrice;
  currentOutput = JSON.parse(JSON.stringify(preset.sampleGemmaOutput));

  // Update Preset Cards Active State
  document.querySelectorAll('.preset-card').forEach(card => {
    card.classList.toggle('active', card.dataset.presetId === presetId);
  });

  // Populate Form Fields
  document.getElementById('input-product-name').value = preset.name;
  
  const catSelect = document.getElementById('input-category');
  if ([...catSelect.options].some(o => o.value === preset.category)) {
    catSelect.value = preset.category;
  } else {
    catSelect.selectedIndex = 0;
  }

  const marketSelect = document.getElementById('input-marketplace');
  const marketKey = preset.marketplace.toLowerCase().includes('etsy') ? 'etsy' : 
                    preset.marketplace.toLowerCase().includes('shopify') ? 'shopify' : 
                    preset.marketplace.toLowerCase().includes('amazon') ? 'amazon' : 'etsy';
  marketSelect.value = marketKey;

  // Tone Pills
  document.querySelectorAll('#tone-selector .tone-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.tone === preset.tone);
  });

  document.getElementById('input-materials').value = preset.materials;
  document.getElementById('input-features').value = preset.features;
  document.getElementById('input-usp').value = preset.usp;
  document.getElementById('input-target-audience').value = preset.targetAudience;

  // Image Preview
  const imgPreview = document.getElementById('form-image-preview');
  if (imgPreview) imgPreview.src = preset.image;

  // Economics
  document.getElementById('econ-cogs').value = preset.economics.cogs;
  document.getElementById('econ-labor-hours').value = preset.economics.laborHours;
  document.getElementById('econ-hourly-wage').value = preset.economics.hourlyWage;
  document.getElementById('econ-packaging').value = preset.economics.packagingShipping;

  // Render Outputs
  renderAllOutputs(currentOutput);
  showToast(`Loaded preset: ${preset.name}`, 'info');
}

// Gather Current Form Inputs
function getProductFormData() {
  return {
    name: document.getElementById('input-product-name')?.value || '',
    category: document.getElementById('input-category')?.value || 'Home & Living',
    marketplace: document.getElementById('input-marketplace')?.value || 'etsy',
    tone: activeTone,
    image: currentProductImage,
    materials: document.getElementById('input-materials')?.value || '',
    features: document.getElementById('input-features')?.value || '',
    usp: document.getElementById('input-usp')?.value || '',
    targetAudience: document.getElementById('input-target-audience')?.value || '',
    economics: {
      cogs: parseFloat(document.getElementById('econ-cogs')?.value) || 0,
      laborHours: parseFloat(document.getElementById('econ-labor-hours')?.value) || 0,
      hourlyWage: parseFloat(document.getElementById('econ-hourly-wage')?.value) || 0,
      packagingShipping: parseFloat(document.getElementById('econ-packaging')?.value) || 0,
      currentMarketPrice: activeCustomPrice || 25.0
    }
  };
}

// Render All Studio Outputs
function renderAllOutputs(output) {
  if (!output) return;

  const product = getProductFormData();

  // Tab 1: Marketplace Listing
  const titleEl = document.getElementById('output-seo-title');
  if (titleEl) titleEl.textContent = output.seoTitle || product.name;

  const titleCharEl = document.getElementById('title-char-count');
  if (titleCharEl) {
    const len = (output.seoTitle || '').length;
    titleCharEl.textContent = `${len} / 140 chars`;
    titleCharEl.style.color = len > 140 ? '#ef4444' : len >= 80 ? '#34d399' : '#f59e0b';
  }

  // Bullets
  const bulletsList = document.getElementById('output-bullets-list');
  if (bulletsList) {
    bulletsList.innerHTML = (output.bullets || []).map(b => `
      <li class="bullet-item">
        <span class="bullet-dot">✦</span>
        <span class="bullet-text">${b}</span>
      </li>
    `).join('');
  }

  // Description
  const descEl = document.getElementById('output-description');
  if (descEl) {
    descEl.innerHTML = renderMarkdown(output.description || '');
  }

  // Tags Cloud
  const tagsCloud = document.getElementById('output-tags-cloud');
  if (tagsCloud) {
    tagsCloud.innerHTML = (output.tags || []).map(tag => `
      <span class="tag-chip" title="Click to copy tag" data-tag="${tag}">
        #${tag}
      </span>
    `).join('');

    tagsCloud.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        navigator.clipboard.writeText(chip.dataset.tag);
        showToast(`Copied tag: #${chip.dataset.tag}`, 'success');
      });
    });
  }

  // Backend Keywords & Meta
  const amzKwEl = document.getElementById('output-amazon-keywords');
  if (amzKwEl) amzKwEl.textContent = output.amazonKeywords || '';

  const metaDescEl = document.getElementById('output-meta-description');
  if (metaDescEl) metaDescEl.textContent = output.metaDescription || '';

  // Tab 2: Profit & Pricing Matrix
  updatePricingMatrix(product, output);

  // Tab 3: Multi-Channel Social Blast
  const blast = output.socialBlast || {};
  const reelHookEl = document.getElementById('social-reel-hook');
  if (reelHookEl) reelHookEl.textContent = blast.reelHook || 'Stop buying mass-produced goods...';

  const reelScriptEl = document.getElementById('social-reel-script');
  if (reelScriptEl) reelScriptEl.textContent = blast.reelScript || '';

  const pinTitleEl = document.getElementById('social-pin-title');
  if (pinTitleEl) pinTitleEl.textContent = blast.pinterestTitle || '';

  const pinDescEl = document.getElementById('social-pin-desc');
  if (pinDescEl) pinDescEl.textContent = blast.pinterestDesc || '';

  const emailSubjEl = document.getElementById('social-email-subj');
  if (emailSubjEl) emailSubjEl.textContent = blast.emailSubject || '';

  const emailBodyEl = document.getElementById('social-email-body');
  if (emailBodyEl) {
    emailBodyEl.innerHTML = (blast.emailBody || '').replace(/\n/g, '<br/>');
  }

  // Tab 4: Live Marketplace Mockups
  updateMarketplaceMockups(product, output);
}

// Calculate and Update Profit & Pricing Matrix
function updatePricingMatrix(product, output) {
  const econ = calculateEconomics({
    cogs: product.economics.cogs,
    laborHours: product.economics.laborHours,
    hourlyWage: product.economics.hourlyWage,
    packagingShipping: product.economics.packagingShipping,
    targetMarketplace: product.marketplace,
    customRetailPrice: activeCustomPrice
  });

  const platformNameEl = document.getElementById('pricing-platform-name');
  if (platformNameEl) platformNameEl.textContent = econ.platformName;

  const recPriceEl = document.getElementById('price-recommended-value');
  if (recPriceEl) recPriceEl.textContent = `$${econ.activePrice.toFixed(2)}`;

  const baseCostEl = document.getElementById('fin-base-cost');
  if (baseCostEl) baseCostEl.textContent = `$${econ.baseCost.toFixed(2)}`;

  const platFeeEl = document.getElementById('fin-platform-fee');
  if (platFeeEl) platFeeEl.textContent = `$${econ.platformFee.toFixed(2)}`;

  const netProfEl = document.getElementById('fin-net-profit');
  if (netProfEl) netProfEl.textContent = `$${econ.netProfit.toFixed(2)}`;

  const marginPctEl = document.getElementById('fin-margin-pct');
  if (marginPctEl) marginPctEl.textContent = `${econ.netMarginPercent}% Net Margin`;

  const roiEl = document.getElementById('fin-roi');
  if (roiEl) roiEl.textContent = `${econ.returnOnInvestment}%`;

  // Render 3 Pricing Tiers
  const tiersContainer = document.getElementById('pricing-tiers-container');
  if (tiersContainer) {
    const { penetration, sweetSpot, prestige } = econ.tiers;
    tiersContainer.innerHTML = `
      <div class="pricing-tier-card ${activeCustomPrice === penetration.price ? 'active' : ''}">
        <div class="tier-badge launch">${penetration.title}</div>
        <div class="tier-price">$${penetration.price.toFixed(2)}</div>
        <div class="tier-margin">${penetration.margin}</div>
        <p class="tier-desc">${penetration.desc}</p>
        <button class="btn btn-sm btn-outline btn-apply-tier" data-price="${penetration.price}">Apply Launch Price</button>
      </div>

      <div class="pricing-tier-card recommended ${activeCustomPrice === sweetSpot.price ? 'active' : ''}">
        <div class="tier-badge recommended-badge">★ ${sweetSpot.title}</div>
        <div class="tier-price">$${sweetSpot.price.toFixed(2)}</div>
        <div class="tier-margin">${sweetSpot.margin}</div>
        <p class="tier-desc">${sweetSpot.desc}</p>
        <button class="btn btn-sm btn-primary btn-apply-tier" data-price="${sweetSpot.price}">Apply Recommended</button>
      </div>

      <div class="pricing-tier-card ${activeCustomPrice === prestige.price ? 'active' : ''}">
        <div class="tier-badge prestige">${prestige.title}</div>
        <div class="tier-price">$${prestige.price.toFixed(2)}</div>
        <div class="tier-margin">${prestige.margin}</div>
        <p class="tier-desc">${prestige.desc}</p>
        <button class="btn btn-sm btn-outline btn-apply-tier" data-price="${prestige.price}">Apply Prestige Price</button>
      </div>
    `;

    tiersContainer.querySelectorAll('.btn-apply-tier').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCustomPrice = parseFloat(btn.dataset.price);
        updatePricingMatrix(product, output);
        updateMarketplaceMockups(product, output);
        showToast(`Applied retail price: $${activeCustomPrice.toFixed(2)}`, 'success');
      });
    });
  }

  // Price Justification Script
  const justEl = document.getElementById('output-pricing-justification');
  if (justEl) {
    justEl.textContent = output?.pricingJustification || 
      `Each piece is meticulously crafted using high-grade materials and over ${product.economics.laborHours} hours of artisan labor, ensuring lasting heirloom quality that factory duplicates cannot match.`;
  }
}

// Update Marketplace Previews & Mockups
function updateMarketplaceMockups(product, output) {
  const price = (activeCustomPrice || product.economics.currentMarketPrice || 24.00).toFixed(2);
  const title = output?.seoTitle || product.name || 'Artisan Product';
  const img = currentProductImage;

  // 1. Etsy
  const etsyImg = document.getElementById('etsy-mockup-img');
  if (etsyImg) etsyImg.src = img;
  const etsyTitle = document.getElementById('etsy-mockup-title');
  if (etsyTitle) etsyTitle.textContent = title;
  const etsyPrice = document.getElementById('etsy-mockup-price');
  if (etsyPrice) etsyPrice.textContent = `$${price}`;

  const etsyTags = document.getElementById('etsy-mockup-tags');
  if (etsyTags && output?.tags) {
    etsyTags.innerHTML = output.tags.slice(0, 3).map(t => `<span class="mini-tag">${t}</span>`).join('');
  }

  // 2. Shopify
  const shopifyImg = document.getElementById('shopify-mockup-img');
  if (shopifyImg) shopifyImg.src = img;
  const shopifyTitle = document.getElementById('shopify-mockup-title');
  if (shopifyTitle) shopifyTitle.textContent = product.name || title;
  const shopifyPrice = document.getElementById('shopify-mockup-price');
  if (shopifyPrice) shopifyPrice.textContent = `$${price} USD`;

  const shopifyBullets = document.getElementById('shopify-mockup-bullets');
  if (shopifyBullets && output?.bullets) {
    shopifyBullets.innerHTML = output.bullets.slice(0, 3).map(b => `<li>${b}</li>`).join('');
  }

  // 3. Amazon
  const amzImg = document.getElementById('amazon-mockup-img');
  if (amzImg) amzImg.src = img;
  const amzTitle = document.getElementById('amazon-mockup-title');
  if (amzTitle) amzTitle.textContent = title;
  
  const amzPriceDollars = document.getElementById('amazon-mockup-price');
  if (amzPriceDollars) {
    const parts = price.split('.');
    amzPriceDollars.textContent = parts[0];
    const amzCents = document.querySelector('.amz-cents');
    if (amzCents) amzCents.textContent = parts[1] || '00';
  }

  const amzBuyboxPrice = document.getElementById('amazon-buybox-price');
  if (amzBuyboxPrice) amzBuyboxPrice.textContent = `$${price}`;

  const amzBullets = document.getElementById('amazon-mockup-bullets');
  if (amzBullets && output?.bullets) {
    amzBullets.innerHTML = output.bullets.map(b => `<li>${b}</li>`).join('');
  }
}

// Handle Gemma Listing Generation
async function handleGenerateListing() {
  if (isGenerating) return;

  const product = getProductFormData();
  if (!product.name.trim()) {
    showToast('Please enter a Product Name first', 'info');
    document.getElementById('input-product-name')?.focus();
    return;
  }

  isGenerating = true;
  const statusCard = document.getElementById('generation-status');
  const statusPhase = document.getElementById('status-phase');
  const metricTokSec = document.getElementById('metric-tok-sec');
  const metricTokens = document.getElementById('metric-tokens');
  const metricModel = document.getElementById('metric-model-name');
  const btnGenerate = document.getElementById('btn-generate');

  if (statusCard) statusCard.style.display = 'flex';
  if (metricModel) metricModel.textContent = `Model: ${engine.config.model}`;
  if (btnGenerate) {
    btnGenerate.disabled = true;
    btnGenerate.style.opacity = '0.7';
  }

  let tokenCount = 0;
  const startTime = performance.now();

  try {
    const result = await engine.generateListing(product, (chunk, accumulated) => {
      tokenCount += Math.max(1, Math.round(chunk.length / 4));
      const elapsedSec = (performance.now() - startTime) / 1000;
      const speed = elapsedSec > 0 ? (tokenCount / elapsedSec).toFixed(1) : 38;

      if (statusPhase) statusPhase.textContent = `Gemma 2 Streaming... (${tokenCount} tokens)`;
      if (metricTokSec) metricTokSec.textContent = `⚡ ${speed} tok/s`;
      if (metricTokens) metricTokens.textContent = `Tokens: ${tokenCount}`;
    });

    currentOutput = result;
    activeCustomPrice = null; // Reset to let calculator suggest sweet spot
    renderAllOutputs(result);

    // Launch Confetti Celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#ff6b4a', '#f59e0b', '#38bdf8', '#10b981']
    });

    showToast('Listing generated with Gemma 2!', 'success');
  } catch (err) {
    console.error('Generation error:', err);
    showToast('Generation failed: ' + err.message, 'info');
  } finally {
    isGenerating = false;
    if (statusCard) statusCard.style.display = 'none';
    if (btnGenerate) {
      btnGenerate.disabled = false;
      btnGenerate.style.opacity = '1';
    }
  }
}

// Render Saved Catalog Modal
function renderCatalogModal() {
  const grid = document.getElementById('catalog-items-grid');
  if (!grid) return;

  const items = catalogManager.getAll();
  updateCatalogBadge();

  if (items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 16px; margin-bottom: 8px;">📦 Your catalog is currently empty.</p>
        <p style="font-size: 13px;">Generate or load products in the Listing Studio and click "Save to Catalog".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => `
    <div class="catalog-card" data-catalog-id="${item.id}">
      <img src="${item.image || '/products/botanical_candle.jpg'}" alt="${item.name}" class="catalog-card-img" />
      <div class="catalog-card-body">
        <h4 class="catalog-card-title">${item.name}</h4>
        <div class="catalog-card-meta">
          <span>${item.category || 'Handcrafted'}</span> • <span>${item.marketplace || 'Etsy'}</span>
        </div>
        <div class="catalog-card-price">
          $${(item.pricing?.activePrice || item.economics?.currentMarketPrice || 25).toFixed(2)}
        </div>
        <div class="catalog-card-actions">
          <button class="btn btn-xs btn-primary btn-load-catalog-item" data-id="${item.id}">Open in Studio</button>
          <button class="btn btn-xs btn-secondary btn-export-single-md" data-id="${item.id}">MD</button>
          <button class="btn btn-xs btn-outline btn-delete-catalog-item" data-id="${item.id}" title="Delete item">✕</button>
        </div>
      </div>
    </div>
  `).join('');

  // Catalog item actions
  grid.querySelectorAll('.btn-load-catalog-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = catalogManager.getListing(btn.dataset.id);
      if (!item) return;

      document.getElementById('input-product-name').value = item.name;
      currentProductImage = item.image;
      const imgPreview = document.getElementById('form-image-preview');
      if (imgPreview) imgPreview.src = item.image;

      if (item.economics) {
        document.getElementById('econ-cogs').value = item.economics.cogs || 5;
        document.getElementById('econ-labor-hours').value = item.economics.laborHours || 0.5;
        document.getElementById('econ-hourly-wage').value = item.economics.hourlyWage || 30;
        document.getElementById('econ-packaging').value = item.economics.packagingShipping || 3;
      }

      currentOutput = item.output;
      activeCustomPrice = item.pricing?.activePrice || null;
      renderAllOutputs(item.output);

      document.getElementById('modal-catalog')?.close();
      showToast(`Loaded ${item.name} into Studio`, 'info');
    });
  });

  grid.querySelectorAll('.btn-export-single-md').forEach(btn => {
    btn.addEventListener('click', () => {
      catalogManager.exportListingMarkdown(btn.dataset.id);
      showToast('Exported product Markdown file', 'success');
    });
  });

  grid.querySelectorAll('.btn-delete-catalog-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this item from your saved catalog?')) {
        catalogManager.deleteListing(btn.dataset.id);
        renderCatalogModal();
        showToast('Item deleted from catalog', 'info');
      }
    });
  });
}

// Copy Package Formatter
function copyEntireListingPackage() {
  const p = getProductFormData();
  const o = currentOutput;
  if (!o) {
    showToast('Generate or load a listing first', 'info');
    return;
  }

  const text = `=====================================================
${o.seoTitle || p.name}
=====================================================
Category: ${p.category}
Channel: ${p.marketplace}
Retail Price: $${(activeCustomPrice || p.economics.currentMarketPrice || 24).toFixed(2)}

-----------------------------------------------------
5 HIGH-CONVERTING BULLET POINTS:
-----------------------------------------------------
${(o.bullets || []).map((b, i) => `${i + 1}. ${b}`).join('\n\n')}

-----------------------------------------------------
PRODUCT DESCRIPTION:
-----------------------------------------------------
${o.description || ''}

-----------------------------------------------------
13 SEARCH ALGORITHM TAGS:
-----------------------------------------------------
${(o.tags || []).join(', ')}

-----------------------------------------------------
AMAZON BACKEND SEARCH TERMS:
-----------------------------------------------------
${o.amazonKeywords || ''}

-----------------------------------------------------
GOOGLE SEO META DESCRIPTION:
-----------------------------------------------------
${o.metaDescription || ''}

-----------------------------------------------------
PRICE JUSTIFICATION SCRIPT:
-----------------------------------------------------
${o.pricingJustification || ''}

-----------------------------------------------------
TIKTOK / REEL 15s SCRIPT:
-----------------------------------------------------
Hook: ${o.socialBlast?.reelHook || ''}
Script:
${o.socialBlast?.reelScript || ''}

-----------------------------------------------------
PINTEREST RICH PIN:
-----------------------------------------------------
Title: ${o.socialBlast?.pinterestTitle || ''}
Description: ${o.socialBlast?.pinterestDesc || ''}

-----------------------------------------------------
VIP EMAIL DROP:
-----------------------------------------------------
Subject: ${o.socialBlast?.emailSubject || ''}
Body:
${o.socialBlast?.emailBody || ''}
`;

  navigator.clipboard.writeText(text);
  confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
  showToast('Copied full listing package to clipboard!', 'success');
}

// Setup Dialog Backdrop Close
function setupDialogBackdropClose(dialog) {
  if (!dialog) return;
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });
}

// Bind All DOM Events
function bindEvents() {
  // Brand Logo Scroll to Top
  document.getElementById('brand-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Top Nav Items
  document.getElementById('nav-studio')?.addEventListener('click', () => {
    document.querySelectorAll('.main-nav .nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-studio')?.classList.add('active');
    document.getElementById('tab-btn-listing')?.click();
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-pricing')?.addEventListener('click', () => {
    document.querySelectorAll('.main-nav .nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-pricing')?.classList.add('active');
    document.getElementById('tab-btn-pricing')?.click();
    document.querySelector('.panel-output')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-social')?.addEventListener('click', () => {
    document.querySelectorAll('.main-nav .nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-social')?.classList.add('active');
    document.getElementById('tab-btn-social')?.click();
    document.querySelector('.panel-output')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-preview')?.addEventListener('click', () => {
    document.querySelectorAll('.main-nav .nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-preview')?.classList.add('active');
    document.getElementById('tab-btn-mockup')?.click();
    document.querySelector('.panel-output')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-catalog')?.addEventListener('click', () => {
    renderCatalogModal();
    document.getElementById('modal-catalog')?.showModal();
  });

  // Tone Pills
  document.querySelectorAll('#tone-selector .tone-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#tone-selector .tone-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTone = pill.dataset.tone;
    });
  });

  // Marketplace Change -> update fees
  document.getElementById('input-marketplace')?.addEventListener('change', () => {
    const product = getProductFormData();
    updatePricingMatrix(product, currentOutput);
  });

  // Economics Inputs change -> update live
  ['econ-cogs', 'econ-labor-hours', 'econ-hourly-wage', 'econ-packaging'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      const product = getProductFormData();
      updatePricingMatrix(product, currentOutput);
    });
  });

  // Image Upload Dropzone & File Input
  const dropzone = document.getElementById('image-dropzone');
  const fileInput = document.getElementById('file-input');
  const imgPreview = document.getElementById('form-image-preview');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          currentProductImage = loadEvent.target.result;
          if (imgPreview) imgPreview.src = currentProductImage;
          updateMarketplaceMockups(getProductFormData(), currentOutput);
          showToast('Product photo loaded locally', 'info');
        };
        reader.readAsDataURL(file);
      }
    });

    ['dragover', 'dragenter'].forEach(ev => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent-coral)';
      });
    });

    ['dragleave', 'drop'].forEach(ev => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '';
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          currentProductImage = loadEvent.target.result;
          if (imgPreview) imgPreview.src = currentProductImage;
          updateMarketplaceMockups(getProductFormData(), currentOutput);
          showToast('Product photo loaded locally', 'info');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Reset Form
  document.getElementById('btn-reset-form')?.addEventListener('click', () => {
    document.getElementById('product-form')?.reset();
    currentProductImage = '/products/botanical_candle.jpg';
    if (imgPreview) imgPreview.src = currentProductImage;
    activeCustomPrice = null;
    showToast('Form cleared', 'info');
  });

  // Generate Button
  document.getElementById('btn-generate')?.addEventListener('click', handleGenerateListing);

  // Inspect Prompt Modal
  const modalPrompt = document.getElementById('modal-prompt');
  document.getElementById('btn-inspect-prompt')?.addEventListener('click', () => {
    const product = getProductFormData();
    const prompt = engine.buildGemmaPrompt(product);
    const codeBlock = document.getElementById('prompt-inspector-code');
    if (codeBlock) codeBlock.textContent = prompt;
    modalPrompt?.showModal();
  });
  document.getElementById('btn-close-prompt')?.addEventListener('click', () => modalPrompt?.close());
  document.getElementById('btn-close-prompt-2')?.addEventListener('click', () => modalPrompt?.close());
  document.getElementById('btn-copy-raw-prompt')?.addEventListener('click', () => {
    const code = document.getElementById('prompt-inspector-code')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code);
      showToast('Copied Gemma 2 raw prompt!', 'success');
    }
  });

  // First User Case Study Modal
  const modalFirstUser = document.getElementById('modal-first-user');
  document.getElementById('btn-first-user')?.addEventListener('click', () => modalFirstUser?.showModal());
  document.getElementById('btn-close-first-user')?.addEventListener('click', () => modalFirstUser?.close());
  document.getElementById('btn-close-first-user-2')?.addEventListener('click', () => modalFirstUser?.close());

  // Engine Settings Modal
  const modalSettings = document.getElementById('modal-settings');
  const openSettings = () => {
    // Populate current settings
    document.querySelectorAll('input[name="engine-backend"]').forEach(r => {
      r.checked = (r.value === engine.config.backend);
    });
    toggleBackendFields(engine.config.backend);

    const endpointInput = document.getElementById('ollama-endpoint');
    if (endpointInput) endpointInput.value = engine.config.ollamaEndpoint;

    const modelSelect = document.getElementById('ollama-model-select');
    if (modelSelect) modelSelect.value = engine.config.model;

    const keyInput = document.getElementById('google-api-key');
    if (keyInput) keyInput.value = engine.config.apiKey || '';

    const tempSlider = document.getElementById('setting-temperature');
    if (tempSlider) {
      tempSlider.value = engine.config.temperature;
      document.getElementById('temp-val').textContent = engine.config.temperature;
    }

    const tokenSlider = document.getElementById('setting-max-tokens');
    if (tokenSlider) {
      tokenSlider.value = engine.config.maxTokens;
      document.getElementById('tokens-val').textContent = engine.config.maxTokens;
    }

    modalSettings?.showModal();
  };

  document.getElementById('btn-open-settings')?.addEventListener('click', openSettings);
  document.getElementById('btn-engine-pill')?.addEventListener('click', openSettings);
  document.getElementById('btn-close-settings')?.addEventListener('click', () => modalSettings?.close());
  document.getElementById('btn-cancel-settings')?.addEventListener('click', () => modalSettings?.close());

  // Backend radio toggle
  function toggleBackendFields(backend) {
    const ollamaFields = document.getElementById('ollama-config-fields');
    const apiFields = document.getElementById('api-config-fields');
    if (ollamaFields) ollamaFields.style.display = backend === 'ollama' ? 'block' : 'none';
    if (apiFields) apiFields.style.display = backend === 'google_ai' ? 'block' : 'none';
  }

  document.querySelectorAll('input[name="engine-backend"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleBackendFields(e.target.value);
    });
  });

  // Settings Sliders
  document.getElementById('setting-temperature')?.addEventListener('input', (e) => {
    document.getElementById('temp-val').textContent = e.target.value;
  });
  document.getElementById('setting-max-tokens')?.addEventListener('input', (e) => {
    document.getElementById('tokens-val').textContent = e.target.value;
  });

  // Test Ollama Connection
  document.getElementById('btn-test-ollama')?.addEventListener('click', async () => {
    const endpoint = document.getElementById('ollama-endpoint')?.value;
    const testMsg = document.getElementById('ollama-test-msg');
    if (testMsg) {
      testMsg.className = 'ollama-status-msg';
      testMsg.style.display = 'block';
      testMsg.textContent = 'Testing connection to Ollama...';
    }

    engine.config.ollamaEndpoint = endpoint;
    const res = await engine.testOllamaConnection();
    if (testMsg) {
      testMsg.className = `ollama-status-msg ${res.success ? 'success' : 'error'}`;
      testMsg.textContent = res.message;
    }
  });

  // Save Settings
  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const selectedBackend = document.querySelector('input[name="engine-backend"]:checked')?.value || 'edge';
    const endpoint = document.getElementById('ollama-endpoint')?.value || 'http://localhost:11434';
    const model = document.getElementById('ollama-model-select')?.value || 'gemma2:9b';
    const apiKey = document.getElementById('google-api-key')?.value || '';
    const temp = parseFloat(document.getElementById('setting-temperature')?.value) || 0.7;
    const maxTokens = parseInt(document.getElementById('setting-max-tokens')?.value, 10) || 1500;

    engine.saveSettings({
      backend: selectedBackend,
      ollamaEndpoint: endpoint,
      model,
      apiKey,
      temperature: temp,
      maxTokens
    });

    const label = document.getElementById('active-engine-label');
    if (label) {
      if (selectedBackend === 'ollama') label.textContent = `Ollama (${model})`;
      else if (selectedBackend === 'google_ai') label.textContent = 'Google AI Studio';
      else label.textContent = 'Gemma 2 (Edge Engine)';
    }

    modalSettings?.close();
    showToast('Engine configuration updated!', 'success');
  });

  // Catalog Modal and Actions
  const modalCatalog = document.getElementById('modal-catalog');
  document.getElementById('btn-close-catalog')?.addEventListener('click', () => modalCatalog?.close());
  document.getElementById('btn-close-catalog-2')?.addEventListener('click', () => modalCatalog?.close());

  document.getElementById('btn-save-catalog')?.addEventListener('click', () => {
    const product = getProductFormData();
    const econ = calculateEconomics({
      cogs: product.economics.cogs,
      laborHours: product.economics.laborHours,
      hourlyWage: product.economics.hourlyWage,
      packagingShipping: product.economics.packagingShipping,
      targetMarketplace: product.marketplace,
      customRetailPrice: activeCustomPrice
    });

    catalogManager.saveListing({
      name: product.name,
      category: product.category,
      marketplace: product.marketplace,
      image: currentProductImage,
      economics: product.economics,
      pricing: econ,
      output: currentOutput
    });

    updateCatalogBadge();
    showToast('Listing saved to your local catalog!', 'success');
  });

  // Export Buttons
  document.getElementById('catalog-btn-shopify-csv')?.addEventListener('click', () => {
    catalogManager.exportToShopifyCSV();
    showToast('Shopify CSV exported', 'success');
  });
  document.getElementById('btn-export-shopify-csv')?.addEventListener('click', () => {
    catalogManager.exportToShopifyCSV();
    showToast('Shopify CSV exported', 'success');
  });

  document.getElementById('catalog-btn-json')?.addEventListener('click', () => {
    catalogManager.exportToJSON();
    showToast('Catalog backup JSON exported', 'success');
  });
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    catalogManager.exportToJSON();
    showToast('Catalog backup JSON exported', 'success');
  });

  document.getElementById('btn-export-md')?.addEventListener('click', () => {
    const product = getProductFormData();
    const econ = calculateEconomics({
      cogs: product.economics.cogs,
      laborHours: product.economics.laborHours,
      hourlyWage: product.economics.hourlyWage,
      packagingShipping: product.economics.packagingShipping,
      targetMarketplace: product.marketplace,
      customRetailPrice: activeCustomPrice
    });
    const tempItem = {
      name: product.name,
      category: product.category,
      marketplace: product.marketplace,
      image: currentProductImage,
      economics: product.economics,
      pricing: econ,
      output: currentOutput
    };
    catalogManager.saveListing(tempItem);
    catalogManager.exportListingMarkdown(tempItem.id);
    showToast('Markdown exported', 'success');
  });

  document.getElementById('btn-copy-all-package')?.addEventListener('click', copyEntireListingPackage);

  // Tab Switchers in Right Panel
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.dataset.tab;
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      trigger.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Mockup Switcher Buttons
  const mockupSwitches = document.querySelectorAll('.btn-mockup-switch');
  const mockups = {
    etsy: document.getElementById('mockup-view-etsy'),
    shopify: document.getElementById('mockup-view-shopify'),
    amazon: document.getElementById('mockup-view-amazon')
  };

  mockupSwitches.forEach(btn => {
    btn.addEventListener('click', () => {
      mockupSwitches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.mockup;

      Object.entries(mockups).forEach(([key, el]) => {
        if (el) el.style.display = key === target ? 'block' : 'none';
      });
    });
  });

  // Individual Copy Buttons
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.copy;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        navigator.clipboard.writeText(targetEl.textContent.trim());
        showToast('Copied to clipboard!', 'success');
      }
    });
  });

  document.getElementById('btn-copy-bullets')?.addEventListener('click', () => {
    const bullets = currentOutput?.bullets || [];
    if (bullets.length) {
      navigator.clipboard.writeText(bullets.join('\n'));
      showToast('Copied all 5 bullets!', 'success');
    }
  });

  document.getElementById('btn-copy-tags')?.addEventListener('click', () => {
    const tags = currentOutput?.tags || [];
    if (tags.length) {
      navigator.clipboard.writeText(tags.join(', '));
      showToast('Copied 13 tags (CSV)!', 'success');
    }
  });

  document.getElementById('btn-copy-reel')?.addEventListener('click', () => {
    const hook = document.getElementById('social-reel-hook')?.textContent || '';
    const script = document.getElementById('social-reel-script')?.textContent || '';
    navigator.clipboard.writeText(`HOOK:\n${hook}\n\nSTORYBOARD:\n${script}`);
    showToast('Copied TikTok / Reel script!', 'success');
  });

  document.getElementById('btn-copy-pin')?.addEventListener('click', () => {
    const title = document.getElementById('social-pin-title')?.textContent || '';
    const desc = document.getElementById('social-pin-desc')?.textContent || '';
    navigator.clipboard.writeText(`PIN TITLE:\n${title}\n\nDESCRIPTION:\n${desc}`);
    showToast('Copied Pinterest Pin copy!', 'success');
  });

  document.getElementById('btn-copy-email')?.addEventListener('click', () => {
    const subj = document.getElementById('social-email-subj')?.textContent || '';
    const body = document.getElementById('social-email-body')?.innerText || '';
    navigator.clipboard.writeText(`SUBJECT:\n${subj}\n\n${body}`);
    showToast('Copied VIP Email copy!', 'success');
  });

  // Interactive ROI Calculator Slider
  const roiSlider = document.getElementById('roi-listings-slider');
  const roiListingsCount = document.getElementById('roi-listings-count');
  const roiSavedMoney = document.getElementById('roi-saved-money');
  const roiSavedHours = document.getElementById('roi-saved-hours');

  if (roiSlider) {
    roiSlider.addEventListener('input', (e) => {
      const count = parseInt(e.target.value, 10);
      if (roiListingsCount) roiListingsCount.textContent = count;

      // Closed SaaS like Jasper/Copy.ai charges ~$39/mo base + word add-ons
      const baseYearlySaaS = 468;
      const extraVolumeFees = count > 30 ? (count - 30) * 0.40 * 12 : 0;
      const totalSavedSaaS = Math.round(baseYearlySaaS + extraVolumeFees);

      // Solo maker spends ~30-40 mins manually writing/optimizing listing
      const hoursSaved = Math.round(count * 0.5 * 12);

      if (roiSavedMoney) roiSavedMoney.textContent = `$${totalSavedSaaS} / yr`;
      if (roiSavedHours) roiSavedHours.textContent = `${hoursSaved} hrs / yr`;
    });
  }

  // Setup backdrop click for all modals
  [modalSettings, modalPrompt, modalFirstUser, modalCatalog].forEach(setupDialogBackdropClose);
}

// Application Bootstrap
function init() {
  seedCatalogIfEmpty();
  renderPresetStrip();
  bindEvents();
  loadPreset('botanical-candle');
  console.log('💎 GemmaCraft Commerce Studio initialized successfully.');
}

// Start on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
