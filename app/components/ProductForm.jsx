import { Link } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useState, useEffect } from 'react';

const GOLD = '#C9A84C';

function useIsDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const handler = (e) => setDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return dark;
}

export function ProductForm({ productOptions, selectedVariant, onSizeGuideClick }) {
  const [wished, setWished] = useState(false);
  const isDark = useIsDarkMode();

  const btnBg = isDark ? '#ffffff' : '#111111';
  const btnText = isDark ? '#111111' : '#ffffff';

  if (!productOptions || productOptions.length === 0) return null;

  return (
    <div>
      {productOptions.map((option) => {

        // ---- COLOUR OPTION ----
        if (['Color','Colour','color','colour'].includes(option.name)) {
          const selectedValue = option.optionValues.find(v => v.selected);
          return (
            <div key={option.name} style={{ marginBottom: '18px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px', margin: '0 0 10px' }}>
                Colour: <strong style={{ color: '#111', fontWeight: '600' }}>{selectedValue?.name || ''}</strong>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {option.optionValues.map((value) => {
                  const sel = value.selected;
                  const unavail = !value.available;
                  const img = value.swatch?.image?.previewImage?.url || value.firstSelectableVariant?.image?.url;
                  const color = value.swatch?.color;
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      prefetch='intent'
                      title={value.name}
                      style={{
                        display: 'block',
                        width: '62px',
                        height: '80px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        textDecoration: 'none',
                        opacity: unavail ? 0.35 : 1,
                        outline: sel ? ('3px solid ' + GOLD) : '2px solid transparent',
                        outlineOffset: sel ? '3px' : '0',
                        boxShadow: sel ? ('0 0 0 1px ' + GOLD) : '0 0 0 1px #ddd',
                        transform: sel ? 'scale(1.06)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {img
                        ? <img src={img} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                        : <div style={{ width: '100%', height: '100%', backgroundColor: color || '#eee' }} />
                      }
                      {unavail && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)' }}>
                          <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: '#999', transform: 'rotate(45deg)' }} />
                        </div>
                      )}
                      {sel && (
                        <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: GOLD, boxShadow: '0 0 3px rgba(0,0,0,0.3)' }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        // ---- SIZE OPTION ----
        if (['Size','size'].includes(option.name)) {
          return (
            <div key={option.name} style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', margin: '0 0 8px' }}>Size</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {option.optionValues.map((value) => {
                  const sel = value.selected;
                  const unavail = !value.available;
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      prefetch='intent'
                      title={value.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '52px',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        border: sel ? ('3px solid ' + GOLD) : '1px solid #ddd',
                        backgroundColor: sel ? '#fffcf0' : '#fff',
                        color: unavail ? '#ccc' : sel ? '#111' : '#555',
                        fontSize: '13px',
                        fontWeight: sel ? '800' : '400',
                        letterSpacing: sel ? '0.05em' : '0',
                        textDecoration: unavail ? 'line-through' : 'none',
                        cursor: unavail ? 'not-allowed' : 'pointer',
                        boxShadow: sel ? ('0 2px 8px rgba(201,168,76,0.35)') : 'none',
                        transform: sel ? 'scale(1.08)' : 'scale(1)',
                        transition: 'all 0.18s ease',
                        textDecoration: 'none',
                      }}
                    >
                      {value.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        // ---- OTHER OPTIONS ----
        return (
          <div key={option.name} style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', margin: '0 0 8px' }}>{option.name}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {option.optionValues.map((value) => {
                const sel = value.selected;
                return (
                  <Link key={value.name} to={value.to} preventScrollReset replace prefetch='intent'
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', fontSize: '12px', borderRadius: '12px', border: sel ? ('3px solid ' + GOLD) : '1px solid #ddd', backgroundColor: sel ? '#fffcf0' : '#fff', color: '#333', textDecoration: 'none', fontWeight: sel ? '700' : '400', transition: 'all 0.15s' }}
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ADD TO BAG ROW */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', alignItems: 'stretch' }}>
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            flex: 1,
            height: '50px',
            backgroundColor: selectedVariant?.availableForSale ? btnBg : '#ccc',
            color: selectedVariant?.availableForSale ? btnText : '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.25s, color 0.25s',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>
        <button
          onClick={() => setWished(w => !w)}
          aria-label='Save to wishlist'
          style={{
            width: '50px', height: '50px', flexShrink: 0,
            border: wished ? ('1px solid ' + GOLD) : '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: wished ? '#fffcf0' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '20px',
            color: wished ? '#e33' : '#bbb',
            transition: 'all 0.2s',
          }}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {/* APPLE PAY */}
      {selectedVariant?.availableForSale && (
        <button style={{
          width: '100%', height: '46px', marginTop: '8px',
          backgroundColor: '#000', color: '#fff',
          border: 'none', borderRadius: '12px',
          fontSize: '15px', fontWeight: '500',
          cursor: 'pointer',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          letterSpacing: '0.02em',
        }}>
           Pay
        </button>
      )}

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '10px' }}>Currently unavailable</p>
      )}
    </div>
  );
}