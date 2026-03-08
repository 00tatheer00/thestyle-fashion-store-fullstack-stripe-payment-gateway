# TheStyle — Fashion Store

A production-ready e-commerce fashion store with Stripe payment integration. Built with React, Node.js, Express, MongoDB, and Stripe Checkout.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 18, Vite, TailwindCSS, Framer Motion      |
| Backend  | Node.js, Express, Mongoose                       |
| Payments | Stripe Checkout with webhook verification        |
| Database | MongoDB                                          |

## Project Structure

```
├── backend/
│   ├── config/         # DB and Stripe configuration
│   ├── controllers/    # Route handlers
│   ├── data/           # Seed data and scripts
│   ├── middleware/      # Error handler
│   ├── models/         # Mongoose schemas (Order, Product)
│   ├── routes/         # Express routes
│   ├── services/       # Business logic (Stripe, Order)
│   └── server.js       # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── context/    # Cart state management
│       ├── hooks/      # Custom hooks
│       ├── layouts/    # Page layouts
│       ├── pages/      # Route pages
│       └── services/   # API client
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test mode)
- Stripe CLI (for webhook testing)

### 1. Clone and install

```bash
# Backend
cd backend
cp .env.example .env    # Fill in your keys
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Configure environment

Edit `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MONGO_URI=mongodb://localhost:27017/thestyle
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App runs at: http://localhost:5173

### 5. Test webhooks locally

```bash
# Terminal 3 — Stripe CLI
stripe listen --forward-to localhost:5000/webhooks/stripe
```

Copy the webhook signing secret (`whsec_...`) into your `.env` file.

## API Endpoints

| Method | Endpoint                     | Description                 |
| ------ | ---------------------------- | --------------------------- |
| GET    | /api/products                | List products (with filters)|
| GET    | /api/products/categories     | Get categories              |
| GET    | /api/products/:slug          | Get single product          |
| POST   | /api/payments/create-session | Create Stripe checkout      |
| GET    | /api/payments/session/:id    | Get session details         |
| POST   | /webhooks/stripe             | Stripe webhook handler      |
| GET    | /health                      | Health check                |

## Features

- 12 curated fashion products with multiple variants
- Real Stripe Checkout integration (multi-product cart)
- Webhook verification and order persistence
- Animated UI with Framer Motion
- Responsive design (mobile-first)
- Search, filter, and sort functionality
- Persistent cart (localStorage)
- Product detail pages with image gallery
- Success/cancel payment flows

## Stripe Test Cards

| Card Number      | Result   |
| ---------------- | -------- |
| 4242424242424242 | Success  |
| 4000000000000002 | Declined |

Use any future expiry date and any 3-digit CVC.
