import { useState } from 'react';

export function WearItWithStrip({ products }) {
  const [start, setStart] = useState(0);
  const visible = 4;

  if (!products || products.length === 0) return null;

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
                style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  border: '1px solid ' + (active ? '#999' : '#ddd'),
                  background: '#fff', color: active ? '#111' : '#ccc',
                  cursor: active ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', lineHeight: 1,
                }}>{dir === 'prev' ? '‹' : '›'}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {items.map((p) => {
          const img = p.featuredImage;
          const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
          const currency = p.priceRange?.minVariantPrice?.currencyCode || 'AUD';
          const symbol = currency === 'AUD' ? 'A$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
          return (
            <div key={p.id}>
              <a href={'/products/' + p.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{
                  width: '100%',
                  height: '140px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '5px',
                  position: 'relative',
                }}>
                  {img
                    ? <img src={img.url} alt={img.altText || p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                  }
                  <button onClick={e => e.preventDefault()} style={{
                    position: 'absolute', top: '4px', right: '4px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.92)', border: '1px solid #ddd',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '10px', color: '#555',
                  }}>♡</button>
                </div>
                <p style={{ fontSize: '8px', color: '#888', margin: '0 0 1px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.vendor || ''}</p>
                <p style={{ fontSize: '10px', color: '#333', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>{symbol}{price.toFixed(2)}</p>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
