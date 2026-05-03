export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  const userToken = context.request.headers.get("Authorization-User"); 

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token utente mancante" }), { status: 401 });
  }

  // Interroga Pi Network per i pagamenti incompleti dell'utente
  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "accessToken": userToken // <--- Fondamentale per sbloccare l'errore 401
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
