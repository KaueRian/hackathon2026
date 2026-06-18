'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/sessionStore';

const GENEROS_ABSURDOS = [
  'Selecione...', 'Helicóptero Apache', 'Café Expresso', 'Segunda-feira', 'Wi-Fi de Shopping',
  'Arquivo ZIP Corrompido', 'Notificação de Atualização do Windows', 'Erro 404',
  'Masculino (talvez)', 'Feminino (quem sabe)', 'Outro (que outro?)',
  'Prefiro não dizer (mas vou dizer)', 'Batata', 'Lasanha',
  'Uma planilha do Excel muito complexa', 'Gato de Schrödinger',
  'O vazio existencial', 'Terça-feira à tarde', 'JavaScript',
  'CSS sem !important', 'Git merge conflict', 'Ctrl+Z',
  'A cor azul', 'Um meme muito específico', 'Aquele barulho do MSN',
  'Fila do banco', 'Extrato bancário', 'Boleto vencido',
  'Pix errado', 'Sinal de celular no elevador', 'Internet do avião',
  'Print de conversa', 'Emoji de joinha 👍', 'Sticker do WhatsApp',
  'Selo de verificado do Twitter', 'NFT', 'Blockchain',
  'Inteligência Artificial', 'Machine Learning', 'Deep Learning',
  'Algoritmo do TikTok', 'Anúncio do YouTube que não dá pra pular',
  'Termos de uso que ninguém lê', 'Cookie banner', 'Captcha impossível',
  'QR Code', 'Código de barras', 'UPC', 'EAN-13',
  'Um número primo muito grande', 'Pi com 50 casas decimais',
  'A raiz quadrada de -1', 'NaN', 'undefined', 'null', 'void',
];

export default function DadosPessoaisPage() {
  const router = useRouter();
  const { session, saveStepData, setCurrentStep } = useSession();

  // Labels are SWAPPED on purpose — "Nome" asks for email, "Email" asks for name
  const [nome, setNome] = useState(session.dadosPessoais.nome || '');
  const [email, setEmail] = useState(session.dadosPessoais.email || '');
  const [dataNascimento, setDataNascimento] = useState(session.dadosPessoais.dataNascimento || '');
  const [genero, setGenero] = useState(session.dadosPessoais.genero || '');
  const [telefone, setTelefone] = useState(session.dadosPessoais.telefone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    setGlobalError('');

    // "Email" field actually expects the name (labels are swapped!)
    // But the validation validates what the LABEL says, not what it should be
    if (!nome) {
      newErrors.nome = 'Preencha este campo (ou não, tanto faz)';
    } else if (nome.includes(' ')) {
      newErrors.nome = 'Nomes devem ser escritos SEM espaços! Junte tudo.';
    }

    if (!email) {
      newErrors.email = 'Preencha este campo. Por favor. Estamos pedindo educadamente.';
    } else if (!email.includes('@') || !email.includes('$')) {
      newErrors.email = 'Email inválido! Deve conter @ E $ (ex: usuario$@email.com)';
    }

    // Date must be in YYYY/DD/MM format (inverted!)
    if (!dataNascimento) {
      newErrors.dataNascimento = 'Quando você nasceu? Precisamos saber. É importante.';
    } else {
      const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
      if (!dateRegex.test(dataNascimento)) {
        newErrors.dataNascimento = 'Formato inválido! Use AAAA/DD/MM (sim, dia antes do mês)';
      }
    }

    if (!genero || genero === 'Selecione...') {
      newErrors.genero = 'Selecione uma das opções perfeitamente razoáveis acima';
    }

    // Phone must be written in words!
    if (!telefone) {
      newErrors.telefone = 'Precisamos do seu telefone. Para fins de... pesquisa.';
    } else if (/\d/.test(telefone)) {
      newErrors.telefone = 'NÚMEROS NÃO SÃO PERMITIDOS! Escreva por extenso: "seis nove nove..."';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Show vague global error instead of pointing to specific fields
      setGlobalError('Algo deu errado em algum lugar. Boa sorte descobrindo onde! 🤷');
      return false;
    }

    return true;
  }, [nome, email, dataNascimento, genero, telefone]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    saveStepData('dadosPessoais', {
      nome, email, dataNascimento, genero, telefone,
    });
    setCurrentStep(2);
    router.push('/senha');
  }, [validate, saveStepData, setCurrentStep, router, nome, email, dataNascimento, genero, telefone]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '20%' }} />
      </div>

      <div className="form-step">
        <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>
          Etapa 1 de 4 (ou 5, ou 7, quem sabe?)
        </p>
        <h1 className="form-title">📝 Dados Pessoais</h1>
        <p className="form-subtitle">
          Preencha com cuidado. Ou não. Nós não nos importamos.
        </p>

        {globalError && (
          <div style={{
            background: '#0000ff',
            color: '#ffff00',
            padding: '12px',
            marginBottom: '1.5rem',
            border: '3px dashed #ff0000',
            textAlign: 'center',
            fontWeight: 700,
          }}>
            {globalError}
          </div>
        )}

        {/* Nome field — but label says "Email" (SWAPPED!) */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-email-label">
            📧 Email <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>(campo de nome)</span>
          </label>
          <input
            type="text"
            id="field-email-label"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu email aqui... ou será o nome?"
            autoComplete="off"
          />
          {errors.nome && <p className="form-error">{errors.nome}</p>}
          <p className="form-hint">Dica: este campo pode ou não ser o que o label diz</p>
        </div>

        {/* Email field — but label says "Nome" (SWAPPED!) */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-nome-label">
            👤 Nome Completo <span style={{ fontSize: '0.6rem', opacity: 0.3 }}>(campo de email)</span>
          </label>
          <input
            type="text"
            id="field-nome-label"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu nome completo... com $ e @"
            autoComplete="off"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
          <p className="form-hint">Deve conter @ e $ — porque segurança</p>
        </div>

        {/* Data de Nascimento */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-data">
            📅 Data de Nascimento
          </label>
          <input
            type="text"
            id="field-data"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            placeholder="AAAA/DD/MM (sim, nesta ordem)"
            autoComplete="off"
          />
          {errors.dataNascimento && <p className="form-error">{errors.dataNascimento}</p>}
          <p className="form-hint">Formato: AAAA/DD/MM — ex: 1990/25/12</p>
        </div>

        {/* Gênero — dropdown com 50+ opções */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-genero">
            🎭 Gênero
          </label>
          <select
            id="field-genero"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            {GENEROS_ABSURDOS.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </select>
          {errors.genero && <p className="form-error">{errors.genero}</p>}
        </div>

        {/* Telefone — por extenso */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-telefone">
            📱 Telefone
          </label>
          <input
            type="text"
            id="field-telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="seis nove nove oito sete..."
            autoComplete="off"
          />
          {errors.telefone && <p className="form-error">{errors.telefone}</p>}
          <p className="form-hint">⚠️ Escreva os números POR EXTENSO. Algarismos não são aceitos.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            id="btn-next-step1"
            type="button"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
