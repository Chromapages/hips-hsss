# Settings Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the dashboard settings page from a single dark-styled column into a 8-category two-column shadcn/ui-driven page (Account, Profile, Security, Notifications, Billing, Integrations, Appearance, Privacy) with full form validation, server actions, destructive-action confirms, a sticky unsaved-changes bar, and WCAG-AA compliance.

**Architecture:** Keep all settings on a single route (`/dashboard/settings`) using a tab-style `useState` selector that swaps the active panel. The left sidebar (w-64) is the navigation; the right column renders the active panel. Mobile collapses the sidebar to a shadcn `Select` AND a horizontally scrollable pill tab row. Forms use React Hook Form + Zod resolvers; mutations use Next.js Server Actions. State that needs to be shared between panels (e.g., a "dirty" signal) lives in a `SettingsContext` at the layout level.

**Tech Stack:** Next.js 15 (App Router, RSC + RSC actions), React 18, TypeScript, shadcn/ui (Radix primitives), `react-hook-form` + `@hookform/resolvers/zod`, `zod`, `sonner` (toasts), `framer-motion` (panel transitions), Tailwind CSS. **No new top-level deps required** — `framer-motion` may need to be added; verify before installing.

**Design system constraint:** `docs/DESIGN_SYSTEM.md` is canonical for colors/typography/spacing. Existing shadcn components already use `text-primary`, `bg-primary`, `border-border`, `text-muted`, etc. Tailwind config must be extended to map the design system tokens (`brand-primary: #2D5A8E`, etc.) onto the shadcn CSS-variable layer. **Do not hardcode hex in component code.**

**Critical pre-flight findings** (from `src/app/dashboard/settings/page.tsx`):
- The current page imports `@/components/auth/AuthProvider` and `useAuth` — **those files do not exist.** The page is broken. Agent 1 must either remove those imports or stub a minimal `AuthProvider` (`useAuth()` returning `{ user: { email, getIdToken }, role, logout }`).
- The current page has a broken Tailwind gradient `from-#173B57 to-Gold-600` on line 71 — discard that block entirely.
- The current page is dark (`bg-zinc-950`, white text) while the rest of the dashboard is light. New design uses **light theme** for consistency with the rest of the dashboard.
- The current page uses single-page sections; the redesign flattens to one route with a `useState` panel switcher (no new routes).

---

## 1. File Structure

### Files to create
```
src/app/dashboard/settings/
├── layout.tsx                              # SettingsShell: sidebar + content + SettingsContext
├── page.tsx                                # Account panel (default) — client component
├── _components/
│   ├── SettingsSidebar.tsx                 # w-64 vertical nav, grouped
│   ├── MobileSettingsNav.tsx               # shadcn Select + pill-tab row
│   ├── StickySaveBar.tsx                   # fixed bottom bar on isDirty
│   ├── PanelTransition.tsx                 # Framer Motion AnimatePresence wrapper
│   └── panels/
│       ├── AccountPanel.tsx
│       ├── ProfilePanel.tsx
│       ├── SecurityPanel.tsx
│       ├── NotificationsPanel.tsx
│       ├── BillingPanel.tsx
│       ├── IntegrationsPanel.tsx
│       ├── AppearancePanel.tsx
│       └── PrivacyPanel.tsx
├── _lib/
│   ├── settings-nav.ts                     # static nav config: {id,label,href,icon,group}
│   ├── schemas.ts                          # all Zod schemas
│   ├── actions.ts                          # all server actions ("use server")
│   ├── settings-context.tsx                # SettingsProvider + useSettings()
│   └── types.ts                            # PanelId union + shared types
└── _hooks/
    └── useUnsavedChanges.ts                # useBeforeUnload + isDirty broadcast
```

### New shadcn components to install (Radix primitives)
```
src/components/ui/
├── form.tsx                                # Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
├── label.tsx
├── switch.tsx
├── select.tsx
├── radio-group.tsx
├── alert-dialog.tsx
├── alert.tsx
├── badge.tsx
├── table.tsx
├── tabs.tsx                                # only used internally for the pill row primitive
├── checkbox.tsx
└── sonner.tsx                              # <Toaster /> mount point (re-export from sonner)
```

