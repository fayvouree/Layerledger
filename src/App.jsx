import React, { useState, useRef, useEffect, useCallback } from "react"
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
  const apiKey = localStorage.getItem("ll_anthropic_key") || ""
  if (!apiKey) {
    throw new Error("No API key set. Go to Settings → AI Features and enter your Anthropic API key.")
  }
  const res = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-ll-key": apiKey
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system,
      messages
    })
  })
  const text = await res.text()
  if (!text || !text.trim()) {
    throw new Error("No response from API. Check your deployment includes the functions folder.")
  }
  let data
  try { data = JSON.parse(text) }
  catch (e) { throw new Error("Invalid API response: " + text.slice(0, 200)) }
  if (data.error) {
    throw new Error("API error: " + (data.error.message || JSON.stringify(data.error)))
  }
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
  const v={primary:{background:"var(--gold)",color:"#fff",border:"none"},ghost:{background:"transparent",color:"var(--muted)",border:"1px solid var(--border)"},success:{background:"#357A52",color:"#fff",border:"none"},danger:{background:"#B03A2E",color:"#fff",border:"none"},outline:{background:"transparent",color:"var(--gold)",border:"1px solid var(--gold)"},dark:{background:"var(--sidebar)",color:"var(--gold)",border:"none"}}[variant]||{}
  return <button onClick={onClick} disabled={disabled} style={{...v,borderRadius:8,padding:small?"5px 11px":"8px 16px",fontSize:small?12:13.5,fontWeight:500,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0,...style}}>{children}</button>
}
const iSt = {width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13.5,color:"var(--text)",boxSizing:"border-box",outline:"none",fontFamily:"inherit"}
function Inp({label,value,onChange,type="text",placeholder,small}){return<div style={{marginBottom:11}}>{label&&<label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...iSt,fontSize:small?12:13.5}}/></div>}
function Sel({label,value,onChange,options,placeholder="— Select —"}){return<div style={{marginBottom:11}}>{label&&<label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<select value={value||""} onChange={e=>onChange(e.target.value)} style={{...iSt,cursor:"pointer"}}><option value="">{placeholder}</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select></div>}
function Card({children,style={}}){return<div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:12,padding:18,...style}}>{children}</div>}
function Badge({children,color="gray"}){const m={green:["#E5F4EC","#2D7A50"],gold:["#FDF2DC","var(--gold)"],red:["#FDEBE9","#912622"],blue:["#E8EFFC","#2355A0"],purple:["#F0EAFC","#6B32A0"],gray:["#F0EBE3","#6B5B45"]}[color]||["#F0EBE3","#6B5B45"];return<span style={{background:m[0],color:m[1],borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>}
function SHead({title,sub}){return<div style={{marginBottom:20}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--text)",fontWeight:600,margin:0}}>{title}</h1>{sub&&<p style={{color:"var(--muted)",fontSize:13,marginTop:3,marginBottom:0}}>{sub}</p>}</div>}
function Tabs({tabs,active,onChange}){return<div style={{display:"flex",gap:3,marginBottom:18,background:"var(--border)",borderRadius:10,padding:3,flexWrap:"wrap"}}>{tabs.map(t=><div key={t.v||t} onClick={()=>onChange(t.v||t)} style={{padding:"6px 13px",borderRadius:7,fontSize:12.5,fontWeight:active===(t.v||t)?500:400,cursor:"pointer",background:active===(t.v||t)?"var(--panel)":"transparent",color:active===(t.v||t)?"var(--gold)":"var(--muted)",transition:"all 0.15s"}}>{t.l||t}</div>)}</div>}
function TH({cols}){return<thead><tr style={{background:"#EDE5D6"}}>{cols.map(c=><th key={c} style={{padding:"8px 10px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:0.8,color:"var(--muted)",fontWeight:500,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>}
function TR2({row,i,onClick}){return<tr onClick={onClick} style={{background:i%2===0?"var(--panel)":"#F8F3EA",cursor:onClick?"pointer":"default"}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.background="#F0E9DB"}} onMouseLeave={e=>{if(onClick)e.currentTarget.style.background=i%2===0?"var(--panel)":"#F8F3EA"}}>{row.map((c,j)=><td key={j} style={{padding:"9px 10px",fontSize:13,color:"var(--text)",borderBottom:"1px solid var(--border)"}}>{c}</td>)}</tr>}
function Steps({steps,cur}){return<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:20,flexWrap:"wrap"}}>{steps.map((s,i)=><div key={s} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:cur>i+1?"#357A52":cur===i+1?"var(--gold)":"var(--border)",color:cur>=i+1?"#fff":"var(--muted)",fontSize:11,fontWeight:700}}>{cur>i+1?"✓":i+1}</div><span style={{fontSize:12,color:cur===i+1?"var(--text)":"var(--muted)",fontWeight:cur===i+1?500:400,marginRight:4}}>{s}</span>{i<steps.length-1&&<span style={{color:"var(--border)",marginRight:4}}>›</span>}</div>)}</div>}
function Spinner(){return<div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:32}}><div style={{width:26,height:26,border:"3px solid var(--border)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>}
function Modal({title,children,onClose}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><div style={{background:"var(--panel)",borderRadius:14,padding:24,maxWidth:560,width:"100%",maxHeight:"90vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"var(--text)"}}>{title}</div><button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"var(--muted)"}}>×</button></div>{children}</div></div>}
function Alert({msg,color="gold",onClose}){if(!msg)return null;const c={gold:["#FFF9EE","var(--gold)","var(--gold)"],red:["#FDEBE9","#912622","#B03A2E"],green:["#E5F4EC","#2D7A50","#357A52"]}[color]||["#FFF9EE","var(--gold)","var(--gold)"];return<div style={{padding:"10px 14px",background:c[0],color:c[1],borderRadius:8,marginBottom:12,fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{msg}</span>{onClose&&<button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:c[2],fontWeight:700,marginLeft:8}}>×</button>}</div>}

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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');*{box-sizing:border-box}body{margin:0}:root{--gold:var(--gold);--sidebar:var(--sidebar);--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB}`}</style>
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
  const today=new Date()
  const m=today.toISOString().slice(0,7)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(m))
  const paid=mp.filter(p=>["full","discount","deposit"].includes(p.paymentType))
  const rev=paid.reduce((s,p)=>s+(p.salePrice||0),0)
  const cost=mp.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0)
  const expTotal=expenses.filter(e=>e.date?.startsWith(m)&&e.category!=="Ingredients"&&e.source!=="purchase"&&e.source!=="receipt").reduce((s,e)=>s+(e.amount||0),0)
  const profit=rev-cost-expTotal
  const margin=rev>0?Math.round((profit/rev)*100):0
  const low=inventory.filter(i=>i.stock<=(i.minStock||5))
  const monthLabel=today.toLocaleDateString("en-NG",{month:"long",year:"numeric"})

  // Month-end notification
  const daysInMonth=new Date(today.getFullYear(),today.getMonth()+1,0).getDate()
  const dayOfMonth=today.getDate()
  const daysLeft=daysInMonth-dayOfMonth
  const isFirstOfMonth=dayOfMonth===1
  const notifDays=parseInt(localStorage.getItem("ll_notif_days")||"2")
  const notifEnabled=localStorage.getItem("ll_notif_enabled")!=="false"
  const [bannerDismissed,setBannerDismissed]=useState(false)
  const [activeWeek,setActiveWeek]=useState(null)

  // Auto-set opening stock on 1st
  const autoStockEnabled=localStorage.getItem("ll_auto_stock")!=="false"
  if(isFirstOfMonth&&autoStockEnabled&&user?.role==="owner"){
    const monthKey="ll_os_"+today.toISOString().slice(0,7)
    if(!localStorage.getItem(monthKey)){
      const snapshot={date:today.toISOString(),items:inventory.map(i=>({id:i.id,name:i.name,unit:i.unit,openingQty:i.stock,cost:i.cost}))}
      localStorage.setItem(monthKey,JSON.stringify(snapshot))
    }
  }

  const showBanner=notifEnabled&&user?.role==="owner"&&!bannerDismissed&&(daysLeft<=(+notifDays)||isFirstOfMonth)
  const dismissBanner=()=>{localStorage.setItem("ll_banner_dismissed",today.toISOString().slice(0,10));setBannerDismissed(true)}
  const prevMonth=new Date(today.getFullYear(),today.getMonth()-1,1).toLocaleDateString("en-NG",{month:"long",year:"numeric"})

  // Time-based greeting
  const hr=today.getHours()
  const greetWord=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening"
  const firstName=user?.name?.split(" ")[0]||"Business"
  const quotes=["A great cake starts with great numbers.","Every slice tells a story — make yours profitable.","The secret ingredient is knowing your costs.","Beautiful cakes, beautiful books.","Bake with love, price with confidence.","Success is baked in, one order at a time.","Know your numbers, grow your bakery."]
  const quote=quotes[today.getDay()%quotes.length]

  // Weekly chart data — split productions into 4 weeks
  const weeks=["Wk 1","Wk 2","Wk 3","Wk 4"].map((label,wi)=>{
    const wProds=mp.filter(p=>{
      const d=new Date(p.deliveryDate||today)
      const wk=Math.floor((d.getDate()-1)/7)
      return wk===wi
    })
    const wPaid=wProds.filter(p=>["full","discount","deposit"].includes(p.paymentType))
    const wRev=wPaid.reduce((s,p)=>s+(p.salePrice||0),0)
    const wCost=wProds.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0)
    return {label,rev:wRev,cost:wCost,profit:Math.max(0,wRev-wCost),orders:wProds.length}
  })
  const maxVal=Math.max(...weeks.map(w=>w.rev),1)
  const chartH=120

  const quickActions=[
    {icon:"🧮",bg:"#FDF2DC",label:"Order Calculator",sub:"Build a new client quote",view:"calculator",roles:["owner","production","customer_service"]},
    {icon:"🧾",bg:"#E8EFFC",label:"Scan purchase receipt",sub:"Update stock and costs",view:"receipts",roles:["owner","production"]},
    {icon:"💸",bg:"#E1F5EE",label:"Log cash expense",sub:"Delivery, gas, salary etc.",view:"expenses",roles:["owner"]},
    {icon:"📅",bg:"#FAEEDA",label:"Production list",sub:"Orders due this week",view:"prodlist",roles:["owner","production"]},
    {icon:"📋",bg:"#F0EAFC",label:"View quotes",sub:"Manage client quotes",view:"quotes",roles:["owner","customer_service"]},
  ].filter(a=>a.roles.includes(user?.role))

  return <div>
    {/* GREETING */}
    <div style={{marginBottom:16}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:"var(--text)"}}>{greetWord}, {firstName}! 🎂</div>
      <div style={{fontSize:12.5,color:"var(--muted)",marginTop:3,fontStyle:"italic"}}>{quote}</div>
      <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{monthLabel} overview</div>
    </div>

    {/* MONTH-END BANNER */}
    {showBanner&&<div style={{marginBottom:14,borderRadius:10,overflow:"hidden",border:`1px solid ${isFirstOfMonth?"#5DCAA5":daysLeft===0?"#F09595":"#FAC775"}`}}>
      <div style={{background:isFirstOfMonth?"#E1F5EE":daysLeft===0?"#FCEBEB":"#FFF9EE",padding:"11px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style={{width:14,height:14,borderRadius:"50%",background:isFirstOfMonth?"#0F6E56":daysLeft===0?"#A32D2D":"#BA7517",flexShrink:0,marginTop:3}}/>
          <div>
            <div style={{fontSize:13,fontWeight:500,color:isFirstOfMonth?"#085041":daysLeft===0?"#501313":"#633806"}}>
              {isFirstOfMonth?`New month started — ${monthLabel}`:daysLeft===0?"Today is the last day of the month":`Month closing in ${daysLeft} day${daysLeft!==1?"s":""}`}
            </div>
            <div style={{fontSize:12,color:isFirstOfMonth?"#0F6E56":daysLeft===0?"#791F1F":"#854F0B",marginTop:3,lineHeight:1.6}}>
              {isFirstOfMonth?"Opening stock set automatically from last month. Your "+prevMonth+" overview is ready to download.":daysLeft===0?"Lock your closing stock today — midnight auto-sets next month's opening stock.":"Review your monthly overview and lock closing stock before the 1st."}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
          {isFirstOfMonth
            ?<Btn small onClick={()=>setView("monthly")}>Download {prevMonth} overview</Btn>
            :<><Btn small onClick={()=>setView("monthly")}>View monthly overview</Btn><Btn small variant="ghost" onClick={()=>setView("settings")}>Lock closing stock</Btn></>}
          <span onClick={dismissBanner} style={{fontSize:11,color:"var(--muted)",cursor:"pointer",textDecoration:"underline"}}>Dismiss</span>
        </div>
      </div>
    </div>}

    {/* SUMMARY CARDS */}
    {user?.role==="owner"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:14}}>
      {[
        {label:"Revenue",val:fmt(rev),sub:`${paid.length} paid orders`,c:"var(--gold)"},
        {label:"Prod. cost",val:fmt(cost),sub:"incl. delivery",c:"#378ADD"},
        {label:"Overheads",val:fmt(expTotal),sub:"other costs",c:"#888780"},
        {label:"Net profit",val:fmt(profit),sub:`${margin}% margin`,c:profit>=0?"#357A52":"#B03A2E"},
      ].map(s=><Card key={s.label} style={{borderTop:`3px solid ${s.c}`,borderRadius:"0 0 12px 12px",padding:"12px 14px"}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.label==="Net profit"?s.c:"var(--text)"}}>{s.val}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.sub}</div>
      </Card>)}
    </div>}

    {/* CHART */}
    {user?.role==="owner"&&<Card style={{marginBottom:14,padding:"14px 18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Monthly performance</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>Weekly breakdown — tap a bar for details</div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {[["var(--gold)","Revenue"],["#378ADD","Cost"],["#1D9E75","Profit"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:c}}/><span style={{fontSize:11,color:"var(--muted)"}}>{l}</span></div>)}
        </div>
      </div>
      <div style={{position:"relative",height:chartH+"px",marginBottom:4}}>
        {[1,0.75,0.5,0.25].map(r=><div key={r} style={{position:"absolute",top:(1-r)*chartH,left:0,right:0,borderTop:"0.5px solid var(--border)",pointerEvents:"none"}}>
          <span style={{position:"absolute",right:0,top:-9,fontSize:10,color:"var(--muted)"}}>{fmt(maxVal*r)}</span>
        </div>)}
        <div style={{display:"flex",gap:6,height:"100%",alignItems:"flex-end",paddingRight:36}}>
          {weeks.map((w,wi)=><div key={wi} onClick={()=>setActiveWeek(activeWeek===wi?null:wi)} style={{flex:1,display:"flex",gap:2,alignItems:"flex-end",height:"100%",cursor:"pointer"}}>
            {[[w.rev,"var(--gold)"],[w.cost,"#378ADD"],[w.profit,"#1D9E75"]].map(([val,col],bi)=><div key={bi} style={{flex:1,height:Math.round((val/maxVal)*chartH)+"px",background:col,borderRadius:"3px 3px 0 0",opacity:activeWeek===wi?1:0.85,transition:"opacity 0.15s"}}/>)}
          </div>)}
        </div>
      </div>
      <div style={{display:"flex",gap:6,paddingRight:36,marginBottom:8}}>
        {weeks.map((w,wi)=><div key={wi} style={{flex:1,textAlign:"center",fontSize:10,color:"var(--muted)",cursor:"pointer",fontWeight:activeWeek===wi?600:400}} onClick={()=>setActiveWeek(activeWeek===wi?null:wi)}>{w.label}</div>)}
      </div>
      {activeWeek!==null&&<div style={{background:"#F5F0E4",borderRadius:8,padding:"8px 12px",fontSize:12.5,color:"var(--text)",marginBottom:10}}>
        <strong>{weeks[activeWeek].label}</strong> — Revenue: {fmt(weeks[activeWeek].rev)} · Cost: {fmt(weeks[activeWeek].cost)} · Profit: {fmt(weeks[activeWeek].profit)} · {weeks[activeWeek].orders} order{weeks[activeWeek].orders!==1?"s":""}
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,paddingTop:10,borderTop:"1px solid var(--border)"}}>
        {[
          {l:"Best week",v:weeks.reduce((a,b)=>a.rev>b.rev?a:b).label},
          {l:"Avg margin",v:margin+"%",c:margin>=40?"#357A52":"#B03A2E"},
          {l:"Orders",v:mp.length+" cakes"},
          {l:"Profit trend",v:profit>=0?"↑ Positive":"↓ Negative",c:profit>=0?"#357A52":"#B03A2E"},
        ].map(s=><div key={s.l} style={{textAlign:"center"}}>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{s.l}</div>
          <div style={{fontSize:13,fontWeight:500,color:s.c||"var(--text)"}}>{s.v}</div>
        </div>)}
      </div>
    </Card>}

    {/* BOTTOM ROW */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>Recent orders</div>
          {user?.role==="owner"&&(()=>{
            const unpaid=productions.filter(p=>p.paymentType==="deposit"||p.paymentType==="unpaid"||!p.paymentType)
            const outstanding=unpaid.reduce((s,p)=>s+(p.salePrice||0)-(p.depositAmount||0),0)
            return outstanding>0?<div style={{background:"#FDEBE9",border:"1px solid #F09595",borderRadius:7,padding:"7px 10px",fontSize:12.5,color:"#B03A2E",marginBottom:10,display:"flex",justifyContent:"space-between"}}>
              <span>Outstanding balance</span><strong>{fmt(outstanding)}</strong>
            </div>:null
          })()}
          {productions.length===0
            ?<div style={{fontSize:13,color:"var(--muted)"}}>No orders yet — log your first production.</div>
            :productions.slice(0,4).map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontSize:13,fontWeight:500}}>{p.size} · {p.covering}</div>
                <div style={{fontSize:11.5,color:"var(--muted)"}}>{p.client} · Due {p.deliveryDate}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <Badge color={{full:"green",gift:"purple",sample:"blue",discount:"gold",deposit:"blue"}[p.paymentType]||"gray"}>{p.paymentType}</Badge>
                {user?.role==="owner"&&<div style={{fontSize:12,color:"var(--gold)",fontWeight:600,marginTop:2}}>{fmt(p.salePrice)}</div>}
              </div>
            </div>)
          }
          <div style={{marginTop:10}}><Btn small variant="outline" onClick={()=>setView("records")}>View all →</Btn></div>
        </Card>

        {low.length>0&&<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>⚠ {low.length} item{low.length!==1?"s":""} low on stock</div>
          {low.slice(0,4).map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:12.5}}>{i.name}</span>
            <Badge color={i.stock===0?"red":"gold"}>{i.stock} {i.unit}</Badge>
          </div>)}
          <div style={{marginTop:8}}><Btn small variant="outline" onClick={()=>setView("shopping")}>Generate shopping list →</Btn></div>
        </Card>}
      </div>

      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Quick actions</div>
        {quickActions.map(a=><div key={a.view} onClick={()=>setView(a.view)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 8px",borderRadius:8,cursor:"pointer",marginBottom:2}} onMouseEnter={e=>e.currentTarget.style.background="#F0E9DB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{width:34,height:34,borderRadius:8,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{a.icon}</div>
          <div><div style={{fontSize:13,color:"var(--text)"}}>{a.label}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{a.sub}</div></div>
        </div>)}
      </Card>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  INVENTORY TAB — bulk price model with AI smart import
// ═══════════════════════════════════════════════════════════
function InventoryTab({inventory,setInventory,isOwner,showMsg,setView}){
  const [showImport,setShowImport]=useState(false)
  const [showAdd,setShowAdd]=useState(false)
  const [importStep,setImportStep]=useState(1) // 1=paste 2=preview 3=done
  const [prevItems,setPrevItems]=useState([])
  const [pasteN,setPasteN]=useState("")
  const [pasteU,setPasteU]=useState("")
  const [pasteC,setPasteC]=useState("")
  const [newItem,setNewItem]=useState({name:"",unit:"kg",cost:"",minStock:""})
  const [editId,setEditId]=useState(null)
  const [editRow,setEditRow]=useState({})
  const [warnMsg,setWarnMsg]=useState("")

  const L=v=>v.trim().split(String.fromCharCode(10)).map(s=>s.replace(/,/g,"").trim()).filter(Boolean)

  const lowStock=inventory.filter(i=>i.stock<=(i.minStock||5))
  const okCount=inventory.filter(i=>i.stock>(i.minStock||5)).length

  // Check row counts match as user types
  const checkMatch=()=>{
    const ns=L(pasteN),cs=L(pasteC)
    if(ns.length>0&&cs.length>0&&ns.length!==cs.length)
      setWarnMsg(`Names: ${ns.length} rows — Costs: ${cs.length} rows. Must match.`)
    else setWarnMsg("")
  }

  const doPreview=()=>{
    const ns=L(pasteN),us=L(pasteU),cs=L(pasteC)
    if(!ns.length||!cs.length)return showMsg("Item names and cost per unit are required","red")
    if(ns.length!==cs.length)return showMsg(`Names (${ns.length}) and costs (${cs.length}) must have same number of rows`,"red")
    const items=ns.map((name,i)=>({
      id:uid(),name,
      unit:us[i]||"kg",
      cost:parseFloat(cs[i])||0,
      stock:0,minStock:5,on:true
    })).filter(p=>p.name&&p.cost)
    if(!items.length)return showMsg("No valid items found","red")
    setPrevItems(items);setImportStep(2)
  }

  const confirmImport=async()=>{
    const approved=prevItems.filter(p=>p.on)
    const updated=[...inventory,...approved.filter(ni=>!inventory.find(i=>i.name.toLowerCase()===ni.name.toLowerCase()))]
    setInventory(updated);await saveInventory(updated)
    setPasteN("");setPasteU("");setPasteC("");setImportStep(3)
    showMsg(`✓ ${approved.length} items imported. Set opening stock in Settings → Opening Stock.`,"green")
  }

  const addSingle=async()=>{
    if(!newItem.name||!newItem.cost)return showMsg("Name and cost per unit are required","red")
    const item={id:uid(),name:newItem.name,unit:newItem.unit||"kg",cost:+newItem.cost,stock:0,minStock:+newItem.minStock||5}
    const updated=[...inventory,item]
    setInventory(updated);await saveInventory(updated)
    setNewItem({name:"",unit:"kg",cost:"",minStock:""});setShowAdd(false)
    showMsg("✓ Item added. Set opening stock in Settings → Opening Stock.","green")
  }

  const startEdit=(item)=>{setEditId(item.id);setEditRow({...item})}
  const cancelEdit=()=>setEditId(null)
  const doSaveEdit=async()=>{
    const updated=inventory.map(i=>i.id===editId?{...editRow,cost:+editRow.cost,minStock:+editRow.minStock||5,stock:+editRow.stock||0}:i)
    setInventory(updated);await saveInventory(updated);setEditId(null);showMsg("✓ Updated","green")
  }
  const doDelete=async(id)=>{
    if(!confirm("Remove this item?"))return
    const updated=inventory.filter(i=>i.id!==id);setInventory(updated);await saveInventory(updated)
  }

  const badge=(item)=>{
    if(item.stock===0)return<span style={{background:"#FDEBE9",color:"#912622",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500}}>Out</span>
    if(item.stock<=(item.minStock||5))return<span style={{background:"#FDF2DC",color:"var(--gold)",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500}}>Low ⚠</span>
    return<span style={{background:"#E5F4EC",color:"#2D7A50",borderRadius:20,padding:"2px 9px",fontSize:11,fontWeight:500}}>OK</span>
  }

  return <div>
    {/* HEADER */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:13,color:"var(--muted)"}}>{inventory.length} items</span>
        {lowStock.length>0&&<span onClick={()=>setView("shopping")} style={{fontSize:12.5,color:"#B03A2E",fontWeight:600,cursor:"pointer",background:"#FDEBE9",padding:"3px 10px",borderRadius:20}}>⚠ {lowStock.length} low stock → Shopping List</span>}
      </div>
      {isOwner&&<div style={{display:"flex",gap:8}}>
        <Btn small variant="ghost" onClick={()=>{setShowImport(s=>!s);setShowAdd(false);setImportStep(1)}}>📋 Import from Excel</Btn>
        <Btn small onClick={()=>{setShowAdd(s=>!s);setShowImport(false)}}>+ Add Item</Btn>
      </div>}
    </div>

    {/* SUMMARY CARDS */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
      <Card style={{padding:"12px 14px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Total items</div><div style={{fontSize:22,fontWeight:500,color:"var(--text)"}}>{inventory.length}</div></Card>
      <Card style={{padding:"12px 14px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Items OK</div><div style={{fontSize:22,fontWeight:500,color:"#357A52"}}>{okCount}</div></Card>
      <Card style={{padding:"12px 14px",background:"#FFF9EE",borderColor:"var(--gold)"}}><div style={{fontSize:10,color:"var(--gold)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Low / Out</div><div style={{fontSize:22,fontWeight:500,color:"var(--gold)"}}>{lowStock.length}</div></Card>
    </div>

    {/* LOW STOCK BANNER */}
    {lowStock.length>0&&<div style={{background:"#FFF9EE",border:"1px solid var(--gold)",borderRadius:8,padding:"9px 14px",fontSize:12.5,color:"var(--gold)",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span>⚠ {lowStock.map(i=>i.name).join(", ")} — below minimum</span>
      <Btn small variant="outline" onClick={()=>setView("shopping")}>🛒 Shopping List →</Btn>
    </div>}

    {/* IMPORT PANEL */}
    {showImport&&isOwner&&<Card style={{marginBottom:14,borderColor:"var(--gold)",background:"#FDFAF4"}}>

      {/* Step indicators */}
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {[["1","Paste columns"],["2","Preview"],["✓","Imported"]].map(([num,lbl],i)=>{
          const idx=i+1
          const done=importStep>idx,active=importStep===idx
          return <div key={num} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:done?"#357A52":active?"var(--gold)":"var(--border)",color:done||active?"#fff":"var(--muted)"}}>{done?"✓":num}</div>
            <span style={{fontSize:12,color:active?"var(--text)":"var(--muted)",fontWeight:active?500:400}}>{lbl}</span>
            {i<2&&<div style={{width:20,height:1,background:"var(--border)",margin:"0 2px"}}/>}
          </div>
        })}
      </div>

      {/* STEP 1 — paste */}
      {importStep===1&&<div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:10,lineHeight:1.7}}>Open your Excel. Copy each column and paste into its own box. Only item names and cost per unit are required.</div>
        <div style={{background:"#FFF9EE",border:"1px solid #E8D5A3",borderRadius:7,padding:"8px 12px",fontSize:12,color:"var(--gold)",marginBottom:12}}>💡 Just copy from Excel as-is. No reformatting needed.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
          <div>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Item Names *</label>
            <textarea value={pasteN} onChange={e=>{setPasteN(e.target.value);checkMatch()}} placeholder={"FlourSugarOilEggsButter"} style={{width:"100%",minHeight:120,padding:"8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:12,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Unit <span style={{color:"var(--muted)",fontSize:9}}>(optional)</span></label>
            <textarea value={pasteU} onChange={e=>setPasteU(e.target.value)} placeholder={"kgkgLpcskg"} style={{width:"100%",minHeight:120,padding:"8px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:12,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
            <div style={{fontSize:10.5,color:"var(--muted)",marginTop:3}}>Leave blank to default all to kg</div>
          </div>
          <div>
            <label style={{fontSize:10,color:"var(--gold)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Cost / Unit (₦) *</label>
            <textarea value={pasteC} onChange={e=>{setPasteC(e.target.value);checkMatch()}} placeholder={"11401500300020717500"} style={{width:"100%",minHeight:120,padding:"8px",borderRadius:8,border:"1px solid #E8D5A3",background:"#FFF9EE",fontSize:12,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
            <div style={{fontSize:10.5,color:"var(--gold)",marginTop:3}}>Bulk price ÷ qty bought = cost/unit</div>
          </div>
        </div>
        {warnMsg&&<div style={{padding:"7px 12px",background:"#FDEBE9",borderRadius:7,fontSize:12,color:"#B03A2E",marginBottom:10}}>⚠ {warnMsg}</div>}
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={doPreview} disabled={!pasteN.trim()||!pasteC.trim()||!!warnMsg}>Preview import →</Btn>
          <Btn variant="ghost" onClick={()=>setShowImport(false)}>Cancel</Btn>
        </div>
      </div>}

      {/* STEP 2 — preview */}
      {importStep===2&&<div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:10}}>Check every row. Toggle off anything you don't want. Opening stock is set in Settings after import.</div>
        <div style={{overflowX:"auto",marginBottom:10}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
            <thead><tr style={{background:"#EDE5D6"}}>
              {["","Item","Unit","Cost/Unit"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:h==="Cost/Unit"?"right":"left",fontSize:10,textTransform:"uppercase",letterSpacing:.8,color:"var(--muted)",fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>{prevItems.map((p,i)=><tr key={p.id} style={{background:i%2===0?"var(--panel)":"#F8F3EA",opacity:p.on?1:0.35}}>
              <td style={{padding:"6px 10px"}}><div onClick={()=>setPrevItems(prev=>prev.map((x,j)=>j===i?{...x,on:!x.on}:x))} style={{width:30,height:16,borderRadius:8,background:p.on?"#357A52":"var(--border)",cursor:"pointer",position:"relative"}}><div style={{width:12,height:12,borderRadius:"50%",background:"white",position:"absolute",top:2,left:p.on?16:2,transition:"left 0.2s"}}/></div></td>
              <td style={{padding:"6px 10px",fontWeight:500}}>{p.name}</td>
              <td style={{padding:"6px 10px",color:"var(--muted)"}}>{p.unit}</td>
              <td style={{padding:"6px 10px",textAlign:"right",fontWeight:500,color:"var(--gold)"}}>{fmt(p.cost)}/{p.unit}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <div style={{background:"#EEF8F3",border:"1px solid #C2E0CF",borderRadius:7,padding:"8px 12px",fontSize:12,color:"#357A52",marginBottom:10}}>
          After import, go to <strong>Settings → Opening Stock</strong> to set your starting quantities. Stock will then track automatically from there.
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="success" onClick={confirmImport} disabled={!prevItems.some(p=>p.on)}>✓ Confirm & Import {prevItems.filter(p=>p.on).length} Items</Btn>
          <Btn variant="ghost" onClick={()=>setImportStep(1)}>← Edit</Btn>
        </div>
      </div>}

      {/* STEP 3 — done */}
      {importStep===3&&<div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:16,color:"#357A52",fontWeight:600,marginBottom:6}}>✓ Import complete</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14}}>Go to <strong>Settings → Opening Stock</strong> to set starting quantities.</div>
        <Btn variant="ghost" onClick={()=>{setImportStep(1);setShowImport(false)}}>Done</Btn>
      </div>}
    </Card>}

    {/* ADD SINGLE ITEM */}
    {showAdd&&isOwner&&<Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Add New Item</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:10}}>
        <Inp label="Item Name *" value={newItem.name} onChange={v=>setNewItem(p=>({...p,name:v}))} placeholder="e.g. Flour"/>
        <Sel label="Unit *" value={newItem.unit} onChange={v=>setNewItem(p=>({...p,unit:v}))} options={["kg","g","L","ml","pcs","pack","bottle","roll","set"].map(u=>({value:u,label:u}))}/>
        <Inp label="Cost/Unit (₦) *" type="number" value={newItem.cost} onChange={v=>setNewItem(p=>({...p,cost:v}))} placeholder="e.g. 1140"/>
        <Inp label="Min Alert" type="number" value={newItem.minStock} onChange={v=>setNewItem(p=>({...p,minStock:v}))} placeholder="e.g. 10"/>
      </div>
      <div style={{display:"flex",gap:8}}><Btn onClick={addSingle}>Save</Btn><Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
    </Card>}

    {/* MAIN TABLE */}
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
        <TH cols={["Item","Unit","Stock qty","Cost/Unit","Min Alert","Status",...(isOwner?["Actions"]:[])]}/>
        <tbody>{inventory.length===0
          ?<tr><td colSpan={7} style={{padding:32,textAlign:"center",color:"var(--muted)",fontSize:13}}>No items yet — import from Excel or add one at a time</td></tr>
          :inventory.map((item,i)=>{
            const isLow=item.stock<=(item.minStock||5)
            const editing=editId===item.id
            return <tr key={item.id} style={{background:isLow?"#FFF9EE":i%2===0?"var(--panel)":"#F8F3EA"}}>
              {editing?<>
                <td style={{padding:"6px 8px"}}><input value={editRow.name||""} onChange={e=>setEditRow(r=>({...r,name:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
                <td style={{padding:"6px 8px"}}><select value={editRow.unit||"kg"} onChange={e=>setEditRow(r=>({...r,unit:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:60}}>{["kg","g","L","ml","pcs","pack","bottle"].map(u=><option key={u}>{u}</option>)}</select></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.stock||""} onChange={e=>setEditRow(r=>({...r,stock:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:70}}/></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.cost||""} onChange={e=>setEditRow(r=>({...r,cost:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:80}}/></td>
                <td style={{padding:"6px 8px"}}><input type="number" value={editRow.minStock||""} onChange={e=>setEditRow(r=>({...r,minStock:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12,width:60}}/></td>
                <td style={{padding:"6px 8px"}}></td>
                <td style={{padding:"6px 8px"}}><div style={{display:"flex",gap:4}}><Btn small variant="success" onClick={doSaveEdit}>✓</Btn><Btn small variant="ghost" onClick={cancelEdit}>✗</Btn></div></td>
              </>:<>
                <td style={{padding:"9px 10px",fontWeight:500,fontSize:13}}>{item.name}</td>
                <td style={{padding:"9px 10px",color:"var(--muted)",fontSize:13}}>{item.unit}</td>
                <td style={{padding:"9px 10px",fontSize:13,fontWeight:600,color:isLow?"#B03A2E":"#357A52"}}>{item.stock||0} {item.unit}</td>
                <td style={{padding:"9px 10px",fontSize:13,fontWeight:500,color:"var(--gold)"}}>{fmt(item.cost)}/{item.unit}</td>
                <td style={{padding:"9px 10px",fontSize:13,color:"var(--muted)"}}>{item.minStock||5} {item.unit}</td>
                <td style={{padding:"9px 10px"}}>{badge(item)}</td>
                {isOwner&&<td style={{padding:"9px 10px"}}><div style={{display:"flex",gap:4}}><Btn small variant="ghost" onClick={()=>startEdit(item)}>✎</Btn><Btn small variant="danger" onClick={()=>doDelete(item.id)}>×</Btn></div></td>}
              </>}
            </tr>
          })
        }</tbody>
      </table>
    </div>
    <div style={{marginTop:8,fontSize:11.5,color:"var(--muted)",lineHeight:1.7}}>Stock reduces automatically as production orders are saved. Set opening stock in <strong>Settings → Opening Stock</strong>. Restock by scanning a purchase receipt.</div>
  </div>
}


// ═══════════════════════════════════════════════════════════
//  RECIPE CARD (standalone component — avoids hook-in-map bug)
// ═══════════════════════════════════════════════════════════
function RecipeCard({r, inventory, isOwner, onEdit, onDelete}){
  const [open,setOpen]=useState(false)
  const [size,setSize]=useState("6")
  const [shape,setShape]=useState("round")
  const [layers,setLayers]=useState("1")
  const [batchCount,setBatchCount]=useState("1")

  const isPastry=r.type==="pastry"
  const isCovering=r.type==="covering"

  // Load multipliers from localStorage (set in Settings → Pricing setup)
  const getMult=()=>{
    try{
      const all=JSON.parse(localStorage.getItem("ll_multipliers")||"{}")
      const key=size.replace(" inch","").replace('"','').trim()+"-"+shape.toLowerCase()
      return all[key]||null
    }catch{return null}
  }
  const mult=getMult()
  const factor=(mult||1)*(+layers||1)
  const cleanNote=(r.notes||"").replace(/\s*—\s*quantities for 1 layer/gi,"").replace(/\s*-\s*quantities for 1 layer/gi,"").trim()

  const batchCostTotal=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
  const costPerPiece=r.batchSize>0?batchCostTotal/r.batchSize:0

  return <Card style={{marginBottom:10}} >
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontWeight:600,fontSize:15}}>{r.name}</div>
          {isCovering&&<span style={{fontSize:10,background:"#E8EFFC",color:"#2355A0",padding:"2px 7px",borderRadius:20,fontWeight:500}}>Covering/Filling</span>}
          {isPastry&&<span style={{fontSize:10,background:"#FAEEDA",color:"#8C5E00",padding:"2px 7px",borderRadius:20,fontWeight:500}}>Pastry · {r.batchSize||"?"} pcs/batch</span>}
        </div>
        {cleanNote&&<div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{cleanNote}</div>}
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {isOwner&&<div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
          <Btn small variant="ghost" onClick={onEdit}>✎ Edit</Btn>
          <Btn small variant="danger" onClick={onDelete}>×</Btn>
        </div>}
        <span style={{color:"var(--muted)",fontSize:16,marginLeft:4}}>{open?"▴":"▾"}</span>
      </div>
    </div>

    {open&&<div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:20}}>

        {/* LEFT — ingredient table */}
        <div>
          <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>
            {isPastry
              ?`Ingredients — ${batchCount} batch${+batchCount>1?"es":""} (${(+batchCount*(r.batchSize||0))} pieces)`
              :isCovering
              ?`Ingredients — 1 full batch`
              :`Ingredients — ${size}" · ${shape} · ${layers} layer${+layers>1?"s":""}`}
            {!isPastry&&!isCovering&&mult===null&&<span style={{color:"#B03A2E",marginLeft:6}}>(set multiplier to see scaled qty)</span>}
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["Ingredient","Qty needed","Unit cost","Line cost"].map(h=><th key={h} style={{textAlign:h==="Ingredient"?"left":"right",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,paddingBottom:6,fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {r.ing.map(ing=>{
                const it=inventory.find(x=>x.id===ing.iid)
                if(!it)return null
                const scaleFactor=isPastry?+batchCount:isCovering?1:mult!==null?factor:1
                const rawQty=ing.qty*scaleFactor
                const scaledQty=parseFloat(rawQty.toFixed(3))
                const lineCost=it.cost*rawQty
                return <tr key={ing.iid} style={{borderBottom:"1px solid var(--border)"}}>
                  <td style={{padding:"5px 0",fontSize:13}}>{it.name}</td>
                  <td style={{textAlign:"right",fontSize:12,color:"var(--text)",fontWeight:500}}>{scaledQty} {it.unit}</td>
                  <td style={{textAlign:"right",fontSize:12,color:"var(--muted)"}}>{fmt(it.cost)}/{it.unit}</td>
                  <td style={{textAlign:"right",fontSize:13,fontWeight:500}}>{fmt(lineCost)}</td>
                </tr>
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{textAlign:"right",fontSize:12,color:"var(--muted)",paddingTop:8,borderTop:"1px solid var(--border)"}}>Total ingredient cost</td>
                <td style={{textAlign:"right",fontWeight:700,color:"var(--gold)",fontSize:16,paddingTop:8,borderTop:"1px solid var(--border)"}}>{fmt(batchCostTotal*(isPastry?+batchCount:isCovering?1:mult!==null?factor:1))}</td>
              </tr>
              {isPastry&&r.batchSize>0&&<tr>
                <td colSpan={3} style={{textAlign:"right",fontSize:12,color:"var(--muted)",paddingTop:4}}>Cost per piece</td>
                <td style={{textAlign:"right",fontWeight:600,color:"var(--gold)",fontSize:14,paddingTop:4}}>{fmt(costPerPiece)}</td>
              </tr>}
            </tfoot>
          </table>
          <div style={{marginTop:10,fontSize:11.5,color:"var(--muted)",background:"#F5F0E4",borderRadius:7,padding:"7px 10px"}}>
            Boxes, boards and delivery are added at production entry — not here.
          </div>
        </div>

        {/* RIGHT — calculator */}
        <div>
          <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:10}}>Recipe calculator</div>
          <div style={{background:"#F5F0E4",borderRadius:10,padding:14,display:"flex",flexDirection:"column",gap:10}}>

            {isPastry?<>
              <div>
                <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Number of batches</label>
                <select value={batchCount} onChange={e=>setBatchCount(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)",fontSize:13}}>
                  {["1","2","3","4","5","6","7","8","9","10"].map(n=><option key={n} value={n}>{n} batch{+n>1?"es":""} ({+n*(r.batchSize||0)} pcs)</option>)}
                </select>
              </div>
              <div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Batch cost</span>
                  <span style={{fontSize:18,fontWeight:700,color:"var(--gold)"}}>{fmt(batchCostTotal*+batchCount)}</span>
                </div>
                {r.batchSize>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Per piece</span>
                  <span style={{fontSize:14,fontWeight:600,color:"var(--gold)"}}>{fmt(costPerPiece)}</span>
                </div>}
              </div>
            </>:isCovering?<>
              <div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:8,padding:"12px 14px"}}>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Batch summary</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Total batch cost</span>
                  <span style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>{fmt(batchCostTotal)}</span>
                </div>
                {r.batchWeight>0&&<>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                    <span style={{fontSize:12,color:"var(--muted)"}}>Batch weight</span>
                    <span style={{fontSize:13,fontWeight:500}}>{r.batchWeight}g</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",paddingTop:6,borderTop:"1px solid var(--border)"}}>
                    <span style={{fontSize:12,color:"var(--muted)"}}>Cost per gram</span>
                    <span style={{fontSize:14,fontWeight:700,color:"var(--gold)"}}>{fmt(batchCostTotal/r.batchWeight)}/g</span>
                  </div>
                </>}
                {!r.batchWeight&&<div style={{fontSize:11.5,color:"#B03A2E",marginTop:4}}>Add batch weight in Edit to see cost per gram</div>}
              </div>
            </>:<>
              <div>
                <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Size</label>
                <select value={size} onChange={e=>setSize(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)",fontSize:13}}>
                  {["6","7","8","9","10","12","14"].map(s=><option key={s} value={s}>{s} inch</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Shape</label>
                <select value={shape} onChange={e=>setShape(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)",fontSize:13}}>
                  {["round","square","heart","number","sheet"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Layers</label>
                <select value={layers} onChange={e=>setLayers(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",color:"var(--text)",fontSize:13}}>
                  {["1","2","3","4","5","6"].map(n=><option key={n} value={n}>{n} layer{+n>1?"s":""}</option>)}
                </select>
              </div>
              <div style={{borderTop:"1px solid var(--border)",paddingTop:10}}>
                <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Multiplier</label>
                {mult!==null
                  ?<div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{flex:1,padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:14,fontWeight:600,color:"var(--gold)"}}>× {mult.toFixed(1)}</div>
                      <span style={{fontSize:11,color:"#357A52",whiteSpace:"nowrap"}}>✓ Set</span>
                    </div>
                  :<div style={{padding:"7px 12px",borderRadius:8,border:"1px solid #F0C0BB",background:"#FDEBE9",fontSize:13,color:"#B03A2E"}}>
                      Not set — go to <strong>Settings → Pricing setup</strong> to add this size/shape multiplier.
                    </div>
                }
              </div>
              {mult!==null&&<div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:"var(--muted)",marginBottom:3}}>{size}" · {shape} · {layers} layer{+layers>1?"s":""}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Total ingredient cost</span>
                  <span style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>{fmt(r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty*factor:0)},0))}</span>
                </div>
              </div>}
            </>}

          </div>
        </div>

      </div>
    </div>}
  </Card>
}

// ═══════════════════════════════════════════════════════════
//  DECORATIONS TAB (standalone — own state, saved to localStorage)
// ═══════════════════════════════════════════════════════════
function DecorationsTab({inventory, isOwner}){
  const LS_KEY = "ll_decorations"
  const load = () => { try { const v=localStorage.getItem(LS_KEY); return v?JSON.parse(v):DECORATION_ITEMS } catch { return DECORATION_ITEMS } }
  const save = (items) => { try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch {} }

  const [items, setItems] = useState(load)
  const [editId, setEditId] = useState(null)
  const [editRow, setEditRow] = useState({})
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({name:"", label:"", iid:"", qty:"", id:""})
  const [msg, setMsg] = useState("")

  const showMsg = (m) => { setMsg(m); setTimeout(()=>setMsg(""), 3000) }

  const startEdit = (d) => { setEditId(d.id); setEditRow({...d}) }

  const saveEdit = () => {
    const updated = items.map(d => d.id===editId ? {...editRow, qty:+editRow.qty} : d)
    setItems(updated); save(updated); setEditId(null); showMsg("✓ Decoration updated")
  }

  const deleteItem = (id) => {
    if(!confirm("Delete this decoration?")) return
    const updated = items.filter(d => d.id!==id)
    setItems(updated); save(updated); showMsg("Decoration deleted")
  }

  const addItem = () => {
    if(!newItem.name || !newItem.iid || !newItem.qty) return showMsg("Name, inventory item and qty are required")
    const item = { ...newItem, id: uid(), qty: +newItem.qty, label: newItem.name }
    const updated = [...items, item]
    setItems(updated); save(updated)
    setNewItem({name:"", label:"", iid:"", qty:"", id:""}); setAdding(false); showMsg("✓ Decoration added")
  }

  return <div>
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
      <div style={{fontSize:13, color:"var(--muted)"}}>Selectable per production order. Costs update automatically when inventory prices change.</div>
      {isOwner&&<Btn small onClick={()=>setAdding(!adding)}>+ Add Decoration</Btn>}
    </div>

    {msg&&<Alert msg={msg} color={msg.startsWith("✓")?"green":"gold"} onClose={()=>setMsg("")}/>}

    {adding&&isOwner&&<Card style={{marginBottom:14, background:"#FFF9EE", borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif", fontSize:14, fontWeight:600, marginBottom:12}}>New Decoration Extra</div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10}}>
        <Inp label="Decoration Name *" value={newItem.name} onChange={v=>setNewItem(p=>({...p,name:v}))} placeholder="e.g. Edible glitter"/>
        <div style={{marginBottom:11}}>
          <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>Linked Inventory Item *</label>
          <select value={newItem.iid} onChange={e=>setNewItem(p=>({...p,iid:e.target.value}))} style={{...iSt}}>
            <option value="">— Select item —</option>
            {inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) — {fmt(i.cost)}/{i.unit}</option>)}
          </select>
        </div>
        <Inp label="Standard Qty Used *" type="number" value={newItem.qty} onChange={v=>setNewItem(p=>({...p,qty:v}))} placeholder="e.g. 0.15"/>
      </div>
      <div style={{display:"flex", gap:8}}><Btn onClick={addItem}>Save</Btn><Btn variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn></div>
    </Card>}

    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%", borderCollapse:"collapse", background:"var(--panel)", borderRadius:10, overflow:"hidden", border:"1px solid var(--border)"}}>
        <TH cols={["Decoration", "Linked Inventory Item", "Std Qty", "Cost", ...(isOwner?["Actions"]:[])]}/>
        <tbody>{items.map((d,i)=>{
          const it = inventory.find(x=>x.id===d.iid)
          const editing = editId===d.id
          return <tr key={d.id} style={{background:i%2===0?"var(--panel)":"#F8F3EA"}}>
            {editing ? <>
              <td style={{padding:"6px 8px"}}><input value={editRow.name||editRow.label||""} onChange={e=>setEditRow(r=>({...r,name:e.target.value,label:e.target.value}))} style={{...iSt,padding:"4px 6px",fontSize:12}}/></td>
              <td style={{padding:"6px 8px"}}>
                <select value={editRow.iid||""} onChange={e=>setEditRow(r=>({...r,iid:e.target.value}))} style={{...iSt,fontSize:12,padding:"4px 6px"}}>
                  <option value="">— Select —</option>
                  {inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                </select>
              </td>
              <td style={{padding:"6px 8px"}}><input type="number" value={editRow.qty||""} onChange={e=>setEditRow(r=>({...r,qty:e.target.value}))} style={{...iSt,width:70,padding:"4px 6px",fontSize:12}}/></td>
              <td style={{padding:"6px 8px",fontSize:13}}>{editRow.iid&&inventory.find(x=>x.id===editRow.iid)?fmt(inventory.find(x=>x.id===editRow.iid).cost*(+editRow.qty||0)):"—"}</td>
              <td style={{padding:"6px 8px"}}><div style={{display:"flex",gap:4}}><Btn small variant="success" onClick={saveEdit}>✓</Btn><Btn small variant="ghost" onClick={()=>setEditId(null)}>✗</Btn></div></td>
            </> : <>
              <td style={{padding:"9px 10px",fontWeight:500,fontSize:13}}>{d.name||d.label}</td>
              <td style={{padding:"9px 10px",color:"var(--muted)",fontSize:12.5}}>{it?.name||<span style={{color:"#B03A2E"}}>⚠ Not found</span>}</td>
              <td style={{padding:"9px 10px",fontSize:13}}>{d.qty} {it?.unit||""}</td>
              <td style={{padding:"9px 10px",color:"var(--gold)",fontWeight:500,fontSize:13}}>{it?fmt(it.cost*d.qty):"—"}</td>
              {isOwner&&<td style={{padding:"9px 10px"}}><div style={{display:"flex",gap:4}}><Btn small variant="ghost" onClick={()=>startEdit(d)}>✎ Edit</Btn><Btn small variant="danger" onClick={()=>deleteItem(d.id)}>×</Btn></div></td>}
            </>}
          </tr>
        })}</tbody>
      </table>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  MASTER LIST (editable inventory + editable recipes)
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
//  PACKAGING TAB — boards, boxes, drums linked to Order Calculator
// ═══════════════════════════════════════════════════════════
function PackagingTab({isOwner}){
  const LS_KEY="ll_packaging"
  const load=()=>{try{const v=localStorage.getItem(LS_KEY);return v?JSON.parse(v):[
    {id:"p1",name:"Cake Board 6\"",price:300,unit:"per piece"},{id:"p2",name:"Cake Board 8\"",price:450,unit:"per piece"},
    {id:"p3",name:"Cake Board 10\"",price:600,unit:"per piece"},{id:"p4",name:"Cake Board 12\"",price:800,unit:"per piece"},
    {id:"p5",name:"Cake Board 14\"",price:1000,unit:"per piece"},{id:"p6",name:"Cake Drum 8\"",price:700,unit:"per piece"},
    {id:"p7",name:"Cake Drum 10\"",price:900,unit:"per piece"},{id:"p8",name:"Cake Drum 12\"",price:1200,unit:"per piece"},
    {id:"p9",name:"Cake Box 6\"",price:400,unit:"per piece"},{id:"p10",name:"Cake Box 8\"",price:600,unit:"per piece"},
    {id:"p11",name:"Cake Box 10\"",price:800,unit:"per piece"},{id:"p12",name:"Cake Box 12\"",price:1000,unit:"per piece"},
    {id:"p13",name:"Dowels (pack)",price:500,unit:"per pack"},{id:"p14",name:"Delivery box",price:1500,unit:"per piece"},
  ]}catch{return[]}}
  const save=(items)=>{try{localStorage.setItem(LS_KEY,JSON.stringify(items))}catch{}}
  const [items,setItems]=useState(load)
  const [adding,setAdding]=useState(false)
  const [newItem,setNewItem]=useState({name:"",price:"",unit:"per piece"})
  const [editId,setEditId]=useState(null)
  const [editRow,setEditRow]=useState({})

  const addItem=()=>{
    if(!newItem.name.trim()||!newItem.price)return
    const updated=[...items,{id:"p"+Date.now(),name:newItem.name.trim(),price:+newItem.price,unit:newItem.unit||"per piece"}]
    setItems(updated);save(updated);setAdding(false);setNewItem({name:"",price:"",unit:"per piece"})
  }
  const saveEdit=(id)=>{
    const updated=items.map(i=>i.id===id?{...i,...editRow,price:+editRow.price}:i)
    setItems(updated);save(updated);setEditId(null)
  }
  const deleteItem=(id)=>{const updated=items.filter(i=>i.id!==id);setItems(updated);save(updated)}

  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:13,color:"var(--muted)"}}>Boards, boxes and packaging items used in the Order Calculator. Prices update automatically when you edit them here.</div>
      {isOwner&&<Btn small onClick={()=>setAdding(true)}>+ Add item</Btn>}
    </div>
    {adding&&<Card style={{marginBottom:12,borderLeft:"4px solid var(--gold)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
        <Inp label="Item name" value={newItem.name} onChange={v=>setNewItem(n=>({...n,name:v}))} placeholder="e.g. Cake Board 8&quot;"/>
        <Inp label="Price (₦)" type="number" value={newItem.price} onChange={v=>setNewItem(n=>({...n,price:v}))} placeholder="e.g. 450"/>
        <div>
          <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Unit</label>
          <select value={newItem.unit} onChange={e=>setNewItem(n=>({...n,unit:e.target.value}))} style={{...iSt}}>
            {["per piece","per pack","per order"].map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:6}}>
          <Btn small variant="success" onClick={addItem}>✓ Save</Btn>
          <Btn small variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn>
        </div>
      </div>
    </Card>}
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr style={{background:"var(--bg)"}}>
        {["Item","Price","Unit",""].map(h=><th key={h} style={{padding:"8px 10px",textAlign:h==="Price"?"right":"left",fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,fontWeight:500,borderBottom:"1px solid var(--border)"}}>{h}</th>)}
      </tr></thead>
      <tbody>
        {items.map((item,i)=><tr key={item.id} style={{background:i%2===0?"transparent":"var(--bg)"}}>
          {editId===item.id
            ?<>
              <td style={{padding:"6px 8px"}}><input value={editRow.name||""} onChange={e=>setEditRow(r=>({...r,name:e.target.value}))} style={{...iSt,fontSize:12}}/></td>
              <td style={{padding:"6px 8px"}}><input type="number" value={editRow.price||""} onChange={e=>setEditRow(r=>({...r,price:e.target.value}))} style={{...iSt,fontSize:12}}/></td>
              <td style={{padding:"6px 8px"}}><select value={editRow.unit||"per piece"} onChange={e=>setEditRow(r=>({...r,unit:e.target.value}))} style={{...iSt,fontSize:12}}>{["per piece","per pack","per order"].map(u=><option key={u} value={u}>{u}</option>)}</select></td>
              <td style={{padding:"6px 8px"}}><div style={{display:"flex",gap:4}}><Btn small variant="success" onClick={()=>saveEdit(item.id)}>✓</Btn><Btn small variant="ghost" onClick={()=>setEditId(null)}>✗</Btn></div></td>
            </>
            :<>
              <td style={{padding:"8px 10px",fontSize:13,fontWeight:500}}>{item.name}</td>
              <td style={{padding:"8px 10px",fontSize:13,textAlign:"right",color:"var(--gold)",fontWeight:600}}>{fmt(item.price)}</td>
              <td style={{padding:"8px 10px",fontSize:12,color:"var(--muted)"}}>{item.unit}</td>
              <td style={{padding:"6px 8px"}}>{isOwner&&<div style={{display:"flex",gap:4,justifyContent:"flex-end"}}><Btn small variant="ghost" onClick={()=>{setEditId(item.id);setEditRow(item)}}>Edit</Btn><Btn small variant="danger" onClick={()=>deleteItem(item.id)}>×</Btn></div>}</td>
            </>}
        </tr>)}
      </tbody>
    </table>
  </div>
}

function MasterList({inventory,setInventory,recipes,setRecipes,user,setView}){
  const [tab,setTab]=useState("inventory")
  const [editId,setEditId]=useState(null)
  const [editRow,setEditRow]=useState({})
  const [addMode,setAddMode]=useState(false)
  const [newItem,setNewItem]=useState({name:"",cat:"",unit:"kg",unitSize:"",qtyBought:"",bulkPrice:"",minStock:"",stock:0,cost:0})
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
    if(!newItem.name||!newItem.bulkPrice||!newItem.unitSize||!newItem.qtyBought)return showMsg("Name, bulk price, unit size and qty bought are required")
    const cost=parseFloat((+newItem.bulkPrice/(+newItem.unitSize||1)).toFixed(2))
    const stock=parseFloat(((+newItem.unitSize)*(+newItem.qtyBought)).toFixed(3))
    const item={id:uid(),name:newItem.name,cat:newItem.cat||"General",unit:newItem.unit||"kg",unitSize:+newItem.unitSize,qtyBought:+newItem.qtyBought,bulkPrice:+newItem.bulkPrice,minStock:+newItem.minStock||5,stock,cost}
    const updated=[...inventory,item]
    setInventory(updated);await saveInventory(updated)
    setNewItem({name:"",cat:"",unit:"kg",unitSize:"",qtyBought:"",bulkPrice:"",minStock:"",stock:0,cost:0})
    setAddMode(false);showMsg("✓ Item added — cost/unit: "+fmt(cost),"green")
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
  const openRecipe = (r) => setRecipeModal(r ? {...r} : {id:uid(),name:"",size:"6",tiers:1,covering:"buttercream",ing:[]})
  const saveRecipe = async () => {
    if(!recipeModal.name)return showMsg("Recipe name is required")
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
    <Tabs tabs={[{v:"inventory",l:"Inventory"},{v:"recipes",l:"Base Recipes"},{v:"decorations",l:"Decoration Extras"},{v:"packaging",l:"Boards & Packaging"}]} active={tab} onChange={setTab}/>

    {/* ── INVENTORY ── */}
    {tab==="inventory"&&<InventoryTab inventory={inventory} setInventory={setInventory} isOwner={isOwner} showMsg={showMsg} setView={setView}/>}

    {/* ── RECIPES ── */}
    {tab==="recipes"&&<div>
      <div style={{marginBottom:12,padding:"10px 14px",background:"#FFF9EE",borderRadius:8,border:"1px solid var(--gold)",fontSize:13,lineHeight:1.7}}>
        Each recipe is for <strong>1 layer</strong> of that flavour. When you log a production, select the recipe and enter the number of layers — the app multiplies automatically.
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:13,color:"var(--muted)"}}>{recipes.length} recipes · click any card to expand</span>
        {isOwner&&<Btn small onClick={()=>openRecipe(null)}>+ New Recipe</Btn>}
      </div>
      {recipes.map(r=><RecipeCard key={r.id} r={r} inventory={inventory} isOwner={isOwner} onEdit={()=>openRecipe(r)} onDelete={()=>deleteRecipe(r.id)}/>)}
      {recipeModal&&<Modal title={recipeModal.name?"Edit Recipe":"New Recipe"} onClose={()=>setRecipeModal(null)}>
        <Inp label="Recipe Name * (e.g. Vanilla Cake, Buttercream)" value={recipeModal.name} onChange={v=>setRecipeModal(r=>({...r,name:v}))}/>
        <div style={{marginBottom:11}}>
          <label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Recipe type *</label>
          <div style={{display:"flex",gap:8}}>
            {[{v:"layer",l:"🎂 Cake layer",sub:"Vanilla, Red Velvet, Chocolate etc."},{v:"covering",l:"🍦 Covering / Filling",sub:"Buttercream, Fondant, Ganache etc."},{v:"pastry",l:"🍩 Pastry / Batch",sub:"Donuts, tarts, brownies, loaves etc."}].map(t=><div key={t.v} onClick={()=>setRecipeModal(r=>({...r,type:t.v}))} style={{flex:1,padding:"10px 12px",borderRadius:8,border:`1.5px solid ${(recipeModal.type||"layer")===t.v?"var(--gold)":"var(--border)"}`,background:(recipeModal.type||"layer")===t.v?"#FFF9EE":"var(--panel)",cursor:"pointer"}}>
              <div style={{fontSize:13,fontWeight:500,color:(recipeModal.type||"layer")===t.v?"var(--gold)":"var(--text)"}}>{t.l}</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{t.sub}</div>
            </div>)}
          </div>
        </div>
        <Inp label="Notes (optional)" value={recipeModal.notes||""} onChange={v=>setRecipeModal(r=>({...r,notes:v}))} placeholder="e.g. Classic vanilla sponge"/>
        <div style={{padding:"8px 12px",background:"#FFF9EE",borderRadius:7,fontSize:12.5,color:"var(--gold)",marginBottom:12}}>
          {(recipeModal.type||"layer")==="layer"
            ?<span>Enter quantities for <strong>one single layer</strong>. The app multiplies by number of layers automatically.</span>
            :(recipeModal.type||"layer")==="covering"
            ?<span>Enter quantities for <strong>one full batch</strong>. Enter the total weight your batch makes below so cost per gram can be calculated.</span>
            :<span>Enter quantities for <strong>one full batch</strong>. Enter how many pieces your batch makes so cost per piece can be calculated.</span>}
        </div>
        {(recipeModal.type||"layer")==="covering"&&<div style={{marginBottom:11,display:"flex",gap:8,alignItems:"center"}}>
          <Inp label="Total batch weight (g)" type="number" value={recipeModal.batchWeight||""} onChange={v=>setRecipeModal(r=>({...r,batchWeight:v}))} placeholder="e.g. 1200"/>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:18,whiteSpace:"nowrap"}}>grams per batch</div>
        </div>}
        {recipeModal.type==="pastry"&&<div style={{marginBottom:11,display:"flex",gap:8,alignItems:"center"}}>
          <Inp label="Pieces per batch" type="number" value={recipeModal.batchSize||""} onChange={v=>setRecipeModal(r=>({...r,batchSize:+v||0}))} placeholder="e.g. 12"/>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:18,whiteSpace:"nowrap"}}>pieces per batch</div>
        </div>}
        <div style={{fontWeight:600,fontSize:13,marginBottom:8}}>
          {recipeModal.type==="pastry"?"Ingredients (per batch)":recipeModal.type==="covering"?"Ingredients (per batch)":"Ingredients (per 1 layer)"}
        </div>
        {recipeModal.ing.map((ing,idx)=><div key={idx} style={{display:"flex",gap:8,marginBottom:6,alignItems:"center"}}>
          <select value={ing.iid} onChange={e=>updateIng(idx,"iid",e.target.value)} style={{...iSt,flex:2,fontSize:12}}><option value="">— Select ingredient —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) — {fmt(i.cost)}/{i.unit}</option>)}</select>
          <input type="number" placeholder="Qty" value={ing.qty} onChange={e=>updateIng(idx,"qty",e.target.value)} style={{...iSt,width:70,fontSize:12}}/>
          <Btn small variant="danger" onClick={()=>removeIng(idx)}>×</Btn>
        </div>)}
        <Btn small variant="ghost" onClick={addIngToRecipe}>+ Add Ingredient</Btn>
        {recipeModal.ing.length>0&&<div style={{marginTop:10,padding:"8px 12px",background:"#F5F0E4",borderRadius:7,fontSize:13}}>
          {recipeModal.type==="pastry"
            ?<>Batch cost: <strong style={{color:"var(--gold)"}}>{fmt(recipeCost(recipeModal,inventory))}</strong>
              {recipeModal.batchSize>0&&<span style={{marginLeft:8,color:"var(--muted)"}}>· Cost per piece: <strong style={{color:"var(--gold)"}}>{fmt(recipeCost(recipeModal,inventory)/(recipeModal.batchSize))}</strong></span>}</>
            :<>Cost per {recipeModal.type==="covering"?"batch":"layer"}: <strong style={{color:"var(--gold)"}}>{fmt(recipeCost(recipeModal,inventory))}</strong></>}
        </div>}
        <div style={{marginTop:12,display:"flex",gap:8}}><Btn variant="success" onClick={saveRecipe}>✓ Save Recipe</Btn><Btn variant="ghost" onClick={()=>setRecipeModal(null)}>Cancel</Btn></div>
      </Modal>}
    </div>}

    {/* ── DECORATIONS ── */}
    {tab==="decorations"&&<DecorationsTab inventory={inventory} isOwner={isOwner}/>}
    {/* ── PACKAGING ── */}
    {tab==="packaging"&&<PackagingTab isOwner={isOwner}/>}
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

  // Multi-tier state — load from calculator prefill if available
  const loadCovs=()=>{try{return JSON.parse(localStorage.getItem("ll_coverings")||"null")||[{name:"Naked",cost:0},{name:"Buttercream",cost:2500},{name:"Fondant",cost:4500},{name:"Drip",cost:3000}]}catch{return[]}}
  const availCoverings=loadCovs()
  const loadPrefill=()=>{
    try{
      // Check quote prefill first, then calc prefill
      const q=JSON.parse(localStorage.getItem("ll_quote_prefill")||"null")
      if(q){localStorage.removeItem("ll_quote_prefill");return{...q,fromQuote:true}}
      const c=JSON.parse(localStorage.getItem("ll_calc_prefill")||"null")
      if(c){localStorage.removeItem("ll_calc_prefill");return c}
      return null
    }catch{return null}
  }
  const prefill=useState(()=>loadPrefill())[0]
  const [fromQuote]=useState(()=>!!prefill?.fromQuote)
  const [tiers,setTiers]=useState(()=>{
    if(prefill?.tiers&&prefill.tiers.length>0){
      // Normalize tier data from quote format
      return prefill.tiers.map(t=>({
        ...t,
        size:t.size?String(t.size).replace(/['"]/g,""):"6",
        shape:t.shape||"round",
        covering:t.covering||t.coverings?.[0]?.type||"Buttercream",
        layers:t.layers||[{id:Date.now(),flavour:""}],
        coverings:t.coverings||[{id:Date.now(),type:t.covering||"Buttercream",grams:400}],
        fillings:t.fillings||[]
      }))
    }
    return [{id:1,size:"6",shape:"round",covering:"Buttercream",layers:[{id:1,flavour:""}]}]
  })
  const [topper,setTopper]=useState(()=>prefill?.topper||{enabled:false,make:"",deliver:""})
  const [prefillClient]=useState(()=>prefill?.clientName||"")
  const [prefillPhone]=useState(()=>prefill?.clientPhone||"")
  const [decQtyMap,setDecQtyMap]=useState({})
  const layerRecipes=recipes.filter(r=>!r.type||r.type==="layer")
  const loadMults=()=>{try{return JSON.parse(localStorage.getItem("ll_multipliers")||"null")||{}}catch{return{}}}
  const multTable=loadMults()
  const getMult=(s,sh)=>multTable[`${s}-${sh}`]||1
  const addProdTier=()=>setTiers(t=>[...t,{id:Date.now(),size:"6",shape:"round",covering:"Buttercream",layers:[{id:Date.now()+1,flavour:""}]}])
  const removeProdTier=id=>setTiers(t=>t.filter(x=>x.id!==id))
  const updatePTier=(id,key,val)=>setTiers(t=>t.map(x=>x.id===id?{...x,[key]:val}:x))
  const addPLayer=tierId=>setTiers(t=>t.map(x=>x.id===tierId?{...x,layers:[...x.layers,{id:Date.now(),flavour:""}]}:x))
  const removePLayer=(tierId,layerId)=>setTiers(t=>t.map(x=>x.id===tierId?{...x,layers:x.layers.filter(l=>l.id!==layerId)}:x))
  const updatePLayer=(tierId,layerId,flavour)=>setTiers(t=>t.map(x=>x.id===tierId?{...x,layers:x.layers.map(l=>l.id===layerId?{...l,flavour}:l)}:x))
  const tierRecipeCost=(flavour,size,shape)=>{
    const r=recipes.find(x=>x.name.toLowerCase().includes(flavour.toLowerCase()))
    if(!r)return 0
    const base=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
    return base*getMult(size,shape)
  }
  const tierCoveringCost=(cov,size,shape,numLayers)=>{
    const c=availCoverings.find(x=>x.name===cov)
    if(!c||!c.cost)return 0
    return c.cost*(c.scales?getMult(size,shape):1)*numLayers
  }
  const tierTotalCost=tiers.reduce((s,t)=>s+t.layers.reduce((s2,l)=>s2+(l.flavour?tierRecipeCost(l.flavour,t.size,t.shape):0),0)+tierCoveringCost(t.covering,t.size,t.shape,t.layers.length),0)
  const topperCost=(+topper.make||0)+(+topper.deliver||0)
  const newTotalCost=Math.round((tierTotalCost+topperCost)*(1+(settings.accessoryPct||10)/100))
  const [client,setClient]=useState(()=>prefillClient||"");const [clientPhone,setClientPhone]=useState(()=>prefillPhone||"");const [clientEmail,setClientEmail]=useState("")
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
    const tierSummary=tiers.map(t=>`${t.size}" ${t.shape} ${t.covering} (${t.layers.map(l=>l.flavour||"—").join("/")})`).join(" + ")
    const flavourSummary=tiers.flatMap(t=>t.layers.map(l=>l.flavour)).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(", ")
    const prod={id:uid(),client,clientPhone,clientEmail,orderDate,deliveryDate:delivDate,cost:newTotalCost,deliveryCost:delivCost,salePrice:Math.round(effectiveSale),status:"pending",size:tiers[0]?.size+'"',covering:tiers[0]?.covering,flavors:flavourSummary,tiers,topper,decorations:decorIds.join(","),layers:tiers.reduce((s,t)=>s+t.layers.length,0),accessoryPct:settings.accessoryPct,profitPct:settings.profitPct,paymentType,discountPct:+discountPct,notes,tierSummary}
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

      {fromQuote&&<div style={{background:"#E8EFFC",border:"1px solid #B5D4F4",borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12.5,color:"#2355A0"}}>
        ✓ Pre-filled from saved quote. Review details and add anything extra before confirming.
      </div>}
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Cake Tiers</div>
        {tiers.map((tier,ti)=><div key={tier.id} style={{marginBottom:12,padding:12,background:"#F5F0E4",borderRadius:10,borderLeft:"4px solid var(--gold)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontWeight:500,fontSize:13}}>Tier {ti+1}</div>
            {tiers.length>1&&<Btn small variant="danger" onClick={()=>removeProdTier(tier.id)}>Remove</Btn>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Size (inches)</label>
              <select value={tier.size} onChange={e=>updatePTier(tier.id,"size",e.target.value)} style={{...iSt}}>
                {["4","5","6","7","8","9","10","12","14"].map(s=><option key={s} value={s}>{s}"</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Shape</label>
              <select value={tier.shape} onChange={e=>updatePTier(tier.id,"shape",e.target.value)} style={{...iSt}}>
                {["round","square","heart","number","sheet"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Covering</label>
            <select value={tier.covering} onChange={e=>updatePTier(tier.id,"covering",e.target.value)} style={{...iSt}}>
              {availCoverings.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Layers — one flavour per layer</label>
            {tier.layers.map((layer,li)=><div key={layer.id} style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:11.5,color:"var(--muted)",minWidth:52}}>Layer {li+1}</span>
              <select value={layer.flavour} onChange={e=>updatePLayer(tier.id,layer.id,e.target.value)} style={{...iSt,flex:1}}>
                <option value="">— Select flavour —</option>
                {layerRecipes.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              {layer.flavour&&<span style={{fontSize:11,color:"var(--gold)",whiteSpace:"nowrap"}}>{fmt(tierRecipeCost(layer.flavour,tier.size,tier.shape))}</span>}
              {tier.layers.length>1&&<Btn small variant="danger" onClick={()=>removePLayer(tier.id,layer.id)}>×</Btn>}
            </div>)}
            <Btn small variant="ghost" onClick={()=>addPLayer(tier.id)}>+ Add layer</Btn>
          </div>
          <div style={{marginTop:8,fontSize:12,color:"var(--muted)"}}>Tier cost: <strong style={{color:"var(--gold)"}}>{fmt(tier.layers.reduce((s,l)=>s+(l.flavour?tierRecipeCost(l.flavour,tier.size,tier.shape):0),0)+tierCoveringCost(tier.covering,tier.size,tier.shape,tier.layers.length))}</strong></div>
        </div>)}
        <Btn variant="ghost" onClick={addProdTier} style={{width:"100%",marginBottom:14,borderStyle:"dashed"}}>+ Add tier</Btn>

        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:10}}>Custom topper</div>
        <Card style={{marginBottom:14}}>
          <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",marginBottom:topper.enabled?10:0}}>
            <input type="checkbox" checked={topper.enabled} onChange={e=>setTopper(t=>({...t,enabled:e.target.checked}))}/>
            This order has a custom topper
          </label>
          {topper.enabled&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Inp label="Making cost (₦)" type="number" value={topper.make} onChange={v=>setTopper(t=>({...t,make:v}))} placeholder="5000"/>
            <Inp label="Delivery to shop (₦)" type="number" value={topper.deliver} onChange={v=>setTopper(t=>({...t,deliver:v}))} placeholder="1500"/>
          </div>}
        </Card>

        <div style={{padding:"10px 14px",background:"#E8F5EE",borderRadius:8,fontSize:13,marginBottom:14,display:"flex",justifyContent:"space-between"}}>
          <span>Total ingredient cost</span>
          <strong style={{color:"#357A52"}}>{fmt(newTotalCost)}</strong>
        </div>

        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:10}}>Order details</div>
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
          <Inp label="Sale Price (₦)" type="number" value={salePrice} onChange={setSalePrice} placeholder={newTotalCost>0?`Suggested: ${fmt(Math.round(newTotalCost/(1-(settings.profitPct||40)/100)))}`:"0"}/>
          <Inp label="Delivery Cost (₦)" type="number" value={deliveryCost} onChange={setDeliveryCost} placeholder="0"/>
        </div>
        <Sel label="Payment Type" value={paymentType} onChange={setPaymentType} options={PAYMENT_TYPES.map(p=>({value:p.v,label:p.l}))}/>
        {paymentType==="discount"&&<Inp label="Discount %" type="number" value={discountPct} onChange={setDiscountPct}/>}
        <Inp label="Notes" value={notes} onChange={setNotes} placeholder="Colour theme, special requests…"/>
        {newTotalCost>0&&!salePrice&&<div style={{padding:"7px 12px",background:"#E8EFFC",borderRadius:8,fontSize:12.5,marginBottom:10,color:"#2355A0"}}>💡 Suggested price ({settings.profitPct||40}% profit): <strong>{fmt(Math.round(newTotalCost/(1-(settings.profitPct||40)/100)))}</strong></div>}
        <Btn full onClick={()=>setStep(2)} disabled={!client||!delivDate||!tiers.some(t=>t.layers.some(l=>l.flavour))}>Review Cost Breakdown →</Btn>
      </Card>
    </div>}

    {step===2&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:16}}>Cost Breakdown</div>
        {tiers.map((tier,ti)=><div key={tier.id} style={{marginBottom:14}}>
          <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Tier {ti+1} — {tier.size}" {tier.shape} · {tier.covering}</div>
          {tier.layers.map((layer,li)=>{
            const r=recipes.find(x=>x.name.toLowerCase().includes((layer.flavour||"").toLowerCase()))
            const cost=r?tierRecipeCost(layer.flavour,tier.size,tier.shape):0
            return layer.flavour?<div key={layer.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}>
              <span>Layer {li+1}: {layer.flavour}</span><span>{fmt(cost)}</span>
            </div>:null
          })}
          {tier.covering!=="Naked"&&<div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5,color:"var(--muted)"}}>
            <span>Covering: {tier.covering}</span><span>{fmt(tierCoveringCost(tier.covering,tier.size,tier.shape,tier.layers.length))}</span>
          </div>}
        </div>)}
        {topper.enabled&&<><div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Custom Topper</div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>Making cost</span><span>{fmt(+topper.make||0)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:12.5}}><span>Delivery to shop</span><span>{fmt(+topper.deliver||0)}</span></div>
        </>}
        <div style={{borderTop:"1px solid var(--border)",marginTop:8,paddingTop:8}}>
          {[["Accessory margin ("+settings.accessoryPct+"%)",fmt(Math.round(newTotalCost-(newTotalCost/(1+(settings.accessoryPct||10)/100))))],["Delivery",fmt(delivCost)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"var(--muted)",padding:"2px 0"}}><span>{k}</span><span>{v}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,padding:"8px 0",borderTop:"1px solid var(--border)",marginTop:4}}><span>Total Production Cost</span><span style={{color:"var(--gold)"}}>{fmt(newTotalCost+delivCost)}</span></div>
        </div>
        {effectiveSale>0&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF",marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Sale Price</span><span style={{fontWeight:600}}>{fmt(effectiveSale)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,paddingTop:8,borderTop:"1px solid #C2E0CF"}}><span>Gross Profit</span><span style={{color:"#357A52"}}>{fmt(effectiveSale-(newTotalCost+delivCost))}</span></div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Margin: {effectiveSale>0?Math.round(((effectiveSale-(newTotalCost+delivCost))/effectiveSale)*100):0}%</div>
        </div>}
        {(paymentType==="gift"||paymentType==="sample")&&<div style={{background:"#F0EAFC",borderRadius:8,padding:10,marginTop:8,fontSize:12.5,color:"#6B32A0"}}>This is a <strong>{paymentType}</strong> — no revenue logged but all costs are tracked.</div>}
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Order Summary</div>
        {[["Cake",tiers.map((t,i)=>`Tier ${i+1}: ${t.size}" ${t.shape} ${t.covering} (${t.layers.map(l=>l.flavour||"?").join("/")})`).join(" | ")],["Client",client],["Phone",clientPhone||"—"],["Order Date",orderDate],["Delivery Date",delivDate],["Payment",PAYMENT_TYPES.find(p=>p.v===paymentType)?.l||paymentType],["Notes",notes||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)",fontSize:12.5}}><span style={{color:"var(--muted)"}}>{k}</span><span style={{fontWeight:500,textAlign:"right",maxWidth:"60%"}}>{v}</span></div>)}
        {photo&&<img src={photo} alt="" style={{width:"100%",borderRadius:8,marginTop:10}}/>}
        <div style={{marginTop:10,fontSize:12,color:"var(--muted)",background:"#FFF9EE",borderRadius:6,padding:"7px 10px"}}>⚠ Saving will deduct ingredients from inventory based on recipe quantities.</div>
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
      const compressed=await compressImage(photoB64,1200)
      const invList=inventory.map(i=>`${i.id}:${i.name}(${i.unit})`).join(", ")
      const raw=await callClaude([{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:compressed}},
        {type:"text",text:`This is a Nigerian bakery receipt — printed or handwritten. Read every item carefully.

Inventory list to match against:
${invList}

For each item, classify as:
- "purchase" if it is a baking ingredient or supply (flour, sugar, butter, eggs, oil, cocoa, milk, cream, food colour, packaging materials, cake boards, boxes, ribbons, decorations, etc.)
- "expense" if it is an overhead cost (delivery fee, transport, utility, salary, cleaning, equipment repair, marketing, rent, etc.)

For purchase items, also extract:
- unit_size: the size of one pack/bag/crate (e.g. 50 for a 50kg bag, 30 for a 30-egg crate)
- If unit_size is not clear from the receipt, use the qty as the unit_size and set qty to 1.

Return ONLY this exact JSON, no other text:
{
  "items": [
    {"item_on_receipt":"flour","qty":3,"unit":"kg","unit_size":50,"unit_price":57000,"line_total":171000,"type":"purchase","matched_id":"i1","matched_name":"Flour","confidence":"high"},
    {"item_on_receipt":"delivery fee","qty":1,"unit":"","unit_size":1,"unit_price":2000,"line_total":2000,"type":"expense","matched_id":"","matched_name":"Delivery","confidence":"high"}
  ],
  "receipt_total":173000,
  "receipt_date":"2026-04-01",
  "supplier":"market name if visible"
}
confidence: "high", "medium", or "low". For unclear handwriting, make best guess.`}
      ]}],"Parse Nigerian bakery receipts. Classify each item as purchase or expense. Return valid JSON only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      if(!result.items||result.items.length===0)throw new Error("No items found. Try a brighter, clearer photo.")
      setParsed({...result,items:result.items.map(r=>({...r,approved:r.confidence!=="low",overrideId:r.matched_id||"",type:r.type||"purchase"}))})
      if(result.receipt_total)setTotalAmount(String(result.receipt_total))
    }catch(err){setError(`Could not read receipt: ${err.message}`)}
    finally{setLoading(false)}
  }

  const toggleApprove=idx=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,approved:!r.approved}:r)}))
  const setMatch=(idx,id)=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,overrideId:id,approved:true}:r)}))

  const toggleType=(idx)=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,type:r.type==="purchase"?"expense":"purchase"}:r)}))

  const applyUpdates=async()=>{
    const approved=parsed.items.filter(r=>r.approved)
    const purchases=approved.filter(r=>r.type==="purchase"&&r.overrideId)
    const expItems=approved.filter(r=>r.type==="expense"||!r.overrideId)

    // Update inventory: stock + cost/unit for purchases
    let updInv=[...inventory]
    const purchaseLog=[]
    purchases.forEach(r=>{
      const invItem=updInv.find(i=>i.id===r.overrideId)
      if(!invItem)return
      const unitSize=+r.unit_size||+r.qty||1
      const cpu=parseFloat((+r.unit_price/unitSize).toFixed(2))
      const stockAdded=parseFloat((unitSize*(+r.qty||1)).toFixed(3))
      updInv=updInv.map(i=>i.id===r.overrideId?{...i,cost:cpu,stock:parseFloat((i.stock+stockAdded).toFixed(3))}:i)
      purchaseLog.push({id:uid(),date:parsed.receipt_date||today(),itemId:r.overrideId,item:invItem.name,unit:invItem.unit,unitSize,qty:+r.qty||1,price:+r.unit_price,total:+r.line_total||0,cpu,stockAdded})
    })
    if(purchases.length>0){setInventory(updInv);await saveInventory(updInv)}

    // Save purchase records
    if(purchaseLog.length>0){
      const existing=JSON.parse(localStorage.getItem("ll_purchases")||"[]")
      localStorage.setItem("ll_purchases",JSON.stringify([...purchaseLog,...existing]))
    }

    // Log expense for the whole receipt
    const amt=+totalAmount||parsed.items.reduce((s,r)=>s+(+r.line_total||0),0)
    const purchaseNames=purchases.map(r=>r.matched_name||r.item_on_receipt)
    const expNames=expItems.map(r=>r.item_on_receipt)
    const allNames=[...purchaseNames,...expNames]
    const category=purchases.length>0&&expItems.length===0?"Ingredients":expItems.length>0&&purchases.length===0?"Operations":"Mixed"
    const exp={id:uid(),date:parsed.receipt_date||today(),description:`${parsed.supplier||"Receipt"} — ${category}`,amount:amt,category,paymentMethod:"cash",source:"receipt",notes:`Purchases: ${purchaseNames.join(", ")||"none"} | Expenses: ${expNames.join(", ")||"none"}`}
    const updExp=[exp,...expenses];setExpenses(updExp);saveExpenses(updExp)

    setParsed(null);setPhoto(null);setPhotoB64(null);setSaved(true)
  }

  return <div>
    <SHead title="Receipt Scanner" sub="Photo → AI reads items → updates inventory + logs expense."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>📷 Upload Receipt Photo</div>
        {!photo&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          <button onClick={async()=>{
            try{
              const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}})
              const video=document.createElement("video")
              video.srcObject=stream;video.autoplay=true
              const overlay=document.createElement("div")
              overlay.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px"
              video.style.cssText="max-width:100%;max-height:70vh;border-radius:10px"
              const btn=document.createElement("button")
              btn.textContent="📷 Capture"
              btn.style.cssText="padding:14px 32px;border-radius:10px;border:none;background:var(--gold);color:#fff;font-size:16px;cursor:pointer"
              const close=document.createElement("button")
              close.textContent="✕ Cancel"
              close.style.cssText="padding:10px 24px;border-radius:10px;border:none;background:#555;color:#fff;font-size:14px;cursor:pointer"
              overlay.appendChild(video);overlay.appendChild(btn);overlay.appendChild(close)
              document.body.appendChild(overlay)
              btn.onclick=()=>{
                const canvas=document.createElement("canvas")
                canvas.width=video.videoWidth;canvas.height=video.videoHeight
                canvas.getContext("2d").drawImage(video,0,0)
                stream.getTracks().forEach(t=>t.stop())
                document.body.removeChild(overlay)
                const dataUrl=canvas.toDataURL("image/jpeg",0.8)
                const b64=dataUrl.split(",")[1]
                handleFile({target:{files:[new File([Uint8Array.from(atob(b64),c=>c.charCodeAt(0))],"capture.jpg",{type:"image/jpeg"})]}})
              }
              close.onclick=()=>{stream.getTracks().forEach(t=>t.stop());document.body.removeChild(overlay)}
            }catch(e){
              // fallback to file input with capture on mobile
              const inp=document.createElement("input");inp.type="file";inp.accept="image/*";inp.capture="environment"
              inp.onchange=e=>handleFile({target:inp});inp.click()
            }
          }} style={{padding:"14px 8px",borderRadius:10,border:"2px dashed var(--border)",background:"#FAF7F0",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:4}}>📷</div>
            <div style={{fontSize:12.5,color:"var(--muted)",fontWeight:500}}>Open camera</div>
            <div style={{fontSize:11,color:"#C8B89A",marginTop:2}}>Take a photo now</div>
          </button>
          <button onClick={()=>fileRef.current?.click()} style={{padding:"14px 8px",borderRadius:10,border:"2px dashed var(--border)",background:"#FAF7F0",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:4}}>🖼️</div>
            <div style={{fontSize:12.5,color:"var(--muted)",fontWeight:500}}>Upload photo</div>
            <div style={{fontSize:11,color:"#C8B89A",marginTop:2}}>From your gallery</div>
          </button>
        </div>}
        {photo&&<div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:4,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src={photo} alt="receipt" style={{maxHeight:260,maxWidth:"100%",borderRadius:8}}/>
        </div>}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!parsed&&!saved&&<><Btn full onClick={scan} disabled={loading}>{loading?"🔍 AI is reading the receipt…":"✦ Scan & Extract Items"}</Btn>
          {loading&&<div style={{fontSize:12,color:"var(--muted)",textAlign:"center",marginTop:8}}>This may take 15-30 seconds…</div>}
          {error&&<div style={{marginTop:10,padding:"8px 12px",background:"#FDEBE9",borderRadius:8,fontSize:12.5,color:"#B03A2E",lineHeight:1.5}}>⚠ {error}<br/>Try: better lighting, hold camera steady, make sure writing is visible.</div>}
        </>}
        {saved&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF"}}>
          <div style={{fontWeight:600,color:"#357A52",marginBottom:4}}>✓ Done! Purchases updated inventory · expenses logged · cost/unit recalculated.</div>
          <Btn small variant="outline" onClick={()=>{setSaved(false);setPhoto(null);setPhotoB64(null)}}>Scan Another</Btn>
        </div>}
      </Card>
      <div>
        {parsed?<Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Items Detected</div>
          {parsed.supplier&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:3}}>Supplier: <strong>{parsed.supplier}</strong></div>}
          {parsed.receipt_date&&<div style={{fontSize:12,color:"var(--muted)",marginBottom:8}}>Date: <strong>{parsed.receipt_date}</strong></div>}
          {parsed.items.map((r,idx)=><div key={idx} style={{padding:"10px 0",borderBottom:"1px solid var(--border)",opacity:r.approved?1:0.45}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{r.item_on_receipt}</div>
                <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>{r.qty} {r.unit} · {fmt(r.line_total||0)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                <span onClick={()=>toggleType(idx)} style={{fontSize:11,padding:"2px 9px",borderRadius:20,cursor:"pointer",fontWeight:500,background:r.type==="purchase"?"#E8EFFC":"#FEF0D0",color:r.type==="purchase"?"#2355A0":"#7A5500",border:`1px solid ${r.type==="purchase"?"#B5D4F4":"#E8C97A"}`}}>
                  {r.type==="purchase"?"🛍 Purchase":"💸 Expense"}
                </span>
                <Badge color={r.confidence==="high"?"green":r.confidence==="medium"?"gold":"red"}>{r.confidence}</Badge>
                <div onClick={()=>toggleApprove(idx)} style={{width:32,height:18,borderRadius:9,background:r.approved?"#357A52":"var(--border)",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:2,left:r.approved?16:2,transition:"left 0.2s"}}/></div>
              </div>
            </div>
            {r.approved&&r.type==="purchase"&&<div style={{marginTop:6,display:"flex",gap:6}}>
              <select value={r.overrideId||""} onChange={e=>setMatch(idx,e.target.value)} style={{...iSt,fontSize:12,padding:"5px 8px",flex:1}}><option value="">— Match to inventory item —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) · stock: {i.stock}</option>)}</select>
            </div>}
            {r.approved&&r.type==="expense"&&<div style={{marginTop:4,fontSize:11.5,color:"var(--muted)",background:"#FFF9EE",padding:"4px 8px",borderRadius:6}}>→ Will be logged to Expenses tab only</div>}
          </div>)}
          <Inp label="Receipt Total (₦)" type="number" value={totalAmount} onChange={setTotalAmount} placeholder="Total amount paid"/>
          <div style={{marginTop:8,fontSize:11.5,color:"var(--muted)",display:"flex",gap:12}}>
            <span>🛍 {parsed.items.filter(r=>r.approved&&r.type==="purchase").length} purchases → inventory + cost/unit updated</span>
            <span>💸 {parsed.items.filter(r=>r.approved&&r.type==="expense").length} expenses → expenses tab</span>
          </div>
          <div style={{display:"flex",gap:8,marginTop:10}}><Btn variant="success" onClick={applyUpdates} disabled={!parsed.items.some(r=>r.approved)}>✓ Confirm & Apply All</Btn><Btn variant="ghost" onClick={()=>{setParsed(null);setPhoto(null);setPhotoB64(null)}}>← Rescan</Btn></div>
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
    <div style={{marginBottom:12,padding:"8px 12px",background:"#FFF9EE",borderRadius:8,fontSize:12,color:"var(--gold)",border:"1px solid #F0DFA0"}}>
      💡 <strong>How expenses flow to P&L:</strong> Ingredient costs from your recipes are already counted in COGS automatically. Use this page for overhead expenses — decorations bought, packaging, electricity, salary, delivery costs etc. These will appear in your P&L under Overhead Expenses.
    </div>
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
      const raw=await callClaude([{role:"user",content:`Parse this Nigerian bank statement. Extract ALL transactions and return ONLY a JSON array with no other text before or after it:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|ingredients|delivery|packaging|salary|office|utilities|transfer|bank_charges|unknown"}]\n\nRules:\n- Credits = money IN (customers paying you)\n- Debits = money OUT (your expenses)\n- Ignore stamp duty, VAT, and commission lines under ₦500\n- Convert all dates to YYYY-MM-DD format\n- Amount must be a number only, no currency symbols\n\nStatement text:\n${text.slice(0,8000)}`}],"You extract bank transactions from Nigerian bank statements. Return ONLY a valid JSON array, nothing else.")
      // Try to extract JSON array from response
      const jsonMatch=raw.match(/\[[\s\S]*\]/)
      if(!jsonMatch)throw new Error("Could not find transaction data in response. Try pasting more of the statement.")
      const result=JSON.parse(jsonMatch[0])
      if(!Array.isArray(result)||result.length===0)throw new Error("No transactions found. Make sure you copied the full statement text.")
      const filtered=result.filter(t=>t.amount>=100)
      setParsed(filtered.map(t=>({...t,id:uid(),matchedProdId:null})))
    }catch(err){setError("Could not parse: "+err.message)}
    finally{setLoading(false)}
  }

  const handleFile=e=>{
    const file=e.target.files[0];if(!file)return;e.target.value=""
    setLoading(true);setError("")
    const isPDF=file.name.toLowerCase().endsWith(".pdf")||file.type==="application/pdf"
    const reader=new FileReader()

    if(isPDF){
      // Read PDF as base64 and send to Claude as a document
      reader.onload=async ev=>{
        try{
          const base64=ev.target.result.split(",")[1]
          if(!base64){setError("Could not read PDF file — try pasting the text instead.");setLoading(false);return}
          const raw=await callClaude([{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
            {type:"text",text:`Parse ALL transactions from this Nigerian bank statement PDF. Return ONLY a JSON array, no other text:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|ingredients|delivery|packaging|salary|office|utilities|transfer|bank_charges|unknown"}]\n\nCredits = money IN from customers. Debits = money OUT (expenses).\nIgnore stamp duty and VAT lines under ₦500.`}
          ]}],"You extract bank transactions from Nigerian bank statements. Return only a valid JSON array.")
          const cleaned=raw.replace(/```json|```/g,"").trim()
          const result=JSON.parse(cleaned)
          const filtered=result.filter(t=>t.amount>=100)
          setParsed(filtered.map(t=>({...t,id:uid(),matchedProdId:null})))
        }catch(err){setError("Could not read PDF: "+err.message+". Try using Paste Text instead.")}
        finally{setLoading(false)}
      }
      reader.readAsDataURL(file)
    } else {
      // Read CSV/TXT as plain text — no base64 needed
      reader.onload=async ev=>{
        try{
          const text=ev.target.result
          if(!text||!text.trim()){setError("File appears to be empty.");setLoading(false);return}
          await parseFromText(text)
        }catch(err){setError("Could not read file: "+err.message);setLoading(false)}
      }
      reader.readAsText(file)
    }
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
    w.document.write(`<!DOCTYPE html><html><head><title>P&L ${monthLabel}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px;max-width:750px;margin:0 auto}.gold{color:${company.primaryColor||"var(--gold)"}}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}h1{font-size:22px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}.stat{border:1px solid #E0D3BB;border-radius:8px;padding:12px}.sl{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}.sv{font-size:18px;font-weight:bold;color:${company.primaryColor||"var(--gold)"}}table{width:100%;border-collapse:collapse;margin:14px 0}th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888}td{padding:8px 10px;border-bottom:1px solid #E0D3BB;font-size:13px}.total{font-weight:bold;background:#F5F0E4}.pbox{padding:14px 16px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-top:14px;background:${net>=0?"#E8F5EE":"#FDEBE9"}}.plabel{font-size:15px;font-weight:bold}.pval{font-size:17px;font-weight:bold;color:${net>=0?"#357A52":"#B03A2E"}}@media print{button{display:none}}</style></head><body>
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

  // Monthly stock statement data
  const mInv = inventory => {
    return inventory.map(item => {
      const opening = item.openingStock || item.stock || 0
      const used = productions.filter(p=>p.deliveryDate?.startsWith(sel)).reduce((s,p)=>{
        if(!p.recipeId) return s
        return s // deductions tracked per production — simplified here
      },0)
      return {...item, opening, used, closing: item.stock||0 }
    })
  }

  const dlStock=()=>{
    const w=window.open("","_blank")
    const monthLabel2=sel?new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"}):""
    w.document.write(`<!DOCTYPE html><html><head><title>Stock Statement ${monthLabel2}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px;max-width:780px;margin:0 auto}h1{font-size:20px;font-weight:700;color:${company.primaryColor||"var(--gold)"}}h2{font-size:13px;color:#888;font-weight:normal;margin:4px 0 20px}table{width:100%;border-collapse:collapse;margin:14px 0}th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888}td{padding:8px 10px;border-bottom:1px solid #E0D3BB;font-size:13px}.right{text-align:right}.total{font-weight:bold;background:#F5F0E4}@media print{button{display:none}}</style></head><body>
      ${company.logo?`<img src="${company.logo}" style="height:50px;display:block;margin-bottom:10px" alt="logo"/>`:""}
      <h1>${company.name||"Bakery"} — Monthly Stock Statement</h1>
      <h2>${monthLabel2}</h2>
      <table>
        <tr><th>Item</th><th>Unit</th><th class="right">Opening Stock</th><th class="right">+ Purchased</th><th class="right">− Used in Production</th><th class="right">Closing Stock</th><th class="right">Cost/Unit</th><th class="right">Closing Value</th></tr>
        ${inventory.map(item=>{
          const opening=item.openingStock||item.stock||0
          const purchased=expenses.filter(e=>e.date?.startsWith(sel)&&(e.description?.toLowerCase().includes(item.name.toLowerCase()))).reduce((s,e)=>s+(e.amount||0),0)
          const closing=item.stock||0
          const used=Math.max(0,opening-closing)
          return `<tr><td>${item.name}</td><td>${item.unit}</td><td class="right">${opening} ${item.unit}</td><td class="right" style="color:#357A52">+${Math.round(purchased/Math.max(item.cost,1))} ${item.unit}</td><td class="right" style="color:#B03A2E">−${used} ${item.unit}</td><td class="right"><strong>${closing} ${item.unit}</strong></td><td class="right" style="color:var(--gold)">₦${Math.round(item.cost).toLocaleString()}</td><td class="right">₦${Math.round(closing*item.cost).toLocaleString()}</td></tr>`
        }).join("")}
        <tr class="total"><td colspan="7" class="right">Total closing stock value</td><td class="right">₦${Math.round(inventory.reduce((s,i)=>s+(i.stock||0)*(i.cost||0),0)).toLocaleString()}</td></tr>
      </table>
      <div style="margin-top:14px;padding:12px 14px;background:#FFF9EE;border-radius:8px;font-size:12px;color:var(--gold);line-height:1.7">Opening stock is set on the first day of each month in Settings → Opening Stock. Used in Production is calculated from confirmed production orders.</div>
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
      <Btn onClick={dl} variant="outline">📥 Download P&L Report</Btn>
      <Btn onClick={dlStock} variant="ghost">📥 Download Stock Statement</Btn>
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
    w.document.write(`<!DOCTYPE html><html><head><title>Shopping List</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;max-width:650px;margin:0 auto;color:#291608}h1{color:${company.primaryColor||"var(--gold)"};font-size:20px}h2{font-size:13px;color:#888;font-weight:normal;margin:4px 0 20px}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#EDE5D6;padding:10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888}td{padding:10px;border-bottom:1px solid #E0D3BB;font-size:13px}.cb{width:18px;height:18px;border:2px solid ${company.primaryColor||"var(--gold)"};border-radius:3px;display:inline-block}.sos{color:#B03A2E;font-weight:bold}@media print{button{display:none}}</style></head><body>
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
//  INVOICES — list of all invoices generated from quotes
// ═══════════════════════════════════════════════════════════
function Invoices({productions,company,prefillProd,setPrefillProd}){
  const loadInvs=()=>{try{return JSON.parse(localStorage.getItem("ll_quote_invoices")||"[]")}catch{return[]}}
  const [invoices,setInvoices]=useState(loadInvs)
  const [search,setSearch]=useState("")
  const [filter,setFilter]=useState("all")

  // Reload when component mounts
  useEffect(()=>{ setInvoices(loadInvs()) },[])

  const filtered=invoices
    .filter(inv=>filter==="all"||inv.status===filter)
    .filter(inv=>!search||inv.clientName?.toLowerCase().includes(search.toLowerCase())||inv.id?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>new Date(b.date||0)-new Date(a.date||0))

  const markPaid=(id)=>{
    const updated=invoices.map(i=>i.id===id?{...i,status:"paid"}:i)
    setInvoices(updated)
    localStorage.setItem("ll_quote_invoices",JSON.stringify(updated))
  }

  const generateInvoice=(inv)=>{
    const gold=company.primaryColor||"#C8912A"
    const tmpl=company.invoiceTemplate||"classic"
    const tmplStyles={
      classic:`body{font-family:Arial,sans-serif}.inv-badge{background:#F5F0E4;padding:6px 14px;border-radius:6px;display:inline-block;color:${gold};font-weight:600}`,
      modern:`body{font-family:'Helvetica Neue',Arial,sans-serif}.header{background:${gold};color:#fff;padding:24px;margin:-36px -36px 24px}.header .cn{color:#fff!important}.inv-badge{background:rgba(255,255,255,0.2);padding:6px 14px;border-radius:6px;display:inline-block;color:#fff}`,
      minimal:`body{font-family:'Helvetica Neue',Arial,sans-serif;color:#333}.inv-badge{font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase}`,
      elegant:`body{font-family:Georgia,serif;color:#2a1a0a}.header{text-align:center;border-bottom:1px solid ${gold};padding-bottom:20px;margin-bottom:28px}.cn{font-family:Georgia,serif!important;font-size:26px!important}.inv-badge{border:1px solid ${gold};padding:6px 16px;display:inline-block;font-style:italic;color:${gold};font-size:12px}`,
      bold:`body{font-family:Arial,sans-serif}.header{background:#1a1a1a;color:#fff;padding:24px 28px;margin:-36px -36px 24px}.header .cn{color:${gold}!important}.inv-badge{background:${gold};color:#fff;padding:6px 16px;border-radius:4px;display:inline-block;font-weight:bold}`,
    }[tmpl]||""

    const html="<!DOCTYPE html><html><head><title>"+inv.id+"</title>"
      +"<style>*{margin:0;padding:0;box-sizing:border-box}body{color:#291608;padding:36px;max-width:680px;margin:0 auto}"
      +".header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}"
      +".cn{font-size:22px;font-weight:700;color:"+gold+"}"
      +".row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F0EBE3;font-size:13px}"
      +".tier{background:#FFF9EE;border-left:3px solid "+gold+";padding:10px 12px;margin-bottom:8px;border-radius:0 6px 6px 0;font-size:13px}"
      +".price-box{background:#F5F0E4;border-radius:8px;padding:20px;text-align:center;margin:20px 0}"
      +".bank{background:#E8EFFC;border-radius:8px;padding:14px;margin:16px 0}"
      +".terms{font-size:11px;color:#888;margin-top:16px;line-height:1.8;border-top:1px solid #E0D3BB;padding-top:12px}"
      +"@media print{.no-print{display:none}}"
      +tmplStyles+"</style></head><body>"
      +"<div class='header'>"
      +(company.logo?"<img src='"+company.logo+"' style='height:55px;display:block;margin-bottom:6px'/>":"")
      +"<div><div class='cn'>"+(company.name||"Bakery")+"</div>"
      +(company.tagline?"<div style='font-size:12px;color:#888;margin-top:2px'>"+company.tagline+"</div>":"")
      +(company.phone?"<div style='font-size:12px;color:#888;margin-top:4px'>"+company.phone+"</div>":"")
      +(company.email?"<div style='font-size:12px;color:#888'>"+company.email+"</div>":"")
      +(company.address?"<div style='font-size:12px;color:#888'>"+company.address+"</div>":"")
      +"</div>"
      +"<div style='text-align:right'>"
      +"<div style='font-size:28px;font-weight:700;color:#E0D3BB'>INVOICE</div>"
      +"<div class='inv-badge' style='margin-top:6px'>"+inv.id+"</div>"
      +"<div style='font-size:12px;color:#888;margin-top:8px'>Date: <strong>"+(inv.date||"")+"</strong></div>"
      +(inv.deliveryDate?"<div style='font-size:12px;color:#888'>Delivery: <strong>"+inv.deliveryDate+"</strong></div>":"")
      +"</div></div>"
      +"<div style='display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px'>"
      +"<div><div style='font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:6px;font-weight:600'>Bill To</div>"
      +"<div style='font-size:16px;font-weight:700'>"+inv.clientName+"</div>"
      +(inv.clientPhone?"<div style='font-size:13px;color:#555;margin-top:3px'>"+inv.clientPhone+"</div>":"")
      +"</div></div>"
      +"<div style='font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;border-bottom:2px solid "+gold+";padding-bottom:4px;margin-bottom:12px;font-weight:600'>Order details</div>"
      +"<div class='tier'>"+(inv.cakeSummary||inv.productType||"")+(inv.notes?"<br><span style='color:#888;font-size:12px'>"+inv.notes+"</span>":"")+"</div>"
      +"<div class='price-box'>"
      +"<div style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px'>Total amount</div>"
      +"<div style='font-size:36px;font-weight:700;color:"+gold+"'>&#8358;"+(inv.amount||0).toLocaleString()+"</div>"
      +"</div>"
      +(company.bankName?"<div class='bank'><div style='font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;margin-bottom:8px'>Payment details</div>"
        +"<div class='row'><span>Bank</span><span><strong>"+company.bankName+"</strong></span></div>"
        +"<div class='row'><span>Account number</span><span><strong>"+company.bankAccount+"</strong></span></div>"
        +"<div class='row'><span>Account name</span><span>"+company.bankAccountName+"</span></div></div>":"")
      +"<div class='terms'><strong>Terms & Conditions:</strong><br>"
      +"&bull; A 50% non-refundable deposit is required to confirm your order.<br>"
      +"&bull; Balance to be paid on or before collection/delivery.<br>"
      +"&bull; Cake design may slightly differ from inspiration photos.<br>"
      +(company.invoiceFooter?"<br>"+company.invoiceFooter:"")
      +"</div>"
      +"<div class='no-print' style='margin-top:28px;display:flex;gap:10px;justify-content:center'>"
      +"<button onclick='window.print()' style='padding:12px 24px;background:"+gold+";color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600'>📥 Print / Save PDF</button>"
      +(inv.clientPhone?"<button onclick=\"window.open('https://wa.me/"+(inv.clientPhone||"").replace(/[^0-9]/g,"").replace(/^0/,"234")+"?text="+encodeURIComponent("Hello "+inv.clientName+"! 🎂 Your invoice is ready.\n\nInvoice: "+inv.id+"\nAmount: ₦"+(inv.amount||0).toLocaleString()+"\n\nPlease make payment to:\nBank: "+(company.bankName||"")+"\nAccount: "+(company.bankAccount||"")+" ("+(company.bankAccountName||"")+")\n\nThank you for choosing "+(company.name||"Fayvouree Cakes")+"! 🎂")+"','_blank')\" style='padding:12px 24px;background:#25D366;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600'>📱 Share via WhatsApp</button>":"")
      +"</div>"
      +"<div style='margin-top:16px;font-size:11px;color:#aaa;text-align:center'>"+(company.name||"")+" · Generated by LayerLedger</div>"
      +"</body></html>"

    const w=window.open("","_blank")
    w.document.write(html)
    w.document.close()
  }

  return <div>
    <SHead title="Invoices" sub="All invoices generated from client quotes."/>

    {invoices.length===0
      ?<Card style={{textAlign:"center",padding:48}}>
        <div style={{fontSize:32,marginBottom:12}}>🧾</div>
        <div style={{fontSize:16,fontWeight:600,marginBottom:8,color:"var(--text)"}}>No invoices yet</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Invoices are created from the Quotes page. Open a quote and click "Convert to invoice" to generate one.</div>
        <Btn variant="ghost" onClick={()=>{}}>Go to Quotes</Btn>
      </Card>
      :<>
        {/* Search and filter */}
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by client name or invoice number..." style={{...iSt,flex:1,minWidth:200}}/>
          <Tabs tabs={[{v:"all",l:"All"},{v:"unpaid",l:"Unpaid"},{v:"paid",l:"Paid"}]} active={filter} onChange={setFilter}/>
        </div>

        {/* Summary row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
          {[
            {l:"Total invoices",v:invoices.length,c:"var(--text)"},
            {l:"Total invoiced",v:"₦"+invoices.reduce((s,i)=>s+(i.amount||0),0).toLocaleString(),c:"var(--gold)"},
            {l:"Unpaid",v:invoices.filter(i=>i.status!=="paid").length+" invoice"+(invoices.filter(i=>i.status!=="paid").length!==1?"s":""),c:"#B03A2E"},
          ].map(s=><Card key={s.l} style={{padding:"12px 16px"}}>
            <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{s.l}</div>
            <div style={{fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
          </Card>)}
        </div>

        {/* Invoice list */}
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:32,color:"var(--muted)"}}>No invoices match your search.</div>
          :filtered.map(inv=><Card key={inv.id} style={{marginBottom:10,borderLeft:`4px solid ${inv.status==="paid"?"#357A52":"var(--gold)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600}}>{inv.clientName}</span>
                  <span style={{fontSize:11,color:"var(--muted)",background:"var(--bg)",padding:"2px 8px",borderRadius:20}}>{inv.id}</span>
                  <Badge color={inv.status==="paid"?"green":"gold"}>{inv.status==="paid"?"Paid":"Unpaid"}</Badge>
                </div>
                <div style={{fontSize:12.5,color:"var(--muted)",display:"flex",gap:16,flexWrap:"wrap"}}>
                  <span>📅 Date: {inv.date}</span>
                  {inv.deliveryDate&&<span>🚚 Delivery: {inv.deliveryDate}</span>}
                  <span>🧁 {inv.productType||"Cake"}</span>
                </div>
                {inv.notes&&<div style={{fontSize:12,color:"var(--muted)",marginTop:4,fontStyle:"italic"}}>{inv.notes}</div>}
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--gold)",marginBottom:8}}>₦{(inv.amount||0).toLocaleString()}</div>
                <div style={{display:"flex",gap:6,justifyContent:"flex-end",flexWrap:"wrap"}}>
                  <Btn small onClick={()=>generateInvoice(inv)}>🧾 Generate invoice</Btn>
                  {inv.status!=="paid"&&<Btn small variant="success" onClick={()=>markPaid(inv.id)}>✓ Mark paid</Btn>}
                </div>
              </div>
            </div>
          </Card>)}
      </>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  P&L STATEMENT HELPERS
// ═══════════════════════════════════════════════════════════
function PLSection({title,gold,children}){
  return <div style={{marginBottom:16}}>
    <div style={{fontSize:10.5,textTransform:"uppercase",letterSpacing:1,color:"var(--muted)",fontWeight:600,paddingBottom:6,borderBottom:`2px solid ${gold||"var(--gold)"}`,marginBottom:8}}>{title}</div>
    {children}
  </div>
}
function PLRow({label,value,indent,bold,color}){
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:bold?"9px 12px":"6px 0",background:bold?"#F5F0E4":"transparent",borderRadius:bold?6:0,borderBottom:bold?"none":"1px solid var(--border)",marginTop:bold?4:0,paddingLeft:indent?16:bold?12:0}}>
    <span style={{fontSize:bold?13.5:12.5,fontWeight:bold?600:400,color:color||"var(--text)"}}>{label}</span>
    <span style={{fontSize:bold?14:12.5,fontWeight:bold?600:400,color:color||"var(--text)"}}>{value}</span>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  P&L STATEMENT
// ═══════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────
//  DATA BRIDGE — confirmed quotes → financial reports
//  This is the single source of truth for revenue.
//  Confirmed quotes (ll_quotes where confirmedAt is set) are used
//  as the primary revenue source. Old manual production records
//  (no quoteId) are included as legacy fallback only.
// ─────────────────────────────────────────────────────────────
function loadQuoteRevenue(){
  try{
    const qs=JSON.parse(localStorage.getItem("ll_quotes")||"[]")
    return qs
      .filter(q=>q.confirmedAt)
      .map(q=>({
        id:q.id,
        quoteId:q.id,
        fromQuote:true,
        client:q.clientName||"",
        clientPhone:q.clientPhone||"",
        deliveryDate:q.deliveryDate||q.date||"",
        orderDate:q.date||"",
        confirmedAt:q.confirmedAt,
        salePrice:+(q.salePrice||q.quotePrice||0),
        cost:+(q.totalCost||0),
        deliveryCost:0,
        productType:q.productType||"Cake",
        size:q.tiers?.map(t=>t.size+'" '+t.shape).join(" + ")||"",
        covering:q.tiers?.[0]?.coverings?.[0]?.type||"",
        flavors:q.flavourSummary||"",
        cakeSummary:q.cakeSummary||"",
        donutGroups:q.donutGroups||[],
        loaves:q.loaves||[],
        tartQty:q.tartQty||0,
        notes:q.notes||"",
        paymentType:"full",
        status:"approved",
        margin:q.margin||0,
      }))
  }catch{return[]}
}

// Merge revenue sources — confirmed quotes PRIMARY, old manual productions SECONDARY
function mergeRevenueSources(productions){
  const quoteRevenue=loadQuoteRevenue()
  const quoteIds=new Set(quoteRevenue.map(q=>q.quoteId))
  // Only include production records that are NOT from the quote flow
  const legacyProds=productions.filter(p=>!p.fromQuote&&!p.quoteId&&!quoteIds.has(p.quoteId))
  return[...quoteRevenue,...legacyProds]
}

function PandL({productions,expenses,company}){
  // Use confirmed quotes as primary revenue source
  const allRevenue=mergeRevenueSources(productions)

  const allMonths=[...new Set([
    ...allRevenue.map(p=>p.deliveryDate?.slice(0,7)),
    ...expenses.map(e=>e.date?.slice(0,7)),
  ].filter(Boolean))].sort().reverse()
  const cur=new Date().toISOString().slice(0,7)
  // Default to current month — always show current month even if no data yet
  const [sel,setSel]=useState(cur)
  const monthLabel=new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})
  const gold=company?.primaryColor||"var(--gold)"

  // P&L calculations — all from confirmed quotes
  const mRevenue=allRevenue.filter(p=>p.deliveryDate?.startsWith(sel))
  const paid=mRevenue.filter(p=>p.paymentType!=="gift"&&p.paymentType!=="sample")
  const revenue=paid.reduce((s,p)=>s+(p.salePrice||0),0)
  const cogsProd=mRevenue.reduce((s,p)=>s+(p.cost||0),0)
  const delivery=mRevenue.reduce((s,p)=>s+(p.deliveryCost||0),0)
  const cogs=cogsProd+delivery
  const grossProfit=revenue-cogs
  const grossMargin=revenue>0?Math.round((grossProfit/revenue)*100):0

  // Revenue by product type
  const byType=mRevenue.reduce((acc,p)=>{
    const t=p.productType||"Cake"
    if(!acc[t])acc[t]={qty:0,rev:0,cost:0}
    acc[t].qty++;acc[t].rev+=(p.salePrice||0);acc[t].cost+=(p.cost||0)
    return acc
  },{})

  // Overhead expenses — everything EXCEPT pure ingredient purchase costs
  // Ingredients bought for stock go to COGS via recipe costing, not overhead
  // But decoration items, utilities, packaging, salary etc. are overhead
  const COGS_CATS=["Ingredient costs"] // only this specific category excluded from overhead
  const mExp=expenses.filter(e=>
    e.date?.startsWith(sel)&&
    !COGS_CATS.includes(e.category)&&
    e.source!=="purchase"
  )
  const overhead=mExp.reduce((s,e)=>s+(e.amount||0),0)

  // Group overheads by category
  const overheadBycat=mExp.reduce((acc,e)=>{
    const cat=e.category||"General"
    acc[cat]=(acc[cat]||0)+(e.amount||0)
    return acc
  },{})

  const netProfit=grossProfit-overhead
  const netMargin=revenue>0?Math.round((netProfit/revenue)*100):0

  const dl=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>P&L Statement ${monthLabel}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:36px;max-width:680px;margin:0 auto}
    h1{font-size:22px;font-weight:700;color:${gold}}
    h2{font-size:12px;color:#888;font-weight:400;margin:3px 0 24px}
    .section{margin-bottom:20px}
    .section-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;padding:8px 0;border-bottom:2px solid ${gold};margin-bottom:10px}
    .row{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;border-bottom:1px solid #F0EBE3}
    .row.indent{padding-left:16px;color:#555}
    .row.subtotal{font-weight:600;background:#F5F0E4;padding:8px 10px;border-radius:4px;margin:4px 0}
    .row.total{font-weight:700;font-size:15px;padding:12px 14px;background:${netProfit>=0?"#E8F5EE":"#FDEBE9"};border-radius:8px;color:${netProfit>=0?"#1D6B40":"#B03A2E"};margin-top:8px}
    .positive{color:#1D6B40}.negative{color:#B03A2E}
    .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}
    .scard{border:1px solid #E0D3BB;border-radius:8px;padding:12px;text-align:center}
    .slabel{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:4px}
    .sval{font-size:18px;font-weight:700;color:${gold}}
    @media print{button{display:none}}</style></head><body>
    ${company?.logo?`<img src="${company.logo}" style="height:44px;margin-bottom:12px;display:block"/>`:""}
    <h1>${company?.name||"Bakery"} — Profit & Loss Statement</h1>
    <h2>${monthLabel}</h2>
    <div class="summary">
      <div class="scard"><div class="slabel">Revenue</div><div class="sval">₦${Math.round(revenue).toLocaleString()}</div></div>
      <div class="scard"><div class="slabel">Gross margin</div><div class="sval">${grossMargin}%</div></div>
      <div class="scard"><div class="slabel">Net margin</div><div class="sval ${netMargin>=0?"positive":"negative"}">${netMargin}%</div></div>
    </div>
    <div class="section">
      <div class="section-title">Revenue</div>
      ${Object.entries(byType).map(([type,data])=>`<div class="row indent"><span>${type} — ${data.qty} order${data.qty!==1?"s":""}</span><span>₦${Math.round(data.rev).toLocaleString()}</span></div>`).join("")}
      ${Object.keys(byType).length===0?'<div class="row indent"><span>No confirmed orders this month</span><span>₦0</span></div>':""}
      <div class="row subtotal"><span>Total Revenue (${paid.length} confirmed orders)</span><span>₦${Math.round(revenue).toLocaleString()}</span></div>
    </div>
    <div class="section">
      <div class="section-title">Sales Detail</div>
      ${mRevenue.map(p=>`<div class="row"><span>${p.client} — ${p.productType||"Cake"}${p.size?" ("+p.size+")":""}</span><span>₦${Math.round(p.salePrice||0).toLocaleString()}</span></div>`).join("")}
    </div>
    <div class="section">
      <div class="section-title">Cost of Goods Sold</div>
      <div class="row indent"><span>Ingredient costs</span><span>₦${Math.round(cogsProd).toLocaleString()}</span></div>
      <div class="row indent"><span>Delivery costs</span><span>₦${Math.round(delivery).toLocaleString()}</span></div>
      <div class="row subtotal"><span>Total COGS</span><span>₦${Math.round(cogs).toLocaleString()}</span></div>
    </div>
    <div class="row subtotal" style="font-size:14px;margin-bottom:20px"><span>Gross Profit</span><span class="${grossProfit>=0?"positive":"negative"}">₦${Math.round(grossProfit).toLocaleString()} (${grossMargin}%)</span></div>
    <div class="section">
      <div class="section-title">Overhead Expenses</div>
      ${Object.entries(overheadBycat).map(([cat,amt])=>`<div class="row indent"><span>${cat}</span><span>₦${Math.round(amt).toLocaleString()}</span></div>`).join("")}
      ${Object.keys(overheadBycat).length===0?'<div class="row indent"><span>No overhead expenses</span><span>₦0</span></div>':""}
      <div class="row subtotal"><span>Total Overheads</span><span>₦${Math.round(overhead).toLocaleString()}</span></div>
    </div>
    <div class="row total"><span>Net Profit / (Loss)</span><span>₦${Math.round(netProfit).toLocaleString()} (${netMargin}%)</span></div>
    <p style="margin-top:28px;font-size:10px;color:#aaa">Generated by LayerLedger · ${new Date().toLocaleDateString()} · This is a management account and not a certified financial statement.</p>
    <script>window.print()<\/script></body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="P&L Statement" sub="Profit & Loss — revenue, costs and net profit for the selected month"/>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13,color:"var(--text)"}}>
        {([...new Set([cur,...allMonths])]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
      <Btn onClick={dl}>📥 Download PDF</Btn>
    </div>

    {/* SUMMARY CARDS */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
      {[
        {l:"Revenue",v:fmt(revenue),c:gold},
        {l:"Gross margin",v:grossMargin+"%",c:grossMargin>=50?"#357A52":"#B03A2E"},
        {l:"Net margin",v:netMargin+"%",c:netMargin>=30?"#357A52":"#B03A2E"},
      ].map(s=><Card key={s.l} style={{textAlign:"center",padding:"14px"}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.l}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
      </Card>)}
    </div>

    <Card style={{maxWidth:560}}>
      <PLSection gold={gold} title="Revenue">
        {Object.entries(byType).length>0
          ?Object.entries(byType).map(([type,data])=><PLRow key={type} label={`${type} (${data.qty} order${data.qty!==1?"s":""})`} value={fmt(data.rev)} indent/>)
          :<PLRow label="No confirmed orders this month" value={fmt(0)} indent/>}
        <PLRow label={`Total Revenue (${paid.length} confirmed order${paid.length!==1?"s":""})`} value={fmt(revenue)} bold/>
      </PLSection>

      <PLSection gold={gold} title="Cost of Goods Sold (COGS)">
        <PLRow label="Ingredient costs" value={fmt(cogsProd)} indent/>
        <PLRow label="Delivery costs" value={fmt(delivery)} indent/>
        <PLRow label="Total COGS" value={fmt(cogs)} bold/>
      </PLSection>

      <PLRow label={`Gross Profit (${grossMargin}% margin)`} value={fmt(grossProfit)} bold color={grossProfit>=0?"#357A52":"#B03A2E"}/>

      <div style={{height:16}}/>

      <PLSection gold={gold} title="Overhead Expenses">
        {Object.entries(overheadBycat).map(([cat,amt])=><PLRow key={cat} label={cat} value={fmt(amt)} indent/>)}
        {Object.keys(overheadBycat).length===0&&<PLRow label="No overhead expenses logged" value="₦0" indent/>}
        <PLRow label="Total Overheads" value={fmt(overhead)} bold/>
      </PLSection>

      <div style={{padding:"14px 16px",background:netProfit>=0?"#E8F5EE":"#FDEBE9",border:`1px solid ${netProfit>=0?"#C2E0CF":"#F09595"}`,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
        <div>
          <div style={{fontSize:11,color:netProfit>=0?"#085041":"#501313",textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>Net Profit / (Loss)</div>
          <div style={{fontSize:11,color:netProfit>=0?"#0F6E56":"#791F1F"}}>{monthLabel}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:netProfit>=0?"#357A52":"#B03A2E"}}>{fmt(netProfit)}</div>
          <div style={{fontSize:12,color:netProfit>=0?"#357A52":"#B03A2E"}}>{netMargin}% net margin</div>
        </div>
      </div>

      <div style={{marginTop:12,fontSize:11,color:"var(--muted)",lineHeight:1.6}}>
        This is a management account generated by LayerLedger. It is not a certified financial statement.
      </div>
    </Card>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  USER ROW (standalone to allow useState per row)
// ═══════════════════════════════════════════════════════════
function UserRow({u,i,updatePin,toggleUser,deleteUser}){
  const [editPin,setEditPin]=useState(u.pin)
  const [showPin,setShowPin]=useState(false)
  return <TR2 i={i} row={[
    <div>
      <div style={{fontWeight:500}}>{u.name}</div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{u.id==="owner"?"Main account":""}</div>
    </div>,
    <Badge color={u.role==="owner"?"gold":u.role==="production"?"blue":"green"}>{ROLES[u.role]?.split(" ")[0]||u.role}</Badge>,
    <div style={{display:"flex",gap:6,alignItems:"center"}}>
      <input type={showPin?"text":"password"} value={editPin} onChange={e=>setEditPin(e.target.value)} style={{...iSt,width:80,padding:"4px 6px",fontSize:12}}/>
      <span onClick={()=>setShowPin(s=>!s)} style={{fontSize:11,color:"var(--muted)",cursor:"pointer"}}>{showPin?"Hide":"Show"}</span>
      {editPin!==u.pin&&<Btn small variant="success" onClick={()=>updatePin(u.id,editPin)}>Save</Btn>}
    </div>,
    <Badge color={u.active?"green":"gray"}>{u.active?"Active":"Inactive"}</Badge>,
    <div style={{display:"flex",gap:4}}>
      <Btn small variant="ghost" onClick={()=>toggleUser(u.id)}>{u.active?"Deactivate":"Activate"}</Btn>
      {u.id!=="owner"&&<Btn small variant="danger" onClick={()=>deleteUser(u.id)}>×</Btn>}
    </div>,
  ]}/>
}

// ═══════════════════════════════════════════════════════════
//  PRODUCTION LIST (weekly work order — printable)
// ═══════════════════════════════════════════════════════════
function ProductionList({productions,company,setView}){
  const today=new Date()
  const startOfWeek=new Date(today)
  startOfWeek.setDate(today.getDate()-today.getDay()+1) // Monday
  const endOfWeek=new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate()+6) // Sunday

  const [weekOffset,setWeekOffset]=useState(0)
  const ws=new Date(startOfWeek);ws.setDate(ws.getDate()+weekOffset*7)
  const we=new Date(ws);we.setDate(ws.getDate()+6)

  const fmt2=d=>new Date(d).toLocaleDateString("en-NG",{weekday:"short",day:"numeric",month:"short"})
  const weekLabel=`${fmt2(ws)} — ${fmt2(we)}`

  const weekProds=productions.filter(p=>{
    if(!p.deliveryDate)return false
    const d=new Date(p.deliveryDate)
    return d>=ws&&d<=we
  }).sort((a,b)=>new Date(a.deliveryDate)-new Date(b.deliveryDate))

  const statusColor={pending:"#FAEEDA",inprogress:"#E8EFFC",ready:"#E1F5EE",delivered:"#F0EBE3"}
  const statusText={pending:"Pending",inprogress:"In progress",ready:"Ready",delivered:"Delivered"}
  const [statuses,setStatuses]=useState({})
  const setStatus=(id,s)=>setStatuses(p=>({...p,[id]:s}))

  const print=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>Production List ${weekLabel}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:28px;max-width:720px;margin:0 auto}
    h1{font-size:20px;font-weight:700;color:${company?.primaryColor||"var(--gold)"}}
    h2{font-size:12px;color:#888;font-weight:400;margin:3px 0 18px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888;font-weight:500}
    td{padding:9px 10px;border-bottom:1px solid #E0D3BB}
    tr:nth-child(even) td{background:#F8F3EA}
    .status{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px}
    @media print{button{display:none}}</style></head><body>
    ${company?.logo?`<img src="${company.logo}" style="height:44px;margin-bottom:10px;display:block"/>`:""}
    <h1>${company?.name||"Bakery"} — Production List</h1>
    <h2>${weekLabel} · ${weekProds.length} order${weekProds.length!==1?"s":""}</h2>
    <table><tr><th>#</th><th>Client</th><th>Cake</th><th>Flavour</th><th>Covering</th><th>Size</th><th>Layers</th><th>Collection</th><th>Notes</th><th>Status</th></tr>
    ${weekProds.map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p.client||"—"}</strong></td><td>${p.size||"—"}</td><td>${p.flavor||p.flavour||"—"}</td><td>${p.covering||"—"}</td><td>${p.size||"—"}</td><td>${p.layers||"—"}</td><td>${p.deliveryDate||"—"}</td><td>${p.notes||""}</td><td class="status">${statuses[p.id]||"Pending"}</td></tr>`).join("")}
    </table>
    ${weekProds.length===0?"<p style='margin-top:20px;color:#888'>No orders due this week.</p>":""}
    <p style='margin-top:20px;font-size:10px;color:#aaa'>Printed from LayerLedger · ${new Date().toLocaleDateString()}</p>
    <script>window.print()<\/script></body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="Production List" sub="Weekly work order — what needs to be baked and when"/>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <Btn small variant="ghost" onClick={()=>setWeekOffset(w=>w-1)}>← Prev week</Btn>
        <div style={{fontSize:13,fontWeight:500,color:"var(--text)",minWidth:200,textAlign:"center"}}>{weekLabel}</div>
        <Btn small variant="ghost" onClick={()=>setWeekOffset(w=>w+1)}>Next week →</Btn>
        {weekOffset!==0&&<Btn small variant="outline" onClick={()=>setWeekOffset(0)}>This week</Btn>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn small onClick={print}>📥 Print / Download</Btn>
      </div>
    </div>

    {weekProds.length===0
      ?<Card style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:24,marginBottom:10}}>🎂</div>
          <div style={{fontSize:15,fontWeight:500,color:"var(--text)",marginBottom:6}}>No orders this week</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Nothing due between {fmt2(ws)} and {fmt2(we)}.</div>
          <Btn onClick={()=>setView("calculator")}>Go to Order Calculator</Btn>
        </Card>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {weekProds.map((p,i)=>{
          const st=statuses[p.id]||p.status||"pending"
          const isCake=!p.productType||p.productType==="Cake"||p.productType==="Cupcakes"
          const isDonuts=p.productType==="Donuts"
          const isLoaf=p.productType==="Cake Loaf"
          const isTart=p.productType==="Tarts / Pastry"
          return <Card key={p.id} style={{borderLeft:`4px solid ${st==="ready"?"#357A52":st==="inprogress"?"#378ADD":st==="delivered"?"#888780":"var(--gold)"}`,padding:"14px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"var(--text)"}}>{p.client||"Unknown client"}</span>
                  <span style={{fontSize:11,background:"#F5F0E4",color:"var(--muted)",padding:"2px 8px",borderRadius:20}}>{p.productType||"Cake"}</span>
                  <span style={{fontSize:11,background:"#F5F0E4",color:"var(--muted)",padding:"2px 8px",borderRadius:20}}>Order {i+1} of {weekProds.length}</span>
                </div>

                {/* Design photo */}
                {p.cakePhoto&&<div style={{marginBottom:10}}>
                  <img src={p.cakePhoto} alt="Design" style={{maxWidth:"100%",maxHeight:180,borderRadius:8,display:"block",border:"1px solid var(--border)"}}/>
                </div>}

                {/* Cake/Cupcake details */}
                {isCake&&p.tiers?.length>0&&<div style={{marginBottom:8}}>
                  {p.tiers.map((tier,ti)=><div key={ti} style={{background:"#F5F0E4",borderRadius:8,padding:"10px 12px",marginBottom:6,fontSize:12.5}}>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:6,color:"var(--text)"}}>Tier {ti+1} — {tier.size} {tier.shape}</div>
                    {tier.layers?.map((l,li)=><div key={li} style={{display:"flex",gap:8,marginBottom:3}}>
                      <span style={{color:"var(--muted)",minWidth:60,fontSize:12}}>Layer {li+1}:</span>
                      <span style={{fontWeight:500}}>{l.flavour||"—"}</span>
                    </div>)}
                    {tier.fillings?.length>0&&<div style={{marginTop:4,paddingTop:4,borderTop:"1px solid var(--border)"}}>
                      {tier.fillings.map((f,fi)=><div key={fi} style={{display:"flex",gap:8,marginBottom:3}}>
                        <span style={{color:"var(--muted)",minWidth:60,fontSize:12}}>Filling {fi+1}:</span>
                        <span style={{fontWeight:500}}>{f.type} — {f.grams}g</span>
                      </div>)}
                    </div>}
                    {tier.coverings?.length>0&&<div style={{marginTop:4,paddingTop:4,borderTop:"1px solid var(--border)"}}>
                      {tier.coverings.map((c,ci)=><div key={ci} style={{display:"flex",gap:8,marginBottom:3}}>
                        <span style={{color:"var(--muted)",minWidth:60,fontSize:12}}>Covering:</span>
                        <span style={{fontWeight:500}}>{c.type} — {c.grams}g</span>
                      </div>)}
                    </div>}
                  </div>)}
                </div>}

                {/* Donut details */}
                {isDonuts&&p.donutGroups?.length>0&&<div style={{marginBottom:8}}>
                  {p.donutGroups.map((g,gi)=><div key={gi} style={{background:"#F5F0E4",borderRadius:8,padding:"8px 10px",marginBottom:6,fontSize:12.5}}>
                    <div style={{fontWeight:600}}>{g.qty} × {g.flavour||"?"} donuts</div>
                    {g.filling&&<div style={{color:"var(--muted)"}}>Filling: {g.filling}{g.fillingGrams?" ("+g.fillingGrams+"g)":""}</div>}
                  </div>)}
                </div>}

                {/* Cake Loaf details */}
                {isLoaf&&p.loaves?.length>0&&<div style={{marginBottom:8}}>
                  {p.loaves.map((l,li)=><div key={li} style={{background:"#F5F0E4",borderRadius:8,padding:"8px 10px",marginBottom:6,fontSize:12.5}}>
                    <div style={{fontWeight:600}}>Loaf {li+1}: {l.flavour||"?"}</div>
                  </div>)}
                </div>}

                {/* Tart details */}
                {isTart&&<div style={{marginBottom:8}}>
                  <div style={{background:"#F5F0E4",borderRadius:8,padding:"8px 10px",marginBottom:6,fontSize:12.5}}>
                    <div style={{fontWeight:600}}>{p.tartQty||"?"} tart shells</div>
                    {p.tartFillings?.filter(f=>f.type).map((f,fi)=><div key={fi} style={{color:"var(--muted)"}}>Filling: {f.type}{f.grams?" ("+f.grams+"g)":""}</div>)}
                    {p.tartGarnish&&<div style={{color:"var(--muted)"}}>Garnish: {p.tartGarnish}</div>}
                  </div>
                </div>}

                {/* Fallback for old records */}
                {!p.tiers&&!p.donutGroups&&!p.loaves&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:8,fontSize:12.5,marginBottom:8}}>
                  {[{l:"Size",v:p.size||"—"},{l:"Flavour",v:p.flavor||p.flavors||"—"},{l:"Covering",v:p.covering||"—"},{l:"Layers",v:p.layers||"—"}].map(f=><div key={f.l}>
                    <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>{f.l}</div>
                    <div style={{fontWeight:500,color:"var(--text)"}}>{f.v}</div>
                  </div>)}
                </div>}

                <div style={{display:"flex",gap:12,fontSize:12,color:"var(--muted)",flexWrap:"wrap"}}>
                  <span>📅 Delivery: <strong>{p.deliveryDate||"—"}</strong></span>
                </div>
                {p.topper?.enabled&&<div style={{marginTop:8,fontSize:12.5,background:"#EDF4FF",padding:"8px 10px",borderRadius:6,border:"1px solid #C5D8F5"}}>
                  <div style={{fontWeight:600,marginBottom:3}}>✏️ Inscription / Topper</div>
                  {p.topper.description&&<div style={{color:"var(--text)"}}>{p.topper.description}</div>}
                </div>}
                {p.notes&&<div style={{marginTop:8,fontSize:12.5,background:"#FFF9EE",padding:"8px 10px",borderRadius:6,border:"1px solid #F0E0BB"}}>
                  <div style={{fontWeight:600,marginBottom:3}}>📝 Design & special requests</div>
                  <div style={{color:"var(--text)"}}>{p.notes}</div>
                </div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0}}>
                <select value={st} onChange={e=>setStatus(p.id,e.target.value)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid var(--border)",background:statusColor[st]||"var(--panel)",fontSize:12,color:"var(--text)",cursor:"pointer"}}>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In progress</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
                <div style={{fontSize:11,color:"var(--muted)"}}>Due {p.deliveryDate}</div>
              </div>
            </div>
          </Card>
        })}
        <div style={{padding:"10px 14px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,color:"var(--muted)",display:"flex",justifyContent:"space-between"}}>
          <span>{weekProds.length} order{weekProds.length!==1?"s":""} this week</span>
          <span>Pending: {weekProds.filter(p=>!statuses[p.id]||statuses[p.id]==="pending").length} · Ready: {weekProds.filter(p=>statuses[p.id]==="ready").length}</span>
        </div>
      </div>
    }
  </div>
}

