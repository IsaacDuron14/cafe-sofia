# Mi progreso — Café SofIA

## Clase 5 · De un prompt a una app publicada en Internet (tramo final)
- [x] Etapa 0 · Punto de partida: llegaste a Claude Code
- [x] Etapa 1 · GitHub — repo ya existía: github.com/IsaacDuron14/cafe-sofia
- [x] Etapa 2 · Vercel — URL pública (confirmado por el alumno, URL pendiente de anotar)

## Clase 6 · Conectar con el mundo real
- [x] Etapa 3 · La arquitectura, como un restaurante
- [x] Etapa 4 · Conectar el frontend con el backend — probado con compra real: registra venta, stock y caja
- [x] Etapa 5 · Variables de entorno
- [ ] Etapa 6 · El token entre servidores — HITO 2
- [ ] Etapa 7 · Los métodos de pago
- [ ] Etapa 8 · El panel de administración: la trastienda
- [ ] Etapa 9 · Usar el panel: carta, insumos, stock y transferencias
- [ ] Etapa 10 · SofIA en modo real

## Notas de contexto
_(Lo importante para retomar. Sin claves ni contraseñas.)_
- El proyecto ya tenía el prototipo convertido en código (React + Vite), abierto en VS Code con Claude Code conectado.
- Antes de empezar esta guía se hizo una revisión y limpieza de código del e-commerce (organización de estado en hooks, corrección de bugs menores). No afecta a las etapas de esta guía.
- Usuario de GitHub: IsaacDuron14. Repo: cafe-sofia.
- El alumno ya tenía un backend de Apps Script publicado (clase 3 del curso, con SofIA en modo simulador). Se trajo su espejo a apps-script/Codigo.gs (protegido en .gitignore). Todavía no tiene doPost, se agrega en la Etapa 4.
- Nombre de la variable de entorno en Vercel para la URL del backend: APPS_SCRIPT_URL.
- Nombre de la variable de entorno en Vercel para el token servidor-a-servidor: APPS_SCRIPT_TOKEN (Etapa 6). Falta cargar el mismo valor en Apps Script como Script Property y hacer Redeploy.
- Backend "ejecutar como": duralconstructores@gmail.com (correo del alumno/proveedor configurado en el .gs).
- Variable APPS_SCRIPT_URL cargada en Vercel y confirmada con Redeploy (deploy en verde/Ready).
- Backend actualizado: se agregó doPost + registrarPedidoEcommerce_ (recibe pedidos del e-commerce) y se corrió migrarCartaEcommerce_ una vez para que la hoja carta tenga los 4 cafés reales (p1-p4) en vez del catálogo de ejemplo de la Clase 3. Publicado como Versión 5 en Apps Script.
- Al alumno le costó bastante el copy/paste entre VS Code y el editor de Apps Script (se rompió la sintaxis varias veces). Si hay que volver a pegar código grande ahí, ir con mucho cuidado y verificar en pasos chicos.
