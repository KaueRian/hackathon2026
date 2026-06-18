"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Info, ChevronRight, Check } from "lucide-react";

export default function CorrigidoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    nascimento: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
    termos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (name: string, value: string | boolean) => {
    let error = "";
    switch (name) {
      case "nome":
        if (typeof value === "string" && value.length < 3) error = "O nome deve ter pelo menos 3 caracteres.";
        break;
      case "email":
        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Insira um e-mail válido.";
        break;
      case "nascimento":
        if (typeof value === "string" && !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) error = "Use o formato DD/MM/AAAA.";
        break;
      case "senha":
        if (typeof value === "string" && value.length < 8) error = "A senha deve ter no mínimo 8 caracteres.";
        break;
      case "confirmarSenha":
        if (value !== formData.senha) error = "As senhas não coincidem.";
        break;
      case "termos":
        if (!value) error = "Você deve aceitar os termos para continuar.";
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    // Auto-formatting
    let formattedVal = val;
    if (name === "nascimento" && typeof val === "string") {
      formattedVal = val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 10);
    }
    if (name === "telefone" && typeof val === "string") {
      formattedVal = val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: formattedVal }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, formattedVal) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, val) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validate(key, formData[key as keyof typeof formData]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 cursor-default">
      {/* Override global CSS troll properties */}
      <style dangerouslySetInnerHTML={{__html: `
        body { cursor: auto !important; }
        * { animation: none !important; }
      `}} />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Check className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Formulário Ideal</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Voltar para o Caos (FormHell)
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-4">
            A Experiência de Usuário Correta
          </h2>
          <p className="text-lg text-gray-500">
            Compare lado a lado as heurísticas de usabilidade violadas no FormHell com a implementação adequada e acessível apresentada aqui.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Concluído!</h3>
            <p className="text-gray-500 mb-6">Seus dados foram processados com sucesso. Viu como foi fácil quando o sistema trabalha a seu favor?</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-100 outline-none"
            >
              Fazer outro teste
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Esquerda: Explicações (Heurísticas) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-blue-900 text-lg">Visibilidade e Feedback</h3>
                </div>
                <p className="text-sm text-blue-800 mb-4">
                  <strong>❌ No FormHell:</strong> Mensagens vagas (&quot;Algo deu errado em algum lugar&quot;), validações ocultas que resetam tudo, botões que fogem.
                </p>
                <p className="text-sm text-blue-800">
                  <strong>✅ Correto:</strong> Validação em tempo real no campo específico, cor clara de erro (vermelho) com ícone de alerta, botão de envio sempre disponível.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-purple-900 text-lg">Prevenção de Erros</h3>
                </div>
                <p className="text-sm text-purple-800 mb-4">
                  <strong>❌ No FormHell:</strong> Campos trocados de propósito, formatos absurdos (AAAA/DD/MM), punição por usar espaço no nome.
                </p>
                <p className="text-sm text-purple-800">
                  <strong>✅ Correto:</strong> Máscaras automáticas formatam dados (ex: DD/MM/AAAA, (XX) XXXXX-XXXX) prevenindo erros de digitação antes de ocorrerem.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <h3 className="font-bold text-emerald-900 text-lg">Acessibilidade e Padrões</h3>
                </div>
                <p className="text-sm text-emerald-800 mb-4">
                  <strong>❌ No FormHell:</strong> Contraste ruim, labels desconectadas, fontes ilegíveis, navegação por teclado (Tab) sabotada.
                </p>
                <p className="text-sm text-emerald-800">
                  <strong>✅ Correto:</strong> Contraste adequado (WCAG), tags <code>&lt;label htmlFor=&quot;...&quot;&gt;</code>, navegação clara por tab, design consistente.
                </p>
              </div>
            </div>

            {/* Direita: O Formulário Correto */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Crie sua Conta</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  {/* NOME */}
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      placeholder="João da Silva"
                      value={formData.nome}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`clean-input w-full px-4 py-3 rounded-xl border ${errors.nome ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"} outline-none focus:ring-4 transition-all`}
                    />
                    {errors.nome && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.nome}
                      </p>
                    )}
                  </div>

                  {/* E-MAIL */}
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="joao@exemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`clean-input w-full px-4 py-3 rounded-xl border ${errors.email ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"} outline-none focus:ring-4 transition-all`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* NASCIMENTO */}
                  <div>
                    <label htmlFor="nascimento" className="block text-sm font-semibold text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      id="nascimento"
                      name="nascimento"
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={formData.nascimento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`clean-input w-full px-4 py-3 rounded-xl border ${errors.nascimento ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"} outline-none focus:ring-4 transition-all`}
                    />
                    {errors.nascimento && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.nascimento}
                      </p>
                    )}
                  </div>

                  {/* TELEFONE */}
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1">
                      Celular <span className="text-gray-400 font-normal">(Opcional)</span>
                    </label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="clean-input w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-100 outline-none focus:ring-4 transition-all"
                    />
                  </div>

                  {/* SENHA */}
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-1">
                      Senha
                    </label>
                    <input
                      id="senha"
                      name="senha"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.senha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`clean-input w-full px-4 py-3 rounded-xl border ${errors.senha ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"} outline-none focus:ring-4 transition-all`}
                    />
                    {errors.senha && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.senha}
                      </p>
                    )}
                  </div>

                  {/* CONFIRMAR SENHA */}
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type="password"
                      placeholder="Repita a senha"
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`clean-input w-full px-4 py-3 rounded-xl border ${errors.confirmarSenha ? "border-red-500 focus:ring-red-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"} outline-none focus:ring-4 transition-all`}
                    />
                    {errors.confirmarSenha && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {errors.confirmarSenha}
                      </p>
                    )}
                  </div>
                </div>

                {/* TERMOS */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        name="termos"
                        checked={formData.termos}
                        onChange={handleChange}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Eu li e concordo com os Termos de Serviço e a Política de Privacidade.
                    </span>
                  </label>
                  {errors.termos && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1 ml-8">
                      <AlertCircle className="w-4 h-4" /> {errors.termos}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all focus:ring-4 focus:ring-blue-100 outline-none flex justify-center items-center gap-2 group"
                >
                  Concluir Cadastro
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
