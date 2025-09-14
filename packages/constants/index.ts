// Shared constants for RoomGenie

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Health & Models
  HEALTH: '/api/v1/health',
  MODELS: '/api/v1/models',
  MODELS_SEED: '/api/v1/models/seed',
  
  // User & Auth
  USER_PROFILE: '/api/v1/user/profile',
  USER_DESIGNS: '/api/v1/user/designs',
  
  // AI Features
  AI_PRODUCT_SEARCH: '/api/v1/ai/product-search',
  AI_ROOM_ANALYSIS: '/api/v1/ai/room-analysis',
  AI_STYLE_SUGGESTIONS: '/api/v1/ai/style-suggestions',
  
  // AR Scanning
  AR_SCAN_PROCESS: '/api/v1/ar/scan/process',
  AR_PLACEMENT_SAVE: '/api/v1/ar/placement/save',
  AR_PLACEMENT_GET: '/api/v1/ar/placement',
  AR_USER_SCANS: '/api/v1/ar/user/scans',
  AR_VALIDATE_PLACEMENT: '/api/v1/ar/validate-placement',
} as const;

// Room categories for furniture recommendations
export const ROOM_CATEGORIES = {
  MICRO: 'micro',      // < 50 sq ft
  SMALL: 'small',      // 50-80 sq ft  
  MEDIUM: 'medium',    // 80-120 sq ft
  LARGE: 'large',      // > 120 sq ft
} as const;

// Furniture categories
export const FURNITURE_CATEGORIES = {
  SEATING: 'seating',
  STORAGE: 'storage', 
  SLEEPING: 'sleeping',
  LIGHTING: 'lighting',
  DECOR: 'decor',
  STUDY: 'study',
} as const;

export const BUDGET_RANGES = {
  LOW: { min: 15, max: 50, label: '$15-50' },
  MEDIUM: { min: 50, max: 100, label: '$50-100' },
  HIGH: { min: 100, max: 150, label: '$100-150' },
  PREMIUM: { min: 150, max: 200, label: '$150-200+' },
} as const;

export const STYLE_PREFERENCES = {
  MODERN: 'modern',
  BOHO: 'boho',
  MINIMAL: 'minimal',
  COLORFUL: 'colorful',
} as const;

export const MODEL_CATEGORIES = {
  SEATING: 'seating',
  STORAGE: 'storage',
  LIGHTING: 'lighting',
  DECOR: 'decor',
  STUDY: 'study',
} as const;
