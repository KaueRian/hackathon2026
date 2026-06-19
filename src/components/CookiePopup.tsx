"use client";

import { useState } from "react";
import { RunawayButton } from "./RunawayButton";

export function CookiePopup() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80vh] bg-[var(--primary)] bg-opacity-95 z-[9999] p-4 sm:p-8 flex flex-col justify-center items-center shadow-[0_-10px_50px_rgba(0,0,0,0.5)] border-t-8 border-red-500 overflow-y-auto">
      <h1 className="text-4xl sm:text-6xl font-black mb-6 sm:mb-8 text-black text-center uppercase tracking-tighter">
        Aviso de Privacidade Absolutamente Necessário
      </h1>
      
      <p className="text-base sm:text-xl mb-8 sm:mb-12 text-black max-w-3xl text-justify font-sans leading-relaxed">
        Ao clicar em &quot;Aceitar&quot;, você concorda em nos vender sua alma, sua casa, e permitir que usemos todos os seus dados para treinar modelos de linguagem que vão eventualmente dominar o mundo. Se você tentar recusar, as coisas vão ficar muito complicadas. Além disso, nós usamos cookies para garantir que você não tenha privacidade.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center w-full justify-center">
        <button 
          className="text-xs text-gray-700 opacity-50 hover:opacity-10 underline cursor-not-allowed"
          onClick={() => {
            alert("A recusa não é uma opção válida no momento. Tente novamente em 2030.");
          }}
        >
          Recusar e perder o acesso
        </button>

        <RunawayButton 
          className="bg-black text-[#00ff08] text-2xl sm:text-4xl px-8 sm:px-12 py-4 sm:py-6 border-4 border-[#00ff08] shadow-[0_0_10px_#00ff08] sm:shadow-[0_0_20px_#00ff08]"
          onClick={() => setVisible(false)}
        >
          ACEITAR TUDO
        </RunawayButton>
      </div>

      <p className="mt-12 text-[8px] text-gray-800">
        Ao rolar a página, você também está aceitando. Ao respirar, você está aceitando. Ao ler este texto minúsculo, você aceitou duas vezes.
      </p>
    </div>
  );
}
