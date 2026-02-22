import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className} style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginTop: '8px' }}>
      <dl style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px' }}>
        <dt style={{ fontSize: '13px', color: '#555', fontWeight: '400' }}>Subtotal</dt>
        <dd style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: 0 }}>
          {cart?.cost?.subtotalAmount?.amount ? <Money data={cart?.cost?.subtotalAmount} /> : '-'}
        </dd>
      </dl>
      <p style={{ fontSize: '11px', color: '#999', margin: '0 0 16px', textAlign: 'center' }}>Shipping and taxes calculated at checkout</p>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} cart={cart} />
    </div>
  );
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl, cart}) {
  if (!checkoutUrl) return null;

  const handleCheckout = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      const value = cart?.cost?.totalAmount?.amount;
      const currency = cart?.cost?.totalAmount?.currencyCode;
      window.fbq('track', 'InitiateCheckout', {
        value: value ? parseFloat(value) : 0,
        currency: currency || 'AUD',
        num_items: cart?.totalQuantity || 0,
      });
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <a href={checkoutUrl} target="_self" onClick={handleCheckout} style={{ display: 'block', width: '100%', padding: '14px', backgroundColor: '#111', color: '#fff', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '2px' }}>
        Checkout →
      </a>
      <a href="/cart" style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#fff', color: '#111', textAlign: 'center', textDecoration: 'none', fontSize: '12px', fontWeight: '500', border: '1px solid #ddd', borderRadius: '2px', marginTop: '8px', boxSizing: 'border-box' }}>
        View Cart
      </a>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button type="submit" aria-label="Remove discount">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <label htmlFor="discount-code-input" className="sr-only">Discount code</label>
          <input id="discount-code-input" type="text" name="discountCode" placeholder="Discount code"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #e0e0e0', fontSize: '12px', borderRadius: '2px', outline: 'none', color: '#111' }} />
          <button type="submit" aria-label="Apply discount code"
            style={{ padding: '8px 14px', backgroundColor: '#111', color: '#fff', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', borderRadius: '2px' }}>
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const giftCardCodeInput = useRef(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="cart-discount">
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
                &nbsp;
                <button type="submit">Remove</button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'}>
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   children: React.ReactNode;
 * }}
 */
function RemoveGiftCardForm({giftCardId, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
