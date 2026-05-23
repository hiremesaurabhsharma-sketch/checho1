'use client';

import { useMemo, useState } from 'react';
import type { SellerAlert, SellerProduct } from '../lib/alerts';
import { buildEmailBody, buildEmailSubject } from '../lib/email';

type Props = {
  products: SellerProduct[];
  alerts: SellerAlert[];
};

export default function EmailPreview({ products, alerts }: Props) {
  const [sellerName, setSellerName] = useState('Vikash ji');
  const [copyStatus, setCopyStatus] = useState('');

  const subject = useMemo(() => buildEmailSubject(alerts), [alerts]);
  const body = useMemo(() => buildEmailBody(sellerName || 'Seller ji', products, alerts), [sellerName, products, alerts]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopyStatus('Email message copy ho gaya');
    } catch {
      setCopyStatus('Copy nahi hua. Text manually copy karo.');
    }
  }

  return (
    <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold text-slate-500">Email Alert Preview</p>
          <h2 className="mt-2 text-2xl font-black">Seller ko ye mail jayega</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Abhi ye preview hai. Real email bhejne ke liye next step me Resend ya Brevo API add hogi.
          </p>

          <label className="mt-6 block text-sm font-bold">Seller name</label>
          <input
            value={sellerName}
            onChange={(event) => setSellerName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Vikash ji"
          />

          <button
            type="button"
            onClick={copyMessage}
            className="mt-4 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Copy email message
          </button>
          {copyStatus ? <p className="mt-3 text-sm font-semibold text-emerald-700">{copyStatus}</p> : null}
        </div>

        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Subject</p>
          <p className="mt-2 font-black">{subject}</p>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">Body</p>
          <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700">{body}</pre>
        </div>
      </div>
    </section>
  );
}
