export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  const { paymentId, txid } = await context.request.json();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", apiKey);
  myHeaders.append("Content-Type", "application/json");

  try {
    // Se txid non esiste (caso A2U bloccato), inviamo oggetto vuoto
    const body = txid ? JSON.stringify({ txid }) : JSON.stringify({});

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: myHeaders,
      body: body
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
