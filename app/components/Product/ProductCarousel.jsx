import { useState } from 'react';
import { Link } from 'react-router';

export function ProductCarousel({ title, products, showMarketplaceNotice }) {
  const [start, setStart] = useState(0);
  const perPage = 4;
  const visible = products.slice(start, start + perPage);
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-normal text-gray-900">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => setStart(Math.max(0, start - perPage))} disabled={start === 0}
            className={'w-8 h-8 border flex items-center justify-center text-lg ' + (start === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:bg-gray-50')}>
            &#8249;
          </button>
          <button onClick={() => setStart(Math.min(products.length - perPage, start + perPage))} disabled={start + perPage >= products.length}
            className={'w-8 h-8 border flex items-center justify-center text-lg ' + (start + perPage >= products.length ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:bg-gray-50')}>
            &#8250;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((product) => {
          const image = product.featuredImage || product.images?.nodes?.[0];
          const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
          const comparePrice = product.compareAtPriceRange ? parseFloat(product.compareAtPriceRange.minVariantPrice?.amount || 0) : null;
          const onSale = comparePrice && comparePrice > price;
          return (
            <Link key={product.id} to={'/products/' + product.handle} className="group block">
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                {image && (
                  <img src={image.url} alt={image.altText || product.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                )}
                <button onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 text-sm">
                  ♡
                </button>
                {onSale && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 font-bold">SALE</span>}
              </div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">{product.vendor}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-tight">{product.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={'text-sm ' + (onSale ? 'text-red-600' : 'text-gray-900')}>${price.toFixed(2)}</span>
                {onSale && comparePrice && <span className="text-xs text-gray-400 line-through">${comparePrice.toFixed(2)}</span>}
              </div>
            </Link>
          );
        })}
      </div>
      {showMarketplaceNotice && (
        <p className="mt-4 text-xs text-gray-500">
          This item is sold by and sent directly from a Marketplace Seller and may arrive <strong>separately</strong> if ordered with other items.{' '}
          <a href="/policies/shipping-policy" className="text-blue-600 hover:underline">Learn more</a>
        </p>
      )}
    </div>
  );
}
