import { useState } from 'react';

function estimateDelivery(postcode) {
  const c = postcode.trim().toUpperCase();
  if (/^\d{4}$/.test(c)) {
    const n = parseInt(c);
    if (n >= 2000 && n <= 2999) return '2-4 business days';
    if (n >= 3000 && n <= 3999) return '3-5 business days';
    if (n >= 4000 && n <= 4999) return '4-6 business days';
    if (n >= 5000 && n <= 5999) return '5-7 business days';
    if (n >= 6000 && n <= 6999) return '6-9 business days';
    if (n >= 7000 && n <= 7999) return '5-8 business days';
    return '3-7 business days';
  }
  if (/^[A-Z]{1,2}\d/.test(c)) return '5-10 business days';
  if (/^\d{5}$/.test(c)) return '7-14 business days';
  return '7-21 business days';
}

export function DeliveryEstimator() {
  const [postcode, setPostcode] = useState('');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setEstimate(estimateDelivery(postcode));
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#111', margin: '0 0 4px' }}>Delivery</h3>
      <p style={{ fontSize: '11px', color: '#888', margin: '0 0 10px' }}>Check your delivery time</p>
      <form onSubmit={handleCheck} style={{ display: 'flex', marginBottom: '10px', width: '100%', boxSizing: 'border-box', paddingRight: '16px' }}>
        <input
          type="text"
          value={postcode}
          onChange={e => { setPostcode(e.target.value); setEstimate(null); }}
          placeholder="Enter suburb / postcode"
          style={{ flex: 1, minWidth: 0, border: '1px solid #ddd', borderRight: 'none', padding: '0 10px', height: '40px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ flexShrink: 0, width: '52px', height: '40px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '11px', fontWeight: '700', color: '#333', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {loading ? '...' : 'GO!'}
        </button>
      </form>
      {estimate && (
        <p style={{ fontSize: '12px', color: '#333', margin: '0 0 10px' }}>
          <strong>Estimated delivery:</strong> {estimate}
        </p>
      )}
      <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.6, margin: '0 0 6px' }}>
        This item is sold by and sent directly from a Marketplace Seller and may arrive{' '}
        <strong>separately</strong> if ordered with other items.{' '}
        <a href="/policies/shipping-policy" style={{ color: '#0066cc' }}>Learn more</a>
      </p>
      <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>Delivery dates are estimates only.</p>
    </div>
  );
}
