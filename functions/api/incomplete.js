export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // La tua Server Key (inizia con "Key...")
  const authHeader = context.request.headers.get("Authorization");
  
  // Estrazione pulita del Bearer Token dell'utente
  const userToken = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : null;

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Manca lo User Access Token" }), { status: 401 });
  }

  try {
    // Chiamata per i pagamenti incompleti
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": `Key ${apiKey}`, // Qui si usa la Server Key
        "accessToken": userToken         // Qui si passa il token utente
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
