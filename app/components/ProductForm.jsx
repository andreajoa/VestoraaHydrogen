import { Link, useNavigate } from 'react-router';
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
    <button onClick={toggle} type="button" className="wishlist-btn" style={{ width: '56px', height: '56px', flexShrink: 0, border: wished ? '1.5px solid ' + GOLD : '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: wished ? '#e33' : '#bbb', transition: 'all 0.2s' }} title={wished ? 'Remove from wishlist' : 'Add to wishlist'}>
      {wished ? '♥' : '♡'}
    </button>
  );
}

function getOptionLink(value) {
  if (value.to) return value.to;
  if (value.variantUriQuery) return '?' + value.variantUriQuery;
  if (value.search) return '?' + value.search;
  return '#';
}

export function ProductForm({ productOptions, selectedVariant }) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const navigate = useNavigate();

  if (!productOptions || productOptions.length === 0) return null;

  const colorOption = productOptions.find(o => ['Color','Colour','color','colour'].includes(o.name));
  const sizeOption = productOptions.find(o => ['Size','size'].includes(o.name));
  const otherOptions = productOptions.filter(o => !['Color','Colour','color','colour','Size','size'].includes(o.name));
  const selectedColorValue = colorOption?.optionValues?.find(v => v.selected);
  const selectedSizeValue = sizeOption?.optionValues?.find(v => v.selected);
  const [userPickedSize, setUserPickedSize] = useState(false);
  const displaySize = userPickedSize ? selectedSizeValue : null;

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
              const exists = value.exists !== undefined ? value.exists : true;
              const img = value.swatch?.image?.previewImage?.url || value.firstSelectableVariant?.image?.url;
              const color = value.swatch?.color;
              const isDifferentProduct = value.isDifferentProduct;
              const linkTo = getOptionLink(value);

              if (isDifferentProduct) {
                return (
                  <Link key={value.name} to={linkTo} preventScrollReset replace prefetch="intent" title={value.name}
                    style={{ display: 'block', width: '62px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, textDecoration: 'none', opacity: unavail ? 0.35 : 1, outline: sel ? '2px solid ' + GOLD : '1.5px solid #ddd', outlineOffset: sel ? '2px' : '0', transition: 'all 0.15s ease' }}>
                    {img ? <img src={img} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: color || '#eee' }} />}
                    {unavail && (<div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)' }}><div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: '#999', transform: 'rotate(45deg)' }} /></div>)}
                  </Link>
                );
              }

              return (
                <button
                  key={value.name}
                  type="button"
                  disabled={!exists}
                  title={value.name}
                  onClick={() => {
                    if (!sel && exists) {
                      navigate(linkTo, { replace: true, preventScrollReset: true });
                    }
                  }}
                  style={{ display: 'block', width: '62px', height: '80px', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, textDecoration: 'none', opacity: unavail ? 0.35 : !exists ? 0.2 : 1, outline: sel ? '2px solid ' + GOLD : '1.5px solid #ddd', outlineOffset: sel ? '2px' : '0', transition: 'all 0.15s ease', cursor: exists ? 'pointer' : 'not-allowed', padding: 0, border: 'none', background: 'none' }}>
                  {img ? <img src={img} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', backgroundColor: color || '#eee' }} />}
                  {unavail && exists && (<div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.5)' }}><div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '1px', background: '#999', transform: 'rotate(45deg)' }} /></div>)}
                </button>
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
                <span style={{ color: userPickedSize && selectedSizeValue ? '#111' : '#888' }}>{userPickedSize && selectedSizeValue ? selectedSizeValue.name : 'Pick a size'}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>▾</span>
              </button>
              {sizeOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, backgroundColor: '#fff', border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 6px 6px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '240px', overflowY: 'auto' }}>
                  {sizeOption.optionValues.map((value) => {
                    const sel = value.selected;
                    const unavail = !value.available;
                    const exists = value.exists !== undefined ? value.exists : true;
                    const linkTo = getOptionLink(value);
                    return (
                      <button
                        key={value.name}
                        type="button"
                        disabled={!exists || unavail}
                        onClick={() => {
                          if (!sel && exists && !unavail) {
                            navigate(linkTo, { replace: true, preventScrollReset: true });
                          }
                          setSizeOpen(false);
                          setUserPickedSize(true);
                        }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', fontSize: '13px', color: unavail ? '#bbb' : sel ? '#111' : '#444', backgroundColor: sel ? '#fffcf0' : '#fff', fontWeight: sel ? '700' : '400', textDecoration: 'none', borderBottom: '1px solid #f5f5f5', cursor: (unavail || !exists) ? 'not-allowed' : 'pointer', width: '100%', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: '1px', borderBottomColor: '#f5f5f5', textAlign: 'left' }}>
                        <span style={{ textDecoration: unavail ? 'line-through' : 'none' }}>{value.name}</span>
                        <span>
                          {unavail && <span style={{ fontSize: '10px', color: '#bbb' }}>Sold out</span>}
                          {sel && !unavail && <span style={{ color: GOLD, fontSize: '12px' }}>✓</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button type="button" onClick={() => setSizeGuideOpen(true)}
              style={{ height: '48px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: '#333', whiteSpace: 'nowrap', flexShrink: 0 }}>
              📐 SIZE GUIDE
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
              const exists = value.exists !== undefined ? value.exists : true;
              const linkTo = getOptionLink(value);
              return (
                <button
                  key={value.name}
                  type="button"
                  disabled={!exists}
                  onClick={() => {
                    if (!sel && exists) {
                      navigate(linkTo, { replace: true, preventScrollReset: true });
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 16px', fontSize: '12px', borderRadius: '6px', border: sel ? '2px solid ' + GOLD : '1px solid #ddd', backgroundColor: sel ? '#fffcf0' : '#fff', color: '#333', textDecoration: 'none', fontWeight: sel ? '700' : '400', cursor: exists ? 'pointer' : 'not-allowed', opacity: exists ? 1 : 0.3 }}>
                  {value.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: '8px', marginTop: '24px', alignItems: 'stretch', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <div className="add-to-bag-wrapper" style={{ flex: 1, minWidth: 0 }}><AddToCartButton
          disabled={!selectedVariant?.availableForSale}
          lines={selectedVariant ? [{ merchandiseId: selectedVariant.id, quantity: 1 }] : []}
          style={{
            height: '56px',
            backgroundColor: selectedVariant?.availableForSale ? '#111' : '#ccc',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {selectedVariant?.availableForSale ? 'ADD TO BAG' : 'SOLD OUT'}
        </AddToCartButton></div>
        <WishlistButton productHandle={selectedVariant?.product?.handle || ''} />
      </div>

      {!selectedVariant?.availableForSale && (
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '10px' }}>Currently unavailable</p>
      )}

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}
