const json = (data, status = 200) => 
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  try {
    const { action, paymentId, txid, uid } = await request.json();

    // Gestione Acquisti (U2A)
    if (action === "approve" || action === "complete") {
      const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/${action}`, {
        method: "POST",
        headers: { "Authorization": `Key ${env.PI_API_KEY}`, "Content-Type": "application/json" },
        body: action === "complete" ? JSON.stringify({ txid }) : undefined
      });
      return json(await res.json(), res.ok ? 200 : 400);
    }

    // Gestione Premio (A2U) - Importo 0.35 per distinguere
    if (action === "claim_reward") {
      const createRes = await fetch(`https://api.minepi.com/v2/payments`, {
        method: "POST",
        headers: { "Authorization": `Key ${env.PI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: { amount: 0.35, memo: "Reward V2", metadata: { v: "2" }, uid: uid }
        })
      });
      const createData = await createRes.json();
      if (!createRes.ok) return json(createData, 400);

      const pid = createData.identifier;
      await fetch(`https://api.minepi.com/v2/payments/${pid}/approve`, {
        method: "POST",
        headers: { "Authorization": `Key ${env.PI_API_KEY}` }
      });

      const final = await fetch(`https://api.minepi.com/v2/payments/${pid}/complete`, {
        method: "POST",
        headers: { "Authorization": `Key ${env.PI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ txid: "settle-" + pid.substring(0, 10) })
      });
      return json(await final.json());
    }
    return json({ error: "Invalid action" }, 400);
  } catch (e) {
    return json({ error: "Worker Error", message: e.message }, 500);
  }
}
