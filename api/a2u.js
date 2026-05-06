const StellarSdk = require("@stellar/stellar-sdk");
const { TransactionBuilder, Operation, Asset, Keypair, Memo } = StellarSdk;

module.exports = async function handler(req, res) {
  const { uid, amount } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY;
  const APP_SEED = process.env.PI_APP_WALLET_SEED;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    let createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Authorization": `Key ${PI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ payment: { amount, memo: "A2U Reward", metadata: { s: "idle" }, uid } }),
    });

    let data = await createRes.json();
    
    if (data.error === "ongoing_payment_found") {
      await fetch(`${BASE_URL}/${data.payment.identifier}/cancel`, {
        method: "POST", headers: { "Authorization": `Key ${PI_API_KEY}` }
      });
      return res.status(409).json({ error: "Sessione pulita. Clicca di nuovo tra 3 secondi." });
    }

    const paymentId = data.identifier;
    await fetch(`${BASE_URL}/${paymentId}/approve`, { method: "POST", headers: { "Authorization": `Key ${PI_API_KEY}` } });

    const server = new StellarSdk.Horizon.Server("https://api.testnet.minepi.com");
    const keypair = Keypair.fromSecret(APP_SEED);
    const account = await server.loadAccount(keypair.publicKey());
    const tx = new TransactionBuilder(account, { fee: "1000000", networkPassphrase: "Pi Testnet" })
      .addMemo(Memo.text(paymentId))
      .addOperation(Operation.payment({ destination: data.to_address, asset: Asset.native(), amount: Number(amount).toFixed(7) }))
      .setTimeout(60).build();

    tx.sign(keypair);
    const result = await server.submitTransaction(tx);
    
    await fetch(`${BASE_URL}/${paymentId}/complete`, {
      method: "POST", headers: { "Authorization": `Key ${PI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ txid: result.hash }),
    });

    return res.status(200).json({ success: true, txid: result.hash });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
