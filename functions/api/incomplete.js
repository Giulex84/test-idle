export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  // Proviamo a leggere il token da entrambi i posti possibili per sicurezza
  const userToken = context.request.headers.get("Authorization-User") || context.request.headers.get("accessToken"); 

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token mancante nel frontend" }), { status: 401 });
  }

  try {
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "accessToken": userToken // Questo DEVE essere minuscolo/maiuscolo esattamente così
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
