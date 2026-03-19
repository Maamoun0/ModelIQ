export interface Metrics {
  id: string;
  model_id: string;
  reasoning: number;
  coding: number;
  speed: number;
  latency: number;
  creative_writing: number;
  context_utilization: number;
  created_at: string;
}
