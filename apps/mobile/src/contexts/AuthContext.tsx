import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { auth0Config, auth0Endpoints } from '../config/auth0';

// Configure WebBrowser for Auth0
WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  sub?: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Secure storage keys
const ACCESS_TOKEN_KEY = 'auth0_access_token';
const USER_KEY = 'auth0_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // Auth0 discovery configuration (manual for better reliability)
  const discovery = {
    authorizationEndpoint: auth0Endpoints.authorization,
    tokenEndpoint: auth0Endpoints.token,
    revocationEndpoint: `https://${auth0Config.domain}/oauth/revoke`,
  };

  // Auth request configuration
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0Config.clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'roomait',
      }),
      usePKCE: true, // Explicitly enable PKCE
      extraParams: {
        audience: auth0Config.audience || '',
      },
    },
    discovery
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      handleAuthSuccess(response);
    } else if (response?.type === 'error') {
      console.error('Auth error:', response.error);
      setIsLoading(false);
    }
  }, [response]);

  const checkAuthState = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedToken && storedUser) {
        // Verify token is still valid by making a test request
        try {
          const userInfoResponse = await fetch(auth0Endpoints.userInfo, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (userInfoResponse.ok) {
            const userData = JSON.parse(storedUser);
            setIsAuthenticated(true);
            setUser(userData);
          } else {
            // Token is invalid, clear storage
            await clearAuth();
          }
        } catch (error) {
          console.error('Token validation error:', error);
          await clearAuth();
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (authResponse: AuthSession.AuthSessionResult) => {
    try {
      setIsLoading(true);
      console.log('🎉 Auth response received, exchanging for tokens...');

      if (authResponse.type === 'success' && authResponse.params.code && request) {
        console.log('🔐 Request object:', JSON.stringify({
          redirectUri: request.redirectUri,
          codeVerifier: request.codeVerifier ? 'present' : 'missing',
          codeChallenge: request.codeChallenge ? 'present' : 'missing'
        }));
        
        if (!request.codeVerifier) {
          throw new Error('Code verifier is missing from request object');
        }
        
        // Exchange authorization code for access token using direct HTTP request
        console.log('🔄 Exchanging code with direct HTTP request...');
        
        const tokenBody = new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: auth0Config.clientId,
          code: authResponse.params.code,
          redirect_uri: request.redirectUri,
          code_verifier: request.codeVerifier,
        });

        console.log('📨 Token request body:', Object.fromEntries(tokenBody.entries()));
        
        const tokenResponse = await fetch(auth0Endpoints.token, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
          body: tokenBody.toString(),
        });

        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error('🚫 Token exchange failed:', errorText);
          throw new Error(`Token exchange failed: ${tokenResponse.status} ${errorText}`);
        }

        const tokenData = await tokenResponse.json();

        console.log('🔑 Token exchange successful!');

        // Get user info
        const userInfoResponse = await fetch(auth0Endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await userInfoResponse.json();
        console.log('👤 User info retrieved successfully');

        // Store credentials
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokenData.access_token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo));

        setIsAuthenticated(true);
        setUser(userInfo);
      }
    } catch (error) {
      console.error('❌ Token exchange error:', error);
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Starting login process...');
      
      if (request) {
        console.log('🔗 Redirect URI:', request.redirectUri);
        await promptAsync();
      } else {
        throw new Error('Auth request not ready');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('🔓 Logging out...');

      // Create logout URL
      const returnToUrl = AuthSession.makeRedirectUri({ scheme: 'roomait' });
      const logoutUrl = `${auth0Endpoints.logout}?client_id=${auth0Config.clientId}&returnTo=${encodeURIComponent(returnToUrl)}`;

      // Open logout URL
      await WebBrowser.openAuthSessionAsync(logoutUrl, returnToUrl);

      await clearAuth();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Clear local auth even if logout fails
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
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
