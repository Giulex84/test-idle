export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  
  // Legge l'header personalizzato inviato dal tuo frontend
  const userToken = context.request.headers.get("Authorization-User"); 

  if (!userToken) {
    return new Response(JSON.stringify({ error: "User Token missing in header" }), { status: 401 });
  }

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "accessToken": userToken // Pi API si aspetta 'accessToken' qui
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