// ═══════════════════════════════════════════════════════════
//  MONTHLY OVERVIEW (replaces Reports + Stock Statement)
// ═══════════════════════════════════════════════════════════
function MonthlyOverview({inventory,productions,expenses,company}){
  // Use confirmed quotes as primary revenue source
  const allRevenue=mergeRevenueSources(productions)

  const months=[...new Set([
    ...allRevenue.map(p=>p.deliveryDate?.slice(0,7)),
    ...expenses.map(e=>e.date?.slice(0,7)),
  ].filter(Boolean))].sort().reverse()
  const cur=new Date().toISOString().slice(0,7)
  const [sel,setSel]=useState(cur)
  const monthLabel=new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})

  // P&L calculations — from confirmed quotes
  const mRevenue=allRevenue.filter(p=>p.deliveryDate?.startsWith(sel))
  const paid=mRevenue.filter(p=>p.paymentType!=="gift"&&p.paymentType!=="sample")
  const rev=paid.reduce((s,p)=>s+(p.salePrice||0),0)
  const prodCost=mRevenue.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0)
  const mExp=expenses.filter(e=>e.date?.startsWith(sel)&&e.category!=="Ingredient costs"&&e.source!=="purchase")
  const overhead=mExp.reduce((s,e)=>s+(e.amount||0),0)
  const profit=rev-prodCost-overhead
  const margin=rev>0?Math.round((profit/rev)*100):0

  // Revenue by product type
  const byType=mRevenue.reduce((acc,p)=>{
    const t=p.productType||"Cake"
    if(!acc[t])acc[t]={qty:0,rev:0}
    acc[t].qty++;acc[t].rev+=(p.salePrice||0)
    return acc
  },{})

  // Purchases this month — from ll_purchases localStorage
  const getPurchases=()=>{try{return JSON.parse(localStorage.getItem("ll_purchases")||"[]")}catch{return[]}}
  const mPurchases=getPurchases().filter(p=>p.date?.startsWith(sel))
  const totalBought=mExp.filter(e=>e.category==="Ingredients"||e.source==="purchase"||e.source==="receipt").reduce((s,e)=>s+(e.amount||0),0)

  // Opening stock — from locked snapshot
  const getOS=()=>{try{const d=JSON.parse(localStorage.getItem("ll_os_"+sel)||"{}");return d.items||[]}catch{return[]}}
  const osItems=getOS()
  const getOSQty=id=>{const f=osItems.find(i=>i.id===id);return f?f.openingQty:0}

  // Bought per item from purchase log
  const getBought=id=>mPurchases.filter(p=>p.itemId===id).reduce((s,p)=>s+(p.stockAdded||0),0)

  // Download PDF
  const dl=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>Monthly Overview ${monthLabel}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:32px;max-width:800px;margin:0 auto}
    h1{font-size:22px;font-weight:700;color:${company?.primaryColor||"var(--gold)"}}
    h2{font-size:13px;color:#888;font-weight:400;margin:4px 0 20px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
    .card{border:1px solid #E0D3BB;border-radius:8px;padding:12px}
    .label{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888;margin-bottom:4px}
    .val{font-size:18px;font-weight:700;color:#291608}
    table{width:100%;border-collapse:collapse;margin:14px 0;font-size:13px}
    th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888;font-weight:500}
    td{padding:8px 10px;border-bottom:1px solid #E0D3BB}
    .total{background:#F5F0E4;font-weight:700}
    .sec{margin-top:24px;font-size:14px;font-weight:700;color:#291608;border-bottom:2px solid var(--gold);padding-bottom:4px;margin-bottom:10px}
    </style></head><body>
    ${company?.logo?`<img src="${company.logo}" style="height:50px;margin-bottom:10px;display:block"/>`:""}
    <h1>${company?.name||"Bakery"} — Monthly Overview</h1>
    <h2>${monthLabel}</h2>
    <div class="grid">
      <div class="card"><div class="label">Revenue</div><div class="val">₦${Math.round(rev).toLocaleString()}</div><div style="font-size:11px;color:#888;margin-top:3px">${paid.length} confirmed orders</div></div>
      <div class="card"><div class="label">Prod. cost</div><div class="val">₦${Math.round(prodCost).toLocaleString()}</div></div>
      <div class="card"><div class="label">Overheads</div><div class="val">₦${Math.round(overhead).toLocaleString()}</div></div>
      <div class="card"><div class="label">Net profit</div><div class="val" style="color:${profit>=0?"#357A52":"#B03A2E"}">₦${Math.round(profit).toLocaleString()}</div><div style="font-size:11px;color:#888;margin-top:3px">${margin}% margin</div></div>
    </div>
    <div class="sec">Confirmed Orders — Revenue</div>
    <table><tr><th>Delivery date</th><th>Client</th><th>Product</th><th>Ingredient cost</th><th style="text-align:right">Sale price</th></tr>
    ${mRevenue.map(p=>`<tr><td>${p.deliveryDate||p.orderDate||""}</td><td>${p.client||""}</td><td>${p.productType||"Cake"}${p.size?" — "+p.size:""}</td><td>₦${Math.round(p.cost||0).toLocaleString()}</td><td style="text-align:right;font-weight:600;color:#C8912A">₦${Math.round(p.salePrice||0).toLocaleString()}</td></tr>`).join("")}
    ${mRevenue.length===0?`<tr><td colspan="5" style="color:#888;font-style:italic;padding:12px">No confirmed orders this month</td></tr>`:""}
    <tr class="total"><td colspan="3" style="text-align:right">Total</td><td>₦${Math.round(prodCost).toLocaleString()}</td><td style="text-align:right">₦${Math.round(rev).toLocaleString()}</td></tr></table>
    <div class="sec">Stock Movement</div>
    <table><tr><th>Item</th><th>Unit</th><th>Opening</th><th>+ Bought</th><th>− Used</th><th>Closing</th><th>Value</th></tr>
    ${inventory.map(item=>{
      const opening=getOSQty(item.id)
      const bought=getBought(item.id)
      const closing=item.stock
      const used=Math.max(0,parseFloat((opening+bought-closing).toFixed(3)))
      return`<tr><td>${item.name}</td><td>${item.unit}</td><td>${opening}</td><td style="color:#357A52">+${bought}</td><td style="color:#B03A2E">−${used}</td><td><strong>${closing}</strong></td><td>₦${Math.round(closing*item.cost).toLocaleString()}</td></tr>`
    }).join("")}
    <tr class="total"><td colspan="6" style="text-align:right">Total closing stock value</td><td>₦${Math.round(inventory.reduce((s,i)=>s+i.stock*i.cost,0)).toLocaleString()}</td></tr></table>
    <div class="sec">Overhead Expenses</div>
    <table><tr><th>Date</th><th>Description</th><th>Category</th><th style="text-align:right">Amount</th></tr>
    ${mExp.map(e=>`<tr><td>${e.date||""}</td><td>${e.description||""}</td><td>${e.category||""}</td><td style="text-align:right">₦${Math.round(e.amount||0).toLocaleString()}</td></tr>`).join("")}
    <tr class="total"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">₦${Math.round(overhead).toLocaleString()}</td></tr></table>
    <p style="font-size:10px;color:#aaa;margin-top:24px">Generated by LayerLedger · ${new Date().toLocaleDateString()}</p>
    <script>window.print()<\/script></body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="Monthly Overview" sub="P&L · Stock movement · Purchases · Expenses — everything in one place"/>

    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13,color:"var(--text)"}}>
        {([...new Set([cur,...months])]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
      <Btn onClick={dl}>📥 Download PDF</Btn>
      {osItems.length===0&&<span style={{fontSize:12,color:"#B03A2E",background:"#FDEBE9",padding:"4px 10px",borderRadius:20}}>⚠ No opening stock set for {monthLabel} — go to Settings → Opening Stock</span>}
    </div>

    {/* P&L CARDS */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:16}}>
      {[
        {l:"Revenue",v:fmt(rev),s:`${paid.length} confirmed orders`,c:"var(--gold)"},
        {l:"Prod. cost",v:fmt(prodCost),s:"incl. delivery",c:"#2A5F9A"},
        {l:"Overheads",v:fmt(overhead),s:"non-ingredient",c:"var(--muted)"},
        {l:"Net profit",v:fmt(profit),s:`${margin}% margin`,c:profit>=0?"#357A52":"#B03A2E"},
      ].map(s=><Card key={s.l} style={{borderTop:`3px solid ${s.c}`,borderRadius:"0 0 12px 12px"}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.l}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:s.l==="Net profit"?s.c:"var(--text)"}}>{s.v}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.s}</div>
      </Card>)}
    </div>

    {/* CONFIRMED ORDERS — REVENUE */}
    <Card style={{padding:0,overflowX:"auto",marginBottom:14}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Confirmed orders — {monthLabel}</div>
        <div style={{fontSize:11.5,color:"var(--muted)"}}>{paid.length} order{paid.length!==1?"s":""} · Revenue: {fmt(rev)}</div>
      </div>
      {mRevenue.length===0
        ?<div style={{padding:"20px 16px",fontSize:13,color:"var(--muted)",textAlign:"center",fontStyle:"italic"}}>No confirmed orders for {monthLabel}. Confirm orders from the Quotes page to see revenue here.</div>
        :<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <TH cols={["Delivery date","Client","Product","Ingredient cost","Sale price","Profit"]}/>
          <tbody>{mRevenue.map((p,i)=>{
            const pProfit=(p.salePrice||0)-(p.cost||0)
            return <TR2 key={p.id} i={i} row={[
              <span>{p.deliveryDate||p.orderDate||"—"}</span>,
              <span style={{fontWeight:500}}>{p.client}</span>,
              <span style={{color:"var(--muted)"}}>{p.productType||"Cake"}{p.size?" — "+p.size:""}</span>,
              <span style={{color:"#2A5F9A"}}>{fmt(p.cost||0)}</span>,
              <span style={{fontWeight:600,color:"var(--gold)"}}>{fmt(p.salePrice||0)}</span>,
              <span style={{fontWeight:600,color:pProfit>=0?"#357A52":"#B03A2E"}}>{fmt(pProfit)}</span>,
            ]}/>
          })}</tbody>
          <tfoot><tr style={{background:"#F5F0E4"}}>
            <td colSpan={3} style={{padding:"10px",textAlign:"right",fontWeight:600,fontSize:13}}>Totals</td>
            <td style={{padding:"10px",fontWeight:600,color:"#2A5F9A"}}>{fmt(prodCost)}</td>
            <td style={{padding:"10px",fontWeight:700,color:"var(--gold)",fontSize:15}}>{fmt(rev)}</td>
            <td style={{padding:"10px",fontWeight:700,color:profit>=0?"#357A52":"#B03A2E",fontSize:15}}>{fmt(rev-prodCost)}</td>
          </tr></tfoot>
        </table>}
      {Object.keys(byType).length>1&&<div style={{padding:"10px 16px",borderTop:"1px solid var(--border)",display:"flex",gap:16,flexWrap:"wrap"}}>
        {Object.entries(byType).map(([type,data])=><span key={type} style={{fontSize:12,color:"var(--muted)"}}>{type}: <strong style={{color:"var(--gold)"}}>{fmt(data.rev)}</strong> ({data.qty} orders)</span>)}
      </div>}
    </Card>

    {/* STOCK MOVEMENT */}
    <Card style={{padding:0,overflowX:"auto",marginBottom:14}}>
      <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600}}>Stock movement — {monthLabel}</div>
        <div style={{fontSize:11.5,color:"var(--muted)"}}>Opening + Bought − Used = Closing</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <TH cols={["Item","Unit","Opening","+ Bought","− Used","Closing","Cost/unit","Value"]}/>
        <tbody>{inventory.map((item,i)=>{
          const opening=getOSQty(item.id)
          const bought=getBought(item.id)
          const closing=item.stock
          const used=Math.max(0,parseFloat((opening+bought-closing).toFixed(3)))
          const isLow=closing<=(item.minStock||5)
          return <TR2 key={item.id} i={i} row={[
            <span style={{fontWeight:500}}>{item.name}</span>,
            <span style={{color:"var(--muted)"}}>{item.unit}</span>,
            <span>{opening} {item.unit}</span>,
            <span style={{color:"#357A52",fontWeight:500}}>+{bought} {item.unit}</span>,
            <span style={{color:"#B03A2E"}}>−{used} {item.unit}</span>,
            <span style={{fontWeight:600,color:isLow?"#B03A2E":"#357A52"}}>{closing} {item.unit}{isLow?" ⚠":""}</span>,
            <span style={{color:"var(--gold)"}}>{fmt(item.cost)}/{item.unit}</span>,
            <span style={{fontWeight:500}}>{fmt(closing*item.cost)}</span>,
          ]}/>
        })}</tbody>
        <tfoot><tr style={{background:"#F5F0E4"}}>
          <td colSpan={7} style={{padding:"10px",textAlign:"right",fontWeight:600,fontSize:13}}>Total closing stock value</td>
          <td style={{padding:"10px",textAlign:"left",fontWeight:700,color:"var(--gold)",fontSize:15}}>{fmt(inventory.reduce((s,i)=>s+i.stock*i.cost,0))}</td>
        </tr></tfoot>
      </table>
      <div style={{padding:"8px 14px",fontSize:11.5,color:"var(--muted)",borderTop:"1px solid var(--border)"}}>
        Opening stock from Settings snapshot · Bought summed from all purchase records this month · Used = opening + bought − closing
      </div>
    </Card>

    {/* PURCHASES + EXPENSES SIDE BY SIDE */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Purchases this month</div>
        {mPurchases.length===0
          ?<div style={{fontSize:13,color:"var(--muted)"}}>No purchases logged for {monthLabel}.</div>
          :<>
            {Object.entries(mPurchases.reduce((acc,p)=>{
              if(!acc[p.item])acc[p.item]={count:0,total:0,qty:0,unit:p.unit}
              acc[p.item].count++; acc[p.item].total+=p.total||0; acc[p.item].qty+=p.stockAdded||0
              return acc
            },{})).map(([name,d],i)=><div key={name} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:12.5}}>
              <span>{name} <span style={{color:"var(--muted)",fontSize:11}}>×{d.count}</span></span>
              <div style={{textAlign:"right"}}><div style={{color:"#357A52",fontWeight:500}}>+{d.qty.toFixed(1)} {d.unit}</div><div style={{color:"var(--muted)",fontSize:11}}>{fmt(d.total)}</div></div>
            </div>)}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontWeight:600,fontSize:13}}>
              <span>Total spent on ingredients</span>
              <span style={{color:"var(--gold)"}}>{fmt(mPurchases.reduce((s,p)=>s+(p.total||0),0))}</span>
            </div>
          </>
        }
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Overhead expenses</div>
        {mExp.length===0
          ?<div style={{fontSize:13,color:"var(--muted)"}}>No overhead expenses for {monthLabel}.</div>
          :<>
            {mExp.slice(0,6).map((e,i)=><div key={e.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)",fontSize:12.5}}>
              <span style={{flex:1,marginRight:8}}>{e.description||e.category}</span>
              <span style={{color:"var(--muted)",flexShrink:0}}>{fmt(e.amount||0)}</span>
            </div>)}
            {mExp.length>6&&<div style={{fontSize:11.5,color:"var(--muted)",marginTop:4}}>+{mExp.length-6} more expenses</div>}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontWeight:600,fontSize:13}}>
              <span>Total overheads</span>
              <span style={{color:"var(--gold)"}}>{fmt(overhead)}</span>
            </div>
          </>
        }
      </Card>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  NOTIFICATION SETTINGS HELPERS
