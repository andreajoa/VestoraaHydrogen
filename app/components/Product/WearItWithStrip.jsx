import { useState } from 'react';
import { Link, useFetcher } from 'react-router';

function QuickAddBtn({ variantId, productTitle }) {
  const fetcher = useFetcher();
  const adding = fetcher.state !== 'idle';
  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="cartAction" value="ADD_TO_CART" />
      <input type="hidden" name="lines" value={JSON.stringify([{ merchandiseId: variantId, quantity: 1 }])} />
      <button type="submit" disabled={adding || !variantId} title={"Add " + productTitle + " to cart"}
        style={{ position: 'absolute', bottom: '6px', right: '6px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: adding ? '#2a9d5c' : '#111', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: variantId ? 'pointer' : 'not-allowed', color: '#fff', fontSize: '16px', fontWeight: '300', boxShadow: '0 2px 6px rgba(0,0,0,0.25)', flexShrink: 0 }}>
        {adding ? '✓' : '+'}
      </button>
    </fetcher.Form>
  );
}

export function WearItWithStrip({ products }) {
  const [start, setStart] = useState(0);
  const visible = 2;
  if (!products || products.length === 0) return null;

  const items = products.slice(start, start + visible);
  const canPrev = start > 0;
  const canNext = start + visible < products.length;

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Wear it with</p>
        <div style={{ display: 'flex', gap: '2px' }}>
          <button onClick={() => setStart(Math.max(0, start - visible))} disabled={!canPrev}
            style={{ width: '20px', height: '20px', border: '1px solid ' + (canPrev ? '#999' : '#eee'), background: '#fff', color: canPrev ? '#333' : '#ccc', cursor: canPrev ? 'pointer' : 'default', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
            &#8249;
          </button>
          <button onClick={() => setStart(Math.min(products.length - visible, start + visible))} disabled={!canNext}
            style={{ width: '20px', height: '20px', border: '1px solid ' + (canNext ? '#999' : '#eee'), background: '#fff', color: canNext ? '#333' : '#ccc', cursor: canNext ? 'pointer' : 'default', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
            &#8250;
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {items.map((product) => {
          const image = product.featuredImage || product.images?.nodes?.[0];
          const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
          const variantId = product.variants?.nodes?.[0]?.id;
          return (
            <div key={product.id} style={{ flex: 1, position: 'relative' }}>
              <Link to={"/products/" + product.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', aspectRatio: '2/3', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', marginBottom: '6px' }}>
                  {image
                    ? <img src={image.url} alt={image.altText || product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                  }
                  <QuickAddBtn variantId={variantId} productTitle={product.title} />
                </div>
                <p style={{ fontSize: '10px', color: '#555', margin: '0 0 2px', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#111', margin: 0 }}>${price.toFixed(2)}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
