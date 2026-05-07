# 🎯 PulseTalk - AI-Powered Sentiment Analysis Platform

> A production-ready, full-stack SaaS platform for analyzing sentiment and emotions in text and social media content using state-of-the-art AI models.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.11--3.13-yellow)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## ✨ Features

### 🎨 Premium User Interface
- **Google-Inspired Design**: Modern, clean UI with Google's color palette (blue, red, yellow, green)
- **Dark Mode**: Seamless light/dark theme switching with localStorage persistence
- **Smooth Animations**: Framer Motion animations throughout (page transitions, scroll reveals, hover effects)
- **Glassmorphism**: Premium frosted glass effects on cards and modals
- **Fully Responsive**: Mobile-first design that works on all devices
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support

### 🧠 AI-Powered Analysis
- **Sentiment Analysis**: Classify text as Positive, Negative, or Neutral with confidence scores (DistilBERT SST-2)
- **Emotion Detection**: Identify 7 emotions — joy, sadness, anger, fear, surprise, disgust, neutral (DistilRoBERTa)
- **Summarization**: Generate concise summaries for long-form content (DistilBART CNN)
- **Multi-Source Support**: Analyze plain text or extract content from social media URLs
- **Batch Processing**: Analyze up to 100 texts in a single request
- **Real-time Results**: Instant analysis with progress indicators

### 📱 Social Media Integration
- **Platform Support**: YouTube, Twitter/X, Instagram, Facebook, Reddit, LinkedIn, TikTok
- **Automatic Extraction**: Extract text from posts, comments, and descriptions
- **Source Tracking**: Keep track of original URLs and platforms

### 📊 Analytics & Visualization
- **Interactive Dashboard**: Real-time charts and statistics
- **Sentiment Trends**: Track sentiment distribution over time
- **Emotion Breakdown**: Detailed emotion analysis with animated progress bars
- **Historical Data**: View and filter past analyses
- **Export Options**: Download results as JSON or CSV

### 🔐 Security & Authentication
- **JWT Authentication**: Secure access and refresh token system
- **Password Hashing**: bcrypt encryption for user passwords
- **Rate Limiting**: Protect against abuse and DDoS attacks
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Comprehensive validation on all endpoints

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React 18 + Tailwind CSS + Framer Motion               │   │
│  │  • Landing Page (Hero, Features, Pricing)               │   │
│  │  • Dashboard (Stats, Charts, Analytics)                 │   │
│  │  • Analysis (Text/URL Input, Results)                   │   │
│  │  • History (Card Grid, Filters, Pagination)             │   │
│  │  • Auth Pages (Login, Register)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS/REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                      API LAYER                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js + Express.js                                   │   │
│  │  • Authentication & Authorization                        │   │
│  │  • User Management                                       │   │
│  │  • Analysis CRUD Operations                             │   │
│  │  • Social Media Scraping (Playwright)                   │   │
│  │  • Rate Limiting & Security                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/JSON
┌──────────────────────────▼──────────────────────────────────────┐
│                      ML ENGINE                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Python + FastAPI + Transformers + PyTorch              │   │
│  │  • Sentiment: distilbert-base-uncased-finetuned-sst-2   │   │
│  │  • Emotion: j-hartmann/emotion-english-distilroberta    │   │
│  │  • Summarization: sshleifer/distilbart-cnn-12-6         │   │
│  │  • Batch Processing & Model Caching                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  MongoDB Atlas                                           │   │
│  │  • Users Collection                                      │   │
│  │  • Analyses Collection                                   │   │
│  │  • Refresh Tokens Collection                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and context |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library for smooth transitions |
| **Lucide React** | Beautiful icon library (Smile, Meh, Frown logo) |
| **Headless UI** | Accessible UI components (modals, menus) |
| **Chart.js** | Interactive charts and visualizations |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API requests |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 18+** | JavaScript runtime |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Playwright** | Social media scraping |
| **Cheerio** | HTML parsing |
| **Winston** | Logging |
| **Helmet** | Security headers |

### ML Engine
| Technology | Purpose |
|------------|---------|
| **Python 3.11–3.13** | Programming language (3.13 recommended) |
| **FastAPI 0.115+** | Modern async web framework |
| **Transformers 4.46+** | Hugging Face NLP pipelines |
| **PyTorch 2.5+** | Deep learning framework (CPU build by default) |
| **Pydantic 2.9+** | Data validation |
| **Uvicorn** | ASGI server |

---

## 📁 Project Structure

