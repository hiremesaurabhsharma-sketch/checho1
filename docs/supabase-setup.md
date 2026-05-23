# Supabase setup for Checho1

This project has Supabase Auth starter code.

## 1. Create Supabase project

Go to Supabase and create a new project.

## 2. Get API keys

Open project settings and copy:

- Project URL
- anon public key

## 3. Add environment variables

In local `.env.local` or Vercel environment variables add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
ALERT_FROM_EMAIL=Checho1 <alerts@yourdomain.com>
```

## 4. Enable email/password auth

In Supabase Auth settings, enable email/password login.

## 5. Current status

Working:

- Sign up with email/password
- Sign in with email/password
- Logout
- Demo mode fallback if env is missing

Not built yet:

- Saving uploaded CSV data to database
- User-specific dashboards
- Admin panel
- Row level security policies

## 6. Recommended database tables later

```sql
create table sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  seller_name text,
  created_at timestamptz default now()
);

create table product_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  sku text,
  product_name text,
  sales numeric,
  orders_count numeric,
  units_sold numeric,
  estimated_profit numeric,
  ad_spend numeric,
  acos numeric,
  return_rate numeric,
  stock_units numeric,
  created_at timestamptz default now()
);
```
