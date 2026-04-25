import { useState, useRef, useEffect, useCallback } from "react"
import { loadInventory, saveInventory, loadProductions, saveProduction,
         updateProductionStatus, loadTransactions, saveTransactions,
         loadExpenses, saveExpenses, loadSetting, saveSetting,
         loadCompanySettings, saveCompanySettings, loadInvoices, saveInvoice } from "./lib/data.js"

// ── defaults ──────────────────────────────────────────────────
const DEFAULT_INV = [
  {id:"i1",name:"All-Purpose Flour",cat:"Dry Goods",unit:"kg",cost:2500,stock:10,minStock:3},
  {id:"i2",name:"Sugar",cat:"Dry Goods",unit:"kg",cost:1800,stock:8,minStock:2},
  {id:"i3",name:"Butter",cat:"Dairy",unit:"kg",cost:4500,stock:5,minStock:2},
  {id:"i4",name:"Eggs",cat:"Dairy",unit:"pcs",cost:120,stock:50,minStock:12},
  {id:"i5",name:"Milk",cat:"Dairy",unit:"L",cost:800,stock:5,minStock:2},
  {id:"i6",name:"Fondant",cat:"Coverings",unit:"kg",cost:6000,stock:2.5,minStock:1},
  {id:"i7",name:"Buttercream Mix",cat:"Coverings",unit:"kg",cost:3500,stock:4,minStock:1},
  {id:"i8",name:"Cake Boards",cat:"Packaging",unit:"pcs",cost:500,stock:18,minStock:5},
  {id:"i9",name:"Cake Boxes",cat:"Packaging",unit:"pcs",cost:800,stock:14,minStock:5},
  {id:"i10",name:"Baking Powder",cat:"Dry Goods",unit:"g",cost:5,stock:480,minStock:100},
  {id:"i11",name:"Vanilla Essence",cat:"Flavoring",unit:"bottle",cost:1500,stock:7,minStock:2},
  {id:"i12",name:"Food Coloring",cat:"Decoration",unit:"set",cost:2000,stock:5,minStock:1},
  {id:"i13",name:"Ribbon & Accessories",cat:"Decoration",unit:"pack",cost:1200,stock:9,minStock:3},
  {id:"i14",name:"Cocoa Powder",cat:"Dry Goods",unit:"kg",cost:3800,stock:1.5,minStock:0.5},
  {id:"i15",name:"Strawberry Essence",cat:"Flavoring",unit:"bottle",cost:1200,stock:4,minStock:1},
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

const EXP_CATS = ["Ingredients","Packaging","Delivery","Equipment","Utilities","Marketing","Salaries","Rent","Miscellaneous"]
const PAYMENT_TYPES = [{v:"full",l:"Full Price Paid"},{v:"gift",l:"Gift / Complimentary"},{v:"sample",l:"Sample / Tasting"},{v:"discount",l:"Discounted Price"}]

// ── helpers ───────────────────────────────────────────────────
const fmt = n => `₦${Math.round(n||0).toLocaleString("en")}`
const uid = () => "_"+Math.random().toString(36).slice(2,9)
const today = () => new Date().toISOString().slice(0,10)
const recipeCost = (r, inv) => !r ? 0 : r.ing.reduce((s,i)=>{const it=inv.find(x=>x.id===i.iid);return s+(it?it.cost*i.qty:0)},0)
const calcCost = (r, inv, layers, flavors, pct) => {
  const base = recipeCost(r, inv)
  const fl = (flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
  let extra = 0
  fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const it=inv.find(x=>x.id===e.iid);if(it)extra+=it.cost*e.qty*(layers||1)}))
  return (base+extra)*(1+(pct||10)/100)
}

async function callClaude(messages, system="") {
  const endpoint = import.meta.env.DEV ? "https://api.anthropic.com/v1/messages" : "/api/claude"
  const headers = {"Content-Type":"application/json"}
  if (import.meta.env.DEV && import.meta.env.VITE_ANTHROPIC_KEY) {
    headers["x-api-key"] = import.meta.env.VITE_ANTHROPIC_KEY
    headers["anthropic-version"] = "2023-06-01"
  }
  const res = await fetch(endpoint, {method:"POST",headers,body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1500,system,messages})})
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.[0]?.text || ""
}

