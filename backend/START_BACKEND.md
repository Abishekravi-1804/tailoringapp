# How to Start the Backend

## Quick Start

### Option 1: Using the virtual environment (Recommended)

The virtual environment is already set up in the `backend/venv` folder.

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Run the server
python main.py
# or
python run.py
```

### Option 2: Install dependencies fresh

If you need to reinstall dependencies:

```bash
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
```

## Server URLs

Once running, the backend will be available at:
- **API Base**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/api/health`

## Testing the API

### Using Browser
Visit `http://localhost:8000/docs` for interactive API documentation

### Using curl
```bash
# Health check
curl http://localhost:8000/api/health

# Get all orders
curl http://localhost:8000/api/orders

# Create an order
curl -X POST "http://localhost:8000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "item_description": "Custom Suit",
    "measurements": {
      "chest": "40",
      "waist": "34"
    },
    "due_date": "2024-12-31"
  }'
```

## Troubleshooting

### Port already in use
If port 8000 is already in use, change it in `backend/.env`:
```
PORT=8001
```

### Module not found errors
Make sure the virtual environment is activated and dependencies are installed:
```bash
pip install -r requirements.txt
```

### CORS errors
Make sure the frontend URL is in `ALLOWED_ORIGINS` in `backend/.env`

