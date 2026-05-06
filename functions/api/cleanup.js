export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  const paymentId = "szDfpVj1ENwlgGWOpaK5hf0kJCZW"; // L'ID che si vede nello screenshot

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Key ${apiKey}`);

  try {
    // Proviamo a cancellarlo forzatamente per sbloccare l'account
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
      method: "POST",
      headers: myHeaders
    });

    const data = await response.json();
    return new Response(JSON.stringify({ message: "Tentativo di sblocco eseguito", details: data }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
