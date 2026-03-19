import { Category } from './category';
import { ModelFeature } from './model-feature';
import { Pricing } from './pricing';
import { Metrics } from './metrics';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  type: 'text' | 'image' | 'video' | 'audio';
  api_available: boolean;
  website_url: string;
  rating: number;
  context_window: number;
  overall_score: number;
  last_updated: string;
  created_at: string;
  categories: Category[];
  features: ModelFeature[];
  pricing: Pricing | null;
  metrics: Metrics | null;
}

export interface FilterState {
  category: string;
  provider: string;
  pricingType: string;
  modelType: string;
  search: string;
}
