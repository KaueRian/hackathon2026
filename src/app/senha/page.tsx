'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/sessionStore';

const PERGUNTAS_SEGURANCA = [
  'Selecione uma pergunta de segurança...',
  'Qual o nome do seu peixe de infância que você não teve?',
  'Qual a cor do cavalo branco de Napoleão?',
  'Quanto é 2 + 2? (resposta errada apenas)',
  'Qual o cheiro da cor azul?',
  'Se uma árvore cai na floresta e ninguém ouve, qual é sua senha?',
  'Qual a velocidade terminal de uma andorinha carregando um coco?',
  'Quantos programadores são necessários para trocar uma lâmpada?',
];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function hasConsecutiveLetters(s: string): boolean {
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length - 1; i++) {
    const code1 = lower.charCodeAt(i);
    const code2 = lower.charCodeAt(i + 1);
    if (code1 >= 97 && code1 <= 122 && code2 === code1 + 1) return true;
  }
  return false;
}

function sumDigits(s: string): number {
  return s.split('').reduce((sum, ch) => {
    const n = parseInt(ch, 10);
    return isNaN(n) ? sum : sum + n;
  }, 0);
}

function countUppercase(s: string): number {
  return (s.match(/[A-Z]/g) || []).length;
}

const PASSWORD_RULES = [
  { id: 'length', test: (p: string) => p.length >= 12, label: 'Mínimo 12 caracteres' },
  { id: 'emoji', test: (p: string) => /🔥/.test(p), label: 'Deve conter o emoji 🔥' },
  { id: 'roman', test: (p: string) => /[IVXLCDM]/.test(p), label: 'Deve conter um número romano (I, V, X, L, C, D ou M)' },
  { id: 'consecutive', test: (p: string) => !hasConsecutiveLetters(p), label: 'Não pode ter letras consecutivas do alfabeto (ex: "ab", "cd")' },
  { id: 'uppercase', test: (p: string) => countUppercase(p) === 2, label: 'Deve conter EXATAMENTE 2 letras maiúsculas (nem mais, nem menos)' },
  { id: 'prime', test: (p: string) => isPrime(sumDigits(p)), label: 'A soma dos dígitos deve ser um número primo' },
];

