# Backend Django REST (exportable)

Este backend replica los endpoints del servidor Express original.

## 1) Instalacion

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## 2) Variables de entorno

- `DEBUG=True|False`
- `SECRET_KEY=...`
- `ALLOWED_HOSTS=localhost,127.0.0.1`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- `DATABASE_URL=sqlite:///db.sqlite3`

Para MySQL puedes usar por ejemplo:

```bash
DATABASE_URL=mysql://usuario:password@host:3306/nombre_db
```

## 3) Migraciones y arranque

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

## 4) Endpoints

- `GET/POST /api/discursantes`
- `GET/PUT/DELETE /api/discursantes/:id`
- `GET /api/discursantes/accion/sugerencia`
- `GET/POST /api/discursos`
- `GET /api/discursos/domingos`
- `GET /api/discursos/temas`
- `GET/PUT /api/discursos/fecha/:fecha`
- `DELETE /api/discursos/:id`
- `GET /health`

## 5) Produccion

```bash
gunicorn discursantes_api.wsgi:application --bind 0.0.0.0:8000
```

Si sirves estaticos desde Django, ejecuta tambien:

```bash
python manage.py collectstatic --noinput
```