### Files to modify
```
src/app/layout.tsx                         # add <Toaster /> once at root
src/lib/utils.ts                           # confirm `cn` exists; add `cva` re-export if missing
tailwind.config.ts                         # map shadcn CSS vars to design system tokens
src/app/dashboard/DashboardLayout.tsx      # no structural change; settings page already wrapped
```

### Files to delete
```
src/app/dashboard/settings/page.tsx        # replaced by new layout.tsx + page.tsx
```

> **Note on `components.json`:** The repo has a shadcn `components.json` (in `src/`), so `npx shadcn-ui@latest add <name>` is the right install path. Run from `apps/web`.

---

## 2. Per-Agent Plan

### Agent 1 — Layout & Navigation Architecture

**Files produced:**
- `src/app/dashboard/settings/layout.tsx`
- `src/app/dashboard/settings/page.tsx` (stub returning the Account panel placeholder)
- `src/app/dashboard/settings/_lib/settings-nav.ts`
- `src/app/dashboard/settings/_lib/settings-context.tsx`
- `src/app/dashboard/settings/_components/SettingsSidebar.tsx`
- `src/app/dashboard/settings/_components/MobileSettingsNav.tsx`
- All new `src/components/ui/*.tsx` components (12 of them)

**Component choices:**
- `SettingsShell` (layout) = `<div max-w-6xl mx-auto>` containing `<aside w-64>` + `<main flex-1>`; supplies `<SettingsProvider>` with `activePanel` state.
- `SettingsSidebar` uses a custom vertical nav (NOT shadcn `NavigationMenu`, which is for horizontal/dropdown). Render `<nav>` with `<button>` items; active item uses `bg-primary/10 text-primary border-l-2 border-primary font-semibold`. Each item is an `aria-current="page"` button that calls `setActivePanel(id)`.
- `MobileSettingsNav` shows a shadcn `Select` (label "Go to") AND, on screens >= sm and < lg, a horizontally-scrollable pill-tab row above content (`flex overflow-x-auto gap-2 px-4`).
- Container: `<div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-16 py-8 lg:py-12">` (matches `docs/DESIGN_SYSTEM.md` 8pt grid; 16/32/64px gutters).

**Nav config (`settings-nav.ts`):**
```ts
export type PanelId = 'account'|'profile'|'security'|'notifications'|'billing'|'integrations'|'appearance'|'privacy';
export const SETTINGS_NAV: { id: PanelId; label: string; icon: LucideIcon; group: 'Account'|'Security'|'Preferences'|'Danger'; }[] = [
  { id: 'account',       label: 'Account',       icon: User,            group: 'Account'     },
  { id: 'profile',       label: 'Profile',       icon: UserCircle,     group: 'Account'     },
  { id: 'security',      label: 'Security',      icon: Shield,         group: 'Security'    },
  { id: 'notifications', label: 'Notifications', icon: Bell,           group: 'Preferences' },
  { id: 'billing',       label: 'Billing',       icon: CreditCard,     group: 'Preferences' },
  { id: 'integrations',  label: 'Integrations',  icon: Plug,           group: 'Preferences' },
  { id: 'appearance',    label: 'Appearance',    icon: Palette,        group: 'Preferences' },
  { id: 'privacy',       label: 'Privacy',       icon: Lock,           group: 'Danger'      },
];
```

**Responsive behavior:**
- `<lg` (mobile/tablet): hide sidebar, show `<MobileSettingsNav>` above content
- `>=lg` (desktop): show sidebar; hide mobile nav row
- Container max-width 6xl, gutters scale 16/32/64

**Stub `AuthProvider`:** Since the old page referenced it, create a minimal `src/components/auth/AuthProvider.tsx` returning `{ user: { email: 'anon@hips.local', getIdToken: async () => 'stub' }, role: 'PARTICIPANT', logout: async () => {} }`. The new settings page will read from `useAuth()` for the Account panel. Other agents will refine this.

