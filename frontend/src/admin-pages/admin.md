# Dorm Management System - Setup Guide

## 📦 Installation

### Frontend Dependencies

```bash
cd frontend
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

### Backend Dependencies

```bash
cd backend
npm install express mongoose cors dotenv
npm install -D nodemon
```

## 🗂️ Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminLocation.tsx      # Admin interface for adding/editing locations
│   │   │   └── DormDetailView.tsx     # Public view of dorm details with map
│   │   └── ...
│   └── package.json
│


## ⚙️ Backend Setup

### 1. Create `.env` file in backend folder:

```env
MONGODB_URI=mongodb://localhost:27017/dorm_management
PORT=5000
NODE_ENV=development
```

### 2. Update `package.json` scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service
sudo systemctl start mongodb

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Start the backend server:

```bash
npm run dev
```

## 🎨 Frontend Setup

### 1. Import Leaflet CSS in your main file (`main.tsx` or `App.tsx`):

```typescript
import 'leaflet/dist/leaflet.css'
```

### 2. Configure Vite for Leaflet

If you encounter issues with Leaflet images, add this to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['leaflet'],
  },
})
```

### 3. Start the frontend:

```bash
npm run dev
```

## 🚀 Usage Examples

### Creating a New Dorm

```typescript
// In your admin panel
<AdminLocation />
```

### Editing an Existing Dorm

```typescript
// Pass dormId to edit mode
<AdminLocation dormId="67890abcdef" />
```

### Displaying Dorm Details

```typescript
// In your public-facing pages
<DormDetailView dormId="67890abcdef" />
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dorms` | Create a new dorm |
| GET | `/api/dorms` | Get all active dorms |
| GET | `/api/dorms/:id` | Get a specific dorm |
| PUT | `/api/dorms/:id` | Update a dorm |
| PUT | `/api/dorms/:id/location` | Update dorm location |
| DELETE | `/api/dorms/:id` | Soft delete a dorm |
| GET | `/api/dorms/nearby?latitude=X&longitude=Y&radius=5` | Find nearby dorms |

## 🔧 Example API Calls

### Create a Dorm

```javascript
fetch('http://localhost:5000/api/dorms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Green Leaf Dorm",
    description: "Modern dorm near university",
    address: {
      addressLine1: "123 University Road",
      subDistrict: "Suthep",
      district: "Mueang Chiang Mai",
      province: "Chiang Mai",
      zipCode: "50200",
      country: "Thailand"
    },
    latitude: 18.7883,
    longitude: 98.9853,
    price: 3500,
    amenities: ["WiFi", "Air Conditioning", "Parking"],
    ownerId: "user_id_here"
  })
})
```

### Get Nearby Dorms

```javascript
fetch('http://localhost:5000/api/dorms/nearby?latitude=18.7883&longitude=98.9853&radius=5')
  .then(res => res.json())
  .then(data => console.log(data))
```

## 🎯 Key Features

### ✅ Admin Features
- Interactive map with click-to-select location
- Drag markers to adjust position
- Form validation
- Automatic current location detection
- Update existing locations

### ✅ User Features  
- View dorm location on interactive map
- Click markers for detailed info
- Open in full OpenStreetMap
- Responsive design for mobile/desktop

### ✅ Backend Features
- Location-based queries (nearby dorms)
- Distance calculations
- Soft delete (keeps data)
- Validation for coordinates
- RESTful API design

## 🐛 Common Issues & Solutions

### Issue: Leaflet markers not showing

**Solution:** Make sure Leaflet CSS is imported and the icon fix is applied:

```typescript
import L from "leaflet"
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
})

L.Marker.prototype.options.icon = DefaultIcon
```

### Issue: CORS errors

**Solution:** Make sure CORS is enabled in your backend:

```javascript
const cors = require('cors');
app.use(cors());
```

### Issue: Map not loading

**Solution:** Check that:
1. Leaflet CSS is imported
2. Map container has defined height
3. Internet connection is available (for tiles)

## 📝 Next Steps

1. **Add Authentication**: Integrate user authentication to protect admin routes
2. **Image Upload**: Add functionality to upload dorm images
3. **Search & Filter**: Implement search by location, price, amenities
4. **Reviews**: Add rating and review system
5. **Booking System**: Add reservation functionality
6. **Email Notifications**: Notify owners of new bookings

## 🔐 Security Recommendations

- Add JWT authentication for admin routes
- Validate user permissions before allowing edits
- Sanitize user inputs
- Use environment variables for sensitive data
- Implement rate limiting
- Add HTTPS in production

## 📚 Resources

- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)