// Shared TypeScript types for RoomGenie

export interface GenericModel {
  model_id: string;
  category: 'seating' | 'storage' | 'lighting' | 'decor' | 'study';
  subcategory: string;
  display_name: string;
  description: string;
  model_url: string;
  thumbnail_url: string;
  typical_dimensions: {
    width: number;
    depth: number;
    height: number;
    units: 'inches' | 'cm';
  };
}

export interface Room {
  id: string;
  name: string;
  room_type: 'dorm' | 'bedroom' | 'studio';
  dimensions: {
    length: number;
    width: number;
    height: number;
    units: 'feet' | 'meters';
  };
}

export interface ProductRecommendation {
  product_name: string;
  price: number;
  sale_price?: number;
  rating: number;
  review_count: number;
  image_url: string;
  store: string;
  affiliate_link: string;
  why_recommended: string;
  shipping: string;
  in_stock: boolean;
}
