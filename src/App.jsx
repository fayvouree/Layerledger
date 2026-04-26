import { useState, useRef, useEffect, useCallback } from "react"
import { loadInventory, saveInventory, loadProductions, saveProduction, updateProdStatus,
  loadTransactions, saveTxns, loadExpenses, saveExpenses, loadSetting, saveSetting,
  loadCompany, saveCompany, loadInvoices, saveInvoice, loadUsers, saveUsers,
  loadRecipes, saveRecipes } from "./lib/data.js"

// ═══════════════════════════════════════════════════════════
//  FAYVOUREE REAL INVENTORY DATA
// ═══════════════════════════════════════════════════════════
const DEFAULT_INV = [
  {id:"i1",  name:"Flour",                     cat:"Dry Goods",   unit:"kg",    cost:1140,  stock:50,  minStock:10},
  {id:"i2",  name:"Sugar",                     cat:"Dry Goods",   unit:"kg",    cost:1500,  stock:50,  minStock:10},
  {id:"i3",  name:"Oil",                       cat:"Fats & Oils", unit:"L",     cost:3000,  stock:25,  minStock:5 },
  {id:"i4",  name:"Butter (Butler)",           cat:"Fats & Oils", unit:"kg",    cost:17500, stock:8,   minStock:2 },
  {id:"i5",  name:"Margarine (Valido)",        cat:"Fats & Oils", unit:"kg",    cost:5400,  stock:10,  minStock:2 },
  {id:"i6",  name:"Margarine (Romi)",          cat:"Fats & Oils", unit:"kg",    cost:6000,  stock:10,  minStock:2 },
  {id:"i7",  name:"Eggs",                      cat:"Dairy",       unit:"pcs",   cost:700,   stock:120, minStock:24},
  {id:"i8",  name:"Milk (Hollandia)",          cat:"Dairy",       unit:"L",     cost:3700,  stock:5,   minStock:2 },
  {id:"i9",  name:"Milk Lactose",              cat:"Dairy",       unit:"kg",    cost:6800,  stock:5,   minStock:1 },
  {id:"i10", name:"Dry Whipping Cream",        cat:"Dairy",       unit:"kg",    cost:12000, stock:2,   minStock:0.5},
  {id:"i11", name:"Liquid Whipping Cream",     cat:"Dairy",       unit:"kg",    cost:9500,  stock:2,   minStock:0.5},
  {id:"i12", name:"Cream Cheese",              cat:"Dairy",       unit:"kg",    cost:19000, stock:1,   minStock:0.5},
  {id:"i13", name:"Icing Sugar",               cat:"Dry Goods",   unit:"kg",    cost:2250,  stock:10,  minStock:2 },
  {id:"i14", name:"Majesty Icing Sugar",       cat:"Dry Goods",   unit:"kg",    cost:5400,  stock:5,   minStock:1 },
  {id:"i15", name:"Baking Powder",             cat:"Dry Goods",   unit:"kg",    cost:12222, stock:0.45,minStock:0.1},
  {id:"i16", name:"Baking Soda",               cat:"Dry Goods",   unit:"kg",    cost:5000,  stock:0.6, minStock:0.1},
  {id:"i17", name:"CMC",                       cat:"Dry Goods",   unit:"kg",    cost:15000, stock:0.4, minStock:0.1},
  {id:"i18", name:"Glucose",                   cat:"Dry Goods",   unit:"kg",    cost:3000,  stock:2,   minStock:0.5},
  {id:"i19", name:"Salt",                      cat:"Dry Goods",   unit:"kg",    cost:600,   stock:2,   minStock:0.5},
  {id:"i20", name:"Cocoa Powder",              cat:"Dry Goods",   unit:"kg",    cost:25000, stock:1,   minStock:0.2},
  {id:"i21", name:"Dark Chocolate (Colatta)",  cat:"Chocolate",   unit:"kg",    cost:12000, stock:2,   minStock:0.5},
  {id:"i22", name:"White Chocolate (Colatta)", cat:"Chocolate",   unit:"kg",    cost:12000, stock:1,   minStock:0.5},
  {id:"i23", name:"Red Velvet Powder Color",   cat:"Colorings",   unit:"kg",    cost:10000, stock:0.4, minStock:0.1},
  {id:"i24", name:"Red Food Color (Foster)",   cat:"Colorings",   unit:"ml",    cost:25,    stock:28,  minStock:5 },
  {id:"i25", name:"Gel Colors",                cat:"Colorings",   unit:"set",   cost:5000,  stock:2,   minStock:1 },
  {id:"i26", name:"Flavour",                   cat:"Flavoring",   unit:"bottle",cost:3000,  stock:5,   minStock:2 },
  {id:"i27", name:"Mixed Fruit",               cat:"Fruits",      unit:"kg",    cost:4500,  stock:5,   minStock:1 },
  {id:"i28", name:"Carrot",                    cat:"Fruits",      unit:"kg",    cost:2000,  stock:2,   minStock:0.5},
  {id:"i29", name:"Red Cherry",                cat:"Fruits",      unit:"kg",    cost:18000, stock:1,   minStock:0.2},
  {id:"i30", name:"Oreo Cookies",              cat:"Decoration",  unit:"pack",  cost:18000, stock:2,   minStock:1 },
  {id:"i31", name:"Flowers",                   cat:"Decoration",  unit:"pcs",   cost:2000,  stock:20,  minStock:5 },
  {id:"i32", name:"Toppers",                   cat:"Decoration",  unit:"pcs",   cost:2000,  stock:15,  minStock:5 },
  {id:"i33", name:"Ribbons",                   cat:"Decoration",  unit:"pack",  cost:1500,  stock:10,  minStock:3 },
  {id:"i34", name:"Wafer Paper",               cat:"Decoration",  unit:"pack",  cost:3000,  stock:5,   minStock:2 },
  {id:"i35", name:"Sprinkles / Shimmer",       cat:"Decoration",  unit:"pack",  cost:2500,  stock:5,   minStock:2 },
  {id:"i36", name:"Cake Board 8\"",            cat:"Packaging",   unit:"pcs",   cost:450,   stock:20,  minStock:5 },
  {id:"i37", name:"Cake Board 10\"",           cat:"Packaging",   unit:"pcs",   cost:550,   stock:15,  minStock:5 },
  {id:"i38", name:"Cake Board 12\"",           cat:"Packaging",   unit:"pcs",   cost:650,   stock:10,  minStock:3 },
  {id:"i39", name:"Tall Box 8\"",              cat:"Packaging",   unit:"pcs",   cost:480,   stock:20,  minStock:5 },
  {id:"i40", name:"Tall Box 10\"",             cat:"Packaging",   unit:"pcs",   cost:550,   stock:15,  minStock:5 },
  {id:"i41", name:"Tall Box 12\"",             cat:"Packaging",   unit:"pcs",   cost:600,   stock:10,  minStock:3 },
  {id:"i42", name:"Cupcake Box x12",           cat:"Packaging",   unit:"pcs",   cost:450,   stock:20,  minStock:5 },
  {id:"i43", name:"Baking Paper",              cat:"Packaging",   unit:"roll",  cost:8500,  stock:3,   minStock:1 },
  {id:"i44", name:"Cling Film",                cat:"Packaging",   unit:"roll",  cost:2000,  stock:3,   minStock:1 },
  {id:"i45", name:"Wrapping Sheet",            cat:"Packaging",   unit:"pack",  cost:8000,  stock:2,   minStock:1 },
]

// Recipes are PER SINGLE LAYER. In production, multiply by number of layers.
const DEFAULT_RECIPES = [
  { id:"r1", name:"Vanilla Cake", notes:"Classic vanilla sponge — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.3},{iid:"i2",qty:0.25},{iid:"i5",qty:0.2},{iid:"i7",qty:3},{iid:"i8",qty:0.15},{iid:"i11",qty:0.3},{iid:"i15",qty:0.005},{iid:"i26",qty:0.1}] },
  { id:"r2", name:"Red Velvet Cake", notes:"Red velvet sponge — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.3},{iid:"i2",qty:0.25},{iid:"i5",qty:0.2},{iid:"i7",qty:3},{iid:"i3",qty:0.12},{iid:"i16",qty:0.01},{iid:"i23",qty:0.03},{iid:"i24",qty:3},{iid:"i15",qty:0.005}] },
  { id:"r3", name:"Chocolate Cake", notes:"Rich chocolate sponge — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.28},{iid:"i2",qty:0.25},{iid:"i5",qty:0.2},{iid:"i7",qty:3},{iid:"i8",qty:0.1},{iid:"i20",qty:0.06},{iid:"i21",qty:0.05},{iid:"i15",qty:0.005}] },
  { id:"r4", name:"Carrot Cake", notes:"Moist carrot cake — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.25},{iid:"i2",qty:0.2},{iid:"i3",qty:0.15},{iid:"i7",qty:3},{iid:"i28",qty:0.2},{iid:"i15",qty:0.005}] },
  { id:"r5", name:"Lemon Cake", notes:"Light lemon sponge — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.3},{iid:"i2",qty:0.25},{iid:"i4",qty:0.15},{iid:"i7",qty:3},{iid:"i8",qty:0.1},{iid:"i15",qty:0.005}] },
  { id:"r6", name:"Fruit Cake", notes:"Rich fruit cake — quantities for 1 layer",
    ing:[{iid:"i1",qty:0.25},{iid:"i2",qty:0.2},{iid:"i5",qty:0.18},{iid:"i7",qty:3},{iid:"i27",qty:0.2},{iid:"i15",qty:0.004}] },
  { id:"r7", name:"Cupcakes (x12)", notes:"Yields 12 cupcakes — do not multiply by layers",
    ing:[{iid:"i1",qty:0.2},{iid:"i2",qty:0.15},{iid:"i5",qty:0.15},{iid:"i7",qty:2},{iid:"i8",qty:0.1},{iid:"i11",qty:0.2},{iid:"i15",qty:0.003},{iid:"i42",qty:1}] },
  { id:"r8", name:"Cake Loaf", notes:"Standard loaf — do not multiply by layers",
    ing:[{iid:"i1",qty:0.25},{iid:"i2",qty:0.2},{iid:"i5",qty:0.18},{iid:"i7",qty:3},{iid:"i8",qty:0.15},{iid:"i15",qty:0.004}] },
]

// Decoration extras - per unit cost items selectable per production
const DECORATION_ITEMS = [
  { id:"d1",  name:"Chocolate Drip",       iid:"i21", qty:0.15, label:"Chocolate drip / drizzle" },
  { id:"d2",  name:"White Choc Drip",      iid:"i22", qty:0.15, label:"White chocolate drip" },
  { id:"d3",  name:"Fresh Flowers",        iid:"i31", qty:3,    label:"Fresh flowers (3 pcs)" },
  { id:"d4",  name:"Cake Topper",          iid:"i32", qty:1,    label:"Cake topper (1 pc)" },
  { id:"d5",  name:"Oreo Decoration",      iid:"i30", qty:0.5,  label:"Oreo cookies decoration" },
  { id:"d6",  name:"Ribbon",               iid:"i33", qty:1,    label:"Ribbon" },
  { id:"d7",  name:"Wafer Paper Decor",    iid:"i34", qty:0.5,  label:"Wafer paper decoration" },
  { id:"d8",  name:"Sprinkles / Shimmer",  iid:"i35", qty:1,    label:"Sprinkles / shimmer dust" },
  { id:"d9",  name:"Cherry Topping",       iid:"i29", qty:0.1,  label:"Cherry topping" },
  { id:"d10", name:"Gel Color Work",       iid:"i25", qty:0.2,  label:"Gel color painting" },
  { id:"d11", name:"Fondant Figurines",    iid:"i14", qty:0.3,  label:"Fondant figurines" },
  { id:"d12", name:"Gold/Silver Shimmer",  iid:"i35", qty:0.5,  label:"Gold/silver shimmer" },
]

const COVERING_EXTRAS = {
  "buttercream": [{ iid:"i11", qty:0.4 }],
  "fondant":     [{ iid:"i14", qty:0.8 }, { iid:"i17", qty:0.1 }],
  "ganache":     [{ iid:"i21", qty:0.4 }],
  "naked":       [],
}

const FLAVOR_EXTRAS = {
  "red velvet":  [{ iid:"i23", qty:0.05 }, { iid:"i24", qty:5 }],
  "chocolate":   [{ iid:"i20", qty:0.08 }],
  "carrot":      [{ iid:"i28", qty:0.15 }],
  "fruit cake":  [{ iid:"i27", qty:0.2 }],
  "lemon":       [],
  "vanilla":     [],
  "strawberry":  [],
  "banana":      [],
  "orange":      [],
}

const EXP_CATS = ["Ingredients","Packaging","Delivery","Decorations","Equipment","Utilities","Marketing","Salaries","Rent","Miscellaneous"]
const PAYMENT_TYPES = [{v:"full",l:"Full Price"},{v:"deposit",l:"Deposit Received"},{v:"discount",l:"Discounted"},{v:"gift",l:"Gift"},{v:"sample",l:"Sample/Tasting"}]
const ROLES = { owner:"Owner (Full Access)", production:"Production (Baker)", customer_service:"Customer Service" }

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
const fmt  = n => `₦${Math.round(n||0).toLocaleString("en")}`
const uid  = () => "_"+Math.random().toString(36).slice(2,9)
const today= () => new Date().toISOString().slice(0,10)

const recipeCost = (r, inv) => !r ? 0 : r.ing.reduce((s,i)=>{ const it=inv.find(x=>x.id===i.iid); return s+(it?it.cost*i.qty:0) },0)

const calcFullCost = (recipe, inv, flavors, decorationIds, accessoryPct) => {
  if (!recipe) return 0
  let cost = recipeCost(recipe, inv)
  // flavor extras
  const fl = (flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
  fl.forEach(f => (FLAVOR_EXTRAS[f]||[]).forEach(e=>{ const it=inv.find(x=>x.id===e.iid); if(it) cost+=it.cost*e.qty }))
  // decoration extras
  ;(decorationIds||[]).forEach(did => {
    const decor = DECORATION_ITEMS.find(d=>d.id===did)
    if (decor) { const it=inv.find(x=>x.id===decor.iid); if(it) cost+=it.cost*decor.qty }
  })
  return cost * (1 + (accessoryPct||10)/100)
}

async function callClaude(messages, system="") {
  const endpoint = import.meta.env.DEV ? "https://api.anthropic.com/v1/messages" : "/api/claude"
  const headers = {"Content-Type":"application/json"}
  if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_KEY) {
    headers["x-api-key"] = import.meta.env.VITE_ANTHROPIC_KEY
    headers["anthropic-version"] = "2023-06-01"
  }
  const res = await fetch(endpoint, {method:"POST",headers,body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system,messages})})
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.[0]?.text || ""
}

// Compress image before sending to API
async function compressImage(base64, maxWidth=800) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, maxWidth / img.width)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1])
    }
    img.src = `data:image/jpeg;base64,${base64}`
  })
}

