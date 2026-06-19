"use client";

import { useState, useEffect, useRef } from "react"; // useRef kept for bottomRef div
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { ProgressBarTroll } from "@/components/ProgressBarTroll";

const GENDER_OPTIONS = [
  "Não vou dizer",
  "Zorro",
  "Guerreiro Samurai",
  "Unicórnio Corporativo",
  "Sim",
  "Talvez",
  "Depende do Tempo",
  "Alienígena (3ª Categoria)",
  "Masculino",
  "Feminino",
  "Ser de Luz",
  "Ninja das Finanças",
  "Prefiro não responder (mas vou responder mesmo assim)",
  "Robô com Sentimentos",
  "Humano (não tenho certeza)",
  "Dragão Corporativo",
  "Não, Obrigado",
  "Faroeste",
  "Outro (especifique no próximo campo que não existe)",
  "NaN",
  "Undefined",
  "Mago Nível 99",
  "Indiferente",
  "Planilha do Excel",
  "Carnívoro",
  "Vegano de Fim de Semana",
  "Gato de Schrödinger",
  "Ambos Nenhum Todos",
  "Só Vejo em 3D",
  "Mortal Kombat Select Screen",
];

export default function DadosPessoaisPage() {
  const router = useRouter();
  const { saveStepData } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Swapped labels on purpose (UX violation)
  const [emailInput, setEmailInput] = useState(""); // This is actually the NAME field
  const [nomeInput, setNomeInput] = useState("");   // This is actually the EMAIL field
  const [dataNasc, setDataNasc] = useState("");
  const [genero, setGenero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const timeoutStartedRef = useRef(false);

  // Track scroll to enable the "Próximo" button (with a troll delay)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollY >= docHeight - 10 && !timeoutStartedRef.current) {
        timeoutStartedRef.current = true;
        // Troll: Make them wait 5 seconds at the bottom without any feedback
        setTimeout(() => {
          setHasScrolled(true);
        }, 5000);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validate = () => {
    // Absurd name validation: no spaces allowed
    if (emailInput.includes(" ")) {
      setErrorMsg("Algo deu errado em algum lugar. (Dica: nomes não podem conter espaços no universo deste formulário)");
      return false;
    }
    if (emailInput.length < 2) {
      setErrorMsg("Algo deu errado em algum lugar.");
      return false;
    }
    // Absurd email validation: must contain $ near @
    if (!nomeInput.includes("$@") && !nomeInput.includes("@$")) {
      setErrorMsg("Algo deu errado em algum lugar. (Dica: seu e-mail parece incorreto para nosso sistema avançado)");
      return false;
    }
    // Absurd date format: AAAA/DD/MM
    const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!dateRegex.test(dataNasc)) {
      setErrorMsg("Algo deu errado em algum lugar.");
      return false;
    }
    if (!genero) {
      setErrorMsg("Algo deu errado em algum lugar.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!hasScrolled) {
      setErrorMsg("Algo deu errado em algum lugar. (Por favor, leia todo o formulário antes de continuar)");
      return;
    }
    if (!validate()) return;

    saveStepData("dadosPessoais", {
      nome: emailInput, // intentionally swapped
      email: nomeInput,
      dataNasc,
      genero,
      telefone,
    });
    router.push("/senha");
  };

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-2 text-[#ff00ea] drop-shadow-[3px_3px_0_#0000ff] uppercase tracking-tight">
          Seus Dados Pessoais
        </h1>
        <p className="text-center text-sm text-black mb-8 opacity-60">
          Passo 1 de 5 — Preencha com muito cuidado (não que isso vá ajudar)
        </p>

        <ProgressBarTroll />

        <div className="mt-10 flex flex-col gap-10 border-8 border-black bg-white p-8">

          {/* LABEL SWAP: "Email" label → Name field */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              E-mail *
            </label>
            <p className="text-xs text-gray-400 mb-2">Digite seu endereço de e-mail no campo abaixo</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="Escreva aqui..."
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 focus:bg-yellow-50 outline-none"
              value={emailInput}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "Escreva aqui...")}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            {emailInput.includes(" ") && (
              <p className="text-red-600 text-xs mt-1">Nomes não podem ter espaços. (Este campo é de e-mail... ou nome? Você decide.)</p>
            )}
          </div>

          {/* LABEL SWAP: "Nome" label → Email field */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Nome Completo *
            </label>
            <p className="text-xs text-gray-400 mb-2">Seu nome completo como aparece nos documentos oficiais de outros planetas</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="Escreva aqui..."
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 focus:bg-yellow-50 outline-none"
              value={nomeInput}
              onFocus={(e) => (e.target.placeholder = "")}
              onBlur={(e) => (e.target.placeholder = "Escreva aqui...")}
              onChange={(e) => setNomeInput(e.target.value)}
            />
            {nomeInput.length > 3 && !nomeInput.includes("$@") && !nomeInput.includes("@$") && (
              <p className="text-red-600 text-xs mt-1">Formato inválido. E-mails válidos devem conter o símbolo especial obrigatório &quot;$&quot;.</p>
            )}
          </div>

          {/* Absurd date format */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Data de Nascimento *
            </label>
            <p className="text-xs text-gray-400 mb-2">Use o formato obrigatório: AAAA/DD/MM (ex: 1990/25/07)</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="AAAA/DD/MM"
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black font-mono focus:border-red-500 outline-none"
              value={dataNasc}
              onChange={(e) => setDataNasc(e.target.value)}
            />
          </div>

          {/* Chaotic gender dropdown */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Identidade de Gênero *
            </label>
            <select
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 outline-none"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Selecione uma das 30 opções cuidadosamente elaboradas</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Phone in full text */}
          <div>
            <label className="block text-xl font-bold mb-1 text-black">
              Telefone (opcional, mas obrigatório)
            </label>
            <p className="text-xs text-gray-400 mb-2">Digite os números por extenso, separados por espaço (ex: &quot;seis nove nove meia meia...&quot;)</p>
            <input
              type="text"
              autoComplete="off"
              placeholder="zero oito zero zero..."
              className="w-full p-4 text-lg border-4 border-blue-500 bg-white text-black focus:border-red-500 outline-none"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>

          {/* Terms nobody will read */}
          <div className="text-[9px] text-gray-400 leading-relaxed border-t-2 pt-4">
            <p className="font-bold mb-1">§ 47-B — Consentimento para Coleta de Dados:</p>
            <p>Ao preencher este formulário, você concorda que seus dados poderão ser utilizados para fins educacionais, comerciais, espaciais, e quaisquer outros fins que inventarmos nos próximos 300 anos. Você também concorda em ser contatado por carta postal, pombo-correio, e telepatia. O não preenchimento de qualquer campo resultará em consequências que preferimos não especificar neste momento. A empresa reserva-se o direito de mudar estes termos sem aviso, no meio de uma frase.</p>
          </div>

          {/* Spacer to force scrolling */}
          <div className="h-48 bg-yellow-100 flex items-center justify-center border-4 border-dashed border-gray-400">
            <p className="text-gray-500 text-sm text-center">
              ⬇ Role até o final da página para desbloquear o botão &quot;Próximo&quot; ⬇
              <br/>
              <span className="text-xs opacity-50">(Não indicaremos quando você chegar lá)</span>
            </p>
          </div>
        </div>

        {/* Error message - vague on purpose */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-blue-600 text-white border-4 border-red-500">
            <p className="font-bold text-lg">ℹ️ Informação</p>
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end" ref={bottomRef}>
          <button
            onClick={handleNext}
            disabled={!hasScrolled}
            className={`px-12 py-4 text-2xl font-black uppercase border-4 border-black transition-all ${
              hasScrolled
                ? "bg-[#00ff08] text-black hover:bg-black hover:text-[#00ff08] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
            }`}
          >
            {hasScrolled ? "PRÓXIMO →" : "??? →"}
          </button>
        </div>
      </div>
    </main>
  );
}
