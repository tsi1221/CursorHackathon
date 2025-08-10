# FixMyHood Server

Express + MongoDB API for reporting and tracking community issues in Addis Ababa.

## Setup

1. Copy `.env.example` to `.env` and fill values
2. Install deps and run

```bash
npm install
npm run dev
```

## Endpoints
- `GET /api/health`
- `GET /api/issues` list with filters `?status=&category=&subCity=&q=&page=&limit=`
- `GET /api/issues/near?lat=&lng=&radiusKm=`
- `GET /api/issues/:id`
- `POST /api/issues` multipart form: fields `title, description, category, lat, lng, address?, subCity?, woreda?, deviceId` and file `image`
- `PATCH /api/issues/:id/status` body `{ status }`
- `POST /api/issues/:id/upvote` body `{ deviceId }`
- `POST /api/issues/:id/comments` body `{ deviceId, name?, text }`
- `POST /api/ai/suggest` body `{ title, description, category, subCity?, woreda? }`