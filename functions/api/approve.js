export async function onRequestPost(context) {
  try {
    const { paymentId } = await context.request.json();
    const apiKey = context.env.PI_API_KEY;

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: { 'Authorization': `Key ${apiKey}` }
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
