# Firestore Real-Time Layer — H.I.P.S. Platform

> **Design principle:** Firestore is a *real-time supplement*, not a source of truth.
> Compliance-critical data (vault PII, session records, scholarships, donations) stays in PostgreSQL.
> Firestore handles ephemeral real-time state: presence, chat, flag notifications, live room updates.

---

## Collection Overview

```
Firestore
├── rooms/{roomId}                    # LiveKit group session room state
│   └── participants/{anonId}         # Per-room participant presence
├── sessions/{sessionId}/flags/{flagId} # Real-time safety flag events
├── vaultAccessLogs/{logId}            # Real-time vault access mirror (append-only)
└── sessions/{sessionId}/messages/{msgId} # Ephemeral chat messages (TTL: 24h)
```

---

## `rooms/{roomId}` — LiveKit Room State

Firestore is ideal here: rooms have a short lifespan, need real-time participant lists, and don't require complex relational queries.

```typescript
interface RoomDocument {
  roomId: string           // LiveKit room name — matches GroupSessionRecord.roomId
  status: 'LOBBY' | 'LIVE' | 'ENDED' | 'CANCELLED'
  moderatorAnonId: string  // anon facilitator token — never Clerk ID

  // Scheduling
  scheduledAt: Timestamp
  startedAt: Timestamp | null
  endedAt: Timestamp | null

  // Limits
  maxParticipants: number  // default 12

  // Denormalized counters (updated via distributed counter or on-write)
  participantCount: number

  // Reference back to PostgreSQL source of truth
  groupSessionRecordId: string | null  // FK to GroupSessionRecord, set on creation

  // Service context
  serviceId: string | null
  serviceName: string | null  // denormalized for display

  // Crisis state — if true, room shows crisis overlay to all participants
  crisisActive: boolean
  crisisFlagId: string | null  // FK to CrisisFlag in PostgreSQL

  // Last updated for cache invalidation
  updatedAt: Timestamp
}
```

**Query patterns:**
- `rooms` collection → filter by `status == 'LIVE'` → all active rooms
- `rooms/{roomId}` → single room get
- `rooms/{roomId}/participants` → all participants in a room (via client SDK listener)

**⚠️ Security rules:**
```javascript
match /rooms/{roomId} {
  // Anyone authenticated (Firebase UID) can read active rooms
  allow read: if request.auth != null && resource.data.status in ['LOBBY', 'LIVE'];

  // Only the moderator (verified via custom claim or ID token) can write room state
  allow write: if request.auth != null
    && request.token.role in ['FACILITATOR', 'ADMIN']
    && request.auth.uid == resource.data.moderatorAnonId;
}
```

---

## `rooms/{roomId}/participants/{anonId}` — Participant Presence

Presence is the strongest Firestore use case here. Short-lived, frequently updated, benefits from real-time listeners.

```typescript
interface ParticipantDocument {
  anonId: string          // anonymous session token, NOT Clerk ID
  displayName: string     // anonymous handle ("Room 7 Participant 3")
  displayNameUpdatedAt: Timestamp

  role: 'moderator' | 'participant' | 'observer'

  // Media state
  audioEnabled: boolean
  videoEnabled: boolean
  handRaised: boolean

  // Presence timestamps
  joinedAt: Timestamp
  lastSeenAt: Timestamp   // heartbeat every 30s
  leftAt: Timestamp | null

  // Connection quality (for UI indicator)
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown'
}
```

**Query patterns:**
- `rooms/{roomId}/participants` → real-time participant list via `onSnapshot`
- Filter by `leftAt == null` → active participants only

**⚠️ Security rules:**
```javascript
match /rooms/{roomId}/participants/{anonId} {
  // Participants can read the participant list
  allow read: if request.auth != null;

  // Participants can only write their own presence doc
  allow write: if request.auth != null && request.auth.uid == anonId;

  // Moderator can write any participant doc (to kick/mute)
  allow write: if request.auth != null
    && request.token.role in ['FACILITATOR', 'ADMIN'];
}
```

---

## `sessions/{sessionId}/flags/{flagId}` — Real-Time Safety Flags

This is a real-time *notification* channel. The authoritative flag record lives in PostgreSQL (`CrisisFlag` table). Firestore holds the live event stream so clients can subscribe to flag updates without polling.

