export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Key ${apiKey}`);
  myHeaders.append("Content-Type", "application/json");

  // Dati del pagamento A2U
  const paymentData = {
    payment: {
      amount: 0.01,
      memo: "Premio Test-Pi",
      metadata: { type: "reward" },
      uid: "a575021c-57be-43fe-9b31-83df80e16fda" // Il tuo UID dall'immagine
    }
  };

  try {
    const response = await fetch("https://api.minepi.com/v2/payments", {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