// ── UI primitives ─────────────────────────────────────────────
function Btn({children,onClick,variant="primary",small,full,disabled,type="button"}){
  const styles={primary:{bg:"var(--gold)",color:"#fff",border:"none"},ghost:{bg:"transparent",color:"var(--muted)",border:"1px solid var(--border)"},success:{bg:"#357A52",color:"#fff",border:"none"},danger:{bg:"#B03A2E",color:"#fff",border:"none"},outline:{bg:"transparent",color:"var(--gold)",border:"1px solid var(--gold)"},dark:{bg:"var(--sidebar)",color:"#fff",border:"none"}}[variant]||{}
  return <button type={type} onClick={onClick} disabled={disabled} style={{background:styles.bg,color:styles.color,border:styles.border,borderRadius:8,padding:small?"5px 12px":"9px 18px",fontSize:small?12:13.5,fontWeight:500,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>{children}</button>
}
const iSt={width:"100%",padding:"9px 11px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13.5,color:"var(--text)",boxSizing:"border-box",outline:"none",fontFamily:"inherit"}
function Inp({label,value,onChange,type="text",placeholder,small}){return<div style={{marginBottom:12}}>{label&&<label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...iSt,fontSize:small?12:13.5}}/></div>}
function Sel({label,value,onChange,options,placeholder="— Select —"}){return<div style={{marginBottom:12}}>{label&&<label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8,fontWeight:500}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={{...iSt,cursor:"pointer"}}><option value="">{placeholder}</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select></div>}
function Card({children,style={}}){return<div style={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:12,padding:20,...style}}>{children}</div>}
function Badge({children,color="gray"}){const m={green:["#E5F4EC","#2D7A50"],gold:["#FDF2DC","#9A6C1A"],red:["#FDEBE9","#912622"],blue:["#E8EFFC","#2355A0"],gray:["#F0EBE3","#6B5B45"],purple:["#F0EAFC","#6B32A0"]}[color]||["#F0EBE3","#6B5B45"];return<span style={{background:m[0],color:m[1],borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>}
function Tabs({tabs,active,onChange}){return<div style={{display:"flex",gap:3,marginBottom:20,background:"var(--border)",borderRadius:10,padding:3,flexWrap:"wrap"}}>{tabs.map(t=><div key={t.v||t} onClick={()=>onChange(t.v||t)} style={{padding:"6px 14px",borderRadius:7,fontSize:12.5,fontWeight:active===(t.v||t)?500:400,cursor:"pointer",background:active===(t.v||t)?"var(--panel)":"transparent",color:active===(t.v||t)?"var(--text)":"var(--muted)",transition:"all 0.15s"}}>{t.l||t}</div>)}</div>}
function SHead({title,sub}){return<div style={{marginBottom:22}}><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"var(--text)",fontWeight:600,margin:0}}>{title}</h1>{sub&&<p style={{color:"var(--muted)",fontSize:13,marginTop:3,marginBottom:0}}>{sub}</p>}</div>}
function TH({cols}){return<thead><tr style={{background:"#EDE5D6"}}>{cols.map(c=><th key={c} style={{padding:"9px 12px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:0.8,color:"var(--muted)",fontWeight:500,whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>}
function TR2({row,i}){return<tr style={{background:i%2===0?"var(--panel)":"#F8F3EA"}}>{row.map((c,j)=><td key={j} style={{padding:"10px 12px",fontSize:13,color:"var(--text)",borderBottom:"1px solid var(--border)"}}>{c}</td>)}</tr>}
function Steps({steps,cur}){return<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:22,flexWrap:"wrap"}}>{steps.map((s,i)=><div key={s} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:cur>i+1?"#357A52":cur===i+1?"var(--gold)":"var(--border)",color:cur>=i+1?"#fff":"var(--muted)",fontSize:11,fontWeight:700,flexShrink:0}}>{cur>i+1?"✓":i+1}</div><span style={{fontSize:12.5,color:cur===i+1?"var(--text)":"var(--muted)",fontWeight:cur===i+1?500:400,marginRight:4}}>{s}</span>{i<steps.length-1&&<span style={{color:"var(--border)",fontSize:16,marginRight:4}}>›</span>}</div>)}</div>}
function Spinner(){return<div style={{display:"flex",justifyContent:"center",padding:40}}><div style={{width:28,height:28,border:"3px solid var(--border)",borderTopColor:"var(--gold)",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}

// ══════════════════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════════════════
function Dashboard({productions,inventory,expenses,setView}){
  const m=new Date().toISOString().slice(0,7)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(m))
  const rev=mp.filter(p=>p.paymentType==="full"||p.paymentType==="discount").reduce((s,p)=>s+(p.salePrice||0),0)
  const cost=mp.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0)
  const expTotal=expenses.filter(e=>e.date?.startsWith(m)).reduce((s,e)=>s+(e.amount||0),0)
  const profit=rev-cost-expTotal
  const lowStock=inventory.filter(i=>i.stock<=(i.minStock||3))
  const monthLabel=new Date().toLocaleDateString("en-NG",{month:"long",year:"numeric"})
  const gifts=mp.filter(p=>p.paymentType==="gift"||p.paymentType==="sample").length

  return <div>
    <SHead title="Dashboard" sub={`${monthLabel} — your bakery at a glance`}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20}}>
      {[{label:"Monthly Revenue",val:fmt(rev),sub:`${mp.length} orders`,accent:"var(--gold)"},
        {label:"Production Cost",val:fmt(cost),sub:"ingredients + delivery",accent:"#2A5F9A"},
        {label:"Other Expenses",val:fmt(expTotal),sub:`${expenses.filter(e=>e.date?.startsWith(m)).length} entries`,accent:"#8C6E52"},
        {label:"Net Profit",val:fmt(profit),sub:`${gifts} gift/sample`,accent:profit>=0?"#357A52":"#B03A2E"},
      ].map(s=><Card key={s.label} style={{borderTop:`3px solid ${s.accent}`}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"var(--text)"}}>{s.val}</div>
        <div style={{fontSize:11.5,color:"var(--muted)",marginTop:3}}>{s.sub}</div>
      </Card>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Recent Productions</div>
        {productions.length===0?<div style={{fontSize:13,color:"var(--muted)"}}>No productions yet.</div>:
        productions.slice(0,5).map(p=>{
          const ptColor={full:"green",gift:"purple",sample:"blue",discount:"gold"}[p.paymentType]||"gray"
          return <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
            <div><div style={{fontSize:13,fontWeight:500}}>{p.size} · {p.covering}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>{p.client} · {p.deliveryDate}</div></div>
            <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
              <Badge color={ptColor}>{p.paymentType}</Badge>
              <div style={{fontSize:12.5,fontWeight:600,color:"var(--gold)"}}>{fmt(p.salePrice)}</div>
            </div>
          </div>
        })}
        <div style={{marginTop:12}}><Btn small variant="outline" onClick={()=>setView("records")}>View All →</Btn></div>
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{background:lowStock.length>0?"#FFF9EE":"var(--panel)",borderColor:lowStock.length>0?"var(--gold)":"var(--border)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>{lowStock.length>0?`⚠ ${lowStock.length} Low Stock Items`:"✓ Stock Levels OK"}</div>
          {lowStock.length===0?<div style={{fontSize:13,color:"#357A52"}}>All items stocked above minimum.</div>:
          lowStock.slice(0,4).map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)"}}>
            <span style={{fontSize:12.5}}>{i.name}</span><Badge color={i.stock===0?"red":"gold"}>{i.stock} {i.unit}</Badge>
          </div>)}
          {lowStock.length>0&&<div style={{marginTop:10}}><Btn small variant="outline" onClick={()=>setView("shopping")}>Generate Shopping List →</Btn></div>}
        </Card>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:10}}>Quick Actions</div>
          {[{icon:"🎂",label:"New cake production",view:"production"},{icon:"🧾",label:"Scan receipt",view:"receipts"},{icon:"💸",label:"Add cash expense",view:"expenses"},{icon:"📊",label:"Monthly P&L report",view:"reports"},{icon:"🛒",label:"Generate shopping list",view:"shopping"},{icon:"📄",label:"Create invoice",view:"invoices"}].map(a=><div key={a.view} onClick={()=>setView(a.view)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 8px",borderRadius:8,cursor:"pointer",marginBottom:2,transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background="#F0E9DB"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:15}}>{a.icon}</span><span style={{fontSize:13}}>{a.label}</span>
          </div>)}
        </Card>
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  SETUP / MASTER LIST
// ══════════════════════════════════════════════════════════════
function Setup({inventory,setInventory,accessoryPct,setAccessoryPct,company,setCompany}){
  const [tab,setTab]=useState("inventory")
  const [addInv,setAddInv]=useState(false)
  const [ni,setNi]=useState({name:"",cat:"",unit:"kg",cost:"",stock:"",minStock:""})
  const [openRid,setOpenRid]=useState(null)
  const [restock,setRestock]=useState({})
  const [csvMsg,setCsvMsg]=useState("")
  const csvRef=useRef()
  const logoRef=useRef()

  const saveInv=async()=>{
    if(!ni.name||!ni.cost)return
    const updated=[...inventory,{...ni,id:uid(),cost:+ni.cost,stock:+ni.stock||0,minStock:+ni.minStock||2}]
    setInventory(updated);await saveInventory(updated)
    setNi({name:"",cat:"",unit:"kg",cost:"",stock:"",minStock:""});setAddInv(false)
  }
  const doRestock=async(id)=>{
    const qty=+restock[id];if(!qty)return
    const updated=inventory.map(i=>i.id===id?{...i,stock:parseFloat((i.stock+qty).toFixed(3))}:i)
    setInventory(updated);await saveInventory(updated)
    setRestock(r=>({...r,[id]:""}))
  }
  const handleCSV=e=>{
    const file=e.target.files[0];if(!file)return
    const reader=new FileReader()
    reader.onload=async ev=>{
      try{
        const lines=ev.target.result.split("\n").filter(l=>l.trim())
        const headers=lines[0].toLowerCase().split(",").map(h=>h.trim())
        const ni=lines.slice(1).map(line=>{
          const cols=line.split(",").map(c=>c.trim().replace(/^"|"$/g,""))
          const obj={}
          headers.forEach((h,i)=>obj[h]=cols[i]||"")
          return {id:uid(),name:obj.name||obj.item||"",cat:obj.category||obj.cat||"",unit:obj.unit||"kg",cost:+(obj.cost||obj.price||0),stock:+(obj.stock||obj.quantity||0),minStock:+(obj.min||obj.minstock||2)}
        }).filter(i=>i.name)
        const updated=[...inventory,...ni]
        setInventory(updated);await saveInventory(updated)
        setCsvMsg(`✓ ${ni.length} items imported successfully`)
      }catch{setCsvMsg("⚠ Could not read file. Use CSV with columns: name, category, unit, cost, stock")}
    }
    reader.readAsText(file)
  }
  const handleLogo=e=>{
    const file=e.target.files[0];if(!file)return
    const reader=new FileReader()
    reader.onload=ev=>{
      const updated={...company,logo:ev.target.result}
      setCompany(updated);saveCompanySettings(updated)
    }
    reader.readAsDataURL(file)
  }

  return <div>
    <SHead title="Master List & Settings" sub="Set up once — every calculation pulls from here."/>
    <Tabs tabs={[{v:"inventory",l:"Inventory"},{v:"recipes",l:"Base Recipes"},{v:"flavours",l:"Flavour Extras"},{v:"company",l:"Company Settings"},{v:"pricing",l:"Pricing Settings"}]} active={tab} onChange={setTab}/>

    {tab==="inventory"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <span style={{fontSize:13,color:"var(--muted)"}}>{inventory.length} items · {fmt(inventory.reduce((s,i)=>s+i.cost*i.stock,0))} total value</span>
        <div style={{display:"flex",gap:8}}>
          <Btn small variant="ghost" onClick={()=>csvRef.current?.click()}>📥 Import CSV</Btn>
          <input ref={csvRef} type="file" accept=".csv" onChange={handleCSV} style={{display:"none"}}/>
          <Btn small onClick={()=>setAddInv(!addInv)}>+ Add Item</Btn>
        </div>
      </div>
      {csvMsg&&<div style={{padding:"8px 12px",background:csvMsg.startsWith("✓")?"#EEF8F3":"#FDEBE9",borderRadius:8,fontSize:12.5,marginBottom:12,color:csvMsg.startsWith("✓")?"#357A52":"#B03A2E"}}>{csvMsg}</div>}
      <div style={{fontSize:11.5,color:"var(--muted)",marginBottom:10}}>CSV format: name, category, unit, cost, stock, minStock</div>
      {addInv&&<Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>New Item</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
          <Inp label="Name *" value={ni.name} onChange={v=>setNi(p=>({...p,name:v}))} placeholder="e.g. Dark Chocolate"/>
          <Inp label="Category" value={ni.cat} onChange={v=>setNi(p=>({...p,cat:v}))} placeholder="Dry Goods…"/>
          <Inp label="Unit" value={ni.unit} onChange={v=>setNi(p=>({...p,unit:v}))} placeholder="kg/pcs/L"/>
          <Inp label="Cost/Unit (₦) *" type="number" value={ni.cost} onChange={v=>setNi(p=>({...p,cost:v}))}/>
          <Inp label="Opening Stock" type="number" value={ni.stock} onChange={v=>setNi(p=>({...p,stock:v}))}/>
          <Inp label="Min Stock Alert" type="number" value={ni.minStock} onChange={v=>setNi(p=>({...p,minStock:v}))}/>
        </div>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveInv}>Save</Btn><Btn variant="ghost" onClick={()=>setAddInv(false)}>Cancel</Btn></div>
      </Card>}
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
        <TH cols={["Item","Category","Unit","Cost/Unit","Stock","Min","Value","Restock"]}/>
        <tbody>{inventory.map((item,i)=><TR2 key={item.id} i={i} row={[
          <span style={{fontWeight:500}}>{item.name}</span>,
          <span style={{color:"var(--muted)",fontSize:12}}>{item.cat}</span>,
          item.unit,fmt(item.cost),
          <span style={{color:item.stock<=(item.minStock||3)?"#B03A2E":"var(--text)",fontWeight:item.stock<=(item.minStock||3)?600:400}}>{item.stock}</span>,
          <span style={{color:"var(--muted)",fontSize:12}}>{item.minStock||2}</span>,
          <span style={{color:"var(--gold)",fontWeight:500}}>{fmt(item.cost*item.stock)}</span>,
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <input type="number" placeholder="qty" value={restock[item.id]||""} onChange={e=>setRestock(r=>({...r,[item.id]:e.target.value}))} style={{...iSt,width:60,padding:"4px 6px",fontSize:12}}/>
            <Btn small variant="outline" onClick={()=>doRestock(item.id)}>+</Btn>
          </div>,
        ]}/>) }</tbody>
      </table></div>
    </div>}

    {tab==="recipes"&&<div>
      <div style={{marginBottom:12,padding:"10px 14px",background:"#FFF9EE",borderRadius:8,border:"1px solid var(--gold)",fontSize:13,lineHeight:1.7}}>
        Each base recipe maps to a <strong>size + covering</strong>. The app picks the matching recipe automatically when you log a production.
      </div>
      {RECIPES.map(r=>{
        const cost=recipeCost(r,inventory);const open=openRid===r.id
        return <Card key={r.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>setOpenRid(open?null:r.id)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:600,fontSize:14}}>{r.name}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Base cost: <strong style={{color:"var(--gold)"}}>{fmt(cost)}</strong></div></div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge color={r.covering==="fondant"?"blue":"gold"}>{r.covering}</Badge><span style={{color:"var(--muted)"}}>{open?"▴":"▾"}</span></div>
          </div>
          {open&&<div style={{marginTop:14,borderTop:"1px solid var(--border)",paddingTop:14}}>
            <table style={{width:"100%",fontSize:13}}><thead><tr>{["Ingredient","Qty","Line Cost"].map(h=><th key={h} style={{textAlign:h==="Ingredient"?"left":"right",fontSize:10,color:"var(--muted)",textTransform:"uppercase",paddingBottom:6}}>{h}</th>)}</tr></thead>
            <tbody>{r.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<tr key={ing.iid}><td style={{padding:"4px 0"}}>{it.name}</td><td style={{textAlign:"right",color:"var(--muted)"}}>{ing.qty}{it.unit}</td><td style={{textAlign:"right",fontWeight:500}}>{fmt(it.cost*ing.qty)}</td></tr>:null})}
            <tr style={{borderTop:"1px solid var(--border)"}}><td colSpan={2} style={{padding:"6px 0",textAlign:"right",fontWeight:700,paddingRight:8}}>Base Cost</td><td style={{textAlign:"right",fontWeight:700,color:"var(--gold)",fontSize:14}}>{fmt(cost)}</td></tr></tbody></table>
          </div>}
        </Card>
      })}
    </div>}

    {tab==="flavours"&&<div>
      <div style={{marginBottom:12,fontSize:13,color:"var(--muted)"}}>Extra ingredients added per layer for special flavours, on top of the base recipe.</div>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",background:"var(--panel)",borderRadius:10,overflow:"hidden",border:"1px solid var(--border)"}}>
        <TH cols={["Flavour","Extra Ingredients per Layer","Cost/Layer"]}/>
        <tbody>{Object.entries(FLAVOR_EXTRAS).map(([fl,extras],i)=>{
          const cost=extras.reduce((s,e)=>{const it=inventory.find(x=>x.id===e.iid);return s+(it?it.cost*e.qty:0)},0)
          return <TR2 key={fl} i={i} row={[
            <span style={{fontWeight:500,textTransform:"capitalize"}}>{fl}</span>,
            extras.length===0?<span style={{color:"var(--muted)"}}>Standard base</span>:extras.map(e=>{const it=inventory.find(x=>x.id===e.iid);return it?<span key={e.iid} style={{display:"inline-block",background:"var(--border)",borderRadius:4,padding:"2px 7px",fontSize:11.5,marginRight:4}}>{e.qty}{it.unit} {it.name}</span>:null}),
            cost>0?<span style={{color:"var(--gold)",fontWeight:500}}>+{fmt(cost)}</span>:<span style={{color:"var(--muted)"}}>—</span>,
          ]}/>
        })}</tbody>
      </table></div>
    </div>}

    {tab==="company"&&<div style={{maxWidth:520}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Company Profile</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Business Name" value={company.name} onChange={v=>{const u={...company,name:v};setCompany(u);saveCompanySettings(u)}}/>
          <Inp label="Tagline" value={company.tagline||""} onChange={v=>{const u={...company,tagline:v};setCompany(u);saveCompanySettings(u)}}/>
          <Inp label="Phone" value={company.phone||""} onChange={v=>{const u={...company,phone:v};setCompany(u);saveCompanySettings(u)}}/>
          <Inp label="Email" value={company.email||""} onChange={v=>{const u={...company,email:v};setCompany(u);saveCompanySettings(u)}}/>
        </div>
        <Inp label="Address" value={company.address||""} onChange={v=>{const u={...company,address:v};setCompany(u);saveCompanySettings(u)}}/>

        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginTop:16,marginBottom:12}}>Logo & Colours</div>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
          <div onClick={()=>logoRef.current?.click()} style={{width:80,height:80,borderRadius:10,border:"2px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#FAF7F0",flexShrink:0,overflow:"hidden"}}>
            {company.logo?<img src={company.logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",fontSize:11,color:"var(--muted)"}}>Upload<br/>Logo</div>}
          </div>
          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogo} style={{display:"none"}}/>
          <div style={{flex:1}}>
            <div style={{marginBottom:10}}>
              <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Primary Colour</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={company.primaryColor||"#C8912A"} onChange={e=>{const u={...company,primaryColor:e.target.value};setCompany(u);saveCompanySettings(u)}} style={{width:40,height:36,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/>
                <span style={{fontSize:12,color:"var(--muted)"}}>{company.primaryColor}</span>
              </div>
            </div>
            <div>
              <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:0.8}}>Sidebar Colour</label>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="color" value={company.sidebarColor||"#140801"} onChange={e=>{const u={...company,sidebarColor:e.target.value};setCompany(u);saveCompanySettings(u)}} style={{width:40,height:36,borderRadius:6,border:"1px solid var(--border)",cursor:"pointer",padding:2}}/>
                <span style={{fontSize:12,color:"var(--muted)"}}>{company.sidebarColor}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding:"10px 14px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,color:"var(--muted)"}}>Changes apply immediately across the app and appear on invoices and reports.</div>
      </Card>
    </div>}

    {tab==="pricing"&&<div style={{maxWidth:460}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Accessory & Extra Cost Margin</div>
        <p style={{fontSize:13,color:"var(--muted)",marginTop:0,lineHeight:1.7}}>Added to every cake's ingredient cost to cover boxes, boards, ribbons, printouts, and any accessories not in the recipe.</p>
        <div style={{display:"flex",alignItems:"center",gap:14,margin:"14px 0"}}>
          <input type="range" min={0} max={30} value={accessoryPct} onChange={e=>{setAccessoryPct(+e.target.value);saveSetting("accessoryPct",+e.target.value)}} style={{flex:1,accentColor:"var(--gold)"}}/>
          <div style={{fontSize:22,fontWeight:700,color:"var(--gold)",minWidth:46}}>{accessoryPct}%</div>
        </div>
        <div style={{fontSize:13,color:"var(--muted)"}}>Multiplier: <strong>×{(1+accessoryPct/100).toFixed(2)}</strong></div>
      </Card>
      <Card style={{marginTop:14}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Subscription Tier</div>
        <div style={{display:"flex",gap:0,borderRadius:10,overflow:"hidden",border:"1px solid var(--border)",marginBottom:14}}>
          {[{n:"Starter",p:"Free",f:"10 recipes · 20 items · No AI scans"},{n:"Baker",p:"₦4,000/mo",f:"30 recipes · AI scans · Full reports"},{n:"Pro",p:"₦8,000/mo",f:"Unlimited · Multi-staff · Invoicing"}].map((t,i)=>(
            <div key={t.n} style={{flex:1,padding:"12px 10px",textAlign:"center",background:i===1?"var(--gold)":"var(--panel)",color:i===1?"#fff":"var(--text)",borderRight:i<2?"1px solid var(--border)":"none"}}>
              <div style={{fontWeight:700,fontSize:13}}>{t.n}</div>
              <div style={{fontSize:12,marginTop:2,opacity:0.85}}>{t.p}</div>
              <div style={{fontSize:10.5,marginTop:4,opacity:0.7,lineHeight:1.4}}>{t.f}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:12,color:"var(--muted)"}}>Currently on <strong>Pro (Beta)</strong> — all features unlocked during testing phase.</div>
      </Card>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  PRODUCTION ENTRY
// ══════════════════════════════════════════════════════════════
function ProductionEntry({inventory,setInventory,accessoryPct,productions,setProductions,setView}){
  const [step,setStep]=useState(1)
  const [photo,setPhoto]=useState(null);const [photoB64,setPhotoB64]=useState(null)
  const [aiObs,setAiObs]=useState(null);const [aiLoading,setAiLoading]=useState(false)
  const [saving,setSaving]=useState(false)
  const fileRef=useRef()
  const [size,setSize]=useState("");const [covering,setCovering]=useState("")
  const [layers,setLayers]=useState("2");const [flavors,setFlavors]=useState("")
  const [client,setClient]=useState("");const [clientPhone,setClientPhone]=useState("");const [clientEmail,setClientEmail]=useState("")
  const [orderDate,setOrderDate]=useState(today());const [delivDate,setDelivDate]=useState("")
  const [salePrice,setSalePrice]=useState("");const [deliveryCost,setDeliveryCost]=useState("0")
  const [paymentType,setPaymentType]=useState("full");const [discountPct,setDiscountPct]=useState("0")
  const [notes,setNotes]=useState("")
  const SIZES=['6"','8"','10"','12"','2-tier','3-tier','cupcakes×12','cupcakes×24']
  const COVERINGS=["buttercream","fondant","ganache","naked"]
  const matchedRecipe=RECIPES.find(r=>r.size===size&&r.covering===covering)||RECIPES.find(r=>r.size===size)||null
  const baseCost=matchedRecipe?calcCost(matchedRecipe,inventory,+layers,flavors,accessoryPct):0
  const delivery=+deliveryCost||0
  const totalCost=baseCost+delivery
  const discount=paymentType==="discount"?(+salePrice*(+discountPct/100)):0
  const effectiveSale=paymentType==="full"?(+salePrice):paymentType==="discount"?(+salePrice-discount):0
  const profit=effectiveSale-totalCost
  const fl=(flavors||"").toLowerCase().split(/[,+&]/).map(f=>f.trim()).filter(Boolean)
  const extraLines=[]
  if(matchedRecipe)fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const it=inventory.find(x=>x.id===e.iid);if(it)extraLines.push({name:`${it.name} (${f} ×${layers}L)`,cost:it.cost*e.qty*(+layers)})}))
  const ingSubtotal=matchedRecipe?recipeCost(matchedRecipe,inventory):0
  const extraTotal=extraLines.reduce((s,l)=>s+l.cost,0)

  const handleFile=e=>{const file=e.target.files[0];if(!file)return;setPhoto(URL.createObjectURL(file));const r=new FileReader();r.onload=ev=>setPhotoB64(ev.target.result.split(",")[1]);r.readAsDataURL(file)}

  const readPhoto=async()=>{
    if(!photoB64)return;setAiLoading(true)
    try{
      const raw=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:photoB64}},{type:"text",text:`Analyze this cake for a Nigerian bakery. Return ONLY JSON:\n{"estimatedSize":"e.g. 8 inch","covering":"buttercream|fondant|ganache|naked","estimatedTiers":1,"colorDescription":"e.g. blue with gold","decorationDetails":"roses, drip","photoNotes":"one sentence"}`}]}],"Analyze cake photos for bookkeeping. Return JSON only.")
      const r=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setAiObs(r)
      if(!covering&&r.covering&&COVERINGS.includes(r.covering))setCovering(r.covering)
      if(!size&&r.estimatedSize){const s=r.estimatedSize.replace(/\s*inch/i,'"');if(SIZES.includes(s))setSize(s)}
    }catch{}finally{setAiLoading(false)}
  }

  const doSave=async()=>{
    setSaving(true)
    const prod={id:uid(),recipeId:matchedRecipe?.id,client,clientPhone,clientEmail,orderDate,deliveryDate:delivDate,cost:Math.round(baseCost),deliveryCost:delivery,salePrice:Math.round(effectiveSale),status:"pending",size,covering,flavors,layers:+layers,accessoryPct,paymentType,discountPct:+discountPct,notes,photo:null}
    if(matchedRecipe){
      const deductions=[...matchedRecipe.ing.map(i=>({...i}))]
      fl.forEach(f=>(FLAVOR_EXTRAS[f]||[]).forEach(e=>{const ex=deductions.find(d=>d.iid===e.iid);if(ex)ex.qty=parseFloat((ex.qty+e.qty*(+layers)).toFixed(3));else deductions.push({iid:e.iid,qty:e.qty*(+layers)})}))
      const updInv=inventory.map(item=>{const ing=deductions.find(i=>i.iid===item.id);return ing?{...item,stock:Math.max(0,parseFloat((item.stock-ing.qty).toFixed(3)))}:item})
      setInventory(updInv);await saveInventory(updInv)
    }
    setProductions(prev=>[prod,...prev]);await saveProduction(prod)
    setSaving(false);setView("records")
  }

  return <div>
    <SHead title="New Production Entry" sub="Photo + details → automatic cost breakdown and inventory deduction."/>
    <Steps steps={["Cake Details","Cost Review","Confirm"]} cur={step}/>

    {step===1&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>📸 Cake Photo <span style={{fontSize:11,fontWeight:400,color:"var(--muted)"}}>(optional)</span></div>
        <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:photo?4:36,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:10,minHeight:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="cake" style={{maxHeight:180,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:36,marginBottom:6}}>🎂</div><div style={{fontSize:13,color:"var(--muted)"}}>Tap to upload cake photo</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!aiObs&&<Btn full onClick={readPhoto} disabled={aiLoading}>{aiLoading?"🔍 Reading…":"✦ Let AI read this photo"}</Btn>}
        {aiObs&&<div style={{background:"#FFF9EE",borderRadius:8,padding:10,border:"1px solid var(--gold)",fontSize:12.5,marginTop:8}}>
          <div style={{fontWeight:600,marginBottom:6}}>✦ AI observed:</div>
          {[["Size",aiObs.estimatedSize],["Covering",aiObs.covering],["Colour",aiObs.colorDescription],["Decor",aiObs.decorationDetails]].map(([k,v])=>v?<div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"var(--muted)"}}>{k}</span><span style={{fontWeight:500,textTransform:"capitalize"}}>{v}</span></div>:null)}
          <div style={{fontSize:11,color:"var(--muted)",marginTop:5,fontStyle:"italic"}}>"{aiObs.photoNotes}"</div>
        </div>}
      </Card>

      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Cake & Order Details</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Cake Size *" value={size} onChange={setSize} options={SIZES.map(s=>({value:s,label:s}))}/>
          <Sel label="Covering *" value={covering} onChange={setCovering} options={COVERINGS.map(c=>({value:c,label:c.charAt(0).toUpperCase()+c.slice(1)}))}/>
          <Sel label="Layers *" value={layers} onChange={setLayers} options={["1","2","3","4","5","6"].map(n=>({value:n,label:`${n} layer${+n>1?"s":""}`}))}/>
          <Inp label="Flavour(s) *" value={flavors} onChange={setFlavors} placeholder="Vanilla, Chocolate…"/>
        </div>
        <Inp label="Client Name *" value={client} onChange={setClient} placeholder="Mrs. Chioma Okafor"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Client Phone" value={clientPhone} onChange={setClientPhone} placeholder="+234…"/>
          <Inp label="Client Email" value={clientEmail} onChange={setClientEmail} placeholder="email@…"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Order Date" type="date" value={orderDate} onChange={setOrderDate}/>
          <Inp label="Delivery Date *" type="date" value={delivDate} onChange={setDelivDate}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Sale Price (₦)" type="number" value={salePrice} onChange={setSalePrice} placeholder="0"/>
          <Inp label="Delivery Cost (₦)" type="number" value={deliveryCost} onChange={setDeliveryCost} placeholder="0"/>
        </div>
        <Sel label="Payment Type *" value={paymentType} onChange={setPaymentType} options={PAYMENT_TYPES.map(p=>({value:p.v,label:p.l}))}/>
        {paymentType==="discount"&&<Inp label="Discount %" type="number" value={discountPct} onChange={setDiscountPct} placeholder="e.g. 20"/>}
        <Inp label="Notes" value={notes} onChange={setNotes} placeholder="Colour, theme, special requests…"/>
        {matchedRecipe&&<div style={{padding:"8px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,marginBottom:12}}>Matched: <strong>{matchedRecipe.name}</strong> + {accessoryPct}% margin</div>}
        <Btn full onClick={()=>setStep(2)} disabled={!size||!covering||!flavors||!client||!delivDate}>Review Cost Breakdown →</Btn>
      </Card>
    </div>}

    {step===2&&matchedRecipe&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:16}}>Cost Breakdown</div>
        <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Base Ingredients</div>
        {matchedRecipe.ing.map(ing=>{const it=inventory.find(x=>x.id===ing.iid);return it?<div key={ing.iid} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}><span>{it.name} <span style={{color:"var(--muted)"}}>({ing.qty}{it.unit})</span></span><span>{fmt(it.cost*ing.qty)}</span></div>:null})}
        {extraLines.length>0&&<>
          <div style={{fontSize:10.5,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,margin:"10px 0 6px"}}>Flavour Extras</div>
          {extraLines.map((l,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}><span>{l.name}</span><span>+{fmt(l.cost)}</span></div>)}
        </>}
        <div style={{borderTop:"1px solid var(--border)",marginTop:6,paddingTop:6}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"var(--muted)",padding:"3px 0"}}><span>Ingredient subtotal</span><span>{fmt(ingSubtotal+extraTotal)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"var(--muted)",padding:"3px 0"}}><span>Accessory margin ({accessoryPct}%)</span><span>+{fmt(baseCost-(ingSubtotal+extraTotal))}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,color:"var(--muted)",padding:"3px 0"}}><span>Delivery cost</span><span>+{fmt(delivery)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,padding:"8px 0",borderTop:"1px solid var(--border)",marginTop:4}}><span>Total Production Cost</span><span style={{color:"var(--gold)"}}>{fmt(totalCost)}</span></div>
        </div>
        {(paymentType==="full"||paymentType==="discount")&&salePrice&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF",marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Listed Price</span><span style={{fontWeight:500}}>{fmt(+salePrice)}</span></div>
          {paymentType==="discount"&&<div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Discount ({discountPct}%)</span><span style={{color:"#B03A2E"}}>–{fmt(discount)}</span></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{color:"var(--muted)"}}>Effective Sale</span><span style={{fontWeight:600}}>{fmt(effectiveSale)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,paddingTop:8,borderTop:"1px solid #C2E0CF"}}><span>Gross Profit</span><span style={{color:"#357A52"}}>{fmt(profit)}</span></div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>Margin: {effectiveSale>0?Math.round((profit/effectiveSale)*100):0}%</div>
        </div>}
        {(paymentType==="gift"||paymentType==="sample")&&<div style={{background:"#F0EAFC",borderRadius:8,padding:12,marginTop:8,fontSize:13,color:"#6B32A0"}}>This production is recorded as a <strong>{paymentType}</strong> — no revenue logged but all costs are tracked.</div>}
      </Card>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>Order Summary</div>
        {[[`Size & Covering`,`${size} · ${covering}`],["Layers",`${layers} layer${+layers>1?"s":""}`],["Flavours",flavors],["Client",client],[" Phone",clientPhone||"—"],["Email",clientEmail||"—"],["Order Date",orderDate],["Delivery Date",delivDate],["Payment",PAYMENT_TYPES.find(p=>p.v===paymentType)?.l||paymentType],["Notes",notes||"—"]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--border)",fontSize:12.5}}><span style={{color:"var(--muted)"}}>{k}</span><span style={{fontWeight:500}}>{v}</span></div>)}
        {photo&&<img src={photo} alt="" style={{width:"100%",borderRadius:8,marginTop:12}}/>}
        <div style={{marginTop:12,fontSize:12,color:"var(--muted)",background:"#FFF9EE",borderRadius:6,padding:"8px 10px"}}>⚠ Saving deducts {matchedRecipe.ing.length} ingredient(s) from inventory.</div>
        <div style={{marginTop:12,display:"flex",gap:8}}><Btn onClick={()=>setStep(3)}>Confirm →</Btn><Btn variant="ghost" onClick={()=>setStep(1)}>← Edit</Btn></div>
      </Card>
    </div>}

    {step===3&&<div style={{maxWidth:480}}>
      <Card style={{borderColor:"#357A52",background:"#F2FAF6"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:6}}>✓ Ready to Save</div>
        <p style={{fontSize:13,color:"var(--muted)",marginTop:0}}>Creates a production record, logs all costs, and deducts ingredients automatically.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,padding:"12px 0",borderTop:"1px solid var(--border)"}}>
          {[["Prod. Cost",fmt(totalCost)],["Sale Price",fmt(effectiveSale)],["Gross Profit",fmt(profit)]].map(([k,v])=><div key={k} style={{background:"var(--panel)",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8}}>{k}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700,color:"var(--gold)",marginTop:3}}>{v}</div></div>)}
        </div>
        <div style={{display:"flex",gap:8,marginTop:4}}>{saving?<Spinner/>:<><Btn variant="success" onClick={doSave}>✓ Save Production Record</Btn><Btn variant="ghost" onClick={()=>setStep(2)}>← Back</Btn></>}</div>
      </Card>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  RECEIPT SCANNER