```
PulseTalk/
├── frontend/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   │   ├── Button.jsx  # 7 variants (primary, secondary, outline, ghost, danger, success, gradient)
│   │   │   │   ├── Card.jsx    # Glassmorphism cards with hover effects
│   │   │   │   ├── Input.jsx   # Input/Textarea with icons and validation
│   │   │   │   ├── Badge.jsx   # Platform-specific badges
│   │   │   │   ├── Modal.jsx   # Animated modals with Headless UI
│   │   │   │   ├── Loader.jsx  # Spinner, Skeleton, LoadingScreen
│   │   │   │   └── Alert.jsx   # Toast notifications
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx  # Sticky navbar with dark mode toggle
│   │   │   │   ├── Footer.jsx  # Footer with links and social icons
│   │   │   │   └── PageTransition.jsx
│   │   │   ├── theme/
│   │   │   │   └── ThemeProvider.jsx  # Dark mode context
│   │   │   └── charts/         # Chart.js components
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Hero, features, pricing, CTA
│   │   │   ├── Login.jsx       # Glassmorphism auth page
│   │   │   ├── Register.jsx    # Glassmorphism auth page
│   │   │   ├── Dashboard.jsx   # Stats cards, charts, analytics
│   │   │   ├── Analysis.jsx    # Text/URL input with results
│   │   │   ├── History.jsx     # Card grid with filters
│   │   │   └── AnalysisDetail.jsx  # Full analysis view
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── authService.js  # Auth API calls
│   │   │   └── analysisService.js  # Analysis API calls
│   │   ├── lib/
│   │   │   ├── utils.js        # Helper functions (cn, formatDate, truncate)
│   │   │   └── animations.js   # Framer Motion presets
│   │   ├── index.css           # Tailwind config + custom styles
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Static assets
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     # MongoDB connection
│   │   │   └── logger.js       # Winston logger
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── errorHandler.js # Centralized error handler
│   │   │   └── index.js        # Validation chains (express-validator)
│   │   ├── models/
│   │   │   ├── User.js         # User schema (bcrypt + credit balance)
│   │   │   ├── Analysis.js     # Analysis + batch + social-media metadata
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth routes
│   │   │   ├── analysis.js     # Text + URL + batch + stats + export
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── authService.js  # Token issuance / refresh
│   │   │   ├── mlService.js    # ML engine HTTP client + result transform
│   │   │   ├── socialMediaScraper.js  # Playwright-based scraper
│   │   │   └── index.js
│   │   ├── __tests__/          # Jest tests
│   │   └── index.js            # Express entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
├── ml-engine/                   # Python FastAPI ML service
│   ├── app/
│   │   ├── models/schemas.py   # Pydantic request/response models
│   │   ├── services/ml_service.py   # Sentiment + emotion + summarization
│   │   ├── routers/analyze.py  # POST /analyze and /analyze/batch
│   │   ├── config.py           # Settings (env-driven)
│   │   └── main.py             # FastAPI app + lifespan model loading
│   ├── tests/test_ml_service.py
│   ├── requirements.txt        # Minimal deps (transformers, torch, fastapi)
│   └── .env
│
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **Python** 3.11–3.13 (3.13 recommended; PyTorch CPU wheels may lag on the very latest releases)
- **MongoDB** running locally on `mongodb://localhost:27017`, or a **MongoDB Atlas** connection string
- **npm**
- **pip** (Python package manager)
- ~2 GB free disk space for HuggingFace model cache

### 1. Clone Repository

```bash
git clone <repository-url>
cd PulseTalk
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# ML Engine — use a virtualenv to keep deps isolated
cd ../ml-engine
python -m venv .venv
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

# Install CPU-only PyTorch first (much smaller than the default CUDA wheel)
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

### 3. Environment Configuration

Create `.env` files in each directory:

#### Backend `.env`
```env
# Server
NODE_ENV=development
PORT=5000

# Database — local Mongo or Atlas
MONGODB_URI=mongodb://localhost:27017/pulsetalk

# JWT
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ML Engine
ML_ENGINE_URL=http://localhost:8000

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=PulseTalk
```

#### ML Engine `.env`
```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Models
SENTIMENT_MODEL=distilbert-base-uncased-finetuned-sst-2-english
EMOTION_MODEL=j-hartmann/emotion-english-distilroberta-base
SUMMARIZATION_MODEL=sshleifer/distilbart-cnn-12-6

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5000,http://localhost:5173

# Logging
LOG_LEVEL=INFO
```

### 4. Start Development Servers

Open **3 terminal windows**:

```bash
# Terminal 1: ML Engine (http://localhost:8000)
cd ml-engine
# activate venv first: .venv\Scripts\Activate.ps1  (or source .venv/bin/activate)
uvicorn app.main:app --reload --port 8000
# First start downloads ~500 MB of model weights into ~/.cache/huggingface
# Wait for "Application startup complete" before hitting the backend.

# Terminal 2: Backend API (http://localhost:5000)
cd backend
npm run dev

# Terminal 3: Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **ML Engine**: http://localhost:8000
- **ML Engine Docs**: http://localhost:8000/docs (Swagger UI)

---

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes (refresh token) |
| POST | `/api/auth/logout` | Invalidate refresh token | Yes |
| GET | `/api/auth/me` | Get current user info | Yes |

