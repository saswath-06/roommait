import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../src/contexts/AuthContext';

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  
  const handleStartAR = () => {
    router.push('/ar-camera');
  };

  const handleViewGallery = () => {
    router.push('/gallery');
  };

  const handleSignIn = () => {
    router.push('/login');
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          {isAuthenticated && user ? (
            <Text style={styles.heroWelcome}>
              Welcome back, {user.name || user.email?.split('@')[0] || 'Student'}! 👋
            </Text>
          ) : null}
          <Text style={styles.heroTitle}>
            Design your{'\n'}
            <Text style={styles.heroHighlight}>perfect space</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Visualize furniture in your room with AR before you buy
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartAR}>
            <MaterialCommunityIcons name="camera-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Try AR Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewGallery}>
            <Feather name="grid" size={18} color="#10c0df" />
            <Text style={styles.secondaryButtonText}>Browse Catalog</Text>
          </TouchableOpacity>
          
          {!isAuthenticated && (
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Feather name="log-in" size={20} color="#ffffff" />
              <Text style={styles.signInButtonText}>Sign In for More Features</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#dbeafe' }]}>
              <MaterialCommunityIcons name="augmented-reality" size={20} color="#10c0df" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AR Visualization</Text>
              <Text style={styles.featureDescription}>
                See how furniture looks in your space before buying
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#f3e8ff' }]}>
              <MaterialCommunityIcons name="brain" size={20} color="#9333ea" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Suggestions</Text>
              <Text style={styles.featureDescription}>
                AI-powered recommendations for your room size
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: '#dcfce7' }]}>
              <MaterialCommunityIcons name="school" size={20} color="#16a34a" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Student Pricing</Text>
              <Text style={styles.featureDescription}>
                Special discounts for college students
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Trusted by students nationwide</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10k+</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Universities</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.9★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#000000',
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 42,
    fontFamily: 'Fraunces-Regular',
    color: '#ffffff',
    lineHeight: 46,
    marginBottom: 16,
    marginTop: 35
  },
  heroHighlight: {
    color: '#10c0df',
  },
  heroSubtitle: {
    fontSize: 20,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    lineHeight: 28,
  },
  heroWelcome: {
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    color: '#10c0df',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  primaryButton: {
    backgroundColor: '#10c0df',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10c0df',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#10c0df',
    fontSize: 18,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  signInButton: {
    backgroundColor: '#333333',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#555555',
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontFamily: 'Fraunces-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 17,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    lineHeight: 24,
  },
  statsCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: 'Fraunces-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontFamily: 'Fraunces-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
  },
});