```typescript
interface SessionFlagDocument {
  flagId: string

  // Flag identity
  flagType: 'concern' | 'crisis' | 'technical' | 'other'

  // Type mapping (session → safety)
  safetyFlagType: 'COUNSELOR_FLAG' | 'KEYWORD_MATCH' | 'REPEATED_DISTRESS'

  // Context
  sessionId: string
  roomId: string | null

  // Actor (always anon token in session layer)
  actorAnonId: string
  actorRole: string
  description: string | null

  // Lifecycle
  createdAt: Timestamp
  resolvedAt: Timestamp | null
  resolvedBy: string | null  // Clerk ID of resolving admin
  resolution: string | null

  // Link to PostgreSQL source of truth
  crisisFlagId: string | null  // FK to CrisisFlag — set once persisted
  syncedToPostgres: boolean    // false until CrisisFlag record created
}
```

**Query patterns:**
- `sessions/{sessionId}/flags` → all flags for a session, ordered by `createdAt desc`
- Filter by `resolvedAt == null` → active flags only

**⚠️ Security rules:**
```javascript
match /sessions/{sessionId}/flags/{flagId} {
  // Facilitators and admins can read flags for their session
  allow read: if request.auth != null
    && request.token.role in ['FACILITATOR', 'ADMIN'];

  // Only the safety engine (Firebase custom claim `SYSTEM`) can create flags
  allow create: if request.auth != null && request.token.role == 'SYSTEM';

  // Facilitators can resolve flags (set resolvedAt)
  allow update: if request.auth != null
    && request.token.role in ['FACILITATOR', 'ADMIN']
    && resource.data.resolvedAt == null;  // immutable once resolved
}
```

**Sync strategy:** When a flag is created in Firestore, the Safety service simultaneously writes to PostgreSQL. Once the `CrisisFlag` record exists, `syncedToPostgres = true` and `crisisFlagId` is set. The Firestore doc is the real-time channel; PostgreSQL is the audit-of-record.

---

## `vaultAccessLogs/{logId}` — Real-Time Vault Access Mirror

Vault access logs are insert-only and compliance-critical. PostgreSQL is the source of truth. Firestore is a *read cache* so the admin dashboard can subscribe to new access events in real-time without polling.

```typescript
interface VaultAccessLogDocument {
  logId: string
  logType: 'CONSENT' | 'CRISIS' | 'ADMIN_REVIEW' | 'EXPORT'

  // Who accessed what
  requesterId: string       // Clerk ID or anon facilitator token
  requesterRole: string
  vaultRecordId: string     // FK to IdentityRecord

  // Justification (required, immutable)
  justification: string

  // What was accessed
  accessedFields: string[]   // ['email', 'phone', 'name'] — not the values

  // Timestamp
  accessedAt: Timestamp

  // Audit trail linkage
  auditEventId: string | null  // FK to AuditEvent in PostgreSQL

  // Sync state
  syncedToPostgres: boolean
}
```

**Query patterns:**
- `vaultAccessLogs` → ordered by `accessedAt desc` → admin dashboard feed
- Filter by `syncedToPostgres == false` → batch reconciliation job

**⚠️ Security rules:**
```javascript
match /vaultAccessLogs/{logId} {
  // Admins can read the access log
  allow read: if request.auth != null && request.token.role == 'ADMIN';

  // Append-only: no updates, no deletes
  allow create: if request.auth != null && request.token.role in ['SYSTEM', 'ADMIN'];

  allow update: if false;   // immutable
  allow delete: if false;    // never deleted
}
```

**Sync:** A background Cloud Function (or Cloud Run worker) watches `vaultAccessLogs` for `syncedToPostgres == false` and batches writes to PostgreSQL's `VaultAccessLog` table. Idempotent via `logId`.

---

## `sessions/{sessionId}/messages/{msgId}` — Ephemeral Chat Messages

Chat messages are ephemeral (TTL: 24 hours), not compliance-critical, and benefit from Firestore's real-time delivery. They are **not** written to PostgreSQL (per the PII separation principle — chat could contain sensitive content).

```typescript
interface ChatMessage {
  msgId: string

  senderAnonId: string       // anon session token — NOT Clerk ID
  senderRole: string         // 'participant' | 'facilitator'
  senderDisplayName: string  // snapshot of anonymous handle at send time

  // Content — stored encrypted at rest via Firestore encryption at rest (default)
  // For HIPAA extra layer: encrypt client-side before writing
  content: string            // max 2000 chars

  // Client-set encryption envelope (optional additional layer)
  encryptionKeyId: string | null

  // Message type
  type: 'text' | 'system' | 'flag_alert'
  // 'system' = "Alex joined the room", 'flag_alert' = safety flag raised notice

  // Soft delete (for moderation, not retention)
  deletedAt: Timestamp | null
  deletedBy: string | null

  // Timestamps
  createdAt: Timestamp

  // TTL: Firestore TTL field set to createdAt + 24 hours
  _ttl: Timestamp  // Firestore TTL index — auto-deletes after 24h
}
```

