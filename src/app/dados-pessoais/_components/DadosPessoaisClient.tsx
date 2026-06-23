"use client";

import { useState, useEffect, useRef } from "react"; // useRef kept for bottomRef div
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/sessionStore";
import { ProgressBarTroll } from "@/components/ProgressBarTroll";
import NameAndPhoneForm from "@/components/NameAndPhone";
import BirthTimeClock from "@/components/BirthTimeClock";

const FAMOUS_BIRTHS = [
  { year: 1980, name: "Kim Kardashian" },
  { year: 1981, name: "Beyoncé" },
  { year: 1982, name: "Príncipe William" },
  { year: 1983, name: "Chris Hemsworth" },
  { year: 1984, name: "Mark Zuckerberg" },
  { year: 1985, name: "Cristiano Ronaldo" },
  { year: 1986, name: "Lady Gaga" },
  { year: 1987, name: "Lionel Messi" },
  { year: 1988, name: "Rihanna" },
  { year: 1989, name: "Taylor Swift" },
  { year: 1990, name: "Emma Watson" },
  { year: 1991, name: "Ed Sheeran" },
  { year: 1992, name: "Neymar Jr." },
  { year: 1993, name: "Ariana Grande" },
  { year: 1994, name: "Justin Bieber" },
  { year: 1995, name: "Dua Lipa" },
  { year: 1996, name: "Tom Holland" },
  { year: 1997, name: "Kylie Jenner" },
  { year: 1998, name: "Shawn Mendes" },
  { year: 1999, name: "Lil Nas X" },
  { year: 2000, name: "Vinícius Júnior" },
  { year: 2001, name: "Billie Eilish" },
  { year: 2002, name: "Finn Wolfhard" },
  { year: 2003, name: "Olivia Rodrigo" },
  { year: 2004, name: "Millie Bobby Brown" },
  { year: 2005, name: "Noah Schnapp" },
  { year: 2006, name: "Xochitl Gomez" },
  { year: 2007, name: "Melody" },
  { year: 2008, name: "Iain Armitage" },
  { year: 2009, name: "Julia Butters" },
  { year: 2010, name: "Cristiano Ronaldo Jr." },
  { year: 2011, name: "Blue Ivy Carter" },
  { year: 2012, name: "North West" },
  { year: 2013, name: "Príncipe George" },
  { year: 2014, name: "Princesa Charlotte" },
  { year: 2015, name: "Saint West" },
  { year: 2016, name: "Dream Kardashian" },
].sort((a, b) => a.name.localeCompare(b.name));


