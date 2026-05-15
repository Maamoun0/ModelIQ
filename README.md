# 🧠 ModelIQ: The LLM Intelligence Hub
### Deciphering the landscape of Large Language Models.

**Project Lead:** Ahmed Maamoun

---

## 🔬 Personal Insight
The AI space moves so fast it's almost impossible to keep track of which model is best for what task. I built **ModelIQ** as a personal tool that grew into a full platform. My goal was simple: stop the hype and look at the **numbers**. Input prices, output speeds, and reasoning benchmarks—all in one place.

---

## 📸 Platform Gallery

<div align="center">
  <img src="./public/banner.png" width="100%" />
</div>

<br/>

| Model Exploration | Benchmarking Engine |
| :--- | :--- |
| <img src="./public/screenshots/models_grid.png" width="400"/> | <img src="./public/screenshots/comparison_view.png" width="400"/> |

| Search & Discovery | Admin Control |
| :--- | :--- |
| <img src="./public/screenshots/search_interface.png" width="400"/> | <img src="./public/screenshots/admin_dashboard.png" width="400"/> |

---

## 🛠 What's Inside?
*   **Empirical Comparisons:** Side-by-side data on reasoning, coding, and latency.
*   **Economic Transparency:** Standardized pricing (per 1M tokens) for clear ROI analysis.
*   **Capability Deep-Dives:** Modality support, context windows, and API availability.
*   **High-Density UI:** A dark-themed, glassmorphism interface designed for data lovers.

---

## 🧠 Engineering Spotlight: The Supabase Optimization
One of the trickiest parts was handling the nested data for model capabilities (like modality and API status). Fetching these individually caused a significant "waterfall" effect on load.

**The Solution:** I refactored the data layer to use **Next.js 15 Server Components**. By fetching all relational data in a single server-side query and caching the result at the edge, I was able to remove the client-side fetch lag entirely. The result? Sub-second page loads even with a heavy data matrix.

---

## 🏗 Stack Blueprint
*   **Platform:** Next.js 15 (App Router)
*   **Data:** Supabase (PostgreSQL)
*   **Styling:** Tailwind CSS 4.0
*   **Icons:** Lucide React

---

## 🚦 Quick Start
1. `git clone https://github.com/Maamoun0/ModelIQ.git`
2. `npm install`
3. Set your `NEXT_PUBLIC_SUPABASE_URL` and `KEY` in `.env.local`.
4. `npm run dev`

---

### 👋 Connectivity
Built by **Ahmed Maamoun**. 
[GitHub](https://github.com/Maamoun0) | [LinkedIn](https://linkedin.com/in/your-linkedin-profile)

*Cutting through the noise with data.*
