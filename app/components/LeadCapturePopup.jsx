import { useEffect, useState } from 'react';

const STORAGE_KEY = 'vestoraa_lead_popup';
const MAX_SHOWS = 3;
const COOLDOWN_DAYS = 10;
const DELAY_MS = 8000;

function getStorageData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lastShown: null, subscribed: false };
  } catch {
    return { count: 0, lastShown: null, subscribed: false };
  }
}

function saveStorageData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function LeadCapturePopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getStorageData();

      // Já se inscreveu, nunca mais mostra
      if (data.subscribed) return;

      const now = Date.now();
      const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

      // Atingiu o máximo de exibições
      if (data.count >= MAX_SHOWS) {
        // Verifica se passou o cooldown de 10 dias
        if (!data.lastShown || now - data.lastShown < cooldownMs) return;
        // Reseta contagem após cooldown
        saveStorageData({ ...data, count: 0, lastShown: null });
      }

      // Verifica cooldown entre exibições normais (mínimo 1 dia entre cada)
      if (data.lastShown && now - data.lastShown < 24 * 60 * 60 * 1000) return;

      // Aguarda o pop-up de localização fechar (sessão)
      const locationSeen = sessionStorage.getItem('vestoraa_location_seen');
      const showWithDelay = () => {
        setVisible(true);
        setTimeout(() => setAnimateIn(true), 50);
        const updated = getStorageData();
        saveStorageData({ ...updated, count: updated.count + 1, lastShown: now });
      };

      if (!locationSeen) {
        // Se localização ainda não apareceu, aguarda mais 3s
        setTimeout(showWithDelay, 3000);
      } else {
        showWithDelay();
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function close() {
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 400);
  }

  function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError('Por favor insira um e-mail válido.');
      return;
    }
    setError('');
    // Aqui você pode integrar com Klaviyo, Mailchimp, etc.
    console.log('Lead capturado:', { email, phone });
    saveStorageData({ count: MAX_SHOWS, lastShown: Date.now(), subscribed: true });
    setSubmitted(true);
    setTimeout(() => close(), 3000);
  }

  if (!visible) return null;

  return (
    <>
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 9996,
          opacity: animateIn ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: animateIn
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.92)',
          zIndex: 9997,
          background: '#fff',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '420px',
          padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          opacity: animateIn ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Fechar */}
        <button
          onClick={close}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#aaa',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
              Você ganhou 5% OFF!
            </h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
              Seu cupom foi enviado para o e-mail cadastrado. Válido por 10 dias na sua primeira compra.
            </p>
          </div>
        ) : (
          <>
            {/* Tag */}
            <div style={{
              display: 'inline-block',
              background: '#f5f5f5',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#888',
              marginBottom: '16px',
            }}>
              Oferta exclusiva
            </div>

            <h2 style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#111',
              margin: '0 0 8px',
              lineHeight: '1.2',
            }}>
              5% OFF na sua<br />primeira compra
            </h2>

            <p style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '28px',
              lineHeight: '1.6',
            }}>
              Cadastre seu e-mail e telefone para receber seu cupom. Válido por 10 dias.
            </p>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '14px 16px',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#111',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#111'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              />
              <input
                type="tel"
                placeholder="Telefone (opcional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  padding: '14px 16px',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#111',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#111'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              />
            </div>

            {error && (
              <p style={{ color: '#e53e3e', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '16px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Quero meu desconto →
            </button>

            <p style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#bbb',
              lineHeight: '1.5',
            }}>
              Sem spam. Você pode cancelar a qualquer momento.
            </p>
          </>
        )}
      </div>
    </>
  );
}
