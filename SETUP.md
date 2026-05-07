# 🛠️ PulseTalk Setup Guide

> Quick setup guide for getting PulseTalk running on a new development machine

---

## 📋 Quick Start

### Automated Setup (Recommended)

We provide automated setup scripts that will install all dependencies and configure your environment:

#### **Windows (PowerShell)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

#### **macOS / Linux**
```bash
# Make script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

The automated scripts will:
- ✅ Check all prerequisites (Node.js, Python, npm, pip)
- ✅ Install frontend dependencies (React, Tailwind, Framer Motion, etc.)
- ✅ Install backend dependencies (Express, Mongoose, JWT, etc.)
- ✅ Install ML engine dependencies (FastAPI, Transformers, PyTorch, etc.)
- ✅ Create environment configuration files
- ✅ Provide clear next steps

---

## 📦 Manual Setup

If you prefer to set up manually or the automated script fails:

### Prerequisites

Ensure you have the following installed:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| **Node.js** | 18.0.0 | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0 | Included with Node.js |
| **Python** | 3.10 | [python.org](https://www.python.org/) |
| **pip** | 23.0 | Included with Python |
| **Git** | 2.0 | [git-scm.com](https://git-scm.com/) |

**Verify installations:**
```bash
node -v    # Should be >= v18.0.0
npm -v     # Should be >= 9.0.0
python --version  # Should be >= 3.10
pip --version     # Should be >= 23.0
git --version     # Any recent version
```

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd PulseTalk
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install --legacy-peer-deps
cd ..
```

**Installed packages:**
- Express.js (web framework)
- Mongoose (MongoDB ODM)
- JWT (authentication)
- bcryptjs (password hashing)
- Playwright (social media scraping)
- And more... (see `backend/package.json`)

### Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

**Installed packages:**
- React 18 (UI framework)
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Lucide React (icons)
- Chart.js (charts)
- And more... (see `frontend/package.json`)

### Step 4: Install ML Engine Dependencies

```bash
cd ml-engine

# Optional: Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies (this may take 5-10 minutes)
pip install -r requirements.txt

cd ..
```

**Installed packages:**
- FastAPI (web framework)
- Transformers (Hugging Face models)
- PyTorch (deep learning)
- VADER Sentiment (sentiment analysis)
- And 60+ more packages... (see `ml-engine/requirements.txt`)

### Step 5: Configure Environment Variables

Create `.env` files in each directory:

#### **backend/.env**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pulsetalk
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulsetalk

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# ML Engine
ML_ENGINE_URL=http://localhost:8000

# CORS
FRONTEND_URL=http://localhost:5173
```

#### **frontend/.env**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

#### **ml-engine/.env**
```env
# Server Configuration
PORT=8000
ENVIRONMENT=development

# Model Configuration
MODEL_NAME=cardiffnlp/twitter-roberta-base-sentiment-latest
MAX_LENGTH=512
BATCH_SIZE=8
```

---

## 🚀 Running the Application

You need to run **3 separate terminal windows** for the three services:

### Terminal 1: ML Engine

```bash
cd ml-engine

# Activate virtual environment (if using)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start ML Engine
uvicorn app.main:app --reload --port 8000
```

**Verify:** Visit http://localhost:8000/health

### Terminal 2: Backend

```bash
cd backend

# Start backend server
npm run dev
```

**Verify:** Visit http://localhost:5000/health

### Terminal 3: Frontend

```bash
cd frontend

# Start frontend dev server
npm run dev
```

**Verify:** Visit http://localhost:5173

---

## 🌐 Access Points

Once all services are running:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main application UI |
| **Backend API** | http://localhost:5000/api | REST API endpoints |
| **ML Engine** | http://localhost:8000 | Sentiment analysis API |
| **ML Engine Docs** | http://localhost:8000/docs | Interactive API documentation (Swagger) |

---

## 🧪 Testing the Setup

### 1. Test ML Engine

```bash
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "model": "cardiffnlp/twitter-roberta-base-sentiment-latest"
}
```

### 2. Test Backend

```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "PulseTalk Backend"
}
```

### 3. Test Frontend

1. Open http://localhost:5173 in your browser
2. You should see the landing page with animations
3. Try toggling dark mode (moon/sun icon in navbar)
4. Click "Sign Up" to create a test account
5. After registration, you should be redirected to the dashboard

### 4. Test Full Flow

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your dashboard with stats
4. **New Analysis**: Go to "New Analysis" page
5. **Analyze Text**: Enter text like "I love this product!" and click "Analyze"
6. **View Results**: See sentiment (Positive), confidence score, and emotion breakdown
7. **History**: Go to "History" to see your past analyses
8. **Export**: Click "Export" to download results as JSON

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux - Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

#### ❌ Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
cd backend  # or frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### ❌ Python Module Not Found

**Error:** `ModuleNotFoundError: No module named 'xyz'`

**Solution:**
```bash
cd ml-engine
# Activate virtual environment first
pip install -r requirements.txt --force-reinstall
```

#### ❌ MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
1. **Using local MongoDB:** Ensure MongoDB is installed and running
2. **Using MongoDB Atlas:** 
   - Verify connection string in `backend/.env`
   - Check network access allows your IP (0.0.0.0/0)
   - Ensure database user has correct permissions

#### ❌ CORS Errors

**Error:** `Access-Control-Allow-Origin` errors in browser console

**Solution:**
1. Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
2. Restart backend server after changing environment variables

#### ❌ Models Not Loading (ML Engine)

**Error:** `OSError: Can't load model`

