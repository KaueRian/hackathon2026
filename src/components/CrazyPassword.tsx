"use client";

import { useState } from "react";

export function CrazyPassword({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [showEmojis, setShowEmojis] = useState(false);

  // Mapeia letras para hieróglifos aleatórios ou mantém asteriscos
  const getDisplayValue = () => {
    if (!showEmojis) return "•".repeat(value.length);

    const symbols = ["𓀀", "𓀁", "𓀂", "𓀃", "𓀄", "𓀅", "𓀆", "𓀇", "𓀈", "𓀉", "𓀊", "𓀋", "𓀌", "𓀍"];
    return value.split("").map((char) => {
      // Usa o código do caractere para pegar um símbolo "consistente" mas inútil
      return symbols[char.charCodeAt(0) % symbols.length];
    }).join("");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        <input
          type="text" // Type text intentionally so it doesn't use native password masking
          className="w-full p-4 border-4 border-red-500 bg-black text-green-500 font-mono text-2xl absolute opacity-0 z-10 cursor-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite sua senha hiper segura"
        />
        {/* Fake input display */}
        <div className="w-full p-4 border-4 border-red-500 bg-black text-green-500 font-mono text-2xl min-h-[64px] flex items-center overflow-hidden">
          {value.length === 0 ? (
            <span className="text-gray-600">S3nH@_Sup3r_S3gur4</span>
          ) : (
            getDisplayValue()
          )}
        </div>
      </div>

      <button
        type="button"
        className="self-start text-xs underline text-blue-800"
        onClick={() => setShowEmojis(!showEmojis)}
      >
        {showEmojis ? "Ocultar Senha" : "Mostrar Senha "}
      </button>

      {value.length > 0 && value.length < 8 && (
        <span className="text-xs text-red-600">A senha deve ter mais que 8 caracteres, uma runa viking e o sangue de um unicórnio.</span>
      )}
    </div>
  );
}
