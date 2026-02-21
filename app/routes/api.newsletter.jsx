export async function action({ request, context }) {
  const { email } = await request.json();
  if (!email) return new Response('Missing email', { status: 400 });

  try {
    await context.storefront.mutate(`#graphql
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer { id email }
          customerUserErrors { message }
        }
      }
    `, {
      variables: {
        input: {
          email,
          acceptsMarketing: true,
          password: Math.random().toString(36).slice(-10) + 'Aa1!',
        }
      }
    });
    return new Response('OK', { status: 200 });
  } catch {
    return new Response('Error', { status: 500 });
  }
}
