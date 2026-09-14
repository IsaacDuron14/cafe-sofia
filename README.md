# Café SofIA — proyecto React + Vite

Este es el prototipo aprobado de **Café SofIA**, convertido a un proyecto real de React con Vite (Etapa 7 del curso). Conserva exactamente el diseño, los textos, los colores, la tipografía y las funciones ya aprobadas en el prototipo navegable.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (instala también `npm`).

## Cómo abrir el proyecto

1. Descomprima esta carpeta y ábrala en **Visual Studio Code** (`Archivo → Abrir carpeta…`).
2. Abra una terminal dentro de VS Code (`Terminal → Nueva terminal`).
3. Instale las dependencias:

   ```bash
   npm install
   ```

4. Inicie el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abra en su navegador la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

Cada vez que guarde un cambio en el código, la página se actualiza sola.

## Otros comandos útiles

- `npm run build` — genera la versión de producción optimizada en la carpeta `dist/`.
- `npm run preview` — sirve localmente la versión ya construida (`dist/`), para revisarla antes de publicarla.

## Estructura del proyecto

```
cafe-sofia/
├── index.html            # Punto de entrada HTML (título, fuentes, viewport)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx           # Arranque de React
│   ├── App.jsx            # Estado general y enrutamiento entre pantallas
│   ├── App.css             # Estilos (paleta de colores, tipografía, componentes)
│   ├── data.js             # Productos, categorías, métodos de pago, desafíos, etc.
│   ├── recommend.js        # Lógica de la recomendación personalizada de SofIA
│   ├── storage.js          # Persistencia simulada en localStorage (demo)
│   ├── assets/
│   │   └── sofia-avatar.webp
│   └── components/         # Una pantalla o pieza reutilizable por archivo
```

## Qué se conservó igual que en el prototipo aprobado

- Los 4 productos, precios, regiones, descripciones y disponibilidad.
- El impuesto de servicio del 10%, calculado siempre sobre el subtotal real.
- Los textos en español formal de Costa Rica ("usted").
- El registro de **El Pulso** con las etiquetas Detectó / Decidió / Actuó / Registró.
- Los 5 desafíos educativos, con sus mismas preguntas, pistas y explicaciones.
- La llamada telefónica simulada con SofIA (con el avatar que solo aparece al contestar) y la conversación por texto.
- La reserva temporal de 5 minutos al confirmar el pedido, con verificación de stock si expira.
- El guardado simulado en este navegador (carrito, preferencias, progreso e historial), con opción de reiniciar desde Perfil.
- Los objetivos de accesibilidad (botones de al menos 44×44 px, textos alternativos, `aria-label` en los controles solo de ícono).

## Qué cambió únicamente en la forma de construirlo (no en el diseño ni las funciones)

El prototipo vivía dentro de una maqueta de teléfono con marco, muesca y barra de estado falsos, pensada solo para evaluarlo dentro del editor de prototipos. Esa "carcasa" de vitrina no tiene sentido en una aplicación real, así que se retiró; todas las pantallas, colores, tipografías y funciones de adentro quedaron exactamente iguales, ahora dentro de un contenedor `app-shell` pensado para verse bien tanto en el celular como en el navegador de escritorio.

## Siguiente paso

Según la guía del curso, el siguiente paso es abrir esta carpeta en Visual Studio Code y, desde ahí, usar Claude Code para continuar con la puesta en producción (GitHub, Vercel y el modo real).
