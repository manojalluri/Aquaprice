# AquaPrice AP — Premium Prawn Daily Market Price Platform

Production-ready daily prawn buying rates platform engineered for aquaculture farmers in **Andhra Pradesh: East Godavari, West Godavari, and Krishna districts**.

## 🌟 Features

- **Strict 4-Column Market Rate Table**: Displaying only `COUNT`, `PRICE / KG`, `LAST UPDATED`, and `SELL`. Zero historical chart clutter or distraction for farmers.
- **Instant SELL Action Popup**: One-click connect via WhatsApp (with pre-filled personalized count message) or direct Phone Call to the designated buyer.
- **Executive Buyer Admin Dashboard** (`/admin/login`):
  - Single-screen bulk rate updates with prominent **PUBLISH ALL PRICES** button.
  - Individual rate publishing.
  - Automatic IST (`Asia/Kolkata`) server timestamps applied only to modified rates.
  - Prawn count manager (add, reorder, deactivate/reactivate).
  - Centralized contact configuration (buyer phone, WhatsApp, harvesting message).
  - Market announcements manager.
  - Activity audit logs.
- **Dual Database Architecture**: Live connection to Supabase PostgreSQL database with built-in persistent fallback.
- **Mobile-First Responsive Design**: Optimized for Android and iOS smartphones with high-contrast readable rates and thumb-friendly controls.

---

## 🚀 Vercel Deployment Instructions

### 1. Push to GitHub
```bash
git add .
git commit -m "Production release of AquaPrice AP"
git push -u origin main
```

### 2. Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New Project** and select `Aquaprice` from your GitHub account.
3. Keep default settings:
   - Framework Preset: **Next.js**
   - Root Directory: `./`

### 3. Configure Environment Variables in Vercel
Under the **Environment Variables** section, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.ozlbgcznyehngnfgkgqy:MANOJALURI27227@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ozlbgcznyehngnfgkgqy.supabase.co` |
| `JWT_SECRET` | `aquaprice_super_secure_jwt_secret_token_key_2026_andhra_aqua` |
| `NEXT_PUBLIC_APP_NAME` | `AquaPrice AP` |

4. Click **Deploy**. Vercel will build and deploy the Next.js application in under 1 minute!

---

## 🔐 Default Admin Credentials

- **Buyer Portal**: `/admin/login`
- **Email**: `buyer@aquaprice.com`
- **Password**: `admin123`

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build check
npm run build
```
Live at `http://localhost:3000`.
