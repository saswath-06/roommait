# Auth0 Callback URL Configuration

## Current Issue
Your Auth0 app needs to be configured with the correct callback URLs for both development and production environments.

## Development Setup (Fix Now)

### 1. Add Development Callback URLs to Auth0 Dashboard

Go to your Auth0 dashboard (https://manage.auth0.com) and add these URLs to your "roomait" application:

**Allowed Callback URLs:**
```
https://auth.expo.io/@your-expo-username/roomait,
exp://192.168.2.29:8081,
roomait://
```

**Allowed Logout URLs:**
```
https://auth.expo.io/@your-expo-username/roomait,
exp://192.168.2.29:8081,
roomait://
```

**Allowed Web Origins:**
```
https://auth.expo.io,
exp://192.168.2.29:8081
```

### 2. Why This Fixes Your Issue

- `exp://192.168.2.29:8081` - This is your current Expo development server URL
- `https://auth.expo.io/@your-expo-username/roomait` - Expo's proxy for development
- `roomait://` - Your custom URL scheme for production builds

## Production Deployment Setup (Future)

When you deploy your app to production, you'll need to add these additional URLs:

### For Production Mobile App (EAS Build)
```
roomait://auth
com.roomait.app://auth  # iOS bundle identifier
```

### For Web Version (if deployed)
```
https://your-production-domain.com/auth/callback
https://your-railway-app.railway.app/auth/callback
```

### For Railway Backend CORS
Update your Railway environment variables:
```
CORS_ORIGINS=https://your-production-domain.com,https://auth.expo.io,roomait://
```

## Quick Fix Steps

1. **Go to Auth0 Dashboard**: https://manage.auth0.com/dashboard
2. **Navigate to**: Applications > roomait (or your app name)
3. **Settings Tab**: Scroll down to "Application URIs"
4. **Add the development URLs above**
5. **Save Changes**

## Testing

After adding the URLs, test the authentication flow:
1. Run your Expo app: `npm run dev:mobile`
2. Try logging in
3. You should see successful authentication without redirect errors

## Environment-Specific Configuration

Your current setup automatically handles development vs production:

```typescript
const redirectUri = AuthSession.makeRedirectUri({ 
  useProxy: __DEV__, // Uses Expo proxy in development
  scheme: 'roomait'  // Uses custom scheme in production
});
```

This means:
- **Development**: Uses `https://auth.expo.io/...` (proxy)
- **Production**: Uses `roomait://` (custom scheme)
