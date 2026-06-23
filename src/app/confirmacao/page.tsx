"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { FakeCaptcha } from "@/components/FakeCaptcha";
import { RunawayButton } from "@/components/RunawayButton";
import { ProgressBarTroll } from "@/components/ProgressBarTroll";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { session } = useSession();
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [aceito, setAceito] = useState(true); // pre-checked troll
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  const dadosPessoais = (session as Record<string, unknown>)?.dadosPessoais as Record<string, string> | undefined;

  const handleConfirm = () => {
    if (!captchaPassed) {
      setCaptchaError("Por favor, complete o CAPTCHA primeiro.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleRealConfirm = () => {
    // "Cancelar" button actually confirms (troll)
    setShowConfirmDialog(false);
    setLoading(true);
    // Fake loading for 6s then navigate
    setTimeout(() => {
      router.push("/parabens");
    }, 6000);
  };

  const handleCancelConfirm = () => {
    // "OK" button actually cancels
    setShowConfirmDialog(false);
  };

  const handleCaptchaResult = (success: boolean) => {
    if (success) {
      setCaptchaPassed(true);
      setCaptchaError("");
    } else {
      setCaptchaError("❌ CAPTCHA INCORRETO! TODOS OS CAMPOS FORAM RESETADOS!");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-center mb-2 text-red-600 drop-shadow-[3px_3px_0_#000] uppercase tracking-tight">
          Confirmação Final
        </h1>
        <p className="text-center text-sm text-black mb-8 opacity-60">
          Passo 4 de 5 — Só mais um segundo
        </p>

        <div className="mt-6 sm:mt-10 flex flex-col gap-6 sm:gap-10 border-4 sm:border-8 border-black bg-white p-4 sm:p-8 text-black">

          {/* Summary with wrong data */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-black border-b-4 border-black pb-2">Resumo do seu Cadastro</h2>
            <div className="flex flex-col gap-2 text-sm font-mono bg-gray-50 p-4 border-2 border-gray-300">
              {/* Intentionally swap nome/email */}
              <div><span className="font-bold">Seu nome:</span> {dadosPessoais?.email || "não informado"}</div>
              <div><span className="font-bold">Seu e-mail:</span> {dadosPessoais?.nome || "não informado"}</div>
              <div><span className="font-bold">Data de Nascimento:</span> {dadosPessoais?.dataNasc ? `${dadosPessoais.dataNasc} (não verificado)` : "não informado"}</div>
              <div><span className="font-bold">Gênero:</span> {dadosPessoais?.genero || "não informado"}</div>
              <div><span className="font-bold">Senha:</span> ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••</div>
              <div><span className="font-bold">Status:</span> <span className="text-red-600 animate-pulse">⚠️ PENDENTE DE VERIFICAÇÃO EM MARTE</span></div>
            </div>
          </div>

          {/* Pre-checked spam consent */}
          <label className="flex items-start gap-3 cursor-pointer p-4 bg-yellow-50 border-2 border-yellow-400">
            <input
              type="checkbox"
              checked={aceito}
              onChange={() => setAceito(prev => !prev)}
              className="mt-1 w-5 h-5 flex-shrink-0"
            />
            <span className="text-sm">
              <strong>Aceito receber 847 e-mails por dia</strong>, incluindo promoções, newsletters, spam artesanal, correntes de oração, propostas de negócio de príncipes nigerianos, e atualizações em tempo real sobre o clima de Plutão.
              <span className="block text-xs text-gray-400 mt-1">(Já veio marcado para facilitar sua vida)</span>
            </span>
          </label>

          {/* CAPTCHA */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-black">Verificação de Segurança</h2>
            {captchaPassed ? (
              <div className="p-4 bg-green-100 border-4 border-green-500 text-center">
                <p className="text-2xl">✅ CAPTCHA verificado!</p>
                <p className="text-xs text-gray-500">(Por esta sessão. Se você piscar terá que fazer de novo.)</p>
              </div>
            ) : (
              <FakeCaptcha onVerify={handleCaptchaResult} />
            )}
            {captchaError && (
              <div className="mt-3 p-4 bg-red-100 border-4 border-red-500">
                <p className="font-bold text-red-800">{captchaError}</p>
              </div>
            )}
          </div>

          {/* Loading bar while processing */}
          {loading && (
            <div>
              <p className="text-center font-bold mb-3 animate-pulse text-red-600">
                Processando seu cadastro... Por favor, não feche o navegador, não respire, não pense.
              </p>
              <ProgressBarTroll />
            </div>
          )}
        </div>

        {!loading && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={() => router.back()}
              className="px-8 py-4 text-xl font-black uppercase border-4 border-black bg-white text-black hover:bg-black hover:text-white"
            >
              ← VOLTAR
            </button>

            {/* Runaway confirm button */}
            <div className="relative">
              <RunawayButton
                onClick={handleConfirm}
                className="px-12 py-4 text-2xl font-black uppercase border-4 border-black bg-red-600 text-white hover:bg-black"
              >
                CONFIRMAR CADASTRO 🎯
              </RunawayButton>
            </div>
          </div>
        )}

        {/* Confirm dialog with inverted buttons */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-[999] flex items-center justify-center">
            <div className="bg-white p-4 sm:p-8 border-4 sm:border-8 border-red-500 max-w-md w-full mx-4">
              <h2 className="text-xl sm:text-3xl font-black text-red-600 mb-4 uppercase">Tem certeza?</h2>
              <p className="mb-6 text-black">Esta ação é irreversível, permanente, final, definitiva, sem volta, e algumas outras coisas igualmente assustadoras.</p>
              <div className="flex gap-4 justify-end">
                {/* OK = cancels */}
                <button
                  onClick={handleCancelConfirm}
                  className="px-8 py-3 bg-green-500 text-white font-black text-xl border-4 border-black"
                >
                  OK
                </button>
                {/* Cancelar = confirms */}
                <button
                  onClick={handleRealConfirm}
                  className="px-8 py-3 bg-red-500 text-white font-black text-xl border-4 border-black"
                >
                  Cancelar
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                * &quot;OK&quot; não confirma. &quot;Cancelar&quot; confirma. Sim, de propósito.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
