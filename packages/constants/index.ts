// Shared constants for RoomGenie

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

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
