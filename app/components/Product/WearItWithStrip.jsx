import { useState } from 'react';

export function WearItWithStrip({ products }) {
  const [start, setStart] = useState(0);
  const visible = 4;

  if (!products || products.length === 0) return null;

  const canPrev = start > 0;
  const canNext = start + visible < products.length;
  const items = products.slice(start, start + visible);

  const NavBtn = ({ dir }) => {
    const active = dir === 'prev' ? canPrev : canNext;
    return (
      <button
        onClick={() => setStart(dir === 'prev' ? Math.max(0, start - 1) : Math.min(products.length - visible, start + 1))}
        disabled={!active}
        style={{
          width: '32px', height: '32px', borderRadius: '50%',
          border: '1px solid ' + (active ? '#aaa' : '#e0e0e0'),
          background: '#fff', color: active ? '#111' : '#ccc',
          cursor: active ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', lineHeight: 1, flexShrink: 0,
        }}>
        {dir === 'prev' ? '‹' : '›'}
      </button>
    );
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111', letterSpacing: '0.02em' }}>
          Wear it with
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <NavBtn dir="prev" />
          <NavBtn dir="next" />
        </div>
      </div>

      {/* Products — 4 in a row */}
      <div className="wear-it-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
      }}>
        {items.map((p) => {
          const img = p.featuredImage;
          const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
          const currency = p.priceRange?.minVariantPrice?.currencyCode || 'AUD';
          const symbol = currency === 'AUD' ? 'A$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
          return (
            <div key={p.id} style={{ position: 'relative' }}>
              {/* Image */}
              <div style={{
                position: 'relative', aspectRatio: '3/4',
                backgroundColor: '#f5f5f5', borderRadius: '4px',
                overflow: 'hidden', marginBottom: '6px',
              }}>
                {img
                  ? <img src={img.url} alt={img.altText || p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                }
                {/* Wishlist btn */}
                <button style={{
                  position: 'absolute', top: '6px', right: '6px',
                  width: '26px', height: '26px', borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: '1px solid #ddd', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', color: '#555',
                }}>♡</button>
              </div>
              {/* Info */}
              <a href={'/products/' + p.handle} style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ fontSize: '10px', color: '#666', margin: '0 0 1px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.vendor || ''}
                </p>
                <p style={{ fontSize: '11px', color: '#333', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                  {p.title}
                </p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>
                  {symbol}{price.toFixed(2)}
                </p>
              </a>
            </div>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll fallback via CSS */}
      <style>{`
        @media (max-width: 600px) {
          .wear-it-grid {
            display: flex !important;
            overflow-x: auto;
            gap: 10px !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding-bottom: 4px;
          }
          .wear-it-grid::-webkit-scrollbar { display: none; }
          .wear-it-grid > div {
            flex: 0 0 42vw;
            min-width: 42vw;
          }
        }
      `}</style>
    </div>
  );
}
