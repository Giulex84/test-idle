export async function onRequestPost(context) {
  try {
    const { user } = await context.request.json();
    console.log("Utente autenticato:", user.username);
    
    return new Response(JSON.stringify({ ok: true, message: "Auth success" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
