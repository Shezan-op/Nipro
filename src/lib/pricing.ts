import { Discount } from './types';

export interface PricingResult {
  finalPrice: number;
  savings: number;
  winningPromoTitle: string | null;
  originalPrice: number;
  hasDiscount: boolean;
}

export function calculateFinalPrice(basePrice: number | undefined, activeDiscounts: Discount[]): PricingResult {
  const safeBasePrice = basePrice || 0;
  
  if (!activeDiscounts || activeDiscounts.length === 0) {
    return {
      finalPrice: Math.round(safeBasePrice),
      savings: 0,
      winningPromoTitle: null,
      originalPrice: Math.round(safeBasePrice),
      hasDiscount: false,
    };
  }

  let maxSavings = 0;
  let winningPromo: Discount | null = null;
  let finalPrice = safeBasePrice;

  for (const discount of activeDiscounts) {
    if (!discount.is_active) continue;

    let savings = 0;
    if (discount.discount_type === 'percentage') {
      savings = safeBasePrice * (discount.discount_value / 100);
    } else if (discount.discount_type === 'flat') {
      savings = discount.discount_value;
    } else if (discount.discount_type === 'fixed') {
      savings = safeBasePrice - discount.discount_value;
    }

    let potentialPrice = safeBasePrice - savings;
    
    // Clamp to floor price
    if (discount.min_floor_price !== undefined && discount.min_floor_price !== null && potentialPrice < discount.min_floor_price) {
      potentialPrice = discount.min_floor_price;
      savings = safeBasePrice - potentialPrice;
    }

    if (potentialPrice < 0) {
      potentialPrice = 0;
      savings = safeBasePrice;
    }

    // Best value wins (highest savings)
    if (savings > maxSavings) {
      maxSavings = savings;
      finalPrice = potentialPrice;
      winningPromo = discount;
    }
  }

  return {
    finalPrice: Math.round(finalPrice),
    savings: Math.round(maxSavings),
    winningPromoTitle: winningPromo?.title || null,
    originalPrice: Math.round(safeBasePrice),
    hasDiscount: maxSavings > 0,
  };
}
