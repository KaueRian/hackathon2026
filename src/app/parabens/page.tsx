'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from '@/lib/sessionStore';
import { supabase } from '@/lib/supabase';

type RankingEntry = {
  id: string;
  nickname: string;
  duration_seconds: number;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ParabensPage() {
  const { session, clearSession, getElapsedSeconds } = useSession();

  const [elapsedSeconds] = useState(() => getElapsedSeconds());
  const [nickname, setNickname] = useState('');
  const [saved, setSaved] = useState(false);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti animation
  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; rotation: number; rotationSpeed: number;
    }> = [];

    const colors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff8800', '#ff0088'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    let animationId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 3 + 2;
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Load ranking — inline to avoid setState-in-effect with useCallback
  useEffect(() => {
    let cancelled = false;
    async function fetchRanking() {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('id, nickname, duration_seconds')
          .eq('completed', true)
          .order('duration_seconds', { ascending: true })
          .limit(10);

        if (!cancelled && !error && data) {
          setRanking(data);
        }
      } catch {
        // Ranking load failed silently
      }
    }
    fetchRanking();
    return () => { cancelled = true; };
  }, []);

  const handleSave = useCallback(async () => {
    if (!nickname.trim() || saving) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('sessions').insert({
        nickname: nickname.trim().substring(0, 50),
        started_at: session.startedAt ? new Date(session.startedAt).toISOString() : new Date().toISOString(),
        finished_at: new Date().toISOString(),
        duration_seconds: elapsedSeconds,
        completed: true,
      });

      if (error) {
        console.error('Error saving session');
      } else {
        setSaved(true);
        // Reload ranking after save
        const { data } = await supabase
          .from('sessions')
          .select('id, nickname, duration_seconds')
          .eq('completed', true)
          .order('duration_seconds', { ascending: true })
          .limit(10);
        if (data) setRanking(data);
      }
    } catch {
      console.error('Failed to save session');
    } finally {
      setSaving(false);
    }
  }, [nickname, saving, session.startedAt, elapsedSeconds]);

  const handleRestart = useCallback(() => {
    clearSession();
    window.location.href = '/';
  }, [clearSession]);

  return (
    <div className="congrats-container">
      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      />

      <div style={{ position: 'relative', zIndex: 20, maxWidth: '600px', width: '100%' }}>
        {/* Celebration emoji */}
        <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉🏆🎉</p>

        <h1 className="congrats-title">
          Parabéns!
        </h1>

        <p className="congrats-message">
          Você chegou ao final da <strong>pior experiência de usuário!</strong>
        </p>

        {/* Timer */}
        <div style={{
          margin: '2rem auto',
          padding: '1rem 2rem',
          background: 'rgba(233, 69, 96, 0.15)',
          border: '2px solid #e94560',
          borderRadius: '12px',
          display: 'inline-block',
        }}>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.3rem' }}>Seu tempo:</p>
          <p style={{ fontSize: '3rem', fontWeight: 700, color: '#e94560', fontFamily: 'var(--font-mono, monospace)' }}>
            {formatTime(elapsedSeconds)}
          </p>
        </div>

        {/* Save to ranking */}
        {!saved ? (
          <div style={{ margin: '2rem 0' }}>
            <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>
              Digite um nickname para entrar no ranking:
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Seu nickname"
                maxLength={50}
                id="field-nickname"
                style={{
                  maxWidth: '250px',
                  background: '#1a1a2e',
                  border: '2px solid #e94560',
                  color: '#fff',
                  borderRadius: '8px',
                }}
              />
              <button
                onClick={handleSave}
                disabled={!nickname.trim() || saving}
                id="btn-save-ranking"
                type="button"
                style={{
                  padding: '10px 20px',
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: nickname.trim() && !saving ? 'pointer' : 'not-allowed',
                  opacity: nickname.trim() && !saving ? 1 : 0.5,
                }}
              >
                {saving ? '...' : '🏆 Salvar'}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: '#00ff00', margin: '1.5rem 0', fontWeight: 700 }}>
            ✅ Salvo no ranking!
          </p>
        )}

        {/* Ranking table */}
        {ranking.length > 0 && (
          <div style={{ margin: '2rem 0' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#e94560', marginBottom: '1rem' }}>
              🏆 Ranking — Melhores Tempos
            </h2>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nickname</th>
                  <th>Tempo</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry, i) => (
                  <tr key={entry.id}>
                    <td>
                      {i === 0 && '🥇'}
                      {i === 1 && '🥈'}
                      {i === 2 && '🥉'}
                      {i > 2 && `${i + 1}º`}
                    </td>
                    <td>{entry.nickname}</td>
                    <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                      {formatTime(entry.duration_seconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleRestart}
            id="btn-restart"
            type="button"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '2px solid #e94560',
              color: '#e94560',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            🔄 Tentar Novamente
          </button>
        </div>

        {/* Credit */}
        <p style={{ fontSize: '0.7rem', opacity: 0.3, marginTop: '3rem' }}>
          FormHell Premium™ — A plataforma que ninguém pediu.
        </p>
      </div>
    </div>
  );
}
