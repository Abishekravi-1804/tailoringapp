# Frontend-Backend Integration Guide

## ✅ Integration Complete!

The frontend and backend are now fully integrated. Here's what has been set up:

## 🎯 What's Integrated

### 1. **Orders Page** (`/orders`)
   - ✅ List all orders
   - ✅ Create new orders
   - ✅ Edit existing orders
   - ✅ Delete orders
   - ✅ Real-time updates after operations

### 2. **API Service** (`src/services/api.js`)
   - ✅ Configured to connect to `http://localhost:8000/api`
   - ✅ Request/Response interceptors
   - ✅ Error handling
   - ✅ CORS support

### 3. **Navigation**
   - ✅ "Orders" link added to navigation menu
   - ✅ "View Orders" button on Home page
   - ✅ Route configured in App.jsx

## 🚀 How to Use

### Step 1: Start the Backend
```bash
cd backend
venv\Scripts\activate
python main.py
```

The backend will run at `http://localhost:8000`

### Step 2: Start the Frontend
```bash
npm run dev
```

The frontend will run at `http://localhost:3000` (or `http://localhost:5173`)

### Step 3: Test the Integration

1. **Navigate to Orders Page**
   - Click "Orders" in the navigation menu
   - Or click "View Orders" on the home page

2. **Create an Order**
   - Click "+ New Order" button
   - Fill in the form:
     - Customer Name
     - Item Description
     - Measurements (Chest, Waist, Shoulder, Length)
     - Due Date (optional)
   - Click "Create Order"

3. **Edit an Order**
   - Click "Edit" on any order card
   - Modify the fields
   - Click "Update Order"

4. **Delete an Order**
   - Click "Delete" on any order card
   - Confirm the deletion

## 📡 API Endpoints Used

The frontend uses these backend endpoints:

- `GET /api/orders` - Fetch all orders
- `GET /api/orders/{id}` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

## 🔧 Configuration

### Frontend API URL
The API URL is configured in:
- `src/services/api.js` - Default: `http://localhost:8000/api`
- Can be overridden with `.env` file:
  ```
  VITE_API_URL=http://localhost:8000/api
  ```

### Backend CORS
The backend allows requests from:
- `http://localhost:3000` (Vite default)
- `http://localhost:5173` (Vite alternative port)

Configure in `backend/.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🐛 Troubleshooting

### Error: "Failed to fetch orders"
- **Solution**: Make sure the backend is running on port 8000
- Check: `http://localhost:8000/api/health`

### CORS Errors
- **Solution**: Verify `ALLOWED_ORIGINS` in `backend/.env` includes your frontend URL
- Restart the backend after changing `.env`

### Orders not appearing
- **Solution**: Check browser console for errors
- Verify backend is returning data: `http://localhost:8000/api/orders`

### Date format issues
- The frontend handles date conversion automatically
- Backend expects ISO format: `YYYY-MM-DD`

## 📝 Features

### Orders Page Features:
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states
- ✅ Error handling and display
- ✅ Form validation
- ✅ Confirmation dialogs for delete
- ✅ Real-time data refresh
- ✅ Status badges
- ✅ Measurement display cards

## 🎨 UI Components

All components use Tailwind CSS:
- Modern, clean design
- Responsive layout
- Hover effects and transitions
- Color-coded status badges
- Form inputs with focus states

## 🔄 Data Flow

1. User interacts with Orders page
2. Frontend makes API call via `api.js`
3. Backend processes request
4. Backend returns JSON response
5. Frontend updates UI with new data
6. User sees updated information

## 📚 Next Steps

You can extend this integration by:
- Adding authentication
- Adding more fields to orders
- Adding order status management
- Adding search/filter functionality
- Adding pagination
- Connecting to a real database
- Adding file uploads for order images

