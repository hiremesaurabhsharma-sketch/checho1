'use client';

import { useMemo, useState } from 'react';
import { generateAlerts, sampleProducts, type SellerProduct } from '../lib/alerts';
import { parseCsvText, rowsToProducts } from '../lib/csv';
import EmailPreview from './EmailPreview';

export default function CsvDashboard() {
  const [products, setProducts] = useState<SellerProduct[]>(sampleProducts);
  const [fileName, setFileName] = useState('Demo data');
  const [error, setError] = useState('');

  const alerts = useMemo(() => generateAlerts(products), [products]);
  const totalSales = products.reduce((sum, item) => sum + item.sales, 0);
  const totalProfit = products.reduce((sum, item) => sum + item.estimatedProfit, 0);
  const totalOrders = products.reduce((sum, item) => sum + item.orders, 0);
  const alertCount = alerts.length;

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
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <section className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-10">
        <nav className="mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-lg font-black tracking-tight">Checho1</p>
            <p className="text-xs text-slate-500">Amazon seller profit alerts</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">MVP</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl md:p-10">
            <p className="w-fit rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              CSV se automatic insights
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Seller ko batao kaunsa product profit de raha hai aur kaunsa ghaata.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Amazon report upload karo. System sales, ads, return, stock aur cost ko read karke simple action alerts banata hai.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <Metric title="Total Sales" value={`₹${totalSales.toLocaleString('en-IN')}`} dark />
              <Metric title="Orders" value={String(totalOrders)} dark />
              <Metric title="Alerts" value={String(alertCount)} dark />
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold text-slate-500">Upload CSV</p>
            <h2 className="mt-2 text-2xl font-black">Seller report daalo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Test ke liye sample-data/products.csv use karo. Real customer personal data abhi upload mat karo.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:bg-slate-100">
              <span className="text-4xl">↑</span>
              <span className="mt-3 text-sm font-bold">Click karke CSV select karo</span>
              <span className="mt-1 text-xs text-slate-500">Accepted: .csv</span>
              <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
            </label>

            <div className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm">
              <p className="font-semibold">Current file</p>
              <p className="mt-1 text-slate-600">{fileName}</p>
              {error ? <p className="mt-3 font-medium text-red-600">{error}</p> : null}
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Auto Alerts</p>
                <h2 className="mt-2 text-2xl font-black">Action list</h2>
              </div>
              <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-bold text-orange-700">{alertCount} issues</span>
            </div>

            <div className="mt-6 space-y-4">
              {alerts.length === 0 ? (
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">Abhi koi major alert nahi mila.</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">{alert.title}</h3>
                      <span className={severityClass(alert.severity)}>{alert.severity}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{alert.message}</p>
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-semibold text-emerald-700">Action: {alert.action}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Products</p>
                <h2 className="mt-2 text-2xl font-black">Performance table</h2>
              </div>
              <Metric title="Profit" value={`₹${totalProfit.toLocaleString('en-IN')}`} />
            </div>

            <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">Sales</th>
                    <th className="px-4 py-4">Profit</th>
                    <th className="px-4 py-4">ACoS</th>
                    <th className="px-4 py-4">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.sku} className="border-t border-slate-200">
                      <td className="px-4 py-4">
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.sku}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold">₹{item.sales.toLocaleString('en-IN')}</td>
                      <td className={item.estimatedProfit < 0 ? 'px-4 py-4 font-bold text-red-600' : 'px-4 py-4 font-bold text-emerald-700'}>
                        ₹{item.estimatedProfit.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-4">{item.acos}%</td>
                      <td className="px-4 py-4">{item.returnRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <EmailPreview products={products} alerts={alerts} />
      </section>
    </main>
  );
}

function Metric({ title, value, dark = false }: { title: string; value: string; dark?: boolean }) {
  return (
    <div className={dark ? 'rounded-3xl bg-white/10 p-5' : 'rounded-3xl bg-slate-100 px-5 py-4'}>
      <p className={dark ? 'text-sm text-slate-300' : 'text-xs font-bold uppercase tracking-wide text-slate-500'}>{title}</p>
      <p className={dark ? 'mt-2 text-2xl font-black text-white' : 'mt-1 text-xl font-black text-slate-950'}>{value}</p>
    </div>
  );
}

function severityClass(severity: string) {
  if (severity === 'High') return 'rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700';
  if (severity === 'Medium') return 'rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700';
  return 'rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700';
}
