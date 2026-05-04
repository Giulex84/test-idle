export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // Deve avere "Key " davanti su Cloudflare
  
  // Legge il token dall'URL (?token=...)
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token non ricevuto" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": apiKey, 
        "accessToken": userToken 
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore server" }), { status: 500 });
  }
}