// ═══════════════════════════════════════════════════════════
function NToggle({on,onToggle}){
  return <div onClick={onToggle} style={{width:38,height:21,borderRadius:11,background:on?"#357A52":"var(--border)",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
    <div style={{width:17,height:17,borderRadius:"50%",background:"white",position:"absolute",top:2,left:on?19:2,transition:"left 0.2s"}}/>
  </div>
}
function NRow({title,sub,on,onToggle}){
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid var(--border)"}}>
    <div style={{flex:1,paddingRight:16}}>
      <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{title}</div>
      <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2,lineHeight:1.5}}>{sub}</div>
    </div>
    <NToggle on={on} onToggle={onToggle}/>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  NOTIFICATION SETTINGS
// ═══════════════════════════════════════════════════════════
function NotificationSettings(){
  const load=(key,def)=>{const v=localStorage.getItem(key);return v===null?def:v==="true"?true:v==="false"?false:v}
  const [notifEnabled,setNotifEnabled]=useState(()=>load("ll_notif_enabled",true))
  const [autoStock,setAutoStock]=useState(()=>load("ll_auto_stock",true))
  const [lowStockAlert,setLowStockAlert]=useState(()=>load("ll_lowstock_alert",true))
  const [notifDays,setNotifDays]=useState(()=>load("ll_notif_days","2"))
  const [saved,setSaved]=useState(false)

  const save=()=>{
    localStorage.setItem("ll_notif_enabled",notifEnabled)
    localStorage.setItem("ll_auto_stock",autoStock)
    localStorage.setItem("ll_lowstock_alert",lowStockAlert)
    localStorage.setItem("ll_notif_days",notifDays)
    setSaved(true);setTimeout(()=>setSaved(false),2500)
  }

  return <div style={{maxWidth:540}}>
    <Card style={{marginBottom:14}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Notification Preferences</div>

      <PLRow title="Month-end reminder banner" sub="Shows on the dashboard in the last days of each month reminding you to lock closing stock." on={notifEnabled} onToggle={()=>setNotifEnabled(v=>!v)}/>
      <PLRow title="Auto-set opening stock on the 1st" sub="Automatically locks current stock as the new month's opening stock at midnight on the 1st. After first-time setup you never have to do this manually again." on={autoStock} onToggle={()=>setAutoStock(v=>!v)}/>
      <PLRow title="Low stock alerts on dashboard" sub="Shows a warning card on the dashboard whenever any ingredient falls below its minimum stock level." on={lowStockAlert} onToggle={()=>setLowStockAlert(v=>!v)}/>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0"}}>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>Start reminding me how many days before month end</div>
          <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>How early the reminder banner starts appearing</div>
        </div>
        <select value={notifDays} onChange={e=>setNotifDays(e.target.value)} style={{...iSt,width:100,flexShrink:0}}>
          {["1","2","3","5","7"].map(d=><option key={d} value={d}>{d} day{d!=="1"?"s":""}</option>)}
        </select>
      </div>

      <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)",display:"flex",gap:10,alignItems:"center"}}>
        <Btn onClick={save}>Save preferences</Btn>
        {saved&&<span style={{fontSize:12.5,color:"#357A52"}}>✓ Saved</span>}
      </div>
    </Card>

    <Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>How the month-end flow works</div>
      <div style={{fontSize:12.5,color:"var(--muted)",lineHeight:1.8}}>
        {[
          "On the 29th/30th — amber reminder banner appears on your dashboard",
          "On the last day — banner turns red and more urgent",
          "At midnight on the 1st — app automatically locks closing stock as next month's opening stock",
          "On the 1st when you open the app — green confirmation banner, previous month's statement ready to download",
          "You never have to set opening stock manually again after the first time"
        ].map((s,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
          <span style={{color:"var(--gold)",fontWeight:700,flexShrink:0}}>{i+1}.</span>
          <span>{s}</span>
        </div>)}
      </div>
    </Card>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  OPENING STOCK TAB (in Settings)
// ═══════════════════════════════════════════════════════════
function OpeningStockTab({inventory}){
  const LS_KEY="ll_opening_stock"
  const loadOS=()=>{try{return JSON.parse(localStorage.getItem(LS_KEY)||"{}")}catch{return{}}}
  const [os,setOs]=useState(loadOS)
  const [saved,setSaved]=useState(false)
  const curMonth=new Date().toLocaleDateString("en-NG",{month:"long",year:"numeric"})

  const updateOS=(id,val)=>{
    const updated={...os,[id]:parseFloat(val)||0}
    setOs(updated)
    localStorage.setItem(LS_KEY,JSON.stringify(updated))
    setSaved(false)
  }

  const lockStock=()=>{
    // Save with month key so it's permanent for this month
    const monthKey="ll_os_"+new Date().toISOString().slice(0,7)
    const snapshot={date:new Date().toISOString(),items:inventory.map(i=>({id:i.id,name:i.name,unit:i.unit,openingQty:os[i.id]||0,cost:i.cost}))}
    localStorage.setItem(monthKey,JSON.stringify(snapshot))
    setSaved(true)
  }

  return <div style={{maxWidth:640}}>
    <Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:8}}>Opening Stock — {curMonth}</div>
      <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,lineHeight:1.7,marginBottom:12}}>Set this once at the start of each month — or when you first set up the app. Once locked, this record never changes. It is used to generate your monthly stock statement automatically.</p>
      <div style={{padding:"8px 12px",background:"#FFF3CD",borderRadius:7,fontSize:12,color:"#856404",marginBottom:14}}>⚠ Set opening stock at the beginning of each month before production starts. Once you lock it, it becomes a permanent record for that month.</div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#EDE5D6"}}>
            {["Item","Unit","Opening Stock Qty","Cost/Unit","Opening Value"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:h==="Item"||h==="Unit"?"left":"right",fontSize:10,textTransform:"uppercase",letterSpacing:.8,color:"var(--muted)",fontWeight:500}}>{h}</th>)}
          </tr></thead>
          <tbody>{inventory.map((item,i)=>{
            const qty=os[item.id]||0
            return <tr key={item.id} style={{background:i%2===0?"var(--panel)":"#F8F3EA"}}>
              <td style={{padding:"8px 10px",fontWeight:500}}>{item.name}</td>
              <td style={{padding:"8px 10px",color:"var(--muted)"}}>{item.unit}</td>
              <td style={{padding:"8px 10px",textAlign:"right"}}>
                <input type="number" value={qty||""} onChange={e=>updateOS(item.id,e.target.value)} placeholder="0" style={{...iSt,width:90,padding:"4px 8px",fontSize:13,textAlign:"right"}}/>
              </td>
              <td style={{padding:"8px 10px",textAlign:"right",color:"var(--gold)",fontWeight:500}}>{fmt(item.cost)}/{item.unit}</td>
              <td style={{padding:"8px 10px",textAlign:"right",color:"var(--muted)",fontSize:12}}>{fmt(qty*item.cost)}</td>
            </tr>
          })}</tbody>
          <tfoot><tr>
            <td colSpan={4} style={{padding:"10px",textAlign:"right",fontWeight:600,fontSize:13}}>Total opening stock value</td>
            <td style={{padding:"10px",textAlign:"right",fontWeight:700,color:"var(--gold)",fontSize:15}}>{fmt(inventory.reduce((s,i)=>s+(os[i.id]||0)*i.cost,0))}</td>
          </tr></tfoot>
        </table>
      </div>
      <div style={{marginTop:14,display:"flex",gap:10,alignItems:"center"}}>
        <Btn variant="success" onClick={lockStock}>🔒 Lock Opening Stock for {curMonth}</Btn>
        {saved&&<span style={{fontSize:12.5,color:"#357A52",fontWeight:500}}>✓ Opening stock locked and saved permanently</span>}
      </div>
    </Card>
    <Card>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:8}}>How this works</div>
      <div style={{fontSize:12.5,color:"var(--muted)",lineHeight:1.8}}>
        <div style={{marginBottom:6}}>1. On the first day of each month, enter your stock quantities above</div>
        <div style={{marginBottom:6}}>2. Click Lock — this saves a permanent snapshot for that month</div>
        <div style={{marginBottom:6}}>3. As you bake, stock reduces automatically from production orders</div>
        <div style={{marginBottom:6}}>4. Purchases from receipts add back to stock automatically</div>
        <div>5. At month end, go to Reports → Stock Statement to see your full monthly movement</div>
      </div>
    </Card>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  STOCK STATEMENT (monthly — added to Reports)
