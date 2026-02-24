import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
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
import { ProductCarousel } from '~/components/Product/ProductCarousel';
import { ReviewsSection } from '~/components/Product/ReviewsSection';
import { WearItWithStrip } from '~/components/Product/WearItWithStrip';

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

// Helper: build similar items query based on product type + style tags
function buildSimilarQuery(product) {
  const type = (product.productType || '').toLowerCase().trim();
  const tags = (product.tags || []).map(t => t.toLowerCase());
  const title = (product.title || '').toLowerCase();

  // Detect category
  const isDress = /dress/.test(type) || tags.some(t => /dress/.test(t));
  const isSkirt = /skirt/.test(type) || tags.some(t => /skirt/.test(t));
  const isTop = /top|blouse|shirt/.test(type) || tags.some(t => /\btop\b|blouse|shirt/.test(t));
  const isBodysuit = /bodysuit/.test(type) || tags.some(t => /bodysuit/.test(t));
  const isJumpsuit = /jumpsuit|playsuit/.test(type) || tags.some(t => /jumpsuit|playsuit/.test(t));
  const isBag = /bag|handbag|purse|tote|clutch/.test(type) || tags.some(t => /bag|handbag|purse|tote|clutch/.test(t));
  const isShoe = /shoe|heel|boot|sandal|sneaker|footwear/.test(type) || tags.some(t => /shoe|heel|boot|sandal|sneaker/.test(t));
  const isJewellery = /jewel|necklace|earring|bracelet|ring/.test(type) || tags.some(t => /jewel|necklace|earring|bracelet|ring/.test(t));

  // Detect style/cut/length tags
  const isMini = tags.some(t => /\bmini\b/.test(t)) || /mini/.test(title);
  const isMidi = tags.some(t => /\bmidi\b/.test(t)) || /midi/.test(title);
  const isMaxi = tags.some(t => /\bmaxi\b/.test(t)) || /maxi/.test(title);
  const isBodycon = tags.some(t => /bodycon|fitted|tight/.test(t));
  const isFlowy = tags.some(t => /flowy|floral|flare|wrap|relaxed/.test(t));
  const isCargo = tags.some(t => /cargo/.test(t));
  const isCasual = tags.some(t => /casual|everyday/.test(t));
  const isFormal = tags.some(t => /formal|evening|gala|cocktail/.test(t));

  // Build query parts
  let parts = [];

  if (type) parts.push(`product_type:${product.productType}`);

  // Add style/cut refinement tags
  if (isMini) parts.push('tag:mini');
  if (isMidi) parts.push('tag:midi');
  if (isMaxi) parts.push('tag:maxi');
  if (isBodycon) parts.push('tag:bodycon');
  if (isFlowy) parts.push('tag:flowy OR tag:floral OR tag:wrap');
  if (isFormal) parts.push('tag:formal OR tag:evening');
  if (isCasual) parts.push('tag:casual');
  if (isBag) parts.push('product_type:Bag OR product_type:Bags OR product_type:Handbag');
  if (isShoe) parts.push('product_type:Shoes OR product_type:Heels OR product_type:Boots');
  if (isJewellery) parts.push('product_type:Jewellery OR product_type:Jewelry');

  // If no type detected, fall back to broad
  if (parts.length === 0) parts.push('available_for_sale:true');

  return parts.join(' AND ');
}

