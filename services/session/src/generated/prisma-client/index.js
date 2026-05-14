
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}




  const path = require('path')

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.SessionRecordScalarFieldEnum = {
  id: 'id',
  anonSessionToken: 'anonSessionToken',
  sessionId: 'sessionId',
  roomId: 'roomId',
  moderatorAnonId: 'moderatorAnonId',
  participantAnonHandle: 'participantAnonHandle',
  avatarStyle: 'avatarStyle',
  avatarColor: 'avatarColor',
  status: 'status',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  recordingConsent: 'recordingConsent',
  facilitatorNotes: 'facilitatorNotes',
  facilitatorAnonId: 'facilitatorAnonId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GroupSessionRecordScalarFieldEnum = {
  id: 'id',
  sessionRecordId: 'sessionRecordId',
  groupLabel: 'groupLabel',
  maxParticipants: 'maxParticipants',
  currentParticipants: 'currentParticipants',
  lobbyActive: 'lobbyActive',
  lobbyStartedAt: 'lobbyStartedAt',
  moderatorMutedAll: 'moderatorMutedAll',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditEventScalarFieldEnum = {
  id: 'id',
  sessionRecordId: 'sessionRecordId',
  eventType: 'eventType',
  severity: 'severity',
  actorAnonId: 'actorAnonId',
  actorRole: 'actorRole',
  eventData: 'eventData',
  deviceFingerprintHash: 'deviceFingerprintHash',
  ipHash: 'ipHash',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.LiveSessionStatus = exports.$Enums.LiveSessionStatus = {
  LOBBY: 'LOBBY',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  ABANDONED: 'ABANDONED'
};

exports.AuditEventType = exports.$Enums.AuditEventType = {
  SESSION_CREATED: 'SESSION_CREATED',
  SESSION_JOINED: 'SESSION_JOINED',
  SESSION_LEFT: 'SESSION_LEFT',
  SESSION_ENDED: 'SESSION_ENDED',
  SESSION_ABANDONED: 'SESSION_ABANDONED',
  SESSION_AUTO_TEARDOWN: 'SESSION_AUTO_TEARDOWN',
  VOICE_CONNECTED: 'VOICE_CONNECTED',
  VOICE_DISCONNECTED: 'VOICE_DISCONNECTED',
  VOICE_MUTED: 'VOICE_MUTED',
  VOICE_UNMUTED: 'VOICE_UNMUTED',
  RECORDING_STARTED: 'RECORDING_STARTED',
  RECORDING_STOPPED: 'RECORDING_STOPPED',
  RECORDING_CONSENT_GRANTED: 'RECORDING_CONSENT_GRANTED',
  RECORDING_CONSENT_REVOKED: 'RECORDING_CONSENT_REVOKED',
  LOBBY_JOINED: 'LOBBY_JOINED',
  LOBBY_LEFT: 'LOBBY_LEFT',
  LOBBY_STARTED: 'LOBBY_STARTED',
  MODERATOR_MUTED_ALL: 'MODERATOR_MUTED_ALL',
  MODERATOR_UNMUTED_ALL: 'MODERATOR_UNMUTED_ALL',
  PARTICIPANT_REMOVED: 'PARTICIPANT_REMOVED',
  PARTICIPANT_ADDED: 'PARTICIPANT_ADDED',
  FLAG_RAISED: 'FLAG_RAISED',
  FLAG_RESOLVED: 'FLAG_RESOLVED',
  CRISIS_TRIGGERED: 'CRISIS_TRIGGERED',
  MODERATOR_NOTES_UPDATED: 'MODERATOR_NOTES_UPDATED',
  TOKEN_ISSUED: 'TOKEN_ISSUED',
  TOKEN_VALIDATED: 'TOKEN_VALIDATED',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED'
};

exports.AuditSeverity = exports.$Enums.AuditSeverity = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

exports.Prisma.ModelName = {
  SessionRecord: 'SessionRecord',
  GroupSessionRecord: 'GroupSessionRecord',
  AuditEvent: 'AuditEvent'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\WORK\\hsss\\hips\\build\\services\\session\\src\\generated\\prisma-client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "D:\\WORK\\hsss\\hips\\build\\services\\session\\prisma\\session.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null
  },
  "relativePath": "../../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "SESSION_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// H.I.P.S. Platform — Session DB Schema\n// Physically separated from Commerce DB; no shared DB user\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/prisma-client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"SESSION_DATABASE_URL\")\n}\n\n// Session Record — Session Service layer\n// This model tracks real-time session state (LOBBY, ACTIVE, ENDED).\n// Booking/payment sessions live in the commerce schema; real-time state lives here.\nmodel SessionRecord {\n  id               String  @id @default(uuid())\n  anonSessionToken String  @unique @map(\"anon_session_token\")\n  sessionId        String  @map(\"session_id\") // Commerce DB session reference (opaque)\n  roomId           String? @map(\"room_id\")\n  moderatorAnonId  String? @map(\"moderator_anon_id\")\n\n  // Participant info (anonymous)\n  participantAnonHandle String? @map(\"participant_anon_handle\")\n  avatarStyle           String? @map(\"avatar_style\")\n  avatarColor           String? @map(\"avatar_color\")\n\n  // Status\n  status    LiveSessionStatus @default(LOBBY)\n  startedAt DateTime?         @map(\"started_at\")\n  endedAt   DateTime?         @map(\"ended_at\")\n\n  // Consent\n  recordingConsent Boolean @default(false) @map(\"recording_consent\")\n\n  // Notes (facilitator-only, stored separately from identity)\n  facilitatorNotes  String? @map(\"facilitator_notes\")\n  facilitatorAnonId String? @map(\"facilitator_anon_id\")\n\n  // Timestamps\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  // Relations\n  auditEvents  AuditEvent[]\n  groupSession GroupSessionRecord?\n\n  @@index([sessionId]) // Cross-DB correlation for crisis escalation\n  @@index([moderatorAnonId]) // Facilitator lookup\n  @@index([participantAnonHandle]) // Participant lookup\n  @@index([status])\n  @@index([roomId])\n  @@map(\"session_record\")\n}\n\nmodel GroupSessionRecord {\n  id              String        @id @default(uuid())\n  sessionRecordId String        @unique @map(\"session_record_id\")\n  sessionRecord   SessionRecord @relation(fields: [sessionRecordId], references: [id], onDelete: Cascade)\n\n  // Group metadata\n  groupLabel          String? @map(\"group_label\")\n  maxParticipants     Int     @default(12) @map(\"max_participants\")\n  currentParticipants Int     @default(0) @map(\"current_participants\")\n\n  // Lobby state\n  lobbyActive    Boolean   @default(true) @map(\"lobby_active\")\n  lobbyStartedAt DateTime? @map(\"lobby_started_at\")\n\n  // Moderator controls\n  moderatorMutedAll Boolean @default(false) @map(\"moderator_muted_all\")\n\n  // Timestamps\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  @@map(\"group_session_record\")\n}\n\nmodel AuditEvent {\n  id              String        @id @default(uuid())\n  sessionRecordId String        @map(\"session_record_id\")\n  sessionRecord   SessionRecord @relation(fields: [sessionRecordId], references: [id], onDelete: Cascade)\n\n  // Event classification\n  eventType AuditEventType\n  severity  AuditSeverity  @default(INFO)\n\n  // Anonymous actor info\n  actorAnonId String? @map(\"actor_anon_id\")\n  actorRole   String? @map(\"actor_role\") // facilitator | participant | system\n\n  // Event details (JSON for flexibility)\n  eventData Json? @map(\"event_data\")\n\n  // Device fingerprint (hashed, not PII)\n  deviceFingerprintHash String? @map(\"device_fingerprint_hash\")\n\n  // IP address (hashed, expires after 30 days)\n  ipHash String? @map(\"ip_hash\")\n\n  // Timestamp\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  @@index([sessionRecordId])\n  @@index([eventType])\n  @@index([severity])\n  @@index([createdAt])\n  @@map(\"audit_event\")\n}\n\nenum LiveSessionStatus {\n  LOBBY\n  ACTIVE\n  ENDED\n  ABANDONED\n}\n\nenum AuditEventType {\n  // Session events\n  SESSION_CREATED\n  SESSION_JOINED\n  SESSION_LEFT\n  SESSION_ENDED\n  SESSION_ABANDONED\n  SESSION_AUTO_TEARDOWN\n\n  // Voice events\n  VOICE_CONNECTED\n  VOICE_DISCONNECTED\n  VOICE_MUTED\n  VOICE_UNMUTED\n  RECORDING_STARTED\n  RECORDING_STOPPED\n  RECORDING_CONSENT_GRANTED\n  RECORDING_CONSENT_REVOKED\n\n  // Group session events\n  LOBBY_JOINED\n  LOBBY_LEFT\n  LOBBY_STARTED\n  MODERATOR_MUTED_ALL\n  MODERATOR_UNMUTED_ALL\n  PARTICIPANT_REMOVED\n  PARTICIPANT_ADDED\n\n  // Safety events\n  FLAG_RAISED\n  FLAG_RESOLVED\n  CRISIS_TRIGGERED\n\n  // Moderator actions\n  MODERATOR_NOTES_UPDATED\n\n  // Auth events\n  TOKEN_ISSUED\n  TOKEN_VALIDATED\n  TOKEN_REFRESHED\n}\n\nenum AuditSeverity {\n  DEBUG\n  INFO\n  WARNING\n  CRITICAL\n}\n",
  "inlineSchemaHash": "f09c12919337721b76615a4bf28f009a3920fdd297a3b67869fa107bcb848aa7",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "src/generated/prisma-client",
    "generated/prisma-client",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"SessionRecord\":{\"dbName\":\"session_record\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"anonSessionToken\",\"dbName\":\"anon_session_token\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"dbName\":\"session_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"roomId\",\"dbName\":\"room_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"moderatorAnonId\",\"dbName\":\"moderator_anon_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"participantAnonHandle\",\"dbName\":\"participant_anon_handle\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarStyle\",\"dbName\":\"avatar_style\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"avatarColor\",\"dbName\":\"avatar_color\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"LiveSessionStatus\",\"default\":\"LOBBY\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startedAt\",\"dbName\":\"started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endedAt\",\"dbName\":\"ended_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recordingConsent\",\"dbName\":\"recording_consent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilitatorNotes\",\"dbName\":\"facilitator_notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilitatorAnonId\",\"dbName\":\"facilitator_anon_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"auditEvents\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditEvent\",\"relationName\":\"AuditEventToSessionRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupSession\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"GroupSessionRecord\",\"relationName\":\"GroupSessionRecordToSessionRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"GroupSessionRecord\":{\"dbName\":\"group_session_record\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionRecordId\",\"dbName\":\"session_record_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionRecord\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SessionRecord\",\"relationName\":\"GroupSessionRecordToSessionRecord\",\"relationFromFields\":[\"sessionRecordId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"groupLabel\",\"dbName\":\"group_label\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxParticipants\",\"dbName\":\"max_participants\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":12,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currentParticipants\",\"dbName\":\"current_participants\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lobbyActive\",\"dbName\":\"lobby_active\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lobbyStartedAt\",\"dbName\":\"lobby_started_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"moderatorMutedAll\",\"dbName\":\"moderator_muted_all\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"dbName\":\"updated_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AuditEvent\":{\"dbName\":\"audit_event\",\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionRecordId\",\"dbName\":\"session_record_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionRecord\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SessionRecord\",\"relationName\":\"AuditEventToSessionRecord\",\"relationFromFields\":[\"sessionRecordId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditEventType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AuditSeverity\",\"default\":\"INFO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorAnonId\",\"dbName\":\"actor_anon_id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorRole\",\"dbName\":\"actor_role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventData\",\"dbName\":\"event_data\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deviceFingerprintHash\",\"dbName\":\"device_fingerprint_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipHash\",\"dbName\":\"ip_hash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"dbName\":\"created_at\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"LiveSessionStatus\":{\"values\":[{\"name\":\"LOBBY\",\"dbName\":null},{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"ENDED\",\"dbName\":null},{\"name\":\"ABANDONED\",\"dbName\":null}],\"dbName\":null},\"AuditEventType\":{\"values\":[{\"name\":\"SESSION_CREATED\",\"dbName\":null},{\"name\":\"SESSION_JOINED\",\"dbName\":null},{\"name\":\"SESSION_LEFT\",\"dbName\":null},{\"name\":\"SESSION_ENDED\",\"dbName\":null},{\"name\":\"SESSION_ABANDONED\",\"dbName\":null},{\"name\":\"SESSION_AUTO_TEARDOWN\",\"dbName\":null},{\"name\":\"VOICE_CONNECTED\",\"dbName\":null},{\"name\":\"VOICE_DISCONNECTED\",\"dbName\":null},{\"name\":\"VOICE_MUTED\",\"dbName\":null},{\"name\":\"VOICE_UNMUTED\",\"dbName\":null},{\"name\":\"RECORDING_STARTED\",\"dbName\":null},{\"name\":\"RECORDING_STOPPED\",\"dbName\":null},{\"name\":\"RECORDING_CONSENT_GRANTED\",\"dbName\":null},{\"name\":\"RECORDING_CONSENT_REVOKED\",\"dbName\":null},{\"name\":\"LOBBY_JOINED\",\"dbName\":null},{\"name\":\"LOBBY_LEFT\",\"dbName\":null},{\"name\":\"LOBBY_STARTED\",\"dbName\":null},{\"name\":\"MODERATOR_MUTED_ALL\",\"dbName\":null},{\"name\":\"MODERATOR_UNMUTED_ALL\",\"dbName\":null},{\"name\":\"PARTICIPANT_REMOVED\",\"dbName\":null},{\"name\":\"PARTICIPANT_ADDED\",\"dbName\":null},{\"name\":\"FLAG_RAISED\",\"dbName\":null},{\"name\":\"FLAG_RESOLVED\",\"dbName\":null},{\"name\":\"CRISIS_TRIGGERED\",\"dbName\":null},{\"name\":\"MODERATOR_NOTES_UPDATED\",\"dbName\":null},{\"name\":\"TOKEN_ISSUED\",\"dbName\":null},{\"name\":\"TOKEN_VALIDATED\",\"dbName\":null},{\"name\":\"TOKEN_REFRESHED\",\"dbName\":null}],\"dbName\":null},\"AuditSeverity\":{\"values\":[{\"name\":\"DEBUG\",\"dbName\":null},{\"name\":\"INFO\",\"dbName\":null},{\"name\":\"WARNING\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "src/generated/prisma-client/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "src/generated/prisma-client/schema.prisma")
