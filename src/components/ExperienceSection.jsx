import { experience } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function ExperienceSection({ C }) {
  const {ref,inView}=useInView(0.1);
  return (
    <section id="experience" ref={ref} className="section-pad" style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:800,margin:"0 auto",position:"relative",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="03" label="Experience" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 40px",color:C.textPrimary}}>Career <span style={{color:C.textDim}}>trajectory.</span></h2>
        </div>
        {experience.map((exp,i)=>(
          <div key={exp.id} style={{display:"flex",gap:22,opacity:inView?1:0,transform:inView?"none":"translateX(24px)",transition:`all 0.6s ${0.15+i*0.12}s`}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:38,height:38,borderRadius:"50%",border:`2px solid ${exp.status==="active"?C.accent+"80":C.border}`,background:exp.status==="active"?`${C.accent}12`:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
                <span style={{fontSize:13}}>{exp.status==="active"?"💼":"✓"}</span>
                {exp.status==="active"&&<div style={{position:"absolute",top:-2,right:-2,width:9,height:9,borderRadius:"50%",background:C.green,border:`2px solid ${C.bg}`}}/>}
              </div>
              {i<experience.length-1&&<div style={{width:1,flex:1,background:`linear-gradient(to bottom,${C.border},transparent)`,marginTop:8,minHeight:36}}/>}
            </div>
            <div style={{paddingBottom:32,flex:1,minWidth:0}}>
              <div style={mkPanel(C,{
                padding:20,
                transition:"border-color 0.3s,box-shadow 0.3s",
                boxShadow:`0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
              })}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.accent}30`;e.currentTarget.style.boxShadow=`0 0 20px ${C.accent}15, 0 4px 20px rgba(0,0,0,0.4)`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow=`0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`;}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:10}}>
                  <div style={{minWidth:0}}>
                    <h3 style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary,margin:"0 0 3px"}}>{exp.role}</h3>
                    <span style={{fontFamily:"monospace",fontSize:11,color:C.accent}}>{exp.orgShort}</span>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim}}>{exp.period}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"flex-end",marginTop:3}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:exp.status==="active"?C.green:C.textDim}}/>
                      <span style={{fontFamily:"monospace",fontSize:9,color:exp.status==="active"?C.green:C.textDim,textTransform:"uppercase"}}>{exp.status}</span>
                    </div>
                  </div>
                </div>
                <p style={{color:C.textSecondary,fontSize:13,lineHeight:1.75,margin:"0 0 12px"}}>{exp.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {exp.tags.map(t=><span key={t} style={{fontFamily:"monospace",fontSize:10,padding:"3px 7px",background:C.bg,border:`1px solid ${C.border}`,borderRadius:4,color:C.textDim}}>{t}</span>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
