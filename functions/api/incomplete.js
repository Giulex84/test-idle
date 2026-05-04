export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; 
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Token non pervenuto al backend" }), { status: 400 });
  }

  try {
    // Proviamo a inviare il token sia come 'accessToken' che come 'Authorization: Bearer'
    // Alcuni endpoint di Pi preferiscono uno o l'altro
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "GET",
      headers: {
        "Authorization": apiKey, // La tua chiave con "Key "
        "accessToken": userToken, // Metodo standard Pi
        "Bearer": userToken      // Metodo alternativo per alcuni nodi API
      }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Errore di connessione server-to-server" }), { status: 500 });
  }
}
