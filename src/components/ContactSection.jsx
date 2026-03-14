import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function ContactSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const links=[{icon:"✉️",label:"Email",value:personal.email,href:`mailto:${personal.email}`,accent:C.accent},{icon:"🐙",label:"GitHub",value:"github.com/baraaabdalla",href:personal.github,accent:C.pink},{icon:"💼",label:"LinkedIn",value:"linkedin.com/in/baraaabdalla",href:personal.linkedin,accent:C.green}];
  return (
    <section id="contact" ref={ref} className="section-pad" style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <span style={{fontFamily:"system-ui",fontWeight:800,fontSize:"18vw",color:C.textPrimary,opacity:0.012,userSelect:"none"}}>HELLO</span>
      </div>
      <div style={{maxWidth:680,margin:"0 auto",position:"relative",zIndex:1,width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}><SectionTag num="09" label="Contact" C={C}/></div>
        <h2 style={{fontFamily:"system-ui",fontSize:"clamp(32px,5vw,56px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 16px",opacity:inView?1:0,transition:"all 0.6s 0.1s"}}>
          Let's build<br/><span className="grad-text" style={{background:`linear-gradient(90deg,${C.accent},${C.green})`}}>something real.</span>
        </h2>
        <p style={{color:C.textSecondary,fontSize:16,lineHeight:1.75,maxWidth:480,marginBottom:36,opacity:inView?1:0,transition:"all 0.6s 0.2s"}}>Seeking Summer 2026 internships in software engineering, full-stack dev, and applied AI.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,opacity:inView?1:0,transition:"all 0.6s 0.3s"}}>
          {links.map(link=>(
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",...mkPanel(C,{padding:"14px 20px"}),textDecoration:"none",transition:"border-color 0.3s,box-shadow 0.3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${link.accent}40`;e.currentTarget.style.boxShadow=`0 0 20px ${link.accent}12`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:36,height:36,borderRadius:7,border:`1px solid ${link.accent}30`,background:`${link.accent}08`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{link.icon}</div>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>{link.label}</div>
                  <div style={{fontFamily:"monospace",fontSize:13,color:C.textSecondary}}>{link.value}</div>
                </div>
              </div>
              <span style={{color:C.textDim,fontSize:14}}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}