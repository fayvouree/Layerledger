# LayerLedger — Claude Code Handover Document

## What This App Is

LayerLedger is an AI-powered bakery business management app built for
Fayvouree Luxe Cakes Studio in Abuja, Nigeria. It helps cake business
owners calculate recipe costs, generate client quotes, create invoices,
track expenses, and manage their business finances.

The app is a single-page React application deployed on Cloudflare Pages.

---

## Tech Stack

- **Framework:** React 18 with Vite
- **Language:** JavaScript (JSX) — no TypeScript
- **Styling:** Inline styles + CSS variables in a `<style>` tag inside App.jsx
- **Database:** Supabase (partially connected — most data still in localStorage)
- **Deployment:** Cloudflare Pages — layerledger-app.pages.dev
- **AI proxy:** Cloudflare Pages Function at /functions/api/claude.js

---

## Project Structure

```
layerledger/
├── src/
│   ├── App.jsx          ← ENTIRE app — all components in one file (~4000 lines)
│   ├── main.jsx         ← Entry point, wraps App in ErrorBoundary
│   └── lib/
│       ├── data.js      ← All data read/write functions (localStorage + Supabase)
│       └── supabase.js  ← Supabase client (reads env vars)
├── functions/
│   └── api/
│       └── claude.js    ← Cloudflare Pages Function — proxies Anthropic API calls
├── index.html
├── vite.config.js
└── package.json
```

---

## How to Build and Deploy

```bash
# Install dependencies (only needed once)
npm install

# Build the app
npm run build

# This creates a dist/ folder
# Deploy by uploading dist/ to Cloudflare Pages
# Go to: https://dash.cloudflare.com → Pages → layerledger-app → Create deployment
# Drag and drop the dist/ folder
```

**Important:** The functions/api/claude.js file must also be included in the
Cloudflare deployment. When zipping for upload:
```bash
cd dist
zip -r ../deploy.zip .
cd ..
zip deploy.zip functions/api/claude.js
```

---

## Environment Variables (set in Cloudflare Pages dashboard)

- `ANTHROPIC_API_KEY` — Anthropic API key for AI features
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key

---

## Architecture Rules — MUST FOLLOW

These rules exist because breaking them causes silent bugs that are hard to find:

1. **Never define a component inside another component.** All React components
   must be top-level functions. Defining one inside another causes it to
   remount on every render, losing state.

2. **Never use useState inside .map().** Extract to a separate component first.

3. **All useEffect hooks must appear before any conditional returns** in a
   component. React requires hooks to be called in the same order every render.

4. **Never use template literals with backticks inside JSX string attributes**
   when building HTML strings for window.open(). Use string concatenation
   with + instead to avoid escaping issues.

5. **iSt is the global input style object** — use `style={{...iSt}}` for all
   inputs and selects to keep them visually consistent.

6. **Existing reusable components** (use these, do not create new ones):
   - `Card` — white panel container
   - `Btn` — button (variants: `variant="ghost"`, `variant="danger"`, `small`)
   - `Inp` — labelled text/number/date input
   - `Sel` — labelled select dropdown
   - `SHead` — section header with title and subtitle
   - `Badge` — coloured status badge (colors: "green", "red", "gold", "blue", "gray")
   - `Alert` — dismissable alert bar
   - `Modal` — overlay modal dialog
   - `Steps` — step progress indicator
   - `TH` — table header row
   - `TR2` — alternating table row
   - `fmt(n)` — formats a number as ₦X,XXX
   - `uid()` — generates a unique ID
   - `today2()` — returns today as YYYY-MM-DD

---

## Data Layer

All data functions are in `src/lib/data.js`. Key ones:

```js
loadQuotes() / saveQuotes(v)        // Client quotes
loadPayments() / savePayments(v)    // Payments journal
loadAR() / saveAR(v)                // Accounts receivable
loadProperInvoices()                // Sequential invoices
getNextInvoiceNumber()              // Auto-generates INV-2026-001
loadCOA() / DEFAULT_COA             // Chart of accounts
loadAssets() / saveAssets(v)        // Fixed assets
loadInventory(fb) / saveInventory(items)   // Ingredient inventory
loadRecipes() / saveRecipes(v)      // Base recipes
loadExpenses() / saveExpenses(v)    // Expenses
loadCompany() / saveCompany(v)      // Company settings
loadMults() via localStorage        // Size multipliers (ll_multipliers)
```

---

## CSS Variables (set dynamically from company brand colour)

```css
--gold       /* Primary brand colour — set by user in Settings */
--sidebar    /* Sidebar background colour */
--bg         /* Page background: #F4EEE4 */
--panel      /* Card background: #FDFAF4 */
--text       /* Main text: #291608 */
--muted      /* Secondary text: #8C6E52 */
--border     /* Border colour: #E0D3BB */
```

---

## Current Navigation Structure (sidebar)

```
Dashboard
── Daily Work ──
Order Calculator    (main entry point — build quotes here)
Quotes              (all saved quotes — approve, convert to invoice)
Production List     (this week's orders)
Shopping List       (low stock items)
── Records ──
Ingredients & Recipes  (inventory + recipes + decoration extras)
All Orders             (production history)
Scan a Receipt         (log a purchase by scanning)
── Money ──
Invoices & Payments    (combined: who owes, payments received, invoices)
Expenses               (overhead expenses with COA categories)
Check Bank Statement   (bank reconciliation)
── Reports ──
Monthly Overview
Profit & Loss
Cash Flow
── System ──
Settings
```

---

## Key Workflow — How Orders Flow

```
Order Calculator
    ↓ (fill in client details + cake tiers + coverings + decorations)
Generate & Save Quote
    ↓ (saved to localStorage under ll_quotes)
Quotes page
    ↓ (client approves → click Convert to Invoice)
Invoice PDF
    ↓ (shows client details, cake description, total, bank details)
Send via WhatsApp or Download/Print
```

New Production page has been intentionally removed.
Everything flows from the Order Calculator.

---

## Known Issues / Work in Progress

- Supabase migration not yet complete — all data is in localStorage
  which means data does not sync across devices (phone vs laptop)
- The Supabase tables schema is defined in data.js as SUPABASE_SCHEMA
  but tables have not been created in Supabase yet
- Cross-device sync is the next major feature to build

---

## Deployment Checklist

Before deploying always:
1. Run `npm run build` — fix any errors before uploading
2. Check dist/ folder exists and contains index.html + assets/
3. Include functions/api/claude.js in the zip
4. Upload to Cloudflare Pages → layerledger-app → Create deployment
5. Verify environment variables are set in Cloudflare dashboard

---

## Business Context

- **Owner:** Iye Achem (Ibe Achem), Abuja Nigeria
- **Business:** Fayvouree Luxe Cakes Studio
- **Currency:** Nigerian Naira (₦)
- **Target users:** Nigerian cake business owners, not tech-savvy
- **Key principle:** Plain English over accounting jargon throughout the UI
- **WhatsApp** is the primary client communication channel
