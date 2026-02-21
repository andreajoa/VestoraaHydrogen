import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [
    {title: `Vestoraa | ${data?.product.title ?? ''}`},
    {
      name: 'description',
      content: data?.product.description ?? '',
    },
  ];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('Expected product handle', {status: 404});
  }

  const selectedOptions = getSelectedProductOptions(request);

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response('Product not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {recommendedProducts};
}

export default function Product() {
  const {product} = useLoaderData();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  useSelectedOptionInUrlParam(productOptions);

  const {title, vendor, descriptionHtml, images} = product;
  const allImages = images?.nodes || [];
  const mainImage = selectedVariant?.image || allImages[0];

  return (
    <div className="product-page">
      <div className="product">
        {/* LEFT: Images */}
        <div className="product-images">
          <div className="product-thumbnails">
            {allImages.map((img, idx) => (
              <img
                key={img.id || idx}
                src={img.url}
                alt={img.altText || `${title} thumbnail ${idx + 1}`}
                className="product-thumbnail"
                width={80}
                height={100}
              />
            ))}
          </div>
          <div className="product-image-main">
            {mainImage && (
              <img
                src={mainImage.url}
                alt={mainImage.altText || title}
                className="product-main-img"
              />
            )}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="product-main">
          {vendor && <p className="product-vendor">{vendor}</p>}
          <h1>{title}</h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <br />

          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          <br />

          {/* Delivery Estimator */}
          <DeliveryEstimator />

          <br />

          {/* Description */}
          {descriptionHtml && (
            <div className="product-description">
              <details>
                <summary>
                  <strong>Description</strong>
                </summary>
                <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
              </details>
            </div>
          )}
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function DeliveryEstimator() {
  return (
    <div className="delivery-estimator">
      <h3>Delivery</h3>
      <p className="delivery-sub">Check your delivery time</p>
      <form
        className="delivery-form"
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.elements.postcode;
          if (input.value) {
            const result = e.target.querySelector('.delivery-result');
            if (result) result.textContent = 'Estimated delivery: 3-6 business days';
          }
        }}
      >
        <input
          name="postcode"
          type="text"
          placeholder="Enter suburb / postcode"
          className="delivery-input"
        />
        <button type="submit" className="delivery-btn">
          GO!
        </button>
      </form>
      <p className="delivery-result"></p>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
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
      id
      title
      vendor
      handle
      descriptionHtml
      description
      encodedVariantExistence
      encodedVariantAvailability
      options {
        name
        optionValues {
          name
          firstSelectableVariant {
            ...ProductVariant
          }
          swatch {
            color
            image {
              previewImage {
                url
              }
            }
          }
        }
      }
      selectedOrFirstAvailableVariant(
        selectedOptions: $selectedOptions
        ignoreUnknownOptions: true
        caseInsensitiveMatch: true
      ) {
        ...ProductVariant
      }
      adjacentVariants(selectedOptions: $selectedOptions) {
        ...ProductVariant
      }
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      seo {
        description
        title
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query ProductPageRecommended(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
