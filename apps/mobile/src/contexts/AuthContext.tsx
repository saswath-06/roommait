import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { auth0Config, auth0Endpoints } from '../config/auth0';

// Complete WebBrowser session when returning to app
WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  sub?: string;
  [key: string]: any;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Secure storage keys
const ACCESS_TOKEN_KEY = 'roomait_access_token';
const REFRESH_TOKEN_KEY = 'roomait_refresh_token';
const USER_KEY = 'roomait_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // Create redirect URI - more explicit handling
  const getRedirectUri = () => {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'roomait',
      path: 'auth'
    });
    
    console.log('🔗 Generated Redirect URI:', redirectUri);
    console.log('🔗 Platform:', Platform.OS);
    console.log('🔗 Scheme Test:', AuthSession.makeRedirectUri({ scheme: 'roomait' }));
    
    return redirectUri;
  };

  // Auth0 discovery configuration
  const discovery = {
    authorizationEndpoint: `https://${auth0Config.domain}/authorize`,
    tokenEndpoint: `https://${auth0Config.domain}/oauth/token`,
    revocationEndpoint: `https://${auth0Config.domain}/oauth/revoke`,
    userInfoEndpoint: `https://${auth0Config.domain}/userinfo`,
    endSessionEndpoint: `https://${auth0Config.domain}/v2/logout`,
  };

  // Auth request configuration
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0Config.clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: getRedirectUri(),
      usePKCE: true,
      additionalParameters: {
        audience: auth0Config.audience || `https://${auth0Config.domain}/api/v2/`,
      },
      extraParams: {
        prompt: 'login',
      },
    },
    discovery
  );

  // Debug the request object
  useEffect(() => {
    if (request) {
      console.log('🔧 Auth Request Details:', {
        redirectUri: request.redirectUri,
        clientId: request.clientId,
        codeChallenge: request.codeChallenge ? 'Present' : 'Missing',
        codeVerifier: request.codeVerifier ? 'Present' : 'Missing',
        state: request.state,
      });
    }
  }, [request]);

  // Initialize auth state
  useEffect(() => {
    checkAuthState();
  }, []);

  // Handle auth response
  useEffect(() => {
    if (response) {
      console.log('📥 Auth Response:', {
        type: response.type,
        url: response.url,
        params: response.params,
        error: response.error,
      });

      if (response.type === 'success') {
        handleAuthSuccess(response);
      } else if (response.type === 'error') {
        console.error('❌ Auth Error:', response.error);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [response]);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking stored auth state...');
      
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedToken && storedUser) {
        console.log('✅ Found stored credentials, validating...');
        
        // Validate token by fetching user info
        const userInfoResponse = await fetch(discovery.userInfoEndpoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (userInfoResponse.ok) {
          const userData = JSON.parse(storedUser);
          console.log('✅ Token valid, user authenticated');
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          console.log('⚠️ Token invalid, clearing auth');
          await clearAuth();
        }
      } else {
        console.log('ℹ️ No stored credentials found');
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (authResponse: AuthSession.AuthSessionResult) => {
    try {
      setIsLoading(true);
      console.log('🎉 Processing successful auth response...');

      if (authResponse.type === 'success' && authResponse.params.code && request) {
        console.log('🔄 Exchanging authorization code for tokens...');

        // Prepare token exchange request
        const tokenRequestBody = {
          grant_type: 'authorization_code',
          client_id: auth0Config.clientId,
          code: authResponse.params.code,
          redirect_uri: request.redirectUri,
          code_verifier: request.codeVerifier!,
        };

        console.log('📤 Token request details:', {
          ...tokenRequestBody,
          code_verifier: tokenRequestBody.code_verifier ? 'Present' : 'Missing',
        });

        // Exchange code for tokens
        const tokenResponse = await fetch(discovery.tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: new URLSearchParams(tokenRequestBody).toString(),
        });

        const tokenResponseText = await tokenResponse.text();
        console.log('📥 Token response status:', tokenResponse.status);

        if (!tokenResponse.ok) {
          console.error('❌ Token exchange failed:', tokenResponseText);
          throw new Error(`Token exchange failed: ${tokenResponse.status} - ${tokenResponseText}`);
        }

        const tokenData = JSON.parse(tokenResponseText);
        console.log('✅ Token exchange successful');

        // Get user information
        console.log('👤 Fetching user info...');
        const userInfoResponse = await fetch(discovery.userInfoEndpoint, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          const userInfoError = await userInfoResponse.text();
          console.error('❌ User info fetch failed:', userInfoError);
          throw new Error(`User info fetch failed: ${userInfoResponse.status}`);
        }

        const userInfo = await userInfoResponse.json();
        console.log('✅ User info retrieved:', { 
          email: userInfo.email,
          name: userInfo.name,
          verified: userInfo.email_verified 
        });

        // Store tokens and user info
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenData.access_token);
        if (tokenData.refresh_token) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenData.refresh_token);
        }
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo));

        // Update state
        setIsAuthenticated(true);
        setUser(userInfo);
        
        console.log('🎊 Login completed successfully!');
      }
    } catch (error) {
      console.error('💥 Auth success handler error:', error);
      await clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting login flow...');
      
      if (!request) {
        console.error('❌ Auth request not ready');
        throw new Error('Authentication request not initialized');
      }

      console.log('🔓 Opening Auth0 login...');
      console.log('🔗 Using redirect URI:', request.redirectUri);
      
      const result = await promptAsync({
        showInRecents: true,
        createTask: false,
      });
      
      console.log('📱 Browser result:', result.type);
      
      // The response will be handled by the useEffect hook
      if (result.type === 'cancel') {
        console.log('ℹ️ User cancelled login');
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('👋 Starting logout...');

      // Create logout URL
      const returnToUrl = getRedirectUri();
      const logoutUrl = `${discovery.endSessionEndpoint}?client_id=${auth0Config.clientId}&returnTo=${encodeURIComponent(returnToUrl)}`;
      
      console.log('🔗 Logout URL:', logoutUrl);
      console.log('🔗 Return URL:', returnToUrl);

      // Open logout URL in browser
      const result = await WebBrowser.openAuthSessionAsync(
        logoutUrl,
        returnToUrl,
        {
          showInRecents: true,
        }
      );

      console.log('📱 Logout result:', result.type);

      // Clear local storage regardless of web result
      await clearAuth();
      console.log('✅ Logout completed');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Always clear local auth on logout attempt
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      console.log('🧹 Clearing authentication data...');
      
      await Promise.all([
        SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY).catch(() => {}),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {}),
        SecureStore.deleteItemAsync(USER_KEY).catch(() => {}),
      ]);
      
      setIsAuthenticated(false);
      setUser(null);
      
      console.log('✅ Auth data cleared');
    } catch (error) {
      console.error('❌ Error clearing auth:', error);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};