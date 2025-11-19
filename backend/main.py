"""
Tailoring App Backend - FastAPI Application with AWS Cognito
"""
from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import traceback

# Import Cognito service
from aws_cognito import cognito_service

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Tailoring App API",
    description="Backend API with AWS Cognito Authentication",
    version="2.0.0"
)

# CORS middleware configuration - Updated with all localhost ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== PYDANTIC MODELS ====================

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime

class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserConfirm(BaseModel):
    email: EmailStr
    confirmation_code: str

class ResendCode(BaseModel):
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    is_admin: Optional[bool] = False

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str
    item_type: Optional[str] = None
    item_description: str
    measurements: dict
    due_date: Optional[str] = None
    status: Optional[str] = "pending"

class OrderUpdate(BaseModel):
    customer_name: Optional[str] = None
    item_type: Optional[str] = None
    item_description: Optional[str] = None
    measurements: Optional[dict] = None
    due_date: Optional[str] = None
    status: Optional[str] = None

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    item_type: Optional[str] = None
    item_description: str
    measurements: dict
    status: str
    created_at: datetime
    due_date: Optional[datetime] = None

# ==================== DEPENDENCIES ====================

async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify AWS Cognito access token and return user info
    Dependency for protected routes
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        # Extract token (remove 'Bearer ' prefix if present)
        token = authorization.replace("Bearer ", "").strip()
        
        # Verify token with Cognito
        result = cognito_service.get_user(token)
        
        if not result['success']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result.get('message', 'Invalid or expired token')
            )
        
        # Add token to user object for later use
        result['user']['token'] = token
        return result['user']
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}"
        )

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """
    Verify user has admin role
    Dependency for admin-only routes
    """
    # Get admin emails from environment
    ADMIN_EMAILS = os.getenv("ADMIN_EMAILS", "admin@example.com").split(",")
    
    if current_user.get('email') not in ADMIN_EMAILS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user

# ==================== ROUTES ====================

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - Health check"""
    return HealthResponse(
        status="healthy",
        message="Tailoring App API with AWS Cognito is running",
        timestamp=datetime.now()
    )

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="API is operational",
        timestamp=datetime.now()
    )

# ==================== AUTHENTICATION ROUTES ====================

@app.post("/api/auth/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    """
    User signup - Creates account in AWS Cognito
    User will receive verification code via email
    """
    print("\n" + "="*60)
    print("📝 SIGNUP REQUEST RECEIVED")
    print("="*60)
    print(f"   📧 Email: {user_data.email}")
    print(f"   👤 Name: {user_data.name}")
    print(f"   📱 Phone: {user_data.phone}")
    print(f"   🔒 Password length: {len(user_data.password)} characters")
    print(f"   🔑 User Pool: {cognito_service.user_pool_id}")
    print(f"   🌍 Region: {cognito_service.region}")
    print("="*60)
    
    try:
        # Call AWS Cognito signup
        result = cognito_service.sign_up(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name,
            phone=user_data.phone
        )
        
        print(f"\n📤 Cognito Response:")
        print(f"   Success: {result.get('success')}")
        print(f"   Message: {result.get('message')}")
        
        if not result['success']:
            print(f"\n❌ SIGNUP FAILED")
            print(f"   Reason: {result['message']}")
            print("="*60 + "\n")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result['message']
            )
        
        print(f"\n✅ SUCCESS: User {user_data.email} registered")
        print(f"   User Sub: {result.get('user_sub', 'N/A')}")
        print("="*60 + "\n")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n💥 UNEXPECTED ERROR:")
        print(f"   Type: {type(e).__name__}")
        print(f"   Message: {str(e)}")
        print(f"\n🔍 Full Traceback:")
        traceback.print_exc()
        print("="*60 + "\n")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Signup failed: {str(e)}"
        )

@app.post("/api/auth/confirm")
async def confirm_signup(confirm_data: UserConfirm):
    """
    Confirm email with 6-digit verification code
    """
    print(f"\n📧 Email confirmation request for: {confirm_data.email}")
    
    try:
        result = cognito_service.confirm_sign_up(
            email=confirm_data.email,
            confirmation_code=confirm_data.confirmation_code
        )
        
        if not result['success']:
            print(f"❌ Confirmation failed: {result['message']}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result['message']
            )
        
        print(f"✅ Email confirmed for {confirm_data.email}\n")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Error during confirmation: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Confirmation failed: {str(e)}"
        )

@app.post("/api/auth/resend-code")
async def resend_confirmation_code(resend_data: ResendCode):
    """
    Resend verification code to user's email
    """
    print(f"\n📬 Resending code to: {resend_data.email}")
    
    try:
        result = cognito_service.resend_confirmation_code(resend_data.email)
        
        if not result['success']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result['message']
            )
        
        print(f"✅ Code resent to {resend_data.email}\n")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Error resending code: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to resend code: {str(e)}"
        )

@app.post("/api/auth/login")
async def login(user_data: UserLogin):
    """
    User/Admin login - Returns JWT tokens from Cognito
    """
    print(f"\n🔐 Login attempt for: {user_data.email} (Admin: {user_data.is_admin})")
    
    try:
        result = cognito_service.sign_in(
            email=user_data.email,
            password=user_data.password
        )
        
        if not result['success']:
            print(f"❌ Login failed: {result['message']}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result['message']
            )
        
        # Check if admin login requested
        if user_data.is_admin:
            ADMIN_EMAILS = os.getenv("ADMIN_EMAILS", "admin@example.com").split(",")
            if result['user']['email'] not in ADMIN_EMAILS:
                print(f"❌ Admin access denied for {result['user']['email']}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Admin access required. This account does not have administrator privileges."
                )
        
        print(f"✅ User {user_data.email} logged in successfully\n")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Login error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@app.post("/api/auth/refresh")
async def refresh_access_token(token_data: RefreshTokenRequest):
    """
    Refresh access token using refresh token
    """
    print("\n🔄 Refresh token request")
    
    try:
        result = cognito_service.refresh_token(token_data.refresh_token)
        
        if not result['success']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=result['message']
            )
        
        print("✅ Token refreshed successfully\n")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Token refresh error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token refresh failed: {str(e)}"
        )

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current logged-in user info
    Protected route - requires valid access token
    """
    return {
        "success": True,
        "user": current_user
    }

