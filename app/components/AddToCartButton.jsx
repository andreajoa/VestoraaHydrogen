import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function AddToCartButton({analytics, children, disabled, lines, onClick, style}) {
  const {open} = useAside();
  return (
    <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
      <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
        {(fetcher) => (
          <>
            <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
            <button
              type="submit"
              disabled={disabled ?? fetcher.state !== 'idle'}
              style={{
                display: 'block',
                width: '100%',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...style,
              }}
              onClick={(e) => {
                onClick?.(e);
                if (!disabled && fetcher.state === 'idle') {
                  setTimeout(() => open('cart'), 300);
                }
              }}
            >
              {fetcher.state !== 'idle' ? 'Adding...' : children}
            </button>
          </>
        )}
      </CartForm>
    </div>
  );
}
