export const globalCSS = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:none}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
  @keyframes tilePop{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
  @keyframes tileAppear{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
  *{box-sizing:border-box;margin:0;padding:0;cursor:none !important}
  html{scroll-snap-type:y mandatory;overflow-y:scroll;scroll-behavior:smooth}
  section{scroll-snap-align:start}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#070B14}::-webkit-scrollbar-thumb{background:#1E2D4A;border-radius:2px}
  ::selection{background:rgba(124,111,255,0.25)}
  input,textarea{color-scheme:dark}
`;