# ==================== USER PROFILE ROUTES ====================

@app.get("/api/user/profile")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user's profile
    Protected route - requires valid access token
    """
    print(f"\n👤 Profile request for: {current_user['email']}")
    return {
        "success": True,
        "user": current_user
    }

@app.put("/api/user/profile")
async def update_user_profile(
    profile_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user profile information
    Protected route - requires authentication
    """
    print(f"\n📝 Profile update request for: {current_user['email']}")
    print(f"   Name: {profile_data.name}")
    print(f"   Phone: {profile_data.phone}")
    
    try:
        # Get access token from current user
        access_token = current_user.get('token')
        
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No access token found"
            )
        
        # Build attributes list
        attributes = []
        
        if profile_data.name:
            attributes.append({'Name': 'name', 'Value': profile_data.name})
        
        if profile_data.phone:
            # Ensure phone is in E.164 format
            phone = profile_data.phone.strip()
            if phone and not phone.startswith('+'):
                phone = '+91' + phone
            attributes.append({'Name': 'phone_number', 'Value': phone})
        
        if not attributes:
            return {
                'success': False,
                'message': 'No data to update'
            }
        
        # Update in Cognito
        cognito_service.client.update_user_attributes(
            AccessToken=access_token,
            UserAttributes=attributes
        )
        
        print(f"✅ Profile updated for {current_user['email']}\n")
        
        return {
            'success': True,
            'message': 'Profile updated successfully',
            'data': {
                'name': profile_data.name,
                'phone': profile_data.phone
            }
        }
    
    except Exception as e:
        print(f"❌ Profile update error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

# ==================== ORDERS ROUTES ====================

# In-memory storage (replace with database later)
orders_db = []
order_counter = 0

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(current_user: dict = Depends(get_current_user)):
    """
    Get all orders - Protected route
    Requires valid access token
    """
    print(f"📋 GET /api/orders for user: {current_user['email']}")
    return orders_db

@app.get("/api/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific order by ID - Protected route"""
    order = next((o for o in orders_db if o["id"] == order_id), None)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    return order

@app.post("/api/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new order - Protected route"""
    global order_counter
    order_counter += 1
    
    new_order = {
        "id": order_counter,
        "customer_name": order.customer_name,
        "item_type": order.item_type,
        "item_description": order.item_description,
        "measurements": order.measurements,
        "status": order.status or "pending",
        "created_at": datetime.now(),
        "due_date": datetime.fromisoformat(order.due_date) if order.due_date else None
    }
    
    orders_db.append(new_order)
    print(f"✅ Order #{order_counter} created by {current_user['email']}")
    return new_order

@app.put("/api/orders/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order: OrderUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing order - Protected route"""
    order_index = next((i for i, o in enumerate(orders_db) if o["id"] == order_id), None)
    if order_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    existing_order = orders_db[order_index]
    
    # Update fields
    update_data = order.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "due_date" and value:
            existing_order[field] = datetime.fromisoformat(value)
        else:
            existing_order[field] = value
    
    print(f"📝 Order #{order_id} updated by {current_user['email']}")
    return existing_order

@app.delete("/api/orders/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: int,
    current_user: dict = Depends(get_admin_user)  # Admin only
):
    """Delete an order - Admin only"""
    order_index = next((i for i, o in enumerate(orders_db) if o["id"] == order_id), None)
    if order_index is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    deleted_order = orders_db.pop(order_index)
    print(f"🗑️ Order #{order_id} deleted by admin {current_user['email']}")
    return None

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Print configuration on startup"""
    print("\n" + "="*60)
    print("🚀 TAILORING APP BACKEND STARTING")
    print("="*60)
    print(f"📍 AWS Region: {os.getenv('AWS_REGION')}")
    print(f"🔑 User Pool ID: {os.getenv('COGNITO_USER_POOL_ID')}")
    print(f"📱 Client ID: {os.getenv('COGNITO_CLIENT_ID')[:10]}...")
    print(f"🔐 Client Secret: {'Configured' if os.getenv('COGNITO_CLIENT_SECRET') else 'Not configured'}")
    print(f"👮 Admin Emails: {os.getenv('ADMIN_EMAILS')}")
    print(f"🌐 CORS Origins: Multiple localhost ports configured")
    print("="*60 + "\n")
@app.post("/api/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new order - Protected route"""
    global order_counter
    order_counter += 1
    
    new_order = {
        "id": order_counter,
        "customer_name": order.customer_name,
        "item_type": order.item_type,
        "item_description": order.item_description,
        "measurements": order.measurements,
        "status": order.status or "pending",
        "created_at": datetime.now(),
        "due_date": datetime.fromisoformat(order.due_date) if order.due_date else None,
        # Add user info
        "created_by": {
            "email": current_user.get('email'),
            "name": current_user.get('name'),
            "sub": current_user.get('sub')
        }
    }
    
    orders_db.append(new_order)
    print(f"✅ Order #{order_counter} created by {current_user['email']} ({current_user['name']})")
    return new_order
# ==================== RUN APP ====================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
