export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // Assicurati di aver aggiunto "Key " davanti su Cloudflare!
  
  // Legge il token dal nuovo header personalizzato
  const userToken = context.request.headers.get("x-pi-token"); 

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Manca lo User Access Token" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
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
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore di rete" }), { status: 500 });
  }
}
