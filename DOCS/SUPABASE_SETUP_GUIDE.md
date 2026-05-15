# 🚀 Supabase Setup Guide for ModelIQ

This is the ultimate guide to connecting your website to a real Supabase database. Follow these simple steps:

---

## Step 1: Retrieve Connection Keys
Log in to the [Supabase Dashboard](https://supabase.com/dashboard):
1. Go to your project named **"ModelIQ"**.
2. In the sidebar (left), click the **Settings (gear)** icon.
3. Select the **API** section.
4. Find:
   *   `Project URL`: It will look like `https://xyz.supabase.co`
   *   `anon (public)` key: This will be a long string of characters.

---

## Step 2: Update Local Configuration
Open the `.env.local` file in your code editor and fill in the details as follows:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_long_anon_key_here
```

---

## Step 3: Create Tables and Data (SQL)
In the Supabase dashboard:
1. Click the **SQL Editor** icon (located in the left sidebar).
2. Click **New query**.
3. Copy the entire code from the [schema.sql](../supabase/schema.sql) file and paste it there, then click the **Run** button.
4. After success, create another **New query**.
5. Copy the entire code from the [seed.sql](../supabase/seed.sql) file (this will add the models and categories), paste it, and click the **Run** button.

---

## Step 4: Verify the Results
Now, go back to your browser and open the site (`http://localhost:3000`). You should see the data being pulled directly from the database instead of local files!

---

### 💡 Pro Tips:
- You can add new models directly from the **Admin** page within the site, and they will be saved immediately to Supabase.
- Never share your `.env.local` file with anyone, as it contains your access keys.

**Have you completed these steps? Let me know if you encounter any issues and I will help you immediately!**
