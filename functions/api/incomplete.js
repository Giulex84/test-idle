export async function onRequest(context) {
  // Prende la chiave dalle variabili d'ambiente di Cloudflare
  const apiKey = context.env.PI_API_KEY; 
  
  // Estrae il token dall'indirizzo URL (?token=...)
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken || userToken === "null") {
    return new Response(JSON.stringify({ error: "Il server non ha ricevuto il Token dall'URL" }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Chiamata ai server ufficiali di Pi Network
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": apiKey, // Deve essere "Key TUACHIAVE"
        "accessToken": userToken  // Il token dell'utente
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore interno del server Cloudflare" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
