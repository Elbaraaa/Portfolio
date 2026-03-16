export const globalCSS = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:none}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
  @keyframes tilePop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
  @keyframes tileAppear{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
  *{box-sizing:border-box;margin:0;padding:0;cursor:none !important}
  html{scroll-snap-type:y proximity;overflow-y:scroll;scroll-behavior:smooth;overflow-x:hidden}
  section{scroll-snap-align:start}
  ::-webkit-scrollbar{width:4px}
  ::selection{background:rgba(35,77,59,0.18)}
  .grad-text{-webkit-background-clip:text !important;background-clip:text !important;-webkit-text-fill-color:transparent !important;color:transparent !important}

  /* Game overlay */
  .game-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(7,11,20,0.92);backdrop-filter:blur(8px);overflow-y:auto;padding:16px;overscroll-behavior:none;touch-action:none}

  /* Responsive helpers */
  @media(max-width:767px){
    *{cursor:auto !important}
    .astronaut-root{display:none !important}
    .hero-system-panel{display:none !important}
    .hero-content{padding:96px 20px 80px !important;max-width:100% !important}
    .section-pad{padding:60px 20px !important}
    .about-grid{grid-template-columns:1fr !important;gap:28px !important}
    .achieve-grid{grid-template-columns:1fr 1fr !important}
    .hire-grid{grid-template-columns:1fr !important}
    .hire-reasons-grid{grid-template-columns:1fr !important}
    .hero-stats-grid{grid-template-columns:1fr 1fr !important}
    .projects-grid{grid-template-columns:1fr !important}
    .skills-grid{grid-template-columns:1fr !important}
    .guestbook-grid{grid-template-columns:1fr !important}
    .arcade-cards-grid{grid-template-columns:1fr !important}
    .arcade-card-inner{padding:16px !important;font-size:13px !important}
    .arcade-card-icon{font-size:32px !important;margin-bottom:10px !important}
    .mobile-resume-btn{display:inline-flex !important}
  }
  @media(max-width:480px){
    .achieve-grid{grid-template-columns:1fr !important}
    .about-skills-grid{grid-template-columns:1fr 1fr !important}
  }
  .mobile-resume-btn{display:none}
`;