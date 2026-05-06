const StellarSdk = require("@stellar/stellar-sdk");

const { TransactionBuilder, Operation, Asset, Keypair, Memo } = StellarSdk;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { uid, amount } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const APP_SEED = process.env.PI_APP_WALLET_SEED;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  if (!PI_API_KEY || !APP_SEED) return res.status(500).json({ error: "Configurazione incompleta sul server." });

  try {
    // 1. Crea il pagamento lato Pi
    let createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Authorization": `Key ${PI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        payment: { amount, memo: "Testing Idle A2U Reward", metadata: { source: "TestingIdle" }, uid }
      }),
    });

    let createData = await createRes.json();

    // 2. Se c'è un pagamento pendente, cancellalo e riprova una volta
    if (createData.error === "ongoing_payment_found") {
      await fetch(`${BASE_URL}/${createData.payment.identifier}/cancel`, {
        method: "POST", headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      
      createRes = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Authorization": `Key ${PI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: { amount, memo: "Testing Idle A2U Reward (Retry)", metadata: { source: "TestingIdle" }, uid }
        }),
      });
      createData = await createRes.json();
    }

    if (!createRes.ok) return res.status(createRes.status).json(createData);

    const paymentId = createData.identifier;
    const destination = createData.to_address;

    // 3. Approva il pagamento
    await fetch(`${BASE_URL}/${paymentId}/approve`, {
      method: "POST", headers: { "Authorization": `Key ${PI_API_KEY}` }
    });

    // 4. Firma e invia su Blockchain Testnet
    const server = new StellarSdk.Horizon.Server("https://api.testnet.minepi.com");
    const keypair = Keypair.fromSecret(APP_SEED);
    const account = await server.loadAccount(keypair.publicKey());

    const tx = new TransactionBuilder(account, { fee: "1000000", networkPassphrase: "Pi Testnet" })
      .addMemo(Memo.text(paymentId))
      .addOperation(Operation.payment({ destination, asset: Asset.native(), amount: Number(amount).toFixed(7) }))
      .setTimeout(60)
      .build();

    tx.sign(keypair);
    const result = await server.submitTransaction(tx);
    const txid = result.hash;

    // 5. Completa il pagamento
    const completeRes = await fetch(`${BASE_URL}/${paymentId}/complete`, {
      method: "POST",
      headers: { "Authorization": `Key ${PI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ txid }),
    });

    return res.status(200).json({ success: true, paymentId, txid });

  } catch (err) {
    return res.status(500).json({ error: "A2U Failed", details: err.message });
  }
};
