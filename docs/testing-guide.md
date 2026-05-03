# H.I.P.S. Testing & QA Guide

This guide outlines the "Golden Path" for verifying the platform's core infrastructure, from anonymous onboarding to secure session facilitation.

---

## 1. The Commerce Flow (Stripe)
Verify that users can purchase session credits and that Firestore updates atomically.

- **URL**: `/services`
- **Action**: Select the "Essential Pack" (5 sessions).
- **Test Card**: Use `4242 4242 4242 4242` with any future date and CVV.
- **Success Criteria**: 
  - Redirected to `/dashboard?purchase=success`.
  - The "Package Balance" card in the dashboard shows 5 sessions.
  - A new document appears in the `packages` collection in Firestore.

---

## 2. The Facilitator Queue
Verify that leads can see and claim pending sessions.

- **Setup**: Create a session as a participant or manually via Firestore with `status: "SCHEDULED"` and `facilitatorId: null`.
- **URL**: `/facilitator/queue`
- **Role Required**: User must have `role: "FACILITATOR"` or `role: "ADMIN"` in their Firestore document.
- **Action**: Click "Claim Session".
- **Success Criteria**: 
  - Session moves from "Live Queue" to "My Assignments".
  - Firestore document updates `facilitatorId` to the current user's ID.

---

## 3. The Virtual Sanctuary (LiveKit)
Verify voice masking and anonymous 3D presence.

- **URL**: `/session/[SESSION_ID]`
- **Action**: Join the room with two different browser windows (one as Participant, one as Facilitator).
- **Verification**:
  - **Voice**: Speak into one mic; verify the other end hears the shifted, masked voice (Hard Anonymity).
  - **Visuals**: Verify the 3D avatar pulse matches the speaking volume.
  - **Controls**: Facilitator should see "Lead" controls (Mute/Kick), Participant should not.

---

## 4. Admin Control Plane
Verify platform oversight and role management.

- **URL**: `/admin`
- **Role Required**: User must have `role: "ADMIN"`.
- **Action**: Go to **User Ops** (`/admin/users`).
- **Test**: Promote a Participant to a Facilitator.
- **Success Criteria**: 
  - Toast notification confirms success.
  - Refreshing the page shows the updated role.
  - The user can now access `/facilitator` routes.

---

## 5. Security & Middleware
Verify that unauthenticated or unauthorized users are blocked.

- **Test A**: Clear cookies and try to access `/dashboard`. (Should redirect to `/login`).
- **Test B**: Log in as a Participant and try to access `/admin`. (Should redirect to `/dashboard`).
- **Test C**: Try to call `/api/facilitator/claim` without a Bearer token. (Should return `401 Unauthorized`).

---

### Useful Commands for Testing
```bash
# View server logs in real-time
# (The dev server is already running in the background terminal)

# Check Firestore document directly
# Open your Firebase Console -> Firestore -> 'sessions' or 'packages'
```
