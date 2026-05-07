const StellarSdk = require("@stellar/stellar-sdk");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { uid, amount } = req.body;
  const PI_API_KEY = process.env.PI_API_KEY; // Deve avere "Key ..."
  const APP_SEED = process.env.PI_APP_WALLET_SEED;
  const BASE_URL = "https://api.minepi.com/v2/payments";

  try {
    // 1. Crea pagamento A2U su Pi Server
    const createRes = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Authorization": PI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ 
        payment: { amount: Number(amount), memo: "A2U Test", metadata: { s: "a2u" }, uid } 
      }),
    });

    const data = await createRes.json();
    if (!createRes.ok) throw new Error(data.message || data.error || "Errore Pi API");

    const paymentId = data.identifier;

    // 2. Approva pagamento
    await fetch(`${BASE_URL}/${paymentId}/approve`, {
      method: "POST",
      headers: { "Authorization": PI_API_KEY }
    });

    // 3. Firma Blockchain Stellar
    const server = new StellarSdk.Horizon.Server("https://api.testnet.minepi.com");
    const keypair = StellarSdk.Keypair.fromSecret(APP_SEED);
    const account = await server.loadAccount(keypair.publicKey());
    
    // Memo deve essere l'ID pagamento troncato
    const shortMemo = paymentId.substring(0, 28);

    const tx = new StellarSdk.TransactionBuilder(account, { fee: "1000000", networkPassphrase: "Pi Testnet" })
      .addMemo(StellarSdk.Memo.text(shortMemo))
      .addOperation(StellarSdk.Operation.payment({ 
        destination: data.to_address, 
        asset: StellarSdk.Asset.native(), 
        amount: Number(amount).toFixed(7) 
      }))
      .setTimeout(60).build();

    tx.sign(keypair);
    const result = await server.submitTransaction(tx);

    // 4. Completa pagamento
    await fetch(`${BASE_URL}/${paymentId}/complete`, {
      method: "POST",
      headers: { "Authorization": PI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ txid: result.hash }),
    });

    return res.status(200).json({ success: true, txid: result.hash });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
