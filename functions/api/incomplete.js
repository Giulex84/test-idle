export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; 

  // Creazione formale Headers per evitare collisioni Cloudflare
  const myHeaders = new Headers();
  myHeaders.append("Authorization", apiKey);
  myHeaders.append("Content-Type", "application/json");

  try {
    // Deve essere POST, non GET
    const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
      method: "POST", 
      headers: myHeaders
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { 
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
