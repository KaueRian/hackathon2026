"use client";

import { useEffect, useState } from "react";

export function Confetti() {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate 50 error icons
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // random left percentage
      delay: Math.random() * 5, // random delay
      duration: 3 + Math.random() * 4, // random fall duration
    }));
    setParticles(newParticles);
  }, []);

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
