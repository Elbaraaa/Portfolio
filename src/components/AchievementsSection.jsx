import { achievements } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function AchievementsSection({ C }) {
  const {ref,inView}=useInView(0.1);
  return (
    <section id="achievements" ref={ref} style={{padding:"80px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={{opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:"all 0.6s"}}>
          <SectionTag num="05" label="Recognition" C={C}/>
          <h2 style={{fontFamily:"system-ui",fontSize:"clamp(28px,4vw,46px)",fontWeight:800,letterSpacing:"-0.02em",margin:"0 0 36px",color:C.textPrimary}}>Awards & <span style={{color:C.textDim}}>milestones.</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {achievements.map((a,i)=>(
            <div key={a.title} style={mkPanel(C,{padding:22,transition:"border-color 0.3s,box-shadow 0.3s,transform 0.2s",opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transitionDelay:`${i*0.1}s`})}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${C.accent}40`;e.currentTarget.style.boxShadow=`0 0 24px ${C.accent}15`;e.currentTarget.style.transform="translateY(-3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
              <div style={{fontSize:26,marginBottom:12}}>{a.icon}</div>
              <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:14,color:C.textPrimary,marginBottom:4}}>{a.title}</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.accent,marginBottom:10}}>{a.event}</div>
              <p style={{fontSize:12,color:C.textDim,lineHeight:1.6,margin:0}}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
