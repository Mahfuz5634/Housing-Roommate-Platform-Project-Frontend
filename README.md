# Housing & Roommate Platform (Frontend) 🏠

A robust, scalable, modern urban housing and roommate matching platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Zod**. Consumes the live Housing & Roommate REST API with role-based dashboards, Stripe escrow deposit payments, one-click demo logins, advanced search filters, lifestyle compatibility algorithms, and maintenance workflows.

---

## 🚀 Live Links & Repositories

| Component | URL |
| :--- | :--- |
| **Frontend Repository** | [GitHub Repository](https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Frontend) |
| **Backend Repository** | [GitHub Repository](https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Backend) |
| **Live Backend API** | [https://housing-roommate-platform-project-b.vercel.app/](https://housing-roommate-platform-project-b.vercel.app/) |
| **Backend Swagger Docs** | [https://housing-roommate-platform-project-b.vercel.app/api-docs](https://housing-roommate-platform-project-b.vercel.app/api-docs) |

---

## 🔐 One-Click Demo Credentials (Mandatory UI Requirement)

The login screen (`/login`) features **distinct, one-click "Demo Login" buttons** for all 3 primary roles:

```
┌─────────────────────────────────────────────────────────┐
│                    Welcome Back 👋                      │
│                  Login to your account                  │
│                                                         │
│             ─── OR Quick Demo Login ───                 │
│                                                         │
│  ┌─────────────────────────┐ ┌────────────────────────┐ │
│  │ 👨‍💼 Admin               │ │ 👤 User / Tenant       │ │
│  │ [Demo Login]            │ │ [Demo Login]           │ │
│  └─────────────────────────┘ └────────────────────────┘ │
│                                                         │
│            ┌─────────────────────────────┐              │
│            │ 🛠️ Provider / Landlord      │              │
│            │ [Demo Login]                │              │
│            └─────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

| Role | Demo Email | Password | Redirect Dashboard |
| :--- | :--- | :--- | :--- |
| **Platform Admin** 👨‍💼 | `admin@roommatehub.com` | `Admin@123456` | `/admin` |
| **Provider / Landlord** 🛠️ | `john.landlord@roommatehub.com` | `Landlord@123456` | `/landlord` |
| **User / Tenant** 👤 | `alex.tenant@roommatehub.com` | `Tenant@123456` | `/dashboard` |

---

## 📄 Implemented Page Directory (27 Total App Router Pages)

| Category | Route | Purpose | Component Type |
| :--- | :--- | :--- | :--- |
| **Public** | `/` | Landing page (Hero, Search, Featured Listings, Roommate spotlight) | Server Component |
| **Public** | `/about` | Mission, security guarantees, leadership team | Server Component |
| **Public** | `/services` | Verified co-living, Stripe escrow, maintenance triage | Server Component |
| **Public** | `/contact` | Interactive inquiry form with Zod validation | Client Component |
| **Public** | `/faq` | Categorized search and accordion help center | Client Component |
| **Public** | `/properties` | Explore listings with URL state synchronization | Client (Suspense) |
| **Public** | `/properties/[id]` | Dynamic property details, rooms list, booking modal | Client Component |
| **Public** | `/roommates` | Lifestyle compatibility search with habit filters | Client (Suspense) |
| **Public** | `/roommates/[id]` | Roommate profile radar, compatibility meter, messaging | Client Component |
| **Auth** | `/login` | Mandatory 1-click Demo Login for 3 roles + Credentials | Client (Suspense) |
| **Auth** | `/register` | Registration wizard with Role toggle (Tenant vs Landlord) | Client Component |
| **Admin** | `/admin` | Platform analytics with Recharts graphs & system status | Client Component |
| **Admin** | `/admin/manage` | Property approvals, User blocking/roles, Bookings audit | Client Component |
| **Admin** | `/admin/reports` | System security audit logs and fee policy settings | Client Component |
| **Tenant** | `/dashboard` | Tenant overview (Key KPIs, lease preview, pending payments) | Client Component |
| **Tenant** | `/dashboard/bookings` | Booking applications with **Stripe Pay Deposit** trigger | Client Component |
| **Tenant** | `/dashboard/maintenance` | 24/7 maintenance ticket creation modal and status tracker | Client Component |
| **Tenant** | `/dashboard/profile` | Roommate lifestyle questionnaire & budget configuration | Client Component |
| **Tenant** | `/dashboard/payments` | Transaction receipts and payment download simulator | Client Component |
| **Landlord** | `/landlord` | Provider overview (Occupancy rate, rental collections, charts) | Client Component |
| **Landlord** | `/landlord/properties` | Managed listings inventory with real-time status toggles | Client Component |
| **Landlord** | `/landlord/properties/create` | **4-Step Multi-Step Wizard** form to post listings | Client Component |
| **Landlord** | `/landlord/bookings` | Incoming tenant screening with **1-click Approve / Reject** | Client Component |
| **Landlord** | `/landlord/maintenance` | Property maintenance tickets triage (In Progress / Resolved) | Client Component |
| **Payment** | `/payment/success` | Stripe checkout success verification, confetti, and receipt | Client (Suspense) |
| **Payment** | `/payment/cancel` | Grace period cancellation notices and retry options | Client (Suspense) |
| **Shared** | `/_not-found` | Branded 404 page with navigation shortcuts | Server Component |
| **Shared** | `error.tsx` | Global error boundary catching client exceptions with retry | Client Component |

---

## 🛠️ Key Architectural Highlights

1. **Next.js 14 App Router Split**: Strict separation between Server Components (default for SEO, static markup, and metadata) and Client Components (`'use client'` for forms, state, Recharts, and interactive modals).
2. **Next.js Route Middleware**: Strict role-based guard enforcing route protection (`/admin/**`, `/landlord/**`, `/dashboard/**`) via cookie-synchronized JWT tokens.
3. **Stripe Test Checkout & Verification**: Seamless checkout session initiation that passes `booking_id` to Stripe and verifies completion with atomic database state updates upon redirect to `/payment/success`.
4. **URL State Synchronization**: Dynamic query parameters (`city`, `propertyType`, `sleepSchedule`, `cleanliness`) sync with browser URL via `useSearchParams` and Next.js router.
5. **High-Fidelity Offline Resilience**: `apiClient` automatically connects to the live backend API, while maintaining high-fidelity in-memory fallbacks if the local environment is disconnected.
6. **Recharts Data Visualizations**: Interactive Area, Bar, and Pie charts displaying monthly rental income, booking funnels, and inventory allocation.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Frontend.git
cd Housing-Roommate-Platform-Project-Frontend

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.
