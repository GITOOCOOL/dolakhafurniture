# 🛋️ Dolakha Furniture - Web Frontend
**Framework:** Next.js 15 (App Router) | **State:** Zustand | **Auth:** Supabase

## 📂 Project Architecture

### 1. `app/` (The Routing Engine)
Next.js 15 File-system routing. Each folder with a `page.tsx` is a URL.
- **`layout.tsx`**: Global wrapper (Navbar, Footer, Providers).
- **`page.tsx`**: Homepage.
- **`auth/callback/route.ts`**: The "Handshake" endpoint for Google/Supabase login.
- **`category/[slug]/` & `product/[slug]/`**: Dynamic routes for fetching specific Sanity data.
- **`actions/checkout.ts`**: Server-side logic for handling orders.

### 2. `components/` (The Building Blocks)
- **`NavbarActions.tsx`**: Handles the Login/Logout UI logic.
- **`ProductCard.tsx` & `ProductDetail.tsx`**: The main UI for furniture items.
- **`Carousel.tsx` & `CategoryRow.tsx`**: Layout components for the homepage.
- **`AccountClient.tsx`**: Client-side logic for the user profile.

### 3. `lib/` (Sanity Connection)
- **`sanity.ts`**: Initialises the Sanity client to fetch furniture data.
- **`queries.ts`**: Contains all the **GROQ queries** (the requests that ask Sanity for Products, Categories, etc.).

### 4. `utils/supabase/` (Auth Connection)
- **`client.ts`**: Supabase client for browser-side auth (Login buttons).
- **`server.ts`**: Supabase client for server-side checks (Protecting routes).

### 5. `store/` & `types/`
- **`store/useCart.ts`**: Manages the shopping cart state using **Zustand**.
- **`types/product.ts`**: TypeScript definitions to ensure product data has the correct fields.

---

## 🛠️ Dev Commands
1. `npm install` - Install dependencies.
2. `npm run dev` - Start local server at `http://localhost:3000`.
3. `npx vercel env pull .env.local` - Download latest API keys.

---

## 🔄 Data & Auth Flow
1. **Products:** `app/page.tsx` -> `lib/queries.ts` -> **Sanity Cloud**.
2. **Auth:** `components/NavbarActions.tsx` -> `utils/supabase/client.ts` -> **Supabase**.
3. **Cart:** `components/ProductCard.tsx` -> `store/useCart.ts` -> **LocalStorage**.
