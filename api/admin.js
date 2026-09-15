// Función serverless de Vercel para el panel /admin. Valida la contraseña del
// panel del lado del servidor (nunca en el navegador) y, si es correcta,
// reenvía la acción al backend de Apps Script agregando el token
// servidor-a-servidor (ADMIN_APPS_SCRIPT_TOKEN). Ese token NUNCA viaja al
// navegador: solo la contraseña va y viene entre el cliente y esta función.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const backendUrl = process.env.APPS_SCRIPT_URL;
  const adminToken = process.env.ADMIN_APPS_SCRIPT_TOKEN;

  if (!adminPassword || !backendUrl || !adminToken) {
    res.status(500).json({ ok: false, error: 'El panel no está configurado.' });
    return;
  }

  const { password, accion, ...payload } = req.body || {};

  if (password !== adminPassword) {
    res.status(401).json({ ok: false, error: 'Clave incorrecta' });
    return;
  }
  if (!accion) {
    res.status(400).json({ ok: false, error: 'Falta la acción a realizar.' });
    return;
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion, token: adminToken, ...payload }),
    });
    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: 'No se pudo contactar al backend.' });
  }
}
