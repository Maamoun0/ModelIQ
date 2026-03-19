'use client';

import { Metrics } from '@/types';

interface ModelMetricsProps {
  metrics: Metrics;
  size?: 'sm' | 'md' | 'lg';
}

const metricLabels: { key: keyof Omit<Metrics, 'id' | 'model_id'>; label: string; color: string }[] = [
  { key: 'reasoning', label: 'Reasoning', color: '#8B5CF6' },
  { key: 'coding', label: 'Coding', color: '#4F46E5' },
  { key: 'speed', label: 'Speed', color: '#06B6D4' },
  { key: 'latency', label: 'Latency', color: '#10B981' },
  { key: 'creative_writing', label: 'Creative Writing', color: '#F59E0B' },
  { key: 'context_utilization', label: 'Context Use', color: '#EF4444' },
];

export default function ModelMetrics({ metrics, size = 'md' }: ModelMetricsProps) {
  const barHeight = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const fontSize = size === 'sm' ? '0.72rem' : size === 'lg' ? '0.9rem' : '0.82rem';
  const gap = size === 'sm' ? '8px' : '12px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {metricLabels.map(({ key, label, color }) => {
        const value = (metrics[key] as number) || 0;
        const percentage = (value / 5) * 100;

        return (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize,
              color: 'var(--color-text-secondary)',
              minWidth: size === 'sm' ? 80 : 120,
              fontWeight: 500,
            }}>
              {label}
            </span>
            <div style={{
              flex: 1,
              height: barHeight,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: barHeight / 2,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                borderRadius: barHeight / 2,
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
            <span style={{
              fontSize,
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              minWidth: 28,
              textAlign: 'right',
            }}>
              {value.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
