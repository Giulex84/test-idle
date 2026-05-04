export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; 
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token non ricevuto" }), { status: 400 });
  }

  try {
    // Proviamo a inviare il token in ENTRAMBI i modi comuni
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": apiKey, // La tua Key con "Key "
        "accessToken": userToken, // Metodo 1
        "X-User-AccessToken": userToken // Metodo 2 (usato da alcuni SDK)
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore di rete" }), { status: 500 });
  }
}
