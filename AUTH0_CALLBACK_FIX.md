# 🔐 Auth0 Callback URL Fix

## 🚨 **Immediate Action Required**

Your Auth0 dashboard needs these **exact** callback URLs configured:

### **1. Auth0 Dashboard Settings**

Go to: **Applications** → **roomait** → **Settings**

#### **Allowed Callback URLs:**
```
roomait://auth,
exp://localhost:8081/--/auth,
exp://192.168.2.29:8081/--/auth,
https://auth.expo.io/@saswath06/roomait
```

#### **Allowed Logout URLs:**
```
roomait://logout,
exp://localhost:8081/--/logout,
exp://192.168.2.29:8081/--/logout
```

#### **Allowed Web Origins:**
```
exp://localhost:8081,
exp://192.168.2.29:8081,
https://localhost:8081
```

### **2. Critical Settings to Verify:**

✅ **Application Type:** `Native`
✅ **Token Endpoint Authentication Method:** `None`  
✅ **Grant Types:** Only `Authorization Code` and `Refresh Token` (UNCHECK Implicit)

### **3. For Production/EAS Builds:**

When you deploy with EAS, also add:
```
https://auth.expo.io/@saswath06/roomait,
roomait://auth
```

## 🔄 **Why This Happens**

- Expo development server uses dynamic IP addresses
- Your IP changed to `192.168.2.29:8081`
- Auth0 redirects must match exactly
- Missing callback URLs cause authentication failures

## ✅ **Test After Setup**

1. Add all URLs above to Auth0 dashboard
2. Save Auth0 settings
3. Restart your Expo app
4. Try login again

**The authentication should work immediately after updating these URLs!** 🎉
