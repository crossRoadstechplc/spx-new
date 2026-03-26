"use client";

/* Advanced particle network with cursor interaction */
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  pulse: number;
}

const HUE = 221;
const SAT = 83;
const LIGHT = 58;
const ACCENT_HUE = 199;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerPulseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const COUNT = Math.min(95, Math.max(48, Math.floor(window.innerWidth / 18)));

    const LINK_DIST = 150;
    const POINTER_ZONE = 240;
    const POINTER_LINK_DIST = 160;
    const MAX_POINTER_LINES = 14;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

    const handlePointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY, active: true };
      
      // Check if cursor is near any particle
      const HOVER_RADIUS = 25; // Distance to show pointer cursor
      const nearParticle = particles.some((p) => {
        const dx = p.x - event.clientX;
        const dy = p.y - event.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < HOVER_RADIUS;
      });
      
      canvas.style.cursor = nearParticle ? "pointer" : "default";
    };

    const handlePointerLeave = () => {
      pointer = { ...pointer, active: false };
      canvas.style.cursor = "default";
    };

    const handlePointerEnter = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY, active: true };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerenter", handlePointerEnter, { passive: true });

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: Math.random() * 2.4 + 1.1,
        alpha: Math.random() * 0.38 + 0.14,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pointerPulseRef.current += 0.06;

      for (const p of particles) {
        p.pulse += 0.014;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < POINTER_ZONE && dist > 1) {
            const force = (POINTER_ZONE - dist) / POINTER_ZONE;
            // Gentle repulsion so the field "pushes" away from the cursor
            p.vx -= (dx / dist) * force * 0.085;
            p.vy -= (dy / dist) * force * 0.085;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.992;
        p.vy *= 0.992;

        if (p.x < -24) p.x = window.innerWidth + 24;
        if (p.x > window.innerWidth + 24) p.x = -24;
        if (p.y < -24) p.y = window.innerHeight + 24;
        if (p.y > window.innerHeight + 24) p.y = -24;
      }

      // Network edges (particle–particle)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const t = 1 - dist / LINK_DIST;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(${HUE}, ${SAT}%, ${LIGHT}%, ${0.11 + t * 0.16})`;
            ctx.lineWidth = 0.65 + t * 0.55;
            ctx.stroke();
          }
        }
      }

      // Pointer hub: lines from cursor to nearby particles
      if (pointer.active) {
        const sorted = particles
          .map((p) => {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            return { p, dist: Math.sqrt(dx * dx + dy * dy) };
          })
          .filter(({ dist }) => dist < POINTER_LINK_DIST && dist > 2)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, MAX_POINTER_LINES);

        for (const { p, dist } of sorted) {
          const t = 1 - dist / POINTER_LINK_DIST;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `hsla(${ACCENT_HUE}, 89%, 52%, ${0.16 + t * 0.44})`;
          ctx.lineWidth = 0.9 + t * 1.4;
          ctx.stroke();
        }

        // Cursor halo rings (readability + feedback)
        const pulse = pointerPulseRef.current;
        const r1 = 28 + Math.sin(pulse) * 5;
        const r2 = 52 + Math.sin(pulse * 0.7) * 8;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, r1, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${HUE}, ${SAT}%, ${LIGHT}%, 0.35)`;
        ctx.lineWidth = 1.25;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ACCENT_HUE}, 89%, 52%, 0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Dots on top
      for (const p of particles) {
        const wobble = Math.sin(p.pulse) * 0.35;
        let drawAlpha = p.alpha;
        let drawR = p.r + wobble;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < POINTER_LINK_DIST) {
            const boost = 1 - d / POINTER_LINK_DIST;
            drawAlpha = Math.min(0.95, drawAlpha + boost * 0.45);
            drawR += boost * 2.2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${HUE}, ${SAT}%, ${LIGHT}%, ${drawAlpha})`;
        ctx.fill();

        // Soft core highlight
        ctx.beginPath();
        ctx.arc(p.x - drawR * 0.25, p.y - drawR * 0.25, drawR * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${HUE}, ${SAT}%, ${Math.min(96, LIGHT + 10)}%, ${drawAlpha * 0.55})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full opacity-100"
      aria-hidden="true"
    />
  );
}