// ═══════════════════════════════════════════════════════════
function StockStatement({inventory,productions,expenses,company}){
  const allMonths=[...new Set(productions.map(p=>p.deliveryDate?.slice(0,7)).filter(Boolean))].sort().reverse()
  const cur=new Date().toISOString().slice(0,7)
  const [sel,setSel]=useState(allMonths[0]||cur)

  const monthLabel=sel?new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"}):""

  // Load opening stock snapshot for this month
  const getOS=()=>{try{const d=JSON.parse(localStorage.getItem("ll_os_"+sel)||"{}");return d.items||[]}catch{return[]}}
  const osItems=getOS()
  const getOSQty=(id)=>{const found=osItems.find(i=>i.id===id);return found?found.openingQty:0}

  // Calculate purchased this month from expenses
  const monthExp=expenses.filter(e=>e.date?.startsWith(sel)&&e.source==="receipt")
  const totalPurchased=monthExp.reduce((s,e)=>s+(e.amount||0),0)

  // Calculate used in production this month per item
  // We track this from production records — total cost used
  const monthProds=productions.filter(p=>p.deliveryDate?.startsWith(sel))
  const totalUsedValue=monthProds.reduce((s,p)=>s+(p.cost||0),0)

  const dl=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>Stock Statement ${monthLabel}</title><style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px;max-width:780px;margin:0 auto}
    h1{font-size:20px;font-weight:700;color:${company.primaryColor||"var(--gold)"}}h2{font-size:13px;color:#888;font-weight:normal;margin:4px 0 20px}
    table{width:100%;border-collapse:collapse;margin:14px 0}th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#888;font-weight:500}
    td{padding:8px 10px;border-bottom:1px solid #E0D3BB;font-size:13px}.right{text-align:right}.total{font-weight:bold;background:#F5F0E4}
    .summary{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}.scard{border:1px solid #E0D3BB;border-radius:8px;padding:12px}
    .slabel{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}.sval{font-size:18px;font-weight:bold;color:${company.primaryColor||"var(--gold)"}}
    @media print{button{display:none}}</style></head><body>
    ${company.logo?`<img src="${company.logo}" style="height:50px;margin-bottom:10px;display:block"/>`:""}
    <h1>${company.name||"Bakery"} — Monthly Stock Statement</h1><h2>${monthLabel}</h2>
    <div class="summary">
      <div class="scard"><div class="slabel">Total purchased</div><div class="sval">₦${Math.round(totalPurchased).toLocaleString()}</div></div>
      <div class="scard"><div class="slabel">Used in production</div><div class="sval">₦${Math.round(totalUsedValue).toLocaleString()}</div></div>
      <div class="scard"><div class="slabel">Production orders</div><div class="sval">${monthProds.length}</div></div>
    </div>
    <table><tr><th>Item</th><th>Unit</th><th class="right">Opening stock</th><th class="right" style="color:#1D9E75">+ Purchased</th><th class="right" style="color:#B03A2E">− Used</th><th class="right">Closing stock</th><th class="right">Cost/unit</th></tr>
    ${inventory.map(item=>{
      const opening=getOSQty(item.id)
      const closing=item.stock
      const used=Math.max(0,opening-closing)
      return`<tr><td>${item.name}</td><td>${item.unit}</td><td class="right">${opening} ${item.unit}</td><td class="right" style="color:#1D9E75">see receipts</td><td class="right" style="color:#B03A2E">−${used.toFixed(2)} ${item.unit}</td><td class="right"><strong>${closing} ${item.unit}</strong></td><td class="right">₦${Math.round(item.cost).toLocaleString()}</td></tr>`
    }).join("")}
    <tr class="total"><td colspan="5" class="right">Total closing stock value</td><td class="right" colspan="2" style="color:${company.primaryColor||"var(--gold)"};font-size:15px">₦${Math.round(inventory.reduce((s,i)=>s+i.stock*i.cost,0)).toLocaleString()}</td></tr></table>
    <p style="font-size:11px;color:#aaa;margin-top:24px">Generated by LayerLedger · ${new Date().toLocaleDateString()}</p>
    <script>window.print()<\/script></body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="Monthly Stock Statement" sub="Auto-generated from opening stock, purchases, and production deductions."/>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,flexWrap:"wrap"}}>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13,color:"var(--text)"}}>
        {(allMonths.length?allMonths:[cur]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
      <Btn onClick={dl} variant="outline">📥 Download PDF</Btn>
    </div>

    {osItems.length===0&&<Alert msg={`No opening stock locked for ${monthLabel}. Go to Settings → Opening Stock to set it.`} color="gold"/>}

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
      {[{l:"Total Purchased",v:fmt(totalPurchased),s:"from receipts this month",c:"#357A52"},
        {l:"Used in Production",v:fmt(totalUsedValue),s:`${monthProds.length} orders`,c:"#B03A2E"},
        {l:"Closing Stock Value",v:fmt(inventory.reduce((s,i)=>s+i.stock*i.cost,0)),s:"current live value",c:"var(--gold)"}
      ].map(s=><Card key={s.l}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{s.l}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.s}</div></Card>)}
    </div>

    <Card style={{padding:0,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <TH cols={["Item","Unit","Opening stock","− Used in prod.","Closing stock","Cost/unit","Closing value"]}/>
        <tbody>{inventory.map((item,i)=>{
          const opening=getOSQty(item.id)
          const closing=item.stock
          const used=Math.max(0,parseFloat((opening-closing).toFixed(3)))
          return <TR2 key={item.id} i={i} row={[
            <span style={{fontWeight:500}}>{item.name}</span>,
            <span style={{color:"var(--muted)"}}>{item.unit}</span>,
            <span>{opening} {item.unit}</span>,
            <span style={{color:"#B03A2E"}}>−{used} {item.unit}</span>,
            <span style={{fontWeight:600,color:closing<=(item.minStock||5)?"#B03A2E":"#357A52"}}>{closing} {item.unit}</span>,
            <span style={{color:"var(--gold)"}}>{fmt(item.cost)}/{item.unit}</span>,
            <span style={{fontWeight:500}}>{fmt(closing*item.cost)}</span>,
          ]}/>
        })}</tbody>
        <tfoot><tr style={{background:"#F5F0E4"}}>
          <td colSpan={6} style={{padding:"10px",textAlign:"right",fontWeight:700,fontSize:13}}>Total closing stock value</td>
          <td style={{padding:"10px",textAlign:"left",fontWeight:700,color:"var(--gold)",fontSize:15}}>{fmt(inventory.reduce((s,i)=>s+i.stock*i.cost,0))}</td>
        </tr></tfoot>
      </table>
    </Card>
    <div style={{marginTop:10,fontSize:11.5,color:"var(--muted)",lineHeight:1.7}}>Opening stock is locked in Settings → Opening Stock at the start of each month. Closing stock is the live current quantity. Used in production is calculated as opening − closing.</div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS (separate page)
// ═══════════════════════════════════════════════════════════
function Settings({company,setCompany,settings,setSettings,users,setUsers,inventory}){
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
    <Tabs tabs={[{v:"company",l:"Company"},{v:"pricing",l:"Pricing & Margins"},{v:"stock",l:"Opening Stock"},{v:"notifications",l:"Notifications"},{v:"users",l:"Users & Access"}]} active={tab} onChange={setTab}/>

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
          <div><label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Primary Color</label><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={company.primaryColor||"var(--gold)"} onChange={e=>co("primaryColor",e.target.value)} style={{width:38,height:34,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/><span style={{fontSize:12,color:"var(--muted)"}}>{company.primaryColor}</span></div></div>
          <div><label style={{fontSize:10.5,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Sidebar Color</label><div style={{display:"flex",gap:8,alignItems:"center"}}><input type="color" value={company.sidebarColor||"var(--sidebar)"} onChange={e=>co("sidebarColor",e.target.value)} style={{width:38,height:34,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/><span style={{fontSize:12,color:"var(--muted)"}}>{company.sidebarColor}</span></div></div>
        </div>
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>🔑 AI Features — API Key</div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:12,lineHeight:1.7}}>
          LayerLedger uses AI to scan receipts, read bank statements, and generate smart reports. To enable these features, enter your Anthropic API key below. The key is stored only on this device and never shared.
          <br/><strong style={{color:"var(--gold)"}}>Get your key at: console.anthropic.com → API Keys</strong>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <div style={{flex:1}}>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Anthropic API Key</label>
            <input
              type="password"
              defaultValue={localStorage.getItem("ll_anthropic_key")||""}
              onChange={e=>localStorage.setItem("ll_anthropic_key",e.target.value.trim())}
              placeholder="sk-ant-api03-..."
              style={{...iSt,fontFamily:"monospace",fontSize:13}}
            />
          </div>
          <Btn onClick={async()=>{
            const key=localStorage.getItem("ll_anthropic_key")||""
            if(!key){alert("Please enter your API key first.");return}
            try{
              const r=await fetch("/.netlify/functions/claude",{method:"POST",headers:{"Content-Type":"application/json","x-ll-key":key},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:10,messages:[{role:"user",content:"hi"}]})})
              const d=await r.json()
              if(d.error)alert("❌ Key invalid: "+d.error.message)
              else alert("✅ API key is working correctly!")
            }catch(e){alert("❌ Could not connect: "+e.message)}
          }}>Test Key</Btn>
        </div>
        {localStorage.getItem("ll_anthropic_key")&&<div style={{marginTop:8,fontSize:12,color:"#357A52"}}>✓ API key is saved on this device</div>}
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Invoice Template</div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:12}}>Choose a layout for your client invoices and quotes. All templates use your brand colour and logo.</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {[
            {id:"classic",label:"Classic",desc:"Traditional letterhead style"},
            {id:"modern",label:"Modern",desc:"Clean with bold header"},
            {id:"minimal",label:"Minimal",desc:"Simple and uncluttered"},
            {id:"elegant",label:"Elegant",desc:"Serif fonts, refined layout"},
            {id:"bold",label:"Bold",desc:"Strong colours, high impact"},
          ].map(t=><div key={t.id} onClick={()=>co("invoiceTemplate",t.id)} style={{padding:"10px 8px",borderRadius:8,border:`2px solid ${(company.invoiceTemplate||"classic")===t.id?"var(--gold)":"var(--border)"}`,background:(company.invoiceTemplate||"classic")===t.id?"#FFF9EE":"var(--panel)",cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:(company.invoiceTemplate||"classic")===t.id?"var(--gold)":"var(--text)",marginBottom:3}}>{t.label}</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>{t.desc}</div>
          </div>)}
        </div>
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Invoice Footer Note</div>
        <textarea value={company.invoiceFooter||""} onChange={e=>co("invoiceFooter",e.target.value)} placeholder="e.g. Thank you for choosing Fayvouree Cakes!" style={{...iSt,minHeight:70,resize:"vertical"}}/>
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Bank / Payment Details</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,marginBottom:12}}>Appears on all invoices. Set once here.</p>
        <Inp label="Bank name" value={company.bankName||''} onChange={v=>co("bankName",v)} placeholder="e.g. GTBank"/>
        <Inp label="Account number" value={company.bankAccount||''} onChange={v=>co("bankAccount",v)} placeholder="0123456789"/>
        <Inp label="Account name" value={company.bankAccountName||''} onChange={v=>co("bankAccountName",v)} placeholder="Fayvouree Luxe Cakes"/>
      </Card>
    </div>}

    {tab==="pricing"&&<PricingSetup settings={settings} setSetting={st}/>}

    {tab==="stock"&&<OpeningStockTab inventory={inventory}/>}
    {tab==="notifications"&&<NotificationSettings/>}

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
          <tbody>{users.map((u,i)=><UserRow key={u.id} u={u} i={i} updatePin={updatePin} toggleUser={toggleUser} deleteUser={deleteUser}/>)}</tbody>
        </table>
      </div>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  ORDER CALCULATOR
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
//  QUOTES PAGE
// ═══════════════════════════════════════════════════════════
const QUOTE_STATUSES=[
  {v:"pending",l:"Pending",c:"#BA7517",bg:"#FAEEDA"},
  {v:"approved",l:"Approved",c:"#085041",bg:"#E1F5EE"},
]

const loadQuotes=()=>{try{return JSON.parse(localStorage.getItem("ll_quotes")||"[]")}catch{return[]}}
const saveQuotes=(q)=>{try{localStorage.setItem("ll_quotes",JSON.stringify(q))}catch{}}

function QuotesPage({inventory,setInventory,recipes,setView,productions,setProductions}){
  const [quotes,setQuotes]=useState(loadQuotes)
  const [filter,setFilter]=useState("all")
  const [expanded,setExpanded]=useState(null)

  const updateStatus=(id,status)=>{
    const updated=quotes.map(q=>q.id===id?{...q,status}:q)
    setQuotes(updated); saveQuotes(updated)
  }
  const deleteQuote=(id)=>{
    if(!confirm("Delete this quote?"))return
    const updated=quotes.filter(q=>q.id!==id)
    setQuotes(updated); saveQuotes(updated)
  }
  const confirmOrder=(q)=>{
    // 1. Check stock levels first
    const outOfStock=[]
    const lowStock=[]
    try{
      const mults=JSON.parse(localStorage.getItem("ll_multipliers")||"{}")
      const checkInv=[...inventory]
      if(q.tiers?.length>0){
        q.tiers.forEach(tier=>{
          const size=String(tier.size).replace(/"/g,"").trim()
          const shape=(tier.shape||"round").toLowerCase()
          const mult=mults[size+"-"+shape]||1
          tier.layers?.forEach(layer=>{
            if(!layer.flavour)return
            const recipe=recipes.find(r=>r.name.toLowerCase().includes(layer.flavour.toLowerCase()))
            if(!recipe)return
            recipe.ing?.forEach(ing=>{
              const item=checkInv.find(i=>i.id===ing.iid)
              if(!item)return
              const needed=ing.qty*mult
              if(item.stock<=0){if(!outOfStock.find(x=>x.name===item.name))outOfStock.push({name:item.name,stock:item.stock,unit:item.unit})}
              else if(item.stock<=(item.minStock||0)){if(!lowStock.find(x=>x.name===item.name))lowStock.push({name:item.name,stock:item.stock,min:item.minStock,unit:item.unit})}
            })
          })
        })
      }
    }catch(e){console.error("Stock check error",e)}

    // Block if anything is completely out of stock
    if(outOfStock.length>0){
      alert("❌ Cannot confirm order — the following ingredients are completely out of stock:\n\n"+outOfStock.map(i=>"• "+i.name+" (0 "+i.unit+" remaining)").join("\n")+"\n\nPlease restock before confirming.")
      return
    }

    // Warn if anything is below minimum but allow proceeding
    if(lowStock.length>0){
      const proceed=window.confirm("⚠️ Warning — the following ingredients are below minimum stock:\n\n"+lowStock.map(i=>"• "+i.name+" ("+i.stock+" "+i.unit+" left, min: "+i.min+" "+i.unit+")").join("\n")+"\n\nYou can still confirm but please restock soon.\n\nClick OK to confirm anyway, or Cancel to go back.")
      if(!proceed)return
    }

    // 2. Deduct ingredients from inventory
    try{
      const mults=JSON.parse(localStorage.getItem("ll_multipliers")||"{}")
      let updInv=[...inventory]
      if(updInv.length>0&&q.tiers?.length>0){
        q.tiers.forEach(tier=>{
          const size=String(tier.size).replace(/"/g,"").trim()
          const shape=(tier.shape||"round").toLowerCase()
          const mult=mults[size+"-"+shape]||1
          tier.layers?.forEach(layer=>{
            if(!layer.flavour)return
            const recipe=recipes.find(r=>r.name.toLowerCase().includes(layer.flavour.toLowerCase()))
            if(!recipe)return
            recipe.ing?.forEach(ing=>{
              const idx=updInv.findIndex(i=>i.id===ing.iid)
              if(idx>=0){updInv[idx]={...updInv[idx],stock:Math.max(0,parseFloat((updInv[idx].stock-(ing.qty*mult)).toFixed(3)))}}
            })
          })
        })
        setInventory(updInv)
        saveInventory(updInv)
      }
    }catch(e){console.error("Ingredient deduction error",e)}

    // 3. Create production record with full details
    const prod={
      id:uid(),
      quoteId:q.id,
      fromQuote:true,
      client:q.clientName,clientPhone:q.clientPhone||"",clientEmail:"",
      orderDate:q.date,deliveryDate:q.deliveryDate||"",
      cost:q.totalCost||0,deliveryCost:0,
      salePrice:q.salePrice||q.quotePrice||0,
      status:"pending",
      productType:q.productType||"Cake",
      size:q.tiers?.map(t=>t.size+'" '+t.shape).join(" + ")||"",
      covering:q.tiers?.[0]?.coverings?.[0]?.type||"",
      flavors:q.flavourSummary||"",
      cakeSummary:q.cakeSummary||"",
      tiers:q.tiers||[],
      cakePhoto:q.cakePhoto||null,
      topper:q.topper||null,
      donutGroups:q.donutGroups||[],
      loaves:q.loaves||[],
      tartQty:q.tartQty||0,
      tartFillings:q.tartFillings||[],
      tartGarnish:q.tartGarnish||"",
      decorations:q.decQty?Object.keys(q.decQty).join(", "):"",
      layers:q.tiers?.length||1,
      accessoryPct:10,profitPct:q.margin||40,
      paymentType:"full",discountPct:0,notes:q.notes||"",
      recipeId:""
    }
    setProductions(prev=>[prod,...prev])
    saveProduction(prod)

    // 4. Update quote status to approved and mark as confirmed
    const updated=quotes.map(x=>x.id===q.id?{...x,status:"approved",confirmedAt:new Date().toISOString()}:x)
    setQuotes(updated);saveQuotes(updated)
    alert("✓ Order confirmed for "+q.clientName+"! Ingredients deducted and order added to Production List.")
  }

  const filtered=filter==="all"?quotes:quotes.filter(q=>q.status===filter)
  const pendingCount=quotes.filter(q=>q.status==="pending").length

  return <div>
    <SHead title="Quotes" sub="All client quotes — track status and convert approved quotes to production orders"/>

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[{v:"all",l:"All quotes"},{v:"pending",l:`Pending (${pendingCount})`},{v:"approved",l:"Approved"}].map(f=>
          <button key={f.v} onClick={()=>setFilter(f.v)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filter===f.v?"var(--gold)":"var(--border)"}`,background:filter===f.v?"var(--gold)":"transparent",color:filter===f.v?"#fff":"var(--muted)",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{f.l}</button>
        )}
      </div>
      <Btn onClick={()=>setView("calculator")}>+ New quote</Btn>
    </div>

    {filtered.length===0
      ?<Card style={{textAlign:"center",padding:40}}>
          <div style={{fontSize:24,marginBottom:10}}>💬</div>
          <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>{filter==="all"?"No quotes yet":"No "+filter+" quotes"}</div>
          <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Use the Order Calculator to generate a quote for a client.</div>
          <Btn onClick={()=>setView("calculator")}>Open Order Calculator</Btn>
        </Card>
      :<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(q=>{
          const st=QUOTE_STATUSES.find(s=>s.v===(q.status||"pending"))||QUOTE_STATUSES[0]
          const isExp=expanded===q.id
          return <Card key={q.id} style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",cursor:"pointer"}} onClick={()=>setExpanded(isExp?null:q.id)}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600}}>{q.clientName||"Unknown client"}</div>
                  <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,background:st.bg,color:st.c,fontWeight:500}}>{st.l}</span>
                </div>
                <div style={{fontSize:12,color:"var(--muted)"}}>{q.cakeSummary||"Cake order"} · {q.date}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"var(--gold)"}}>{fmt(q.salePrice||q.quotePrice||0)}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Suggested: {fmt(q.quotePrice||0)}</div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Cost: {fmt(q.totalCost||0)}</div>
              </div>
              <span style={{fontSize:12,color:"var(--muted)"}}>{isExp?"▲":"▼"}</span>
            </div>

            {isExp&&<div style={{borderTop:"1px solid var(--border)",padding:"12px 16px"}}>
              {/* Quote details */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Order details</div>
                <div style={{fontSize:12.5,lineHeight:1.8}}>
                  <div><span style={{color:"var(--muted)"}}>Phone: </span>{q.clientPhone||"—"}</div>
                  <div><span style={{color:"var(--muted)"}}>Delivery date: </span>{q.deliveryDate||"—"}</div>
                  <div><span style={{color:"var(--muted)"}}>Product: </span>{q.productType||"Cake"}</div>
                  {q.tiers?.map((t,i)=><div key={i}><span style={{color:"var(--muted)"}}>Tier {i+1}: </span>{t.size}" {t.shape} · {t.layers?.map(l=>l.flavour).filter(Boolean).join(", ")||"—"}{t.coverings?.length?" · "+t.coverings.map(c=>c.type).join("+"):""}</div>)}
                  {q.accRows?.length>0&&<div><span style={{color:"var(--muted)"}}>Accessories: </span>{q.accRows.map(a=>a.type).join(", ")}</div>}
                  <div><span style={{color:"var(--muted)"}}>Notes: </span>{q.notes||"—"}</div>
                </div>
              </div>

              {/* Status update */}
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:10}}>
                <span style={{fontSize:12,color:"var(--muted)"}}>Update status:</span>
                {QUOTE_STATUSES.map(s=><button key={s.v} onClick={()=>updateStatus(q.id,s.v)} style={{padding:"4px 12px",borderRadius:20,border:`1px solid ${s.c}`,background:q.status===s.v?s.bg:"transparent",color:s.c,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:q.status===s.v?600:400}}>{s.l}</button>)}
              </div>

              {/* Actions */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                {q.confirmedAt
                  ?<div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{background:"#E1F5EE",color:"#357A52",padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600}}>✓ Confirmed {new Date(q.confirmedAt).toLocaleDateString("en-NG")}</span>
                    <span style={{fontSize:11,color:"var(--muted)"}}>Edit and re-confirm are locked to protect inventory and financials.</span>
                  </div>
                  :<>
                    {(q.status==="approved"||q.status==="pending")&&<Btn small variant="success" onClick={()=>confirmOrder(q)}>✓ Confirm order</Btn>}
                    <Btn small variant="ghost" onClick={()=>{localStorage.setItem("ll_calc_edit",JSON.stringify(q));setView("calculator")}}>✏ Edit quote</Btn>
                  </>
                }
                <button onClick={()=>{
                  // Build and show invoice
                  const co=loadCompany()
                  const trs=q.tiers||[]
                  const invoiceNum="INV-"+q.id.slice(-6).toUpperCase()
                  const tmpl=co.invoiceTemplate||"classic"
                  const gold=co.primaryColor||"#C8912A"
                  // Template-specific styles
                  const tmplStyles={
                    classic:`body{font-family:Arial,sans-serif}.header{border-bottom:3px solid ${gold};padding-bottom:16px;margin-bottom:24px}.inv-badge{background:#F5F0E4;padding:8px 14px;border-radius:6px;display:inline-block}`,
                    modern:`body{font-family:'Helvetica Neue',Arial,sans-serif}.header{background:${gold};color:#fff;padding:24px;margin:-36px -36px 24px;border-radius:0}.header .cn{color:#fff!important}.header .sub{color:rgba(255,255,255,0.8)}.inv-badge{background:rgba(255,255,255,0.2);padding:8px 14px;border-radius:6px;display:inline-block;color:#fff}`,
                    minimal:`body{font-family:'Helvetica Neue',Arial,sans-serif;color:#333}.header{margin-bottom:32px;border-bottom:1px solid #eee;padding-bottom:16px}.tier{border-left:2px solid ${gold}!important}.inv-badge{font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase}`,
                    elegant:`body{font-family:Georgia,serif;color:#2a1a0a}.header{text-align:center;border-bottom:1px solid ${gold};padding-bottom:20px;margin-bottom:28px}.cn{font-family:'Playfair Display',Georgia,serif!important;font-size:26px!important}.inv-badge{border:1px solid ${gold};padding:6px 16px;border-radius:0;display:inline-block;font-style:italic;color:${gold};font-size:12px}`,
                    bold:`body{font-family:Arial,sans-serif}.header{background:#1a1a1a;color:#fff;padding:24px 28px;margin:-36px -36px 24px}.header .cn{color:${gold}!important;font-size:26px!important}.header .sub{color:#aaa}.inv-badge{background:${gold};color:#fff;padding:8px 16px;border-radius:4px;display:inline-block;font-weight:bold}`,
                  }[tmpl]||""
                  const html="<!DOCTYPE html><html><head><title>"+invoiceNum+"</title>"
                    +"<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:36px;max-width:680px;margin:0 auto}"
                    +"h1{font-size:24px;font-weight:700;color:"+gold+"}.sub{font-size:12px;color:#888;margin-bottom:20px}"
                    +".row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #F0EBE3;font-size:13px}"
                    +".tier{background:#FFF9EE;border-left:3px solid "+gold+";padding:10px 12px;margin-bottom:8px;border-radius:0 6px 6px 0}"
                    +".price-box{background:#F5F0E4;border-radius:8px;padding:16px;text-align:center;margin:20px 0}"
                    +".bank{background:#E8EFFC;border-radius:8px;padding:14px;margin:16px 0}"
                    +".terms{font-size:11px;color:#888;margin-top:16px;line-height:1.8;border-top:1px solid #E0D3BB;padding-top:12px}"
                    +"@media print{.no-print{display:none}}"
                    +tmplStyles
                    +"</style></head><body>"
                    +"<div style='display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px'>"
                    +"<div><h1>"+(co.name||"Fayvouree Cakes")+"</h1>"
                    +"<div class='sub'>"+(co.address||"")+(co.phone?" · "+co.phone:"")+(co.email?" · "+co.email:"")+"</div></div>"
                    +"<div style='text-align:right'><div style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px'>Invoice</div>"
                    +"<div style='font-size:20px;font-weight:700;color:var(--gold)'>"+invoiceNum+"</div>"
                    +"<div style='font-size:12px;color:#888'>Date: "+q.date+"</div></div></div>"
                    +"<div style='margin-bottom:18px;padding:12px 14px;background:#F5F0E4;border-radius:8px'>"
                    +"<div style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px'>Bill to</div>"
                    +"<div style='font-size:15px;font-weight:700'>"+q.clientName+"</div>"
                    +(q.clientPhone?"<div style='font-size:13px;color:#555;margin-top:2px'>"+q.clientPhone+"</div>":"")
                    +(q.deliveryDate?"<div style='font-size:13px;color:#555;margin-top:2px'>Delivery / Collection: "+q.deliveryDate+"</div>":"")
                    +"</div>"
                    +"<div style='margin-bottom:18px'>"
                    +"<div style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid var(--gold);padding-bottom:4px;margin-bottom:10px'>Order details</div>"
                    // Cake/Cupcake tiers
                    +((!q.productType||q.productType==="Cake"||q.productType==="Cupcakes")
                      ?trs.map((t,i)=>"<div class='tier'><strong>Tier "+(i+1)+" — "+t.size+"\" "+(t.shape||"")+"</strong>"
                        +"<div style='font-size:12px;color:#555;margin-top:4px;line-height:1.8'>"
                        +"Flavours: "+(t.layers?.map(l=>l.flavour).filter(Boolean).join(", ")||"—")+"<br>"
                        +(t.fillings?.length?"Filling: "+t.fillings.map(f=>f.type+(f.grams?" ("+f.grams+"g)":"")).join(", ")+"<br>":"")
                        +"Covering: "+(t.coverings?.map(c=>c.type).join(" + ")||t.covering||"—")
                        +"</div></div>").join("")
                      :"")
                    // Donuts
                    +(q.productType==="Donuts"
                      ?(q.donutGroups||[]).map((g,i)=>"<div class='tier'><strong>Group "+(i+1)+": "+g.qty+" donuts</strong>"
                        +"<div style='font-size:12px;color:#555;margin-top:4px;line-height:1.8'>"
                        +"Base: "+( g.flavour||"—")+(g.filling?"<br>Filling: "+g.filling+(g.fillingGrams?" ("+g.fillingGrams+"g)":""):"")
                        +"</div></div>").join("")
                      :"")
                    // Cake Loaf
                    +(q.productType==="Cake Loaf"
                      ?"<div class='tier'><strong>"+(q.loaves?.length||0)+" Cake Loaves</strong>"
                        +"<div style='font-size:12px;color:#555;margin-top:4px;line-height:1.8'>"
                        +(q.loaves||[]).map((l,i)=>"Loaf "+(i+1)+": "+(l.flavour||"?")).join("<br>")
                        +"</div></div>"
                      :"")
                    // Tarts/Pastry
                    +(q.productType==="Tarts / Pastry"
                      ?"<div class='tier'><strong>"+(q.tartQty||0)+" Tart Shells</strong>"
                        +"<div style='font-size:12px;color:#555;margin-top:4px;line-height:1.8'>"
                        +(q.tartFillings||[]).filter(f=>f.type).map(f=>f.type+(f.grams?" ("+f.grams+"g)":"")).join("<br>")
                        +(q.tartGarnish?"<br>Garnish: "+q.tartGarnish:"")
                        +"</div></div>"
                      :"")
                    +(q.accRows?.length?"<div class='row'><span>Boards & accessories</span><span>"+q.accRows.map(a=>a.type).join(", ")+"</span></div>":"")
                    +(q.topper?.enabled?"<div class='row'><span>Custom topper</span><span>"+( q.topper.description||"Yes")+"</span></div>":"")
                    +(q.notes?"<div class='row'><span>Special requests</span><span>"+q.notes+"</span></div>":"")
                    +"</div>"
                    +"<div class='price-box'>"
                    +"<div style='font-size:12px;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:1px'>Total amount</div>"
                    +"<div style='font-size:32px;font-weight:700;color:"+gold+"'>&#8358;"+((q.salePrice||q.quotePrice||0).toLocaleString())+"</div>"
                    +"</div>"
                    +(co.bankName?"<div class='bank'><div style='font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:8px'>Payment details</div>"
                      +"<div class='row'><span>Bank</span><span><strong>"+co.bankName+"</strong></span></div>"
                      +"<div class='row'><span>Account number</span><span><strong>"+co.bankAccount+"</strong></span></div>"
                      +"<div class='row'><span>Account name</span><span>"+co.bankAccountName+"</span></div></div>":"")
                    +"<div class='terms'><strong>Terms & Conditions:</strong><br>"
                    +"&bull; A 50% non-refundable deposit is required to confirm your order.<br>"
                    +"&bull; Balance to be paid on or before collection/delivery.<br>"
                    +"&bull; Cake design may slightly differ from inspiration photos.<br>"
                    +(co.termsAndConditions?"&bull; "+co.termsAndConditions+"<br>":"")
                    +"</div>"
                    +"<div class='no-print' style='margin-top:24px;display:flex;gap:10px;justify-content:center'>"
                    +"<button onclick='window.print()' style='padding:10px 20px;background:var(--gold);color:#fff;border:none;border-radius:8px;font-size:13px;cursor:pointer'>📥 Save / Print</button>"
                    +"</div>"
                    +"<div style='margin-top:16px;font-size:11px;color:#aaa;text-align:center'>"+(co.name||"Fayvouree Cakes")+" &nbsp;·&nbsp; Generated by LayerLedger</div>"
                    +"<script>setTimeout(()=>window.print(),500)<\/script>"
                    +"</body></html>"
                  const w=window.open("","_blank")
                  w.document.write(html)
                  w.document.close()
                  // Auto-save invoice to Invoices page
                  const savedInv={id:invoiceNum,quoteId:q.id,clientName:q.clientName,clientPhone:q.clientPhone||"",date:q.date,deliveryDate:q.deliveryDate||"",amount:q.salePrice||q.quotePrice||0,productType:q.productType||"Cake",cakeSummary:q.cakeSummary||"",notes:q.notes||"",status:"unpaid",bankName:co.bankName||"",bankAccount:co.bankAccount||"",bankAccountName:co.bankAccountName||"",businessName:co.name||"Fayvouree Cakes"}
                  const existing=JSON.parse(localStorage.getItem("ll_quote_invoices")||"[]")
                  if(!existing.find(i=>i.id===invoiceNum)){localStorage.setItem("ll_quote_invoices",JSON.stringify([savedInv,...existing]))}
                  // Also send via WhatsApp option
                  const phone=(q.clientPhone||"").replace(/[^0-9]/g,"").replace(/^0/,"234")
                  if(phone){
                    setTimeout(()=>{
                      if(window.confirm("Invoice opened. Send a WhatsApp message to "+q.clientName+" with the invoice details?")){
                        const msg="Hello "+q.clientName+"! 🎂 Your invoice is ready.%0A%0AInvoice: "+invoiceNum+"%0AAmount: ₦"+(q.salePrice||q.quotePrice||0).toLocaleString()+"%0A%0APlease make payment to:%0ABank: "+(co.bankName||"")+ "%0AAccount: "+(co.bankAccount||"")+" ("+( co.bankAccountName||"")+")%0A%0AThank you for choosing "+(co.name||"Fayvouree Cakes")+"! 🎂"
                        window.open("https://wa.me/"+phone+"?text="+msg,"_blank")
                      }
                    },1500)
                  }
                }} style={{padding:"5px 14px",borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:500}}>🧾 Convert to invoice</button>
                <Btn small variant="danger" onClick={()=>deleteQuote(q.id)}>Delete</Btn>
              </div>
            </div>}
          </Card>
        })}
      </div>
    }
  </div>
}

