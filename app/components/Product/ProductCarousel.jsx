import { useState } from 'react';
import { Link, useFetcher } from 'react-router';

function AddToCartQuick({ variantId, productTitle }) {
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';

  return (
    <fetcher.Form method='post' action='/cart'>
      <input type='hidden' name='cartAction' value='ADD_TO_CART' />
      <input type='hidden' name='lines' value={JSON.stringify([{ merchandiseId: variantId, quantity: 1 }])} />
      <button
        type='submit'
        disabled={isAdding || !variantId}
        title={'Add ' + productTitle + ' to cart'}
        style={{
          position: 'absolute', bottom: '10px', right: '10px',
          width: '34px', height: '34px', borderRadius: '50%',
          backgroundColor: isAdding ? '#00b5ad' : '#fff',
          border: '1px solid #ddd',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: variantId ? 'pointer' : 'not-allowed',
          fontSize: '20px', fontWeight: '300', lineHeight: 1,
          color: isAdding ? '#fff' : '#333',
          opacity: 0,
          transition: 'opacity 0.2s, background-color 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        }}
        className='carousel-add-btn'
      >
        {isAdding ? '✓' : '+'}
      </button>
    </fetcher.Form>
  );
}

export function ProductCarousel({ title, products, showMarketplaceNotice }) {
  const [start, setStart] = useState(0);
  const perPage = 4;

  if (!products || products.length === 0) return null;

  const visible = products.slice(start, start + perPage);
  const canPrev = start > 0;
  const canNext = start + perPage < products.length;

  return (
    <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
      <style>{'.carousel-card:hover .carousel-add-btn { opacity: 1 !important; } .carousel-card:hover .carousel-wish-btn { opacity: 1 !important; }'}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#111', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setStart(Math.max(0, start - perPage))}
            disabled={!canPrev}
            style={{ width: '30px', height: '30px', border: '1px solid ' + (canPrev ? '#999' : '#ddd'), backgroundColor: '#fff', color: canPrev ? '#333' : '#ccc', cursor: canPrev ? 'pointer' : 'default', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            &#8249;
          </button>
          <button
            onClick={() => setStart(Math.min(products.length - perPage, start + perPage))}
            disabled={!canNext}
            style={{ width: '30px', height: '30px', border: '1px solid ' + (canNext ? '#999' : '#ddd'), backgroundColor: '#fff', color: canNext ? '#333' : '#ccc', cursor: canNext ? 'pointer' : 'default', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {visible.map((product) => {
          const image = product.featuredImage || product.images?.nodes?.[0];
          const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
          const comparePrice = product.compareAtPriceRange
            ? parseFloat(product.compareAtPriceRange.minVariantPrice?.amount || 0)
            : null;
          const onSale = comparePrice && comparePrice > price;
          const currency = product.priceRange?.minVariantPrice?.currencyCode || 'USD';
          const variantId = product.variants?.nodes?.[0]?.id;

          return (
            <div key={product.id} className='carousel-card' style={{ position: 'relative' }}>
              <Link to={'/products/' + product.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', aspectRatio: '1/1', marginBottom: '10px' }}>
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.altText || product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s ease', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                  )}
                  {onSale && (
                    <span style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#e00', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 6px', letterSpacing: '0.05em' }}>SALE</span>
                  )}
                  <button
                    className='carousel-wish-btn'
                    onClick={e => e.preventDefault()}
                    style={{ position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', color: '#999', opacity: 0, transition: 'opacity 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  >
                    ♡
                  </button>
                  <AddToCartQuick variantId={variantId} productTitle={product.title} />
                </div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#333', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{product.vendor}</p>
                <p style={{ fontSize: '12px', color: '#555', margin: '0 0 4px', lineHeight: 1.3 }}>{product.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: onSale ? '#e00' : '#111' }}>
                    ${price.toFixed(2)}
                  </span>
                  {onSale && comparePrice && (
                    <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>${comparePrice.toFixed(2)}</span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {showMarketplaceNotice && (
        <p style={{ marginTop: '12px', fontSize: '11px', color: '#888' }}>
          Items may arrive <strong>separately</strong> if ordered with other items.{' '}
          <a href='/policies/shipping-policy' style={{ color: '#0066cc' }}>Learn more</a>
        </p>
      )}
    </div>
  );
}
