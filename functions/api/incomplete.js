export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  
  // Prende il token che hai spedito dall'index.html
  const userToken = context.request.headers.get("Authorization-User"); 

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token non pervenuto al server" }), { status: 401 });
  }

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "accessToken": userToken // Pi Network vuole il token utente qui
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