### Analysis Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/analysis` | Create new analysis (text) — costs 1 credit | Yes |
| POST | `/api/analysis/url` | Create analysis from social-media URL — costs 3 credits | Yes |
| POST | `/api/analysis/batch` | Batch text analysis (up to 100) | Yes |
| GET | `/api/analysis` | List user's analyses (paginated, filter by sentiment) | Yes |
| GET | `/api/analysis/stats` | Aggregate stats + emotion distribution + 30-day timeline | Yes |
| GET | `/api/analysis/:id` | Get specific analysis | Yes |
| DELETE | `/api/analysis/:id` | Delete analysis | Yes |
| GET | `/api/analysis/:id/export` | Export as JSON or CSV (`?format=csv`) | Yes |

### ML Engine Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (`models_loaded` flag) |
| POST | `/analyze` | Analyze single text → `{sentiment, sentiment_score, confidence, emotions[], dominant_emotion, summary}` |
| POST | `/analyze/batch` | Analyze up to 100 texts in one call |

---

## 🎨 UI Components

### Button Variants
- **Primary**: Blue gradient, main actions
- **Secondary**: Gray outline, secondary actions
- **Outline**: Transparent with border
- **Ghost**: Transparent, minimal
- **Danger**: Red, destructive actions
- **Success**: Green, positive actions
- **Gradient**: Multi-color gradient, premium CTAs

### Card Variants
- **Default**: White background, subtle shadow
- **Glass**: Glassmorphism with backdrop blur
- **Glass Strong**: Enhanced glassmorphism
- **Gradient**: Multi-color gradient background

### Animations
- **Page Transitions**: Fade + slide between routes
- **Scroll Reveal**: Elements fade in on scroll
- **Hover Effects**: Lift, glow, scale on interactive elements
- **Stagger**: Sequential reveal of lists/grids
- **Loading States**: Skeleton screens and spinners

---

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# ML Engine Tests
cd ml-engine
pytest                   # Run all tests
pytest -v                # Verbose output
pytest --cov             # Coverage report

# Frontend Tests
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

---

## 🖥️ Local-Only Setup

This repository is currently configured for local development only.

- Deployment-specific files and guides have been removed.
- Use the `Quick Start` section above to run all services locally.
- Keep these local URLs:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5000`
  - ML Engine: `http://localhost:8000`

---

## 🐛 Troubleshooting

### ML engine: `No Python at "C:\..."` when running anything in `.venv`
The shipped `.venv` was created on a different machine. Delete it and recreate:
```powershell
Remove-Item -Recurse -Force ml-engine\.venv
cd ml-engine
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

### `pip install` fails with version-not-found errors
The original `requirements.txt` pinned packages to versions that don't exist on PyPI. The current minimal set (transformers, torch, fastapi, pydantic, etc.) installs cleanly on Python 3.11–3.13. If you still hit a wheel-not-found error, your Python version may be too new for the latest published torch wheel — install Python 3.13 explicitly.

### `ImportError: DLL load failed while importing _C` (Windows, torch)
Usually means the install didn't finish or NumPy is missing. Re-run `pip install numpy torch --index-url https://download.pytorch.org/whl/cpu`.

### HuggingFace symlink warning on Windows
Harmless — caching falls back to file copies. To eliminate the warning either enable Windows Developer Mode or set `HF_HUB_DISABLE_SYMLINKS_WARNING=1`.

### Backend can't reach MongoDB
Confirm Mongo is running: `netstat -an | findstr 27017`. If you don't have a local instance, replace `MONGODB_URI` with a free MongoDB Atlas connection string.

### Backend returns 503 from `/api/analysis`
The ML engine isn't up or its models aren't loaded. Hit `http://localhost:8000/health` and confirm `"models_loaded": true` before retrying.

### CORS errors in the browser
The frontend origin must be whitelisted in **both** backend (`FRONTEND_URL` or `FRONTEND_URLS`) and ML engine (`ALLOWED_ORIGINS`).

---

## 🔒 Security Best Practices

- ✅ **JWT Tokens**: Short-lived access tokens (15min) + long-lived refresh tokens (7d)
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **HTTPS Only**: Enforce HTTPS in production
- ✅ **CORS**: Whitelist specific origins
- ✅ **Rate Limiting**: Prevent brute force attacks
- ✅ **Input Validation**: Sanitize all user inputs
- ✅ **Helmet**: Security headers
- ✅ **Environment Variables**: Never commit secrets
- ✅ **MongoDB Injection**: Use Mongoose sanitization

---

## 📈 Performance Optimizations

- **Frontend**:
  - Code splitting with React.lazy()
  - Image optimization
  - Tailwind CSS purging
  - Vite build optimization
  - Framer Motion reduced motion support

- **Backend**:
  - MongoDB indexing
  - Response compression
  - Request caching
  - Connection pooling

- **ML Engine**:
  - Model caching
  - Batch processing
  - GPU acceleration (if available)
  - Response caching for common queries

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: ESLint
- **ML Engine**: Black + Flake8

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work*

---

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for pre-trained models (DistilBERT, DistilRoBERTa, DistilBART)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for beautiful icons

---

## 📞 Support

For support, open an issue on GitHub.

---

**Made with ❤️ by the PulseTalk Team**
