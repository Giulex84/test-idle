export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // DEVE AVERE "Key " DAVANTI SU CLOUDFLARE
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token non ricevuto dal frontend" }), { status: 400 });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": apiKey, // Questo userà "Key lfhsv..."
        "accessToken": userToken  // Il token utente autorizzato
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore di rete Cloudflare" }), { status: 500 });
  }
}
