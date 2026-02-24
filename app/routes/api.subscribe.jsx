export async function action({ request, context }) {
  const { email, phone } = await request.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const adminDomain = context.env?.SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = context.env?.SHOPIFY_ADMIN_API_TOKEN || process.env.SHOPIFY_ADMIN_API_TOKEN;

  if (!adminDomain || !adminToken) {
    return Response.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          phone
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    email,
    tags: ['popup-lead'],
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },
  };

  if (phone && phone.trim()) {
    input.phone = phone.trim();
    input.smsMarketingConsent = {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
      consentCollectedFrom: 'OTHER',
    };
  }

  try {
    const response = await fetch(
      `https://${adminDomain}/admin/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify({ query: mutation, variables: { input } }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: 'Shopify API error.' }, { status: 500 });
    }

    const errors = data?.data?.customerCreate?.userErrors;

    if (errors && errors.length > 0) {
      // Cliente já existe — retorna sucesso mesmo assim
      if (
        errors[0].message.toLowerCase().includes('already') ||
        errors[0].message.toLowerCase().includes('taken')
      ) {
        return Response.json({ success: true, existing: true });
      }
      return Response.json({ error: errors[0].message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return Response.json({ error: 'Connection error. Please try again.' }, { status: 500 });
  }
}
