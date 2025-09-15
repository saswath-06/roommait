# Auth0 Configuration Checklist - URGENT FIXES NEEDED

## 🚨 IMMEDIATE ACTION REQUIRED

Your Auth0 app is not configured correctly for React Native. Follow these exact steps:

### 1. Auth0 Dashboard Settings

Go to https://manage.auth0.com/dashboard and find your application:

#### Application Settings Tab:
- **Application Type**: Set to "Native" (NOT Single Page Application)
- **Token Endpoint Authentication Method**: Set to "None"
- **Grant Types**: Ensure these are checked:
  - ✅ Authorization Code
  - ✅ Refresh Token
  - ✅ Implicit (for development)

#### Application URIs:
**Allowed Callback URLs** (ADD ALL OF THESE):
```
https://auth.expo.io/@your-expo-username/roomait
exp://192.168.2.29:8081
roomait://
roomait://auth
com.roomait.app://
com.roomait.app://auth
```

**Allowed Logout URLs** (ADD ALL OF THESE):
```
https://auth.expo.io/@your-expo-username/roomait
exp://192.168.2.29:8081
roomait://
roomait://auth
com.roomait.app://
com.roomait.app://auth
```

**Allowed Web Origins** (ADD ALL OF THESE):
```
https://auth.expo.io
exp://192.168.2.29:8081
```

### 2. Advanced Settings Tab

#### OAuth:
- **OIDC Conformant**: ✅ Enabled
- **JsonWebToken Signature Algorithm**: RS256

#### Grant Types:
Ensure these are enabled:
- ✅ Authorization Code
- ✅ Refresh Token

### 3. Critical Settings for Mobile Apps

#### Application Type MUST be "Native"
This is the most common cause of the `code_verifier` error. Single Page Applications don't support PKCE properly.

#### Token Endpoint Authentication Method MUST be "None"
Mobile apps cannot securely store client secrets, so this must be set to "None".

## 🔧 Your Current Issues

### Error: "Parameter 'code_verifier' is required"
**Cause**: Your Auth0 app is probably set to "Single Page Application" instead of "Native"
**Fix**: Change Application Type to "Native" in Auth0 dashboard

### Missing Callback URLs
**Cause**: The redirect URIs in your app aren't registered in Auth0
**Fix**: Add all the callback URLs listed above

## 🚀 For Production Deployment

When you deploy to Railway/EAS, add these additional URLs:

### Railway Backend Domain:
If your backend is deployed to Railway at `https://your-app.railway.app`:
```
https://your-app.railway.app/auth/callback
```

### EAS Build URLs:
For production mobile builds:
```
roomait://production
com.roomait.app://production
```

### Web Deployment:
If you deploy a web version:
```
https://your-domain.com/auth/callback
```

## ✅ Verification Steps

After making changes:

1. **Save** all settings in Auth0 dashboard
2. **Wait 1-2 minutes** for changes to propagate
3. **Clear** your Expo cache: `npx expo start --clear`
4. **Test** the login flow
5. **Check** console logs for the redirect URI being generated

## 🔍 Debug Information

The fixed code now logs:
- Code verifier length (should be 43+ characters)
- Generated redirect URI
- Code challenge
- Auth result type

Watch for these logs to debug issues.

## 📱 Important Note

Since you're using Auth0 with custom native code, you CANNOT use Expo Go for testing. You must use:
- **Development**: Custom Dev Client or Expo development build
- **Production**: EAS Build

The current setup should work with `npx expo start --dev-client` but NOT with Expo Go app.
