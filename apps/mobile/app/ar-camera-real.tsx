import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import ARScene from '../src/components/ARScene';
import ModelGenerator from '../src/components/ModelGenerator';

const { width, height } = Dimensions.get('window');

type ARMode = 'scanning' | 'placement' | 'models' | 'complete';

interface PlaneData {
  id: string;
  position: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
  size: { width: number; height: number };
  type: 'floor' | 'wall' | 'ceiling';
}

interface FurnitureModel {
  id: string;
  name: string;
  dimensions: { width: number; height: number; depth: number };
  geometry: 'box' | 'sphere' | 'cylinder' | 'custom';
  color: string;
  category: 'seating' | 'storage' | 'sleeping' | 'decor' | 'workspace';
  style: string;
}

interface PlacedModel {
  id: string;
  model: FurnitureModel;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  planeId?: string;
}

export default function ARCameraReal() {
  const [permission, requestPermission] = useCameraPermissions();
  const [arMode, setARMode] = useState<ARMode>('scanning');
  const [detectedPlanes, setDetectedPlanes] = useState<PlaneData[]>([]);
  const [placedModels, setPlacedModels] = useState<PlacedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<FurnitureModel | null>(null);
  const [roomDimensions, setRoomDimensions] = useState({ width: 0, height: 0, depth: 0 });

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

  const handlePlaneDetected = (plane: PlaneData) => {
    setDetectedPlanes(prev => {
      if (prev.find(p => p.id === plane.id)) return prev;
      return [...prev, plane];
    });

    // Calculate room dimensions based on detected planes
    if (plane.type === 'floor') {
      setRoomDimensions({
        width: plane.size.width,
        height: 2.5, // Assume standard ceiling height
        depth: plane.size.height
      });
    }

    // Auto-switch to placement mode after detecting floor
    if (plane.type === 'floor' && arMode === 'scanning') {
      setTimeout(() => {
        setARMode('placement');
      }, 1000);
    }
  };

  const handleModelPlaced = (placedModel: PlacedModel) => {
    setPlacedModels(prev => [...prev, placedModel]);
    
    // Send to backend
    savePlacementToBackend(placedModel);
  };

  const savePlacementToBackend = async (placedModel: PlacedModel) => {
    try {
      // This would connect to your Railway backend
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/ar/placement/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scan_id: `room-${Date.now()}`,
          furniture_items: [{
            item_id: placedModel.id,
            model_id: placedModel.model.id,
            position: placedModel.position,
            rotation: placedModel.rotation,
            scale: placedModel.scale
          }],
          design_name: `AR Design ${new Date().toLocaleDateString()}`
        })
      });

      if (response.ok) {
        console.log('✅ Placement saved to backend');
      }
    } catch (error) {
      console.log('⚠️ Could not save to backend:', error);
    }
  };

  const handleModelGenerated = (model: any) => {
    console.log('🎨 New AI model generated:', model.name);
  };

  const handleModelSelected = (model: any) => {
    const furnitureModel: FurnitureModel = {
      id: model.id,
      name: model.name,
      dimensions: model.dimensions,
      geometry: model.geometry,
      color: model.color,
      category: model.category,
      style: model.style || 'modern'
    };
    
    setSelectedModel(furnitureModel);
    setARMode('placement');
  };

  const handleFinishDesign = async () => {
    if (placedModels.length === 0) {
      Alert.alert('No Furniture', 'Please place some furniture before finishing your design.');
      return;
    }

    try {
      // Calculate total cost
      const totalCost = placedModels.length * 150; // Simplified cost calculation
      
      Alert.alert(
        'Design Complete! 🎉',
        `You've placed ${placedModels.length} items in your ${roomDimensions.width.toFixed(1)}×${roomDimensions.depth.toFixed(1)}m room.\n\nEstimated cost: $${totalCost}`,
        [
          { text: 'Save & Continue', onPress: () => router.push('/gallery') },
          { text: 'Keep Designing', style: 'cancel' }
        ]
      );
    } catch (error) {
      console.error('Error finishing design:', error);
    }
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
        <ARScene
          onPlaneDetected={handlePlaneDetected}
          onModelPlaced={handleModelPlaced}
          isPlacementMode={false}
        />
        
        <View style={styles.scanningOverlay}>
          <View style={styles.scanningHeader}>
            <Text style={styles.scanningTitle}>Scanning Room...</Text>
            <Text style={styles.scanningSubtitle}>
              Move your phone slowly to detect surfaces
            </Text>
          </View>

          <View style={styles.scanningStats}>
            <Text style={styles.statText}>Planes Detected: {detectedPlanes.length}</Text>
            {roomDimensions.width > 0 && (
              <Text style={styles.statText}>
                Room: {roomDimensions.width.toFixed(1)}×{roomDimensions.depth.toFixed(1)}m
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => setARMode('placement')}
          >
            <Text style={styles.skipButtonText}>Skip Scanning</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  const renderPlacementView = () => (
    <View style={styles.arContainer}>
      <CameraView style={styles.camera} facing="back">
        <ARScene
          onPlaneDetected={handlePlaneDetected}
          onModelPlaced={handleModelPlaced}
          isPlacementMode={true}
          selectedModel={selectedModel}
        />
        
        <View style={styles.placementOverlay}>
          <View style={styles.placementHeader}>
            <Text style={styles.placementTitle}>
              {selectedModel ? `Tap to place ${selectedModel.name}` : 'Select furniture to place'}
            </Text>
            <Text style={styles.placementSubtitle}>
              Placed: {placedModels.length} items
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

      <ModelGenerator
        onModelGenerated={handleModelGenerated}
        onModelSelected={handleModelSelected}
      />
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
  scanningStats: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  skipButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 40,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placementOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  placementHeader: {
    alignItems: 'center',
    marginTop: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    borderRadius: 12,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
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
});
