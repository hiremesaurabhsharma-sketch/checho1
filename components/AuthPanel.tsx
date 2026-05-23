'use client';

import { useState } from 'react';

type Props = {
  onAuth: (name: string) => void;
};

export default function AuthPanel({ onAuth }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('Demo Seller');
  const [email, setEmail] = useState('seller@example.com');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      setMessage('Email aur password required hai.');
      return;
    }

    onAuth(name || email.split('@')[0]);
    setMessage(mode === 'signin' ? 'Demo signin successful.' : 'Demo signup successful.');
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('signin')}
          className={mode === 'signin' ? 'flex-1 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm' : 'flex-1 px-4 py-2 text-sm font-bold text-slate-500'}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={mode === 'signup' ? 'flex-1 rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm' : 'flex-1 px-4 py-2 text-sm font-bold text-slate-500'}
        >
          Sign up
        </button>
      </div>

      <h2 className="mt-6 text-2xl font-black">{mode === 'signin' ? 'Seller login' : 'Create seller account'}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Abhi ye demo auth hai. Real secure login ke liye next step me Supabase Auth connect karna hai.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        {mode === 'signup' ? (
          <div>
            <label className="text-sm font-bold">Seller name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
              placeholder="Vikash ji"
            />
          </div>
        ) : null}

        <div>
          <label className="text-sm font-bold">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="seller@example.com"
            type="email"
          />
        </div>

        <div>
          <label className="text-sm font-bold">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            placeholder="Enter password"
            type="password"
          />
        </div>

        <button type="submit" className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
      </form>
    </section>
  );
}
