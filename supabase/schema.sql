-- ==========================================
-- AI Models Intelligence Platform - Supabase Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Models Table
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('text', 'image', 'video', 'audio', 'multimodal')) NOT NULL,
  api_available BOOLEAN DEFAULT false,
  website_url TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5.0),
  context_window INTEGER DEFAULT 0,
  overall_score DECIMAL(3,2) DEFAULT 0.00,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Model Categories (Many-to-Many)
CREATE TABLE model_categories (
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (model_id, category_id)
);

-- 4. Model Features (Strengths / Weaknesses)
CREATE TABLE model_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('strength', 'weakness')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Pricing Table
CREATE TABLE pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID UNIQUE REFERENCES models(id) ON DELETE CASCADE,
  input_price_per_1m_tokens DECIMAL(10,4) DEFAULT 0,
  output_price_per_1m_tokens DECIMAL(10,4) DEFAULT 0,
  pricing_type VARCHAR(50) CHECK (pricing_type IN ('free', 'paid')) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Metrics Table
CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID UNIQUE REFERENCES models(id) ON DELETE CASCADE,
  reasoning DECIMAL(3,1) CHECK (reasoning >= 0 AND reasoning <= 5.0) DEFAULT 0,
  coding DECIMAL(3,1) CHECK (coding >= 0 AND coding <= 5.0) DEFAULT 0,
  speed DECIMAL(3,1) CHECK (speed >= 0 AND speed <= 5.0) DEFAULT 0,
  latency DECIMAL(3,1) CHECK (latency >= 0 AND latency <= 5.0) DEFAULT 0,
  creative_writing DECIMAL(3,1) CHECK (creative_writing >= 0 AND creative_writing <= 5.0) DEFAULT 0,
  context_utilization DECIMAL(3,1) CHECK (context_utilization >= 0 AND context_utilization <= 5.0) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Function to calculate overall score from metrics
CREATE OR REPLACE FUNCTION update_model_overall_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE models
  SET overall_score = (
    SELECT (reasoning + coding + speed + latency + creative_writing + context_utilization) / 6.0
    FROM metrics
    WHERE model_id = NEW.model_id
  )
  WHERE id = NEW.model_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger to auto-update score when metrics change
CREATE TRIGGER trigger_update_overall_score
AFTER INSERT OR UPDATE ON metrics
FOR EACH ROW
EXECUTE FUNCTION update_model_overall_score();

-- ==========================================
-- Example RLS (Row Level Security) Policies
-- ==========================================
-- 1. Enable RLS
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- 2. Allow public read access
CREATE POLICY "Allow public read access to models" ON models FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to model_categories" ON model_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to model_features" ON model_features FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pricing" ON pricing FOR SELECT USING (true);
CREATE POLICY "Allow public read access to metrics" ON metrics FOR SELECT USING (true);

-- 3. Restrict write access to authenticated users (Admins)
-- Example: CREATE POLICY "Allow admin write" ON models FOR ALL USING (auth.role() = 'authenticated');
