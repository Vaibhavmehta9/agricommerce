# AgriCommerce

AgriCommerce is a full-stack MERN agricultural e-commerce platform for retail customers and wholesale buyers. It includes a React storefront, B2C cart and checkout, B2B enquiry workflow, product/category management, homepage CMS controls, banners, orders, enquiries, and an authenticated admin dashboard.

## Features

- Customer storefront with home page, product listing, product details, cart, and checkout
- B2B wholesale mode with enquiry forms instead of public pricing/cart checkout
- Admin login and protected dashboard
- Product, category, banner, CMS page, homepage, enquiry, order, and settings management
- Image upload support for admin-managed content
- MongoDB-backed API with JWT authentication
- Seed script with sample products, categories, CMS pages, orders, enquiries, homepage content, and admin user

## Frontend Preview

### Home Page

![AgriCommerce home page](docs/images/home-page.png)

### Cart Page

![AgriCommerce cart page](docs/images/cart-page.png)

### Admin Login

![AgriCommerce admin login](docs/images/admin-login.png)

## Project Structure

```text
agricommerce/
├── apps/
│   ├── backend/        # Node.js, Express, MongoDB, Mongoose API
│   └── frontend/       # React, Vite, Tailwind CSS app
├── packages/
│   └── shared/         # Shared package placeholder
├── package.json        # npm workspaces
└── README.md
```

## Tech Stack

- Frontend: React 18, Vite, React Router, Tailwind CSS, Axios, React Icons
- Backend: Node.js, Express, Mongoose, JWT, Multer, bcryptjs
- Database: MongoDB Atlas or local MongoDB
- Tooling: npm workspaces

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string

## Environment Setup

Real `.env` files are intentionally ignored and should not be committed. Use the included examples:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Backend variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/agricommerce
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

Frontend variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_UPLOAD_URL=http://localhost:5000
```

## Install

```bash
npm install
```

## Seed Database

```bash
npm run seed
```

Default seeded admin:

```text
Email: admin@agri.com
Password: Admin@1234
```

## Run Locally

Start the backend:

```bash
npm run dev:backend
```

Start the frontend:

```bash
npm run dev:frontend
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
Admin Login: http://localhost:5173/admin/login
Admin Dashboard: http://localhost:5173/admin/dashboard
```

## Build

```bash
npm run build --workspace=apps/frontend
```

## API Overview

| Method | Route | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Admin login | Public |
| GET | `/api/auth/me` | Current admin user | Admin |
| GET | `/api/products` | List products | Public |
| GET | `/api/products/:slug` | Product detail | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/categories` | List categories | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |
| GET | `/api/homepage` | Homepage content | Public |
| PUT | `/api/homepage` | Update homepage | Admin |
| GET | `/api/banners` | List banners | Public |
| POST | `/api/banners` | Create banner | Admin |
| GET | `/api/cms/:slug` | CMS page | Public |
| PUT | `/api/cms/:slug` | Update CMS page | Admin |
| POST | `/api/enquiries` | Submit enquiry | Public |
| GET | `/api/enquiries` | List enquiries | Admin |
| PUT | `/api/enquiries/:id/status` | Update enquiry status | Admin |
| POST | `/api/orders` | Place customer order | Public |
| GET | `/api/orders` | List orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/settings` | Site settings | Public |
| PUT | `/api/settings` | Update settings | Admin |
| POST | `/api/upload` | Upload image | Admin |

## B2C vs B2B Behavior

| Area | B2C Retail | B2B Wholesale |
| --- | --- | --- |
| Product price | Visible | Hidden behind quote flow |
| Cart | Enabled | Disabled |
| Checkout | Enabled | Uses enquiry instead |
| Product action | Add to cart | Request quote |
| Main lead flow | Place order | Send bulk enquiry |

## Deployment Notes

Frontend deployment:

- Root directory: `apps/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Required env: `VITE_API_URL`, `VITE_UPLOAD_URL`

Backend deployment:

- Root directory: `apps/backend`
- Start command: `npm start`
- Required env: values from `apps/backend/.env.example`
- Use MongoDB Atlas or another hosted MongoDB instance

## Git Hygiene

The repository excludes:

- `node_modules/`
- real `.env` files
- build output such as `dist/` and `build/`
- runtime uploads
- editor and OS metadata

The safe `.env.example` files are included so other developers can configure the app without exposing secrets.
