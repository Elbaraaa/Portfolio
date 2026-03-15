import { personal } from "../data/content";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

export function AboutSection({ C }) {
  const {ref,inView}=useInView(0.1);
  const anim=(d=0)=>({opacity:inView?1:0,transform:inView?"none":"translateY(20px)",transition:`all 0.6s ${d}s`});
  const cardStyle = mkPanel(C, {
    padding:18,
    cursor:"default",
    boxShadow:`0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`
  });
  return (
    <section id="about" ref={ref} className="section-pad" style={{padding:"96px 60px",background:"transparent",minHeight:"100vh",display:"flex",alignItems:"center",position:"relative"}}>
      <div style={{maxWidth:1080,margin:"0 auto",width:"100%"}}>
        <div style={anim(0)}><SectionTag num="01" label="About" C={C}/></div>
        <div className="about-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"start"}}>
          <div style={anim(0.1)}>
            <h2 style={{fontFamily:"system-ui",fontSize:"clamp(26px,3.5vw,42px)",fontWeight:800,lineHeight:1.2,margin:"0 0 24px",letterSpacing:"-0.02em"}}>
              <span style={{color:C.textPrimary}}>I don't just write code.</span><br/>
              <span style={{color:C.textDim}}>I build infrastructure</span><br/>
              <span className="grad-text" style={{background:`linear-gradient(90deg,${C.accent},${C.green})`}}>for real problems.</span>
            </h2>
            {personal.bio.split("\n\n").map((p,i)=><p key={i} style={{color:C.textSecondary,lineHeight:1.8,marginBottom:14,fontSize:14}}>{p}</p>)}
            <div style={mkPanel(C,{padding:18,marginTop:20,boxShadow:`0 2px 16px rgba(0,0,0,0.35)`})}>
              <div style={{fontFamily:"monospace",fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Currently</div>
              {[["🎓","Studying","B.S. CS, University of Arizona"],["💼","Working","Web Dev @ UA RII"],["📚","Teaching","Undergrad TA / CS Mentor"],["🔭","Building","DocuMind RAG System"]].map(row=>(
                <div key={row[1]} style={{display:"flex",gap:10,marginBottom:8}}>
                  <span style={{width:16}}>{row[0]}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,color:C.textDim,width:70,flexShrink:0}}>{row[1]}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,color:C.textSecondary}}>{row[2]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="about-skills-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,...anim(0.2)}}>
            {[{icon:"⌨️",label:"Engineer",desc:"Full-stack systems from DB to UI."},{icon:"🧠",label:"Researcher",desc:"Applied AI, RAG pipelines & knowledge systems."},{icon:"👥",label:"Educator",desc:"Helped 500+ students level up."},{icon:"🚀",label:"Builder",desc:"Real tools used by real people."}].map(p=>(
              <div key={p.label} style={cardStyle}>
                <div style={{fontSize:20,marginBottom:10}}>{p.icon}</div>
                <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:14,color:C.textPrimary,marginBottom:6}}>{p.label}</div>
                <div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{p.desc}</div>
              </div>
            ))}
            <div style={mkPanel(C,{padding:18,gridColumn:"1/-1",borderColor:C.accent+"20",boxShadow:`0 2px 16px rgba(0,0,0,0.35)`})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim,textTransform:"uppercase",marginBottom:4}}>University of Arizona</div>
                  <div style={{fontFamily:"system-ui",fontWeight:700,fontSize:15,color:C.textPrimary}}>B.S. Computer Science</div>
                  <div style={{fontSize:12,color:C.textSecondary,marginTop:3}}>Expected May 2026 · Dean's List</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="grad-text" style={{fontFamily:"system-ui",fontSize:32,fontWeight:800,background:`linear-gradient(135deg,${C.accent},${C.green})`}}>3.9</div>
                  <div style={{fontFamily:"monospace",fontSize:10,color:C.textDim}}>GPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}