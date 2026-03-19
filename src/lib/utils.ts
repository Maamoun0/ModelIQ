// import { INITIAL_MODELS } from './constants'; // No longer needed, using passed models list
import { FilterState, AIModel } from '@/types';

export function getProviders(models: AIModel[]): string[] {
  return [...new Set(models.map(m => m.provider))];
}

export function filterModels(filters: FilterState, models: AIModel[]): AIModel[] {
  let result = [...models];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.provider.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter(m => m.categories.some(c => c.id === filters.category));
  }

  if (filters.provider && filters.provider !== 'all') {
    result = result.filter(m => m.provider === filters.provider);
  }

  if (filters.pricingType && filters.pricingType !== 'all') {
    result = result.filter(m => m.pricing?.pricing_type === filters.pricingType);
  }

  if (filters.modelType && filters.modelType !== 'all') {
    result = result.filter(m => m.type === filters.modelType);
  }

  return result;
}

export function formatContext(tokens: number): string {
  if (tokens === 0) return 'N/A';
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(0)}M`;
  return `${(tokens / 1000).toFixed(0)}K`;
}

export function formatPrice(price?: number): string {
  if (price === undefined) return 'N/A';
  if (price === 0) return 'Free';
  return `$${(price || 0).toFixed(2)}/1M`;
}
