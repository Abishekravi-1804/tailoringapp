# Tailoring App Backend

Python FastAPI backend for the Tailoring App.

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)

### Installation

1. **Create a virtual environment:**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the development server:**
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, you can access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔌 API Endpoints

### Health Check
- `GET /` - Root endpoint
- `GET /api/health` - Health check

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{order_id}` - Get specific order
- `POST /api/orders` - Create new order
- `PUT /api/orders/{order_id}` - Update order
- `DELETE /api/orders/{order_id}` - Delete order

## 📝 Example API Request

### Create Order
```bash
curl -X POST "http://localhost:8000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "item_description": "Custom Suit",
    "measurements": {
      "chest": "40",
      "waist": "34",
      "shoulder": "18"
    },
    "due_date": "2024-12-31"
  }'
```

## 🛠️ Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
# Install black
pip install black

# Format code
black .
```

## 📦 Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🔐 Security Notes

- Currently using in-memory storage (replace with database)
- Add authentication/authorization for production
- Update CORS settings for production
- Use environment variables for sensitive data

## 🚢 Deployment

For production deployment:
1. Set `DEBUG=False` in `.env`
2. Use a production ASGI server (Gunicorn with Uvicorn workers)
3. Set up a proper database (PostgreSQL recommended)
4. Configure proper CORS origins
5. Add authentication and authorization
6. Set up SSL/TLS certificates

