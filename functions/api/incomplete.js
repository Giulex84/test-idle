export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; 

  // Seguendo il fix dei moderatori: 
  // Rimuoviamo l'accessToken perché l'endpoint è strettamente Server-to-Server
  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": apiKey // Solo la API Key, niente altro.
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
