import { AIModel } from './model';

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export interface CategoryWithModels extends Category {
  models: AIModel[];
  topModels: AIModel[];
}
