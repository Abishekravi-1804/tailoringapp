# Tailoring App - React Frontend + Python Backend

A modern full-stack application with React + Vite frontend and Python FastAPI backend, featuring Tailwind CSS for styling.

## 🚀 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
# or
python run.py
```

The backend API will be available at `http://localhost:8000`

## 📁 Project Structure

```
tailoringapp/
├── backend/                # Python FastAPI backend
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── run.py             # Development server runner
│   └── README.md          # Backend documentation
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   └── Layout/        # Layout component
│   ├── pages/            # Page-level components
│   │   ├── Home/         # Home page
│   │   └── About/        # About page
│   ├── hooks/            # Custom React hooks
│   │   └── useApi.js     # API hook
│   ├── services/         # API calls and external services
│   │   └── api.js        # Axios configuration
│   ├── utils/            # Utility functions
│   │   ├── constants.js  # App constants
│   │   └── helpers.js    # Helper functions
│   ├── styles/           # Global styles
│   │   ├── index.css     # Tailwind directives
│   │   └── App.css       # App-specific styles
│   ├── assets/           # Images, fonts, etc.
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🛠️ Technologies

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Routing
- **Axios** - HTTP client

### Backend
- **Python 3.10+** - Programming language
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## 📦 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `python main.py` - Run FastAPI server
- `python run.py` - Run with auto-reload

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Tailoring App
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📝 API Documentation

Once the backend server is running, access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔌 API Endpoints

- `GET /` - Root endpoint (health check)
- `GET /api/health` - Health check
- `GET /api/orders` - Get all orders
- `GET /api/orders/{order_id}` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{order_id}` - Update order
- `DELETE /api/orders/{order_id}` - Delete order

## 🎨 Features

- ✅ Fast development with Vite
- ✅ Tailwind CSS for styling
- ✅ Component-based architecture
- ✅ Routing setup with React Router
- ✅ API service layer with Axios
- ✅ Custom hooks for data fetching
- ✅ Python FastAPI backend
- ✅ RESTful API endpoints
- ✅ CORS configured
- ✅ Auto-generated API documentation

## 🚢 Deployment

### Frontend
```bash
npm run build
```
The `dist` folder will contain the production-ready files.

### Backend
For production:
1. Set `DEBUG=False` in `.env`
2. Use a production ASGI server
3. Set up a proper database
4. Configure proper CORS origins
5. Add authentication and authorization

## 📄 License

ISC
