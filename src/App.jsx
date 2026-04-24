import { useState, useRef, useEffect } from "react"
import { loadInventory, saveInventory, loadProductions, saveProduction,
         updateProductionStatus, loadTransactions, saveTransactions,
         loadSetting, saveSetting } from "./lib/data.js"

// ══════════════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════════════
const T = {
  bg:"#F4EEE4",panel:"#FDFAF4",sidebar:"#140801",
  gold:"#C8912A",text:"#291608",muted:"#8C6E52",border:"#E0D3BB",
  success:"#357A52",danger:"#B03A2E",info:"#2A5F9A",
}
const fmt = n => `₦${Math.round(n||0).toLocaleString("en")}`
const uid = () => "_"+Math.random().toString(36).slice(2,9)
const today = () => new Date().toISOString().slice(0,10)

// ── Secure API call (goes through Netlify function → Anthropic) ──
async function callClaude(messages, system="") {
  const endpoint = import.meta.env.DEV
    ? "https://api.anthropic.com/v1/messages"  // local dev only
    : "/api/claude"                              // production via Netlify proxy

  const headers = { "Content-Type": "application/json" }
  // Only add API key in dev mode (from .env)
  if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_KEY) {
    headers["x-api-key"] = import.meta.env.VITE_ANTHROPIC_KEY
    headers["anthropic-version"] = "2023-06-01"
  }

  const res = await fetch(endpoint, {
    method:"POST", headers,
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.[0]?.text || ""
}

// ══════════════════════════════════════════════════════════════
//  MASTER DATA (defaults — overridden by database on load)
// ══════════════════════════════════════════════════════════════
const DEFAULT_INV = [
  {id:"i1",name:"All-Purpose Flour",cat:"Dry Goods",unit:"kg",cost:2500,stock:10},
  {id:"i2",name:"Sugar",cat:"Dry Goods",unit:"kg",cost:1800,stock:8},
  {id:"i3",name:"Butter",cat:"Dairy",unit:"kg",cost:4500,stock:5},
  {id:"i4",name:"Eggs",cat:"Dairy",unit:"pcs",cost:120,stock:50},
  {id:"i5",name:"Milk",cat:"Dairy",unit:"L",cost:800,stock:5},
  {id:"i6",name:"Fondant",cat:"Coverings",unit:"kg",cost:6000,stock:2.5},
  {id:"i7",name:"Buttercream Mix",cat:"Coverings",unit:"kg",cost:3500,stock:4},
  {id:"i8",name:"Cake Boards",cat:"Packaging",unit:"pcs",cost:500,stock:18},
  {id:"i9",name:"Cake Boxes",cat:"Packaging",unit:"pcs",cost:800,stock:14},
  {id:"i10",name:"Baking Powder",cat:"Dry Goods",unit:"g",cost:5,stock:480},
  {id:"i11",name:"Vanilla Essence",cat:"Flavoring",unit:"bottle",cost:1500,stock:7},
  {id:"i12",name:"Food Coloring",cat:"Decoration",unit:"set",cost:2000,stock:5},
  {id:"i13",name:"Ribbon & Accessories",cat:"Decoration",unit:"pack",cost:1200,stock:9},
  {id:"i14",name:"Cocoa Powder",cat:"Dry Goods",unit:"kg",cost:3800,stock:1.5},
  {id:"i15",name:"Strawberry Essence",cat:"Flavoring",unit:"bottle",cost:1200,stock:4},
]

const RECIPES = [
  {id:"r1",name:'6" · Buttercream',size:'6"',covering:"buttercream",ing:[{iid:"i1",qty:0.5},{iid:"i2",qty:0.4},{iid:"i3",qty:0.3},{iid:"i4",qty:4},{iid:"i5",qty:0.2},{iid:"i7",qty:0.5},{iid:"i8",qty:1},{iid:"i9",qty:1},{iid:"i10",qty:10},{iid:"i11",qty:0.1}]},
  {id:"r2",name:'6" · Fondant',size:'6"',covering:"fondant",ing:[{iid:"i1",qty:0.5},{iid:"i2",qty:0.4},{iid:"i3",qty:0.3},{iid:"i4",qty:4},{iid:"i5",qty:0.2},{iid:"i6",qty:0.8},{iid:"i8",qty:1},{iid:"i9",qty:1},{iid:"i10",qty:10},{iid:"i11",qty:0.1}]},
  {id:"r3",name:'8" · Buttercream',size:'8"',covering:"buttercream",ing:[{iid:"i1",qty:0.8},{iid:"i2",qty:0.6},{iid:"i3",qty:0.5},{iid:"i4",qty:6},{iid:"i5",qty:0.3},{iid:"i7",qty:0.8},{iid:"i8",qty:1},{iid:"i9",qty:1},{iid:"i10",qty:15},{iid:"i11",qty:0.15}]},
  {id:"r4",name:'8" · Fondant',size:'8"',covering:"fondant",ing:[{iid:"i1",qty:0.8},{iid:"i2",qty:0.6},{iid:"i3",qty:0.5},{iid:"i4",qty:6},{iid:"i5",qty:0.3},{iid:"i6",qty:1.2},{iid:"i8",qty:1},{iid:"i9",qty:1},{iid:"i10",qty:15},{iid:"i11",qty:0.15}]},
  {id:"r5",name:'10" · Buttercream',size:'10"',covering:"buttercream",ing:[{iid:"i1",qty:1.2},{iid:"i2",qty:0.9},{iid:"i3",qty:0.8},{iid:"i4",qty:9},{iid:"i5",qty:0.4},{iid:"i7",qty:1.2},{iid:"i8",qty:1},{iid:"i9",qty:1},{iid:"i10",qty:20},{iid:"i11",qty:0.2}]},
  {id:"r6",name:'2-Tier · Fondant',size:'2-tier',covering:"fondant",ing:[{iid:"i1",qty:1.5},{iid:"i2",qty:1.2},{iid:"i3",qty:1.0},{iid:"i4",qty:12},{iid:"i5",qty:0.5},{iid:"i6",qty:1.8},{iid:"i8",qty:2},{iid:"i9",qty:1},{iid:"i10",qty:25},{iid:"i11",qty:0.25},{iid:"i12",qty:0.5},{iid:"i13",qty:1}]},
  {id:"r7",name:'3-Tier · Fondant',size:'3-tier',covering:"fondant",ing:[{iid:"i1",qty:2.5},{iid:"i2",qty:2.0},{iid:"i3",qty:1.8},{iid:"i4",qty:20},{iid:"i5",qty:0.8},{iid:"i6",qty:3.0},{iid:"i8",qty:3},{iid:"i9",qty:1},{iid:"i10",qty:40},{iid:"i11",qty:0.4},{iid:"i12",qty:1},{iid:"i13",qty:2}]},
  {id:"r8",name:'Cupcakes ×12',size:'cupcakes×12',covering:"buttercream",ing:[{iid:"i1",qty:0.3},{iid:"i2",qty:0.25},{iid:"i3",qty:0.2},{iid:"i4",qty:3},{iid:"i5",qty:0.15},{iid:"i7",qty:0.3},{iid:"i9",qty:1},{iid:"i10",qty:8},{iid:"i11",qty:0.08}]},
]

const FLAVOR_EXTRAS = {
  "red velvet":[{iid:"i14",qty:0.05},{iid:"i12",qty:0.1}],
  "chocolate":[{iid:"i14",qty:0.08}],
  "strawberry":[{iid:"i15",qty:0.1}],
  "vanilla":[],"lemon":[],"carrot":[],"orange":[],
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
const recipeCost = (recipe, inv) => !recipe ? 0 :
  recipe.ing.reduce((s,i)=>{const it=inv.find(x=>x.id===i.iid);return s+(it?it.cost*i.qty:0)},0)

const calcCost = (recipe, inv, layers, flavors, pct) => {
  const base = recipeCost(recipe, inv)
  const fl = (flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
  let extra = 0
  fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const it=inv.find(x=>x.id===e.iid);if(it)extra+=it.cost*e.qty*(layers||1)}))
  return (base+extra)*(1+(pct||10)/100)
}

