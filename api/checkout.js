// Función serverless de Vercel: intermediaria entre el e-commerce y el backend
// de Apps Script. Corre en el servidor, nunca en el navegador del cliente, así
// que la URL del backend (variable de entorno APPS_SCRIPT_URL) nunca queda
// expuesta en el código que descarga el navegador.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Método no permitido' });
    return;
  }

  const backendUrl = process.env.APPS_SCRIPT_URL;
  if (!backendUrl) {
    res.status(500).json({ ok: false, error: 'Backend no configurado: falta la variable de entorno APPS_SCRIPT_URL.' });
    return;
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ ok: false, error: 'No se pudo contactar al backend.' });
  }
}
