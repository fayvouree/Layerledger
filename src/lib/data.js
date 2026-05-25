import { supabase, isConfigured } from './supabase.js'

const LS = {
  get: (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb } catch { return fb } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

export const loadInventory  = async (fb) => isConfigured ? (await supabase.from('inventory').select('*').order('name')).data?.length ? (await supabase.from('inventory').select('*').order('name')).data : LS.get('ll_inv', fb) : LS.get('ll_inv', fb)
export const saveInventory  = async (items) => { LS.set('ll_inv', items); if (isConfigured) await supabase.from('inventory').upsert(items, { onConflict: 'id' }) }
export const loadProductions= async (fb) => isConfigured ? (await supabase.from('productions').select('*').order('delivery_date', { ascending: false })).data?.map(camel) || LS.get('ll_prods', fb) : LS.get('ll_prods', fb)
export const saveProduction  = async (p) => { LS.set('ll_prods', [p, ...LS.get('ll_prods', []).filter(x => x.id !== p.id)]); if (isConfigured) await supabase.from('productions').upsert(snake(p), { onConflict: 'id' }) }
export const updateProdStatus= async (id, status) => { LS.set('ll_prods', LS.get('ll_prods', []).map(p => p.id === id ? { ...p, status } : p)); if (isConfigured) await supabase.from('productions').update({ status }).eq('id', id) }
export const loadTransactions= async (fb) => isConfigured ? (await supabase.from('transactions').select('*').order('date', { ascending: false })).data || LS.get('ll_txns', fb) : LS.get('ll_txns', fb)
export const saveTxns        = async (txns) => { LS.set('ll_txns', [...txns, ...LS.get('ll_txns', [])]); if (isConfigured) await supabase.from('transactions').upsert(txns, { onConflict: 'id' }) }
export const loadExpenses    = () => LS.get('ll_exp', [])
export const saveExpenses    = (v) => LS.set('ll_exp', v)
export const loadSetting     = (k, fb) => LS.get(`ll_s_${k}`, fb)
export const saveSetting     = (k, v) => LS.set(`ll_s_${k}`, v)
export const loadCompany     = () => LS.get('ll_co', { name:'Fayvouree Cakes', tagline:'Baked with love', phone:'', email:'', address:'', logo:null, primaryColor:'#C8912A', sidebarColor:'#140801', invoiceFooter:'Thank you for choosing us! Orders: +234...' })
export const saveCompany     = (v) => LS.set('ll_co', v)
export const loadInvoices    = () => LS.get('ll_inv2', [])
export const saveInvoice     = (v) => LS.set('ll_inv2', [v, ...LS.get('ll_inv2', []).filter(i => i.id !== v.id)])
export const loadUsers       = () => LS.get('ll_users', [{ id:'owner', name:'Owner', role:'owner', pin:'1234', active:true }])
export const saveUsers       = (v) => LS.set('ll_users', v)
export const loadRecipes     = () => LS.get('ll_recipes', null)
export const saveRecipes     = (v) => LS.set('ll_recipes', v)

const camel = p => ({ id:p.id, recipeId:p.recipe_id, client:p.client, clientPhone:p.client_phone||'', clientEmail:p.client_email||'', orderDate:p.order_date, deliveryDate:p.delivery_date, cost:p.cost, deliveryCost:p.delivery_cost||0, salePrice:p.sale_price, status:p.status, size:p.size, covering:p.covering, flavors:p.flavors, decorations:p.decorations||'', layers:p.layers, accessoryPct:p.accessory_pct, profitPct:p.profit_pct||0, paymentType:p.payment_type||'full', discountPct:p.discount_pct||0, notes:p.notes })
const snake = p => ({ id:p.id, recipe_id:p.recipeId, client:p.client, client_phone:p.clientPhone||'', client_email:p.clientEmail||'', order_date:p.orderDate, delivery_date:p.deliveryDate, cost:p.cost, delivery_cost:p.deliveryCost||0, sale_price:p.salePrice, status:p.status, size:p.size, covering:p.covering, flavors:p.flavors, decorations:p.decorations||'', layers:p.layers, accessory_pct:p.accessoryPct, profit_pct:p.profitPct||0, payment_type:p.paymentType||'full', discount_pct:p.discountPct||0, notes:p.notes })
