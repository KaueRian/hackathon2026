"use client";

import { useState, useCallback } from "react";

// Moved outside component so it's not re-created on render (fixes react-hooks/purity)
const COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500",
];

const INSTRUCTIONS = [
  "as cores de um semáforo",
];

function randomColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }

function randomGrid() { 
  // Usa exatamente as 9 cores únicas e embaralha
  return [...COLORS].sort(() => Math.random() - 0.5);
}

export function FakeCaptcha({ onVerify }: { onVerify: (success: boolean) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>(() => randomGrid());
  const [attempts, setAttempts] = useState(0);

  const handleSelect = useCallback((index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const handleVerify = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Cores obrigatórias para passar
    const requiredColors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];
    
    // Verificar o que o usuário selecionou
    const selectedColors = selected.map(index => images[index]);
    
    // O usuário deve ter selecionado pelo menos um vermelho, um amarelo e um verde
    const hasAllRequired = requiredColors.every(c => selectedColors.includes(c));
    
    // O usuário NÃO pode ter selecionado nenhuma outra cor além das três
    const hasOnlyRequired = selectedColors.every(c => requiredColors.includes(c));
    
    // O usuário deve ter selecionado TODOS os quadrados vermelhos, amarelos e verdes do grid
    const allRequiredInGridSelected = images.every((c, index) => {
      if (requiredColors.includes(c)) return selected.includes(index);
      return true;
    });

    if (hasAllRequired && hasOnlyRequired && allRequiredInGridSelected) {
      onVerify(true);
    } else {
      alert("Tente novamente. Você não selecionou corretamente todas as cores de um semáforo (vermelho, amarelo, verde) ou selecionou cores erradas.");
      setSelected([]);
      setImages(randomGrid());
      onVerify(false);
    }
  }, [onVerify, attempts, selected, images]);

  return (
    <div className="bg-white p-3 sm:p-4 border border-gray-300 shadow-xl max-w-sm w-full mx-auto font-sans text-black">
      <div className="bg-blue-600 text-white p-3 sm:p-4 mb-4">
        <p className="text-sm">Selecione todas as imagens com</p>
        <p className="text-xl sm:text-2xl font-bold">{INSTRUCTIONS[0]}</p>
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
