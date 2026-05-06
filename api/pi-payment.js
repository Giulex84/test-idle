module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // Se l'azione è completare, aspettiamo 3 secondi per dare tempo alla blockchain
    if (action === "complete") {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const response = await fetch(`${BASE_URL}/${paymentId}/${action}`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: action === "complete" ? JSON.stringify({ txid }) : undefined,
    });

    const data = await response.json();

    // Se troviamo un pagamento pendente (ongoing), lo cancelliamo forzatamente
    if (data.error === "ongoing_payment_found" || response.status === 400) {
      const idToCancel = data.payment?.identifier || paymentId;
      await fetch(`${BASE_URL}/${idToCancel}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      return res.status(409).json({ error: "ongoing_cleaned", message: "Sessione resettata. Riprova." });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server Error", details: error.message });
  }
};
