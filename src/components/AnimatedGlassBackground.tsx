import React, { useEffect, useRef, useState } from 'react';

export function AnimatedGlassBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const lerpScrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY || window.pageYOffset || 0;
    };

    // Smooth lerp animation loop for momentum-smoothed parallax
    const smoothLoop = () => {
      // Linear interpolation factor (0.08 for buttery soft inertia)
      const diff = targetScrollYRef.current - lerpScrollYRef.current;
      lerpScrollYRef.current += diff * 0.08;

      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const progress = Math.min(1, Math.max(0, lerpScrollYRef.current / maxScroll));

      setScrollY(lerpScrollYRef.current);
      setScrollProgress(progress);

      animFrameIdRef.current = requestAnimationFrame(smoothLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animFrameIdRef.current = requestAnimationFrame(smoothLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Parallax translation values based on smoothed scroll
  const blob1Y = scrollY * 0.25;
  const blob1X = Math.sin(scrollY * 0.002) * 40;
  
  const blob2Y = -scrollY * 0.18;
  const blob2X = Math.cos(scrollY * 0.002) * 35;
  
  const blob3Y = scrollY * 0.38;
  const blob3Rotate = scrollY * 0.04;
  
  const blob4Y = -scrollY * 0.28;
  const blob5Y = scrollY * 0.15;
  const blob6Y = -scrollY * 0.22;

  // Wave phase shift
  const waveShift = (scrollY * 0.12) % 360;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* 1. Dynamic Scroll-Responsive Base Gradient */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at ${50 + Math.sin(scrollY * 0.001) * 20}% ${30 + scrollProgress * 40}%, #f0f7ff 0%, #e0f2fe 35%, #dbeafe 70%, #cfe8ff 100%)`,
          opacity: 0.94,
        }}
      />

      {/* 2. Top Edge Prismatic Glass Refraction Rim */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400/0 via-sky-400/50 to-blue-500/0 blur-[1px] opacity-70"
        style={{
          transform: `scaleX(${0.3 + scrollProgress * 0.7})`,
          transformOrigin: 'left',
          transition: 'transform 0.1s linear',
        }}
      />

      {/* 3. Liquid Glass Orb 1 - Top Left Sky Blue (Parallax Down + Oscillate) */}
      <div
        className="absolute -top-28 -left-28 w-96 h-96 sm:w-[560px] sm:h-[560px] rounded-full mix-blend-multiply filter blur-3xl opacity-55 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.8) 0%, rgba(186, 230, 253, 0.45) 55%, rgba(255, 255, 255, 0) 80%)',
          transform: `translate3d(${blob1X}px, ${blob1Y}px, 0) scale(${1 + scrollProgress * 0.15})`,
          animation: 'float-blob-1 16s ease-in-out infinite',
        }}
      />

      {/* 4. Liquid Glass Orb 2 - Top Right Soft Cyan / Light Blue (Parallax Up + Sway) */}
      <div
        className="absolute top-1/6 -right-24 w-80 h-80 sm:w-[580px] sm:h-[580px] rounded-full mix-blend-multiply filter blur-3xl opacity-50 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(186, 230, 253, 0.85) 0%, rgba(199, 210, 254, 0.4) 50%, rgba(255, 255, 255, 0) 75%)',
          transform: `translate3d(${blob2X}px, ${blob2Y}px, 0) scale(${1.05 - scrollProgress * 0.1})`,
          animation: 'float-blob-2 20s ease-in-out infinite',
          animationDelay: '-4s',
        }}
      />

      {/* 5. Liquid Glass Orb 3 - Midfield Royal Azure Focus (Parallax Down + Rotate) */}
      <div
        className="absolute top-1/2 -left-36 w-88 h-88 sm:w-[520px] sm:h-[520px] rounded-full mix-blend-multiply filter blur-3xl opacity-45 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(125, 211, 252, 0.75) 0%, rgba(191, 219, 254, 0.4) 60%, rgba(255, 255, 255, 0) 80%)',
          transform: `translate3d(0, ${blob3Y}px, 0) rotate(${blob3Rotate}deg)`,
          animation: 'float-blob-1 22s ease-in-out infinite reverse',
          animationDelay: '-7s',
        }}
      />

      {/* 6. Liquid Glass Orb 4 - Bottom Right Deep Sky Blue Accent (Parallax Inverted) */}
      <div
        className="absolute -bottom-28 right-1/10 w-96 h-96 sm:w-[620px] sm:h-[620px] rounded-full mix-blend-multiply filter blur-3xl opacity-50 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.5) 0%, rgba(147, 197, 253, 0.45) 50%, rgba(255, 255, 255, 0) 75%)',
          transform: `translate3d(0, ${blob4Y}px, 0) scale(${0.95 + scrollProgress * 0.2})`,
          animation: 'float-blob-2 18s ease-in-out infinite',
          animationDelay: '-10s',
        }}
      />

      {/* 7. Liquid Glass Orb 5 - Bottom Left Soft Azure Glow */}
      <div
        className="absolute bottom-16 -left-16 w-80 h-80 sm:w-[460px] sm:h-[460px] rounded-full mix-blend-multiply filter blur-3xl opacity-40 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(186, 230, 253, 0.75) 0%, rgba(219, 234, 254, 0.4) 60%, rgba(255, 255, 255, 0) 80%)',
          transform: `translate3d(0, ${blob5Y}px, 0)`,
          animation: 'float-blob-3 24s linear infinite',
        }}
      />

      {/* 8. Liquid Glass Orb 6 - Center Floating Accent (Denser Parallax Float) */}
      <div
        className="absolute top-1/3 right-1/4 w-72 h-72 sm:w-[400px] sm:h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-35 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(165, 243, 252, 0.65) 0%, rgba(199, 210, 254, 0.35) 60%, rgba(255, 255, 255, 0) 85%)',
          transform: `translate3d(${Math.sin(scrollY * 0.003) * 30}px, ${blob6Y}px, 0)`,
          animation: 'float-blob-1 25s ease-in-out infinite',
          animationDelay: '-14s',
        }}
      />

      {/* 9. Flowing Caustic Light Refraction Waves (Smooth SVG Curves undulating with scroll) */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-25 pointer-events-none mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="caustic-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="caustic-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 */}
        <path
          d={`M 0,${350 + Math.sin((scrollY * 0.004)) * 60} C ${400 + Math.cos(scrollY * 0.003) * 50},${220 + scrollProgress * 100} ${900 - Math.sin(scrollY * 0.003) * 50},${480 - scrollProgress * 80} 1440,${380 + Math.sin(scrollY * 0.004) * 40} L 1440,900 L 0,900 Z`}
          fill="url(#caustic-grad-1)"
          className="transition-all duration-300 ease-out"
        />

        {/* Wave 2 */}
        <path
          d={`M 0,${550 - Math.sin(scrollY * 0.0035) * 50} C ${500 - Math.cos(scrollY * 0.002) * 60},${680 - scrollProgress * 120} ${1000 + Math.sin(scrollY * 0.002) * 60},${420 + scrollProgress * 90} 1440,${580 - Math.cos(scrollY * 0.0035) * 40} L 1440,900 L 0,900 Z`}
          fill="url(#caustic-grad-2)"
          className="transition-all duration-300 ease-out"
        />
      </svg>

      {/* 10. Floating Glass Light Prisms / Bokeh Particles with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Sparkle 1 */}
        <div 
          className="absolute top-1/5 left-1/6 w-3 h-3 rounded-full bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.9)] backdrop-blur-xs will-change-transform animate-pulse"
          style={{
            transform: `translate3d(${Math.sin(scrollY * 0.004) * 20}px, ${-scrollY * 0.4}px, 0)`,
          }}
        />

        {/* Sparkle 2 */}
        <div 
          className="absolute top-2/5 right-1/5 w-4 h-4 rounded-full bg-sky-200/60 shadow-[0_0_16px_rgba(186,230,253,0.9)] backdrop-blur-xs will-change-transform animate-pulse"
          style={{
            transform: `translate3d(${Math.cos(scrollY * 0.003) * 25}px, ${-scrollY * 0.55}px, 0)`,
            animationDelay: '1s',
          }}
        />

        {/* Sparkle 3 */}
        <div 
          className="absolute top-3/5 left-1/3 w-2.5 h-2.5 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.95)] backdrop-blur-xs will-change-transform animate-pulse"
          style={{
            transform: `translate3d(${Math.sin(scrollY * 0.005) * 15}px, ${-scrollY * 0.3}px, 0)`,
            animationDelay: '1.8s',
          }}
        />

        {/* Sparkle 4 */}
        <div 
          className="absolute top-4/5 right-1/3 w-3.5 h-3.5 rounded-full bg-sky-300/50 shadow-[0_0_14px_rgba(147,197,253,0.85)] backdrop-blur-xs will-change-transform animate-pulse"
          style={{
            transform: `translate3d(${Math.cos(scrollY * 0.004) * 20}px, ${-scrollY * 0.45}px, 0)`,
            animationDelay: '2.5s',
          }}
        />
      </div>

      {/* 11. Subtle Glass Micro Mesh Grid Texture for authentic refraction */}
      <div 
        className="absolute inset-0 opacity-[0.032] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(30, 58, 138, 0.45) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
          transform: `translate3d(0, ${scrollY * 0.05}px, 0)`,
        }}
      />
    </div>
  );
}
