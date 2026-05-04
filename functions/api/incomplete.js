export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; 

  // FIX: Non passare mai l'accessToken dell'utente qui!
  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": apiKey // Solo la tua API Key
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
}
