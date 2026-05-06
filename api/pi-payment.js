module.exports = async function handler(req, res) {
  console.log("--- RICHIESTA U2A RICEVUTA ---");
  console.log("Corpo della richiesta:", JSON.stringify(req.body));

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { action, paymentId, txid } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // Se stiamo completando, attendiamo 3 secondi per evitare tx_parsing_failed
    if (action === "complete") {
      console.log("Attesa sincronizzazione blockchain per ID:", paymentId);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    const endpoint = `${BASE_URL}/${paymentId}/${action}`;
    console.log("Chiamata API Pi Network a:", endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: action === "complete" ? JSON.stringify({ txid }) : undefined,
    });

    const data = await response.json();
    console.log("Risposta da Pi API:", JSON.stringify(data));

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("ERRORE CRITICO BACKEND:", error.message);
    return res.status(500).json({ error: "Errore interno del server", details: error.message });
  }
};
