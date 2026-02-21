import { useState } from 'react';
import { useFetcher } from 'react-router';

function QuickAddBtn({ variantId, productTitle }) {
  const fetcher = useFetcher();
  const adding = fetcher.state !== 'idle';
  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="cartAction" value="ADD_TO_CART" />
      <input type="hidden" name="lines" value={JSON.stringify([{ merchandiseId: variantId, quantity: 1 }])} />
      <button type="submit" disabled={adding || !variantId} title={"Add " + productTitle + " to cart"}
        style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: adding ? '#2a9d5c' : '#fff',
          border: '1px solid #ddd',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: variantId ? 'pointer' : 'not-allowed',
          color: adding ? '#fff' : '#111', fontSize: '18px', fontWeight: '300',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          zIndex: 2,
        }}>
        {adding ? '✓' : '+'}
      </button>
    </fetcher.Form>
  );
}

export function WearItWithStrip({ products }) {
  const [start, setStart] = useState(0);
  const visible = 4;
  if (!products || products.length === 0) return null;

  const canPrev = start > 0;
  const canNext = start + visible < products.length;
  const items = products.slice(start, start + visible);

  return (
    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #eee' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Wear it with
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setStart(Math.max(0, start - visible))}
            disabled={!canPrev}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1px solid ' + (canPrev ? '#999' : '#ddd'),
              background: '#fff', color: canPrev ? '#111' : '#ccc',
              cursor: canPrev ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>‹</button>
          <button
            onClick={() => setStart(Math.min(products.length - visible, start + visible))}
            disabled={!canNext}
            style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: '1px solid ' + (canNext ? '#999' : '#ddd'),
              background: '#fff', color: canNext ? '#111' : '#ccc',
              cursor: canNext ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}>›</button>
        </div>
      </div>

      {/* Products grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {items.map((p) => {
          const img = p.featuredImage;
          const price = parseFloat(p.priceRange?.minVariantPrice?.amount || 0);
          const currency = p.priceRange?.minVariantPrice?.currencyCode || 'USD';
          const variantId = p.variants?.nodes?.[0]?.id;
          const symbol = currency === 'AUD' ? 'A$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
          return (
            <div key={p.id} style={{ position: 'relative' }}>
              <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f5f5f5', borderRadius: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                {img
                  ? <img src={img.url} alt={img.altText || p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                }
                <QuickAddBtn variantId={variantId} productTitle={p.title} />
              </div>
              <a href={'/products/' + p.handle} style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ fontSize: '11px', color: '#555', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{p.title}</p>
                <p style={{ fontSize: '12px', fontWeight: '700', color: '#111', margin: 0 }}>{symbol}{price.toFixed(2)}</p>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
