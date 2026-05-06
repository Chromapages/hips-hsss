
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

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  firebaseUid: 'firebaseUid',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  description: 'description',
  category: 'category',
  standardPrice: 'standardPrice',
  scholarshipMin: 'scholarshipMin',
  scholarshipMax: 'scholarshipMax',
  durationMins: 'durationMins',
  maxSeats: 'maxSeats',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  serviceId: 'serviceId',
  facilitatorId: 'facilitatorId',
  scheduledAt: 'scheduledAt',
  status: 'status',
  pricePaid: 'pricePaid',
  isScholarship: 'isScholarship',
  scholarshipCode: 'scholarshipCode',
  stripePaymentId: 'stripePaymentId',
  packageId: 'packageId',
  sessionTokenRef: 'sessionTokenRef',
  cancelReason: 'cancelReason',
  completedAt: 'completedAt',
  confirmationEmailSent: 'confirmationEmailSent',
  balanceDueDate: 'balanceDueDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PackageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  serviceId: 'serviceId',
  totalSessions: 'totalSessions',
  usedSessions: 'usedSessions',
  pricePaid: 'pricePaid',
  expiresAt: 'expiresAt',
  stripePaymentId: 'stripePaymentId',
  status: 'status',
  isScholarship: 'isScholarship',
  discountCode: 'discountCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ScholarshipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  serviceId: 'serviceId',
  requestedAmount: 'requestedAmount',
  approvedAmount: 'approvedAmount',
  reason: 'reason',
  status: 'status',
  discountCode: 'discountCode',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  reviewNote: 'reviewNote',
  expiresAt: 'expiresAt',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DonationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  donorVaultRef: 'donorVaultRef',
  amount: 'amount',
  tier: 'tier',
  stripePaymentId: 'stripePaymentId',
  receiptSent: 'receiptSent',
  receiptSentAt: 'receiptSentAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrgInquiryScalarFieldEnum = {
  id: 'id',
  orgName: 'orgName',
  contactEmail: 'contactEmail',
  contactName: 'contactName',
  ein: 'ein',
  isNonprofit: 'isNonprofit',
  website: 'website',
  eventType: 'eventType',
  preferredDate: 'preferredDate',
  headcount: 'headcount',
  message: 'message',
  quoteAmount: 'quoteAmount',
  status: 'status',
  notes: 'notes',
  stripeLinkId: 'stripeLinkId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StripeEventScalarFieldEnum = {
  id: 'id',
  stripeEventId: 'stripeEventId',
  eventType: 'eventType',
  payload: 'payload',
  processed: 'processed',
  processedAt: 'processedAt',
  createdAt: 'createdAt'
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
exports.Role = exports.$Enums.Role = {
  PARTICIPANT: 'PARTICIPANT',
  LEADER: 'LEADER',
  ORG_BUYER: 'ORG_BUYER',
  FACILITATOR: 'FACILITATOR',
  ADMIN: 'ADMIN'
};

exports.ServiceCategory = exports.$Enums.ServiceCategory = {
  CARE_SESSION: 'CARE_SESSION',
  COACHING: 'COACHING',
  COHORT: 'COHORT',
  WORKSHOP: 'WORKSHOP',
  RETREAT: 'RETREAT',
  DIGITAL: 'DIGITAL',
  MEMBERSHIP: 'MEMBERSHIP'
};

exports.SessionStatus = exports.$Enums.SessionStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

exports.PackageStatus = exports.$Enums.PackageStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CONSUMED: 'CONSUMED'
};

exports.ScholarshipStatus = exports.$Enums.ScholarshipStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED',
  WAITLISTED: 'WAITLISTED'
};

exports.DonationTier = exports.$Enums.DonationTier = {
  SPONSOR_SESSION: 'SPONSOR_SESSION',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESTORE_LEADER: 'RESTORE_LEADER',
  CUSTOM: 'CUSTOM'
};

exports.InquiryStatus = exports.$Enums.InquiryStatus = {
  NEW: 'NEW',
  QUOTED: 'QUOTED',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Service: 'Service',
  Session: 'Session',
  Package: 'Package',
  Scholarship: 'Scholarship',
  Donation: 'Donation',
  OrgInquiry: 'OrgInquiry',
  StripeEvent: 'StripeEvent'
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
