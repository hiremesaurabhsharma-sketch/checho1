import type { SellerAlert, SellerProduct } from './alerts';

export function buildEmailSubject(alerts: SellerAlert[]): string {
  if (alerts.length === 0) return 'Aaj koi major Amazon alert nahi mila';
  return `${alerts.length} Amazon seller alerts need attention`;
}

export function buildEmailBody(sellerName: string, products: SellerProduct[], alerts: SellerAlert[]): string {
  const totalSales = products.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = products.reduce((sum, item) => sum + item.estimatedProfit, 0);
  const totalOrders = products.reduce((sum, item) => sum + item.orders, 0);

  const intro = `Hi ${sellerName},\n\nAapka Amazon seller summary ready hai.\n\nSales: ₹${totalSales.toLocaleString('en-IN')}\nOrders: ${totalOrders}\nEstimated Profit: ₹${totalProfit.toLocaleString('en-IN')}\nTotal Alerts: ${alerts.length}\n`;

  if (alerts.length === 0) {
    return `${intro}\nGood news: abhi koi major issue nahi mila.\n\n- Checho1`;
  }

  const alertLines = alerts
    .slice(0, 8)
    .map((alert, index) => `${index + 1}. ${alert.title}\n${alert.message}\nAction: ${alert.action}`)
    .join('\n\n');

  return `${intro}\nImportant alerts:\n\n${alertLines}\n\nPlease review these products today.\n\n- Checho1`;
}
