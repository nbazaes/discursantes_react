# Paquete de migracion exportable

Esta carpeta contiene dos proyectos listos para copiar a otro workspace:

- `backend_django_rest/`: backend Django + Django REST Framework
- `frontend_vite_ts/`: frontend React con Vite + TypeScript

## Copiar al otro workspace

```bash
cp -r migracion_exportable/backend_django_rest /ruta/del/otro-workspace/
cp -r migracion_exportable/frontend_vite_ts /ruta/del/otro-workspace/
```

## Flujo recomendado local

1. Levantar backend en `:8000`
2. Levantar frontend en `:5173`
3. Verificar consumo de API desde frontend

## Cloudflare

- Frontend: Cloudflare Pages (output `dist`)
- Backend Django: no corre nativamente en Pages/Workers como app WSGI tradicional.
  Despliegalo en Railway, Render, Fly.io o similar.
- Configura en frontend:
  - `VITE_API_BASE_URL=https://tu-backend/api`

## Sobre "vinext"

Si te refieres a una capa SSR en Workers (tipo Vinxi/Vinext), hay que crear un frontend distinto orientado a runtime edge. Esta migracion esta enfocada a SPA estatico + backend Django separado, que es la opcion mas directa y estable.
