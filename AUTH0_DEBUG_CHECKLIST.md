# 🚨 AUTH0 DEBUG CHECKLIST - Still Getting code_verifier Error

## The Issue
Even though you set Application Type to "Native", you're still getting the `code_verifier` error. This means there are other settings that need to be fixed.

## CRITICAL SETTINGS TO CHECK RIGHT NOW:

### 1. Token Endpoint Authentication Method ⚠️
**MOST LIKELY ISSUE**: This is probably still set wrong.

- In your Auth0 app settings, find "Token Endpoint Authentication Method"
- It MUST be set to **"None"**
- If it's set to "Post" or "Basic", that's causing the error
- Change it to **"None"** and save

### 2. Advanced Settings - Grant Types ⚠️
- Scroll down to "Advanced Settings" 
- Click "Grant Types" tab
- Ensure these are checked:
  - ✅ **Authorization Code** (CRITICAL)
  - ✅ **Refresh Token**
  - ❌ **Implicit** (can uncheck this)
  - ❌ **Client Credentials** (uncheck this)

### 3. OIDC Conformant Setting ⚠️
- In "Advanced Settings" → "OAuth" tab
- Ensure **"OIDC Conformant"** is **ENABLED** ✅
- This is required for PKCE to work properly

### 4. Verify Callback URLs
Make sure these exact URLs are in "Allowed Callback URLs":
```
https://auth.expo.io/@your-expo-username/roomait
exp://192.168.2.29:8081
exp://192.168.2.29:8082
roomait://
```

## STEP-BY-STEP DEBUG PROCESS:

### Step 1: Check Token Authentication Method
1. Go to your Auth0 app settings
2. Find "Token Endpoint Authentication Method"
3. If it's NOT "None", change it to "None"
4. Save changes

### Step 2: Check Advanced Settings
1. Scroll to bottom, click "Advanced Settings"
2. Go to "Grant Types" tab
3. Make sure "Authorization Code" is checked
4. Go to "OAuth" tab  
5. Make sure "OIDC Conformant" is enabled

### Step 3: Save and Wait
1. Click "Save Changes"
2. Wait 2-3 minutes for Auth0 to propagate changes
3. Test your app again

### Step 4: If Still Failing
If you're still getting the error after these changes:

1. **Clear your app completely**:
   - Close Expo completely
   - Clear cache: `npx expo start --clear`
   - Try login again

2. **Check the exact error details**:
   - Look at the full error message
   - Check if it mentions specific parameters

## COMMON CAUSES OF PERSISTENT code_verifier ERRORS:

1. **Token Authentication Method**: Not set to "None"
2. **Grant Types**: "Authorization Code" not enabled  
3. **OIDC Conformant**: Not enabled
4. **Cache**: Auth0 changes not propagated yet
5. **App Cache**: Expo/React Native cache holding old tokens

## IF NOTHING WORKS:
Try creating a **completely new Auth0 application**:
1. Create new app in Auth0
2. Set type to "Native" from the start
3. Configure all settings fresh
4. Update your app config with new Client ID

This eliminates any hidden configuration issues.