// ══════════════════════════════════════════════════════════════
//  SHARED UI COMPONENTS
// ══════════════════════════════════════════════════════════════
function Btn({children,onClick,variant="primary",small,full,disabled}){
  const v={primary:{bg:T.gold,color:"#fff",border:"none"},ghost:{bg:"transparent",color:T.muted,border:`1px solid ${T.border}`},success:{bg:T.success,color:"#fff",border:"none"},danger:{bg:T.danger,color:"#fff",border:"none"},outline:{bg:"transparent",color:T.gold,border:`1px solid ${T.gold}`}}[variant]||{}
  return <button onClick={onClick} disabled={disabled} style={{background:v.bg,color:v.color,border:v.border,borderRadius:8,padding:small?"6px 14px":"9px 20px",fontSize:small?12.5:13.5,fontWeight:500,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{children}</button>
}
const inputSt={width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.panel,fontSize:13.5,color:T.text,boxSizing:"border-box",outline:"none",fontFamily:"'DM Sans',sans-serif"}
function Inp({label,value,onChange,type="text",placeholder}){return<div style={{marginBottom:14}}>{label&&<label style={{fontSize:11.5,color:T.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputSt}/></div>}
function Sel({label,value,onChange,options,placeholder="— Select —"}){return<div style={{marginBottom:14}}>{label&&<label style={{fontSize:11.5,color:T.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{...inputSt,cursor:"pointer"}}><option value="">{placeholder}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>}
function Card({children,style={}}){return<div style={{background:T.panel,border:`1px solid ${T.border}`,borderRadius:12,padding:20,...style}}>{children}</div>}
function Badge({children,color="gray"}){const m={green:["#E5F4EC","#2D7A50"],gold:["#FDF2DC","#9A6C1A"],red:["#FDEBE9","#912622"],blue:["#E8EFFC","#2355A0"],gray:["#F0EBE3","#6B5B45"]}[color]||["#F0EBE3","#6B5B45"];return<span style={{background:m[0],color:m[1],borderRadius:20,padding:"3px 10px",fontSize:11.5,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>}
function Tabs({tabs,active,onChange}){return<div style={{display:"flex",gap:4,marginBottom:22,background:T.border,borderRadius:10,padding:4,width:"fit-content"}}>{tabs.map(t=><div key={t} onClick={()=>onChange(t)} style={{padding:"7px 18px",borderRadius:7,fontSize:13,fontWeight:active===t?500:400,cursor:"pointer",background:active===t?T.panel:"transparent",color:active===t?T.text:T.muted,transition:"all 0.15s"}}>{t}</div>)}</div>}
function SHead({title,sub}){return<div style={{marginBottom:26}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:25,color:T.text,fontWeight:600,margin:0}}>{title}</h1>{sub&&<p style={{color:T.muted,fontSize:13,marginTop:4,marginBottom:0}}>{sub}</p>}</div>}
function THead({cols}){return<thead><tr style={{background:"#EDE5D6"}}>{cols.map(c=><th key={c} style={{padding:"10px 14px",textAlign:"left",fontSize:10.5,textTransform:"uppercase",letterSpacing:0.8,color:T.muted,fontWeight:500,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>}
function TR({row,i}){return<tr style={{background:i%2===0?T.panel:"#F8F3EA"}}>{row.map((cell,j)=><td key={j} style={{padding:"11px 14px",fontSize:13.5,color:T.text,borderBottom:`1px solid ${T.border}`}}>{cell}</td>)}</tr>}
function Steps({steps,current}){return<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:26}}>{steps.map((s,i)=><div key={s} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:current>i+1?T.success:current===i+1?T.gold:T.border,color:current>=i+1?"#fff":T.muted,fontSize:12,fontWeight:700,flexShrink:0}}>{current>i+1?"✓":i+1}</div><span style={{fontSize:13,color:current===i+1?T.text:T.muted,fontWeight:current===i+1?500:400,marginRight:6}}>{s}</span>{i<steps.length-1&&<span style={{color:T.border,fontSize:18,marginRight:6}}>›</span>}</div>)}</div>}
function Spinner(){return<div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:40}}><div style={{width:32,height:32,border:`3px solid ${T.border}`,borderTopColor:T.gold,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}

// ══════════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════════
function Dashboard({productions,inventory,setView}){
  const m=new Date().toISOString().slice(0,7)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(m))
  const rev=mp.reduce((s,p)=>s+(p.salePrice||0),0)
  const cost=mp.reduce((s,p)=>s+(p.cost||0),0)
  const profit=rev-cost
  const margin=rev>0?Math.round((profit/rev)*100):0
  const lowStock=inventory.filter(i=>i.stock<3)
  const monthLabel=new Date().toLocaleDateString("en-NG",{month:"long",year:"numeric"})

  return <div>
    <SHead title="Dashboard" sub={`${monthLabel} — your bakery at a glance`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
      {[{label:"Monthly Revenue",val:fmt(rev),sub:`${mp.length} orders`,accent:T.gold},
        {label:"Production Cost",val:fmt(cost),sub:"ingredients + extras",accent:T.info},
        {label:"Gross Profit",val:fmt(profit),sub:`${margin}% margin`,accent:T.success},
        {label:"Inventory Value",val:fmt(inventory.reduce((s,i)=>s+i.cost*i.stock,0)),sub:`${inventory.length} items`,accent:T.muted}
      ].map(s=><Card key={s.label} style={{borderTop:`3px solid ${s.accent}`}}>
        <div style={{fontSize:10.5,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.text}}>{s.val}</div>
        <div style={{fontSize:12,color:T.muted,marginTop:4}}>{s.sub}</div>
      </Card>)}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:14}}>Recent Productions</div>
        {productions.length===0?<div style={{fontSize:13,color:T.muted}}>No production records yet. Add your first cake!</div>:
        productions.slice(0,5).map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
          <div><div style={{fontSize:13.5,fontWeight:500}}>{p.size} · {p.covering} — {p.flavors}</div><div style={{fontSize:12,color:T.muted}}>{p.client} · {p.deliveryDate}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:600,color:T.gold}}>{fmt(p.salePrice)}</div><div style={{fontSize:11.5,color:T.success}}>+{fmt(p.salePrice-p.cost)} profit</div></div>
        </div>)}
        <div style={{marginTop:14}}><Btn small variant="outline" onClick={()=>setView("records")}>View All Records →</Btn></div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card style={{background:lowStock.length>0?"#FFF9EE":T.panel,borderColor:lowStock.length>0?T.gold:T.border}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>{lowStock.length>0?"⚠ Low Stock Alerts":"✓ Stock Levels OK"}</div>
          {lowStock.length===0?<div style={{fontSize:13,color:T.success}}>All items are well-stocked.</div>:
          lowStock.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13}}>{i.name}</span><Badge color={i.stock===0?"red":"gold"}>{i.stock} {i.unit} left</Badge>
          </div>)}
        </Card>

        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Quick Actions</div>
          {[{icon:"🎂",label:"Record new cake production",view:"production"},
            {icon:"🧾",label:"Scan a purchase receipt",view:"receipts"},
            {icon:"⊞",label:"Import bank statement",view:"bank"},
            {icon:"◎",label:"View monthly P&L",view:"reports"},
            {icon:"⚙",label:"Edit master list",view:"setup"},
          ].map(a=><div key={a.view} onClick={()=>setView(a.view)} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:8,cursor:"pointer",marginBottom:3,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#F0E9DB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:16}}>{a.icon}</span><span style={{fontSize:13,color:T.text}}>{a.label}</span>
          </div>)}
        </Card>
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  SETUP
// ══════════════════════════════════════════════════════════════
function Setup({inventory,setInventory,accessoryPct,setAccessoryPct}){
  const [tab,setTab]=useState("Inventory")
  const [addInv,setAddInv]=useState(false)
  const [ni,setNi]=useState({name:"",cat:"",unit:"kg",cost:"",stock:""})
  const [openRid,setOpenRid]=useState(null)
  const [restock,setRestock]=useState({})

  const saveInv=async()=>{
    if(!ni.name||!ni.cost)return
    const newItem={...ni,id:uid(),cost:+ni.cost,stock:+ni.stock||0}
    const updated=[...inventory,newItem]
    setInventory(updated)
    await saveInventory(updated)
    setNi({name:"",cat:"",unit:"kg",cost:"",stock:""});setAddInv(false)
  }

  const doRestock=async(id)=>{
    const qty=+restock[id];if(!qty)return
    const updated=inventory.map(i=>i.id===id?{...i,stock:parseFloat((i.stock+qty).toFixed(3))}:i)
    setInventory(updated)
    await saveInventory(updated)
    setRestock(r=>({...r,[id]:""}))
  }

  return <div>
    <SHead title="Master List Setup" sub="Set this up once — every production calculation pulls from here."/>
    <Tabs tabs={["Inventory","Base Recipes","Flavour Extras","Settings"]} active={tab} onChange={setTab}/>

    {tab==="Inventory"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{fontSize:13,color:T.muted}}>{inventory.length} items · Value: {fmt(inventory.reduce((s,i)=>s+i.cost*i.stock,0))}</span>
        <Btn onClick={()=>setAddInv(!addInv)}>+ Add Item</Btn>
      </div>
      {addInv&&<Card style={{marginBottom:16,background:"#FFF9EE",borderColor:T.gold}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>New Inventory Item</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:12}}>
          <Inp label="Name *" value={ni.name} onChange={v=>setNi(p=>({...p,name:v}))} placeholder="e.g. Dark Chocolate"/>
          <Inp label="Category" value={ni.cat} onChange={v=>setNi(p=>({...p,cat:v}))} placeholder="Dry Goods…"/>
          <Inp label="Unit" value={ni.unit} onChange={v=>setNi(p=>({...p,unit:v}))} placeholder="kg/pcs/L/g"/>
          <Inp label="Cost/Unit (₦) *" type="number" value={ni.cost} onChange={v=>setNi(p=>({...p,cost:v}))}/>
          <Inp label="Opening Stock" type="number" value={ni.stock} onChange={v=>setNi(p=>({...p,stock:v}))}/>
        </div>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveInv}>Save</Btn><Btn variant="ghost" onClick={()=>setAddInv(false)}>Cancel</Btn></div>
      </Card>}
      <Card style={{padding:0,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <THead cols={["Item","Category","Unit","Cost/Unit","Stock","Value","Restock"]}/>
          <tbody>{inventory.map((item,i)=><TR key={item.id} i={i} row={[
            <span style={{fontWeight:500}}>{item.name}</span>,
            <span style={{color:T.muted}}>{item.cat}</span>,
            item.unit,fmt(item.cost),
            <span style={{color:item.stock<3?T.danger:T.text,fontWeight:item.stock<3?600:400}}>{item.stock} {item.unit}</span>,
            <span style={{color:T.gold,fontWeight:500}}>{fmt(item.cost*item.stock)}</span>,
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <input type="number" placeholder="qty" value={restock[item.id]||""} onChange={e=>setRestock(r=>({...r,[item.id]:e.target.value}))} style={{...inputSt,width:70,padding:"5px 8px",fontSize:12}}/>
              <Btn small variant="outline" onClick={()=>doRestock(item.id)}>Add</Btn>
            </div>,
          ]}/>) }</tbody>
        </table>
      </Card>
    </div>}

    {tab==="Base Recipes"&&<div>
      <div style={{marginBottom:14,padding:"12px 16px",background:"#FFF9EE",borderRadius:10,border:`1px solid ${T.gold}`,fontSize:13,lineHeight:1.7}}>
        <strong>How it works:</strong> Each base recipe maps to a cake size + covering. When you log a production, the app picks the matching recipe, adds flavour extras per layer, then applies your accessory margin automatically.
      </div>
      {RECIPES.map(r=>{
        const cost=recipeCost(r,inventory);const open=openRid===r.id
        return <Card key={r.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpenRid(open?null:r.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,fontSize:14.5}}>{r.name}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{r.ing.length} ingredients · Base cost: <strong style={{color:T.gold}}>{fmt(cost)}</strong></div></div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><Badge color={r.covering==="fondant"?"blue":"gold"}>{r.covering}</Badge><span style={{color:T.muted,fontSize:18}}>{open?"▴":"▾"}</span></div>
          </div>
          {open&&<div style={{marginTop:16,borderTop:`1px solid ${T.border}`,paddingTop:16}}>
            <table style={{width:"100%",fontSize:13}}>
              <thead><tr>{["Ingredient","Qty","Cost/Unit","Line Cost"].map(h=><th key={h} style={{textAlign:h==="Ingredient"?"left":"right",fontSize:10.5,color:T.muted,textTransform:"uppercase",letterSpacing:0.8,paddingBottom:8}}>{h}</th>)}</tr></thead>
              <tbody>
                {r.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<tr key={ing.iid}><td style={{padding:"5px 0"}}>{it.name}</td><td style={{textAlign:"right",color:T.muted}}>{ing.qty}{it.unit}</td><td style={{textAlign:"right",color:T.muted}}>{fmt(it.cost)}/{it.unit}</td><td style={{textAlign:"right",fontWeight:500}}>{fmt(it.cost*ing.qty)}</td></tr>:null})}
                <tr style={{borderTop:`1px solid ${T.border}`}}><td colSpan={3} style={{padding:"8px 0",textAlign:"right",fontWeight:700,paddingRight:12}}>Base Cost</td><td style={{textAlign:"right",fontWeight:700,color:T.gold,fontSize:15}}>{fmt(cost)}</td></tr>
              </tbody>
            </table>
          </div>}
        </Card>
      })}
    </div>}

    {tab==="Flavour Extras"&&<div>
      <div style={{marginBottom:14,fontSize:13,color:T.muted}}>Extra ingredients added for each special flavour, per layer, on top of the base recipe.</div>
      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <THead cols={["Flavour","Extra Ingredients per Layer","Cost/Layer"]}/>
          <tbody>{Object.entries(FLAVOR_EXTRAS).map(([fl,extras],i)=>{
            const cost=extras.reduce((s,e)=>{const it=inventory.find(x=>x.id===e.iid);return s+(it?it.cost*e.qty:0)},0)
            return <TR key={fl} i={i} row={[
              <span style={{fontWeight:500,textTransform:"capitalize"}}>{fl}</span>,
              extras.length===0?<span style={{color:T.muted}}>Standard base — no extras</span>:extras.map(e=>{const it=inventory.find(x=>x.id===e.iid);return it?<span key={e.iid} style={{display:"inline-block",background:T.border,borderRadius:4,padding:"2px 8px",fontSize:12,marginRight:4}}>{e.qty}{it.unit} {it.name}</span>:null}),
              cost>0?<span style={{color:T.gold,fontWeight:500}}>+{fmt(cost)}</span>:<span style={{color:T.muted}}>—</span>,
            ]}/>
          })}</tbody>
        </table>
      </Card>
    </div>}

    {tab==="Settings"&&<div style={{maxWidth:420}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:12}}>Global Accessory Margin</div>
        <p style={{fontSize:13,color:T.muted,marginTop:0,lineHeight:1.7}}>This % is added to every cake's ingredient cost to cover boxes, boards, ribbons, printouts, and other accessories not in the recipe.</p>
        <div style={{display:"flex",alignItems:"center",gap:14,marginTop:12}}>
          <input type="range" min={0} max={30} value={accessoryPct} onChange={e=>{setAccessoryPct(+e.target.value);saveSetting("accessoryPct",+e.target.value)}} style={{flex:1,accentColor:T.gold}}/>
          <div style={{fontSize:24,fontWeight:700,color:T.gold,minWidth:50}}>{accessoryPct}%</div>
        </div>
        <div style={{marginTop:10,fontSize:13,color:T.muted}}>Every cake cost × <strong style={{color:T.text}}>{(1+accessoryPct/100).toFixed(2)}</strong></div>
      </Card>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  PRODUCTION ENTRY
