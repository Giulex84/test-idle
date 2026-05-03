export async function onRequestPost(context) {
  try {
    const { paymentId, txid } = await context.request.json();
    const apiKey = context.env.PI_API_KEY;

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: { 
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
