'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { modelService } from '@/services/model-service';
import ModelCard from '@/components/models/ModelCard';
import { AIModel, Category } from '@/types';
import { Brain, Code2, PenTool, Image, MessageSquare, FileText, Globe, BarChart3, Calculator, Trophy } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code2, PenTool, Brain, Image, MessageSquare, FileText, Globe, BarChart3, Calculator,
};

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [activeCat, setActiveCat] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [m, c] = await Promise.all([
          modelService.getAllModels(),
          modelService.getAllCategories()
        ]);
        setModels(m);
        setCategories(c);
        
        const catFromUrl = searchParams.get('cat');
        setActiveCat(catFromUrl || c[0]?.id || '');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  const category = categories.find(c => c.id === activeCat);
  const topModels = models
    .filter(m => m.categories.some(c => c.id === activeCat))
    .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
    .slice(0, 10);

  const handleCompare = (model: AIModel) => {
    router.push(`/compare?models=${model.id}`);
  };

  if (!mounted) return <div style={{ minHeight: '80vh' }} />;

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: '8px' }}>📂 Categories</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Explore top-ranked AI models in each category</p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map(cat => {
          const Icon = iconMap[cat.icon] || Brain;
          const isActive = cat.id === activeCat;
          return (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: 'var(--radius-md)', border: isActive ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid var(--color-border)', background: isActive ? 'rgba(79, 70, 229, 0.15)' : 'transparent', color: isActive ? '#fff' : 'var(--color-text-secondary)', fontWeight: isActive ? 600 : 500, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <Icon size={16} /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Selected Content */}
      <div style={{ display: category ? 'block' : 'none' }}>
        {category && (
          <div>
            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(79, 70, 229, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {(() => { const Icon = iconMap[category.icon] || Brain; return <Icon size={28} style={{ color: '#818CF8' }} />; })()}
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: "'Outfit', sans-serif" }}>{category.name}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{topModels.length} models ranked in this category</p>
              </div>
            </div>

            {/* Podium */}
            {topModels.length >= 3 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {topModels.slice(0, 3).map((model, i) => (
                  <div key={model.id} className="glass-card animate-fade-in-up" style={{ padding: '24px', textAlign: 'center', border: i === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : undefined }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif", marginBottom: '4px' }}>{model.name}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '8px' }}>{model.provider}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 14px', borderRadius: 999, background: i === 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(79, 70, 229, 0.1)', fontSize: '0.85rem', fontWeight: 700, color: i === 0 ? '#FBBF24' : '#818CF8' }}>
                      <Trophy size={13} /> {(model.overall_score || 0).toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif", marginBottom: '16px' }}>All Models</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {topModels.map((model, i) => (
                <div key={model.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ModelCard model={model} onCompare={handleCompare} rank={i + 1} />
                </div>
              ))}
            </div>
            {topModels.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>No models found in this category</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh' }} />}>
      <CategoriesContent />
    </Suspense>
  );
}
