import {useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta = ({data}) => {
  return [{title: `Vestoraa | ${data?.page.title ?? ''}`}];
};

export async function loader(args) {
  const criticalData = await loadCriticalData(args);
  return criticalData;
}

async function loadCriticalData({context, request, params}) {
  if (!params.handle) throw new Error('Missing page handle');

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: { handle: params.handle },
    }),
  ]);

  if (!page) throw new Response('Not Found', {status: 404});

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return { page };
}

export default function Page() {
  const {page} = useLoaderData();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{
        fontSize: '28px', fontWeight: '400', color: '#111',
        marginBottom: '32px', paddingBottom: '20px',
        borderBottom: '1px solid #eee', letterSpacing: '0.01em',
      }}>
        {page.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{__html: page.body}}
        style={{
          fontSize: '14px', color: '#444', lineHeight: 1.8,
        }}
      />
      <style>{`
        .page-body h2 { font-size: 18px; font-weight: 600; color: #111; margin: 32px 0 12px; }
        .page-body h3 { font-size: 15px; font-weight: 600; color: #111; margin: 24px 0 8px; }
        .page-body p  { margin: 0 0 16px; }
        .page-body a  { color: #111; text-decoration: underline; }
        .page-body ul, .page-body ol { padding-left: 20px; margin: 0 0 16px; }
        .page-body li { margin-bottom: 6px; }
        .page-body strong { font-weight: 600; color: #111; }
        .page-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .page-body td, .page-body th { padding: 10px 12px; border: 1px solid #eee; text-align: left; }
        .page-body th { background: #f9f9f9; font-weight: 600; }
        @media (max-width: 600px) {
          div[style*="max-width: 800px"] { padding: 40px 16px 60px !important; }
        }
      `}</style>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
