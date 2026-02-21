import { Link } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useState } from 'react';

const GOLD = '#C9A84C';

export function ProductForm({ productOptions, selectedVariant, onSizeGuideClick }) {
  const [wished, setWished] = useState(false);

  return (
    <div>
      {productOptions.map((option) => {

        if (option.name === 'Color' || option.name === 'Colour' || option.name === 'color' || option.name === 'colour') {
          const selectedValue = option.optionValues.find(v => v.selected);
          return (
            <div key={option.name} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#333', marginBottom: '10px' }}>
                <span style={{ fontWeight: '400' }}>Colour: </span>
                <span style={{ fontWeight: '600', color: '#111' }}>{selectedValue?.name || ''}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  const swatchImg = value.swatch?.image?.previewImage?.url || value.firstSelectableVariant?.image?.url;
                  const swatchColor = value.swatch?.color;
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      title={value.name}
                      style={{
                        display: 'block',
                        width: '60px',
                        height: '78px',
                        flexShrink: 0,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        textDecoration: 'none',
                        opacity: isUnavailable ? 0.4 : 1,
                        outline: isSelected ? ('3px solid ' + GOLD) : '1px solid #ddd',
                        outlineOffset: isSelected ? '3px' : '0',
                        transition: 'outline 0.2s, outline-offset 0.2s',
                      }}
                    >
                      {swatchImg ? (
                        <img src={swatchImg} alt={value.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '10px' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: swatchColor || '#ccc', borderRadius: '10px' }} />
                      )}
                      {isUnavailable && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '100%', height: '1px', backgroundColor: '#aaa', transform: 'rotate(45deg)' }} />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        if (option.name === 'Size' || option.name === 'size') {
          return (
            <div key={option.name} style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px', fontWeight: '400' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      title={value.name}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        minWidth: '48px', height: '44px', padding: '0 10px',
                        fontSize: '13px', fontWeight: isSelected ? '700' : '400',
                        borderRadius: '12px',
                        border: isSelected ? ('3px solid ' + GOLD) : '1px solid #ddd',
                        backgroundColor: isSelected ? '#fff' : '#fff',
                        color: isUnavailable ? '#ccc' : isSelected ? '#111' : '#444',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                        boxShadow: isSelected ? ('0 0 0 1px ' + GOLD) : 'none',
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
            <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px' }}>{option.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {option.optionValues.map((value) => {
                const isSelected = value.selected;
                return (
                  <Link key={value.name} to={value.to} preventScrollReset replace
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 14px', fontSize: '12px', borderRadius: '12px', border: isSelected ? ('3px solid ' + GOLD) : '1px solid #ddd', backgroundColor: '#fff', color: isSelected ? '#111' : '#444', textDecoration: 'none', transition: 'all 0.15s' }}
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ADD TO BAG + wishlist */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'stretch' }}>
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            flex: 1,
            backgroundColor: selectedVariant?.availableForSale ? '#111' : '#ccc',
            color: '#fff',
            border: 'none',
            padding: '0 16px',
            height: '48px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
            borderRadius: '12px',
            transition: 'background-color 0.2s',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>
        <button
          onClick={() => setWished(!wished)}
          style={{ width: '48px', height: '48px', flexShrink: 0, border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '18px', color: wished ? '#e00' : '#999', transition: 'color 0.2s' }}
          title='Save to wishlist'
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {selectedVariant?.availableForSale && (
        <button style={{ width: '100%', height: '44px', marginTop: '8px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '600', letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          ⌘ Pay
        </button>
      )}

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>This item is currently sold out</p>
      )}
    </div>
  );
}