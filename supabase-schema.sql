-- LayerLedger Database Schema
-- Run this entire file in your Supabase SQL Editor

-- INVENTORY TABLE
create table if not exists inventory (
  id text primary key,
  name text not null,
  cat text,
  unit text not null default 'kg',
  cost numeric not null default 0,
  stock numeric not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PRODUCTIONS TABLE
create table if not exists productions (
  id text primary key,
  recipe_id text,
  client text,
  order_date date,
  delivery_date date,
  cost numeric default 0,
  sale_price numeric default 0,
  status text default 'pending',
  size text,
  covering text,
  flavors text,
  layers integer default 2,
  accessory_pct numeric default 10,
  notes text,
  created_at timestamptz default now()
);

-- TRANSACTIONS TABLE (bank statement imports)
create table if not exists transactions (
  id text primary key,
  date date,
  description text,
  amount numeric default 0,
  type text check (type in ('credit', 'debit')),
  category text,
  matched_prod_id text references productions(id),
  created_at timestamptz default now()
);

-- Enable Row Level Security (keeps each user's data private)
alter table inventory enable row level security;
alter table productions enable row level security;
alter table transactions enable row level security;

-- Policies: allow all operations for now (single-user prototype)
-- When you add user auth later, update these to filter by user_id
create policy "Allow all" on inventory for all using (true) with check (true);
create policy "Allow all" on productions for all using (true) with check (true);
create policy "Allow all" on transactions for all using (true) with check (true);

-- Indexes for performance
create index if not exists idx_productions_delivery on productions(delivery_date);
create index if not exists idx_transactions_date on transactions(date);

select 'LayerLedger schema created successfully! ✓' as result;