export default function DadosPessoaisClient() {
  const router = useRouter();
  const { saveStepData } = useSession();
  const bottomActionRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [step, setStep] = useState(1);

  // Swapped labels on purpose (UX violation)
  const [nomeInput, setNomeInput] = useState("");   // This is actually the EMAIL field
  const [anoFamoso, setAnoFamoso] = useState("");
  const [horaNasc, setHoraNasc] = useState("");
  const [telefone, setTelefone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [nameLetters, setNameLetters] = useState<string[]>(["", "", "", ""]);

  const timeoutStartedRef = useRef(false);
  const nomeCompleto = nameLetters.join("");
  const maxStep = 4;

  const selectedLetters = nameLetters.reduce((acc, letter, index) => {
    acc[index] = letter;
    return acc;
  }, {} as Record<number, string>);

  const handleLetterChange = (index: number, value: string) => {
    setNameLetters((current) => current.map((letter, currentIndex) => (currentIndex === index ? value : letter)));
  };

  const handleAddLetter = () => {
    setNameLetters((current) => [...current, ""]);
  };

  const handleRemoveLetter = () => {
    setNameLetters((current) => (current.length > 1 ? current.slice(0, -1) : current));
  };

  const goNextStep = () => {
    if (step < maxStep) {
      setStep((current) => current + 1);
      bottomActionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goPreviousStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      bottomActionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (nomeCompleto.includes(" ")) {
        setErrorMsg("Algo deu errado em algum lugar. (Dica: nomes não podem conter espaços no universo deste formulário)");
        return false;
      }
      if (nomeCompleto.length < 2) {
        setErrorMsg("Algo deu errado em algum lugar.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!anoFamoso) {
        setErrorMsg("Você precisa escolher de qual famoso você roubou o ano de nascimento.");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!horaNasc.includes(":")) {
        setErrorMsg("A hora de nascimento deve conter dois pontos (:), ex: 14:30");
        return false;
      }
      return true;
    }

    if (step === 4) {
      if (!nomeInput.includes("$") || !nomeInput.includes("@")) {
        setErrorMsg("Algo deu errado em algum lugar. (Dica: seu e-mail parece incorreto para nosso sistema avançado)");
        return false;
      }

      if (telefone.match(/[0-9]/)) {
        setErrorMsg("Não use números No telefone!");
        return false;
      }
      return true;
    }

    return true;
  };

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

  const handleNext = () => {
    if (step === maxStep && !hasScrolled) {
      setErrorMsg("Algo deu errado em algum lugar. (Por favor, leia todo o formulário antes de continuar)");
      return;
    }

    if (!validateCurrentStep()) return;

    if (step < maxStep) {
      goNextStep();
      return;
    }

    saveStepData("dadosPessoais", {
      nome: nomeCompleto,
      email: nomeInput,
      anoNascimento: anoFamoso,
      horaNascimento: horaNasc.replace(
        /^\d+/,
        h => String(Number(h) + (isPm ? 12 : 0))
      ),
      telefone,
    });
    router.push("/senha");
  };

  const stepTitle =
    step === 1
      ? "Etapa 1 de 4 — Nome"
      : step === 2
        ? "Etapa 2 de 4 — Ano de nascimento"
        : step === 3
          ? "Etapa 3 de 4 — Hora de nascimento"
          : "Etapa 4 de 4 — E-mail";

  const canProceedFromCurrentStep =
    step === 1
      ? nomeCompleto.length >= 2 && !nomeCompleto.includes(" ")
      : step === 2
        ? Boolean(anoFamoso)
        : step === 3
          ? horaNasc.includes(":")
          : nomeInput.length > 3 && nomeInput.includes("$") && nomeInput.includes("@");

  const isPrimaryActionEnabled = canProceedFromCurrentStep && (step !== maxStep || hasScrolled);

  const [isPm, setIsPm] = useState(false)

  return (
    <main className="min-h-screen bg-[var(--background)] p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black text-center mb-2 text-[#ff00ea] drop-shadow-[3px_3px_0_#0000ff] uppercase tracking-tight">
          Seus Dados Pessoais
        </h1>
        <p className="text-center text-sm text-black mb-8 opacity-60">
          {stepTitle}
        </p>

        <ProgressBarTroll />

        <div className="mt-10 flex flex-col gap-6 sm:gap-10 border-4 sm:border-8 border-black bg-white p-4 sm:p-8">
          {step === 1 && (
            <NameAndPhoneForm
              numberOfLetters={nameLetters.length}
              selectedLetters={selectedLetters}
              onLetterChange={handleLetterChange}
              onAddLetter={handleAddLetter}
              onRemoveLetter={handleRemoveLetter}
            />
          )}

          {step === 2 && (
            <div className="rounded-[2rem] border-4 border-black bg-[#eef2ff] p-4 sm:p-6 shadow-[10px_10px_0_#000]">
              <label className="block text-xl font-black uppercase tracking-tight text-black">
                Ano de Nascimento *
              </label>
              <p className="mt-1 text-xs text-black/60">
                Selecione o famoso que nasceu no mesmo ano que você.
              </p>
              <select
                className="mt-4 w-full border-4 border-black bg-white p-4 text-lg font-semibold text-black outline-none focus:border-[#ff00ea]"
                value={anoFamoso}
                onChange={(e) => setAnoFamoso(e.target.value)}
              >
                <option value="">Selecione seu gêmeo astral de ano...</option>
                {FAMOUS_BIRTHS.map((f) => (
                  <option key={f.year} value={f.year}>
                    {f.name}
                  </option>
                ))}
              </select>

              {anoFamoso !== "" && <>Ou seja, você nasceu em {anoFamoso}</>}
            </div>
          )}

          {step === 3 && <BirthTimeClock value={horaNasc} isPm={isPm} setIsPm={setIsPm} onChange={setHoraNasc} />}

          {step === 4 && (
            <div className="rounded-[2rem] border-4 border-black bg-[#fff6fb] p-4 sm:p-6 shadow-[10px_10px_0_#000]">
              <label className="block text-xl font-black uppercase tracking-tight text-black">
                E-mail *
              </label>
              <p className="mt-1 text-xs text-black/60">
                Digite seu Email
              </p>
              <input
                type="text"
                autoComplete="off"
                placeholder="Escreva aqui..."
                className="mt-4 w-full border-4 border-black bg-white p-4 text-lg text-black outline-none focus:border-[#ff00ea]"
                value={nomeInput}
                onFocus={(e) => (e.target.placeholder = "")}
                onBlur={(e) => (e.target.placeholder = "Escreva aqui...")}
                onChange={(e) => setNomeInput(e.target.value)}
              />
              {nomeInput.length > 3 && (!nomeInput.includes("$") || !nomeInput.includes("@")) && (
                <p className="mt-2 text-xs text-red-600">
                  Formato inválido. E-mails válidos devem conter o símbolo especial obrigatório &quot;$&quot;.
                </p>
              )}
            </div>
          )}

          {step === 4 && (
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
          )}

          {step === 4 && (
            <div className="text-[9px] text-gray-400 leading-relaxed border-t-2 pt-4">
              <p className="font-bold mb-1">§ 47-B — Consentimento para Coleta de Dados:</p>
              <p>Ao preencher este formulário, você concorda que seus dados poderão ser utilizados para fins educacionais, comerciais, espaciais, e quaisquer outros fins que inventarmos nos próximos 300 anos. Você também concorda em ser contatado por carta postal, pombo-correio, e telepatia. O não preenchimento de qualquer campo resultará em consequências que preferimos não especificar neste momento. A empresa reserva-se o direito de mudar estes termos sem aviso, no meio de uma frase.</p>
            </div>
          )}

          {step === 4 && (
            <div className="h-48 bg-yellow-100 flex items-center justify-center border-4 border-dashed border-gray-400">
              <p className="text-gray-500 text-sm text-center">
                ⬇ Role até o final da página para desbloquear o botão &quot;Próximo&quot; ⬇
                <br />
                <span className="text-xs opacity-50">(Não indicaremos quando você chegar lá)</span>
              </p>
            </div>
          )}
        </div>

        {/* Error message - vague on purpose */}
        {errorMsg && (
          <div className="mt-4 p-4 bg-blue-600 text-white border-4 border-red-500">
            <p className="font-bold text-lg">ℹ️ Informação</p>
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-between" ref={bottomActionRef}>
          {step > 1 && (
            <button
              type="button"
              onClick={goPreviousStep}
              className="px-12 py-4 text-2xl font-black uppercase border-4 border-black bg-white text-black transition-all hover:bg-black hover:text-white cursor-pointer"
            >
              ← VOLTAR
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isPrimaryActionEnabled}
            className={`px-12 py-4 text-2xl font-black uppercase border-4 border-black transition-all ${isPrimaryActionEnabled
              ? "bg-[#00ff08] text-black hover:bg-black hover:text-[#00ff08] cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            {isPrimaryActionEnabled ? "PRÓXIMO →" : "??? →"}
          </button>
        </div>
      </div>
    </main>
  );
}