// CSV parser — flexible column matching, handles BOM, semicolons, tabs
function parseCSV(text) {
  const clean = text.replace(/^\uFEFF/, '').trim()
  const lines = clean.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []
  const firstLine = lines[0]
  const delim = firstLine.includes(';') ? ';' : firstLine.includes('\t') ? '\t' : ','
  const headers = firstLine.split(delim).map(h => h.trim().toLowerCase().replace(/['"]/g,'').replace(/[^a-z0-9]/g,' ').trim())

  const findCol = (row, ...keys) => {
    for (const k of keys) {
      const idx = headers.findIndex(h => h.includes(k))
      if (idx >= 0 && row[idx] !== undefined) return row[idx].trim().replace(/['"]/g,'')
    }
    return ''
  }

  return lines.slice(1).map(line => {
    const row = line.split(delim)
    const name = findCol(row,'name','item','ingredient','product','description')
    if (!name) return null
    return {
      id: uid(),
      name,
      cat:      findCol(row,'cat','category','type','group','class') || 'General',
      unit:     findCol(row,'unit','measure','uom','per') || 'kg',
      cost:   +(findCol(row,'cost','price','rate','unit cost','price unit','price/unit','per unit') || '0').replace(/[,₦]/g,'') || 0,
      stock:  +(findCol(row,'stock','quantity','qty','current stock','on hand','balance') || '0').replace(/[,]/g,'') || 0,
      minStock:+(findCol(row,'min','minimum','minstock','reorder','alert') || '2').replace(/[,]/g,'') || 2,
    }
  }).filter(Boolean).filter(i => i.name)
}

// ═══════════════════════════════════════════════════════════
//  SHARED UI
// ═══════════════════════════════════════════════════════════
function Btn({children,onClick,variant="primary",small,full,disabled,style={}}){
  const v={primary:{bg:"var(--gold)",color:"#fff",border:"none"},ghost:{bg:"transparent",color:"var(--muted)",border:"1px solid var(--border)"},success:{bg:"#357A52",color:"#fff",border:"none"},danger:{bg:"#B03A2E",color:"#fff",border:"none"},outline:{bg:"transparent",color:"var(--gold)",border:"1px solid var(--gold)"},dark:{bg:"var(--sidebar)",color:"var(--gold)",border:"none"}}[variant]||{}
  return <button onClick={onClick} disabled={disabled} style={{...v,borderRadius:8,padding:small?"5px 11px":"8px 16px",fontSize:small?12:13.5,fontWeight:500,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0,...style}}>{children}</button>
}
const iSt = {width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13.5,color:"var(--text)",boxSizing:"border-box",outline:"none",fontFamily:"inherit"}
function Inp({label,value,onChange,type="text",placeholder,small}){return<div style={{marginBottom:11}}>{label&&<label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...iSt,fontSize:small?12:13.5}}/></div>}
function Sel({label,value,onChange,options,placeholder="— Select —"}){return<div style={{marginBottom:11}}>{label&&<label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<select value={value||""} onChange={e=>onChange(e.target.value)} style={{...iSt,cursor:"pointer"}}><option value="">{placeholder}</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select></div>}
function Card({children,style={}}){return<div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:12,padding:18,...style}}>{children}</div>}
function Badge({children,color="gray"}){const m={green:["#E5F4EC","#2D7A50"],gold:["#FDF2DC","#9A6C1A"],red:["#FDEBE9","#912622"],blue:["#E8EFFC","#2355A0"],purple:["#F0EAFC","#6B32A0"],gray:["#F0EBE3","#6B5B45"]}[color]||["#F0EBE3","#6B5B45"];return<span style={{background:m[0],color:m[1],borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>}
function SHead({title,sub}){return<div style={{marginBottom:20}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--text)",fontWeight:600,margin:0}}>{title}</h1>{sub&&<p style={{color:"var(--muted)",fontSize:13,marginTop:3,marginBottom:0}}>{sub}</p>}</div>}
function Tabs({tabs,active,onChange}){return<div style={{display:"flex",gap:3,marginBottom:18,background:"var(--border)",borderRadius:10,padding:3,flexWrap:"wrap"}}>{tabs.map(t=><div key={t.v||t} onClick={()=>onChange(t.v||t)} style={{padding:"6px 13px",borderRadius:7,fontSize:12.5,fontWeight:active===(t.v||t)?500:400,cursor:"pointer",background:active===(t.v||t)?"var(--panel)":"transparent",color:active===(t.v||t)?"var(--text)":"var(--muted)",transition:"all 0.15s"}}>{t.l||t}</div>)}</div>}
function TH({cols}){return<thead><tr style={{background:"#EDE5D6"}}>{cols.map(c=><th key={c} style={{padding:"8px 10px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:0.8,color:"var(--muted)",fontWeight:500,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>}
function TR2({row,i,onClick}){return<tr onClick={onClick} style={{background:i%2===0?"var(--panel)":"#F8F3EA",cursor:onClick?"pointer":"default"}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.background="#F0E9DB"}} onMouseLeave={e=>{if(onClick)e.currentTarget.style.background=i%2===0?"var(--panel)":"#F8F3EA"}}>{row.map((c,j)=><td key={j} style={{padding:"9px 10px",fontSize:13,color:"var(--text)",borderBottom:"1px solid var(--border)"}}>{c}</td>)}</tr>}
function Steps({steps,cur}){return<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:20,flexWrap:"wrap"}}>{steps.map((s,i)=><div key={s} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:cur>i+1?"#357A52":cur===i+1?"var(--gold)":"var(--border)",color:cur>=i+1?"#fff":"var(--muted)",fontSize:11,fontWeight:700}}>{cur>i+1?"✓":i+1}</div><span style={{fontSize:12,color:cur===i+1?"var(--text)":"var(--muted)",fontWeight:cur===i+1?500:400,marginRight:4}}>{s}</span>{i<steps.length-1&&<span style={{color:"var(--border)",marginRight:4}}>›</span>}</div>)}</div>}
function Spinner(){return<div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:32}}><div style={{width:26,height:26,border:"3px solid var(--border)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>}
function Modal({title,children,onClose}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><div style={{background:"var(--panel)",borderRadius:14,padding:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"var(--text)"}}>{title}</div><button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--muted)"}}>×</button></div>{children}</div></div>}
function Alert({msg,color="gold",onClose}){if(!msg)return null;const c={gold:["#FFF9EE","#9A6C1A","var(--gold)"],red:["#FDEBE9","#912622","#B03A2E"],green:["#E5F4EC","#2D7A50","#357A52"]}[color]||["#FFF9EE","#9A6C1A","var(--gold)"];return<div style={{padding:"10px 14px",background:c[0],color:c[1],borderRadius:8,marginBottom:12,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{msg}</span>{onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:c[2],fontWeight:700,marginLeft:8}}>×</button>}</div>}

// ═══════════════════════════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════════════════════════
function Login({onLogin}){
  const [users, setUsers] = useState(loadUsers())
  const [pin, setPin] = useState("")
  const [err, setErr] = useState("")
  const [selUser, setSelUser] = useState(users[0]?.id||"")

  const attempt = () => {
    const u = users.find(x => x.id === selUser)
    if (!u) return setErr("Select a user")
    if (u.pin !== pin) { setErr("Wrong PIN"); setPin(""); return }
    setErr("")
    onLogin(u)
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');*{box-sizing:border-box}body{margin:0}:root{--gold:#C8912A;--sidebar:#140801;--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB}`}</style>
      <Card style={{width:"100%",maxWidth:360,padding:32,textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:"var(--gold)",fontWeight:700,marginBottom:4}}>LayerLedger</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:28,textTransform:"uppercase",letterSpacing:2}}>Bakery Bookkeeping</div>
        <Sel label="Select User" value={selUser} onChange={setSelUser} options={users.filter(u=>u.active).map(u=>({value:u.id,label:`${u.name} (${ROLES[u.role]?.split(" ")[0]})`}))}/>
        <div style={{marginBottom:12}}><label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>PIN</label><input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Enter PIN" maxLength={8} style={{...iSt,textAlign:"center",letterSpacing:8,fontSize:20}}/></div>
        {err&&<div style={{color:"#B03A2E",fontSize:12.5,marginBottom:10}}>⚠ {err}</div>}
        <Btn full onClick={attempt}>Login →</Btn>
        <div style={{marginTop:16,fontSize:11.5,color:"var(--muted)"}}>Default owner PIN: 1234</div>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════════
function Dashboard({productions,inventory,expenses,setView,user}){
  const m=new Date().toISOString().slice(0,7)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(m))
  const paid=mp.filter(p=>p.paymentType==="full"||p.paymentType==="discount"||p.paymentType==="deposit")
  const rev=paid.reduce((s,p)=>s+(p.salePrice||0),0)
  const cost=mp.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0)
  const expTotal=expenses.filter(e=>e.date?.startsWith(m)).reduce((s,e)=>s+(e.amount||0),0)
  const profit=rev-cost-expTotal
  const low=inventory.filter(i=>i.stock<=(i.minStock||3))
  const monthLabel=new Date().toLocaleDateString("en-NG",{month:"long",year:"numeric"})
  const canAccess = (v) => user?.role === 'owner' || (user?.role === 'customer_service' && ['records'].includes(v))

  return <div>
    <SHead title={`Good day, ${user?.name?.split(" ")[0]}! 👋`} sub={`${monthLabel} overview`}/>
    {user?.role==="owner"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,marginBottom:18}}>
      {[{label:"Revenue",val:fmt(rev),sub:`${paid.length} paid orders`,a:"var(--gold)"},{label:"Prod. Cost",val:fmt(cost),sub:"incl. delivery",a:"#2A5F9A"},{label:"Expenses",val:fmt(expTotal),sub:"other costs",a:"#8C6E52"},{label:"Net Profit",val:fmt(profit),sub:`${mp.length} total orders`,a:profit>=0?"#357A52":"#B03A2E"}].map(s=><Card key={s.label} style={{borderTop:`3px solid ${s.a}`}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text)"}}>{s.val}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.sub}</div>
      </Card>)}
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Recent Orders</div>
        {productions.length===0?<div style={{fontSize:13,color:"var(--muted)"}}>No productions recorded yet.</div>:
        productions.slice(0,5).map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
          <div><div style={{fontSize:13,fontWeight:500}}>{p.size} · {p.covering}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>{p.client} · {p.deliveryDate}</div></div>
          <div style={{textAlign:"right"}}><Badge color={{full:"green",gift:"purple",sample:"blue",discount:"gold",deposit:"blue"}[p.paymentType]||"gray"}>{p.paymentType}</Badge>{user?.role==="owner"&&<div style={{fontSize:12,color:"var(--gold)",fontWeight:600,marginTop:2}}>{fmt(p.salePrice)}</div>}</div>
        </div>)}
        <div style={{marginTop:10}}><Btn small variant="outline" onClick={()=>setView("records")}>View All →</Btn></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {low.length>0&&<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>⚠ {low.length} Items Low on Stock</div>
          {low.slice(0,4).map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:12.5}}>{i.name}</span><Badge color={i.stock===0?"red":"gold"}>{i.stock} {i.unit}</Badge>
          </div>)}
          <div style={{marginTop:8}}><Btn small variant="outline" onClick={()=>setView("shopping")}>Generate Shopping List →</Btn></div>
        </Card>}
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Quick Actions</div>
          {[{icon:"🎂",label:"New production entry",view:"production",roles:["owner","production"]},{icon:"🧾",label:"Scan purchase receipt",view:"receipts",roles:["owner","production"]},{icon:"💸",label:"Log cash expense",view:"expenses",roles:["owner"]},{icon:"📊",label:"Monthly P&L report",view:"reports",roles:["owner"]},{icon:"📄",label:"Create invoice",view:"invoices",roles:["owner","customer_service"]},{icon:"🛒",label:"Shopping list",view:"shopping",roles:["owner","production"]}].filter(a=>a.roles.includes(user?.role)).map(a=><div key={a.view} onClick={()=>setView(a.view)} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 8px",borderRadius:8,cursor:"pointer",marginBottom:2}} onMouseEnter={e=>e.currentTarget.style.background="#F0E9DB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:15}}>{a.icon}</span><span style={{fontSize:13}}>{a.label}</span>
          </div>)}
        </Card>
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  MASTER LIST (editable inventory + editable recipes)
// ═══════════════════════════════════════════════════════════
function MasterList({inventory,setInventory,recipes,setRecipes,user}){
  const [tab,setTab]=useState("inventory")
  const [editId,setEditId]=useState(null)
  const [editRow,setEditRow]=useState({})
  const [addMode,setAddMode]=useState(false)
  const [newItem,setNewItem]=useState({name:"",cat:"",unit:"kg",cost:"",stock:"",minStock:"3"})
  const [msg,setMsg]=useState("")
  const [msgColor,setMsgColor]=useState("gold")
  const [recipeModal,setRecipeModal]=useState(null)
  const [pasteMode,setPasteMode]=useState(false)
  const [pasteText,setPasteText]=useState("")
  const csvRef=useRef()
  const isOwner = user?.role==="owner"

  const showMsg = (m,c="gold") => { setMsg(m); setMsgColor(c); setTimeout(()=>setMsg(""),4000) }

  // ── Inventory ──
  const startEdit = (item) => { setEditId(item.id); setEditRow({...item}) }
  const saveEdit = async () => {
    const updated = inventory.map(i=>i.id===editId?{...editRow,cost:+editRow.cost,stock:+editRow.stock,minStock:+editRow.minStock||2}:i)
    setInventory(updated); await saveInventory(updated); setEditId(null); showMsg("✓ Item updated","green")
  }
  const deleteItem = async (id) => {
    if(!confirm("Delete this item?"))return
    const updated=inventory.filter(i=>i.id!==id); setInventory(updated); await saveInventory(updated); showMsg("Item deleted")
  }
  const addItem = async () => {
    if(!newItem.name||!newItem.cost)return showMsg("Name and cost are required")
    const updated=[...inventory,{...newItem,id:uid(),cost:+newItem.cost,stock:+newItem.stock||0,minStock:+newItem.minStock||2}]
    setInventory(updated); await saveInventory(updated); setNewItem({name:"",cat:"",unit:"kg",cost:"",stock:"",minStock:"3"}); setAddMode(false); showMsg("✓ Item added","green")
  }

  const handleCSV = e => {
    const file=e.target.files[0]; if(!file)return; e.target.value=""
    const reader=new FileReader()
    reader.onload=async ev=>{
      try{
        const items=parseCSV(ev.target.result)
        if(items.length===0){ showMsg("⚠ No items found. Check column headers: name, category, unit, cost, stock","red"); return }
        const updated=[...inventory,...items.filter(ni=>!inventory.find(i=>i.name.toLowerCase()===ni.name.toLowerCase()))]
        setInventory(updated); await saveInventory(updated)
        showMsg(`✓ ${items.length} items imported successfully (${updated.length-inventory.length} new, duplicates skipped)`,"green")
      }catch(err){ showMsg(`⚠ Import failed: ${err.message}`,"red") }
    }
    reader.readAsText(file)
  }

  const restock = async (id, qty) => {
    if(!qty||+qty<=0)return
    const updated=inventory.map(i=>i.id===id?{...i,stock:parseFloat((i.stock+(+qty)).toFixed(3))}:i)
    setInventory(updated); await saveInventory(updated)
  }

  // ── Recipes ──
  const openRecipe = (r) => setRecipeModal(r ? {...r} : {id:uid(),name:"",size:"",tiers:1,covering:"buttercream",ing:[]})
  const saveRecipe = async () => {
    if(!recipeModal.name||!recipeModal.size)return showMsg("Name and size required")
    const updated = recipes.find(r=>r.id===recipeModal.id) ? recipes.map(r=>r.id===recipeModal.id?recipeModal:r) : [...recipes, recipeModal]
    setRecipes(updated); saveRecipes(updated); setRecipeModal(null); showMsg("✓ Recipe saved","green")
  }
  const deleteRecipe = async (id) => {
    if(!confirm("Delete this recipe?"))return
    const updated=recipes.filter(r=>r.id!==id); setRecipes(updated); saveRecipes(updated); showMsg("Recipe deleted")
  }
  const addIngToRecipe = () => setRecipeModal(r=>({...r,ing:[...r.ing,{iid:"",qty:""}]}))
  const updateIng = (idx,field,val) => setRecipeModal(r=>({...r,ing:r.ing.map((ing,i)=>i===idx?{...ing,[field]:val}:ing)}))
  const removeIng = (idx) => setRecipeModal(r=>({...r,ing:r.ing.filter((_,i)=>i!==idx)}))

  const cats=[...new Set(inventory.map(i=>i.cat))].sort()

  return <div>
    <SHead title="Master List" sub="All your ingredients, recipes, and decorations — changes here update all calculations."/>
    <Alert msg={msg} color={msgColor} onClose={()=>setMsg("")}/>
    <Tabs tabs={[{v:"inventory",l:"Inventory"},{v:"recipes",l:"Base Recipes"},{v:"decorations",l:"Decoration Extras"}]} active={tab} onChange={setTab}/>

    {/* ── INVENTORY ── */}
    {tab==="inventory"&&<div>
      {isOwner&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:13,color:"var(--muted)"}}>{inventory.length} items · {fmt(inventory.reduce((s,i)=>s+i.cost*i.stock,0))} total value</span>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn small variant="ghost" onClick={()=>{setPasteMode(p=>!p);setPasteText("")}}>📋 Paste CSV Data</Btn>
          <Btn small onClick={()=>setAddMode(!addMode)}>+ Add Item</Btn>
        </div>
      </div>}
      <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:8}}>CSV columns: name, category, unit, cost, stock, minStock — column names are flexible, we match automatically</div>
      {pasteMode&&<Card style={{marginBottom:12,background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>Paste CSV Data</div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:10,lineHeight:1.6}}>Copy from Excel or Google Sheets and paste here. First row should be column headers. Columns can be in any order.</div>
        <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder={"name,category,unit,cost,stock,minStock\nFlour,Dry Goods,kg,1140,50,10\nSugar,Dry Goods,kg,1500,50,10"} style={{width:"100%",minHeight:120,padding:"10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:12.5,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none",marginBottom:10}}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={async()=>{
            if(!pasteText.trim())return
            try{const items=parseCSV(pasteText);if(items.length===0){showMsg("No items found — check your column headers","red");return}const updated=[...inventory,...items.filter(ni=>!inventory.find(i=>i.name.toLowerCase()===ni.name.toLowerCase()))];setInventory(updated);await saveInventory(updated);showMsg(`✓ ${items.length} items imported (${updated.length-inventory.length} new added, duplicates skipped)`,"green");setPasteMode(false);setPasteText("")}catch(err){showMsg("Import failed: "+err.message,"red")}
          }}>Import</Btn>
          <Btn variant="ghost" onClick={()=>{setPasteMode(false);setPasteText("")}}>Cancel</Btn>
        </div>
      </Card>}
      {addMode&&isOwner&&<Card style={{marginBottom:12,background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>New Item</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
          <Inp label="Name *" value={newItem.name} onChange={v=>setNewItem(p=>({...p,name:v}))} placeholder="Ingredient name"/>
          <Inp label="Category" value={newItem.cat} onChange={v=>setNewItem(p=>({...p,cat:v}))} placeholder="Dry Goods…"/>
          <Inp label="Unit" value={newItem.unit} onChange={v=>setNewItem(p=>({...p,unit:v}))} placeholder="kg/pcs/L"/>
          <Inp label="Cost/Unit (₦) *" type="number" value={newItem.cost} onChange={v=>setNewItem(p=>({...p,cost:v}))}/>
          <Inp label="Opening Stock" type="number" value={newItem.stock} onChange={v=>setNewItem(p=>({...p,stock:v}))}/>
          <Inp label="Min Stock Alert" type="number" value={newItem.minStock} onChange={v=>setNewItem(p=>({...p,minStock:v}))}/>
        </div>
        <div style={{display:"flex",gap:8}}><Btn onClick={addItem}>Save</Btn><Btn variant="ghost" onClick={()=>setAddMode(false)}>Cancel</Btn></div>
      </Card>}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
          <TH cols={["Item","Category","Unit","Cost/Unit","Stock","Min","Value",...(isOwner?["Restock","Actions"]:[])]}/>
          <tbody>{inventory.map((item,i)=>{
            const editing=editId===item.id
            return <tr key={item.id} style={{background:i%2===0?"var(--panel)":"#F8F3EA"}}>
              {editing?<>
                <td style={{padding:"6px 8px"}}><input value={editRow.name} onChange={e=>setEditRow(r=>({...r,name:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
                <td style={{padding:"6px 8px"}}><input value={editRow.cat} onChange={e=>setEditRow(r=>({...r,cat:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
                <td style={{padding:"6px 8px"}}><input value={editRow.unit} onChange={e=>setEditRow(r=>({...r,unit:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:60}}/></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.cost} onChange={e=>setEditRow(r=>({...r,cost:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.stock} onChange={e=>setEditRow(r=>({...r,stock:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.minStock} onChange={e=>setEditRow(r=>({...r,minStock:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:50}}/></td>
                <td style={{padding:"6px 8px",fontSize:12}}>{fmt(editRow.cost*editRow.stock)}</td>
                <td colSpan={2} style={{padding:"6px 8px"}}><div style={{display:"flex",gap:4}}><Btn small variant="success" onClick={saveEdit}>✓</Btn><Btn small variant="ghost" onClick={()=>setEditId(null)}>✗</Btn></div></td>
              </>:<>
                <td style={{padding:"9px 10px",fontWeight:500,fontSize:13}}>{item.name}</td>
                <td style={{padding:"9px 10px",color:"var(--muted)",fontSize:12}}>{item.cat}</td>
                <td style={{padding:"9px 10px",fontSize:13}}>{item.unit}</td>
                <td style={{padding:"9px 10px",fontSize:13}}>{fmt(item.cost)}</td>
                <td style={{padding:"9px 10px",color:item.stock<=(item.minStock||3)?"#B03A2E":"var(--text)",fontWeight:item.stock<=(item.minStock||3)?600:400,fontSize:13}}>{item.stock}</td>
                <td style={{padding:"9px 10px",color:"var(--muted)",fontSize:12}}>{item.minStock||2}</td>
                <td style={{padding:"9px 10px",color:"var(--gold)",fontWeight:500,fontSize:13}}>{fmt(item.cost*item.stock)}</td>
                {isOwner&&<>
                  <td style={{padding:"9px 10px"}}><RestockCell id={item.id} unit={item.unit} onRestock={restock}/></td>
                  <td style={{padding:"9px 10px"}}><div style={{display:"flex",gap:4}}><Btn small variant="ghost" onClick={()=>startEdit(item)}>✎</Btn><Btn small variant="danger" onClick={()=>deleteItem(item.id)}>×</Btn></div></td>
                </>}
              </>}
            </tr>
          })}</tbody>
        </table>
      </div>
    </div>}

    {/* ── RECIPES ── */}
    {tab==="recipes"&&<div>
      <div style={{marginBottom:12,padding:"10px 14px",background:"#FFF9EE",borderRadius:8,border:"1px solid var(--gold)",fontSize:13,lineHeight:1.7}}>
        Each recipe is for <strong>1 layer</strong> of that flavour. When you log a production, select the recipe and enter the number of layers — the app multiplies automatically.
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:13,color:"var(--muted)"}}>{recipes.length} recipes · click any card to expand</span>
        {isOwner&&<Btn small onClick={()=>openRecipe(null)}>+ New Recipe</Btn>}
      </div>
      {recipes.map(r=>{
        const costPerLayer=recipeCost(r,inventory)
        const [open,setOpen]=useState(false)
        return <Card key={r.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:600,fontSize:15}}>{r.name}</div>
              {r.notes&&<div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{r.notes}</div>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,color:"var(--muted)"}}>Cost per layer</div>
                <div style={{fontSize:16,fontWeight:700,color:"var(--gold)"}}>{fmt(costPerLayer)}</div>
              </div>
              {isOwner&&<div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
                <Btn small variant="ghost" onClick={()=>openRecipe({...r,id:uid(),name:r.name+" (copy)"})}>Copy</Btn>
                <Btn small variant="ghost" onClick={()=>openRecipe(r)}>✎</Btn>
                <Btn small variant="danger" onClick={()=>deleteRecipe(r.id)}>×</Btn>
              </div>}
              <span style={{color:"var(--muted)",fontSize:16,marginLeft:4}}>{open?"▴":"▾"}</span>
            </div>
          </div>
          {open&&<div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:12}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Ingredients — 1 layer</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Ingredient","Qty","Unit Cost","Line Cost"].map(h=><th key={h} style={{textAlign:h==="Ingredient"?"left":"right",fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,paddingBottom:5,fontWeight:500}}>{h}</th>)}</tr></thead>
              <tbody>
                {r.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<tr key={ing.iid} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"5px 0",fontSize:13}}>{it.name}</td>
                  <td style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>{ing.qty}</td>
                  <td style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>{fmt(it.cost)}/{it.unit}</td>
                  <td style={{textAlign:"right",fontWeight:500,fontSize:13}}>{fmt(it.cost*ing.qty)}</td>
                </tr>:null})}
                <tr><td colSpan={3} style={{textAlign:"right",fontWeight:700,paddingTop:8,fontSize:13}}>Cost × 1 layer</td><td style={{textAlign:"right",fontWeight:700,color:"var(--gold)",fontSize:15,paddingTop:8}}>{fmt(costPerLayer)}</td></tr>
                <tr><td colSpan={3} style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>Cost × 2 layers</td><td style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>{fmt(costPerLayer*2)}</td></tr>
                <tr><td colSpan={3} style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>Cost × 3 layers</td><td style={{textAlign:"right",color:"var(--muted)",fontSize:12}}>{fmt(costPerLayer*3)}</td></tr>
              </tbody>
            </table>
          </div>}
        </Card>
      })}
      {recipeModal&&<Modal title={recipeModal.name?"Edit Recipe":"New Recipe"} onClose={()=>setRecipeModal(null)}>
        <Inp label="Recipe Name * (e.g. Vanilla Cake, Red Velvet)" value={recipeModal.name} onChange={v=>setRecipeModal(r=>({...r,name:v}))}/>
        <Inp label="Notes (optional)" value={recipeModal.notes||""} onChange={v=>setRecipeModal(r=>({...r,notes:v}))} placeholder="e.g. Quantities for 1 layer"/>
        <div style={{padding:"8px 12px",background:"#FFF9EE",borderRadius:7,fontSize:12.5,color:"#9A6C1A",marginBottom:12}}>Enter quantities for <strong>one single layer</strong>. The production form will multiply by the number of layers.</div>
        <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>Ingredients (per 1 layer)</div>
        {recipeModal.ing.map((ing,idx)=><div key={idx} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
          <select value={ing.iid} onChange={e=>updateIng(idx,"iid",e.target.value)} style={{...iSt,flex:2,fontSize:12}}><option value="">— Select ingredient —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) — {fmt(i.cost)}/{i.unit}</option>)}</select>
          <input type="number" placeholder="Qty" value={ing.qty} onChange={e=>updateIng(idx,"qty",e.target.value)} style={{...iSt,width:70,fontSize:12}}/>
          <Btn small variant="danger" onClick={()=>removeIng(idx)}>×</Btn>
        </div>)}
        <Btn small variant="ghost" onClick={addIngToRecipe}>+ Add Ingredient</Btn>
        {recipeModal.ing.length>0&&<div style={{marginTop:10,padding:"8px 12px",background:"#F5F0E4",borderRadius:7,fontSize:13}}>Cost per layer: <strong style={{color:"var(--gold)"}}>{fmt(recipeCost(recipeModal,inventory))}</strong></div>}
        <div style={{marginTop:12,display:"flex",gap:8}}><Btn variant="success" onClick={saveRecipe}>✓ Save Recipe</Btn><Btn variant="ghost" onClick={()=>setRecipeModal(null)}>Cancel</Btn></div>
      </Modal>}
    </div>}

    {/* ── DECORATIONS ── */}
    {tab==="decorations"&&<div>
      <div style={{marginBottom:12,fontSize:13,color:"var(--muted)"}}>These decoration extras are selectable per production order. Costs update automatically when inventory prices change.</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
          <TH cols={["Decoration","Linked Inventory Item","Qty Used","Cost"]}/>
          <tbody>{DECORATION_ITEMS.map((d,i)=>{
            const it=inventory.find(x=>x.id===d.iid)
            return <TR2 key={d.id} i={i} row={[
              <span style={{fontWeight:500}}>{d.label}</span>,
              <span style={{color:"var(--muted)",fontSize:12.5}}>{it?.name||"—"}</span>,
              <span>{d.qty} {it?.unit}</span>,
              <span style={{color:"var(--gold)",fontWeight:500}}>{it?fmt(it.cost*d.qty):"—"}</span>,
            ]}/>
          })}</tbody>
        </table>
      </div>
    </div>}
  </div>
}

function RestockCell({id,unit,onRestock}){
  const [qty,setQty]=useState("")
  return <div style={{display:"flex",gap:4,alignItems:"center"}}>
    <input type="number" placeholder="qty" value={qty} onChange={e=>setQty(e.target.value)} style={{...iSt,width:55,padding:"4px 6px",fontSize:12}}/>
    <Btn small variant="outline" onClick={()=>{onRestock(id,qty);setQty("")}}>+</Btn>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  NEW PRODUCTION (AI reads photo → fills details)
// ═══════════════════════════════════════════════════════════
function ProductionEntry({inventory,setInventory,recipes,productions,setProductions,settings,setView,user}){
  const [step,setStep]=useState(1)
  const [photo,setPhoto]=useState(null);const [photoB64,setPhotoB64]=useState(null)
  const [aiObs,setAiObs]=useState(null);const [aiLoading,setAiLoading]=useState(false);const [aiMsg,setAiMsg]=useState("")
  const [saving,setSaving]=useState(false)
  const fileRef=useRef()

  // Order details
  const [recipeId,setRecipeId]=useState("")
  const [layers,setLayers]=useState("1")
  const [size,setSize]=useState("");const [covering,setCovering]=useState("")
  const [flavors,setFlavors]=useState("");const [decorIds,setDecorIds]=useState([])
  const [client,setClient]=useState("");const [clientPhone,setClientPhone]=useState("");const [clientEmail,setClientEmail]=useState("")
  const [orderDate,setOrderDate]=useState(today());const [delivDate,setDelivDate]=useState("")
  const [salePrice,setSalePrice]=useState("");const [deliveryCost,setDeliveryCost]=useState("0")
  const [paymentType,setPaymentType]=useState("full");const [discountPct,setDiscountPct]=useState("0")
  const [notes,setNotes]=useState("")

  const SIZES=['6"','8"','10"','12"','2-tier','3-tier','cupcakes×12','cupcakes×24','loaf']
  const COVERINGS=["buttercream","fondant","ganache","naked","plain"]

  const matchedRecipe = recipes.find(r=>r.id===recipeId) || recipes.find(r=>r.size===size&&r.covering===covering) || recipes.find(r=>r.size===size) || null

  const baseCost = calcFullCost(matchedRecipe, inventory, flavors, decorIds, settings.accessoryPct) * (+layers||1)
  const delivCost = +deliveryCost||0
  const totalProdCost = baseCost + delivCost
  const discount = paymentType==="discount"?(+salePrice*(+discountPct/100)):0
  const effectiveSale = paymentType==="full"||paymentType==="deposit" ? +salePrice : paymentType==="discount" ? +salePrice-discount : 0
  const costPerLayer = calcFullCost(matchedRecipe, inventory, flavors, decorIds, settings.accessoryPct)
  const suggestedPrice = baseCost * (1 + (settings.profitPct||40)/100) + delivCost

  const handleFile=e=>{const file=e.target.files[0];if(!file)return;setPhoto(URL.createObjectURL(file));const r=new FileReader();r.onload=ev=>setPhotoB64(ev.target.result.split(",")[1]);r.readAsDataURL(file)}

  const analyzePhoto = async () => {
    if(!photoB64)return;setAiLoading(true);setAiMsg("")
    try{
      const compressed = await compressImage(photoB64)
      const invList=inventory.map(i=>`${i.name}(${i.unit})`).join(",")
      const decorList=DECORATION_ITEMS.map(d=>`${d.id}:${d.name}`).join(",")
      const raw = await callClaude([{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:compressed}},
        {type:"text",text:`You are analyzing a custom cake photo for a Nigerian bakery's bookkeeping system. 

Analyze this cake image carefully and return ONLY valid JSON with this exact structure:
{
  "estimatedSize": "6 inch OR 8 inch OR 10 inch OR 12 inch OR 2-tier OR 3-tier OR cupcakes",
  "covering": "buttercream OR fondant OR ganache OR naked",
  "estimatedTiers": 1,
  "colorDescription": "describe the colors used",
  "flavorClues": "any visual clues about flavor (e.g. dark color = chocolate, red = red velvet)",
  "decorationsUsed": ["list of decoration IDs from: ${decorList}"],
  "accessoriesDescription": "describe all decorations, toppings, extras visible",
  "photoNotes": "one sentence summary for the record"
}`
      }]}],"You analyze cake photos for bookkeeping. Return valid JSON only, no markdown.")
      const r=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setAiObs(r)
      // Auto-fill fields
      if(!covering&&r.covering&&COVERINGS.includes(r.covering))setCovering(r.covering)
      if(!size&&r.estimatedSize){
        const s=r.estimatedSize.replace(/\s*(inch|in)\s*/i,'"').replace(/(\d+)"/,'$1"')
        if(SIZES.includes(s))setSize(s); else if(SIZES.includes(r.estimatedSize))setSize(r.estimatedSize)
      }
      if(r.decorationsUsed?.length>0)setDecorIds(r.decorationsUsed.filter(id=>DECORATION_ITEMS.find(d=>d.id===id)))
      if(r.flavorClues&&!flavors){
        const fc=r.flavorClues.toLowerCase()
        if(fc.includes("chocolate")||fc.includes("dark"))setFlavors("Chocolate")
        else if(fc.includes("red velvet"))setFlavors("Red Velvet")
        else if(fc.includes("carrot"))setFlavors("Carrot")
        else setFlavors("Vanilla")
      }
      setAiMsg("✓ AI has pre-filled size, covering, decorations and flavour from the photo. Review and confirm below.")
    }catch(err){setAiMsg("⚠ Could not read photo automatically. Fields have not been pre-filled — please fill in manually below. (Error: "+err.message+")")}
    finally{setAiLoading(false)}
  }

  const toggleDecor = (id) => setDecorIds(prev => prev.includes(id) ? prev.filter(d=>d!==id) : [...prev,id])

  const doSave = async () => {
    setSaving(true)
    const prod={id:uid(),recipeId:matchedRecipe?.id,client,clientPhone,clientEmail,orderDate,deliveryDate:delivDate,cost:Math.round(totalProdCost),deliveryCost:delivCost,salePrice:Math.round(effectiveSale),status:"pending",size,covering,flavors,decorations:decorIds.join(","),layers:1,accessoryPct:settings.accessoryPct,profitPct:settings.profitPct,paymentType,discountPct:+discountPct,notes}
    // Deduct inventory
    if(matchedRecipe){
      const layerCount=+layers||1
      const deductions=[...matchedRecipe.ing.map(i=>({...i,qty:+(i.qty)*layerCount}))]
      const fl=(flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
      fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const ex=deductions.find(d=>d.iid===e.iid);if(ex)ex.qty=parseFloat((ex.qty+e.qty).toFixed(3));else deductions.push({iid:e.iid,qty:e.qty})}))
      decorIds.forEach(did=>{const decor=DECORATION_ITEMS.find(d=>d.id===did);if(decor){const ex=deductions.find(d=>d.iid===decor.iid);if(ex)ex.qty=parseFloat((ex.qty+decor.qty).toFixed(3));else deductions.push({iid:decor.iid,qty:decor.qty})}})
      const updInv=inventory.map(item=>{const ing=deductions.find(i=>i.iid===item.id);return ing?{...item,stock:Math.max(0,parseFloat((item.stock-ing.qty).toFixed(3)))}:item})
      setInventory(updInv);await saveInventory(updInv)
    }
    setProductions(prev=>[prod,...prev]);await saveProduction(prod);setSaving(false)
    // Reset
    setStep(1);setPhoto(null);setPhotoB64(null);setAiObs(null);setAiMsg("");setRecipeId("");setLayers("1");setSize("");setCovering("");setFlavors("");setDecorIds([]);setClient("");setClientPhone("");setClientEmail("");setOrderDate(today());setDelivDate("");setSalePrice("");setDeliveryCost("0");setPaymentType("full");setDiscountPct("0");setNotes("")
    setView("records")
  }

  return <div>
    <SHead title="New Production Entry" sub="Upload cake photo → AI reads it → fills in details automatically."/>
    <Steps steps={["Cake Details","Cost Breakdown","Confirm"]} cur={step}/>

    {step===1&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>📸 Cake Photo <span style={{fontSize:11,color:"var(--muted)"}}>(recommended)</span></div>
        <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:photo?4:36,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:10,minHeight:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="cake" style={{maxHeight:180,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:36,marginBottom:6}}>🎂</div><div style={{fontSize:13,color:"var(--muted)"}}>Tap to upload cake photo</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!aiObs&&!aiLoading&&<Btn full onClick={analyzePhoto}>✦ Let AI Read This Photo</Btn>}
        {aiLoading&&<div style={{textAlign:"center",padding:"10px",color:"var(--muted)",fontSize:13}}>🔍 AI is reading the photo...</div>}
        {aiMsg&&<div style={{marginTop:8,padding:"8px 12px",background:aiMsg.startsWith("✓")?"#EEF8F3":"#FDEBE9",borderRadius:8,fontSize:12.5,color:aiMsg.startsWith("✓")?"#357A52":"#B03A2E",lineHeight:1.5}}>{aiMsg}</div>}
        {aiObs&&<div style={{marginTop:8,background:"#FFF9EE",borderRadius:8,padding:10,border:"1px solid var(--gold)",fontSize:12.5}}>
          <div style={{fontWeight:600,marginBottom:6,color:"var(--text)"}}>✦ AI observed from photo:</div>
          {[["Size",aiObs.estimatedSize],["Covering",aiObs.covering],["Colour",aiObs.colorDescription],["Flavour clues",aiObs.flavorClues],["Decorations",aiObs.accessoriesDescription]].filter(([,v])=>v).map(([k,v])=><div key={k} style={{marginBottom:3,display:"flex",gap:6}}><span style={{color:"var(--muted)",minWidth:80}}>{k}:</span><span style={{color:"var(--text)"}}>{v}</span></div>)}
        </div>}
      </Card>

      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Cake & Order Details</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Cake Size *" value={size} onChange={setSize} options={SIZES.map(s=>({value:s,label:s}))}/>
          <Sel label="Covering *" value={covering} onChange={setCovering} options={COVERINGS.map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}))}/>
        </div>
        <Inp label="Flavour(s) *" value={flavors} onChange={setFlavors} placeholder="e.g. Vanilla, Chocolate, Red Velvet"/>
        <Sel label="Use Recipe" value={recipeId} onChange={setRecipeId} options={recipes.map(r=>({value:r.id,label:`${r.name} (${fmt(recipeCost(r,inventory))}/layer)`}))} placeholder="Select flavour recipe"/>
        {recipeId&&<div style={{padding:"8px 12px",background:"#E8EFFC",borderRadius:8,fontSize:12.5,marginBottom:11,color:"#2355A0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Cost per layer: <strong>{fmt(costPerLayer)}</strong></span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <label style={{fontSize:12,color:"#2355A0"}}>Layers:</label>
            <select value={layers} onChange={e=>setLayers(e.target.value)} style={{...iSt,width:80,padding:"4px 8px",fontSize:13}}>{["1","2","3","4","5","6"].map(n=><option key={n} value={n}>{n}</option>)}</select>
            <span style={{fontWeight:700,color:"var(--gold)"}}>= {fmt(costPerLayer*(+layers||1))}</span>
          </div>
        </div>}
        <div style={{marginBottom:12}}>
          <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Decoration Extras (select all that apply)</label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {DECORATION_ITEMS.map(d=>{
              const it=inventory.find(x=>x.id===d.iid)
              const sel=decorIds.includes(d.id)
              return <div key={d.id} onClick={()=>toggleDecor(d.id)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${sel?"var(--gold)":"var(--border)"}`,background:sel?"#FFF9EE":"transparent",cursor:"pointer",fontSize:12,color:sel?"var(--gold)":"var(--muted)"}}>
                {d.name} {it?`(${fmt(it.cost*d.qty)})`:""}</div>
            })}
          </div>
        </div>
        <Inp label="Client Name *" value={client} onChange={setClient} placeholder="Mrs. Chioma Okafor"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Phone" value={clientPhone} onChange={setClientPhone} placeholder="+234…"/>
          <Inp label="Email" value={clientEmail} onChange={setClientEmail} placeholder="optional"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Order Date" type="date" value={orderDate} onChange={setOrderDate}/>
          <Inp label="Delivery Date *" type="date" value={delivDate} onChange={setDelivDate}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Sale Price (₦)" type="number" value={salePrice} onChange={setSalePrice} placeholder={suggestedPrice>0?`Suggested: ${fmt(suggestedPrice)}`:"0"}/>
          <Inp label="Delivery Cost (₦)" type="number" value={deliveryCost} onChange={setDeliveryCost} placeholder="0"/>
        </div>
        <Sel label="Payment Type" value={paymentType} onChange={setPaymentType} options={PAYMENT_TYPES.map(p=>({value:p.v,label:p.l}))}/>
        {paymentType==="discount"&&<Inp label="Discount %" type="number" value={discountPct} onChange={setDiscountPct}/>}
        <Inp label="Notes" value={notes} onChange={setNotes} placeholder="Colour theme, special requests…"/>
        {matchedRecipe&&<div style={{padding:"7px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,marginBottom:10}}>Matched: <strong>{matchedRecipe.name}</strong></div>}
        {suggestedPrice>0&&!salePrice&&<div style={{padding:"7px 12px",background:"#E8EFFC",borderRadius:8,fontSize:12.5,marginBottom:10,color:"#2355A0"}}>💡 Suggested price (with {settings.profitPct||40}% profit): <strong>{fmt(suggestedPrice)}</strong></div>}
        <Btn full onClick={()=>setStep(2)} disabled={!size||!covering||!client||!delivDate}>Review Cost Breakdown →</Btn>
      </Card>
    </div>}

    {step===2&&matchedRecipe&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:16}}>Cost Breakdown</div>
        <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Base Ingredients ({matchedRecipe.name})</div>
        {matchedRecipe.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<div key={ing.iid} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>{it.name} ({ing.qty}{it.unit})</span><span>{fmt(it.cost*ing.qty)}</span></div>:null})}
        {decorIds.length>0&&<><div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,margin:"10px 0 5px"}}>Decorations</div>
          {decorIds.map(did=>{const d=DECORATION_ITEMS.find(x=>x.id===did);const it=inventory.find(x=>x.id===d?.iid);return d&&it?<div key={did} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>{d.name} ({d.qty}{it.unit})</span><span>+{fmt(it.cost*d.qty)}</span></div>:null})}</>}
        {flavors&&<><div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,margin:"10px 0 5px"}}>Flavour Extras</div>
          {(flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean).map(f=>(FLAVOR_EXTRAS[f]||[]).map(e=>{const it=inventory.find(x=>x.id===e.iid);return it?<div key={f+e.iid} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>{f} — {it.name}</span><span>+{fmt(it.cost*e.qty)}</span></div>:null}))}</>}
        <div style={{borderTop:"1px solid var(--border)",marginTop:8,paddingTop:8}}>
          {[["Ingredient cost",fmt(recipeCost(matchedRecipe,inventory))],["Accessory margin ("+settings.accessoryPct+"%)",fmt(baseCost-recipeCost(matchedRecipe,inventory))],["Delivery",fmt(delivCost)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"var(--muted)",padding:"2px 0"}}><span>{k}</span><span>{v}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,padding:"8px 0",borderTop:"1px solid var(--border)",marginTop:4}}><span>Total Production Cost</span><span style={{color:"var(--gold)"}}>{fmt(totalProdCost)}</span></div>
        </div>
        {effectiveSale>0&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF",marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Sale Price</span><span style={{fontWeight:600}}>{fmt(effectiveSale)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,paddingTop:8,borderTop:"1px solid #C2E0CF"}}><span>Gross Profit</span><span style={{color:"#357A52"}}>{fmt(effectiveSale-totalProdCost)}</span></div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Margin: {effectiveSale>0?Math.round(((effectiveSale-totalProdCost)/effectiveSale)*100):0}%</div>
        </div>}
        {(paymentType==="gift"||paymentType==="sample")&&<div style={{background:"#F0EAFC",borderRadius:8,padding:10,marginTop:8,fontSize:12.5,color:"#6B32A0"}}>This is a <strong>{paymentType}</strong> — no revenue logged but all costs are tracked.</div>}
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Order Summary</div>
        {[[`Size`,size],[`Covering`,covering],["Flavours",flavors],["Decorations",decorIds.map(id=>DECORATION_ITEMS.find(d=>d.id===id)?.name).filter(Boolean).join(", ")||"None"],["Client",client],["Phone",clientPhone||"—"],["Order Date",orderDate],["Delivery Date",delivDate],["Payment",PAYMENT_TYPES.find(p=>p.v===paymentType)?.l||paymentType],["Notes",notes||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)",fontSize:12.5}}><span style={{color:"var(--muted)"}}>{k}</span><span style={{fontWeight:500,textAlign:"right",maxWidth:"55%"}}>{v}</span></div>)}
        {photo&&<img src={photo} alt="" style={{width:"100%",borderRadius:8,marginTop:10}}/>}
        <div style={{marginTop:10,fontSize:12,color:"var(--muted)",background:"#FFF9EE",borderRadius:6,padding:"7px 10px"}}>⚠ Saving deducts {matchedRecipe.ing.length + decorIds.length} ingredient(s) from inventory.</div>
        <div style={{marginTop:12,display:"flex",gap:8}}><Btn onClick={()=>setStep(3)}>Confirm →</Btn><Btn variant="ghost" onClick={()=>setStep(1)}>← Edit</Btn></div>
      </Card>
    </div>}

    {step===3&&<div style={{maxWidth:460}}>
      <Card style={{borderColor:"#357A52",background:"#F2FAF6"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:6}}>✓ Ready to Save</div>
        <p style={{fontSize:13,color:"var(--muted)",marginTop:0}}>This will create a production record and deduct all ingredients from inventory.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"12px 0",borderTop:"1px solid var(--border)"}}>
          {[["Prod. Cost",fmt(totalProdCost)],["Sale Price",fmt(effectiveSale)],["Gross Profit",fmt(effectiveSale-totalProdCost)]].map(([k,v])=><div key={k} style={{background:"var(--panel)",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8}}>{k}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:"var(--gold)",marginTop:3}}>{v}</div></div>)}
        </div>
        <div style={{display:"flex",gap:8,marginTop:4}}>{saving?<Spinner/>:<><Btn variant="success" onClick={doSave}>✓ Save Production Record</Btn><Btn variant="ghost" onClick={()=>setStep(2)}>← Back</Btn></>}</div>
      </Card>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  RECEIPT SCANNER (fixed)
// ═══════════════════════════════════════════════════════════
function ReceiptScanner({inventory,setInventory,expenses,setExpenses}){
  const [photo,setPhoto]=useState(null);const [photoB64,setPhotoB64]=useState(null)
  const [loading,setLoading]=useState(false);const [error,setError]=useState("");const [saved,setSaved]=useState(false)
  const [parsed,setParsed]=useState(null);const [totalAmount,setTotalAmount]=useState("")
  const fileRef=useRef()

  const handleFile=e=>{const file=e.target.files[0];if(!file)return;setPhoto(URL.createObjectURL(file));const r=new FileReader();r.onload=ev=>setPhotoB64(ev.target.result.split(",")[1]);r.readAsDataURL(file);setParsed(null);setSaved(false);setError("")}

  const scan=async()=>{
    if(!photoB64)return;setLoading(true);setError("")
    try{
      const compressed = await compressImage(photoB64, 1200)
      const invList=inventory.map(i=>`${i.id}:${i.name}(${i.unit})`).join(", ")
      const raw=await callClaude([{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:compressed}},
        {type:"text",text:`This is a Nigerian bakery purchase receipt — it may be handwritten or printed. Please carefully read every item visible.

Extract all purchased items. Then match each item to the closest item in this inventory list:
${invList}

Return ONLY this exact JSON format, no other text:
{
  "items": [
    {"item_on_receipt": "exact text as written", "qty": 50, "unit": "kg", "unit_price": 1140, "line_total": 57000, "matched_id": "i1", "matched_name": "Flour", "confidence": "high"}
  ],
  "receipt_total": 57000,
  "receipt_date": "2026-04-01",
  "supplier": "market/store name if visible"
}

For handwritten receipts, do your best to interpret the writing. If a field is unclear, make your best guess. confidence should be "high", "medium", or "low".`}
      ]}],"You parse Nigerian bakery purchase receipts, including handwritten ones. Return valid JSON only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      if(!result.items||result.items.length===0)throw new Error("No items found in receipt image. Try a brighter, clearer photo.")
      setParsed({...result,items:result.items.map(r=>({...r,approved:r.confidence!=="low",overrideId:r.matched_id}))})
      if(result.receipt_total)setTotalAmount(String(result.receipt_total))
    }catch(err){setError(`Could not read receipt: ${err.message}`)}
    finally{setLoading(false)}
  }

  const toggleApprove=idx=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,approved:!r.approved}:r)}))
  const setMatch=(idx,id)=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,overrideId:id,approved:true}:r)}))

  const applyUpdates=async()=>{
    const approved=parsed.items.filter(r=>r.approved&&r.overrideId)
    const updInv=inventory.map(item=>{const match=approved.find(r=>r.overrideId===item.id);return match?{...item,stock:parseFloat((item.stock+(+match.qty||0)).toFixed(3))}:item})
    setInventory(updInv);await saveInventory(updInv)
    const amt=+totalAmount||parsed.items.reduce((s,r)=>s+(r.line_total||0),0)
    const exp={id:uid(),date:parsed.receipt_date||today(),description:`Purchase: ${parsed.supplier||"Supplier"}`,amount:amt,category:"Ingredients",paymentMethod:"cash",source:"receipt",notes:`${approved.length} items: ${approved.map(r=>r.matched_name||r.item_on_receipt).join(", ")}`}
    const updExp=[exp,...expenses];setExpenses(updExp);saveExpenses(updExp)
    setParsed(null);setPhoto(null);setPhotoB64(null);setSaved(true)
  }

  return <div>
    <SHead title="Receipt Scanner" sub="Photo → AI reads items → updates inventory + logs expense."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>📷 Upload Receipt Photo</div>
        <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:photo?4:44,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:12,minHeight:130,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="receipt" style={{maxHeight:260,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:36,marginBottom:6}}>🧾</div><div style={{fontSize:13,color:"var(--muted)"}}>Tap to upload receipt photo</div><div style={{fontSize:11.5,color:"#C8B89A",marginTop:3}}>Printed or handwritten receipts</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!parsed&&!saved&&<><Btn full onClick={scan} disabled={loading}>{loading?"🔍 AI is reading the receipt…":"✦ Scan & Extract Items"}</Btn>
          {loading&&<div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>This may take 15-30 seconds…</div>}
          {error&&<div style={{marginTop:10,padding:"8px 12px",background:"#FDEBE9",borderRadius:8,fontSize:12.5,color:"#B03A2E",lineHeight:1.5}}>⚠ {error}<br/>Try: better lighting, hold camera steady, make sure writing is visible.</div>}
        </>}
        {saved&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF"}}>
          <div style={{fontWeight:600,color:"#357A52",marginBottom:4}}>✓ Inventory updated & expense logged!</div>
          <Btn small variant="outline" onClick={()=>{setSaved(false);setPhoto(null);setPhotoB64(null)}}>Scan Another</Btn>
        </div>}
      </Card>
      <div>
        {parsed?<Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Items Detected</div>
          {parsed.supplier&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:3}}>Supplier: <strong>{parsed.supplier}</strong></div>}
          {parsed.receipt_date&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>Date: <strong>{parsed.receipt_date}</strong></div>}
          {parsed.items.map((r,idx)=><div key={idx} style={{padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,fontWeight:500}}>{r.item_on_receipt}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>{r.qty} {r.unit} · {fmt(r.line_total||0)}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Badge color={r.confidence==="high"?"green":r.confidence==="medium"?"gold":"red"}>{r.confidence}</Badge>
                <div onClick={()=>toggleApprove(idx)} style={{width:32,height:18,borderRadius:9,background:r.approved?"#357A52":"var(--border)",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:2,left:r.approved?16:2,transition:"left 0.2s"}}/></div>
              </div>
            </div>
            {r.approved&&<div style={{marginTop:6}}><select value={r.overrideId||""} onChange={e=>setMatch(idx,e.target.value)} style={{...iSt,fontSize:12,padding:"5px 8px"}}><option value="">— Skip this item —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) · stock: {i.stock}</option>)}</select></div>}
          </div>)}
          <Inp label="Receipt Total (₦)" type="number" value={totalAmount} onChange={setTotalAmount} placeholder="Total amount paid"/>
          <div style={{display:"flex",gap:8,marginTop:10}}><Btn variant="success" onClick={applyUpdates} disabled={!parsed.items.some(r=>r.approved&&r.overrideId)}>✓ Update Inventory & Log Expense</Btn><Btn variant="ghost" onClick={()=>{setParsed(null);setPhoto(null);setPhotoB64(null)}}>← Rescan</Btn></div>
        </Card>:<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>How It Works</div>
          {[["📸","Take a clear photo — printed supermarket receipt or handwritten market receipt."],["🔍","AI reads every item, quantity, and price. It can read handwriting too."],["✅","Review each item. Toggle off anything misread. Fix inventory matches if needed."],["📦","Tap Update — stock is added and expense is automatically logged."]].map(([icon,text])=><div key={icon} style={{display:"flex",gap:10,marginBottom:12}}><span style={{fontSize:18,flexShrink:0}}>{icon}</span><span style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{text}</span></div>)}
          <div style={{padding:"8px 12px",background:"#FEF0D0",borderRadius:8,fontSize:12,color:"#7A5500",lineHeight:1.6}}><strong>Best results:</strong> Take photos in good natural or bright light. Lay the receipt flat. Avoid shadows across the writing. Even imperfect handwriting usually works.</div>
        </Card>}
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  EXPENSES
// ═══════════════════════════════════════════════════════════
function Expenses({expenses,setExpenses}){
  const [tab,setTab]=useState("all");const [adding,setAdding]=useState(false)
  const [ne,setNe]=useState({date:today(),description:"",amount:"",category:"Ingredients",paymentMethod:"cash",notes:""})

  const saveExp=()=>{
    if(!ne.description||!ne.amount)return
    const updated=[{...ne,id:uid(),amount:+ne.amount,source:"manual"},...expenses]
    setExpenses(updated);saveExpenses(updated)
    setNe({date:today(),description:"",amount:"",category:"Ingredients",paymentMethod:"cash",notes:""});setAdding(false)
  }

  const m=new Date().toISOString().slice(0,7)
  const filtered=tab==="all"?expenses:tab==="month"?expenses.filter(e=>e.date?.startsWith(m)):expenses.filter(e=>e.source===tab)
  const total=filtered.reduce((s,e)=>s+(e.amount||0),0)
  const byCat={};filtered.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+(e.amount||0)})

  return <div>
    <SHead title="Expenses" sub="All business expenses — receipts, bank imports, and manual cash entries."/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
      <Tabs tabs={[{v:"all",l:"All"},{v:"month",l:"This Month"},{v:"manual",l:"Cash Entries"},{v:"receipt",l:"From Receipts"},{v:"bank",l:"From Bank"}]} active={tab} onChange={setTab}/>
      <Btn onClick={()=>setAdding(!adding)}>+ Add Cash Expense</Btn>
    </div>
    {adding&&<Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>New Manual Expense (Cash / No Receipt)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <Inp label="Date *" type="date" value={ne.date} onChange={v=>setNe(p=>({...p,date:v}))}/>
        <Inp label="Description *" value={ne.description} onChange={v=>setNe(p=>({...p,description:v}))} placeholder="e.g. Fresh fruits from market"/>
        <Inp label="Amount (₦) *" type="number" value={ne.amount} onChange={v=>setNe(p=>({...p,amount:v}))}/>
        <Sel label="Category" value={ne.category} onChange={v=>setNe(p=>({...p,category:v}))} options={EXP_CATS.map(c=>({value:c,label:c}))}/>
        <Sel label="Payment Method" value={ne.paymentMethod} onChange={v=>setNe(p=>({...p,paymentMethod:v}))} options={[{value:"cash",label:"Cash"},{value:"transfer",label:"Bank Transfer"},{value:"pos",label:"POS/Card"}]}/>
        <Inp label="Notes" value={ne.notes} onChange={v=>setNe(p=>({...p,notes:v}))} placeholder="Optional note"/>
      </div>
      <div style={{display:"flex",gap:8}}><Btn onClick={saveExp}>Save</Btn><Btn variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn></div>
    </Card>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Card style={{borderTop:"3px solid #B03A2E"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Total Expenses</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#B03A2E"}}>{fmt(total)}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{filtered.length} entries</div></Card>
      <Card><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>By Category</div>{Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([cat,amt])=><div key={cat} style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12.5}}><span>{cat}</span><span style={{fontWeight:500}}>{fmt(amt)}</span></div>)}</Card>
    </div>
    <Card style={{padding:0,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <TH cols={["Date","Description","Category","Method","Amount","Source",""]}/>
        <tbody>{filtered.length===0?<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No expenses found. Add one above or scan a receipt.</td></tr>:
          filtered.map((e,i)=><TR2 key={e.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{e.date}</span>,
            <span style={{fontWeight:500}}>{e.description}</span>,
            <Badge>{e.category}</Badge>,
            <span style={{fontSize:12}}>{e.paymentMethod}</span>,
            <span style={{color:"#B03A2E",fontWeight:600}}>{fmt(e.amount)}</span>,
            <Badge color={e.source==="receipt"?"blue":e.source==="bank"?"green":"gray"}>{e.source||"manual"}</Badge>,
            <Btn small variant="ghost" onClick={()=>{const u=expenses.filter(x=>x.id!==e.id);setExpenses(u);saveExpenses(u)}}>×</Btn>,
          ]}/>)}
        </tbody>
      </table>
    </Card>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  RECORDS
// ═══════════════════════════════════════════════════════════
function Records({productions,setProductions,setView,setPrefillProd,user}){
  const [filter,setFilter]=useState("all")
  const filtered=filter==="all"?productions:filter==="pending"||filter==="delivered"?productions.filter(p=>p.status===filter):productions.filter(p=>p.paymentType===filter)
  const isOwner=user?.role==="owner"

  return <div>
    <SHead title="Production Records" sub={`${productions.length} total entries`}/>
    <Tabs tabs={[{v:"all",l:"All"},{v:"pending",l:"Pending"},{v:"delivered",l:"Delivered"},{v:"gift",l:"Gifts"},{v:"sample",l:"Samples"}]} active={filter} onChange={setFilter}/>
    <Card style={{padding:0,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <TH cols={["Date","Cake","Flavours","Client",isOwner?"Cost":"","Delivery",isOwner?"Sale":"","Type","Status",""]}/>
        <tbody>{filtered.length===0?<tr><td colSpan={10} style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No records found.</td></tr>:
          filtered.map((p,i)=><TR2 key={p.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{p.deliveryDate}</span>,
            <span style={{fontWeight:500,fontSize:12.5}}>{p.size} · {p.covering}</span>,
            <span style={{color:"var(--muted)",fontSize:12}}>{p.flavors}</span>,
            <span style={{fontSize:12.5}}>{p.client}</span>,
            isOwner?fmt(p.cost):"",
            <span style={{fontSize:12}}>{p.deliveryCost?fmt(p.deliveryCost):"—"}</span>,
            isOwner?<span style={{color:"var(--gold)",fontWeight:600}}>{fmt(p.salePrice)}</span>:"",
            <Badge color={{full:"green",gift:"purple",sample:"blue",discount:"gold",deposit:"blue"}[p.paymentType]||"gray"}>{p.paymentType}</Badge>,
            <Badge color={p.status==="delivered"?"green":"gold"}>{p.status}</Badge>,
            <div style={{display:"flex",gap:4}}>
              {p.status==="pending"&&<Btn small variant="outline" onClick={async()=>{setProductions(pr=>pr.map(x=>x.id===p.id?{...x,status:"delivered"}:x));await updateProdStatus(p.id,"delivered")}}>✓ Done</Btn>}
              {isOwner&&<Btn small variant="ghost" onClick={()=>{setPrefillProd(p);setView("invoices")}}>Invoice</Btn>}
            </div>,
          ]}/>)}
        </tbody>
      </table>
    </Card>
    {isOwner&&filtered.length>0&&<div style={{marginTop:12,padding:"10px 12px",background:"var(--panel)",borderRadius:8,border:"1px solid var(--border)",display:"flex",gap:20,flexWrap:"wrap"}}>
      <span style={{fontSize:13,color:"var(--muted)"}}>Revenue: <strong style={{color:"var(--gold)"}}>{fmt(filtered.filter(p=>p.paymentType!=="gift"&&p.paymentType!=="sample").reduce((s,p)=>s+(p.salePrice||0),0))}</strong></span>
      <span style={{fontSize:13,color:"var(--muted)"}}>Cost: <strong>{fmt(filtered.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0))}</strong></span>
      <span style={{fontSize:13,color:"var(--muted)"}}>Profit: <strong style={{color:"#357A52"}}>{fmt(filtered.filter(p=>p.paymentType!=="gift"&&p.paymentType!=="sample").reduce((s,p)=>s+(p.salePrice||0)-(p.cost||0)-(p.deliveryCost||0),0))}</strong></span>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  BANK IMPORT — supports PDF upload
// ═══════════════════════════════════════════════════════════
function BankImport({transactions,setTransactions,productions,expenses,setExpenses}){
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false)
  const [error,setError]=useState("");const [parsed,setParsed]=useState([])
  const [mode,setMode]=useState("paste") // paste | file
  const fileRef=useRef()

  const parseFromText=async(text)=>{
    setLoading(true);setError("")
    try{
      const raw=await callClaude([{role:"user",content:`Parse this Nigerian GTBank/bank statement. Extract ALL transactions. Return ONLY a JSON array:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|ingredients|delivery|packaging|salary|office|utilities|transfer|bank_charges|unknown"}]\n\nImportant: credits are money IN (customers paying), debits are money OUT (expenses).\nIgnore stamp duties, VAT charges, and commission lines below ₦500 — they are bank fees.\n\nStatement text:\n${text}`}],"Parse Nigerian bank statements accurately. Return JSON array only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      const filtered=result.filter(t=>t.amount>=100) // filter tiny bank charges
      setParsed(filtered.map(t=>({...t,id:uid(),matchedProdId:null})))
    }catch(err){setError("Could not parse: "+err.message)}
    finally{setLoading(false)}
  }

  const handleFile=e=>{
    const file=e.target.files[0];if(!file)return;e.target.value=""
    setLoading(true);setError("")
    const reader=new FileReader()
    reader.onload=async ev=>{
      try{
        const base64=ev.target.result.split(",")[1]
        const isPDF=file.name.toLowerCase().endsWith(".pdf")||file.type==="application/pdf"
        if(isPDF){
          const raw=await callClaude([{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
            {type:"text",text:`Parse ALL transactions from this Nigerian bank statement PDF. Return ONLY a JSON array:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|ingredients|delivery|packaging|salary|office|utilities|transfer|bank_charges|unknown"}]\n\nCredits = money received from customers. Debits = money paid out.\nIgnore stamp duty and VAT/commission lines under ₦500.`}
          ]}],"Parse Nigerian bank statement PDFs. Return JSON array only.")
          const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
          const filtered=result.filter(t=>t.amount>=100)
          setParsed(filtered.map(t=>({...t,id:uid(),matchedProdId:null})))
          setLoading(false)
        } else {
          // CSV file
          const text=atob(base64)
          await parseFromText(text)
        }
      }catch(err){setError("Could not read file: "+err.message);setLoading(false)}
    }
    if(file.name.toLowerCase().endsWith(".pdf")){reader.readAsDataURL(file)}
    else{reader.readAsText(file)}
  }

  const match=(txId,prodId)=>setParsed(p=>p.map(t=>t.id===txId?{...t,matchedProdId:prodId}:t))

  const saveAll=async()=>{
    const updated=[...parsed,...transactions];setTransactions(updated);await saveTxns(parsed)
    // Auto-add debits to expenses
    const debits=parsed.filter(t=>t.type==="debit"&&t.category!=="bank_charges").map(t=>({
      id:uid(),date:t.date,description:t.description,amount:t.amount,
      category:{ingredients:"Ingredients",delivery:"Delivery",packaging:"Packaging",salary:"Salaries",office:"Utilities",utilities:"Utilities"}[t.category]||"Miscellaneous",
      paymentMethod:"transfer",source:"bank"
    }))
    if(debits.length>0){const updExp=[...debits,...expenses];setExpenses(updExp);saveExpenses(updExp)}
    setParsed([]);setInput("")
  }

  const credits=parsed.filter(t=>t.type==="credit")
  const debits=parsed.filter(t=>t.type==="debit")

  return <div>
    <SHead title="Bank Statement Import" sub="Upload your bank PDF or paste statement text — AI categorizes every transaction."/>
    <Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>📅 Payment Date vs Delivery Date</div>
      <p style={{fontSize:12.5,color:"var(--muted)",margin:0,lineHeight:1.7}}>Clients often pay deposits before delivery. After parsing, use the <em>Match to Order</em> column to link payments to the correct production record. Bank debits are automatically added to your Expenses tab.</p>
    </Card>

    <div style={{display:"flex",gap:8,marginBottom:16}}>
      <Btn small variant={mode==="paste"?"primary":"ghost"} onClick={()=>setMode("paste")}>📋 Paste Text</Btn>
      <Btn small variant={mode==="file"?"primary":"ghost"} onClick={()=>setMode("file")}>📄 Upload PDF / CSV</Btn>
    </div>

    {parsed.length===0?<Card>
      {mode==="paste"?<>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Paste Bank Statement Text</div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"Copy and paste your bank statement text here.\n\nYou can copy the text from your bank's website or app.\n\nThe AI will recognize GTBank, Access, Zenith, UBA, First Bank and all other Nigerian banks."} style={{width:"100%",minHeight:180,padding:"12px",borderRadius:8,border:"1px solid var(--border)",background:"#FAF7F0",fontSize:13,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
        {error&&<div style={{color:"#B03A2E",fontSize:12.5,marginTop:8}}>⚠ {error}</div>}
        <div style={{marginTop:10}}><Btn onClick={()=>parseFromText(input)} disabled={loading||!input.trim()}>{loading?"🔍 Parsing…":"✦ Parse Statement"}</Btn></div>
      </>:<>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Upload Bank Statement</div>
        <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:40,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:10}}>
          <div style={{fontSize:36,marginBottom:8}}>📄</div>
          <div style={{fontSize:14,color:"var(--muted)"}}>Click to upload</div>
          <div style={{fontSize:12,color:"#C8B89A",marginTop:4}}>PDF or CSV bank statement</div>
          <div style={{fontSize:11.5,color:"var(--gold)",marginTop:8}}>✓ GTBank PDF statements supported</div>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.csv,.txt" onChange={handleFile} style={{display:"none"}}/>
        {loading&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:13}}>🔍 AI is reading your statement… This may take 30-60 seconds for long statements.</div>}
        {error&&<div style={{color:"#B03A2E",fontSize:12.5,marginTop:8}}>⚠ {error}</div>}
      </>}
    </Card>:<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[{label:"Credits (In)",val:fmt(credits.reduce((s,t)=>s+t.amount,0)),sub:`${credits.length} payments in`,color:"#357A52"},{label:"Debits (Out)",val:fmt(debits.reduce((s,t)=>s+t.amount,0)),sub:`${debits.length} payments out`,color:"#B03A2E"},{label:"Unmatched Credits",val:parsed.filter(t=>t.type==="credit"&&!t.matchedProdId).length,sub:"need order matching",color:"var(--gold)"}].map(s=><Card key={s.label}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.label}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.sub}</div></Card>)}
      </div>
      <Card style={{padding:0,marginBottom:12,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <TH cols={["Date","Description","Amount","Type","Category","Match to Order"]}/>
          <tbody>{parsed.map((t,i)=><TR2 key={t.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{t.date}</span>,<span style={{fontSize:12.5}}>{t.description}</span>,
            <span style={{fontWeight:600,color:t.type==="credit"?"#357A52":"#B03A2E"}}>{t.type==="credit"?"+":"–"}{fmt(t.amount)}</span>,
            <Badge color={t.type==="credit"?"green":"red"}>{t.type}</Badge>,
            <Badge>{t.category}</Badge>,
            t.type==="credit"?(t.matchedProdId?<span style={{fontSize:12,color:"#357A52",fontWeight:500}}>✓ Matched</span>:(<select onChange={e=>match(t.id,e.target.value)} defaultValue="" style={{fontSize:12,padding:"4px 6px",borderRadius:6,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)"}}><option value="">Match to order…</option>{productions.map(p=><option key={p.id} value={p.id}>{p.client} — {p.deliveryDate} ({fmt(p.salePrice)})</option>)}</select>)):<span style={{color:"var(--border)"}}>—</span>,
          ]}/>)}</tbody>
        </table>
      </Card>
      <div style={{display:"flex",gap:8}}><Btn variant="success" onClick={saveAll}>✓ Save All Transactions</Btn><Btn variant="ghost" onClick={()=>{setParsed([]);setInput("")}}>← New Statement</Btn></div>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  REPORTS (downloadable)
// ═══════════════════════════════════════════════════════════
function Reports({productions,transactions,expenses,company}){
  const allMonths=[...new Set([...productions.map(p=>p.deliveryDate?.slice(0,7)),...transactions.map(t=>t.date?.slice(0,7))].filter(Boolean))].sort().reverse()
  const cur=new Date().toISOString().slice(0,7)
  const [sel,setSel]=useState(allMonths[0]||cur)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(sel))
  const mt=transactions.filter(t=>t.date?.startsWith(sel))
  const me=expenses.filter(e=>e.date?.startsWith(sel))
  const paid=mp.filter(p=>p.paymentType!=="gift"&&p.paymentType!=="sample")
  const rev=paid.reduce((s,p)=>s+(p.salePrice||0),0)
  const prodCost=mp.reduce((s,p)=>s+(p.cost||0),0)
  const delivCosts=mp.reduce((s,p)=>s+(p.deliveryCost||0),0)
  const bankDebits=mt.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0)
  const bankCredits=mt.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0)
  const manualExp=me.filter(e=>e.source==="manual").reduce((s,e)=>s+(e.amount||0),0)
  const totalCost=prodCost+delivCosts+manualExp
  const gross=rev-totalCost;const net=gross-bankDebits
  const margin=rev>0?Math.round((gross/rev)*100):0
  const monthLabel=sel?new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"}):""
  const bySize={};mp.forEach(p=>{const k=`${p.size}·${p.covering}`;if(!bySize[k])bySize[k]={qty:0,rev:0,cost:0};bySize[k].qty++;bySize[k].rev+=(p.salePrice||0);bySize[k].cost+=(p.cost||0)+(p.deliveryCost||0)})

  const dl=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>P&L ${monthLabel}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px;max-width:750px;margin:0 auto}.gold{color:${company.primaryColor||"#C8912A"}}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}h1{font-size:22px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}.stat{border:1px solid #E0D3BB;border-radius:8px;padding:12px}.sl{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}.sv{font-size:18px;font-weight:bold;color:${company.primaryColor||"#C8912A"}}table{width:100%;border-collapse:collapse;margin:14px 0}th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888}td{padding:8px 10px;border-bottom:1px solid #E0D3BB;font-size:13px}.total{font-weight:bold;background:#F5F0E4}.pbox{padding:14px 16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:14px;background:${net>=0?"#E8F5EE":"#FDEBE9"}}.plabel{font-size:15px;font-weight:bold}.pval{font-size:17px;font-weight:bold;color:${net>=0?"#357A52":"#B03A2E"}}@media print{button{display:none}}</style></head><body>
      <div class="header"><div>${company.logo?`<img src="${company.logo}" style="height:55px;display:block;margin-bottom:8px" alt="logo"/>`:""}
      <h1 class="gold">${company.name||"Bakery"}</h1><div style="font-size:13px;color:#888;margin-top:2px">${company.tagline||""}</div></div>
      <div><div style="font-size:22px;font-weight:700;color:#DDD">PROFIT & LOSS</div><div style="font-size:13px;color:#888;margin-top:4px">${monthLabel}</div></div></div>
      <div class="grid">
        <div class="stat"><div class="sl">Revenue</div><div class="sv">₦${Math.round(rev).toLocaleString()}</div><div style="font-size:11px;color:#888">${paid.length} orders</div></div>
        <div class="stat"><div class="sl">Prod. Cost</div><div class="sv">₦${Math.round(totalCost).toLocaleString()}</div></div>
        <div class="stat"><div class="sl">Gross Profit</div><div class="sv">₦${Math.round(gross).toLocaleString()}</div><div style="font-size:11px;color:#888">${margin}% margin</div></div>
        <div class="stat"><div class="sl">Net Profit</div><div class="sv" style="color:${net>=0?"#357A52":"#B03A2E"}">₦${Math.round(net).toLocaleString()}</div></div>
      </div>
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:20px 0 8px">Income from Sales</h3>
      <table><tr><th>Date</th><th>Client</th><th>Product</th><th>Type</th><th>Amount</th></tr>
        ${mp.map(p=>`<tr><td>${p.deliveryDate||""}</td><td>${p.client||""}</td><td>${p.size} ${p.covering}</td><td>${p.paymentType}</td><td>₦${Math.round(p.salePrice||0).toLocaleString()}</td></tr>`).join("")}
        <tr class="total"><td colspan="4">TOTAL REVENUE</td><td>₦${Math.round(rev).toLocaleString()}</td></tr></table>
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin:20px 0 8px">Costs & Expenses</h3>
      <table><tr><th>Date</th><th>Description</th><th>Category</th><th>Source</th><th>Amount</th></tr>
        ${me.map(e=>`<tr><td>${e.date||""}</td><td>${e.description||""}</td><td>${e.category||""}</td><td>${e.source||"manual"}</td><td>₦${Math.round(e.amount||0).toLocaleString()}</td></tr>`).join("")}
        ${mt.filter(t=>t.type==="debit").map(t=>`<tr><td>${t.date||""}</td><td>${t.description||""}</td><td>${t.category||""}</td><td>bank</td><td>₦${Math.round(t.amount||0).toLocaleString()}</td></tr>`).join("")}
        <tr class="total"><td colspan="4">TOTAL COSTS</td><td>₦${Math.round(totalCost+bankDebits).toLocaleString()}</td></tr></table>
      <div class="pbox"><div class="plabel">NET PROFIT — ${monthLabel}</div><div class="pval">₦${Math.round(net).toLocaleString()}</div></div>
      <p style="font-size:11px;color:#aaa;margin-top:30px">Generated by LayerLedger · ${new Date().toLocaleDateString()}</p>
      <script>window.print()</script></body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="Financial Reports" sub="Monthly P&L compiled from productions, expenses, and bank data."/>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13,color:"var(--text)"}}>
        {(allMonths.length?allMonths:[cur]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
      <Btn onClick={dl} variant="outline">📥 Download PDF Report</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:16}}>
      {[{l:"Revenue",v:fmt(rev),s:`${paid.length} paid`,c:"var(--gold)"},{l:"Prod. Cost",v:fmt(prodCost),s:"ingredients",c:"#2A5F9A"},{l:"Delivery",v:fmt(delivCosts),s:"all orders",c:"#8C6E52"},{l:"Other Exp.",v:fmt(manualExp+bankDebits),s:"cash+bank",c:"#8C6E52"},{l:"Gross Profit",v:fmt(gross),s:margin+"% margin",c:"#357A52"},{l:"Net Profit",v:fmt(net),s:"after all costs",c:net>=0?"#357A52":"#B03A2E"}].map(s=><Card key={s.l} style={{borderBottom:`3px solid ${s.c}`}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.s}</div></Card>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:4}}>Profit & Loss — {monthLabel}</div>
        <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6,marginTop:14}}>Income</div>
        {mp.length===0?<div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>No productions this month.</div>:mp.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>{p.size} {p.covering} — {p.client} <span style={{opacity:0.6}}>({p.paymentType})</span></span><span style={{fontWeight:500}}>{fmt(p.salePrice)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid var(--border)",fontWeight:700,marginTop:4}}><span>Total Revenue</span><span style={{color:"#357A52"}}>{fmt(rev)}</span></div>
        <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginTop:14,marginBottom:6}}>Costs</div>
        {[["Production (ingredients)",fmt(prodCost)],["Delivery costs",fmt(delivCosts)],["Cash expenses",fmt(manualExp)],["Bank expenses",fmt(bankDebits)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>{k}</span><span style={{color:"#B03A2E"}}>({v})</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid var(--border)",fontWeight:700,marginTop:4}}><span>Total Costs</span><span style={{color:"#B03A2E"}}>({fmt(totalCost+bankDebits)})</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:net>=0?"#E8F5EE":"#FDEBE9",borderRadius:8,marginTop:12}}><span style={{fontSize:14,fontWeight:700}}>NET PROFIT</span><span style={{fontSize:15,fontWeight:700,color:net>=0?"#357A52":"#B03A2E"}}>{fmt(net)}</span></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Revenue by Cake Type</div>
          {Object.keys(bySize).length===0?<div style={{fontSize:13,color:"var(--muted)"}}>No data for this period.</div>:Object.entries(bySize).map(([k,v])=><div key={k} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12.5}}>{k.replace("·"," · ")} ×{v.qty}</span><span style={{fontSize:12.5,fontWeight:600,color:"var(--gold)"}}>{fmt(v.rev)}</span></div>
            <div style={{height:4,background:"var(--border)",borderRadius:2}}><div style={{height:"100%",width:`${rev>0?(v.rev/rev)*100:0}%`,background:"var(--gold)",borderRadius:2}}/></div>
            <div style={{fontSize:11,color:"#357A52",marginTop:2}}>Profit: {fmt(v.rev-v.cost)}</div>
          </div>)}
        </Card>
        {bankCredits>0&&<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>📅 Bank Reconciliation</div>
          {[["Production records",fmt(rev)],["Bank credits received",fmt(bankCredits)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:4}}><span style={{color:"var(--muted)"}}>{k}</span><strong>{v}</strong></div>)}
          {Math.abs(rev-bankCredits)>1000?<div style={{background:"#FEF3DC",borderRadius:6,padding:"7px 10px",fontSize:12,color:"#8A5F10",marginTop:4}}>⚠ {fmt(Math.abs(rev-bankCredits))} difference — check Bank Import for unmatched payments.</div>:<div style={{color:"#357A52",fontSize:12,fontWeight:500,marginTop:4}}>✓ Reconciled</div>}
        </Card>}
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  SHOPPING LIST
// ═══════════════════════════════════════════════════════════
function ShoppingList({inventory,company}){
  const [freq,setFreq]=useState("weekly");const [done,setDone]=useState(false)
  const low=inventory.filter(i=>i.stock<=(i.minStock||3))
  const zero=inventory.filter(i=>i.stock===0)

  const dl=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>Shopping List</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;max-width:650px;margin:0 auto;color:#291608}h1{color:${company.primaryColor||"#C8912A"};font-size:20px}h2{font-size:13px;color:#888;font-weight:normal;margin:4px 0 20px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#EDE5D6;padding:10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888}td{padding:10px;border-bottom:1px solid #E0D3BB;font-size:13px}.cb{width:18px;height:18px;border:2px solid ${company.primaryColor||"#C8912A"};border-radius:3px;display:inline-block}.sos{color:#B03A2E;font-weight:bold}@media print{button{display:none}}</style></head><body>
      ${company.logo?`<img src="${company.logo}" style="height:50px;margin-bottom:10px;display:block" alt="logo"/>`:""}
      <h1>${company.name} — ${freq==="weekly"?"Weekly":freq==="biweekly"?"Bi-Weekly":"Monthly"} Shopping List</h1>
      <h2>${new Date().toLocaleDateString("en-NG",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</h2>
      ${zero.length>0?`<div style="background:#FDEBE9;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;color:#B03A2E"><strong>🚨 OUT OF STOCK — BUY NOW:</strong> ${zero.map(i=>i.name).join(", ")}</div>`:""}
      <table><tr><th>✓</th><th>Item</th><th>Category</th><th>Current</th><th>Min</th><th>Buy Qty</th><th>Est. Cost</th></tr>
        ${low.map(i=>{const need=Math.max(0,(i.minStock||3)*4-i.stock);return`<tr><td><div class="cb"></div></td><td class="${i.stock===0?"sos":""}">${i.name}${i.stock===0?" 🚨":""}</td><td>${i.cat}</td><td>${i.stock} ${i.unit}</td><td>${i.minStock||3}</td><td>${need} ${i.unit}</td><td>₦${Math.round(i.cost*need).toLocaleString()}</td></tr>`}).join("")}
        <tr style="font-weight:bold;background:#F5F0E4"><td colspan="6">ESTIMATED TOTAL</td><td>₦${Math.round(low.reduce((s,i)=>{const n=Math.max(0,(i.minStock||3)*4-i.stock);return s+i.cost*n},0)).toLocaleString()}</td></tr>
      </table>
      <p style="font-size:11px;color:#aaa;margin-top:30px">LayerLedger · ${new Date().toLocaleDateString()}</p>
      <script>window.print()</script></body></html>`)
    w.document.close();setDone(true)
  }

  return <div>
    <SHead title="Shopping List" sub="Generate a restock list based on current inventory levels."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Generate Shopping List</div>
        <Sel label="Frequency" value={freq} onChange={setFreq} options={[{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Bi-Weekly (every 2 weeks)"},{value:"monthly",label:"Monthly"}]}/>
        <div style={{padding:"10px 12px",background:"#FFF9EE",borderRadius:8,border:"1px solid var(--gold)",fontSize:13,marginBottom:14}}>
          <strong style={{color:"var(--text)"}}>{low.length} items</strong> <span style={{color:"var(--muted)"}}>need restocking</span>
          {zero.length>0&&<div style={{color:"#B03A2E",marginTop:4,fontWeight:500}}>🚨 {zero.length} completely out of stock</div>}
        </div>
        <Btn full onClick={dl}>📥 Download & Print Shopping List</Btn>
        {done&&<div style={{marginTop:8,fontSize:12.5,color:"#357A52"}}>✓ List opened — print or save as PDF from the new tab.</div>}
        <div style={{marginTop:16}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Items Needing Restock</div>
          {low.length===0?<div style={{fontSize:13,color:"#357A52"}}>✓ All items are well-stocked!</div>:
          low.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
            <div><div style={{fontSize:13,fontWeight:500}}>{i.name}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>Min: {i.minStock||3} {i.unit}</div></div>
            <Badge color={i.stock===0?"red":"gold"}>{i.stock===0?"OUT":i.stock+" "+i.unit}</Badge>
          </div>)}
        </div>
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Full Inventory Status</div>
        <div style={{overflowY:"auto",maxHeight:450}}>
          {inventory.map((i)=>{
            const max=(i.minStock||3)*4;const pct=Math.min(100,(i.stock/max)*100)
            return <div key={i.id} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                <span style={{fontSize:12.5,fontWeight:500}}>{i.name}</span>
                <span style={{fontSize:11.5,color:i.stock<=(i.minStock||3)?"#B03A2E":"var(--muted)"}}>{i.stock} {i.unit}</span>
              </div>
              <div style={{height:4,background:"var(--border)",borderRadius:2}}><div style={{height:"100%",width:`${pct}%`,background:pct<25?"#B03A2E":pct<60?"var(--gold)":"#357A52",borderRadius:2,transition:"width 0.3s"}}/></div>
            </div>
          })}
        </div>
      </Card>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  INVOICES
// ═══════════════════════════════════════════════════════════
function Invoices({productions,company,prefillProd,setPrefillProd}){
  const [selProdId,setSelProdId]=useState(prefillProd?.id||"")
  const [clientPhone,setClientPhone]=useState(prefillProd?.clientPhone||"")
  const [clientEmail,setClientEmail]=useState(prefillProd?.clientEmail||"")
  const [clientAddress,setClientAddress]=useState("")
  const [dueDate,setDueDate]=useState("")
  const [notes,setNotes]=useState(company.invoiceFooter||"Thank you for your business!")
  const [done,setDone]=useState(false)
  const [invNo]=useState(`INV-${Date.now().toString().slice(-6)}`)

  useEffect(()=>{if(prefillProd){setSelProdId(prefillProd.id);setClientPhone(prefillProd.clientPhone||"");setClientEmail(prefillProd.clientEmail||"")}return()=>setPrefillProd&&setPrefillProd(null)},[])

  const prod=productions.find(p=>p.id===selProdId)

  const gen=()=>{
    if(!prod)return
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invNo}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px;max-width:700px;margin:0 auto}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}.cn{font-size:22px;font-weight:bold;color:${company.primaryColor||"#C8912A"}}.it{font-size:28px;font-weight:bold;color:#EDE5D6;text-align:right}.in{font-size:13px;color:#888;text-align:right;margin-top:4px}.g2{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px}.sl{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;font-weight:bold}table{width:100%;border-collapse:collapse;margin:14px 0}th{background:#291608;color:white;padding:10px;text-align:left;font-size:11px;text-transform:uppercase}td{padding:10px;border-bottom:1px solid #E0D3BB;font-size:13px}.tb{width:260px;margin-left:auto;margin-top:14px}.tr{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;border-bottom:1px solid #E0D3BB}.tf{display:flex;justify-content:space-between;padding:12px 14px;background:${company.primaryColor||"#C8912A"};color:white;border-radius:8px;margin-top:8px;font-size:14px;font-weight:bold}.ftr{margin-top:40px;padding-top:16px;border-top:2px solid #EDE5D6;font-size:12px;color:#888;line-height:1.7}@media print{button{display:none}}</style></head><body>
      <div class="hdr">
        <div>${company.logo?`<img src="${company.logo}" style="height:55px;display:block;margin-bottom:8px"/>`:""}
        <div class="cn">${company.name||"Bakery"}</div>
        ${company.tagline?`<div style="font-size:12px;color:#888;margin-top:2px">${company.tagline}</div>`:""}
        ${company.address?`<div style="font-size:12px;color:#888;margin-top:6px">${company.address}</div>`:""}
        ${company.phone?`<div style="font-size:12px;color:#888">${company.phone}</div>`:""}
        ${company.email?`<div style="font-size:12px;color:#888">${company.email}</div>`:""}
        </div>
        <div><div class="it">INVOICE</div><div class="in">${invNo}</div><div style="margin-top:14px;text-align:right;font-size:12px;color:#888">
        Issue Date: <strong>${today()}</strong><br>${dueDate?`Due Date: <strong>${dueDate}</strong><br>`:""}
        Status: <strong style="color:${prod.status==="delivered"?"#357A52":"#C8912A"}">${prod.status.toUpperCase()}</strong></div></div></div>
      <div class="g2">
        <div><div class="sl">Bill To</div><div style="font-size:16px;font-weight:bold">${prod.client}</div>
        ${clientPhone?`<div style="font-size:13px;color:#888;margin-top:4px">${clientPhone}</div>`:""}
        ${clientEmail?`<div style="font-size:13px;color:#888">${clientEmail}</div>`:""}
        ${clientAddress?`<div style="font-size:13px;color:#888">${clientAddress}</div>`:""}
        </div>
        <div><div class="sl">Order Details</div>
        <div style="font-size:13px">Order: <strong>${prod.orderDate||""}</strong></div>
        <div style="font-size:13px;margin-top:3px">Delivery: <strong>${prod.deliveryDate||""}</strong></div>
        <div style="font-size:13px;margin-top:3px">Payment: <strong style="text-transform:capitalize">${prod.paymentType}</strong></div>
        </div></div>
      <table><thead><tr><th>Description</th><th>Details</th><th style="text-align:right">Amount</th></tr></thead><tbody>
        <tr><td><strong>${prod.size} ${prod.covering} Cake</strong>${prod.notes?`<br><span style="font-size:12px;color:#888">${prod.notes}</span>`:""}</td>
        <td style="font-size:12px;color:#888">${prod.flavors||""}${prod.decorations?` · ${prod.decorations.split(",").map(id=>{const d=DECORATION_ITEMS.find(x=>x.id===id);return d?.name}).filter(Boolean).join(", ")}`:""}</td>
        <td style="text-align:right">₦${Math.round(prod.salePrice||0).toLocaleString()}</td></tr>
        ${prod.deliveryCost>0?`<tr><td>Delivery</td><td></td><td style="text-align:right">₦${Math.round(prod.deliveryCost).toLocaleString()}</td></tr>`:""}
      </tbody></table>
      <div class="tb">
        <div class="tr"><span>Subtotal</span><span>₦${Math.round(prod.salePrice||0).toLocaleString()}</span></div>
        ${prod.deliveryCost>0?`<div class="tr"><span>Delivery</span><span>₦${Math.round(prod.deliveryCost).toLocaleString()}</span></div>`:""}
        <div class="tf"><span>TOTAL DUE</span><span>₦${Math.round((prod.salePrice||0)+(prod.deliveryCost||0)).toLocaleString()}</span></div>
      </div>
      ${notes?`<div style="margin-top:28px;padding:14px;background:#F5F0E4;border-radius:8px;font-size:13px;color:#8C6E52">${notes}</div>`:""}
      <div class="ftr"><div>${company.name||"Bakery"} · ${company.phone||""} · ${company.email||""}</div></div>
      <script>window.print()</script></body></html>`)
    w.document.close();setDone(true)
  }

  return <div>
    <SHead title="Invoice Generator" sub="Create a professional invoice for any order."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Invoice Details</div>
        <div style={{padding:"7px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,marginBottom:14,color:"var(--muted)"}}>Invoice #{invNo}</div>
        <Sel label="Production Order *" value={selProdId} onChange={setSelProdId} options={productions.map(p=>({value:p.id,label:`${p.client} — ${p.deliveryDate} — ${p.size} ${p.covering}`}))}/>
        {prod&&<div style={{padding:"9px 12px",background:"#EEF8F3",borderRadius:8,fontSize:12.5,marginBottom:12,border:"1px solid #C2E0CF"}}><div style={{fontWeight:600}}>{prod.size} · {prod.covering}</div><div style={{color:"var(--muted)",marginTop:2}}>{prod.flavors}</div><div style={{marginTop:4}}>Total: <strong style={{color:"var(--gold)"}}>{fmt((prod.salePrice||0)+(prod.deliveryCost||0))}</strong></div></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Client Phone" value={clientPhone} onChange={setClientPhone}/>
          <Inp label="Client Email" value={clientEmail} onChange={setClientEmail}/>
        </div>
        <Inp label="Client Address" value={clientAddress} onChange={setClientAddress}/>
        <Inp label="Due Date" type="date" value={dueDate} onChange={setDueDate}/>
        <div style={{marginBottom:11}}>
          <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Footer Note (customizable)</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} style={{...iSt,minHeight:70,resize:"vertical"}} placeholder="Payment terms, thank you note, bank details…"/>
        </div>
        <Btn full onClick={gen} disabled={!prod}>📄 Generate & Print Invoice</Btn>
        {done&&<div style={{marginTop:8,fontSize:12.5,color:"#357A52"}}>✓ Invoice opened — print or save as PDF.</div>}
      </Card>
      <Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Preview</div>
        {prod?<div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <div><div style={{fontWeight:700,fontSize:15,color:"var(--gold)"}}>{company.name}</div>{company.tagline&&<div style={{fontSize:11.5,color:"var(--muted)"}}>{company.tagline}</div>}</div>
            <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:"var(--border)"}}>INVOICE</div><div style={{fontSize:11.5,color:"var(--muted)"}}>{invNo}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Bill To</div><div style={{fontWeight:600,fontSize:13}}>{prod.client}</div>{clientPhone&&<div style={{fontSize:12,color:"var(--muted)"}}>{clientPhone}</div>}</div>
            <div><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Order</div><div style={{fontSize:12}}>Delivery: {prod.deliveryDate}</div></div>
          </div>
          <div style={{background:"var(--panel)",borderRadius:8,padding:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12.5}}><span style={{fontWeight:500}}>{prod.size} {prod.covering} Cake</span><span style={{fontWeight:600,color:"var(--gold)"}}>{fmt(prod.salePrice)}</span></div>
            <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:5}}>{prod.flavors}</div>
            {prod.deliveryCost>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:5}}><span>Delivery</span><span>{fmt(prod.deliveryCost)}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,paddingTop:8,borderTop:"1px solid var(--border)"}}><span>TOTAL</span><span style={{color:"var(--gold)"}}>{fmt((prod.salePrice||0)+(prod.deliveryCost||0))}</span></div>
          </div>
          {notes&&<div style={{marginTop:10,fontSize:11.5,color:"var(--muted)",fontStyle:"italic",lineHeight:1.5}}>{notes}</div>}
        </div>:<div style={{textAlign:"center",padding:36,color:"var(--muted)"}}>Select an order to preview the invoice</div>}
      </Card>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS (separate page)
