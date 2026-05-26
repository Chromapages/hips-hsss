# HIPS Commerce Service

A dedicated NestJS microservice for handling payments, donations, and commerce operations.

## Endpoints

### POST /donations
Create a donation payment intent.

**Body:**
```json
{
  "tier": "SUPPORTER" | "BUILDER" | "SUSTAINER" | "CATALYST",
  "amountCents": 5000
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret"
}
```

### POST /checkout/session-intent
Create a payment intent for a session booking. Requires authentication.

**Headers:** `Authorization: Bearer <firebase_id_token>`

**Body:**
```json
{
  "sessionId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret"
}
```

### POST /checkout/package-intent
Create a payment intent for a package purchase.

**Headers:** `Authorization: Bearer <firebase_id_token>`

**Body:**
```json
{
  "packageId": "SINGLE" | "ESSENTIAL" | "SANCTUARY"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret",
  "packageName": "Essential Pack (5)",
  "amount": 225
}
```

### POST /packages/purchase
Purchase a package (creates package in database). Requires authentication.

**Headers:** `Authorization: Bearer <firebase_id_token>`

**Body:**
```json
{
  "serviceId": "uuid",
  "totalSessions": 5
}
```

### POST /org-inquiry
Submit an organization inquiry.

**Body:**
```json
{
  "orgName": "Organization Name",
  "contactName": "Contact Person",
  "email": "contact@org.com",
  "message": "Optional message"
}
```

**Response:**
```json
{
  "success": true,
  "inquiryId": "uuid"
}
```

### GET /donations
Get donations for the authenticated user.

### GET /packages
Get packages for the authenticated user.

## Webhooks

### POST /webhooks/stripe
Stripe webhook endpoint. Handles:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`

**Headers:** `stripe-signature: <signature>`

## Environment Variables

```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
DATABASE_URL=postgresql://...
PORT=3004
ALLOWED_ORIGINS=http://localhost:3000
```

## Running

```bash
pnpm install
pnpm build
pnpm start
```

## Development

```bash
pnpm dev
```

## Package Definitions

| Package | Price | Credits |
|---------|-------|---------|
| SINGLE | $50 | 1 session |
| ESSENTIAL | $225 | 5 sessions |
| SANCTUARY | $400 | 10 sessions |