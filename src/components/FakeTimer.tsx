"use client";

import { useState, useEffect } from "react";

export function FakeTimer() {
  const [time, setTime] = useState(10);
  const [direction, setDirection] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        // Randomly change direction or speed
        if (Math.random() > 0.9) {
          setDirection((d) => (d === -1 ? 1 : -1));
        }
        
        let nextTime = prev + direction;
        
        // Sudden panic jumps
        if (Math.random() > 0.95) {
          nextTime -= 5;
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="fixed top-2 right-2 bg-red-600 text-white font-mono text-xl p-2 border-4 border-yellow-400 animate-pulse z-50">
      TEMPO RESTANTE: {time < 0 ? `-${Math.abs(time)}` : time}s
      {time < 0 && <span className="block text-xs">JÁ PASSOU DO TEMPO!</span>}
    </div>
  );
}
