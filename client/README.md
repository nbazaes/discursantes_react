# Client (Vite + React)

Frontend migrado de CRA a Vite.

## Scripts

- `npm run dev`: levanta Vite en modo desarrollo (puerto 3000).
- `npm run build`: genera build de produccion en `dist/`.
- `npm run preview`: previsualiza el build de produccion.

## API en desarrollo

El proxy de Vite redirige `/api` hacia `http://localhost:2501` (configurado en `vite.config.js`).

## Requisitos

- Node.js 20+ (recomendado 22 LTS)
