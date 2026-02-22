import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 *   childrenMap: LineItemChildrenMap;
 * }}
 */
export function CartLineItem({layout, line, childrenMap}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} style={{ listStyle: 'none', padding: '20px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {image && (
        <Link to={lineItemUrl} onClick={() => { if (layout === 'aside') close(); }} style={{ flexShrink: 0 }}>
          <Image
            alt={title}
            aspectRatio="3/4"
            data={image}
            height={120}
            loading="lazy"
            width={90}
            style={{ borderRadius: '2px', display: 'block', objectFit: 'cover' }}
          />
        </Link>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
          <Link prefetch="intent" to={lineItemUrl} onClick={() => { if (layout === 'aside') close(); }} style={{ textDecoration: 'none', color: 'inherit' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: 0, lineHeight: 1.4 }}>{product.title}</p>
          </Link>
          <ProductPrice price={line?.cost?.totalAmount} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          {selectedOptions.filter(o => o.value !== 'Default Title').map((option) => (
            <span key={option.name} style={{ fontSize: '11px', color: '#888', marginRight: '8px' }}>
              {option.name}: {option.value}
            </span>
          ))}
        </div>
        <CartLineQuantity line={line} />
      </div>
      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">Line items with {product.title}</p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children" style={{ listStyle: 'none', padding: 0 }}>
            {lineItemChildren.map((childLine) => (
              <CartLineItem childrenMap={childrenMap} key={childLine.id} line={childLine} layout={layout} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 * @param {{line: CartLine}}
 */
function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  const btnStyle = { width: '28px', height: '28px', border: '1px solid #e0e0e0', background: '#fff', color: '#111', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px', lineHeight: 1 };
  const btnDisabled = { ...btnStyle, color: '#ccc', cursor: 'default' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: 'fit-content' }}>
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button aria-label="Decrease quantity" disabled={quantity <= 1 || !!isOptimistic} name="decrease-quantity" value={prevQuantity}
          style={quantity <= 1 || !!isOptimistic ? btnDisabled : btnStyle}>−</button>
      </CartLineUpdateButton>
      <span style={{ width: '36px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#111', border: '1px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button aria-label="Increase quantity" name="increase-quantity" value={nextQuantity} disabled={!!isOptimistic}
          style={!!isOptimistic ? btnDisabled : btnStyle}>+</button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds}}>
      <button disabled={disabled} type="submit"
        style={{ background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', color: '#999', fontSize: '11px', textDecoration: 'underline', marginLeft: '12px', padding: '0 4px', height: '28px' }}>
        Remove
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @returns
 * @param {string[]} lineIds - line ids affected by the update
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('~/components/CartMain').LineItemChildrenMap} LineItemChildrenMap */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').CartLineFragment} CartLineFragment */
