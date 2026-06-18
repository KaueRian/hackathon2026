'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/sessionStore';

export default function LandingPage() {
  const router = useRouter();
  const { startSession } = useSession();
  const [fakeTime, setFakeTime] = useState(59);
  const [showCookie, setShowCookie] = useState(true);
  const [rejectCount, setRejectCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFakeTime((prev) => {
        if (prev <= 0) return 59;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRealClick = useCallback(() => {
    startSession();
    router.push('/dados-pessoais');
  }, [startSession, router]);

  const handleFakeClick = useCallback(() => {
    // The big button does absolutely nothing useful
  }, []);

  const handleReject = useCallback(() => {
    setShowCookie(false);
    // Reopen after a short delay — the reject button is useless!
    setTimeout(() => setShowCookie(true), 800);
    setRejectCount((prev) => prev + 1);
  }, []);

  const handleAccept = useCallback(() => {
    setShowCookie(false);
  }, []);

  return (
    <div className="landing-container">
      {/* Marquee — because why not */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#ff0000',
        color: '#ffff00',
        padding: '4px 0',
        overflow: 'hidden',
        zIndex: 50,
        fontSize: '0.85rem',
        fontWeight: 700,
      }}>
        <div style={{ animation: 'marquee 8s linear infinite', whiteSpace: 'nowrap' }}>
          🔥🔥🔥 OFERTA IMPERDÍVEL!!! CADASTRE-SE AGORA E GANHE ACESSO VITALÍCIO A ABSOLUTAMENTE NADA!!! 🔥🔥🔥 RESTAM APENAS {fakeTime} SEGUNDOS!!! 🔥🔥🔥
        </div>
      </div>

      {/* Spinning decorative element */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        fontSize: '4rem',
        animation: 'spin-slow 4s linear infinite',
        opacity: 0.3,
      }}>
        ⭐
      </div>

      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        fontSize: '3rem',
        animation: 'spin-slow 6s linear infinite reverse',
        opacity: 0.2,
      }}>
        💀
      </div>

      {/* Title */}
      <h1 className="landing-title">
        🔥 FormHell Premium™ 🔥
      </h1>

      <p style={{
        fontSize: '1.2rem',
        maxWidth: '500px',
        marginBottom: '0.5rem',
        lineHeight: 1.6,
      }}>
        A plataforma <strong>nº 1 do mundo</strong> em acesso vitalício a <em>absolutamente nada</em>.
        Cadastre-se agora!
      </p>

      {/* Fake timer */}
      <div className="fake-timer" style={{ margin: '1rem 0' }}>
        ⚠️ SUA OFERTA EXPIRA EM: 00:{fakeTime.toString().padStart(2, '0')} ⚠️
      </div>

      {/* Big fake button */}
      <button
        className="fake-btn troll-shake"
        onClick={handleFakeClick}
        id="btn-fake-cta"
        type="button"
      >
        NÃO, OBRIGADO
      </button>

      <p style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '0.5rem' }}>
        ↑ Este é o botão principal. Clique nele. Sério.
      </p>

      {/* Real link — almost invisible */}
      <button
        className="real-link"
        onClick={handleRealClick}
        id="btn-real-start"
        type="button"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        clique aqui para começar o cadastro (não recomendamos)
      </button>

      {/* Cookie popup */}
      {showCookie && (
        <div className="cookie-popup" id="cookie-popup">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>
              🍪 COOKIES!!!!!
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Este site utiliza cookies, biscoitos, bolinhos, e provavelmente também monitora
              seus sonhos. Ao continuar navegando, você concorda com absolutamente tudo que
              já fizemos, estamos fazendo, e faremos no futuro. Sem exceções.
              {rejectCount > 0 && (
                <span style={{ color: '#ff0000', fontWeight: 700 }}>
                  {' '}(Você já tentou rejeitar {rejectCount} {rejectCount === 1 ? 'vez' : 'vezes'}. Não vai funcionar.)
                </span>
              )}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
              <button
                className="cookie-popup reject-btn"
                onClick={handleReject}
                id="btn-cookie-reject"
                type="button"
              >
                ❌ REJEITAR TODOS
              </button>
              <button
                className="cookie-popup accept-btn"
                onClick={handleAccept}
                id="btn-cookie-accept"
                type="button"
              >
                ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
