# Authentication & User Guide

## 🔐 Login Credentials

### Customer Login
- **Email**: `customer@example.com`
- **Password**: `password123` (or any password for demo)
- **URL**: `/login`

### Admin Login
- **Email**: `admin@example.com`
- **Password**: `admin123` (or any password for demo)
- **URL**: `/admin/login`

## 👥 User Features

After customer login, users can access:

1. **Dashboard** (`/user/dashboard`)
   - Quick access to menu and profile
   - Overview of services

2. **Menu Card** (`/user/menu`)
   - Browse all tailoring services
   - View prices
   - Place orders via WhatsApp

3. **Tailor Profile** (`/user/profile`)
   - View tailor information
   - Contact via WhatsApp, Instagram, Phone, Email
   - See working hours and address

4. **My Orders** (`/user/orders`)
   - View order history
   - Track order status

## 🔧 Admin Features

After admin login, admins can access:

1. **Orders Management** (`/admin/orders`)
   - View all orders
   - Create, edit, delete orders
   - Manage order status

## 📱 Contact Information

The tailor profile includes:
- **Phone**: +91 98765 43210
- **Email**: priyatalioring@example.com
- **WhatsApp**: +91 98765 43210
- **Instagram**: @priyatalioring
- **Address**: 123 Main Street, Chennai - 600001
- **Timings**: Mon-Sat: 9:00 AM - 7:00 PM

## 🛡️ Protected Routes

- User routes require customer login
- Admin routes require admin login
- Unauthorized access redirects to login page

## 🌐 Language Support

All pages support:
- English
- Tamil (தமிழ்)

Switch language using the button in the header.

