import { supabase } from '@/lib/supabaseClient';
import { INITIAL_MODELS, CATEGORIES } from '@/lib/constants';
import { AIModel, Category } from '@/types';

/**
 * Model Service
 * Handles data fetching for models and categories.
 * Tries to fetch from Supabase, fallbacks to local constants if Supabase is not configured.
 */
export const modelService = {
  // Models
  async getAllModels(): Promise<AIModel[]> {
    try {
      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          categories:model_categories(category:categories(*)),
          features:model_features(*),
          pricing:pricing(*),
          metrics:metrics(*)
        `);

      if (error || !data) throw error;

      // Transform data to match AIModel interface (Supabase returns nested objects for joins)
      return data.map(m => this.transformModel(m));
    } catch (_error) {
      console.warn('Falling back to local models data.');
      return INITIAL_MODELS;
    }
  },

  async getModelById(id: string): Promise<AIModel | undefined> {
    try {
      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          categories:model_categories(category:categories(*)),
          features:model_features(*),
          pricing:pricing(*),
          metrics:metrics(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) throw error;
      return this.transformModel(data);
    } catch (_error) {
      return INITIAL_MODELS.find(m => m.id === id);
    }
  },

  async getModelsByCategory(categoryId: string): Promise<AIModel[]> {
    const all = await this.getAllModels();
    return all.filter(m => m.categories.some(c => c.id === categoryId));
  },

  async getTopModelsByCategory(categoryId: string, limit: number = 3): Promise<AIModel[]> {
    const filtered = await this.getModelsByCategory(categoryId);
    return filtered
      .sort((a, b) => b.overall_score - a.overall_score)
      .slice(0, limit);
  },

  async getBestModelForCategory(categoryId: string): Promise<AIModel | undefined> {
    const top = await this.getTopModelsByCategory(categoryId, 1);
    return top[0];
  },

  // Categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (error || !data) throw error;
      return data;
    } catch (_error) {
      return CATEGORIES;
    }
  },

  async getCategoryById(id: string): Promise<Category | undefined> {
    const categories = await this.getAllCategories();
    return categories.find(c => c.id === id);
  },

  // Admin Operations
  async addModel(modelData: Partial<AIModel>, categoryIds: string[]): Promise<void> {
    try {
      // 1. Insert Model
      const { data: model, error: modelErr } = await supabase
        .from('models')
        .insert([{
          name: modelData.name,
          provider: modelData.provider,
          description: modelData.description,
          type: modelData.type,
          api_available: modelData.api_available,
          website_url: modelData.website_url,
          rating: modelData.rating,
          context_window: modelData.context_window,
          overall_score: modelData.overall_score
        }])
        .select()
        .single();

      if (modelErr || !model) throw modelErr;

      // 2. Insert Categories
      if (categoryIds.length > 0) {
        const catInserts = categoryIds.map(cid => ({ model_id: model.id, category_id: cid }));
        await supabase.from('model_categories').insert(catInserts);
      }

      // 3. Insert Features
      if (modelData.features && modelData.features.length > 0) {
        const featureInserts = modelData.features.map(f => ({
          model_id: model.id,
          type: f.type,
          content: f.content
        }));
        await supabase.from('model_features').insert(featureInserts);
      }

      // 4. Insert Pricing
      if (modelData.pricing) {
        await supabase.from('pricing').insert([{
          model_id: model.id,
          input_price_per_1m_tokens: modelData.pricing.input_price_per_1m_tokens,
          output_price_per_1m_tokens: modelData.pricing.output_price_per_1m_tokens,
          pricing_type: modelData.pricing.pricing_type,
          notes: modelData.pricing.notes
        }]);
      }

      // 5. Insert Metrics
      if (modelData.metrics) {
        await supabase.from('metrics').insert([{
          model_id: model.id,
          reasoning: modelData.metrics.reasoning,
          coding: modelData.metrics.coding,
          speed: modelData.metrics.speed,
          latency: modelData.metrics.latency,
          creative_writing: modelData.metrics.creative_writing,
          context_utilization: modelData.metrics.context_utilization
        }]);
      }
    } catch (err) {
      console.error('Error adding model:', err);
      throw err;
    }
  },

  async deleteModel(id: string): Promise<void> {
    const { error } = await supabase.from('models').delete().eq('id', id);
    if (error) throw error;
  },

  // Helper: Transform Supabase response to AIModel structure
  transformModel(data: any): AIModel {
    return {
      ...data,
      categories: data.categories?.map((c: any) => c.category) || [],
      features: data.features || [],
      pricing: data.pricing?.[0] || null, // Assuming one-to-one or taking first
      metrics: data.metrics?.[0] || null,
    };
  }
};
