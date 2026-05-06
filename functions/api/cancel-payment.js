export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  
  // Possiamo passare l'ID dinamicamente o prenderlo dall'errore
  const { paymentId } = await context.request.json();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Key ${apiKey}`);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: myHeaders
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
