import {CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  style,
}) {
  const {open} = useAside();

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            disabled={disabled ?? fetcher.state !== 'idle'}
            style={style}
            onClick={(e) => {
              onClick?.(e);
              if (!disabled) {
                open('cart');
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
