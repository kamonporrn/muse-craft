# Muse Craft Backend

Backend API สำหรับ Muse Craft platform ใช้ NestJS และ JSON file database

## Features

- ✅ JSON File Database System
- ✅ CRUD Operations สำหรับ Users, Products, Orders, AdminLogs
- ✅ Real-time Updates via WebSocket
- ✅ Authentication & Authorization
- ✅ Backup & Restore System
- ✅ RESTful API Endpoints

## Installation

```bash
npm install
```

## Running the app

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Database Structure

Database files จะถูกเก็บใน `database/data/`:
- `users.json` - User accounts
- `credentials.json` - User credentials (email/password)
- `products.json` - Product listings
- `orders.json` - Order records
- `admin-logs.json` - Admin activity logs

Backup files จะถูกเก็บใน `database/backups/`

## Real-time Updates

ระบบรองรับ real-time updates ผ่าน WebSocket:

### WebSocket Events

**Subscribe to entity updates:**
```javascript
socket.emit('subscribe', { entity: 'users' });
socket.emit('subscribe', { entity: 'products' });
socket.emit('subscribe', { entity: 'orders' });
socket.emit('subscribe', { entity: 'admin-logs' });
```

**Receive updates:**
```javascript
socket.on('user:update', (data) => {
  // data: { action: 'create' | 'update' | 'delete', data: {...} }
});

socket.on('product:update', (data) => {
  // data: { action: 'create' | 'update' | 'delete', data: {...} }
});

socket.on('order:update', (data) => {
  // data: { action: 'create' | 'update' | 'delete', data: {...} }
});

socket.on('admin-log:update', (data) => {
  // data: { action: 'create' | 'update' | 'delete', data: {...} }
});
```

**Unsubscribe:**
```javascript
socket.emit('unsubscribe', { entity: 'users' });
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/auth/validate` - Validate user credentials

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/:id` - Update order
- `PUT /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Delete order

### Admin Logs
- `GET /admin-logs` - Get all logs
- `GET /admin-logs/:id` - Get log by ID
- `POST /admin-logs` - Create log
- `DELETE /admin-logs/:id` - Delete log

### Backup
- `POST /backup` - Create backup
- `GET /backup` - List all backups
- `POST /backup/restore/:backupName` - Restore from backup
- `DELETE /backup/:backupName` - Delete backup

## Environment Variables

```env
PORT=3000
FRONTEND_URL=http://localhost:3001
```
