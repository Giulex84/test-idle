export async function onRequest(context) {
  const apiKey = context.env.PI_API_KEY;
  const userToken = context.request.headers.get("Authorization-User"); 

  const response = await fetch("https://api.minepi.com/v2/payments/incomplete", {
    method: "GET",
    headers: {
      "Authorization": `Key ${apiKey}`,
      "accessToken": userToken 
    }
  });

  return new Response(JSON.stringify(await response.json()), { status: response.status });
}
