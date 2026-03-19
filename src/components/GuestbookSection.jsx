import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { mkPanel } from "../styles/theme";
import { useInView } from "../hooks/useInView";
import { SectionTag } from "./ui";

/* ── security helpers ────────────────────────────────── */

const sanitizeText = (str, maxLen) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>&"'`]/g, (ch) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;", "`": "&#96;" })[ch]
  ).slice(0, maxLen);
};

const isValidDataUrl = (val) => {
  if (typeof val !== "string" || val === "data:,") return false;
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(val) && val.length < 200000;
};

const validateEntry = (raw, allowedColors) => {
  if (!raw || typeof raw !== "object") return null;
  if (typeof raw.name !== "string" || !raw.name.trim()) return null;

  const ts = raw.ts?.toMillis ? raw.ts.toMillis() : typeof raw.ts === "number" ? raw.ts : 0;
  if (ts <= 0) return null;

  return {
    name: sanitizeText(raw.name.trim(), 32),
    msg: sanitizeText(typeof raw.msg === "string" ? raw.msg.trim() : "", 200),
    sig: sanitizeText(typeof raw.sig === "string" ? raw.sig.trim() : "", 40),
    draw: isValidDataUrl(raw.draw) ? raw.draw : null,
    ts,
    color: allowedColors.includes(raw.color) ? raw.color : allowedColors[0],
    approved: raw.approved === true
  };
};

const MAX_ENTRIES = 500;
const SUBMIT_COOLDOWN_MS = 5000;
const GUESTBOOK_COLLECTION = "guestbook";

/* ── component ───────────────────────────────────────── */

