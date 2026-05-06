const StellarSdk = require("@stellar/stellar-sdk");

const {
  TransactionBuilder,
  Operation,
  Asset,
  Keypair,
  Memo,
} = StellarSdk;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { uid, amount } = req.body;

  if (!uid || !amount) {
    return res.status(400).json({ error: "Missing uid or amount" });
  }

  const PI_API_KEY = process.env.PI_API_KEY;
  const APP_SEED = process.env.PI_APP_WALLET_SEED;

  if (!PI_API_KEY || !APP_SEED) {
    return res.status(500).json({ error: "Server non configurato (Chiavi mancanti)" });
  }

  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // 1. CREAZIONE PAGAMENTO LATO PI
    let createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment: {
          amount,
          memo: "Testing Idle Reward",
          metadata: { source: "TestingIdleA2U" },
          uid,
        },
      }),
    });

    let createData = await createRes.json();

    // Gestione pagamenti in sospeso (Auto-Cancel)
    if (createData.error === "ongoing_payment_found" && createData.payment?.identifier) {
      const ongoingId = createData.payment.identifier;
      await fetch(`${BASE_URL}/${ongoingId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Key ${PI_API_KEY}` },
      });
      
      // Riprova creazione
      createRes = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment: { amount, memo: "Testing Idle Reward", metadata: { source: "TestingIdleA2U" }, uid },
        }),
      });
      createData = await createRes.json();
    }

    if (!createRes.ok) return res.status(createRes.status).json(createData);

    const paymentId = createData.identifier;
    const destination = createData.to_address;

    // 2. APPROVAZIONE
    await fetch(`${BASE_URL}/${paymentId}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${PI_API_KEY}` },
    });

    // 3. FIRMA TRANSAZIONE SU TESTNET (HORIZON)
    const server = new StellarSdk.Horizon.Server("https://api.testnet.minepi.com");
    const keypair = Keypair.fromSecret(APP_SEED);
    const account = await server.loadAccount(keypair.publicKey());

    const tx = new TransactionBuilder(account, {
      fee: "1000000",
      networkPassphrase: "Pi Testnet",
    })
      .addMemo(Memo.text(paymentId))
      .addOperation(
        Operation.payment({
          destination,
          asset: Asset.native(),
          amount: Number(amount).toFixed(7),
        })
      )
      .setTimeout(120)
      .build();

    tx.sign(keypair);
    const result = await server.submitTransaction(tx);
    const txid = result.hash;

    // 4. COMPLETAMENTO
    const completeRes = await fetch(`${BASE_URL}/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const completeData = await completeRes.json();
    return res.status(200).json({ success: true, paymentId, txid });

  } catch (err) {
    return res.status(500).json({ error: "A2U failed", details: err.message });
  }
};
