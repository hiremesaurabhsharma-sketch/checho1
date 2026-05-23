export type SellerProduct = {
  sku: string;
  name: string;
  sales: number;
  orders: number;
  unitsSold: number;
  estimatedProfit: number;
  adSpend: number;
  acos: number;
  marginPercent: number;
  returnRate: number;
  stockUnits: number;
  avgDailyUnits: number;
  daysWithoutSale: number;
};

export type SellerAlert = {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  action: string;
};

export const sampleProducts: SellerProduct[] = [
  {
    sku: 'STL-BTL-1L',
    name: 'Steel Bottle 1L',
    sales: 184000,
    orders: 420,
    unitsSold: 445,
    estimatedProfit: -3528,
    adSpend: 27000,
    acos: 14.7,
    marginPercent: 11,
    returnRate: 6,
    stockUnits: 92,
    avgDailyUnits: 31,
    daysWithoutSale: 0
  },
  {
    sku: 'YGA-MAT-BLK',
    name: 'Yoga Mat Black',
    sales: 96000,
    orders: 210,
    unitsSold: 218,
    estimatedProfit: 18800,
    adSpend: 6200,
    acos: 6.4,
    marginPercent: 24,
    returnRate: 4,
    stockUnits: 28,
    avgDailyUnits: 9,
    daysWithoutSale: 0
  },
  {
    sku: 'LBOX-4CP',
    name: 'Lunch Box 4 Compartment',
    sales: 54000,
    orders: 122,
    unitsSold: 128,
    estimatedProfit: 7200,
    adSpend: 8400,
    acos: 15.5,
    marginPercent: 12,
    returnRate: 14,
    stockUnits: 180,
    avgDailyUnits: 2,
    daysWithoutSale: 4
  },
  {
    sku: 'PHONE-STAND',
    name: 'Phone Stand',
    sales: 0,
    orders: 0,
    unitsSold: 0,
    estimatedProfit: 0,
    adSpend: 0,
    acos: 0,
    marginPercent: 18,
    returnRate: 0,
    stockUnits: 300,
    avgDailyUnits: 0,
    daysWithoutSale: 38
  }
];

export function generateAlerts(products: SellerProduct[]): SellerAlert[] {
  const alerts: SellerAlert[] = [];

  for (const product of products) {
    if (product.estimatedProfit < 0) {
      alerts.push({
        id: `${product.sku}-loss`,
        title: 'Loss Product Alert',
        severity: 'High',
        message: `Vikash ji, ${product.name} aapko ghate me daal raha hai. Estimated loss ₹${Math.abs(product.estimatedProfit).toLocaleString('en-IN')} hai.`,
        action: 'Price badhao, ads spend kam karo, ya product cost dobara check karo.'
      });
    }

    if (product.acos > product.marginPercent && product.adSpend > 0) {
      alerts.push({
        id: `${product.sku}-ads`,
        title: 'Ads Waste Alert',
        severity: 'High',
        message: `${product.name} ka ACoS ${product.acos}% hai, jo margin ${product.marginPercent}% se zyada hai.`,
        action: 'Campaign bid kam karo, weak keywords pause karo, aur margin ke hisaab se budget set karo.'
      });
    }

    if (product.avgDailyUnits > 0 && product.stockUnits / product.avgDailyUnits < 7) {
      alerts.push({
        id: `${product.sku}-stock`,
        title: 'Low Stock Alert',
        severity: 'Medium',
        message: `${product.name} ka stock approx ${Math.ceil(product.stockUnits / product.avgDailyUnits)} din me khatam ho sakta hai.`,
        action: 'Reorder planning karo ya ads speed temporarily control karo.'
      });
    }

    if (product.returnRate > 10) {
      alerts.push({
        id: `${product.sku}-return`,
        title: 'High Return Alert',
        severity: 'Medium',
        message: `${product.name} ka return rate ${product.returnRate}% hai. Ye listing ya quality issue ho sakta hai.`,
        action: 'Return reason, images, size/description aur packaging check karo.'
      });
    }

    if (product.daysWithoutSale >= 30 && product.stockUnits > 0) {
      alerts.push({
        id: `${product.sku}-dead-stock`,
        title: 'Dead Stock Alert',
        severity: 'Low',
        message: `${product.name} ${product.daysWithoutSale} din se sell nahi hua aur stock pada hai.`,
        action: 'Coupon, price test, listing improvement ya clearance plan banao.'
      });
    }
  }

  return alerts;
}