export default function SenhaPage() {
  const router = useRouter();
  const { saveStepData, setCurrentStep } = useSession();

  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [respostaPergunta, setRespostaPergunta] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inactivityTimer, setInactivityTimer] = useState(10);

  // Derive visible rule count from password (no effect needed)
  const visibleRuleCount = useMemo(() => {
    let count = 1;
    for (let idx = 0; idx < PASSWORD_RULES.length; idx++) {
      if (PASSWORD_RULES[idx].test(senha)) {
        count = Math.min(idx + 2, PASSWORD_RULES.length);
      } else {
        break;
      }
    }
    return count;
  }, [senha]);

  // Inactivity timer — clears password field!
  // Track last activity time to avoid synchronous setState in effect
  const lastActivityRef = useRef<number | null>(null);

  // Update last activity on password changes
  const handleSenhaChange = useCallback((value: string) => {
    lastActivityRef.current = Date.now();
    setSenha(value);
    setInactivityTimer(10);
  }, []);

  const handleConfirmChange = useCallback((value: string) => {
    lastActivityRef.current = Date.now();
    setConfirmSenha(value);
    setInactivityTimer(10);
  }, []);

  useEffect(() => {
    lastActivityRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const lastActivity = lastActivityRef.current ?? now;
      const elapsed = Math.floor((now - lastActivity) / 1000);
      const remaining = Math.max(0, 10 - elapsed);
      setInactivityTimer(remaining);
      if (remaining <= 0) {
        setSenha('');
        setConfirmSenha('');
        lastActivityRef.current = Date.now();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPasswordStrength = useCallback((): string => {
    // Always shows "fraca" no matter what — trolling!
    const passedCount = PASSWORD_RULES.filter(r => r.test(senha)).length;
    if (passedCount === PASSWORD_RULES.length) return '💪 Fraca (sério, tente mais)';
    if (passedCount >= 4) return '😐 Fraquíssima';
    if (passedCount >= 2) return '😰 Patética';
    return '💀 Inexistente';
  }, [senha]);

  const getMaskedPassword = useCallback((): string => {
    if (showPassword) {
      // "Show password" actually hides MORE by using bigger asterisks
      return '██'.repeat(senha.length);
    }
    return senha;
  }, [senha, showPassword]);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Check all password rules
    const failedRule = PASSWORD_RULES.find(r => !r.test(senha));
    if (failedRule) {
      newErrors.senha = `Regra não atendida: ${failedRule.label}`;
    }

    // Confirmation must be typed BACKWARDS
    const reversed = senha.split('').reverse().join('');
    if (confirmSenha !== reversed) {
      newErrors.confirmSenha = 'A confirmação deve ser a senha digitada DE TRÁS PARA FRENTE!';
    }

    if (!pergunta || pergunta === PERGUNTAS_SEGURANCA[0]) {
      newErrors.pergunta = 'Selecione uma pergunta de segurança absurda';
    }

    if (!respostaPergunta) {
      newErrors.respostaPergunta = 'A resposta é obrigatória (e provavelmente errada)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [senha, confirmSenha, pergunta, respostaPergunta]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    saveStepData('senha', {
      senha: '***censurado***', // Never store actual password in session
      perguntaSeguranca: pergunta,
    });
    setCurrentStep(3);
    router.push('/preferencias');
  }, [validate, saveStepData, setCurrentStep, router, pergunta]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '40%' }} />
      </div>

      <div className="form-step">
        <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>
          Etapa 2 de 4
        </p>
        <h1 className="form-title">🔐 Senha & Segurança</h1>
        <p className="form-subtitle">
          Crie uma senha impossível. Literalmente.
        </p>

        {/* Inactivity warning */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          padding: '8px',
          background: inactivityTimer <= 3 ? '#ff0000' : 'transparent',
          color: inactivityTimer <= 3 ? '#fff' : 'var(--foreground)',
          fontWeight: inactivityTimer <= 3 ? 700 : 400,
          fontSize: '0.8rem',
          transition: 'all 0.3s',
        }}>
          ⏱️ Timer de inatividade: {inactivityTimer}s
          {inactivityTimer <= 3 && ' — SEUS CAMPOS VÃO SER LIMPOS!'}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-senha">
            🔑 Senha
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="field-senha"
              value={showPassword ? getMaskedPassword() : senha}
              onChange={(e) => {
                if (!showPassword) handleSenhaChange(e.target.value);
              }}
              placeholder="Boa sorte..."
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
                color: 'var(--foreground)',
              }}
              id="btn-toggle-password"
            >
              {showPassword ? '🙈 Esconder' : '👁️ Mostrar'}
            </button>
          </div>
          {errors.senha && <p className="form-error">{errors.senha}</p>}

          {/* Password strength — always weak */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.3rem',
            }}>
              <div style={{
                height: '100%',
                width: '15%',
                background: '#ff0000',
                transition: 'width 0.3s',
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#ff0000', fontWeight: 700 }}>
              Força: {getPasswordStrength()}
            </p>
          </div>
        </div>

        {/* Password rules — revealed one at a time */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '2px solid var(--foreground)',
        }}>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            📋 Requisitos da senha ({PASSWORD_RULES.filter(r => r.test(senha)).length}/{PASSWORD_RULES.length}):
          </p>
          {PASSWORD_RULES.slice(0, visibleRuleCount).map((rule) => {
            const passed = rule.test(senha);
            return (
              <div key={rule.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
                fontSize: '0.85rem',
                color: passed ? '#00ff00' : '#ff0000',
              }}>
                <span>{passed ? '✅' : '❌'}</span>
                <span>{rule.label}</span>
              </div>
            );
          })}
          {visibleRuleCount < PASSWORD_RULES.length && (
            <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem', fontStyle: 'italic' }}>
              ...e mais {PASSWORD_RULES.length - visibleRuleCount} regra(s) que você ainda não conhece 😈
            </p>
          )}
        </div>

        {/* Confirm password — BACKWARDS */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-confirm-senha">
            🔄 Confirmar Senha (de trás para frente)
          </label>
          <input
            type="password"
            id="field-confirm-senha"
            value={confirmSenha}
            onChange={(e) => handleConfirmChange(e.target.value)}
            placeholder="etneserpa ohneserpa..."
            autoComplete="off"
          />
          {errors.confirmSenha && <p className="form-error">{errors.confirmSenha}</p>}
          <p className="form-hint">Digite sua senha ao contrário. Sim, é sério.</p>
        </div>

        {/* Security question */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-pergunta">
            ❓ Pergunta de Segurança
          </label>
          <select
            id="field-pergunta"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
          >
            {PERGUNTAS_SEGURANCA.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
          {errors.pergunta && <p className="form-error">{errors.pergunta}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="field-resposta-pergunta">
            💬 Resposta
          </label>
          <input
            type="text"
            id="field-resposta-pergunta"
            value={respostaPergunta}
            onChange={(e) => setRespostaPergunta(e.target.value)}
            placeholder="A resposta provavelmente não existe"
            autoComplete="off"
          />
          {errors.respostaPergunta && <p className="form-error">{errors.respostaPergunta}</p>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            className="btn-secondary"
            onClick={() => router.push('/dados-pessoais')}
            type="button"
          >
            ← Voltar
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            id="btn-next-step2"
            type="button"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