// ═══════════════════════════════════════════════════════════
function Settings({company,setCompany,settings,setSettings,users,setUsers}){
  const [tab,setTab]=useState("company")
  const logoRef=useRef()
  const [newUser,setNewUser]=useState({name:"",role:"production",pin:""})
  const [userMsg,setUserMsg]=useState("")

  const co=(field,val)=>{const u={...company,[field]:val};setCompany(u);saveCompany(u)}
  const st=(field,val)=>{const u={...settings,[field]:val};setSettings(u);saveSetting(field,val)}

  const handleLogo=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>co("logo",ev.target.result);r.readAsDataURL(f)}

  const addUser=()=>{
    if(!newUser.name||!newUser.pin)return setUserMsg("Name and PIN required")
    if(newUser.pin.length<4)return setUserMsg("PIN must be at least 4 digits")
    const updated=[...users,{...newUser,id:uid(),active:true}]
    setUsers(updated);saveUsers(updated);setNewUser({name:"",role:"production",pin:""});setUserMsg("✓ User added")
  }
  const toggleUser=(id)=>{const u=users.map(x=>x.id===id?{...x,active:!x.active}:x);setUsers(u);saveUsers(u)}
  const deleteUser=(id)=>{if(id==="owner")return;const u=users.filter(x=>x.id!==id);setUsers(u);saveUsers(u)}
  const updatePin=(id,pin)=>{const u=users.map(x=>x.id===id?{...x,pin}:x);setUsers(u);saveUsers(u)}

  return <div>
    <SHead title="Settings" sub="Company profile, pricing, users, and access control."/>
    <Tabs tabs={[{v:"company",l:"Company"},{v:"pricing",l:"Pricing & Margins"},{v:"users",l:"Users & Access"}]} active={tab} onChange={setTab}/>

    {tab==="company"&&<div style={{maxWidth:540}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Company Profile</div>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <div onClick={()=>logoRef.current?.click()} style={{width:80,height:80,borderRadius:10,border:"2px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#FAF7F0",flexShrink:0,overflow:"hidden"}}>
            {company.logo?<img src={company.logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",fontSize:11,color:"var(--muted)"}}>Upload<br/>Logo</div>}
          </div>
          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} style={{display:"none"}}/>
          <div style={{flex:1}}>
            <Inp label="Business Name" value={company.name} onChange={v=>co("name",v)}/>
            <Inp label="Tagline" value={company.tagline||""} onChange={v=>co("tagline",v)}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Phone" value={company.phone||""} onChange={v=>co("phone",v)}/>
          <Inp label="Email" value={company.email||""} onChange={v=>co("email",v)}/>
        </div>
        <Inp label="Address" value={company.address||""} onChange={v=>co("address",v)}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
          <div><label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Primary Color</label><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={company.primaryColor||"#C8912A"} onChange={e=>co("primaryColor",e.target.value)} style={{width:38,height:34,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/><span style={{fontSize:12,color:"var(--muted)"}}>{company.primaryColor}</span></div></div>
          <div><label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Sidebar Color</label><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={company.sidebarColor||"#140801"} onChange={e=>co("sidebarColor",e.target.value)} style={{width:38,height:34,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/><span style={{fontSize:12,color:"var(--muted)"}}>{company.sidebarColor}</span></div></div>
        </div>
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Invoice Footer Note</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,marginBottom:10}}>This text appears at the bottom of every invoice. Use it for payment terms, bank details, or a thank you message.</p>
        <textarea value={company.invoiceFooter||""} onChange={e=>co("invoiceFooter",e.target.value)} placeholder="e.g. Thank you! Payment: Fayvouree Cakes · GTBank · 0126581390. All orders confirmed on payment of 50% deposit." style={{...iSt,minHeight:90,resize:"vertical"}}/>
      </Card>
    </div>}

    {tab==="pricing"&&<div style={{maxWidth:520}}>
      <Card style={{marginBottom:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Accessory & Extra Cost Margin</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,lineHeight:1.7}}>Added to ingredient costs to cover boxes, boards, ribbons, baking paper, electricity, and any accessories not directly in a recipe.</p>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"12px 0"}}>
          <input type="range" min={0} max={30} value={settings.accessoryPct||10} onChange={e=>st("accessoryPct",+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--gold)",minWidth:46}}>{settings.accessoryPct||10}%</div>
        </div>
        <div style={{fontSize:12.5,color:"var(--muted)"}}>Every cake cost × <strong style={{color:"var(--text)"}}>{(1+(settings.accessoryPct||10)/100).toFixed(2)}</strong></div>
      </Card>
      <Card style={{marginBottom:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Profit Margin Target</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,lineHeight:1.7}}>Your target profit percentage. Used to suggest selling prices when you log a new production.</p>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"12px 0"}}>
          <input type="range" min={10} max={100} value={settings.profitPct||40} onChange={e=>st("profitPct",+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--gold)",minWidth:46}}>{settings.profitPct||40}%</div>
        </div>
        <div style={{padding:"8px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,color:"var(--muted)"}}>If a cake costs ₦15,000 to make, the suggested price will be <strong style={{color:"var(--text)"}}>{fmt(15000*(1+(settings.profitPct||40)/100))}</strong></div>
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>External Services / Printout Costs</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,lineHeight:1.7}}>Track costs for external services like printouts, edible prints, photography, or any work done by other businesses. Add these as manual expenses in the Expenses tab, or include them in the accessory margin above.</p>
        <div style={{padding:"8px 12px",background:"#FFF9EE",borderRadius:8,fontSize:12.5,color:"#9A6C1A"}}>💡 Tip: For recurring printout costs, increase the accessory margin by 2-3%. For one-off custom work, log it as a manual expense on that date.</div>
      </Card>
    </div>}

    {tab==="users"&&<div>
      <div style={{marginBottom:14,padding:"10px 14px",background:"#EEF8F3",borderRadius:8,fontSize:13,color:"#2D7A50",border:"1px solid #C2E0CF"}}>
        <strong>Access Levels:</strong> Owner = full access. Production = can log cakes & scan receipts only (no prices visible, no delete). Customer Service = can view orders & create invoices only.
      </div>
      {userMsg&&<Alert msg={userMsg} color={userMsg.startsWith("✓")?"green":"red"} onClose={()=>setUserMsg("")}/>}
      <Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Add New User</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <Inp label="Full Name *" value={newUser.name} onChange={v=>setNewUser(p=>({...p,name:v}))} placeholder="e.g. Ngozi Baker"/>
          <Sel label="Role *" value={newUser.role} onChange={v=>setNewUser(p=>({...p,role:v}))} options={Object.entries(ROLES).map(([k,v])=>({value:k,label:v}))}/>
          <Inp label="PIN * (min 4 digits)" value={newUser.pin} onChange={v=>setNewUser(p=>({...p,pin:v}))} placeholder="e.g. 5678" type="number"/>
        </div>
        <Btn onClick={addUser}>Add User</Btn>
      </Card>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
          <TH cols={["User","Role","PIN","Status","Actions"]}/>
          <tbody>{users.map((u,i)=>{
            const [editPin,setEditPin]=useState(u.pin)
            return <TR2 key={u.id} i={i} row={[
              <span style={{fontWeight:500}}>{u.name}</span>,
              <Badge color={u.role==="owner"?"gold":u.role==="production"?"blue":"green"}>{ROLES[u.role]?.split(" ")[0]}</Badge>,
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input type="password" value={editPin} onChange={e=>setEditPin(e.target.value)} style={{...iSt,width:80,padding:"4px 6px",fontSize:12}}/>
                {editPin!==u.pin&&<Btn small variant="success" onClick={()=>updatePin(u.id,editPin)}>Save</Btn>}
              </div>,
              <Badge color={u.active?"green":"gray"}>{u.active?"Active":"Inactive"}</Badge>,
              <div style={{display:"flex",gap:4}}>
                <Btn small variant="ghost" onClick={()=>toggleUser(u.id)}>{u.active?"Deactivate":"Activate"}</Btn>
                {u.id!=="owner"&&<Btn small variant="danger" onClick={()=>deleteUser(u.id)}>×</Btn>}
              </div>,
            ]}/>
          })}</tbody>
        </table>
      </div>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export default function App(){
  const [currentUser, setCurrentUser] = useState(null)
  const [view,setView]=useState("dashboard")
  const [inventory,setInventory]=useState(DEFAULT_INV)
  const [recipes,setRecipes]=useState(DEFAULT_RECIPES)
  const [productions,setProductions]=useState([])
  const [transactions,setTransactions]=useState([])
  const [expenses,setExpenses]=useState([])
  const [company,setCompany]=useState(loadCompany())
  const [settings,setSettings]=useState({accessoryPct:loadSetting("accessoryPct",10),profitPct:loadSetting("profitPct",40)})
  const [users,setUsers]=useState(loadUsers())
  const [prefillProd,setPrefillProd]=useState(null)
  const [loading,setLoading]=useState(true)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [isMobile,setIsMobile]=useState(window.innerWidth<768)

  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener("resize",handler);return()=>window.removeEventListener("resize",handler)
  },[])

  useEffect(()=>{
    async function init(){
      setLoading(true)
      const [inv,prods,txns]=await Promise.all([loadInventory(DEFAULT_INV),loadProductions([]),loadTransactions([])])
      setInventory(inv);setProductions(prods);setTransactions(txns)
      setExpenses(loadExpenses());setUsers(loadUsers());setCompany(loadCompany())
      const saved=loadRecipes();if(saved)setRecipes(saved)
      setSettings({accessoryPct:loadSetting("accessoryPct",10),profitPct:loadSetting("profitPct",40)})
      setLoading(false)
    }
    init()
  },[])

  const gold=company.primaryColor||"#C8912A"
  const sidebar=company.sidebarColor||"#140801"

  const role=currentUser?.role||"owner"
  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"◈",roles:["owner","production","customer_service"]},
    {id:"masterlist",label:"Master List",icon:"⚙",roles:["owner","production"]},
    {id:"production",label:"New Production",icon:"🎂",roles:["owner","production"]},
    {id:"receipts",label:"Receipt Scanner",icon:"🧾",roles:["owner","production"]},
    {id:"expenses",label:"Expenses",icon:"💸",roles:["owner"]},
    {id:"records",label:"Records",icon:"≡",roles:["owner","customer_service"]},
    {id:"bank",label:"Bank Import",icon:"⊞",roles:["owner"]},
    {id:"reports",label:"Reports",icon:"◎",roles:["owner"]},
    {id:"shopping",label:"Shopping List",icon:"🛒",roles:["owner","production"]},
    {id:"invoices",label:"Invoices",icon:"📄",roles:["owner","customer_service"]},
    {id:"settings",label:"Settings",icon:"⚙",roles:["owner"]},
  ].filter(n=>n.roles.includes(role))

  const goTo=(id)=>{setView(id);setSidebarOpen(false)}

  if(!currentUser){
    return <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');*{box-sizing:border-box}body{margin:0}:root{--gold:${gold};--sidebar:${sidebar};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Login onLogin={(u)=>{setCurrentUser(u);saveSetting("lastUser",u.id)}}/>
    </>
  }

  const SidebarContent = () => <>
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(200,145,42,0.2)",display:"flex",alignItems:"center",gap:10}}>
      {company.logo&&<img src={company.logo} alt="logo" style={{width:30,height:30,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:gold,fontWeight:700,lineHeight:1.2}}>{company.name||"LayerLedger"}</div><div style={{fontSize:9,color:"#7B5A3A",textTransform:"uppercase",letterSpacing:2,marginTop:1}}>Bakery Books</div></div>
    </div>
    <div style={{flex:1,paddingTop:8,overflowY:"auto"}}>
      {nav.map(n=><div key={n.id} onClick={()=>goTo(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:view===n.id?500:400,color:view===n.id?gold:"#8B6B4A",background:view===n.id?"rgba(200,145,42,0.1)":"transparent",borderLeft:`2px solid ${view===n.id?gold:"transparent"}`,transition:"all 0.15s"}}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</div>)}
    </div>
    <div style={{padding:"10px 16px",borderTop:"1px solid rgba(200,145,42,0.1)"}}>
      <div style={{fontSize:11.5,color:"#6B4A2A",fontWeight:500}}>{currentUser?.name}</div>
      <div style={{fontSize:10.5,color:"#3D2010",marginTop:1,display:"flex",justifyContent:"space-between"}}>
        <span>LayerLedger v4.0</span>
        <span style={{cursor:"pointer",color:gold}} onClick={()=>setCurrentUser(null)}>Logout</span>
      </div>
    </div>
  </>

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');
      *{box-sizing:border-box}body{margin:0;padding:0}
      :root{--gold:${gold};--sidebar:${sidebar};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB}
      @keyframes spin{to{transform:rotate(360deg)}}
    `}</style>
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",overflow:"hidden"}}>

      {/* Desktop sidebar */}
      {!isMobile&&<div style={{width:200,background:"var(--sidebar)",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh"}}><SidebarContent/></div>}

      {/* Mobile sidebar overlay */}
      {isMobile&&sidebarOpen&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
        <div style={{width:220,background:"var(--sidebar)",display:"flex",flexDirection:"column",height:"100%"}}><SidebarContent/></div>
        <div style={{flex:1,background:"rgba(0,0,0,0.5)"}} onClick={()=>setSidebarOpen(false)}/>
      </div>}

      {/* Main */}
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Mobile header */}
        {isMobile&&<div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"var(--sidebar)",position:"sticky",top:0,zIndex:50,flexShrink:0}}>
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:gold,fontSize:22,lineHeight:1}}>☰</button>
          {company.logo&&<img src={company.logo} alt="logo" style={{width:26,height:26,borderRadius:5,objectFit:"cover"}}/>}
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:gold,fontWeight:700,flex:1}}>{company.name||"LayerLedger"}</div>
          <div style={{fontSize:11,color:"#6B4A2A"}}>{nav.find(n=>n.id===view)?.label}</div>
        </div>}

        <div style={{padding:isMobile?"14px":"24px 26px",flex:1,overflowY:"auto"}}>
          {loading?<Spinner/>:<>
            {view==="dashboard"  &&<Dashboard productions={productions} inventory={inventory} expenses={expenses} setView={setView} user={currentUser}/>}
            {view==="masterlist" &&<MasterList inventory={inventory} setInventory={setInventory} recipes={recipes} setRecipes={setRecipes} user={currentUser}/>}
            {view==="production" &&<ProductionEntry inventory={inventory} setInventory={setInventory} recipes={recipes} productions={productions} setProductions={setProductions} settings={settings} setView={setView} user={currentUser}/>}
            {view==="receipts"   &&<ReceiptScanner inventory={inventory} setInventory={setInventory} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="expenses"   &&<Expenses expenses={expenses} setExpenses={setExpenses}/>}
            {view==="records"    &&<Records productions={productions} setProductions={setProductions} setView={setView} setPrefillProd={setPrefillProd} user={currentUser}/>}
            {view==="bank"       &&<BankImport transactions={transactions} setTransactions={setTransactions} productions={productions} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="reports"    &&<Reports productions={productions} transactions={transactions} expenses={expenses} company={company}/>}
            {view==="shopping"   &&<ShoppingList inventory={inventory} company={company}/>}
            {view==="invoices"   &&<Invoices productions={productions} company={company} prefillProd={prefillProd} setPrefillProd={setPrefillProd}/>}
            {view==="settings"   &&<Settings company={company} setCompany={setCompany} settings={settings} setSettings={setSettings} users={users} setUsers={setUsers}/>}
          </>}
        </div>
      </div>
    </div>
  </>
}
