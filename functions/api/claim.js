export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    const uid = data.uid;

    if (!uid) return new Response(JSON.stringify({error: "UID mancante"}), {status: 400});

    const response = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": `Key ${env.PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment: { amount: 0.01, memo: "Test", metadata: {uid: uid}, uid: uid }
      })
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (e) {
    return new Response(JSON.stringify({error: e.message}), {status: 500});
  }
}
