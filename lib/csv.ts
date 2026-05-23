import type { SellerProduct } from './alerts';

type CsvRow = Record<string, string>;

export function parseCsvText(text: string): CsvRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map(normalizeHeader);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: CsvRow = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });

    return row;
  });
}

export function rowsToProducts(rows: CsvRow[]): SellerProduct[] {
  return rows.map((row, index) => {
    const sales = numberFrom(row.sales || row.revenue || row.total_sales);
    const orders = numberFrom(row.orders || row.order_count);
    const unitsSold = numberFrom(row.units_sold || row.units || row.quantity);
    const productCost = numberFrom(row.product_cost || row.cost || row.cogs);
    const amazonFees = numberFrom(row.amazon_fees || row.fees);
    const adSpend = numberFrom(row.ad_spend || row.ads || row.spend);
    const returns = numberFrom(row.returns || row.return_units);
    const stockUnits = numberFrom(row.stock_units || row.stock || row.inventory);
    const avgDailyUnits = numberFrom(row.avg_daily_units || row.daily_sales_units);
    const daysWithoutSale = numberFrom(row.days_without_sale || row.no_sale_days);
    const totalCost = productCost * Math.max(unitsSold, 1) + amazonFees + adSpend;
    const estimatedProfit = numberFrom(row.estimated_profit || row.profit) || sales - totalCost;
    const acos = sales > 0 ? round((adSpend / sales) * 100) : 0;
    const marginPercent = sales > 0 ? round((estimatedProfit / sales) * 100) : numberFrom(row.margin_percent || row.margin);
    const returnRate = unitsSold > 0 ? round((returns / unitsSold) * 100) : numberFrom(row.return_rate);

    return {
      sku: row.sku || row.asin || `SKU-${index + 1}`,
      name: row.product_name || row.product || row.name || `Product ${index + 1}`,
      sales,
      orders,
      unitsSold,
      estimatedProfit,
      adSpend,
      acos,
      marginPercent,
      returnRate,
      stockUnits,
      avgDailyUnits,
      daysWithoutSale
    };
  });
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function numberFrom(value: string | number | undefined): number {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
