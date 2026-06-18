import React, { useEffect, useRef, useState } from 'react';

export function Elevated() {
  return (
    <div className="relative w-full h-[100vh] overflow-hidden bg-[#070707] font-sans flex flex-col md:flex-row text-white selection:bg-white/10">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Instrument Serif', serif;
        }

        .elevated-gradient-gold {
          background: radial-gradient(circle at 30% 60%, rgba(217, 119, 6, 0.15) 0%, rgba(7, 7, 7, 1) 60%);
        }
        
        .elevated-gradient-teal {
          background: radial-gradient(circle at 70% 60%, rgba(13, 148, 136, 0.15) 0%, rgba(5, 16, 30, 1) 60%);
        }
        
        .elevated-aurora-gold {
          position: absolute;
          bottom: 10%;
          left: 10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(217, 119, 6, 0.25) 0%, transparent 60%);
          filter: blur(100px);
          opacity: 0.7;
          animation: aurora-drift 25s infinite alternate ease-in-out;
          pointer-events: none;
        }

        .elevated-aurora-teal {
          position: absolute;
          bottom: 10%;
          right: 10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 60%);
          filter: blur(100px);
          opacity: 0.7;
          animation: aurora-drift-reverse 28s infinite alternate ease-in-out;
          pointer-events: none;
        }

        @keyframes aurora-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -10%) scale(1.1); }
          100% { transform: translate(-5%, 5%) scale(0.9); }
        }

        @keyframes aurora-drift-reverse {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10%, -5%) scale(1.15); }
          100% { transform: translate(10%, 10%) scale(0.85); }
        }

        .elevated-glass-btn-gold {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
          border: 1px solid rgba(217, 119, 6, 0.4);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(217, 119, 6, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .elevated-glass-btn-gold:hover {
          border-color: rgba(217, 119, 6, 0.8);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 40px rgba(217, 119, 6, 0.3);
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
        }

        .elevated-glass-btn-teal {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%);
          border: 1px solid rgba(13, 148, 136, 0.4);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(13, 148, 136, 0.15);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .elevated-glass-btn-teal:hover {
          border-color: rgba(13, 148, 136, 0.8);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 40px rgba(13, 148, 136, 0.3);
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%);
        }

        .elevated-divider {
          background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 0.15) 80%, transparent);
        }

        .elevated-badge-glass {
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        @keyframes elevated-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .elevated-animate-up {
          animation: elevated-fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
      `}} />

      {/* Top Center Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 mix-blend-plus-lighter pointer-events-none elevated-animate-up">
        <img src="/__mockup/images/nexguild_logo_final.png" alt="NexGuild" style={{ height: '36px', width: 'auto' }} />
      </div>

      {/* Center Divider & Badge */}
      <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-40 flex-col items-center justify-center pointer-events-none">
        <div className="w-[1px] h-full elevated-divider opacity-50"></div>
        <div className="absolute top-1/2 -translate-y-1/2 elevated-badge-glass px-3 py-6 rounded-full flex flex-col items-center justify-center gap-4 elevated-animate-up delay-200">
          <span className="uppercase tracking-[0.3em] text-[10px] text-white/50" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Ecosystem
          </span>
          <div className="w-1 h-1 rounded-full bg-white/20"></div>
          <span className="uppercase tracking-[0.3em] text-[10px] text-white/50" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            NexGuild
          </span>
        </div>
      </div>

      {/* Left Panel: Organizations (Gold) */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 md:p-20 border-b md:border-b-0 border-white/5 elevated-gradient-gold">
        <ParticleCanvas color="#d97706" />
        <div className="elevated-aurora-gold"></div>
        
        <div className="relative z-10 max-w-md w-full flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-3 elevated-animate-up delay-100">
            <div className="w-8 h-[1px] bg-amber-500/50"></div>
            <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">For Organizations</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-light leading-[1.1] tracking-tight elevated-animate-up delay-200">
              Scale Your <br/><i className="text-amber-500">Data Projects.</i>
            </h1>
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-sm elevated-animate-up delay-300">
              Access an elastic workforce of trained contributors to label, transcribe, and annotate your datasets with precision.
            </p>
          </div>
          
          <div className="flex items-center gap-6 elevated-animate-up delay-400 mt-4">
            <button className="elevated-glass-btn-gold px-8 py-4 rounded-full text-white font-medium tracking-wide text-sm flex items-center gap-3 group">
              Explore Services
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
              How it works
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel: Contributors (Teal) */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-8 md:p-20 elevated-gradient-teal bg-[#05101E]">
        <ParticleCanvas color="#0d9488" />
        <div className="elevated-aurora-teal"></div>
        
        <div className="relative z-10 max-w-md w-full flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-3 elevated-animate-up delay-100">
            <div className="w-8 h-[1px] bg-teal-500/50"></div>
            <span className="text-teal-500 text-xs font-semibold tracking-widest uppercase">For Contributors</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif font-light leading-[1.1] tracking-tight elevated-animate-up delay-200">
              Turn Free Time <br/><i className="text-teal-500">Into Real Money.</i>
            </h1>
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-sm elevated-animate-up delay-300">
              Complete simple AI training tasks from anywhere. Earn NexCoins and redeem them for premium gift vouchers.
            </p>
          </div>
          
          <div className="flex items-center gap-6 elevated-animate-up delay-400 mt-4">
            <button className="elevated-glass-btn-teal px-8 py-4 rounded-full text-white font-medium tracking-wide text-sm flex items-center gap-3 group">
              Start Earning
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-2 group">
              How it works
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Particle Canvas component inside the same file
function ParticleCanvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    // Set actual size in memory (scaled to account for extra pixel density)
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    
    // Particle configuration
    const particleCount = Math.floor((width * height) / 15000); // Responsive count
    const maxDistance = 120;
    
    // Parse the hex color to rgba for lines
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 };
    };
    
    const rgb = hexToRgb(color);
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }
    
    const particles: Particle[] = [];
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}
