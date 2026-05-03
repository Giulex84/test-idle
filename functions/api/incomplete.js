export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  
  // Recuperiamo l'Access Token dell'utente che invieremo dal Frontend
  const userToken = context.request.headers.get("Authorization-User"); 

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "accessToken": userToken // Questo è il token che sblocca l'errore che vedevi
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
