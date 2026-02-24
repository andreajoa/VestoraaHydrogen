import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const STORAGE_KEY = 'vestoraa_recently_viewed';
const MAX_ITEMS = 20;

export function RecentlyViewedCarousel({ currentProduct }) {
  const [items, setItems] = useState([]);
  const [perPage, setPerPage] = useState(4);
  const [start, setStart] = useState(0);

  useEffect(() => {
    const update = () => setPerPage(window.innerWidth <= 768 ? 2 : 4);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!currentProduct) return;

    // Salva produto atual no historico
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtered = stored.filter(p => p.id !== currentProduct.id);
    const updated = [currentProduct, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Mostra os produtos visitados anteriormente (excluindo o atual)
    const previous = updated.filter(p => p.id !== currentProduct.id);
    setItems(previous);
  }, [currentProduct?.id]);

  if (!items || items.length === 0) return null;

  const canPrev = start > 0;
  const canNext = start + perPage < items.length;
  const visible = items.slice(start, start + perPage);

  return (
    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#111', margin: 0, letterSpacing: '-0.01em' }}>You may also like</h2>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => setStart(Math.max(0, start - perPage))} disabled={!canPrev}
            style={{ width: '30px', height: '30px', border: '1px solid ' + (canPrev ? '#999' : '#ddd'), backgroundColor: '#fff', color: canPrev ? '#333' : '#ccc', cursor: canPrev ? 'pointer' : 'default', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
            &#8249;
          </button>
          <button onClick={() => setStart(Math.min(items.length - perPage, start + perPage))} disabled={!canNext}
            style={{ width: '30px', height: '30px', border: '1px solid ' + (canNext ? '#999' : '#ddd'), backgroundColor: '#fff', color: canNext ? '#333' : '#ccc', cursor: canNext ? 'pointer' : 'default', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
            &#8250;
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${perPage}, 1fr)`, gap: '10px' }}>
        {visible.map((product) => {
          const price = parseFloat(product.price || 0);
          const comparePrice = parseFloat(product.comparePrice || 0);
          const onSale = comparePrice && comparePrice > price;
          const symbol = product.symbol || 'A$';

          return (
            <div key={product.id}>
              <Link to={'/products/' + product.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', aspectRatio: '2/3', marginBottom: '8px', borderRadius: '4px' }}>
                  {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                    : <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                  }
                  {onSale && (
                    <span style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#e00', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '2px 5px', letterSpacing: '0.05em', borderRadius: '2px' }}>SALE</span>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: '#555', margin: '0 0 3px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: onSale ? '#c00' : '#111' }}>{symbol}{price.toFixed(2)}</span>
                  {onSale && comparePrice > 0 && (
                    <span style={{ fontSize: '11px', color: '#aaa', textDecoration: 'line-through' }}>{symbol}{comparePrice.toFixed(2)}</span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
