'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/sessionStore';

function generateMathCaptcha(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 15) + 3;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '×': answer = a * b; break;
    default: answer = a + b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { session, setCurrentStep } = useSession();

  const [captcha] = useState(() => generateMathCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [aceitaEmails, setAceitaEmails] = useState(true); // Pre-checked!
  const [showLoading, setShowLoading] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showScarePopup, setShowScarePopup] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Runaway button state
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);

  const handleMouseApproach = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current || escapeCount >= 5) return; // After 5 escapes, let them click

    const rect = btnRef.current.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 120) {
      const moveX = (Math.random() - 0.5) * 200;
      const moveY = (Math.random() - 0.5) * 150;
      setBtnOffset(prev => ({
        x: Math.max(-150, Math.min(150, prev.x + moveX)),
        y: Math.max(-100, Math.min(100, prev.y + moveY)),
      }));
      setEscapeCount(prev => prev + 1);
    }
  }, [escapeCount]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Captcha validation
    const numAnswer = parseInt(captchaAnswer, 10);
    if (isNaN(numAnswer) || numAnswer !== captcha.answer) {
      newErrors.captcha = 'CAPTCHA incorreto! (Pista: é um problema de MATEMÁTICA, não de letras)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [captchaAnswer, captcha.answer]);

  const handleConfirmClick = useCallback(() => {
    if (!validate()) {
      // Show scare popup on wrong CAPTCHA
      setShowScarePopup(true);
      setTimeout(() => setShowScarePopup(false), 3000);
      return;
    }

    // Show the trolling confirmation popup
    setShowConfirmPopup(true);
  }, [validate]);

  const handlePopupCancel = useCallback(() => {
    // "Cancelar" actually CONFIRMS! (inverted buttons)
    setShowConfirmPopup(false);
    setShowLoading(true);

    // Fake loading with troll progress bar
    setTimeout(() => {
      setShowLoading(false);
      setCurrentStep(5);
      router.push('/parabens');
    }, 6000);
  }, [setCurrentStep, router]);

  const handlePopupOk = useCallback(() => {
    // "OK" actually CANCELS! (inverted buttons)
    setShowConfirmPopup(false);
  }, []);

  // Display data — all SWAPPED for confusion
  const displayData = {
    nome: session.dadosPessoais.email || 'não informado',
    email: session.dadosPessoais.nome || 'não informado',
    dataNascimento: session.dadosPessoais.dataNascimento || 'não informado',
    genero: session.dadosPessoais.telefone || 'não informado',
    telefone: session.dadosPessoais.genero || 'não informado',
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '80%' }} />
      </div>

      <div className="form-step">
        <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>
          Etapa 4 de 4 (a última, prometemos!)
        </p>
        <h1 className="form-title">✅ Confirmação</h1>
        <p className="form-subtitle">
          Revise seus dados. Eles podem ou não estar corretos.
        </p>

        {/* Data summary — all wrong/swapped */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '2px dashed var(--foreground)',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem' }}>
            📋 Resumo dos seus dados:
          </h3>
          <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
            <p><strong>Nome:</strong> {displayData.nome}</p>
            <p><strong>Email:</strong> {displayData.email}</p>
            <p><strong>Data de Nascimento:</strong> {displayData.dataNascimento}</p>
            <p><strong>Gênero:</strong> {displayData.genero}</p>
            <p><strong>Telefone:</strong> {displayData.telefone}</p>
          </div>
          <p style={{ fontSize: '0.65rem', opacity: 0.3, marginTop: '0.5rem', fontStyle: 'italic' }}>
            (Nota: os dados acima podem estar levemente... trocados)
          </p>
        </div>

        {/* CAPTCHA — shows math, asks for "letters" */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-captcha">
            🤖 CAPTCHA: Digite as LETRAS que você vê na imagem
          </label>
          <div style={{
            background: '#1a1a1a',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '8px',
            border: '3px solid #333',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '2rem',
            color: '#00ff00',
            letterSpacing: '4px',
            textDecoration: 'line-through',
            fontStyle: 'italic',
            transform: 'skewX(-5deg)',
          }}>
            {captcha.question}
          </div>
          <input
            type="text"
            id="field-captcha"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Digite as letras... ou será que são números?"
            autoComplete="off"
          />
          {errors.captcha && <p className="form-error">{errors.captcha}</p>}
        </div>

        {/* Pre-checked evil checkbox */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={aceitaEmails}
              onChange={() => setAceitaEmails(!aceitaEmails)}
              id="checkbox-emails"
              style={{ width: 'auto' }}
            />
            <span style={{ fontSize: '0.85rem' }}>
              Aceito receber 847 emails por dia sobre ofertas de coisas que não existem
            </span>
          </label>
        </div>

        {/* Runaway confirm button */}
        <div
          style={{ textAlign: 'center', marginTop: '2rem', position: 'relative', minHeight: '80px' }}
          onMouseMove={handleMouseApproach}
        >
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => router.push('/preferencias')}
              type="button"
            >
              ← Voltar
            </button>
            <button
              ref={btnRef}
              className="btn-primary"
              onClick={handleConfirmClick}
              id="btn-confirm"
              type="button"
              style={{
                transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              ✅ Confirmar Cadastro
            </button>
          </div>
          {escapeCount > 0 && escapeCount < 5 && (
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem' }}>
              O botão fugiu {escapeCount} {escapeCount === 1 ? 'vez' : 'vezes'}. Mais {5 - escapeCount} e ele para.
            </p>
          )}
        </div>
      </div>

      {/* Scare popup — "All fields reset!" (but not really) */}
      {showScarePopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#ff0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'blink-text 0.5s infinite',
        }}>
          <div style={{ textAlign: 'center', color: '#fff' }}>
            <p style={{ fontSize: '3rem', fontWeight: 900 }}>⚠️ CAPTCHA INCORRETO! ⚠️</p>
            <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
              Todos os campos de TODAS as páginas foram resetados!
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '2rem', opacity: 0.6 }}>
              (brincadeira, é só um susto 😈)
            </p>
          </div>
        </div>
      )}

      {/* Confirmation popup — buttons are inverted */}
      {showConfirmPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            background: '#1a1a1a',
            padding: '2rem',
            border: '3px dashed #ff0000',
            maxWidth: '400px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
              🤔 Tem certeza?
            </p>
            <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
              Esta ação é irreversível. Ou talvez não. Quem sabe.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                className="btn-primary"
                onClick={handlePopupCancel}
                id="btn-popup-cancel"
                type="button"
                style={{ background: '#ff0000' }}
              >
                Cancelar
              </button>
              <button
                className="btn-secondary"
                onClick={handlePopupOk}
                id="btn-popup-ok"
                type="button"
              >
                OK
              </button>
            </div>
            <p style={{ fontSize: '0.6rem', opacity: 0.3, marginTop: '1rem' }}>
              Pista: os botões fazem o oposto do que dizem
            </p>
          </div>
        </div>
      )}

      {/* Troll loading screen */}
      {showLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          color: '#fff',
        }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            ⏳ Processando seu cadastro...
          </p>
          <div style={{
            width: '300px',
            height: '24px',
            background: '#333',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00)',
              borderRadius: '12px',
              animation: 'progress-troll 6s ease-in-out forwards',
            }} />
          </div>
          <p style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '1rem' }}>
            Isso pode levar um momento... ou uma eternidade
          </p>
        </div>
      )}
    </div>
  );
}