function OrderCalculator({inventory,recipes,settings,setView,company}){
  const getMults=()=>{try{return JSON.parse(localStorage.getItem("ll_multipliers")||"null")||{}}catch{return{}}}
  const getDecs=()=>{try{const v=localStorage.getItem("ll_decorations");return v?JSON.parse(v):DECORATION_ITEMS}catch{return DECORATION_ITEMS}}

  const mults=getMults()
  const decorations=getDecs()
  const getPackaging=()=>{try{const v=localStorage.getItem("ll_packaging");return v?JSON.parse(v):[
    {id:"p1",name:"Cake Board 6\"",price:300},{id:"p2",name:"Cake Board 8\"",price:450},
    {id:"p3",name:"Cake Board 10\"",price:600},{id:"p4",name:"Cake Board 12\"",price:800},
    {id:"p5",name:"Cake Board 14\"",price:1000},{id:"p6",name:"Cake Drum 8\"",price:700},
    {id:"p7",name:"Cake Drum 10\"",price:900},{id:"p8",name:"Cake Drum 12\"",price:1200},
    {id:"p9",name:"Cake Box 6\"",price:400},{id:"p10",name:"Cake Box 8\"",price:600},
    {id:"p11",name:"Cake Box 10\"",price:800},{id:"p12",name:"Cake Box 12\"",price:1000},
    {id:"p13",name:"Dowels (pack)",price:500},{id:"p14",name:"Delivery box",price:1500},
  ]}catch{return[]}}
  const packagingItems=getPackaging()

  // Accessory types with sizes and prices — in real app these come from settings
  const ACC_TYPES=[
    {name:"Cake board",sizes:['4" — ₦200','6" — ₦300','8" — ₦450','10" — ₦600','12" — ₦800','14" — ₦1,000']},
    {name:"Cake drum",sizes:['6" — ₦500','8" — ₦700','10" — ₦900','12" — ₦1,200','14" — ₦1,500']},
    {name:"Cake box",sizes:['6" — ₦400','8" — ₦600','10" — ₦800','12" — ₦1,000','14" — ₦1,200']},
    {name:"Dowels",sizes:['Per set — ₦300']},
    {name:"Ribbon roll",sizes:['Standard — ₦500']},
  ]
  const COVERING_TYPES=["Buttercream","Fondant","Drip","Ganache","Whipped Cream","Mirror Glaze","Naked"]
  const FILLING_TYPES=["Buttercream","Jam","Ganache","Custard","Cream Cheese","Whipped Cream"]
  const SIZES=["4\"","5\"","6\"","7\"","8\"","9\"","10\"","12\"","14\""]
  const PRODUCT_TYPES=["Cake","Donuts","Cake Loaf","Tarts / Pastry","Cupcakes"]

  const getMult=(size,shape)=>{
    const key=`${size.replace('\"','')}-${shape.toLowerCase()}`
    return mults[key]||1
  }

  // Cost per kg from recipe — looks up recipe by name, calculates total cost
  const recipeCostPerKg=(flavour)=>{
    const r=recipes.find(x=>x.name.toLowerCase().includes(flavour.toLowerCase()))
    if(!r)return 0
    const totalCost=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
    const totalWeight=r.ing.reduce((s,ing)=>s+(ing.unit==="kg"?ing.qty:ing.unit==="g"?ing.qty/1000:0),0)
    if(totalWeight===0)return totalCost // fallback
    return totalCost/totalWeight
  }

  // Layer cost = recipe cost/kg × approx layer weight × size multiplier
  const LAYER_WEIGHT_KG=0.4 // approx 400g per standard layer at 6"
  const layerCost=(flavour,size,shape)=>{
    const r=recipes.find(x=>x.name.toLowerCase().includes(flavour.toLowerCase()))
    if(!r)return 0
    const base=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
    return base*getMult(size,shape)
  }

  // Covering/filling cost = recipe cost/kg × quantity in grams
  // Falls back to standard cost per kg if no recipe found
  const FALLBACK_CPK={"Buttercream":3500,"Fondant":7500,"Drip":4000,"Ganache":5000,"Whipped Cream":3000,"Mirror Glaze":6000,"Jam":2000,"Custard":1800,"Cream Cheese":4500}
  const coverFillCost=(type,grams)=>{
    if(!grams||grams===0)return 0
    // Look for covering/filling recipe first
    const r=recipes.find(x=>(x.type==="covering"||!x.type)&&x.name.toLowerCase().includes(type.toLowerCase()))
    if(r){
      const totalCost=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
      // Use batch weight if set, otherwise derive from ingredients
      const batchGrams=+(r.batchWeight)||r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?.unit==="kg"?ing.qty*1000:it?.unit==="g"?ing.qty:it?.unit==="L"||it?.unit==="l"?ing.qty*1000:0)},0)
      if(batchGrams>0)return (totalCost/batchGrams)*grams
    }
    // Fallback: use standard cost per gram until recipe is added
    const cpk=FALLBACK_CPK[type]||3000
    return (cpk/1000)*grams
  }

  // Separate recipe lists for UI dropdowns
  const layerRecipes=recipes.filter(r=>!r.type||r.type==="layer")
  const coveringRecipes=recipes.filter(r=>r.type==="covering")
  const pastryRecipes=recipes.filter(r=>r.type==="pastry")
  const allRecipes=recipes // all recipes for fallback search
  const allCoveringTypes=[...new Set([...coveringRecipes.map(r=>r.name),...["Buttercream","Fondant","Drip","Ganache","Whipped Cream","Mirror Glaze","Naked"]])]
  const allFillingTypes=[...new Set([...coveringRecipes.map(r=>r.name),...["Buttercream","Jam","Ganache","Custard","Cream Cheese","Whipped Cream"]])]

  const getAccPrice=(type,size)=>{if(!size)return 0;const m=String(size).match(/[₦N$]?([\d,]+)\s*$/);return m?parseInt(m[1].replace(",","")):0}

  // Batch cost — total ingredient cost for one recipe batch
  const batchCost=(recipeName)=>{
    if(!recipeName)return 0
    const r=recipes.find(x=>x.name.toLowerCase()===recipeName.toLowerCase())||recipes.find(x=>x.name.toLowerCase().includes(recipeName.toLowerCase()))
    if(!r)return 0
    return r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
  }
  // Cost per piece from a pastry recipe — uses batchSize if set, defaults to 12
  const costPerPiece=(recipeName)=>{
    if(!recipeName)return 0
    const r=recipes.find(x=>x.name.toLowerCase()===recipeName.toLowerCase())||recipes.find(x=>x.name.toLowerCase().includes(recipeName.toLowerCase()))
    if(!r)return 0
    const totalCost=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
    const pieces=r.batchSize||12
    return totalCost/pieces
  }

  let nid=Date.now()
  const uid2=()=>nid++

  // Auto-restore saved calculator state
  const restoreCalc=()=>{
    try{
      // Check if editing an existing quote
      const edit=JSON.parse(localStorage.getItem("ll_calc_edit")||"null")
      if(edit){localStorage.removeItem("ll_calc_edit");return{...edit,isEdit:true,editId:edit.id}}
      return JSON.parse(localStorage.getItem("ll_calc_state")||"null")
    }catch{return null}
  }
  const saved=useState(()=>restoreCalc())[0]

  const [productType,setProductType]=useState(()=>saved?.productType||"Cake")
  const [clientName,setClientName]=useState(()=>saved?.clientName||saved?.clientName||"")
  const [clientPhone,setClientPhone]=useState(()=>saved?.clientPhone||"")
  const [clientNotes,setClientNotes]=useState(()=>saved?.clientNotes||saved?.notes||"")
  const [deliveryDate,setDeliveryDate]=useState(()=>saved?.deliveryDate||"")
  const [quoteSaved,setQuoteSaved]=useState(false)
  const [isEdit,setIsEdit]=useState(()=>!!saved?.isEdit)
  const [editId,setEditId]=useState(()=>saved?.editId||null)
  const [salePrice,setSalePrice]=useState(()=>saved?.salePrice||"")
  const [cakePhoto,setCakePhoto]=useState(()=>saved?.cakePhoto||null)
  const photoRef=useRef(null)

  // Non-cake product states
  const [donutGroups,setDonutGroups]=useState(()=>saved?.donutGroups||[{id:uid2(),flavour:"",qty:12,filling:"",fillingGrams:0}])
  const [loaves,setLoaves]=useState(()=>saved?.loaves||[{id:uid2(),flavour:""}])
  const [tartQty,setTartQty]=useState(()=>saved?.tartQty||12)
  const [tartFillings,setTartFillings]=useState(()=>saved?.tartFillings||[{id:uid2(),type:"",grams:0}])
  const [tartGarnish,setTartGarnish]=useState(()=>saved?.tartGarnish||"")

  // Auto-save calculator state on every change
  const autoSave=(extra={})=>{
    try{localStorage.setItem("ll_calc_state",JSON.stringify({productType,clientName,clientPhone,clientNotes,tiers,accRows,topper,margin,...extra}))}catch{}
  }
  const [tiers,setTiers]=useState(()=>saved?.tiers?.length>0?saved.tiers:[{id:uid2(),size:'6"',shape:"Round",layers:[{id:uid2(),flavour:""}],coverings:[{id:uid2(),type:"Buttercream",grams:300}],fillings:[{id:uid2(),type:"Buttercream",grams:200}]}])
  const [decQty,setDecQty]=useState(()=>saved?.decQty||{})
  const [accRows,setAccRows]=useState(()=>saved?.accRows?.length>0?saved.accRows:[{id:uid2(),itemId:"p2",name:"Cake Board 8\"",price:450}])
  const [topper,setTopper]=useState(()=>saved?.topper||{enabled:false,make:"",deliver:"",description:""})
  const [margin,setMargin]=useState(()=>saved?.margin||settings.profitPct||40)

  // Tier operations
  const addTier=()=>setTiers(t=>[...t,{id:uid2(),size:'6"',shape:"Round",layers:[{id:uid2(),flavour:""}],coverings:[{id:uid2(),type:"Buttercream",grams:300}],fillings:[{id:uid2(),type:"Buttercream",grams:200}]}])
  const removeTier=id=>setTiers(t=>t.filter(x=>x.id!==id))
  const updateTier=(id,key,val)=>setTiers(t=>t.map(x=>x.id===id?{...x,[key]:val}:x))
  const addLayer=tid=>setTiers(t=>t.map(x=>x.id===tid?{...x,layers:[...x.layers,{id:uid2(),flavour:""}]}:x))
  const removeLayer=(tid,lid)=>setTiers(t=>t.map(x=>x.id===tid?{...x,layers:x.layers.filter(l=>l.id!==lid)}:x))
  const updateLayer=(tid,lid,v)=>setTiers(t=>t.map(x=>x.id===tid?{...x,layers:x.layers.map(l=>l.id===lid?{...l,flavour:v}:l)}:x))
  const addFilling=tid=>setTiers(t=>t.map(x=>x.id===tid?{...x,fillings:[...x.fillings,{id:uid2(),type:"Buttercream",grams:200}]}:x))
  const removeFilling=(tid,fid)=>setTiers(t=>t.map(x=>x.id===tid?{...x,fillings:x.fillings.filter(f=>f.id!==fid)}:x))
  const updateFilling=(tid,fid,key,val)=>setTiers(t=>t.map(x=>x.id===tid?{...x,fillings:x.fillings.map(f=>f.id===fid?{...f,[key]:key==="grams"?parseInt(val)||0:val}:f)}:x))
  const addCovering=tid=>setTiers(t=>t.map(x=>x.id===tid?{...x,coverings:[...x.coverings,{id:uid2(),type:"Fondant",grams:500}]}:x))
  const removeCovering=(tid,cid)=>setTiers(t=>t.map(x=>x.id===tid?{...x,coverings:x.coverings.filter(c=>c.id!==cid)}:x))
  const updateCovering=(tid,cid,key,val)=>setTiers(t=>t.map(x=>x.id===tid?{...x,coverings:x.coverings.map(c=>c.id===cid?{...c,[key]:key==="grams"?parseInt(val)||0:val}:c)}:x))

  // Accessory operations
  const addAcc=()=>setAccRows(r=>[...r,{id:uid2(),itemId:"",name:"",price:0}])
  const removeAcc=id=>setAccRows(r=>r.filter(x=>x.id!==id))
  const updateAcc=(id,itemId)=>{
    const pkg=packagingItems.find(p=>p.id===itemId)
    setAccRows(r=>r.map(x=>x.id===id?{...x,itemId,name:pkg?.name||"",price:pkg?.price||0}:x))
  }
  const changeDec=(id,delta)=>setDecQty(q=>{const n={...q};if(delta<=-999){delete n[id];return n}n[id]=(n[id]||0)+delta;if(n[id]<=0)delete n[id];return n})

  // Cost calculations
  const tierCost=tier=>
    tier.layers.reduce((s,l)=>s+(l.flavour?layerCost(l.flavour,tier.size,tier.shape):0),0)+
    tier.coverings.reduce((s,c)=>s+coverFillCost(c.type,c.grams),0)+
    tier.fillings.reduce((s,f)=>s+coverFillCost(f.type,f.grams),0)
  const totalTiers=tiers.reduce((s,t)=>s+tierCost(t),0)
  const totalDecs=decorations.reduce((s,d)=>{const qty=decQty[d.id]||0;const it=inventory.find(x=>x.id===d.iid);return s+(it&&qty?it.cost*d.qty*qty:0)},0)
  const totalAcc=accRows.reduce((s,r)=>s+(r.price||0),0)
  const topperCost=(+topper.make||0)+(+topper.deliver||0)

  // Non-cake cost calculations — placed here after all state is declared
  const donutTotalQty=donutGroups.reduce((s,g)=>s+(+g.qty||0),0)
  const donutCost=donutGroups.reduce((s,g)=>{
    const pieceCost=g.flavour?costPerPiece(g.flavour):0
    return s+(pieceCost*(+g.qty||0))+(g.filling?coverFillCost(g.filling,+g.fillingGrams||0):0)
  },0)
  const loafCost=loaves.reduce((s,l)=>s+(l.flavour?batchCost(l.flavour):0),0)
  const tartShellCost=tartQty>0?(()=>{
    const r=pastryRecipes.find(x=>x.name.toLowerCase().includes("tart"))||recipes.find(x=>x.name.toLowerCase().includes("tart"))
    if(!r)return 0
    const bc=r.ing.reduce((s,ing)=>{const it=inventory.find(x=>x.id===ing.iid);return s+(it?it.cost*ing.qty:0)},0)
    return r.batchSize>0?bc/r.batchSize*tartQty:bc*Math.ceil(tartQty/12)
  })():0
  const tartFillCost=tartFillings.reduce((s,f)=>s+coverFillCost(f.type,+f.grams||0),0)
  const productBaseCost=productType==="Cake"||productType==="Cupcakes"?totalTiers+totalDecs+topperCost
    :productType==="Donuts"?donutCost
    :productType==="Cake Loaf"?loafCost
    :productType==="Tarts / Pastry"?tartShellCost+tartFillCost
    :totalTiers+totalDecs+topperCost

  const subtotal=productBaseCost+totalAcc
  const accPct=(1+(settings.accessoryPct||10)/100)
  const totalCost=Math.round(subtotal*accPct)
  const suggestedPrice=Math.round(totalCost/(1-margin/100))
  const profit=suggestedPrice-totalCost

  const renderTierCard=(tier,ti)=>{
    const tc=tierCost(tier)
    return <Card key={tier.id} style={{marginBottom:12,borderLeft:"4px solid var(--gold)",padding:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontWeight:500,fontSize:13}}>Tier {ti+1}</div>
        {tiers.length>1&&<Btn small variant="danger" onClick={()=>removeTier(tier.id)}>Remove tier</Btn>}
      </div>

      {/* Size + Shape */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div>
          <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Size</label>
          <select value={tier.size} onChange={e=>updateTier(tier.id,"size",e.target.value)} style={{...iSt}}>
            {PRICING_SIZES.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:3,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Shape</label>
          <select value={tier.shape} onChange={e=>updateTier(tier.id,"shape",e.target.value)} style={{...iSt}}>
            {["Round","Square","Sheet"].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Layers */}
      <div style={{marginBottom:10}}>
        <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Layers — one flavour per layer</label>
        {tier.layers.map((l,li)=><div key={l.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:6,alignItems:"center",marginBottom:5}}>
          <span style={{fontSize:11.5,color:"var(--muted)",minWidth:52}}>Layer {li+1}</span>
          <select value={l.flavour} onChange={e=>updateLayer(tier.id,l.id,e.target.value)} style={{...iSt}}>
            <option value="">— Select flavour —</option>
            {layerRecipes.map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
          <span style={{fontSize:11,color:"var(--gold)",whiteSpace:"nowrap"}}>{l.flavour?fmt(layerCost(l.flavour,tier.size,tier.shape)):""}</span>
          {tier.layers.length>1
            ?<button onClick={()=>removeLayer(tier.id,l.id)} style={{width:22,height:22,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--muted)"}}>×</button>
            :<span style={{width:22}}/>}
        </div>)}
        <Btn small variant="ghost" onClick={()=>addLayer(tier.id)}>+ Add layer</Btn>
      </div>

      {/* Fillings */}
      <div style={{marginBottom:10}}>
        <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Fillings between layers</label>
        {tier.fillings.map(f=><div key={f.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto auto",gap:6,alignItems:"center",marginBottom:5}}>
          <select value={f.type} onChange={e=>updateFilling(tier.id,f.id,"type",e.target.value)} style={{...iSt}}>
            {allFillingTypes.map(x=><option key={x} value={x}>{x}</option>)}
          </select>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <input type="number" value={f.grams} onChange={e=>updateFilling(tier.id,f.id,"grams",e.target.value)} style={{...iSt,width:70,textAlign:"right",padding:"6px 6px"}}/>
            <span style={{fontSize:12,color:"var(--muted)"}}>g</span>
          </div>
          <span style={{fontSize:11,color:"var(--gold)",whiteSpace:"nowrap"}}>{fmt(coverFillCost(f.type,f.grams))}</span>
          <button onClick={()=>removeFilling(tier.id,f.id)} style={{width:22,height:22,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--muted)"}}>×</button>
        </div>)}
        <Btn small variant="ghost" onClick={()=>addFilling(tier.id)}>+ Add filling</Btn>
      </div>

      {/* Coverings */}
      <div style={{marginBottom:8}}>
        <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Coverings</label>
        {tier.coverings.map(c=><div key={c.id} style={{background:"var(--bg)",borderRadius:6,padding:"8px 10px",marginBottom:5}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto auto",gap:6,alignItems:"center"}}>
            <select value={c.type} onChange={e=>updateCovering(tier.id,c.id,"type",e.target.value)} style={{...iSt}}>
              {allCoveringTypes.map(x=><option key={x} value={x}>{x}</option>)}
            </select>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <input type="number" value={c.grams} onChange={e=>updateCovering(tier.id,c.id,"grams",e.target.value)} style={{...iSt,width:70,textAlign:"right",padding:"6px 6px"}}/>
              <span style={{fontSize:12,color:"var(--muted)"}}>g</span>
            </div>
            <span style={{fontSize:11,color:"var(--gold)",whiteSpace:"nowrap"}}>{fmt(coverFillCost(c.type,c.grams))}</span>
            <button onClick={()=>removeCovering(tier.id,c.id)} style={{width:22,height:22,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:12,color:"var(--muted)"}}>×</button>
          </div>
        </div>)}
        <Btn small variant="ghost" onClick={()=>addCovering(tier.id)}>+ Add covering</Btn>
      </div>

      <div style={{marginTop:8,padding:"6px 10px",background:"#F5F0E4",borderRadius:6,fontSize:12,color:"var(--muted)"}}>
        Tier cost: <strong style={{color:"var(--gold)"}}>{fmt(tc)}</strong>
      </div>
    </Card>
  }

  return <div>
    <SHead title="Order Calculator" sub="Build a cake quote for a client — saved quotes appear in the Quotes page."/>

    {/* CLIENT DETAILS — always visible at top */}
    <Card style={{marginBottom:16,background:"#F5F0E4"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Client details</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <Inp label="Client name *" value={clientName} onChange={v=>{setClientName(v);autoSave({clientName:v})}} placeholder="Mrs Iye Achem"/>
        <Inp label="Phone (WhatsApp)" value={clientPhone} onChange={v=>{setClientPhone(v);autoSave({clientPhone:v})}} placeholder="+234..."/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        <Inp label="Delivery / collection date *" type="date" value={deliveryDate} onChange={v=>{setDeliveryDate(v);autoSave({deliveryDate:v})}}/>
        <div/>
      </div>
      <Inp label="Notes / special requests" value={clientNotes} onChange={v=>{setClientNotes(v);autoSave({clientNotes:v})}} placeholder="Colour theme, flavour preferences, delivery instructions..."/>
    </Card>

    {/* PHOTO UPLOAD */}
    <Card style={{marginBottom:16}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>📸 Design photo <span style={{fontSize:11,color:"var(--muted)",fontWeight:400}}>(client's inspiration or approved design)</span></div>
      <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
        const file=e.target.files[0]
        if(!file)return
        const reader=new FileReader()
        reader.onload=ev=>{
          const dataUrl=ev.target.result
          setCakePhoto(dataUrl)
          try{localStorage.setItem("ll_calc_state",JSON.stringify({...JSON.parse(localStorage.getItem("ll_calc_state")||"{}"),cakePhoto:dataUrl}))}catch{}
        }
        reader.readAsDataURL(file)
      }}/>
      {cakePhoto
        ?<div style={{position:"relative",display:"inline-block"}}>
          <img src={cakePhoto} alt="Cake design" style={{maxWidth:"100%",maxHeight:220,borderRadius:8,display:"block"}}/>
          <button onClick={()=>{setCakePhoto(null);if(photoRef.current)photoRef.current.value=""}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.6)",color:"#fff",border:"none",borderRadius:20,padding:"3px 10px",cursor:"pointer",fontSize:12}}>✕ Remove</button>
        </div>
        :<div onClick={()=>photoRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:28,textAlign:"center",cursor:"pointer",background:"var(--bg)"}}>
          <div style={{fontSize:28,marginBottom:6}}>📷</div>
          <div style={{fontSize:13,color:"var(--muted)"}}>Tap to upload design photo</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>JPG, PNG — stored on this device</div>
        </div>}
    </Card>

    <div style={{display:"grid",gridTemplateColumns:"1.3fr 0.7fr",gap:18}}>
      <div>
        {/* Product type */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Product type</label>
          <select value={productType} onChange={e=>setProductType(e.target.value)} style={{...iSt,maxWidth:220}}>
            {PRODUCT_TYPES.map(p=><option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* CAKE / CUPCAKES — Tiers */}
        {(productType==="Cake"||productType==="Cupcakes")&&<>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>{productType==="Cupcakes"?"Cupcake tiers":"Cake tiers"}</div>
          {tiers.map((tier,ti)=>renderTierCard(tier,ti))}
          <Btn variant="ghost" onClick={addTier} style={{width:"100%",marginBottom:18,borderStyle:"dashed"}}>+ Add tier</Btn>
          {/* Decorations */}
          <div style={{marginBottom:18}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Decoration extras</div>
            {Object.keys(decQty).map(did=>{
              const d=decorations.find(x=>x.id===did)
              if(!d)return null
              const it=inventory.find(x=>x.id===d.iid)
              const unitCost=it?it.cost*d.qty:0
              const qty=decQty[did]||1
              return <div key={did} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:13,color:"var(--text)",fontWeight:500}}>{d.label||d.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:11,color:"var(--muted)"}}>Qty:</span>
                  <button onClick={()=>changeDec(did,-1)} style={{width:22,height:22,padding:0,fontSize:14,borderRadius:4,border:"1px solid var(--border)",background:"var(--panel)",cursor:"pointer"}}>-</button>
                  <span style={{fontSize:13,fontWeight:500,minWidth:18,textAlign:"center"}}>{qty}</span>
                  <button onClick={()=>changeDec(did,1)} style={{width:22,height:22,padding:0,fontSize:14,borderRadius:4,border:"1px solid var(--border)",background:"var(--panel)",cursor:"pointer"}}>+</button>
                </div>
                <span style={{fontSize:12,color:"var(--gold)",fontWeight:500,whiteSpace:"nowrap"}}>{fmt(unitCost*qty)}</span>
                <button onClick={()=>changeDec(did,-999)} style={{width:24,height:24,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--muted)"}}>×</button>
              </div>
            })}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <select onChange={e=>{if(e.target.value)changeDec(e.target.value,1);e.target.value=""}} style={{...iSt,flex:1}} defaultValue="">
                <option value="">+ Add decoration extra</option>
                {decorations.filter(d=>!decQty[d.id]).map(d=>{
                  const it=inventory.find(x=>x.id===d.iid)
                  return <option key={d.id} value={d.id}>{d.label||d.name}{it?` — ${fmt(it.cost*d.qty)} per set`:""}</option>
                })}
              </select>
            </div>
          </div>
          {/* Custom Topper */}
          <div style={{marginBottom:18}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Custom topper</div>
            <Card>
              <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",marginBottom:topper.enabled?12:0}}>
                <input type="checkbox" checked={topper.enabled} onChange={e=>setTopper(t=>({...t,enabled:e.target.checked}))}/>
                This order has a custom topper
              </label>
              {topper.enabled&&<>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <Inp label="Making cost (₦)" type="number" value={topper.make} onChange={v=>setTopper(t=>({...t,make:v}))} placeholder="5000"/>
                  <Inp label="Delivery to shop (₦)" type="number" value={topper.deliver} onChange={v=>setTopper(t=>({...t,deliver:v}))} placeholder="1500"/>
                </div>
                <div>
                  <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Topper description</label>
                  <textarea value={topper.description} onChange={e=>setTopper(t=>({...t,description:e.target.value}))} placeholder="e.g. Gold acrylic Mr & Mrs topper..." style={{...iSt,height:70,resize:"vertical",fontFamily:"inherit"}}/>
                </div>
              </>}
            </Card>
          </div>
        </>}

        {/* DONUTS */}
        {productType==="Donuts"&&<>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Donut groups — total: {donutTotalQty} donuts</div>
          {pastryRecipes.length===0&&<div style={{fontSize:12.5,color:"#8C5E00",background:"#FFF3CD",padding:"8px 12px",borderRadius:7,marginBottom:12,border:"1px solid #F0D080"}}>⚠️ No pastry recipes found. Go to <strong>Master List → Base Recipes → Pastry/Batch</strong> to add your donut recipe first.</div>}
          {donutGroups.map((g,gi)=><Card key={g.id} style={{marginBottom:10,borderLeft:"4px solid var(--gold)",padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontWeight:500,fontSize:13}}>Group {gi+1}</div>
              {donutGroups.length>1&&<button onClick={()=>setDonutGroups(dg=>dg.filter(x=>x.id!==g.id))} style={{background:"#B03A2E",color:"#fff",border:"none",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:12}}>Remove</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <div>
                <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Base donut recipe</label>
                <select value={g.flavour} onChange={e=>setDonutGroups(dg=>dg.map(x=>x.id===g.id?{...x,flavour:e.target.value}:x))} style={{...iSt}}>
                  <option value="">— Select recipe —</option>
                  {(pastryRecipes.length>0?pastryRecipes:allRecipes).map(r=><option key={r.id} value={r.name}>{r.name} {batchCost(r.name)>0?"— "+fmt(r.batchSize>0?batchCost(r.name)/r.batchSize:batchCost(r.name))+(r.batchSize>0?" /pc":" /batch"):""}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Quantity (donuts)</label>
                <input type="number" min="1" value={g.qty} onChange={e=>setDonutGroups(dg=>dg.map(x=>x.id===g.id?{...x,qty:+e.target.value||0}:x))} style={{...iSt}}/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div>
                <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Filling (optional)</label>
                <select value={g.filling} onChange={e=>setDonutGroups(dg=>dg.map(x=>x.id===g.id?{...x,filling:e.target.value}:x))} style={{...iSt}}>
                  <option value="">— No filling —</option>
                  {["Chocolate","Jam","Pastry Cream","Lemon Curd","Custard","Nutella",...allFillingTypes].filter((v,i,a)=>a.indexOf(v)===i).map(f=><option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <Inp label="Filling amount (g)" type="number" value={g.fillingGrams} onChange={v=>setDonutGroups(dg=>dg.map(x=>x.id===g.id?{...x,fillingGrams:+v||0}:x))} placeholder="e.g. 200"/>
            </div>
            {g.flavour&&<div style={{marginTop:8,fontSize:12,color:"var(--gold)",fontWeight:500}}>
              Cost: {fmt(batchCost(g.flavour)*Math.ceil((g.qty||0)/12)+(g.filling?coverFillCost(g.filling,g.fillingGrams||0):0))} — {Math.ceil((g.qty||0)/12)} batch{Math.ceil((g.qty||0)/12)>1?"es":""}
            </div>}
          </Card>)}
          <Btn variant="ghost" onClick={()=>setDonutGroups(dg=>[...dg,{id:uid2(),flavour:"",qty:12,filling:"",fillingGrams:0}])} style={{width:"100%",marginBottom:18,borderStyle:"dashed"}}>+ Add donut group</Btn>
        </>}

        {/* CAKE LOAF */}
        {productType==="Cake Loaf"&&<>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Loaves — {loaves.length} loaf{loaves.length>1?"es":""}</div>
          {loaves.map((l,li)=><div key={l.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:8,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,color:"var(--muted)",minWidth:52}}>Loaf {li+1}</span>
            <select value={l.flavour} onChange={e=>setLoaves(lv=>lv.map(x=>x.id===l.id?{...x,flavour:e.target.value}:x))} style={{...iSt}}>
              <option value="">— Select flavour —</option>
              {(pastryRecipes.length>0?pastryRecipes:allRecipes).map(r=><option key={r.id} value={r.name}>{r.name}</option>)}
            </select>
            <span style={{fontSize:12,color:"var(--gold)",fontWeight:500,whiteSpace:"nowrap"}}>{l.flavour?fmt(batchCost(l.flavour)):""}</span>
            {loaves.length>1&&<button onClick={()=>setLoaves(lv=>lv.filter(x=>x.id!==l.id))} style={{width:24,height:24,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--muted)"}}>×</button>}
          </div>)}
          <Btn variant="ghost" onClick={()=>setLoaves(lv=>[...lv,{id:uid2(),flavour:""}])} style={{width:"100%",marginBottom:18,borderStyle:"dashed"}}>+ Add loaf</Btn>
        </>}

        {/* TARTS / PASTRY */}
        {productType==="Tarts / Pastry"&&<>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Tarts & Pastry</div>
          <Card style={{marginBottom:12}}>
            <div style={{fontWeight:500,fontSize:13,marginBottom:10}}>Shells</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Inp label="Number of shells" type="number" value={tartQty} onChange={v=>setTartQty(+v||0)} placeholder="e.g. 120"/>
              <div style={{fontSize:12,color:"var(--muted)",paddingTop:22}}>= {Math.ceil(tartQty/12)} batch{Math.ceil(tartQty/12)>1?"es":""} of 12 · {fmt(tartShellCost)}</div>
            </div>
            <div style={{fontSize:11.5,color:"var(--muted)",marginTop:4}}>Tip: Add a "Tart Shell" or "Pastry Shell" recipe in Master List to get accurate costs.</div>
          </Card>
          <Card style={{marginBottom:12}}>
            <div style={{fontWeight:500,fontSize:13,marginBottom:10}}>Fillings & creams</div>
            {tartFillings.map((f,fi)=><div key={f.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"center",marginBottom:8}}>
              <select value={f.type} onChange={e=>setTartFillings(tf=>tf.map(x=>x.id===f.id?{...x,type:e.target.value}:x))} style={{...iSt}}>
                <option value="">— Select filling —</option>
                {["Lemon Curd","Chantilly Cream","Pastry Cream","Custard","Jam","Ganache","Nutella",...allFillingTypes].filter((v,i,a)=>a.indexOf(v)===i).map(t=><option key={t} value={t}>{t}</option>)}
              </select>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input type="number" value={f.grams} onChange={e=>setTartFillings(tf=>tf.map(x=>x.id===f.id?{...x,grams:+e.target.value||0}:x))} placeholder="grams" style={{...iSt,flex:1}}/>
                <span style={{fontSize:11,color:"var(--muted)",whiteSpace:"nowrap"}}>g · {fmt(coverFillCost(f.type,+f.grams||0))}</span>
              </div>
              {tartFillings.length>1&&<button onClick={()=>setTartFillings(tf=>tf.filter(x=>x.id!==f.id))} style={{width:24,height:24,padding:0,borderRadius:4,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:13,color:"var(--muted)"}}>×</button>}
            </div>)}
            <Btn variant="ghost" small onClick={()=>setTartFillings(tf=>[...tf,{id:uid2(),type:"",grams:0}])}>+ Add filling</Btn>
          </Card>
          <Card style={{marginBottom:18}}>
            <Inp label="Garnish / topping notes" value={tartGarnish} onChange={setTartGarnish} placeholder="e.g. Fresh berries, powdered sugar, edible flowers..."/>
          </Card>
        </>}

        {/* Boards & Accessories — shared across all product types */}
        <div style={{marginBottom:18}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Boards & packaging</div>
          {accRows.map(row=><div key={row.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center",marginBottom:8}}>
            <select value={row.itemId||""} onChange={e=>updateAcc(row.id,e.target.value)} style={{...iSt}}>
              <option value="">— Select item —</option>
              {packagingItems.map(p=><option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
            </select>
            <span style={{fontSize:12,color:"var(--gold)",fontWeight:500,whiteSpace:"nowrap",minWidth:52,textAlign:"right"}}>{row.price?fmt(row.price):""}</span>
            <button onClick={()=>removeAcc(row.id)} style={{width:28,height:28,padding:0,borderRadius:6,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",fontSize:14,color:"var(--muted)"}}>×</button>
          </div>)}
          <Btn variant="ghost" onClick={addAcc}>+ Add board/packaging item</Btn>
        </div>
      </div>
      <div>
        <Card style={{position:"sticky",top:16}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Quote summary</div>

          {tiers.map((tier,ti)=><div key={tier.id} style={{background:"#F5F0E4",borderRadius:8,padding:"8px 10px",marginBottom:8,fontSize:12}}>
            <div style={{fontWeight:500,marginBottom:4}}>Tier {ti+1}: {tier.size} {tier.shape}</div>
            {tier.layers.map((l,li)=>l.flavour?<div key={l.id} style={{color:"var(--muted)"}}>L{li+1}: {l.flavour} {fmt(layerCost(l.flavour,tier.size,tier.shape))}</div>:null)}
            {tier.fillings.map(f=><div key={f.id} style={{color:"var(--muted)"}}>Fill: {f.type} {f.grams}g {fmt(coverFillCost(f.type,f.grams))}</div>)}
            {tier.coverings.map(c=><div key={c.id} style={{color:"var(--muted)"}}>Cover: {c.type} {c.grams}g {fmt(coverFillCost(c.type,c.grams))}</div>)}
          </div>)}

          <div style={{borderTop:"1px solid var(--border)",paddingTop:8,marginBottom:12}}>
            {(productType==="Cake"||productType==="Cupcakes")&&[
              ["Layers",tiers.reduce((s,t)=>s+t.layers.reduce((s2,l)=>s2+(l.flavour?layerCost(l.flavour,t.size,t.shape):0),0),0)],
              ["Fillings",tiers.reduce((s,t)=>s+t.fillings.reduce((s2,f)=>s2+coverFillCost(f.type,f.grams),0),0)],
              ["Coverings",tiers.reduce((s,t)=>s+t.coverings.reduce((s2,c)=>s2+coverFillCost(c.type,c.grams),0),0)],
              ["Decorations",totalDecs],
              ["Custom topper",topperCost],
            ].filter(([,v])=>v>0).map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>{l}</span><span>{fmt(v)}</span></div>)}
            {productType==="Donuts"&&donutGroups.map((g,i)=>g.flavour&&<div key={g.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>Group {i+1}: {g.qty} donuts ({g.filling||"plain"})</span><span>{fmt(batchCost(g.flavour)*Math.ceil((g.qty||0)/12)+(g.filling?coverFillCost(g.filling,g.fillingGrams||0):0))}</span></div>)}
            {productType==="Cake Loaf"&&loaves.map((l,i)=>l.flavour&&<div key={l.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>Loaf {i+1}: {l.flavour}</span><span>{fmt(batchCost(l.flavour))}</span></div>)}
            {productType==="Tarts / Pastry"&&<>
              {tartQty>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>{tartQty} shells ({Math.ceil(tartQty/12)} batch{Math.ceil(tartQty/12)>1?"es":""})</span><span>{fmt(tartShellCost)}</span></div>}
              {tartFillings.filter(f=>f.type&&f.grams>0).map(f=><div key={f.id} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>{f.type} {f.grams}g</span><span>{fmt(coverFillCost(f.type,f.grams))}</span></div>)}
            </>}
            {totalAcc>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>Boards & accessories</span><span>{fmt(totalAcc)}</span></div>}
            {(productType==="Cake"||productType==="Cupcakes")&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--muted)",marginBottom:3}}><span>Accessory {settings.accessoryPct||10}%</span><span>{fmt(Math.round(subtotal*((settings.accessoryPct||10)/100)))}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:600,fontSize:13,paddingTop:6,borderTop:"1px solid var(--border)",marginTop:4}}>
              <span>Total cost</span><span>{fmt(totalCost)}</span>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8}}>Profit margin</label>
            <input type="range" min={10} max={80} value={margin} onChange={e=>setMargin(+e.target.value)} style={{width:"100%",accentColor:"var(--gold)",marginBottom:4}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)"}}>
              <span>10%</span><span style={{color:"var(--gold)",fontWeight:600}}>{margin}%</span><span>80%</span>
            </div>
          </div>

          <div style={{background:suggestedPrice>0?"#E8F5EE":"#F5F0E4",border:`1px solid ${suggestedPrice>0?"#C2E0CF":"var(--border)"}`,borderRadius:10,padding:"12px 14px",textAlign:"center",marginBottom:10}}>
            <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>Suggested price</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"var(--gold)"}}>{fmt(suggestedPrice)}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Profit: {fmt(profit)} ({margin}% margin)</div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Actual sale price (₦) — what you charge the client</label>
            <input type="number" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder={"e.g. "+suggestedPrice} style={{...iSt,fontSize:18,fontWeight:600,color:"var(--gold)",textAlign:"center"}}/>
            {salePrice&&+salePrice!==suggestedPrice&&<div style={{fontSize:11,color:+salePrice>suggestedPrice?"#357A52":"#B03A2E",marginTop:3,textAlign:"center"}}>{+salePrice>suggestedPrice?"▲ Above suggested":"▼ Below suggested"} by {fmt(Math.abs(+salePrice-suggestedPrice))}</div>}
          </div>

          <Btn full onClick={()=>{
            if(!clientName.trim()){alert("Please enter a client name at the top of the page");return}
            // Generate summaries based on product type
            let flavourSummary=""
            let cakeSummary=""
            if(productType==="Cake"||productType==="Cupcakes"){
              flavourSummary=tiers.flatMap(t=>t.layers.map(l=>l.flavour)).filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(", ")
              cakeSummary=tiers.map((t,i)=>`${t.size}" ${t.shape} (${t.layers.map(l=>l.flavour||"?").join("/")})`).join(" + ")
            } else if(productType==="Donuts"){
              flavourSummary=donutGroups.map(g=>g.flavour||"?").filter((v,i,a)=>a.indexOf(v)===i).join(", ")
              cakeSummary=donutGroups.map(g=>`${g.qty} ${g.flavour||"?"} donuts${g.filling?" ("+g.filling+" filling)":""}`).join(", ")
            } else if(productType==="Cake Loaf"){
              flavourSummary=loaves.map(l=>l.flavour||"?").filter((v,i,a)=>a.indexOf(v)===i).join(", ")
              cakeSummary=loaves.length+" loaf"+( loaves.length>1?"ves":"")+" ("+loaves.map(l=>l.flavour||"?").join(", ")+")"
            } else if(productType==="Tarts / Pastry"){
              flavourSummary=tartFillings.filter(f=>f.type).map(f=>f.type).join(", ")
              cakeSummary=tartQty+" tart shells"+( tartFillings.filter(f=>f.type).length?" — "+tartFillings.filter(f=>f.type).map(f=>f.type).join(", "):"")
            }
            const co=loadCompany()
            const quote={
              id:uid(),
              clientName:clientName.trim(),
              clientPhone,
              date:new Date().toISOString().slice(0,10),
              productType,tiers,accRows,topper,decQty,
              donutGroups,loaves,tartQty,tartFillings,tartGarnish,
              cakePhoto:cakePhoto||null,
              totalCost,quotePrice:suggestedPrice,salePrice:+salePrice||suggestedPrice,margin,
              cakeSummary,flavourSummary,
              notes:clientNotes,
              deliveryDate,
              status:"pending",
              bankName:co.bankName||"",
              bankAccount:co.bankAccount||"",
              bankAccountName:co.bankAccountName||"",
              businessName:co.name||"Fayvouree Cakes",
            }
            const existing=loadQuotes()
            const updated=isEdit&&editId
              ?existing.map(q=>q.id===editId?{...quote,id:editId,status:q.status}:q)
              :[quote,...existing]
            saveQuotes(updated)
            localStorage.removeItem("ll_calc_state")
            setQuoteSaved(true)
          }}>{isEdit?"💬 Update quote":"💬 Generate & save quote"}</Btn>
          {quoteSaved
            ?<div style={{marginTop:10,background:"#E1F5EE",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:13,fontWeight:500,color:"#085041",marginBottom:8}}>✓ Quote saved for {clientName}!</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <button onClick={()=>{
                  const phone=clientPhone.replace(/[^0-9]/g,"").replace(/^0/,"234")
                  const tierText=tiers.map((t,i)=>`Tier ${i+1}: ${t.size}" ${t.shape} - ${t.layers.map(l=>l.flavour||"?").join("/")}${t.coverings?.length?" - Covering: "+t.coverings.map(c=>c.type).join(", "):"" }`).join("\n")
                  const msg="Hello "+clientName+"! Cake quote:\n\n"+tierText+"\n\nQuote price: N"+suggestedPrice.toLocaleString()+"\n\n"+(clientNotes||"")+"\n\nPlease confirm to proceed. Deposit required. Thank you for choosing Fayvouree Cakes!"
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank")
                }} style={{padding:"7px",borderRadius:8,border:"none",background:"#25D366",color:"#fff",cursor:"pointer",fontSize:12.5,fontFamily:"inherit",fontWeight:500}}>📱 Send quote via WhatsApp</button>
                <button onClick={()=>setView("quotes")} style={{padding:"7px",borderRadius:8,border:"none",background:"var(--gold)",color:"#fff",cursor:"pointer",fontSize:12.5,fontFamily:"inherit"}}>📋 View all quotes</button>
                <button onClick={()=>{setQuoteSaved(false);setIsEdit(false);setEditId(null);setClientName("");setClientPhone("");setClientNotes("");localStorage.removeItem("ll_calc_state")}} style={{padding:"7px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontSize:12.5,fontFamily:"inherit"}}>🧮 Start new quote</button>
              </div>
            </div>
            :<div style={{marginTop:6,fontSize:11.5,color:"var(--muted)",textAlign:"center"}}>Quote will be saved under client name</div>
          }
        </Card>
      </div>
    </div>
  </div>
}


const DEFAULT_MULTS={"4-round":0.5,"4-square":0.6,"4-sheet":0.8,"5-round":0.7,"5-square":0.85,"5-sheet":0.9,"6-round":1.0,"6-square":1.2,"6-sheet":1.3,"7-round":1.4,"7-square":1.65,"7-sheet":1.7,"8-round":1.8,"8-square":2.15,"8-sheet":2.2,"9-round":2.3,"9-square":2.75,"9-sheet":2.8,"10-round":2.8,"10-square":3.35,"10-sheet":3.4,"12-round":4.0,"12-square":4.8,"12-sheet":4.9,"14-round":5.5,"14-square":6.6,"14-sheet":6.7}
const DEFAULT_COVERINGS=[{name:"Naked",cost:0,scales:false},{name:"Buttercream",cost:2500,scales:true},{name:"Fondant",cost:4500,scales:true},{name:"Drip",cost:3000,scales:true},{name:"Whipped Cream",cost:2000,scales:true},{name:"Mirror Glaze",cost:5500,scales:true}]
const DEFAULT_ACCESSORIES=[{id:"acc1",name:"Cake board",cost:500,per:"tier"},{id:"acc2",name:"Cake box",cost:800,per:"order"},{id:"acc3",name:"Dowels/support",cost:300,per:"tier"},{id:"acc4",name:"Cake drum",cost:1200,per:"order"}]
const PRICING_SIZES=["4","5","6","7","8","9","10","12","14"]
const SHAPES=["round","square","sheet"]
function PricingSetup({settings,setSetting}){
  const [ptab,setPtab]=useState("mults")
  const [mults,setMults]=useState(()=>{try{return JSON.parse(localStorage.getItem("ll_multipliers")||"null")||DEFAULT_MULTS}catch{return DEFAULT_MULTS}})
  const [coverings,setCoverings]=useState(()=>{try{return JSON.parse(localStorage.getItem("ll_coverings")||"null")||DEFAULT_COVERINGS}catch{return DEFAULT_COVERINGS}})
  const [accessories,setAccessories]=useState(()=>{try{return JSON.parse(localStorage.getItem("ll_accessories")||"null")||DEFAULT_ACCESSORIES}catch{return DEFAULT_ACCESSORIES}})
  const [newCov,setNewCov]=useState("")
  const [newAcc,setNewAcc]=useState({name:"",cost:"",per:"order"})
  const [saved,setSaved]=useState("")

  const saveMults=()=>{localStorage.setItem("ll_multipliers",JSON.stringify(mults));setSaved("mults");setTimeout(()=>setSaved(""),2000)}
  const saveCoverings=()=>{localStorage.setItem("ll_coverings",JSON.stringify(coverings));setSaved("covs");setTimeout(()=>setSaved(""),2000)}
  const saveAccessories=()=>{localStorage.setItem("ll_accessories",JSON.stringify(accessories));setSaved("accs");setTimeout(()=>setSaved(""),2000)}

  const tabs=[{v:"mults",l:"Size multipliers"},{v:"margins",l:"Profit margins"}]

  return <div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
      {tabs.map(t=><button key={t.v} onClick={()=>setPtab(t.v)} style={{padding:"6px 14px",borderRadius:8,fontSize:12.5,cursor:"pointer",border:ptab===t.v?"none":"1px solid var(--border)",background:ptab===t.v?"var(--gold)":"transparent",color:ptab===t.v?"#fff":"var(--muted)",fontFamily:"inherit"}}>{t.l}</button>)}
    </div>

    {/* SIZE MULTIPLIERS */}
    {ptab==="mults"&&<div>
      <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:14,lineHeight:1.7}}>Each recipe is written for a 6" round (= 1.0 base). Set multipliers for every size and shape so the recipe calculator scales ingredients and costs correctly.</div>
      <div style={{overflowX:"auto",marginBottom:12}}>
        <table style={{borderCollapse:"collapse",fontSize:12.5,minWidth:480}}>
          <thead><tr style={{background:"#EDE5D6"}}>
            <th style={{padding:"8px 10px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:.8,color:"var(--muted)",fontWeight:500,width:60}}>Size</th>
            {SHAPES.map(s=><th key={s} style={{padding:"8px 10px",textAlign:"center",fontSize:10,textTransform:"uppercase",letterSpacing:.8,color:"var(--muted)",fontWeight:500,width:80}}>{s}</th>)}
          </tr></thead>
          <tbody>{PRICING_SIZES.map((size,si)=><tr key={size} style={{background:si%2===0?"var(--panel)":"#F8F3EA"}}>
            <td style={{padding:"6px 10px",fontWeight:500}}>{size}"</td>
            {SHAPES.map(shape=>{
              const key=`${size}-${shape}`
              const isBase=size==="6"&&shape==="round"
              return <td key={shape} style={{padding:"4px 6px",textAlign:"center"}}>
                <input type="number" step="0.1" min="0.1" value={mults[key]||""} disabled={isBase}
                  onChange={e=>setMults(m=>({...m,[key]:parseFloat(e.target.value)||0}))}
                  style={{...iSt,width:64,textAlign:"center",padding:"4px 6px",fontSize:12,background:isBase?"#EDE5D6":"var(--panel)",color:isBase?"var(--muted)":"var(--text)"}}/>
              </td>
            })}
          </tr>)}</tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Btn onClick={saveMults}>Save multipliers</Btn>
        {saved==="mults"&&<span style={{fontSize:12.5,color:"#357A52"}}>✓ Saved</span>}
      </div>
    </div>}

    {/* COVERING COSTS */}
    {ptab==="coverings"&&<div>
      <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:14,lineHeight:1.7}}>Set the cost per layer for each covering at the 6" base size. If "Scales with size" is on, the cost multiplies with the size multiplier automatically.</div>
      <Card style={{padding:0,overflowX:"auto",marginBottom:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <TH cols={["Covering","Cost/layer at 6\" base (₦)","Scales with size",""]}/>
          <tbody>{coverings.map((c,i)=><TR2 key={i} i={i} row={[
            <span style={{fontWeight:500}}>{c.name}</span>,
            <input type="number" value={c.cost} disabled={c.name==="Naked"} onChange={e=>setCoverings(cv=>cv.map((x,j)=>j===i?{...x,cost:+e.target.value}:x))} style={{...iSt,width:100,padding:"4px 8px",fontSize:12,textAlign:"right"}}/>,
            <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12.5}}>
              <input type="checkbox" checked={c.scales} onChange={e=>setCoverings(cv=>cv.map((x,j)=>j===i?{...x,scales:e.target.checked}:x))}/>
              Yes
            </label>,
            <Btn small variant="danger" onClick={()=>setCoverings(cv=>cv.filter((_,j)=>j!==i))}>×</Btn>
          ]}/>)}</tbody>
        </table>
      </Card>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <Inp label="" value={newCov} onChange={setNewCov} placeholder="New covering name e.g. Mirror Glaze"/>
        <Btn onClick={()=>{if(newCov.trim()){setCoverings(c=>[...c,{name:newCov.trim(),cost:0,scales:true}]);setNewCov("")}}}>+ Add</Btn>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Btn onClick={saveCoverings}>Save coverings</Btn>
        {saved==="covs"&&<span style={{fontSize:12.5,color:"#357A52"}}>✓ Saved</span>}
      </div>
    </div>}

    {/* ACCESSORIES */}
    {ptab==="accessories"&&<div>
      <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:14,lineHeight:1.7}}>Set costs for cake boards, boxes and accessories. These are added per order in the order calculator. "Per tier" items multiply by number of tiers.</div>
      <Card style={{padding:0,overflowX:"auto",marginBottom:12}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <TH cols={["Item","Cost (₦)","Per","Actions"]}/>
          <tbody>{accessories.map((a,i)=><TR2 key={a.id} i={i} row={[
            <span style={{fontWeight:500}}>{a.name}</span>,
            <input type="number" value={a.cost} onChange={e=>setAccessories(ac=>ac.map((x,j)=>j===i?{...x,cost:+e.target.value}:x))} style={{...iSt,width:90,padding:"4px 8px",fontSize:12}}/>,
            <span style={{fontSize:11.5,background:"#F5F0E4",padding:"2px 9px",borderRadius:20,color:"var(--muted)"}}>{a.per==="tier"?"per tier":"per order"}</span>,
            <Btn small variant="danger" onClick={()=>setAccessories(ac=>ac.filter((_,j)=>j!==i))}>×</Btn>
          ]}/>)}</tbody>
        </table>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:12,alignItems:"end"}}>
        <Inp label="Item name" value={newAcc.name} onChange={v=>setNewAcc(p=>({...p,name:v}))} placeholder="e.g. Cake dowels"/>
        <Inp label="Cost (₦)" type="number" value={newAcc.cost} onChange={v=>setNewAcc(p=>({...p,cost:v}))} placeholder="500"/>
        <div><label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Per</label>
          <select value={newAcc.per} onChange={e=>setNewAcc(p=>({...p,per:e.target.value}))} style={{...iSt}}>
            <option value="order">Per order</option><option value="tier">Per tier</option>
          </select></div>
        <Btn onClick={()=>{if(newAcc.name.trim()){setAccessories(a=>[...a,{id:uid(),name:newAcc.name.trim(),cost:+newAcc.cost||0,per:newAcc.per}]);setNewAcc({name:"",cost:"",per:"order"})}}}>+ Add</Btn>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Btn onClick={saveAccessories}>Save accessories</Btn>
        {saved==="accs"&&<span style={{fontSize:12.5,color:"#357A52"}}>✓ Saved</span>}
      </div>
    </div>}

    {/* PROFIT MARGINS */}
    {ptab==="margins"&&<div style={{maxWidth:480}}>
      <Card style={{marginBottom:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Default profit margin</div>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"12px 0"}}>
          <input type="range" min={10} max={80} value={settings.profitPct||40} onChange={e=>setSetting("profitPct",+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--gold)",minWidth:46}}>{settings.profitPct||40}%</div>
        </div>
        <div style={{padding:"8px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,color:"var(--muted)"}}>If a cake costs ₦31,888 to make, suggested price: <strong style={{color:"var(--text)"}}>{fmt(Math.round(31888/(1-(settings.profitPct||40)/100)))}</strong></div>
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Accessory percentage</div>
        <p style={{fontSize:12.5,color:"var(--muted)",marginTop:0,lineHeight:1.7}}>Added to ingredient costs to cover cling film, greaseproof paper, electricity and small items not measured per recipe.</p>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"12px 0"}}>
          <input type="range" min={0} max={30} value={settings.accessoryPct||10} onChange={e=>setSetting("accessoryPct",+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--gold)",minWidth:46}}>{settings.accessoryPct||10}%</div>
        </div>
      </Card>
    </div>}
  </div>
}

// ═══════════════════════════════════════════════════════════
//  ONBOARDING (first-time setup checklist)
// ═══════════════════════════════════════════════════════════
function Onboarding({gold,onComplete,onSkip,setView}){
  const [done,setDone]=useState(new Set())
  const pct=Math.round((done.size/4)*100)
  const [open,setOpen]=useState(1)

  const steps=[
    {id:1,title:"Add your inventory",sub:"Add all your ingredients with unit and cost per unit. Paste from Excel or add one by one.",time:"Required first",view:"masterlist",hint:"Master List → Inventory"},
    {id:2,title:"Set up your recipes",sub:"Add one recipe per flavour — Vanilla, Red Velvet, Chocolate etc. Quantities are per single layer.",time:"~5 mins",view:"masterlist",hint:"Master List → Base Recipes"},
    {id:3,title:"Set opening stock",sub:"Enter how much of each ingredient you have right now. This locks as your starting point.",time:"~2 mins",view:"settings",hint:"Settings → Opening Stock"},
    {id:4,title:"Log your first production order",sub:"Upload a cake photo, fill in the details and confirm. Watch the app calculate costs automatically.",time:"~3 mins",view:"production",hint:"New Production"},
  ]

  const markDone=(id,e)=>{
    e?.stopPropagation()
    const nd=new Set(done);nd.add(id);setDone(nd)
    if(id<4)setTimeout(()=>setOpen(id+1),300)
    else setTimeout(onComplete,500)
  }

  return <div style={{minHeight:"100vh",background:"#F4EEE4",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'DM Sans',sans-serif"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');*{box-sizing:border-box}body{margin:0}:root{--gold:${gold};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB}`}</style>
    <div style={{width:"100%",maxWidth:500}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:32,marginBottom:8}}>🎂</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:"var(--text)",marginBottom:6}}>Welcome to LayerLedger</div>
        <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.7}}>Complete these 4 steps to get set up — takes about 10 minutes and you only do it once.</div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",marginBottom:5}}>
        <span>{done.size} of 4 steps complete</span><span>{pct}%</span>
      </div>
      <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden",marginBottom:20}}>
        <div style={{height:"100%",width:pct+"%",background:gold,borderRadius:3,transition:"width 0.4s"}}/>
      </div>

      {steps.map(s=>{
        const isDone=done.has(s.id)
        const isOpen=open===s.id&&!isDone
        return <div key={s.id} onClick={()=>!isDone&&setOpen(s.id)} style={{background:isDone?"#F8F3EA":isOpen?"#FFF9EE":"var(--panel)",border:`1px solid ${isOpen?gold:"var(--border)"}`,borderRadius:12,padding:"14px 18px",marginBottom:10,cursor:isDone?"default":"pointer",transition:"all 0.15s"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,background:isDone?"#357A52":isOpen?gold:"var(--border)",color:isDone||isOpen?"#fff":"var(--muted)",flexShrink:0}}>{isDone?"✓":s.id}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:14,fontWeight:500,color:"var(--text)",textDecoration:isDone?"line-through":""}}>{s.title}</div>
                <span style={{fontSize:10.5,color:isOpen?gold:"var(--muted)",background:isOpen?"#FDF2DC":"var(--border)",padding:"2px 8px",borderRadius:20,marginLeft:8,whiteSpace:"nowrap"}}>{s.time}</span>
              </div>
              {isOpen&&<div style={{fontSize:12.5,color:"var(--muted)",marginTop:4,lineHeight:1.6}}>{s.sub}</div>}
            </div>
          </div>
          {isOpen&&<div style={{marginTop:12,paddingTop:10,borderTop:"1px solid var(--border)",display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={e=>{e.stopPropagation();setView(s.view)}} style={{fontSize:12,padding:"6px 16px",borderRadius:8,border:"none",background:gold,cursor:"pointer",color:"#fff"}}>Go to {s.hint} →</button>
            <button onClick={e=>markDone(s.id,e)} style={{fontSize:12,padding:"6px 14px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",cursor:"pointer",color:"var(--muted)"}}>Mark as done ✓</button>
          </div>}
        </div>
      })}

      {done.size===4&&<div style={{background:"#E8F5EE",border:"1px solid #C2E0CF",borderRadius:12,padding:20,textAlign:"center",marginTop:4}}>
        <div style={{fontSize:14,fontWeight:500,color:"#357A52",marginBottom:6}}>✓ All set! LayerLedger is ready.</div>
        <button onClick={onComplete} style={{fontSize:13,padding:"7px 22px",borderRadius:8,border:"none",background:"#357A52",cursor:"pointer",color:"#fff"}}>Go to Dashboard →</button>
      </div>}

      <div style={{textAlign:"center",marginTop:14}}>
        <span onClick={onSkip} style={{fontSize:12,color:"var(--muted)",cursor:"pointer",textDecoration:"underline"}}>Skip — I'll set up later</span>
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  PURCHASES (links cost/unit to inventory)
// ═══════════════════════════════════════════════════════════
function Purchases({inventory,setInventory,expenses,setExpenses}){
  const [showForm,setShowForm]=useState(false)
  const [purchases,setPurchases]=useState(()=>{try{return JSON.parse(localStorage.getItem("ll_purchases")||"[]")}catch{return[]}})
  const [f,setF]=useState({item:"",unit:"",unitSize:"",qty:"",price:"",date:new Date().toISOString().slice(0,10)})

  const savePurchases=(p)=>{setPurchases(p);localStorage.setItem("ll_purchases",JSON.stringify(p))}

  const cpu=f.price&&f.unitSize?parseFloat((+f.price/(+f.unitSize||1)).toFixed(2)):0
  const total=f.price&&f.qty?Math.round(+f.price*(+f.qty)):0
  const stockAdded=f.unitSize&&f.qty?parseFloat(((+f.unitSize)*(+f.qty)).toFixed(3)):0

  const selItem=inventory.find(i=>i.id===f.item)

  const log=async()=>{
    if(!f.item||!f.unitSize||!f.qty||!f.price)return alert("All fields are required")
    // 1. Update cost/unit in inventory
    const updInv=inventory.map(i=>i.id===f.item?{...i,cost:cpu,stock:parseFloat((i.stock+stockAdded).toFixed(3))}:i)
    setInventory(updInv);await saveInventory(updInv)
    // 2. Log as expense
    const exp={id:uid(),date:f.date,description:`Purchase: ${selItem?.name||f.item}`,amount:total,category:"Ingredients",paymentMethod:"transfer",source:"purchase",notes:`${f.qty}×${f.unitSize}${selItem?.unit||""} @ ₦${(+f.price).toLocaleString()} — cost/unit updated to ${fmt(cpu)}`}
    const updExp=[exp,...expenses];setExpenses(updExp);saveExpenses(updExp)
    // 3. Log purchase record
    const rec={id:uid(),date:f.date,itemId:f.item,item:selItem?.name||"",unit:selItem?.unit||"",unitSize:+f.unitSize,qty:+f.qty,price:+f.price,total,cpu,stockAdded}
    savePurchases([rec,...purchases])
    setF({item:"",unit:"",unitSize:"",qty:"",price:"",date:new Date().toISOString().slice(0,10)})
    setShowForm(false)
  }

  const thisMonth=new Date().toISOString().slice(0,7)
  const monthTotal=purchases.filter(p=>p.date?.startsWith(thisMonth)).reduce((s,p)=>s+(p.total||0),0)

  return <div>
    <SHead title="Purchases" sub="Log every ingredient purchase — cost per unit updates inventory automatically."/>
    <div style={{background:"#E8EFFC",border:"1px solid #B5D4F4",borderRadius:8,padding:"10px 14px",fontSize:12.5,color:"#185FA5",marginBottom:14,lineHeight:1.7}}>
      🔗 When you log a purchase here, the <strong>Cost/Unit</strong> in your Inventory and Opening Stock updates automatically. No manual changes needed anywhere.
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
      <Card style={{padding:"12px 14px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>This month</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text)"}}>{fmt(monthTotal)}</div></Card>
      <Card style={{padding:"12px 14px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Purchases logged</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text)"}}>{purchases.length}</div></Card>
      <Card style={{padding:"12px 14px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Items updated</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#357A52"}}>{new Set(purchases.map(p=>p.itemId)).size}</div></Card>
    </div>

    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
      <Btn onClick={()=>setShowForm(s=>!s)}>+ Log Purchase</Btn>
    </div>

    {showForm&&<Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Log New Purchase</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:10,marginBottom:12}}>
        <div>
          <label style={{fontSize:10,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:.8,fontWeight:500}}>Item *</label>
          <select value={f.item} onChange={e=>setF(p=>({...p,item:e.target.value}))} style={{...iSt}}>
            <option value="">— Select item —</option>
            {inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
          </select>
        </div>
        <Inp label="Pack size *" type="number" value={f.unitSize} onChange={v=>setF(p=>({...p,unitSize:v}))} placeholder={`e.g. 50`}/>
        <Inp label="Qty bought *" type="number" value={f.qty} onChange={v=>setF(p=>({...p,qty:v}))} placeholder="e.g. 3"/>
        <Inp label="Price / pack (₦) *" type="number" value={f.price} onChange={v=>setF(p=>({...p,price:v}))} placeholder="e.g. 57000"/>
        <Inp label="Date" type="date" value={f.date} onChange={v=>setF(p=>({...p,date:v}))}/>
      </div>
      {cpu>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
        {[{l:"Total spent",v:fmt(total),c:"var(--text)"},{l:"Stock to add",v:`+${stockAdded} ${selItem?.unit||""}`,c:"#357A52"},{l:"New cost/unit → Inventory",v:`${fmt(cpu)}/${selItem?.unit||"unit"}`,c:"var(--gold)"}].map(s=><div key={s.l} style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{s.l}</div><div style={{fontSize:15,fontWeight:600,color:s.c}}>{s.v}</div></div>)}
      </div>}
      <div style={{display:"flex",gap:8}}>
        <Btn variant="success" onClick={log} disabled={!f.item||!f.unitSize||!f.qty||!f.price}>✓ Log Purchase & Update Inventory</Btn>
        <Btn variant="ghost" onClick={()=>setShowForm(false)}>Cancel</Btn>
      </div>
    </Card>}

    <Card style={{padding:0,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <TH cols={["Date","Item","Unit","Pack size","Qty","Price/pack","Total","Cost/unit ✦","Status"]}/>
        <tbody>{purchases.length===0?<tr><td colSpan={9} style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No purchases logged yet. Click + Log Purchase to start.</td></tr>:
          purchases.map((p,i)=><TR2 key={p.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{p.date}</span>,
            <span style={{fontWeight:500}}>{p.item}</span>,
            <span style={{color:"var(--muted)"}}>{p.unit}</span>,
            <span>{p.unitSize} {p.unit}</span>,
            <span>{p.qty}</span>,
            fmt(p.price),
            <span style={{fontWeight:500}}>{fmt(p.total)}</span>,
            <span style={{color:"var(--gold)",fontWeight:500}}>{fmt(p.cpu)}/{p.unit}</span>,
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,background:"#E8EFFC",color:"#2355A0",padding:"2px 8px",borderRadius:20,fontWeight:500}}>🔗 Updated</span>,
          ]}/>)
        }</tbody>
      </table>
    </Card>
    <div style={{marginTop:8,fontSize:11.5,color:"var(--muted)"}}>✦ Cost/unit = Price per pack ÷ Pack size. Updates inventory and opening stock immediately.</div>
  </div>
}

// ═══════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════
export class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={error:null,stack:null}}
  static getDerivedStateFromError(error){return{error:error?.toString(),stack:error?.stack||""}}
  render(){
    if(this.state.error)return React.createElement("div",{style:{padding:40,fontFamily:"monospace",background:"#fff",color:"#333"}},
      React.createElement("h2",{style:{color:"red"}},"App crashed — share this error with Claude:"),
      React.createElement("pre",{style:{background:"#f5f5f5",padding:16,borderRadius:8,overflow:"auto",fontSize:12,whiteSpace:"pre-wrap"}},this.state.error+" "+this.state.stack)
    )
    return this.props.children
  }
}

export default function App(){
  const [currentUser, setCurrentUser] = useState(null)
  const [view,setView]=useState("dashboard")
  const [viewHistory,setViewHistory]=useState(["dashboard"])
  const goTo=(v)=>{setViewHistory(h=>[...h.slice(-9),v]);setView(v)}
  const goBack=()=>{setViewHistory(h=>{if(h.length<=1)return h;const prev=h[h.length-2];setView(prev);return h.slice(0,-1)});}
  const [onboarded,setOnboarded]=useState(()=>!!localStorage.getItem("ll_onboarded"))
  const [inventory,setInventory]=useState(DEFAULT_INV)
  const [recipes,setRecipes]=useState(()=>{const saved=loadRecipes();return saved&&saved.length>0?saved:DEFAULT_RECIPES})
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

  const gold=company.primaryColor||"var(--gold)"
  const sidebar=company.sidebarColor||"var(--sidebar)"

  // Apply brand colour globally — must be before any conditional returns
  useEffect(()=>{
    document.documentElement.style.setProperty("--gold",gold)
    document.documentElement.style.setProperty("--sidebar",sidebar)
  },[gold,sidebar])

  const role=currentUser?.role||"owner"
  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"◈",roles:["owner","production","customer_service"]},
    {id:"_ops",label:"Operations",icon:"",roles:["owner","production","customer_service"],divider:true},
    {id:"masterlist",label:"Master List",icon:"⚙",roles:["owner","production"]},
    {id:"calculator",label:"Order Calculator",icon:"🧮",roles:["owner","production"]},

    {id:"receipts",label:"Receipt Scanner",icon:"🧾",roles:["owner","production"]},
    {id:"shopping",label:"Shopping List",icon:"🛒",roles:["owner","production"]},
    {id:"quotes",label:"Quotes",icon:"💬",roles:["owner","customer_service"]},
    {id:"records",label:"Records",icon:"≡",roles:["owner","customer_service"]},
    {id:"prodlist",label:"Production List",icon:"📅",roles:["owner","production"]},
    {id:"invoices",label:"Invoices",icon:"📄",roles:["owner","customer_service"]},
    {id:"_accounts",label:"Accounts",icon:"",roles:["owner"],divider:true},
    {id:"purchases",label:"Purchases",icon:"🛍",roles:["owner"]},
    {id:"expenses",label:"Expenses",icon:"💸",roles:["owner"]},
    {id:"bank",label:"Bank Import",icon:"⊞",roles:["owner"]},
    {id:"_reports",label:"Reports",icon:"",roles:["owner"],divider:true},
    {id:"monthly",label:"Monthly Overview",icon:"📊",roles:["owner"]},
    {id:"pandl",label:"P&L Statement",icon:"📑",roles:["owner"]},
    {id:"_system",label:"System",icon:"",roles:["owner","production","customer_service"],divider:true},
    {id:"settings",label:"Settings",icon:"⚙",roles:["owner"]},
  ].filter(n=>n.roles.includes(role))

  const goTo2=(id)=>{goTo(id);setSidebarOpen(false)}

  if(!currentUser){
    return <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');*{box-sizing:border-box}body{margin:0}:root{--gold:${gold};--sidebar:${sidebar};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB;--accent:${gold}}
.main-content{color:var(--text)}
.main-content h1,.main-content h2,.main-content h3{color:var(--text)}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Login onLogin={(u)=>{setCurrentUser(u);saveSetting("lastUser",u.id);if(!localStorage.getItem("ll_onboarded"))setOnboarded(false)}}/>
    </>
  }

  // Show onboarding for first-time users
  if(currentUser&&!onboarded){
    return <Onboarding
      gold={gold}
      onComplete={()=>{localStorage.setItem("ll_onboarded","1");setOnboarded(true)}}
      onSkip={()=>{localStorage.setItem("ll_onboarded","1");setOnboarded(true)}}
      setView={v=>{localStorage.setItem("ll_onboarded","1");setOnboarded(true);setView(v)}}
    />
  }

  const sidebarContent = <>
    <div style={{padding:"18px 16px 14px",borderBottom:"1px solid rgba(200,145,42,0.2)",display:"flex",alignItems:"center",gap:10}}>
      {company.logo&&<img src={company.logo} alt="logo" style={{width:30,height:30,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
      <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:gold,fontWeight:700,lineHeight:1.2}}>{company.name||"LayerLedger"}</div><div style={{fontSize:9,color:"#7B5A3A",textTransform:"uppercase",letterSpacing:2,marginTop:1}}>Bakery Books</div></div>
    </div>
    <div style={{flex:1,paddingTop:8,overflowY:"auto"}}>
      {nav.map(n=>n.divider
        ?<div key={n.id} style={{padding:"10px 16px 4px",fontSize:9.5,color:"#5A3D20",textTransform:"uppercase",letterSpacing:1.5,fontWeight:600,marginTop:4}}>{n.label}</div>
        :<div key={n.id} onClick={()=>goTo2(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:view===n.id?500:400,color:view===n.id?gold:"#8B6B4A",background:view===n.id?"rgba(200,145,42,0.1)":"transparent",borderLeft:`2px solid ${view===n.id?gold:"transparent"}`,transition:"all 0.15s"}}><span style={{fontSize:14}}>{n.icon}</span>{n.label}</div>
      )}
    </div>
    <div style={{padding:"10px 16px",borderTop:"1px solid rgba(200,145,42,0.1)"}}>
      {viewHistory.length>1&&<div onClick={goBack} style={{cursor:"pointer",color:gold,marginBottom:6,display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:500}}>← Back</div>}
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
      :root{--gold:${gold};--sidebar:${sidebar};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB;--accent:${gold}}
      @keyframes spin{to{transform:rotate(360deg)}}
    `}</style>
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",overflow:"hidden"}}>

      {/* Desktop sidebar */}
      {!isMobile&&<div style={{width:200,background:"var(--sidebar)",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh"}}>{sidebarContent}</div>}

      {/* Mobile sidebar overlay */}
      {isMobile&&sidebarOpen&&<div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
        <div style={{width:220,background:"var(--sidebar)",display:"flex",flexDirection:"column",height:"100%"}}>{sidebarContent}</div>
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

        <div className="main-content" style={{padding:isMobile?"14px":"24px 26px",flex:1,overflowY:"auto",color:"var(--text)"}}>
          {loading?<Spinner/>:<>
            {view==="dashboard"  &&<Dashboard productions={productions} inventory={inventory} expenses={expenses} setView={setView} user={currentUser}/>}
            {view==="masterlist" &&<MasterList inventory={inventory} setInventory={setInventory} recipes={recipes} setRecipes={setRecipes} user={currentUser} setView={setView}/>}
            {view==="calculator"  &&<OrderCalculator inventory={inventory} recipes={recipes} settings={settings} setView={setView} company={company}/>}
            {view==="production" &&<ProductionEntry inventory={inventory} setInventory={setInventory} recipes={recipes} productions={productions} setProductions={setProductions} settings={settings} setView={setView} user={currentUser}/>}
            {view==="receipts"   &&<ReceiptScanner inventory={inventory} setInventory={setInventory} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="purchases"  &&<Purchases inventory={inventory} setInventory={setInventory} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="expenses"   &&<Expenses expenses={expenses} setExpenses={setExpenses}/>}
            {view==="quotes"     &&<QuotesPage inventory={inventory} setInventory={setInventory} recipes={recipes} setView={setView} productions={productions} setProductions={setProductions}/>}
            {view==="records"    &&<Records productions={productions} setProductions={setProductions} setView={setView} setPrefillProd={setPrefillProd} user={currentUser}/>}
            {view==="prodlist"   &&<ProductionList productions={productions} company={company} setView={setView}/>}
            {view==="bank"       &&<BankImport transactions={transactions} setTransactions={setTransactions} productions={productions} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="monthly"    &&<MonthlyOverview inventory={inventory} productions={productions} expenses={expenses} company={company}/>}
            {view==="pandl"      &&<PandL productions={productions} expenses={expenses} company={company}/>}
            {view==="shopping"   &&<ShoppingList inventory={inventory} company={company}/>}
            {view==="invoices"   &&<Invoices productions={productions} company={company} prefillProd={prefillProd} setPrefillProd={setPrefillProd}/>}
            {view==="settings"   &&<Settings company={company} setCompany={setCompany} settings={settings} setSettings={setSettings} users={users} setUsers={setUsers} inventory={inventory}/>}
          </>}
        </div>
      </div>
    </div>
  </>
}
