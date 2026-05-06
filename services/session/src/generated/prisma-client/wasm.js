
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
