// --- BLOCCO COMPLETO PER API CLAIM CON AUTO-CANCELLAZIONE ---

async function handleClaim(request, env) {
  const { uid } = await request.json();
  const PI_API_KEY = env.PI_API_KEY; // Assicurati che sia nelle variabili d'ambiente

  // 1. FUNZIONE PER CANCELARE PAGAMENTI PENDENTI
  async function cleanupPendingPayments() {
    try {
      // Recupera la lista dei pagamenti dell'app
      const listResponse = await fetch("https://api.minepi.com/v2/payments", {
        method: "GET",
        headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      const listData = await listResponse.json();

      // Cerca pagamenti che non sono 'completed' e non sono 'cancelled'
      if (listData.payments) {
        for (const payment of listData.payments) {
          if (payment.uid === uid && !payment.status.is_completed && !payment.status.is_cancelled) {
            console.log(`Annullamento pagamento fantasma: ${payment.id}`);
            await fetch(`https://api.minepi.com/v2/payments/${payment.id}/cancel`, {
              method: "POST",
              headers: { "Authorization": `Key ${PI_API_KEY}` }
            });
          }
        }
      }
    } catch (e) {
      console.error("Errore durante il cleanup:", e);
    }
  }

  // Esegui la pulizia prima di provare il nuovo pagamento
  await cleanupPendingPayments();

  // 2. TENTA IL PAGAMENTO A2U
  const paymentData = {
    payment: {
      amount: 0.01,
      memo: "Premio A2U Idle Realm",
      metadata: { uid: uid },
      uid: uid
    }
  };

  const response = await fetch("https://api.minepi.com/v2/payments", {
    method: "POST",
    headers: {
      "Authorization": `Key ${PI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(paymentData)
  });

  const result = await response.json();

  // 3. GESTIONE SPECIFICA ERRORE ONGOING
  if (response.status === 400 && result.message && result.message.includes("ongoing_payment_found")) {
    return new Response(JSON.stringify({
      error: "Semaforo rosso Pi Network: la blockchain sta ancora elaborando il tuo test precedente. Attendi 2 minuti e riprova senza fare acquisti."
    }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  });
}

// --- FINE BLOCCO ---
