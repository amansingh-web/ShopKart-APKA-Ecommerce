# 🛒 ShopKart — Full-Stack MERN E-Commerce Application

![ShopKart Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80)

> **AWT (01CE1412) — Semester 4 Project | Marwadi University**  
> Faculty of Engineering & Technology — Computer Engineering

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [CO Mapping](#co-mapping)
- [Screenshots](#screenshots)

---

## 🎯 Overview

**ShopKart** is a production-ready, fully secured full-stack e-commerce web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It offers a seamless shopping experience similar to Flipkart and Amazon, with a powerful Admin Panel for complete store management.

### 🔗 Live Demo
- **Store:** [https://shopkart.vercel.app](https://shopkart.vercel.app)
- **GitHub:** [https://github.com/yourusername/shopkart](https://github.com/yourusername/shopkart)

### 👤 Demo Credentials
| Role  | Email                   | Password   |
|-------|-------------------------|------------|
| Admin | admin@shopkart.com      | admin123   |
| User  | john@shopkart.com       | user1234   |

---

## ✨ Features

### 🧑‍💻 Client Side
| Feature | Description |
|---------|-------------|
| 🏠 Home Page | Hero banner with auto-slide, featured products, category grid |
| 🔍 Product Search | Real-time full-text search with debounce |
| 🗂️ Filters & Sort | Filter by category, price range, rating, stock; sort by newest/price/rating |
| 📦 Product Detail | Image gallery, reviews, specs table, related products |
| 🛒 Shopping Cart | Add/remove/update qty, persistent (localStorage), price summary |
| ✅ Checkout | 3-step checkout: address → payment → review |
| 📱 Responsive UI | Mobile-first design, works on all screen sizes |
| ❤️ Wishlist | Save products, move to cart |
| 📋 My Orders | Order list with status, tracking timeline, cancel option |
| 👤 Profile | Edit profile, manage addresses, change password |
| ⭐ Reviews | Star ratings, review submission, edit profile |

### 🛡️ Admin Panel
| Feature | Description |
|---------|-------------|
| 📊 Dashboard | Revenue chart, stats cards, recent orders, quick actions |
| 📦 Product Management | Add, edit, delete products with image upload |
| 🛍️ Order Management | View all orders, update status with one click |
| 👥 User Management | View users, change roles, activate/deactivate, delete |

### 🔐 Security
- JWT-based authentication (7-day expiry)
- Password hashing with **bcryptjs** (salt rounds: 12)
- Role-based access control (RBAC): `user` and `admin`
- Environment variables for all secrets
- HTTP-only token strategy
- Input validation on both client and server

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18   | UI Library with Hooks |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hot Toast | Notification system |
| React Icons | Icon library (Feather Icons) |
| Vite | Build tool & dev server |
| CSS Custom Properties | Design system / theming |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js    | JavaScript runtime |
| Express.js | Web framework & REST APIs |
| MongoDB    | NoSQL database |
| Mongoose   | ODM for MongoDB |
| bcryptjs   | Password hashing |
| jsonwebtoken | JWT authentication |
| multer     | File/image upload handling |
| morgan     | HTTP request logger |
| dotenv     | Environment variable management |
| slugify    | URL-friendly product slugs |

### Deployment
| Service | Purpose |
|---------|---------|
| GitHub  | Source code version control |
| MongoDB Atlas | Cloud database |
| Render / Railway | Backend hosting |
| Vercel / Netlify | Frontend hosting |

---

## 📁 Project Structure

```
shopkart/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile, address, wishlist
│   │   ├── productController.js # CRUD, search, reviews, categories
│   │   ├── orderController.js   # Orders, status, dashboard stats
│   │   └── userController.js    # Admin user management
│   ├── middleware/
│   │   ├── auth.js              # JWT protect + adminOnly middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt pre-hook
│   │   ├── Product.js           # Product schema with text index
│   │   └── Order.js             # Order schema with status history
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/                 # Local image storage
│   ├── .env.example
│   ├── seed.js                  # Database seeder (16 realistic products)
│   └── server.js                # App entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx   # Full-featured navbar
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   └── ProductCard.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       └── ProductForm.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Global auth state
│   │   │   └── CartContext.jsx  # Global cart state
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx     # With filters + pagination
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx     # 3-step checkout
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx  # With tracking timeline
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       ├── AddProduct.jsx
│   │   │       ├── EditProduct.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── App.jsx              # Routes with PrivateRoute + AdminRoute
│   │   ├── main.jsx
│   │   └── index.css            # Global design system
│   ├── index.html
│   └── vite.config.js           # Vite config with proxy
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/shopkart.git
cd shopkart
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed        # Seed the database with sample data
npm run dev         # Start backend on http://localhost:5000
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
npm run dev         # Start frontend on http://localhost:5173
```

### Step 4: Open in Browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000/api/health
```

---

## 🔑 Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopkart
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file to Git!** It is already in `.gitignore`.

---

## 📡 API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| POST   | `/register`           | Public  | Register new user |
| POST   | `/login`              | Public  | Login with email/password |
| GET    | `/me`                 | Private | Get current user profile |
| PUT    | `/profile`            | Private | Update name/phone/avatar |
| PUT    | `/change-password`    | Private | Change password securely |
| POST   | `/address`            | Private | Add delivery address |
| DELETE | `/address/:id`        | Private | Delete an address |
| POST   | `/wishlist/:productId`| Private | Toggle wishlist item |

### Product Routes (`/api/products`)
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| GET    | `/`                   | Public  | List all products (filter/sort/paginate) |
| GET    | `/featured`           | Public  | Get featured products |
| GET    | `/categories`         | Public  | Get all categories with count |
| GET    | `/:id`                | Public  | Get single product |
| GET    | `/:id/related`        | Public  | Get related products |
| POST   | `/:id/reviews`        | Private | Add a review |
| POST   | `/`                   | Admin   | Create product |
| PUT    | `/:id`                | Admin   | Update product |
| DELETE | `/:id`                | Admin   | Soft-delete product |

### Order Routes (`/api/orders`)
| Method | Endpoint              | Access  | Description |
|--------|-----------------------|---------|-------------|
| POST   | `/`                   | Private | Place a new order |
| GET    | `/my`                 | Private | Get my orders |
| GET    | `/:id`                | Private | Get order by ID |
| PUT    | `/:id/cancel`         | Private | Cancel order |
| GET    | `/admin/all`          | Admin   | Get all orders |
| GET    | `/admin/stats`        | Admin   | Get dashboard statistics |
| PUT    | `/admin/:id/status`   | Admin   | Update order status |

---

## 🌐 Deployment

### Deploy Backend to Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo, select `/backend`
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables from `.env`
7. Deploy!

### Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo, select `/frontend`
3. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com`
4. Update `vite.config.js` proxy to use this URL in production
5. Deploy!

### GitHub Pages (Static Export)
```bash
cd frontend
npm run build
# Deploy the /dist folder to GitHub Pages
```

---

## 📚 CO Mapping

| Work Component | CO Mapping | Deadline |
|----------------|-----------|----------|
| Problem Definition & Functional Requirements | CO1, CO2, CO3, CO4, CO5 | 31/01/2026 |
| Frontend (React, Responsive, Forms, Routing) | CO1, CO2, CO5 | 15/03/2026 |
| Backend (Node.js, Express, MongoDB, CRUD) | CO2, CO3 | 31/03/2026 |
| Authentication & Security (JWT, bcrypt, RBAC) | CO4 | 08/04/2026 |
| Final Submission & Deployment | CO1, CO2, CO3, CO4, CO5 | 10/04/2026 |

---

## 📸 Screenshots

### Home Page
![Home](screenshots/home.png)

### Products Listing
![Products](screenshots/products.png)

### Product Detail
![Detail](screenshots/product-detail.png)

### Shopping Cart
![Cart](screenshots/cart.png)

### Admin Dashboard
![Admin](screenshots/admin-dashboard.png)

---

## 👨‍💻 Student Information

| Field | Details |
|-------|---------|
| **Name** | [AMAN KUMAR] |
| **Enrollment No.** | [92400103191] |
| **Branch** | Computer Engineering |
| **Semester** | 4th |
| **Subject** | AWT (01CE1412) |
| **University** | Marwadi University |

---

## 📝 License

This project is submitted as part of the AWT coursework at Marwadi University. All rights reserved.

---

<p align="center">Made with ❤️ using MERN Stack | ShopKart © 2026</p>
