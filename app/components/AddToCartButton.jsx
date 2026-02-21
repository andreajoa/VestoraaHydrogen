import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function AddToCartButton({analytics, children, disabled, lines, onClick, style}) {
  const {open} = useAside();
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd} style={{ flex: 1, display: 'flex', minWidth: 0 }}>
      {(fetcher) => (
        <>
          <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
          <button
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={{ flex: 1, width: '100%', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
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
  );
}
