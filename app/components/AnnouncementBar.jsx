import { useState, useEffect } from 'react';

const MESSAGES = [
  'NOW OFFERING STANDARD AND EXPRESS DELIVERY ON SATURDAYS.*',
  'USE CODE SAVE10 FOR 10% OFF YOUR ORDER',
  'SPEND $200 GET 20% OFF — AUTOMATICALLY APPLIED AT CHECKOUT',
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      borderBottom: '1px solid #e0e0e0',
      padding: '10px 24px',
      textAlign: 'center',
      minHeight: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <p style={{
        margin: 0,
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.08em',
        color: '#222',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {MESSAGES[index]}
      </p>
    </div>
  );
}
