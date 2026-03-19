'use client';

import { useState, useMemo, useEffect } from 'react';
import ModelCard from '@/components/models/ModelCard';
import { modelService } from '@/services/model-service';
import { filterModels } from '@/lib/utils';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AIModel, Category } from '@/types';

export default function ModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<AIModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [provider, setProvider] = useState('all');
  const [pricingType, setPricingType] = useState('all');
  const [modelType, setModelType] = useState('all');
  const [showFilters, setShowFilters] = useState(true);

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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const providers = useMemo(() => [...new Set(models.map(m => m.provider))], [models]);
  const filteredModels = useMemo(() => filterModels({ search, category, provider, pricingType, modelType }, models), [search, category, provider, pricingType, modelType, models]);

  if (!mounted) return <div style={{ minHeight: '80vh' }} />;

  if (loading) {
    return (
      <div style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Loading Models Platform...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleCompare = (model: AIModel) => router.push(`/compare?models=${model.id}`);
  const clearFilters = () => { setCategory('all'); setProvider('all'); setPricingType('all'); setModelType('all'); setSearch(''); };
  const activeFiltersCount = [category, provider, pricingType, modelType].filter(f => f !== 'all').length + (search ? 1 : 0);

  return (
    <div className="section-container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Explore AI Models</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>Browse and filter {models.length} AI models across {providers.length} providers</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {showFilters && (
          <aside className="glass-card" style={{ padding: '24px', minWidth: 260, maxWidth: 280, position: 'sticky', top: 96, flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}><SlidersHorizontal size={16} /> Filters</h3>
              {activeFiltersCount > 0 && <button onClick={clearFilters} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Clear ({activeFiltersCount})</button>}
            </div>
            <FilterGroup label="Category"><select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}><option value="all">All Categories</option>{categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></FilterGroup>
            <FilterGroup label="Provider"><select value={provider} onChange={(e) => setProvider(e.target.value)} style={selectStyle}><option value="all">All Providers</option>{providers.map(p => (<option key={p} value={p}>{p}</option>))}</select></FilterGroup>
            <FilterGroup label="Pricing"><select value={pricingType} onChange={(e) => setPricingType(e.target.value)} style={selectStyle}><option value="all">All</option><option value="free">Free</option><option value="paid">Paid</option></select></FilterGroup>
            <FilterGroup label="Model Type"><select value={modelType} onChange={(e) => setModelType(e.target.value)} style={selectStyle}><option value="all">All Types</option><option value="text">Text</option><option value="image">Image</option><option value="video">Video</option><option value="audio">Audio</option></select></FilterGroup>
          </aside>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" placeholder="Search models..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-search" />
          </div>
          <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Showing <strong>{filteredModels.length}</strong> models</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredModels.map((model, i) => (
              <div key={model.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <ModelCard model={model} onCompare={handleCompare} />
              </div>
            ))}
          </div>
          {filteredModels.length === 0 && <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-muted)' }}><Search size={48} style={{ marginBottom: 16, opacity: 0.3, margin: '0 auto' }} /><p>No models found</p></div>}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div style={{ marginBottom: '18px' }}><label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>{children}</div>);
}

const selectStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--color-text-primary)', fontSize: '0.88rem', outline: 'none', cursor: 'pointer' };
