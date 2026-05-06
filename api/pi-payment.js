module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  if (!PI_API_KEY) return res.status(500).json({ error: "Server non configurato: manca API KEY" });

  try {
    let url = `${BASE_URL}/${paymentId}/${action}`;
    let body = action === "complete" ? JSON.stringify({ txid }) : undefined;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body
    });

    const data = await response.json();

    // GESTIONE ONGOING: Se troviamo un pagamento bloccato, lo cancelliamo forzatamente
    if (data.error === "ongoing_payment_found") {
      const ongoingId = data.payment.identifier;
      await fetch(`${BASE_URL}/${ongoingId}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      return res.status(409).json({ error: "ongoing_payment_found", message: "Vecchio pagamento rimosso automaticamente." });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Errore interno server: " + error.message });
  }
};
