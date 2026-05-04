export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  const { paymentId, txid } = await context.request.json();

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: { 
        "Authorization": apiKey, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ txid })
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
