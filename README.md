# 🌟 Lumiq Development Setup

## 🎯 Development Architecture

```
Frontend (Local)     Backend (Local)     Database (Railway)
localhost:5173   →   localhost:3001   →   Remote MySQL
```

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/SanMine/Lumiq.git
cd Lumiq
./setup-dev.sh
```

### 2. Configure Database
1. Copy the Railway database credentials from your team lead
2. Update `backend/.env` with the provided credentials:
```env
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your_provided_password
DB_HOST=ballast.proxy.rlwy.net
DB_PORT=57580
```

### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## 🛠️ API Endpoints

- **Health Check:** `GET /api/health`
- **Users CRUD:**
  - `GET /api/users` - List all users
  - `GET /api/users/:id` - Get specific user  
  - `POST /api/users` - Create user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

## 🧪 Testing

Test the API:
```bash
cd backend
./test-api.sh
```

## 📚 Documentation

- **Backend Guide:** `backend/LEARNING_GUIDE.md`
- **API Testing:** `backend/POST_GUIDE.md`

## 🔒 Security

- ✅ `.env` files are gitignored
- ✅ Use `.env.example` as template
- ✅ Never commit sensitive credentials

