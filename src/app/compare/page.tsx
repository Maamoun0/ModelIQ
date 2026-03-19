'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { modelService } from '@/services/model-service';
import { generateVerdict } from '@/lib/scoring';
import { formatContext, formatPrice } from '@/lib/utils';
import { GitCompareArrows, ChevronDown, Trophy, DollarSign, Zap, Star, Check, AlertTriangle } from 'lucide-react';
import { Metrics, AIModel } from '@/types';

function CompareContent() {
  const searchParams = useSearchParams();
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [modelAId, setModelAId] = useState('');
  const [modelBId, setModelBId] = useState('');

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const m = await modelService.getAllModels();
        setModels(m);
        
        const preselected = searchParams.get('models')?.split(',') || [];
        if (preselected[0]) setModelAId(preselected[0]);
        if (preselected[1]) setModelBId(preselected[1]);
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  const modelA = useMemo(() => models.find(m => m.id === modelAId), [models, modelAId]);
  const modelB = useMemo(() => models.find(m => m.id === modelBId), [models, modelBId]);

  const verdict = useMemo(() => {
    if (modelA && modelB) return generateVerdict(modelA, modelB);
    return '';
  }, [modelA, modelB]);

  const metricKeys: { key: keyof Omit<Metrics, 'id' | 'model_id' | 'created_at'>; label: string }[] = [
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'coding', label: 'Coding' },
    { key: 'speed', label: 'Speed' },
    { key: 'latency', label: 'Latency' },
    { key: 'creative_writing', label: 'Creative Writing' },
    { key: 'context_utilization', label: 'Context Use' },
  ];

  if (!mounted) return <div style={{ minHeight: '80vh' }} />;

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Loading Comparison Platform...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>
          <GitCompareArrows size={28} style={{ display: 'inline', marginRight: 10, verticalAlign: 'middle' }} />
          Compare Models
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>
          Select two models to compare side-by-side
        </p>
      </div>

      {/* Model Selectors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: '16px',
        alignItems: 'center',
        marginBottom: '32px',
        maxWidth: 700,
        margin: '0 auto 40px',
      }}>
        <ModelSelector label="Model A" value={modelAId} onChange={setModelAId} excludeId={modelBId} models={models} />
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(79, 70, 229, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#818CF8' }}>VS</span>
        </div>
        <ModelSelector label="Model B" value={modelBId} onChange={setModelBId} excludeId={modelAId} models={models} />
      </div>

      {/* Comparison Results */}
      <div style={{ display: modelA && modelB ? 'block' : 'none' }}>
        <div className="animate-fade-in-up">
          {/* Verdict Box */}
          {verdict && (
            <div className="glass-card" style={{
              padding: '24px',
              marginBottom: '24px',
              textAlign: 'center',
              background: 'rgba(79, 70, 229, 0.06)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
            }}>
              <Trophy size={24} style={{ color: '#F59E0B', marginBottom: 8 }} />
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                {verdict}
              </p>
            </div>
          )}

          {/* Comparison Table */}
          {modelA && modelB && (
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 1fr',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Metric</div>
                <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center' }}>{modelA.name}</div>
                <div style={{ padding: '16px 20px', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center' }}>{modelB.name}</div>
              </div>

              <CompareRow label="Overall Score" valueA={(modelA.overall_score || 0).toFixed(1)} valueB={(modelB.overall_score || 0).toFixed(1)} numA={modelA.overall_score || 0} numB={modelB.overall_score || 0} icon={<Star size={14} fill="#F59E0B" color="#F59E0B" />} />

              {metricKeys.map(({ key, label }) => {
                const valA = modelA.metrics?.[key] as number || 0;
                const valB = modelB.metrics?.[key] as number || 0;
                return (
                  <CompareRow key={key} label={label} valueA={(valA || 0).toFixed(1)} valueB={(valB || 0).toFixed(1)} numA={valA || 0} numB={valB || 0} />
                );
              })}

              <CompareRow label="Context Window" valueA={formatContext(modelA.context_window)} valueB={formatContext(modelB.context_window)} numA={modelA.context_window} numB={modelB.context_window} />
              <CompareRow label="Input Cost" valueA={formatPrice(modelA.pricing?.input_price_per_1m_tokens)} valueB={formatPrice(modelB.pricing?.input_price_per_1m_tokens)} numA={-(modelA.pricing?.input_price_per_1m_tokens || 0)} numB={-(modelB.pricing?.input_price_per_1m_tokens || 0)} icon={<DollarSign size={14} color="#10B981" />} />
              <CompareRow label="Output Cost" valueA={formatPrice(modelA.pricing?.output_price_per_1m_tokens)} valueB={formatPrice(modelB.pricing?.output_price_per_1m_tokens)} numA={-(modelA.pricing?.output_price_per_1m_tokens || 0)} numB={-(modelB.pricing?.output_price_per_1m_tokens || 0)} icon={<DollarSign size={14} color="#10B981" />} />
              <CompareRow label="API Available" valueA={modelA.api_available ? '✅ Yes' : '❌ No'} valueB={modelB.api_available ? '✅ Yes' : '❌ No'} icon={<Zap size={14} color="#06B6D4" />} />
            </div>
          )}

          {/* Strengths/Weaknesses */}
          {modelA && modelB && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[modelA, modelB].map((model) => (
                <div key={model.id} className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>{model.name}</h3>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Strengths</div>
                    {model.features.filter(f => f.type === 'strength').map(f => (
                      <div key={f.id} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
                        <Check size={14} style={{ color: '#34D399', flexShrink: 0, marginTop: 2 }} /> {f.content}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Weaknesses</div>
                    {model.features.filter(f => f.type === 'weakness').map(f => (
                      <div key={f.id} style={{ display: 'flex', gap: 8, fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>
                        <AlertTriangle size={14} style={{ color: '#FBBF24', flexShrink: 0, marginTop: 2 }} /> {f.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      <div style={{ display: modelA && modelB ? 'none' : 'block', textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
        <GitCompareArrows size={56} style={{ opacity: 0.2, marginBottom: 16, margin: '0 auto' }} />
        <p style={{ fontSize: '1.1rem' }}>Select two models above to start comparing</p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <CompareContent />
    </Suspense>
  );
}

function ModelSelector({ label, value, onChange, excludeId, models }: { label: string; value: string; onChange: (v: string) => void; excludeId: string; models: AIModel[]; }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px', color: 'var(--color-text-primary)', fontSize: '0.95rem', fontWeight: 600, outline: 'none', cursor: 'pointer', appearance: 'none' }}>
          <option value="">Choose a model...</option>
          {models.filter((m: AIModel) => m.id !== excludeId).map((m: AIModel) => (
            <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>
          ))}
        </select>
        <ChevronDown size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

function CompareRow({ label, valueA, valueB, numA, numB, icon }: { label: string; valueA: string; valueB: string; numA?: number; numB?: number; icon?: React.ReactNode; }) {
  const aWins = numA !== undefined && numB !== undefined && numA > numB;
  const bWins = numA !== undefined && numB !== undefined && numB > numA;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>{icon} {label}</div>
      <div style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: aWins ? '#34D399' : 'var(--color-text-primary)', background: aWins ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>{valueA} {aWins && '👑'}</div>
      <div style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: bWins ? '#34D399' : 'var(--color-text-primary)', background: bWins ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>{valueB} {bWins && '👑'}</div>
    </div>
  );
}
