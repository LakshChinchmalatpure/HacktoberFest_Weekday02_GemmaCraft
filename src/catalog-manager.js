/**
 * Catalog Manager & Batch Exporter Module
 * Persists generated products to localStorage and exports to standard Shopify CSV, JSON, and Markdown.
 */

const STORAGE_KEY = 'gemmacraft_catalog';

export class CatalogManager {
  constructor() {
    this.listings = this.loadListings();
  }

  loadListings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to load catalog from localStorage', e);
      return [];
    }
  }

  saveListing(product) {
    const item = {
      id: product.id || 'prod_' + Date.now(),
      savedAt: new Date().toISOString(),
      name: product.name,
      category: product.category,
      marketplace: product.marketplace,
      image: product.image,
      economics: product.economics,
      pricing: product.pricing,
      output: product.output
    };

    const existingIndex = this.listings.findIndex(l => l.id === item.id);
    if (existingIndex >= 0) {
      this.listings[existingIndex] = item;
    } else {
      this.listings.unshift(item);
    }

    this._persist();
    return item;
  }

  deleteListing(id) {
    this.listings = this.listings.filter(l => l.id !== id);
    this._persist();
  }

  getListing(id) {
    return this.listings.find(l => l.id === id);
  }

  getAll() {
    return this.listings;
  }

  _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.listings));
    } catch (e) {
      console.warn('Failed to save catalog to localStorage', e);
    }
  }

  /**
   * Generates Shopify & WooCommerce compatible CSV export
   */
  exportToShopifyCSV() {
    const headers = [
      'Handle',
      'Title',
      'Body (HTML)',
      'Vendor',
      'Type',
      'Tags',
      'Published',
      'Variant Price',
      'Cost per item',
      'Variant SKU',
      'SEO Title',
      'SEO Description'
    ];

    const rows = this.listings.map(item => {
      const handle = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const title = item.output?.seoTitle || item.name;
      const body = (item.output?.description || '').replace(/"/g, '""');
      const vendor = 'Artisan Studio';
      const type = item.category || 'Handcrafted';
      const tags = (item.output?.tags || []).join(', ');
      const price = item.pricing?.activePrice || item.economics?.currentMarketPrice || '25.00';
      const cost = item.economics?.cogs || '5.00';
      const sku = `ART-${handle.slice(0, 8).toUpperCase()}`;
      const seoTitle = (item.output?.seoTitle || title).replace(/"/g, '""');
      const seoDesc = (item.output?.metaDescription || '').replace(/"/g, '""');

      return [
        `"${handle}"`,
        `"${title.replace(/"/g, '""')}"`,
        `"${body}"`,
        `"${vendor}"`,
        `"${type}"`,
        `"${tags.replace(/"/g, '""')}"`,
        'TRUE',
        `"${price}"`,
        `"${cost}"`,
        `"${sku}"`,
        `"${seoTitle}"`,
        `"${seoDesc}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    this._downloadFile(csvContent, 'gemmacraft_shopify_export.csv', 'text/csv;charset=utf-8;');
  }

  exportToJSON() {
    const dataStr = JSON.stringify(this.listings, null, 2);
    this._downloadFile(dataStr, 'gemmacraft_catalog.json', 'application/json');
  }

  exportListingMarkdown(id) {
    const item = this.getListing(id) || this.listings[0];
    if (!item) return;

    const md = `# ${item.output?.seoTitle || item.name}

**Category:** ${item.category}  
**Marketplace:** ${item.marketplace}  
**Retail Price:** $${item.pricing?.activePrice || item.economics?.currentMarketPrice || '0.00'}  
**Unit Production Cost:** $${item.pricing?.baseCost || '0.00'}  
**Estimated Net Margin:** ${item.pricing?.netMarginPercent || 0}%  

---

## 5 High-Conversion Bullet Points
${(item.output?.bullets || []).map(b => `- ${b}`).join('\n')}

---

## Product Description
${item.output?.description || ''}

---

## 13 Search Algorithm Tags (Etsy / Shopify)
\`${(item.output?.tags || []).join(', ')}\`

## Amazon Search Keywords
\`${item.output?.amazonKeywords || ''}\`

## SEO Meta Description
_${item.output?.metaDescription || ''}_

---

## Multichannel Launch Copy
### TikTok / Reel Hook & Script
**Hook:** ${item.output?.socialBlast?.reelHook || ''}  
**Storyboard:**  
${item.output?.socialBlast?.reelScript || ''}

### Pinterest Rich Pin
**Title:** ${item.output?.socialBlast?.pinterestTitle || ''}  
**Description:** ${item.output?.socialBlast?.pinterestDesc || ''}

### VIP Email Drop
**Subject:** ${item.output?.socialBlast?.emailSubject || ''}  
**Body:**  
${item.output?.socialBlast?.emailBody || ''}
`;

    this._downloadFile(md, `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_listing.md`, 'text/markdown');
  }

  _downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
}
