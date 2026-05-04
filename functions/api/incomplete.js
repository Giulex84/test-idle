export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  const { searchParams } = new URL(context.request.url);
  const userToken = searchParams.get('token');

  // Questo ci dirà esattamente cosa vede il server
  if (!userToken || userToken === "null" || userToken === "undefined") {
    return new Response(JSON.stringify({ 
      error: "IL BACKEND NON RICEVE IL TOKEN", 
      ricevuto: userToken,
      url_totale: context.request.url 
    }), { status: 400 });
  }

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": apiKey, 
      "accessToken": userToken 
    }
  });

  return new Response(JSON.stringify(await response.json()));
}
