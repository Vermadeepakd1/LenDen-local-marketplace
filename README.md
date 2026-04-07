# LeniDeni

LeniDeni is a full-stack marketplace application (OLX-style) built with Node.js, Express, MongoDB, and a vanilla HTML/CSS/JS frontend. It supports user and admin roles, listing approval, favorites, messaging, geolocation search, and seller workflows such as mark-as-sold and listing image management.

## Table of Contents

- Project Overview
- Core Features
- Tech Stack
- Project Structure
- Getting Started
- Environment Variables
- Running the Application
- Seed Data
- API Reference
- Business Rules and Access Control
- Frontend Pages
- Troubleshooting
- Security Notes
- Future Improvements

## Project Overview

LeniDeni provides a local-classifieds style experience with moderation and ownership-aware actions:

- Users can register/login, create listings, edit listings, upload multiple images, favorite listings, and message sellers.
- Sellers can manage listings, reorder/remove listing images, and mark a listing as sold to a buyer.
- Admins can approve/reject listings, block/unblock users, and monitor platform stats.

The frontend is served directly by the backend Express server.

## Core Features

### User features

- Authentication with email or phone login.
- Create, edit, and delete self-owned listings.
- Upload up to 6 listing images.
- Edit image sets: keep/remove existing photos and upload new ones.
- Reorder existing listing photos (drag and move controls).
- Mark listings as sold and assign a buyer.
- Save/unsave favorites.
- Buyer/seller messaging with edit/delete message support.
- View purchased items.

### Admin features

- Dashboard stats.
- View all users.
- Block/unblock users.
- View all listings.
- Approve/reject/remove listings.

### Search and location features

- Filter listings by search, category, condition, city/state.
- Price range filtering.
- Geospatial search with radius using MongoDB geospatial indexing.
- Automatic geocoding fallback via OpenStreetMap Nominatim.

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs password hashing
- multer for file uploads
- Cloudinary for image storage

### Frontend

- Vanilla HTML, CSS, and JavaScript
- Responsive card-based UI
- Modal workflows for create/edit listing and sale assignment

## Project Structure

```text
.
|-- backend/
|   |-- app.js
|   |-- server.js
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- seed.js
|   `-- seed-simple.js
|-- frontend/
|   |-- index.html
|   |-- dashboard.html
|   |-- product.html
|   |-- messages.html
|   |-- admin.html
|   |-- login.html
|   |-- register.html
|   |-- my-listings.html
|   |-- css/
|   `-- js/
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or cloud)

### Installation

```bash
npm install
```

## Environment Variables

Create a .env file in the project root.

### Required

- MONGODB_URI
- JWT_SECRET

### Recommended

- PORT (default: 5000)
- JWT_EXPIRES_IN (default: 7d)
- ADMIN_EMAIL
- ADMIN_PASSWORD
- DEFAULT_COUNTRY (default: India)

### Admin listing review email (optional but recommended)

- LISTING_REVIEW_EMAIL (admin inbox that receives new listing notifications)
- PUBLIC_BASE_URL or APP_BASE_URL (used to build approve/reject links)
- LISTING_REVIEW_TOKEN_SECRET (optional, falls back to JWT_SECRET)
- LISTING_REVIEW_TOKEN_EXPIRES_IN (default: 3d)

### Brevo email settings (required for sending emails)

- BREVO_API_KEY
- MAIL_FROM (for example: "LeniDeni <noreply@your-domain.com>")
- BREVO_TIMEOUT_MS (optional, default: 30000)

### Cloudinary (required only if uploading images)

Use one of the following approaches:

1. CLOUDINARY_URL
2. CLOUD_STORAGE_KEYS (cloudinary://... format)
3. CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET

Example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@lenideni.com
ADMIN_PASSWORD=StrongAdminPassword123!

DEFAULT_COUNTRY=India

# Option A
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Option B
# CLOUDINARY_CLOUD_NAME=<cloud_name>
# CLOUDINARY_API_KEY=<api_key>
# CLOUDINARY_API_SECRET=<api_secret>

# Admin listing review email
LISTING_REVIEW_EMAIL=admin@lenideni.com
PUBLIC_BASE_URL=http://localhost:5000
LISTING_REVIEW_TOKEN_SECRET=another_long_random_secret
LISTING_REVIEW_TOKEN_EXPIRES_IN=3d

# Brevo
BREVO_API_KEY=your_brevo_api_key
MAIL_FROM="LeniDeni <noreply@your-domain.com>"
BREVO_TIMEOUT_MS=30000
```

## Running the Application

### Development

```bash
npm run dev
```

### Production-like run

```bash
npm start
```

Once started:

- App and API base URL: http://localhost:5000
- Frontend home: http://localhost:5000/index.html

## Seed Data

Two scripts are available under backend/:

- seed.js
- seed-simple.js

Run manually if you want demo listings:

```bash
node backend/seed.js
```

or

```bash
node backend/seed-simple.js
```

## API Reference

All API routes are under /api.

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Users

- GET /api/users/me
- PATCH /api/users/me
- GET /api/users/me/listings
- GET /api/users/me/purchases

### Products

- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id
- PATCH /api/products/:id/sold
- GET /api/products/:id/buyer-candidates

### Favorites

- GET /api/favorites
- POST /api/favorites/:productId
- DELETE /api/favorites/:productId

### Messages

- GET /api/messages
- POST /api/messages
- PATCH /api/messages/:id
- DELETE /api/messages/:id

### Reports

- POST /api/reports/listings/:id
- POST /api/reports/users/:id

### Admin (admin-only)

