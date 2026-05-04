export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  
  // Creazione intestazioni formale come suggerito
  const myHeaders = new Headers();
  myHeaders.append("Authorization", apiKey);
  myHeaders.append("Content-Type", "application/json");

  const response = await fetch("https://api.minepi.com/v2/payments", {
    method: "POST",
    headers: myHeaders, 
    body: JSON.stringify({
      payment: { 
        amount: 0.01, 
        memo: "Premio A2U", 
        metadata: { type: "reward" },
        uid: "a575021c-57be-43fe-9b31-83df80e16fda" 
      }
    })
  });

  return new Response(await response.text(), { status: response.status });
}
