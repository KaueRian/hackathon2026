"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { InvertedToggle } from "@/components/InvertedToggle";
import { SpinningCarousel } from "@/components/SpinningCarousel";

const AVATARS = ["🤡", "👻", "💩", "🦄", "🐸", "🤖", "💀", "🎃", "👽", "🦷", "🧌", "🫠"];
const COLORS = ["Roxo", "Verde", "Azul", "Vermelho", "Amarelo", "Rosa", "Laranja", "Cinza"];

export default function PreferenciasPage() {
  const router = useRouter();
  const { saveStepData } = useSession();

  const [colorSliders, setColorSliders] = useState<Record<string, number>>({});
  const [avatar, setAvatar] = useState("");
  const [receberSpam, setReceberSpam] = useState(false); // InvertedToggle: true = OFF, false = ON
  const [compartilharDados, setCompartilharDados] = useState(false);
  const [termos, setTermos] = useState(true); // starts checked, unchecks on click (troll)
  const [rating, setRating] = useState(0); // 1 = best, 5 = worst (inverted)
  const [concorda, setConcorda] = useState<"sim" | "absolutamente">("sim");
  // "checkboxes" that look like radios but allow multiple
  const [hobbies, setHobbies] = useState<string[]>([]);

  const hobbyOptions = ["Procrastinar", "Preencher formulários", "Assistir loading", "Ler termos de uso", "Clicar em 'Aceitar Cookies'"];

  const toggleHobby = (h: string) => {
    setHobbies(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);
  };

  const handleSelectAll = () => {
    // "Selecionar Todos" actually deselects all
    if (hobbies.length > 0) {
      setHobbies([]);
    } else {
      setHobbies(hobbyOptions); // only selects if nothing is selected (backwards)
    }
  };

  const handleNext = () => {
    saveStepData("preferencias", { colorSliders, avatar, receberSpam, compartilharDados, hobbies, rating });
    router.push("/confirmacao");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-center mb-2 text-[#00ff08] drop-shadow-[3px_3px_0_#ff00ea] uppercase tracking-tight">
          Suas Preferências
        </h1>
        <p className="text-center text-sm text-black mb-8 opacity-60">
          Passo 3 de 5 — Nos conte mais sobre você (vamos ignorar de qualquer forma)
        </p>

        <div className="mt-6 sm:mt-10 flex flex-col gap-6 sm:gap-10 border-4 sm:border-8 border-black bg-white p-4 sm:p-8">

          {/* Color sliders (instead of checkboxes) */}
          <div>
            <label className="block text-xl font-bold mb-4 text-black">
              Suas Cores Favoritas
            </label>
            {COLORS.map(color => (
              <div key={color} className="flex items-center gap-4 mb-3">
                <span className="w-20 text-sm font-bold">{color}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={colorSliders[color] ?? 50}
                  onChange={e => setColorSliders(prev => ({ ...prev, [color]: Number(e.target.value) }))}
                  className="flex-1 accent-red-500"
                />
                <span className="w-28 text-xs text-gray-500">
                  {(colorSliders[color] ?? 50) < 30 ? "Ama ❤️" : (colorSliders[color] ?? 50) > 70 ? "Odeia 🤢" : "Tanto faz 😐"}
                </span>
              </div>
            ))}
          </div>

          {/* Spinning carousel for avatar */}
          <div>
            <label className="block text-xl font-bold mb-3 text-black">
              Escolha seu Avatar
            </label>
            {avatar && <p className="text-4xl text-center mb-2">Selecionado: {avatar}</p>}
            <SpinningCarousel items={AVATARS} onSelect={setAvatar} />
          </div>

          {/* Inverted toggles */}
          <div className="flex flex-col gap-3">
            <label className="block text-xl font-bold mb-2 text-black">Configurações de Privacidade</label>
            <InvertedToggle
              label="Receber apenas 847 emails promocionais por dia"
              checked={receberSpam}
              onChange={setReceberSpam}
            />
            <InvertedToggle
              label="Compartilhar meus dados com inimigos"
              checked={compartilharDados}
              onChange={setCompartilharDados}
            />
          </div>

          {/* Hobbies - radio-like but checkboxes */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xl font-bold text-black">Seus Hobbies</label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs border border-gray-400 px-3 py-1 hover:bg-gray-100"
              >
                {hobbies.length > 0 ? "Deselecionar Todos" : "Selecionar Todos"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Selecione apenas uma opção</p>
            <div className="flex flex-col gap-2">
              {hobbyOptions.map(h => (
                <label key={h} className="flex items-center gap-3 cursor-pointer">
                  {/* Looks like radio, is actually checkbox */}
                  <span className={`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${hobbies.includes(h) ? "bg-black" : "bg-white"}`}>
                    {hobbies.includes(h) && <span className="w-2 h-2 bg-white rounded-full" />}
                  </span>
                  <input type="checkbox" className="sr-only" checked={hobbies.includes(h)} onChange={() => toggleHobby(h)} />
                  <span>{h}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Inverted star rating */}
          <div>
            <label className="block text-xl font-bold mb-2 text-black">
              Como você avalia este formulário?
            </label>
            <p className="text-xs text-gray-400 mb-3">1★ = Excelente | 5★ = Péssimo </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-transform hover:scale-125 ${rating >= star ? "opacity-100" : "opacity-30"}`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm mt-1 text-gray-600">
                Você avaliou: {rating === 1 ? "Excelente! (1 estrela)" : rating === 5 ? "Péssimo! (5 estrelas)" : `${rating} estrelas`}
              </p>
            )}
          </div>

          {/* Agree with no "No" option */}
          <div>
            <label className="block text-xl font-bold mb-3 text-black">
              Você concorda com tudo que dissemos até agora?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setConcorda("sim")}
                className={`px-8 py-3 border-4 font-bold text-lg ${concorda === "sim" ? "border-black bg-black text-white" : "border-gray-400 bg-white text-black"}`}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setConcorda("absolutamente")}
                className={`px-8 py-3 border-4 font-bold text-lg ${concorda === "absolutamente" ? "border-black bg-black text-white" : "border-gray-400 bg-white text-black"}`}
              >
                Absolutamente Sim
              </button>
            </div>
          </div>

          {/* Lorem ipsum terms that uncheck on click */}
          <div className="bg-gray-50 p-4 border-2 border-gray-300">
            <p className="text-xs text-gray-500 h-20 overflow-y-scroll mb-3 font-mono leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...
            </p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termos}
                onChange={() => setTermos(prev => !prev)} // unchecks on click (starts checked = troll)
                className="w-5 h-5"
              />
              <span className="text-sm font-bold">Li e aceito todos os termos acima</span>
            </label>
            {!termos && (
              <p className="text-red-600 text-xs mt-2">⚠️ Você precisa aceitar os termos para continuar. Por favor, marque novamente.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={() => router.back()}
            className="px-8 py-4 text-xl font-black uppercase border-4 border-black bg-white text-black hover:bg-black hover:text-white"
          >
            ← VOLTAR
          </button>
          <button
            onClick={handleNext}
            className="px-12 py-4 text-2xl font-black uppercase border-4 border-black bg-[#00ff08] text-black hover:bg-black hover:text-[#00ff08]"
          >
            PRÓXIMO →
          </button>
        </div>
      </div>
    </main>
  );
}
