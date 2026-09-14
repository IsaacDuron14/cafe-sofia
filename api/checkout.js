// Función serverless de Vercel: intermediaria entre el e-commerce y el backend
// de Apps Script. Corre en el servidor, nunca en el navegador del cliente, así
// que ni la URL del backend (APPS_SCRIPT_URL) ni el token servidor-a-servidor
// (APPS_SCRIPT_TOKEN) quedan nunca expuestos en el código que baja al cliente.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }

  const backendUrl = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;
  if (!backendUrl || !token) {
    res.status(500).json({ ok: false, error: 'Backend no configurado: falta APPS_SCRIPT_URL o APPS_SCRIPT_TOKEN.' });
    return;
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...req.body }),
    });
    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: 'No se pudo contactar al backend.' });
  }
}
