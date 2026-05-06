export async function onRequest(context) {
  const { paymentId, txid } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Key ${apiKey}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    // Chiamata di completamento definitiva
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify({ txid: txid })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
