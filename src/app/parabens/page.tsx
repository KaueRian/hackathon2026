"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { Confetti } from "@/components/Confetti";
import { supabase } from "@/lib/supabase";
import { useTimer } from "@/hooks/useTimer";

export default function ParabensPage() {
  const router = useRouter();
  const { clearSession } = useSession();
  const { formattedTime, elapsed } = useTimer();
  const [nickname, setNickname] = useState("");
  const [saved, setSaved] = useState(false);
  const [ranking, setRanking] = useState<{ nickname: string; elapsed_seconds: number }[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchRanking = async () => {
    const { data } = await supabase
      .from("sessions")
      .select("nickname, duration_seconds")
      .order("duration_seconds", { ascending: true })
      .limit(10);
    if (data) setRanking(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRanking();
  }, []);

  const handleSave = async () => {
    if (!nickname.trim()) return;
    setSaving(true);

    // elapsed from useTimer is already in SECONDS — do NOT divide by 1000 again
    const elapsedSeconds = elapsed;

    const { error } = await supabase.from("sessions").insert({
      nickname: nickname.trim(),
      duration_seconds: elapsedSeconds,
    });

    if (error) {
      console.error("Erro ao salvar no ranking:", error.message);
    }

    setSaved(true);
    setSaving(false);
    await fetchRanking();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans relative overflow-hidden">
      <Confetti />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="border-8 border-[#00ff08] bg-black text-white p-10 text-center mb-8">
          <h1 className="text-6xl font-black mb-4 text-[#00ff08] drop-shadow-[5px_5px_0_#ff0000] animate-bounce uppercase">
            🎉 PARABÉNS! 🎉
          </h1>
          <p className="text-2xl mb-6 text-yellow-300">
            Você chegou ao final da pior experiência de usuário!
          </p>
          <div className="bg-yellow-400 text-black p-4 border-4 border-white font-mono text-4xl">
            ⏱️ Seu tempo: <strong>{formattedTime}</strong>
          </div>
        </div>

        {/* Save to ranking */}
        {!saved ? (
          <div className="bg-white border-8 border-black p-8 mb-8">
            <h2 className="text-2xl font-black mb-4 text-black">Entre para o Ranking!</h2>
            <p className="text-sm text-gray-500 mb-4">
              Escolha um nickname para imortalizarmos sua conquista (e sua dor):
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                maxLength={20}
                placeholder="Seu nickname..."
                className="flex-1 p-4 text-lg border-4 border-black text-black bg-white font-bold outline-none"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
              />
              <button
                onClick={handleSave}
                disabled={saving || !nickname.trim()}
                className="px-8 py-4 text-xl font-black bg-[#00ff08] text-black border-4 border-black hover:bg-black hover:text-[#00ff08] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "..." : "SALVAR"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#00ff08] border-8 border-black p-6 mb-8 text-center">
            <p className="text-2xl font-black text-black">✅ Salvo no ranking!</p>
          </div>
        )}

        {/* Ranking table - names scrambled */}
        <div className="bg-white border-8 border-black p-6 mb-8">
          <h2 className="text-2xl font-black mb-4 text-black text-center">
            🏆 Hall da Dor — Ranking Global
          </h2>
          {ranking.length === 0 ? (
            <p className="text-center text-gray-500">Seja o primeiro corajoso (ou masoquista)!</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="py-2 text-left">#</th>
                  <th className="py-2 text-left">Guerreiro</th>
                  <th className="py-2 text-right">Tempo</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => {
                  // Scramble the nickname letters (UX violation: wrong data display)
                  const scrambled = r.nickname.split("").sort(() => Math.random() - 0.5).join("");
                  return (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="py-2 font-bold">{i + 1}</td>
                      <td className="py-2 font-mono">{scrambled}</td>
                      <td className="py-2 text-right font-mono">{formatTime(r.duration_seconds)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => { clearSession(); router.push("/"); }}
            className="w-full py-4 text-xl font-black uppercase border-4 border-black bg-yellow-400 text-black hover:bg-black hover:text-yellow-400"
          >
            🔄 Tentar Novamente (você é masoquista)
          </button>
          <a
            href="/corrigido"
            className="block w-full py-4 text-xl font-black uppercase border-4 border-black bg-blue-500 text-white text-center hover:bg-black"
          >
            ✨ Ver Versão com UX Correta
          </a>
        </div>
      </div>
    </main>
  );
}
