# Discursantes

## Description
Web app to manage and schedule Sunday speakers for a local congregation.

## The Problem
Before this app, assigning congregation speakers was done manually on paper or in Excel, which caused duplicates, missed assignments, manual lookups, and disorganization. This app centralizes everything in a single platform.

## Screenshots
### Main menu
![Main Menu](/screenshots/menu.png)
### Module
![Module](/screenshots/module.png)

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MariaDB / MySQL
- Infrastructure: Docker + Docker Compose

## Main Features
- Add and manage speakers by Sunday
- Assign dates and topics
- View assignment history
- Track speakers and speaking frequency
- Speaker suggestions based on time since last talk

## Run Locally

### Recommended option: Docker Compose (app + MySQL)

Starts everything together:
- backend + frontend packaged into a single image (according to the Dockerfile)
- MySQL 8 database

```bash
git clone <repo>
cd discursantes
docker compose up --build
```

The app will be available at `http://localhost:2501`.

To stop services:

```bash
docker compose down
```

To stop and also remove the database volume:

```bash
docker compose down -v
```

### Docker option (app only)

If you already have an external database, you can run only the app:

```bash
docker build -t discursantes-app .
docker run --rm -p 2501:2501 -e PORT=2501 discursantes-app
```

### Development option (without Docker)

Run backend and frontend separately.

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
npm run dev
```

By default, the frontend runs at `http://localhost:3000` and proxies the backend at `http://localhost:2501`.

## What I Learned
With this project, I solved a real problem in my congregation. Technically, it was my first fullstack project with React + Express in production. I learned how to containerize an app with Docker Compose, work with a relational database using MariaDB, and design a REST API from scratch. If I rebuilt it, I would add authentication and automatic notifications by email or WhatsApp.

## Future Work
One area with room for improvement is user and role management. Since I aimed for a quick solution for a specific congregation, I built it without authentication, but the plan is to scale it to more congregations, which would require a multi-tenant model with authentication and congregation-based roles.
