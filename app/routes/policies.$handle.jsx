import {useLoaderData} from 'react-router';

export const meta = ({data}) => {
  return [{title: `Vestoraa | ${data?.policy.title ?? ''}`}];
};

export async function loader({params, context}) {
  if (!params.handle) throw new Response('No handle was passed in', {status: 404});

  const policyName = params.handle.replace(/-([a-z])/g, (_, m1) => m1.toUpperCase());

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
    },
  });

  const policy = data.shop?.[policyName];
  if (!policy) throw new Response('Could not find the policy', {status: 404});

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{
        fontSize: '26px', fontWeight: '400', color: '#111',
        marginBottom: '32px', paddingBottom: '20px',
        borderBottom: '1px solid #eee',
      }}>
        {policy.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{__html: policy.body}}
        style={{ fontSize: '14px', color: '#444', lineHeight: 1.8 }}
      />
      <style>{`
        h2 { font-size: 17px; font-weight: 600; color: #111; margin: 32px 0 12px; }
        h3 { font-size: 15px; font-weight: 600; color: #111; margin: 24px 0 8px; }
        p  { margin: 0 0 16px; }
        a  { color: #111; text-decoration: underline; }
        ul, ol { padding-left: 20px; margin: 0 0 16px; }
        li { margin-bottom: 6px; }
        strong { font-weight: 600; color: #111; }
        @media (max-width: 600px) {
          div[style*="max-width: 800px"] { padding: 40px 16px 60px !important; }
        }
      `}</style>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment PolicyHandle on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query PoliciesHandle(
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) { ...PolicyHandle }
      shippingPolicy @include(if: $shippingPolicy) { ...PolicyHandle }
      termsOfService @include(if: $termsOfService) { ...PolicyHandle }
      refundPolicy @include(if: $refundPolicy) { ...PolicyHandle }
    }
  }
`;
