import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';

export function ProductForm({ productOptions, selectedVariant }) {
  const navigate = useNavigate();

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.name === 'Color' || option.name === 'Colour') {
          return (
            <div key={option.name} className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Colour</span>
                {option.optionValues.find(v => v.selected) && (
                  <span className="text-xs text-gray-500">
                    {option.optionValues.find(v => v.selected)?.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {option.optionValues.map((value) => {
                  const variant = value.firstSelectableVariant;
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  const swatchImage = value.swatch?.image?.previewImage?.url || variant?.image?.url;
                  const swatchColor = value.swatch?.color;
                  
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      title={value.name}
                      style={{
                        outline: isSelected ? '2px solid #111' : '1px solid #ddd',
                        outlineOffset: isSelected ? '2px' : '0',
                        opacity: isUnavailable ? 0.4 : 1,
                      }}
                      className="relative w-12 h-16 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                      {swatchImage ? (
                        <img
                          src={swatchImage}
                          alt={value.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: swatchColor || '#ccc' }}
                        />
                      )}
                      {isUnavailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="absolute inset-0 bg-white opacity-50" />
                          <div className="absolute w-full h-px bg-gray-400 rotate-45" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        if (option.name === 'Size') {
          return (
            <div key={option.name} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Size</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {option.optionValues.map((value) => {
                  const isSelected = value.selected;
                  const isUnavailable = !value.available;
                  return (
                    <Link
                      key={value.name}
                      to={value.to}
                      preventScrollReset
                      replace
                      style={{
                        border: isSelected ? '2px solid #111' : '1px solid #ddd',
                        color: isUnavailable ? '#bbb' : isSelected ? '#111' : '#444',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                        backgroundColor: isSelected ? '#111' : '#fff',
                      }}
                      className="min-w-[42px] h-9 flex items-center justify-center text-xs font-medium px-2 transition-all hover:border-gray-600"
                      style={{
                        border: isSelected ? '2px solid #111' : '1px solid #ddd',
                        color: isUnavailable ? '#bbb' : isSelected ? '#fff' : '#444',
                        textDecoration: isUnavailable ? 'line-through' : 'none',
                        backgroundColor: isSelected ? '#111' : '#fff',
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
          <div key={option.name} className="mb-4">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{option.name}</div>
            <div className="flex flex-wrap gap-1">
              {option.optionValues.map((value) => {
                const isSelected = value.selected;
                return (
                  <Link
                    key={value.name}
                    to={value.to}
                    preventScrollReset
                    replace
                    style={{
                      border: isSelected ? '2px solid #111' : '1px solid #ddd',
                      backgroundColor: isSelected ? '#111' : '#fff',
                      color: isSelected ? '#fff' : '#444',
                    }}
                    className="px-3 h-9 flex items-center text-xs font-medium transition-all"
                  >
                    {value.name}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-4 space-y-2">
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            backgroundColor: selectedVariant?.availableForSale ? '#00a898' : '#ccc',
            color: '#fff',
            width: '100%',
            padding: '14px',
            fontSize: '13px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            border: 'none',
            cursor: selectedVariant?.availableForSale ? 'pointer' : 'not-allowed',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>

        {selectedVariant?.availableForSale && (
          <button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <svg viewBox="0 0 16 20" fill="currentColor" style={{ height: '16px' }}>
              <path d="M13.18 10.36c-.02-2.06 1.69-3.06 1.77-3.11-1.95-2.85-4.97-3.24-6.03-3.28-2.56-.26-5.01 1.5-6.31 1.5-1.3 0-3.29-1.47-5.42-1.43C-4.93 4.11-7.26 5.54-8.5 7.75c-2.54 4.4-.65 10.89 1.8 14.46 1.2 1.75 2.63 3.71 4.5 3.64 1.82-.07 2.5-1.17 4.7-1.17 2.19 0 2.81 1.17 4.72 1.13 1.95-.03 3.18-1.76 4.37-3.52 1.38-2.01 1.95-3.96 1.98-4.06-.04-.02-3.8-1.46-3.84-5.81l.45-.06z"/>
            </svg>
            Pay
          </button>
        )}
      </div>

      {!selectedVariant?.availableForSale && (
        <p style={{ color: '#999', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>
          This item is currently sold out
        </p>
      )}
    </div>
  );
}
