# React.js Frontend App - Setup & Development Steps

## Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Code editor (VS Code recommended)

## Step 1: Initialize React App

### Option A: Create React App (CRA)
```bash
npx create-react-app tailoringapp
cd tailoringapp
```

### Option B: Vite (Faster, Modern)
```bash
npm create vite@latest tailoringapp -- --template react
cd tailoringapp
npm install
```

### Option C: Next.js (Full-stack framework)
```bash
npx create-next-app@latest tailoringapp
cd tailoringapp
```

## Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

## Step 3: Install Common Dependencies (if needed)

```bash
# Routing
npm install react-router-dom

# State Management
npm install redux @reduxjs/toolkit react-redux
# or
npm install zustand

# HTTP Client
npm install axios

# UI Libraries (optional)
npm install @mui/material @emotion/react @emotion/styled
# or
npm install antd
# or
npm install tailwindcss

# Form Handling
npm install react-hook-form
# or
npm install formik yup
```

## Step 4: Project Structure Setup

Create a typical folder structure:
```
tailoringapp/
├── public/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── services/       # API calls
│   ├── store/          # State management
│   ├── utils/          # Utility functions
│   ├── styles/         # CSS/SCSS files
│   ├── assets/         # Images, fonts, etc.
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── package.json
└── README.md
```

## Step 5: Development Workflow

### Start Development Server
```bash
npm start
# or for Vite
npm run dev
```

The app will open at `http://localhost:3000` (CRA) or `http://localhost:5173` (Vite)

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## Step 6: Environment Variables

Create `.env` file in root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_KEY=your_api_key
```

**Note:** For Create React App, variables must start with `REACT_APP_`

## Step 7: Git Setup (Optional)

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 8: Common Development Tasks

### Add a New Component
1. Create component file in `src/components/`
2. Import and use in your pages/components

### Add Routing
```javascript
// Install: npm install react-router-dom
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Make API Calls
```javascript
// Using axios
import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('/api/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Step 9: Deployment

### Build and Deploy
```bash
# Build the app
npm run build

# Deploy to:
# - Netlify: drag and drop build folder
# - Vercel: vercel deploy
# - GitHub Pages: npm install gh-pages
# - AWS S3/CloudFront
# - Firebase Hosting
```

## Quick Start Commands Summary

```bash
# 1. Create app
npx create-react-app tailoringapp
cd tailoringapp

# 2. Install dependencies
npm install

# 3. Start development
npm start

# 4. Build for production
npm run build
```

## Troubleshooting

- **Port already in use**: Change port in `.env` file: `PORT=3001`
- **Module not found**: Run `npm install` again
- **Build errors**: Check Node.js version compatibility
- **Slow performance**: Consider using Vite instead of CRA

