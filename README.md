# Shree Shyam Dental Care — Dr. Mayank Pareek

Full-stack web application and appointment booking system for Shree Shyam Dental Care.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express 5, MySQL (`mysql2`), JWT Authentication
- **Architecture:** Monorepo with unified deployment (Express serves React static build)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL server

### Installation & Development
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Install backend dependencies:
   ```bash
   cd backend && npm install
   ```
3. Set up environment variables:
   Copy `backend/.env.example` to `backend/.env` and configure your database credentials and admin login.
4. Run in development mode:
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm run dev`

### Production Build & Start
```bash
npm run build
npm start
```
