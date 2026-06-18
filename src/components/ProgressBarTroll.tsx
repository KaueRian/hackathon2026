"use client";

import { useState, useEffect } from "react";

export function ProgressBarTroll() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          // It almost finishes then goes back to 50
          return 50;
        }
        // Slowly creep up, but occasionally drop
        if (Math.random() > 0.8) {
          return Math.max(0, prev - 15);
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1 font-mono uppercase font-bold text-red-600">
        <span>Avaliando sua paciência...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-300 h-8 border-4 border-black relative overflow-hidden">
        <div 
          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Fake text that's hard to read */}
        <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference font-bold tracking-widest text-sm opacity-50">
          QUASE LÁ... MENTIRA
        </span>
      </div>
    </div>
  );
}