export function GuestbookSection({ C }) {
  const { ref, inView } = useInView(0.1);

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [typedSig, setTypedSig] = useState("");
  const [tab, setTab] = useState("type");
  const [sigs, setSigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [penColor, setPenColor] = useState(C.accent);

  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [draftTypedSig, setDraftTypedSig] = useState("");
  const [draftTab, setDraftTab] = useState("type");
  const [drawPreview, setDrawPreview] = useState("");

  const canvasRef = useRef(null);
  const modalCanvasRef = useRef(null);
  const modalCardRef = useRef(null);
  const isPainting = useRef(false);
  const lastPointRef = useRef(null);
  const lastSubmitRef = useRef(0);

  const allowedColors = [C.accent, C.green, C.pink, C.orange];

  /* ── load entries from Firestore ───────────────────── */

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, GUESTBOOK_COLLECTION),
          orderBy("ts", "desc"),
          limit(MAX_ENTRIES)
        );
        const snapshot = await getDocs(q);
        const items = [];
        snapshot.forEach((doc) => {
          const validated = validateEntry(doc.data(), allowedColors);
          if (validated) items.push(validated);
        });
        setSigs(items);
      } catch (err) {
        console.error("Guestbook load error:", err);
      }
      setLoading(false);
    })();
  }, []);

  /* ── drawing helpers ───────────────────────────────── */

  const getPoint = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0] || e.changedTouches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const beginDraw = (e, targetCanvasRef) => {
    const canvas = targetCanvasRef.current;
    if (!canvas) return;
    isPainting.current = true;
    const ctx = canvas.getContext("2d");
    const pt = getPoint(e, canvas);
    lastPointRef.current = pt;
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
  };

  const continueDraw = (e, targetCanvasRef) => {
    if (!isPainting.current) return;
    const canvas = targetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pt = getPoint(e, canvas);

    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    lastPointRef.current = pt;
  };

  const endDraw = () => {
    isPainting.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = (targetCanvasRef) => {
    const canvas = targetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* ── signature modal ───────────────────────────────── */

  const openSignatureModal = () => {
    setDraftTypedSig(typedSig);
    setDraftTab(tab);
    setSigModalOpen(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (modalCanvasRef.current && canvasRef.current && canvasRef.current.toDataURL() !== "data:,") {
          const ctx = modalCanvasRef.current.getContext("2d");
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, modalCanvasRef.current.width, modalCanvasRef.current.height);
            ctx.drawImage(img, 0, 0, modalCanvasRef.current.width, modalCanvasRef.current.height);
          };
          img.src = canvasRef.current.toDataURL();
        }
      });
    });
  };

  const closeSignatureModal = () => {
    setSigModalOpen(false);
    endDraw();
  };

  const confirmSignature = () => {
    setTypedSig(draftTypedSig);
    setTab(draftTab);

    if (draftTab === "draw" && modalCanvasRef.current && canvasRef.current) {
      const dataUrl = modalCanvasRef.current.toDataURL();
      if (!isValidDataUrl(dataUrl)) {
        setDrawPreview("");
        closeSignatureModal();
        return;
      }
      const mainCtx = canvasRef.current.getContext("2d");
      mainCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      const img = new Image();
      img.onload = () => {
        mainCtx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setDrawPreview(dataUrl);
      };
      img.src = dataUrl;
    } else if (draftTab === "type") {
      setDrawPreview("");
    }

    closeSignatureModal();
  };

  useEffect(() => {
    if (!sigModalOpen) return;

    const handleOutsideClick = (e) => {
      if (modalCardRef.current && !modalCardRef.current.contains(e.target)) {
        closeSignatureModal();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") closeSignatureModal();
    };

    let lastScrollY = window.scrollY;
    const handleScrollClose = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 100) {
        closeSignatureModal();
      }
    };

    const timer = setTimeout(() => {
      window.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("touchstart", handleOutsideClick, { passive: true });
    }, 0);

    window.addEventListener("keydown", handleEsc);
    window.addEventListener("scroll", handleScrollClose, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("scroll", handleScrollClose);
    };
  }, [sigModalOpen]);

  /* ── submit to Firestore with rate limiting ────────── */

  const submit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || submitting) return;

    const now = Date.now();
    if (now - lastSubmitRef.current < SUBMIT_COOLDOWN_MS) return;
    lastSubmitRef.current = now;

    setSubmitting(true);

    const drawData = tab === "draw" && isValidDataUrl(drawPreview) ? drawPreview : null;

    const entry = {
      name: sanitizeText(trimmedName, 32),
      msg: sanitizeText(msg.trim(), 200),
      sig: sanitizeText(typedSig.trim(), 40),
      draw: drawData,
      ts: serverTimestamp(),
      color: allowedColors[Math.floor(Math.random() * allowedColors.length)],
      approved: false
    };

    try {
      await addDoc(collection(db, GUESTBOOK_COLLECTION), entry);
    } catch (err) {
      console.error("Guestbook submit error:", err);
    }

    const localEntry = { ...entry, ts: now };
    setSigs((p) => [localEntry, ...p].slice(0, MAX_ENTRIES));
    setName("");
    setMsg("");
    setTypedSig("");
    setDrawPreview("");
    clearCanvas(canvasRef);
    setSubmitting(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  /* ── styles ────────────────────────────────────────── */

  const inputStyle = {
    width: "100%",
    padding: "clamp(11px, 0.85vw, 14px) clamp(14px, 1vw, 18px)",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 7,
    color: C.textPrimary,
    fontFamily: "monospace",
    fontSize: "clamp(12px, 0.82vw, 14px)",
    outline: "none",
    boxSizing: "border-box"
  };

  /* ── render ────────────────────────────────────────── */

  return (
    <section
      id="guestbook"
      ref={ref}
      className="section-pad"
      style={{
        padding: "clamp(96px, 8vw, 140px) clamp(32px, 5vw, 88px)",
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative"
      }}
    >
      <div
        style={{
          maxWidth: "clamp(1120px, 78vw, 1400px)",
          margin: "0 auto",
          width: "100%"
        }}
      >
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.6s"
          }}
        >
          <div
            style={{
              transform: "scale(1.18)",
              transformOrigin: "left center",
              width: "fit-content",
              marginBottom: "clamp(10px, 1vw, 14px)"
            }}
          >
            <SectionTag num="07" label="Guestbook" C={C} />
          </div>

          <h2
            style={{
              fontFamily: "system-ui",
              fontSize: "clamp(32px, 4.2vw, 54px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: "0 0 10px",
              color: C.textPrimary
            }}
          >
            Leave your <span style={{ color: C.accent }}>mark.</span>
          </h2>

          <p
            style={{
              color: C.textSecondary,
              fontSize: "clamp(15px, 1vw, 18px)",
              marginBottom: "clamp(32px, 2.4vw, 44px)",
              lineHeight: 1.75,
              maxWidth: "clamp(560px, 42vw, 760px)"
            }}
          >
            Sign the wall. Your name shows instantly — messages are reviewed before going live.
          </p>
        </div>

        <div
          className="guestbook-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 430px) 1fr",
            gap: "clamp(22px, 2vw, 32px)",
            opacity: inView ? 1 : 0,
            transition: "all 0.7s 0.2s"
          }}
        >
          <div
            style={mkPanel(C, {
              padding: "clamp(24px, 1.8vw, 32px)",
              borderColor: C.accent + "30",
              borderRadius: "clamp(10px, 0.9vw, 14px)"
            })}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 0.75vw, 12px)",
                color: C.accent,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "clamp(16px, 1.1vw, 20px)"
              }}
            >
              Sign the wall
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 32))}
              placeholder="Your name *"
              maxLength={32}
              style={{ ...inputStyle, marginBottom: 10 }}
            />

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value.slice(0, 200))}
              placeholder="Leave a message…"
              maxLength={200}
              rows={3}
              style={{
                ...inputStyle,
                resize: "none",
                marginBottom: 12
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 3,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 7,
                marginBottom: 12
              }}
            >
              {["type", "draw"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "clamp(8px, 0.7vw, 10px) 0",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "monospace",
                    fontSize: "clamp(11px, 0.78vw, 13px)",
                    background: tab === t ? C.accent + "20" : "transparent",
                    color: tab === t ? C.accent : C.textDim,
                    transition: "all 0.2s"
                  }}
                >
                  {t === "type" ? "⌨️ Type" : "✏️ Draw"}
                </button>
              ))}
            </div>

            <div
              onClick={openSignatureModal}
              style={{
                width: "100%",
                padding: "clamp(14px, 1vw, 18px)",
                background: C.bg,
                border: `1px dashed ${C.border}`,
                borderRadius: 7,
                minHeight: 96,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                marginBottom: 12,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {tab === "type" ? (
                typedSig ? (
                  <span
                    style={{
                      color: C.accent,
                      fontFamily: "Georgia, cursive",
                      fontSize: "clamp(22px, 1.6vw, 28px)",
                      fontStyle: "italic",
                      textAlign: "center"
                    }}
                  >
                    {typedSig}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(12px, 0.82vw, 14px)",
                      color: C.textDim
                    }}
                  >
                    Tap to add your signature
                  </span>
                )
              ) : drawPreview ? (
                <img
                  src={drawPreview}
                  alt="signature preview"
                  style={{ width: "100%", height: 72, objectFit: "contain", opacity: 0.9 }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "clamp(12px, 0.82vw, 14px)",
                    color: C.textDim
                  }}
                >
                  Tap to draw your signature
                </span>
              )}
            </div>

            <canvas
              ref={canvasRef}
              width={360}
              height={100}
              style={{ display: "none" }}
            />

            {done ? (
              <div
                style={{
                  padding: "clamp(12px, 0.9vw, 14px)",
                  background: C.green + "15",
                  border: `1px solid ${C.green}30`,
                  borderRadius: 7,
                  fontFamily: "monospace",
                  fontSize: "clamp(12px, 0.82vw, 14px)",
                  color: C.green,
                  textAlign: "center"
                }}
              >
                ✓ Signed!
              </div>
            ) : (
              <button
                onClick={submit}
                disabled={!name.trim() || submitting}
                style={{
                  width: "100%",
                  padding: "clamp(13px, 0.95vw, 16px)",
                  fontWeight: 700,
                  fontSize: "clamp(13px, 0.9vw, 15px)",
                  borderRadius: 7,
                  border: "none",
                  cursor: name.trim() ? "pointer" : "default",
                  fontFamily: "monospace",
                  background: name.trim() ? `linear-gradient(90deg,${C.accent},${C.green})` : C.border,
                  color: name.trim() ? C.bg : C.textDim
                }}
              >
                {submitting ? "Signing…" : "✍️ Leave My Mark"}
              </button>
            )}
          </div>

          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 0.75vw, 12px)",
                color: C.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "clamp(14px, 1vw, 18px)"
              }}
            >
              {loading ? "Loading…" : `${sigs.length} visitor${sigs.length !== 1 ? "s" : ""} have signed`}
            </div>

            {!loading && sigs.length === 0 && (
              <div
                style={mkPanel(C, {
                  padding: "clamp(34px, 2.2vw, 42px)",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "clamp(13px, 0.9vw, 15px)",
                  color: C.textDim,
                  borderRadius: "clamp(10px, 0.9vw, 14px)"
                })}
              >
                Be the first to sign! 🚀
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: "clamp(10px, 0.9vw, 14px)",
                maxHeight: 460,
                overflowY: "auto",
                paddingRight: 4
              }}
            >
              {sigs.map((s) => (
                <div
                  key={s.ts}
                  style={mkPanel(C, {
                    padding: "clamp(16px, 1.2vw, 20px)",
                    borderColor: s.color + "25",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "clamp(10px, 0.9vw, 14px)"
                  })}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color + "50" }} />
                  <div
                    style={{
                      fontFamily: "system-ui",
                      fontWeight: 700,
                      fontSize: "clamp(14px, 0.95vw, 16px)",
                      color: s.color,
                      marginBottom: 4
                    }}
                  >
                    {s.name}
                  </div>

                  {s.approved && s.msg && (
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "clamp(12px, 0.82vw, 14px)",
                        color: C.textSecondary,
                        marginBottom: 4,
                        lineHeight: 1.5,
                        wordBreak: "break-word"
                      }}
                    >
                      {s.msg}
                    </div>
                  )}

                  {s.sig && (
                    <div
                      style={{
                        fontFamily: "Georgia, cursive",
                        fontSize: "clamp(16px, 1.05vw, 18px)",
                        fontStyle: "italic",
                        color: s.color,
                        opacity: 0.7,
                        marginBottom: 6
                      }}
                    >
                      {s.sig}
                    </div>
                  )}

                  {s.draw && (
                    <img
                      src={s.draw}
                      style={{ width: "100%", height: 36, objectFit: "contain", opacity: 0.6, marginBottom: 6 }}
                      alt="sig"
                    />
                  )}

                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(10px, 0.72vw, 12px)",
                      color: C.textDim
                    }}
                  >
                    {new Date(s.ts).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {sigModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 3vw, 28px)",
            background: "rgba(7,11,20,0.82)",
            backdropFilter: "blur(8px)"
          }}
        >
          <div
            ref={modalCardRef}
            style={mkPanel(C, {
              width: "min(100%, 560px)",
              padding: "clamp(20px, 2vw, 28px)",
              borderRadius: "clamp(12px, 1vw, 16px)",
              boxShadow: `0 12px 40px rgba(0,0,0,0.35)`
            })}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: "clamp(16px, 1.2vw, 20px)"
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "system-ui",
                    fontWeight: 700,
                    fontSize: "clamp(18px, 1.25vw, 22px)",
                    color: C.textPrimary,
                    marginBottom: 4
                  }}
                >
                  Add your signature
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    color: C.textDim
                  }}
                >
                  tap outside, press escape, or scroll to close
                </div>
              </div>

              <button
                onClick={closeSignatureModal}
                style={{
                  border: `1px solid ${C.border}`,
                  background: "none",
                  color: C.textDim,
                  borderRadius: 7,
                  padding: "8px 12px",
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "clamp(11px, 0.78vw, 13px)"
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 4,
                padding: 3,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 7,
                marginBottom: 12
              }}
            >
              {["type", "draw"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDraftTab(t)}
                  style={{
                    flex: 1,
                    padding: "clamp(9px, 0.75vw, 11px) 0",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "monospace",
                    fontSize: "clamp(11px, 0.78vw, 13px)",
                    background: draftTab === t ? C.accent + "20" : "transparent",
                    color: draftTab === t ? C.accent : C.textDim,
                    transition: "all 0.2s"
                  }}
                >
                  {t === "type" ? "⌨️ Type" : "✏️ Draw"}
                </button>
              ))}
            </div>

            {draftTab === "type" ? (
              <input
                value={draftTypedSig}
                onChange={(e) => setDraftTypedSig(e.target.value.slice(0, 40))}
                placeholder="Type your signature…"
                maxLength={40}
                style={{
                  width: "100%",
                  padding: "clamp(16px, 1.1vw, 20px)",
                  background: C.bg,
                  border: `1px dashed ${C.border}`,
                  borderRadius: 10,
                  color: C.accent,
                  fontFamily: "Georgia, cursive",
                  fontSize: "clamp(24px, 1.8vw, 32px)",
                  fontStyle: "italic",
                  outline: "none",
                  textAlign: "center",
                  boxSizing: "border-box",
                  marginBottom: 14
                }}
              />
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 12,
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    {[C.accent, C.green, C.pink, C.orange, "#fff"].map((pc) => (
                      <div
                        key={pc}
                        onClick={() => setPenColor(pc)}
                        style={{
                          width: "clamp(16px, 1.1vw, 20px)",
                          height: "clamp(16px, 1.1vw, 20px)",
                          borderRadius: "50%",
                          background: pc,
                          cursor: "pointer",
                          border: penColor === pc ? "2px solid #fff" : `2px solid ${C.border}`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => clearCanvas(modalCanvasRef)}
                    style={{
                      fontFamily: "monospace",
                      fontSize: "clamp(10px, 0.75vw, 12px)",
                      color: C.textDim,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                  >
                    clear
                  </button>
                </div>

                <canvas
                  ref={modalCanvasRef}
                  width={520}
                  height={170}
                  onMouseDown={(e) => beginDraw(e, modalCanvasRef)}
                  onMouseMove={(e) => continueDraw(e, modalCanvasRef)}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    beginDraw(e, modalCanvasRef);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    continueDraw(e, modalCanvasRef);
                  }}
                  onTouchEnd={endDraw}
                  style={{
                    width: "100%",
                    height: "clamp(150px, 28vw, 190px)",
                    background: C.bg,
                    borderRadius: 10,
                    border: `1px dashed ${C.border}`,
                    cursor: "crosshair",
                    display: "block",
                    touchAction: "none"
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                flexWrap: "wrap"
              }}
            >
              <button
                onClick={closeSignatureModal}
                style={{
                  padding: "clamp(10px, 0.8vw, 12px) clamp(16px, 1.1vw, 20px)",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  background: "none",
                  color: C.textDim,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontSize: "clamp(11px, 0.8vw, 13px)"
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmSignature}
                style={{
                  padding: "clamp(10px, 0.8vw, 12px) clamp(16px, 1.1vw, 20px)",
                  borderRadius: 8,
                  border: "none",
                  background: `linear-gradient(90deg,${C.accent},${C.green})`,
                  color: C.bg,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  fontSize: "clamp(11px, 0.8vw, 13px)"
                }}
              >
                Confirm signature
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}