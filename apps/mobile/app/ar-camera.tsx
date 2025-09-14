import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

type ScanningState = 'permission' | 'scanning' | 'analyzing' | 'complete';

export default function ARCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningState, setScanningState] = useState<ScanningState>('permission');
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedPlanes, setDetectedPlanes] = useState(0);
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0, depth: 0 });
  
  // Animations
  const scanningAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (permission?.granted) {
      setScanningState('scanning');
      startScanningAnimation();
    }
  }, [permission]);

  useEffect(() => {
    // Start pulsing animation
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseSequence.start();

    return () => pulseSequence.stop();
  }, []);

  const startScanningAnimation = () => {
    Animated.loop(
      Animated.timing(scanningAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result.granted) {
      setScanningState('scanning');
      startScanningAnimation();
      // Simulate scanning progress
      simulateScanning();
    } else {
      Alert.alert(
        'Camera Permission Required',
        'To use AR features, we need access to your camera to scan your room.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: handleRequestPermission }
        ]
      );
    }
  };

  const simulateScanning = () => {
    let progress = 0;
    let planes = 0;
    
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (Math.random() > 0.7) {
        planes += 1;
        setDetectedPlanes(planes);
      }
      
      setScanProgress(Math.min(progress, 100));
      
      Animated.timing(progressAnimation, {
        toValue: Math.min(progress, 100) / 100,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      if (progress >= 100) {
        clearInterval(interval);
        setScanningState('analyzing');
        
        setTimeout(() => {
          setRoomDimensions({
            width: 12 + Math.random() * 4,
            height: 8 + Math.random() * 2,
            depth: 10 + Math.random() * 4
          });
          setScanningState('complete');
        }, 2000);
      }
    }, 300);
  };

  const handleContinue = () => {
    // Navigate to furniture placement or next step
    router.push('/gallery');
  };

  const renderPermissionView = () => (
    <View style={styles.content}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnimation }] }]}>
        <MaterialCommunityIcons name="camera-outline" size={48} color="white" />
      </Animated.View>
      
      <Text style={styles.title}>AR Room Scanner</Text>
      <Text style={styles.subtitle}>
        Let's scan your room to start placing furniture in AR
      </Text>

      <View style={styles.instructionsContainer}>
        <View style={styles.instructionItem}>
          <MaterialCommunityIcons name="numeric-1-circle" size={24} color="#10c0df" />
          <Text style={styles.instructionText}>Grant camera access</Text>
        </View>
        <View style={styles.instructionItem}>
          <MaterialCommunityIcons name="numeric-2-circle" size={24} color="#10c0df" />
          <Text style={styles.instructionText}>Scan your room slowly</Text>
        </View>
        <View style={styles.instructionItem}>
          <MaterialCommunityIcons name="numeric-3-circle" size={24} color="#10c0df" />
          <Text style={styles.instructionText}>Place furniture in AR</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleRequestPermission}>
          <MaterialCommunityIcons name="camera" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Start Room Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#10c0df" />
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderScanningView = () => (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera}>
        <View style={styles.scanOverlay}>
          {/* Scanning Grid */}
          <View style={styles.scanGrid}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          
          {/* Animated Scanning Line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{
                  translateY: scanningAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, height],
                  })
                }]
              }
            ]}
          />

          {/* Top Instructions */}
          <View style={styles.scanInstructions}>
            <Text style={styles.scanTitle}>Scanning Room...</Text>
            <Text style={styles.scanSubtitle}>Move your phone slowly around the room</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(scanProgress)}% Complete</Text>
          </View>

          {/* Detected Planes Counter */}
          <View style={styles.planesCounter}>
            <MaterialCommunityIcons name="vector-square" size={20} color="#10c0df" />
            <Text style={styles.planesText}>{detectedPlanes} surfaces detected</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );

  const renderAnalyzingView = () => (
    <View style={styles.analyzingContainer}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnimation }] }]}>
        <MaterialCommunityIcons name="brain" size={48} color="#10c0df" />
      </Animated.View>
      
      <Text style={styles.title}>Analyzing Room...</Text>
      <Text style={styles.subtitle}>
        AI is processing your room layout and dimensions
      </Text>
      
      <View style={styles.loadingDots}>
        {[...Array(3)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                opacity: scanningAnimation.interpolate({
                  inputRange: [0, 0.3, 0.6, 1],
                  outputRange: i === 0 ? [0.3, 1, 0.3, 0.3] : 
                             i === 1 ? [0.3, 0.3, 1, 0.3] : 
                             [0.3, 0.3, 0.3, 1],
                })
              }
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderCompleteView = () => (
    <View style={styles.content}>
      <View style={styles.successContainer}>
        <MaterialCommunityIcons name="check-circle" size={64} color="#16a34a" />
        <Text style={styles.successTitle}>Room Scanned Successfully!</Text>
      </View>
      
      <View style={styles.dimensionsContainer}>
        <Text style={styles.dimensionsTitle}>Room Dimensions</Text>
        <View style={styles.dimensionsGrid}>
          <View style={styles.dimensionItem}>
            <Text style={styles.dimensionLabel}>Width</Text>
            <Text style={styles.dimensionValue}>{roomDimensions.width.toFixed(1)}'</Text>
          </View>
          <View style={styles.dimensionItem}>
            <Text style={styles.dimensionLabel}>Length</Text>
            <Text style={styles.dimensionValue}>{roomDimensions.depth.toFixed(1)}'</Text>
          </View>
          <View style={styles.dimensionItem}>
            <Text style={styles.dimensionLabel}>Height</Text>
            <Text style={styles.dimensionValue}>{roomDimensions.height.toFixed(1)}'</Text>
          </View>
        </View>
        <Text style={styles.surfacesText}>{detectedPlanes} surfaces detected</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <MaterialCommunityIcons name="sofa" size={24} color="white" />
          <Text style={styles.primaryButtonText}>Start Placing Furniture</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => setScanningState('scanning')}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="#10c0df" />
          <Text style={styles.secondaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {scanningState === 'permission' && renderPermissionView()}
      {scanningState === 'scanning' && renderScanningView()}
      {scanningState === 'analyzing' && renderAnalyzingView()}
      {scanningState === 'complete' && renderCompleteView()}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#10c0df',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Fraunces-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Fraunces-Regular',
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 48,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#d1d5db',
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#10c0df',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10c0df',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  secondaryButtonText: {
    color: '#10c0df',
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    marginLeft: 8,
  },
  
  // Camera Scanning Styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  scanGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
  },
  gridLine: {
    height: 1,
    backgroundColor: 'rgba(16, 192, 223, 0.3)',
    width: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#10c0df',
    shadowColor: '#10c0df',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanInstructions: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  scanTitle: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scanSubtitle: {
    fontSize: 16,
    fontFamily: 'Fraunces-Regular',
    color: '#d1d5db',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 120,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10c0df',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Fraunces-SemiBold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  planesCounter: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planesText: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#10c0df',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Analyzing Styles
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10c0df',
    marginHorizontal: 6,
  },
  
  // Success/Complete Styles
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Fraunces-Bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
  },
  dimensionsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#333333',
  },
  dimensionsTitle: {
    fontSize: 20,
    fontFamily: 'Fraunces-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dimensionItem: {
    alignItems: 'center',
  },
  dimensionLabel: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    marginBottom: 4,
  },
  dimensionValue: {
    fontSize: 20,
    fontFamily: 'Fraunces-Bold',
    color: '#10c0df',
  },
  surfacesText: {
    fontSize: 14,
    fontFamily: 'Fraunces-Regular',
    color: '#a1a1aa',
    textAlign: 'center',
  },
});