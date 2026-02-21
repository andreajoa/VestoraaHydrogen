import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export const meta = () => [{ title: 'Vestoraa | Wishlist' }];

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const w = JSON.parse(sessionStorage.getItem('vestoraa_wishlist') || '[]');
      setItems(w);
    } catch {}
    setLoaded(true);
  }, []);

  const remove = (handle) => {
    const updated = items.filter(i => i.handle !== handle);
    setItems(updated);
    try {
      sessionStorage.setItem('vestoraa_wishlist', JSON.stringify(updated));
      window.dispatchEvent(new Event('wishlist_updated'));
    } catch {}
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '400', color: '#111', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
        My Wishlist {items.length > 0 && <span style={{ fontSize: '14px', color: '#888', fontWeight: '400' }}>({items.length} items)</span>}
      </h1>

      {!loaded ? null : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='#ddd' strokeWidth='1' style={{ marginBottom: '16px' }}>
            <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
          </svg>
          <p style={{ fontSize: '15px', marginBottom: '20px' }}>Your wishlist is empty</p>
          <Link to='/collections/new-arrival' style={{ fontSize: '13px', fontWeight: '700', color: '#111', textDecoration: 'none', border: '1px solid #111', padding: '12px 24px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Discover New Arrivals
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
          {items.map(item => (
            <div key={item.handle} style={{ position: 'relative' }}>
              <Link to={'/products/' + item.handle} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ aspectRatio: '2/3', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px', position: 'relative' }}>
                  {item.image && <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />}
                </div>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>{item.vendor}</p>
                <p style={{ fontSize: '13px', color: '#333', margin: '0 0 4px', lineHeight: 1.4 }}>{item.title}</p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#111', margin: 0 }}>{item.price}</p>
              </Link>
              <button onClick={() => remove(item.handle)}
                style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #eee', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#ff6b6b' }}>
                ♥
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
