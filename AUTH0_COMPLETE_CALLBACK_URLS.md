# 🔐 Complete Auth0 Callback URLs - Development & Production

## 🚨 **Why Your Phone vs Friend's Phone Issue**

Your phone's callback isn't working because:
- **Your current IP**: `192.168.2.29` (what you need)
- **Friend's phone**: Probably still using old IP that's in Auth0
- **Solution**: Add BOTH IPs or use universal patterns

**References from Auth0 Community:**
- [Callback URL Mismatch with Expo](https://community.auth0.com/t/help-needed-callback-url-mismatch-error-with-auth0-and-expo-react-native/185005)
- [Bundle Identifier Issues](https://community.auth0.com/t/callback-url-is-mismatch-but-it-is-already-set-for-expo-application/119648)

## 📱 **Complete Auth0 Dashboard Setup**

Go to: **Auth0 Dashboard** → **Applications** → **roomait** → **Settings**

### **🔗 Allowed Callback URLs (Copy ALL of these):**
```
roomait://auth,
roomait://dev-au2yf8c1n0hrml0i.us.auth0.com/ios/com.roomait.app/callback,
roomait://dev-au2yf8c1n0hrml0i.us.auth0.com/android/com.roomait.app/callback,
com.roomait.app.auth0://dev-au2yf8c1n0hrml0i.us.auth0.com/ios/com.roomait.app/callback,
com.roomait.app.auth0://dev-au2yf8c1n0hrml0i.us.auth0.com/android/com.roomait.app/callback,
exp://localhost:8082/--/auth,
exp://192.168.2.29:8082/--/auth,
exp://192.168.2.29:8081/--/auth,
https://auth.expo.io/@saswath06/roomait,
https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/auth,
exp://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/--/auth
```

### **🚪 Allowed Logout URLs:**
```
roomait://logout,
roomait://dev-au2yf8c1n0hrml0i.us.auth0.com/ios/com.roomait.app/logout,
roomait://dev-au2yf8c1n0hrml0i.us.auth0.com/android/com.roomait.app/logout,
com.roomait.app.auth0://dev-au2yf8c1n0hrml0i.us.auth0.com/ios/com.roomait.app/logout,
com.roomait.app.auth0://dev-au2yf8c1n0hrml0i.us.auth0.com/android/com.roomait.app/logout,
exp://localhost:8082/--/logout,
exp://192.168.2.29:8082/--/logout,
exp://192.168.2.29:8081/--/logout,
https://auth.expo.io/@saswath06/roomait/logout,
https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/logout,
exp://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/--/logout
```

### **🌐 Allowed Web Origins:**
```
exp://localhost:8082,
exp://192.168.2.29:8082,
exp://192.168.2.29:8081,
https://localhost:8082,
https://u.expo.dev,
https://auth.expo.io
```

## 🎯 **EAS Update Specific URLs**

### **For EAS Updates (Published Apps):**
- **Project ID**: `44c5fe12-8e22-47ba-aed3-8672e275f568`
- **Update URL**: `https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568`

### **EAS Callback Pattern:**
```
https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/auth
exp://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/--/auth
```

## 🔄 **Dynamic IP Solution**

Since IP addresses change, add these patterns for flexibility:

### **Wildcard Development URLs:**
```
exp://192.168.*:8081/--/auth,
exp://10.0.*:8081/--/auth,
exp://172.16.*:8081/--/auth
```

## 📋 **Critical Auth0 Settings Checklist**

✅ **Application Type:** `Native`  
✅ **Token Endpoint Authentication Method:** `None`  
✅ **Grant Types:** 
- ✅ Authorization Code  
- ✅ Refresh Token  
- ❌ Implicit (UNCHECK this!)  

## 🚀 **Testing Different Scenarios**

### **1. Development Server (Your Computer)**
- **Your Phone**: Uses `exp://192.168.2.29:8081`
- **Friend's Phone**: Uses same IP if on same network

### **2. EAS Update (Deployed)**
- **Any Phone**: Uses `https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568`
- **Works Offline**: Once downloaded to Expo Go

### **3. Production Build**
- **Custom Scheme**: `roomait://auth`
- **Works Always**: Independent of network

## 🛠️ **Critical Fixes from Auth0 Community**

Based on [Auth0 Community Posts](https://community.auth0.com/t/help-needed-callback-url-mismatch-error-with-auth0-and-expo-react-native/185005), the key issues are:

### **⚠️ Common Mistakes:**
1. **Bundle Identifier Mismatch**: Your app.json shows `com.roomait.app` but Auth0 might expect different format
2. **Missing Platform-Specific URLs**: Auth0 requires both iOS and Android specific callback patterns
3. **Port Changes**: Expo often switches ports (8081 → 8082), breaking callbacks
4. **EAS vs Expo Go**: Different URL patterns for development vs production

### **✅ Verified Solution Steps:**

1. ✅ **Auth0 Domain**: `dev-au2yf8c1n0hrml0i.us.auth0.com` (already updated above!)
2. **Copy ALL URLs above** into Auth0 dashboard (don't cherry-pick!)
3. **Verify Bundle ID**: Ensure `com.roomait.app` matches exactly in Auth0
4. **Save settings** in Auth0 and wait 30 seconds for propagation
5. **Restart Expo**: `npx expo start --clear --port 8082`
6. **Test both phones** - should work immediately

## 📊 **Current Status**

- **Your IP**: `192.168.2.29` ✅ 
- **EAS Project**: `44c5fe12-8e22-47ba-aed3-8672e275f568` ✅
- **Update URL**: `https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568` ✅

**After adding these URLs, both phones should work! 🎉**
