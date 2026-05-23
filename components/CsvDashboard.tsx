'use client';

import { useMemo, useState } from 'react';
import { generateAlerts, sampleProducts, type SellerProduct } from '../lib/alerts';
import { parseCsvText, rowsToProducts } from '../lib/csv';

export default function CsvDashboard() {
  const [products, setProducts] = useState<SellerProduct[]>(sampleProducts);
  const [fileName, setFileName] = useState('Demo data');
  const [error, setError] = useState('');

  const alerts = useMemo(() => generateAlerts(products), [products]);
  const totalSales = products.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = products.reduce((sum, item) => sum + item.estimatedProfit, 0);
  const totalOrders = products.reduce((sum, item) => sum + item.orders, 0);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setFileName(file.name);

    try {
      const text = await file.text();
      const rows = parseCsvText(text);
      const parsedProducts = rowsToProducts(rows).filter((item) => item.name || item.sku);

      if (parsedProducts.length === 0) {
        setError('CSV read nahi hua. Headers check karo.');
        return;
      }

      setProducts(parsedProducts);
    } catch {
      setError('CSV process karne me error aaya. File format check karo.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl bg-slate-900 p-8 shadow-xl">
          <p className="text-sm font-semibold text-emerald-400">Checho1 MVP</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
            Amazon sellers ke liye CSV upload profit dashboard
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300">
            CSV upload karo. System sales, ads, returns, stock aur cost read karke seller-friendly alerts banayega.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">
            <label className="block text-sm font-medium text-slate-300">Amazon seller CSV upload</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleUpload}
              className="mt-3 block w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200"
            />
            <p className="mt-3 text-xs text-slate-400">Current file: {fileName}</p>
            {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric title="Total Sales" value={`₹${totalSales.toLocaleString('en-IN')}`} />
            <Metric title="Orders" value={String(totalOrders)} />
            <Metric title="Estimated Profit" value={`₹${totalProfit.toLocaleString('en-IN')}`} />
          </div>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 text-slate-950">
            <h2 className="text-2xl font-bold">Auto Alerts</h2>
            <p className="mt-2 text-sm text-slate-600">CSV upload ke baad alerts auto update honge.</p>
            <div className="mt-5 space-y-4">
              {alerts.length === 0 ? (
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">Abhi koi major alert nahi mila.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{alert.severity}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">{alert.message}</p>
                    <p className="mt-2 text-sm font-medium text-emerald-700">Action: {alert.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 text-slate-950">
            <h2 className="text-2xl font-bold">Product Table</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-2">Product</th>
                    <th className="py-2">Sales</th>
                    <th className="py-2">Profit</th>
                    <th className="py-2">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.sku} className="border-b last:border-0">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3">₹{item.sales.toLocaleString('en-IN')}</td>
                      <td className="py-3">₹{item.estimatedProfit.toLocaleString('en-IN')}</td>
                      <td className="py-3">{item.returnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-800 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
