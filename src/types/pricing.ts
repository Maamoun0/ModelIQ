export interface Pricing {
  id: string;
  model_id: string;
  input_price_per_1m_tokens: number;
  output_price_per_1m_tokens: number;
  pricing_type: 'free' | 'paid';
  notes: string;
  created_at: string;
}
