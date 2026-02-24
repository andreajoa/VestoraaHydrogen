import { useEffect, useState } from 'react';

export function LocationWelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [city, setCity] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('vestoraa_location_seen');
    if (seen) return;

    // Tenta múltiplas APIs em sequência até uma funcionar
    const tryAPIs = async () => {
      const apis = [
        () => fetch('https://ipapi.co/json/').then(r => r.json()).then(d => d.city || d.region || ''),
        () => fetch('https://ip-api.com/json/?fields=city,regionName').then(r => r.json()).then(d => d.city || d.regionName || ''),
        () => fetch('https://ipwho.is/').then(r => r.json()).then(d => d.city || d.region || ''),
      ];

      for (const api of apis) {
        try {
          const result = await api();
          if (result) return result;
        } catch {}
      }
      return '';
    };

    tryAPIs().then((detectedCity) => {
      setCity(detectedCity);
      setVisible(true);
      setTimeout(() => setAnimateIn(true), 50);
      sessionStorage.setItem('vestoraa_location_seen', '1');
    });
  }, []);

  function close() {
    setAnimateIn(false);
    setTimeout(() => setVisible(false), 400);
  }

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          width: '100%',
          maxWidth: '320px',
          transform: animateIn ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
          overflow: 'hidden',
          borderRadius: '16px 0 0 16px',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.18)',
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0706/4456/4124/files/Whisk_248113639476fe2af5a4f3ed7c8c7460dr.jpg?v=1771894146)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
        }} />

        {/* Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
        }} />

        {/* Close */}
        <button
          onClick={close}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '18px',
            backdropFilter: 'blur(4px)',
            zIndex: 2,
          }}
        >×</button>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '40px 24px 48px',
          fontFamily: 'sans-serif',
        }}>
          <p style={{
            fontSize: '10px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '12px',
          }}>
            Welcome to Vestoraa
          </p>

          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
            margin: '0 0 12px',
            lineHeight: '1.4',
          }}>
            {city
              ? <>We noticed you&apos;re shopping from <span style={{ color: '#e2c88a', fontWeight: '800' }}>{city}</span>.</>
              : <>We noticed you&apos;re visiting our store.</>
            }
          </h2>

          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: '1.7',
          }}>
            Happy shopping — we deliver safely and securely to you. 🛡️
          </p>

          <div style={{
            width: '36px',
            height: '2px',
            background: 'rgba(255,255,255,0.3)',
            marginTop: '28px',
          }} />
        </div>
      </div>
    </>
  );
}