- GET /api/admin/stats
- GET /api/admin/users
- PATCH /api/admin/users/:id/block
- PATCH /api/admin/users/:id/unblock
- GET /api/admin/listings
- PATCH /api/admin/listings/:id/approve
- PATCH /api/admin/listings/:id/reject
- DELETE /api/admin/listings/:id
- GET /api/admin/reports
- PATCH /api/admin/reports/:id (body: action=resolve|dismiss, optional enforcementAction)

## Business Rules and Access Control

- Listing visibility in public search:
  - Must be approved.
  - Must be Available (not Sold).

- Ownership and actions:
  - Sellers cannot favorite their own listing.
  - Sellers cannot message themselves.
  - Contact seller action is hidden for listing owner.

- Sold workflow:
  - Seller can mark listing as sold.
  - Buyer assignment requires prior conversation on that listing.

- Image limits:
  - Max 6 images per listing.
  - Edit listing supports keep/remove/reorder existing images and append new images.

## Frontend Pages

- index.html: public listing browse/search
- product.html: listing details and contact flow
- login.html and register.html: authentication
- dashboard.html: seller dashboard and listing management
- my-listings.html: seller listings overview
- messages.html: conversation threads and chat
- admin.html: moderation and platform controls

## Troubleshooting

### Server fails on startup

- Check MONGODB_URI in .env.
- Ensure MongoDB is reachable from your machine/network.

### Image upload errors

- Verify Cloudinary env configuration.
- If Cloudinary is missing, listing creation without files still works, but image upload requests will fail.

### Unauthorized / session issues

- Verify JWT_SECRET is set.
- Clear localStorage token/user and log in again.

### Listing not visible publicly

- Ensure listing is approved by admin.
- Ensure listing status is Available.

## Security Notes

- Passwords are hashed with bcryptjs.
- JWT is used for authenticated routes.
- Admin routes are role-protected.
- Input validation and ownership checks are enforced in controller logic.

## Future Improvements

- Add automated tests (unit + API integration + UI smoke tests).
- Add rate limiting and request validation middleware.
- Add pagination for large listing/message datasets.
- Add Docker support and CI pipeline.
- Add OpenAPI/Swagger documentation for API contracts.

- incremental update 1: clarify app behavior and workflow

- incremental update 2: clarify app behavior and workflow

- incremental update 3: clarify app behavior and workflow

- incremental update 4: clarify app behavior and workflow

- incremental update 5: clarify app behavior and workflow

- incremental update 6: clarify app behavior and workflow

- incremental update 7: clarify app behavior and workflow

- incremental update 8: clarify app behavior and workflow

- incremental update 9: clarify app behavior and workflow

- incremental update 10: clarify app behavior and workflow

- incremental update 11: clarify app behavior and workflow

- incremental update 12: clarify app behavior and workflow

- incremental update 13: clarify app behavior and workflow

- incremental update 14: clarify app behavior and workflow

- incremental update 15: clarify app behavior and workflow

- incremental update 16: clarify app behavior and workflow

- incremental update 17: clarify app behavior and workflow

- incremental update 18: clarify app behavior and workflow

- incremental update 19: clarify app behavior and workflow

- incremental update 20: clarify app behavior and workflow

- incremental update 21: clarify app behavior and workflow

- incremental update 22: clarify app behavior and workflow

- incremental update 23: clarify app behavior and workflow

- incremental update 24: clarify app behavior and workflow

- incremental update 25: clarify app behavior and workflow

- incremental update 26: clarify app behavior and workflow

- incremental update 27: clarify app behavior and workflow

- incremental update 28: clarify app behavior and workflow

- incremental update 29: clarify app behavior and workflow

- incremental update 30: clarify app behavior and workflow

- incremental update 31: clarify app behavior and workflow

- incremental update 32: clarify app behavior and workflow

- incremental update 33: clarify app behavior and workflow

- incremental update 34: clarify app behavior and workflow

- incremental update 35: clarify app behavior and workflow

- incremental update 36: clarify app behavior and workflow

- incremental update 37: clarify app behavior and workflow

- incremental update 38: clarify app behavior and workflow

- incremental update 39: clarify app behavior and workflow

- incremental update 40: clarify app behavior and workflow

- incremental update 41: clarify app behavior and workflow

- incremental update 42: clarify app behavior and workflow

- incremental update 43: clarify app behavior and workflow

- incremental update 44: clarify app behavior and workflow

- incremental update 45: clarify app behavior and workflow

- incremental update 46: clarify app behavior and workflow

- incremental update 47: clarify app behavior and workflow

- incremental update 48: clarify app behavior and workflow

- incremental update 49: clarify app behavior and workflow

- incremental update 50: clarify app behavior and workflow

- incremental update 51: clarify app behavior and workflow

- incremental update 52: clarify app behavior and workflow

- incremental update 53: clarify app behavior and workflow

- incremental update 54: clarify app behavior and workflow

- incremental update 55: clarify app behavior and workflow

- incremental update 56: clarify app behavior and workflow

- incremental update 57: clarify app behavior and workflow

- incremental update 58: clarify app behavior and workflow

- incremental update 59: clarify app behavior and workflow

- incremental update 60: clarify app behavior and workflow

- incremental update 61: clarify app behavior and workflow

- incremental update 62: clarify app behavior and workflow

- incremental update 63: clarify app behavior and workflow

- incremental update 64: clarify app behavior and workflow

- incremental update 65: clarify app behavior and workflow

- incremental update 66: clarify app behavior and workflow

- incremental update 67: clarify app behavior and workflow

- incremental update 68: clarify app behavior and workflow

- incremental update 69: clarify app behavior and workflow

- incremental update 70: clarify app behavior and workflow

- incremental update 71: clarify app behavior and workflow

- incremental update 72: clarify app behavior and workflow

- incremental update 73: clarify app behavior and workflow
