# 🚗 RentCar — Enterprise Car Rental Frontend

A production-ready, scalable frontend architecture for an enterprise car rental platform (Zoomcar-style). Built with **React 19**, **Vite**, **Material UI**, and a clean, modular folder structure.

> **Note:** This repository contains the **architecture and configuration** only. Business logic (API calls, forms, data fetching) is intentionally stubbed and will be wired to a backend API.

---

## ✨ Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI** | React 19, Vite 8, Material UI 7, MUI Icons, Framer Motion |
| **State** | Redux Toolkit, Redux Persist, TanStack Query (React Query) |
| **Forms** | React Hook Form, Zod, @hookform/resolvers |
| **HTTP** | Axios (with interceptors) |
| **Routing** | React Router DOM 7 |
| **SEO** | React Helmet Async |
| **UX** | React Hot Toast, DayJS |
| **Quality** | ESLint, Prettier |

---

## 📁 Project Structure

```
rentcar-frontend/
├── public/                     # Static assets (favicon, icons)
├── src/
│   ├── app/                    # App-level composition & providers
│   ├── assets/                 # images/ icons/ fonts/
│   ├── components/             # Reusable UI components
│   │   ├── common/             # ErrorBoundary, Seo, ScrollToTop, PageLoader
│   │   ├── ui/                 # MaterialCard, Typography, Spacer
│   │   ├── buttons/            # PrimaryButton, IconButton, LoadingButton
│   │   ├── cards/              # CarCard, FeatureCard, OfferCard
│   │   ├── forms/              # FormProvider, InputField, SelectField
│   │   ├── tables/             # DataTable
│   │   ├── dialogs/            # ConfirmDialog, FormDialog
│   │   ├── loaders/            # FullPageLoader, SkeletonLoaders
│   │   ├── navigation/         # Navbar, Footer, SideNav, Breadcrumbs
│   │   └── authentication/     # ProtectedRoute, GuestRoute
│   ├── layouts/                # MainLayout, AuthLayout, DashboardLayout
│   ├── pages/                  # Home, Search, CarDetails, Booking, Checkout,
│   │                           # Payment, BookingHistory, Wishlist, Offers,
│   │                           # Profile, Notifications, Support, About, Contact,
│   │                           # FAQ, Blog, Legal, Login, Register, NotFound
│   ├── redux/                  # store/ + slices/ (auth, ui, wishlist, booking, notification)
│   ├── services/               # api/ (axios instance, http client) + queryClient
│   ├── hooks/                  # useRedux, useAuth, useApi, useLocalStorage, useMediaQuery
│   ├── contexts/               # ThemeContext, ToastContext
│   ├── routes/                 # Route config + lazy loading helpers
│   ├── constants/              # app, apiEndpoints, queryKeys, errorMessages, routes
│   ├── utils/                  # storage, sessionStorage, date, formatters, validators
│   ├── validators/             # Zod schemas (auth, booking, car)
│   ├── theme/                  # palette, typography, breakpoints, components
│   ├── styles/                 # global CSS
│   ├── types/                  # Shape contracts (documentation)
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── .env.example                # Environment variable template
├── .eslintrc / eslint.config.js
├── .prettierrc
├── vite.config.js              # Path alias + proxy + code splitting
└── jsconfig.json               # Absolute import support
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and adjust values:

```bash
cp .env.example .env.local
```

### 3. Run the dev server

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `RentCar` |
| `VITE_APP_ENV` | Environment (`development`/`production`) | `development` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `VITE_QUERY_STALE_TIME` | TanStack Query stale time (ms) | `60000` |
| `VITE_QUERY_RETRY_COUNT` | Query retry count | `2` |
| `VITE_ENABLE_MOCK_API` | Toggle mock API | `false` |
| `VITE_ENABLE_REDUX_DEVTOOLS` | Toggle Redux DevTools | `true` |
| `VITE_PERSIST_KEY` | Redux persist storage key | `rentcar-root` |
| `VITE_PERSIST_STORAGE` | Persist storage (`localStorage`/`sessionStorage`) | `localStorage` |

---

## 🧱 Architecture Highlights

### State Management
- **Redux Toolkit** for global/UI state (auth, UI theme, wishlist) with **Redux Persist** for survival across refreshes.
- **TanStack Query** for server state (cars, bookings, offers) with centralized `queryClient` defaults.

### API Layer
- Centralized Axios instance with **request interceptors** (auth token injection) and **response interceptors** (normalized error handling).
- `httpClient` wrapper returns `response.data` directly.
- All endpoints centralized in `constants/apiEndpoints.js`.

### Routing & Guards
- **Lazy-loaded** pages via `React.lazy` + `Suspense`.
- **ProtectedRoute** guards authenticated pages; **GuestRoute** guards login/register.
- Layout system: `MainLayout` (public), `AuthLayout` (auth), `DashboardLayout` (authenticated).

### Forms & Validation
- **React Hook Form** + **Zod** schemas in `validators/`.
- Reusable form components (`InputField`, `SelectField`, `CheckboxField`) wrapped via `FormProvider`.

### Theming & SEO
- MUI theme with light/dark palette, typography, and component overrides.
- `Seo` component wraps **React Helmet Async** for per-page meta tags.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

---

## 🧭 Roadmap

- [ ] Wire auth flows to backend API
- [ ] Implement car search with filters
- [ ] Build booking & checkout flows
- [ ] Integrate payment gateway
- [ ] Add e2e tests

---

## 📄 License

Private — all rights reserved.
