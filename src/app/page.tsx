'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { modelService } from '@/services/model-service';
import ModelCard from '@/components/models/ModelCard';
import { AIModel, Category } from '@/types';
import { Brain, Code2, PenTool, Image, MessageSquare, FileText, Globe, BarChart3, Calculator, Rocket, ArrowRight, Zap, Target, Search } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code2, PenTool, Brain, Image, MessageSquare, FileText, Globe, BarChart3, Calculator,
};

export default function HomePage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!mounted) return <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />;

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const topModels = [...models].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0)).slice(0, 6);

  return (
    <div className="section-container" style={{ padding: '0 24px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="animate-fade-in" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(79, 70, 229, 0.1)',
          padding: '8px 16px',
          borderRadius: 999,
          color: '#818CF8',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: 24,
        }}>
          <Rocket size={14} /> THE DEFINITIVE AI BENCHMARKING PLATFORM
        </div>
        <h1 className="animate-fade-in-up" style={{ fontSize: 'min(3.5rem, 10vw)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", lineHeight: 1.1, marginBottom: 24 }}>
          Discover the World's most <br/><span className="text-gradient">Intelligent AI Models</span>
        </h1>
        <p className="animate-fade-in-up animate-delay-2" style={{ maxWidth: 800, margin: '0 auto 40px', fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Side-by-side comparisons, deep metrics, and expert analysis for every major LLM. 
          Make data-driven decisions for your AI stack.
        </p>
        <div className="animate-fade-in-up animate-delay-3" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/models">
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Explore Models <ArrowRight size={18} style={{ marginLeft: 6 }} />
            </button>
          </Link>
          <Link href="/compare">
            <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              Start Comparison
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Grid */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 40 }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>🔥 Top Performers</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>The highest-rated models this month</p>
          </div>
          <Link href="/models" style={{ color: '#818CF8', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {topModels.map((m, i) => (
            <div key={m.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <ModelCard model={m} />
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ paddingBottom: 100 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: 32, textAlign: 'center' }}>Explore by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Brain;
            const catModels = models.filter(m => m.categories.some(c => c.id === cat.id)).sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0));
            const bestModel = catModels[0];
            return (
              <Link href={`/categories?cat=${cat.id}`} key={cat.id} className="animate-fade-in-up" style={{ textDecoration: 'none', animationDelay: `${i * 0.05}s` }}>
                <div className="glass-card" style={{ padding: 24, height: '100%', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ padding: 10, background: 'rgba(79, 70, 229, 0.1)', borderRadius: 12 }}><Icon size={24} color="#818CF8" /></div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{cat.name}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>{catModels.length} models ranked</div>
                  {bestModel && (
                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                       <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Leader</div>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{bestModel.name}</div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
