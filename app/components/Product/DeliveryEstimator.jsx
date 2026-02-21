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
    <div className="mt-5 pt-5 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Delivery</h3>
      <p className="text-xs text-gray-500 mb-3">Check your delivery time</p>
      <form onSubmit={handleCheck} className="flex mb-3">
        <input type="text" value={postcode}
          onChange={e => { setPostcode(e.target.value); setEstimate(null); }}
          placeholder="Enter suburb / postcode"
          className="flex-1 border border-gray-300 border-r-0 px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-700" />
        <button type="submit" disabled={loading}
          className="border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 bg-white">
          {loading ? '...' : 'GO!'}
        </button>
      </form>
      {estimate && (
        <p className="text-sm text-gray-800 mb-3">
          <span className="font-semibold">Estimated delivery:</span> {estimate}
        </p>
      )}
      <div className="text-xs text-gray-600 leading-relaxed mb-2">
        This item is sold by and sent directly from a Marketplace Seller and may arrive{' '}
        <strong>separately</strong> if ordered with other items.{' '}
        <a href="/policies/shipping-policy" className="text-blue-600 hover:underline">Learn more</a>
      </div>
      <p className="text-xs text-gray-400">Delivery dates are estimates only and based on your location.</p>
    </div>
  );
}
