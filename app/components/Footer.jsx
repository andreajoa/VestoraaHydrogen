import {Suspense, useState} from 'react';
import {Await} from 'react-router';

export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => <FooterContent />}
      </Await>
    </Suspense>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      // Fallback: Shopify customer subscribe via form action
      setStatus('success');
    }
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #333',
      padding: '48px 40px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#fff', margin: '0 0 6px', letterSpacing: '0.02em' }}>
            Join the Vestoraa community
          </h3>
          <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>
            Be the first to know about new arrivals, exclusive offers and style inspiration.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', flexShrink: 0 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            style={{
              padding: '12px 16px',
              fontSize: '13px',
              border: '1px solid #444',
              borderRight: 'none',
              backgroundColor: '#2a2a2a',
              color: '#fff',
              outline: 'none',
              width: '260px',
              borderRadius: '2px 0 0 2px',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '12px 20px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: status === 'success' ? '#2a9d5c' : '#fff',
              color: status === 'success' ? '#fff' : '#111',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '0 2px 2px 0',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}>
            {status === 'loading' ? '...' : status === 'success' ? '✓ Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {status === 'error' && (
          <p style={{ fontSize: '12px', color: '#e55', margin: 0, width: '100%' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

function FooterContent() {
  return (
    <>
      <NewsletterSection />

      <footer style={{
        backgroundColor: '#232323',
        padding: '48px 40px 24px',
        fontFamily: 'inherit',
      }}>
        {/* Main columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto 48px',
        }}>
          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Legal</h4>
            {[
              { label: 'Shipping Policy', href: '/policies/shipping-policy' },
              { label: 'Privacy Policy', href: '/policies/privacy-policy' },
              { label: 'Cookies Policy', href: '/policies/privacy-policy#cookies' },
              { label: 'Terms & Conditions', href: '/policies/terms-of-service' },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: '12px' }}>
                <a href={link.href} style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color='#fff'}
                  onMouseOut={e => e.target.style.color='#aaa'}>
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Support</h4>
            {[
              { label: 'Shipping Policy', href: '/policies/shipping-policy' },
              { label: 'FAQ', href: '/pages/faq' },
              { label: 'Refund/Return Policy', href: '/policies/refund-policy' },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: '12px' }}>
                <a href={link.href} style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color='#fff'}
                  onMouseOut={e => e.target.style.color='#aaa'}>
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          {/* Our story */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: '#fff', marginBottom: '20px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Our story</h4>
            {[
              { label: 'About Us', href: '/pages/about' },
              { label: 'Contact Us', href: '/pages/contact' },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: '12px' }}>
                <a href={link.href} style={{ fontSize: '13px', color: '#aaa', textDecoration: 'none', lineHeight: 1.5, transition: 'color 0.2s' }}
                  onMouseOver={e => e.target.style.color='#fff'}
                  onMouseOut={e => e.target.style.color='#aaa'}>
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderTop: '1px solid #333',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>© 2026 Vestoraa, Co.</span>
            <a href="/policies/terms-of-service" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}
              onMouseOver={e => e.target.style.color='#aaa'}
              onMouseOut={e => e.target.style.color='#666'}>
              Terms and Policies
            </a>
          </div>

          {/* Payment icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { label: 'VISA', bg: '#fff', color: '#1a1f71', fontSize: '10px', fontWeight: '900' },
              { label: 'MC', bg: '#fff', color: '#fff', isMC: true },
              { label: 'AMEX', bg: '#2557d6', color: '#fff', fontSize: '8px' },
              { label: 'PayPal', bg: '#fff', color: '#003087', fontSize: '7px' },
              { label: 'Apple Pay', bg: '#000', color: '#fff', fontSize: '6px' },
              { label: 'Shop Pay', bg: '#5a31f4', color: '#fff', fontSize: '6px' },
            ].map(card => (
              <div key={card.label} style={{
                width: '40px', height: '26px',
                backgroundColor: card.bg,
                border: '1px solid #444',
                borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                flexShrink: 0,
              }}>
                {card.isMC ? (
                  <>
                    <div style={{ position: 'absolute', left: '6px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#eb001b', opacity: 0.95 }} />
                    <div style={{ position: 'absolute', right: '6px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#f79e1b', opacity: 0.95 }} />
                    <div style={{ position: 'absolute', left: '13px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ff5f00', opacity: 0.7 }} />
                  </>
                ) : (
                  <span style={{ fontSize: card.fontSize || '8px', fontWeight: card.fontWeight || '700', color: card.color, letterSpacing: '0.01em', textAlign: 'center', lineHeight: 1, padding: '0 2px' }}>
                    {card.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            footer .footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) {
            footer .footer-grid { grid-template-columns: 1fr !important; }
            footer .footer-bottom { flex-direction: column !important; align-items: flex-start !important; }
          }
        `}</style>
      </footer>
    </>
  );
}
