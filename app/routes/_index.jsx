import {Await, useLoaderData, Link} from 'react-router';
import {Suspense, useState} from 'react';

export const meta = () => {
  return [{title: 'Vestoraa | Women\'s Fashion Online'}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY),
  ]);
  return { collections: collections.nodes };
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch(() => null);
  const newArrivals = context.storefront
    .query(NEW_ARRIVALS_QUERY)
    .catch(() => null);
  return { recommendedProducts, newArrivals };
}

// ── Promo Banner ──────────────────────────────────────────────────────────────
function PromoBanner() {
  return (
    <div style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center', padding: '10px', fontSize: '13px', letterSpacing: '0.05em' }}>
      <span>FREE SHIPPING AUSTRALIA & NEW ZEALAND — </span>
      <a href="/collections/new-arrival" style={{ color: '#fff', fontWeight: '700', textDecoration: 'underline' }}>SHOP NEW ARRIVALS</a>
    </div>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────────────
function HeroBanner() {
  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'hidden', height: '200px', backgroundColor: '#b8c4c2' }}>
      <img
        src="https://cdn.shopify.com/s/files/1/0706/4456/4124/files/11_35353139-cd39-4dfe-a4d8-8859cc92f22d.png?v=1771712961"
        alt="Spend and Save"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
      />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 80px', backgroundColor: 'rgba(0,0,0,0.15)' }}>
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>SPEND &amp; SAVE</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 4px', textShadow: '0 1px 4px rgba(0,0,0,0.3)', lineHeight: 1.2 }}>
            SPEND $80, <span style={{ fontStyle: 'italic' }}>SAVE 14%</span>
          </p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 8px', textShadow: '0 1px 4px rgba(0,0,0,0.3)', lineHeight: 1.2 }}>
            SPEND $100, <span style={{ fontStyle: 'italic' }}>SAVE 18%</span><sup style={{ fontSize: '14px' }}>*</sup>
          </p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            *Ends midnight. Discount applied at checkout. Selected styles listed. T&Cs apply.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Gender Categories ────────────────────────────────────────────────────────
function GenderCategories() {
  const cats = [
    { label: 'UNDER $80', href: '/collections/under-80', img: 'https://cdn.shopify.com/s/files/1/0706/4456/4124/files/11_35353139-cd39-4dfe-a4d8-8859cc92f22d.png?v=1771712961' },
    { label: 'UNDER $150', href: '/collections/under-150', img: 'https://cdn.shopify.com/s/files/1/0706/4456/4124/files/11_35353139-cd39-4dfe-a4d8-8859cc92f22d.png?v=1771712961' },
    { label: 'UNDER $300', href: '/collections/under-300', img: 'https://cdn.shopify.com/s/files/1/0706/4456/4124/files/11_35353139-cd39-4dfe-a4d8-8859cc92f22d.png?v=1771712961' },
  ];
  return (
    <div style={{ display: "flex", gap: "6px", padding: "24px 40px", maxWidth: "1340px", margin: "0 auto", boxSizing: "border-box" }}>
      {cats.map(cat => (
        <a key={cat.label} href={cat.href} style={{ flex: 1, position: "relative", overflow: "hidden", textDecoration: "none", display: "block", aspectRatio: "3/4" }}>
          <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </a>
      ))}
    </div>
  );
}

// ── Promo Wide Banner ────────────────────────────────────────────────────────
function PromoWideBanner() {
  return (
    <div style={{ margin: '0 40px', backgroundColor: '#1e3a6e', borderRadius: '4px' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: '0 0 4px', lineHeight: 1.2 }}>
            WIN 1 of 10 x <span style={{ color: '#5bc8f5' }}>$1000 Vestoraa Gift Cards</span>
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '0 0 6px' }}>with AfterPay — shop now, pay later</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>* Eligibility criteria, terms & exclusions apply. See full terms on AfterPay website.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ backgroundColor: '#b2fcf4', borderRadius: '40px', padding: '12px 28px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#111', letterSpacing: '0.02em' }}>AfterPay</span>
          </div>
          <div style={{ width: '200px', height: '100px', background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 70%)', borderRadius: '50%', position: 'absolute', right: '180px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Shop by Category ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Dresses', handle: 'dress', emoji: '👗' },
  { label: 'Tops', handle: 'tops-blouses', emoji: '👚' },
  { label: 'Jackets', handle: 'jackets', emoji: '🧥' },
  { label: 'Jumpsuits', handle: 'jumpsuit', emoji: '👘' },
  { label: 'Sweater', handle: 'sweater', emoji: '🧶' },
  { label: 'New Arrival', handle: 'new-arrival', emoji: '✨' },
];

