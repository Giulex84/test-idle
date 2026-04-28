export async function onRequestPost(context) {
  const { paymentId, txid } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;

  // Comunichiamo al server di Pi che il pagamento è sulla blockchain
  const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
    method: 'POST',
    headers: { 
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ txid })
  });

  return new Response(JSON.stringify(await response.json()), {
    headers: { 'Content-Type': 'application/json' }
  });
}
