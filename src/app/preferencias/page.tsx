'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/sessionStore';

const CORES = ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Rosa', 'Laranja', 'Preto'];

export default function PreferenciasPage() {
  const router = useRouter();
  const { saveStepData, setCurrentStep } = useSession();

  const [coreSliders, setCoreSliders] = useState<Record<string, number>>(
    Object.fromEntries(CORES.map(c => [c, 50]))
  );
  const [newsletter, setNewsletter] = useState(true); // Starts ON (inverted toggle)
  const [termos, setTermos] = useState(true); // Starts checked — unchecks on click
  const [avaliacao, setAvaliacao] = useState(0);
  const [concordancia, setConcordancia] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSliderChange = useCallback((cor: string, value: number) => {
    setCoreSliders(prev => ({ ...prev, [cor]: value }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!termos) {
      newErrors.termos = 'Você precisa aceitar os termos. Mesmo que não existam.';
    }

    if (avaliacao === 0) {
      newErrors.avaliacao = 'Avalie nossa experiência! (1★ = melhor, 5★ = pior)';
    }

    if (!concordancia) {
      newErrors.concordancia = 'Você precisa concordar. Não há outra opção.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [termos, avaliacao, concordancia]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;

    saveStepData('preferencias', {
      cores: coreSliders,
      newsletter,
      termos,
      avaliacao,
    });
    setCurrentStep(4);
    router.push('/confirmacao');
  }, [validate, saveStepData, setCurrentStep, router, coreSliders, newsletter, termos, avaliacao]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* Progress bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: '60%' }} />
      </div>

      <div className="form-step">
        <p style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, marginBottom: '0.3rem' }}>
          Etapa 3 de 4
        </p>
        <h1 className="form-title">🎨 Preferências</h1>
        <p className="form-subtitle">
          Personalize sua experiência. (Não vai mudar nada.)
        </p>

        {/* Color preferences — using SLIDERS instead of checkboxes */}
        <div className="form-group">
          <label className="form-label">
            🌈 Selecione suas cores favoritas (usando sliders, porque checkboxes seria fácil demais)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '0.5rem' }}>
            {CORES.map(cor => (
              <div key={cor} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ minWidth: '80px', fontSize: '0.9rem' }}>{cor}:</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Odeia</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={coreSliders[cor]}
                  onChange={(e) => handleSliderChange(cor, parseInt(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Ama</span>
                <span style={{ minWidth: '30px', fontSize: '0.8rem', textAlign: 'right' }}>
                  {coreSliders[cor]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter toggle — INVERTED */}
        <div className="form-group">
          <label className="form-label">
            📬 Receber newsletter (847 emails por dia)
          </label>
          <div
            onClick={() => setNewsletter(!newsletter)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '8px',
            }}
            role="switch"
            aria-checked={newsletter}
            id="toggle-newsletter"
          >
            <div style={{
              width: '56px',
              height: '28px',
              borderRadius: '14px',
              background: newsletter ? '#ff0000' : '#00ff00',
              position: 'relative',
              transition: 'background 0.3s',
              border: '2px solid #000',
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '1px',
                left: newsletter ? '1px' : '29px',
                transition: 'left 0.3s',
              }} />
            </div>
            <span style={{ fontSize: '0.85rem' }}>
              {newsletter ? 'OFF' : 'ON'}
              <span style={{ fontSize: '0.65rem', opacity: 0.4, marginLeft: '4px' }}>
                (ou será que é o contrário?)
              </span>
            </span>
          </div>
        </div>

        {/* Terms — Lorem Ipsum, starts checked */}
        <div className="form-group">
          <label className="form-label">
            📜 Termos de Uso
          </label>
          <div style={{
            maxHeight: '120px',
            overflow: 'auto',
            background: 'rgba(0,0,0,0.3)',
            padding: '10px',
            marginBottom: '8px',
            fontSize: '0.75rem',
            opacity: 0.7,
            border: '1px dashed var(--foreground)',
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a
            odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus
            magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            Ao aceitar, você concorda em doar sua alma, seu Wi-Fi e seu último pedaço de pizza.
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={termos}
              onChange={() => setTermos(!termos)}
              id="checkbox-termos"
              style={{ width: 'auto' }}
            />
            <span style={{ fontSize: '0.85rem' }}>
              Li e aceito os termos acima (que estão em Lorem Ipsum)
            </span>
          </label>
          {errors.termos && <p className="form-error">{errors.termos}</p>}
          <p className="form-hint">⚠️ Este checkbox começa marcado e desmarca ao clicar. Cuidado.</p>
        </div>

        {/* Star rating — INVERTED (1★ = best, 5★ = worst) */}
        <div className="form-group">
          <label className="form-label">
            ⭐ Avalie nossa experiência (1★ = Excelente, 5★ = Péssimo)
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setAvaliacao(star)}
                style={{
                  fontSize: '2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: avaliacao >= star ? 1 : 0.3,
                  transition: 'opacity 0.2s, transform 0.2s',
                  transform: avaliacao >= star ? 'scale(1.2)' : 'scale(1)',
                }}
                id={`star-${star}`}
              >
                ⭐
              </button>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.3rem' }}>
            {avaliacao === 1 && '🏆 Excelente! (estranho gostar tanto)'}
            {avaliacao === 2 && '👍 Bom (você tem padrões baixos)'}
            {avaliacao === 3 && '😐 Normal'}
            {avaliacao === 4 && '👎 Ruim (faz sentido)'}
            {avaliacao === 5 && '💩 Péssimo (resposta correta!)'}
          </p>
          {errors.avaliacao && <p className="form-error">{errors.avaliacao}</p>}
        </div>

        {/* "Do you agree?" — no real choice */}
        <div className="form-group">
          <label className="form-label">
            🤝 Você concorda com tudo?
          </label>
          <div style={{ display: 'flex', gap: '12px', marginTop: '0.5rem' }}>
            <button
              type="button"
              className={concordancia === 'sim' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setConcordancia('sim')}
              id="btn-concordo-sim"
              style={{ flex: 1 }}
            >
              Sim
            </button>
            <button
              type="button"
              className={concordancia === 'absolutamente' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => setConcordancia('absolutamente')}
              id="btn-concordo-absolutamente"
              style={{ flex: 1 }}
            >
              Absolutamente Sim
            </button>
          </div>
          {errors.concordancia && <p className="form-error">{errors.concordancia}</p>}
          <p className="form-hint">Nota: não existe opção &quot;Não&quot;</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            className="btn-secondary"
            onClick={() => router.push('/senha')}
            type="button"
          >
            ← Voltar
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            id="btn-next-step3"
            type="button"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
