import { useEffect, useState } from 'react';

export function LocationWelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [city, setCity] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('vestoraa_location_seen');
    if (seen) return;
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        setCity(data.city || data.region || '');
        setVisible(true);
        setTimeout(() => setAnimateIn(true), 50);
        sessionStorage.setItem('vestoraa_location_seen', '1');
      })
      .catch(() => {
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
      <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.3)', zIndex:9998, opacity:animateIn?1:0, transition:'opacity 0.4s ease' }} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:9999, background:'#fff', borderRadius:'20px 20px 0 0', padding:'40px 32px 48px', boxShadow:'0 -8px 40px rgba(0,0,0,0.12)', transform:animateIn?'translateY(0)':'translateY(100%)', transition:'transform 0.4s cubic-bezier(0.32,0.72,0,1)', maxWidth:'480px', margin:'0 auto', fontFamily:'sans-serif' }}>
        <div style={{ width:'40px', height:'4px', background:'#e5e5e5', borderRadius:'2px', margin:'0 auto 28px' }} />
        <div style={{ textAlign:'center', marginBottom:'20px' }}><span style={{ fontSize:'28px' }}>📦</span></div>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'#999', marginBottom:'10px' }}>Bem-vindo à</p>
          <h2 style={{ fontSize:'24px', fontWeight:'700', color:'#111', margin:'0 0 16px' }}>Vestoraa</h2>
          <p style={{ fontSize:'15px', color:'#555', lineHeight:'1.6', marginBottom:'8px' }}>
            Percebemos que você está acessando nossa loja{city ? <> de <strong style={{ color:'#111' }}>{city}</strong></> : null}.
          </p>
          <p style={{ fontSize:'15px', color:'#555', lineHeight:'1.6', marginBottom:'32px' }}>Boas compras! Entregamos para você com segurança. 🛡️</p>
        </div>
        <button onClick={close} style={{ width:'100%', padding:'16px', background:'#111', color:'#fff', border:'none', borderRadius:'12px', fontSize:'14px', fontWeight:'600', letterSpacing:'1px', textTransform:'uppercase', cursor:'pointer' }}>
          Explorar a loja
        </button>
      </div>
    </>
  );
}
