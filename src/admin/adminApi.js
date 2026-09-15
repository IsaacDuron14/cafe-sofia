// Llama a la función serverless /api/admin, que valida la contraseña del
// panel del lado del servidor y reenvía la acción al backend de Apps Script.
export async function callAdmin(password, accion, payload = {}) {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, accion, ...payload }),
  });
  return res.json();
}
