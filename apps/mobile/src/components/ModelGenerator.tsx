import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ModelSpec {
  category: 'seating' | 'storage' | 'sleeping' | 'decor' | 'workspace';
  style: 'modern' | 'traditional' | 'minimalist' | 'industrial' | 'scandinavian';
  size: 'small' | 'medium' | 'large';
  color?: string;
  material?: 'wood' | 'metal' | 'fabric' | 'plastic' | 'glass';
  customPrompt?: string;
}

interface GeneratedModel {
  id: string;
  name: string;
  description: string;
  dimensions: { width: number; height: number; depth: number };
  geometry: 'box' | 'sphere' | 'cylinder' | 'custom';
  color: string;
  category: ModelSpec['category'];
  style: ModelSpec['style'];
  generatedAt: Date;
  prompt: string;
}

interface ModelGeneratorProps {
  onModelGenerated: (model: GeneratedModel) => void;
  onModelSelected: (model: GeneratedModel | PredefinedModel) => void;
}

interface PredefinedModel {
  id: string;
  name: string;
  description: string;
  dimensions: { width: number; height: number; depth: number };
  geometry: 'box' | 'sphere' | 'cylinder';
  color: string;
  category: ModelSpec['category'];
  style: ModelSpec['style'];
  isPredefined: true;
}

const PREDEFINED_MODELS: PredefinedModel[] = [
  {
    id: 'modern-chair',
    name: 'Modern Office Chair',
    description: 'Ergonomic chair perfect for study sessions',
    dimensions: { width: 0.6, height: 1.0, depth: 0.6 },
    geometry: 'box',
    color: '#2C3E50',
    category: 'seating',
    style: 'modern',
    isPredefined: true
  },
  {
    id: 'scandinavian-desk',
    name: 'Scandinavian Desk',
    description: 'Clean lines, natural wood finish',
    dimensions: { width: 1.2, height: 0.75, depth: 0.6 },
    geometry: 'box',
    color: '#DEB887',
    category: 'workspace',
    style: 'scandinavian',
    isPredefined: true
  },
  {
    id: 'minimalist-shelf',
    name: 'Minimalist Bookshelf',
    description: 'Simple floating shelf design',
    dimensions: { width: 1.0, height: 1.8, depth: 0.25 },
    geometry: 'box',
    color: '#FFFFFF',
    category: 'storage',
    style: 'minimalist',
    isPredefined: true
  },
  {
    id: 'industrial-lamp',
    name: 'Industrial Floor Lamp',
    description: 'Metal base with Edison bulb',
    dimensions: { width: 0.3, height: 1.6, depth: 0.3 },
    geometry: 'cylinder',
    color: '#36454F',
    category: 'decor',
    style: 'industrial',
    isPredefined: true
  },
  {
    id: 'modern-bed',
    name: 'Platform Bed',
    description: 'Low profile modern bed frame',
    dimensions: { width: 1.4, height: 0.4, depth: 2.0 },
    geometry: 'box',
    color: '#8B4513',
    category: 'sleeping',
    style: 'modern',
    isPredefined: true
  },
  {
    id: 'storage-ottoman',
    name: 'Storage Ottoman',
    description: 'Multi-functional seating with storage',
    dimensions: { width: 0.5, height: 0.4, depth: 0.5 },
    geometry: 'box',
    color: '#708090',
    category: 'seating',
    style: 'modern',
    isPredefined: true
  }
];

