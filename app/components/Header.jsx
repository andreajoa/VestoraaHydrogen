import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue, Link} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* TOP UTILITY BAR */}
      <div style={{
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '34px',
        gap: '0',
      }}>
        {[
          { label: 'Contact & FAQs', href: '/pages/contact' },
          { label: 'Delivery', href: '/policies/shipping-policy' },
          { label: 'Returns', href: '/policies/refund-policy' },
          { label: 'Track Orders', href: '/pages/track-orders' },
          { label: 'Share Your Ideas', href: '/pages/feedback' },
          { label: 'Gift Cards', href: '/products/gift-card' },
        ].map((item, i, arr) => (
          
            key={item.label}
            href={item.href}
            style={{
              color: '#ccc',
              fontSize: '11px',
              textDecoration: 'none',
              padding: '0 10px',
              borderRight: i < arr.length - 1 ? '1px solid #444' : 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = '#ccc'}
          >
            {i === 0 && <span style={{ marginRight: '4px', fontSize: '10px' }}>💬</span>}
            {i === 1 && <span style={{ marginRight: '4px', fontSize: '10px' }}>🚚</span>}
            {i === 2 && <span style={{ marginRight: '4px', fontSize: '10px' }}>↩</span>}
            {i === 3 && <span style={{ marginRight: '4px', fontSize: '10px' }}>📍</span>}
            {i === 4 && <span style={{ marginRight: '4px', fontSize: '10px' }}>💡</span>}
            {i === 5 && <span style={{ marginRight: '4px', fontSize: '10px' }}>🎁</span>}
            {item.label}
          </a>
        ))}
      </div>

      {/* MAIN NAV BAR */}
      <div style={{
        backgroundColor: '#111',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        height: '60px',
        gap: '24px',
      }}>
        {/* Brand Name */}
        <NavLink
          to="/"
          prefetch="intent"
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '22px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
            whiteSpace: 'nowrap',
            marginRight: '8px',
            flexShrink: 0,
          }}
        >
          {shop.name}
        </NavLink>

        {/* Main Menu Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain)
                ? new URL(item.url).pathname
                : item.url;
            return (
              <NavLink
                key={item.id}
                to={url}
                prefetch="intent"
                style={({ isActive }) => ({
                  color: isActive ? '#fff' : '#ccc',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '6px 12px',
                  borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                })}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderBottom = '2px solid #fff';
                }}
                onMouseLeave={e => {
                  const isActive = e.currentTarget.getAttribute('data-active') === 'true';
                  if (!isActive) {
                    e.currentTarget.style.color = '#ccc';
                    e.currentTarget.style.borderBottom = '2px solid transparent';
                  }
                }}
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Search Bar */}
        <SearchBar />

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {/* Account */}
          <NavLink
            to="/account"
            prefetch="intent"
            title="Account"
            style={{
              color: '#ccc', textDecoration: 'none',
              width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
          >
            <Suspense fallback={<AccountIcon />}>
              <Await resolve={isLoggedIn}>
                {() => <AccountIcon />}
              </Await>
            </Suspense>
          </NavLink>

          {/* Wishlist */}
          <button
            title="Wishlist"
            style={{
              color: '#ccc', background: 'none', border: 'none',
              width: '38px', height: '38px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', borderRadius: '50%', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
          >
            <WishlistIcon />
          </button>

          {/* Cart */}
          <CartToggle cart={cart} />
        </div>
      </div>

      {/* MOBILE MENU TOGGLE - hidden on desktop */}
      <MobileMenuToggle />
    </div>
  );
}

function SearchBar() {
  const {open} = useAside();
  const [focused, setFocused] = useState(false);
  return (
    <button
      onClick={() => open('search')}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: focused ? '#2a2a2a' : '#222',
        border: '1px solid #444',
        borderRadius: '4px',
        padding: '0 12px',
        height: '36px',
        width: '220px',
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#666'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#444'; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>
        Search for products, brands, ...
      </span>
    </button>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function WishlistIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function CartIcon({ count }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {count !== null && count > 0 && (
        <span style={{
          position: 'absolute', top: '-8px', right: '-8px',
          backgroundColor: '#00b5ad', color: '#fff',
          borderRadius: '50%', width: '16px', height: '16px',
          fontSize: '10px', fontWeight: '700',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          lineHeight: 1,
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
}

function MobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      onClick={() => open('mobile')}
      style={{
        display: 'none',
        position: 'fixed', bottom: '16px', right: '16px',
        backgroundColor: '#111', color: '#fff',
        border: 'none', borderRadius: '50%',
        width: '48px', height: '48px',
        fontSize: '20px', cursor: 'pointer',
        zIndex: 200,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      aria-label="Open menu"
    >
      ☰
    </button>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <button
      title="Cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', { cart, prevCart, shop, url: window.location.href || '' });
      }}
      style={{
        color: '#ccc', background: 'none', border: 'none',
        width: '38px', height: '38px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', borderRadius: '50%', transition: 'color 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
    >
      <CartIcon count={count} />
    </button>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
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
        const url =
          item.url.includes('myshopify.com') || item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            key={item.id}
            to={url}
            onClick={close}
            prefetch="intent"
            style={{ padding: '12px 0', borderBottom: '1px solid #eee', color: '#111', textDecoration: 'none', fontSize: '14px' }}
          >
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

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
