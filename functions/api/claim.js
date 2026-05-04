export async function onRequestPost(context) {
  const apiKey = context.env.PI_API_KEY;
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // Leggiamo i dati inviati dal frontend (se presenti)
    const requestData = await context.request.json().catch(() => ({}));
    const uid = requestData.uid || "user_id_da_frontend"; 

    // 1. Creazione pagamento A2U
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { 
        "Authorization": apiKey, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        payment: { 
          amount: 0.01, 
          memo: "Premio Idle Realm", 
          metadata: { type: "reward" },
          uid: uid 
        }
      })
    });

    const result = await createRes.json();

    // Se c'è già un pagamento in corso (ongoing_payment_found), 
    // restituiamo i dettagli di quello così Postman può vederlo
    return new Response(JSON.stringify(result), { 
      status: createRes.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