**Query patterns:**
- `sessions/{sessionId}/messages` → last 50 messages on load, then real-time `onSnapshot` for new messages
- Filter by `deletedAt == null && type != 'system'` → user-visible messages

**⚠️ Security rules:**
```javascript
match /sessions/{sessionId}/messages/{msgId} {
  // Participants in the session can read messages
  allow read: if request.auth != null
    && request.token.sessionId == sessionId;

  // Participants can only send messages (and only their own)
  allow create: if request.auth != null
    && request.auth.uid == resource.data.senderAnonId
    && resource.data.content.size() <= 2000;

  // Facilitators can soft-delete (set deletedAt)
  allow update: if request.auth != null
    && request.token.role in ['FACILITATOR', 'ADMIN']
    && resource.data.deletedAt == null;
}
```

**⚠️ TTL:** Configure a Firestore TTL policy on the `messages` collection with index field `createdAt`, expire after 86400 seconds (24 hours). This handles GDPR "right to deletion" for chat automatically.

---

## Data Flow Diagrams

### Real-Time Flag Flow
```
Participant raises flag
        │
        ▼
Safety Service
  1. Writes CrisisFlag to PostgreSQL (source of truth)
  2. Writes SessionFlagDocument to Firestore (real-time channel)
        │
        ▼
All subscribed clients receive flag via onSnapshot
        │
        ▼
Facilitator resolves flag
  → Firestore doc updated (resolvedAt, resolvedBy)
  → PostgreSQL CrisisFlag updated (resolvedAt, resolution)
```

### Presence Flow
```
Participant joins LiveKit room
        │
        ▼
Session Service
  1. Writes to GroupSessionRecord in PostgreSQL
  2. Creates participant doc in Firestore (rooms/{roomId}/participants/{anonId})
        │
        ▼
All participants receive presence update via onSnapshot
        │
        ▼
Heartbeat (every 30s via client SDK)
  → Updates lastSeenAt in Firestore
        │
        ▼
Participant disconnects (WebSocket close)
  → Firestore listener fires with no snapshot → client marks as left
  → Cloud Function detects absence → sets leftAt in Firestore
```

---

## What Stays in PostgreSQL (Source of Truth)

| Data | PostgreSQL | Firestore |
|---|---|---|
| Group session records | ✅ `GroupSessionRecord` | ✅ Denormalized `RoomDocument` |
| Individual session records | ✅ `SessionRecord` | ❌ |
| Participant identities | ❌ anon tokens only | ✅ `ParticipantDocument` (24h TTL) |
| Safety flag records | ✅ `CrisisFlag` | ✅ `SessionFlagDocument` (synced) |
| Vault access audit | ✅ `VaultAccessLog` | ✅ `VaultAccessLogDocument` (synced) |
| Chat messages | ❌ (PII risk) | ✅ `ChatMessage` (24h TTL) |
| PII (email, name, phone) | ❌ Never stored | ❌ Never stored |
| Identity records | ✅ `IdentityRecord` (encrypted) | ❌ |

---

## Implementation Phases

### Phase 1 — Room Presence (highest value, lowest risk)
1. Add `rooms` and `rooms/{roomId}/participants` collections
2. Update Session Service to write presence to Firestore on join/leave
3. Add `useRoomPresence(roomId)` hook in the web app
4. Configure Firestore security rules

### Phase 2 — Real-Time Safety Flags
1. Add `sessions/{sessionId}/flags` collection
2. Update Safety Service to write flag events to Firestore
3. Subscribe client components to flag updates via `onSnapshot`

### Phase 3 — Vault Access Mirror
1. Add `vaultAccessLogs` collection
2. Cloud Function triggers on vault access → writes to Firestore
3. Admin dashboard subscribes to real-time access feed

### Phase 4 — Ephemeral Chat
1. Add `sessions/{sessionId}/messages` collection
2. Configure TTL policy (24h)
3. Implement `useChatMessages(sessionId)` hook
4. Client-side encryption option for extra PII protection

---

## Security Checklist

- [ ] Firestore security rules as specified above before any collection is created
- [ ] Firebase Auth custom claims (`role`, `sessionId`) set on every token — never trust client-supplied role
- [ ] Vault access logs Firestore collection is append-only (no `allow update` or `delete`)
- [ ] Chat messages TTL policy configured before the collection is written to
- [ ] No PII (real email, name, phone) in any Firestore document
- [ ] All Firestore writes from server-side (Cloud Functions, Cloud Run) for vault and safety collections
- [ ] Client SDK listeners cleaned up (`onSnapshot` unsubscribe) on component unmount to prevent memory leaks and unexpected reads after auth state changes
