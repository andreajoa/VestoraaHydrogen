import { useState } from 'react';

export function DeliveryEstimator() {
  const [postcode, setPostcode] = useState('');
  const [estimate, setEstimate] = useState(null);

  const checkDelivery = (e) => {
    e.preventDefault();
    if (postcode) setEstimate('Estimated delivery: 3-6 business days');
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-6">
      <h3 className="text-sm font-bold text-gray-900 mb-2">Delivery</h3>
      <p className="text-sm text-gray-500 mb-4">Check your delivery time</p>
      
      <form onSubmit={checkDelivery} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Enter suburb / postcode" 
          className="border border-gray-300 p-3 w-full text-sm"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <button type="submit" className="border border-gray-300 px-6 py-3 text-sm font-bold hover:bg-gray-50">
          GO!
        </button>
      </form>
      
      {estimate && <p className="text-sm font-bold text-green-700 mb-4">{estimate}</p>}

      <div className="bg-gray-50 p-4 text-xs text-gray-600 border border-gray-100">
        This item is sold by and sent directly from a Marketplace Seller and may arrive <strong>separately</strong> if ordered with other items. <a href="https://www.theiconic.com.au/shipping-policy/" className="text-blue-600 hover:underline">Learn more</a>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">Delivery dates and times are based on your location and are estimates only.</p>
    </div>
  );
}
