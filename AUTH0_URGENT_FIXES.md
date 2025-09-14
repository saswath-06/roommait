# 🚨 URGENT AUTH0 FIXES - Step by Step

## Your Current Errors Explained

The callback/login errors you're seeing are because:
1. **Wrong Application Type** in Auth0 (probably set to "Single Page Application")
2. **Missing Callback URLs** for the new port (8082)
3. **Wrong Token Authentication Method**

## EXACT STEPS TO FIX (Do these NOW):

### 1. Go to Auth0 Dashboard
- URL: https://manage.auth0.com/dashboard
- Find your "roomait" application
- Click on it

### 2. Settings Tab - Application Type
**CRITICAL**: Change this setting:
- Find "Application Type" 
- Change from "Single Page Application" → **"Native"**
- This fixes the `code_verifier` error

### 3. Settings Tab - Authentication Method  
- Find "Token Endpoint Authentication Method"
- Set to **"None"**
- This is required for mobile apps

### 4. Settings Tab - Grant Types
Ensure these are checked:
- ✅ **Authorization Code**
- ✅ **Refresh Token** 
- ✅ **Implicit** (for development)

### 5. Application URIs Section
**REPLACE ALL** existing callback URLs with these:

**Allowed Callback URLs** (copy/paste this):
```
https://auth.expo.io/@your-expo-username/roomait,exp://192.168.2.29:8082,roomait://,roomait://auth,com.roomait.app://
```

**Allowed Logout URLs** (copy/paste this):
```
https://auth.expo.io/@your-expo-username/roomait,exp://192.168.2.29:8082,roomait://,roomait://auth,com.roomait.app://
```

**Allowed Web Origins** (copy/paste this):
```
https://auth.expo.io,exp://192.168.2.29:8082
```

### 6. Advanced Settings Tab
- Click "Advanced Settings" at bottom
- Go to "Grant Types" sub-tab
- Ensure "Authorization Code" and "Refresh Token" are enabled

### 7. Save Everything
- Click **"Save Changes"** 
- Wait 2 minutes for Auth0 to update

## ✅ After Making Changes:

1. **Test the login** in your app
2. **Check console logs** for new debug info
3. **Look for** these logs:
   - "Generated Code Verifier Length: 43"
   - "Generated Redirect URI: exp://192.168.2.29:8082"
   - "Auth Result Type: success"

## 🚫 Settings to AVOID for Now:

- **Refresh Token Rotation**: Keep OFF
- **Require Pushed Authorization Requests**: Keep OFF  
- **Require Proof Key for Code Exchange**: This should be AUTO-ENABLED when you set type to "Native"

## Still Getting Errors?

If you still get `code_verifier` errors after these changes:
1. Double-check Application Type is "Native"
2. Verify Token Endpoint Auth Method is "None"
3. Clear your app cache and restart Expo
4. Check that callback URLs include the :8082 port