**Tailwind config extension (add to `tailwind.config.ts`):**
```ts
colors: {
  border: 'hsl(var(--border))',
  input:  'hsl(var(--input))',
  ring:   'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
  secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
  destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
  muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
  accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
  card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
},
```

**Done when:** Visiting `/dashboard/settings` shows a sidebar with 8 grouped nav items on desktop, a Select+ pill-tabs on mobile, and clicking each item updates the right pane (with a placeholder for each panel). `npm run typecheck` passes.

---

### Agent 2 — Settings Panels & shadcn Component Implementation

**Files produced:**
- `src/app/dashboard/settings/_components/panels/AccountPanel.tsx`
- `src/app/dashboard/settings/_components/panels/ProfilePanel.tsx`
- `src/app/dashboard/settings/_components/panels/SecurityPanel.tsx`
- `src/app/dashboard/settings/_components/panels/NotificationsPanel.tsx`
- `src/app/dashboard/settings/_components/panels/BillingPanel.tsx`
- `src/app/dashboard/settings/_components/panels/IntegrationsPanel.tsx`
- `src/app/dashboard/settings/_components/panels/AppearancePanel.tsx`
- `src/app/dashboard/settings/_components/panels/PrivacyPanel.tsx`

Each panel wraps everything in `<Card><CardHeader><CardTitle><CardDescription/></CardHeader><CardContent>...`.

**Per-panel component breakdown:**

| Panel | shadcn Components Used | Form Library | Layout Pattern |
|---|---|---|---|
| **Account** | `Form`, `FormField`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`, `Avatar`, `Separator` | RHF + Zod | Avatar row (left) + form (right) inside one Card. Save button in `CardFooter`. |
| **Profile** | `Form`, `Input`, `Textarea`, `Button`, `Select` (timezone, locale) | RHF + Zod | Two columns on `md+`: bio textarea spans full width; name/title/location/website stack. |
| **Security** | `Form`, `Input`, `Button`, `Switch` (2FA), `Table` (active sessions), `Badge`, `AlertDialog` (revoke), `Separator` | RHF + Zod for password form; Switch is `Controller` from RHF. | Three sub-cards: Change Password, Two-Factor Authentication, Active Sessions. |
| **Notifications** | `Switch` (×6), `Label`, `Card` (one per category), `Separator` | RHF + Zod grouped fields | Three sub-cards: Email, Push, In-app — each with 2 toggles. Single Save button at the end. |
| **Billing** | `Badge` (plan), `Button` (upgrade/manage), `Table` (history), `Alert` (free trial notice), `Card` | No RHF — read-only | Plan card at top; billing history table below; cancel/upgrade buttons. |
| **Integrations** | `Switch` (×N), `Card`, `Button` (connect/disconnect), `Badge` (connected) | RHF + Zod | List of integrations; each row is a Card with name, description, status, switch. |
| **Appearance** | `RadioGroup` (theme), `Select` (language), `Select` (timezone), `Label`, `Card` | RHF + Zod | Three sub-cards: Theme, Language, Timezone. |
| **Privacy** | `Button`, `AlertDialog` (delete), `Alert`, `Card` | No form — buttons only | Data export card, then Danger Zone card with delete button wrapped in AlertDialog. |

**Card structure (canonical pattern for every panel):**
```tsx
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* panel body */}
  </CardContent>
  <CardFooter className="border-t pt-6 flex justify-end gap-2">
    <Button variant="ghost">Discard</Button>
    <Button type="submit">Save changes</Button>
  </CardFooter>
