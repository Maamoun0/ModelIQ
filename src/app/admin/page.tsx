'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, Bot, Trash2, ShieldCheck, Plus, X } from 'lucide-react';
import { modelService } from '@/services/model-service';
import { Category, AIModel, ModelFeature } from '@/types';

export default function AdminPage() {
  const [modelName, setModelName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    provider: '',
    type: 'text' as AIModel['type'],
    description: '',
    api_available: true,
    website_url: '',
    rating: 0,
    context_window: 0,
    strengths: [''],
    weaknesses: [''],
    metrics: {
      reasoning: 0,
      coding: 0,
      speed: 0,
      latency: 0,
      creative_writing: 0,
      context_utilization: 0,
    },
    pricing: {
      input_price: 0,
      output_price: 0,
      pricing_type: 'paid' as 'free' | 'paid',
      notes: ''
    }
  });

  useEffect(() => {
    async function fetchCats() {
      const cats = await modelService.getAllCategories();
      setCategories(cats);
    }
    fetchCats();
  }, []);

  const generateWithAI = async () => {
    if (!modelName) return alert('Please enter a model name first.');
    
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          description: data.description || prev.description,
          provider: data.provider || prev.provider,
          type: data.type || prev.type,
          strengths: data.strengths || prev.strengths,
          weaknesses: data.weaknesses || prev.weaknesses,
          metrics: {
            reasoning: parseFloat(data.metrics?.reasoning) || prev.metrics.reasoning,
            coding: parseFloat(data.metrics?.coding) || prev.metrics.coding,
            speed: parseFloat(data.metrics?.speed) || prev.metrics.speed,
            latency: parseFloat(data.metrics?.latency) || prev.metrics.latency,
            creative_writing: parseFloat(data.metrics?.creative_writing) || prev.metrics.creative_writing,
            context_utilization: parseFloat(data.metrics?.context_utilization) || prev.metrics.context_utilization,
          }
        }));
      } else {
        setError(data.error || 'Failed to generate AI suggestion');
      }
    } catch (_err) {
      setError('Error connecting to AI suggestion API.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const strengths: ModelFeature[] = formData.strengths.filter(s => s.trim()).map(s => ({ id: '', model_id: '', type: 'strength', content: s, created_at: '' }));
      const weaknesses: ModelFeature[] = formData.weaknesses.filter(w => w.trim()).map(w => ({ id: '', model_id: '', type: 'weakness', content: w, created_at: '' }));
      
      const overall_score = (
        formData.metrics.reasoning + 
        formData.metrics.coding + 
        formData.metrics.speed + 
        formData.metrics.latency + 
        formData.metrics.creative_writing + 
        formData.metrics.context_utilization
      ) / 6.0;

      const modelData: Partial<AIModel> = {
        name: modelName,
        provider: formData.provider,
        description: formData.description,
        type: formData.type,
        api_available: formData.api_available,
        website_url: formData.website_url,
        rating: formData.rating,
        context_window: formData.context_window,
        overall_score: parseFloat(overall_score.toFixed(2)),
        features: [...strengths, ...weaknesses],
        pricing: {
          id: '',
          model_id: '',
          input_price_per_1m_tokens: formData.pricing.input_price,
          output_price_per_1m_tokens: formData.pricing.output_price,
          pricing_type: formData.pricing.pricing_type,
          notes: formData.pricing.notes,
          created_at: ''
        },
        metrics: {
          id: '',
          model_id: '',
          ...formData.metrics,
          created_at: ''
        }
      };

      await modelService.addModel(modelData, selectedCategoryIds);
      
      setSuccess(true);
      // Reset after success
      setTimeout(() => {
        setSuccess(false);
        setModelName('');
        setFormData({
          provider: '',
          type: 'text',
          description: '',
          api_available: true,
          website_url: '',
          rating: 0,
          context_window: 0,
          strengths: [''],
          weaknesses: [''],
          metrics: {
            reasoning: 0, coding: 0, speed: 0, latency: 0, creative_writing: 0, context_utilization: 0,
          },
          pricing: {
            input_price: 0, output_price: 0, pricing_type: 'paid', notes: ''
          }
        });
        setSelectedCategoryIds([]);
      }, 3000);
    } catch (err: any) {
      setError(err?.message || 'Error saving model to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleMetricChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [key]: parseFloat(value) || 0
      }
    }));
  };

  const manageList = (listName: 'strengths' | 'weaknesses', action: 'add' | 'remove' | 'edit', index?: number, value?: string) => {
    setFormData(prev => {
      const newList = [...prev[listName]];
      if (action === 'add') {
        newList.push('');
      } else if (action === 'remove' && index !== undefined) {
        newList.splice(index, 1);
      } else if (value !== undefined && index !== undefined) {
        newList[index] = value;
      }
      return { ...prev, [listName]: newList };
    });
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="section-container" style={{ padding: '40px 24px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <ShieldCheck size={32} style={{ color: '#06B6D4' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Add new AI models using AI assistance</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        {/* Step 1: AI Assist */}
        <div style={{
          background: 'rgba(79, 70, 229, 0.08)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          alignItems: 'end',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <label style={labelStyle}>Model Name</label>
            <input
              type="text"
              placeholder="e.g., Llama 4 70B"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="input-search"
              style={inputStyle}
            />
          </div>
          <button 
            type="button" 
            onClick={generateWithAI}
            disabled={loading || !modelName}
            className="btn-primary" 
            style={{ 
              height: 48, 
              background: loading ? 'var(--color-bg-card-hover)' : 'var(--gradient-primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <>⏳ Generating...</>
            ) : (
              <><Bot size={18} /> Auto-Fill Data</>
            )}
          </button>
        </div>

        {error && (
          <div style={{ padding: 16, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 8, marginBottom: 24, color: '#F87171', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Step 2: Form */}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Provider</label>
              <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="input-search" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="input-search" style={inputStyle}>
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="multimodal">Multimodal</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Categories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => toggleCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedCategoryIds.includes(cat.id) ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid',
                    borderColor: selectedCategoryIds.includes(cat.id) ? '#818CF8' : 'var(--color-border)',
                    color: selectedCategoryIds.includes(cat.id) ? '#818CF8' : 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="input-search" 
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} 
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value) || 0})} className="input-search" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Context Window</label>
              <input type="number" value={formData.context_window} onChange={e => setFormData({...formData, context_window: parseInt(e.target.value) || 0})} className="input-search" style={inputStyle} required />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '32px 0 16px', fontFamily: "'Outfit', sans-serif" }}>Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {Object.entries(formData.metrics).map(([key, value]) => (
              <div key={key}>
                <label style={{...labelStyle, textTransform: 'capitalize'}}>{key.replace('_', ' ')}</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0" max="5" 
                  value={value} 
                  onChange={e => handleMetricChange(key, e.target.value)} 
                  className="input-search" 
                  style={inputStyle} 
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            {/* Strengths */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', fontFamily: "'Outfit', sans-serif", color: '#34D399' }}>Strengths</h3>
              {formData.strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={s} onChange={e => manageList('strengths', 'edit', i, e.target.value)} className="input-search" style={inputStyle} />
                  <button type="button" onClick={() => manageList('strengths', 'remove', i)} style={iconBtnStyle}><Trash2 size={16} color="#Ef4444" /></button>
                </div>
              ))}
              <button type="button" onClick={() => manageList('strengths', 'add')} style={textBtnStyle}><Plus size={14} /> Add Strength</button>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', fontFamily: "'Outfit', sans-serif", color: '#FBBF24' }}>Weaknesses</h3>
              {formData.weaknesses.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input type="text" value={w} onChange={e => manageList('weaknesses', 'edit', i, e.target.value)} className="input-search" style={inputStyle} />
                  <button type="button" onClick={() => manageList('weaknesses', 'remove', i)} style={iconBtnStyle}><Trash2 size={16} color="#Ef4444" /></button>
                </div>
              ))}
              <button type="button" onClick={() => manageList('weaknesses', 'add')} style={textBtnStyle}><Plus size={14} /> Add Weakness</button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '32px 0' }} />

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
            {success && <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={18} /> Model Saved to Database</span>}
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '12px 32px', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>
              {saving ? '⏳ Saving...' : <><Save size={18} /> Save Model to Platform</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.03)',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'rgba(239, 68, 68, 0.1)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  width: 44,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

const textBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#818CF8',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 8,
  display: 'flex',
  alignItems: 'center',
  gap: 4
};