// ══════════════════════════════════════════════════════════════
function ProductionEntry({inventory,setInventory,accessoryPct,productions,setProductions,setView}){
  const [step,setStep]=useState(1)
  const [photo,setPhoto]=useState(null)
  const [photoB64,setPhotoB64]=useState(null)
  const [aiObs,setAiObs]=useState(null)
  const [aiLoading,setAiLoading]=useState(false)
  const [saving,setSaving]=useState(false)
  const fileRef=useRef()
  const [size,setSize]=useState("")
  const [covering,setCovering]=useState("")
  const [layers,setLayers]=useState("2")
  const [flavors,setFlavors]=useState("")
  const [client,setClient]=useState("")
  const [orderDate,setOrderDate]=useState(today())
  const [delivDate,setDelivDate]=useState("")
  const [salePrice,setSalePrice]=useState("")
  const [notes,setNotes]=useState("")
  const SIZES=['6"','8"','10"','12"','2-tier','3-tier','cupcakes×12','cupcakes×24']
  const COVERINGS=["buttercream","fondant","ganache","naked"]
  const matchedRecipe=RECIPES.find(r=>r.size===size&&r.covering===covering)||RECIPES.find(r=>r.size===size)||null
  const estCost=matchedRecipe?calcCost(matchedRecipe,inventory,+layers,flavors,accessoryPct):null
  const fl=(flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
  const extraLines=[]
  if(matchedRecipe)fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const it=inventory.find(x=>x.id===e.iid);if(it)extraLines.push({name:`${it.name} (${f} ×${layers} layers)`,cost:it.cost*e.qty*(+layers)})}))
  const baseOnly=matchedRecipe?recipeCost(matchedRecipe,inventory):0
  const extraTotal=extraLines.reduce((s,l)=>s+l.cost,0)
  const subtotal=baseOnly+extraTotal

  const handleFile=e=>{
    const file=e.target.files[0];if(!file)return
    setPhoto(URL.createObjectURL(file))
    const reader=new FileReader()
    reader.onload=ev=>setPhotoB64(ev.target.result.split(",")[1])
    reader.readAsDataURL(file)
  }

  const readPhoto=async()=>{
    if(!photoB64)return;setAiLoading(true)
    try{
      const raw=await callClaude([{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:photoB64}},
        {type:"text",text:`Analyze this cake photo for a Nigerian bakery record. Return ONLY valid JSON:\n{"estimatedSize":"e.g. 8 inch","covering":"buttercream|fondant|ganache|naked","estimatedTiers":1,"colorDescription":"e.g. blue with gold","decorationDetails":"roses, drip etc.","photoNotes":"one sentence"}`},
      ]}],"Analyze cake photos for Nigerian bakery bookkeeping. Return JSON only.")
      const r=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setAiObs(r)
      if(!covering&&r.covering&&COVERINGS.includes(r.covering))setCovering(r.covering)
      if(!size&&r.estimatedSize){const s=r.estimatedSize.replace(/\s*inch/i,'"');if(SIZES.includes(s))setSize(s)}
    }catch{/* silently fail */}
    finally{setAiLoading(false)}
  }

  const doSave=async()=>{
    setSaving(true)
    const prod={id:uid(),recipeId:matchedRecipe?.id,client,orderDate,deliveryDate:delivDate,cost:estCost||0,salePrice:+salePrice,status:"pending",size,covering,flavors,layers:+layers,accessoryPct,notes,photo:null}
    // Deduct inventory
    if(matchedRecipe){
      const deductions=[...matchedRecipe.ing.map(i=>({...i}))]
      fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const ex=deductions.find(d=>d.iid===e.iid);if(ex)ex.qty=parseFloat((ex.qty+e.qty*(+layers)).toFixed(3));else deductions.push({iid:e.iid,qty:e.qty*(+layers)})}))
      const updatedInv=inventory.map(item=>{const ing=deductions.find(i=>i.iid===item.id);return ing?{...item,stock:Math.max(0,parseFloat((item.stock-ing.qty).toFixed(3)))}:item})
      setInventory(updatedInv)
      await saveInventory(updatedInv)
    }
    const updatedProds=[prod,...productions]
    setProductions(updatedProds)
    await saveProduction(prod)
    setSaving(false);setView("records")
  }

  return <div>
    <SHead title="New Production Entry" sub="Photo + details → automatic cost calculation and inventory deduction."/>
    <Steps steps={["Cake Details","Cost Review","Confirm"]} current={step}/>

    {step===1&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:14}}>📸 Cake Photo <span style={{fontSize:12,fontWeight:400,color:T.muted}}>(optional)</span></div>
        <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${T.border}`,borderRadius:10,padding:photo?6:44,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:12,minHeight:130,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="cake" style={{maxHeight:200,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:40,marginBottom:8}}>🎂</div><div style={{fontSize:13.5,color:T.muted}}>Tap to upload cake photo</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!aiObs&&<Btn full onClick={readPhoto} disabled={aiLoading}>{aiLoading?"🔍 Reading photo…":"✦ Let AI read this photo"}</Btn>}
        {aiObs&&<div style={{background:"#FFF9EE",borderRadius:8,padding:12,border:`1px solid ${T.gold}`,fontSize:13,marginTop:8}}>
          <div style={{fontWeight:600,marginBottom:8}}>✦ AI observed:</div>
          {[["Size",aiObs.estimatedSize],["Covering",aiObs.covering],["Colour",aiObs.colorDescription],["Decor",aiObs.decorationDetails]].map(([k,v])=>v?<div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:T.muted}}>{k}</span><span style={{fontWeight:500,textTransform:"capitalize"}}>{v}</span></div>:null)}
          <div style={{fontSize:11.5,color:T.muted,marginTop:6,fontStyle:"italic"}}>"{aiObs.photoNotes}"</div>
        </div>}
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:14}}>Cake Details <span style={{fontSize:12,fontWeight:400,color:T.danger}}>* required</span></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Sel label="Cake Size *" value={size} onChange={setSize} options={SIZES.map(s=>({value:s,label:s}))}/>
          <Sel label="Covering *" value={covering} onChange={setCovering} options={COVERINGS.map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}))}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Sel label="Layers *" value={layers} onChange={setLayers} options={["1","2","3","4","5","6"].map(n=>({value:n,label:`${n} layer${+n>1?"s":""}`}))}/>
          <Inp label="Flavour(s) *" value={flavors} onChange={setFlavors} placeholder="Vanilla, Red Velvet…"/>
        </div>
        <Inp label="Client Name *" value={client} onChange={setClient} placeholder="e.g. Mrs. Chioma Okafor"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Order Date" type="date" value={orderDate} onChange={setOrderDate}/>
          <Inp label="Delivery Date *" type="date" value={delivDate} onChange={setDelivDate}/>
        </div>
        <Inp label="Selling Price (₦)" type="number" value={salePrice} onChange={setSalePrice} placeholder="Amount charged to client"/>
        <Inp label="Notes" value={notes} onChange={setNotes} placeholder="Colour theme, special requests…"/>
        {matchedRecipe&&<div style={{padding:"10px 14px",background:"#F5F0E4",borderRadius:8,fontSize:13,marginBottom:14}}>Matched: <strong>{matchedRecipe.name}</strong> + {accessoryPct}% accessory margin</div>}
        <Btn full onClick={()=>setStep(2)} disabled={!size||!covering||!flavors||!client||!delivDate}>Review Cost →</Btn>
      </Card>
    </div>}

    {step===2&&matchedRecipe&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:18}}>Cost Breakdown</div>
        <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Base Ingredients</div>
        {matchedRecipe.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<div key={ing.iid} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span>{it.name} <span style={{color:T.muted}}>({ing.qty}{it.unit})</span></span><span>{fmt(it.cost*ing.qty)}</span></div>:null})}
        {extraLines.length>0&&<><div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:1,margin:"12px 0 8px"}}>Flavour Extras</div>{extraLines.map((l,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span>{l.name}</span><span>+{fmt(l.cost)}</span></div>)}</>}
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.border}`,marginTop:4,fontSize:13,color:T.muted}}><span>Ingredient subtotal</span><span>{fmt(subtotal)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13,color:T.muted}}><span>Accessory margin ({accessoryPct}%)</span><span>+{fmt(estCost-subtotal)}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontWeight:700,fontSize:15}}><span>Total Production Cost</span><span style={{color:T.gold}}>{fmt(estCost)}</span></div>
        {salePrice&&<div style={{background:"#EEF8F3",borderRadius:8,padding:14,border:"1px solid #C2E0CF"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:13}}><span style={{color:T.muted}}>Selling Price</span><span style={{fontWeight:600}}>{fmt(+salePrice)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #C2E0CF",fontWeight:700,fontSize:15}}><span>Gross Profit</span><span style={{color:T.success}}>{fmt(+salePrice-estCost)}</span></div>
          <div style={{fontSize:11.5,color:T.muted,marginTop:4}}>Margin: {Math.round((+salePrice-estCost)/+salePrice*100)}%</div>
        </div>}
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:14}}>Order Summary</div>
        {[[`Size · Covering`,`${size} · ${covering}`],["Layers",`${layers} layer${+layers>1?"s":""}`],["Flavour(s)",flavors],["Client",client],["Order Date",orderDate],["Delivery Date",delivDate],["Notes",notes||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.muted}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>)}
        <div style={{marginTop:14,fontSize:12,color:T.muted,background:"#FFF9EE",borderRadius:6,padding:"8px 12px"}}>⚠ Saving deducts {matchedRecipe.ing.length} ingredient(s) from inventory.</div>
        <div style={{marginTop:14,display:"flex",gap:8}}><Btn onClick={()=>setStep(3)}>Confirm →</Btn><Btn variant="ghost" onClick={()=>setStep(1)}>← Edit</Btn></div>
      </Card>
    </div>}

    {step===3&&<div style={{maxWidth:500}}>
      <Card style={{borderColor:T.success,background:"#F2FAF6"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,marginBottom:6}}>✓ Ready to Save</div>
        <p style={{fontSize:13,color:T.muted,marginTop:0}}>This creates a production record, logs all costs, and deducts ingredients from inventory.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"14px 0",borderTop:`1px solid ${T.border}`}}>
          {[["Production Cost",fmt(estCost||0)],["Selling Price",fmt(+salePrice)],["Gross Profit",fmt(+salePrice-(estCost||0))]].map(([k,v])=><div key={k} style={{background:T.panel,borderRadius:8,padding:"10px 14px"}}><div style={{fontSize:10.5,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>{k}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:T.gold,marginTop:4}}>{v}</div></div>)}
        </div>
        <div style={{display:"flex",gap:8,marginTop:4}}>{saving?<Spinner/>:<><Btn variant="success" onClick={doSave}>✓ Save Production Record</Btn><Btn variant="ghost" onClick={()=>setStep(2)}>← Back</Btn></>}</div>
      </Card>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  RECEIPT SCANNER