// Helper: build complementary "Wear it with" query (DIFFERENT category)
function buildComplementaryQuery(product) {
  const type = (product.productType || '').toLowerCase();
  const tags = (product.tags || []).map(t => t.toLowerCase());

  const isDress = /dress/.test(type) || tags.some(t => /dress/.test(t));
  const isSkirt = /skirt/.test(type) || tags.some(t => /skirt/.test(t));
  const isTop = /top|blouse|shirt/.test(type) || tags.some(t => /\btop\b|blouse/.test(t));
  const isBag = /bag|handbag|purse|tote|clutch/.test(type) || tags.some(t => /bag|handbag/.test(t));
  const isShoe = /shoe|heel|boot|sandal|sneaker/.test(type) || tags.some(t => /shoe|heel|boot|sandal/.test(t));
  const isJewellery = /jewel|necklace|earring|bracelet/.test(type) || tags.some(t => /jewel|necklace|earring/.test(t));

  if (isDress || isJumpsuit) {
    return 'product_type:Bag OR product_type:Bags OR product_type:Shoes OR product_type:Heels OR product_type:Jewellery OR product_type:Jewelry OR product_type:Accessories';
  }
  if (isSkirt || isTop) {
    return 'product_type:Bag OR product_type:Shoes OR product_type:Heels OR product_type:Jewellery OR product_type:Top OR product_type:Skirt';
  }
  if (isBag) {
    return 'product_type:Dress OR product_type:Top OR product_type:Skirt OR product_type:Shoes OR product_type:Heels OR product_type:Jewellery';
  }
  if (isShoe) {
    return 'product_type:Dress OR product_type:Top OR product_type:Skirt OR product_type:Bag OR product_type:Jewellery';
  }
  if (isJewellery) {
    return 'product_type:Dress OR product_type:Top OR product_type:Bag OR product_type:Shoes';
  }
  return 'product_type:Bag OR product_type:Shoes OR product_type:Jewellery OR product_type:Accessories';
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

  const similarQuery = buildSimilarQuery(product);
  const complementaryQuery = buildComplementaryQuery(product);

  const [similarProducts, recommendedProducts] = await Promise.all([
    storefront.query(SIMILAR_PRODUCTS_QUERY, {
      variables: { query: similarQuery },
    }).catch(() => null),
    storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
      variables: { query: complementaryQuery },
    }).catch(() => null),
  ]);

  return { product, similarProducts, recommendedProducts };
}

function loadDeferredData({ context, params }) {
  return {};
}

