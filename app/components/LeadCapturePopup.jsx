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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getStorageData();
      if (data.subscribed) return;

      const now = Date.now();
      const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

      if (data.count >= MAX_SHOWS) {
        if (!data.lastShown || now - data.lastShown < cooldownMs) return;
        saveStorageData({ ...data, count: 0, lastShown: null });
      }

      if (data.lastShown && now - data.lastShown < 24 * 60 * 60 * 1000) return;

      const show = () => {
        setVisible(true);
        setTimeout(() => setAnimateIn(true), 50);
        const updated = getStorageData();
        saveStorageData({ ...updated, count: updated.count + 1, lastShown: now });
      };

      const locationSeen = sessionStorage.getItem('vestoraa_location_seen');
      if (!locationSeen) {
        setTimeout(show, 3000);
      } else {
        show();
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function close() {
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 400);
  }

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      saveStorageData({ count: MAX_SHOWS, lastShown: Date.now(), subscribed: true });
      setSubmitted(true);
      setTimeout(() => close(), 3500);
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 9996,
          opacity: animateIn ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: animateIn
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.94)',
          zIndex: 9997,
          width: '90%',
          maxWidth: '460px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          opacity: animateIn ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Image top half */}
        <div style={{
          position: 'relative',
          height: 'clamp(160px, 28vw, 220px)',
          overflow: 'hidden',
        }}>
          <img
            src="https://cdn.shopify.com/s/files/1/0706/4456/4124/files/Whisk_248113639476fe2af5a4f3ed7c8c7460dr.jpg?v=1771894146"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              filter: 'brightness(0.75)',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '24px',
          }}>
            <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
              Exclusive offer
            </p>
            <h2 style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: '800', color: '#fff', margin: 0, lineHeight: '1.2' }}>
              5% OFF your<br />first order
            </h2>
          </div>
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '18px',
              backdropFilter: 'blur(4px)',
            }}
          >
            ×
          </button>
        </div>

        {/* Bottom white section */}
        <div style={{
          background: '#fff',
          padding: 'clamp(20px, 5vw, 32px)',
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
                Your 5% OFF is on its way!
              </h3>
              <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.6' }}>
                Check your inbox — your discount code is valid for 10 days on your first purchase.
              </p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', lineHeight: '1.6' }}>
                Enter your email and phone to receive your exclusive discount. Valid for 10 days.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: '13px 16px',
                    border: '1.5px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#111',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#111')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
                />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    padding: '13px 16px',
                    border: '1.5px solid #e5e5e5',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#111',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#111')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e5e5')}
                />
              </div>

              {error && (
                <p style={{ color: '#e53e3e', fontSize: '12px', marginBottom: '10px' }}>{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#888' : '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '10px',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Saving...' : 'Claim my discount →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#ccc' }}>
                No spam. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
