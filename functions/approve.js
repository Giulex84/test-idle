export async function onRequestPost(context) {
  const { paymentId } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;

  // Comunichiamo al server di Pi che approviamo l'inizio del pagamento
  const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Key ${apiKey}` }
  });

  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' }
  });
}
