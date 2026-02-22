import { useState } from 'react';

export function WearItWithStrip({ products }) {
  const [start, setStart] = useState(0);

  if (!products || products.length === 0) return null;

  // Mobile: show 3, Desktop: show 4
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const visible = 3;
  const canPrev = start > 0;
  const canNext = start + visible < products.length;
  const items = products.slice(start, start + visible);

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wear it with</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['prev','next'].map(dir => {
            const active = dir === 'prev' ? canPrev : canNext;
            return (
              <button key={dir}
                onClick={() => setStart(dir === 'prev' ? Math.max(0, start - 1) : Math.min(products.length - visible, start + 1))}
                disabled={!active}
                style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid ' + (active ? '#999' : '#ddd'), background: '#fff', color: active ? '#111' : '#ccc', cursor: active ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                {dir === 'prev' ? '‹' : '›'}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {items.map((p) => {
          const img = p.featuredImage;
          const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
          const currency = p.priceRange?.minVariantPrice?.currencyCode || 'AUD';
          const symbol = currency === 'AUD' ? 'A$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
          return (
            <div key={p.id} style={{ minWidth: 0 }}>
              <a href={'/products/' + p.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '133%', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                  {img
                    ? <img src={img.url} alt={img.altText || p.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                    : <div style={{ position: 'absolute', inset: 0, backgroundColor: '#eee' }} />
                  }
                </div>
                <p style={{ fontSize: '10px', color: '#555', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>{symbol}{price.toFixed(2)}</p>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
