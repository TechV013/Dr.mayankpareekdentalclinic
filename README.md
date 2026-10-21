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
3. **Demo database (free, one click):** Vercel → Storage → Create → **Upstash Redis** → grant access to the project → redeploy. Appointments persist automatically (no code changes needed — the app detects the KV env vars).
4. **Production database (optional):** set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` to use MySQL instead.
5. Deploy. Vercel builds the frontend and runs the API from the same project.

> Storage tiers (automatic): MySQL (if configured) → Upstash KV (if enabled) → local JSON file / memory.

## Admin Panel
Visit `/admin` on the deployed site and log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
