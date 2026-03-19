import { AIModel, Metrics } from '@/types';

export function calculateAverageMetric(metrics: Metrics): number {
  const keys: (keyof Omit<Metrics, 'id' | 'model_id' | 'created_at'>)[] = [
    'reasoning', 'coding', 'speed', 'latency', 'creative_writing', 'context_utilization'
  ];
  const sum = keys.reduce((acc, key) => acc + (metrics[key] || 0), 0);
  return sum / keys.length;
}

export function generateVerdict(modelA: AIModel, modelB: AIModel): string {
  if (!modelA.metrics || !modelB.metrics) return 'Metrics unavailable for comparison.';

  const aScore = modelA.overall_score;
  const bScore = modelB.overall_score;
  const diff = Math.abs(aScore - bScore);

  const winner = aScore >= bScore ? modelA : modelB;
  const loser = aScore >= bScore ? modelB : modelA;

  const winnerMetrics = winner.metrics!;
  const loserMetrics = loser.metrics!;

  const metricNames: (keyof Omit<typeof winnerMetrics, 'id' | 'model_id' | 'created_at'>)[] = [
    'reasoning', 'coding', 'speed', 'latency', 'creative_writing', 'context_utilization'
  ];

  const winnerStrengths = metricNames
    .filter(k => winnerMetrics[k] > loserMetrics[k])
    .slice(0, 2)
    .map(k => String(k).replace('_', ' '));

  const loserStrengths = metricNames
    .filter(k => loserMetrics[k] > winnerMetrics[k])
    .slice(0, 2)
    .map(k => String(k).replace('_', ' '));

  if (diff < 0.2) {
    return `🤝 Very close match! ${winner.name} has a slight edge overall, excelling in ${winnerStrengths.join(' and ') || 'balance'}. ${loser.name} wins on ${loserStrengths.join(' and ') || 'other areas'}. Choose based on your specific needs.`;
  }

  const winnerPriceCheaper = winner.pricing && loser.pricing &&
    (winner.pricing.input_price_per_1m_tokens + winner.pricing.output_price_per_1m_tokens) <
    (loser.pricing.input_price_per_1m_tokens + loser.pricing.output_price_per_1m_tokens);

  if (winnerPriceCheaper) {
    return `🏆 ${winner.name} wins — it leads in ${winnerStrengths.join(' and ') || 'overall score'} AND is more affordable. ${loser.name} could still be preferred for ${loserStrengths.join(' and ') || 'specific tasks'}.`;
  }

  return `🏆 ${winner.name} leads overall, excelling in ${winnerStrengths.join(' and ') || 'multiple areas'}. However, ${loser.name} is stronger in ${loserStrengths.join(' and ') || 'other metrics'}${loser.pricing && winner.pricing && loser.pricing.input_price_per_1m_tokens < winner.pricing.input_price_per_1m_tokens ? ' and is more budget-friendly' : ''}.`;
}
