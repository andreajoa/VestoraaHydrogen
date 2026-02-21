import { redirect, useLoaderData } from 'react-router';
import { Analytics } from '@shopify/hydrogen';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { Link } from 'react-router';
import { useVariantUrl } from '~/lib/variants';
import { useState, useMemo } from 'react';

export const meta = ({ data }) => {
  return [{ title: `Vestoraa | ${data?.collection.title ?? ''} Collection` }];
};

export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;
  if (!handle) throw redirect('/collections');
  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: { handle, first: 48, last: null, startCursor: null, endCursor: null },
    }),
  ]);
  if (!collection) throw new Response(`Collection ${handle} not found`, { status: 404 });
  redirectIfHandleIsLocalized(request, { handle, data: collection });
  return { collection };
}

// ── Seed-based likes ──────────────────────────────────────────────────────────
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
function getLikes(productId) {
  const seed = productId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seededRandom(seed);
  const n = rng();
  if (n < 0.15) return Math.floor(rng() * 800 + 50);
  if (n < 0.5)  return Math.floor(rng() * 3000 + 800);
  if (n < 0.8)  return Math.floor(rng() * 8000 + 3000);
  return Math.floor(rng() * 40000 + 8000);
}
function formatLikes(n) {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
  return String(n);
}



// ── Sidebar ───────────────────────────────────────────────────────────────────
const COLOUR_MAP = { Black: '#111', White: '#f0f0f0', Beige: '#d4b896', Brown: '#8B5E3C', Red: '#c0392b', Pink: '#e91e8c', Blue: '#2980b9', Green: '#27ae60', Gold: '#c9a84c', Silver: '#aaa' };
const FILTER_SECTIONS = [
  { title: 'Category', key: 'category', options: ['Dresses', 'Tops', 'Jackets & Coats', 'Jumpsuits', 'Skirts', 'Sets', 'Knitwear', 'Blouses'] },
  { title: 'Price', key: 'price', options: ['Under $30', '$30 – $60', '$60 – $100', '$100 – $150', 'Over $150'] },
  { title: 'Colour', key: 'colour', options: ['Black', 'White', 'Beige', 'Brown', 'Red', 'Pink', 'Blue', 'Green', 'Gold', 'Silver'], isColour: true },
  { title: 'Size', key: 'size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], isSize: true },
  { title: 'Dress Length', key: 'length', options: ['Mini', 'Midi', 'Maxi', 'Floor Length'] },
  { title: 'Neckline', key: 'neckline', options: ['V-Neck', 'Square Neck', 'Round Neck', 'Off Shoulder', 'Halter', 'Strapless'] },
  { title: 'Sleeve', key: 'sleeve', options: ['Sleeveless', 'Short Sleeve', 'Long Sleeve', '3/4 Sleeve'] },
  { title: 'Occasion', key: 'occasion', options: ['Casual', 'Formal', 'Party', 'Evening', 'Work', 'Beach'] },
];

function FilterSection({ section, activeFilters, onToggle }) {
  const [open, setOpen] = useState(false);
  const active = activeFilters[section.key] || [];
  const hasActive = active.length > 0;
  return (
    <div style={{ borderBottom: '1px solid #e8e8e8' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', textAlign: 'left' }}>
        <span style={{ fontSize: '13px', fontWeight: hasActive ? '700' : '400', color: '#111' }}>
          {section.title}{hasActive ? ' (' + active.length + ')' : ''}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: '14px' }}>
          {section.isColour ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return (
                  <button key={opt} onClick={() => onToggle(section.key, opt)} title={opt}
                    style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: COLOUR_MAP[opt] || '#ccc', border: 'none', outline: isActive ? '2px solid #111' : '2px solid transparent', outlineOffset: '2px', cursor: 'pointer', padding: 0, boxShadow: '0 0 0 1px #ddd' }} />
                );
              })}
            </div>
          ) : section.isSize ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return (
                  <button key={opt} onClick={() => onToggle(section.key, opt)}
                    style={{ minWidth: '40px', padding: '6px 10px', fontSize: '12px', fontWeight: '500', border: isActive ? '1.5px solid #111' : '1px solid #ddd', backgroundColor: isActive ? '#111' : '#fff', color: isActive ? '#fff' : '#444', cursor: 'pointer', borderRadius: '3px', transition: 'all 0.15s' }}>{opt}</button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.options.map(opt => {
                const isActive = active.includes(opt);
                return (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '7px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: '13px', color: isActive ? '#111' : '#555', fontWeight: isActive ? '600' : '400' }}>{opt}</span>
                    <input type="checkbox" checked={isActive} onChange={() => onToggle(section.key, opt)}
                      style={{ width: '14px', height: '14px', accentColor: '#111', cursor: 'pointer', flexShrink: 0 }} />
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
    <aside style={{ width: '280px', minWidth: '280px', flexShrink: 0, alignSelf: 'flex-start', position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '2px solid #111', marginBottom: '4px' }}>
        <span style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>Filter</span>
        {totalActive > 0 && <button onClick={onClearAll} style={{ fontSize: '12px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Clear all</button>}
      </div>
      {FILTER_SECTIONS.map(s => <FilterSection key={s.key} section={s} activeFilters={activeFilters} onToggle={onToggle} />)}
    </aside>
  );
}


// ── Sort Bar ──────────────────────────────────────────────────────────────────
function SortBar({ total, sort, onSort }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #ebebeb' }}>
      <span style={{ fontSize: '13px', color: '#777' }}><strong style={{ color: '#111' }}>{total}</strong> items</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: '#777' }}>Sort by:</span>
        <select value={sort} onChange={e => onSort(e.target.value)}
          style={{ fontSize: '12px', border: '1px solid #ddd', padding: '6px 28px 6px 10px', backgroundColor: '#fff', color: '#111', cursor: 'pointer', borderRadius: '2px', outline: 'none', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, loading }) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const likes = useMemo(() => getLikes(product.id), [product.id]);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hasMultipleColors = (product.options || []).some(
    o => (o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour') && (o.values || []).length > 1
  );
  const price = product.priceRange?.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const hasDiscount = compareAt && parseFloat(compareAt.amount) > parseFloat(price?.amount || 0);
  const fmtPrice = (p) => {
    if (!p) return '';
    const sym = p.currencyCode === 'AUD' ? 'A$' : p.currencyCode === 'USD' ? '$' : p.currencyCode === 'EUR' ? '€' : p.currencyCode;
    return sym + parseFloat(p.amount).toFixed(2);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#f5f5f5', aspectRatio: '3/4' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Link to={variantUrl} prefetch="intent" style={{ display: 'block', height: '100%' }}>
          {image ? (
            <img src={image.url} alt={image.altText || product.title} loading={loading}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: '#bbb' }}>No Image</span>
            </div>
          )}
        </Link>
        {hasDiscount && (
          <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e0344b', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 7px', letterSpacing: '0.06em', borderRadius: '2px' }}>SALE</div>
        )}
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(4px)', borderRadius: '20px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#ff4d6d" stroke="none">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', lineHeight: 1 }}>{formatLikes(likes)}</span>
        </div>
        <button onClick={e => { e.preventDefault(); setWishlisted(w => !w); }}
          style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(255,255,255,0.93)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? '#e0344b' : 'none'} stroke={wishlisted ? '#e0344b' : '#444'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div style={{ paddingTop: '10px' }}>
        <Link to={variantUrl} prefetch="intent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ fontSize: '13px', color: '#111', fontWeight: '500', margin: '0 0 3px', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</p>
        </Link>
        {hasMultipleColors && <p style={{ fontSize: '11px', color: '#999', margin: '0 0 5px', fontStyle: 'italic' }}>+ More Colours Available</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {price && <span style={{ fontSize: '14px', fontWeight: '600', color: hasDiscount ? '#e0344b' : '#111' }}>{fmtPrice(price)}</span>}
          {hasDiscount && compareAt && <span style={{ fontSize: '12px', color: '#bbb', textDecoration: 'line-through' }}>{fmtPrice(compareAt)}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Collection() {
  const { collection } = useLoaderData();
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
    const p = [...(collection.products.nodes || [])];
    if (sort === 'price-asc') return p.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    if (sort === 'price-desc') return p.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    if (sort === 'newest') return p.reverse();
    return p;
  }, [collection.products.nodes, sort]);

  const totalPages = Math.ceil(sortedProducts.length / PER_PAGE);
  const paginated = sortedProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ fontFamily: 'inherit', backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f8f8f8', borderBottom: '1px solid #ebebeb', padding: '16px 40px' }}>
        <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', color: '#999', margin: '0 0 4px' }}>
            <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</a>{' / '}
            <span style={{ color: '#111' }}>{collection.title}</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: 0 }}>{collection.title}</h1>
          {collection.description && <p style={{ fontSize: '13px', color: '#777', margin: '4px 0 0' }}>{collection.description}</p>}
        </div>
      </div>

      {/* Sidebar + Grid */}
      <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '28px 40px', display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'stretch', width: '100%', boxSizing: 'border-box' }}>
        <Sidebar activeFilters={activeFilters} onToggle={toggleFilter} onClearAll={clearAll} totalActive={totalActive} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <SortBar total={sortedProducts.length} sort={sort} onSort={v => { setSort(v); setPage(1); }} />

          {totalActive > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {Object.entries(activeFilters).flatMap(([key, vals]) =>
                vals.map(val => (
                  <button key={`${key}-${val}`} onClick={() => toggleFilter(key, val)}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', border: '1px solid #333', borderRadius: '20px', background: '#111', color: '#fff', fontSize: '11px', cursor: 'pointer' }}>
                    {val} <span style={{ fontSize: '14px', lineHeight: 1 }}>×</span>
                  </button>
                ))
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px 14px' }}>
            {paginated.map((product, i) => (
              <ProductCard key={product.id} product={product} loading={i < 8 ? 'eager' : 'lazy'} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #ebebeb' }}>
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

          {paginated.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '15px', color: '#777' }}>No products found.</p>
              {totalActive > 0 && <button onClick={clearAll} style={{ marginTop: '12px', padding: '10px 24px', border: '1px solid #111', background: '#111', color: '#fff', fontSize: '13px', cursor: 'pointer', borderRadius: '2px' }}>Clear filters</button>}
            </div>
          )}
        </div>
      </div>


      <Analytics.CollectionView data={{ collection: { id: collection.id, handle: collection.handle } }} />
    </div>
  );
}

// ── GraphQL ───────────────────────────────────────────────────────────────────
const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 { amount currencyCode }
  fragment ProductItem on Product {
    id handle title
    featuredImage { id altText url width height }
    priceRange { minVariantPrice { ...MoneyProductItem } maxVariantPrice { ...MoneyProductItem } }
    compareAtPriceRange { minVariantPrice { ...MoneyProductItem } }
    options { name values }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String! $country: CountryCode $language: LanguageCode
    $first: Int $last: Int $startCursor: String $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id handle title description
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes { ...ProductItem }
        pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
      }
    }
  }
`;
