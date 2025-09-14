import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  Alert, 
  Animated,
  ScrollView,
  PanResponder 
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

type ARMode = 'permission' | 'scanning' | 'placement' | 'models' | 'complete';

interface FurnitureModel {
  id: string;
  name: string;
  dimensions: { width: number; height: number; depth: number };
  color: string;
  category: 'seating' | 'storage' | 'sleeping' | 'decor' | 'workspace';
  style: string;
  price: number;
}

interface PlacedFurniture {
  id: string;
  model: FurnitureModel;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const FURNITURE_MODELS: FurnitureModel[] = [
  {
    id: 'modern-chair',
    name: 'Modern Office Chair',
    dimensions: { width: 60, height: 100, depth: 60 },
    color: '#2C3E50',
    category: 'seating',
    style: 'modern',
    price: 179
  },
  {
    id: 'scandinavian-desk',
    name: 'Scandinavian Desk',
    dimensions: { width: 120, height: 75, depth: 60 },
    color: '#DEB887',
    category: 'workspace',
    style: 'scandinavian',
    price: 299
  },
  {
    id: 'minimalist-shelf',
    name: 'Minimalist Bookshelf',
    dimensions: { width: 100, height: 180, depth: 25 },
    color: '#FFFFFF',
    category: 'storage',
    style: 'minimalist',
    price: 149
  },
  {
    id: 'industrial-lamp',
    name: 'Industrial Floor Lamp',
    dimensions: { width: 30, height: 160, depth: 30 },
    color: '#36454F',
    category: 'decor',
    style: 'industrial',
    price: 89
  },
  {
    id: 'platform-bed',
    name: 'Platform Bed',
    dimensions: { width: 140, height: 40, depth: 200 },
    color: '#8B4513',
    category: 'sleeping',
    style: 'modern',
    price: 399
  },
  {
    id: 'storage-ottoman',
    name: 'Storage Ottoman',
    dimensions: { width: 50, height: 40, depth: 50 },
    color: '#708090',
    category: 'seating',
    style: 'modern',
    price: 79
  }
];

export default function ARCameraSimple() {
  const [permission, requestPermission] = useCameraPermissions();
  const [arMode, setARMode] = useState<ARMode>('permission');
  const [selectedModel, setSelectedModel] = useState<FurnitureModel | null>(null);
  const [placedFurniture, setPlacedFurniture] = useState<PlacedFurniture[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [roomDimensions, setRoomDimensions] = useState({ width: 12, height: 8 });
  
  const scanningAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission?.granted && arMode === 'scanning') {
      simulateRoomScanning();
    }
  }, [permission, arMode]);

  const simulateRoomScanning = () => {
    // Simulate progressive room scanning
    const scanSteps = [
      { progress: 0.2, message: 'Detecting floor surface...' },
      { progress: 0.4, message: 'Mapping walls...' },
      { progress: 0.6, message: 'Calculating room dimensions...' },
      { progress: 0.8, message: 'Identifying furniture zones...' },
      { progress: 1.0, message: 'Scan complete!' }
    ];

    let currentStep = 0;
    
    const animateStep = () => {
      if (currentStep < scanSteps.length) {
        const step = scanSteps[currentStep];
        
        Animated.timing(progressAnimation, {
          toValue: step.progress,
          duration: 1000,
          useNativeDriver: false,
        }).start(() => {
          setScanProgress(step.progress);
          currentStep++;
          
          if (currentStep < scanSteps.length) {
            setTimeout(animateStep, 500);
          } else {
            setTimeout(() => setARMode('placement'), 1000);
          }
        });
      }
    };

    animateStep();
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result.granted) {
      setARMode('scanning');
    } else {
      Alert.alert(
        'Camera Permission Required',
        'Please enable camera access to use AR features.',
        [{ text: 'OK' }]
      );
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => selectedModel !== null,
    onMoveShouldSetPanResponder: () => selectedModel !== null,
    
    onPanResponderGrant: (event) => {
      if (!selectedModel) return;
      
      const { locationX, locationY } = event.nativeEvent;
      placeFurniture(selectedModel, locationX, locationY);
    },
  });

  const placeFurniture = (model: FurnitureModel, x: number, y: number) => {
    const newFurniture: PlacedFurniture = {
      id: `${model.id}-${Date.now()}`,
      model,
      x,
      y,
      scale: 1,
      rotation: 0,
    };

    setPlacedFurniture(prev => [...prev, newFurniture]);
    
    // Send to backend
    saveFurnitureToBackend(newFurniture);
  };

  const saveFurnitureToBackend = async (furniture: PlacedFurniture) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/ar/placement/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: `room-${Date.now()}`,
          furniture_items: [{
            item_id: furniture.id,
            model_id: furniture.model.id,
            position: { x: furniture.x, y: furniture.y, z: 0 },
            rotation: { x: 0, y: furniture.rotation, z: 0 },
            scale: { x: furniture.scale, y: furniture.scale, z: furniture.scale }
          }],
          design_name: `AR Design ${new Date().toLocaleDateString()}`
        })
      });

      if (response.ok) {
        console.log('✅ Furniture saved to backend');
      }
    } catch (error) {
      console.log('⚠️ Could not save to backend:', error);
    }
  };

  const handleFinishDesign = () => {
    if (placedFurniture.length === 0) {
      Alert.alert('No Furniture', 'Please place some furniture before finishing your design.');
      return;
    }

    const totalCost = placedFurniture.reduce((sum, item) => sum + item.model.price, 0);
    
    Alert.alert(
      'Design Complete! 🎉',
      `You've placed ${placedFurniture.length} items.\n\nEstimated cost: $${totalCost}`,
      [
        { text: 'Save & Continue', onPress: () => router.push('/gallery') },
        { text: 'Keep Designing', style: 'cancel' }
      ]
    );
  };

  const renderPermissionView = () => (
    <View style={styles.centerContainer}>
      <MaterialCommunityIcons name="camera" size={80} color="#8B5CF6" />
      <Text style={styles.permissionTitle}>AR Camera Access</Text>
      <Text style={styles.permissionText}>
        We need camera access to scan your room and place furniture in AR
      </Text>
      <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
        <Text style={styles.permissionButtonText}>Enable Camera</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScanningView = () => (
    <View style={styles.arContainer}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.scanningOverlay}>
          <View style={styles.scanningHeader}>
            <Text style={styles.scanningTitle}>Scanning Room...</Text>
            <Text style={styles.scanningSubtitle}>
              Move your phone slowly around the room
            </Text>
          </View>

          <View style={styles.scanningProgress}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })}
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(scanProgress * 100)}% Complete
            </Text>
          </View>

          <View style={styles.scanningStats}>
            <Text style={styles.statText}>Room: {roomDimensions.width}ft × {roomDimensions.height}ft</Text>
            <Text style={styles.statText}>Surfaces Detected: 3</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );

  const renderPlacementView = () => (
    <View style={styles.arContainer}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.arOverlay} {...panResponder.panHandlers}>
          {/* Render placed furniture as simple rectangles */}
          {placedFurniture.map((furniture) => (
            <View
              key={furniture.id}
              style={[
                styles.furnitureItem,
                {
                  left: furniture.x - 25,
                  top: furniture.y - 25,
                  backgroundColor: furniture.model.color,
                  transform: [
                    { scale: furniture.scale },
                    { rotate: `${furniture.rotation}deg` }
                  ]
                }
              ]}
            >
              <Text style={styles.furnitureLabel}>{furniture.model.name}</Text>
            </View>
          ))}

          <View style={styles.placementHeader}>
            <Text style={styles.placementTitle}>
              {selectedModel ? `Tap to place ${selectedModel.name}` : 'Select furniture to place'}
            </Text>
            <Text style={styles.placementSubtitle}>
              Placed: {placedFurniture.length} items
            </Text>
          </View>

          <View style={styles.placementControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setARMode('models')}
            >
              <MaterialCommunityIcons name="shape-plus" size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Add Furniture</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleFinishDesign}
            >
              <MaterialCommunityIcons name="check" size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );

  const renderModelsView = () => (
    <View style={styles.container}>
      <View style={styles.modelsHeader}>
        <TouchableOpacity 
          onPress={() => setARMode('placement')}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.modelsTitle}>Choose Furniture</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.modelsList}>
        <View style={styles.modelsGrid}>
          {FURNITURE_MODELS.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelCard,
                selectedModel?.id === model.id && styles.modelCardSelected
              ]}
              onPress={() => {
                setSelectedModel(model);
                setARMode('placement');
              }}
            >
              <View style={[styles.modelPreview, { backgroundColor: model.color }]} />
              <Text style={styles.modelName}>{model.name}</Text>
              <Text style={styles.modelDimensions}>
                {model.dimensions.width}×{model.dimensions.height}×{model.dimensions.depth}cm
              </Text>
              <Text style={styles.modelPrice}>${model.price}</Text>
              <Text style={styles.modelStyle}>{model.style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (!permission) {
    return <View style={styles.centerContainer} />;
  }

  if (!permission.granted) {
    return renderPermissionView();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {arMode === 'scanning' && renderScanningView()}
      {arMode === 'placement' && renderPlacementView()}
      {arMode === 'models' && renderModelsView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  arContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  scanningHeader: {
    alignItems: 'center',
    marginTop: 60,
  },
  scanningTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scanningSubtitle: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  scanningProgress: {
    alignItems: 'center',
    marginVertical: 40,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanningStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  furnitureItem: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  furnitureLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placementHeader: {
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  placementTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placementSubtitle: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  placementControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  modelsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  modelsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  modelsList: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  modelCard: {
    width: '47%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#333333',
  },
  modelCardSelected: {
    borderColor: '#8B5CF6',
  },
  modelPreview: {
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  modelName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelDimensions: {
    color: '#AAAAAA',
    fontSize: 11,
    marginBottom: 2,
  },
  modelPrice: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  modelStyle: {
    color: '#AAAAAA',
    fontSize: 10,
    textTransform: 'capitalize',
  },
});
