export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", apiKey);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: myHeaders, // Usa l'oggetto Headers() come suggerito in chat
      body: JSON.stringify({
        payment: { 
          amount: 0.01, 
          memo: "Premio sbloccato", 
          metadata: { type: "reward" },
          uid: "a575021c-57be-43fe-9b31-83df80e16fda" 
        }
      })
    });

    return new Response(await response.text(), { status: response.status });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
