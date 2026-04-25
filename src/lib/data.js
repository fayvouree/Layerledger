import { supabase, isConfigured } from './supabase.js'

const LS = {
  get: (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
}

export async function loadInventory(fallback) {
  if (!isConfigured) return LS.get('ll_inventory', fallback)
  const { data, error } = await supabase.from('inventory').select('*').order('name')
  if (error || !data?.length) return LS.get('ll_inventory', fallback)
  return data
}
export async function saveInventory(items) {
  LS.set('ll_inventory', items)
  if (!isConfigured) return
  await supabase.from('inventory').upsert(items, { onConflict: 'id' })
}

export async function loadProductions(fallback) {
  if (!isConfigured) return LS.get('ll_productions', fallback)
  const { data, error } = await supabase.from('productions').select('*').order('delivery_date', { ascending: false })
  if (error || !data?.length) return LS.get('ll_productions', fallback)
  return data.map(camelProd)
}
export async function saveProduction(prod) {
  const all = LS.get('ll_productions', [])
  LS.set('ll_productions', [prod, ...all.filter(p => p.id !== prod.id)])
  if (!isConfigured) return
  await supabase.from('productions').upsert(snakeProd(prod), { onConflict: 'id' })
}
export async function updateProductionStatus(id, status) {
  const all = LS.get('ll_productions', [])
  LS.set('ll_productions', all.map(p => p.id === id ? { ...p, status } : p))
  if (!isConfigured) return
  await supabase.from('productions').update({ status }).eq('id', id)
}

export function loadExpenses() { return LS.get('ll_expenses', []) }
export function saveExpenses(items) { LS.set('ll_expenses', items) }

export async function loadTransactions(fallback) {
  if (!isConfigured) return LS.get('ll_transactions', fallback)
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false })
  if (error || !data?.length) return LS.get('ll_transactions', fallback)
  return data
}
export async function saveTransactions(txns) {
  const existing = LS.get('ll_transactions', [])
  LS.set('ll_transactions', [...txns, ...existing])
  if (!isConfigured) return
  await supabase.from('transactions').upsert(txns, { onConflict: 'id' })
}

export function loadSetting(key, fallback) { return LS.get(`ll_setting_${key}`, fallback) }
export function saveSetting(key, val) { LS.set(`ll_setting_${key}`, val) }

export function loadCompanySettings() {
  return LS.get('ll_company', { name: 'Fayvouree Cakes', tagline: 'Baked with love', phone: '', email: '', address: '', logo: null, primaryColor: '#C8912A', sidebarColor: '#140801' })
}
export function saveCompanySettings(s) { LS.set('ll_company', s) }

export function loadInvoices() { return LS.get('ll_invoices', []) }
export function saveInvoice(inv) {
  const all = LS.get('ll_invoices', [])
  LS.set('ll_invoices', [inv, ...all.filter(i => i.id !== inv.id)])
}

function camelProd(p) {
  return { id:p.id, recipeId:p.recipe_id, client:p.client, clientPhone:p.client_phone||'', clientEmail:p.client_email||'', orderDate:p.order_date, deliveryDate:p.delivery_date, cost:p.cost, salePrice:p.sale_price, status:p.status, size:p.size, covering:p.covering, flavors:p.flavors, layers:p.layers, accessoryPct:p.accessory_pct, deliveryCost:p.delivery_cost||0, paymentType:p.payment_type||'full', discountPct:p.discount_pct||0, notes:p.notes }
}
function snakeProd(p) {
  return { id:p.id, recipe_id:p.recipeId, client:p.client, client_phone:p.clientPhone||'', client_email:p.clientEmail||'', order_date:p.orderDate, delivery_date:p.deliveryDate, cost:p.cost, sale_price:p.salePrice, status:p.status, size:p.size, covering:p.covering, flavors:p.flavors, layers:p.layers, accessory_pct:p.accessoryPct, delivery_cost:p.deliveryCost||0, payment_type:p.paymentType||'full', discount_pct:p.discountPct||0, notes:p.notes }
}
