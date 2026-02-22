import {useLoaderData} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useVariantUrl} from '~/lib/variants';
import {useState, useMemo} from 'react';

export const meta = () => {
  return [{title: 'Vestoraa | All Products'}];
};

export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: { first: 96 },
  });
  return {products: products.nodes};
}

const COLOUR_MAP = { Black: '#111', White: '#f0f0f0', Beige: '#d4b896', Brown: '#8B5E3C', Red: '#c0392b', Pink: '#e91e8c', Blue: '#2980b9', Green: '#27ae60', Gold: '#c9a84c', Silver: '#aaa' };

const FILTER_SECTIONS = [
  { title: 'Price', key: 'price', options: ['Under $30', '$30 – $60', '$60 – $100', '$100 – $150', 'Over $150'] },
  { title: 'Colour', key: 'colour', options: ['Black', 'White', 'Beige', 'Brown', 'Red', 'Pink', 'Blue', 'Green', 'Gold', 'Silver'], isColour: true },
  { title: 'Size', key: 'size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], isSize: true },
  { title: 'Category', key: 'category', options: ['Dresses', 'Tops', 'Jackets & Coats', 'Jumpsuits', 'Skirts', 'Sets', 'Knitwear'] },
  { title: 'Occasion', key: 'occasion', options: ['Casual', 'Formal', 'Party', 'Evening', 'Work', 'Beach'] },
];

function FilterSection({ section, activeFilters, onToggle }) {
  const [open, setOpen] = useState(false);
  const active = activeFilters[section.key] || [];
  const hasActive = active.length > 0;
  return (
    <div style={{ borderBottom: '1px solid #e2e2e2' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '13px 0', textAlign: 'left' }}>
        <span style={{ fontSize: '14px', fontWeight: hasActive ? '600' : '400', color: '#111' }}>{section.title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: '12px' }}>
          {section.isColour ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return <button key={opt} onClick={() => onToggle(section.key, opt)} title={opt}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: COLOUR_MAP[opt] || '#ccc', border: 'none', outline: isActive ? '2.5px solid #111' : '1.5px solid #ccc', outlineOffset: '2px', cursor: 'pointer', padding: 0 }} />;
              })}
            </div>
          ) : section.isSize ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return <button key={opt} onClick={() => onToggle(section.key, opt)}
                  style={{ minWidth: '44px', padding: '7px 10px', fontSize: '12px', border: isActive ? '2px solid #111' : '1px solid #ccc', backgroundColor: isActive ? '#111' : '#fff', color: isActive ? '#fff' : '#333', cursor: 'pointer', borderRadius: '3px' }}>{opt}</button>;
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '7px 0' }}>
                    <span style={{ fontSize: '13px', color: isActive ? '#111' : '#555', fontWeight: isActive ? '600' : '400' }}>{opt}</span>
                    <input type="checkbox" checked={isActive} onChange={() => onToggle(section.key, opt)} style={{ width: '15px', height: '15px', accentColor: '#111', cursor: 'pointer', flexShrink: 0 }} />
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({ activeFilters, onToggle, onClearAll, totalActive }) {
  return (
    <div style={{ width: '240px', minWidth: '240px', flexShrink: 0, alignSelf: 'flex-start', paddingRight: '24px', borderRight: '1px solid #e2e2e2' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>Filter</span>
        {totalActive > 0 && <button onClick={onClearAll} style={{ fontSize: '13px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all</button>}
      </div>
      <div style={{ borderTop: '1px solid #e2e2e2' }}>
        {FILTER_SECTIONS.map(s => <FilterSection key={s.key} section={s} activeFilters={activeFilters} onToggle={onToggle} />)}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const image = product.featuredImage;
  const price = product.priceRange?.minVariantPrice;
  const fmtPrice = (p) => {
    if (!p) return '';
    const sym = p.currencyCode === 'AUD' ? 'A$' : '$';
    return sym + parseFloat(p.amount).toFixed(2);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', aspectRatio: '3/4' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Link to={`/products/${product.handle}`} style={{ display: 'block', height: '100%' }}>
          {image ? (
            <img src={image.url} alt={image.altText || product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: '#bbb' }}>No Image</span>
            </div>
          )}
        </Link>
        <button onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.93)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? '#e0344b' : 'none'} stroke={wishlisted ? '#e0344b' : '#444'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Link to={`/products/${product.handle}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ fontSize: '13px', color: '#111', fontWeight: '500', margin: '0 0 4px', lineHeight: 1.4 }}>{product.title}</p>
        </Link>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', margin: 0 }}>{fmtPrice(price)}</p>
      </div>
    </div>
  );
}

export default function AllProducts() {
  const { products } = useLoaderData();
  const [activeFilters, setActiveFilters] = useState({});
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const PER_PAGE = 24;

  const toggleFilter = (key, value) => {
    setActiveFilters(prev => {
      const cur = prev[key] || [];
      return { ...prev, [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
    setPage(1);
  };
  const clearAll = () => { setActiveFilters({}); setPage(1); };
  const totalActive = Object.values(activeFilters).reduce((s, a) => s + a.length, 0);

  const sortedProducts = useMemo(() => {
    const p = [...(products || [])];
    if (sort === 'price-asc') return p.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    if (sort === 'price-desc') return p.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    if (sort === 'newest') return p.reverse();
    return p;
  }, [products, sort]);

  const totalPages = Math.ceil(sortedProducts.length / PER_PAGE);
  const paginated = sortedProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ fontFamily: 'inherit', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#f8f8f8', borderBottom: '1px solid #e8e8e8', padding: '16px 40px' }}>
        <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px' }}>
            <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</a>{' / '}
            <span style={{ color: '#111' }}>All Products</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: 0 }}>All Products</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '28px 40px', display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'flex-start', boxSizing: 'border-box' }}>
        <Sidebar activeFilters={activeFilters} onToggle={toggleFilter} onClearAll={clearAll} totalActive={totalActive} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e2e2e2' }}>
            <span style={{ fontSize: '13px', color: '#777' }}><strong style={{ color: '#111' }}>{sortedProducts.length}</strong> items</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#777' }}>Sort by:</span>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                style={{ fontSize: '12px', border: '1px solid #ddd', padding: '6px 12px', backgroundColor: '#fff', color: '#111', cursor: 'pointer', borderRadius: '2px', outline: 'none' }}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px 14px' }}>
            {paginated.map(product => <ProductCard key={product.id} product={product} />)}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e2e2e2' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '8px 16px', border: '1px solid #ddd', background: '#fff', color: page === 1 ? '#ccc' : '#111', cursor: page === 1 ? 'default' : 'pointer', fontSize: '12px', borderRadius: '2px' }}>← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: '34px', height: '34px', border: p === page ? '1px solid #111' : '1px solid #ddd', background: p === page ? '#111' : '#fff', color: p === page ? '#fff' : '#111', cursor: 'pointer', fontSize: '12px', borderRadius: '2px', fontWeight: p === page ? '700' : '400' }}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '8px 16px', border: '1px solid #ddd', background: '#fff', color: page === totalPages ? '#ccc' : '#111', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '12px', borderRadius: '2px' }}>Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CATALOG_QUERY = `#graphql
  fragment MoneyItem on MoneyV2 { amount currencyCode }
  fragment CatalogProduct on Product {
    id handle title
    featuredImage { id altText url width height }
    priceRange { minVariantPrice { ...MoneyItem } }
    options { name values }
  }
  query Catalog($country: CountryCode, $language: LanguageCode, $first: Int)
    @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes { ...CatalogProduct }
    }
  }
`;

/** @typedef {import('./+types/collections.all').Route} Route */
