export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  
  const myHeaders = new Headers();
  myHeaders.append("Authorization", apiKey);
  myHeaders.append("Content-Type", "application/json");

  try {
    const response = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: myHeaders, 
      body: JSON.stringify({
        payment: { 
          amount: 0.01, 
          memo: "Premio A2U", 
          metadata: { type: "reward" },
          uid: "a575021c-57be-43fe-9b31-83df80e16fda" // Assicurati che questo UID sia dinamico in produzione
        }
      })
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
