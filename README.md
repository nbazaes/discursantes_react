# Discursantes

## 📋 Descripción
App web para gestionar y programar los discursantes dominicales de una congregación local.

## 🎯 El Problema
Antes, la asignación de discursantes de la congregación se hacía manualmente en papel o Excel, lo que generaba duplicados, olvidos, consultas manuales y desorganización. Esta app centraliza todo en una plataforma única.

## 🎨 Screenshots
### Menú principal
![Menú Principal](/screenshots/menu.png)
### Módulo
![Módulo](/screenshots/module.png)

## 🛠 Stack Tecnológico
- **Frontend:** React
- **Backend:** Node.js + Express
- **Base de datos:** MariaDB / MySQL
- **Infraestructura:** Docker + Docker Compose

## ✨ Funcionalidades Principales
- ➕ Agregar y gestionar discursantes por domingo
- 📅 Asignar fechas y temas
- 📊 Ver historial de asignaciones
- 🔔 Registro de discursantes y frecuencia
- Sugerencias de discursantes por tiempo

## 🚀 Cómo Ejecutar Localmente

### 🐳 Opción recomendada: Docker Compose (app + MySQL)

Levanta en conjunto:
- backend + frontend empaquetados en una sola imagen (según `Dockerfile`)
- base de datos MySQL 8

```bash
git clone <repo>
cd discursantes
docker compose up --build
```

La app quedará disponible en `http://localhost:2501`.

Para detener los servicios:

```bash
docker compose down
```

Para detener y eliminar también el volumen de base de datos:

```bash
docker compose down -v
```

### Opción Docker (solo app)

Si ya tienes una base de datos externa, puedes correr solo la app:

```bash
docker build -t discursantes-app .
docker run --rm -p 2501:2501 -e PORT=2501 discursantes-app
```

### Opción desarrollo (sin Docker)

Ejecuta backend y frontend por separado.

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm start
```

Por defecto, el frontend corre en `http://localhost:3000` y hace proxy al backend en `http://localhost:2501`.

## 📚 Lo que aprendí
Con este proyecto resolví un problema real de mi congregación. Técnicamente, fue mi primer proyecto fullstack con React + Express en producción. Aprendí a contenerizar una app con Docker Compose, manejar una base de datos relacional con MariaDB, y diseñar una API REST desde cero. Si lo rehaciera, agregaría autenticación y notificaciones automáticas por email o WhatsApp.

## Por desarrollar:
Un aspecto que tiene espacio de mejora es el manejo de roles y usuarios. Al buscar una solución rápida para una congregación en específico la creé sin autenticación, pero el plan sería escalarlo a más congregaciones, por lo que requeriría un modelo multi-tenant con autenticación y roles por congregación.
