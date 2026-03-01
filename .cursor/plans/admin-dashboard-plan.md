# Admin Dashboard — End-to-End Plan

## Scope

- **Frontend only**: Hardcoded credentials, placeholder submissions, mock chart data. No backend or real auth.
- **Adherence**: Follow ui-core-migration.md: shadcn components, Framer Motion, brand tokens (#E00122, etc.), `max-w-6xl` containers, Navbar + main + Footer, lucide-react only, TypeScript, semantic HTML.

---

## 1. Auth Flow (Frontend-Only)

- **Login entry**: Add an "Admin Login" link at the end of the navbar — after existing nav links, before "Get Involved" on desktop; include in mobile sheet. Use `Link` to `/admin/login` and lucide icon (e.g. `LogIn`).
- **Login page** (`/admin/login`): Same shell (Navbar, main, Footer). Centered card with email input, password input, submit button. Client-side check: if email === `"123"` and password === `"123"`, set "logged in" and redirect to `/admin`. Otherwise show inline error. Store auth in `localStorage` (e.g. `adminAuthenticated: "true"`).
- **Protected routes**: `AdminGuard` reads auth from `localStorage`; if not authenticated, redirect to `/admin/login`. Use for all `/admin/*` except `/admin/login`.
- **Logout**: On admin dashboard (and optionally navbar when on admin), "Log out" clears `localStorage` and redirects to `/admin/login`.

---

## 2. Routing

- `/admin/login` → Admin login page (no guard).
- `/admin` → Admin dashboard (protected).
- `/admin/reimbursements` → Reimbursements form (protected).
- `/admin/career-fair/representative-sign-in` → Representative sign-in (protected).
- `/admin/career-fair/tags` → Tags printing (protected).

Lazy-load admin pages. Wrap protected routes with `AdminGuard`.

---

## 3. Admin Layout and Dashboard Page

- **Layout**: Reuse Navbar, main with `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`, Footer.
- **Dashboard** (`/admin`): Heading "Admin Dashboard". Grid of cards linking to: (1) Our Reimbursements, (2) Career Fair Representative Sign-In, (3) Career Fair Tags Printing. Each card: title, description, icon, link. Framer Motion stagger/fade-in. Below: "Metrics" section with 2–3 charts. Log out button in header/top-right.

---

## 4. Reimbursements Page

- **Fields** (from legacy): Member Information — Vendor ID (text input) + helper link "View vendor ID list". Expenditure — "Was this a budgeted expense?" Yes/No (RadioGroup); "How would you like to be reimbursed?" Direct Deposit / Check (RadioGroup). Supporting documents — Scanned Itemized Receipt (required, file upload), Supporting Documents (optional, file upload). Submit button; on submit: placeholder alert/toast.

---

## 5. Career Fair Representative Sign-In Page

- One question: "Where are you located?" with Select (placeholder locations: Booth A1, Booth A2, Main Hall, Virtual). Submit "Sign in". On submit: success state "You have successfully signed in" + "Sign in another representative" to reset.

---

## 6. Career Fair Tags Printing Page

- Printer: Select "Select a connected DYMO printer" (placeholder options). Location: Select with same placeholder locations. Table: Name, Company, Title, Booth Location, Time Added. Placeholder rows (3–5). Optional "Print tags" button (e.g. window.print() for demo).

---

## 7. Metrics Visualizations (Dashboard)

- 2–3 charts with mock data: (1) Event attendance bar chart, (2) General body meeting trend line/area chart, (3) Optional KPI. Use shadcn chart + Recharts; brand color #E00122 in chart config.

---

## 8. New Shadcn / Dependencies

- Add: input, label, select, radio-group, chart. New dependency: recharts.

---

## 9. Order of Implementation

1. Add shadcn input, label, select, radio-group; add chart + recharts.
2. AdminGuard and AdminLoginPage; add "Admin Login" to Navbar; wire routes.
3. AdminDashboardPage: cards + Metrics charts.
4. AdminReimbursementsPage.
5. AdminRepresentativeSignInPage.
6. AdminTagsPrintingPage.
7. Log out and navbar tweaks.
