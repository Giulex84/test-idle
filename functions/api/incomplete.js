export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // Qui c'è già "Key ..."
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken) return new Response(JSON.stringify({ error: "Token mancante" }), { status: 400 });

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
}
