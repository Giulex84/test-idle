export async function onRequestPost(context) {
  try {
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
          memo: "Test Reward A2U",
          metadata: { type: "reward" },
          uid: uid
        }
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify({ ok: response.ok, data }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
