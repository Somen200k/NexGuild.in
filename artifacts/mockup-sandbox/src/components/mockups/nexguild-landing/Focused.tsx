import React, { useEffect, useRef } from 'react';
import './_group.css';

// Particle logic
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  width: number;
  height: number;

  constructor(width: number, height: number, color: string) {
    this.width = width;
    this.height = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
    this.radius = Math.random() * 2 + 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function ParticleCanvas({ color, particleCount = 40 }: { color: string, particleCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height, color));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Hex color assuming format like #F59E0B or #14b8a6
            const rgb = color === '#F59E0B' ? '245, 158, 11' : '20, 184, 166';
            ctx.strokeStyle = `rgba(${rgb}, ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, particleCount]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
    />
  );
}

export function Focused() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-black text-white font-sans relative selection:bg-white/20">
      
      {/* Central Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 mix-blend-plus-lighter">
        <img src="/__mockup/images/nexguild_logo_final.png" alt="NexGuild" className="h-[36px] w-auto opacity-90" />
      </div>

      {/* Central Divider */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 z-40 bg-gradient-to-b from-transparent via-white/10 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>

      {/* LEFT PANEL: Organizations (Gold) */}
      <div className="relative w-1/2 h-full flex flex-col justify-end p-16 lg:p-24 focused-gradient-gold">
        <ParticleCanvas color="#F59E0B" particleCount={50} />
        <div className="focused-aurora-gold"></div>
        
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl lg:text-[72px] font-semibold leading-[0.9] tracking-tight mb-6 focused-animate-in">
            Scale Your <br />
            <span className="text-[#F59E0B] block mt-2">Data Projects.</span>
          </h1>
          
          <div className="flex items-center gap-4 mb-8 focused-animate-in focused-delay-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F59E0B]/80 bg-[#F59E0B]/10 px-3 py-1 rounded-full border border-[#F59E0B]/20">
              For Organizations
            </span>
            <span className="text-sm text-gray-400">50+ Enterprise Clients</span>
          </div>

          <p className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-md focused-animate-in focused-delay-2">
            Access elite annotation teams on demand. High-quality data pipelines designed for scale.
          </p>

          <div className="flex flex-col gap-4 w-full max-w-sm focused-animate-in focused-delay-3">
            <button className="w-full bg-[#F59E0B] hover:bg-[#F59E0B]/90 text-black font-semibold text-lg py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              Explore Services
            </button>
            <button className="w-full bg-transparent hover:bg-white/5 text-gray-300 font-medium py-3 px-8 rounded-lg transition-all border border-white/10 hover:border-white/20">
              How it works &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Contributors (Teal) */}
      <div className="relative w-1/2 h-full flex flex-col justify-end p-16 lg:p-24 focused-gradient-teal">
        <ParticleCanvas color="#14b8a6" particleCount={50} />
        <div className="focused-aurora-teal"></div>
        
        <div className="relative z-10 max-w-xl">
          <h1 className="text-5xl lg:text-[72px] font-semibold leading-[0.9] tracking-tight mb-6 focused-animate-in">
            Turn Free Time <br />
            <span className="text-[#14b8a6] block mt-2">Into Real Money.</span>
          </h1>
          
          <div className="flex items-center gap-4 mb-8 focused-animate-in focused-delay-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#14b8a6]/80 bg-[#14b8a6]/10 px-3 py-1 rounded-full border border-[#14b8a6]/20">
              For Contributors
            </span>
            <span className="text-sm text-gray-400">2,400+ Active Earners</span>
          </div>

          <p className="text-lg lg:text-xl text-gray-300 mb-10 leading-relaxed font-light max-w-md focused-animate-in focused-delay-2">
            Complete simple data tasks anywhere. Get paid in NexCoins and redeem for gift vouchers.
          </p>

          <div className="flex flex-col gap-4 w-full max-w-sm focused-animate-in focused-delay-3">
            <button className="w-full bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-black font-semibold text-lg py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_30px_rgba(20,184,166,0.2)]">
              Start Earning
            </button>
            <button className="w-full bg-transparent hover:bg-white/5 text-gray-300 font-medium py-3 px-8 rounded-lg transition-all border border-white/10 hover:border-white/20">
              How it works &rarr;
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
