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
  if (!product?.id) throw new Response('Product not found', { status: 404 });
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
  const [detailsExpanded, setDetailsExpanded] = useState(false);

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
  
  const variantImage = selectedVariant?.image;
  const displayImages = variantImage
    ? [variantImage, ...allImages.filter(img => img.id !== variantImage.id)]
    : allImages;

  const mainImage = displayImages[activeImg] || displayImages[0];
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
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 16px' }}>
        <nav style={{ fontSize: '11px', color: '#666' }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <a href="/collections/all" style={{ color: '#666', textDecoration: 'none' }}>All Products</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: '#333' }}>{title}</span>
        </nav>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px 40px' }}>
        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

          {/* LEFT: Gallery */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Thumbnails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '80px', flexShrink: 0 }}>
              {displayImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImg(idx)}
                  style={{
                    border: activeImg === idx ? '2px solid #111' : '2px solid transparent',
                    padding: 0,
                    cursor: 'pointer',
                    background: 'none',
                    outline: 'none',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.altText || title}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div style={{ flex: 1, position: 'relative', backgroundColor: '#f5f5f5' }}>
              {mainImage && (
                <img
                  src={mainImage.url}
                  alt={mainImage.altText || title}
                  style={{ width: '100%', maxHeight: '720px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                />
              )}
              <button
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#fff', border: '1px solid #eee',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '16px', color: '#999',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                }}
              >
                ♡
              </button>
            </div>
          </div>

          {/* RIGHT: Product info panel */}
          <div style={{ position: 'sticky', top: '16px' }}>
            {/* Brand + Favourite */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div>
                {vendor && (
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {vendor}
                  </p>
                )}
                <h1 style={{ fontSize: '18px', fontWeight: '400', color: '#111', lineHeight: 1.3, margin: 0 }}>{title}</h1>
              </div>
              <button style={{
                fontSize: '11px', border: '1px solid #ccc', padding: '6px 10px',
                color: '#555', backgroundColor: '#fff', cursor: 'pointer',
                whiteSpace: 'nowrap', marginLeft: '12px', flexShrink: 0,
              }}>
                ♡ FAVOURITE BRAND
              </button>
            </div>

            {/* Stars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '8px 0 12px' }}>
              <div style={{ display: 'flex', color: '#f5a623', fontSize: '13px' }}>★★★★☆</div>
              <span style={{ fontSize: '11px', color: '#888' }}>(9)</span>
              <a href="#reviews" style={{ fontSize: '11px', color: '#555', marginLeft: '4px' }}>Write a review</a>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '16px' }}>
              <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
            </div>

            {/* Product Form (Color + Size + Buttons) */}
            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />

            {/* Size Guide */}
            <button
              onClick={() => setSizeGuideOpen(true)}
              style={{ marginTop: '8px', fontSize: '11px', textDecoration: 'underline', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              View Size Guide
            </button>

            {/* Accordion */}
            <ProductAccordion items={accordionItems} />

            {/* Delivery */}
            <DeliveryEstimator />

            {/* Returns */}
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>
                <strong>Returns</strong> — Returns are free for 30 days unless marked.
              </p>
              <a href="/policies/refund-policy" style={{ fontSize: '11px', color: '#0066cc' }}>
                Find out more about our return policy
              </a>
            </div>
          </div>
        </div>

        {/* WEAR IT WITH - appears right after the 2-col section */}
        <ProductCarousel title="Wear it with" products={products.slice(0, 4)} showMarketplaceNotice={true} />

        {/* PRODUCT DETAILS - expandable */}
        {descriptionHtml && (
          <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#111', marginBottom: '14px' }}>Product details</h2>
            <div
              style={{
                fontSize: '13px', color: '#555', lineHeight: 1.7,
                maxHeight: detailsExpanded ? 'none' : '80px',
                overflow: 'hidden',
                position: 'relative',
              }}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
            {!detailsExpanded && (
              <div style={{ position: 'relative' }}>
                <div style={{ background: 'linear-gradient(to bottom, transparent, #fff)', height: '40px', marginTop: '-40px', position: 'relative' }} />
                <button
                  onClick={() => setDetailsExpanded(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: '600' }}
                >
                  Read more ▾
                </button>
              </div>
            )}
            {detailsExpanded && (
              <button
                onClick={() => setDetailsExpanded(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: '600' }}
              >
                Read less ▴
              </button>
            )}
          </div>
        )}

        {/* SIMILAR ITEMS */}
        <ProductCarousel title="Similar items" products={products.slice(0, 4)} />

        {/* YOU MAY ALSO LIKE */}
        <ProductCarousel title="You may also like" products={products.slice(4, 8).length > 0 ? products.slice(4, 8) : products.slice(0, 4)} />

        {/* REVIEWS */}
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
