import { Link } from '@remix-run/react';

export function ProductCarousel({ title, products, showMarketplaceWarning = false }) {
  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-normal">{title}</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100">&lt;</button>
          <button className="p-2 hover:bg-gray-100">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <Link to={`/products/${product.handle}`} key={idx} className="group cursor-pointer">
            <div className="relative mb-3 bg-gray-100 aspect-[3/4] overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <button className="absolute top-3 right-3 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm">
                ♡
              </button>
            </div>
            <h3 className="text-sm font-bold text-gray-900">{product.vendor}</h3>
            <p className="text-sm text-gray-600 truncate">{product.title}</p>
            <p className="text-sm font-bold mt-1">${product.price}</p>
          </Link>
        ))}
      </div>
      
      {showMarketplaceWarning && (
         <div className="mt-6 p-4 bg-gray-50 border border-gray-200 text-sm text-gray-700">
           This item is sold by and sent directly from a Marketplace Seller and may arrive <strong>separately</strong> if ordered with other items. <a href="#" className="underline text-blue-600">Learn more</a>
         </div>
      )}
    </div>
  );
}
