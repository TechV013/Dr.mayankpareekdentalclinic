# Shree Shyam Dental Care — Dr. Mayank Pareek

Full-stack web application and appointment booking system for Shree Shyam Dental Care.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express 5, MySQL (`mysql2`), JWT Authentication
- **Architecture:** Single unified app — Express serves the React build and the `/api/*` routes together

## Project Structure
```
├── src/                 # React frontend
├── backend/             # Express routes, controllers, middleware, DB config
├── api/index.js         # Vercel serverless entry (exports the Express app)
├── server.js            # Unified server (local/production + Vercel export)
└── vercel.json          # Vercel routing config
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL (optional locally — a JSON file fallback is used automatically if MySQL is unavailable)

### Local Development
```bash
npm install
cp .env.example .env    # then fill in your values
npm run dev             # starts backend (5000) + Vite dev server (5173) together
```
Open http://localhost:5173 — API requests are proxied to the backend automatically.

### Local Production
```bash
npm run build
npm start               # serves frontend + API on http://localhost:5000
```

## Deploying to Vercel
1. Push this repo to GitHub and import it in Vercel (it appears as a **single project**).
2. Set environment variables in Vercel → Settings → Environment Variables:
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` (required for the admin panel)
   - `DATABASE_URL` — your **Neon** Postgres connection string (the app auto-creates the `appointments` table on first connect)
   - `GMAIL_USER` + `GMAIL_APP_PASSWORD` — enables customer emails (see Email Setup)
3. Deploy. Vercel builds the frontend and runs the API from the same project.

> Storage tiers (automatic): Neon/Postgres (if `DATABASE_URL` set) → Upstash KV (if enabled) → local JSON file / memory.

## Email Setup (greeting + showcase emails)
When a customer books an appointment they receive a welcome email featuring the clinic gallery and services; confirm/reject actions and new-booking admin notifications are also emailed.

1. Google Account → Security → **2-Step Verification** → **App Passwords** → create one for "Mail"
2. Set env vars: `GMAIL_USER` (your Gmail) and `GMAIL_APP_PASSWORD` (the 16-character password)
3. Test locally: `npm run test:email -- you@example.com`
4. On Vercel: set the same vars → every booking sends the greeting email automatically

Without SMTP vars the app still works — emails are skipped and logged.

## Admin Panel
Visit `/admin` on the deployed site and log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
