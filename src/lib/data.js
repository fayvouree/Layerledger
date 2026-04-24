import { supabase, isConfigured } from './supabase.js'

// ── localStorage helpers ──────────────────────────────────────
const LS = {
  get: (key, fallback) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
}

// ── INVENTORY ─────────────────────────────────────────────────
export async function loadInventory(fallback) {
  if (!isConfigured) return LS.get('ll_inventory', fallback)
  const { data, error } = await supabase.from('inventory').select('*').order('name')
  if (error || !data?.length) return LS.get('ll_inventory', fallback)
  return data
}

export async function saveInventory(items) {
  LS.set('ll_inventory', items)
  if (!isConfigured) return
  // upsert all items
  await supabase.from('inventory').upsert(items, { onConflict: 'id' })
}

// ── PRODUCTIONS ───────────────────────────────────────────────
export async function loadProductions(fallback) {
  if (!isConfigured) return LS.get('ll_productions', fallback)
  const { data, error } = await supabase.from('productions').select('*').order('delivery_date', { ascending: false })
  if (error || !data?.length) return LS.get('ll_productions', fallback)
  return data.map(camelProd)
}

export async function saveProduction(prod) {
  const all = LS.get('ll_productions', [])
  const updated = [prod, ...all.filter(p => p.id !== prod.id)]
  LS.set('ll_productions', updated)
  if (!isConfigured) return
  await supabase.from('productions').upsert(snakeProd(prod), { onConflict: 'id' })
}

export async function updateProductionStatus(id, status) {
  const all = LS.get('ll_productions', [])
  LS.set('ll_productions', all.map(p => p.id === id ? { ...p, status } : p))
  if (!isConfigured) return
  await supabase.from('productions').update({ status }).eq('id', id)
}

// ── TRANSACTIONS ──────────────────────────────────────────────
export async function loadTransactions(fallback) {
  if (!isConfigured) return LS.get('ll_transactions', fallback)
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false })
  if (error || !data?.length) return LS.get('ll_transactions', fallback)
  return data
}

export async function saveTransactions(txns) {
  const existing = LS.get('ll_transactions', [])
  const updated = [...txns, ...existing]
  LS.set('ll_transactions', updated)
  if (!isConfigured) return
  await supabase.from('transactions').upsert(txns, { onConflict: 'id' })
}

// ── SETTINGS ─────────────────────────────────────────────────
export function loadSetting(key, fallback) {
  return LS.get(`ll_setting_${key}`, fallback)
}
export function saveSetting(key, val) {
  LS.set(`ll_setting_${key}`, val)
}

// ── Field mappers (snake_case DB ↔ camelCase JS) ──────────────
function camelProd(p) {
  return {
    id: p.id, recipeId: p.recipe_id, client: p.client,
    orderDate: p.order_date, deliveryDate: p.delivery_date,
    cost: p.cost, salePrice: p.sale_price, status: p.status,
    size: p.size, covering: p.covering, flavors: p.flavors,
    layers: p.layers, accessoryPct: p.accessory_pct, notes: p.notes, photo: p.photo,
  }
}
function snakeProd(p) {
  return {
    id: p.id, recipe_id: p.recipeId, client: p.client,
    order_date: p.orderDate, delivery_date: p.deliveryDate,
    cost: p.cost, sale_price: p.salePrice, status: p.status,
    size: p.size, covering: p.covering, flavors: p.flavors,
    layers: p.layers, accessory_pct: p.accessoryPct, notes: p.notes,
  }
}