**Solution:**
1. Check internet connection (models download from Hugging Face)
2. Wait 5-10 minutes for first-time model download
3. Check disk space (models can be 500MB+)
4. Try a different model in `ml-engine/.env`

---

## 🔄 Updating Dependencies

### Update All Dependencies

```bash
# Backend
cd backend
npm update
npm audit fix

# Frontend
cd frontend
npm update
npm audit fix

# ML Engine
cd ml-engine
pip install --upgrade -r requirements.txt
```

### Check for Outdated Packages

```bash
# Node.js packages
npm outdated

# Python packages
pip list --outdated
```

---

## 🗂️ Project Structure

```
PulseTalk/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API services
│   │   └── lib/        # Utilities
│   ├── .env            # Frontend environment variables
│   └── package.json    # Frontend dependencies
│
├── backend/            # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # Express routes
│   │   ├── middleware/ # Custom middleware
│   │   └── services/   # Business logic
│   ├── .env            # Backend environment variables
│   └── package.json    # Backend dependencies
│
├── ml-engine/          # Python + FastAPI ML service
│   ├── app/
│   │   ├── models/     # Pydantic models
│   │   ├── services/   # ML services
│   │   └── routers/    # FastAPI routers
│   ├── venv/           # Python virtual environment
│   ├── .env            # ML engine environment variables
│   └── requirements.txt# Python dependencies
│
├── setup.sh            # Automated setup (Unix/Mac)
├── setup.ps1           # Automated setup (Windows)
├── README.md           # Project documentation
├── SETUP.md            # This file
└── DEPLOYMENT.md       # Production deployment guide
```

---

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Complete project documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when ML engine is running)

### Technologies
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express.js](https://expressjs.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Hugging Face Transformers](https://huggingface.co/docs/transformers/)

### Community
- GitHub Issues: Report bugs or request features
- Stack Overflow: Tag questions with `pulsetalk`

---

## 💡 Tips for Development

### Hot Reload

All three services support hot reload:
- **Frontend**: Vite automatically reloads on file changes
- **Backend**: Nodemon restarts server on file changes
- **ML Engine**: Uvicorn `--reload` flag restarts on file changes

### VS Code Extensions

Recommended extensions:
- ESLint (JavaScript linting)
- Prettier (Code formatting)
- Tailwind CSS IntelliSense
- Python (Python support)
- GitLens (Git integration)

### Database Management

**MongoDB Compass** (GUI for MongoDB):
- Download: https://www.mongodb.com/products/compass
- Connect to: `mongodb://localhost:27017`
- Browse collections: `pulsetalk.users`, `pulsetalk.analyses`

### API Testing

**Postman** or **Insomnia**:
- Import API collection
- Test endpoints without frontend
- Useful for debugging

---

## 🎯 Next Steps

After successful setup:

1. **Explore the UI**: Navigate through all pages (Landing, Dashboard, Analysis, History)
2. **Test Features**: Try text analysis, URL analysis (if implemented), dark mode
3. **Read Documentation**: Check README.md for detailed feature descriptions
4. **Start Developing**: Make changes and see them live!
5. **Deploy**: When ready, follow DEPLOYMENT.md for production deployment

---

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** for troubleshooting steps
2. **Review logs** in each terminal window
3. **Check environment variables** are set correctly
4. **Search existing issues** on GitHub
5. **Open a new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, Python version)

---

**Happy Coding! 🚀**

For questions or feedback, please open an issue on GitHub.
