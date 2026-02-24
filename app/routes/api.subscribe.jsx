export async function action({ request, context }) {
  const { email, phone } = await request.json();

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'E-mail inválido' }, { status: 400 });
  }

  const adminDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

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
    phone: phone || null,
    tags: ['popup-lead'],
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
    },
  };

  if (phone) {
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
    const errors = data?.data?.customerCreate?.userErrors;

    if (errors && errors.length > 0) {
      // Se cliente já existe, tudo bem
      if (errors[0].message.includes('already')) {
        return Response.json({ success: true, existing: true });
      }
      return Response.json({ error: errors[0].message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Erro ao salvar. Tente novamente.' }, { status: 500 });
  }
}
