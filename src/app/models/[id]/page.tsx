'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Hash, Calendar, Zap, DollarSign, Brain, ShieldAlert, Award } from 'lucide-react';
import { modelService } from '@/services/model-service';
import ModelMetrics from '@/components/models/ModelMetrics';
import { AIModel } from '@/types';

export default function ModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [model, setModel] = useState<AIModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const data = await modelService.getModelById(id);
        setModel(data || null);
      } catch (err) {
        console.error('Failed to load model:', err);
        setModel(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!mounted) return <div style={{ minHeight: '80vh' }} />;

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(79,70,229,0.2)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="section-container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Model Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 12 }}>The model you are looking for does not exist.</p>
        <Link href="/models">
          <button className="btn-primary" style={{ marginTop: 24 }}><ArrowLeft size={16} /> Back to Models</button>
        </Link>
      </div>
    );
  }

  const strengths = model.features.filter(f => f.type === 'strength');
  const weaknesses = model.features.filter(f => f.type === 'weakness');

  return (
    <div className="section-container" style={{ padding: '40px 24px' }}>
      <Link href="/models" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '24px' }}>
        <ArrowLeft size={14} /> Models Explorer
      </Link>

      {/* Header */}
      <div className="glass-card" style={{ padding: '40px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Brain size={40} color="#818CF8" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>{model.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: 999, background: 'rgba(245,158,11,0.12)' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FBBF24' }}>{(model.rating || 0).toFixed(1)}</span>
              </div>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>by <strong style={{ color: 'var(--color-text-secondary)' }}>{model.provider}</strong></p>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 700, marginTop: 12 }}>{model.description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '40px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          <QuickStat icon={Hash} label="Context Window" value={(model.context_window || 0) > 0 ? `${Math.round((model.context_window || 0) / 1000)}K tokens` : 'N/A'} />
          <QuickStat icon={Award} label="Overall Score" value={`${(model.overall_score || 0).toFixed(1)} / 5.0`} />
          <QuickStat icon={Calendar} label="Last Updated" value={model.last_updated || 'Unknown'} />
          <QuickStat icon={Zap} label="API Available" value={model.api_available ? 'Yes' : 'No'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        {/* Metrics */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', fontFamily: "'Outfit', sans-serif" }}>Capability Breakdown</h2>
          {model.metrics ? <ModelMetrics metrics={model.metrics} size="lg" /> : <p style={{ color: 'var(--color-text-muted)' }}>No metrics available</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pricing */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign size={18} color="#10B981" /> Pricing Analysis
            </h2>
            {model.pricing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <PriceRow label="Input" value={(model.pricing.input_price_per_1m_tokens || 0) === 0 ? 'Free' : `$${(model.pricing.input_price_per_1m_tokens || 0).toFixed(2)} / 1M tokens`} />
                <PriceRow label="Output" value={(model.pricing.output_price_per_1m_tokens || 0) === 0 ? 'Free' : `$${(model.pricing.output_price_per_1m_tokens || 0).toFixed(2)} / 1M tokens`} />
                {model.pricing.notes && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>{model.pricing.notes}</p>}
              </div>
            ) : <p style={{ color: 'var(--color-text-muted)' }}>Pricing data not available</p>}
          </div>

          {/* Features */}
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', fontFamily: "'Outfit', sans-serif" }}>Strengths & Weaknesses</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34D399', textTransform: 'uppercase', marginBottom: '12px' }}>Strengths</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {strengths.map(s => (
                    <li key={s.id} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '8px', display: 'flex', gap: 8 }}>
                      <Zap size={14} color="#34D399" style={{ marginTop: 3, flexShrink: 0 }} /> {s.content}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', marginBottom: '12px' }}>Weaknesses</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {weaknesses.map(w => (
                    <li key={w.id} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: '8px', display: 'flex', gap: 8 }}>
                      <ShieldAlert size={14} color="#FBBF24" style={{ marginTop: 3, flexShrink: 0 }} /> {w.content}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color="var(--color-text-muted)" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '1rem', fontWeight: 700 }}>{value}</div>
      </div>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{value}</span>
    </div>
  );
}
