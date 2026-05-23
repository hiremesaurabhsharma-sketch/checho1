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
  const [sellerEmail, setSellerEmail] = useState('');
  const [status, setStatus] = useState('');

  const subject = useMemo(() => buildEmailSubject(alerts), [alerts]);
  const body = useMemo(() => buildEmailBody(sellerName || 'Seller ji', products, alerts), [sellerName, products, alerts]);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setStatus('Email message copy ho gaya');
    } catch {
      setStatus('Copy nahi hua. Text manually copy karo.');
    }
  }

  async function sendEmail() {
    setStatus('Sending...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: sellerEmail, subject, body })
      });

      const data = await response.json();
      setStatus(data.ok ? 'Email sent successfully.' : `Email send failed: ${data.error}`);
    } catch {
      setStatus('Email send failed. API setup check karo.');
    }
  }

  return (
    <section className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold text-slate-500">Email Alert</p>
          <h2 className="mt-2 text-2xl font-black">Seller ko mail bhejo</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Copy button abhi chalega. Send button ke liye Resend API key environment variable me add karni hogi.
          </p>

          <label className="mt-6 block text-sm font-bold">Seller name</label>
          <input
            value={sellerName}
            onChange={(event) => setSellerName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Vikash ji"
          />

          <label className="mt-4 block text-sm font-bold">Seller email</label>
          <input
            value={sellerEmail}
            onChange={(event) => setSellerEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="seller@example.com"
            type="email"
          />

          <button
            type="button"
            onClick={copyMessage}
            className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-50"
          >
            Copy email message
          </button>

          <button
            type="button"
            onClick={sendEmail}
            className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Send email
          </button>
          {status ? <p className="mt-3 text-sm font-semibold text-emerald-700">{status}</p> : null}
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
