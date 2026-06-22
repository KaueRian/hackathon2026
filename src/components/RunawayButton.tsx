"use client";

import { useState, useRef } from "react";

export function RunawayButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    // Generate random coordinates within a small range to jump away
    const maxJump = typeof window !== 'undefined' && window.innerWidth < 600 ? 100 : 300;
    const jumpX = (Math.random() - 0.5) * maxJump;
    const jumpY = (Math.random() - 0.5) * maxJump;
    
    setPosition({ x: jumpX, y: jumpY });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "transform 0.1s ease-in-out",
      }}
      className={`px-4 py-2 bg-green-500 text-white font-bold rounded ${className}`}
    >
      {children}
    </button>
  );
}
