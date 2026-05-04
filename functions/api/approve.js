export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY; 
  const { paymentId } = await context.request.json();

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { 
        "Authorization": apiKey, // Usiamo la variabile che ha già "Key "
        "Content-Type": "application/json" 
      }
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
