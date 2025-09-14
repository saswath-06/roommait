# 🔐 Complete Auth0 Callback URLs - Development & Production

## 🚨 **Why Your Phone vs Friend's Phone Issue**

Your phone's callback isn't working because:
- **Your current IP**: `192.168.2.29` (what you need)
- **Friend's phone**: Probably still using old IP that's in Auth0
- **Solution**: Add BOTH IPs or use universal patterns

## 📱 **Complete Auth0 Dashboard Setup**

Go to: **Auth0 Dashboard** → **Applications** → **roomait** → **Settings**

### **🔗 Allowed Callback URLs:**
```
roomait://auth,
exp://localhost:8081/--/auth,
exp://192.168.2.29:8081/--/auth,
https://auth.expo.io/@saswath06/roomait,
https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/auth,
exp://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/--/auth
```

### **🚪 Allowed Logout URLs:**
```
roomait://logout,
exp://localhost:8081/--/logout,
exp://192.168.2.29:8081/--/logout,
https://auth.expo.io/@saswath06/roomait/logout,
https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/logout,
exp://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568/--/logout
```

### **🌐 Allowed Web Origins:**
```
exp://localhost:8081,
exp://192.168.2.29:8081,
https://localhost:8081,
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

## 🛠️ **Quick Fix Steps**

1. **Copy ALL URLs above** into Auth0 dashboard
2. **Save settings** in Auth0
3. **Restart Expo app** (`npx expo start --clear`)
4. **Test login** on your phone
5. **Test on friend's phone** to confirm both work

## 📊 **Current Status**

- **Your IP**: `192.168.2.29` ✅ 
- **EAS Project**: `44c5fe12-8e22-47ba-aed3-8672e275f568` ✅
- **Update URL**: `https://u.expo.dev/44c5fe12-8e22-47ba-aed3-8672e275f568` ✅

**After adding these URLs, both phones should work! 🎉**
