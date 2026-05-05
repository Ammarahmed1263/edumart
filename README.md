# EduMarket - Online Course Marketplace

A diploma project built with Angular (Frontend) + Express.js (Backend) that demonstrates authentication, payment integration (Stripe), and chatbot support.

## Project Overview

EduMarket is an online platform where students can browse, purchase, and enroll in courses. It uses an existing Learning Management System (LMS) backend and adds a clean e-commerce experience.

## Key Features Implemented

- User authentication with JWT (Login/Register + protected routes)
- Frontend-only cart with Signals + localStorage
- Real payment integration using Stripe test mode
- Enrollment after successful payment
- "My Courses" page with lesson access
- Course reviews
- Floating AI chatbot for student support

## Folder Structure

```text
edumarket/
|-- src/
|   |-- app/
|   |   |-- core/                  # Shared core logic (services, guards, interceptors, models)
|   |   |   |-- services/
|   |   |   |-- guards/
|   |   |   |-- interceptors/
|   |   |   `-- models/
|   |   |
|   |   |-- features/              # Main features (lazy-loaded)
|   |   |   |-- auth/
|   |   |   |-- courses/
|   |   |   |-- cart/
|   |   |   |-- checkout/
|   |   |   `-- my-courses/
|   |   |
|   |   |-- shared/                # Reusable UI components
|   |   |   `-- components/
|   |   |       |-- navbar/
|   |   |       `-- chatbot/
|   |   |
|   |   |-- app.component.ts
|   |   |-- app.config.ts
|   |   |-- app.routes.ts
|   |   `-- environments/
|   |
|   |-- assets/
|   `-- styles.css                 # Global styles (plain CSS)
|
|-- backend/                       # Optional: if you keep backend code here
|-- README.md
|-- angular.json
`-- package.json
```

## Coding Practices to Follow (Very Important)

- Use standalone components (no NgModules)
- Prefer Signals for state management (cart, auth status, etc.)
- Avoid heavy RxJS; use simple `.subscribe()` only when necessary
- Use template-driven forms for login/register (or reactive forms if comfortable)
- Plain CSS only; no Bootstrap or Angular Material
- Commit often with clear messages
- Create a new branch for every feature:
  - `feature/auth`
  - `feature/cart`
  - `feature/payment`
  - `feature/chatbot`
- Always pull latest before starting work
- Use `environment.apiUrl` for all HTTP calls
- Keep components small and focused

## Team Roles & Timeline (Day by Day)

Total timeline: until 5th May 2026.

### Member 1 - Authentication & Core Setup

Main responsibility: authentication, guards, interceptor, routing.

Tasks:

- Create the Angular project with proper folder structure
- Set up `app.config.ts`, `app.routes.ts`, and environments
- Build `AuthService` (login, register, logout, getToken)
- Create `AuthInterceptor` (adds JWT to all requests)
- Implement `authGuard` using `canActivate`
- Build Login & Register components
- Add basic Navbar with login/logout
- Protect routes (`/cart`, `/checkout`, `/my-courses`)

Deadline: End of Day 1 (Today/Tomorrow)

### Member 2 - Courses & Cart

Main responsibility: course browsing + shopping cart.

Tasks:

- Create `CourseService` (`GET /courses`, `/categories`, `/courses/{id}`)
- Build Course Listing page with category filter
- Build Course Detail page (lessons preview + reviews)
- Create `CartService` using Signals + localStorage (add/remove items, calculate total)
- Build Cart page UI (plain CSS)

Deadline: End of Day 2

### Member 3 - Payment Integration

Main responsibility: Razorpay payment + enrollment flow.

Backend tasks (Express):

- Add `POST /payments/create-order` route
- Add `POST /payments/verify` route (with signature verification)

Frontend tasks:

- Build Checkout page (cart summary + total)
- Integrate Razorpay Checkout (load script + open modal)
- Handle payment success -> call verify -> enroll courses -> clear cart
- Redirect to "My Courses" after successful payment

Deadline: End of Day 3

### Member 4 - Chatbot + My Courses + Polish

Main responsibility: final features and UI polish.

Tasks:

- Build "My Courses" page (`GET /enrollments/my-courses`)
- Implement review feature (`POST` review after enrollment)
- Create floating chatbot widget (OpenAI integration)
- Overall UI polish with plain CSS (responsive design, hover effects, loading states)
- Success/error messages and simple toast notifications

Deadline: End of Day 4

## Daily Workflow for All Members

- Morning/session start: pull latest code from Git
- Work on your assigned tasks
- End of day: push your branch and create a Pull Request (or push directly if small team)
- Daily sync (15-30 mins): quick update on what is done and blockers
- Testing: always test the full flow when possible:

  Login -> Browse -> Add to Cart -> Checkout -> Payment (test mode) -> My Courses -> Chatbot

## Backend Changes Needed (Minimal)

Only 2 new routes need to be added in Express:

- `POST /payments/create-order`
- `POST /payments/verify`

Optional:

- `POST /auth/logout`

All other endpoints (`courses`, `categories`, `enrollments`, `reviews`, `auth/me`) already exist.

## How to Run the Project

### Frontend

```bash
npm install
ng serve
```

### Backend

```bash
cd backend   # or wherever your Express app is
npm install
npm start
```

Important: update `environment.ts` with your backend URL.

## Submission Deliverables

- Working full flow (Login -> Purchase with Razorpay test -> My Courses -> Chatbot)
- Short demo video (3-5 minutes)
- Screenshots of all major pages
- This README with clear instructions
- Presentation slides explaining architecture and challenges
