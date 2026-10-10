# Housing & Roommate Platform (Frontend) 🏠

A modern, full-featured housing and roommate matching platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Zod**. Consumes the Housing & Roommate REST API with role-based dashboards, Stripe test-mode payments, one-click demo logins, advanced search filters, lifestyle compatibility algorithms, and maintenance workflows.

---

## 🚀 Live Links & Repositories

- **Frontend Repository**: [GitHub](https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Frontend)
- **Backend Repository**: [GitHub](https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Backend)
- **Live Frontend**: *Deployable to Vercel*
- **Live Backend API**: `http://localhost:5000/api/v1`

---

## 🔐 Demo Credentials (One-Click Login Supported)

The login screen provides **instant 1-click demo login buttons** for evaluators:

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Admin** 👨‍💼 | `admin@roommatehub.com` | `Admin@123456` | `/admin` |
| **Landlord / Provider** 🛠️ | `john.landlord@roommatehub.com` | `Landlord@123456` | `/landlord` |
| **Tenant / Customer** 👤 | `alex.tenant@roommatehub.com` | `Tenant@123456` | `/dashboard` |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Client Components split)
- **Language**: TypeScript (strict types, zero `any`)
- **Styling**: Tailwind CSS, Lucide React icons, Sonner toast notifications
- **State & Data Fetching**: TanStack Query v5 + Zustand global client state
- **Forms & Validation**: React Hook Form + Zod
- **Data Visualizations**: Recharts
- **Payment Processing**: Stripe Checkout Session flow with automated verification & booking confirmation
- **Authentication**: JWT Bearer token authentication + Next.js Route Protection Middleware

---

## 📋 Features Overview

- **3 Fixed Primary Roles**: Admin, Landlord, and Tenant with strictly protected route middleware and custom navigation.
- **One-Click Demo Authentication**: Instantly switches between Admin, Landlord, and Tenant with pre-seeded accounts.
- **Stripe Checkout Integration**: Complete deposit payment cycle with redirection to `/payment/success` and backend verification.
- **URL State Synchronization**: Dynamic filters for price range, property type, city, rooms, and roommate lifestyle sync with URL query params.
- **Multi-Step Listing Wizard**: Landlord property creation with step-by-step validation.
- **Roommate Matching Engine**: Algorithmic scoring based on sleep schedule, cleanliness, smoking, and budget compatibility.
- **Maintenance Ticket Workflow**: Tenants create maintenance requests, Landlords update progress, Admins review platform health.
- **18+ Responsive Pages**: Rich skeleton loaders, graceful error boundaries, and custom 404 page.

---

## 💻 Getting Started Locally

```bash
# 1. Clone repository
git clone https://github.com/Mahfuz5634/Housing-Roommate-Platform-Project-Frontend.git
cd Housing-Roommate-Platform-Project-Frontend

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
