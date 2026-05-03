export async function onRequestPost(context) {
  const { paymentId } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;

  const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Key ${apiKey}` }
  });

  return new Response(JSON.stringify(await response.json()), { status: response.status });
}
