import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function AddToCartButton({analytics, children, disabled, lines, onClick, style}) {
  const {open} = useAside();
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd} style={{ flex: 1, display: 'flex', minWidth: 0, width: '100%' }}>
      {(fetcher) => (
        <>
          <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
          <button
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={{
              flex: 1,
              width: '100%',
              minHeight: '56px',
              height: '56px',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, opacity 0.2s',
              opacity: (fetcher.state !== 'idle') ? 0.7 : 1,
              backgroundColor: '#111',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              ...style,
            }}
            onClick={(e) => {
              onClick?.(e);
              if (!disabled && fetcher.state === 'idle') {
                setTimeout(() => open('cart'), 300);
              }
            }}
          >
            {fetcher.state !== 'idle' ? 'ADDING...' : children}
          </button>
        </>
      )}
    </CartForm>
  );
}
