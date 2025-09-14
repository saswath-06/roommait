import React, { useEffect, useRef, useState } from 'react';
import { View, PanResponder, Alert } from 'react-native';

// Note: This is a simplified AR component for Expo Go compatibility
// For full 3D AR, use expo-gl with EAS builds

interface ARSceneProps {
  onPlaneDetected?: (plane: PlaneData) => void;
  onModelPlaced?: (model: PlacedModel) => void;
  isPlacementMode?: boolean;
  selectedModel?: FurnitureModel;
}

interface PlaneData {
  id: string;
  position: Vector3;
  normal: Vector3;
  size: { width: number; height: number };
  type: 'floor' | 'wall' | 'ceiling';
}

interface FurnitureModel {
  id: string;
  name: string;
  geometry: 'box' | 'sphere' | 'custom';
  dimensions: { width: number; height: number; depth: number };
  color: string;
  category: 'seating' | 'storage' | 'sleeping' | 'decor';
}

interface PlacedModel {
  id: string;
  model: FurnitureModel;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  planeId?: string;
}

export default function ARScene({ 
  onPlaneDetected, 
  onModelPlaced, 
  isPlacementMode = false,
  selectedModel 
}: ARSceneProps) {
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const rendererRef = useRef<Renderer>();
  const frameId = useRef<number>();
  
  const [detectedPlanes, setDetectedPlanes] = useState<PlaneData[]>([]);
  const [placedModels, setPlacedModels] = useState<PlacedModel[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  // Touch handling for model placement
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isPlacementMode && selectedModel !== undefined,
    onMoveShouldSetPanResponder: () => isPlacementMode && selectedModel !== undefined,
    
    onPanResponderGrant: (event) => {
      if (!isPlacementMode || !selectedModel) return;
      
      const { locationX, locationY } = event.nativeEvent;
      handleModelPlacement(locationX, locationY);
    },
  });

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    try {
      // Initialize Three.js scene
      const scene = new Scene();
      const camera = new PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
      const renderer = new Renderer({ gl });
      
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background for AR
      
      // Position camera
      camera.position.set(0, 1.6, 0); // Human eye height
      camera.lookAt(0, 0, -1);
      
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      
      // Start scanning for planes
      startPlaneDetection();
      
      // Start render loop
      const render = () => {
        frameId.current = requestAnimationFrame(render);
        
        // Update scene
        updateScene();
        
        // Render
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      
      render();
      
    } catch (error) {
      console.error('AR Scene initialization failed:', error);
      Alert.alert('AR Error', 'Failed to initialize AR scene. Please check camera permissions.');
    }
  };

  const startPlaneDetection = () => {
    // Simulate plane detection for now
    // In a real implementation, this would use ARKit/ARCore
    setTimeout(() => {
      const floorPlane: PlaneData = {
        id: 'floor-1',
        position: new Vector3(0, -0.5, -2),
        normal: new Vector3(0, 1, 0),
        size: { width: 4, height: 3 },
        type: 'floor'
      };
      
      addDetectedPlane(floorPlane);
      setIsScanning(false);
    }, 3000);
  };

  const addDetectedPlane = (plane: PlaneData) => {
    if (!sceneRef.current) return;
    
    // Create visual representation of detected plane
    const planeGeometry = new BoxGeometry(plane.size.width, 0.01, plane.size.height);
    const planeMaterial = new MeshBasicMaterial({ 
      color: 0x00ff00, 
      transparent: true, 
      opacity: 0.3 
    });
    
    const planeMesh = new Mesh(planeGeometry, planeMaterial);
    planeMesh.position.copy(plane.position);
    planeMesh.name = `plane-${plane.id}`;
    
    sceneRef.current.add(planeMesh);
    
    setDetectedPlanes(prev => [...prev, plane]);
    onPlaneDetected?.(plane);
  };

  const handleModelPlacement = (screenX: number, screenY: number) => {
    if (!selectedModel || !sceneRef.current || !cameraRef.current) return;
    
    // Convert screen coordinates to world coordinates
    const mouse = new Vector2(
      (screenX / 400) * 2 - 1, // Assuming view width of 400
      -(screenY / 600) * 2 + 1  // Assuming view height of 600
    );
    
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    
    // Find intersection with detected planes
    const planeObjects = sceneRef.current.children.filter(child => 
      child.name.startsWith('plane-')
    );
    
    const intersects = raycaster.intersectObjects(planeObjects);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      placeFurnitureModel(selectedModel, intersection.point);
    }
  };

  const placeFurnitureModel = (model: FurnitureModel, position: Vector3) => {
    if (!sceneRef.current) return;
    
    // Create 3D geometry based on model type
    let geometry;
    const { width, height, depth } = model.dimensions;
    
    switch (model.geometry) {
      case 'box':
        geometry = new BoxGeometry(width, height, depth);
        break;
      case 'sphere':
        geometry = new BoxGeometry(width, height, width); // Simplified sphere as box
        break;
      default:
        geometry = new BoxGeometry(width, height, depth);
    }
    
    const material = new MeshBasicMaterial({ color: model.color });
    const mesh = new Mesh(geometry, material);
    
    // Position model on surface
    mesh.position.copy(position);
    mesh.position.y += height / 2; // Place on top of surface
    
    mesh.name = `model-${model.id}-${Date.now()}`;
    sceneRef.current.add(mesh);
    
    // Store placed model data
    const placedModel: PlacedModel = {
      id: mesh.name,
      model,
      position: mesh.position.clone(),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1),
    };
    
    setPlacedModels(prev => [...prev, placedModel]);
    onModelPlaced?.(placedModel);
  };

  const updateScene = () => {
    // Update animations, physics, etc.
    // For now, just rotate placed models slightly
    if (sceneRef.current) {
      sceneRef.current.children
        .filter(child => child.name.startsWith('model-'))
        .forEach(model => {
          model.rotation.y += 0.01;
        });
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

// Default furniture models for testing
export const DEFAULT_FURNITURE_MODELS: FurnitureModel[] = [
  {
    id: 'chair-basic',
    name: 'Basic Chair',
    geometry: 'box',
    dimensions: { width: 0.5, height: 0.8, depth: 0.5 },
    color: '#8B4513',
    category: 'seating'
  },
  {
    id: 'table-coffee',
    name: 'Coffee Table',
    geometry: 'box',
    dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
    color: '#654321',
    category: 'storage'
  },
  {
    id: 'bed-single',
    name: 'Single Bed',
    geometry: 'box',
    dimensions: { width: 1.0, height: 0.5, depth: 2.0 },
    color: '#4169E1',
    category: 'sleeping'
  },
  {
    id: 'shelf-bookcase',
    name: 'Bookcase',
    geometry: 'box',
    dimensions: { width: 0.8, height: 1.8, depth: 0.3 },
    color: '#8B4513',
    category: 'storage'
  },
  {
    id: 'lamp-floor',
    name: 'Floor Lamp',
    geometry: 'box',
    dimensions: { width: 0.3, height: 1.5, depth: 0.3 },
    color: '#FFD700',
    category: 'decor'
  }
];
