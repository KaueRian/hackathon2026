"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type SessionRecord = {
  nickname: string;
  duration_seconds: number;
  created_at: string;
};

export default function RankingClient() {
  const [ranking, setRanking] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async () => {
    const { data } = await supabase
      .from("sessions")
      .select("nickname, duration_seconds, created_at")
      .order("duration_seconds", { ascending: true })
      .limit(50);
      
    if (data) {
      setRanking(data as SessionRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRanking();
    
    // Auto refresh every 10 seconds (useful for presentation)
    const interval = setInterval(fetchRanking, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 border-b-4 border-[#00ff08] pb-6 gap-6">
          <h1 className="text-4xl sm:text-6xl font-black text-[#00ff08] uppercase tracking-widest drop-shadow-[0_0_10px_#00ff08]">
            Leaderboard Oficial
          </h1>
          <Link 
            href="/"
            className="px-6 py-3 border-2 border-white font-bold hover:bg-white hover:text-black transition-colors"
          >
            ← Voltar pro Início
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-2xl animate-pulse text-[#00ff08]">
            Carregando o sofrimento alheio...
          </div>
        ) : ranking.length === 0 ? (
          <div className="text-center bg-gray-900 p-12 border-2 border-gray-800">
            <h2 className="text-3xl text-gray-500 font-bold mb-4">Nenhum guerreiro sobreviveu ainda.</h2>
            <p className="text-gray-600">O ranking está vazio. Seja a primeira vítima!</p>
          </div>
        ) : (
          <div className="bg-gray-900 border-4 border-[#00ff08] overflow-hidden shadow-[0_0_30px_rgba(0,255,8,0.2)]">
            <table className="w-full text-left">
              <thead className="bg-[#00ff08] text-black text-lg sm:text-xl">
                <tr>
                  <th className="py-4 px-4 sm:px-6 font-black uppercase">Rank</th>
                  <th className="py-4 px-4 sm:px-6 font-black uppercase">Sobrevivente</th>
                  <th className="py-4 px-4 sm:px-6 font-black uppercase text-right">Tempo de Sofrimento</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((r, i) => (
                  <tr 
                    key={i} 
                    className={`border-b border-gray-800 transition-colors hover:bg-gray-800 ${i === 0 ? "bg-yellow-900/40 text-yellow-400 font-bold" : i === 1 ? "bg-gray-800/40 text-gray-300" : i === 2 ? "bg-orange-900/30 text-orange-400" : ""}`}
                  >
                    <td className="py-4 px-6 text-2xl font-mono">
                      #{i + 1}
                      {i === 0 && " 👑"}
                      {i === 1 && " 🥈"}
                      {i === 2 && " 🥉"}
                    </td>
                    <td className="py-4 px-6 text-xl">{r.nickname}</td>
                    <td className="py-4 px-6 text-right text-2xl font-mono tracking-wider">
                      {formatTime(r.duration_seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
