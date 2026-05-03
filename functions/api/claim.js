export async function onRequestPost(context) {
  const { uid } = await context.request.json();
  const apiKey = context.env.PI_API_KEY;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // 1. Crea pagamento A2U
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Authorization": `Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: { amount: 0.01, memo: "Premio A2U", metadata: { uid }, uid }
      })
    });
    const result = await createRes.json();
    if (!createRes.ok) return new Response(JSON.stringify(result), { status: createRes.status });

    const pid = result.identifier;

    // 2. Approva e 3. Completa (Sequenza Server-Side per A2U)
    await fetch(`${BASE_URL}/${pid}/approve`, { method: "POST", headers: { "Authorization": `Key ${apiKey}` } });
    const finalRes = await fetch(`${BASE_URL}/${pid}/complete`, { method: "POST", headers: { "Authorization": `Key ${apiKey}` } });

    return new Response(JSON.stringify({ success: true, data: await finalRes.json() }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
