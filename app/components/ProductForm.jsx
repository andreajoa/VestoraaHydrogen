import { Link } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useState, useEffect } from 'react';

const GOLD = '#C9A84C';

function useDarkBackground() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    const rgb = bg.match(/\d+/g);
    if (rgb) {
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      setIsDark(brightness < 128);
    }
  }, []);
  return isDark;
}

export function ProductForm({ productOptions, selectedVariant, onSizeGuideClick }) {
  const [wished, setWished] = useState(false);
  const isDark = useDarkBackground();
  const btnBg = isDark ? '#fff' : '#111';
  const btnColor = isDark ? '#111' : '#fff';

  if (!productOptions || productOptions.length === 0) return null;

  return (
    <div>
      {productOptions.map((option) => {
        const isColor = ['Color','Colour','color','colour'].includes(option.name);
        const isSize = ['Size','size'].includes(option.name);

        if (isColor) {
          const selectedValue = option.optionValues.find(v => v.selected);
          return (
            <div key={option.name} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>
                Colour: <strong style={{ color: '#111' }}>{selectedValue?.name || ''}</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  const img = value.swatch?.image?.previewImage?.url || value.firstSelectableVariant?.image?.url;
                  const color = value.swatch?.color;
                  return (
                    <Link key={value.name} to={value.to} preventScrollReset replace prefetch='intent'
                      title={value.name}
                      style={{
                        display: 'block', width: '60px', height: '78px', flexShrink: 0,
                        borderRadius: '12px', overflow: 'hidden', position: 'relative',
                        textDecoration: 'none', opacity: isUnavailable ? 0.4 : 1,
                        outline: isSelected ? ('3px solid ' + GOLD) : '1px solid #e0e0e0',
                        outlineOffset: isSelected ? '3px' : '0',
                        transition: 'outline 0.2s, transform 0.15s',
                        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      }}
                    >
                      {img
                        ? <img src={img} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                        : <div style={{ width: '100%', height: '100%', backgroundColor: color || '#ddd' }} />
                      }
                      {isUnavailable && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)' }}>
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: '#999', transform: 'rotate(45deg)' }} />
                        </div>
                      )}
                      {isSelected && (
                        <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: GOLD }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        if (isSize) {
          return (
            <div key={option.name} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  return (
                    <Link key={value.name} to={value.to} preventScrollReset replace prefetch='intent'
                      title={value.name}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: '48px', height: '44px', padding: '0 12px',
                        fontSize: '13px', fontWeight: isSelected ? '700' : '400',
                        borderRadius: '12px',
                        border: isSelected ? ('3px solid ' + GOLD) : '1px solid #ddd',
                        backgroundColor: isSelected ? '#fffdf5' : '#fff',
                        color: isUnavailable ? '#ccc' : isSelected ? '#111' : '#444',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: isSelected ? ('0 0 0 1px ' + GOLD) : 'none',
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
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

        return (
          <div key={option.name} style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>{option.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {option.optionValues.map((value) => {
                const isSelected = value.selected;
                return (
                  <Link key={value.name} to={value.to} preventScrollReset replace prefetch='intent'
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px', fontSize: '12px', borderRadius: '12px', border: isSelected ? ('3px solid ' + GOLD) : '1px solid #ddd', backgroundColor: isSelected ? '#fffdf5' : '#fff', color: '#333', textDecoration: 'none', transition: 'all 0.15s' }}
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            flex: 1, height: '50px',
            backgroundColor: selectedVariant?.availableForSale ? btnBg : '#ccc',
            color: selectedVariant?.availableForSale ? btnColor : '#fff',
            border: 'none', borderRadius: '12px',
            fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em',
            cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s, color 0.2s',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>
        <button onClick={() => setWished(!wished)}
          style={{ width: '50px', height: '50px', flexShrink: 0, border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: wished ? '#e33' : '#bbb', transition: 'color 0.2s' }}
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {selectedVariant?.availableForSale && (
        <button style={{ width: '100%', height: '46px', marginTop: '8px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}></span>
          <span>Pay</span>
        </button>
      )}

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '10px' }}>Currently unavailable</p>
      )}
    </div>
  );
}