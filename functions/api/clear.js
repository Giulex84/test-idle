// Logica di emergenza per cancellare un pagamento che blocca tutto
const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/cancel`, {
  method: "POST",
  headers: { "Authorization": `Key ${apiKey}` }
});
