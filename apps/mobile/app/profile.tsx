import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function Profile() {
  const { isLoading, isAuthenticated, user, login, logout } = useAuth();
  
  const menuItems = [
    { icon: 'school', title: 'University Info', subtitle: 'Add your school for discounts' },
    { icon: 'heart-outline', title: 'Favorites', subtitle: 'Saved furniture items' },
    { icon: 'history', title: 'Purchase History', subtitle: 'View past orders' },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get assistance' },
    { icon: 'settings', title: 'Settings', subtitle: 'App preferences' },
  ];

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      Alert.alert('Login Error', 'Failed to log in. Please try again.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Logout Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <View style={styles.loginIcon}>
                <Feather name="user" size={48} color="#10c0df" />
              </View>
              <Text style={styles.loginTitle}>Welcome to Roomait</Text>
              <Text style={styles.loginSubtitle}>
                Sign in to save your favorite furniture, track orders, and get personalized recommendations.
              </Text>
              
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Feather name="log-in" size={20} color="#ffffff" />
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity>
              
              <Text style={styles.loginFooter}>
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.profileUniversity}>
            {user?.email || 'No email provided'}
          </Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>
              {user?.email_verified ? 'Email Verified ✓' : 'Email Pending Verification'}
            </Text>
          </View>
          
          {/* Edit Button */}
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-3" size={20} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>AR Views</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$245</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIcon}>
              <MaterialCommunityIcons 
                name={item.icon as any} 
                size={24} 
                color="#ffffff" 
              />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={24} color="#dc2626" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10c0df',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  profileCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: '#10c0df',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  profileUniversity: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    marginBottom: 16,
    textAlign: 'center',
  },
  verifiedBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  verifiedText: {
    color: '#16a34a',
    fontFamily: 'Fraunces-SemiBold',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
  },
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  menuItem: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
  },
  signOutButton: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  signOutText: {
    color: '#dc2626',
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 12,
  },
  // Loading state styles
  loadingText: {
    fontSize: 18,
    fontFamily: 'Fraunces-Regular',
    color: '#ffffff',
  },
  // Login screen styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  loginCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    width: '100%',
    maxWidth: 400,
  },
  loginIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10c0df',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 12,
  },
  loginFooter: {
    fontSize: 12,
    fontFamily: 'Fraunces-Regular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
});