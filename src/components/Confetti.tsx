"use client";

import { useMemo } from "react";

type Particle = { id: number; left: number; delay: number; duration: number };

// Generate particles once at module level so they're stable across renders
function generateParticles(): Particle[] {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
  }));
}

export function Confetti() {
  // useMemo with no deps = stable across re-renders, no state needed
  const particles = useMemo(() => generateParticles(), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-50px] text-4xl animate-[fall_linear_infinite]"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          ❌
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}} />
    </div>
  );
}
