# Order Tracking System

A minimal full-stack Order Tracking System built with:

- Backend: Node.js + Express
- Frontend: React (functional components + hooks)
- Database: SQLite (SQL)

## Features

- Create Order (`POST /api/orders`) with default status `Placed`
- Update Order Status (`PUT /api/orders/:id`) with strict flow:
  - `Placed -> Packed -> Shipped -> Delivered`
- Get Single Order (`GET /api/orders/:id`)
- Get All Orders (`GET /api/orders`)
- Basic error handling and success/failure messages in UI

## Project Structure

```text
Order Tracking/
  backend/
    src/
      config/
      controllers/
      models/
      routes/
  frontend/
    src/
      components/
```

## Backend Setup

1. Go to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

## Frontend Setup

1. Open a new terminal and go to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## API Endpoints

### 1) Create Order

- Method: `POST`
- URL: `/api/orders`
- Body:

```json
{
  "customerName": "Alice"
}
```

- Success response:

```json
{
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customerName": "Alice",
    "status": "Placed"
  }
}
```

### 2) Update Order Status

- Method: `PUT`
- URL: `/api/orders/:id`
- Body:

```json
{
  "status": "Packed"
}
```

Only next-step transitions are allowed.

### 3) Get Order Status by ID

- Method: `GET`
- URL: `/api/orders/:id`

### 4) Get All Orders

- Method: `GET`
- URL: `/api/orders`

## Sample Flow (curl)

```bash
# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Alice"}'

# Update to Packed
curl -X PUT http://localhost:5000/api/orders/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"Packed"}'

# Get one
curl http://localhost:5000/api/orders/1

# Get all
curl http://localhost:5000/api/orders
```

## Notes

- SQLite database file is created automatically at `backend/data/orders.db`.
- If you want a fresh DB, stop server and delete `backend/data/orders.db`.