function ShopByCategory({collections}) {
  return (
    <div style={{ padding: '56px 40px', maxWidth: '1340px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>Shop by Category</h2>
        <a href="/collections" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', borderBottom: '1px solid #ccc' }}>View all</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {CATEGORIES.map(cat => {
          const col = collections?.find(c => c.handle === cat.handle);
          return (
            <a key={cat.handle} href={`/collections/${cat.handle}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ aspectRatio: '3/4', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', position: 'relative', marginBottom: '10px' }}>
                {col?.image ? (
                  <img src={col.image.url} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{cat.emoji}</div>
                )}
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', textAlign: 'center', margin: 0 }}>{cat.label}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Promo Cards ───────────────────────────────────────────────────────────────
function PromoCards() {
  const cards = [
    { title: 'New Arrivals', subtitle: 'Fresh styles every week', cta: 'Shop Now', href: '/collections/new-arrival', bg: '#1a1a2e', color: '#fff' },
    { title: 'Dresses', subtitle: 'From mini to maxi', cta: 'Explore', href: '/collections/dress', bg: '#2d1f1f', color: '#fff' },
    { title: 'Sale', subtitle: 'Up to 50% off', cta: 'Shop Sale', href: '/collections/all', bg: '#c9a84c', color: '#111' },
  ];
  return (
    <div style={{ backgroundColor: '#f8f8f8', padding: '56px 40px' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {cards.map(card => (
          <a key={card.title} href={card.href} style={{ textDecoration: 'none', display: 'block', backgroundColor: card.bg, padding: '40px 32px', borderRadius: '4px', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: card.color, opacity: 0.7, marginBottom: '10px' }}>Vestoraa</p>
            <h3 style={{ fontSize: '28px', fontWeight: '800', color: card.color, marginBottom: '8px', letterSpacing: '-0.01em' }}>{card.title}</h3>
            <p style={{ fontSize: '14px', color: card.color, opacity: 0.8, marginBottom: '24px' }}>{card.subtitle}</p>
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, borderBottom: `1px solid ${card.color}`, paddingBottom: '2px' }}>{card.cta} →</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
function HomeProductCard({product}) {
  const [hovered, setHovered] = useState(false);
  const price = product.priceRange?.minVariantPrice;
  const fmtPrice = (p) => {
    if (!p) return '';
    const sym = p.currencyCode === 'AUD' ? 'A$' : '$';
    return sym + parseFloat(p.amount).toFixed(2);
  };
  return (
    <a href={`/products/${product.handle}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ aspectRatio: '3/4', backgroundColor: '#f5f5f5', overflow: 'hidden', borderRadius: '4px', marginBottom: '12px' }}>
        {product.featuredImage && (
          <img src={product.featuredImage.url} alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        )}
      </div>
      <p style={{ fontSize: '13px', color: '#111', fontWeight: '500', margin: '0 0 4px', lineHeight: 1.4 }}>{product.title}</p>
      <p style={{ fontSize: '14px', color: '#111', fontWeight: '600', margin: 0 }}>{fmtPrice(price)}</p>
    </a>
  );
}

// ── New Arrivals Section ──────────────────────────────────────────────────────
function NewArrivalsSection({newArrivals}) {
  return (
    <div style={{ padding: '56px 40px', maxWidth: '1340px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>New Arrivals</h2>
        <a href="/collections/new-arrival" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', borderBottom: '1px solid #ccc' }}>View all</a>
      </div>
      <Suspense fallback={<div style={{ height: '400px', backgroundColor: '#f5f5f5', borderRadius: '4px' }} />}>
        <Await resolve={newArrivals}>
          {(data) => (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px 12px' }}>
              {data?.products?.nodes?.slice(0, 5).map(product => (
                <HomeProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

// ── Recommended Products ──────────────────────────────────────────────────────
function RecommendedSection({recommendedProducts}) {
  return (
    <div style={{ backgroundColor: '#f8f8f8', padding: '56px 40px' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111', letterSpacing: '-0.01em' }}>This Week\'s Top Sellers</h2>
          <a href="/collections/all" style={{ fontSize: '13px', color: '#666', textDecoration: 'none', borderBottom: '1px solid #ccc' }}>View all</a>
        </div>
        <Suspense fallback={<div style={{ height: '400px', backgroundColor: '#eee', borderRadius: '4px' }} />}>
          <Await resolve={recommendedProducts}>
            {(data) => (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 12px' }}>
                {data?.products?.nodes?.slice(0, 8).map(product => (
                  <HomeProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

// ── USP Strip ─────────────────────────────────────────────────────────────────
function USPStrip() {
  const usps = [
    { icon: '🚚', title: 'Free Shipping', sub: 'On orders over $100' },
    { icon: '↩️', title: 'Easy Returns', sub: '30-day return policy' },
    { icon: '🔒', title: 'Secure Payment', sub: 'Your data is safe' },
    { icon: '💬', title: '24/7 Support', sub: 'We\'re here to help' },
  ];
  return (
    <div style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', padding: '28px 40px' }}>
      <div style={{ maxWidth: '1340px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '20px' }}>
        {usps.map(u => (
          <div key={u.title} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '28px' }}>{u.icon}</span>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', margin: '0 0 2px' }}>{u.title}</p>
              <p style={{ fontSize: '12px', color: '#777', margin: 0 }}>{u.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Homepage() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: 'inherit', backgroundColor: '#fff' }}>
      <PromoBanner />
      <HeroBanner />
      <USPStrip />
      <GenderCategories />
      <PromoWideBanner />
      <ShopByCategory collections={data.collections} />
      <PromoCards />
      <NewArrivalsSection newArrivals={data.newArrivals} />
      <RecommendedSection recommendedProducts={data.recommendedProducts} />
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query HomepageCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id handle title
        image { url altText }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment HomeProduct on Product {
    id title handle
    priceRange { minVariantPrice { amount currencyCode } }
    featuredImage { id url altText width height }
  }
  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes { ...HomeProduct }
    }
  }
`;

const NEW_ARRIVALS_QUERY = `#graphql
  fragment NewArrivalProduct on Product {
    id title handle
    priceRange { minVariantPrice { amount currencyCode } }
    featuredImage { id url altText width height }
  }
  query NewArrivals($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 5, sortKey: CREATED_AT, reverse: true) {
      nodes { ...NewArrivalProduct }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
