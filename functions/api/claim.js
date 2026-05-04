export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token'); // Recuperiamo il token utente

  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // 1. Creazione pagamento App-to-User
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Authorization": apiKey, // USIAMO SOLO LA VARIABILE (contiene già "Key ")
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        payment: { 
          amount: 0.01, 
          memo: "Premio Idle Realm", 
          metadata: { info: "A2U Reward" },
          uid: "user-id-placeholder" // In produzione qui andrebbe l'UID dell'utente
        }
      })
    });

    const result = await createRes.json();
    return new Response(JSON.stringify(result), { status: createRes.status });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
