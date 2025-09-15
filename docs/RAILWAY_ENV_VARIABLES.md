# 🚂 Railway Environment Variables Configuration

## Required Environment Variables for Production Deployment

Copy these variables to your Railway project settings:

### 🔐 Authentication (Auth0)
```
AUTH0_DOMAIN=dev-au2yf8c1n0hrml0i.us.auth0.com
AUTH0_CLIENT_ID=znQ75mgsF3FAvWJl0EA36eQBKHlG2UIh
AUTH0_CLIENT_SECRET=your_client_secret_from_auth0_dashboard
AUTH0_AUDIENCE=https://roomait-api.railway.app
```

### 🗄️ Database (PostgreSQL - Auto-provided by Railway)
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
*Note: Railway automatically provides this when you add a PostgreSQL service*

### 🌐 CORS Configuration
```
CORS_ORIGINS=https://roomait-web.railway.app,https://auth.expo.io,roomait://,com.roomait.app://
```

### 🤖 AI Services (Optional - for enhanced features)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 🏗️ Railway Configuration
```
RAILWAY_ENVIRONMENT=production
PORT=8000
```

### 📱 Mobile App Configuration
```
EXPO_PUBLIC_API_URL=https://roomait-api.railway.app
```

## 📋 Step-by-Step Railway Setup

### 1. **Deploy Backend to Railway**

1. **Connect GitHub Repository**:
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `roomait` repository
   - Choose the `apps/backend` directory as the root

2. **Add PostgreSQL Database**:
   - In your Railway project, click "New Service"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL`

3. **Configure Environment Variables**:
   - Go to your backend service settings
   - Click "Variables" tab
   - Add all the environment variables listed above

4. **Update Build Configuration**:
   ```toml
   # railway.toml (already exists)
   [build]
   builder = "nixpacks"
   buildCommand = "pip install -r requirements.txt"

   [deploy]
   startCommand = "uvicorn src.main:app --host 0.0.0.0 --port $PORT"
   ```

### 2. **Update Auth0 for Production**

Add these URLs to your Auth0 application settings:

**Allowed Callback URLs**:
```
https://auth.expo.io/@your-expo-username/roomait
https://roomait-api.railway.app/auth/callback
roomait://
com.roomait.app://
```

**Allowed Logout URLs**:
```
https://auth.expo.io/@your-expo-username/roomait
https://roomait-api.railway.app/auth/logout
roomait://
com.roomait.app://
```

**Allowed Web Origins**:
```
https://auth.expo.io
https://roomait-api.railway.app
```

### 3. **Mobile App Environment**

Update your mobile app's environment:

```bash
# In your .env file or Expo configuration
EXPO_PUBLIC_API_URL=https://roomait-api.railway.app
```

### 4. **Test Deployment**

After deployment, test these endpoints:

```bash
# Health check
curl https://roomait-api.railway.app/api/v1/health

# Seed database with models
curl -X POST https://roomait-api.railway.app/api/v1/models/seed

# Get models
curl https://roomait-api.railway.app/api/v1/models
```

## 🔍 Getting Your Auth0 Client Secret

1. Go to [Auth0 Dashboard](https://manage.auth0.com/dashboard)
2. Navigate to Applications → Your App
3. Go to Settings tab
4. Find "Client Secret" field
5. Click "Show" to reveal the secret
6. Copy this value to `AUTH0_CLIENT_SECRET`

## 🚀 Production URLs

After successful deployment, your URLs will be:

- **API Base**: `https://roomait-api.railway.app`
- **API Docs**: `https://roomait-api.railway.app/docs`
- **Health Check**: `https://roomait-api.railway.app/api/v1/health`

## 🛠️ Database Migration

Railway will automatically create tables on first startup. To manually seed data:

```bash
curl -X POST https://roomait-api.railway.app/api/v1/models/seed
```

## 📱 Mobile App Updates

Update your mobile app constants:

```typescript
// packages/constants/index.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://roomait-api.railway.app';
```

## 🔧 Troubleshooting

**Common Issues:**

1. **Database Connection Failed**:
   - Ensure PostgreSQL service is running
   - Check `DATABASE_URL` is set correctly

2. **CORS Errors**:
   - Verify `CORS_ORIGINS` includes your frontend URLs
   - Check Auth0 callback URLs are correct

3. **Auth0 Errors**:
   - Ensure `AUTH0_CLIENT_SECRET` is set
   - Verify callback URLs in Auth0 dashboard
   - Check application type is "Native"

4. **404 Errors**:
   - Verify your Railway deployment is using correct start command
   - Check railway.toml configuration

## 📊 Environment Variable Summary

**Total Required Variables**: 7
- **Critical**: 5 (Auth0 + Database + CORS)
- **Optional**: 2 (OpenAI + Railway specifics)

**Auto-Provided by Railway**: 2
- `DATABASE_URL`
- `PORT` (if not specified)

Copy these variables to Railway and your backend will be fully functional! 🎉
