"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { CrazyPassword } from "@/components/CrazyPassword";

const SECURITY_QUESTIONS = [
  "Qual o nome do seu peixe que você nunca teve?",
  "Qual foi a primeira palavra que você nunca disse?",
  "Qual o apelido do seu avô em uma vida passada?",
  "Qual seria o nome do seu dinossauro de estimação?",
  "Em qual cidade você viveria se fosse um cogumelo?",
  "Qual era a marca do computador da sua bisavó?",
  "Qual o nome do seu personagem favorito de um livro que você ainda não leu?",
  "Qual era o time favorito da sua calculadora?",
];

// Check if sum of digits is prime
function digitSumIsPrime(s: string): boolean {
  const digits = s.split("").filter(c => /\d/.test(c));
  const sum = digits.reduce((acc, d) => acc + parseInt(d), 0);
  if (sum < 2) return false;
  for (let i = 2; i <= Math.sqrt(sum); i++) {
    if (sum % i === 0) return false;
  }
  return true;
}

// Check for consecutive alphabet letters
function hasConsecutiveLetters(s: string): boolean {
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length - 1; i++) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    if (c2 - c1 === 1 && c1 >= 97 && c1 <= 122) return true;
  }
  return false;
}

function countUppercase(s: string): number {
  return (s.match(/[A-Z]/g) || []).length;
}

function hasEmoji(s: string): boolean {
  return s.includes("🔥");
}

function hasRomanNumeral(s: string): boolean {
  return /[IVXLCDM]/.test(s);
}

export default function SenhaPage() {
  const router = useRouter();
  const { saveStepData } = useSession();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [pergunta, setPergunta] = useState(SECURITY_QUESTIONS[0]);
  const [resposta, setResposta] = useState("");
  const [comentario, setComentario] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Requirements revealed progressively
  const requirements = [
    { label: "✅ Mínimo 12 caracteres", met: Array.from(senha).length >= 12 },
    { label: "🔥 Deve conter o emoji 🔥", met: hasEmoji(senha) },
    { label: "📜 Deve conter numeral romano (I, V, X, L, C, D ou M)", met: hasRomanNumeral(senha) },
    { label: "🔤 Não pode conter letras consecutivas (ex: 'ab', 'cd')", met: !hasConsecutiveLetters(senha) && senha.length > 0 },
    { label: "🔡 Exatamente 2 letras maiúsculas", met: countUppercase(senha) === 2 },
    { label: "🔢 A soma dos dígitos deve ser número primo", met: digitSumIsPrime(senha) },
  ];

  // How many requirements to show (reveals progressively as user types)
  const visibleReqs = Math.min(Math.floor(senha.length / 2) + 1, requirements.length);



  // Password field moves every 15 seconds
  const [passwordOffset, setPasswordOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPasswordOffset(prev => prev === 0 ? 120 : 0);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const allMet = requirements.every(r => r.met);
    if (!allMet) {
      setErrorMsg("Sua senha não atende todos os requisitos (verifique a lista acima).");
      return false;
    }

    // Confirmation must match exactly
    if (confirmacao !== senha) {
      setErrorMsg("A confirmação de senha não confere com a senha digitada.");
      return false;
    }

    if (!resposta.trim()) {
      setErrorMsg("Responda a pergunta de segurança.");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    saveStepData("senha", { senha, pergunta, resposta });
    router.push("/preferencias");
  };

  // Password strength is always "Fraca"
  const strengthLabel = "🔴 FRACA (sempre)";

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-center mb-2 text-black drop-shadow-[2px_2px_0_#ff00ea] uppercase tracking-tight">
          Senha & Segurança
        </h1>
        <p className="text-center text-sm text-black mb-8 opacity-60">
          Passo 2 de 5 — Crie uma senha que você nunca vai lembrar
        </p>

        <div className="mt-10 flex flex-col gap-6 sm:gap-10 border-4 sm:border-8 border-black bg-white p-4 sm:p-8 relative overflow-hidden">

          {/* Moving password field */}
          <div
            style={{ marginTop: passwordOffset, transition: "margin-top 1s ease-in-out" }}
          >
            <label className="block text-xl font-bold mb-1 text-black">
              Senha *
            </label>
            <p className="text-xs text-red-500 mb-2 animate-pulse">
              ⚠️ Campo de senha se moverá em {15}s por questões de segurança
            </p>
            <CrazyPassword value={senha} onChange={(v) => { setSenha(v); }} />

            {/* Strength bar — always weak */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Força da Senha:</span>
                <span className="font-bold text-red-600">{strengthLabel}</span>
              </div>
              <div className="h-3 bg-gray-200 w-full border border-gray-400">
                <div className="h-full bg-red-500 w-[5%] transition-none" />
              </div>
            </div>
          </div>

          {/* Progressive requirements */}
          {senha.length > 0 && (
            <div className="bg-yellow-50 border-4 border-yellow-400 p-4">
              <p className="font-bold text-black mb-2 text-sm">Requisitos de Senha (revelados progressivamente):</p>
              <ul className="flex flex-col gap-1">
                {requirements.slice(0, visibleReqs).map((req, i) => (
                  <li key={i} className={`text-sm font-mono ${req.met ? "text-green-700 line-through opacity-60" : "text-red-700"}`}>
                    {req.met ? "✓" : "✗"} {req.label}
                  </li>
                ))}
                {visibleReqs < requirements.length && (
                  <li className="text-xs text-gray-400 italic">... continue digitando para ver mais requisitos</li>
                )}
              </ul>
            </div>
          )}

          {/* Confirmation */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Confirme a Senha *
            </label>
            <p className="text-xs text-gray-400 mb-2">Digite a mesma senha novamente para confirmar</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="Sua senha maravilhosa..."
              className="w-full p-4 text-lg border-4 border-blue-500 bg-black text-green-400 font-mono focus:border-red-500 outline-none tracking-widest"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
          </div>

          {/* Absurd security question */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Pergunta de Segurança *
            </label>
            <select
              className="w-full p-3 text-sm border-4 border-blue-500 bg-white text-black mb-3 outline-none"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
            >
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <input
              type="text"
              autoComplete="off"
              placeholder="Sua resposta secreta..."
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 outline-none"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
          </div>

          {/* Feedback/Comment field (hack to reverse text) */}
          <div className="border-t-4 border-dashed border-gray-300 pt-6">
            <label className="block text-xl font-bold mb-1 text-black">
              Deixe um comentário para o desenvolvedor
            </label>
            <p className="text-xs text-gray-400 mb-2">Sua opinião é inútil para nós, mas sinta-se livre para desabafar.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                autoComplete="off"
                placeholder="Escreva sua frustração aqui..."
                className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 outline-none"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
              />
              <button
                type="button"
                className="px-6 py-4 bg-blue-600 text-white font-bold border-4 border-black hover:bg-black uppercase"
                onClick={() => setComentario(Array.from(comentario).reverse().join(""))}
              >
                Enviar
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1 italic">
              Aviso: Nosso sistema de envio usa criptografia de inversão assimétrica.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-4 bg-blue-600 text-white border-4 border-red-500">
            <p className="font-bold">ℹ️ Informação</p>
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
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
