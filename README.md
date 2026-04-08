# Order Tracking System (Production-Ready)

Full-stack order tracking platform with strict status flow validation, search/filtering, dashboard metrics, and deployment-ready setup.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Deployment targets:
  - Frontend: Vercel
  - Backend: Render

## Key Features

- Strict order lifecycle:
  - Placed -> Packed -> Shipped -> Delivered
  - No skipping steps
  - No backward movement
- Visual order progress stepper:
  - Completed steps in green
  - Current step highlighted
  - Future steps in gray
- Status badges:
  - Placed (gray)
  - Packed (blue)
  - Shipped (orange)
  - Delivered (green)
- Search by customer name
- Filter by status
- Dashboard cards:
  - Total Orders
  - Delivered Orders
  - Pending Orders
- Timestamps:
  - createdAt
  - updatedAt
- Toast alerts and loading states
- Structured API responses for production clients

## Project Structure

```text
Order Tracking/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    .env.example
  frontend/
    src/
      components/
    .env.example
  netlify.toml
  render.yaml
```

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as a reference:

```env
PORT=5000
FRONTEND_API_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Use `frontend/.env.example` as a reference:

```env
VITE_FRONTEND_API_URL=http://localhost:5000/api
```

The frontend reads `VITE_FRONTEND_API_URL` (or `VITE_API_URL`) and does not hardcode localhost in app code.

## Local Development

### 1) Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend default URL: `http://localhost:5000`

### 2) Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Endpoints

Base URL: `/api`

- `POST /orders`
- `PUT /orders/:id`
- `GET /orders/:id`
- `GET /orders`
  - Query params:
    - `search` (customer name)
    - `status` (Placed | Packed | Shipped | Delivered)
- `GET /orders/stats`

### Response Format

All responses use:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "...",
  "error": "..."
}
```

## Scripts

### Backend

- `npm run dev` - start with nodemon
- `npm start` - production start
- `npm run build` - production build step placeholder

### Frontend

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm start` - preview production build

## Deploy on Render (Backend)

### Option A: `render.yaml` (recommended)

This repo already includes `render.yaml`.

1. Connect repository in Render.
2. Render will detect the web service in `backend`.
3. Set environment variable:
  - `FRONTEND_API_URL` = your Vercel site URL (no trailing slash)
4. Deploy.

### Option B: Manual Render setup

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT` (Render can manage automatically)
  - `FRONTEND_API_URL`

## Deploy on Vercel (Frontend)

Deploy the frontend project from the `frontend` directory in Vercel.

1. Connect repository in Vercel.
2. Configure project settings:
  - Root directory: `frontend`
  - Build command: `npm run build`
  - Output directory: `dist`
3. Add environment variable in Vercel:
   - `VITE_FRONTEND_API_URL` = Render backend URL + `/api`
     - Example: `https://your-render-service.onrender.com/api`
4. Deploy.

## Deployment Validation

1. Backend health should return plain text:
  - `https://your-render-service.onrender.com/health`
  - Expected response: `OK`
2. Frontend should call API using:
  - `VITE_FRONTEND_API_URL=https://your-render-service.onrender.com/api`
3. CORS allowlist should match your live Vercel URL exactly:
  - `FRONTEND_API_URL=https://your-app.vercel.app`

## Render 521 Troubleshooting

If you see `Web server is down (521)`:

1. Confirm Render service settings:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
2. Trigger deploy:
  - `Manual Deploy -> Clear build cache and deploy`
3. Check startup logs in Render for crash details.
4. Ensure backend entrypoint is correct:
  - `backend/server.js`
5. Ensure dynamic port is used:
  - `const PORT = process.env.PORT || 5000`
6. Re-test backend health endpoint before testing frontend.

## Notes

- SQLite file is auto-created at `backend/data/orders.db`.
- Timestamps are included for each order and updated on status changes.
- CORS is enabled for API requests.
