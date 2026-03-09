# LeniDeni

LeniDeni is a full-stack OLX-style marketplace with user and admin roles, location-aware search, favorites, and messaging.

## Architecture

- **Backend**: Node.js + Express.js using MVC. MongoDB with Mongoose models and geospatial indexing.
- **Frontend**: Vanilla HTML/CSS/JS with responsive, mobile-first UI.
- **Security**: JWT auth, bcrypt password hashing, role-based access control.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Update environment variables in `.env`.
3. Start the server:
   ```bash
   npm run dev
   ```
4. Open the frontend at `http://localhost:5000/index.html`.

## API Quick Reference

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/listings`

### Products

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `PATCH /api/products/:id/sold`
- `DELETE /api/products/:id`

### Favorites

- `GET /api/favorites`
- `POST /api/favorites/:productId`
- `DELETE /api/favorites/:productId`

### Messages

- `GET /api/messages`
- `POST /api/messages`

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/block`
- `PATCH /api/admin/users/:id/unblock`
- `GET /api/admin/listings`
- `PATCH /api/admin/listings/:id/approve`
- `PATCH /api/admin/listings/:id/reject`
- `DELETE /api/admin/listings/:id`

## Sample API Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@lenideni.com","password":"secret123","city":"Austin","state":"TX","lat":30.26,"lng":-97.74}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@lenideni.com","password":"secret123"}'
```

### Create Listing

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=Vintage Chair" \
  -F "description=Solid wood" \
  -F "category=Furniture" \
  -F "price=120" \
  -F "condition=Used" \
  -F "city=Austin" \
  -F "state=TX" \
  -F "lat=30.26" \
  -F "lng=-97.74" \
  -F "images=@/path/to/photo.jpg"
```

### Location Search

```bash
curl "http://localhost:5000/api/products?lat=30.26&lng=-97.74&radius=10"
```

## Notes

- Admin account is created on server start using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Listings must be approved by admin before appearing in public search.
