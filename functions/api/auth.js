export async function onRequestPost(context) {
  const { user } = await context.request.json();
  // Qui puoi salvare l'utente nel tuo database se necessario
  return new Response(JSON.stringify({ ok: true, username: user.username }));
}
