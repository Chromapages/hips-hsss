# Firebase Auth UI Implementation Plan (Sprint 8 Moved Forward)

## Executive Summary
This plan outlines the implementation of the frontend user interface for Firebase Authentication within the H.I.P.S. platform. While the backend infrastructure, database mappings, and security middleware are 100% complete, the client-facing UI remains a placeholder. This plan bridges that gap by implementing a secure, robust, and visually cohesive authentication flow that aligns with the platform's clinical-yet-warm aesthetic and strict anonymity requirements.

---

## 🏗️ Authentication Architecture

The client-side auth architecture will utilize a **React Context Provider** to manage global authentication state, tightly coupled with Firebase's `onAuthStateChanged` observer.

### State Management
1. **`AuthProvider`**: A global context wrapping the `(app)` and `(admin)` layouts. It tracks the current Firebase `User` object, loading state, and derived custom claims (e.g., `role`).
2. **`useAuth` Hook**: A custom hook exposing `user`, `loading`, `signIn`, `signUp`, and `signOut` functions to components.
3. **Session Synchronization**: The client will handle the Firebase session, but we will ensure the token is passed in headers for API requests (via an Axios/Fetch interceptor or standard `Authorization: Bearer <token>` injection).

---

## 🎨 Visual Wireframes & Design System

The design aesthetic must convey trust, privacy, and security. We will utilize the `@hips/ui` component library (Tailwind, Radix UI) to build clean, accessible forms.

### Sign-In Flow
> [!NOTE]
> The Sign-In screen focuses on returning users, offering both email/password and secure OAuth (Google) options.

![Sign In Wireframe](file:///C:/Users/ericb/.gemini/antigravity/brain/41ff3e24-e3e4-4807-8e32-713117cb6d17/hips_signin_wireframe_1777998919572.png)

### Sign-Up Flow
> [!IMPORTANT]
> The Sign-Up flow enforces strict password policies and clearly communicates that PII is securely vaulted and separate from the commerce/session profiles.

![Sign Up Wireframe](file:///C:/Users/ericb/.gemini/antigravity/brain/41ff3e24-e3e4-4807-8e32-713117cb6d17/hips_signup_wireframe_1777998932732.png)

---

## 🧩 Component Breakdown

### 1. Context & Hooks (`apps/web/src/components/providers/auth-provider.tsx`)
- **Responsibility**: Initialize `firebase/auth`, listen to auth state changes, and provide the user context.
- **Exports**: `<AuthProvider>`, `useAuth()`

### 2. Sign-In Page (`apps/web/src/app/(auth)/sign-in/page.tsx`)
- **Components**: `<SignInForm />` (React Hook Form + Zod validation).
- **Features**: Error handling (invalid credentials), loading states, password reset link.

### 3. Sign-Up Page (`apps/web/src/app/(auth)/sign-up/page.tsx`)
- **Components**: `<SignUpForm />` (React Hook Form + Zod validation).
- **Features**: Real-time password strength validation. 
- **Post-Registration Logic**: Upon successful Firebase creation, an API call must be made to `/api/v1/users/register` to provision the associated `Commerce` and `Vault` records securely.

### 4. Auth Utilities (`apps/web/src/lib/firebase/auth-helpers.ts`)
- **Functions**: `handleFirebaseError(code)`, `getAuthErrorMessage()`. Maps cryptic Firebase error codes to user-friendly, empathetic UI messages.

---

## 🚀 Step-by-Step Execution Plan

- [ ] **Step 1: Auth Provider Setup**
  - Implement the `<AuthProvider>` context and `useAuth` hook.
  - Wrap the root layout or specific group layouts with the provider.
- [ ] **Step 2: Sign-In Component Implementation**
  - Build the `<SignInForm>` using standard UI components (`Input`, `Button`, `Label`).
  - Wire up `signInWithEmailAndPassword` and `signInWithPopup` (Google).
  - Implement error boundaries and toast notifications.
- [ ] **Step 3: Sign-Up Component Implementation**
  - Build the `<SignUpForm>`.
  - Wire up `createUserWithEmailAndPassword`.
  - Implement the onboarding hook that creates the user's secure database profile upon first registration.
- [ ] **Step 4: Route Protection**
  - Create a `<ProtectedRoute>` wrapper or update the `(app)` layout to redirect unauthenticated users to `/sign-in` while waiting for `loading === false`.
- [ ] **Step 5: API Integration Hooking**
  - Ensure the client-side fetch wrapper automatically appends the `await user.getIdToken()` to the `Authorization` header for all requests to `/api/v1/...`.

---

**Do you approve of this design direction and implementation plan?** If so, I will begin executing Step 1 immediately.
