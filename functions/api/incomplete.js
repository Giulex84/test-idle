export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY; // Assicurati di averla settata nei Settings di Cloudflare

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
    }
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

