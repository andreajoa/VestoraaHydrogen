import { Link } from 'react-router';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useState, useEffect } from 'react';
import { SizeGuideModal } from '~/components/Product/SizeGuideModal';

const GOLD = '#C9A84C';

function WishlistButton({ productHandle }) {
  const [wished, setWished] = useState(false);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('vestoraa_wishlist') || '[]');
      setWished(stored.includes(productHandle));
    } catch {}
  }, [productHandle]);
  const toggle = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('vestoraa_wishlist') || '[]');
      const next = stored.includes(productHandle) ? stored.filter(id => id !== productHandle) : [...stored, productHandle];
      localStorage.setItem('vestoraa_wishlist', JSON.stringify(next));
      setWished(next.includes(productHandle));
    } catch {}
  };
  return (
    <button onClick={toggle} type="button" style={{ width: '54px', height: '54px', flexShrink: 0, border: wished ? `1.5px solid ${GOLD}` : '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: wished ? '#e33' : '#bbb', transition: 'all 0.2s' }} title={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
      {wished ? '\u2665' : '\u2661'}
    </button>
  );
}

export function ProductForm({ productOptions, selectedVariant }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  if (!productOptions || productOptions.length === 0) return null;

  const colorOption = productOptions.find(o => ['Color','Colour','color','colour'].includes(o.name));
  const sizeOption = productOptions.find(o => ['Size','size'].includes(o.name));
  const otherOptions = productOptions.filter(o => !['Color','Colour','color','colour','Size','size'].includes(o.name));
  const selectedColorValue = colorOption?.optionValues?.find(v => v.selected);
  const selectedSizeValue = sizeOption?.optionValues?.find(v => v.selected);

  return (
    <div>
      {colorOption && (
        <div style={{ marginBottom: '18px' }}>
          <p style={{ fontSize: '12px', color: '#555', margin: '0 0 10px' }}>
            Colour: <strong style={{ color: '#111', fontWeight: '700' }}>{selectedColorValue?.name || ''}</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {colorOption.optionValues.map((value) => {
              const sel = value.selected;
              const unavail = !value.available;
              const img = value.swatch?.image?.previewImage?.url || value.firstSelectableVariant?.image?.url;
              const color = value.swatch?.color;
              return (
                <Link key={value.name} to={value.to || '#'} preventScrollReset replace prefetch="intent" title={value.name}
                  style={{ display: 'block', width: '62px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, textDecoration: 'none', opacity: unavail ? 0.35 : 1, outline: sel ? `2px solid ${GOLD}` : '1.5px solid #ddd', outlineOffset: sel ? '2px' : '0', transition: 'all 0.15s ease' }}>
                  {img ? <img src={img} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: color || '#eee' }} />}
                  {unavail && (<div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)' }}><div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: '#999', transform: 'rotate(45deg)' }} /></div>)}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {sizeOption && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <button type="button" onClick={() => setSizeOpen(o => !o)}
                style={{ width: '100%', height: '48px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', fontSize: '13px', color: selectedSizeValue ? '#111' : '#888', cursor: 'pointer' }}>
                <span>{selectedSizeValue ? selectedSizeValue.name : 'Pick a size...'}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>\u25be</span>
              </button>
              {sizeOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, backgroundColor: '#fff', border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 6px 6px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '240px', overflowY: 'auto' }}>
                  {sizeOption.optionValues.map((value) => {
                    const sel = value.selected;
                    const unavail = !value.available;
                    return (
                      <Link key={value.name} to={value.to || '#'} preventScrollReset replace prefetch="intent" onClick={() => setSizeOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', fontSize: '13px', color: unavail ? '#bbb' : sel ? '#111' : '#444', backgroundColor: sel ? '#fffcf0' : '#fff', fontWeight: sel ? '700' : '400', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', pointerEvents: unavail ? 'none' : 'auto' }}>
                        <span style={{ textDecoration: unavail ? 'line-through' : 'none' }}>{value.name}</span>
                        {unavail && <span style={{ fontSize: '10px', color: '#bbb' }}>Sold out</span>}
                        {sel && <span style={{ color: GOLD, fontSize: '12px' }}>\u2713</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <button type="button" onClick={() => setSizeGuideOpen(true)}
              style={{ height: '48px', padding: '0 14px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#333', whiteSpace: 'nowrap', flexShrink: 0 }}>
              \ud83d\udcd0 SIZE GUIDE
            </button>
          </div>
        </div>
      )}

      {otherOptions.map((option) => (
        <div key={option.name} style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px' }}>{option.name}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {option.optionValues.map((value) => {
              const sel = value.selected;
              return (
                <Link key={value.name} to={value.to || '#'} preventScrollReset replace prefetch="intent"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', fontSize: '12px', borderRadius: '6px', border: sel ? `2px solid ${GOLD}` : '1px solid #ddd', backgroundColor: sel ? '#fffcf0' : '#fff', color: '#333', textDecoration: 'none', fontWeight: sel ? '700' : '400' }}>
                  {value.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px', alignItems: 'stretch' }}>
        <AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{ height: '54px', backgroundColor: selectedVariant?.availableForSale ? '#111' : '#ccc', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em' }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton>
        <WishlistButton productHandle={selectedVariant?.product?.handle || ''} />
      </div>

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '10px' }}>Currently unavailable</p>
      )}

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
