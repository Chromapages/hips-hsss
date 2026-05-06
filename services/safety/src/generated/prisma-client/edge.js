
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
} = require('./runtime/edge.js')


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





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.EscalationScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  flagType: 'flagType',
  status: 'status',
  severity: 'severity',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  resolvedAt: 'resolvedAt',
  resolvedBy: 'resolvedBy',
  resolutionNote: 'resolutionNote'
};

exports.Prisma.CrisisEventScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  requesterId: 'requesterId',
  requesterRole: 'requesterRole',
  justification: 'justification',
  vaultFieldsRetrieved: 'vaultFieldsRetrieved',
  localResource: 'localResource',
  vaultAccessSucceeded: 'vaultAccessSucceeded',
  alertsDispatched: 'alertsDispatched',
  alertChannelsFired: 'alertChannelsFired',
  createdAt: 'createdAt'
};

exports.Prisma.AlertLogScalarFieldEnum = {
  id: 'id',
  escalationId: 'escalationId',
  crisisEventId: 'crisisEventId',
  channel: 'channel',
  recipient: 'recipient',
  payload: 'payload',
  status: 'status',
  sentAt: 'sentAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
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
exports.FlagType = exports.$Enums.FlagType = {
  KEYWORD_MATCH: 'KEYWORD_MATCH',
  COUNSELOR_FLAG: 'COUNSELOR_FLAG',
  REPEATED_DISTRESS: 'REPEATED_DISTRESS'
};

exports.EscalationStatus = exports.$Enums.EscalationStatus = {
  SOFT_ALERT: 'SOFT_ALERT',
  ESCALATION_REVIEW: 'ESCALATION_REVIEW',
  CRISIS_ACTIVE: 'CRISIS_ACTIVE',
  RESOLVED: 'RESOLVED'
};

exports.AlertChannel = exports.$Enums.AlertChannel = {
  SMS_PRIMARY: 'SMS_PRIMARY',
  SMS_BACKUP: 'SMS_BACKUP',
  SLACK: 'SLACK'
};

exports.Prisma.ModelName = {
  Escalation: 'Escalation',
  CrisisEvent: 'CrisisEvent',
  AlertLog: 'AlertLog'
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
      "value": "D:\\WORK\\hsss\\hips\\build\\services\\safety\\src\\generated\\prisma-client",
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
    "sourceFilePath": "D:\\WORK\\hsss\\hips\\build\\services\\safety\\prisma\\safety.prisma",
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
        "fromEnvVar": "SAFETY_DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// Safety Engine — Prisma Schema\n// Physically separated from Commerce DB and Session DB\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/prisma-client\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"SAFETY_DATABASE_URL\")\n}\n\n// ─── Escalation Record ────────────────────────────────────────────────────────\n\nmodel Escalation {\n  id             String           @id @default(uuid())\n  sessionId      String // Anon session ID — never linked to commerce User\n  flagType       FlagType\n  status         EscalationStatus @default(SOFT_ALERT)\n  severity       Int              @default(0) // 0–100, used for auto-sort\n  notes          String?\n  createdAt      DateTime         @default(now())\n  updatedAt      DateTime         @updatedAt\n  resolvedAt     DateTime?\n  resolvedBy     String? // Anon reviewer ID (from auth header)\n  resolutionNote String?\n\n  @@index([status, createdAt(sort: Desc)])\n  @@index([sessionId])\n}\n\n// ─── Crisis Event Log (immutable) ────────────────────────────────────────────\n\nmodel CrisisEvent {\n  id                   String   @id @default(uuid())\n  sessionId            String\n  requesterId          String // Anon ID of FACILITATOR or ADMIN who triggered\n  requesterRole        String // FACILITATOR | ADMIN\n  justification        String // Required, min 10 chars\n  vaultFieldsRetrieved String[] // e.g. ['emergencyContact', 'region', 'country']\n  localResource        String? // Local emergency number if region/country available\n  vaultAccessSucceeded Boolean  @default(true)\n  alertsDispatched     Boolean  @default(false)\n  alertChannelsFired   String[] // e.g. ['SMS_PRIMARY', 'SLACK']\n  createdAt            DateTime @default(now())\n\n  @@index([sessionId, createdAt])\n  @@index([requesterId])\n}\n\n// ─── Alert Log ────────────────────────────────────────────────────────────────\n\nmodel AlertLog {\n  id            String       @id @default(uuid())\n  escalationId  String? // FK to Escalation if tied to an escalation\n  crisisEventId String? // FK to CrisisEvent if tied to a crisis\n  channel       AlertChannel\n  recipient     String // Phone number or Slack channel\n  payload       Json // What was sent\n  status        String // SENT | FAILED | PENDING\n  sentAt        DateTime     @default(now())\n\n  @@index([crisisEventId])\n  @@index([escalationId])\n}\n\n// ─── Enums ───────────────────────────────────────────────────────────────────\n\nenum FlagType {\n  KEYWORD_MATCH\n  COUNSELOR_FLAG\n  REPEATED_DISTRESS\n}\n\nenum EscalationStatus {\n  SOFT_ALERT\n  ESCALATION_REVIEW\n  CRISIS_ACTIVE\n  RESOLVED\n}\n\nenum AlertChannel {\n  SMS_PRIMARY\n  SMS_BACKUP\n  SLACK\n}\n",
  "inlineSchemaHash": "e8ff31ad0427336ee6f0b890a71c1026d0bfb1b3247cb82b4fade203d10bf873",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Escalation\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"flagType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FlagType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EscalationStatus\",\"default\":\"SOFT_ALERT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"severity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"resolvedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolvedBy\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"resolutionNote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CrisisEvent\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requesterId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"requesterRole\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"justification\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vaultFieldsRetrieved\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"localResource\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vaultAccessSucceeded\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alertsDispatched\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alertChannelsFired\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AlertLog\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"uuid(4)\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"escalationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"crisisEventId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"channel\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AlertChannel\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recipient\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payload\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"FlagType\":{\"values\":[{\"name\":\"KEYWORD_MATCH\",\"dbName\":null},{\"name\":\"COUNSELOR_FLAG\",\"dbName\":null},{\"name\":\"REPEATED_DISTRESS\",\"dbName\":null}],\"dbName\":null},\"EscalationStatus\":{\"values\":[{\"name\":\"SOFT_ALERT\",\"dbName\":null},{\"name\":\"ESCALATION_REVIEW\",\"dbName\":null},{\"name\":\"CRISIS_ACTIVE\",\"dbName\":null},{\"name\":\"RESOLVED\",\"dbName\":null}],\"dbName\":null},\"AlertChannel\":{\"values\":[{\"name\":\"SMS_PRIMARY\",\"dbName\":null},{\"name\":\"SMS_BACKUP\",\"dbName\":null},{\"name\":\"SLACK\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    SAFETY_DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['SAFETY_DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.SAFETY_DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

