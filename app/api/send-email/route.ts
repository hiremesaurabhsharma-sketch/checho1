import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ ok: false, error: 'to, subject and body are required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: 'RESEND_API_KEY missing. Add it in environment variables before sending real emails.' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.ALERT_FROM_EMAIL || 'Checho1 <alerts@example.com>',
        to,
        subject,
        text: body
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: response.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Email send failed' }, { status: 500 });
  }
}