// ══════════════════════════════════════════════════════════════
function ReceiptScanner({inventory,setInventory,expenses,setExpenses}){
  const [photo,setPhoto]=useState(null);const [photoB64,setPhotoB64]=useState(null)
  const [loading,setLoading]=useState(false);const [error,setError]=useState(null)
  const [parsed,setParsed]=useState(null);const [saved,setSaved]=useState(false)
  const [totalAmount,setTotalAmount]=useState("")
  const fileRef=useRef()

  const handleFile=e=>{const file=e.target.files[0];if(!file)return;setPhoto(URL.createObjectURL(file));const r=new FileReader();r.onload=ev=>setPhotoB64(ev.target.result.split(",")[1]);r.readAsDataURL(file);setParsed(null);setSaved(false);setError(null)}

  const scan=async()=>{
    if(!photoB64)return;setLoading(true);setError(null)
    try{
      const invList=inventory.map(i=>`${i.id}:${i.name}(${i.unit})`).join(", ")
      const raw=await callClaude([{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:photoB64}},{type:"text",text:`Nigerian bakery receipt. Extract all items and total amount. Match items to inventory: ${invList}. Return ONLY JSON:\n{"items":[{"item_on_receipt":"text","qty":0.5,"unit":"kg","matched_id":"i1 or null","matched_name":"name or null","unit_price":0,"line_total":0,"confidence":"high|medium|low"}],"receipt_total":0,"receipt_date":"YYYY-MM-DD or null","supplier":"store name or null"}`}]}],"Parse Nigerian bakery receipts. Return JSON only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setParsed({...result,items:result.items.map(r=>({...r,approved:r.confidence!=="low",overrideId:r.matched_id}))})
      if(result.receipt_total)setTotalAmount(String(result.receipt_total))
    }catch{setError("Could not read receipt. Try a clearer photo in good lighting.")}
    finally{setLoading(false)}
  }

  const toggleApprove=idx=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,approved:!r.approved}:r)}))
  const setMatch=(idx,id)=>setParsed(p=>({...p,items:p.items.map((r,i)=>i===idx?{...r,overrideId:id,approved:true}:r)}))

  const applyUpdates=async()=>{
    const approved=parsed.items.filter(r=>r.approved&&r.overrideId)
    const updInv=inventory.map(item=>{const match=approved.find(r=>r.overrideId===item.id);return match?{...item,stock:parseFloat((item.stock+match.qty).toFixed(3))}:item})
    setInventory(updInv);await saveInventory(updInv)
    // Add to expenses
    const exp={id:uid(),date:parsed.receipt_date||today(),description:`Purchase: ${parsed.supplier||"Supplier"}`,amount:+totalAmount||parsed.items.reduce((s,r)=>s+(r.line_total||0),0),category:"Ingredients",paymentMethod:"cash",source:"receipt",items:parsed.items.filter(r=>r.approved).map(r=>r.item_on_receipt)}
    const updExp=[exp,...expenses];setExpenses(updExp);saveExpenses(updExp)
    setParsed(null);setPhoto(null);setPhotoB64(null);setSaved(true)
  }

  return <div>
    <SHead title="Receipt Scanner" sub="Photo → AI reads it → inventory updated + expense logged automatically."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:12}}>📷 Upload Receipt</div>
        <div onClick={()=>fileRef.current?.click()} style={{border:"2px dashed var(--border)",borderRadius:10,padding:photo?4:44,textAlign:"center",cursor:"pointer",background:"#FAF7F0",marginBottom:12,minHeight:140,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {photo?<img src={photo} alt="receipt" style={{maxHeight:260,maxWidth:"100%",borderRadius:8}}/>:<div><div style={{fontSize:38,marginBottom:6}}>🧾</div><div style={{fontSize:13,color:"var(--muted)"}}>Tap to upload receipt</div><div style={{fontSize:11.5,color:"#C8B89A",marginTop:3}}>Printed or handwritten</div></div>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        {photo&&!parsed&&!saved&&<><Btn full onClick={scan} disabled={loading}>{loading?"🔍 Reading receipt…":"✦ Scan & Extract Items"}</Btn>{error&&<div style={{fontSize:12,color:"#B03A2E",marginTop:8}}>⚠ {error}</div>}</>}
        {saved&&<div style={{background:"#EEF8F3",borderRadius:8,padding:12,border:"1px solid #C2E0CF",marginTop:8}}>
          <div style={{fontWeight:600,color:"#357A52",marginBottom:4}}>✓ Done! Inventory updated & expense logged.</div>
          <Btn small variant="outline" onClick={()=>{setSaved(false);setPhoto(null);setPhotoB64(null)}}>Scan Another</Btn>
        </div>}
      </Card>
      <div>
        {parsed?<Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:6}}>Items Detected</div>
          {parsed.supplier&&<div style={{fontSize:12.5,color:"var(--muted)",marginBottom:4}}>Supplier: <strong>{parsed.supplier}</strong></div>}
          {parsed.receipt_date&&<div style={{fontSize:12.5,color:"var(--muted)",marginBottom:8}}>Date: <strong>{parsed.receipt_date}</strong></div>}
          {parsed.items.map((r,idx)=><div key={idx} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:13,fontWeight:500}}>{r.item_on_receipt}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>{r.qty} {r.unit} · {fmt(r.line_total||0)}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Badge color={r.confidence==="high"?"green":r.confidence==="medium"?"gold":"red"}>{r.confidence}</Badge>
                <div onClick={()=>toggleApprove(idx)} style={{width:34,height:18,borderRadius:9,background:r.approved?"#357A52":"var(--border)",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}><div style={{width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:2,left:r.approved?18:2,transition:"left 0.2s"}}/></div>
              </div>
            </div>
            {r.approved&&<div style={{marginTop:6}}><select value={r.overrideId||""} onChange={e=>setMatch(idx,e.target.value)} style={{...iSt,fontSize:12,padding:"5px 8px"}}><option value="">— Skip —</option>{inventory.map(i=><option key={i.id} value={i.id}>{i.name} ({i.unit}) · {i.stock} in stock</option>)}</select></div>}
          </div>)}
          <Inp label="Receipt Total (₦)" type="number" value={totalAmount} onChange={setTotalAmount} placeholder="Total amount paid"/>
          <div style={{marginTop:12,display:"flex",gap:8}}><Btn variant="success" onClick={applyUpdates} disabled={!parsed.items.some(r=>r.approved&&r.overrideId)}>✓ Update Inventory & Log Expense</Btn><Btn variant="ghost" onClick={()=>{setParsed(null);setPhoto(null);setPhotoB64(null)}}>← Rescan</Btn></div>
        </Card>:<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>How It Works</div>
          {[["📸","Photograph any receipt — printed or handwritten market receipt."],["🔍","AI reads every item, quantity, and total. Matches items to your inventory."],["✅","Review, toggle off errors, fix inventory matches."],["📦","Tap Update — stock is added and expense is automatically logged."]].map(([icon,text])=><div key={icon} style={{display:"flex",gap:10,marginBottom:12,alignItems:"flex-start"}}><span style={{fontSize:18,flexShrink:0}}>{icon}</span><span style={{fontSize:13,color:"var(--muted)",lineHeight:1.6}}>{text}</span></div>)}
          <div style={{padding:"8px 12px",background:"#FEF0D0",borderRadius:8,fontSize:12,color:"#7A5500",lineHeight:1.6}}><strong>Tip:</strong> Take photos in good natural light. Printed receipts give best results.</div>
        </Card>}
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  EXPENSES TAB
// ══════════════════════════════════════════════════════════════
function Expenses({expenses,setExpenses}){
  const [tab,setTab]=useState("all")
  const [adding,setAdding]=useState(false)
  const [ne,setNe]=useState({date:today(),description:"",amount:"",category:"Ingredients",paymentMethod:"cash",notes:""})

  const saveExp=()=>{
    if(!ne.description||!ne.amount)return
    const updated=[{...ne,id:uid(),amount:+ne.amount,source:"manual"},...expenses]
    setExpenses(updated);saveExpenses(updated)
    setNe({date:today(),description:"",amount:"",category:"Ingredients",paymentMethod:"cash",notes:""});setAdding(false)
  }
  const deleteExp=id=>{const updated=expenses.filter(e=>e.id!==id);setExpenses(updated);saveExpenses(updated)}

  const m=new Date().toISOString().slice(0,7)
  const filtered=tab==="all"?expenses:tab==="month"?expenses.filter(e=>e.date?.startsWith(m)):expenses.filter(e=>e.source===tab)
  const total=filtered.reduce((s,e)=>s+(e.amount||0),0)
  const byCat={}
  filtered.forEach(e=>{byCat[e.category]=(byCat[e.category]||0)+(e.amount||0)})

  return <div>
    <SHead title="Expenses" sub="All business expenses — from receipts, bank imports, and manual cash entries."/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
      <Tabs tabs={[{v:"all",l:"All"},{v:"month",l:"This Month"},{v:"manual",l:"Cash"},{v:"receipt",l:"Receipts"}]} active={tab} onChange={setTab}/>
      <Btn onClick={()=>setAdding(!adding)}>+ Add Cash Expense</Btn>
    </div>

    {adding&&<Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>New Manual Expense</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <Inp label="Date *" type="date" value={ne.date} onChange={v=>setNe(p=>({...p,date:v}))}/>
        <Inp label="Description *" value={ne.description} onChange={v=>setNe(p=>({...p,description:v}))} placeholder="e.g. Fruits from market"/>
        <Inp label="Amount (₦) *" type="number" value={ne.amount} onChange={v=>setNe(p=>({...p,amount:v}))}/>
        <Sel label="Category" value={ne.category} onChange={v=>setNe(p=>({...p,category:v}))} options={EXP_CATS.map(c=>({value:c,label:c}))}/>
        <Sel label="Payment Method" value={ne.paymentMethod} onChange={v=>setNe(p=>({...p,paymentMethod:v}))} options={[{value:"cash",label:"Cash"},{value:"transfer",label:"Bank Transfer"},{value:"pos",label:"POS/Card"}]}/>
        <Inp label="Notes" value={ne.notes} onChange={v=>setNe(p=>({...p,notes:v}))} placeholder="Optional note"/>
      </div>
      <div style={{display:"flex",gap:8}}><Btn onClick={saveExp}>Save Expense</Btn><Btn variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn></div>
    </Card>}

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
      <Card style={{borderTop:"3px solid #B03A2E"}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Total Expenses</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#B03A2E"}}>{fmt(total)}</div>
        <div style={{fontSize:11.5,color:"var(--muted)",marginTop:3}}>{filtered.length} entries</div>
      </Card>
      <Card>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>By Category</div>
        {Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([cat,amt])=><div key={cat} style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12.5}}><span>{cat}</span><span style={{fontWeight:500}}>{fmt(amt)}</span></div>)}
      </Card>
    </div>

    <Card style={{padding:0}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <TH cols={["Date","Description","Category","Payment","Amount","Source",""]}/>
        <tbody>
          {filtered.length===0?<tr><td colSpan={7} style={{padding:36,textAlign:"center",color:"var(--muted)"}}>No expenses yet. Add a cash expense or scan a receipt.</td></tr>:
          filtered.map((e,i)=><TR2 key={e.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{e.date}</span>,
            <span style={{fontWeight:500}}>{e.description}</span>,
            <Badge>{e.category}</Badge>,
            <span style={{fontSize:12,color:"var(--muted)"}}>{e.paymentMethod}</span>,
            <span style={{color:"#B03A2E",fontWeight:600}}>{fmt(e.amount)}</span>,
            <Badge color={e.source==="receipt"?"blue":e.source==="bank"?"green":"gray"}>{e.source||"manual"}</Badge>,
            <Btn small variant="ghost" onClick={()=>deleteExp(e.id)}>×</Btn>,
          ]}/>)}
        </tbody>
      </table>
    </Card>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  RECORDS