// ══════════════════════════════════════════════════════════════
function ReceiptScanner({inventory,setInventory}){
  const [photo,setPhoto]=useState(null)
  const [photoB64,setPhotoB64]=useState(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const [parsed,setParsed]=useState(null)
  const [saved,setSaved]=useState(false)
  const fileRef=useRef()

  const handleFile=e=>{
    const file=e.target.files[0];if(!file)return
    setPhoto(URL.createObjectURL(file))
    const reader=new FileReader()
    reader.onload=ev=>setPhotoB64(ev.target.result.split(",")[1])
    reader.readAsDataURL(file)
    setParsed(null);setSaved(false);setError(null)
  }

  const scan=async()=>{
    if(!photoB64)return;setLoading(true);setError(null)
    try{
      const invList=inventory.map(i=>`${i.id}:${i.name}(${i.unit})`).join(", ")
      const raw=await callClaude([{role:"user",content:[
        {type:"image",source:{type:"base64",media_type:"image/jpeg",data:photoB64}},
        {type:"text",text:`Nigerian bakery purchase receipt. Extract every item and quantity. Match to inventory: ${invList}. Return ONLY JSON array:\n[{"item_on_receipt":"exact text","qty":0.5,"unit":"kg","matched_id":"i1 or null","matched_name":"name or null","confidence":"high|medium|low"}]`},
      ]}],"Parse Nigerian bakery receipts. Return JSON array only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setParsed(result.map(r=>({...r,approved:r.confidence!=="low",overrideId:r.matched_id})))
    }catch{setError("Could not read receipt. Try a clearer photo in good lighting.")}
    finally{setLoading(false)}
  }

  const toggleApprove=idx=>setParsed(p=>p.map((r,i)=>i===idx?{...r,approved:!r.approved}:r))
  const setMatch=(idx,id)=>setParsed(p=>p.map((r,i)=>i===idx?{...r,overrideId:id,approved:true}:r))

  const applyUpdates=async()=>{
    const approved=parsed.filter(r=>r.approved&&r.overrideId)
    const updatedInv=inventory.map(item=>{const match=approved.find(r=>r.overrideId===item.id);return match?{...item,stock:parseFloat((item.stock+match.qty).toFixed(3))}:item})
    setInventory(updatedInv)
    await saveInventory(updatedInv)
    setParsed(null);setPhoto(null);setPhotoB64(null);setSaved(true)
  }

  return <div>
    <SHead title="Receipt Scanner" sub="Photograph any purchase receipt — AI reads it and updates your inventory."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:14}}>📷 Upload Receipt Photo</div>
        <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${T.border}`,borderRadius:10,padding:photo?6:50,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:14,minHeight:150,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="receipt" style={{maxHeight:280,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:40,marginBottom:8}}>🧾</div><div style={{fontSize:13.5,color:T.muted}}>Tap to upload receipt</div><div style={{fontSize:12,color:"#C8B89A",marginTop:4}}>Printed or handwritten</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!parsed&&!saved&&<><Btn full onClick={scan} disabled={loading}>{loading?"🔍 Reading receipt…":"✦ Scan & Extract Items"}</Btn>{error&&<div style={{fontSize:12.5,color:T.danger,marginTop:10}}>⚠ {error}</div>}</>}
        {saved&&<div style={{background:"#EEF8F3",borderRadius:8,padding:14,border:"1px solid #C2E0CF",marginTop:4}}>
          <div style={{fontWeight:600,color:T.success,marginBottom:4}}>✓ Inventory Updated!</div>
          <Btn variant="outline" onClick={()=>{setSaved(false);setPhoto(null);setPhotoB64(null)}}>Scan Another</Btn>
        </div>}
      </Card>
      <div>
        {parsed?<Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:10}}>Items Detected</div>
          <div style={{fontSize:12.5,color:T.muted,marginBottom:14}}>Toggle off misread items. Fix inventory matches if needed.</div>
          {parsed.map((r,idx)=><div key={idx} style={{padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13.5,fontWeight:500}}>{r.item_on_receipt}</div><div style={{fontSize:12,color:T.muted}}>{r.qty} {r.unit}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Badge color={r.confidence==="high"?"green":r.confidence==="medium"?"gold":"red"}>{r.confidence}</Badge>
                <div onClick={()=>toggleApprove(idx)} style={{width:36,height:20,borderRadius:10,background:r.approved?T.success:T.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:16,height:16,borderRadius:"50%",background:"white",position:"absolute",top:2,left:r.approved?18:2,transition:"left 0.2s"}}/></div>
              </div>
            </div>
            {r.approved&&<div style={{marginTop:8}}><select value={r.overrideId||""} onChange={e=>setMatch(idx,e.target.value)} style={{...inputSt,fontSize:12,padding:"6px 10px"}}><option value="">— Skip this item —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) · stock: {i.stock}</option>)}</select></div>}
          </div>)}
          <div style={{marginTop:16,display:"flex",gap:8}}><Btn variant="success" onClick={applyUpdates} disabled={!parsed.some(r=>r.approved&&r.overrideId)}>✓ Update Inventory ({parsed.filter(r=>r.approved&&r.overrideId).length} items)</Btn><Btn variant="ghost" onClick={()=>{setParsed(null);setPhoto(null);setPhotoB64(null)}}>← Rescan</Btn></div>
        </Card>:<Card style={{background:"#FFF9EE",borderColor:T.gold}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>How It Works</div>
          {[["📸","Take a clear photo of any receipt — printed supermarket or handwritten market receipt."],["🔍","AI reads every item and quantity, matches each to your inventory list."],["✅","Review the matches, toggle off errors, fix any inventory name mismatches."],["📦","Tap Update — stock quantities are added automatically."]].map(([icon,text])=><div key={icon} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}><span style={{fontSize:20,flexShrink:0}}>{icon}</span><span style={{fontSize:13,color:T.muted,lineHeight:1.6}}>{text}</span></div>)}
          <div style={{padding:"10px 14px",background:"#FEF0D0",borderRadius:8,fontSize:12.5,color:"#7A5500",lineHeight:1.6}}><strong>Tip:</strong> Write clearly on handwritten receipts. Take photos in natural light without shadows for best results.</div>
        </Card>}
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  RECORDS
// ══════════════════════════════════════════════════════════════
function Records({productions,setProductions}){
  const [filter,setFilter]=useState("all")
  const filtered=filter==="all"?productions:productions.filter(p=>p.status===filter)
  const markDelivered=async id=>{
    setProductions(p=>p.map(x=>x.id===id?{...x,status:"delivered"}:x))
    await updateProductionStatus(id,"delivered")
  }
  return <div>
    <SHead title="Production Records" sub={`${productions.length} total entries`}/>
    <Tabs tabs={["all","pending","delivered"]} active={filter} onChange={setFilter}/>
    <Card style={{padding:0}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <THead cols={["Delivery Date","Size · Covering","Flavour(s)","Client","Cost","Sale Price","Profit","Status",""]}/>
        <tbody>
          {filtered.length===0?<tr><td colSpan={9} style={{padding:40,textAlign:"center",color:T.muted}}>No records yet. Add your first production entry.</td></tr>:
          filtered.map((p,i)=>{
            const profit=(p.salePrice||0)-(p.cost||0)
            const marg=p.salePrice>0?Math.round((profit/p.salePrice)*100):0
            return <TR key={p.id} i={i} row={[
              <span style={{color:T.muted}}>{p.deliveryDate}</span>,
              <span style={{fontWeight:500}}>{p.size} · {p.covering}</span>,
              <span style={{color:T.muted,fontSize:12.5}}>{p.flavors}</span>,
              p.client,fmt(p.cost),
              <span style={{color:T.gold,fontWeight:600}}>{fmt(p.salePrice)}</span>,
              <span style={{color:T.success,fontWeight:600}}>{fmt(profit)}</span>,
              <Badge color={p.status==="delivered"?"green":"gold"}>{p.status}</Badge>,
              p.status==="pending"?<Btn small variant="outline" onClick={()=>markDelivered(p.id)}>Mark Delivered</Btn>:null,
            ]}/>
          })}
        </tbody>
      </table>
    </Card>
    {filtered.length>0&&<div style={{marginTop:14,padding:"12px 14px",background:T.panel,borderRadius:8,border:`1px solid ${T.border}`,display:"flex",gap:24}}>
      <span style={{fontSize:13,color:T.muted}}>Revenue: <strong style={{color:T.gold}}>{fmt(filtered.reduce((s,p)=>s+(p.salePrice||0),0))}</strong></span>
      <span style={{fontSize:13,color:T.muted}}>Cost: <strong>{fmt(filtered.reduce((s,p)=>s+(p.cost||0),0))}</strong></span>
      <span style={{fontSize:13,color:T.muted}}>Profit: <strong style={{color:T.success}}>{fmt(filtered.reduce((s,p)=>s+(p.salePrice||0)-(p.cost||0),0))}</strong></span>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  BANK IMPORT
// ══════════════════════════════════════════════════════════════
function BankImport({transactions,setTransactions,productions}){
  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null)
  const [parsed,setParsed]=useState([])

  const parse=async()=>{
    if(!input.trim())return;setLoading(true);setError(null)
    try{
      const raw=await callClaude([{role:"user",content:`Parse this Nigerian bank statement. Return ONLY a JSON array:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|supplies|overhead|transfer|unknown"}]\n\n${input}`}],"Parse Nigerian bank statements. Return JSON array only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setParsed(result.map(t=>({...t,id:uid(),matchedProdId:null})))
    }catch{setError("Could not parse. Paste raw text directly from your bank portal.")}
    finally{setLoading(false)}
  }

  const match=(txId,prodId)=>setParsed(p=>p.map(t=>t.id===txId?{...t,matchedProdId:prodId}:t))
  const saveAll=async()=>{
    const updated=[...parsed,...transactions]
    setTransactions(updated)
    await saveTransactions(parsed)
    setParsed([]);setInput("")
  }

  return <div>
    <SHead title="Bank Statement Import" sub="Paste your bank statement — AI categorizes every transaction for your P&L."/>
    <Card style={{marginBottom:18,background:"#FFF9EE",borderColor:T.gold}}>
      <div style={{fontWeight:600,fontSize:13.5,marginBottom:6}}>📅 About Payment Date Mismatch</div>
      <p style={{fontSize:13,color:T.muted,margin:0,lineHeight:1.7}}>Clients often pay a deposit before delivery. Use the <em>Match to Order</em> column to link each incoming payment to the correct production record — so your P&L dates are accurate.</p>
    </Card>
    {parsed.length===0?<Card>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Paste Bank Statement Text</div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"Paste bank statement text here…\n\nDate        Narration                      Credit       Debit\n01/04/25    TRF from Chioma Obi            35,000\n03/04/25    Dangote Flour purchase                      12,500"} style={{width:"100%",minHeight:200,padding:"12px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"#FAF7F0",fontSize:13,fontFamily:"monospace",color:T.text,boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
      {error&&<div style={{color:T.danger,fontSize:13,marginTop:8}}>⚠ {error}</div>}
      <div style={{marginTop:12}}><Btn onClick={parse} disabled={loading||!input.trim()}>{loading?"🔍 Parsing…":"✦ Parse with AI"}</Btn></div>
    </Card>:<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
        {[{label:"Total Credits",val:fmt(parsed.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0)),sub:`${parsed.filter(t=>t.type==="credit").length} payments in`,color:T.success},
          {label:"Total Debits",val:fmt(parsed.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0)),sub:`${parsed.filter(t=>t.type==="debit").length} payments out`,color:T.danger},
          {label:"Unmatched",val:parsed.filter(t=>t.type==="credit"&&!t.matchedProdId).length,sub:"credits need matching",color:T.gold},
        ].map(s=><Card key={s.label}><div style={{fontSize:10.5,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.label}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:12,color:T.muted,marginTop:4}}>{s.sub}</div></Card>)}
      </div>
      <Card style={{padding:0,marginBottom:14}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <THead cols={["Date","Description","Amount","Type","Category","Match to Order"]}/>
          <tbody>{parsed.map((t,i)=><TR key={t.id} i={i} row={[
            <span style={{color:T.muted}}>{t.date}</span>,t.description,
            <span style={{fontWeight:600,color:t.type==="credit"?T.success:T.danger}}>{t.type==="credit"?"+":"–"}{fmt(t.amount)}</span>,
            <Badge color={t.type==="credit"?"green":"red"}>{t.type}</Badge>,
            <Badge>{t.category}</Badge>,
            t.type==="credit"?(t.matchedProdId?<span style={{fontSize:12,color:T.success,fontWeight:500}}>✓ Matched</span>:(<select onChange={e=>match(t.id,e.target.value)} defaultValue="" style={{fontSize:12,padding:"5px 8px",borderRadius:6,border:`1px solid ${T.border}`,background:T.panel,color:T.text}}><option value="">Match to order…</option>{productions.map(p=><option key={p.id} value={p.id}>{p.client} — {p.deliveryDate} ({fmt(p.salePrice)})</option>)}</select>)):<span style={{color:T.border}}>—</span>,
          ]}/>) }</tbody>
        </table>
      </Card>
      <div style={{display:"flex",gap:10}}><Btn variant="success" onClick={saveAll}>✓ Save All Transactions</Btn><Btn variant="ghost" onClick={()=>{setParsed([]);setInput("")}}>← New Statement</Btn></div>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  REPORTS
// ══════════════════════════════════════════════════════════════
function Reports({productions,transactions}){
  const allMonths=[...new Set([...productions.map(p=>p.deliveryDate?.slice(0,7)),...transactions.map(t=>t.date?.slice(0,7))].filter(Boolean))].sort().reverse()
  const curMonth=new Date().toISOString().slice(0,7)
  const [sel,setSel]=useState(allMonths[0]||curMonth)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(sel))
  const mt=transactions.filter(t=>t.date?.startsWith(sel))
  const rev=mp.reduce((s,p)=>s+(p.salePrice||0),0)
  const prodCost=mp.reduce((s,p)=>s+(p.cost||0),0)
  const bankDebits=mt.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0)
  const bankCredits=mt.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0)
  const grossProfit=rev-prodCost;const netProfit=grossProfit-bankDebits
  const margin=rev>0?Math.round((grossProfit/rev)*100):0
  const monthLabel=sel?new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"}):""
  const bySize={};mp.forEach(p=>{const k=`${p.size} · ${p.covering}`;if(!bySize[k])bySize[k]={qty:0,rev:0,cost:0};bySize[k].qty++;bySize[k].rev+=(p.salePrice||0);bySize[k].cost+=(p.cost||0)})

  return <div>
    <SHead title="Financial Reports" sub="Monthly P&L compiled from your production records and bank data."/>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
      <span style={{fontSize:11.5,color:T.muted,textTransform:"uppercase",letterSpacing:0.8}}>Period:</span>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:T.panel,fontSize:13.5,color:T.text}}>
        {(allMonths.length>0?allMonths:[curMonth]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
      {[{label:"Gross Revenue",val:fmt(rev),sub:`${mp.length} orders`,color:T.gold},{label:"Production Cost",val:fmt(prodCost),sub:"ingredients + margin",color:T.info},{label:"Gross Profit",val:fmt(grossProfit),sub:`${margin}% margin`,color:T.success},{label:"Net Profit",val:fmt(netProfit),sub:"after bank expenses",color:netProfit>=0?T.success:T.danger}].map(s=><Card key={s.label} style={{borderBottom:`3px solid ${s.color}`}}>
        <div style={{fontSize:10.5,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:s.color}}>{s.val}</div>
        <div style={{fontSize:12,color:T.muted,marginTop:4}}>{s.sub}</div>
      </Card>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:4}}>Profit & Loss Statement</div>
        <div style={{fontSize:12,color:T.muted,marginBottom:18}}>{monthLabel}</div>
        <div style={{fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Income from Sales</div>
        {mp.length===0?<div style={{fontSize:13,color:T.muted,marginBottom:12}}>No productions this month.</div>:mp.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span>{p.size} {p.covering} ({p.flavors}) — {p.client}</span><span style={{fontWeight:500}}>{fmt(p.salePrice)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.border}`,marginTop:4,fontWeight:700}}><span>Total Revenue</span><span style={{color:T.success}}>{fmt(rev)}</span></div>
        <div style={{fontSize:11,fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginTop:18,marginBottom:8}}>Costs</div>
        {mp.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span>{p.size} {p.covering} — {p.client}</span><span style={{color:T.danger}}>({fmt(p.cost)})</span></div>)}
        {bankDebits>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",fontSize:13}}><span>Other Expenses (Bank)</span><span style={{color:T.danger}}>({fmt(bankDebits)})</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:`1px solid ${T.border}`,marginTop:4,fontWeight:700}}><span>Total Costs</span><span style={{color:T.danger}}>({fmt(prodCost+bankDebits)})</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"13px 14px",background:netProfit>=0?"#E8F5EE":"#FDEBE9",borderRadius:8,marginTop:14}}><span style={{fontSize:15,fontWeight:700}}>NET PROFIT</span><span style={{fontSize:16,fontWeight:700,color:netProfit>=0?T.success:T.danger}}>{fmt(netProfit)}</span></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Revenue by Cake Type</div>
          {Object.keys(bySize).length===0?<div style={{fontSize:13,color:T.muted}}>No data for this period.</div>:Object.entries(bySize).map(([k,v])=><div key={k} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13}}>{k} <span style={{color:T.muted}}>×{v.qty}</span></span><span style={{fontSize:13,fontWeight:600,color:T.gold}}>{fmt(v.rev)}</span></div>
            <div style={{height:5,background:T.border,borderRadius:3}}><div style={{height:"100%",width:`${rev>0?(v.rev/rev)*100:0}%`,background:T.gold,borderRadius:3}}/></div>
            <div style={{fontSize:11,color:T.success,marginTop:2}}>Profit: {fmt(v.rev-v.cost)}</div>
          </div>)}
        </Card>
        {(bankCredits>0||mt.length>0)&&<Card style={{background:"#FFF9EE",borderColor:T.gold}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>📅 Bank Reconciliation</div>
          {[["Production records",fmt(rev)],["Bank credits",fmt(bankCredits)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:T.muted}}>{k}</span><strong>{v}</strong></div>)}
          {Math.abs(rev-bankCredits)>500?<div style={{background:"#FEF3DC",borderRadius:6,padding:"8px 12px",fontSize:12,color:"#8A5F10"}}>⚠ {fmt(Math.abs(rev-bankCredits))} difference — check unmatched payments.</div>:<div style={{color:T.success,fontSize:12,fontWeight:500}}>✓ Records and bank totals reconciled</div>}
        </Card>}
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  ROOT APP
// ══════════════════════════════════════════════════════════════
export default function App(){
  const [view,setView]=useState("dashboard")
  const [inventory,setInventory]=useState(DEFAULT_INV)
  const [productions,setProductions]=useState([])
  const [transactions,setTransactions]=useState([])
  const [accessoryPct,setAccessoryPct]=useState(10)
  const [loading,setLoading]=useState(true)

  // Load all data on mount
  useEffect(()=>{
    async function init(){
      setLoading(true)
      const [inv,prods,txns,pct]=await Promise.all([
        loadInventory(DEFAULT_INV),
        loadProductions([]),
        loadTransactions([]),
        Promise.resolve(loadSetting("accessoryPct",10)),
      ])
      setInventory(inv)
      setProductions(prods)
      setTransactions(txns)
      setAccessoryPct(pct)
      setLoading(false)
    }
    init()
  },[])

  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"setup",label:"Master List",icon:"⚙"},
    {id:"production",label:"New Production",icon:"🎂"},
    {id:"receipts",label:"Receipt Scanner",icon:"🧾"},
    {id:"records",label:"Records",icon:"≡"},
    {id:"bank",label:"Bank Import",icon:"⊞"},
    {id:"reports",label:"Reports",icon:"◎"},
  ]

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
      *{box-sizing:border-box;}body{margin:0;padding:0;}
    `}</style>
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif",background:T.bg,overflow:"hidden"}}>
      {/* SIDEBAR */}
      <div style={{width:215,background:T.sidebar,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"24px 22px 20px",borderBottom:"1px solid rgba(200,145,42,0.2)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:T.gold,fontWeight:700}}>LayerLedger</div>
          <div style={{fontSize:9.5,color:"#7B5A3A",textTransform:"uppercase",letterSpacing:2.5,marginTop:3}}>Bakery Bookkeeping</div>
        </div>
        <div style={{flex:1,paddingTop:12}}>
          {nav.map(n=><div key={n.id} onClick={()=>setView(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 22px",cursor:"pointer",fontSize:13.5,fontWeight:view===n.id?500:400,color:view===n.id?T.gold:"#8B6B4A",background:view===n.id?"rgba(200,145,42,0.1)":"transparent",borderLeft:`2px solid ${view===n.id?T.gold:"transparent"}`,transition:"all 0.15s"}}><span style={{fontSize:15}}>{n.icon}</span>{n.label}</div>)}
        </div>
        <div style={{padding:"14px 22px",borderTop:"1px solid rgba(200,145,42,0.1)"}}>
          <div style={{fontSize:11.5,color:"#6B4A2A",fontWeight:500}}>Fayvouree Cakes</div>
          <div style={{fontSize:10.5,color:"#3D2010",marginTop:2}}>LayerLedger v2.0</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{flex:1,overflow:"auto",padding:"28px 30px",background:T.bg}}>
        {loading?<Spinner/>:<>
          {view==="dashboard"  &&<Dashboard productions={productions} inventory={inventory} setView={setView}/>}
          {view==="setup"      &&<Setup inventory={inventory} setInventory={setInventory} accessoryPct={accessoryPct} setAccessoryPct={setAccessoryPct}/>}
          {view==="production" &&<ProductionEntry inventory={inventory} setInventory={setInventory} accessoryPct={accessoryPct} productions={productions} setProductions={setProductions} setView={setView}/>}
          {view==="receipts"   &&<ReceiptScanner inventory={inventory} setInventory={setInventory}/>}
          {view==="records"    &&<Records productions={productions} setProductions={setProductions}/>}
          {view==="bank"       &&<BankImport transactions={transactions} setTransactions={setTransactions} productions={productions}/>}
          {view==="reports"    &&<Reports productions={productions} transactions={transactions}/>}
        </>}
      </div>
    </div>
  </>
}
