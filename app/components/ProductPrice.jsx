import { Money } from '@shopify/hydrogen';

export function ProductPrice({ price, compareAtPrice }) {
  if (!price) return <span style={{ display: 'inline-block', minWidth: '40px' }}>&nbsp;</span>;

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      {compareAtPrice ? (
        <>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#c00' }}>
            <Money data={price} />
          </span>
          <s style={{ fontSize: '14px', color: '#aaa', fontWeight: '400' }}>
            <Money data={compareAtPrice} />
          </s>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#c00', backgroundColor: '#fff0f0', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em' }}>
            SALE
          </span>
        </>
      ) : (
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#111' }}>
          <Money data={price} />
        </span>
      )}
    </div>
  );
}
