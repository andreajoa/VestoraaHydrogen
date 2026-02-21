import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

const UTILITY_LINKS = [
  { label: 'Contact', href: '/pages/contact-us' },
  { label: 'FAQs', href: '/pages/faq' },
  { label: 'Delivery', href: '/pages/delivery' },
  { label: 'Returns', href: '/policies/refund-policy' },
  { label: 'Track Orders', href: 'https://www.vestoraa.com/apps/track123', external: true },
  { label: 'Gift Cards', href: '/collections/new-arrival' },
];

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '34px' }}>
        {UTILITY_LINKS.map((item, i) => (
          <UtilityLink key={item.label} href={item.href} label={item.label} external={item.external} last={i === UTILITY_LINKS.length - 1} />
        ))}
      </div>

      <div style={{ backgroundColor: '#111', padding: '0 24px', display: 'flex', alignItems: 'center', height: '60px', gap: '20px' }}>
        <NavLink to='/' prefetch='intent' style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {shop.name}
        </NavLink>

        <nav style={{ display: 'flex', alignItems: 'center', flex: 1, overflowX: 'auto' }}>
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;
            const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain)
              ? new URL(item.url).pathname : item.url;
            return (
              <NavLink key={item.id} to={url} prefetch='intent'
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#bbb',
                  textDecoration: 'none', fontSize: '12px',
                  fontWeight: isActive ? '700' : '400',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '0 10px', height: '60px',
                  display: 'flex', alignItems: 'center',
                  borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
                  whiteSpace: 'nowrap', transition: 'color 0.15s, border-color 0.15s',
                })}>
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        <SearchBar />

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          <Suspense fallback={
            <NavLink to='/account/login' prefetch='intent' title='Sign In'
              style={{ color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', textDecoration: 'none' }}>
              <AccountIcon filled={false} />
            </NavLink>
          }>
            <Await resolve={isLoggedIn}>
              {(loggedIn) => (
                <NavLink to={loggedIn ? '/account' : '/account/login'} prefetch='intent'
                  title={loggedIn ? 'My Account' : 'Sign In'}
                  style={{ color: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#fff'}
                  onMouseLeave={e => e.currentTarget.style.color='#bbb'}>
                  <AccountIcon filled={!!loggedIn} />
                </NavLink>
              )}
            </Await>
          </Suspense>

          <WishlistButton />
          <CartToggle cart={cart} />
        </div>
      </div>
    </div>
  );
}

function UtilityLink({ href, label, last, external }) {
  const [hovered, setHovered] = useState(false);
  return (
    
      href={href}
      target={external ? '_blank' : '_self'}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ color: hovered ? '#fff' : '#aaa', fontSize: '11px', textDecoration: 'none', padding: '0 10px', borderRight: last ? 'none' : '1px solid #444', whiteSpace: 'nowrap', lineHeight: 1, transition: 'color 0.15s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}

function SearchBar() {
  const {open} = useAside();
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => open('search')}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: hovered ? '#2a2a2a' : '#1e1e1e', border: '1px solid ' + (hovered ? '#666' : '#444'), borderRadius: '3px', padding: '0 12px', height: '34px', width: '200px', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='#777' strokeWidth='2'>
        <circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/>
      </svg>
      <span style={{ fontSize: '11px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search for products, brands, ...</span>
    </button>
  );
}

function AccountIcon({ filled }) {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill={filled ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='1.5'>
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/>
    </svg>
  );
}

function WishlistButton() {
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const update = () => {
      try {
        const w = JSON.parse(sessionStorage.getItem('vestoraa_wishlist') || '[]');
        setCount(w.length);
      } catch {}
    };
    update();
    window.addEventListener('wishlist_updated', update);
    return () => window.removeEventListener('wishlist_updated', update);
  }, []);

  return (
    <NavLink to='/wishlist' prefetch='intent' title='Wishlist'
      style={{ color: count > 0 ? '#ff6b6b' : (hovered ? '#fff' : '#bbb'), textDecoration: 'none', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', transition: 'color 0.15s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <svg width='20' height='20' viewBox='0 0 24 24' fill={count > 0 ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='1.5'>
        <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
      </svg>
      {count > 0 && (
        <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ff6b6b', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </NavLink>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={(e) => { e.preventDefault(); open('cart'); publish('cart_viewed', {cart, prevCart, shop, url: window.location.href || ''}); }}
      title='Cart'
      style={{ color: hovered ? '#fff' : '#bbb', background: 'none', border: 'none', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'color 0.15s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5'>
        <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z'/><line x1='3' y1='6' x2='21' y2='6'/><path d='M16 10a4 4 0 0 1-8 0'/>
      </svg>
      {count !== null && count > 0 && (
        <span style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: '#00b5ad', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', fontSize: '9px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}><CartBanner /></Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

export function HeaderMenu({ menu, primaryDomainUrl, viewport, publicStoreDomain }) {
  const {close} = useAside();
  if (viewport !== 'mobile') return null;
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url = item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain)
          ? new URL(item.url).pathname : item.url;
        return (
          <NavLink key={item.id} to={url} onClick={close} prefetch='intent'
            style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#111', textDecoration: 'none', fontSize: '14px' }}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    { id: '1', resourceId: null, tags: [], title: 'New Arrival', type: 'HTTP', url: '/collections/new-arrival', items: [] },
    { id: '2', resourceId: null, tags: [], title: 'Jumpsuit', type: 'HTTP', url: '/collections/jumpsuit', items: [] },
    { id: '3', resourceId: null, tags: [], title: 'Jackets', type: 'HTTP', url: '/collections/jackets', items: [] },
    { id: '4', resourceId: null, tags: [], title: 'Dresses', type: 'HTTP', url: '/collections/dresses', items: [] },
    { id: '5', resourceId: null, tags: [], title: 'Sweater', type: 'HTTP', url: '/collections/sweater', items: [] },
    { id: '6', resourceId: null, tags: [], title: 'Tops & Blouses', type: 'HTTP', url: '/collections/tops-blouses', items: [] },
  ],
};
