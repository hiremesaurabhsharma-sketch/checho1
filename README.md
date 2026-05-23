# Checho1 - Amazon Seller Analytics MVP

Checho1 is a starter MVP for Indian Amazon sellers.

## What is added now

- Next.js starter structure
- Landing page and demo dashboard
- Product table
- Rule-based alert engine
- Demo alerts for:
  - Loss-making product
  - Ads waste
  - Low stock
  - High return
  - Dead stock

## Current MVP flow

1. Seller uploads Amazon CSV reports. This is not built yet.
2. System reads sales, inventory, ads, returns, and cost data.
3. System calculates product KPIs.
4. Dashboard shows simple Hindi/English alerts.
5. Later we can add email and WhatsApp alerts.

## Important safety rule

Do not upload real seller/customer personal data in testing. Use dummy or anonymized CSV data first.

## Run locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Manual file still needed

A Tailwind config file may need to be added manually if styling does not load.

Create `tailwind.config.js` with this content:

```js
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: []
};
```

## Next development steps

1. Add CSV upload page.
2. Parse Amazon sales CSV.
3. Add product cost sheet upload.
4. Replace demo data with real uploaded data.
5. Add email alerts.
6. Add Supabase login/database.
7. Add WhatsApp API later.

## Not included yet

- Amazon SP-API integration
- WhatsApp API
- Payment gateway
- Real database
- Admin panel
