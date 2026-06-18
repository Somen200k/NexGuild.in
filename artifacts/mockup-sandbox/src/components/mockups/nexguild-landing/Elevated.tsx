import React, { useEffect, useRef } from 'react';

export function Elevated() {
  return (
    <div className="relative w-full h-[100vh] overflow-hidden font-sans flex flex-col md:flex-row" style={{ background: '#FAF6EF', color: '#1a1208' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

        .elev-font-serif { font-family: 'Instrument Serif', serif; }

        .elev-panel-gold {
          background: radial-gradient(ellipse 80% 70% at 30% 70%, rgba(251,191,36,0.18) 0%, rgba(250,246,239,0.0) 70%),
                      linear-gradient(160deg, #FEF9F0 0%, #FAF3E4 100%);
        }
        .elev-panel-teal {
          background: radial-gradient(ellipse 80% 70% at 70% 70%, rgba(20,184,166,0.13) 0%, rgba(250,246,239,0.0) 70%),
                      linear-gradient(160deg, #F0FAFA 0%, #E8F7F5 100%);
        }

        .elev-aurora-gold {
          position: absolute;
          bottom: -5%;
          left: 5%;
          width: 55%;
          height: 55%;
          background: radial-gradient(circle, rgba(245,158,11,0.22) 0%, transparent 65%);
          filter: blur(90px);
          pointer-events: none;
          animation: elev-drift 22s infinite alternate ease-in-out;
        }
        .elev-aurora-gold-top {
          position: absolute;
          top: 5%;
          right: 8%;
          width: 28%;
          height: 28%;
          background: radial-gradient(circle, rgba(251,191,36,0.14) 0%, transparent 65%);
          filter: blur(60px);
          pointer-events: none;
          animation: elev-drift-r 18s infinite alternate ease-in-out;
        }
        .elev-aurora-teal {
          position: absolute;
          bottom: -5%;
          right: 5%;
          width: 55%;
          height: 55%;
          background: radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 65%);
          filter: blur(90px);
          pointer-events: none;
          animation: elev-drift-r 25s infinite alternate ease-in-out;
        }
        .elev-aurora-teal-top {
          position: absolute;
          top: 5%;
          left: 8%;
          width: 28%;
          height: 28%;
          background: radial-gradient(circle, rgba(94,234,212,0.13) 0%, transparent 65%);
          filter: blur(60px);
          pointer-events: none;
          animation: elev-drift 19s infinite alternate ease-in-out;
        }

        @keyframes elev-drift {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(6%,-8%) scale(1.08); }
          100% { transform: translate(-4%, 5%) scale(0.94); }
        }
        @keyframes elev-drift-r {
          0%   { transform: translate(0,0) scale(1); }
          50%  { transform: translate(-6%,-5%) scale(1.12); }
          100% { transform: translate(5%, 8%) scale(0.88); }
        }

        .elev-btn-gold {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(217,119,6,0.35);
          box-shadow: 0 2px 14px rgba(217,119,6,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
          color: #92400e;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .elev-btn-gold:hover {
          border-color: rgba(217,119,6,0.65);
          box-shadow: 0 6px 28px rgba(217,119,6,0.22), inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-2px);
          background: rgba(255,255,255,0.88);
        }

        .elev-btn-teal {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(13,148,136,0.35);
          box-shadow: 0 2px 14px rgba(13,148,136,0.10), inset 0 1px 0 rgba(255,255,255,0.9);
          color: #134e4a;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .elev-btn-teal:hover {
          border-color: rgba(13,148,136,0.65);
          box-shadow: 0 6px 28px rgba(13,148,136,0.20), inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-2px);
          background: rgba(255,255,255,0.88);
        }

        .elev-divider {
          background: linear-gradient(180deg,
            transparent 0%,
            rgba(0,0,0,0.07) 20%,
            rgba(0,0,0,0.07) 80%,
            transparent 100%);
        }

        .elev-badge {
          background: rgba(255,255,255,0.80);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1);
        }

        @keyframes elev-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .elev-up { animation: elev-fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .elev-d1 { animation-delay: 80ms; }
        .elev-d2 { animation-delay: 180ms; }
        .elev-d3 { animation-delay: 280ms; }
        .elev-d4 { animation-delay: 380ms; }
      `}} />

      {/* Logo */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 elev-up pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(0,0,0,0.07)', borderRadius: '999px', padding: '8px 22px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)' }}>
        <img src="/__mockup/images/nexguild_logo_final.png" alt="NexGuild"
          style={{ height: '44px', width: 'auto', display: 'block' }} />
      </div>

      {/* Divider */}
      <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-40 flex-col items-center pointer-events-none">
        <div className="w-[1px] h-full elev-divider"></div>
        <div className="absolute top-1/2 -translate-y-1/2 elev-badge px-3 py-6 rounded-full flex flex-col items-center gap-4 elev-up elev-d2">
          <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-stone-400"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Ecosystem</span>
          <div className="w-1 h-1 rounded-full bg-stone-300"></div>
          <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-stone-400"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>NexGuild</span>
        </div>
      </div>

      {/* Left — Organizations (Gold) */}
      <div className="relative flex-1 flex items-center justify-center border-b md:border-b-0 border-black/5 elev-panel-gold"
        style={{ padding: 'clamp(24px, 6vw, 72px)' }}>
        <WarmParticleCanvas color="#d97706" blend="multiply" />
        <div className="elev-aurora-gold"></div>
        <div className="elev-aurora-gold-top"></div>

        <div className="relative z-10 w-full flex flex-col items-start" style={{ maxWidth: 'clamp(280px, 38vw, 440px)', gap: 'clamp(14px, 2vh, 28px)' }}>
          <div className="inline-flex items-center gap-3 elev-up elev-d1">
            <div className="w-7 h-[1px] bg-amber-500/60"></div>
            <span className="text-amber-700 font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 'clamp(9px, 0.7vw, 11px)' }}>For Organizations</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.2vh, 18px)' }}>
            <h1 className="elev-font-serif text-stone-900 elev-up elev-d2"
              style={{ fontSize: 'clamp(26px, 3.6vw, 50px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Scale Your <br/><i className="text-amber-500">Data Projects.</i>
            </h1>
            <p className="text-stone-500 elev-up elev-d3"
              style={{ fontSize: 'clamp(12px, 1vw, 15px)', lineHeight: 1.7, maxWidth: '320px' }}>
              Access an elastic workforce of trained contributors to label, transcribe, and annotate your datasets with precision.
            </p>
          </div>

          <div className="flex items-center gap-5 elev-up elev-d4">
            <button className="elev-btn-gold rounded-full font-medium tracking-wide flex items-center gap-2.5 group"
              style={{ padding: 'clamp(10px, 1vh, 14px) clamp(18px, 2vw, 28px)', fontSize: 'clamp(11px, 0.85vw, 14px)' }}>
              Explore Services
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
            <a href="#" className="text-stone-400 hover:text-amber-700 transition-colors flex items-center gap-1.5 group"
              style={{ fontSize: 'clamp(11px, 0.85vw, 13px)' }}>
              How it works <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right — Contributors (Teal) */}
      <div className="relative flex-1 flex items-center justify-center elev-panel-teal"
        style={{ padding: 'clamp(24px, 6vw, 72px)' }}>
        <WarmParticleCanvas color="#0d9488" blend="multiply" />
        <div className="elev-aurora-teal"></div>
        <div className="elev-aurora-teal-top"></div>

        <div className="relative z-10 w-full flex flex-col items-start" style={{ maxWidth: 'clamp(280px, 38vw, 440px)', gap: 'clamp(14px, 2vh, 28px)' }}>
          <div className="inline-flex items-center gap-3 elev-up elev-d1">
            <div className="w-7 h-[1px] bg-teal-500/60"></div>
            <span className="text-teal-700 font-semibold tracking-[0.12em] uppercase" style={{ fontSize: 'clamp(9px, 0.7vw, 11px)' }}>For Contributors</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.2vh, 18px)' }}>
            <h1 className="elev-font-serif text-stone-900 elev-up elev-d2"
              style={{ fontSize: 'clamp(26px, 3.6vw, 50px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Turn Free Time <br/><i className="text-teal-500">Into Real Money.</i>
            </h1>
            <p className="text-stone-500 elev-up elev-d3"
              style={{ fontSize: 'clamp(12px, 1vw, 15px)', lineHeight: 1.7, maxWidth: '320px' }}>
              Complete simple AI training tasks from anywhere. Earn NexCoins and redeem them for premium gift vouchers.
            </p>
          </div>

          <div className="flex items-center gap-5 elev-up elev-d4">
            <button className="elev-btn-teal rounded-full font-medium tracking-wide flex items-center gap-2.5 group"
              style={{ padding: 'clamp(10px, 1vh, 14px) clamp(18px, 2vw, 28px)', fontSize: 'clamp(11px, 0.85vw, 14px)' }}>
              Start Earning
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
            <a href="#" className="text-stone-400 hover:text-teal-700 transition-colors flex items-center gap-1.5 group"
              style={{ fontSize: 'clamp(11px, 0.85vw, 13px)' }}>
              How it works <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function WarmParticleCanvas({ color, blend }: { color: string; blend: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const scale = window.devicePixelRatio || 1;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.scale(scale, scale);

    const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    const rgb = hex ? { r: parseInt(hex[1],16), g: parseInt(hex[2],16), b: parseInt(hex[3],16) } : { r: 0, g: 0, b: 0 };

    const count = Math.min(40, Math.floor((w * h) / 14000));
    const dots = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.4 + 0.5,
    }));

    const frame = () => {
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
            ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${(1 - dist/LINK) * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.38)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(frame);
    };

    frame();
    const onResize = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * scale; canvas.height = h * scale;
      ctx.scale(scale, scale);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [color]);

  return (
    <canvas ref={ref} aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', mixBlendMode: blend as any, opacity: 0.45 }} />
  );
}
