/**
 * Smart Profit Margin & Psychological Pricing Matrix
 * Handles marketplace commission fees, true cost of production, and Gemma pricing strategies.
 */

export const MARKETPLACE_FEES = {
  etsy: {
    name: 'Etsy',
    transactionPercent: 0.065, // 6.5% transaction
    paymentPercent: 0.03,     // 3% payment processing
    fixedPerSale: 0.45,       // $0.20 listing + $0.25 payment flat
    tagline: 'Best for handmade & vintage items with high buyer intent'
  },
  shopify: {
    name: 'Shopify DTC',
    transactionPercent: 0.00, // 0% with Shopify Payments
    paymentPercent: 0.029,    // 2.9% payment processing
    fixedPerSale: 0.30,       // $0.30 per transaction
    tagline: 'Direct-to-consumer store with zero marketplace commissions'
  },
  ebay: {
    name: 'eBay',
    transactionPercent: 0.1325, // 13.25% average final value fee
    paymentPercent: 0.00,       // Included in final value
    fixedPerSale: 0.30,
    tagline: 'High volume auctions & buy-it-now marketplace'
  },
  amazon: {
    name: 'Amazon Handmade',
    transactionPercent: 0.15,   // 15% referral fee
    paymentPercent: 0.00,       // Included
    fixedPerSale: 0.00,
    tagline: 'Massive organic search volume with higher fee structure'
  }
};

export function calculateEconomics({
  cogs = 5.0,
  laborHours = 0.5,
  hourlyWage = 30.0,
  packagingShipping = 3.0,
  targetMarketplace = 'etsy',
  customRetailPrice = null
}) {
  const laborCost = laborHours * hourlyWage;
  const baseCost = cogs + laborCost + packagingShipping;

  const platform = MARKETPLACE_FEES[targetMarketplace] || MARKETPLACE_FEES.etsy;

  // Formula to calculate retail price given a desired net profit margin %:
  // Retail = (BaseCost + FixedFee) / (1 - PlatformFeeRate - DesiredMargin)
  const calcPriceForMargin = (margin) => {
    const totalFeeRate = platform.transactionPercent + platform.paymentPercent;
    const denominator = 1 - totalFeeRate - margin;
    if (denominator <= 0.05) return baseCost * 2.5;
    const rawPrice = (baseCost + platform.fixedPerSale) / denominator;
    // Format to psychological charm pricing (.00, .95, or .99)
    return Math.ceil(rawPrice);
  };

  const penetrationPrice = calcPriceForMargin(0.20); // 20% net margin
  const sweetSpotPrice = calcPriceForMargin(0.45);   // 45% net margin
  const prestigePrice = calcPriceForMargin(0.65);    // 65% net margin

  // Evaluate the chosen or custom price
  const activePrice = customRetailPrice ? parseFloat(customRetailPrice) : sweetSpotPrice;
  const platformFee = (activePrice * (platform.transactionPercent + platform.paymentPercent)) + platform.fixedPerSale;
  const totalCost = baseCost + platformFee;
  const netProfit = activePrice - totalCost;
  const netMarginPercent = activePrice > 0 ? ((netProfit / activePrice) * 100).toFixed(1) : 0;
  const returnOnInvestment = baseCost > 0 ? ((netProfit / baseCost) * 100).toFixed(1) : 0;

  return {
    baseCost: parseFloat(baseCost.toFixed(2)),
    laborCost: parseFloat(laborCost.toFixed(2)),
    cogs: parseFloat(cogs.toFixed(2)),
    packagingShipping: parseFloat(packagingShipping.toFixed(2)),
    platformName: platform.name,
    platformFee: parseFloat(platformFee.toFixed(2)),
    activePrice: parseFloat(activePrice.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
    netMarginPercent: parseFloat(netMarginPercent),
    returnOnInvestment: parseFloat(returnOnInvestment),
    tiers: {
      penetration: {
        price: penetrationPrice,
        title: 'Launch / High-Velocity',
        desc: 'Priced to generate fast sales and collect 5-star reviews during your first 30 days.',
        margin: '20% Net Margin'
      },
      sweetSpot: {
        price: sweetSpotPrice,
        title: 'The Sweet Spot (Recommended)',
        desc: 'Optimal balance of healthy profit, marketing reinvestment, and artisan perceived value.',
        margin: '45% Net Margin'
      },
      prestige: {
        price: prestigePrice,
        title: 'Prestige / Heirloom Tier',
        desc: 'Positions your creation as an exclusive collector item. Anchors perceived luxury.',
        margin: '65% Net Margin'
      }
    }
  };
}
