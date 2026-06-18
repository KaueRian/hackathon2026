"use client";

import { useState, useCallback } from "react";

// Moved outside component so it's not re-created on render (fixes react-hooks/purity)
const COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500",
];

const INSTRUCTIONS = [
  "Selecione todos os semáforos",
  "Selecione as faixas de pedestre",
  "Clique nas montanhas ou colinas",
  "Ache o hidrante invisível",
  "Selecione os quadrados que não têm nada",
];

function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function randomInstruction() { return INSTRUCTIONS[Math.floor(Math.random() * INSTRUCTIONS.length)]; }
function randomGrid() { return Array.from({ length: 9 }, () => randomColor()); }

export function FakeCaptcha({ onVerify }: { onVerify: (success: boolean) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>(() => randomGrid());
  const [instruction, setInstruction] = useState(INSTRUCTIONS[0]);
  const [attempts, setAttempts] = useState(0);

  const handleSelect = useCallback((index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
    setImages((prev) => {
      if (Math.random() > 0.5) {
        const next = [...prev];
        next[index] = randomColor();
        return next;
      }
      return prev;
    });
  }, []);

  const handleVerify = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // After 3 failed attempts, pass automatically so demo never gets stuck
    if (newAttempts >= 3 || Math.random() > 0.7) {
      onVerify(true);
    } else {
      alert("Tente novamente. Novos desafios foram carregados.");
      setSelected([]);
      setImages(randomGrid());
      setInstruction(randomInstruction());
      onVerify(false);
    }
  }, [onVerify, attempts]);

  return (
    <div className="bg-white p-4 border border-gray-300 shadow-xl max-w-sm w-full mx-auto font-sans text-black">
      <div className="bg-blue-600 text-white p-4 mb-4 font-bold text-lg">
        {instruction}
      </div>

      <div className="grid grid-cols-3 gap-1 mb-4">
        {images.map((color, index) => (
          <div
            key={index}
            onClick={() => handleSelect(index)}
            className={`aspect-square cursor-pointer transition-all ${color} ${
              selected.includes(index) ? "scale-90 border-4 border-blue-500 opacity-50" : "hover:brightness-110"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div className="text-xs text-gray-500">
          reCAPTCHA Troll<br />
          Privacidade - Nenhuma
        </div>
        <button
          type="button"
          onClick={handleVerify}
          className="bg-blue-600 text-white px-6 py-2 font-bold hover:bg-blue-700"
        >
          VERIFICAR
        </button>
      </div>
    </div>
  );
}
