'use client';

import Link from 'next/link';
import { AIModel } from '@/types';
import { Star, GitCompareArrows, Zap, ExternalLink } from 'lucide-react';

interface ModelCardProps {
  model: AIModel;
  onCompare?: (model: AIModel) => void;
  rank?: number;
}

function getProviderColorClass(provider: string): string {
  const map: Record<string, string> = {
    'OpenAI': 'provider-openai',
    'Anthropic': 'provider-anthropic',
    'Google': 'provider-google',
    'Meta': 'provider-meta',
    'DeepSeek': 'provider-deepseek',
    'Mistral': 'provider-mistral',
    'xAI': 'provider-xai',
    'Midjourney': 'provider-midjourney',
  };
  return map[provider] || '';
}

export default function ModelCard({ model, onCompare, rank }: ModelCardProps) {
  const topCategory = model.categories[0];
  const priceLabel = model.pricing?.pricing_type === 'free' 
    ? 'Free' 
    : model.pricing 
      ? `$${(model.pricing.input_price_per_1m_tokens || 0).toFixed(2)}/1M in` 
      : 'N/A';

  return (
    <div className="glass-card" style={{
      padding: '24px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      cursor: 'pointer',
    }}>
      {/* Rank Badge */}
      {rank && rank <= 3 && (
        <div style={{
          position: 'absolute',
          top: -8,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: rank === 1 ? 'linear-gradient(135deg, #F59E0B, #EF4444)' 
            : rank === 2 ? 'linear-gradient(135deg, #94A3B8, #CBD5E1)' 
            : 'linear-gradient(135deg, #B45309, #F59E0B)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {rank}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link href={`/models/${model.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              marginBottom: '4px',
              fontFamily: "'Outfit', sans-serif",
              transition: 'color 0.2s',
            }}>
              {model.name}
            </h3>
          </Link>
          <span className={getProviderColorClass(model.provider)} style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            {model.provider}
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(245, 158, 11, 0.1)',
          padding: '4px 10px',
          borderRadius: 999,
        }}>
          <Star size={13} fill="#F59E0B" color="#F59E0B" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FBBF24' }}>
            {(model.rating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p style={{
        color: 'var(--color-text-secondary)',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {model.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {topCategory && (
          <span className="badge badge-primary">
            {topCategory.name}
          </span>
        )}
        <span className={`badge ${model.pricing?.pricing_type === 'free' ? 'badge-success' : 'badge-warning'}`}>
          {priceLabel}
        </span>
        {model.api_available && (
          <span className="badge badge-success" style={{ gap: '3px' }}>
            <Zap size={10} /> API
          </span>
        )}
      </div>

      {/* Metrics Mini Bar */}
      {model.metrics && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', minWidth: 45 }}>
            Score
          </span>
          <div className="metric-bar-track" style={{ flex: 1 }}>
            <div className="metric-bar-fill" style={{ width: `${((model.overall_score || 0) / 5) * 100}%` }} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {(model.overall_score || 0).toFixed(1)}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
        <Link href={`/models/${model.id}`} style={{ flex: 1, textDecoration: 'none' }}>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}>
            <ExternalLink size={14} /> Details
          </button>
        </Link>
        {onCompare && (
          <button 
            className="btn-primary" 
            style={{ fontSize: '0.82rem' }}
            onClick={(e) => {
              e.stopPropagation();
              onCompare(model);
            }}
          >
            <GitCompareArrows size={14} /> Compare
          </button>
        )}
      </div>
    </div>
  );
}
