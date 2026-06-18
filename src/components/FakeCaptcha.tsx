"use client";

import { useState, useEffect } from "react";

export function FakeCaptcha({
  onVerify,
}: {
  onVerify: (success: boolean) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("Selecione todos os semáforos");

  // Arrays of colors just to simulate changing images
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500"
  ];

  const instructions = [
    "Selecione todos os semáforos",
    "Selecione as faixas de pedestre",
    "Clique nas montanhas ou colinas",
    "Ache o hidrante invisível",
    "Selecione os quadrados que não têm nada"
  ];

  useEffect(() => {
    // Generate random grid
    const newImages = Array.from({ length: 9 }).map(() => colors[Math.floor(Math.random() * colors.length)]);
    setImages(newImages);
  }, []);

  const handleSelect = (index: number) => {
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else {
      setSelected([...selected, index]);
    }

    // Change images randomly on click to confuse user
    if (Math.random() > 0.5) {
      const newImages = [...images];
      newImages[index] = colors[Math.floor(Math.random() * colors.length)];
      setImages(newImages);
    }
  };

  const handleVerify = () => {
    // It always fails the first 2 times
    if (Math.random() > 0.3) {
      alert("Tente novamente. Novos desafios foram carregados.");
      setSelected([]);
      setImages(Array.from({ length: 9 }).map(() => colors[Math.floor(Math.random() * colors.length)]));
      setInstruction(instructions[Math.floor(Math.random() * instructions.length)]);
      onVerify(false);
    } else {
      onVerify(true);
    }
  };

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
          reCAPTCHA Troll<br/>
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
