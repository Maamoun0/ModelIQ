export interface ModelFeature {
  id: string;
  model_id: string;
  type: 'strength' | 'weakness';
  content: string;
  created_at: string;
}