function DesktopGallery({ images, title }) {
  const [active, setActive] = React.useState(0);
  const mainImg = images[active] || images[0];
  return (
    <div className="gallery-desktop" style={{ display: 'flex', gap: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100px', flexShrink: 0, position: 'sticky', top: '96px', maxHeight: 'calc(100vh - 110px)', overflowY: 'auto', scrollbarWidth: 'none', alignSelf: 'flex-start' }}>
        {images.map((img, idx) => (
          <button key={img.id || idx} onClick={() => setActive(idx)}
            style={{ border: 'none', padding: 0, cursor: 'pointer', background: 'none', outline: 'none', position: 'relative', display: 'block', flexShrink: 0 }}>
            <img src={img.url} alt={img.altText || title}
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '10px' }} />
            <div style={{ position: 'absolute', inset: 0, border: active === idx ? '3px solid #C9A84C' : '1px solid #ddd', borderRadius: '12px', pointerEvents: 'none', transition: 'border 0.2s' }} />
          </button>
        ))}
      </div>
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#f5f5f5' }}>
        {mainImg && (
          <img src={mainImg.url} alt={mainImg.altText || title}
            style={{ width: '100%', maxHeight: '720px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
        )}
        <button style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', color: '#999', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>♡</button>
      </div>
    </div>
  );
}

export default function Product() {
  const { product, recommendedProducts, similarProducts } = useLoaderData();
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

  useEffect(() => { setActiveImg(0); }, [selectedVariant?.id]);

  const mainImage = displayImages[activeImg] || displayImages[0];
  const currentHandle = product.handle;

  // Similar items: same type + style, exclude current product
  const similarItems = (similarProducts?.results?.nodes || [])
    .filter(p => p.handle !== currentHandle)
    .slice(0, 8);

  // Wear it with: complementary category, exclude current product
  const complementary = (recommendedProducts?.results?.nodes || [])
    .filter(p => p.handle !== currentHandle)
    .slice(0, 6);

  // Fallback if similar is empty
  const fallbackProducts = (recommendedProducts?.results?.nodes || [])
    .filter(p => p.handle !== currentHandle)
    .slice(0, 8);

  const metafields = product.metafields || [];
  const getMeta = (key) => metafields.find(m => m?.key === key)?.value;

  const materialContent = (() => {
    const fromMeta = getMeta('material') || getMeta('fabric') || getMeta('composition') || getMeta('materials');
    if (fromMeta && !fromMeta.includes('gid://')) return fromMeta;
    const desc = product.descriptionHtml || product.description || '';
    const clean = desc.replace(/<[^>]+>/g, ' ');
    const pct = clean.match(/(\d+%\s*[A-Za-z][A-Za-z\s]*(?:,\s*\d+%\s*[A-Za-z][A-Za-z\s]*)*)/);
    if (pct) return pct[0].trim();
    const label = clean.match(/(?:material|fabric|composition|content)[:\s]+([^.\n<]{3,60})/i);
    if (label) return label[1].trim();
    const fab = clean.match(/\b(cotton|polyester|silk|linen|wool|nylon|spandex|elastane|rayon|viscose|satin|chiffon|denim|jersey|crepe|velvet|suede|leather)[\w\s,]*\b/i);
    if (fab) return fab[0].trim();
    return 'Please refer to the product label for material information.';
  })();

  const careInfo = getMeta('care_instructions') || getMeta('care') || null;

  const accordionItems = [
    { title: 'Material', content: materialContent },
    { title: 'Size & fit', content: 'This style fits true to size. Model wears size AU8/S.', link: { text: 'VIEW SIZE GUIDE', onClick: () => {} } },
    { title: 'Care', content: careInfo || 'Cold Hand Wash, Warm Inside Out, Do Not Bleach or Soak. Do Not Tumble Dry. Warm Iron only.' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="product-breadcrumb" style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 16px' }}>
        <nav style={{ fontSize: '11px', color: '#666' }}>
          <a href="/" style={{ color: '#666', textDecoration: 'none' }}>Home</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <a href="/collections/all" style={{ color: '#666', textDecoration: 'none' }}>All Products</a>
          <span style={{ margin: '0 6px' }}>/</span>
          <span style={{ color: '#333' }}>{title}</span>
        </nav>
      </div>

      <div className="product-outer" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 0 40px' }}>
        <div className="product-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px', alignItems: 'start' }}>

          {/* LEFT: Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <DesktopGallery key={selectedVariant?.id || "default"} images={displayImages} title={title} />

            {/* MOBILE gallery */}
            <div key={"mob-" + (selectedVariant?.id || 'x')} className="gallery-mobile" style={{ display: 'none', flexDirection: 'column', gap: '8px' }}>
              <div style={{ position: 'relative', backgroundColor: '#f5f5f5' }}>
                {mainImage && (
                  <img src={mainImage.url} alt={mainImage.altText || title}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                )}
                {displayImages.length > 1 && (
                  <>
                    <button onClick={() => setActiveImg(i => (i - 1 + displayImages.length) % displayImages.length)}
                      style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>‹</button>
                    <button onClick={() => setActiveImg(i => (i + 1) % displayImages.length)}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>›</button>
                  </>
                )}
                <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '5px' }}>
                  {displayImages.slice(0, 8).map((_, idx) => (
                    <button key={idx} onClick={() => setActiveImg(idx)}
                      style={{ width: activeImg === idx ? '18px' : '6px', height: '6px', borderRadius: '3px', backgroundColor: activeImg === idx ? '#fff' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.2s, background 0.2s' }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', padding: '4px 2px' }}>
                {displayImages.map((img, idx) => (
                  <button key={img.id || idx} onClick={() => setActiveImg(idx)}
                    style={{ border: 'none', padding: 0, cursor: 'pointer', background: 'none', outline: 'none', position: 'relative', flexShrink: 0, width: '56px' }}>
                    <img src={img.url} alt={img.altText || title}
                      style={{ width: '56px', aspectRatio: '2/3', objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '6px' }} />
                    <div style={{ position: 'absolute', inset: 0, border: activeImg === idx ? '2px solid #C9A84C' : '1px solid #ddd', borderRadius: '6px', pointerEvents: 'none' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* WEAR IT WITH - always complementary, never same product */}
            <WearItWithStrip products={complementary} />
          </div>

          {/* RIGHT: Product info */}
          <div className="product-info-panel" style={{ position: 'sticky', top: '16px', minWidth: 0, paddingRight: '72px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <div>
                {vendor && (
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{vendor}</p>
                )}
                <h1 style={{ fontSize: '18px', fontWeight: '400', color: '#111', lineHeight: 1.4, margin: 0, wordBreak: 'break-word' }}>{title}</h1>
              </div>
              <button style={{ fontSize: '18px', border: 'none', background: 'none', color: '#ccc', cursor: 'pointer', flexShrink: 0, marginLeft: '8px', padding: '4px' }}>♡</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '8px 0 12px' }}>
              <div style={{ display: 'flex', color: '#f5a623', fontSize: '13px' }}>★★★★☆</div>
              <span style={{ fontSize: '11px', color: '#888' }}>(9)</span>
              <a href="#reviews" style={{ fontSize: '11px', color: '#555', marginLeft: '4px' }}>Write a review</a>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <ProductPrice price={selectedVariant?.price} compareAtPrice={selectedVariant?.compareAtPrice} />
            </div>

            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#555' }}>Pay over time for orders over</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#333' }}>$35.00 with</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#5A31F4', letterSpacing: '-0.02em', background: '#F3EFFF', padding: '1px 6px', borderRadius: '4px' }}>shop<span style={{ fontWeight: '900' }}>Pay</span></span>
                <a href='/policies/shipping-policy' style={{ fontSize: '11px', color: '#C9A84C', textDecoration: 'underline' }}>Learn more</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px' }}>🚚</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#333', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Qualifies for Free Shipping</span>
              </div>
            </div>

            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
            <ProductAccordion items={accordionItems} />
            <DeliveryEstimator />

            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #eee' }}>
              <p style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>
                <strong>Returns</strong> — Returns are free for 30 days unless marked.
              </p>
              <a href="/policies/refund-policy" style={{ fontSize: '11px', color: '#0066cc' }}>Find out more about our return policy</a>
            </div>
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        {descriptionHtml && (
          <div className="product-details-section" style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #eee', padding: '40px 0 0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#111', marginBottom: '14px' }}>Product details</h2>
            <div
              style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, maxHeight: detailsExpanded ? 'none' : '80px', overflow: 'hidden', position: 'relative' }}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
            {!detailsExpanded && (
              <div style={{ position: 'relative' }}>
                <div style={{ background: 'linear-gradient(to bottom, transparent, #fff)', height: '40px', marginTop: '-40px', position: 'relative' }} />
                <button onClick={() => setDetailsExpanded(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: '600' }}>Read more ▾</button>
              </div>
            )}
            {detailsExpanded && (
              <button onClick={() => setDetailsExpanded(false)} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: '600' }}>Read less ▴</button>
            )}
          </div>
        )}

        {/* SIMILAR ITEMS — same type + style, never current product */}
        <div className="product-below-section">
          <ProductCarousel
            title="Similar items"
            products={similarItems.length >= 2 ? similarItems : fallbackProducts}
          />

          {/* YOU MAY ALSO LIKE — complementary category */}
          <ProductCarousel
            title="You may also like"
            products={complementary.length >= 2 ? complementary : fallbackProducts}
          />

          <ReviewsSection productId={product.id} productTitle={title} productType={product.productType} />
        </div>
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
      id title vendor handle descriptionHtml description tags productType
      encodedVariantExistence encodedVariantAvailability
      options {
        name
        optionValues {
          name
          firstSelectableVariant { ...ProductVariant }
          swatch { color image { previewImage { url } } }
        }
      }
      variants(first: 250) { nodes { ...ProductVariant } }
      selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
      adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
      images(first: 10) { nodes { id url altText width height } }
      seo { description title }
      metafields(identifiers: [
        {namespace: "shopify", key: "material"}
        {namespace: "custom", key: "material"}
        {namespace: "descriptors", key: "material"}
        {namespace: "global", key: "material"}
        {namespace: "shopify", key: "care_instructions"}
        {namespace: "custom", key: "care_instructions"}
        {namespace: "custom", key: "care"}
        {namespace: "shopify", key: "fabric"}
        {namespace: "custom", key: "fabric"}
        {namespace: "custom", key: "composition"}
        {namespace: "custom", key: "materials"}
      ]) { key namespace value }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const SIMILAR_PRODUCTS_QUERY = `#graphql
  query SimilarProducts(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    results: products(first: 12, sortKey: UPDATED_AT, reverse: true, query: $query) {
      nodes {
        id title handle vendor productType tags
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        featuredImage { id url altText width height }
        variants(first: 1) { nodes { id availableForSale } }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query RecommendedProducts(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    results: products(first: 12, sortKey: UPDATED_AT, reverse: true, query: $query) {
      nodes {
        id title handle vendor productType tags
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        featuredImage { id url altText width height }
        variants(first: 1) { nodes { id availableForSale } }
      }
    }
  }
`;
