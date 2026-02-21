import { Link } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useState } from 'react';

export function ProductForm({ productOptions, selectedVariant, onSizeGuideClick }) {
  const [wished, setWished] = useState(false);

  return (
    <div>
      {productOptions.map((option) => {

        // COLOR / COLOUR option — show as image thumbnails
        if (option.name === 'Color' || option.name === 'Colour' || option.name === 'color' || option.name === 'colour') {
          const selectedValue = option.optionValues.find(v => v.selected);
          return (
            <div key={option.name} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px' }}>
                <span style={{ fontWeight: '400' }}>Colour: </span>
                <span style={{ color: '#666' }}>{selectedValue?.name || ''}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  const swatchImg = value.swatch?.image?.previewImage?.url
                    || value.firstSelectableVariant?.image?.url;
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
                        width: '44px',
                        height: '58px',
                        flexShrink: 0,
                        outline: isSelected ? '2px solid #333' : '1px solid #ddd',
                        outlineOffset: isSelected ? '2px' : '0',
                        opacity: isUnavailable ? 0.4 : 1,
                        overflow: 'hidden',
                        position: 'relative',
                        textDecoration: 'none',
                      }}
                    >
                      {swatchImg ? (
                        <img
                          src={swatchImg}
                          alt={value.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: swatchColor || '#ccc' }} />
                      )}
                      {isUnavailable && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(255,255,255,0.5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
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

        // SIZE option — show as letter boxes
        if (option.name === 'Size' || option.name === 'size') {
          return (
            <div key={option.name} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px', fontWeight: '400' }}>Size</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '40px',
                        height: '36px',
                        padding: '0 8px',
                        fontSize: '12px',
                        fontWeight: isSelected ? '700' : '400',
                        border: isSelected ? '2px solid #111' : '1px solid #ccc',
                        backgroundColor: isSelected ? '#111' : '#fff',
                        color: isUnavailable ? '#bbb' : isSelected ? '#fff' : '#333',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                        cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
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

        // Other options
        return (
          <div key={option.name} style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px' }}>{option.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {option.optionValues.map((value) => {
                const isSelected = value.selected;
                return (
                  <Link
                    key={value.name}
                    to={value.to}
                    preventScrollReset
                    replace
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 12px', fontSize: '12px',
                      border: isSelected ? '2px solid #111' : '1px solid #ccc',
                      backgroundColor: isSelected ? '#111' : '#fff',
                      color: isSelected ? '#fff' : '#333',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ADD TO BAG + wishlist row */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'stretch' }}>
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            flex: 1,
            backgroundColor: selectedVariant?.availableForSale ? '#00b5ad' : '#ccc',
            color: '#fff',
            border: 'none',
            padding: '0 16px',
            height: '46px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.06em',
            cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>
        <button
          onClick={() => setWished(!wished)}
          style={{
            width: '46px', height: '46px', flexShrink: 0,
            border: '1px solid #ccc', backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '18px',
            color: wished ? '#e00' : '#999',
            transition: 'color 0.2s',
          }}
          title="Save to wishlist"
        >
          {wished ? '♥' : '♡'}
        </button>
      </div>

      {/* Apple Pay */}
      {selectedVariant?.availableForSale && (
        <button
          style={{
            width: '100%', height: '42px', marginTop: '8px',
            backgroundColor: '#000', color: '#fff', border: 'none',
            fontSize: '13px', fontWeight: '600', letterSpacing: '0.04em',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
        >
          <svg viewBox="0 0 24 10" fill="white" style={{ height: '14px' }}>
            <text x="0" y="10" fontSize="10" fontFamily="-apple-system,BlinkMacSystemFont,sans-serif" fontWeight="500"> Pay</text>
          </svg>
          ⌘ Pay
        </button>
      )}

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
          This item is currently sold out
        </p>
      )}
    </div>
  );
}
