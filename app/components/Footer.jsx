import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';

export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {() => <FooterContent />}
      </Await>
    </Suspense>
  );
}

function FooterContent() {
  return (
    <footer style={{
      backgroundColor: '#f5f0e8',
      padding: '48px 40px 24px',
      marginTop: '64px',
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
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '20px', letterSpacing: '0.05em' }}>Legal</h4>
          {[
            { label: 'Shipping Policy', href: '/policies/shipping-policy' },
            { label: 'Privacy Policy', href: '/policies/privacy-policy' },
            { label: 'Cookies Policy', href: '/policies/privacy-policy#cookies' },
            { label: 'Terms & Conditions', href: '/policies/terms-of-service' },
          ].map(link => (
            <div key={link.label} style={{ marginBottom: '14px' }}>
              <a href={link.href} style={{ fontSize: '13px', color: '#444', textDecoration: 'none', lineHeight: 1.5 }}
                onMouseOver={e => e.target.style.color='#111'}
                onMouseOut={e => e.target.style.color='#444'}>
                {link.label}
              </a>
            </div>
          ))}
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '20px', letterSpacing: '0.05em' }}>Support</h4>
          {[
            { label: 'Shipping Policy', href: '/policies/shipping-policy' },
            { label: 'FAQ', href: '/pages/faq' },
            { label: 'Refund/Return Policy', href: '/policies/refund-policy' },
          ].map(link => (
            <div key={link.label} style={{ marginBottom: '14px' }}>
              <a href={link.href} style={{ fontSize: '13px', color: '#444', textDecoration: 'none', lineHeight: 1.5 }}
                onMouseOver={e => e.target.style.color='#111'}
                onMouseOut={e => e.target.style.color='#444'}>
                {link.label}
              </a>
            </div>
          ))}
        </div>

        {/* Our story */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '20px', letterSpacing: '0.05em' }}>Our story</h4>
          {[
            { label: 'About US', href: '/pages/about' },
            { label: 'Contact Us', href: '/pages/contact' },
          ].map(link => (
            <div key={link.label} style={{ marginBottom: '14px' }}>
              <a href={link.href} style={{ fontSize: '13px', color: '#444', textDecoration: 'none', lineHeight: 1.5 }}
                onMouseOver={e => e.target.style.color='#111'}
                onMouseOut={e => e.target.style.color='#444'}>
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
        borderTop: '1px solid #ddd',
        paddingTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Copyright + Terms */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#666' }}>© 2026 Vestoraa, Co.</span>
          <a href="/policies/terms-of-service" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Terms and Policies</a>
        </div>

        {/* Payment icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Visa */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
            <text x="50%" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1f71" fontFamily="Arial">VISA</text>
          </svg>
          {/* Mastercard */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
            <circle cx="14" cy="12" r="8" fill="#eb001b" opacity="0.9"/>
            <circle cx="24" cy="12" r="8" fill="#f79e1b" opacity="0.9"/>
            <path d="M19 6.8a8 8 0 0 1 0 10.4A8 8 0 0 1 19 6.8z" fill="#ff5f00"/>
          </svg>
          {/* Amex */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#2557d6' }}>
            <text x="50%" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff" fontFamily="Arial">AMEX</text>
          </svg>
          {/* PayPal */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}>
            <text x="50%" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#003087" fontFamily="Arial">PayPal</text>
          </svg>
          {/* Apple Pay */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#000' }}>
            <text x="50%" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#fff" fontFamily="Arial">Apple Pay</text>
          </svg>
          {/* Shop Pay */}
          <svg width="38" height="24" viewBox="0 0 38 24" style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#5a31f4' }}>
            <text x="50%" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#fff" fontFamily="Arial">Shop Pay</text>
          </svg>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
          }
          footer > div:last-child {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </footer>
  );
}
