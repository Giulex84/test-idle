export async function onRequestPost(context) {
  const { request, env } = context;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    const data = await request.json();
    const uid = data.uid;

    if (!uid) {
      return new Response(JSON.stringify({ error: "UID mancante" }), { status: 400 });
    }

    // 1. CREAZIONE DEL PAGAMENTO A2U
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": `Key ${env.PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment: {
          amount: 0.01,
          memo: "Premio Testnet A2U",
          metadata: { uid: uid },
          uid: uid
        }
      })
    });

    let result = await createRes.json();

    // 2. GESTIONE ONGOING PAYMENT (Il tuo blocco attuale)
    if (createRes.status === 409 || result.error === "ongoing_payment_found") {
      // Se c'è un pagamento appeso, restituiamo l'ID esistente per provare a sbloccarlo
      return new Response(JSON.stringify({ 
        message: "Hai un pagamento in corso. Attendi 2 minuti o riprova.",
        ongoing: true,
        details: result 
      }), { status: 200 });
    }

    if (!createRes.ok) {
      return new Response(JSON.stringify(result), { status: createRes.status });
    }

    const paymentId = result.identifier;

    // 3. APPROVAZIONE LATO SERVER (Obbligatoria per A2U)
    const approveRes = await fetch(`${BASE_URL}/${paymentId}/approve`, {
      method: "POST",
      headers: { "Authorization": `Key ${env.PI_API_KEY}` }
    });

    // 4. COMPLETAMENTO LATO SERVER (Senza questo la transazione non finisce sulla blockchain)
    // Nota: Nelle app A2U, il server deve dare il comando finale
    const completeRes = await fetch(`${BASE_URL}/${paymentId}/complete`, {
      method: "POST",
      headers: { "Authorization": `Key ${env.PI_API_KEY}` }
    });

    const finalResult = await completeRes.json();

    return new Response(JSON.stringify({
      success: true,
      paymentId: paymentId,
      status: "Completed",
      data: finalResult
    }), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