export default function ModelGenerator({ onModelGenerated, onModelSelected }: ModelGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<Partial<ModelSpec>>({});
  const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([]);
  const [viewMode, setViewMode] = useState<'predefined' | 'ai-generate' | 'generated'>('predefined');

  const generateAIModel = async () => {
    if (!selectedSpec.category || !selectedSpec.style) {
      Alert.alert('Missing Info', 'Please select at least a category and style');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI model generation
      // In production, this would call OpenAI API or a custom model generation service
      const model = await simulateAIGeneration(selectedSpec as ModelSpec);
      
      setGeneratedModels(prev => [...prev, model]);
      onModelGenerated(model);
      
      Alert.alert('Success!', `Generated ${model.name} - tap to use in AR`);
    } catch (error) {
      Alert.alert('Generation Failed', 'Could not generate model. Please try again.');
      console.error('Model generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateAIGeneration = async (spec: ModelSpec): Promise<GeneratedModel> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const dimensionsByCategory = {
      seating: { width: 0.6, height: 0.8, depth: 0.6 },
      storage: { width: 0.8, height: 1.2, depth: 0.4 },
      sleeping: { width: 1.4, height: 0.5, depth: 2.0 },
      decor: { width: 0.3, height: 1.0, depth: 0.3 },
      workspace: { width: 1.2, height: 0.75, depth: 0.6 }
    };

    const colorsByStyle = {
      modern: '#2C3E50',
      traditional: '#8B4513',
      minimalist: '#FFFFFF',
      industrial: '#36454F',
      scandinavian: '#DEB887'
    };

    const sizeMultipliers = {
      small: 0.8,
      medium: 1.0,
      large: 1.2
    };

    const baseDimensions = dimensionsByCategory[spec.category];
    const multiplier = sizeMultipliers[spec.size || 'medium'];
    
    const model: GeneratedModel = {
      id: `ai-${Date.now()}`,
      name: `AI ${spec.style} ${spec.category}`,
      description: `Custom ${spec.style} style ${spec.category} generated by AI`,
      dimensions: {
        width: baseDimensions.width * multiplier,
        height: baseDimensions.height * multiplier,
        depth: baseDimensions.depth * multiplier
      },
      geometry: spec.category === 'decor' ? 'cylinder' : 'box',
      color: spec.color || colorsByStyle[spec.style],
      category: spec.category,
      style: spec.style,
      generatedAt: new Date(),
      prompt: spec.customPrompt || `${spec.style} ${spec.category} in ${spec.size || 'medium'} size`
    };

    return model;
  };

  const renderSpecSelector = () => (
    <View style={styles.specContainer}>
      <Text style={styles.sectionTitle}>Generate Custom Furniture</Text>
      
      <View style={styles.specRow}>
        <Text style={styles.specLabel}>Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['seating', 'storage', 'sleeping', 'decor', 'workspace'] as const).map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.specButton, selectedSpec.category === category && styles.specButtonSelected]}
              onPress={() => setSelectedSpec(prev => ({ ...prev, category }))}
            >
              <Text style={[styles.specButtonText, selectedSpec.category === category && styles.specButtonTextSelected]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.specRow}>
        <Text style={styles.specLabel}>Style:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['modern', 'traditional', 'minimalist', 'industrial', 'scandinavian'] as const).map(style => (
            <TouchableOpacity
              key={style}
              style={[styles.specButton, selectedSpec.style === style && styles.specButtonSelected]}
              onPress={() => setSelectedSpec(prev => ({ ...prev, style }))}
            >
              <Text style={[styles.specButtonText, selectedSpec.style === style && styles.specButtonTextSelected]}>
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.specRow}>
        <Text style={styles.specLabel}>Size:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['small', 'medium', 'large'] as const).map(size => (
            <TouchableOpacity
              key={size}
              style={[styles.specButton, selectedSpec.size === size && styles.specButtonSelected]}
              onPress={() => setSelectedSpec(prev => ({ ...prev, size }))}
            >
              <Text style={[styles.specButtonText, selectedSpec.size === size && styles.specButtonTextSelected]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
        onPress={generateAIModel}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <MaterialCommunityIcons name="auto-fix" size={20} color="#FFFFFF" />
            <Text style={styles.generateButtonText}>Generate AI Model</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderModelList = (models: (PredefinedModel | GeneratedModel)[], title: string) => (
    <View style={styles.modelListContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modelList}>
        {models.map(model => (
          <TouchableOpacity
            key={model.id}
            style={styles.modelCard}
            onPress={() => onModelSelected(model)}
          >
            <View style={[styles.modelPreview, { backgroundColor: model.color }]} />
            <Text style={styles.modelName}>{model.name}</Text>
            <Text style={styles.modelDimensions}>
              {Math.round(model.dimensions.width * 100)}×{Math.round(model.dimensions.height * 100)}×{Math.round(model.dimensions.depth * 100)}cm
            </Text>
            <Text style={styles.modelStyle}>{model.style}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'predefined' && styles.tabActive]}
          onPress={() => setViewMode('predefined')}
        >
          <Text style={[styles.tabText, viewMode === 'predefined' && styles.tabTextActive]}>
            Ready-Made
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'ai-generate' && styles.tabActive]}
          onPress={() => setViewMode('ai-generate')}
        >
          <Text style={[styles.tabText, viewMode === 'ai-generate' && styles.tabTextActive]}>
            AI Generate
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'generated' && styles.tabActive]}
          onPress={() => setViewMode('generated')}
        >
          <Text style={[styles.tabText, viewMode === 'generated' && styles.tabTextActive]}>
            My Models ({generatedModels.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {viewMode === 'predefined' && renderModelList(PREDEFINED_MODELS, 'Ready-Made Furniture')}
        {viewMode === 'ai-generate' && renderSpecSelector()}
        {viewMode === 'generated' && renderModelList(generatedModels, 'Your AI Generated Models')}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  tabText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#8B5CF6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  specContainer: {
    marginBottom: 24,
  },
  specRow: {
    marginBottom: 16,
  },
  specLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  specButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#333333',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555555',
  },
  specButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  specButtonText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  specButtonTextSelected: {
    color: '#FFFFFF',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  generateButtonDisabled: {
    backgroundColor: '#555555',
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modelListContainer: {
    marginBottom: 24,
  },
  modelList: {
    flexDirection: 'row',
  },
  modelCard: {
    width: 120,
    marginRight: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modelPreview: {
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  modelName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modelDimensions: {
    color: '#AAAAAA',
    fontSize: 10,
    marginBottom: 2,
  },
  modelStyle: {
    color: '#8B5CF6',
    fontSize: 10,
    textTransform: 'capitalize',
  },
});
