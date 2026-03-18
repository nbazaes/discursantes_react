# Frontend Vite + TypeScript (exportable)

Este frontend migra la app React original a Vite con TypeScript y usa la misma API.

## 1) Instalacion

```bash
npm install
cp .env.example .env
```

## 2) Variables de entorno

- `VITE_API_BASE_URL=/api` para desarrollo con proxy local.
- En produccion, usa URL completa del backend Django, por ejemplo:

```bash
VITE_API_BASE_URL=https://tu-backend.ejemplo.com/api
```

## 3) Desarrollo local

```bash
npm run dev
```

El proxy de Vite redirige `/api` a `http://localhost:8000`.

## 4) Build

```bash
npm run build
npm run preview
```

## 5) Cloudflare Pages

1. Sube esta carpeta como proyecto de Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Variable de entorno recomendada:
   - `VITE_API_BASE_URL=https://tu-backend-django.com/api`
5. El archivo `public/_redirects` ya incluye fallback SPA.

## Nota sobre "vinext" en Cloudflare

Si por "vinext" te refieres a un runtime tipo Vinxi/SSR en Cloudflare, se necesita una configuracion distinta (server runtime en Workers). Esta carpeta esta preparada para despliegue SPA estatico en Pages, que es la ruta mas simple y estable para este caso.
