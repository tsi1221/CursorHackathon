# FixMyHood – Addis Ababa

Empowering communities to report, resolve, and rebuild.

## Tech Stack
- Frontend: React + Vite + Tailwind, Leaflet
- Backend: Node.js + Express
- Database: MongoDB Atlas
- AI: OpenAI
- Image Storage: Cloudinary

## Monorepo Structure
- `server/` Express API
- `client/` React UI

## Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Cloudinary account (optional for images; can skip image upload)
- OpenAI API key (optional for AI suggestions)

## Setup

1) Server
- Copy `server/.env.example` to `server/.env` and fill values
- Install deps and run

```bash
cd server
npm install
npm run dev
```

2) Client
- Copy `client/.env.example` to `client/.env` and update `VITE_API_URL` if backend runs on another host
- Install deps and run

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

## Deployment Notes
- Set `CLIENT_ORIGIN` on the server to your deployed client URL
- Ensure MongoDB IP access and credentials are configured
- Configure Cloudinary and OpenAI env vars if using those features