// ══════════════════════════════════════════════════════════════
function Records({productions,setProductions,setView,setPrefillProd}){
  const [filter,setFilter]=useState("all")
  const filtered=filter==="all"?productions:productions.filter(p=>filter==="pending"||filter==="delivered"?p.status===filter:p.paymentType===filter)
  const markDelivered=async id=>{setProductions(p=>p.map(x=>x.id===id?{...x,status:"delivered"}:x));await updateProductionStatus(id,"delivered")}

  return <div>
    <SHead title="Production Records" sub={`${productions.length} total entries`}/>
    <Tabs tabs={[{v:"all",l:"All"},{v:"pending",l:"Pending"},{v:"delivered",l:"Delivered"},{v:"gift",l:"Gifts"},{v:"sample",l:"Samples"}]} active={filter} onChange={setFilter}/>
    <Card style={{padding:0,overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <TH cols={["Date","Size · Covering","Flavours","Client","Cost","Delivery","Sale","Profit","Type","Status",""]}/>
        <tbody>
          {filtered.length===0?<tr><td colSpan={11} style={{padding:36,textAlign:"center",color:"var(--muted)"}}>No records matching this filter.</td></tr>:
          filtered.map((p,i)=>{
            const profit=(p.salePrice||0)-(p.cost||0)-(p.deliveryCost||0)
            const ptColor={full:"green",gift:"purple",sample:"blue",discount:"gold"}[p.paymentType]||"gray"
            return <TR2 key={p.id} i={i} row={[
              <span style={{color:"var(--muted)",fontSize:12}}>{p.deliveryDate}</span>,
              <span style={{fontWeight:500,fontSize:12.5}}>{p.size} · {p.covering}</span>,
              <span style={{color:"var(--muted)",fontSize:11.5}}>{p.flavors}</span>,
              <span style={{fontSize:12.5}}>{p.client}</span>,
              fmt(p.cost),
              <span style={{fontSize:12}}>{p.deliveryCost?fmt(p.deliveryCost):"—"}</span>,
              <span style={{color:"var(--gold)",fontWeight:600}}>{fmt(p.salePrice)}</span>,
              <span style={{color:"#357A52",fontWeight:600}}>{fmt(profit)}</span>,
              <Badge color={ptColor}>{p.paymentType}</Badge>,
              <Badge color={p.status==="delivered"?"green":"gold"}>{p.status}</Badge>,
              <div style={{display:"flex",gap:4}}>
                {p.status==="pending"&&<Btn small variant="outline" onClick={()=>markDelivered(p.id)}>✓</Btn>}
                <Btn small variant="ghost" onClick={()=>{setPrefillProd(p);setView("invoices")}}>Invoice</Btn>
              </div>,
            ]}/>
          })}
        </tbody>
      </table>
    </Card>
    {filtered.length>0&&<div style={{marginTop:12,padding:"10px 12px",background:"var(--panel)",borderRadius:8,border:"1px solid var(--border)",display:"flex",gap:20,flexWrap:"wrap"}}>
      <span style={{fontSize:13,color:"var(--muted)"}}>Revenue: <strong style={{color:"var(--gold)"}}>{fmt(filtered.filter(p=>p.paymentType==="full"||p.paymentType==="discount").reduce((s,p)=>s+(p.salePrice||0),0))}</strong></span>
      <span style={{fontSize:13,color:"var(--muted)"}}>Cost: <strong>{fmt(filtered.reduce((s,p)=>s+(p.cost||0)+(p.deliveryCost||0),0))}</strong></span>
      <span style={{fontSize:13,color:"var(--muted)"}}>Profit: <strong style={{color:"#357A52"}}>{fmt(filtered.filter(p=>p.paymentType==="full"||p.paymentType==="discount").reduce((s,p)=>s+(p.salePrice||0)-(p.cost||0)-(p.deliveryCost||0),0))}</strong></span>
      <span style={{fontSize:13,color:"var(--muted)"}}>Gifts/Samples: <strong style={{color:"#6B32A0"}}>{filtered.filter(p=>p.paymentType==="gift"||p.paymentType==="sample").length}</strong></span>
    </div>}
  </div>
}

// ══════════════════════════════════════════════════════════════
//  BANK IMPORT
// ══════════════════════════════════════════════════════════════
function BankImport({transactions,setTransactions,productions,expenses,setExpenses}){
  const [input,setInput]=useState("");const [loading,setLoading]=useState(false)
  const [error,setError]=useState(null);const [parsed,setParsed]=useState([])

  const parse=async()=>{
    if(!input.trim())return;setLoading(true);setError(null)
    try{
      const raw=await callClaude([{role:"user",content:`Parse this Nigerian bank statement. Return ONLY a JSON array:\n[{"date":"YYYY-MM-DD","description":"narration","amount":12345,"type":"credit|debit","category":"sales|ingredients|delivery|packaging|utilities|salaries|marketing|transfer|unknown"}]\n\n${input}`}],"Parse Nigerian bank statements. Return JSON array only.")
      const result=JSON.parse(raw.replace(/```json|```/g,"").trim())
      setParsed(result.map(t=>({...t,id:uid(),matchedProdId:null})))
    }catch{setError("Could not parse. Paste raw text from your bank portal.")}
    finally{setLoading(false)}
  }

  const match=(txId,prodId)=>setParsed(p=>p.map(t=>t.id===txId?{...t,matchedProdId:prodId}:t))

  const saveAll=async()=>{
    const updated=[...parsed,...transactions]
    setTransactions(updated);await saveTransactions(parsed)
    // Add debits to expenses
    const debits=parsed.filter(t=>t.type==="debit").map(t=>({id:uid(),date:t.date,description:t.description,amount:t.amount,category:t.category==="ingredients"?"Ingredients":t.category==="delivery"?"Delivery":t.category==="utilities"?"Utilities":t.category==="salaries"?"Salaries":"Miscellaneous",paymentMethod:"transfer",source:"bank"}))
    if(debits.length>0){const updExp=[...debits,...expenses];setExpenses(updExp);saveExpenses(updExp)}
    setParsed([]);setInput("")
  }

  return <div>
    <SHead title="Bank Statement Import" sub="Paste your statement — AI categorizes every transaction for your P&L."/>
    <Card style={{marginBottom:14,background:"#FFF9EE",borderColor:"var(--gold)"}}>
      <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>📅 About Payment Date Mismatch</div>
      <p style={{fontSize:12.5,color:"var(--muted)",margin:0,lineHeight:1.7}}>Clients often pay deposits before delivery. Use the <em>Match to Order</em> column to link payments to the correct production record. Bank debits are automatically added to your Expenses tab.</p>
    </Card>
    {parsed.length===0?<Card>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Paste Bank Statement Text</div>
      <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={"Paste bank statement text here…\n\nDate        Narration                      Credit       Debit\n01/04/25    TRF from Chioma Obi            35,000\n03/04/25    Dangote Flour purchase                      12,500"} style={{width:"100%",minHeight:180,padding:"12px",borderRadius:8,border:"1px solid var(--border)",background:"#FAF7F0",fontSize:12.5,fontFamily:"monospace",color:"var(--text)",boxSizing:"border-box",resize:"vertical",outline:"none"}}/>
      {error&&<div style={{color:"#B03A2E",fontSize:12.5,marginTop:8}}>⚠ {error}</div>}
      <div style={{marginTop:10}}><Btn onClick={parse} disabled={loading||!input.trim()}>{loading?"🔍 Parsing…":"✦ Parse with AI"}</Btn></div>
    </Card>:<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:14}}>
        {[{label:"Credits",val:fmt(parsed.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0)),sub:`${parsed.filter(t=>t.type==="credit").length} in`,color:"#357A52"},
          {label:"Debits",val:fmt(parsed.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0)),sub:`${parsed.filter(t=>t.type==="debit").length} out`,color:"#B03A2E"},
          {label:"Unmatched",val:parsed.filter(t=>t.type==="credit"&&!t.matchedProdId).length,sub:"credits need matching",color:"var(--gold)"}
        ].map(s=><Card key={s.label}><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{s.label}</div><div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:s.color}}>{s.val}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{s.sub}</div></Card>)}
      </div>
      <Card style={{padding:0,marginBottom:12,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <TH cols={["Date","Description","Amount","Type","Category","Match to Order"]}/>
          <tbody>{parsed.map((t,i)=><TR2 key={t.id} i={i} row={[
            <span style={{color:"var(--muted)",fontSize:12}}>{t.date}</span>,t.description,
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

// ══════════════════════════════════════════════════════════════
//  REPORTS  (downloadable)
// ══════════════════════════════════════════════════════════════
function Reports({productions,transactions,expenses,company}){
  const allMonths=[...new Set([...productions.map(p=>p.deliveryDate?.slice(0,7)),...transactions.map(t=>t.date?.slice(0,7))].filter(Boolean))].sort().reverse()
  const curMonth=new Date().toISOString().slice(0,7)
  const [sel,setSel]=useState(allMonths[0]||curMonth)
  const mp=productions.filter(p=>p.deliveryDate?.startsWith(sel))
  const mt=transactions.filter(t=>t.date?.startsWith(sel))
  const me=expenses.filter(e=>e.date?.startsWith(sel))
  const paidOrders=mp.filter(p=>p.paymentType==="full"||p.paymentType==="discount")
  const rev=paidOrders.reduce((s,p)=>s+(p.salePrice||0),0)
  const prodCost=mp.reduce((s,p)=>s+(p.cost||0),0)
  const deliveryCosts=mp.reduce((s,p)=>s+(p.deliveryCost||0),0)
  const bankDebits=mt.filter(t=>t.type==="debit").reduce((s,t)=>s+t.amount,0)
  const bankCredits=mt.filter(t=>t.type==="credit").reduce((s,t)=>s+t.amount,0)
  const manualExp=me.filter(e=>e.source==="manual").reduce((s,e)=>s+(e.amount||0),0)
  const totalCosts=prodCost+deliveryCosts+manualExp
  const grossProfit=rev-totalCosts
  const netProfit=grossProfit-bankDebits
  const margin=rev>0?Math.round((grossProfit/rev)*100):0
  const monthLabel=sel?new Date(sel+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"}):""
  const bySize={};mp.forEach(p=>{const k=`${p.size} · ${p.covering}`;if(!bySize[k])bySize[k]={qty:0,rev:0,cost:0};bySize[k].qty++;bySize[k].rev+=(p.salePrice||0);bySize[k].cost+=(p.cost||0)+(p.deliveryCost||0)})

  const downloadReport=()=>{
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>LayerLedger P&L — ${monthLabel}</title><style>
      body{font-family:Arial,sans-serif;padding:40px;color:#291608;max-width:700px;margin:0 auto}
      h1{font-size:24px;color:${company.primaryColor||"#C8912A"}}h2{font-size:16px;color:#555;font-weight:normal;margin-top:0}
      .grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px;margin:20px 0}
      .stat{border:1px solid #E0D3BB;border-radius:8px;padding:14px}
      .stat-label{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px}
      .stat-val{font-size:20px;font-weight:bold;color:${company.primaryColor||"#C8912A"}}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th{background:#EDE5D6;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#888}
      td{padding:8px 10px;border-bottom:1px solid #E0D3BB;font-size:13px}
      .total-row{font-weight:bold;background:#F5F0E4}
      .profit-box{background:${netProfit>=0?"#E8F5EE":"#FDEBE9"};border-radius:8px;padding:16px;margin:16px 0;display:flex;justify-content:space-between;align-items:center}
      .profit-label{font-size:16px;font-weight:bold}
      .profit-val{font-size:20px;font-weight:bold;color:${netProfit>=0?"#357A52":"#B03A2E"}}
      @media print{button{display:none}}
    </style></head><body>
      ${company.logo?`<img src="${company.logo}" style="height:60px;margin-bottom:10px" alt="logo"/>`:""}
      <h1>${company.name||"Bakery"} — Profit & Loss Report</h1>
      <h2>${monthLabel}</h2>
      <div class="grid">
        <div class="stat"><div class="stat-label">Gross Revenue</div><div class="stat-val">₦${Math.round(rev).toLocaleString()}</div><div style="font-size:11px;color:#888">${paidOrders.length} orders</div></div>
        <div class="stat"><div class="stat-label">Production Cost</div><div class="stat-val">₦${Math.round(totalCosts).toLocaleString()}</div><div style="font-size:11px;color:#888">incl. delivery</div></div>
        <div class="stat"><div class="stat-label">Gross Profit</div><div class="stat-val">₦${Math.round(grossProfit).toLocaleString()}</div><div style="font-size:11px;color:#888">${margin}% margin</div></div>
        <div class="stat"><div class="stat-label">Net Profit</div><div class="stat-val" style="color:${netProfit>=0?"#357A52":"#B03A2E"}">₦${Math.round(netProfit).toLocaleString()}</div><div style="font-size:11px;color:#888">after all expenses</div></div>
      </div>
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888">Sales</h3>
      <table><tr><th>Date</th><th>Client</th><th>Product</th><th>Type</th><th>Amount</th></tr>
        ${mp.map(p=>`<tr><td>${p.deliveryDate||""}</td><td>${p.client||""}</td><td>${p.size} ${p.covering}</td><td>${p.paymentType}</td><td>₦${Math.round(p.salePrice||0).toLocaleString()}</td></tr>`).join("")}
        <tr class="total-row"><td colspan="4">TOTAL REVENUE</td><td>₦${Math.round(rev).toLocaleString()}</td></tr>
      </table>
      <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#888">Expenses</h3>
      <table><tr><th>Date</th><th>Description</th><th>Category</th><th>Source</th><th>Amount</th></tr>
        ${me.map(e=>`<tr><td>${e.date||""}</td><td>${e.description||""}</td><td>${e.category||""}</td><td>${e.source||"manual"}</td><td>₦${Math.round(e.amount||0).toLocaleString()}</td></tr>`).join("")}
        ${mt.filter(t=>t.type==="debit").map(t=>`<tr><td>${t.date||""}</td><td>${t.description||""}</td><td>${t.category||""}</td><td>bank</td><td>₦${Math.round(t.amount||0).toLocaleString()}</td></tr>`).join("")}
        <tr class="total-row"><td colspan="4">TOTAL EXPENSES</td><td>₦${Math.round(totalCosts+bankDebits).toLocaleString()}</td></tr>
      </table>
      <div class="profit-box"><div class="profit-label">NET PROFIT — ${monthLabel}</div><div class="profit-val">₦${Math.round(netProfit).toLocaleString()}</div></div>
      <p style="font-size:11px;color:#aaa;margin-top:30px">Generated by LayerLedger · ${new Date().toLocaleDateString()}</p>
      <script>window.print()</script>
    </body></html>`)
    w.document.close()
  }

  return <div>
    <SHead title="Financial Reports" sub="Monthly P&L — production records + bank data + expenses combined."/>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
      <span style={{fontSize:11,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8}}>Period:</span>
      <select value={sel} onChange={e=>setSel(e.target.value)} style={{padding:"7px 12px",borderRadius:8,border:"1px solid var(--border)",background:"var(--panel)",fontSize:13,color:"var(--text)"}}>
        {(allMonths.length>0?allMonths:[curMonth]).map(m=><option key={m} value={m}>{new Date(m+"-02").toLocaleDateString("en-NG",{month:"long",year:"numeric"})}</option>)}
      </select>
      <Btn onClick={downloadReport} variant="outline">📥 Download PDF Report</Btn>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:18}}>
      {[{label:"Gross Revenue",val:fmt(rev),sub:`${paidOrders.length} paid orders`,color:"var(--gold)"},
        {label:"Production Cost",val:fmt(prodCost),sub:"ingredients + margin",color:"#2A5F9A"},
        {label:"Delivery Costs",val:fmt(deliveryCosts),sub:"all deliveries",color:"#8C6E52"},
        {label:"Other Expenses",val:fmt(manualExp+bankDebits),sub:"cash + bank",color:"#8C6E52"},
        {label:"Gross Profit",val:fmt(grossProfit),sub:`${margin}% margin`,color:"#357A52"},
        {label:"Net Profit",val:fmt(netProfit),sub:"after all costs",color:netProfit>=0?"#357A52":"#B03A2E"},
      ].map(s=><Card key={s.label} style={{borderBottom:`3px solid ${s.color}`}}>
        <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.label}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:s.color}}>{s.val}</div>
        <div style={{fontSize:11,color:"var(--muted)",marginTop:3}}>{s.sub}</div>
      </Card>)}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,marginBottom:4}}>Profit & Loss Statement</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:16}}>{monthLabel}</div>
        <div style={{fontSize:10.5,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Income</div>
        {mp.length===0?<div style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>No productions this month.</div>:
        mp.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12.5}}><span>{p.size} {p.covering} — {p.client} <Badge color={p.paymentType==="gift"?"purple":p.paymentType==="sample"?"blue":"gray"}>{p.paymentType}</Badge></span><span style={{fontWeight:500}}>{(p.paymentType==="full"||p.paymentType==="discount")?fmt(p.salePrice):"—"}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid var(--border)",fontWeight:700,marginTop:4}}><span>Total Revenue</span><span style={{color:"#357A52"}}>{fmt(rev)}</span></div>
        <div style={{fontSize:10.5,fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:1,marginTop:14,marginBottom:6}}>Costs & Expenses</div>
        {[["Production (ingredients)",fmt(prodCost)],["Delivery costs",fmt(deliveryCosts)],["Cash expenses",fmt(manualExp)],["Bank expenses",fmt(bankDebits)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:12.5}}><span>{k}</span><span style={{color:"#B03A2E"}}>({v})</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:"1px solid var(--border)",fontWeight:700,marginTop:4}}><span>Total Costs</span><span style={{color:"#B03A2E"}}>({fmt(totalCosts+bankDebits)})</span></div>
        <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:netProfit>=0?"#E8F5EE":"#FDEBE9",borderRadius:8,marginTop:12}}><span style={{fontSize:14,fontWeight:700}}>NET PROFIT</span><span style={{fontSize:15,fontWeight:700,color:netProfit>=0?"#357A52":"#B03A2E"}}>{fmt(netProfit)}</span></div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Revenue by Cake Type</div>
          {Object.keys(bySize).length===0?<div style={{fontSize:13,color:"var(--muted)"}}>No data this period.</div>:
          Object.entries(bySize).map(([k,v])=><div key={k} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12.5}}>{k} <span style={{color:"var(--muted)"}}>×{v.qty}</span></span><span style={{fontSize:12.5,fontWeight:600,color:"var(--gold)"}}>{fmt(v.rev)}</span></div>
            <div style={{height:4,background:"var(--border)",borderRadius:2}}><div style={{height:"100%",width:`${rev>0?(v.rev/rev)*100:0}%`,background:"var(--gold)",borderRadius:2}}/></div>
            <div style={{fontSize:11,color:"#357A52",marginTop:2}}>Profit: {fmt(v.rev-v.cost)}</div>
          </div>)}
        </Card>
        {(bankCredits>0||mt.length>0)&&<Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>📅 Bank Reconciliation</div>
          {[["Production records",fmt(rev)],["Bank credits received",fmt(bankCredits)]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:5}}><span style={{color:"var(--muted)"}}>{k}</span><strong>{v}</strong></div>)}
          {Math.abs(rev-bankCredits)>500?<div style={{background:"#FEF3DC",borderRadius:6,padding:"7px 10px",fontSize:12,color:"#8A5F10"}}>⚠ {fmt(Math.abs(rev-bankCredits))} difference — check Bank Import.</div>:<div style={{color:"#357A52",fontSize:12,fontWeight:500}}>✓ Records and bank totals reconciled</div>}
        </Card>}
        <Card>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Production Summary</div>
          {[["Paid orders",paidOrders.length],["Gift/Sample",mp.filter(p=>p.paymentType==="gift"||p.paymentType==="sample").length],["Pending delivery",mp.filter(p=>p.status==="pending").length],["Delivered",mp.filter(p=>p.status==="delivered").length]].map(([k,v])=><div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0",borderBottom:"1px solid var(--border)"}}><span style={{color:"var(--muted)"}}>{k}</span><strong>{v}</strong></div>)}
        </Card>
      </div>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  SHOPPING LIST
// ══════════════════════════════════════════════════════════════
function ShoppingList({inventory,company}){
  const [freq,setFreq]=useState("weekly")
  const [generated,setGenerated]=useState(false)

  const lowItems=inventory.filter(i=>i.stock<=(i.minStock||3))
  const criticalItems=inventory.filter(i=>i.stock===0)

  const downloadList=()=>{
    const freqLabel={weekly:"Weekly",biweekly:"Bi-Weekly",monthly:"Monthly"}[freq]
    const w=window.open("","_blank")
    w.document.write(`<!DOCTYPE html><html><head><title>${freqLabel} Shopping List</title><style>
      body{font-family:Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;color:#291608}
      h1{color:${company.primaryColor||"#C8912A"};font-size:22px}
      h2{font-size:14px;color:#888;font-weight:normal;margin-top:0}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#EDE5D6;padding:10px;text-align:left;font-size:11px;text-transform:uppercase}
      td{padding:10px;border-bottom:1px solid #E0D3BB;font-size:13px}
      .critical{color:#B03A2E;font-weight:bold}
      .checkbox{width:20px;height:20px;border:2px solid #C8912A;border-radius:4px;display:inline-block}
      @media print{button{display:none}}
    </style></head><body>
      ${company.logo?`<img src="${company.logo}" style="height:50px;margin-bottom:10px" alt="logo"/>`:""}
      <h1>${company.name||"Bakery"} — ${freqLabel} Shopping List</h1>
      <h2>Generated: ${new Date().toLocaleDateString("en-NG",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</h2>
      ${criticalItems.length>0?`<div style="background:#FDEBE9;padding:12px;border-radius:8px;margin-bottom:16px;font-size:13px;color:#B03A2E"><strong>🚨 OUT OF STOCK:</strong> ${criticalItems.map(i=>i.name).join(", ")}</div>`:""}
      <table>
        <tr><th>✓</th><th>Item</th><th>Category</th><th>Current Stock</th><th>Min Stock</th><th>Need to Buy</th><th>Est. Cost</th></tr>
        ${lowItems.map(i=>{const needed=Math.max(0,(i.minStock||3)*3-i.stock);return`<tr><td><div class="checkbox"></div></td><td class="${i.stock===0?"critical":""}">${i.name}${i.stock===0?" 🚨":""}</td><td>${i.cat||""}</td><td>${i.stock} ${i.unit}</td><td>${i.minStock||3} ${i.unit}</td><td>${needed} ${i.unit}</td><td>₦${Math.round(i.cost*needed).toLocaleString()}</td></tr>`}).join("")}
        <tr style="font-weight:bold;background:#F5F0E4"><td colspan="6">ESTIMATED TOTAL</td><td>₦${Math.round(lowItems.reduce((s,i)=>{const n=Math.max(0,(i.minStock||3)*3-i.stock);return s+i.cost*n},0)).toLocaleString()}</td></tr>
      </table>
      <p style="font-size:11px;color:#aaa">Generated by LayerLedger · ${new Date().toLocaleDateString()}</p>
      <script>window.print()</script>
    </body></html>`)
    w.document.close()
    setGenerated(true)
  }

  return <div>
    <SHead title="Shopping List" sub="Generate a restock list based on your current inventory levels."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Generate Shopping List</div>
        <Sel label="Frequency" value={freq} onChange={setFreq} options={[{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Bi-Weekly (every 2 weeks)"},{value:"monthly",label:"Monthly"}]}/>
        <div style={{marginBottom:14,padding:"10px 12px",background:"#FFF9EE",borderRadius:8,border:"1px solid var(--gold)",fontSize:13}}>
          <strong style={{color:"var(--text)"}}>{lowItems.length} items</strong> <span style={{color:"var(--muted)"}}>need restocking</span>
          {criticalItems.length>0&&<div style={{color:"#B03A2E",marginTop:4,fontWeight:500}}>🚨 {criticalItems.length} out of stock!</div>}
        </div>
        <Btn full onClick={downloadList}>📥 Download & Print Shopping List</Btn>
        {generated&&<div style={{marginTop:8,fontSize:12.5,color:"#357A52"}}>✓ Shopping list opened in new tab — print or save as PDF.</div>}

        <div style={{marginTop:16,fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:600,marginBottom:8}}>Low Stock Alerts</div>
        <div style={{fontSize:12.5,color:"var(--muted)",marginBottom:10}}>Items at or below their minimum stock level:</div>
        {lowItems.length===0?<div style={{fontSize:13,color:"#357A52"}}>✓ All items are well-stocked!</div>:
        lowItems.map(i=><div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border)"}}>
          <div><div style={{fontSize:13,fontWeight:500}}>{i.name}</div><div style={{fontSize:11.5,color:"var(--muted)"}}>Min: {i.minStock||3} {i.unit}</div></div>
          <Badge color={i.stock===0?"red":"gold"}>{i.stock===0?"OUT":i.stock+" "+i.unit}</Badge>
        </div>)}
      </Card>

      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Full Inventory Status</div>
        <div style={{overflowY:"auto",maxHeight:480}}>
          {inventory.map((i,idx)=>{
            const pct=i.minStock>0?Math.min(100,(i.stock/((i.minStock||3)*3))*100):100
            return <div key={i.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:12.5,fontWeight:500}}>{i.name}</span>
                <span style={{fontSize:12,color:i.stock<=(i.minStock||3)?"#B03A2E":"var(--muted)"}}>{i.stock} {i.unit}</span>
              </div>
              <div style={{height:5,background:"var(--border)",borderRadius:2}}>
                <div style={{height:"100%",width:`${pct}%`,background:pct<30?"#B03A2E":pct<60?"var(--gold)":"#357A52",borderRadius:2,transition:"width 0.3s"}}/>
              </div>
            </div>
          })}
        </div>
      </Card>
    </div>
  </div>
}

// ══════════════════════════════════════════════════════════════
//  INVOICE GENERATOR
// ══════════════════════════════════════════════════════════════
function InvoiceGenerator({productions,company,prefillProd,setPrefillProd}){
  const [selectedProdId,setSelectedProdId]=useState(prefillProd?.id||"")
  const [clientPhone,setClientPhone]=useState(prefillProd?.clientPhone||"")
  const [clientEmail,setClientEmail]=useState(prefillProd?.clientEmail||"")
  const [clientAddress,setClientAddress]=useState("")
  const [dueDate,setDueDate]=useState("")
  const [notes,setNotes]=useState("Thank you for your business!")
  const [invoiceNo]=useState(`INV-${Date.now().toString().slice(-6)}`)
  const [saved,setSaved]=useState(false)

  useEffect(()=>{if(prefillProd){setSelectedProdId(prefillProd.id);setClientPhone(prefillProd.clientPhone||"");setClientEmail(prefillProd.clientEmail||"")}return()=>setPrefillProd(null)},[])

  const prod=productions.find(p=>p.id===selectedProdId)

  const generateInvoice=()=>{
    if(!prod)return
    const w=window.open("","_blank")
    const deliveryLine=prod.deliveryCost>0?`<tr><td style="padding:10px;border-bottom:1px solid #E0D3BB">Delivery</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;text-align:right">—</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;text-align:right">1</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;text-align:right">₦${Math.round(prod.deliveryCost||0).toLocaleString()}</td></tr>`:"";
    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoiceNo}</title><style>
      *{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#291608;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px}
      .company-name{font-size:24px;font-weight:bold;color:${company.primaryColor||"#C8912A"}}
      .invoice-title{font-size:32px;font-weight:bold;color:#EDE5D6;text-align:right}
      .invoice-no{font-size:14px;color:#888;text-align:right;margin-top:4px}
      .section{margin-bottom:30px}.section-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:8px;font-weight:bold}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:30px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      thead{background:#291608;color:white}th{padding:12px 10px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.8px}
      td{padding:10px;border-bottom:1px solid #E0D3BB;font-size:13px}
      .total-section{display:flex;justify-content:flex-end;margin-top:16px}
      .total-box{width:280px}.total-row{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #E0D3BB}
      .total-final{display:flex;justify-content:space-between;padding:12px 14px;background:${company.primaryColor||"#C8912A"};color:white;border-radius:8px;margin-top:8px;font-size:15px;font-weight:bold}
      .footer{margin-top:50px;padding-top:20px;border-top:2px solid #EDE5D6;display:flex;justify-content:space-between;font-size:12px;color:#888}
      .badge{display:inline-block;background:#E5F4EC;color:#2D7A50;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:bold}
      @media print{button{display:none}}
    </style></head><body>
      <div class="header">
        <div>
          ${company.logo?`<img src="${company.logo}" style="height:60px;margin-bottom:10px;display:block" alt="logo"/>`:""}
          <div class="company-name">${company.name||"My Bakery"}</div>
          ${company.tagline?`<div style="font-size:13px;color:#888;margin-top:3px">${company.tagline}</div>`:""}
          ${company.address?`<div style="font-size:12px;color:#888;margin-top:6px">${company.address}</div>`:""}
          ${company.phone?`<div style="font-size:12px;color:#888">${company.phone}</div>`:""}
          ${company.email?`<div style="font-size:12px;color:#888">${company.email}</div>`:""}
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-no">${invoiceNo}</div>
          <div style="margin-top:16px;text-align:right">
            <div style="font-size:12px;color:#888">Issue Date: <strong>${today()}</strong></div>
            ${dueDate?`<div style="font-size:12px;color:#888;margin-top:4px">Due Date: <strong>${dueDate}</strong></div>`:""}
            <div style="margin-top:8px"><span class="badge">${prod.status==="delivered"?"DELIVERED":"PENDING"}</span></div>
          </div>
        </div>
      </div>
      <div class="grid" style="margin-bottom:30px">
        <div><div class="section-title">Bill To</div>
          <div style="font-size:16px;font-weight:bold">${prod.client||""}</div>
          ${clientPhone?`<div style="font-size:13px;color:#888;margin-top:4px">${clientPhone}</div>`:""}
          ${clientEmail?`<div style="font-size:13px;color:#888">${clientEmail}</div>`:""}
          ${clientAddress?`<div style="font-size:13px;color:#888">${clientAddress}</div>`:""}
        </div>
        <div><div class="section-title">Order Details</div>
          <div style="font-size:13px">Order Date: <strong>${prod.orderDate||""}</strong></div>
          <div style="font-size:13px;margin-top:4px">Delivery Date: <strong>${prod.deliveryDate||""}</strong></div>
          <div style="font-size:13px;margin-top:4px">Payment Type: <strong style="text-transform:capitalize">${prod.paymentType||"full"}</strong></div>
        </div>
      </div>
      <div class="section-title">Items</div>
      <table>
        <thead><tr><th>Description</th><th>Details</th><th>Qty</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr><td style="padding:10px;border-bottom:1px solid #E0D3BB"><strong>${prod.size} ${prod.covering} Cake</strong>${prod.notes?`<br><span style="font-size:12px;color:#888">${prod.notes}</span>`:""}</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;font-size:12px;color:#888">${prod.flavors||""} · ${prod.layers} layers</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;text-align:right">1</td><td style="padding:10px;border-bottom:1px solid #E0D3BB;text-align:right">₦${Math.round(prod.salePrice||0).toLocaleString()}</td></tr>
          ${deliveryLine}
        </tbody>
      </table>
      <div class="total-section">
        <div class="total-box">
          <div class="total-row"><span>Subtotal</span><span>₦${Math.round((prod.salePrice||0)).toLocaleString()}</span></div>
          ${prod.deliveryCost?`<div class="total-row"><span>Delivery</span><span>₦${Math.round(prod.deliveryCost).toLocaleString()}</span></div>`:""}
          <div class="total-final"><span>TOTAL DUE</span><span>₦${Math.round((prod.salePrice||0)+(prod.deliveryCost||0)).toLocaleString()}</span></div>
        </div>
      </div>
      ${notes?`<div style="margin-top:30px;padding:16px;background:#F5F0E4;border-radius:8px;font-size:13px;color:#8C6E52"><strong>Notes:</strong> ${notes}</div>`:""}
      <div class="footer"><div>Thank you for choosing ${company.name||"us"}!</div><div>LayerLedger · ${invoiceNo}</div></div>
      <script>window.print()</script>
    </body></html>`)
    w.document.close()
    setSaved(true)
  }

  return <div>
    <SHead title="Invoice Generator" sub="Create a professional invoice for any production order."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,marginBottom:14}}>Invoice Details</div>
        <div style={{padding:"8px 12px",background:"#F5F0E4",borderRadius:8,fontSize:12.5,marginBottom:14,color:"var(--muted)"}}>Invoice #{invoiceNo}</div>
        <Sel label="Select Production Order *" value={selectedProdId} onChange={setSelectedProdId} options={productions.map(p=>({value:p.id,label:`${p.client} — ${p.deliveryDate} — ${p.size} ${p.covering}`}))}/>
        {prod&&<div style={{padding:"10px 12px",background:"#EEF8F3",borderRadius:8,fontSize:12.5,marginBottom:12,border:"1px solid #C2E0CF"}}>
          <div style={{fontWeight:600}}>{prod.size} · {prod.covering}</div>
          <div style={{color:"var(--muted)",marginTop:2}}>{prod.flavors} · {prod.layers} layers</div>
          <div style={{marginTop:4}}>Sale: <strong style={{color:"var(--gold)"}}>{fmt(prod.salePrice)}</strong>{prod.deliveryCost?` + ${fmt(prod.deliveryCost)} delivery`:""}</div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Inp label="Client Phone" value={clientPhone} onChange={setClientPhone} placeholder="+234…"/>
          <Inp label="Client Email" value={clientEmail} onChange={setClientEmail} placeholder="email@…"/>
        </div>
        <Inp label="Client Address" value={clientAddress} onChange={setClientAddress} placeholder="Street, City"/>
        <Inp label="Due Date" type="date" value={dueDate} onChange={setDueDate}/>
        <Inp label="Footer Notes" value={notes} onChange={setNotes} placeholder="Payment terms, thank you note…"/>
        <Btn full onClick={generateInvoice} disabled={!prod}>📄 Generate & Print Invoice</Btn>
        {saved&&<div style={{marginTop:8,fontSize:12.5,color:"#357A52"}}>✓ Invoice opened — print or save as PDF from the new tab.</div>}
      </Card>
      <Card style={{background:"#FFF9EE",borderColor:"var(--gold)"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:600,marginBottom:12}}>Invoice Preview</div>
        {prod?<div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <div><div style={{fontWeight:700,fontSize:15,color:"var(--gold)"}}>{company.name||"My Bakery"}</div>{company.tagline&&<div style={{fontSize:12,color:"var(--muted)"}}>{company.tagline}</div>}</div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700,color:"var(--border)"}}>INVOICE</div><div style={{fontSize:12,color:"var(--muted)"}}>{invoiceNo}</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Bill To</div><div style={{fontWeight:600,fontSize:13}}>{prod.client}</div>{clientPhone&&<div style={{fontSize:12,color:"var(--muted)"}}>{clientPhone}</div>}</div>
            <div><div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>Order</div><div style={{fontSize:12}}>Order: {prod.orderDate}</div><div style={{fontSize:12}}>Delivery: {prod.deliveryDate}</div></div>
          </div>
          <div style={{background:"var(--panel)",borderRadius:8,padding:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:12.5}}><span style={{fontWeight:500}}>{prod.size} {prod.covering} Cake</span><span style={{fontWeight:600,color:"var(--gold)"}}>{fmt(prod.salePrice)}</span></div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>{prod.flavors} · {prod.layers} layers</div>
            {prod.deliveryCost>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12.5,marginBottom:6}}><span>Delivery</span><span>{fmt(prod.deliveryCost)}</span></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:14,paddingTop:8,borderTop:"1px solid var(--border)"}}><span>TOTAL</span><span style={{color:"var(--gold)"}}>{fmt((prod.salePrice||0)+(prod.deliveryCost||0))}</span></div>
          </div>
          {notes&&<div style={{marginTop:10,fontSize:12,color:"var(--muted)",fontStyle:"italic"}}>{notes}</div>}
        </div>:<div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Select a production order to preview the invoice</div>}
      </Card>
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
  const [expenses,setExpenses]=useState([])
  const [accessoryPct,setAccessoryPct]=useState(10)
  const [company,setCompany]=useState(loadCompanySettings())
  const [prefillProd,setPrefillProd]=useState(null)
  const [loading,setLoading]=useState(true)
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const isMobile=typeof window!=="undefined"&&window.innerWidth<768

  useEffect(()=>{
    async function init(){
      setLoading(true)
      const [inv,prods,txns]=await Promise.all([loadInventory(DEFAULT_INV),loadProductions([]),loadTransactions([])])
      setInventory(inv);setProductions(prods);setTransactions(txns)
      setExpenses(loadExpenses())
      setAccessoryPct(loadSetting("accessoryPct",10))
      setCompany(loadCompanySettings())
      setLoading(false)
    }
    init()
  },[])

  const gold=company.primaryColor||"#C8912A"
  const sidebar=company.sidebarColor||"#140801"

  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"◈"},
    {id:"setup",label:"Master List",icon:"⚙"},
    {id:"production",label:"New Production",icon:"🎂"},
    {id:"receipts",label:"Receipt Scanner",icon:"🧾"},
    {id:"expenses",label:"Expenses",icon:"💸"},
    {id:"records",label:"Records",icon:"≡"},
    {id:"bank",label:"Bank Import",icon:"⊞"},
    {id:"reports",label:"Reports",icon:"◎"},
    {id:"shopping",label:"Shopping List",icon:"🛒"},
    {id:"invoices",label:"Invoices",icon:"📄"},
  ]

  const goTo=(id)=>{setView(id);setSidebarOpen(false)}

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
      *{box-sizing:border-box;}body{margin:0;padding:0;}
      :root{--gold:${gold};--sidebar:${sidebar};--bg:#F4EEE4;--panel:#FDFAF4;--text:#291608;--muted:#8C6E52;--border:#E0D3BB;}
      @keyframes spin{to{transform:rotate(360deg)}}
      @media(max-width:768px){
        .sidebar{position:fixed!important;z-index:100;transform:translateX(-100%);transition:transform 0.25s ease;}
        .sidebar.open{transform:translateX(0)!important;}
        .overlay{display:block!important;}
        .main-content{padding:16px!important;}
      }
    `}</style>
    <div style={{display:"flex",height:"100vh",fontFamily:"'DM Sans',sans-serif",background:"var(--bg)",overflow:"hidden",position:"relative"}}>

      {/* Mobile overlay */}
      <div className="overlay" onClick={()=>setSidebarOpen(false)} style={{display:"none",position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:99}}/>

      {/* SIDEBAR */}
      <div className={`sidebar${sidebarOpen?" open":""}`} style={{width:210,background:"var(--sidebar)",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",overflowY:"auto"}}>
        <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(200,145,42,0.2)",display:"flex",alignItems:"center",gap:10}}>
          {company.logo&&<img src={company.logo} alt="logo" style={{width:32,height:32,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,color:gold,fontWeight:700,lineHeight:1.2}}>{company.name||"LayerLedger"}</div>
            <div style={{fontSize:9,color:"#7B5A3A",textTransform:"uppercase",letterSpacing:2,marginTop:1}}>Bakery Books</div>
          </div>
        </div>
        <div style={{flex:1,paddingTop:8}}>
          {nav.map(n=><div key={n.id} onClick={()=>goTo(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:view===n.id?500:400,color:view===n.id?gold:"#8B6B4A",background:view===n.id?"rgba(200,145,42,0.1)":"transparent",borderLeft:`2px solid ${view===n.id?gold:"transparent"}`,transition:"all 0.15s"}}>
            <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span><span>{n.label}</span>
          </div>)}
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid rgba(200,145,42,0.1)",fontSize:10.5,color:"#3D2010"}}>LayerLedger v3.0</div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Mobile header */}
        <div style={{display:"none",alignItems:"center",gap:12,padding:"12px 16px",background:"var(--sidebar)",position:"sticky",top:0,zIndex:50}} className="mobile-header">
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:gold,fontSize:22}}>☰</button>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:gold,fontWeight:700}}>{company.name||"LayerLedger"}</div>
        </div>
        <style>{`@media(max-width:768px){.mobile-header{display:flex!important;}}`}</style>

        <div className="main-content" style={{padding:"24px 26px",flex:1}}>
          {loading?<Spinner/>:<>
            {view==="dashboard"  &&<Dashboard productions={productions} inventory={inventory} expenses={expenses} setView={setView}/>}
            {view==="setup"      &&<Setup inventory={inventory} setInventory={setInventory} accessoryPct={accessoryPct} setAccessoryPct={setAccessoryPct} company={company} setCompany={setCompany}/>}
            {view==="production" &&<ProductionEntry inventory={inventory} setInventory={setInventory} accessoryPct={accessoryPct} productions={productions} setProductions={setProductions} setView={setView}/>}
            {view==="receipts"   &&<ReceiptScanner inventory={inventory} setInventory={setInventory} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="expenses"   &&<Expenses expenses={expenses} setExpenses={setExpenses}/>}
            {view==="records"    &&<Records productions={productions} setProductions={setProductions} setView={setView} setPrefillProd={setPrefillProd}/>}
            {view==="bank"       &&<BankImport transactions={transactions} setTransactions={setTransactions} productions={productions} expenses={expenses} setExpenses={setExpenses}/>}
            {view==="reports"    &&<Reports productions={productions} transactions={transactions} expenses={expenses} company={company}/>}
            {view==="shopping"   &&<ShoppingList inventory={inventory} company={company}/>}
            {view==="invoices"   &&<InvoiceGenerator productions={productions} company={company} prefillProd={prefillProd} setPrefillProd={setPrefillProd}/>}
          </>}
        </div>
      </div>
    </div>
  </>
}
