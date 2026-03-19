import { useState, useEffect, useRef, useCallback } from "react";
import { mkPanel } from "../styles/theme";
import { useWindowWidth } from "../hooks/useInView";

export function AIChat({ C }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      content:
        "Hey! I'm Elbaraa. Ask me anything about my projects, experience, or whether I'd be a fit for your team 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const chatBoxRef = useRef(null);
  const overlayRef = useRef(null);

  const width = useWindowWidth();
  const isMobile = width > 0 && width <= 767;
  const [viewportH, setViewportH] = useState(typeof window !== "undefined" ? window.innerHeight : 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  /* ── Track visual viewport for keyboard-aware layout (Instagram style) ── */
  useEffect(() => {
    if (!open || !isMobile) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      setViewportH(vv.height);
      /* Keep messages scrolled to bottom when keyboard opens */
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    onResize();
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, [open, isMobile]);

  /* ── Scroll lock on mobile when chat is open ── */
  useEffect(() => {
    if (!open || !isMobile) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, isMobile]);

  /* ── Block touch scroll leaking through backdrop on mobile ── */
  const handleOverlayTouchMove = useCallback((e) => {
    if (e.target === overlayRef.current) {
      e.preventDefault();
    }
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMsgs((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: msgs }),
      });

      if (!res.ok) throw new Error("API Route failed");

      const data = await res.json();
      setMsgs((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* ── FAB button ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 900,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: `linear-gradient(135deg,${C.accent},${C.green})`,
          border: "none",
          cursor: "pointer",
          fontSize: 20,
          display: open && isMobile ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <>
          {/* ── Mobile: fullscreen overlay with tap-to-dismiss backdrop ── */}
          {isMobile && (
            <div
              ref={overlayRef}
              onClick={(e) => {
                if (e.target === overlayRef.current) handleClose();
              }}
              onTouchMove={handleOverlayTouchMove}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9888,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                overscrollBehavior: "contain",
              }}
            />
          )}

          {/* ── Chat container ── */}
          <div
            ref={chatBoxRef}
            style={{
              position: "fixed",
              zIndex: 9888,
              animation: "scaleIn 0.2s ease-out",
              ...(isMobile
                ? {
                    top: 0,
                    left: 0,
                    right: 0,
                    width: "100%",
                    height: viewportH,
                    display: "flex",
                    flexDirection: "column",
                    transition: "height 0.1s ease-out",
                  }
                : {
                    bottom: 86,
                    right: 24,
                    width: 320,
                  }),
            }}
          >
            <div
              style={{
                ...(isMobile
                  ? {
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      background: C.surface,
                      overflow: "hidden",
                    }
                  : mkPanel(C, { padding: 0, borderColor: C.accent + "40" })),
              }}
            >
              {/* ── Accent bar ── */}
              <div
                style={{
                  height: 2,
                  background: `linear-gradient(90deg,${C.accent},${C.green})`,
                  flexShrink: 0,
                }}
              />

              {/* ── Header ── */}
              <div
                style={{
                  padding: isMobile ? "14px 16px" : "12px 16px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                  background: C.bg,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.accent},${C.green})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    color: C.bg,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  E
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "system-ui",
                      fontWeight: 700,
                      fontSize: 13,
                      color: C.textPrimary,
                    }}
                  >
                    Chat with Elbaraa
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: C.green,
                    }}
                  >
                    ● AI-powered
                  </div>
                </div>

                {/* ── Close button (mobile only) ── */}
                {isMobile && (
                  <button
                    onClick={handleClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: `1px solid ${C.border}`,
                      background: "transparent",
                      color: C.textSecondary,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* ── Messages ── */}
              <div
                style={{
                  flex: isMobile ? 1 : undefined,
                  height: isMobile ? undefined : 260,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                }}
              >
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "82%",
                        padding: "9px 13px",
                        borderRadius:
                          m.role === "user"
                            ? "14px 14px 4px 14px"
                            : "14px 14px 14px 4px",
                        background:
                          m.role === "user"
                            ? `linear-gradient(135deg,${C.accent},${C.green})`
                            : C.surface,
                        color: m.role === "user" ? C.bg : C.textSecondary,
                        fontSize: 12.5,
                        lineHeight: 1.6,
                      }}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: 5, padding: "6px 10px" }}>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: C.accent,
                          animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* ── Input bar ── */}
              <div
                style={{
                  padding: isMobile ? "12px 14px" : "10px 12px",
                  paddingBottom: isMobile ? "max(12px, env(safe-area-inset-bottom))" : "10px",
                  borderTop: `1px solid ${C.border}`,
                  display: "flex",
                  gap: 8,
                  flexShrink: 0,
                  background: C.bg,
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                  placeholder="Ask me anything…"
                  maxLength={200}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    color: C.textPrimary,
                    fontFamily: "system-ui",
                    fontSize: isMobile ? 16 : 12,
                    outline: "none",
                  }}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  style={{
                    padding: "8px 12px",
                    background: input.trim() ? C.accent : C.border,
                    color: input.trim() ? C.bg : C.textDim,
                    border: "none",
                    borderRadius: 8,
                    cursor: input.trim() ? "pointer" : "default",
                    fontSize: 13,
                    transition: "all 0.2s",
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}