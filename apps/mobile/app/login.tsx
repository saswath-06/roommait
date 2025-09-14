import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function Login() {
  const { login, isLoading } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async () => {
    try {
      setIsAuthenticating(true);
      await login();
      // Navigate to home after successful login
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        'Unable to sign in. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSkip = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Logo and Welcome */}
        <View style={styles.welcomeSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Feather name="home" size={48} color="#10c0df" />
            </View>
          </View>
          
          <Text style={styles.welcomeTitle}>Welcome to Roomait</Text>
          <Text style={styles.welcomeSubtitle}>
            Your AI-powered dorm room designer
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="camera" size={20} color="#10c0df" />
            </View>
            <Text style={styles.featureText}>AR furniture placement</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="heart" size={20} color="#10c0df" />
            </View>
            <Text style={styles.featureText}>Save your favorite designs</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="shopping-bag" size={20} color="#10c0df" />
            </View>
            <Text style={styles.featureText}>Student discounts & deals</Text>
          </View>
        </View>

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          <TouchableOpacity 
            style={[styles.loginButton, isAuthenticating && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isAuthenticating || isLoading}
          >
            {isAuthenticating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Feather name="log-in" size={20} color="#ffffff" />
            )}
            <Text style={styles.loginButtonText}>
              {isAuthenticating ? 'Signing In...' : 'Sign In with Auth0'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleSkip}
          >
            <Feather name="user" size={20} color="#10c0df" />
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333333',
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresSection: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#ffffff',
    flex: 1,
  },
  authSection: {
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10c0df',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 16,
    shadowColor: '#10c0df',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 12,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  guestButtonText: {
    color: '#10c0df',
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 12,
  },
  footer: {
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Fraunces-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#10c0df',
    fontFamily: 'Fraunces-SemiBold',
  },
});
