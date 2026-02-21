import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function AddToCartButton({analytics, children, disabled, lines, onClick, style}) {
  const {open} = useAside();
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
          <button
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={{
              flex: 1,
              width: '100%',
              height: '50px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.1em',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s',
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
  );
}