</Card>
```

**Form scaffolding (Agent 2 only stubs the form; Agent 3 wires validation and server actions):**
```tsx
// AccountPanel.tsx (skeleton — no validation, no action yet)
const form = useForm<AccountInput>({ defaultValues: { displayName: '', email: '', username: '' } });
return <Card>... <Form {...form}> <form> <FormField name="displayName" render={...} /> </form> </Form> ...</Card>
```

**Responsive behavior (per panel):**
- Account, Profile: two-column on `md+`; stacked on mobile
- Security: tables collapse to stacked cards on `<md`
- Notifications: grid 1-col mobile / 2-col `md+` / 3-col `lg+`
- Billing: table becomes card-stack on `<md`
- Appearance: single column always
- Privacy: full-width cards always

**Done when:** All 8 panels render with their full shadcn component set, layout responds to viewport, `npm run typecheck` passes. Forms do NOT yet validate or submit (Agent 3's job). Destructive buttons are present but not yet wired to AlertDialogs (Agent 4's job).

---

### Agent 3 — Form Validation & Server Action Wiring

**Files produced:**
- `src/app/dashboard/settings/_lib/schemas.ts`
- `src/app/dashboard/settings/_lib/actions.ts`
- (modify) every panel in `_components/panels/*.tsx` to use schemas + actions

**Zod schemas (`schemas.ts`):**
```ts
import { z } from 'zod';

export const accountSchema = z.object({
  displayName: z.string().min(2, 'At least 2 characters').max(50, 'At most 50 characters'),
  email:       z.string().email('Enter a valid email'),
  username:    z.string().min(3).max(30).regex(/^[a-z0-9_-]+$/, 'Lowercase letters, digits, _ or -'),
});
export type AccountInput = z.infer<typeof accountSchema>;

export const profileSchema = z.object({
  fullName:     z.string().max(80).optional().or(z.literal('')),
  bio:          z.string().max(280, 'Bio is 280 characters max').optional().or(z.literal('')),
  location:     z.string().max(80).optional().or(z.literal('')),
  websiteUrl:   z.string().url('Enter a valid URL').optional().or(z.literal('')),
  pronouns:     z.string().max(40).optional().or(z.literal('')),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter')
    .regex(/[a-z]/, 'One lowercase letter')
    .regex(/[0-9]/, 'One digit')
    .regex(/[^A-Za-z0-9]/, 'One special character'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export type PasswordInput = z.infer<typeof passwordSchema>;

export const notificationsSchema = z.object({
  emailSessionReminders: z.boolean(),
  emailProductNews:      z.boolean(),
  pushSessionStart:       z.boolean(),
  pushQueueUpdates:       z.boolean(),
  inappCrisis:            z.boolean(),
  inappReceipts:          z.boolean(),
});
export type NotificationsInput = z.infer<typeof notificationsSchema>;

export const appearanceSchema = z.object({
  theme:    z.enum(['light', 'dark', 'system']),
  language: z.string().min(2),
  timezone: z.string().min(1),
});
export type AppearanceInput = z.infer<typeof appearanceSchema>;
```

**Server action signatures (`actions.ts`):**
```ts
'use server';
import { revalidatePath } from 'next/cache';

export type ActionResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateAccount(input: AccountInput): Promise<ActionResult> { ... }
export async function updateProfile(input: ProfileInput): Promise<ActionResult> { ... }
export async function updatePassword(input: PasswordInput): Promise<ActionResult> { ... }
export async function toggleTwoFactor(enabled: boolean): Promise<ActionResult> { ... }
export async function revokeSession(sessionId: string): Promise<ActionResult> { ... }
export async function updateNotifications(input: NotificationsInput): Promise<ActionResult> { ... }
export async function updateAppearance(input: AppearanceInput): Promise<ActionResult> { ... }
export async function exportData(): Promise<ActionResult<{ url: string }>> { ... }
export async function deleteAccount(confirmation: string): Promise<ActionResult> { ... }
```

Each action:
1. Authenticates via `getServerSession()` or Firebase ID token (verify during integration).
2. Validates the input AGAIN with the same Zod schema (defense in depth).
3. Calls the relevant DB/Firestore mutation.
4. Calls `revalidatePath('/dashboard/settings')`.
5. Returns `ActionResult`.

Stub the implementation bodies in this pass — return `{ ok: true, data: input }` so the wiring is testable. Real persistence is out of scope.

**Per-panel form wiring (canonical pattern, e.g. AccountPanel):**
```tsx
const router = useRouter();
const [isPending, startTransition] = useTransition();
const form = useForm<AccountInput>({
  resolver: zodResolver(accountSchema),
  defaultValues: { displayName: user?.displayName ?? '', email: user?.email ?? '', username: '' },
});

const { isDirty } = form.formState;

function onSubmit(values: AccountInput) {
  startTransition(async () => {
    const res = await updateAccount(values);
    if (res.ok) {
      toast.success('Account updated');
      form.reset(values);   // clears isDirty
      router.refresh();
    } else {
      toast.error(res.error);
      if (res.fieldErrors) {
        for (const [k, v] of Object.entries(res.fieldErrors)) {
          form.setError(k as keyof AccountInput, { message: v.join(' ') });
        }
      }
    }
  });
}

// Save button:
<Button type="submit" disabled={!isDirty || isPending} isLoading={isPending}>
  Save changes
</Button>
```

**Done when:**
- Every form has a Zod resolver wired.
- Every submit calls a server action via `useTransition`.
- Save button is `disabled` when `!isDirty` and shows `isLoading` spinner during `isPending`.
- Success: `toast.success(...)` + `form.reset(values)` to clear dirty state.
- Error: `toast.error(...)` + `form.setError(...)` for inline `<FormMessage>` rendering.
- `npm run typecheck` passes; manual smoke: open Account, change displayName, save, see toast, button greys.

---

### Agent 4 — UX Polish & Interaction Design

**Files produced:**
- `src/app/dashboard/settings/_components/StickySaveBar.tsx`
- `src/app/dashboard/settings/_hooks/useUnsavedChanges.ts`
- (modify) `settings-context.tsx` to broadcast `isDirty` from active panel
- (modify) every panel to call `useSettings().setDirty(boolean)` on `form.formState.isDirty` change
- (modify) destructive actions in Security + Privacy to wrap in `AlertDialog`

**Sticky save bar (`StickySaveBar.tsx`):**
```tsx
'use client';
import { useSettings } from '../_lib/settings-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function StickySaveBar() {
  const { isDirty, resetActiveForm, submitActiveForm } = useSettings();
  if (!isDirty) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pointer-events-none">
      <Card className="max-w-3xl mx-auto flex items-center justify-between p-4 shadow-2xl pointer-events-auto">
        <p className="text-sm font-medium">You have unsaved changes</p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={resetActiveForm}>Discard</Button>
          <Button onClick={submitActiveForm}>Save</Button>
        </div>
      </Card>
    </div>
  );
}
```

To implement `resetActiveForm` / `submitActiveForm`, the active panel registers its `form` handle on mount:
```tsx
// inside AccountPanel
const { registerForm } = useSettings();
useEffect(() => { registerForm(form); return () => registerForm(null); }, [form]);
```

**`useUnsavedChanges` hook (combines RHF `isDirty` + `beforeunload`):**
```ts
'use client';
import { useEffect } from 'react';

export function useUnsavedChanges(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    function handler(e: BeforeUnloadEvent) { e.preventDefault(); e.returnValue = ''; }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
```

**AlertDialog confirmation (canonical pattern, e.g. delete account):**
```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete your account permanently?</AlertDialogTitle>
      <AlertDialogDescription>
        This will erase all session history, packages, and personal data.
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={onConfirmDelete}>Yes, delete my account</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

Apply the same pattern to: revoke session, disable 2FA, disconnect integration.

**Loader2 inside submit button:** Already supported by the existing `Button` (`isLoading` prop spins an inline SVG). For consistency use `isLoading={isPending}` on every submit.

**Framer Motion panel transition (`PanelTransition.tsx`):**
```tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';

export function PanelTransition({ panelId, children }: { panelId: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={panelId}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

Wrap each panel render in `PanelTransition` with `panelId={activePanel}` as key.

**Done when:**
- Sticky bar appears the moment any field is edited; disappears on save or discard.
- Discard reverts to defaultValues.
- Save triggers the panel's submit and clears dirty.
- All destructive actions require AlertDialog confirmation.
- Switching panels animates with fade+slide.
- Closing the tab with unsaved changes triggers the browser's "leave site?" dialog.

---

### Agent 5 — Accessibility, Responsiveness & QA

**Files modified (audit-only, fixes as needed):**
- All panel files
- `SettingsSidebar.tsx`, `MobileSettingsNav.tsx`
- `StickySaveBar.tsx`

**WCAG AA audit checklist:**

**Heading hierarchy**
- [ ] Page `<h1>` exists once in `layout.tsx` ("Settings")
- [ ] Every `CardTitle` is `<h2>` (verify shadcn `CardTitle` renders `h3` by default — promote via `asChild` or by overriding the className to add `text-2xl font-semibold` while keeping the underlying tag semantic; the cleanest fix is to render `<CardTitle asChild><h2>...</h2></CardTitle>` if `asChild` is supported, else wrap in a custom `<H2>` component)
- [ ] No `<h3>` or deeper inside a panel without an `<h2>` parent

**Form labels & inputs**
- [ ] Every `<Input>` is wrapped in `FormControl` and paired with `FormLabel` (renders `htmlFor`)
- [ ] Helper text via `FormDescription` (aria-describedby)
- [ ] Errors via `FormMessage` (aria-invalid + aria-describedby)
- [ ] `<Switch>` has descriptive `aria-label` if no visible label

**AlertDialog a11y**
- [ ] Every `AlertDialog` has `AlertDialogTitle` (id referenced by aria-labelledby)
- [ ] `AlertDialogDescription` (id referenced by aria-describedby)
- [ ] Focus is trapped while open (Radix default)
- [ ] `Escape` closes (Radix default)

**Keyboard navigation**
- [ ] Tab order: sidebar → active panel → form fields → save bar buttons
- [ ] `Shift+Tab` reverses correctly
- [ ] Sidebar items focusable via Tab; `Enter`/`Space` activate
- [ ] `RadioGroup` items: arrow keys cycle
- [ ] `Select`: `Space` opens, arrows navigate, `Enter` selects, `Escape` closes

**Responsiveness matrix** (verify in Chrome devtools at each width):
| Width | Expected |
|---|---|
| 320px | Single column, mobile nav visible, sidebar hidden, all forms full-width |
| 640px (sm) | Pill tab row visible, single-column forms |
| 768px (md) | Account/Profile show two-column layout; sidebar still hidden |
| 1024px (lg) | Sidebar visible, mobile nav hidden |
| 1280px (xl) | Centered content, max-w-6xl |
| 1920px | Content stays within 6xl, no awkward stretching |

**Manual QA flow:**
1. Open `/dashboard/settings` as anon (auth stub)
2. Click each of 8 sidebar items — panel swaps, no console errors
3. Edit Account displayName → save bar appears → click Save → toast → save bar disappears
4. Edit, then navigate to another tab without saving — sticky bar persists across panels; closing tab triggers browser confirm
5. Click "Delete account" in Privacy → AlertDialog opens → focus is on Cancel by default → Tab to "Yes, delete…" → Enter → confirm
6. Toggle 2FA Switch on/off — no AlertDialog yet (note: design choice; could be added)
7. Resize from 1280px → 320px — sidebar disappears, mobile nav appears, no horizontal scroll
8. Tab through entire page with keyboard only — all controls reachable
9. Run `axe-core` via Chrome devtools or `npx @axe-core/cli http://localhost:3000/dashboard/settings` — 0 critical, 0 serious

**Code-reviewer / qa-tester / security-audit skills** (loaded before this agent):
- `code-reviewer` — diff review for: clean component boundaries, no prop drilling, no hidden side effects, proper use of RHF context
- `qa-tester` — run the 9-step manual flow above; document any failures in a `docs/superpowers/plans/2026-06-01-settings-redesign-qa.md` report
- `security-audit` — verify: CSRF protection on server actions (Next.js Server Actions are CSRF-protected by default ✓), no PII in client logs, no secrets in client bundle, `deleteAccount` requires typed-confirmation string before action runs, `updatePassword` requires `currentPassword` to be re-entered

**Done when:**
- `npm run typecheck` clean
- `npm run lint` clean (or new errors documented)
- All WCAG checks above pass
- All 9 manual QA steps pass
- QA report saved to `docs/superpowers/plans/2026-06-01-settings-redesign-qa.md`

---

## 3. Dependency Notes

**Already installed** (verify in `package.json` before re-adding):
- `react-hook-form@^7.74.0` ✓
- `@hookform/resolvers@^5.2.2` ✓
- `zod@^3.22.0` ✓
- `sonner@^2.0.7` ✓
- `@radix-ui/react-slot@^1.2.4` ✓
- `lucide-react@^1.11.0` ✓ (note: this version is unusually high — confirm it exports the icons in the nav config; if not, downgrade to `^0.460.0`)
- `class-variance-authority@^0.7.1` ✓
- `clsx@^2.1.1` ✓
- `tailwind-merge@^3.5.0` ✓

**May need to install:**
- `framer-motion` — required by `PanelTransition`. Run `npm install framer-motion` from `apps/web`.
- Radix primitives pulled in by `npx shadcn-ui@latest add <name>`: `react-label`, `react-switch`, `react-select`, `react-radio-group`, `react-alert-dialog`, `react-checkbox`, `react-tabs` (only if using `Tabs` internally).

**Don't install** (anti-pattern for this scope):
- `next-themes` — Appearance panel uses a local `theme` field; persist via server action, not client theme provider. Out of scope.

---

## 4. Self-Review

**Spec coverage check:**

| Requirement (from user) | Covered by |
|---|---|
| Two-column layout (w-64 sidebar + content) | Agent 1 |
| Grouped settings nav (8 categories) | Agent 1 (`SETTINGS_NAV`) |
| Active route highlighting in primary token | Agent 1 (`SettingsSidebar`) |
| Mobile: shadcn Select + pill tabs | Agent 1 (`MobileSettingsNav`) |
| `max-w-6xl` container, design-system spacing | Agent 1 |
| Per-panel shadcn component breakdown | Agent 2 (table per panel) |
| React Hook Form + Zod per form | Agent 3 |
| `useTransition` + Sonner toasts | Agent 3 |
| Inline `FormMessage` errors | Agent 3 |
| `isDirty` save-button gating | Agent 3 |
| Sticky unsaved-changes bar | Agent 4 |
| AlertDialog on destructive actions | Agent 4 |
| Loader2 in submit button | Agent 4 (already in `Button` `isLoading` prop) |
| Framer Motion panel transitions | Agent 4 |
| `useBeforeUnload` for unsaved changes | Agent 4 |
| WCAG AA: heading hierarchy, labels, aria, keyboard | Agent 5 |
| Responsive collapse verification | Agent 5 |
| Sequential execution (layout → panels → forms → polish → QA) | Task list enforces this |

**Type/name consistency check:**
- `PanelId` defined once in `settings-nav.ts`, imported by every panel file. ✓
- `ActionResult<T>` defined once in `actions.ts`, returned by every action. ✓
- `useSettings()` returns `{ activePanel, setActivePanel, registerForm, isDirty, setDirty, resetActiveForm, submitActiveForm }`. Used by all panels and `StickySaveBar`. ✓
- Schemas named `*Schema`, types `*Input`. Consistent. ✓

**Placeholder scan:** No `TODO`/`TBD`/`fill in` strings in the plan. Server action bodies are explicitly stubbed with a documented return shape; integration with real persistence is out of scope and called out.

---

## 5. Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-06-01-settings-redesign.md`.**

Sequential agent execution is locked in via the task list:
- Task 5 (this plan) → Task 4 (approval) → Task 6 (Agent 1) → Task 3 (Agent 2) → Task 1 (Agent 3) → Task 7 (Agent 4) → Task 2 (Agent 5)

**Pre-launch skill loading** (per the user's request, must happen before any agent begins):
- `code-reviewer.skill.md` — for code-quality review of each agent's diff
- `qa-tester.skill.md` — for Agent 5's QA flow
- `security-audit.skill.md` — for Agent 5's security audit

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh `general-purpose` subagent per agent, with a structured prompt that includes the relevant section of this plan + the loaded skills. Review the diff after each agent, fast iteration.

2. **Inline Execution** — I implement the agents' work directly in this session, batched by agent with checkpoints. Slower wall-clock, simpler to monitor.

**Which approach?**
