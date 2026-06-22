/**
 * Login.jsx
 * ----------------------------------------------------------------------------
 * Login / PIN entry screen.
 * Users pick their name and enter a PIN to access the app.
 * ----------------------------------------------------------------------------
 */
import React from "react"
import { Btn, iSt, Sel, Card } from "../common/ui.jsx"
import { ROLES } from "../../constants.js"
import { loadUsers } from "../../lib/data.js"

// ═══════════════════════════════════════════════════════════
export function Login({onLogin}){
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
