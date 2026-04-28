export async function onRequestPost(context) {
  const { uid } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;

  const response = await fetch("https://api.minepi.com/v2/payments", {
    method: "POST",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      payment: {
        amount: 0.01,
        memo: "Premio Test-Pi",
        metadata: { type: "reward" },
        uid: uid // Questo deve essere il UID dell'utente ricevuto dall'auth
      }
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify({ ok: response.ok, data }), {
    headers: { "Content-Type": "application/json" }
  });
}
