export async function onRequest(context) {
    const apiKey = context.env.PI_API_KEY; // Deve avere "Key " davanti su Cloudflare!
    const { searchParams } = new URL(context.request.url);
    const userToken = searchParams.get('token');

    if (!userToken) {
        return new Response(JSON.stringify({ error: "Token mancante nell'URL" }), { status: 400 });
    }

    try {
        const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
            method: "GET",
            headers: {
                "Authorization": apiKey, // Formato "Key <Secret>"
                "accessToken": userToken  // Passato direttamente dal frontend
            }
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Errore server" }), { status: 500 });
    }
}
