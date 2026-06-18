"use client";

import Link from "next/link";
import { CookiePopup } from "@/components/CookiePopup";
import { FakeTimer } from "@/components/FakeTimer";
import { useSession } from "@/lib/sessionStore";
import { RunawayButton } from "@/components/RunawayButton";

export default function LandingPage() {
  const { startSession } = useSession();

  // Reset any session if we land on the landing page again (or maybe not? The PRD says timer starts when clicking the real link)
  // We'll just provide a way to start the session on the real link click.

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-[var(--background)] overflow-hidden relative">
      <CookiePopup />
      <FakeTimer />

      {/* Chaos background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>

      <div className="z-10 flex flex-col items-center text-center max-w-4xl border-8 border-dashed border-red-600 p-12 bg-yellow-200 troll-shake">
        <h1 className="text-7xl font-black mb-6 text-[#ff00ea] drop-shadow-[5px_5px_0_#00ff08] tracking-tighter uppercase">
          Bem-vindo ao <br/> FormHell
        </h1>
        
        <p className="text-2xl mb-12 font-bold text-blue-800">
          Você tem absoluta certeza de que quer continuar? <br/>
          Sua paciência será testada.
        </p>

        {/* The giant "NO" button that does nothing but run away */}
        <RunawayButton className="text-6xl px-16 py-8 bg-red-600 hover:bg-red-700 text-white border-[10px] border-black uppercase font-black tracking-widest shadow-[20px_20px_0_#000]">
          NÃO, OBRIGADO ME TIRE DAQUI!
        </RunawayButton>

        {/* The real link that is almost invisible */}
        <div className="mt-32">
          <Link 
            href="/dados-pessoais" 
            onClick={() => startSession()}
            className="text-[10px] text-yellow-300 hover:text-white opacity-40 select-none"
          >
            sim, eu quero sofrer (clique aqui)
          </Link>
        </div>
      </div>
      
      {/* Distracting marquee */}
      <div className="fixed bottom-0 w-full bg-black text-[#00ff08] font-mono text-xl whitespace-nowrap overflow-hidden py-2 z-40 border-t-4 border-red-600">
        <div className="inline-block animate-[spin_20s_linear_infinite]">
          ⚠ ATENÇÃO: NOSSOS TERMOS DE SERVIÇO FORAM ATUALIZADOS HÁ 3 SEGUNDOS. VOCÊ DEVE LER TUDO NOVAMENTE. ⚠ SEUS DADOS ESTÃO SENDO VENDIDOS NESTE EXATO MOMENTO. ⚠ O TEMPO ESTÁ ACABANDO! ⚠
        </div>
      </div>
    </main>
  );
}
