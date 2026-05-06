module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { action, paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  if (!PI_API_KEY) return res.status(500).json({ error: "Manca PI_API_KEY" });

  try {
    const endpoint = `${BASE_URL}/${paymentId}/${action}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: action === "complete" ? JSON.stringify({ txid }) : undefined,
    });

    const data = await response.json();

    // GESTIONE ERRORE BLOCCANTE: Se c'è un pagamento pendente, lo cancelliamo
    if (data.error === "ongoing_payment_found" || (response.status === 400 && data.message?.includes("ongoing"))) {
      const ongoingId = data.payment?.identifier || paymentId;
      await fetch(`${BASE_URL}/${ongoingId}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      return res.status(409).json({ error: "ongoing_cleaned", message: "Pagamento pendente rimosso. Riprova." });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
