import { useState, useEffect, useRef } from "react";
import { Link } from "@/lib/navigation";
import { NexGuildLogo } from "@/components/ui/nexguild-logo";

/* ── Particle canvas (warm light — multiply blend) ─────────────── */
interface Dot { x: number; y: number; vx: number; vy: number; r: number; }

function PanelCanvas({ cr, cg, cb }: { cr: number; cg: number; cb: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let dots: Dot[] = [];
    const scale = window.devicePixelRatio || 1;

    const init = () => {
      const w = canvas.offsetWidth  || window.innerWidth / 2;
      const h = canvas.offsetHeight || window.innerHeight;
      canvas.width  = w * scale;
      canvas.height = h * scale;
      ctx.scale(scale, scale);
      const n = Math.min(40, Math.floor((w * h) / 14000));
      dots = Array.from({ length: n }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 1.4 + 0.5,
      }));
    };

    const frame = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const LINK = 115;
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < d.r || d.x > w - d.r) d.vx *= -1;
        if (d.y < d.r || d.y > h - d.r) d.vy *= -1;
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if (dist < LINK) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(1 - dist / LINK) * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},0.38)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    };

    init();
    frame();
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, [cr, cg, cb]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute", inset: 0, zIndex: 1,
        pointerEvents: "none", width: "100%", height: "100%",
        mixBlendMode: "multiply", opacity: 0.45,
      }}
    />
  );
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [hov, setHov] = useState<"left" | "right" | null>(null);

  return (
    <div className="root">

      {/* ── Logo ───────────────────────────────────────────────── */}
      <div className="logo-wrap">
        <NexGuildLogo variant="landing" theme="gold" textColor="#1C1917" />
      </div>

      {/* ── Split ──────────────────────────────────────────────── */}
      <div className="split">

        {/* LEFT — Organizations (gold) */}
        <section
          className={`panel p-left${hov === "left" ? " hov" : hov === "right" ? " shrink" : ""}`}
          onMouseEnter={() => setHov("left")}
          onMouseLeave={() => setHov(null)}
        >
          <PanelCanvas cr={217} cg={119} cb={6} />
          <div className="blob bl-main" />
          <div className="blob bl-top"  />
          <div className="blob bl-edge" />

          <div className="body">
            <div className="tag-row">
              <div className="tag-line tl-gold" />
              <span className="tag tg-gold">For Organizations</span>
            </div>
            <h2 className="hl">
              Scale Your<br />
              <em className="em-gold">Data Projects.</em>
            </h2>
            <p className="sub">
              We recruit, brief, and manage a contributor team for
              audio, transcription, annotation and more — end to end.
            </p>
            <div className="acts">
              <Link href="/client" className="btn btn-gold">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Explore Services
              </Link>
              <Link href="/client/how-it-works" className="lnk lnk-gold">How it works →</Link>
            </div>
            <p className="note">No account needed · Contact us directly</p>
          </div>
        </section>

        {/* Divider */}
        <div className="div-wrap" aria-hidden>
          <div className="div-ln" />
          <div className="div-badge">
            <span className="db-n">Nex</span><span className="db-g">Guild</span>
          </div>
          <div className="div-ln" />
        </div>

        {/* RIGHT — Contributors (teal) */}
        <section
          className={`panel p-right${hov === "right" ? " hov" : hov === "left" ? " shrink" : ""}`}
          onMouseEnter={() => setHov("right")}
          onMouseLeave={() => setHov(null)}
        >
          <PanelCanvas cr={13} cg={148} cb={136} />
          <div className="blob br-main" />
          <div className="blob br-top"  />
          <div className="blob br-edge" />

          <div className="body">
            <div className="tag-row">
              <div className="tag-line tl-teal" />
              <span className="tag tg-teal">For Contributors</span>
            </div>
            <h2 className="hl">
              Turn Free Time<br />
              <em className="em-teal">Into Real Money.</em>
            </h2>
            <p className="sub">
              Complete simple tasks from your phone — recording,
              testing, transcribing — and redeem NexCoins for gift vouchers.
            </p>
            <div className="acts">
              <Link href="/earn" className="btn btn-teal">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Start Earning
              </Link>
              <Link href="/how-it-works" className="lnk lnk-teal">How it works →</Link>
            </div>
            <p className="note">Free to join · 100+ active contributors</p>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0%,100% { transform: translate(0,0)    scale(1); }
          33%      { transform: translate(-4%,3%) scale(1.08); }
          66%      { transform: translate(4%,-3%) scale(0.94); }
        }
        @keyframes drift2 {
          0%,100% { transform: translate(0,0)    scale(1); }
          40%      { transform: translate(5%,-4%) scale(1.12); }
          75%      { transform: translate(-5%,4%) scale(0.92); }
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .root {
          height: 100vh; height: 100dvh;
          overflow: hidden;
          background: #FAF6EF;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
        }

        /* ── Logo ─────────────────────────────────────────────── */
        .logo-wrap {
          position: absolute; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding-top: 10px; pointer-events: auto;
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }
        .logo-wrap a { opacity: 0.90; transition: opacity 0.2s; }
        .logo-wrap a:hover { opacity: 1; }

        /* ── Split ───────────────────────────────────────────── */
        .split {
          display: flex; flex-direction: row;
          height: 100%; width: 100%;
        }

        .panel {
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-basis: 50%; flex-shrink: 0; flex-grow: 0;
          transition: flex-basis 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .panel.hov    { flex-basis: 62% !important; }
        .panel.shrink { flex-basis: 38% !important; }
        .p-left  { background: linear-gradient(160deg, #FEF9F0 0%, #FAF3E4 100%); }
        .p-right { background: linear-gradient(160deg, #F0FAFA 0%, #E8F7F5 100%); }

        /* ── Aurora blobs ────────────────────────────────────── */
        .blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          will-change: transform; z-index: 2;
        }

        /* Left blobs — gold */
        .bl-main {
          width: min(55%,400px); height: min(55%,400px);
          background: radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 65%);
          bottom: -10%; left: 50%; transform: translateX(-50%);
          animation: drift 22s ease-in-out infinite;
        }
        .bl-top {
          width: min(28%,200px); height: min(28%,200px);
          background: radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 65%);
          top: 8%; right: 8%;
          animation: drift2 18s ease-in-out infinite; animation-delay: -3s;
        }
        .bl-edge {
          width: min(20%,150px); height: min(20%,150px);
          background: radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%);
          top: 42%; left: 4%;
          animation: drift 24s ease-in-out infinite; animation-delay: -8s;
        }

        /* Right blobs — teal */
        .br-main {
          width: min(55%,400px); height: min(55%,400px);
          background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 65%);
          bottom: -10%; left: 50%; transform: translateX(-50%);
          animation: drift 25s ease-in-out infinite; animation-delay: -2s;
        }
        .br-top {
          width: min(28%,200px); height: min(28%,200px);
          background: radial-gradient(circle, rgba(94,234,212,0.14) 0%, transparent 65%);
          top: 8%; left: 8%;
          animation: drift2 19s ease-in-out infinite; animation-delay: -5s;
        }
        .br-edge {
          width: min(20%,150px); height: min(20%,150px);
          background: radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 65%);
          top: 42%; right: 4%;
          animation: drift 28s ease-in-out infinite; animation-delay: -11s;
        }

        /* Brighten blobs on hover */
        .panel.hov .bl-main,
        .panel.hov .bl-top  { filter: blur(70px) brightness(1.3); }
        .panel.hov .br-main,
        .panel.hov .br-top  { filter: blur(70px) brightness(1.3); }

        /* ── Content ──────────────────────────────────────────── */
        .body {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: flex-start; text-align: left;
          padding: clamp(16px,4vw,60px) clamp(20px,5vw,64px);
          max-width: clamp(280px, 38vw, 440px); width: 100%;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both;
        }
        .panel.hov .body { transform: scale(1.025); }

        /* Tag row — line + text */
        .tag-row {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: clamp(14px, 1.8vh, 22px);
        }
        .tag-line { width: 28px; height: 1px; flex-shrink: 0; }
        .tl-gold  { background: rgba(245,158,11,0.55); }
        .tl-teal  { background: rgba(20,184,166,0.55); }
        .tag {
          font-size: clamp(9px, 0.7vw, 11px); font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
        }
        .tg-gold { color: #B45309; }
        .tg-teal { color: #0F766E; }

        .hl {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(26px, 3.6vw, 50px); font-weight: 400; color: #1C1917;
          line-height: 1.08; letter-spacing: -0.02em;
          margin-bottom: clamp(10px, 1.4vh, 18px);
        }
        .em-gold { font-style: italic; color: #F59E0B; }
        .em-teal { font-style: italic; color: #14b8a6; }

        .sub {
          font-size: clamp(12px, 1vw, 15px); line-height: 1.72;
          color: #78716C; max-width: 300px;
          margin-bottom: clamp(18px, 2.4vh, 30px);
        }

        /* ── Buttons ──────────────────────────────────────────── */
        .acts {
          display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
          margin-bottom: 16px; width: 100%;
        }

        .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: clamp(10px,1vh,14px) clamp(18px,2vw,28px);
          border-radius: 9999px; font-weight: 500;
          font-size: clamp(11px, 0.85vw, 14px); letter-spacing: 0.01em; text-decoration: none;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s cubic-bezier(0.16,1,0.3,1), background 0.35s, border-color 0.35s;
        }
        .btn:hover { transform: translateY(-2px); }

        .btn-gold {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(217,119,6,0.38);
          box-shadow: 0 2px 14px rgba(217,119,6,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
          color: #92400E;
        }
        .btn-gold:hover {
          border-color: rgba(217,119,6,0.65);
          box-shadow: 0 6px 28px rgba(217,119,6,0.22), inset 0 1px 0 rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.88);
        }

        .btn-teal {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(13,148,136,0.38);
          box-shadow: 0 2px 14px rgba(13,148,136,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
          color: #134E4A;
        }
        .btn-teal:hover {
          border-color: rgba(13,148,136,0.65);
          box-shadow: 0 6px 28px rgba(13,148,136,0.20), inset 0 1px 0 rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.88);
        }

        .lnk {
          font-size: clamp(11px, 0.85vw, 13px); font-weight: 500; text-decoration: none;
          transition: color 0.2s;
        }
        .lnk-gold { color: #A8A29E; }
        .lnk-gold:hover { color: #B45309; }
        .lnk-teal { color: #A8A29E; }
        .lnk-teal:hover { color: #0F766E; }

        .note { font-size: 11px; color: #A8A29E; letter-spacing: 0.02em; }

        /* ── Divider ──────────────────────────────────────────── */
        .div-wrap {
          width: 1px; flex-shrink: 0; z-index: 20;
          display: flex; flex-direction: column; align-items: center;
        }
        .div-ln {
          flex: 1; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.08) 50%, transparent);
        }
        .div-badge {
          padding: 10px 4px; writing-mode: vertical-rl;
          font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase;
          flex-shrink: 0; user-select: none;
        }
        .db-n { color: rgba(28,25,23,0.30); }
        .db-g  { color: rgba(245,158,11,0.50); }

        /* ── Mobile ───────────────────────────────────────────── */
        @media (max-width: 700px) {
          .root {
            display: flex; flex-direction: column;
            height: auto; min-height: 100dvh;
            overflow-x: hidden; overflow-y: auto;
          }
          .logo-wrap {
            position: relative; top: auto; left: auto; right: auto;
            flex-shrink: 0; padding: 10px 0 6px;
          }
          .split { display: flex; flex-direction: column; flex: none; }
          .panel {
            flex-basis: auto !important; flex-shrink: 0 !important; flex-grow: 0 !important;
            min-height: 50vh; height: auto; overflow: hidden; transition: none;
          }
          .panel.hov, .panel.shrink { flex-basis: auto !important; }
          .panel.hov .body { transform: none; }
          .body { padding: 32px 20px 36px; max-width: 100%; align-items: flex-start; }
          .div-wrap { width: 100%; height: 1px; flex-direction: row; }
          .div-ln {
            flex: 1; height: 1px; width: auto;
            background: linear-gradient(to right, transparent, rgba(0,0,0,0.08) 50%, transparent);
          }
          .div-badge { writing-mode: horizontal-tb; padding: 4px 12px; font-size: 8px; }
          .hl   { font-size: clamp(22px,5vw,28px); }
          .sub  { font-size: 13px; }
          .btn  { font-size: 14px; }
          canvas { display: none; }
        }
        @media (max-width: 380px) {
          .hl  { font-size: 20px; }
          .btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
