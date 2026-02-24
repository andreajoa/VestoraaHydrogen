export async function loader({ request }) {
  // Oxygen passa o IP real nesses headers
  const ip =
    request.headers.get('oxygen-buyer-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '';

  if (!ip) {
    return Response.json({ city: '' });
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    return Response.json({ city: data.city || data.region || '' });
  } catch {
    try {
      const res2 = await fetch(`https://ipwho.is/${ip}`);
      const data2 = await res2.json();
      return Response.json({ city: data2.city || data2.region || '' });
    } catch {
      return Response.json({ city: '' });
    }
  }
}
