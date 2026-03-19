# 🧠 AI Models Intelligence Platform: Project Master Blueprint

This document serves as the **Single Source of Truth** for the "Model Explorer" project. It combines the original vision, strategic refinements, and technical execution plan.

---

## 🚀 1. Product Vision
**Mission:** To be the most accurate, transparent, and user-friendly directory for AI Models, helping developers and businesses choose the right model based on cost, performance, and specific use cases.

### Core Value Propositions:
- **Decision Clarity:** Stop the guesswork; know exactly which model is "Best for Coding" or "Best for Budget".
- **Dynamic Accuracy:** AI-assisted data entry to keep metrics fresh and reliable.
- **Deep Comparison:** Beyond just names—pricing per token, reasoning scores, and latency.

---

## 🛠 2. Technical Stack (MVP Pro)
- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Backend:** Next.js API Routes + Server Actions
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (for Admin/Future User Profiles)
- **State Management:** React Context / TanStack Query

---

## 🗄 3. Database Schema (Refined)

### `models`
- `id` (UUID, PK)
- `name` (String)
- `provider` (String) - e.g., OpenAI, Anthropic, Meta
- `description` (Text)
- `type` (Enum) - text, image, video, audio
- `api_available` (Boolean)
- `website_url` (URL)
- `rating` (Float)
- `context_window` (Int)
- `overall_score` (Float) - Computed from metrics
- `last_updated` (Timestamp) - **[Added]** Essential for freshness
- `created_at` (Timestamp)

### `categories`
- `id` (UUID, PK)
- `name` (String) - Writing, Coding, Image Generation, etc.
- `icon` (String) - Lucide icon name

### `model_categories` (Link table)
- `model_id`, `category_id`

### `model_features`
- `id`, `model_id`
- `type` (Strength / Weakness)
- `content` (String)

### `pricing` (High Precision)
- `id`, `model_id`
- `input_price_per_1m_tokens` (Float) - Standardized unit
- `output_price_per_1m_tokens` (Float)
- `pricing_type` (Free / Paid)
- `notes` (String)

### `metrics` (The Intelligence Layer)
- `id`, `model_id`
- `reasoning` (1-5)
- `coding` (1-5)
- `speed` (1-5)
- `latency` (1-5)
- `creative_writing` (1-5)
- `context_utilization` (1-5)

---

## ✨ 4. Core Features & Refinements

### A. Model Explorer & Filters
- **Smart Search:** Name, Provider, and Description indexing (Postgres FTS).
- **Advanced Filters:** Filter by Tier (Pro/Open Source), Pricing (Free/Paid), and Modality.

### B. Comparison Tool
- **Side-by-Side:** Select 2-3 models to compare metrics visually with ghost-bars.
- **The "Verdict" [Added]:** A summary box explaining the winner for specific scenarios (e.g., "Use Model A if speed is priority, Model B for logic").

### C. Best Models & Rankings
- **Top 3 per Category:** Visual ranking badges (Gold, Silver, Bronze).
- **Calculated Best:** "Best for [Category]" label based on the highest `overall_score` in that category.

### D. AI-Assisted Admin Panel
- **Validation Flow:** Admin inputs model name -> System fetches/suggests description, strengths, and initial metrics -> Admin reviews & saves.

### E. Community Signals [Added]
- **Helpfulness/Accuracy Rating:** Users can upvote if a metric feels accurate, providing a "Community Trust Score".

---

## 🎨 5. UI/UX Design System
- **Theme:** Dark Mode by default (`#0F172A`).
- **Accents:** Modern Gradients (`#4F46E5` Indigo to `#06B6D4` Cyan).
- **Typography:** Inter / Outfit for a premium SaaS feel.
- **Component Style:** Glassmorphism, subtle borders, high contrast for data tables.

---

## 🗺 6. Implementation Roadmap (The 4 Sprints)

### Sprint 1: Foundation (Days 1-2)
- [ ] Initialize Next.js 14 project.
- [ ] Set up Supabase Project & Database Tables.
- [ ] Create the Layout (Navbar/Footer).
- [ ] Seed database with initial 10-15 models.

### Sprint 2: The Explorer (Days 3-4)
- [ ] Build Model Grid & Search.
- [ ] Implement Sidebar Filters.
- [ ] Build the "Model Card" component.

### Sprint 3: Details & Comparison (Days 5-6)
- [ ] Develop the Model Details Page (Dynamic Routes).
- [ ] Implement the Pricing Table & Metrics visualization.
- [ ] Create the Comparison logic and UI.

### Sprint 4: Rankings & AI Admin (Days 7-8)
- [ ] Build the Ranking System (Top 3 pages).
- [ ] Develop the Admin Input Tool with AI suggestions.
- [ ] Final Polishing & Responsive check.

---

## 📈 7. SEO & Growth Strategy
- **VS Pages:** Automatically generated slugs `/compare/gpt-4o-vs-claude-3-5`.
- **Category Landers:** `/best-ai-models-for-coding`.
- **Newsletter:** Integration for "Model Price Alerts" or "New Ranking Monthly".

---

## 🔮 8. Future Roadmap
- **Live Playground:** Test prompts across 3 models simultaneously.
- **Enterprise Benchmarks:** Specialized tests for private datasets.
- **Provider API:** External developers can query our "Best Model" via API.
