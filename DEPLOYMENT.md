# 🚀 PulseTalk Deployment Guide

> Complete step-by-step guide for deploying PulseTalk to production with Vercel (frontend), Render (backend & ML engine), and MongoDB Atlas (database).

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#part-1-database-setup-mongodb-atlas)
3. [ML Engine Deployment (Render)](#part-2-ml-engine-deployment-render)
4. [Backend Deployment (Render)](#part-3-backend-deployment-render)
5. [Frontend Deployment (Vercel)](#part-4-frontend-deployment-vercel)
6. [Post-Deployment Verification](#part-5-post-deployment-verification)
7. [Custom Domain Setup](#part-6-custom-domain-optional)
8. [Alternative Deployment Options](#part-7-alternative-deployment-options)
9. [Troubleshooting](#troubleshooting)
10. [Scaling & Performance](#scaling-considerations)
11. [Maintenance](#maintenance)
12. [Security Checklist](#security-checklist)

---

## Prerequisites

### Required Accounts
- ✅ [Vercel](https://vercel.com) - Frontend hosting
- ✅ [Render](https://render.com) - Backend & ML Engine hosting
- ✅ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- ✅ GitHub/GitLab/Bitbucket - Code repository

### Local Development Tools
- **Node.js** >= 18.0.0
- **Python** >= 3.10
- **Git** for version control
- **npm** or **yarn** package manager

### Recommended Tools
- **Postman** or **Insomnia** for API testing
- **MongoDB Compass** for database management
- **VS Code** with ESLint and Prettier extensions

---

## Part 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Cluster

1. **Sign Up/Login**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create account or sign in

2. **Create New Cluster**
   - Click **"Build a Database"**
   - Select **FREE M0 Shared** tier
   - Choose cloud provider: **AWS** (recommended)
   - Select region closest to your users (e.g., `us-east-1`)
   - Cluster Name: `pulsetalk-cluster`
   - Click **"Create"**

3. **Wait for Provisioning** (~3-5 minutes)

### 1.2 Configure Database Access

1. **Create Database User**
   - Navigate to **"Database Access"** (left sidebar)
   - Click **"Add New Database User"**
   - Authentication Method: **Password**
   - Username: `pulsetalk-admin` (or your choice)
   - Password: Generate a strong password (save it securely!)
   - Database User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

### 1.3 Configure Network Access

1. **Allow IP Addresses**
   - Navigate to **"Network Access"** (left sidebar)
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Comment: `Render and Vercel access`
   - Click **"Confirm"**

   > ⚠️ **Security Note**: For production, restrict to specific IPs after deployment

### 1.4 Get Connection String

1. **Connect to Cluster**
   - Go to **"Database"** → Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Driver: **Node.js**
   - Version: **4.1 or later**

2. **Copy Connection String**
   ```
   mongodb+srv://pulsetalk-admin:<password>@pulsetalk-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

3. **Customize Connection String**
   - Replace `<password>` with your actual password
   - Add database name: `/pulsetalk` before the `?`
   - Final format:
   ```
   mongodb+srv://pulsetalk-admin:YourPassword123@pulsetalk-cluster.xxxxx.mongodb.net/pulsetalk?retryWrites=true&w=majority
   ```

4. **Save this connection string** - you'll need it for backend deployment

---

## Part 2: ML Engine Deployment (Render)

### 2.1 Create Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click **"New +"** → **"Web Service"**

2. **Connect Repository**
   - Connect your GitHub/GitLab account
   - Select your PulseTalk repository
   - Click **"Connect"**

3. **Configure Service**
   - **Name**: `pulsetalk-ml-engine`
   - **Region**: Oregon (US West) or closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `ml-engine`
   - **Runtime**: **Python 3**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Instance Type**
   - Select **Free** tier (for testing)
   - For production: **Starter** ($7/month) recommended

### 2.2 Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `8000` | Server port |
| `ENVIRONMENT` | `production` | Environment mode |
| `MODEL_NAME` | `cardiffnlp/twitter-roberta-base-sentiment-latest` | Hugging Face model |
| `MAX_LENGTH` | `512` | Max token length |
| `BATCH_SIZE` | `8` | Batch processing size |
| `LOG_LEVEL` | `INFO` | Logging level |

### 2.3 Deploy

1. Click **"Create Web Service"**
2. **Wait for deployment** (⏱️ 10-15 minutes for first deploy)
   - Models are downloaded during build
   - Monitor logs for progress
3. **Copy Service URL**: `https://pulsetalk-ml-engine.onrender.com`
4. **Test Health Endpoint**: Visit `/health` or `/docs`

### 2.4 Verify ML Engine

```bash
# Test health check
curl https://pulsetalk-ml-engine.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "model": "cardiffnlp/twitter-roberta-base-sentiment-latest"
}
```

---

## Part 3: Backend Deployment (Render)

### 3.1 Create Web Service

1. **New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect same repository

2. **Configure Service**
   - **Name**: `pulsetalk-backend`
   - **Region**: Same as ML Engine (for low latency)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Node**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free** (or **Starter** for production)

### 3.2 Environment Variables

Add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string from Part 1 |
| `JWT_SECRET` | `<generate-random-64-char-string>` | JWT access token secret |
| `JWT_REFRESH_SECRET` | `<generate-different-64-char-string>` | JWT refresh token secret |
| `JWT_EXPIRE` | `15m` | Access token expiry |
| `JWT_REFRESH_EXPIRE` | `7d` | Refresh token expiry |
| `ML_ENGINE_URL` | `https://pulsetalk-ml-engine.onrender.com` | Your ML Engine URL from Part 2 |
| `FRONTEND_URL` | `https://pulsetalk.vercel.app` | Your Vercel URL (update after Part 4) |

**Generate Secure Secrets:**

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator: https://randomkeygen.com/
```

### 3.3 Deploy

1. Click **"Create Web Service"**
2. **Wait for deployment** (⏱️ 3-5 minutes)
3. **Copy Backend URL**: `https://pulsetalk-backend.onrender.com`
4. **Test Health Endpoint**: Visit `/health`

### 3.4 Verify Backend

```bash
# Test health check
curl https://pulsetalk-backend.onrender.com/health

# Expected response:
{
  "status": "healthy",
  "service": "PulseTalk Backend",
  "timestamp": "2026-01-30T12:00:00.000Z"
}
```

---

## Part 4: Frontend Deployment (Vercel)

### 4.1 Create Project

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** → **"Project"**

2. **Import Repository**
   - Connect GitHub/GitLab account
   - Select PulseTalk repository
   - Click **"Import"**

3. **Configure Project**
   - **Framework Preset**: **Vite** (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### 4.2 Environment Variables

Click **"Environment Variables"** and add:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://pulsetalk-backend.onrender.com/api` | Backend API URL |

> 💡 **Tip**: Add for all environments (Production, Preview, Development)

### 4.3 Deploy

1. Click **"Deploy"**
2. **Wait for deployment** (⏱️ 2-3 minutes)
3. **Your app is live!** 🎉
   - Production URL: `https://your-project-name.vercel.app`
   - Custom domain can be added later

### 4.4 Update Backend CORS

1. **Go back to Render** → Backend service
2. **Update Environment Variable**:
   - `FRONTEND_URL` = `https://your-vercel-app.vercel.app`
3. **Manually redeploy** backend service

### 4.5 Verify Frontend

1. **Visit your Vercel URL**
2. **Test features**:
   - ✅ Landing page loads with animations
   - ✅ Dark mode toggle works
   - ✅ Register new account
   - ✅ Login successfully
   - ✅ Dashboard shows stats
   - ✅ Create analysis (text or URL)
   - ✅ View history
   - ✅ Export results

---

## Part 5: Post-Deployment Verification

### 5.1 Health Checks

Test all services are running:

```bash
# ML Engine
curl https://pulsetalk-ml-engine.onrender.com/health

# Backend
curl https://pulsetalk-backend.onrender.com/health

# Frontend (should return HTML)
curl https://your-vercel-app.vercel.app
```

### 5.2 End-to-End Testing

1. **Register Test User**
   - Visit your Vercel URL
   - Click "Sign Up"
   - Create test account

2. **Test Analysis**
   - Login with test account
   - Go to "New Analysis"
   - Try text analysis: "I love this product!"
   - Try URL analysis (if implemented)

3. **Test Dashboard**
   - Check stats cards display correctly
   - Verify charts render
   - Test dark mode toggle

4. **Test History**
   - View analysis history
   - Filter by sentiment
   - Export analysis as JSON/CSV

### 5.3 Monitor Logs

**Render Logs:**
- Go to each service → **"Logs"** tab
- Check for errors or warnings

**Vercel Logs:**
- Go to project → **"Deployments"**
- Click latest deployment → **"Functions"** tab
- Check for errors

**MongoDB Atlas:**
- Go to **"Metrics"** tab
- Monitor connections, operations, data size

---

## Part 6: Custom Domain (Optional)

### 6.1 Frontend Domain (Vercel)

1. **Add Domain**
   - Go to project **Settings** → **"Domains"**
   - Click **"Add"**
   - Enter domain: `www.pulsetalk.com`

2. **Configure DNS**
   - Add CNAME record:
     - Name: `www`
     - Value: `cname.vercel-dns.com`
   - Or A record for apex domain

3. **Wait for Verification** (~24 hours max)

4. **Update Environment Variables**
   - Backend `FRONTEND_URL` = `https://www.pulsetalk.com`

### 6.2 Backend Domain (Render)

1. **Add Custom Domain**
   - Go to backend service **Settings**
   - Click **"Custom Domains"**
   - Add domain: `api.pulsetalk.com`

2. **Configure DNS**
   - Add CNAME record:
     - Name: `api`
     - Value: `pulsetalk-backend.onrender.com`

3. **Update Environment Variables**
   - Frontend `VITE_API_URL` = `https://api.pulsetalk.com/api`
   - Redeploy frontend

---

## Part 7: Alternative Deployment Options

### 7.1 Frontend Alternatives

#### **Netlify**
```bash
# Build settings
Build command: npm run build
Publish directory: dist
```

#### **AWS Amplify**
- Connect repository
- Select `frontend` as root
- Auto-detects Vite configuration

#### **Cloudflare Pages**
- Build command: `npm run build`
- Build output: `dist`

### 7.2 Backend Alternatives

#### **Railway**
- Similar to Render
- Better free tier (500 hours/month)
- Automatic HTTPS

#### **Heroku**
- Create `Procfile`: `web: npm start`
- Add buildpacks: `heroku/nodejs`

#### **AWS Elastic Beanstalk**
- Package application
- Deploy via EB CLI

### 7.3 ML Engine Alternatives

#### **Hugging Face Spaces**
- Free GPU access
- Direct model deployment
- Automatic API generation

#### **Google Cloud Run**
- Containerize with Docker
- Serverless deployment
- Pay per use

#### **AWS Lambda**
- Use serverless framework
- API Gateway integration
- Cold start considerations

---

## Troubleshooting

### ML Engine Issues

#### ❌ Models Not Loading
**Symptoms**: 500 errors, "model not found" messages

**Solutions**:
1. Check logs for download errors
2. Increase Render timeout (Settings → Advanced)
3. Verify `MODEL_NAME` environment variable
4. First deploy takes 10-15 minutes - be patient!

#### ❌ Out of Memory
**Symptoms**: Service crashes, OOM errors

**Solutions**:
1. Upgrade to Render Starter plan (more RAM)
2. Reduce `BATCH_SIZE` in environment variables
3. Use smaller model (e.g., `distilbert-base-uncased`)

#### ❌ Slow Response Times
**Solutions**:
1. Implement response caching
2. Use model quantization
3. Upgrade instance type
4. Add Redis for caching

### Backend Issues

#### ❌ Database Connection Failed
**Symptoms**: "MongoServerError", connection timeout

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access allows 0.0.0.0/0
3. Ensure database user has correct permissions
4. Test connection string locally first

#### ❌ ML Engine Not Reachable
**Symptoms**: "ECONNREFUSED", timeout errors

**Solutions**:
1. Verify `ML_ENGINE_URL` is correct (no trailing slash)
2. Check ML Engine is running and healthy
3. Test ML Engine `/health` endpoint directly
4. Check Render logs for both services

#### ❌ JWT Errors
**Symptoms**: "Invalid token", "Token expired"

**Solutions**:
1. Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
2. Check token expiry times are reasonable
3. Clear browser cookies and try again
4. Ensure secrets match between deployments

### Frontend Issues

#### ❌ CORS Errors
**Symptoms**: "Access-Control-Allow-Origin" errors in console

**Solutions**:
1. Verify `FRONTEND_URL` in backend matches Vercel URL exactly
2. Check backend CORS configuration
3. Ensure no trailing slashes in URLs
4. Redeploy backend after changing CORS settings

#### ❌ Blank Page / White Screen
**Symptoms**: Nothing renders, blank screen

**Solutions**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct
3. Check network tab for failed API calls
4. Ensure build completed successfully
5. Clear browser cache

#### ❌ Environment Variables Not Working
**Symptoms**: `undefined` values, API calls to wrong URL

**Solutions**:
1. Ensure variables start with `VITE_`
2. Redeploy after adding environment variables
3. Check Vercel deployment logs
4. Verify variables are set for correct environment

#### ❌ Dark Mode Not Persisting
**Symptoms**: Theme resets on page reload

**Solutions**:
1. Check browser localStorage is enabled
2. Verify ThemeProvider is wrapping App
3. Check for console errors
4. Clear browser cache and cookies

---

## Scaling Considerations

### Free Tier Limitations

#### **Render Free Tier**
- ⏱️ Services spin down after 15 minutes of inactivity
- 🐌 First request after spin-down: 30-60 seconds
- ⏰ 750 hours/month per service
- 💾 Limited memory (512 MB)

**Mitigation**:
- Use cron job to ping services every 10 minutes
- Upgrade to Starter plan ($7/month) for always-on

#### **MongoDB Atlas Free Tier (M0)**
- 💾 512 MB storage (~10,000 analyses)
- 🔄 Shared CPU
- 📊 Basic monitoring

**Upgrade Path**:
- M2: $9/month (2 GB storage)
- M5: $25/month (5 GB storage, dedicated)

#### **Vercel Free Tier**
- 📊 100 GB bandwidth/month
- 🚀 Unlimited deployments
- ⚡ Serverless functions (100 GB-hours)

**Upgrade Path**:
- Pro: $20/month (higher limits, analytics)

### Performance Optimization

#### **Frontend**
```javascript
// Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Image optimization
<img loading="lazy" />

// Reduce bundle size
npm run build -- --analyze
```

#### **Backend**
```javascript
// Response compression
app.use(compression())

// Database indexing
userSchema.index({ email: 1 })
analysisSchema.index({ userId: 1, createdAt: -1 })

// Caching
const cache = new NodeCache({ stdTTL: 600 })
```

#### **ML Engine**
```python
# Model caching
@lru_cache(maxsize=1)
def load_model():
    return pipeline("sentiment-analysis")

# Batch processing
results = analyze_batch(texts, batch_size=16)
```

### Horizontal Scaling

For high traffic:

1. **Load Balancer**: Use Render's load balancing
2. **Multiple Instances**: Deploy backend/ML to multiple regions
3. **CDN**: Use Vercel Edge Network
4. **Database Sharding**: MongoDB Atlas supports sharding
5. **Caching Layer**: Add Redis for session/response caching

---

## Maintenance

### Regular Updates

#### **Weekly**
- ✅ Check service health
- ✅ Review error logs
- ✅ Monitor database size
- ✅ Check API response times

#### **Monthly**
- ✅ Update dependencies (`npm audit fix`)
- ✅ Review MongoDB Atlas metrics
- ✅ Check Render/Vercel usage
- ✅ Backup database

#### **Quarterly**
- ✅ Security audit
- ✅ Performance review
- ✅ Cost optimization
- ✅ Feature planning

### Automated Deployments

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
```

### Database Backup

#### **Manual Backup**
```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup

# Import database
mongorestore --uri="mongodb+srv://..." ./backup
```

#### **Automated Backup** (MongoDB Atlas)
- Available on M2+ tiers
- Continuous backups
- Point-in-time recovery

### Monitoring & Alerts

#### **Render**
- Set up email alerts for service failures
- Monitor CPU/memory usage
- Track response times

#### **Vercel**
- Enable Analytics (Pro plan)
- Set up deployment notifications
- Monitor function execution times

#### **MongoDB Atlas**
- Set up performance alerts
- Monitor connection pool
- Track slow queries

---

## Security Checklist

### Pre-Deployment

- [x] ✅ All secrets in environment variables (not hardcoded)
- [x] ✅ Strong JWT secrets (64+ characters)
- [x] ✅ HTTPS enforced (automatic on Vercel/Render)
- [x] ✅ CORS configured with specific origins
- [x] ✅ Rate limiting enabled
- [x] ✅ Input validation on all endpoints
- [x] ✅ Password hashing with bcrypt (10+ rounds)
- [x] ✅ httpOnly cookies for refresh tokens
- [x] ✅ MongoDB connection string secured

### Post-Deployment

- [ ] 🔒 Set up MongoDB backup
- [ ] 🔒 Add monitoring and alerts
- [ ] 🔒 Review security headers (Helmet.js)
- [ ] 🔒 Implement API key rotation
- [ ] 🔒 Set up error tracking (Sentry)
- [ ] 🔒 Enable 2FA for admin accounts
- [ ] 🔒 Regular dependency updates
- [ ] 🔒 Penetration testing

### Security Headers

Ensure these headers are set (Helmet.js does this):
```javascript
Content-Security-Policy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Cost Estimation

### Free Tier (Development)
- **Render**: $0 (with limitations)
- **MongoDB Atlas**: $0 (M0 tier)
- **Vercel**: $0
- **Total**: **$0/month**

### Starter Tier (Small Production)
- **Render Backend**: $7/month
- **Render ML Engine**: $7/month
- **MongoDB Atlas M2**: $9/month
- **Vercel**: $0 (or $20 Pro)
- **Total**: **$23-43/month**

### Production Tier (Medium Traffic)
- **Render Backend**: $25/month (Standard)
- **Render ML Engine**: $25/month (Standard)
- **MongoDB Atlas M5**: $25/month
- **Vercel Pro**: $20/month
- **Total**: **$95/month**

---

## Support & Resources

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Community
- [Render Community](https://community.render.com/)
- [Vercel Discord](https://vercel.com/discord)
- [MongoDB Community](https://www.mongodb.com/community)

### Getting Help
1. Check service status pages
2. Review deployment logs
3. Test endpoints individually
4. Verify environment variables
5. Open issue on GitHub repository

---

**🎉 Congratulations!** Your PulseTalk application is now live in production!

For questions or issues, please open an issue in the repository or contact support.

**Made with ❤️ by the PulseTalk Team**
