import { useState } from 'react';
import { useLoaderData } from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductPrice } from '~/components/ProductPrice';
import { ProductForm } from '~/components/ProductForm';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { ProductAccordion } from '~/components/Product/ProductAccordion';
import { DeliveryEstimator } from '~/components/Product/DeliveryEstimator';
import { SizeGuideModal } from '~/components/Product/SizeGuideModal';
import { ProductCarousel } from '~/components/Product/ProductCarousel';
import { ReviewsSection } from '~/components/Product/ReviewsSection';

export const meta = ({ data }) => {
  return [
    { title: 'Vestoraa | ' + (data?.product.title ?? '') },
    { name: 'description', content: data?.product.description ?? '' },
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }) {
  const { handle } = params;
  const { storefront } = context;
  if (!handle) throw new Response('Expected product handle', { status: 404 });
  const selectedOptions = getSelectedProductOptions(request) || [];
  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, { variables: { handle, selectedOptions } }),
  ]);
  if (!product?.id) {
    console.error('Product not found for handle:', handle, 'selectedOptions:', selectedOptions);
    throw new Response('Product not found', { status: 404 });
  }
  redirectIfHandleIsLocalized(request, { handle, data: product });
  return { product };
}

function loadDeferredData({ context }) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => { console.error(error); return null; });
  return { recommendedProducts };
}

export default function Product() {
  const { product, recommendedProducts } = useLoaderData();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  useSelectedOptionInUrlParam(productOptions);

  const { title, vendor, descriptionHtml, images } = product;
  const allImages = images?.nodes || [];
  const mainImage = selectedVariant?.image || allImages[activeImg] || allImages[0];
  const products = recommendedProducts?.products?.nodes || [];

  const accordionItems = [
    {
      title: 'Material',
      content: 'Please refer to the product label for material information.',
    },
    {
      title: 'Size & fit',
      content: 'This style fits true to size. Model wears size AU8/S.',
      link: { text: 'VIEW SIZE GUIDE', onClick: () => setSizeGuideOpen(true) },
    },
    {
      title: 'Care',
      content: 'Cold Hand Wash, Warm Inside Out, Do Not Bleach or Soak, Do Not Tumble Dry, Warm Iron.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <nav className="text-xs text-gray-500">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-1">/</span>
          <a href="/collections/all" className="hover:underline">All Products</a>
          <span className="mx-1">/</span>
          <span className="text-gray-900">{title}</span>
        </nav>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">

          <div className="flex gap-3">
            <div className="hidden md:flex flex-col gap-2 w-[90px] flex-shrink-0">
              {allImages.map((img, idx) => (
                <button key={img.id || idx} onClick={() => setActiveImg(idx)}
                  style={{ border: activeImg === idx ? '2px solid #111' : '2px solid transparent' }}
                  className="transition-all">
                  <img src={img.url} alt={img.altText || title} className="w-full aspect-[3/4] object-cover object-center" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative bg-gray-50">
              {mainImage && (
                <img src={mainImage.url} alt={mainImage.altText || title}
                  className="w-full object-cover object-center" style={{ maxHeight: '700px' }} />
              )}
              <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-red-400 transition text-lg">
                ♡
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="flex justify-between items-start mb-1">
              <div>
                {vendor && <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">{vendor}</p>}
                <h1 className="text-xl font-normal text-gray-900 leading-snug">{title}</h1>
              </div>
              <button className="text-xs border border-gray-300 px-3 py-1.5 text-gray-600 hover:bg-gray-50 whitespace-nowrap ml-4 flex-shrink-0">
                ♡ FAVOURITE BRAND
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 mb-3">
              <div className="flex text-yellow-400 text-sm">★★★★☆</div>
              <span className="text-xs text-gray-500">(9)</span>
              <a href="#reviews" className="text-xs text-gray-600 underline hover:text-gray-900 ml-1">Write a review</a>
            </div>

            <div className="mb-4">
              <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
            </div>

            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />

            <button onClick={() => setSizeGuideOpen(true)}
              className="mt-3 text-xs underline text-gray-600 hover:text-gray-900">
              View Size Guide
            </button>

            <ProductAccordion items={accordionItems} />
            <DeliveryEstimator />

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Returns</span> — Returns are free for 30 days unless marked.
              </p>
              <a href="/policies/refund-policy" className="text-xs text-blue-600 hover:underline">Find out more about our return policy</a>
            </div>
          </div>
        </div>

        <ProductCarousel title="Wear it with" products={products.slice(0, 4)} showMarketplaceNotice={true} />

        {descriptionHtml && (
          <div className="mt-12 pt-10 border-t border-gray-200">
            <h2 className="text-lg font-normal text-gray-900 mb-4">Product details</h2>
            <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
        )}

        <ProductCarousel title="Similar items" products={products.slice(0, 4)} />
        <ProductCarousel title="You may also like" products={products.slice(0, 4)} />
        <ReviewsSection productId={product.id} productTitle={title} />
      </div>

      <Analytics.ProductView
        data={{
          products: [{
            id: product.id,
            title: product.title,
            price: selectedVariant?.price?.amount || '0',
            vendor: product.vendor,
            variantId: selectedVariant?.id || '',
            variantTitle: selectedVariant?.title || '',
            quantity: 1,
          }],
        }}
      />

      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id title vendor handle descriptionHtml description
      encodedVariantExistence encodedVariantAvailability
      options {
        name
        optionValues {
          name
          firstSelectableVariant { ...ProductVariant }
          swatch { color image { previewImage { url } } }
        }
      }
      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
      adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
      images(first: 10) { nodes { id url altText width height } }

      seo { description title }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query ProductPageRecommended(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id title handle vendor
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        featuredImage { id url altText width height }
      }
    }
  }
`;
