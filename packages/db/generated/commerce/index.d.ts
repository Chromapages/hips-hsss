
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model MfaBackupCode
 * 
 */
export type MfaBackupCode = $Result.DefaultSelection<Prisma.$MfaBackupCodePayload>
/**
 * Model MfaPendingToken
 * 
 */
export type MfaPendingToken = $Result.DefaultSelection<Prisma.$MfaPendingTokenPayload>
/**
 * Model Service
 * 
 */
export type Service = $Result.DefaultSelection<Prisma.$ServicePayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Package
 * 
 */
export type Package = $Result.DefaultSelection<Prisma.$PackagePayload>
/**
 * Model Scholarship
 * 
 */
export type Scholarship = $Result.DefaultSelection<Prisma.$ScholarshipPayload>
/**
 * Model Donation
 * 
 */
export type Donation = $Result.DefaultSelection<Prisma.$DonationPayload>
/**
 * Model OrgInquiry
 * 
 */
export type OrgInquiry = $Result.DefaultSelection<Prisma.$OrgInquiryPayload>
/**
 * Model AdminAuditLog
 * 
 */
export type AdminAuditLog = $Result.DefaultSelection<Prisma.$AdminAuditLogPayload>
/**
 * Model Attachment
 * Attachment records -- storage key lives in S3/R2/Firebase Storage.
 * Clients upload directly via signed URL; the API never proxies bytes.
 */
export type Attachment = $Result.DefaultSelection<Prisma.$AttachmentPayload>
/**
 * Model SecurityEventLog
 * 
 */
export type SecurityEventLog = $Result.DefaultSelection<Prisma.$SecurityEventLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  PARTICIPANT: 'PARTICIPANT',
  LEADER: 'LEADER',
  ORGBUYER: 'ORGBUYER',
  FACILITATOR: 'FACILITATOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ServiceCategory: {
  INDIVIDUAL_SUPPORT: 'INDIVIDUAL_SUPPORT',
  GROUP_SUPPORT: 'GROUP_SUPPORT',
  SUPPORT_NAVIGATION: 'SUPPORT_NAVIGATION',
  CRISIS_PLANNING: 'CRISIS_PLANNING',
  FAMILY_SUPPORT: 'FAMILY_SUPPORT',
  ORGANIZATION_TRAINING: 'ORGANIZATION_TRAINING'
};

export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory]


export const SessionStatus: {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const ScholarshipStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED'
};

export type ScholarshipStatus = (typeof ScholarshipStatus)[keyof typeof ScholarshipStatus]


export const DonationTier: {
  SUPPORTER: 'SUPPORTER',
  BUILDER: 'BUILDER',
  SUSTAINER: 'SUSTAINER',
  CATALYST: 'CATALYST'
};

export type DonationTier = (typeof DonationTier)[keyof typeof DonationTier]


export const InquiryStatus: {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CLOSED: 'CLOSED'
};

export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus]


export const OrgInquiryEventType: {
  WORKSHOP: 'WORKSHOP',
  RECURRING: 'RECURRING',
  CONSULTANCY: 'CONSULTANCY'
};

export type OrgInquiryEventType = (typeof OrgInquiryEventType)[keyof typeof OrgInquiryEventType]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ServiceCategory = $Enums.ServiceCategory

export const ServiceCategory: typeof $Enums.ServiceCategory

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type ScholarshipStatus = $Enums.ScholarshipStatus

export const ScholarshipStatus: typeof $Enums.ScholarshipStatus

export type DonationTier = $Enums.DonationTier

export const DonationTier: typeof $Enums.DonationTier

export type InquiryStatus = $Enums.InquiryStatus

export const InquiryStatus: typeof $Enums.InquiryStatus

export type OrgInquiryEventType = $Enums.OrgInquiryEventType

export const OrgInquiryEventType: typeof $Enums.OrgInquiryEventType

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.mfaBackupCode`: Exposes CRUD operations for the **MfaBackupCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MfaBackupCodes
    * const mfaBackupCodes = await prisma.mfaBackupCode.findMany()
    * ```
    */
  get mfaBackupCode(): Prisma.MfaBackupCodeDelegate<ExtArgs>;

  /**
   * `prisma.mfaPendingToken`: Exposes CRUD operations for the **MfaPendingToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MfaPendingTokens
    * const mfaPendingTokens = await prisma.mfaPendingToken.findMany()
    * ```
    */
  get mfaPendingToken(): Prisma.MfaPendingTokenDelegate<ExtArgs>;

  /**
   * `prisma.service`: Exposes CRUD operations for the **Service** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Services
    * const services = await prisma.service.findMany()
    * ```
    */
  get service(): Prisma.ServiceDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.package`: Exposes CRUD operations for the **Package** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Packages
    * const packages = await prisma.package.findMany()
    * ```
    */
  get package(): Prisma.PackageDelegate<ExtArgs>;

  /**
   * `prisma.scholarship`: Exposes CRUD operations for the **Scholarship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Scholarships
    * const scholarships = await prisma.scholarship.findMany()
    * ```
    */
  get scholarship(): Prisma.ScholarshipDelegate<ExtArgs>;

  /**
   * `prisma.donation`: Exposes CRUD operations for the **Donation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Donations
    * const donations = await prisma.donation.findMany()
    * ```
    */
  get donation(): Prisma.DonationDelegate<ExtArgs>;

  /**
   * `prisma.orgInquiry`: Exposes CRUD operations for the **OrgInquiry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrgInquiries
    * const orgInquiries = await prisma.orgInquiry.findMany()
    * ```
    */
  get orgInquiry(): Prisma.OrgInquiryDelegate<ExtArgs>;

  /**
   * `prisma.adminAuditLog`: Exposes CRUD operations for the **AdminAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminAuditLogs
    * const adminAuditLogs = await prisma.adminAuditLog.findMany()
    * ```
    */
  get adminAuditLog(): Prisma.AdminAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.attachment`: Exposes CRUD operations for the **Attachment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attachments
    * const attachments = await prisma.attachment.findMany()
    * ```
    */
  get attachment(): Prisma.AttachmentDelegate<ExtArgs>;

  /**
   * `prisma.securityEventLog`: Exposes CRUD operations for the **SecurityEventLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecurityEventLogs
    * const securityEventLogs = await prisma.securityEventLog.findMany()
    * ```
    */
  get securityEventLog(): Prisma.SecurityEventLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.1.0
   * Query Engine version: 11f085a2012c0f4778414c8db2651556ee0ef959
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    MfaBackupCode: 'MfaBackupCode',
    MfaPendingToken: 'MfaPendingToken',
    Service: 'Service',
    Session: 'Session',
    Package: 'Package',
    Scholarship: 'Scholarship',
    Donation: 'Donation',
    OrgInquiry: 'OrgInquiry',
    AdminAuditLog: 'AdminAuditLog',
    Attachment: 'Attachment',
    SecurityEventLog: 'SecurityEventLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "mfaBackupCode" | "mfaPendingToken" | "service" | "session" | "package" | "scholarship" | "donation" | "orgInquiry" | "adminAuditLog" | "attachment" | "securityEventLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      MfaBackupCode: {
        payload: Prisma.$MfaBackupCodePayload<ExtArgs>
        fields: Prisma.MfaBackupCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MfaBackupCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          findFirst: {
            args: Prisma.MfaBackupCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MfaBackupCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          findMany: {
            args: Prisma.MfaBackupCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>[]
          }
          create: {
            args: Prisma.MfaBackupCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          createMany: {
            args: Prisma.MfaBackupCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MfaBackupCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>[]
          }
          delete: {
            args: Prisma.MfaBackupCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          update: {
            args: Prisma.MfaBackupCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          deleteMany: {
            args: Prisma.MfaBackupCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MfaBackupCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MfaBackupCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaBackupCodePayload>
          }
          aggregate: {
            args: Prisma.MfaBackupCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMfaBackupCode>
          }
          groupBy: {
            args: Prisma.MfaBackupCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<MfaBackupCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.MfaBackupCodeCountArgs<ExtArgs>
            result: $Utils.Optional<MfaBackupCodeCountAggregateOutputType> | number
          }
        }
      }
      MfaPendingToken: {
        payload: Prisma.$MfaPendingTokenPayload<ExtArgs>
        fields: Prisma.MfaPendingTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MfaPendingTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MfaPendingTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          findFirst: {
            args: Prisma.MfaPendingTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MfaPendingTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          findMany: {
            args: Prisma.MfaPendingTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>[]
          }
          create: {
            args: Prisma.MfaPendingTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          createMany: {
            args: Prisma.MfaPendingTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MfaPendingTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>[]
          }
          delete: {
            args: Prisma.MfaPendingTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          update: {
            args: Prisma.MfaPendingTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          deleteMany: {
            args: Prisma.MfaPendingTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MfaPendingTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MfaPendingTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MfaPendingTokenPayload>
          }
          aggregate: {
            args: Prisma.MfaPendingTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMfaPendingToken>
          }
          groupBy: {
            args: Prisma.MfaPendingTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<MfaPendingTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.MfaPendingTokenCountArgs<ExtArgs>
            result: $Utils.Optional<MfaPendingTokenCountAggregateOutputType> | number
          }
        }
      }
      Service: {
        payload: Prisma.$ServicePayload<ExtArgs>
        fields: Prisma.ServiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findFirst: {
            args: Prisma.ServiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          findMany: {
            args: Prisma.ServiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          create: {
            args: Prisma.ServiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          createMany: {
            args: Prisma.ServiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>[]
          }
          delete: {
            args: Prisma.ServiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          update: {
            args: Prisma.ServiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          deleteMany: {
            args: Prisma.ServiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServicePayload>
          }
          aggregate: {
            args: Prisma.ServiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateService>
          }
          groupBy: {
            args: Prisma.ServiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServiceCountArgs<ExtArgs>
            result: $Utils.Optional<ServiceCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Package: {
        payload: Prisma.$PackagePayload<ExtArgs>
        fields: Prisma.PackageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PackageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PackageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findFirst: {
            args: Prisma.PackageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PackageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          findMany: {
            args: Prisma.PackageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          create: {
            args: Prisma.PackageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          createMany: {
            args: Prisma.PackageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PackageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>[]
          }
          delete: {
            args: Prisma.PackageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          update: {
            args: Prisma.PackageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          deleteMany: {
            args: Prisma.PackageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PackageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PackageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PackagePayload>
          }
          aggregate: {
            args: Prisma.PackageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePackage>
          }
          groupBy: {
            args: Prisma.PackageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PackageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PackageCountArgs<ExtArgs>
            result: $Utils.Optional<PackageCountAggregateOutputType> | number
          }
        }
      }
      Scholarship: {
        payload: Prisma.$ScholarshipPayload<ExtArgs>
        fields: Prisma.ScholarshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScholarshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScholarshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          findFirst: {
            args: Prisma.ScholarshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScholarshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          findMany: {
            args: Prisma.ScholarshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>[]
          }
          create: {
            args: Prisma.ScholarshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          createMany: {
            args: Prisma.ScholarshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScholarshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>[]
          }
          delete: {
            args: Prisma.ScholarshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          update: {
            args: Prisma.ScholarshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          deleteMany: {
            args: Prisma.ScholarshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScholarshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ScholarshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScholarshipPayload>
          }
          aggregate: {
            args: Prisma.ScholarshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScholarship>
          }
          groupBy: {
            args: Prisma.ScholarshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScholarshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScholarshipCountArgs<ExtArgs>
            result: $Utils.Optional<ScholarshipCountAggregateOutputType> | number
          }
        }
      }
      Donation: {
        payload: Prisma.$DonationPayload<ExtArgs>
        fields: Prisma.DonationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DonationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DonationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          findFirst: {
            args: Prisma.DonationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DonationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          findMany: {
            args: Prisma.DonationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>[]
          }
          create: {
            args: Prisma.DonationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          createMany: {
            args: Prisma.DonationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DonationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>[]
          }
          delete: {
            args: Prisma.DonationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          update: {
            args: Prisma.DonationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          deleteMany: {
            args: Prisma.DonationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DonationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DonationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DonationPayload>
          }
          aggregate: {
            args: Prisma.DonationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDonation>
          }
          groupBy: {
            args: Prisma.DonationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DonationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DonationCountArgs<ExtArgs>
            result: $Utils.Optional<DonationCountAggregateOutputType> | number
          }
        }
      }
      OrgInquiry: {
        payload: Prisma.$OrgInquiryPayload<ExtArgs>
        fields: Prisma.OrgInquiryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrgInquiryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrgInquiryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          findFirst: {
            args: Prisma.OrgInquiryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrgInquiryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          findMany: {
            args: Prisma.OrgInquiryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>[]
          }
          create: {
            args: Prisma.OrgInquiryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          createMany: {
            args: Prisma.OrgInquiryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrgInquiryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>[]
          }
          delete: {
            args: Prisma.OrgInquiryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          update: {
            args: Prisma.OrgInquiryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          deleteMany: {
            args: Prisma.OrgInquiryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrgInquiryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrgInquiryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrgInquiryPayload>
          }
          aggregate: {
            args: Prisma.OrgInquiryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrgInquiry>
          }
          groupBy: {
            args: Prisma.OrgInquiryGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrgInquiryGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrgInquiryCountArgs<ExtArgs>
            result: $Utils.Optional<OrgInquiryCountAggregateOutputType> | number
          }
        }
      }
      AdminAuditLog: {
        payload: Prisma.$AdminAuditLogPayload<ExtArgs>
        fields: Prisma.AdminAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          findFirst: {
            args: Prisma.AdminAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          findMany: {
            args: Prisma.AdminAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>[]
          }
          create: {
            args: Prisma.AdminAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          createMany: {
            args: Prisma.AdminAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>[]
          }
          delete: {
            args: Prisma.AdminAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          update: {
            args: Prisma.AdminAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AdminAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminAuditLogPayload>
          }
          aggregate: {
            args: Prisma.AdminAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminAuditLog>
          }
          groupBy: {
            args: Prisma.AdminAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AdminAuditLogCountAggregateOutputType> | number
          }
        }
      }
      Attachment: {
        payload: Prisma.$AttachmentPayload<ExtArgs>
        fields: Prisma.AttachmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AttachmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AttachmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          findFirst: {
            args: Prisma.AttachmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AttachmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          findMany: {
            args: Prisma.AttachmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>[]
          }
          create: {
            args: Prisma.AttachmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          createMany: {
            args: Prisma.AttachmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AttachmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>[]
          }
          delete: {
            args: Prisma.AttachmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          update: {
            args: Prisma.AttachmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          deleteMany: {
            args: Prisma.AttachmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AttachmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AttachmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AttachmentPayload>
          }
          aggregate: {
            args: Prisma.AttachmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttachment>
          }
          groupBy: {
            args: Prisma.AttachmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AttachmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AttachmentCountArgs<ExtArgs>
            result: $Utils.Optional<AttachmentCountAggregateOutputType> | number
          }
        }
      }
      SecurityEventLog: {
        payload: Prisma.$SecurityEventLogPayload<ExtArgs>
        fields: Prisma.SecurityEventLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecurityEventLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecurityEventLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          findFirst: {
            args: Prisma.SecurityEventLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecurityEventLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          findMany: {
            args: Prisma.SecurityEventLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>[]
          }
          create: {
            args: Prisma.SecurityEventLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          createMany: {
            args: Prisma.SecurityEventLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SecurityEventLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>[]
          }
          delete: {
            args: Prisma.SecurityEventLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          update: {
            args: Prisma.SecurityEventLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          deleteMany: {
            args: Prisma.SecurityEventLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecurityEventLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SecurityEventLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityEventLogPayload>
          }
          aggregate: {
            args: Prisma.SecurityEventLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurityEventLog>
          }
          groupBy: {
            args: Prisma.SecurityEventLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecurityEventLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecurityEventLogCountArgs<ExtArgs>
            result: $Utils.Optional<SecurityEventLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    packages: number
    scholarships: number
    donations: number
    mfaBackupCodes: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    packages?: boolean | UserCountOutputTypeCountPackagesArgs
    scholarships?: boolean | UserCountOutputTypeCountScholarshipsArgs
    donations?: boolean | UserCountOutputTypeCountDonationsArgs
    mfaBackupCodes?: boolean | UserCountOutputTypeCountMfaBackupCodesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPackagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountScholarshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScholarshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDonationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DonationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMfaBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MfaBackupCodeWhereInput
  }


  /**
   * Count Type ServiceCountOutputType
   */

  export type ServiceCountOutputType = {
    sessions: number
    packages: number
  }

  export type ServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ServiceCountOutputTypeCountSessionsArgs
    packages?: boolean | ServiceCountOutputTypeCountPackagesArgs
  }

  // Custom InputTypes
  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServiceCountOutputType
     */
    select?: ServiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountPackagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageWhereInput
  }


  /**
   * Count Type PackageCountOutputType
   */

  export type PackageCountOutputType = {
    sessions: number
  }

  export type PackageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | PackageCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * PackageCountOutputType without action
   */
  export type PackageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PackageCountOutputType
     */
    select?: PackageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PackageCountOutputType without action
   */
  export type PackageCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    role: $Enums.UserRole | null
    deletedAt: Date | null
    suspendedAt: Date | null
    suspendedBy: string | null
    suspensionReason: string | null
    mfaEnabled: boolean | null
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    mfaEnrolledAt: Date | null
    lastMfaVerifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    email: string | null
    role: $Enums.UserRole | null
    deletedAt: Date | null
    suspendedAt: Date | null
    suspendedBy: string | null
    suspensionReason: string | null
    mfaEnabled: boolean | null
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    mfaEnrolledAt: Date | null
    lastMfaVerifiedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firebaseUid: number
    email: number
    role: number
    deletedAt: number
    suspendedAt: number
    suspendedBy: number
    suspensionReason: number
    mfaEnabled: number
    mfaSecretEnc: number
    mfaSecretIv: number
    mfaSecretTag: number
    mfaEnrolledAt: number
    lastMfaVerifiedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    role?: true
    deletedAt?: true
    suspendedAt?: true
    suspendedBy?: true
    suspensionReason?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    mfaEnrolledAt?: true
    lastMfaVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    role?: true
    deletedAt?: true
    suspendedAt?: true
    suspendedBy?: true
    suspensionReason?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    mfaEnrolledAt?: true
    lastMfaVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firebaseUid?: true
    email?: true
    role?: true
    deletedAt?: true
    suspendedAt?: true
    suspendedBy?: true
    suspensionReason?: true
    mfaEnabled?: true
    mfaSecretEnc?: true
    mfaSecretIv?: true
    mfaSecretTag?: true
    mfaEnrolledAt?: true
    lastMfaVerifiedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    firebaseUid: string
    email: string
    role: $Enums.UserRole
    deletedAt: Date | null
    suspendedAt: Date | null
    suspendedBy: string | null
    suspensionReason: string | null
    mfaEnabled: boolean
    mfaSecretEnc: string | null
    mfaSecretIv: string | null
    mfaSecretTag: string | null
    mfaEnrolledAt: Date | null
    lastMfaVerifiedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    role?: boolean
    deletedAt?: boolean
    suspendedAt?: boolean
    suspendedBy?: boolean
    suspensionReason?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    mfaEnrolledAt?: boolean
    lastMfaVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    packages?: boolean | User$packagesArgs<ExtArgs>
    scholarships?: boolean | User$scholarshipsArgs<ExtArgs>
    donations?: boolean | User$donationsArgs<ExtArgs>
    mfaBackupCodes?: boolean | User$mfaBackupCodesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    role?: boolean
    deletedAt?: boolean
    suspendedAt?: boolean
    suspendedBy?: boolean
    suspensionReason?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    mfaEnrolledAt?: boolean
    lastMfaVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firebaseUid?: boolean
    email?: boolean
    role?: boolean
    deletedAt?: boolean
    suspendedAt?: boolean
    suspendedBy?: boolean
    suspensionReason?: boolean
    mfaEnabled?: boolean
    mfaSecretEnc?: boolean
    mfaSecretIv?: boolean
    mfaSecretTag?: boolean
    mfaEnrolledAt?: boolean
    lastMfaVerifiedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    packages?: boolean | User$packagesArgs<ExtArgs>
    scholarships?: boolean | User$scholarshipsArgs<ExtArgs>
    donations?: boolean | User$donationsArgs<ExtArgs>
    mfaBackupCodes?: boolean | User$mfaBackupCodesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      packages: Prisma.$PackagePayload<ExtArgs>[]
      scholarships: Prisma.$ScholarshipPayload<ExtArgs>[]
      donations: Prisma.$DonationPayload<ExtArgs>[]
      mfaBackupCodes: Prisma.$MfaBackupCodePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firebaseUid: string
      email: string
      role: $Enums.UserRole
      deletedAt: Date | null
      suspendedAt: Date | null
      suspendedBy: string | null
      suspensionReason: string | null
      mfaEnabled: boolean
      mfaSecretEnc: string | null
      mfaSecretIv: string | null
      mfaSecretTag: string | null
      mfaEnrolledAt: Date | null
      lastMfaVerifiedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    packages<T extends User$packagesArgs<ExtArgs> = {}>(args?: Subset<T, User$packagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany"> | Null>
    scholarships<T extends User$scholarshipsArgs<ExtArgs> = {}>(args?: Subset<T, User$scholarshipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findMany"> | Null>
    donations<T extends User$donationsArgs<ExtArgs> = {}>(args?: Subset<T, User$donationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findMany"> | Null>
    mfaBackupCodes<T extends User$mfaBackupCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$mfaBackupCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly firebaseUid: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
    readonly suspendedAt: FieldRef<"User", 'DateTime'>
    readonly suspendedBy: FieldRef<"User", 'String'>
    readonly suspensionReason: FieldRef<"User", 'String'>
    readonly mfaEnabled: FieldRef<"User", 'Boolean'>
    readonly mfaSecretEnc: FieldRef<"User", 'String'>
    readonly mfaSecretIv: FieldRef<"User", 'String'>
    readonly mfaSecretTag: FieldRef<"User", 'String'>
    readonly mfaEnrolledAt: FieldRef<"User", 'DateTime'>
    readonly lastMfaVerifiedAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.packages
   */
  export type User$packagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    where?: PackageWhereInput
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    cursor?: PackageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * User.scholarships
   */
  export type User$scholarshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    where?: ScholarshipWhereInput
    orderBy?: ScholarshipOrderByWithRelationInput | ScholarshipOrderByWithRelationInput[]
    cursor?: ScholarshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScholarshipScalarFieldEnum | ScholarshipScalarFieldEnum[]
  }

  /**
   * User.donations
   */
  export type User$donationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    where?: DonationWhereInput
    orderBy?: DonationOrderByWithRelationInput | DonationOrderByWithRelationInput[]
    cursor?: DonationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DonationScalarFieldEnum | DonationScalarFieldEnum[]
  }

  /**
   * User.mfaBackupCodes
   */
  export type User$mfaBackupCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    where?: MfaBackupCodeWhereInput
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    cursor?: MfaBackupCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model MfaBackupCode
   */

  export type AggregateMfaBackupCode = {
    _count: MfaBackupCodeCountAggregateOutputType | null
    _min: MfaBackupCodeMinAggregateOutputType | null
    _max: MfaBackupCodeMaxAggregateOutputType | null
  }

  export type MfaBackupCodeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type MfaBackupCodeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    codeHash: string | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type MfaBackupCodeCountAggregateOutputType = {
    id: number
    userId: number
    codeHash: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type MfaBackupCodeMinAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
  }

  export type MfaBackupCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
  }

  export type MfaBackupCodeCountAggregateInputType = {
    id?: true
    userId?: true
    codeHash?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MfaBackupCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaBackupCode to aggregate.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MfaBackupCodes
    **/
    _count?: true | MfaBackupCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MfaBackupCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MfaBackupCodeMaxAggregateInputType
  }

  export type GetMfaBackupCodeAggregateType<T extends MfaBackupCodeAggregateArgs> = {
        [P in keyof T & keyof AggregateMfaBackupCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMfaBackupCode[P]>
      : GetScalarType<T[P], AggregateMfaBackupCode[P]>
  }




  export type MfaBackupCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MfaBackupCodeWhereInput
    orderBy?: MfaBackupCodeOrderByWithAggregationInput | MfaBackupCodeOrderByWithAggregationInput[]
    by: MfaBackupCodeScalarFieldEnum[] | MfaBackupCodeScalarFieldEnum
    having?: MfaBackupCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MfaBackupCodeCountAggregateInputType | true
    _min?: MfaBackupCodeMinAggregateInputType
    _max?: MfaBackupCodeMaxAggregateInputType
  }

  export type MfaBackupCodeGroupByOutputType = {
    id: string
    userId: string
    codeHash: string
    usedAt: Date | null
    createdAt: Date
    _count: MfaBackupCodeCountAggregateOutputType | null
    _min: MfaBackupCodeMinAggregateOutputType | null
    _max: MfaBackupCodeMaxAggregateOutputType | null
  }

  type GetMfaBackupCodeGroupByPayload<T extends MfaBackupCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MfaBackupCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MfaBackupCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MfaBackupCodeGroupByOutputType[P]>
            : GetScalarType<T[P], MfaBackupCodeGroupByOutputType[P]>
        }
      >
    >


  export type MfaBackupCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfaBackupCode"]>

  export type MfaBackupCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mfaBackupCode"]>

  export type MfaBackupCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    codeHash?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type MfaBackupCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MfaBackupCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MfaBackupCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MfaBackupCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      codeHash: string
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["mfaBackupCode"]>
    composites: {}
  }

  type MfaBackupCodeGetPayload<S extends boolean | null | undefined | MfaBackupCodeDefaultArgs> = $Result.GetResult<Prisma.$MfaBackupCodePayload, S>

  type MfaBackupCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MfaBackupCodeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MfaBackupCodeCountAggregateInputType | true
    }

  export interface MfaBackupCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MfaBackupCode'], meta: { name: 'MfaBackupCode' } }
    /**
     * Find zero or one MfaBackupCode that matches the filter.
     * @param {MfaBackupCodeFindUniqueArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MfaBackupCodeFindUniqueArgs>(args: SelectSubset<T, MfaBackupCodeFindUniqueArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MfaBackupCode that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MfaBackupCodeFindUniqueOrThrowArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MfaBackupCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MfaBackupCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindFirstArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MfaBackupCodeFindFirstArgs>(args?: SelectSubset<T, MfaBackupCodeFindFirstArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MfaBackupCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindFirstOrThrowArgs} args - Arguments to find a MfaBackupCode
     * @example
     * // Get one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MfaBackupCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, MfaBackupCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MfaBackupCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MfaBackupCodes
     * const mfaBackupCodes = await prisma.mfaBackupCode.findMany()
     * 
     * // Get first 10 MfaBackupCodes
     * const mfaBackupCodes = await prisma.mfaBackupCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mfaBackupCodeWithIdOnly = await prisma.mfaBackupCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MfaBackupCodeFindManyArgs>(args?: SelectSubset<T, MfaBackupCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MfaBackupCode.
     * @param {MfaBackupCodeCreateArgs} args - Arguments to create a MfaBackupCode.
     * @example
     * // Create one MfaBackupCode
     * const MfaBackupCode = await prisma.mfaBackupCode.create({
     *   data: {
     *     // ... data to create a MfaBackupCode
     *   }
     * })
     * 
     */
    create<T extends MfaBackupCodeCreateArgs>(args: SelectSubset<T, MfaBackupCodeCreateArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MfaBackupCodes.
     * @param {MfaBackupCodeCreateManyArgs} args - Arguments to create many MfaBackupCodes.
     * @example
     * // Create many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MfaBackupCodeCreateManyArgs>(args?: SelectSubset<T, MfaBackupCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MfaBackupCodes and returns the data saved in the database.
     * @param {MfaBackupCodeCreateManyAndReturnArgs} args - Arguments to create many MfaBackupCodes.
     * @example
     * // Create many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MfaBackupCodes and only return the `id`
     * const mfaBackupCodeWithIdOnly = await prisma.mfaBackupCode.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MfaBackupCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, MfaBackupCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MfaBackupCode.
     * @param {MfaBackupCodeDeleteArgs} args - Arguments to delete one MfaBackupCode.
     * @example
     * // Delete one MfaBackupCode
     * const MfaBackupCode = await prisma.mfaBackupCode.delete({
     *   where: {
     *     // ... filter to delete one MfaBackupCode
     *   }
     * })
     * 
     */
    delete<T extends MfaBackupCodeDeleteArgs>(args: SelectSubset<T, MfaBackupCodeDeleteArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MfaBackupCode.
     * @param {MfaBackupCodeUpdateArgs} args - Arguments to update one MfaBackupCode.
     * @example
     * // Update one MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MfaBackupCodeUpdateArgs>(args: SelectSubset<T, MfaBackupCodeUpdateArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MfaBackupCodes.
     * @param {MfaBackupCodeDeleteManyArgs} args - Arguments to filter MfaBackupCodes to delete.
     * @example
     * // Delete a few MfaBackupCodes
     * const { count } = await prisma.mfaBackupCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MfaBackupCodeDeleteManyArgs>(args?: SelectSubset<T, MfaBackupCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MfaBackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MfaBackupCodes
     * const mfaBackupCode = await prisma.mfaBackupCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MfaBackupCodeUpdateManyArgs>(args: SelectSubset<T, MfaBackupCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MfaBackupCode.
     * @param {MfaBackupCodeUpsertArgs} args - Arguments to update or create a MfaBackupCode.
     * @example
     * // Update or create a MfaBackupCode
     * const mfaBackupCode = await prisma.mfaBackupCode.upsert({
     *   create: {
     *     // ... data to create a MfaBackupCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MfaBackupCode we want to update
     *   }
     * })
     */
    upsert<T extends MfaBackupCodeUpsertArgs>(args: SelectSubset<T, MfaBackupCodeUpsertArgs<ExtArgs>>): Prisma__MfaBackupCodeClient<$Result.GetResult<Prisma.$MfaBackupCodePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MfaBackupCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeCountArgs} args - Arguments to filter MfaBackupCodes to count.
     * @example
     * // Count the number of MfaBackupCodes
     * const count = await prisma.mfaBackupCode.count({
     *   where: {
     *     // ... the filter for the MfaBackupCodes we want to count
     *   }
     * })
    **/
    count<T extends MfaBackupCodeCountArgs>(
      args?: Subset<T, MfaBackupCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MfaBackupCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MfaBackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MfaBackupCodeAggregateArgs>(args: Subset<T, MfaBackupCodeAggregateArgs>): Prisma.PrismaPromise<GetMfaBackupCodeAggregateType<T>>

    /**
     * Group by MfaBackupCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaBackupCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MfaBackupCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MfaBackupCodeGroupByArgs['orderBy'] }
        : { orderBy?: MfaBackupCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MfaBackupCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMfaBackupCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MfaBackupCode model
   */
  readonly fields: MfaBackupCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MfaBackupCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MfaBackupCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MfaBackupCode model
   */ 
  interface MfaBackupCodeFieldRefs {
    readonly id: FieldRef<"MfaBackupCode", 'String'>
    readonly userId: FieldRef<"MfaBackupCode", 'String'>
    readonly codeHash: FieldRef<"MfaBackupCode", 'String'>
    readonly usedAt: FieldRef<"MfaBackupCode", 'DateTime'>
    readonly createdAt: FieldRef<"MfaBackupCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MfaBackupCode findUnique
   */
  export type MfaBackupCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where: MfaBackupCodeWhereUniqueInput
  }

  /**
   * MfaBackupCode findUniqueOrThrow
   */
  export type MfaBackupCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where: MfaBackupCodeWhereUniqueInput
  }

  /**
   * MfaBackupCode findFirst
   */
  export type MfaBackupCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaBackupCodes.
     */
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
  }

  /**
   * MfaBackupCode findFirstOrThrow
   */
  export type MfaBackupCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCode to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaBackupCodes.
     */
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
  }

  /**
   * MfaBackupCode findMany
   */
  export type MfaBackupCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter, which MfaBackupCodes to fetch.
     */
    where?: MfaBackupCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaBackupCodes to fetch.
     */
    orderBy?: MfaBackupCodeOrderByWithRelationInput | MfaBackupCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MfaBackupCodes.
     */
    cursor?: MfaBackupCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaBackupCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaBackupCodes.
     */
    skip?: number
    distinct?: MfaBackupCodeScalarFieldEnum | MfaBackupCodeScalarFieldEnum[]
  }

  /**
   * MfaBackupCode create
   */
  export type MfaBackupCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a MfaBackupCode.
     */
    data: XOR<MfaBackupCodeCreateInput, MfaBackupCodeUncheckedCreateInput>
  }

  /**
   * MfaBackupCode createMany
   */
  export type MfaBackupCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MfaBackupCodes.
     */
    data: MfaBackupCodeCreateManyInput | MfaBackupCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MfaBackupCode createManyAndReturn
   */
  export type MfaBackupCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MfaBackupCodes.
     */
    data: MfaBackupCodeCreateManyInput | MfaBackupCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MfaBackupCode update
   */
  export type MfaBackupCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a MfaBackupCode.
     */
    data: XOR<MfaBackupCodeUpdateInput, MfaBackupCodeUncheckedUpdateInput>
    /**
     * Choose, which MfaBackupCode to update.
     */
    where: MfaBackupCodeWhereUniqueInput
  }

  /**
   * MfaBackupCode updateMany
   */
  export type MfaBackupCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MfaBackupCodes.
     */
    data: XOR<MfaBackupCodeUpdateManyMutationInput, MfaBackupCodeUncheckedUpdateManyInput>
    /**
     * Filter which MfaBackupCodes to update
     */
    where?: MfaBackupCodeWhereInput
  }

  /**
   * MfaBackupCode upsert
   */
  export type MfaBackupCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the MfaBackupCode to update in case it exists.
     */
    where: MfaBackupCodeWhereUniqueInput
    /**
     * In case the MfaBackupCode found by the `where` argument doesn't exist, create a new MfaBackupCode with this data.
     */
    create: XOR<MfaBackupCodeCreateInput, MfaBackupCodeUncheckedCreateInput>
    /**
     * In case the MfaBackupCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MfaBackupCodeUpdateInput, MfaBackupCodeUncheckedUpdateInput>
  }

  /**
   * MfaBackupCode delete
   */
  export type MfaBackupCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
    /**
     * Filter which MfaBackupCode to delete.
     */
    where: MfaBackupCodeWhereUniqueInput
  }

  /**
   * MfaBackupCode deleteMany
   */
  export type MfaBackupCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaBackupCodes to delete
     */
    where?: MfaBackupCodeWhereInput
  }

  /**
   * MfaBackupCode without action
   */
  export type MfaBackupCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaBackupCode
     */
    select?: MfaBackupCodeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MfaBackupCodeInclude<ExtArgs> | null
  }


  /**
   * Model MfaPendingToken
   */

  export type AggregateMfaPendingToken = {
    _count: MfaPendingTokenCountAggregateOutputType | null
    _min: MfaPendingTokenMinAggregateOutputType | null
    _max: MfaPendingTokenMaxAggregateOutputType | null
  }

  export type MfaPendingTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    purpose: string | null
    destination: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type MfaPendingTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    purpose: string | null
    destination: string | null
    expiresAt: Date | null
    consumedAt: Date | null
    createdAt: Date | null
  }

  export type MfaPendingTokenCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    purpose: number
    destination: number
    expiresAt: number
    consumedAt: number
    createdAt: number
    _all: number
  }


  export type MfaPendingTokenMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    purpose?: true
    destination?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type MfaPendingTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    purpose?: true
    destination?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
  }

  export type MfaPendingTokenCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    purpose?: true
    destination?: true
    expiresAt?: true
    consumedAt?: true
    createdAt?: true
    _all?: true
  }

  export type MfaPendingTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaPendingToken to aggregate.
     */
    where?: MfaPendingTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaPendingTokens to fetch.
     */
    orderBy?: MfaPendingTokenOrderByWithRelationInput | MfaPendingTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MfaPendingTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaPendingTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaPendingTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MfaPendingTokens
    **/
    _count?: true | MfaPendingTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MfaPendingTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MfaPendingTokenMaxAggregateInputType
  }

  export type GetMfaPendingTokenAggregateType<T extends MfaPendingTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateMfaPendingToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMfaPendingToken[P]>
      : GetScalarType<T[P], AggregateMfaPendingToken[P]>
  }




  export type MfaPendingTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MfaPendingTokenWhereInput
    orderBy?: MfaPendingTokenOrderByWithAggregationInput | MfaPendingTokenOrderByWithAggregationInput[]
    by: MfaPendingTokenScalarFieldEnum[] | MfaPendingTokenScalarFieldEnum
    having?: MfaPendingTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MfaPendingTokenCountAggregateInputType | true
    _min?: MfaPendingTokenMinAggregateInputType
    _max?: MfaPendingTokenMaxAggregateInputType
  }

  export type MfaPendingTokenGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    purpose: string
    destination: string | null
    expiresAt: Date
    consumedAt: Date | null
    createdAt: Date
    _count: MfaPendingTokenCountAggregateOutputType | null
    _min: MfaPendingTokenMinAggregateOutputType | null
    _max: MfaPendingTokenMaxAggregateOutputType | null
  }

  type GetMfaPendingTokenGroupByPayload<T extends MfaPendingTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MfaPendingTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MfaPendingTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MfaPendingTokenGroupByOutputType[P]>
            : GetScalarType<T[P], MfaPendingTokenGroupByOutputType[P]>
        }
      >
    >


  export type MfaPendingTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    purpose?: boolean
    destination?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["mfaPendingToken"]>

  export type MfaPendingTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    purpose?: boolean
    destination?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["mfaPendingToken"]>

  export type MfaPendingTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    purpose?: boolean
    destination?: boolean
    expiresAt?: boolean
    consumedAt?: boolean
    createdAt?: boolean
  }


  export type $MfaPendingTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MfaPendingToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      purpose: string
      destination: string | null
      expiresAt: Date
      consumedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["mfaPendingToken"]>
    composites: {}
  }

  type MfaPendingTokenGetPayload<S extends boolean | null | undefined | MfaPendingTokenDefaultArgs> = $Result.GetResult<Prisma.$MfaPendingTokenPayload, S>

  type MfaPendingTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MfaPendingTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MfaPendingTokenCountAggregateInputType | true
    }

  export interface MfaPendingTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MfaPendingToken'], meta: { name: 'MfaPendingToken' } }
    /**
     * Find zero or one MfaPendingToken that matches the filter.
     * @param {MfaPendingTokenFindUniqueArgs} args - Arguments to find a MfaPendingToken
     * @example
     * // Get one MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MfaPendingTokenFindUniqueArgs>(args: SelectSubset<T, MfaPendingTokenFindUniqueArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one MfaPendingToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {MfaPendingTokenFindUniqueOrThrowArgs} args - Arguments to find a MfaPendingToken
     * @example
     * // Get one MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MfaPendingTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, MfaPendingTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first MfaPendingToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenFindFirstArgs} args - Arguments to find a MfaPendingToken
     * @example
     * // Get one MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MfaPendingTokenFindFirstArgs>(args?: SelectSubset<T, MfaPendingTokenFindFirstArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first MfaPendingToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenFindFirstOrThrowArgs} args - Arguments to find a MfaPendingToken
     * @example
     * // Get one MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MfaPendingTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, MfaPendingTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more MfaPendingTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MfaPendingTokens
     * const mfaPendingTokens = await prisma.mfaPendingToken.findMany()
     * 
     * // Get first 10 MfaPendingTokens
     * const mfaPendingTokens = await prisma.mfaPendingToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mfaPendingTokenWithIdOnly = await prisma.mfaPendingToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MfaPendingTokenFindManyArgs>(args?: SelectSubset<T, MfaPendingTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a MfaPendingToken.
     * @param {MfaPendingTokenCreateArgs} args - Arguments to create a MfaPendingToken.
     * @example
     * // Create one MfaPendingToken
     * const MfaPendingToken = await prisma.mfaPendingToken.create({
     *   data: {
     *     // ... data to create a MfaPendingToken
     *   }
     * })
     * 
     */
    create<T extends MfaPendingTokenCreateArgs>(args: SelectSubset<T, MfaPendingTokenCreateArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many MfaPendingTokens.
     * @param {MfaPendingTokenCreateManyArgs} args - Arguments to create many MfaPendingTokens.
     * @example
     * // Create many MfaPendingTokens
     * const mfaPendingToken = await prisma.mfaPendingToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MfaPendingTokenCreateManyArgs>(args?: SelectSubset<T, MfaPendingTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MfaPendingTokens and returns the data saved in the database.
     * @param {MfaPendingTokenCreateManyAndReturnArgs} args - Arguments to create many MfaPendingTokens.
     * @example
     * // Create many MfaPendingTokens
     * const mfaPendingToken = await prisma.mfaPendingToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MfaPendingTokens and only return the `id`
     * const mfaPendingTokenWithIdOnly = await prisma.mfaPendingToken.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MfaPendingTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, MfaPendingTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a MfaPendingToken.
     * @param {MfaPendingTokenDeleteArgs} args - Arguments to delete one MfaPendingToken.
     * @example
     * // Delete one MfaPendingToken
     * const MfaPendingToken = await prisma.mfaPendingToken.delete({
     *   where: {
     *     // ... filter to delete one MfaPendingToken
     *   }
     * })
     * 
     */
    delete<T extends MfaPendingTokenDeleteArgs>(args: SelectSubset<T, MfaPendingTokenDeleteArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one MfaPendingToken.
     * @param {MfaPendingTokenUpdateArgs} args - Arguments to update one MfaPendingToken.
     * @example
     * // Update one MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MfaPendingTokenUpdateArgs>(args: SelectSubset<T, MfaPendingTokenUpdateArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more MfaPendingTokens.
     * @param {MfaPendingTokenDeleteManyArgs} args - Arguments to filter MfaPendingTokens to delete.
     * @example
     * // Delete a few MfaPendingTokens
     * const { count } = await prisma.mfaPendingToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MfaPendingTokenDeleteManyArgs>(args?: SelectSubset<T, MfaPendingTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MfaPendingTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MfaPendingTokens
     * const mfaPendingToken = await prisma.mfaPendingToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MfaPendingTokenUpdateManyArgs>(args: SelectSubset<T, MfaPendingTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MfaPendingToken.
     * @param {MfaPendingTokenUpsertArgs} args - Arguments to update or create a MfaPendingToken.
     * @example
     * // Update or create a MfaPendingToken
     * const mfaPendingToken = await prisma.mfaPendingToken.upsert({
     *   create: {
     *     // ... data to create a MfaPendingToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MfaPendingToken we want to update
     *   }
     * })
     */
    upsert<T extends MfaPendingTokenUpsertArgs>(args: SelectSubset<T, MfaPendingTokenUpsertArgs<ExtArgs>>): Prisma__MfaPendingTokenClient<$Result.GetResult<Prisma.$MfaPendingTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of MfaPendingTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenCountArgs} args - Arguments to filter MfaPendingTokens to count.
     * @example
     * // Count the number of MfaPendingTokens
     * const count = await prisma.mfaPendingToken.count({
     *   where: {
     *     // ... the filter for the MfaPendingTokens we want to count
     *   }
     * })
    **/
    count<T extends MfaPendingTokenCountArgs>(
      args?: Subset<T, MfaPendingTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MfaPendingTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MfaPendingToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MfaPendingTokenAggregateArgs>(args: Subset<T, MfaPendingTokenAggregateArgs>): Prisma.PrismaPromise<GetMfaPendingTokenAggregateType<T>>

    /**
     * Group by MfaPendingToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MfaPendingTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MfaPendingTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MfaPendingTokenGroupByArgs['orderBy'] }
        : { orderBy?: MfaPendingTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MfaPendingTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMfaPendingTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MfaPendingToken model
   */
  readonly fields: MfaPendingTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MfaPendingToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MfaPendingTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MfaPendingToken model
   */ 
  interface MfaPendingTokenFieldRefs {
    readonly id: FieldRef<"MfaPendingToken", 'String'>
    readonly userId: FieldRef<"MfaPendingToken", 'String'>
    readonly tokenHash: FieldRef<"MfaPendingToken", 'String'>
    readonly purpose: FieldRef<"MfaPendingToken", 'String'>
    readonly destination: FieldRef<"MfaPendingToken", 'String'>
    readonly expiresAt: FieldRef<"MfaPendingToken", 'DateTime'>
    readonly consumedAt: FieldRef<"MfaPendingToken", 'DateTime'>
    readonly createdAt: FieldRef<"MfaPendingToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MfaPendingToken findUnique
   */
  export type MfaPendingTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter, which MfaPendingToken to fetch.
     */
    where: MfaPendingTokenWhereUniqueInput
  }

  /**
   * MfaPendingToken findUniqueOrThrow
   */
  export type MfaPendingTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter, which MfaPendingToken to fetch.
     */
    where: MfaPendingTokenWhereUniqueInput
  }

  /**
   * MfaPendingToken findFirst
   */
  export type MfaPendingTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter, which MfaPendingToken to fetch.
     */
    where?: MfaPendingTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaPendingTokens to fetch.
     */
    orderBy?: MfaPendingTokenOrderByWithRelationInput | MfaPendingTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaPendingTokens.
     */
    cursor?: MfaPendingTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaPendingTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaPendingTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaPendingTokens.
     */
    distinct?: MfaPendingTokenScalarFieldEnum | MfaPendingTokenScalarFieldEnum[]
  }

  /**
   * MfaPendingToken findFirstOrThrow
   */
  export type MfaPendingTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter, which MfaPendingToken to fetch.
     */
    where?: MfaPendingTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaPendingTokens to fetch.
     */
    orderBy?: MfaPendingTokenOrderByWithRelationInput | MfaPendingTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MfaPendingTokens.
     */
    cursor?: MfaPendingTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaPendingTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaPendingTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MfaPendingTokens.
     */
    distinct?: MfaPendingTokenScalarFieldEnum | MfaPendingTokenScalarFieldEnum[]
  }

  /**
   * MfaPendingToken findMany
   */
  export type MfaPendingTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter, which MfaPendingTokens to fetch.
     */
    where?: MfaPendingTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MfaPendingTokens to fetch.
     */
    orderBy?: MfaPendingTokenOrderByWithRelationInput | MfaPendingTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MfaPendingTokens.
     */
    cursor?: MfaPendingTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MfaPendingTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MfaPendingTokens.
     */
    skip?: number
    distinct?: MfaPendingTokenScalarFieldEnum | MfaPendingTokenScalarFieldEnum[]
  }

  /**
   * MfaPendingToken create
   */
  export type MfaPendingTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a MfaPendingToken.
     */
    data: XOR<MfaPendingTokenCreateInput, MfaPendingTokenUncheckedCreateInput>
  }

  /**
   * MfaPendingToken createMany
   */
  export type MfaPendingTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MfaPendingTokens.
     */
    data: MfaPendingTokenCreateManyInput | MfaPendingTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MfaPendingToken createManyAndReturn
   */
  export type MfaPendingTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many MfaPendingTokens.
     */
    data: MfaPendingTokenCreateManyInput | MfaPendingTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MfaPendingToken update
   */
  export type MfaPendingTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a MfaPendingToken.
     */
    data: XOR<MfaPendingTokenUpdateInput, MfaPendingTokenUncheckedUpdateInput>
    /**
     * Choose, which MfaPendingToken to update.
     */
    where: MfaPendingTokenWhereUniqueInput
  }

  /**
   * MfaPendingToken updateMany
   */
  export type MfaPendingTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MfaPendingTokens.
     */
    data: XOR<MfaPendingTokenUpdateManyMutationInput, MfaPendingTokenUncheckedUpdateManyInput>
    /**
     * Filter which MfaPendingTokens to update
     */
    where?: MfaPendingTokenWhereInput
  }

  /**
   * MfaPendingToken upsert
   */
  export type MfaPendingTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the MfaPendingToken to update in case it exists.
     */
    where: MfaPendingTokenWhereUniqueInput
    /**
     * In case the MfaPendingToken found by the `where` argument doesn't exist, create a new MfaPendingToken with this data.
     */
    create: XOR<MfaPendingTokenCreateInput, MfaPendingTokenUncheckedCreateInput>
    /**
     * In case the MfaPendingToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MfaPendingTokenUpdateInput, MfaPendingTokenUncheckedUpdateInput>
  }

  /**
   * MfaPendingToken delete
   */
  export type MfaPendingTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
    /**
     * Filter which MfaPendingToken to delete.
     */
    where: MfaPendingTokenWhereUniqueInput
  }

  /**
   * MfaPendingToken deleteMany
   */
  export type MfaPendingTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MfaPendingTokens to delete
     */
    where?: MfaPendingTokenWhereInput
  }

  /**
   * MfaPendingToken without action
   */
  export type MfaPendingTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MfaPendingToken
     */
    select?: MfaPendingTokenSelect<ExtArgs> | null
  }


  /**
   * Model Service
   */

  export type AggregateService = {
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  export type ServiceAvgAggregateOutputType = {
    priceCents: number | null
    scholarshipMinCents: number | null
    scholarshipMaxCents: number | null
  }

  export type ServiceSumAggregateOutputType = {
    priceCents: number | null
    scholarshipMinCents: number | null
    scholarshipMaxCents: number | null
  }

  export type ServiceMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: $Enums.ServiceCategory | null
    priceCents: number | null
    scholarshipMinCents: number | null
    scholarshipMaxCents: number | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServiceMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    category: $Enums.ServiceCategory | null
    priceCents: number | null
    scholarshipMinCents: number | null
    scholarshipMaxCents: number | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServiceCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    category: number
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServiceAvgAggregateInputType = {
    priceCents?: true
    scholarshipMinCents?: true
    scholarshipMaxCents?: true
  }

  export type ServiceSumAggregateInputType = {
    priceCents?: true
    scholarshipMinCents?: true
    scholarshipMaxCents?: true
  }

  export type ServiceMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    priceCents?: true
    scholarshipMinCents?: true
    scholarshipMaxCents?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServiceMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    priceCents?: true
    scholarshipMinCents?: true
    scholarshipMaxCents?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServiceCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    category?: true
    priceCents?: true
    scholarshipMinCents?: true
    scholarshipMaxCents?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ServiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Service to aggregate.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Services
    **/
    _count?: true | ServiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServiceMaxAggregateInputType
  }

  export type GetServiceAggregateType<T extends ServiceAggregateArgs> = {
        [P in keyof T & keyof AggregateService]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateService[P]>
      : GetScalarType<T[P], AggregateService[P]>
  }




  export type ServiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServiceWhereInput
    orderBy?: ServiceOrderByWithAggregationInput | ServiceOrderByWithAggregationInput[]
    by: ServiceScalarFieldEnum[] | ServiceScalarFieldEnum
    having?: ServiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServiceCountAggregateInputType | true
    _avg?: ServiceAvgAggregateInputType
    _sum?: ServiceSumAggregateInputType
    _min?: ServiceMinAggregateInputType
    _max?: ServiceMaxAggregateInputType
  }

  export type ServiceGroupByOutputType = {
    id: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: ServiceCountAggregateOutputType | null
    _avg: ServiceAvgAggregateOutputType | null
    _sum: ServiceSumAggregateOutputType | null
    _min: ServiceMinAggregateOutputType | null
    _max: ServiceMaxAggregateOutputType | null
  }

  type GetServiceGroupByPayload<T extends ServiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServiceGroupByOutputType[P]>
            : GetScalarType<T[P], ServiceGroupByOutputType[P]>
        }
      >
    >


  export type ServiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    priceCents?: boolean
    scholarshipMinCents?: boolean
    scholarshipMaxCents?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | Service$sessionsArgs<ExtArgs>
    packages?: boolean | Service$packagesArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    priceCents?: boolean
    scholarshipMinCents?: boolean
    scholarshipMaxCents?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    category?: boolean
    priceCents?: boolean
    scholarshipMinCents?: boolean
    scholarshipMaxCents?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | Service$sessionsArgs<ExtArgs>
    packages?: boolean | Service$packagesArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Service"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      packages: Prisma.$PackagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      category: $Enums.ServiceCategory
      priceCents: number
      scholarshipMinCents: number
      scholarshipMaxCents: number
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["service"]>
    composites: {}
  }

  type ServiceGetPayload<S extends boolean | null | undefined | ServiceDefaultArgs> = $Result.GetResult<Prisma.$ServicePayload, S>

  type ServiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ServiceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ServiceCountAggregateInputType | true
    }

  export interface ServiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Service'], meta: { name: 'Service' } }
    /**
     * Find zero or one Service that matches the filter.
     * @param {ServiceFindUniqueArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServiceFindUniqueArgs>(args: SelectSubset<T, ServiceFindUniqueArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Service that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ServiceFindUniqueOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServiceFindUniqueOrThrowArgs>(args: SelectSubset<T, ServiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Service that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServiceFindFirstArgs>(args?: SelectSubset<T, ServiceFindFirstArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Service that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindFirstOrThrowArgs} args - Arguments to find a Service
     * @example
     * // Get one Service
     * const service = await prisma.service.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServiceFindFirstOrThrowArgs>(args?: SelectSubset<T, ServiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Services that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Services
     * const services = await prisma.service.findMany()
     * 
     * // Get first 10 Services
     * const services = await prisma.service.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serviceWithIdOnly = await prisma.service.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServiceFindManyArgs>(args?: SelectSubset<T, ServiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Service.
     * @param {ServiceCreateArgs} args - Arguments to create a Service.
     * @example
     * // Create one Service
     * const Service = await prisma.service.create({
     *   data: {
     *     // ... data to create a Service
     *   }
     * })
     * 
     */
    create<T extends ServiceCreateArgs>(args: SelectSubset<T, ServiceCreateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Services.
     * @param {ServiceCreateManyArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServiceCreateManyArgs>(args?: SelectSubset<T, ServiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Services and returns the data saved in the database.
     * @param {ServiceCreateManyAndReturnArgs} args - Arguments to create many Services.
     * @example
     * // Create many Services
     * const service = await prisma.service.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Services and only return the `id`
     * const serviceWithIdOnly = await prisma.service.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServiceCreateManyAndReturnArgs>(args?: SelectSubset<T, ServiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Service.
     * @param {ServiceDeleteArgs} args - Arguments to delete one Service.
     * @example
     * // Delete one Service
     * const Service = await prisma.service.delete({
     *   where: {
     *     // ... filter to delete one Service
     *   }
     * })
     * 
     */
    delete<T extends ServiceDeleteArgs>(args: SelectSubset<T, ServiceDeleteArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Service.
     * @param {ServiceUpdateArgs} args - Arguments to update one Service.
     * @example
     * // Update one Service
     * const service = await prisma.service.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServiceUpdateArgs>(args: SelectSubset<T, ServiceUpdateArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Services.
     * @param {ServiceDeleteManyArgs} args - Arguments to filter Services to delete.
     * @example
     * // Delete a few Services
     * const { count } = await prisma.service.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServiceDeleteManyArgs>(args?: SelectSubset<T, ServiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Services
     * const service = await prisma.service.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServiceUpdateManyArgs>(args: SelectSubset<T, ServiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Service.
     * @param {ServiceUpsertArgs} args - Arguments to update or create a Service.
     * @example
     * // Update or create a Service
     * const service = await prisma.service.upsert({
     *   create: {
     *     // ... data to create a Service
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Service we want to update
     *   }
     * })
     */
    upsert<T extends ServiceUpsertArgs>(args: SelectSubset<T, ServiceUpsertArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Services.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceCountArgs} args - Arguments to filter Services to count.
     * @example
     * // Count the number of Services
     * const count = await prisma.service.count({
     *   where: {
     *     // ... the filter for the Services we want to count
     *   }
     * })
    **/
    count<T extends ServiceCountArgs>(
      args?: Subset<T, ServiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServiceAggregateArgs>(args: Subset<T, ServiceAggregateArgs>): Prisma.PrismaPromise<GetServiceAggregateType<T>>

    /**
     * Group by Service.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServiceGroupByArgs['orderBy'] }
        : { orderBy?: ServiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Service model
   */
  readonly fields: ServiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Service.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends Service$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Service$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    packages<T extends Service$packagesArgs<ExtArgs> = {}>(args?: Subset<T, Service$packagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Service model
   */ 
  interface ServiceFieldRefs {
    readonly id: FieldRef<"Service", 'String'>
    readonly slug: FieldRef<"Service", 'String'>
    readonly name: FieldRef<"Service", 'String'>
    readonly category: FieldRef<"Service", 'ServiceCategory'>
    readonly priceCents: FieldRef<"Service", 'Int'>
    readonly scholarshipMinCents: FieldRef<"Service", 'Int'>
    readonly scholarshipMaxCents: FieldRef<"Service", 'Int'>
    readonly active: FieldRef<"Service", 'Boolean'>
    readonly createdAt: FieldRef<"Service", 'DateTime'>
    readonly updatedAt: FieldRef<"Service", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Service findUnique
   */
  export type ServiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findUniqueOrThrow
   */
  export type ServiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service findFirst
   */
  export type ServiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findFirstOrThrow
   */
  export type ServiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Service to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Services.
     */
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service findMany
   */
  export type ServiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter, which Services to fetch.
     */
    where?: ServiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Services to fetch.
     */
    orderBy?: ServiceOrderByWithRelationInput | ServiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Services.
     */
    cursor?: ServiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Services from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Services.
     */
    skip?: number
    distinct?: ServiceScalarFieldEnum | ServiceScalarFieldEnum[]
  }

  /**
   * Service create
   */
  export type ServiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to create a Service.
     */
    data: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
  }

  /**
   * Service createMany
   */
  export type ServiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Service createManyAndReturn
   */
  export type ServiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Services.
     */
    data: ServiceCreateManyInput | ServiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Service update
   */
  export type ServiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The data needed to update a Service.
     */
    data: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
    /**
     * Choose, which Service to update.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service updateMany
   */
  export type ServiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Services.
     */
    data: XOR<ServiceUpdateManyMutationInput, ServiceUncheckedUpdateManyInput>
    /**
     * Filter which Services to update
     */
    where?: ServiceWhereInput
  }

  /**
   * Service upsert
   */
  export type ServiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * The filter to search for the Service to update in case it exists.
     */
    where: ServiceWhereUniqueInput
    /**
     * In case the Service found by the `where` argument doesn't exist, create a new Service with this data.
     */
    create: XOR<ServiceCreateInput, ServiceUncheckedCreateInput>
    /**
     * In case the Service was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServiceUpdateInput, ServiceUncheckedUpdateInput>
  }

  /**
   * Service delete
   */
  export type ServiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
    /**
     * Filter which Service to delete.
     */
    where: ServiceWhereUniqueInput
  }

  /**
   * Service deleteMany
   */
  export type ServiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Services to delete
     */
    where?: ServiceWhereInput
  }

  /**
   * Service.sessions
   */
  export type Service$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Service.packages
   */
  export type Service$packagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    where?: PackageWhereInput
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    cursor?: PackageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Service without action
   */
  export type ServiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Service
     */
    select?: ServiceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ServiceInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    packageId: string | null
    status: $Enums.SessionStatus | null
    startsAt: Date | null
    endsAt: Date | null
    sessionTokenRef: string | null
    stripePaymentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    packageId: string | null
    status: $Enums.SessionStatus | null
    startsAt: Date | null
    endsAt: Date | null
    sessionTokenRef: string | null
    stripePaymentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    serviceId: number
    packageId: number
    status: number
    startsAt: number
    endsAt: number
    sessionTokenRef: number
    stripePaymentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    packageId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    sessionTokenRef?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    packageId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    sessionTokenRef?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    packageId?: true
    status?: true
    startsAt?: true
    endsAt?: true
    sessionTokenRef?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    serviceId: string
    packageId: string | null
    status: $Enums.SessionStatus
    startsAt: Date
    endsAt: Date
    sessionTokenRef: string | null
    stripePaymentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    packageId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    sessionTokenRef?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    package?: boolean | Session$packageArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    packageId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    sessionTokenRef?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    package?: boolean | Session$packageArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    packageId?: boolean
    status?: boolean
    startsAt?: boolean
    endsAt?: boolean
    sessionTokenRef?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    package?: boolean | Session$packageArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    package?: boolean | Session$packageArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      service: Prisma.$ServicePayload<ExtArgs>
      package: Prisma.$PackagePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      serviceId: string
      packageId: string | null
      status: $Enums.SessionStatus
      startsAt: Date
      endsAt: Date
      sessionTokenRef: string | null
      stripePaymentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    service<T extends ServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServiceDefaultArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    package<T extends Session$packageArgs<ExtArgs> = {}>(args?: Subset<T, Session$packageArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly serviceId: FieldRef<"Session", 'String'>
    readonly packageId: FieldRef<"Session", 'String'>
    readonly status: FieldRef<"Session", 'SessionStatus'>
    readonly startsAt: FieldRef<"Session", 'DateTime'>
    readonly endsAt: FieldRef<"Session", 'DateTime'>
    readonly sessionTokenRef: FieldRef<"Session", 'String'>
    readonly stripePaymentId: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session.package
   */
  export type Session$packageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    where?: PackageWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Package
   */

  export type AggregatePackage = {
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  export type PackageAvgAggregateOutputType = {
    totalSessions: number | null
    usedSessions: number | null
  }

  export type PackageSumAggregateOutputType = {
    totalSessions: number | null
    usedSessions: number | null
  }

  export type PackageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    totalSessions: number | null
    usedSessions: number | null
    stripePaymentId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    totalSessions: number | null
    usedSessions: number | null
    stripePaymentId: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageCountAggregateOutputType = {
    id: number
    userId: number
    serviceId: number
    totalSessions: number
    usedSessions: number
    stripePaymentId: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PackageAvgAggregateInputType = {
    totalSessions?: true
    usedSessions?: true
  }

  export type PackageSumAggregateInputType = {
    totalSessions?: true
    usedSessions?: true
  }

  export type PackageMinAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    stripePaymentId?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageMaxAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    stripePaymentId?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageCountAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    stripePaymentId?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PackageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Package to aggregate.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Packages
    **/
    _count?: true | PackageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PackageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PackageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PackageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PackageMaxAggregateInputType
  }

  export type GetPackageAggregateType<T extends PackageAggregateArgs> = {
        [P in keyof T & keyof AggregatePackage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePackage[P]>
      : GetScalarType<T[P], AggregatePackage[P]>
  }




  export type PackageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PackageWhereInput
    orderBy?: PackageOrderByWithAggregationInput | PackageOrderByWithAggregationInput[]
    by: PackageScalarFieldEnum[] | PackageScalarFieldEnum
    having?: PackageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PackageCountAggregateInputType | true
    _avg?: PackageAvgAggregateInputType
    _sum?: PackageSumAggregateInputType
    _min?: PackageMinAggregateInputType
    _max?: PackageMaxAggregateInputType
  }

  export type PackageGroupByOutputType = {
    id: string
    userId: string
    serviceId: string
    totalSessions: number
    usedSessions: number
    stripePaymentId: string | null
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: PackageCountAggregateOutputType | null
    _avg: PackageAvgAggregateOutputType | null
    _sum: PackageSumAggregateOutputType | null
    _min: PackageMinAggregateOutputType | null
    _max: PackageMaxAggregateOutputType | null
  }

  type GetPackageGroupByPayload<T extends PackageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PackageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PackageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PackageGroupByOutputType[P]>
            : GetScalarType<T[P], PackageGroupByOutputType[P]>
        }
      >
    >


  export type PackageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    totalSessions?: boolean
    usedSessions?: boolean
    stripePaymentId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    sessions?: boolean | Package$sessionsArgs<ExtArgs>
    _count?: boolean | PackageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["package"]>

  export type PackageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    totalSessions?: boolean
    usedSessions?: boolean
    stripePaymentId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["package"]>

  export type PackageSelectScalar = {
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    totalSessions?: boolean
    usedSessions?: boolean
    stripePaymentId?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PackageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
    sessions?: boolean | Package$sessionsArgs<ExtArgs>
    _count?: boolean | PackageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PackageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }

  export type $PackagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Package"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      service: Prisma.$ServicePayload<ExtArgs>
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      serviceId: string
      totalSessions: number
      usedSessions: number
      stripePaymentId: string | null
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["package"]>
    composites: {}
  }

  type PackageGetPayload<S extends boolean | null | undefined | PackageDefaultArgs> = $Result.GetResult<Prisma.$PackagePayload, S>

  type PackageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PackageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PackageCountAggregateInputType | true
    }

  export interface PackageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Package'], meta: { name: 'Package' } }
    /**
     * Find zero or one Package that matches the filter.
     * @param {PackageFindUniqueArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PackageFindUniqueArgs>(args: SelectSubset<T, PackageFindUniqueArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Package that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PackageFindUniqueOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PackageFindUniqueOrThrowArgs>(args: SelectSubset<T, PackageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Package that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PackageFindFirstArgs>(args?: SelectSubset<T, PackageFindFirstArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Package that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindFirstOrThrowArgs} args - Arguments to find a Package
     * @example
     * // Get one Package
     * const package = await prisma.package.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PackageFindFirstOrThrowArgs>(args?: SelectSubset<T, PackageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Packages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Packages
     * const packages = await prisma.package.findMany()
     * 
     * // Get first 10 Packages
     * const packages = await prisma.package.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const packageWithIdOnly = await prisma.package.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PackageFindManyArgs>(args?: SelectSubset<T, PackageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Package.
     * @param {PackageCreateArgs} args - Arguments to create a Package.
     * @example
     * // Create one Package
     * const Package = await prisma.package.create({
     *   data: {
     *     // ... data to create a Package
     *   }
     * })
     * 
     */
    create<T extends PackageCreateArgs>(args: SelectSubset<T, PackageCreateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Packages.
     * @param {PackageCreateManyArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PackageCreateManyArgs>(args?: SelectSubset<T, PackageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Packages and returns the data saved in the database.
     * @param {PackageCreateManyAndReturnArgs} args - Arguments to create many Packages.
     * @example
     * // Create many Packages
     * const package = await prisma.package.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Packages and only return the `id`
     * const packageWithIdOnly = await prisma.package.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PackageCreateManyAndReturnArgs>(args?: SelectSubset<T, PackageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Package.
     * @param {PackageDeleteArgs} args - Arguments to delete one Package.
     * @example
     * // Delete one Package
     * const Package = await prisma.package.delete({
     *   where: {
     *     // ... filter to delete one Package
     *   }
     * })
     * 
     */
    delete<T extends PackageDeleteArgs>(args: SelectSubset<T, PackageDeleteArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Package.
     * @param {PackageUpdateArgs} args - Arguments to update one Package.
     * @example
     * // Update one Package
     * const package = await prisma.package.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PackageUpdateArgs>(args: SelectSubset<T, PackageUpdateArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Packages.
     * @param {PackageDeleteManyArgs} args - Arguments to filter Packages to delete.
     * @example
     * // Delete a few Packages
     * const { count } = await prisma.package.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PackageDeleteManyArgs>(args?: SelectSubset<T, PackageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Packages
     * const package = await prisma.package.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PackageUpdateManyArgs>(args: SelectSubset<T, PackageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Package.
     * @param {PackageUpsertArgs} args - Arguments to update or create a Package.
     * @example
     * // Update or create a Package
     * const package = await prisma.package.upsert({
     *   create: {
     *     // ... data to create a Package
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Package we want to update
     *   }
     * })
     */
    upsert<T extends PackageUpsertArgs>(args: SelectSubset<T, PackageUpsertArgs<ExtArgs>>): Prisma__PackageClient<$Result.GetResult<Prisma.$PackagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Packages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageCountArgs} args - Arguments to filter Packages to count.
     * @example
     * // Count the number of Packages
     * const count = await prisma.package.count({
     *   where: {
     *     // ... the filter for the Packages we want to count
     *   }
     * })
    **/
    count<T extends PackageCountArgs>(
      args?: Subset<T, PackageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PackageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PackageAggregateArgs>(args: Subset<T, PackageAggregateArgs>): Prisma.PrismaPromise<GetPackageAggregateType<T>>

    /**
     * Group by Package.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PackageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PackageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PackageGroupByArgs['orderBy'] }
        : { orderBy?: PackageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PackageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPackageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Package model
   */
  readonly fields: PackageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Package.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PackageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    service<T extends ServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServiceDefaultArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    sessions<T extends Package$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Package$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Package model
   */ 
  interface PackageFieldRefs {
    readonly id: FieldRef<"Package", 'String'>
    readonly userId: FieldRef<"Package", 'String'>
    readonly serviceId: FieldRef<"Package", 'String'>
    readonly totalSessions: FieldRef<"Package", 'Int'>
    readonly usedSessions: FieldRef<"Package", 'Int'>
    readonly stripePaymentId: FieldRef<"Package", 'String'>
    readonly expiresAt: FieldRef<"Package", 'DateTime'>
    readonly createdAt: FieldRef<"Package", 'DateTime'>
    readonly updatedAt: FieldRef<"Package", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Package findUnique
   */
  export type PackageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findUniqueOrThrow
   */
  export type PackageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package findFirst
   */
  export type PackageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findFirstOrThrow
   */
  export type PackageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter, which Package to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Packages.
     */
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package findMany
   */
  export type PackageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter, which Packages to fetch.
     */
    where?: PackageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Packages to fetch.
     */
    orderBy?: PackageOrderByWithRelationInput | PackageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Packages.
     */
    cursor?: PackageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Packages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Packages.
     */
    skip?: number
    distinct?: PackageScalarFieldEnum | PackageScalarFieldEnum[]
  }

  /**
   * Package create
   */
  export type PackageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * The data needed to create a Package.
     */
    data: XOR<PackageCreateInput, PackageUncheckedCreateInput>
  }

  /**
   * Package createMany
   */
  export type PackageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Package createManyAndReturn
   */
  export type PackageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Packages.
     */
    data: PackageCreateManyInput | PackageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Package update
   */
  export type PackageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * The data needed to update a Package.
     */
    data: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
    /**
     * Choose, which Package to update.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package updateMany
   */
  export type PackageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Packages.
     */
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyInput>
    /**
     * Filter which Packages to update
     */
    where?: PackageWhereInput
  }

  /**
   * Package upsert
   */
  export type PackageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * The filter to search for the Package to update in case it exists.
     */
    where: PackageWhereUniqueInput
    /**
     * In case the Package found by the `where` argument doesn't exist, create a new Package with this data.
     */
    create: XOR<PackageCreateInput, PackageUncheckedCreateInput>
    /**
     * In case the Package was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PackageUpdateInput, PackageUncheckedUpdateInput>
  }

  /**
   * Package delete
   */
  export type PackageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
    /**
     * Filter which Package to delete.
     */
    where: PackageWhereUniqueInput
  }

  /**
   * Package deleteMany
   */
  export type PackageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Packages to delete
     */
    where?: PackageWhereInput
  }

  /**
   * Package.sessions
   */
  export type Package$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Package without action
   */
  export type PackageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Package
     */
    select?: PackageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PackageInclude<ExtArgs> | null
  }


  /**
   * Model Scholarship
   */

  export type AggregateScholarship = {
    _count: ScholarshipCountAggregateOutputType | null
    _avg: ScholarshipAvgAggregateOutputType | null
    _sum: ScholarshipSumAggregateOutputType | null
    _min: ScholarshipMinAggregateOutputType | null
    _max: ScholarshipMaxAggregateOutputType | null
  }

  export type ScholarshipAvgAggregateOutputType = {
    requestedCents: number | null
    approvedCents: number | null
  }

  export type ScholarshipSumAggregateOutputType = {
    requestedCents: number | null
    approvedCents: number | null
  }

  export type ScholarshipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.ScholarshipStatus | null
    requestedCents: number | null
    approvedCents: number | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScholarshipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.ScholarshipStatus | null
    requestedCents: number | null
    approvedCents: number | null
    note: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScholarshipCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    requestedCents: number
    approvedCents: number
    note: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScholarshipAvgAggregateInputType = {
    requestedCents?: true
    approvedCents?: true
  }

  export type ScholarshipSumAggregateInputType = {
    requestedCents?: true
    approvedCents?: true
  }

  export type ScholarshipMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    requestedCents?: true
    approvedCents?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScholarshipMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    requestedCents?: true
    approvedCents?: true
    note?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScholarshipCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    requestedCents?: true
    approvedCents?: true
    note?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ScholarshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scholarship to aggregate.
     */
    where?: ScholarshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scholarships to fetch.
     */
    orderBy?: ScholarshipOrderByWithRelationInput | ScholarshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScholarshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scholarships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scholarships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Scholarships
    **/
    _count?: true | ScholarshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScholarshipAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScholarshipSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScholarshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScholarshipMaxAggregateInputType
  }

  export type GetScholarshipAggregateType<T extends ScholarshipAggregateArgs> = {
        [P in keyof T & keyof AggregateScholarship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScholarship[P]>
      : GetScalarType<T[P], AggregateScholarship[P]>
  }




  export type ScholarshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScholarshipWhereInput
    orderBy?: ScholarshipOrderByWithAggregationInput | ScholarshipOrderByWithAggregationInput[]
    by: ScholarshipScalarFieldEnum[] | ScholarshipScalarFieldEnum
    having?: ScholarshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScholarshipCountAggregateInputType | true
    _avg?: ScholarshipAvgAggregateInputType
    _sum?: ScholarshipSumAggregateInputType
    _min?: ScholarshipMinAggregateInputType
    _max?: ScholarshipMaxAggregateInputType
  }

  export type ScholarshipGroupByOutputType = {
    id: string
    userId: string
    status: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents: number | null
    note: string | null
    createdAt: Date
    updatedAt: Date
    _count: ScholarshipCountAggregateOutputType | null
    _avg: ScholarshipAvgAggregateOutputType | null
    _sum: ScholarshipSumAggregateOutputType | null
    _min: ScholarshipMinAggregateOutputType | null
    _max: ScholarshipMaxAggregateOutputType | null
  }

  type GetScholarshipGroupByPayload<T extends ScholarshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScholarshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScholarshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScholarshipGroupByOutputType[P]>
            : GetScalarType<T[P], ScholarshipGroupByOutputType[P]>
        }
      >
    >


  export type ScholarshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    requestedCents?: boolean
    approvedCents?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scholarship"]>

  export type ScholarshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    requestedCents?: boolean
    approvedCents?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scholarship"]>

  export type ScholarshipSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    requestedCents?: boolean
    approvedCents?: boolean
    note?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScholarshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ScholarshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ScholarshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Scholarship"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: $Enums.ScholarshipStatus
      requestedCents: number
      approvedCents: number | null
      note: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["scholarship"]>
    composites: {}
  }

  type ScholarshipGetPayload<S extends boolean | null | undefined | ScholarshipDefaultArgs> = $Result.GetResult<Prisma.$ScholarshipPayload, S>

  type ScholarshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ScholarshipFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ScholarshipCountAggregateInputType | true
    }

  export interface ScholarshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Scholarship'], meta: { name: 'Scholarship' } }
    /**
     * Find zero or one Scholarship that matches the filter.
     * @param {ScholarshipFindUniqueArgs} args - Arguments to find a Scholarship
     * @example
     * // Get one Scholarship
     * const scholarship = await prisma.scholarship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScholarshipFindUniqueArgs>(args: SelectSubset<T, ScholarshipFindUniqueArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Scholarship that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ScholarshipFindUniqueOrThrowArgs} args - Arguments to find a Scholarship
     * @example
     * // Get one Scholarship
     * const scholarship = await prisma.scholarship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScholarshipFindUniqueOrThrowArgs>(args: SelectSubset<T, ScholarshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Scholarship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipFindFirstArgs} args - Arguments to find a Scholarship
     * @example
     * // Get one Scholarship
     * const scholarship = await prisma.scholarship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScholarshipFindFirstArgs>(args?: SelectSubset<T, ScholarshipFindFirstArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Scholarship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipFindFirstOrThrowArgs} args - Arguments to find a Scholarship
     * @example
     * // Get one Scholarship
     * const scholarship = await prisma.scholarship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScholarshipFindFirstOrThrowArgs>(args?: SelectSubset<T, ScholarshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Scholarships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scholarships
     * const scholarships = await prisma.scholarship.findMany()
     * 
     * // Get first 10 Scholarships
     * const scholarships = await prisma.scholarship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scholarshipWithIdOnly = await prisma.scholarship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScholarshipFindManyArgs>(args?: SelectSubset<T, ScholarshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Scholarship.
     * @param {ScholarshipCreateArgs} args - Arguments to create a Scholarship.
     * @example
     * // Create one Scholarship
     * const Scholarship = await prisma.scholarship.create({
     *   data: {
     *     // ... data to create a Scholarship
     *   }
     * })
     * 
     */
    create<T extends ScholarshipCreateArgs>(args: SelectSubset<T, ScholarshipCreateArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Scholarships.
     * @param {ScholarshipCreateManyArgs} args - Arguments to create many Scholarships.
     * @example
     * // Create many Scholarships
     * const scholarship = await prisma.scholarship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScholarshipCreateManyArgs>(args?: SelectSubset<T, ScholarshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Scholarships and returns the data saved in the database.
     * @param {ScholarshipCreateManyAndReturnArgs} args - Arguments to create many Scholarships.
     * @example
     * // Create many Scholarships
     * const scholarship = await prisma.scholarship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Scholarships and only return the `id`
     * const scholarshipWithIdOnly = await prisma.scholarship.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScholarshipCreateManyAndReturnArgs>(args?: SelectSubset<T, ScholarshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Scholarship.
     * @param {ScholarshipDeleteArgs} args - Arguments to delete one Scholarship.
     * @example
     * // Delete one Scholarship
     * const Scholarship = await prisma.scholarship.delete({
     *   where: {
     *     // ... filter to delete one Scholarship
     *   }
     * })
     * 
     */
    delete<T extends ScholarshipDeleteArgs>(args: SelectSubset<T, ScholarshipDeleteArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Scholarship.
     * @param {ScholarshipUpdateArgs} args - Arguments to update one Scholarship.
     * @example
     * // Update one Scholarship
     * const scholarship = await prisma.scholarship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScholarshipUpdateArgs>(args: SelectSubset<T, ScholarshipUpdateArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Scholarships.
     * @param {ScholarshipDeleteManyArgs} args - Arguments to filter Scholarships to delete.
     * @example
     * // Delete a few Scholarships
     * const { count } = await prisma.scholarship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScholarshipDeleteManyArgs>(args?: SelectSubset<T, ScholarshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Scholarships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scholarships
     * const scholarship = await prisma.scholarship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScholarshipUpdateManyArgs>(args: SelectSubset<T, ScholarshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Scholarship.
     * @param {ScholarshipUpsertArgs} args - Arguments to update or create a Scholarship.
     * @example
     * // Update or create a Scholarship
     * const scholarship = await prisma.scholarship.upsert({
     *   create: {
     *     // ... data to create a Scholarship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Scholarship we want to update
     *   }
     * })
     */
    upsert<T extends ScholarshipUpsertArgs>(args: SelectSubset<T, ScholarshipUpsertArgs<ExtArgs>>): Prisma__ScholarshipClient<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Scholarships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipCountArgs} args - Arguments to filter Scholarships to count.
     * @example
     * // Count the number of Scholarships
     * const count = await prisma.scholarship.count({
     *   where: {
     *     // ... the filter for the Scholarships we want to count
     *   }
     * })
    **/
    count<T extends ScholarshipCountArgs>(
      args?: Subset<T, ScholarshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScholarshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Scholarship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScholarshipAggregateArgs>(args: Subset<T, ScholarshipAggregateArgs>): Prisma.PrismaPromise<GetScholarshipAggregateType<T>>

    /**
     * Group by Scholarship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScholarshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScholarshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScholarshipGroupByArgs['orderBy'] }
        : { orderBy?: ScholarshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScholarshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScholarshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Scholarship model
   */
  readonly fields: ScholarshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Scholarship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScholarshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Scholarship model
   */ 
  interface ScholarshipFieldRefs {
    readonly id: FieldRef<"Scholarship", 'String'>
    readonly userId: FieldRef<"Scholarship", 'String'>
    readonly status: FieldRef<"Scholarship", 'ScholarshipStatus'>
    readonly requestedCents: FieldRef<"Scholarship", 'Int'>
    readonly approvedCents: FieldRef<"Scholarship", 'Int'>
    readonly note: FieldRef<"Scholarship", 'String'>
    readonly createdAt: FieldRef<"Scholarship", 'DateTime'>
    readonly updatedAt: FieldRef<"Scholarship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Scholarship findUnique
   */
  export type ScholarshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter, which Scholarship to fetch.
     */
    where: ScholarshipWhereUniqueInput
  }

  /**
   * Scholarship findUniqueOrThrow
   */
  export type ScholarshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter, which Scholarship to fetch.
     */
    where: ScholarshipWhereUniqueInput
  }

  /**
   * Scholarship findFirst
   */
  export type ScholarshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter, which Scholarship to fetch.
     */
    where?: ScholarshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scholarships to fetch.
     */
    orderBy?: ScholarshipOrderByWithRelationInput | ScholarshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scholarships.
     */
    cursor?: ScholarshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scholarships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scholarships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scholarships.
     */
    distinct?: ScholarshipScalarFieldEnum | ScholarshipScalarFieldEnum[]
  }

  /**
   * Scholarship findFirstOrThrow
   */
  export type ScholarshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter, which Scholarship to fetch.
     */
    where?: ScholarshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scholarships to fetch.
     */
    orderBy?: ScholarshipOrderByWithRelationInput | ScholarshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Scholarships.
     */
    cursor?: ScholarshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scholarships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scholarships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Scholarships.
     */
    distinct?: ScholarshipScalarFieldEnum | ScholarshipScalarFieldEnum[]
  }

  /**
   * Scholarship findMany
   */
  export type ScholarshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter, which Scholarships to fetch.
     */
    where?: ScholarshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Scholarships to fetch.
     */
    orderBy?: ScholarshipOrderByWithRelationInput | ScholarshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Scholarships.
     */
    cursor?: ScholarshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Scholarships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Scholarships.
     */
    skip?: number
    distinct?: ScholarshipScalarFieldEnum | ScholarshipScalarFieldEnum[]
  }

  /**
   * Scholarship create
   */
  export type ScholarshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * The data needed to create a Scholarship.
     */
    data: XOR<ScholarshipCreateInput, ScholarshipUncheckedCreateInput>
  }

  /**
   * Scholarship createMany
   */
  export type ScholarshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scholarships.
     */
    data: ScholarshipCreateManyInput | ScholarshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Scholarship createManyAndReturn
   */
  export type ScholarshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Scholarships.
     */
    data: ScholarshipCreateManyInput | ScholarshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Scholarship update
   */
  export type ScholarshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * The data needed to update a Scholarship.
     */
    data: XOR<ScholarshipUpdateInput, ScholarshipUncheckedUpdateInput>
    /**
     * Choose, which Scholarship to update.
     */
    where: ScholarshipWhereUniqueInput
  }

  /**
   * Scholarship updateMany
   */
  export type ScholarshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Scholarships.
     */
    data: XOR<ScholarshipUpdateManyMutationInput, ScholarshipUncheckedUpdateManyInput>
    /**
     * Filter which Scholarships to update
     */
    where?: ScholarshipWhereInput
  }

  /**
   * Scholarship upsert
   */
  export type ScholarshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * The filter to search for the Scholarship to update in case it exists.
     */
    where: ScholarshipWhereUniqueInput
    /**
     * In case the Scholarship found by the `where` argument doesn't exist, create a new Scholarship with this data.
     */
    create: XOR<ScholarshipCreateInput, ScholarshipUncheckedCreateInput>
    /**
     * In case the Scholarship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScholarshipUpdateInput, ScholarshipUncheckedUpdateInput>
  }

  /**
   * Scholarship delete
   */
  export type ScholarshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
    /**
     * Filter which Scholarship to delete.
     */
    where: ScholarshipWhereUniqueInput
  }

  /**
   * Scholarship deleteMany
   */
  export type ScholarshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Scholarships to delete
     */
    where?: ScholarshipWhereInput
  }

  /**
   * Scholarship without action
   */
  export type ScholarshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scholarship
     */
    select?: ScholarshipSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScholarshipInclude<ExtArgs> | null
  }


  /**
   * Model Donation
   */

  export type AggregateDonation = {
    _count: DonationCountAggregateOutputType | null
    _avg: DonationAvgAggregateOutputType | null
    _sum: DonationSumAggregateOutputType | null
    _min: DonationMinAggregateOutputType | null
    _max: DonationMaxAggregateOutputType | null
  }

  export type DonationAvgAggregateOutputType = {
    amountCents: number | null
  }

  export type DonationSumAggregateOutputType = {
    amountCents: number | null
  }

  export type DonationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tier: $Enums.DonationTier | null
    amountCents: number | null
    stripePaymentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DonationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tier: $Enums.DonationTier | null
    amountCents: number | null
    stripePaymentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DonationCountAggregateOutputType = {
    id: number
    userId: number
    tier: number
    amountCents: number
    stripePaymentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DonationAvgAggregateInputType = {
    amountCents?: true
  }

  export type DonationSumAggregateInputType = {
    amountCents?: true
  }

  export type DonationMinAggregateInputType = {
    id?: true
    userId?: true
    tier?: true
    amountCents?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DonationMaxAggregateInputType = {
    id?: true
    userId?: true
    tier?: true
    amountCents?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DonationCountAggregateInputType = {
    id?: true
    userId?: true
    tier?: true
    amountCents?: true
    stripePaymentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DonationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Donation to aggregate.
     */
    where?: DonationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Donations to fetch.
     */
    orderBy?: DonationOrderByWithRelationInput | DonationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DonationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Donations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Donations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Donations
    **/
    _count?: true | DonationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DonationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DonationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DonationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DonationMaxAggregateInputType
  }

  export type GetDonationAggregateType<T extends DonationAggregateArgs> = {
        [P in keyof T & keyof AggregateDonation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDonation[P]>
      : GetScalarType<T[P], AggregateDonation[P]>
  }




  export type DonationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DonationWhereInput
    orderBy?: DonationOrderByWithAggregationInput | DonationOrderByWithAggregationInput[]
    by: DonationScalarFieldEnum[] | DonationScalarFieldEnum
    having?: DonationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DonationCountAggregateInputType | true
    _avg?: DonationAvgAggregateInputType
    _sum?: DonationSumAggregateInputType
    _min?: DonationMinAggregateInputType
    _max?: DonationMaxAggregateInputType
  }

  export type DonationGroupByOutputType = {
    id: string
    userId: string | null
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId: string | null
    createdAt: Date
    updatedAt: Date
    _count: DonationCountAggregateOutputType | null
    _avg: DonationAvgAggregateOutputType | null
    _sum: DonationSumAggregateOutputType | null
    _min: DonationMinAggregateOutputType | null
    _max: DonationMaxAggregateOutputType | null
  }

  type GetDonationGroupByPayload<T extends DonationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DonationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DonationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DonationGroupByOutputType[P]>
            : GetScalarType<T[P], DonationGroupByOutputType[P]>
        }
      >
    >


  export type DonationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tier?: boolean
    amountCents?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Donation$userArgs<ExtArgs>
  }, ExtArgs["result"]["donation"]>

  export type DonationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tier?: boolean
    amountCents?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Donation$userArgs<ExtArgs>
  }, ExtArgs["result"]["donation"]>

  export type DonationSelectScalar = {
    id?: boolean
    userId?: boolean
    tier?: boolean
    amountCents?: boolean
    stripePaymentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DonationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Donation$userArgs<ExtArgs>
  }
  export type DonationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Donation$userArgs<ExtArgs>
  }

  export type $DonationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Donation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      tier: $Enums.DonationTier
      amountCents: number
      stripePaymentId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["donation"]>
    composites: {}
  }

  type DonationGetPayload<S extends boolean | null | undefined | DonationDefaultArgs> = $Result.GetResult<Prisma.$DonationPayload, S>

  type DonationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DonationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DonationCountAggregateInputType | true
    }

  export interface DonationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Donation'], meta: { name: 'Donation' } }
    /**
     * Find zero or one Donation that matches the filter.
     * @param {DonationFindUniqueArgs} args - Arguments to find a Donation
     * @example
     * // Get one Donation
     * const donation = await prisma.donation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DonationFindUniqueArgs>(args: SelectSubset<T, DonationFindUniqueArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Donation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DonationFindUniqueOrThrowArgs} args - Arguments to find a Donation
     * @example
     * // Get one Donation
     * const donation = await prisma.donation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DonationFindUniqueOrThrowArgs>(args: SelectSubset<T, DonationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Donation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationFindFirstArgs} args - Arguments to find a Donation
     * @example
     * // Get one Donation
     * const donation = await prisma.donation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DonationFindFirstArgs>(args?: SelectSubset<T, DonationFindFirstArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Donation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationFindFirstOrThrowArgs} args - Arguments to find a Donation
     * @example
     * // Get one Donation
     * const donation = await prisma.donation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DonationFindFirstOrThrowArgs>(args?: SelectSubset<T, DonationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Donations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Donations
     * const donations = await prisma.donation.findMany()
     * 
     * // Get first 10 Donations
     * const donations = await prisma.donation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const donationWithIdOnly = await prisma.donation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DonationFindManyArgs>(args?: SelectSubset<T, DonationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Donation.
     * @param {DonationCreateArgs} args - Arguments to create a Donation.
     * @example
     * // Create one Donation
     * const Donation = await prisma.donation.create({
     *   data: {
     *     // ... data to create a Donation
     *   }
     * })
     * 
     */
    create<T extends DonationCreateArgs>(args: SelectSubset<T, DonationCreateArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Donations.
     * @param {DonationCreateManyArgs} args - Arguments to create many Donations.
     * @example
     * // Create many Donations
     * const donation = await prisma.donation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DonationCreateManyArgs>(args?: SelectSubset<T, DonationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Donations and returns the data saved in the database.
     * @param {DonationCreateManyAndReturnArgs} args - Arguments to create many Donations.
     * @example
     * // Create many Donations
     * const donation = await prisma.donation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Donations and only return the `id`
     * const donationWithIdOnly = await prisma.donation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DonationCreateManyAndReturnArgs>(args?: SelectSubset<T, DonationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Donation.
     * @param {DonationDeleteArgs} args - Arguments to delete one Donation.
     * @example
     * // Delete one Donation
     * const Donation = await prisma.donation.delete({
     *   where: {
     *     // ... filter to delete one Donation
     *   }
     * })
     * 
     */
    delete<T extends DonationDeleteArgs>(args: SelectSubset<T, DonationDeleteArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Donation.
     * @param {DonationUpdateArgs} args - Arguments to update one Donation.
     * @example
     * // Update one Donation
     * const donation = await prisma.donation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DonationUpdateArgs>(args: SelectSubset<T, DonationUpdateArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Donations.
     * @param {DonationDeleteManyArgs} args - Arguments to filter Donations to delete.
     * @example
     * // Delete a few Donations
     * const { count } = await prisma.donation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DonationDeleteManyArgs>(args?: SelectSubset<T, DonationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Donations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Donations
     * const donation = await prisma.donation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DonationUpdateManyArgs>(args: SelectSubset<T, DonationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Donation.
     * @param {DonationUpsertArgs} args - Arguments to update or create a Donation.
     * @example
     * // Update or create a Donation
     * const donation = await prisma.donation.upsert({
     *   create: {
     *     // ... data to create a Donation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Donation we want to update
     *   }
     * })
     */
    upsert<T extends DonationUpsertArgs>(args: SelectSubset<T, DonationUpsertArgs<ExtArgs>>): Prisma__DonationClient<$Result.GetResult<Prisma.$DonationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Donations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationCountArgs} args - Arguments to filter Donations to count.
     * @example
     * // Count the number of Donations
     * const count = await prisma.donation.count({
     *   where: {
     *     // ... the filter for the Donations we want to count
     *   }
     * })
    **/
    count<T extends DonationCountArgs>(
      args?: Subset<T, DonationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DonationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Donation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DonationAggregateArgs>(args: Subset<T, DonationAggregateArgs>): Prisma.PrismaPromise<GetDonationAggregateType<T>>

    /**
     * Group by Donation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DonationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DonationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DonationGroupByArgs['orderBy'] }
        : { orderBy?: DonationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DonationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDonationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Donation model
   */
  readonly fields: DonationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Donation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DonationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Donation$userArgs<ExtArgs> = {}>(args?: Subset<T, Donation$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Donation model
   */ 
  interface DonationFieldRefs {
    readonly id: FieldRef<"Donation", 'String'>
    readonly userId: FieldRef<"Donation", 'String'>
    readonly tier: FieldRef<"Donation", 'DonationTier'>
    readonly amountCents: FieldRef<"Donation", 'Int'>
    readonly stripePaymentId: FieldRef<"Donation", 'String'>
    readonly createdAt: FieldRef<"Donation", 'DateTime'>
    readonly updatedAt: FieldRef<"Donation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Donation findUnique
   */
  export type DonationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter, which Donation to fetch.
     */
    where: DonationWhereUniqueInput
  }

  /**
   * Donation findUniqueOrThrow
   */
  export type DonationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter, which Donation to fetch.
     */
    where: DonationWhereUniqueInput
  }

  /**
   * Donation findFirst
   */
  export type DonationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter, which Donation to fetch.
     */
    where?: DonationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Donations to fetch.
     */
    orderBy?: DonationOrderByWithRelationInput | DonationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Donations.
     */
    cursor?: DonationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Donations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Donations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Donations.
     */
    distinct?: DonationScalarFieldEnum | DonationScalarFieldEnum[]
  }

  /**
   * Donation findFirstOrThrow
   */
  export type DonationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter, which Donation to fetch.
     */
    where?: DonationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Donations to fetch.
     */
    orderBy?: DonationOrderByWithRelationInput | DonationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Donations.
     */
    cursor?: DonationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Donations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Donations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Donations.
     */
    distinct?: DonationScalarFieldEnum | DonationScalarFieldEnum[]
  }

  /**
   * Donation findMany
   */
  export type DonationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter, which Donations to fetch.
     */
    where?: DonationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Donations to fetch.
     */
    orderBy?: DonationOrderByWithRelationInput | DonationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Donations.
     */
    cursor?: DonationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Donations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Donations.
     */
    skip?: number
    distinct?: DonationScalarFieldEnum | DonationScalarFieldEnum[]
  }

  /**
   * Donation create
   */
  export type DonationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * The data needed to create a Donation.
     */
    data: XOR<DonationCreateInput, DonationUncheckedCreateInput>
  }

  /**
   * Donation createMany
   */
  export type DonationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Donations.
     */
    data: DonationCreateManyInput | DonationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Donation createManyAndReturn
   */
  export type DonationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Donations.
     */
    data: DonationCreateManyInput | DonationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Donation update
   */
  export type DonationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * The data needed to update a Donation.
     */
    data: XOR<DonationUpdateInput, DonationUncheckedUpdateInput>
    /**
     * Choose, which Donation to update.
     */
    where: DonationWhereUniqueInput
  }

  /**
   * Donation updateMany
   */
  export type DonationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Donations.
     */
    data: XOR<DonationUpdateManyMutationInput, DonationUncheckedUpdateManyInput>
    /**
     * Filter which Donations to update
     */
    where?: DonationWhereInput
  }

  /**
   * Donation upsert
   */
  export type DonationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * The filter to search for the Donation to update in case it exists.
     */
    where: DonationWhereUniqueInput
    /**
     * In case the Donation found by the `where` argument doesn't exist, create a new Donation with this data.
     */
    create: XOR<DonationCreateInput, DonationUncheckedCreateInput>
    /**
     * In case the Donation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DonationUpdateInput, DonationUncheckedUpdateInput>
  }

  /**
   * Donation delete
   */
  export type DonationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
    /**
     * Filter which Donation to delete.
     */
    where: DonationWhereUniqueInput
  }

  /**
   * Donation deleteMany
   */
  export type DonationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Donations to delete
     */
    where?: DonationWhereInput
  }

  /**
   * Donation.user
   */
  export type Donation$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Donation without action
   */
  export type DonationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Donation
     */
    select?: DonationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DonationInclude<ExtArgs> | null
  }


  /**
   * Model OrgInquiry
   */

  export type AggregateOrgInquiry = {
    _count: OrgInquiryCountAggregateOutputType | null
    _avg: OrgInquiryAvgAggregateOutputType | null
    _sum: OrgInquirySumAggregateOutputType | null
    _min: OrgInquiryMinAggregateOutputType | null
    _max: OrgInquiryMaxAggregateOutputType | null
  }

  export type OrgInquiryAvgAggregateOutputType = {
    headcount: number | null
  }

  export type OrgInquirySumAggregateOutputType = {
    headcount: number | null
  }

  export type OrgInquiryMinAggregateOutputType = {
    id: string | null
    orgName: string | null
    contactName: string | null
    email: string | null
    status: $Enums.InquiryStatus | null
    isNonprofit: boolean | null
    ein: string | null
    eventType: $Enums.OrgInquiryEventType | null
    headcount: number | null
    preferredStart: Date | null
    preferredEnd: Date | null
    message: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgInquiryMaxAggregateOutputType = {
    id: string | null
    orgName: string | null
    contactName: string | null
    email: string | null
    status: $Enums.InquiryStatus | null
    isNonprofit: boolean | null
    ein: string | null
    eventType: $Enums.OrgInquiryEventType | null
    headcount: number | null
    preferredStart: Date | null
    preferredEnd: Date | null
    message: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgInquiryCountAggregateOutputType = {
    id: number
    orgName: number
    contactName: number
    email: number
    status: number
    isNonprofit: number
    ein: number
    eventType: number
    headcount: number
    preferredStart: number
    preferredEnd: number
    message: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrgInquiryAvgAggregateInputType = {
    headcount?: true
  }

  export type OrgInquirySumAggregateInputType = {
    headcount?: true
  }

  export type OrgInquiryMinAggregateInputType = {
    id?: true
    orgName?: true
    contactName?: true
    email?: true
    status?: true
    isNonprofit?: true
    ein?: true
    eventType?: true
    headcount?: true
    preferredStart?: true
    preferredEnd?: true
    message?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgInquiryMaxAggregateInputType = {
    id?: true
    orgName?: true
    contactName?: true
    email?: true
    status?: true
    isNonprofit?: true
    ein?: true
    eventType?: true
    headcount?: true
    preferredStart?: true
    preferredEnd?: true
    message?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgInquiryCountAggregateInputType = {
    id?: true
    orgName?: true
    contactName?: true
    email?: true
    status?: true
    isNonprofit?: true
    ein?: true
    eventType?: true
    headcount?: true
    preferredStart?: true
    preferredEnd?: true
    message?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrgInquiryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrgInquiry to aggregate.
     */
    where?: OrgInquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrgInquiries to fetch.
     */
    orderBy?: OrgInquiryOrderByWithRelationInput | OrgInquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrgInquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrgInquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrgInquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrgInquiries
    **/
    _count?: true | OrgInquiryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrgInquiryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrgInquirySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrgInquiryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrgInquiryMaxAggregateInputType
  }

  export type GetOrgInquiryAggregateType<T extends OrgInquiryAggregateArgs> = {
        [P in keyof T & keyof AggregateOrgInquiry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrgInquiry[P]>
      : GetScalarType<T[P], AggregateOrgInquiry[P]>
  }




  export type OrgInquiryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrgInquiryWhereInput
    orderBy?: OrgInquiryOrderByWithAggregationInput | OrgInquiryOrderByWithAggregationInput[]
    by: OrgInquiryScalarFieldEnum[] | OrgInquiryScalarFieldEnum
    having?: OrgInquiryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrgInquiryCountAggregateInputType | true
    _avg?: OrgInquiryAvgAggregateInputType
    _sum?: OrgInquirySumAggregateInputType
    _min?: OrgInquiryMinAggregateInputType
    _max?: OrgInquiryMaxAggregateInputType
  }

  export type OrgInquiryGroupByOutputType = {
    id: string
    orgName: string
    contactName: string
    email: string
    status: $Enums.InquiryStatus
    isNonprofit: boolean
    ein: string | null
    eventType: $Enums.OrgInquiryEventType
    headcount: number
    preferredStart: Date
    preferredEnd: Date
    message: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrgInquiryCountAggregateOutputType | null
    _avg: OrgInquiryAvgAggregateOutputType | null
    _sum: OrgInquirySumAggregateOutputType | null
    _min: OrgInquiryMinAggregateOutputType | null
    _max: OrgInquiryMaxAggregateOutputType | null
  }

  type GetOrgInquiryGroupByPayload<T extends OrgInquiryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrgInquiryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrgInquiryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrgInquiryGroupByOutputType[P]>
            : GetScalarType<T[P], OrgInquiryGroupByOutputType[P]>
        }
      >
    >


  export type OrgInquirySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgName?: boolean
    contactName?: boolean
    email?: boolean
    status?: boolean
    isNonprofit?: boolean
    ein?: boolean
    eventType?: boolean
    headcount?: boolean
    preferredStart?: boolean
    preferredEnd?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orgInquiry"]>

  export type OrgInquirySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgName?: boolean
    contactName?: boolean
    email?: boolean
    status?: boolean
    isNonprofit?: boolean
    ein?: boolean
    eventType?: boolean
    headcount?: boolean
    preferredStart?: boolean
    preferredEnd?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orgInquiry"]>

  export type OrgInquirySelectScalar = {
    id?: boolean
    orgName?: boolean
    contactName?: boolean
    email?: boolean
    status?: boolean
    isNonprofit?: boolean
    ein?: boolean
    eventType?: boolean
    headcount?: boolean
    preferredStart?: boolean
    preferredEnd?: boolean
    message?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $OrgInquiryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrgInquiry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgName: string
      contactName: string
      email: string
      status: $Enums.InquiryStatus
      isNonprofit: boolean
      ein: string | null
      eventType: $Enums.OrgInquiryEventType
      headcount: number
      preferredStart: Date
      preferredEnd: Date
      message: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["orgInquiry"]>
    composites: {}
  }

  type OrgInquiryGetPayload<S extends boolean | null | undefined | OrgInquiryDefaultArgs> = $Result.GetResult<Prisma.$OrgInquiryPayload, S>

  type OrgInquiryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrgInquiryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrgInquiryCountAggregateInputType | true
    }

  export interface OrgInquiryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrgInquiry'], meta: { name: 'OrgInquiry' } }
    /**
     * Find zero or one OrgInquiry that matches the filter.
     * @param {OrgInquiryFindUniqueArgs} args - Arguments to find a OrgInquiry
     * @example
     * // Get one OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrgInquiryFindUniqueArgs>(args: SelectSubset<T, OrgInquiryFindUniqueArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OrgInquiry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrgInquiryFindUniqueOrThrowArgs} args - Arguments to find a OrgInquiry
     * @example
     * // Get one OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrgInquiryFindUniqueOrThrowArgs>(args: SelectSubset<T, OrgInquiryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OrgInquiry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryFindFirstArgs} args - Arguments to find a OrgInquiry
     * @example
     * // Get one OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrgInquiryFindFirstArgs>(args?: SelectSubset<T, OrgInquiryFindFirstArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OrgInquiry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryFindFirstOrThrowArgs} args - Arguments to find a OrgInquiry
     * @example
     * // Get one OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrgInquiryFindFirstOrThrowArgs>(args?: SelectSubset<T, OrgInquiryFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OrgInquiries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrgInquiries
     * const orgInquiries = await prisma.orgInquiry.findMany()
     * 
     * // Get first 10 OrgInquiries
     * const orgInquiries = await prisma.orgInquiry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orgInquiryWithIdOnly = await prisma.orgInquiry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrgInquiryFindManyArgs>(args?: SelectSubset<T, OrgInquiryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OrgInquiry.
     * @param {OrgInquiryCreateArgs} args - Arguments to create a OrgInquiry.
     * @example
     * // Create one OrgInquiry
     * const OrgInquiry = await prisma.orgInquiry.create({
     *   data: {
     *     // ... data to create a OrgInquiry
     *   }
     * })
     * 
     */
    create<T extends OrgInquiryCreateArgs>(args: SelectSubset<T, OrgInquiryCreateArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OrgInquiries.
     * @param {OrgInquiryCreateManyArgs} args - Arguments to create many OrgInquiries.
     * @example
     * // Create many OrgInquiries
     * const orgInquiry = await prisma.orgInquiry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrgInquiryCreateManyArgs>(args?: SelectSubset<T, OrgInquiryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrgInquiries and returns the data saved in the database.
     * @param {OrgInquiryCreateManyAndReturnArgs} args - Arguments to create many OrgInquiries.
     * @example
     * // Create many OrgInquiries
     * const orgInquiry = await prisma.orgInquiry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrgInquiries and only return the `id`
     * const orgInquiryWithIdOnly = await prisma.orgInquiry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrgInquiryCreateManyAndReturnArgs>(args?: SelectSubset<T, OrgInquiryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OrgInquiry.
     * @param {OrgInquiryDeleteArgs} args - Arguments to delete one OrgInquiry.
     * @example
     * // Delete one OrgInquiry
     * const OrgInquiry = await prisma.orgInquiry.delete({
     *   where: {
     *     // ... filter to delete one OrgInquiry
     *   }
     * })
     * 
     */
    delete<T extends OrgInquiryDeleteArgs>(args: SelectSubset<T, OrgInquiryDeleteArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OrgInquiry.
     * @param {OrgInquiryUpdateArgs} args - Arguments to update one OrgInquiry.
     * @example
     * // Update one OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrgInquiryUpdateArgs>(args: SelectSubset<T, OrgInquiryUpdateArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OrgInquiries.
     * @param {OrgInquiryDeleteManyArgs} args - Arguments to filter OrgInquiries to delete.
     * @example
     * // Delete a few OrgInquiries
     * const { count } = await prisma.orgInquiry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrgInquiryDeleteManyArgs>(args?: SelectSubset<T, OrgInquiryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrgInquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrgInquiries
     * const orgInquiry = await prisma.orgInquiry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrgInquiryUpdateManyArgs>(args: SelectSubset<T, OrgInquiryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OrgInquiry.
     * @param {OrgInquiryUpsertArgs} args - Arguments to update or create a OrgInquiry.
     * @example
     * // Update or create a OrgInquiry
     * const orgInquiry = await prisma.orgInquiry.upsert({
     *   create: {
     *     // ... data to create a OrgInquiry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrgInquiry we want to update
     *   }
     * })
     */
    upsert<T extends OrgInquiryUpsertArgs>(args: SelectSubset<T, OrgInquiryUpsertArgs<ExtArgs>>): Prisma__OrgInquiryClient<$Result.GetResult<Prisma.$OrgInquiryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OrgInquiries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryCountArgs} args - Arguments to filter OrgInquiries to count.
     * @example
     * // Count the number of OrgInquiries
     * const count = await prisma.orgInquiry.count({
     *   where: {
     *     // ... the filter for the OrgInquiries we want to count
     *   }
     * })
    **/
    count<T extends OrgInquiryCountArgs>(
      args?: Subset<T, OrgInquiryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrgInquiryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrgInquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrgInquiryAggregateArgs>(args: Subset<T, OrgInquiryAggregateArgs>): Prisma.PrismaPromise<GetOrgInquiryAggregateType<T>>

    /**
     * Group by OrgInquiry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrgInquiryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrgInquiryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrgInquiryGroupByArgs['orderBy'] }
        : { orderBy?: OrgInquiryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrgInquiryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrgInquiryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrgInquiry model
   */
  readonly fields: OrgInquiryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrgInquiry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrgInquiryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrgInquiry model
   */ 
  interface OrgInquiryFieldRefs {
    readonly id: FieldRef<"OrgInquiry", 'String'>
    readonly orgName: FieldRef<"OrgInquiry", 'String'>
    readonly contactName: FieldRef<"OrgInquiry", 'String'>
    readonly email: FieldRef<"OrgInquiry", 'String'>
    readonly status: FieldRef<"OrgInquiry", 'InquiryStatus'>
    readonly isNonprofit: FieldRef<"OrgInquiry", 'Boolean'>
    readonly ein: FieldRef<"OrgInquiry", 'String'>
    readonly eventType: FieldRef<"OrgInquiry", 'OrgInquiryEventType'>
    readonly headcount: FieldRef<"OrgInquiry", 'Int'>
    readonly preferredStart: FieldRef<"OrgInquiry", 'DateTime'>
    readonly preferredEnd: FieldRef<"OrgInquiry", 'DateTime'>
    readonly message: FieldRef<"OrgInquiry", 'String'>
    readonly createdAt: FieldRef<"OrgInquiry", 'DateTime'>
    readonly updatedAt: FieldRef<"OrgInquiry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrgInquiry findUnique
   */
  export type OrgInquiryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter, which OrgInquiry to fetch.
     */
    where: OrgInquiryWhereUniqueInput
  }

  /**
   * OrgInquiry findUniqueOrThrow
   */
  export type OrgInquiryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter, which OrgInquiry to fetch.
     */
    where: OrgInquiryWhereUniqueInput
  }

  /**
   * OrgInquiry findFirst
   */
  export type OrgInquiryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter, which OrgInquiry to fetch.
     */
    where?: OrgInquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrgInquiries to fetch.
     */
    orderBy?: OrgInquiryOrderByWithRelationInput | OrgInquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrgInquiries.
     */
    cursor?: OrgInquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrgInquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrgInquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrgInquiries.
     */
    distinct?: OrgInquiryScalarFieldEnum | OrgInquiryScalarFieldEnum[]
  }

  /**
   * OrgInquiry findFirstOrThrow
   */
  export type OrgInquiryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter, which OrgInquiry to fetch.
     */
    where?: OrgInquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrgInquiries to fetch.
     */
    orderBy?: OrgInquiryOrderByWithRelationInput | OrgInquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrgInquiries.
     */
    cursor?: OrgInquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrgInquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrgInquiries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrgInquiries.
     */
    distinct?: OrgInquiryScalarFieldEnum | OrgInquiryScalarFieldEnum[]
  }

  /**
   * OrgInquiry findMany
   */
  export type OrgInquiryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter, which OrgInquiries to fetch.
     */
    where?: OrgInquiryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrgInquiries to fetch.
     */
    orderBy?: OrgInquiryOrderByWithRelationInput | OrgInquiryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrgInquiries.
     */
    cursor?: OrgInquiryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrgInquiries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrgInquiries.
     */
    skip?: number
    distinct?: OrgInquiryScalarFieldEnum | OrgInquiryScalarFieldEnum[]
  }

  /**
   * OrgInquiry create
   */
  export type OrgInquiryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * The data needed to create a OrgInquiry.
     */
    data: XOR<OrgInquiryCreateInput, OrgInquiryUncheckedCreateInput>
  }

  /**
   * OrgInquiry createMany
   */
  export type OrgInquiryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrgInquiries.
     */
    data: OrgInquiryCreateManyInput | OrgInquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrgInquiry createManyAndReturn
   */
  export type OrgInquiryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OrgInquiries.
     */
    data: OrgInquiryCreateManyInput | OrgInquiryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrgInquiry update
   */
  export type OrgInquiryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * The data needed to update a OrgInquiry.
     */
    data: XOR<OrgInquiryUpdateInput, OrgInquiryUncheckedUpdateInput>
    /**
     * Choose, which OrgInquiry to update.
     */
    where: OrgInquiryWhereUniqueInput
  }

  /**
   * OrgInquiry updateMany
   */
  export type OrgInquiryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrgInquiries.
     */
    data: XOR<OrgInquiryUpdateManyMutationInput, OrgInquiryUncheckedUpdateManyInput>
    /**
     * Filter which OrgInquiries to update
     */
    where?: OrgInquiryWhereInput
  }

  /**
   * OrgInquiry upsert
   */
  export type OrgInquiryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * The filter to search for the OrgInquiry to update in case it exists.
     */
    where: OrgInquiryWhereUniqueInput
    /**
     * In case the OrgInquiry found by the `where` argument doesn't exist, create a new OrgInquiry with this data.
     */
    create: XOR<OrgInquiryCreateInput, OrgInquiryUncheckedCreateInput>
    /**
     * In case the OrgInquiry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrgInquiryUpdateInput, OrgInquiryUncheckedUpdateInput>
  }

  /**
   * OrgInquiry delete
   */
  export type OrgInquiryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
    /**
     * Filter which OrgInquiry to delete.
     */
    where: OrgInquiryWhereUniqueInput
  }

  /**
   * OrgInquiry deleteMany
   */
  export type OrgInquiryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrgInquiries to delete
     */
    where?: OrgInquiryWhereInput
  }

  /**
   * OrgInquiry without action
   */
  export type OrgInquiryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrgInquiry
     */
    select?: OrgInquirySelect<ExtArgs> | null
  }


  /**
   * Model AdminAuditLog
   */

  export type AggregateAdminAuditLog = {
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  export type AdminAuditLogMinAggregateOutputType = {
    id: string | null
    correlationId: string | null
    actorId: string | null
    actorEmail: string | null
    action: string | null
    targetType: string | null
    targetId: string | null
    justification: string | null
    result: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogMaxAggregateOutputType = {
    id: string | null
    correlationId: string | null
    actorId: string | null
    actorEmail: string | null
    action: string | null
    targetType: string | null
    targetId: string | null
    justification: string | null
    result: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogCountAggregateOutputType = {
    id: number
    correlationId: number
    actorId: number
    actorEmail: number
    action: number
    targetType: number
    targetId: number
    before: number
    after: number
    justification: number
    result: number
    ip: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type AdminAuditLogMinAggregateInputType = {
    id?: true
    correlationId?: true
    actorId?: true
    actorEmail?: true
    action?: true
    targetType?: true
    targetId?: true
    justification?: true
    result?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AdminAuditLogMaxAggregateInputType = {
    id?: true
    correlationId?: true
    actorId?: true
    actorEmail?: true
    action?: true
    targetType?: true
    targetId?: true
    justification?: true
    result?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type AdminAuditLogCountAggregateInputType = {
    id?: true
    correlationId?: true
    actorId?: true
    actorEmail?: true
    action?: true
    targetType?: true
    targetId?: true
    before?: true
    after?: true
    justification?: true
    result?: true
    ip?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type AdminAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLog to aggregate.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminAuditLogs
    **/
    _count?: true | AdminAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminAuditLogMaxAggregateInputType
  }

  export type GetAdminAuditLogAggregateType<T extends AdminAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminAuditLog[P]>
      : GetScalarType<T[P], AggregateAdminAuditLog[P]>
  }




  export type AdminAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminAuditLogWhereInput
    orderBy?: AdminAuditLogOrderByWithAggregationInput | AdminAuditLogOrderByWithAggregationInput[]
    by: AdminAuditLogScalarFieldEnum[] | AdminAuditLogScalarFieldEnum
    having?: AdminAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminAuditLogCountAggregateInputType | true
    _min?: AdminAuditLogMinAggregateInputType
    _max?: AdminAuditLogMaxAggregateInputType
  }

  export type AdminAuditLogGroupByOutputType = {
    id: string
    correlationId: string
    actorId: string
    actorEmail: string
    action: string
    targetType: string | null
    targetId: string | null
    before: JsonValue | null
    after: JsonValue | null
    justification: string | null
    result: string
    ip: string | null
    userAgent: string | null
    createdAt: Date
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  type GetAdminAuditLogGroupByPayload<T extends AdminAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AdminAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorEmail?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    before?: boolean
    after?: boolean
    justification?: boolean
    result?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminAuditLog"]>

  export type AdminAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorEmail?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    before?: boolean
    after?: boolean
    justification?: boolean
    result?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["adminAuditLog"]>

  export type AdminAuditLogSelectScalar = {
    id?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorEmail?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    before?: boolean
    after?: boolean
    justification?: boolean
    result?: boolean
    ip?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }


  export type $AdminAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      correlationId: string
      actorId: string
      actorEmail: string
      action: string
      targetType: string | null
      targetId: string | null
      before: Prisma.JsonValue | null
      after: Prisma.JsonValue | null
      justification: string | null
      result: string
      ip: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["adminAuditLog"]>
    composites: {}
  }

  type AdminAuditLogGetPayload<S extends boolean | null | undefined | AdminAuditLogDefaultArgs> = $Result.GetResult<Prisma.$AdminAuditLogPayload, S>

  type AdminAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminAuditLogCountAggregateInputType | true
    }

  export interface AdminAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminAuditLog'], meta: { name: 'AdminAuditLog' } }
    /**
     * Find zero or one AdminAuditLog that matches the filter.
     * @param {AdminAuditLogFindUniqueArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminAuditLogFindUniqueArgs>(args: SelectSubset<T, AdminAuditLogFindUniqueArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AdminAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminAuditLogFindUniqueOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminAuditLogFindFirstArgs>(args?: SelectSubset<T, AdminAuditLogFindFirstArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AdminAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany()
     * 
     * // Get first 10 AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminAuditLogWithIdOnly = await prisma.adminAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminAuditLogFindManyArgs>(args?: SelectSubset<T, AdminAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AdminAuditLog.
     * @param {AdminAuditLogCreateArgs} args - Arguments to create a AdminAuditLog.
     * @example
     * // Create one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.create({
     *   data: {
     *     // ... data to create a AdminAuditLog
     *   }
     * })
     * 
     */
    create<T extends AdminAuditLogCreateArgs>(args: SelectSubset<T, AdminAuditLogCreateArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AdminAuditLogs.
     * @param {AdminAuditLogCreateManyArgs} args - Arguments to create many AdminAuditLogs.
     * @example
     * // Create many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminAuditLogCreateManyArgs>(args?: SelectSubset<T, AdminAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminAuditLogs and returns the data saved in the database.
     * @param {AdminAuditLogCreateManyAndReturnArgs} args - Arguments to create many AdminAuditLogs.
     * @example
     * // Create many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminAuditLogs and only return the `id`
     * const adminAuditLogWithIdOnly = await prisma.adminAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AdminAuditLog.
     * @param {AdminAuditLogDeleteArgs} args - Arguments to delete one AdminAuditLog.
     * @example
     * // Delete one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.delete({
     *   where: {
     *     // ... filter to delete one AdminAuditLog
     *   }
     * })
     * 
     */
    delete<T extends AdminAuditLogDeleteArgs>(args: SelectSubset<T, AdminAuditLogDeleteArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AdminAuditLog.
     * @param {AdminAuditLogUpdateArgs} args - Arguments to update one AdminAuditLog.
     * @example
     * // Update one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminAuditLogUpdateArgs>(args: SelectSubset<T, AdminAuditLogUpdateArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AdminAuditLogs.
     * @param {AdminAuditLogDeleteManyArgs} args - Arguments to filter AdminAuditLogs to delete.
     * @example
     * // Delete a few AdminAuditLogs
     * const { count } = await prisma.adminAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminAuditLogDeleteManyArgs>(args?: SelectSubset<T, AdminAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminAuditLogUpdateManyArgs>(args: SelectSubset<T, AdminAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminAuditLog.
     * @param {AdminAuditLogUpsertArgs} args - Arguments to update or create a AdminAuditLog.
     * @example
     * // Update or create a AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.upsert({
     *   create: {
     *     // ... data to create a AdminAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AdminAuditLogUpsertArgs>(args: SelectSubset<T, AdminAuditLogUpsertArgs<ExtArgs>>): Prisma__AdminAuditLogClient<$Result.GetResult<Prisma.$AdminAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogCountArgs} args - Arguments to filter AdminAuditLogs to count.
     * @example
     * // Count the number of AdminAuditLogs
     * const count = await prisma.adminAuditLog.count({
     *   where: {
     *     // ... the filter for the AdminAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AdminAuditLogCountArgs>(
      args?: Subset<T, AdminAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAuditLogAggregateArgs>(args: Subset<T, AdminAuditLogAggregateArgs>): Prisma.PrismaPromise<GetAdminAuditLogAggregateType<T>>

    /**
     * Group by AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AdminAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminAuditLog model
   */
  readonly fields: AdminAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminAuditLog model
   */ 
  interface AdminAuditLogFieldRefs {
    readonly id: FieldRef<"AdminAuditLog", 'String'>
    readonly correlationId: FieldRef<"AdminAuditLog", 'String'>
    readonly actorId: FieldRef<"AdminAuditLog", 'String'>
    readonly actorEmail: FieldRef<"AdminAuditLog", 'String'>
    readonly action: FieldRef<"AdminAuditLog", 'String'>
    readonly targetType: FieldRef<"AdminAuditLog", 'String'>
    readonly targetId: FieldRef<"AdminAuditLog", 'String'>
    readonly before: FieldRef<"AdminAuditLog", 'Json'>
    readonly after: FieldRef<"AdminAuditLog", 'Json'>
    readonly justification: FieldRef<"AdminAuditLog", 'String'>
    readonly result: FieldRef<"AdminAuditLog", 'String'>
    readonly ip: FieldRef<"AdminAuditLog", 'String'>
    readonly userAgent: FieldRef<"AdminAuditLog", 'String'>
    readonly createdAt: FieldRef<"AdminAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminAuditLog findUnique
   */
  export type AdminAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog findUniqueOrThrow
   */
  export type AdminAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog findFirst
   */
  export type AdminAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog findFirstOrThrow
   */
  export type AdminAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog findMany
   */
  export type AdminAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which AdminAuditLogs to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: AdminAuditLogOrderByWithRelationInput | AdminAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    distinct?: AdminAuditLogScalarFieldEnum | AdminAuditLogScalarFieldEnum[]
  }

  /**
   * AdminAuditLog create
   */
  export type AdminAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AdminAuditLog.
     */
    data: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
  }

  /**
   * AdminAuditLog createMany
   */
  export type AdminAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminAuditLogs.
     */
    data: AdminAuditLogCreateManyInput | AdminAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminAuditLog createManyAndReturn
   */
  export type AdminAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AdminAuditLogs.
     */
    data: AdminAuditLogCreateManyInput | AdminAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminAuditLog update
   */
  export type AdminAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AdminAuditLog.
     */
    data: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
    /**
     * Choose, which AdminAuditLog to update.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog updateMany
   */
  export type AdminAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminAuditLogs.
     */
    data: XOR<AdminAuditLogUpdateManyMutationInput, AdminAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AdminAuditLogs to update
     */
    where?: AdminAuditLogWhereInput
  }

  /**
   * AdminAuditLog upsert
   */
  export type AdminAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AdminAuditLog to update in case it exists.
     */
    where: AdminAuditLogWhereUniqueInput
    /**
     * In case the AdminAuditLog found by the `where` argument doesn't exist, create a new AdminAuditLog with this data.
     */
    create: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
    /**
     * In case the AdminAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
  }

  /**
   * AdminAuditLog delete
   */
  export type AdminAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Filter which AdminAuditLog to delete.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog deleteMany
   */
  export type AdminAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLogs to delete
     */
    where?: AdminAuditLogWhereInput
  }

  /**
   * AdminAuditLog without action
   */
  export type AdminAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model Attachment
   */

  export type AggregateAttachment = {
    _count: AttachmentCountAggregateOutputType | null
    _avg: AttachmentAvgAggregateOutputType | null
    _sum: AttachmentSumAggregateOutputType | null
    _min: AttachmentMinAggregateOutputType | null
    _max: AttachmentMaxAggregateOutputType | null
  }

  export type AttachmentAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type AttachmentSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type AttachmentMinAggregateOutputType = {
    id: string | null
    ownerId: string | null
    namespace: string | null
    storageKey: string | null
    filename: string | null
    mimeType: string | null
    sizeBytes: number | null
    uploadedAt: Date | null
  }

  export type AttachmentMaxAggregateOutputType = {
    id: string | null
    ownerId: string | null
    namespace: string | null
    storageKey: string | null
    filename: string | null
    mimeType: string | null
    sizeBytes: number | null
    uploadedAt: Date | null
  }

  export type AttachmentCountAggregateOutputType = {
    id: number
    ownerId: number
    namespace: number
    storageKey: number
    filename: number
    mimeType: number
    sizeBytes: number
    uploadedAt: number
    _all: number
  }


  export type AttachmentAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type AttachmentSumAggregateInputType = {
    sizeBytes?: true
  }

  export type AttachmentMinAggregateInputType = {
    id?: true
    ownerId?: true
    namespace?: true
    storageKey?: true
    filename?: true
    mimeType?: true
    sizeBytes?: true
    uploadedAt?: true
  }

  export type AttachmentMaxAggregateInputType = {
    id?: true
    ownerId?: true
    namespace?: true
    storageKey?: true
    filename?: true
    mimeType?: true
    sizeBytes?: true
    uploadedAt?: true
  }

  export type AttachmentCountAggregateInputType = {
    id?: true
    ownerId?: true
    namespace?: true
    storageKey?: true
    filename?: true
    mimeType?: true
    sizeBytes?: true
    uploadedAt?: true
    _all?: true
  }

  export type AttachmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attachment to aggregate.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Attachments
    **/
    _count?: true | AttachmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AttachmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AttachmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AttachmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AttachmentMaxAggregateInputType
  }

  export type GetAttachmentAggregateType<T extends AttachmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAttachment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttachment[P]>
      : GetScalarType<T[P], AggregateAttachment[P]>
  }




  export type AttachmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AttachmentWhereInput
    orderBy?: AttachmentOrderByWithAggregationInput | AttachmentOrderByWithAggregationInput[]
    by: AttachmentScalarFieldEnum[] | AttachmentScalarFieldEnum
    having?: AttachmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AttachmentCountAggregateInputType | true
    _avg?: AttachmentAvgAggregateInputType
    _sum?: AttachmentSumAggregateInputType
    _min?: AttachmentMinAggregateInputType
    _max?: AttachmentMaxAggregateInputType
  }

  export type AttachmentGroupByOutputType = {
    id: string
    ownerId: string
    namespace: string
    storageKey: string
    filename: string
    mimeType: string
    sizeBytes: number
    uploadedAt: Date
    _count: AttachmentCountAggregateOutputType | null
    _avg: AttachmentAvgAggregateOutputType | null
    _sum: AttachmentSumAggregateOutputType | null
    _min: AttachmentMinAggregateOutputType | null
    _max: AttachmentMaxAggregateOutputType | null
  }

  type GetAttachmentGroupByPayload<T extends AttachmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AttachmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AttachmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttachmentGroupByOutputType[P]>
            : GetScalarType<T[P], AttachmentGroupByOutputType[P]>
        }
      >
    >


  export type AttachmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    namespace?: boolean
    storageKey?: boolean
    filename?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["attachment"]>

  export type AttachmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ownerId?: boolean
    namespace?: boolean
    storageKey?: boolean
    filename?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
  }, ExtArgs["result"]["attachment"]>

  export type AttachmentSelectScalar = {
    id?: boolean
    ownerId?: boolean
    namespace?: boolean
    storageKey?: boolean
    filename?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    uploadedAt?: boolean
  }


  export type $AttachmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Attachment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ownerId: string
      namespace: string
      storageKey: string
      filename: string
      mimeType: string
      sizeBytes: number
      uploadedAt: Date
    }, ExtArgs["result"]["attachment"]>
    composites: {}
  }

  type AttachmentGetPayload<S extends boolean | null | undefined | AttachmentDefaultArgs> = $Result.GetResult<Prisma.$AttachmentPayload, S>

  type AttachmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AttachmentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AttachmentCountAggregateInputType | true
    }

  export interface AttachmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Attachment'], meta: { name: 'Attachment' } }
    /**
     * Find zero or one Attachment that matches the filter.
     * @param {AttachmentFindUniqueArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttachmentFindUniqueArgs>(args: SelectSubset<T, AttachmentFindUniqueArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Attachment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AttachmentFindUniqueOrThrowArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttachmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Attachment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindFirstArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttachmentFindFirstArgs>(args?: SelectSubset<T, AttachmentFindFirstArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Attachment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindFirstOrThrowArgs} args - Arguments to find a Attachment
     * @example
     * // Get one Attachment
     * const attachment = await prisma.attachment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttachmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Attachments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attachments
     * const attachments = await prisma.attachment.findMany()
     * 
     * // Get first 10 Attachments
     * const attachments = await prisma.attachment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const attachmentWithIdOnly = await prisma.attachment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AttachmentFindManyArgs>(args?: SelectSubset<T, AttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Attachment.
     * @param {AttachmentCreateArgs} args - Arguments to create a Attachment.
     * @example
     * // Create one Attachment
     * const Attachment = await prisma.attachment.create({
     *   data: {
     *     // ... data to create a Attachment
     *   }
     * })
     * 
     */
    create<T extends AttachmentCreateArgs>(args: SelectSubset<T, AttachmentCreateArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Attachments.
     * @param {AttachmentCreateManyArgs} args - Arguments to create many Attachments.
     * @example
     * // Create many Attachments
     * const attachment = await prisma.attachment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AttachmentCreateManyArgs>(args?: SelectSubset<T, AttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attachments and returns the data saved in the database.
     * @param {AttachmentCreateManyAndReturnArgs} args - Arguments to create many Attachments.
     * @example
     * // Create many Attachments
     * const attachment = await prisma.attachment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attachments and only return the `id`
     * const attachmentWithIdOnly = await prisma.attachment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AttachmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Attachment.
     * @param {AttachmentDeleteArgs} args - Arguments to delete one Attachment.
     * @example
     * // Delete one Attachment
     * const Attachment = await prisma.attachment.delete({
     *   where: {
     *     // ... filter to delete one Attachment
     *   }
     * })
     * 
     */
    delete<T extends AttachmentDeleteArgs>(args: SelectSubset<T, AttachmentDeleteArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Attachment.
     * @param {AttachmentUpdateArgs} args - Arguments to update one Attachment.
     * @example
     * // Update one Attachment
     * const attachment = await prisma.attachment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AttachmentUpdateArgs>(args: SelectSubset<T, AttachmentUpdateArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Attachments.
     * @param {AttachmentDeleteManyArgs} args - Arguments to filter Attachments to delete.
     * @example
     * // Delete a few Attachments
     * const { count } = await prisma.attachment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AttachmentDeleteManyArgs>(args?: SelectSubset<T, AttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attachments
     * const attachment = await prisma.attachment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AttachmentUpdateManyArgs>(args: SelectSubset<T, AttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Attachment.
     * @param {AttachmentUpsertArgs} args - Arguments to update or create a Attachment.
     * @example
     * // Update or create a Attachment
     * const attachment = await prisma.attachment.upsert({
     *   create: {
     *     // ... data to create a Attachment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attachment we want to update
     *   }
     * })
     */
    upsert<T extends AttachmentUpsertArgs>(args: SelectSubset<T, AttachmentUpsertArgs<ExtArgs>>): Prisma__AttachmentClient<$Result.GetResult<Prisma.$AttachmentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Attachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentCountArgs} args - Arguments to filter Attachments to count.
     * @example
     * // Count the number of Attachments
     * const count = await prisma.attachment.count({
     *   where: {
     *     // ... the filter for the Attachments we want to count
     *   }
     * })
    **/
    count<T extends AttachmentCountArgs>(
      args?: Subset<T, AttachmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttachmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AttachmentAggregateArgs>(args: Subset<T, AttachmentAggregateArgs>): Prisma.PrismaPromise<GetAttachmentAggregateType<T>>

    /**
     * Group by Attachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttachmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AttachmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttachmentGroupByArgs['orderBy'] }
        : { orderBy?: AttachmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Attachment model
   */
  readonly fields: AttachmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attachment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttachmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Attachment model
   */ 
  interface AttachmentFieldRefs {
    readonly id: FieldRef<"Attachment", 'String'>
    readonly ownerId: FieldRef<"Attachment", 'String'>
    readonly namespace: FieldRef<"Attachment", 'String'>
    readonly storageKey: FieldRef<"Attachment", 'String'>
    readonly filename: FieldRef<"Attachment", 'String'>
    readonly mimeType: FieldRef<"Attachment", 'String'>
    readonly sizeBytes: FieldRef<"Attachment", 'Int'>
    readonly uploadedAt: FieldRef<"Attachment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Attachment findUnique
   */
  export type AttachmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment findUniqueOrThrow
   */
  export type AttachmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment findFirst
   */
  export type AttachmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attachments.
     */
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment findFirstOrThrow
   */
  export type AttachmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter, which Attachment to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Attachments.
     */
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment findMany
   */
  export type AttachmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter, which Attachments to fetch.
     */
    where?: AttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Attachments to fetch.
     */
    orderBy?: AttachmentOrderByWithRelationInput | AttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Attachments.
     */
    cursor?: AttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Attachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Attachments.
     */
    skip?: number
    distinct?: AttachmentScalarFieldEnum | AttachmentScalarFieldEnum[]
  }

  /**
   * Attachment create
   */
  export type AttachmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * The data needed to create a Attachment.
     */
    data: XOR<AttachmentCreateInput, AttachmentUncheckedCreateInput>
  }

  /**
   * Attachment createMany
   */
  export type AttachmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Attachments.
     */
    data: AttachmentCreateManyInput | AttachmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attachment createManyAndReturn
   */
  export type AttachmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Attachments.
     */
    data: AttachmentCreateManyInput | AttachmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Attachment update
   */
  export type AttachmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * The data needed to update a Attachment.
     */
    data: XOR<AttachmentUpdateInput, AttachmentUncheckedUpdateInput>
    /**
     * Choose, which Attachment to update.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment updateMany
   */
  export type AttachmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Attachments.
     */
    data: XOR<AttachmentUpdateManyMutationInput, AttachmentUncheckedUpdateManyInput>
    /**
     * Filter which Attachments to update
     */
    where?: AttachmentWhereInput
  }

  /**
   * Attachment upsert
   */
  export type AttachmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * The filter to search for the Attachment to update in case it exists.
     */
    where: AttachmentWhereUniqueInput
    /**
     * In case the Attachment found by the `where` argument doesn't exist, create a new Attachment with this data.
     */
    create: XOR<AttachmentCreateInput, AttachmentUncheckedCreateInput>
    /**
     * In case the Attachment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttachmentUpdateInput, AttachmentUncheckedUpdateInput>
  }

  /**
   * Attachment delete
   */
  export type AttachmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
    /**
     * Filter which Attachment to delete.
     */
    where: AttachmentWhereUniqueInput
  }

  /**
   * Attachment deleteMany
   */
  export type AttachmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Attachments to delete
     */
    where?: AttachmentWhereInput
  }

  /**
   * Attachment without action
   */
  export type AttachmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attachment
     */
    select?: AttachmentSelect<ExtArgs> | null
  }


  /**
   * Model SecurityEventLog
   */

  export type AggregateSecurityEventLog = {
    _count: SecurityEventLogCountAggregateOutputType | null
    _min: SecurityEventLogMinAggregateOutputType | null
    _max: SecurityEventLogMaxAggregateOutputType | null
  }

  export type SecurityEventLogMinAggregateOutputType = {
    id: string | null
    eventType: string | null
    outcome: string | null
    correlationId: string | null
    actorId: string | null
    actorRole: string | null
    targetType: string | null
    targetId: string | null
    failureReason: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type SecurityEventLogMaxAggregateOutputType = {
    id: string | null
    eventType: string | null
    outcome: string | null
    correlationId: string | null
    actorId: string | null
    actorRole: string | null
    targetType: string | null
    targetId: string | null
    failureReason: string | null
    ip: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type SecurityEventLogCountAggregateOutputType = {
    id: number
    eventType: number
    outcome: number
    correlationId: number
    actorId: number
    actorRole: number
    targetType: number
    targetId: number
    failureReason: number
    ip: number
    userAgent: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type SecurityEventLogMinAggregateInputType = {
    id?: true
    eventType?: true
    outcome?: true
    correlationId?: true
    actorId?: true
    actorRole?: true
    targetType?: true
    targetId?: true
    failureReason?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type SecurityEventLogMaxAggregateInputType = {
    id?: true
    eventType?: true
    outcome?: true
    correlationId?: true
    actorId?: true
    actorRole?: true
    targetType?: true
    targetId?: true
    failureReason?: true
    ip?: true
    userAgent?: true
    createdAt?: true
  }

  export type SecurityEventLogCountAggregateInputType = {
    id?: true
    eventType?: true
    outcome?: true
    correlationId?: true
    actorId?: true
    actorRole?: true
    targetType?: true
    targetId?: true
    failureReason?: true
    ip?: true
    userAgent?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type SecurityEventLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityEventLog to aggregate.
     */
    where?: SecurityEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEventLogs to fetch.
     */
    orderBy?: SecurityEventLogOrderByWithRelationInput | SecurityEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecurityEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecurityEventLogs
    **/
    _count?: true | SecurityEventLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecurityEventLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecurityEventLogMaxAggregateInputType
  }

  export type GetSecurityEventLogAggregateType<T extends SecurityEventLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurityEventLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurityEventLog[P]>
      : GetScalarType<T[P], AggregateSecurityEventLog[P]>
  }




  export type SecurityEventLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityEventLogWhereInput
    orderBy?: SecurityEventLogOrderByWithAggregationInput | SecurityEventLogOrderByWithAggregationInput[]
    by: SecurityEventLogScalarFieldEnum[] | SecurityEventLogScalarFieldEnum
    having?: SecurityEventLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecurityEventLogCountAggregateInputType | true
    _min?: SecurityEventLogMinAggregateInputType
    _max?: SecurityEventLogMaxAggregateInputType
  }

  export type SecurityEventLogGroupByOutputType = {
    id: string
    eventType: string
    outcome: string
    correlationId: string | null
    actorId: string | null
    actorRole: string | null
    targetType: string | null
    targetId: string | null
    failureReason: string | null
    ip: string | null
    userAgent: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: SecurityEventLogCountAggregateOutputType | null
    _min: SecurityEventLogMinAggregateOutputType | null
    _max: SecurityEventLogMaxAggregateOutputType | null
  }

  type GetSecurityEventLogGroupByPayload<T extends SecurityEventLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecurityEventLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecurityEventLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecurityEventLogGroupByOutputType[P]>
            : GetScalarType<T[P], SecurityEventLogGroupByOutputType[P]>
        }
      >
    >


  export type SecurityEventLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    outcome?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorRole?: boolean
    targetType?: boolean
    targetId?: boolean
    failureReason?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["securityEventLog"]>

  export type SecurityEventLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventType?: boolean
    outcome?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorRole?: boolean
    targetType?: boolean
    targetId?: boolean
    failureReason?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["securityEventLog"]>

  export type SecurityEventLogSelectScalar = {
    id?: boolean
    eventType?: boolean
    outcome?: boolean
    correlationId?: boolean
    actorId?: boolean
    actorRole?: boolean
    targetType?: boolean
    targetId?: boolean
    failureReason?: boolean
    ip?: boolean
    userAgent?: boolean
    metadata?: boolean
    createdAt?: boolean
  }


  export type $SecurityEventLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecurityEventLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventType: string
      outcome: string
      correlationId: string | null
      actorId: string | null
      actorRole: string | null
      targetType: string | null
      targetId: string | null
      failureReason: string | null
      ip: string | null
      userAgent: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["securityEventLog"]>
    composites: {}
  }

  type SecurityEventLogGetPayload<S extends boolean | null | undefined | SecurityEventLogDefaultArgs> = $Result.GetResult<Prisma.$SecurityEventLogPayload, S>

  type SecurityEventLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SecurityEventLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SecurityEventLogCountAggregateInputType | true
    }

  export interface SecurityEventLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecurityEventLog'], meta: { name: 'SecurityEventLog' } }
    /**
     * Find zero or one SecurityEventLog that matches the filter.
     * @param {SecurityEventLogFindUniqueArgs} args - Arguments to find a SecurityEventLog
     * @example
     * // Get one SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecurityEventLogFindUniqueArgs>(args: SelectSubset<T, SecurityEventLogFindUniqueArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SecurityEventLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SecurityEventLogFindUniqueOrThrowArgs} args - Arguments to find a SecurityEventLog
     * @example
     * // Get one SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecurityEventLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SecurityEventLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SecurityEventLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogFindFirstArgs} args - Arguments to find a SecurityEventLog
     * @example
     * // Get one SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecurityEventLogFindFirstArgs>(args?: SelectSubset<T, SecurityEventLogFindFirstArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SecurityEventLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogFindFirstOrThrowArgs} args - Arguments to find a SecurityEventLog
     * @example
     * // Get one SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecurityEventLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SecurityEventLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SecurityEventLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecurityEventLogs
     * const securityEventLogs = await prisma.securityEventLog.findMany()
     * 
     * // Get first 10 SecurityEventLogs
     * const securityEventLogs = await prisma.securityEventLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const securityEventLogWithIdOnly = await prisma.securityEventLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecurityEventLogFindManyArgs>(args?: SelectSubset<T, SecurityEventLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SecurityEventLog.
     * @param {SecurityEventLogCreateArgs} args - Arguments to create a SecurityEventLog.
     * @example
     * // Create one SecurityEventLog
     * const SecurityEventLog = await prisma.securityEventLog.create({
     *   data: {
     *     // ... data to create a SecurityEventLog
     *   }
     * })
     * 
     */
    create<T extends SecurityEventLogCreateArgs>(args: SelectSubset<T, SecurityEventLogCreateArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SecurityEventLogs.
     * @param {SecurityEventLogCreateManyArgs} args - Arguments to create many SecurityEventLogs.
     * @example
     * // Create many SecurityEventLogs
     * const securityEventLog = await prisma.securityEventLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecurityEventLogCreateManyArgs>(args?: SelectSubset<T, SecurityEventLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SecurityEventLogs and returns the data saved in the database.
     * @param {SecurityEventLogCreateManyAndReturnArgs} args - Arguments to create many SecurityEventLogs.
     * @example
     * // Create many SecurityEventLogs
     * const securityEventLog = await prisma.securityEventLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SecurityEventLogs and only return the `id`
     * const securityEventLogWithIdOnly = await prisma.securityEventLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SecurityEventLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SecurityEventLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SecurityEventLog.
     * @param {SecurityEventLogDeleteArgs} args - Arguments to delete one SecurityEventLog.
     * @example
     * // Delete one SecurityEventLog
     * const SecurityEventLog = await prisma.securityEventLog.delete({
     *   where: {
     *     // ... filter to delete one SecurityEventLog
     *   }
     * })
     * 
     */
    delete<T extends SecurityEventLogDeleteArgs>(args: SelectSubset<T, SecurityEventLogDeleteArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SecurityEventLog.
     * @param {SecurityEventLogUpdateArgs} args - Arguments to update one SecurityEventLog.
     * @example
     * // Update one SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecurityEventLogUpdateArgs>(args: SelectSubset<T, SecurityEventLogUpdateArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SecurityEventLogs.
     * @param {SecurityEventLogDeleteManyArgs} args - Arguments to filter SecurityEventLogs to delete.
     * @example
     * // Delete a few SecurityEventLogs
     * const { count } = await prisma.securityEventLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecurityEventLogDeleteManyArgs>(args?: SelectSubset<T, SecurityEventLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityEventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecurityEventLogs
     * const securityEventLog = await prisma.securityEventLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecurityEventLogUpdateManyArgs>(args: SelectSubset<T, SecurityEventLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SecurityEventLog.
     * @param {SecurityEventLogUpsertArgs} args - Arguments to update or create a SecurityEventLog.
     * @example
     * // Update or create a SecurityEventLog
     * const securityEventLog = await prisma.securityEventLog.upsert({
     *   create: {
     *     // ... data to create a SecurityEventLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecurityEventLog we want to update
     *   }
     * })
     */
    upsert<T extends SecurityEventLogUpsertArgs>(args: SelectSubset<T, SecurityEventLogUpsertArgs<ExtArgs>>): Prisma__SecurityEventLogClient<$Result.GetResult<Prisma.$SecurityEventLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SecurityEventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogCountArgs} args - Arguments to filter SecurityEventLogs to count.
     * @example
     * // Count the number of SecurityEventLogs
     * const count = await prisma.securityEventLog.count({
     *   where: {
     *     // ... the filter for the SecurityEventLogs we want to count
     *   }
     * })
    **/
    count<T extends SecurityEventLogCountArgs>(
      args?: Subset<T, SecurityEventLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecurityEventLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecurityEventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SecurityEventLogAggregateArgs>(args: Subset<T, SecurityEventLogAggregateArgs>): Prisma.PrismaPromise<GetSecurityEventLogAggregateType<T>>

    /**
     * Group by SecurityEventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityEventLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SecurityEventLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecurityEventLogGroupByArgs['orderBy'] }
        : { orderBy?: SecurityEventLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SecurityEventLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurityEventLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecurityEventLog model
   */
  readonly fields: SecurityEventLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecurityEventLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecurityEventLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SecurityEventLog model
   */ 
  interface SecurityEventLogFieldRefs {
    readonly id: FieldRef<"SecurityEventLog", 'String'>
    readonly eventType: FieldRef<"SecurityEventLog", 'String'>
    readonly outcome: FieldRef<"SecurityEventLog", 'String'>
    readonly correlationId: FieldRef<"SecurityEventLog", 'String'>
    readonly actorId: FieldRef<"SecurityEventLog", 'String'>
    readonly actorRole: FieldRef<"SecurityEventLog", 'String'>
    readonly targetType: FieldRef<"SecurityEventLog", 'String'>
    readonly targetId: FieldRef<"SecurityEventLog", 'String'>
    readonly failureReason: FieldRef<"SecurityEventLog", 'String'>
    readonly ip: FieldRef<"SecurityEventLog", 'String'>
    readonly userAgent: FieldRef<"SecurityEventLog", 'String'>
    readonly metadata: FieldRef<"SecurityEventLog", 'Json'>
    readonly createdAt: FieldRef<"SecurityEventLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SecurityEventLog findUnique
   */
  export type SecurityEventLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter, which SecurityEventLog to fetch.
     */
    where: SecurityEventLogWhereUniqueInput
  }

  /**
   * SecurityEventLog findUniqueOrThrow
   */
  export type SecurityEventLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter, which SecurityEventLog to fetch.
     */
    where: SecurityEventLogWhereUniqueInput
  }

  /**
   * SecurityEventLog findFirst
   */
  export type SecurityEventLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter, which SecurityEventLog to fetch.
     */
    where?: SecurityEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEventLogs to fetch.
     */
    orderBy?: SecurityEventLogOrderByWithRelationInput | SecurityEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityEventLogs.
     */
    cursor?: SecurityEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityEventLogs.
     */
    distinct?: SecurityEventLogScalarFieldEnum | SecurityEventLogScalarFieldEnum[]
  }

  /**
   * SecurityEventLog findFirstOrThrow
   */
  export type SecurityEventLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter, which SecurityEventLog to fetch.
     */
    where?: SecurityEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEventLogs to fetch.
     */
    orderBy?: SecurityEventLogOrderByWithRelationInput | SecurityEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityEventLogs.
     */
    cursor?: SecurityEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityEventLogs.
     */
    distinct?: SecurityEventLogScalarFieldEnum | SecurityEventLogScalarFieldEnum[]
  }

  /**
   * SecurityEventLog findMany
   */
  export type SecurityEventLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter, which SecurityEventLogs to fetch.
     */
    where?: SecurityEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityEventLogs to fetch.
     */
    orderBy?: SecurityEventLogOrderByWithRelationInput | SecurityEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecurityEventLogs.
     */
    cursor?: SecurityEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityEventLogs.
     */
    skip?: number
    distinct?: SecurityEventLogScalarFieldEnum | SecurityEventLogScalarFieldEnum[]
  }

  /**
   * SecurityEventLog create
   */
  export type SecurityEventLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * The data needed to create a SecurityEventLog.
     */
    data: XOR<SecurityEventLogCreateInput, SecurityEventLogUncheckedCreateInput>
  }

  /**
   * SecurityEventLog createMany
   */
  export type SecurityEventLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecurityEventLogs.
     */
    data: SecurityEventLogCreateManyInput | SecurityEventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityEventLog createManyAndReturn
   */
  export type SecurityEventLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SecurityEventLogs.
     */
    data: SecurityEventLogCreateManyInput | SecurityEventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityEventLog update
   */
  export type SecurityEventLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * The data needed to update a SecurityEventLog.
     */
    data: XOR<SecurityEventLogUpdateInput, SecurityEventLogUncheckedUpdateInput>
    /**
     * Choose, which SecurityEventLog to update.
     */
    where: SecurityEventLogWhereUniqueInput
  }

  /**
   * SecurityEventLog updateMany
   */
  export type SecurityEventLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecurityEventLogs.
     */
    data: XOR<SecurityEventLogUpdateManyMutationInput, SecurityEventLogUncheckedUpdateManyInput>
    /**
     * Filter which SecurityEventLogs to update
     */
    where?: SecurityEventLogWhereInput
  }

  /**
   * SecurityEventLog upsert
   */
  export type SecurityEventLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * The filter to search for the SecurityEventLog to update in case it exists.
     */
    where: SecurityEventLogWhereUniqueInput
    /**
     * In case the SecurityEventLog found by the `where` argument doesn't exist, create a new SecurityEventLog with this data.
     */
    create: XOR<SecurityEventLogCreateInput, SecurityEventLogUncheckedCreateInput>
    /**
     * In case the SecurityEventLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecurityEventLogUpdateInput, SecurityEventLogUncheckedUpdateInput>
  }

  /**
   * SecurityEventLog delete
   */
  export type SecurityEventLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
    /**
     * Filter which SecurityEventLog to delete.
     */
    where: SecurityEventLogWhereUniqueInput
  }

  /**
   * SecurityEventLog deleteMany
   */
  export type SecurityEventLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityEventLogs to delete
     */
    where?: SecurityEventLogWhereInput
  }

  /**
   * SecurityEventLog without action
   */
  export type SecurityEventLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityEventLog
     */
    select?: SecurityEventLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    firebaseUid: 'firebaseUid',
    email: 'email',
    role: 'role',
    deletedAt: 'deletedAt',
    suspendedAt: 'suspendedAt',
    suspendedBy: 'suspendedBy',
    suspensionReason: 'suspensionReason',
    mfaEnabled: 'mfaEnabled',
    mfaSecretEnc: 'mfaSecretEnc',
    mfaSecretIv: 'mfaSecretIv',
    mfaSecretTag: 'mfaSecretTag',
    mfaEnrolledAt: 'mfaEnrolledAt',
    lastMfaVerifiedAt: 'lastMfaVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MfaBackupCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    codeHash: 'codeHash',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type MfaBackupCodeScalarFieldEnum = (typeof MfaBackupCodeScalarFieldEnum)[keyof typeof MfaBackupCodeScalarFieldEnum]


  export const MfaPendingTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    purpose: 'purpose',
    destination: 'destination',
    expiresAt: 'expiresAt',
    consumedAt: 'consumedAt',
    createdAt: 'createdAt'
  };

  export type MfaPendingTokenScalarFieldEnum = (typeof MfaPendingTokenScalarFieldEnum)[keyof typeof MfaPendingTokenScalarFieldEnum]


  export const ServiceScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    name: 'name',
    category: 'category',
    priceCents: 'priceCents',
    scholarshipMinCents: 'scholarshipMinCents',
    scholarshipMaxCents: 'scholarshipMaxCents',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ServiceScalarFieldEnum = (typeof ServiceScalarFieldEnum)[keyof typeof ServiceScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    serviceId: 'serviceId',
    packageId: 'packageId',
    status: 'status',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    sessionTokenRef: 'sessionTokenRef',
    stripePaymentId: 'stripePaymentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const PackageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    serviceId: 'serviceId',
    totalSessions: 'totalSessions',
    usedSessions: 'usedSessions',
    stripePaymentId: 'stripePaymentId',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PackageScalarFieldEnum = (typeof PackageScalarFieldEnum)[keyof typeof PackageScalarFieldEnum]


  export const ScholarshipScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    requestedCents: 'requestedCents',
    approvedCents: 'approvedCents',
    note: 'note',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ScholarshipScalarFieldEnum = (typeof ScholarshipScalarFieldEnum)[keyof typeof ScholarshipScalarFieldEnum]


  export const DonationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tier: 'tier',
    amountCents: 'amountCents',
    stripePaymentId: 'stripePaymentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DonationScalarFieldEnum = (typeof DonationScalarFieldEnum)[keyof typeof DonationScalarFieldEnum]


  export const OrgInquiryScalarFieldEnum: {
    id: 'id',
    orgName: 'orgName',
    contactName: 'contactName',
    email: 'email',
    status: 'status',
    isNonprofit: 'isNonprofit',
    ein: 'ein',
    eventType: 'eventType',
    headcount: 'headcount',
    preferredStart: 'preferredStart',
    preferredEnd: 'preferredEnd',
    message: 'message',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrgInquiryScalarFieldEnum = (typeof OrgInquiryScalarFieldEnum)[keyof typeof OrgInquiryScalarFieldEnum]


  export const AdminAuditLogScalarFieldEnum: {
    id: 'id',
    correlationId: 'correlationId',
    actorId: 'actorId',
    actorEmail: 'actorEmail',
    action: 'action',
    targetType: 'targetType',
    targetId: 'targetId',
    before: 'before',
    after: 'after',
    justification: 'justification',
    result: 'result',
    ip: 'ip',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type AdminAuditLogScalarFieldEnum = (typeof AdminAuditLogScalarFieldEnum)[keyof typeof AdminAuditLogScalarFieldEnum]


  export const AttachmentScalarFieldEnum: {
    id: 'id',
    ownerId: 'ownerId',
    namespace: 'namespace',
    storageKey: 'storageKey',
    filename: 'filename',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    uploadedAt: 'uploadedAt'
  };

  export type AttachmentScalarFieldEnum = (typeof AttachmentScalarFieldEnum)[keyof typeof AttachmentScalarFieldEnum]


  export const SecurityEventLogScalarFieldEnum: {
    id: 'id',
    eventType: 'eventType',
    outcome: 'outcome',
    correlationId: 'correlationId',
    actorId: 'actorId',
    actorRole: 'actorRole',
    targetType: 'targetType',
    targetId: 'targetId',
    failureReason: 'failureReason',
    ip: 'ip',
    userAgent: 'userAgent',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type SecurityEventLogScalarFieldEnum = (typeof SecurityEventLogScalarFieldEnum)[keyof typeof SecurityEventLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ServiceCategory'
   */
  export type EnumServiceCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceCategory'>
    


  /**
   * Reference to a field of type 'ServiceCategory[]'
   */
  export type ListEnumServiceCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceCategory[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'ScholarshipStatus'
   */
  export type EnumScholarshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScholarshipStatus'>
    


  /**
   * Reference to a field of type 'ScholarshipStatus[]'
   */
  export type ListEnumScholarshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ScholarshipStatus[]'>
    


  /**
   * Reference to a field of type 'DonationTier'
   */
  export type EnumDonationTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DonationTier'>
    


  /**
   * Reference to a field of type 'DonationTier[]'
   */
  export type ListEnumDonationTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DonationTier[]'>
    


  /**
   * Reference to a field of type 'InquiryStatus'
   */
  export type EnumInquiryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryStatus'>
    


  /**
   * Reference to a field of type 'InquiryStatus[]'
   */
  export type ListEnumInquiryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InquiryStatus[]'>
    


  /**
   * Reference to a field of type 'OrgInquiryEventType'
   */
  export type EnumOrgInquiryEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrgInquiryEventType'>
    


  /**
   * Reference to a field of type 'OrgInquiryEventType[]'
   */
  export type ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrgInquiryEventType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    suspendedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    suspendedBy?: StringNullableFilter<"User"> | string | null
    suspensionReason?: StringNullableFilter<"User"> | string | null
    mfaEnabled?: BoolFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableFilter<"User"> | string | null
    mfaSecretIv?: StringNullableFilter<"User"> | string | null
    mfaSecretTag?: StringNullableFilter<"User"> | string | null
    mfaEnrolledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastMfaVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
    donations?: DonationListRelationFilter
    mfaBackupCodes?: MfaBackupCodeListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    role?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    suspendedBy?: SortOrderInput | SortOrder
    suspensionReason?: SortOrderInput | SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrderInput | SortOrder
    mfaSecretIv?: SortOrderInput | SortOrder
    mfaSecretTag?: SortOrderInput | SortOrder
    mfaEnrolledAt?: SortOrderInput | SortOrder
    lastMfaVerifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    packages?: PackageOrderByRelationAggregateInput
    scholarships?: ScholarshipOrderByRelationAggregateInput
    donations?: DonationOrderByRelationAggregateInput
    mfaBackupCodes?: MfaBackupCodeOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    firebaseUid?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    suspendedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    suspendedBy?: StringNullableFilter<"User"> | string | null
    suspensionReason?: StringNullableFilter<"User"> | string | null
    mfaEnabled?: BoolFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableFilter<"User"> | string | null
    mfaSecretIv?: StringNullableFilter<"User"> | string | null
    mfaSecretTag?: StringNullableFilter<"User"> | string | null
    mfaEnrolledAt?: DateTimeNullableFilter<"User"> | Date | string | null
    lastMfaVerifiedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
    donations?: DonationListRelationFilter
    mfaBackupCodes?: MfaBackupCodeListRelationFilter
  }, "id" | "firebaseUid" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    role?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    suspendedBy?: SortOrderInput | SortOrder
    suspensionReason?: SortOrderInput | SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrderInput | SortOrder
    mfaSecretIv?: SortOrderInput | SortOrder
    mfaSecretTag?: SortOrderInput | SortOrder
    mfaEnrolledAt?: SortOrderInput | SortOrder
    lastMfaVerifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    firebaseUid?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    suspendedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    suspendedBy?: StringNullableWithAggregatesFilter<"User"> | string | null
    suspensionReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaEnabled?: BoolWithAggregatesFilter<"User"> | boolean
    mfaSecretEnc?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaSecretIv?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaSecretTag?: StringNullableWithAggregatesFilter<"User"> | string | null
    mfaEnrolledAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    lastMfaVerifiedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MfaBackupCodeWhereInput = {
    AND?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    OR?: MfaBackupCodeWhereInput[]
    NOT?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    id?: StringFilter<"MfaBackupCode"> | string
    userId?: UuidFilter<"MfaBackupCode"> | string
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MfaBackupCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MfaBackupCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    OR?: MfaBackupCodeWhereInput[]
    NOT?: MfaBackupCodeWhereInput | MfaBackupCodeWhereInput[]
    userId?: UuidFilter<"MfaBackupCode"> | string
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MfaBackupCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MfaBackupCodeCountOrderByAggregateInput
    _max?: MfaBackupCodeMaxOrderByAggregateInput
    _min?: MfaBackupCodeMinOrderByAggregateInput
  }

  export type MfaBackupCodeScalarWhereWithAggregatesInput = {
    AND?: MfaBackupCodeScalarWhereWithAggregatesInput | MfaBackupCodeScalarWhereWithAggregatesInput[]
    OR?: MfaBackupCodeScalarWhereWithAggregatesInput[]
    NOT?: MfaBackupCodeScalarWhereWithAggregatesInput | MfaBackupCodeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MfaBackupCode"> | string
    userId?: UuidWithAggregatesFilter<"MfaBackupCode"> | string
    codeHash?: StringWithAggregatesFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MfaBackupCode"> | Date | string
  }

  export type MfaPendingTokenWhereInput = {
    AND?: MfaPendingTokenWhereInput | MfaPendingTokenWhereInput[]
    OR?: MfaPendingTokenWhereInput[]
    NOT?: MfaPendingTokenWhereInput | MfaPendingTokenWhereInput[]
    id?: StringFilter<"MfaPendingToken"> | string
    userId?: UuidFilter<"MfaPendingToken"> | string
    tokenHash?: StringFilter<"MfaPendingToken"> | string
    purpose?: StringFilter<"MfaPendingToken"> | string
    destination?: StringNullableFilter<"MfaPendingToken"> | string | null
    expiresAt?: DateTimeFilter<"MfaPendingToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"MfaPendingToken"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaPendingToken"> | Date | string
  }

  export type MfaPendingTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    purpose?: SortOrder
    destination?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type MfaPendingTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: MfaPendingTokenWhereInput | MfaPendingTokenWhereInput[]
    OR?: MfaPendingTokenWhereInput[]
    NOT?: MfaPendingTokenWhereInput | MfaPendingTokenWhereInput[]
    userId?: UuidFilter<"MfaPendingToken"> | string
    purpose?: StringFilter<"MfaPendingToken"> | string
    destination?: StringNullableFilter<"MfaPendingToken"> | string | null
    expiresAt?: DateTimeFilter<"MfaPendingToken"> | Date | string
    consumedAt?: DateTimeNullableFilter<"MfaPendingToken"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaPendingToken"> | Date | string
  }, "id" | "tokenHash">

  export type MfaPendingTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    purpose?: SortOrder
    destination?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MfaPendingTokenCountOrderByAggregateInput
    _max?: MfaPendingTokenMaxOrderByAggregateInput
    _min?: MfaPendingTokenMinOrderByAggregateInput
  }

  export type MfaPendingTokenScalarWhereWithAggregatesInput = {
    AND?: MfaPendingTokenScalarWhereWithAggregatesInput | MfaPendingTokenScalarWhereWithAggregatesInput[]
    OR?: MfaPendingTokenScalarWhereWithAggregatesInput[]
    NOT?: MfaPendingTokenScalarWhereWithAggregatesInput | MfaPendingTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MfaPendingToken"> | string
    userId?: UuidWithAggregatesFilter<"MfaPendingToken"> | string
    tokenHash?: StringWithAggregatesFilter<"MfaPendingToken"> | string
    purpose?: StringWithAggregatesFilter<"MfaPendingToken"> | string
    destination?: StringNullableWithAggregatesFilter<"MfaPendingToken"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"MfaPendingToken"> | Date | string
    consumedAt?: DateTimeNullableWithAggregatesFilter<"MfaPendingToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MfaPendingToken"> | Date | string
  }

  export type ServiceWhereInput = {
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    id?: UuidFilter<"Service"> | string
    slug?: StringFilter<"Service"> | string
    name?: StringFilter<"Service"> | string
    category?: EnumServiceCategoryFilter<"Service"> | $Enums.ServiceCategory
    priceCents?: IntFilter<"Service"> | number
    scholarshipMinCents?: IntFilter<"Service"> | number
    scholarshipMaxCents?: IntFilter<"Service"> | number
    active?: BoolFilter<"Service"> | boolean
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
  }

  export type ServiceOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    packages?: PackageOrderByRelationAggregateInput
  }

  export type ServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    name?: StringFilter<"Service"> | string
    category?: EnumServiceCategoryFilter<"Service"> | $Enums.ServiceCategory
    priceCents?: IntFilter<"Service"> | number
    scholarshipMinCents?: IntFilter<"Service"> | number
    scholarshipMaxCents?: IntFilter<"Service"> | number
    active?: BoolFilter<"Service"> | boolean
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
  }, "id" | "slug">

  export type ServiceOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ServiceCountOrderByAggregateInput
    _avg?: ServiceAvgOrderByAggregateInput
    _max?: ServiceMaxOrderByAggregateInput
    _min?: ServiceMinOrderByAggregateInput
    _sum?: ServiceSumOrderByAggregateInput
  }

  export type ServiceScalarWhereWithAggregatesInput = {
    AND?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    OR?: ServiceScalarWhereWithAggregatesInput[]
    NOT?: ServiceScalarWhereWithAggregatesInput | ServiceScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Service"> | string
    slug?: StringWithAggregatesFilter<"Service"> | string
    name?: StringWithAggregatesFilter<"Service"> | string
    category?: EnumServiceCategoryWithAggregatesFilter<"Service"> | $Enums.ServiceCategory
    priceCents?: IntWithAggregatesFilter<"Service"> | number
    scholarshipMinCents?: IntWithAggregatesFilter<"Service"> | number
    scholarshipMaxCents?: IntWithAggregatesFilter<"Service"> | number
    active?: BoolWithAggregatesFilter<"Service"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: UuidFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    serviceId?: UuidFilter<"Session"> | string
    packageId?: UuidNullableFilter<"Session"> | string | null
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    startsAt?: DateTimeFilter<"Session"> | Date | string
    endsAt?: DateTimeFilter<"Session"> | Date | string
    sessionTokenRef?: StringNullableFilter<"Session"> | string | null
    stripePaymentId?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    service?: XOR<ServiceScalarRelationFilter, ServiceWhereInput>
    package?: XOR<PackageNullableScalarRelationFilter, PackageWhereInput> | null
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    packageId?: SortOrderInput | SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    sessionTokenRef?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    service?: ServiceOrderByWithRelationInput
    package?: PackageOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionTokenRef?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: UuidFilter<"Session"> | string
    serviceId?: UuidFilter<"Session"> | string
    packageId?: UuidNullableFilter<"Session"> | string | null
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    startsAt?: DateTimeFilter<"Session"> | Date | string
    endsAt?: DateTimeFilter<"Session"> | Date | string
    stripePaymentId?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    service?: XOR<ServiceScalarRelationFilter, ServiceWhereInput>
    package?: XOR<PackageNullableScalarRelationFilter, PackageWhereInput> | null
  }, "id" | "sessionTokenRef">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    packageId?: SortOrderInput | SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    sessionTokenRef?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Session"> | string
    userId?: UuidWithAggregatesFilter<"Session"> | string
    serviceId?: UuidWithAggregatesFilter<"Session"> | string
    packageId?: UuidNullableWithAggregatesFilter<"Session"> | string | null
    status?: EnumSessionStatusWithAggregatesFilter<"Session"> | $Enums.SessionStatus
    startsAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    endsAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    sessionTokenRef?: StringNullableWithAggregatesFilter<"Session"> | string | null
    stripePaymentId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type PackageWhereInput = {
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    id?: UuidFilter<"Package"> | string
    userId?: UuidFilter<"Package"> | string
    serviceId?: UuidFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    stripePaymentId?: StringNullableFilter<"Package"> | string | null
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    service?: XOR<ServiceScalarRelationFilter, ServiceWhereInput>
    sessions?: SessionListRelationFilter
  }

  export type PackageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    service?: ServiceOrderByWithRelationInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type PackageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    userId?: UuidFilter<"Package"> | string
    serviceId?: UuidFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    service?: XOR<ServiceScalarRelationFilter, ServiceWhereInput>
    sessions?: SessionListRelationFilter
  }, "id" | "stripePaymentId">

  export type PackageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PackageCountOrderByAggregateInput
    _avg?: PackageAvgOrderByAggregateInput
    _max?: PackageMaxOrderByAggregateInput
    _min?: PackageMinOrderByAggregateInput
    _sum?: PackageSumOrderByAggregateInput
  }

  export type PackageScalarWhereWithAggregatesInput = {
    AND?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    OR?: PackageScalarWhereWithAggregatesInput[]
    NOT?: PackageScalarWhereWithAggregatesInput | PackageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Package"> | string
    userId?: UuidWithAggregatesFilter<"Package"> | string
    serviceId?: UuidWithAggregatesFilter<"Package"> | string
    totalSessions?: IntWithAggregatesFilter<"Package"> | number
    usedSessions?: IntWithAggregatesFilter<"Package"> | number
    stripePaymentId?: StringNullableWithAggregatesFilter<"Package"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
  }

  export type ScholarshipWhereInput = {
    AND?: ScholarshipWhereInput | ScholarshipWhereInput[]
    OR?: ScholarshipWhereInput[]
    NOT?: ScholarshipWhereInput | ScholarshipWhereInput[]
    id?: UuidFilter<"Scholarship"> | string
    userId?: UuidFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    requestedCents?: IntFilter<"Scholarship"> | number
    approvedCents?: IntNullableFilter<"Scholarship"> | number | null
    note?: StringNullableFilter<"Scholarship"> | string | null
    createdAt?: DateTimeFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeFilter<"Scholarship"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ScholarshipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    requestedCents?: SortOrder
    approvedCents?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ScholarshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScholarshipWhereInput | ScholarshipWhereInput[]
    OR?: ScholarshipWhereInput[]
    NOT?: ScholarshipWhereInput | ScholarshipWhereInput[]
    userId?: UuidFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    requestedCents?: IntFilter<"Scholarship"> | number
    approvedCents?: IntNullableFilter<"Scholarship"> | number | null
    note?: StringNullableFilter<"Scholarship"> | string | null
    createdAt?: DateTimeFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeFilter<"Scholarship"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type ScholarshipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    requestedCents?: SortOrder
    approvedCents?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ScholarshipCountOrderByAggregateInput
    _avg?: ScholarshipAvgOrderByAggregateInput
    _max?: ScholarshipMaxOrderByAggregateInput
    _min?: ScholarshipMinOrderByAggregateInput
    _sum?: ScholarshipSumOrderByAggregateInput
  }

  export type ScholarshipScalarWhereWithAggregatesInput = {
    AND?: ScholarshipScalarWhereWithAggregatesInput | ScholarshipScalarWhereWithAggregatesInput[]
    OR?: ScholarshipScalarWhereWithAggregatesInput[]
    NOT?: ScholarshipScalarWhereWithAggregatesInput | ScholarshipScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Scholarship"> | string
    userId?: UuidWithAggregatesFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusWithAggregatesFilter<"Scholarship"> | $Enums.ScholarshipStatus
    requestedCents?: IntWithAggregatesFilter<"Scholarship"> | number
    approvedCents?: IntNullableWithAggregatesFilter<"Scholarship"> | number | null
    note?: StringNullableWithAggregatesFilter<"Scholarship"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Scholarship"> | Date | string
  }

  export type DonationWhereInput = {
    AND?: DonationWhereInput | DonationWhereInput[]
    OR?: DonationWhereInput[]
    NOT?: DonationWhereInput | DonationWhereInput[]
    id?: UuidFilter<"Donation"> | string
    userId?: UuidNullableFilter<"Donation"> | string | null
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    amountCents?: IntFilter<"Donation"> | number
    stripePaymentId?: StringNullableFilter<"Donation"> | string | null
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type DonationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    tier?: SortOrder
    amountCents?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DonationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    AND?: DonationWhereInput | DonationWhereInput[]
    OR?: DonationWhereInput[]
    NOT?: DonationWhereInput | DonationWhereInput[]
    userId?: UuidNullableFilter<"Donation"> | string | null
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    amountCents?: IntFilter<"Donation"> | number
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "stripePaymentId">

  export type DonationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    tier?: SortOrder
    amountCents?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DonationCountOrderByAggregateInput
    _avg?: DonationAvgOrderByAggregateInput
    _max?: DonationMaxOrderByAggregateInput
    _min?: DonationMinOrderByAggregateInput
    _sum?: DonationSumOrderByAggregateInput
  }

  export type DonationScalarWhereWithAggregatesInput = {
    AND?: DonationScalarWhereWithAggregatesInput | DonationScalarWhereWithAggregatesInput[]
    OR?: DonationScalarWhereWithAggregatesInput[]
    NOT?: DonationScalarWhereWithAggregatesInput | DonationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Donation"> | string
    userId?: UuidNullableWithAggregatesFilter<"Donation"> | string | null
    tier?: EnumDonationTierWithAggregatesFilter<"Donation"> | $Enums.DonationTier
    amountCents?: IntWithAggregatesFilter<"Donation"> | number
    stripePaymentId?: StringNullableWithAggregatesFilter<"Donation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Donation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Donation"> | Date | string
  }

  export type OrgInquiryWhereInput = {
    AND?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    OR?: OrgInquiryWhereInput[]
    NOT?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    id?: UuidFilter<"OrgInquiry"> | string
    orgName?: StringFilter<"OrgInquiry"> | string
    contactName?: StringFilter<"OrgInquiry"> | string
    email?: StringFilter<"OrgInquiry"> | string
    status?: EnumInquiryStatusFilter<"OrgInquiry"> | $Enums.InquiryStatus
    isNonprofit?: BoolFilter<"OrgInquiry"> | boolean
    ein?: StringNullableFilter<"OrgInquiry"> | string | null
    eventType?: EnumOrgInquiryEventTypeFilter<"OrgInquiry"> | $Enums.OrgInquiryEventType
    headcount?: IntFilter<"OrgInquiry"> | number
    preferredStart?: DateTimeFilter<"OrgInquiry"> | Date | string
    preferredEnd?: DateTimeFilter<"OrgInquiry"> | Date | string
    message?: StringNullableFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeFilter<"OrgInquiry"> | Date | string
  }

  export type OrgInquiryOrderByWithRelationInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    status?: SortOrder
    isNonprofit?: SortOrder
    ein?: SortOrderInput | SortOrder
    eventType?: SortOrder
    headcount?: SortOrder
    preferredStart?: SortOrder
    preferredEnd?: SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    OR?: OrgInquiryWhereInput[]
    NOT?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    orgName?: StringFilter<"OrgInquiry"> | string
    contactName?: StringFilter<"OrgInquiry"> | string
    email?: StringFilter<"OrgInquiry"> | string
    status?: EnumInquiryStatusFilter<"OrgInquiry"> | $Enums.InquiryStatus
    isNonprofit?: BoolFilter<"OrgInquiry"> | boolean
    ein?: StringNullableFilter<"OrgInquiry"> | string | null
    eventType?: EnumOrgInquiryEventTypeFilter<"OrgInquiry"> | $Enums.OrgInquiryEventType
    headcount?: IntFilter<"OrgInquiry"> | number
    preferredStart?: DateTimeFilter<"OrgInquiry"> | Date | string
    preferredEnd?: DateTimeFilter<"OrgInquiry"> | Date | string
    message?: StringNullableFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeFilter<"OrgInquiry"> | Date | string
  }, "id">

  export type OrgInquiryOrderByWithAggregationInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    status?: SortOrder
    isNonprofit?: SortOrder
    ein?: SortOrderInput | SortOrder
    eventType?: SortOrder
    headcount?: SortOrder
    preferredStart?: SortOrder
    preferredEnd?: SortOrder
    message?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrgInquiryCountOrderByAggregateInput
    _avg?: OrgInquiryAvgOrderByAggregateInput
    _max?: OrgInquiryMaxOrderByAggregateInput
    _min?: OrgInquiryMinOrderByAggregateInput
    _sum?: OrgInquirySumOrderByAggregateInput
  }

  export type OrgInquiryScalarWhereWithAggregatesInput = {
    AND?: OrgInquiryScalarWhereWithAggregatesInput | OrgInquiryScalarWhereWithAggregatesInput[]
    OR?: OrgInquiryScalarWhereWithAggregatesInput[]
    NOT?: OrgInquiryScalarWhereWithAggregatesInput | OrgInquiryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OrgInquiry"> | string
    orgName?: StringWithAggregatesFilter<"OrgInquiry"> | string
    contactName?: StringWithAggregatesFilter<"OrgInquiry"> | string
    email?: StringWithAggregatesFilter<"OrgInquiry"> | string
    status?: EnumInquiryStatusWithAggregatesFilter<"OrgInquiry"> | $Enums.InquiryStatus
    isNonprofit?: BoolWithAggregatesFilter<"OrgInquiry"> | boolean
    ein?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    eventType?: EnumOrgInquiryEventTypeWithAggregatesFilter<"OrgInquiry"> | $Enums.OrgInquiryEventType
    headcount?: IntWithAggregatesFilter<"OrgInquiry"> | number
    preferredStart?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
    preferredEnd?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
    message?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
  }

  export type AdminAuditLogWhereInput = {
    AND?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    OR?: AdminAuditLogWhereInput[]
    NOT?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    id?: StringFilter<"AdminAuditLog"> | string
    correlationId?: StringFilter<"AdminAuditLog"> | string
    actorId?: StringFilter<"AdminAuditLog"> | string
    actorEmail?: StringFilter<"AdminAuditLog"> | string
    action?: StringFilter<"AdminAuditLog"> | string
    targetType?: StringNullableFilter<"AdminAuditLog"> | string | null
    targetId?: StringNullableFilter<"AdminAuditLog"> | string | null
    before?: JsonNullableFilter<"AdminAuditLog">
    after?: JsonNullableFilter<"AdminAuditLog">
    justification?: StringNullableFilter<"AdminAuditLog"> | string | null
    result?: StringFilter<"AdminAuditLog"> | string
    ip?: StringNullableFilter<"AdminAuditLog"> | string | null
    userAgent?: StringNullableFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AdminAuditLog"> | Date | string
  }

  export type AdminAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    action?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    before?: SortOrderInput | SortOrder
    after?: SortOrderInput | SortOrder
    justification?: SortOrderInput | SortOrder
    result?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    OR?: AdminAuditLogWhereInput[]
    NOT?: AdminAuditLogWhereInput | AdminAuditLogWhereInput[]
    correlationId?: StringFilter<"AdminAuditLog"> | string
    actorId?: StringFilter<"AdminAuditLog"> | string
    actorEmail?: StringFilter<"AdminAuditLog"> | string
    action?: StringFilter<"AdminAuditLog"> | string
    targetType?: StringNullableFilter<"AdminAuditLog"> | string | null
    targetId?: StringNullableFilter<"AdminAuditLog"> | string | null
    before?: JsonNullableFilter<"AdminAuditLog">
    after?: JsonNullableFilter<"AdminAuditLog">
    justification?: StringNullableFilter<"AdminAuditLog"> | string | null
    result?: StringFilter<"AdminAuditLog"> | string
    ip?: StringNullableFilter<"AdminAuditLog"> | string | null
    userAgent?: StringNullableFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeFilter<"AdminAuditLog"> | Date | string
  }, "id">

  export type AdminAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    action?: SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    before?: SortOrderInput | SortOrder
    after?: SortOrderInput | SortOrder
    justification?: SortOrderInput | SortOrder
    result?: SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AdminAuditLogCountOrderByAggregateInput
    _max?: AdminAuditLogMaxOrderByAggregateInput
    _min?: AdminAuditLogMinOrderByAggregateInput
  }

  export type AdminAuditLogScalarWhereWithAggregatesInput = {
    AND?: AdminAuditLogScalarWhereWithAggregatesInput | AdminAuditLogScalarWhereWithAggregatesInput[]
    OR?: AdminAuditLogScalarWhereWithAggregatesInput[]
    NOT?: AdminAuditLogScalarWhereWithAggregatesInput | AdminAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    correlationId?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    actorId?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    actorEmail?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    action?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    targetType?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    before?: JsonNullableWithAggregatesFilter<"AdminAuditLog">
    after?: JsonNullableWithAggregatesFilter<"AdminAuditLog">
    justification?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    result?: StringWithAggregatesFilter<"AdminAuditLog"> | string
    ip?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AdminAuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AdminAuditLog"> | Date | string
  }

  export type AttachmentWhereInput = {
    AND?: AttachmentWhereInput | AttachmentWhereInput[]
    OR?: AttachmentWhereInput[]
    NOT?: AttachmentWhereInput | AttachmentWhereInput[]
    id?: UuidFilter<"Attachment"> | string
    ownerId?: UuidFilter<"Attachment"> | string
    namespace?: StringFilter<"Attachment"> | string
    storageKey?: StringFilter<"Attachment"> | string
    filename?: StringFilter<"Attachment"> | string
    mimeType?: StringFilter<"Attachment"> | string
    sizeBytes?: IntFilter<"Attachment"> | number
    uploadedAt?: DateTimeFilter<"Attachment"> | Date | string
  }

  export type AttachmentOrderByWithRelationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    namespace?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
  }

  export type AttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AttachmentWhereInput | AttachmentWhereInput[]
    OR?: AttachmentWhereInput[]
    NOT?: AttachmentWhereInput | AttachmentWhereInput[]
    ownerId?: UuidFilter<"Attachment"> | string
    namespace?: StringFilter<"Attachment"> | string
    storageKey?: StringFilter<"Attachment"> | string
    filename?: StringFilter<"Attachment"> | string
    mimeType?: StringFilter<"Attachment"> | string
    sizeBytes?: IntFilter<"Attachment"> | number
    uploadedAt?: DateTimeFilter<"Attachment"> | Date | string
  }, "id">

  export type AttachmentOrderByWithAggregationInput = {
    id?: SortOrder
    ownerId?: SortOrder
    namespace?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
    _count?: AttachmentCountOrderByAggregateInput
    _avg?: AttachmentAvgOrderByAggregateInput
    _max?: AttachmentMaxOrderByAggregateInput
    _min?: AttachmentMinOrderByAggregateInput
    _sum?: AttachmentSumOrderByAggregateInput
  }

  export type AttachmentScalarWhereWithAggregatesInput = {
    AND?: AttachmentScalarWhereWithAggregatesInput | AttachmentScalarWhereWithAggregatesInput[]
    OR?: AttachmentScalarWhereWithAggregatesInput[]
    NOT?: AttachmentScalarWhereWithAggregatesInput | AttachmentScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Attachment"> | string
    ownerId?: UuidWithAggregatesFilter<"Attachment"> | string
    namespace?: StringWithAggregatesFilter<"Attachment"> | string
    storageKey?: StringWithAggregatesFilter<"Attachment"> | string
    filename?: StringWithAggregatesFilter<"Attachment"> | string
    mimeType?: StringWithAggregatesFilter<"Attachment"> | string
    sizeBytes?: IntWithAggregatesFilter<"Attachment"> | number
    uploadedAt?: DateTimeWithAggregatesFilter<"Attachment"> | Date | string
  }

  export type SecurityEventLogWhereInput = {
    AND?: SecurityEventLogWhereInput | SecurityEventLogWhereInput[]
    OR?: SecurityEventLogWhereInput[]
    NOT?: SecurityEventLogWhereInput | SecurityEventLogWhereInput[]
    id?: StringFilter<"SecurityEventLog"> | string
    eventType?: StringFilter<"SecurityEventLog"> | string
    outcome?: StringFilter<"SecurityEventLog"> | string
    correlationId?: StringNullableFilter<"SecurityEventLog"> | string | null
    actorId?: StringNullableFilter<"SecurityEventLog"> | string | null
    actorRole?: StringNullableFilter<"SecurityEventLog"> | string | null
    targetType?: StringNullableFilter<"SecurityEventLog"> | string | null
    targetId?: StringNullableFilter<"SecurityEventLog"> | string | null
    failureReason?: StringNullableFilter<"SecurityEventLog"> | string | null
    ip?: StringNullableFilter<"SecurityEventLog"> | string | null
    userAgent?: StringNullableFilter<"SecurityEventLog"> | string | null
    metadata?: JsonNullableFilter<"SecurityEventLog">
    createdAt?: DateTimeFilter<"SecurityEventLog"> | Date | string
  }

  export type SecurityEventLogOrderByWithRelationInput = {
    id?: SortOrder
    eventType?: SortOrder
    outcome?: SortOrder
    correlationId?: SortOrderInput | SortOrder
    actorId?: SortOrderInput | SortOrder
    actorRole?: SortOrderInput | SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SecurityEventLogWhereInput | SecurityEventLogWhereInput[]
    OR?: SecurityEventLogWhereInput[]
    NOT?: SecurityEventLogWhereInput | SecurityEventLogWhereInput[]
    eventType?: StringFilter<"SecurityEventLog"> | string
    outcome?: StringFilter<"SecurityEventLog"> | string
    correlationId?: StringNullableFilter<"SecurityEventLog"> | string | null
    actorId?: StringNullableFilter<"SecurityEventLog"> | string | null
    actorRole?: StringNullableFilter<"SecurityEventLog"> | string | null
    targetType?: StringNullableFilter<"SecurityEventLog"> | string | null
    targetId?: StringNullableFilter<"SecurityEventLog"> | string | null
    failureReason?: StringNullableFilter<"SecurityEventLog"> | string | null
    ip?: StringNullableFilter<"SecurityEventLog"> | string | null
    userAgent?: StringNullableFilter<"SecurityEventLog"> | string | null
    metadata?: JsonNullableFilter<"SecurityEventLog">
    createdAt?: DateTimeFilter<"SecurityEventLog"> | Date | string
  }, "id">

  export type SecurityEventLogOrderByWithAggregationInput = {
    id?: SortOrder
    eventType?: SortOrder
    outcome?: SortOrder
    correlationId?: SortOrderInput | SortOrder
    actorId?: SortOrderInput | SortOrder
    actorRole?: SortOrderInput | SortOrder
    targetType?: SortOrderInput | SortOrder
    targetId?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    ip?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SecurityEventLogCountOrderByAggregateInput
    _max?: SecurityEventLogMaxOrderByAggregateInput
    _min?: SecurityEventLogMinOrderByAggregateInput
  }

  export type SecurityEventLogScalarWhereWithAggregatesInput = {
    AND?: SecurityEventLogScalarWhereWithAggregatesInput | SecurityEventLogScalarWhereWithAggregatesInput[]
    OR?: SecurityEventLogScalarWhereWithAggregatesInput[]
    NOT?: SecurityEventLogScalarWhereWithAggregatesInput | SecurityEventLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SecurityEventLog"> | string
    eventType?: StringWithAggregatesFilter<"SecurityEventLog"> | string
    outcome?: StringWithAggregatesFilter<"SecurityEventLog"> | string
    correlationId?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    actorId?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    actorRole?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    targetType?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    targetId?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    failureReason?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    ip?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"SecurityEventLog"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"SecurityEventLog">
    createdAt?: DateTimeWithAggregatesFilter<"SecurityEventLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeCreateInput = {
    id?: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMfaBackupCodesInput
  }

  export type MfaBackupCodeUncheckedCreateInput = {
    id?: string
    userId: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMfaBackupCodesNestedInput
  }

  export type MfaBackupCodeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeCreateManyInput = {
    id?: string
    userId: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaPendingTokenCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    purpose: string
    destination?: string | null
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaPendingTokenUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    purpose: string
    destination?: string | null
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaPendingTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaPendingTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaPendingTokenCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    purpose: string
    destination?: string | null
    expiresAt: Date | string
    consumedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaPendingTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaPendingTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    destination?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    consumedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceCreateInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutServiceInput
    packages?: PackageCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutServiceInput
    packages?: PackageUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutServiceNestedInput
    packages?: PackageUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutServiceNestedInput
    packages?: PackageUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type ServiceCreateManyInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    service: ServiceCreateNestedOneWithoutSessionsInput
    package?: PackageCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    userId: string
    serviceId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    service?: ServiceUpdateOneRequiredWithoutSessionsNestedInput
    package?: PackageUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    serviceId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPackagesInput
    service: ServiceCreateNestedOneWithoutPackagesInput
    sessions?: SessionCreateNestedManyWithoutPackageInput
  }

  export type PackageUncheckedCreateInput = {
    id?: string
    userId: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutPackageInput
  }

  export type PackageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPackagesNestedInput
    service?: ServiceUpdateOneRequiredWithoutPackagesNestedInput
    sessions?: SessionUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutPackageNestedInput
  }

  export type PackageCreateManyInput = {
    id?: string
    userId: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipCreateInput = {
    id?: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutScholarshipsInput
  }

  export type ScholarshipUncheckedCreateInput = {
    id?: string
    userId: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutScholarshipsNestedInput
  }

  export type ScholarshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipCreateManyInput = {
    id?: string
    userId: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationCreateInput = {
    id?: string
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutDonationsInput
  }

  export type DonationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutDonationsNestedInput
  }

  export type DonationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationCreateManyInput = {
    id?: string
    userId?: string | null
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryCreateInput = {
    id?: string
    orgName: string
    contactName: string
    email: string
    status?: $Enums.InquiryStatus
    isNonprofit?: boolean
    ein?: string | null
    eventType: $Enums.OrgInquiryEventType
    headcount: number
    preferredStart: Date | string
    preferredEnd: Date | string
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUncheckedCreateInput = {
    id?: string
    orgName: string
    contactName: string
    email: string
    status?: $Enums.InquiryStatus
    isNonprofit?: boolean
    ein?: string | null
    eventType: $Enums.OrgInquiryEventType
    headcount: number
    preferredStart: Date | string
    preferredEnd: Date | string
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumOrgInquiryEventTypeFieldUpdateOperationsInput | $Enums.OrgInquiryEventType
    headcount?: IntFieldUpdateOperationsInput | number
    preferredStart?: DateTimeFieldUpdateOperationsInput | Date | string
    preferredEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumOrgInquiryEventTypeFieldUpdateOperationsInput | $Enums.OrgInquiryEventType
    headcount?: IntFieldUpdateOperationsInput | number
    preferredStart?: DateTimeFieldUpdateOperationsInput | Date | string
    preferredEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryCreateManyInput = {
    id?: string
    orgName: string
    contactName: string
    email: string
    status?: $Enums.InquiryStatus
    isNonprofit?: boolean
    ein?: string | null
    eventType: $Enums.OrgInquiryEventType
    headcount: number
    preferredStart: Date | string
    preferredEnd: Date | string
    message?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumOrgInquiryEventTypeFieldUpdateOperationsInput | $Enums.OrgInquiryEventType
    headcount?: IntFieldUpdateOperationsInput | number
    preferredStart?: DateTimeFieldUpdateOperationsInput | Date | string
    preferredEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumOrgInquiryEventTypeFieldUpdateOperationsInput | $Enums.OrgInquiryEventType
    headcount?: IntFieldUpdateOperationsInput | number
    preferredStart?: DateTimeFieldUpdateOperationsInput | Date | string
    preferredEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogCreateInput = {
    id?: string
    correlationId: string
    actorId: string
    actorEmail: string
    action: string
    targetType?: string | null
    targetId?: string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: string | null
    result: string
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUncheckedCreateInput = {
    id?: string
    correlationId: string
    actorId: string
    actorEmail: string
    action: string
    targetType?: string | null
    targetId?: string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: string | null
    result: string
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    correlationId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    correlationId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogCreateManyInput = {
    id?: string
    correlationId: string
    actorId: string
    actorEmail: string
    action: string
    targetType?: string | null
    targetId?: string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: string | null
    result: string
    ip?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    correlationId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    correlationId?: StringFieldUpdateOperationsInput | string
    actorId?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    before?: NullableJsonNullValueInput | InputJsonValue
    after?: NullableJsonNullValueInput | InputJsonValue
    justification?: NullableStringFieldUpdateOperationsInput | string | null
    result?: StringFieldUpdateOperationsInput | string
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentCreateInput = {
    id?: string
    ownerId: string
    namespace: string
    storageKey: string
    filename: string
    mimeType: string
    sizeBytes: number
    uploadedAt?: Date | string
  }

  export type AttachmentUncheckedCreateInput = {
    id?: string
    ownerId: string
    namespace: string
    storageKey: string
    filename: string
    mimeType: string
    sizeBytes: number
    uploadedAt?: Date | string
  }

  export type AttachmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentCreateManyInput = {
    id?: string
    ownerId: string
    namespace: string
    storageKey: string
    filename: string
    mimeType: string
    sizeBytes: number
    uploadedAt?: Date | string
  }

  export type AttachmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AttachmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    namespace?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventLogCreateInput = {
    id?: string
    eventType: string
    outcome: string
    correlationId?: string | null
    actorId?: string | null
    actorRole?: string | null
    targetType?: string | null
    targetId?: string | null
    failureReason?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventLogUncheckedCreateInput = {
    id?: string
    eventType: string
    outcome: string
    correlationId?: string | null
    actorId?: string | null
    actorRole?: string | null
    targetType?: string | null
    targetId?: string | null
    failureReason?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventLogCreateManyInput = {
    id?: string
    eventType: string
    outcome: string
    correlationId?: string | null
    actorId?: string | null
    actorRole?: string | null
    targetType?: string | null
    targetId?: string | null
    failureReason?: string | null
    ip?: string | null
    userAgent?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityEventLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityEventLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    outcome?: StringFieldUpdateOperationsInput | string
    correlationId?: NullableStringFieldUpdateOperationsInput | string | null
    actorId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    targetType?: NullableStringFieldUpdateOperationsInput | string | null
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    ip?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type PackageListRelationFilter = {
    every?: PackageWhereInput
    some?: PackageWhereInput
    none?: PackageWhereInput
  }

  export type ScholarshipListRelationFilter = {
    every?: ScholarshipWhereInput
    some?: ScholarshipWhereInput
    none?: ScholarshipWhereInput
  }

  export type DonationListRelationFilter = {
    every?: DonationWhereInput
    some?: DonationWhereInput
    none?: DonationWhereInput
  }

  export type MfaBackupCodeListRelationFilter = {
    every?: MfaBackupCodeWhereInput
    some?: MfaBackupCodeWhereInput
    none?: MfaBackupCodeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PackageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScholarshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DonationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MfaBackupCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    role?: SortOrder
    deletedAt?: SortOrder
    suspendedAt?: SortOrder
    suspendedBy?: SortOrder
    suspensionReason?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    mfaEnrolledAt?: SortOrder
    lastMfaVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    role?: SortOrder
    deletedAt?: SortOrder
    suspendedAt?: SortOrder
    suspendedBy?: SortOrder
    suspensionReason?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    mfaEnrolledAt?: SortOrder
    lastMfaVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    email?: SortOrder
    role?: SortOrder
    deletedAt?: SortOrder
    suspendedAt?: SortOrder
    suspendedBy?: SortOrder
    suspensionReason?: SortOrder
    mfaEnabled?: SortOrder
    mfaSecretEnc?: SortOrder
    mfaSecretIv?: SortOrder
    mfaSecretTag?: SortOrder
    mfaEnrolledAt?: SortOrder
    lastMfaVerifiedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MfaBackupCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaBackupCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaBackupCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    codeHash?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaPendingTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    purpose?: SortOrder
    destination?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaPendingTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    purpose?: SortOrder
    destination?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MfaPendingTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    purpose?: SortOrder
    destination?: SortOrder
    expiresAt?: SortOrder
    consumedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumServiceCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryFilter<$PrismaModel> | $Enums.ServiceCategory
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ServiceCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceAvgOrderByAggregateInput = {
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
  }

  export type ServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    category?: SortOrder
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceSumOrderByAggregateInput = {
    priceCents?: SortOrder
    scholarshipMinCents?: SortOrder
    scholarshipMaxCents?: SortOrder
  }

  export type EnumServiceCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ServiceCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumServiceCategoryFilter<$PrismaModel>
    _max?: NestedEnumServiceCategoryFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type ServiceScalarRelationFilter = {
    is?: ServiceWhereInput
    isNot?: ServiceWhereInput
  }

  export type PackageNullableScalarRelationFilter = {
    is?: PackageWhereInput | null
    isNot?: PackageWhereInput | null
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    packageId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    sessionTokenRef?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    packageId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    sessionTokenRef?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    packageId?: SortOrder
    status?: SortOrder
    startsAt?: SortOrder
    endsAt?: SortOrder
    sessionTokenRef?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type PackageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    stripePaymentId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageAvgOrderByAggregateInput = {
    totalSessions?: SortOrder
    usedSessions?: SortOrder
  }

  export type PackageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    stripePaymentId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    stripePaymentId?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageSumOrderByAggregateInput = {
    totalSessions?: SortOrder
    usedSessions?: SortOrder
  }

  export type EnumScholarshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusFilter<$PrismaModel> | $Enums.ScholarshipStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ScholarshipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    requestedCents?: SortOrder
    approvedCents?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipAvgOrderByAggregateInput = {
    requestedCents?: SortOrder
    approvedCents?: SortOrder
  }

  export type ScholarshipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    requestedCents?: SortOrder
    approvedCents?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    requestedCents?: SortOrder
    approvedCents?: SortOrder
    note?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipSumOrderByAggregateInput = {
    requestedCents?: SortOrder
    approvedCents?: SortOrder
  }

  export type EnumScholarshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.ScholarshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScholarshipStatusFilter<$PrismaModel>
    _max?: NestedEnumScholarshipStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDonationTierFilter<$PrismaModel = never> = {
    equals?: $Enums.DonationTier | EnumDonationTierFieldRefInput<$PrismaModel>
    in?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    not?: NestedEnumDonationTierFilter<$PrismaModel> | $Enums.DonationTier
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DonationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tier?: SortOrder
    amountCents?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationAvgOrderByAggregateInput = {
    amountCents?: SortOrder
  }

  export type DonationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tier?: SortOrder
    amountCents?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tier?: SortOrder
    amountCents?: SortOrder
    stripePaymentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationSumOrderByAggregateInput = {
    amountCents?: SortOrder
  }

  export type EnumDonationTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DonationTier | EnumDonationTierFieldRefInput<$PrismaModel>
    in?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    not?: NestedEnumDonationTierWithAggregatesFilter<$PrismaModel> | $Enums.DonationTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDonationTierFilter<$PrismaModel>
    _max?: NestedEnumDonationTierFilter<$PrismaModel>
  }

  export type EnumInquiryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusFilter<$PrismaModel> | $Enums.InquiryStatus
  }

  export type EnumOrgInquiryEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OrgInquiryEventType | EnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel> | $Enums.OrgInquiryEventType
  }

  export type OrgInquiryCountOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    status?: SortOrder
    isNonprofit?: SortOrder
    ein?: SortOrder
    eventType?: SortOrder
    headcount?: SortOrder
    preferredStart?: SortOrder
    preferredEnd?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryAvgOrderByAggregateInput = {
    headcount?: SortOrder
  }

  export type OrgInquiryMaxOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    status?: SortOrder
    isNonprofit?: SortOrder
    ein?: SortOrder
    eventType?: SortOrder
    headcount?: SortOrder
    preferredStart?: SortOrder
    preferredEnd?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryMinOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    status?: SortOrder
    isNonprofit?: SortOrder
    ein?: SortOrder
    eventType?: SortOrder
    headcount?: SortOrder
    preferredStart?: SortOrder
    preferredEnd?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquirySumOrderByAggregateInput = {
    headcount?: SortOrder
  }

  export type EnumInquiryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InquiryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInquiryStatusFilter<$PrismaModel>
    _max?: NestedEnumInquiryStatusFilter<$PrismaModel>
  }

  export type EnumOrgInquiryEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrgInquiryEventType | EnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOrgInquiryEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.OrgInquiryEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel>
    _max?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AdminAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    before?: SortOrder
    after?: SortOrder
    justification?: SortOrder
    result?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    justification?: SortOrder
    result?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorEmail?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    justification?: SortOrder
    result?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AttachmentCountOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    namespace?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
  }

  export type AttachmentAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type AttachmentMaxOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    namespace?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
  }

  export type AttachmentMinOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
    namespace?: SortOrder
    storageKey?: SortOrder
    filename?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    uploadedAt?: SortOrder
  }

  export type AttachmentSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type SecurityEventLogCountOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    outcome?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    failureReason?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventLogMaxOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    outcome?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    failureReason?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityEventLogMinOrderByAggregateInput = {
    id?: SortOrder
    eventType?: SortOrder
    outcome?: SortOrder
    correlationId?: SortOrder
    actorId?: SortOrder
    actorRole?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    failureReason?: SortOrder
    ip?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PackageCreateNestedManyWithoutUserInput = {
    create?: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput> | PackageCreateWithoutUserInput[] | PackageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutUserInput | PackageCreateOrConnectWithoutUserInput[]
    createMany?: PackageCreateManyUserInputEnvelope
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
  }

  export type ScholarshipCreateNestedManyWithoutUserInput = {
    create?: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput> | ScholarshipCreateWithoutUserInput[] | ScholarshipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutUserInput | ScholarshipCreateOrConnectWithoutUserInput[]
    createMany?: ScholarshipCreateManyUserInputEnvelope
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
  }

  export type DonationCreateNestedManyWithoutUserInput = {
    create?: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput> | DonationCreateWithoutUserInput[] | DonationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DonationCreateOrConnectWithoutUserInput | DonationCreateOrConnectWithoutUserInput[]
    createMany?: DonationCreateManyUserInputEnvelope
    connect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
  }

  export type MfaBackupCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PackageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput> | PackageCreateWithoutUserInput[] | PackageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutUserInput | PackageCreateOrConnectWithoutUserInput[]
    createMany?: PackageCreateManyUserInputEnvelope
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
  }

  export type ScholarshipUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput> | ScholarshipCreateWithoutUserInput[] | ScholarshipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutUserInput | ScholarshipCreateOrConnectWithoutUserInput[]
    createMany?: ScholarshipCreateManyUserInputEnvelope
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
  }

  export type DonationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput> | DonationCreateWithoutUserInput[] | DonationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DonationCreateOrConnectWithoutUserInput | DonationCreateOrConnectWithoutUserInput[]
    createMany?: DonationCreateManyUserInputEnvelope
    connect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
  }

  export type MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PackageUpdateManyWithoutUserNestedInput = {
    create?: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput> | PackageCreateWithoutUserInput[] | PackageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutUserInput | PackageCreateOrConnectWithoutUserInput[]
    upsert?: PackageUpsertWithWhereUniqueWithoutUserInput | PackageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PackageCreateManyUserInputEnvelope
    set?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    disconnect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    delete?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    update?: PackageUpdateWithWhereUniqueWithoutUserInput | PackageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PackageUpdateManyWithWhereWithoutUserInput | PackageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PackageScalarWhereInput | PackageScalarWhereInput[]
  }

  export type ScholarshipUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput> | ScholarshipCreateWithoutUserInput[] | ScholarshipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutUserInput | ScholarshipCreateOrConnectWithoutUserInput[]
    upsert?: ScholarshipUpsertWithWhereUniqueWithoutUserInput | ScholarshipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScholarshipCreateManyUserInputEnvelope
    set?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    disconnect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    delete?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    update?: ScholarshipUpdateWithWhereUniqueWithoutUserInput | ScholarshipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScholarshipUpdateManyWithWhereWithoutUserInput | ScholarshipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
  }

  export type DonationUpdateManyWithoutUserNestedInput = {
    create?: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput> | DonationCreateWithoutUserInput[] | DonationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DonationCreateOrConnectWithoutUserInput | DonationCreateOrConnectWithoutUserInput[]
    upsert?: DonationUpsertWithWhereUniqueWithoutUserInput | DonationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DonationCreateManyUserInputEnvelope
    set?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    disconnect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    delete?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    connect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    update?: DonationUpdateWithWhereUniqueWithoutUserInput | DonationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DonationUpdateManyWithWhereWithoutUserInput | DonationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DonationScalarWhereInput | DonationScalarWhereInput[]
  }

  export type MfaBackupCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput | MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    set?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    disconnect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    delete?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    update?: MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput | MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MfaBackupCodeUpdateManyWithWhereWithoutUserInput | MfaBackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PackageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput> | PackageCreateWithoutUserInput[] | PackageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutUserInput | PackageCreateOrConnectWithoutUserInput[]
    upsert?: PackageUpsertWithWhereUniqueWithoutUserInput | PackageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PackageCreateManyUserInputEnvelope
    set?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    disconnect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    delete?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    update?: PackageUpdateWithWhereUniqueWithoutUserInput | PackageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PackageUpdateManyWithWhereWithoutUserInput | PackageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PackageScalarWhereInput | PackageScalarWhereInput[]
  }

  export type ScholarshipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput> | ScholarshipCreateWithoutUserInput[] | ScholarshipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutUserInput | ScholarshipCreateOrConnectWithoutUserInput[]
    upsert?: ScholarshipUpsertWithWhereUniqueWithoutUserInput | ScholarshipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScholarshipCreateManyUserInputEnvelope
    set?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    disconnect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    delete?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    update?: ScholarshipUpdateWithWhereUniqueWithoutUserInput | ScholarshipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScholarshipUpdateManyWithWhereWithoutUserInput | ScholarshipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
  }

  export type DonationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput> | DonationCreateWithoutUserInput[] | DonationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DonationCreateOrConnectWithoutUserInput | DonationCreateOrConnectWithoutUserInput[]
    upsert?: DonationUpsertWithWhereUniqueWithoutUserInput | DonationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DonationCreateManyUserInputEnvelope
    set?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    disconnect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    delete?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    connect?: DonationWhereUniqueInput | DonationWhereUniqueInput[]
    update?: DonationUpdateWithWhereUniqueWithoutUserInput | DonationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DonationUpdateManyWithWhereWithoutUserInput | DonationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DonationScalarWhereInput | DonationScalarWhereInput[]
  }

  export type MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput> | MfaBackupCodeCreateWithoutUserInput[] | MfaBackupCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MfaBackupCodeCreateOrConnectWithoutUserInput | MfaBackupCodeCreateOrConnectWithoutUserInput[]
    upsert?: MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput | MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MfaBackupCodeCreateManyUserInputEnvelope
    set?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    disconnect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    delete?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    connect?: MfaBackupCodeWhereUniqueInput | MfaBackupCodeWhereUniqueInput[]
    update?: MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput | MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MfaBackupCodeUpdateManyWithWhereWithoutUserInput | MfaBackupCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMfaBackupCodesInput = {
    create?: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMfaBackupCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMfaBackupCodesNestedInput = {
    create?: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMfaBackupCodesInput
    upsert?: UserUpsertWithoutMfaBackupCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMfaBackupCodesInput, UserUpdateWithoutMfaBackupCodesInput>, UserUncheckedUpdateWithoutMfaBackupCodesInput>
  }

  export type SessionCreateNestedManyWithoutServiceInput = {
    create?: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput> | SessionCreateWithoutServiceInput[] | SessionUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutServiceInput | SessionCreateOrConnectWithoutServiceInput[]
    createMany?: SessionCreateManyServiceInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PackageCreateNestedManyWithoutServiceInput = {
    create?: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput> | PackageCreateWithoutServiceInput[] | PackageUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutServiceInput | PackageCreateOrConnectWithoutServiceInput[]
    createMany?: PackageCreateManyServiceInputEnvelope
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutServiceInput = {
    create?: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput> | SessionCreateWithoutServiceInput[] | SessionUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutServiceInput | SessionCreateOrConnectWithoutServiceInput[]
    createMany?: SessionCreateManyServiceInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PackageUncheckedCreateNestedManyWithoutServiceInput = {
    create?: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput> | PackageCreateWithoutServiceInput[] | PackageUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutServiceInput | PackageCreateOrConnectWithoutServiceInput[]
    createMany?: PackageCreateManyServiceInputEnvelope
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
  }

  export type EnumServiceCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ServiceCategory
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SessionUpdateManyWithoutServiceNestedInput = {
    create?: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput> | SessionCreateWithoutServiceInput[] | SessionUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutServiceInput | SessionCreateOrConnectWithoutServiceInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutServiceInput | SessionUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: SessionCreateManyServiceInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutServiceInput | SessionUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutServiceInput | SessionUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PackageUpdateManyWithoutServiceNestedInput = {
    create?: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput> | PackageCreateWithoutServiceInput[] | PackageUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutServiceInput | PackageCreateOrConnectWithoutServiceInput[]
    upsert?: PackageUpsertWithWhereUniqueWithoutServiceInput | PackageUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: PackageCreateManyServiceInputEnvelope
    set?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    disconnect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    delete?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    update?: PackageUpdateWithWhereUniqueWithoutServiceInput | PackageUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: PackageUpdateManyWithWhereWithoutServiceInput | PackageUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: PackageScalarWhereInput | PackageScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutServiceNestedInput = {
    create?: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput> | SessionCreateWithoutServiceInput[] | SessionUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutServiceInput | SessionCreateOrConnectWithoutServiceInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutServiceInput | SessionUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: SessionCreateManyServiceInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutServiceInput | SessionUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutServiceInput | SessionUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PackageUncheckedUpdateManyWithoutServiceNestedInput = {
    create?: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput> | PackageCreateWithoutServiceInput[] | PackageUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: PackageCreateOrConnectWithoutServiceInput | PackageCreateOrConnectWithoutServiceInput[]
    upsert?: PackageUpsertWithWhereUniqueWithoutServiceInput | PackageUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: PackageCreateManyServiceInputEnvelope
    set?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    disconnect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    delete?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    connect?: PackageWhereUniqueInput | PackageWhereUniqueInput[]
    update?: PackageUpdateWithWhereUniqueWithoutServiceInput | PackageUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: PackageUpdateManyWithWhereWithoutServiceInput | PackageUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: PackageScalarWhereInput | PackageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ServiceCreateNestedOneWithoutSessionsInput = {
    create?: XOR<ServiceCreateWithoutSessionsInput, ServiceUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutSessionsInput
    connect?: ServiceWhereUniqueInput
  }

  export type PackageCreateNestedOneWithoutSessionsInput = {
    create?: XOR<PackageCreateWithoutSessionsInput, PackageUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: PackageCreateOrConnectWithoutSessionsInput
    connect?: PackageWhereUniqueInput
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type ServiceUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<ServiceCreateWithoutSessionsInput, ServiceUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutSessionsInput
    upsert?: ServiceUpsertWithoutSessionsInput
    connect?: ServiceWhereUniqueInput
    update?: XOR<XOR<ServiceUpdateToOneWithWhereWithoutSessionsInput, ServiceUpdateWithoutSessionsInput>, ServiceUncheckedUpdateWithoutSessionsInput>
  }

  export type PackageUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<PackageCreateWithoutSessionsInput, PackageUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: PackageCreateOrConnectWithoutSessionsInput
    upsert?: PackageUpsertWithoutSessionsInput
    disconnect?: PackageWhereInput | boolean
    delete?: PackageWhereInput | boolean
    connect?: PackageWhereUniqueInput
    update?: XOR<XOR<PackageUpdateToOneWithWhereWithoutSessionsInput, PackageUpdateWithoutSessionsInput>, PackageUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutPackagesInput = {
    create?: XOR<UserCreateWithoutPackagesInput, UserUncheckedCreateWithoutPackagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPackagesInput
    connect?: UserWhereUniqueInput
  }

  export type ServiceCreateNestedOneWithoutPackagesInput = {
    create?: XOR<ServiceCreateWithoutPackagesInput, ServiceUncheckedCreateWithoutPackagesInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutPackagesInput
    connect?: ServiceWhereUniqueInput
  }

  export type SessionCreateNestedManyWithoutPackageInput = {
    create?: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput> | SessionCreateWithoutPackageInput[] | SessionUncheckedCreateWithoutPackageInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutPackageInput | SessionCreateOrConnectWithoutPackageInput[]
    createMany?: SessionCreateManyPackageInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutPackageInput = {
    create?: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput> | SessionCreateWithoutPackageInput[] | SessionUncheckedCreateWithoutPackageInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutPackageInput | SessionCreateOrConnectWithoutPackageInput[]
    createMany?: SessionCreateManyPackageInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPackagesNestedInput = {
    create?: XOR<UserCreateWithoutPackagesInput, UserUncheckedCreateWithoutPackagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPackagesInput
    upsert?: UserUpsertWithoutPackagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPackagesInput, UserUpdateWithoutPackagesInput>, UserUncheckedUpdateWithoutPackagesInput>
  }

  export type ServiceUpdateOneRequiredWithoutPackagesNestedInput = {
    create?: XOR<ServiceCreateWithoutPackagesInput, ServiceUncheckedCreateWithoutPackagesInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutPackagesInput
    upsert?: ServiceUpsertWithoutPackagesInput
    connect?: ServiceWhereUniqueInput
    update?: XOR<XOR<ServiceUpdateToOneWithWhereWithoutPackagesInput, ServiceUpdateWithoutPackagesInput>, ServiceUncheckedUpdateWithoutPackagesInput>
  }

  export type SessionUpdateManyWithoutPackageNestedInput = {
    create?: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput> | SessionCreateWithoutPackageInput[] | SessionUncheckedCreateWithoutPackageInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutPackageInput | SessionCreateOrConnectWithoutPackageInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutPackageInput | SessionUpsertWithWhereUniqueWithoutPackageInput[]
    createMany?: SessionCreateManyPackageInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutPackageInput | SessionUpdateWithWhereUniqueWithoutPackageInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutPackageInput | SessionUpdateManyWithWhereWithoutPackageInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutPackageNestedInput = {
    create?: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput> | SessionCreateWithoutPackageInput[] | SessionUncheckedCreateWithoutPackageInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutPackageInput | SessionCreateOrConnectWithoutPackageInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutPackageInput | SessionUpsertWithWhereUniqueWithoutPackageInput[]
    createMany?: SessionCreateManyPackageInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutPackageInput | SessionUpdateWithWhereUniqueWithoutPackageInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutPackageInput | SessionUpdateManyWithWhereWithoutPackageInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutScholarshipsInput = {
    create?: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScholarshipsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumScholarshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.ScholarshipStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutScholarshipsNestedInput = {
    create?: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScholarshipsInput
    upsert?: UserUpsertWithoutScholarshipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutScholarshipsInput, UserUpdateWithoutScholarshipsInput>, UserUncheckedUpdateWithoutScholarshipsInput>
  }

  export type UserCreateNestedOneWithoutDonationsInput = {
    create?: XOR<UserCreateWithoutDonationsInput, UserUncheckedCreateWithoutDonationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDonationsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumDonationTierFieldUpdateOperationsInput = {
    set?: $Enums.DonationTier
  }

  export type UserUpdateOneWithoutDonationsNestedInput = {
    create?: XOR<UserCreateWithoutDonationsInput, UserUncheckedCreateWithoutDonationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDonationsInput
    upsert?: UserUpsertWithoutDonationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDonationsInput, UserUpdateWithoutDonationsInput>, UserUncheckedUpdateWithoutDonationsInput>
  }

  export type EnumInquiryStatusFieldUpdateOperationsInput = {
    set?: $Enums.InquiryStatus
  }

  export type EnumOrgInquiryEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.OrgInquiryEventType
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumServiceCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryFilter<$PrismaModel> | $Enums.ServiceCategory
  }

  export type NestedEnumServiceCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ServiceCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumServiceCategoryFilter<$PrismaModel>
    _max?: NestedEnumServiceCategoryFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumScholarshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusFilter<$PrismaModel> | $Enums.ScholarshipStatus
  }

  export type NestedEnumScholarshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.ScholarshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumScholarshipStatusFilter<$PrismaModel>
    _max?: NestedEnumScholarshipStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDonationTierFilter<$PrismaModel = never> = {
    equals?: $Enums.DonationTier | EnumDonationTierFieldRefInput<$PrismaModel>
    in?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    not?: NestedEnumDonationTierFilter<$PrismaModel> | $Enums.DonationTier
  }

  export type NestedEnumDonationTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DonationTier | EnumDonationTierFieldRefInput<$PrismaModel>
    in?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    not?: NestedEnumDonationTierWithAggregatesFilter<$PrismaModel> | $Enums.DonationTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDonationTierFilter<$PrismaModel>
    _max?: NestedEnumDonationTierFilter<$PrismaModel>
  }

  export type NestedEnumInquiryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusFilter<$PrismaModel> | $Enums.InquiryStatus
  }

  export type NestedEnumOrgInquiryEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.OrgInquiryEventType | EnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel> | $Enums.OrgInquiryEventType
  }

  export type NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InquiryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInquiryStatusFilter<$PrismaModel>
    _max?: NestedEnumInquiryStatusFilter<$PrismaModel>
  }

  export type NestedEnumOrgInquiryEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrgInquiryEventType | EnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OrgInquiryEventType[] | ListEnumOrgInquiryEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumOrgInquiryEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.OrgInquiryEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel>
    _max?: NestedEnumOrgInquiryEventTypeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    service: ServiceCreateNestedOneWithoutSessionsInput
    package?: PackageCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    serviceId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PackageCreateWithoutUserInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    service: ServiceCreateNestedOneWithoutPackagesInput
    sessions?: SessionCreateNestedManyWithoutPackageInput
  }

  export type PackageUncheckedCreateWithoutUserInput = {
    id?: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutPackageInput
  }

  export type PackageCreateOrConnectWithoutUserInput = {
    where: PackageWhereUniqueInput
    create: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput>
  }

  export type PackageCreateManyUserInputEnvelope = {
    data: PackageCreateManyUserInput | PackageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ScholarshipCreateWithoutUserInput = {
    id?: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipCreateOrConnectWithoutUserInput = {
    where: ScholarshipWhereUniqueInput
    create: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput>
  }

  export type ScholarshipCreateManyUserInputEnvelope = {
    data: ScholarshipCreateManyUserInput | ScholarshipCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DonationCreateWithoutUserInput = {
    id?: string
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUncheckedCreateWithoutUserInput = {
    id?: string
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationCreateOrConnectWithoutUserInput = {
    where: DonationWhereUniqueInput
    create: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput>
  }

  export type DonationCreateManyUserInputEnvelope = {
    data: DonationCreateManyUserInput | DonationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MfaBackupCodeCreateWithoutUserInput = {
    id?: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeUncheckedCreateWithoutUserInput = {
    id?: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MfaBackupCodeCreateOrConnectWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    create: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput>
  }

  export type MfaBackupCodeCreateManyUserInputEnvelope = {
    data: MfaBackupCodeCreateManyUserInput | MfaBackupCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: UuidFilter<"Session"> | string
    userId?: UuidFilter<"Session"> | string
    serviceId?: UuidFilter<"Session"> | string
    packageId?: UuidNullableFilter<"Session"> | string | null
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    startsAt?: DateTimeFilter<"Session"> | Date | string
    endsAt?: DateTimeFilter<"Session"> | Date | string
    sessionTokenRef?: StringNullableFilter<"Session"> | string | null
    stripePaymentId?: StringNullableFilter<"Session"> | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type PackageUpsertWithWhereUniqueWithoutUserInput = {
    where: PackageWhereUniqueInput
    update: XOR<PackageUpdateWithoutUserInput, PackageUncheckedUpdateWithoutUserInput>
    create: XOR<PackageCreateWithoutUserInput, PackageUncheckedCreateWithoutUserInput>
  }

  export type PackageUpdateWithWhereUniqueWithoutUserInput = {
    where: PackageWhereUniqueInput
    data: XOR<PackageUpdateWithoutUserInput, PackageUncheckedUpdateWithoutUserInput>
  }

  export type PackageUpdateManyWithWhereWithoutUserInput = {
    where: PackageScalarWhereInput
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyWithoutUserInput>
  }

  export type PackageScalarWhereInput = {
    AND?: PackageScalarWhereInput | PackageScalarWhereInput[]
    OR?: PackageScalarWhereInput[]
    NOT?: PackageScalarWhereInput | PackageScalarWhereInput[]
    id?: UuidFilter<"Package"> | string
    userId?: UuidFilter<"Package"> | string
    serviceId?: UuidFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    stripePaymentId?: StringNullableFilter<"Package"> | string | null
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
  }

  export type ScholarshipUpsertWithWhereUniqueWithoutUserInput = {
    where: ScholarshipWhereUniqueInput
    update: XOR<ScholarshipUpdateWithoutUserInput, ScholarshipUncheckedUpdateWithoutUserInput>
    create: XOR<ScholarshipCreateWithoutUserInput, ScholarshipUncheckedCreateWithoutUserInput>
  }

  export type ScholarshipUpdateWithWhereUniqueWithoutUserInput = {
    where: ScholarshipWhereUniqueInput
    data: XOR<ScholarshipUpdateWithoutUserInput, ScholarshipUncheckedUpdateWithoutUserInput>
  }

  export type ScholarshipUpdateManyWithWhereWithoutUserInput = {
    where: ScholarshipScalarWhereInput
    data: XOR<ScholarshipUpdateManyMutationInput, ScholarshipUncheckedUpdateManyWithoutUserInput>
  }

  export type ScholarshipScalarWhereInput = {
    AND?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
    OR?: ScholarshipScalarWhereInput[]
    NOT?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
    id?: UuidFilter<"Scholarship"> | string
    userId?: UuidFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    requestedCents?: IntFilter<"Scholarship"> | number
    approvedCents?: IntNullableFilter<"Scholarship"> | number | null
    note?: StringNullableFilter<"Scholarship"> | string | null
    createdAt?: DateTimeFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeFilter<"Scholarship"> | Date | string
  }

  export type DonationUpsertWithWhereUniqueWithoutUserInput = {
    where: DonationWhereUniqueInput
    update: XOR<DonationUpdateWithoutUserInput, DonationUncheckedUpdateWithoutUserInput>
    create: XOR<DonationCreateWithoutUserInput, DonationUncheckedCreateWithoutUserInput>
  }

  export type DonationUpdateWithWhereUniqueWithoutUserInput = {
    where: DonationWhereUniqueInput
    data: XOR<DonationUpdateWithoutUserInput, DonationUncheckedUpdateWithoutUserInput>
  }

  export type DonationUpdateManyWithWhereWithoutUserInput = {
    where: DonationScalarWhereInput
    data: XOR<DonationUpdateManyMutationInput, DonationUncheckedUpdateManyWithoutUserInput>
  }

  export type DonationScalarWhereInput = {
    AND?: DonationScalarWhereInput | DonationScalarWhereInput[]
    OR?: DonationScalarWhereInput[]
    NOT?: DonationScalarWhereInput | DonationScalarWhereInput[]
    id?: UuidFilter<"Donation"> | string
    userId?: UuidNullableFilter<"Donation"> | string | null
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    amountCents?: IntFilter<"Donation"> | number
    stripePaymentId?: StringNullableFilter<"Donation"> | string | null
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
  }

  export type MfaBackupCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    update: XOR<MfaBackupCodeUpdateWithoutUserInput, MfaBackupCodeUncheckedUpdateWithoutUserInput>
    create: XOR<MfaBackupCodeCreateWithoutUserInput, MfaBackupCodeUncheckedCreateWithoutUserInput>
  }

  export type MfaBackupCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: MfaBackupCodeWhereUniqueInput
    data: XOR<MfaBackupCodeUpdateWithoutUserInput, MfaBackupCodeUncheckedUpdateWithoutUserInput>
  }

  export type MfaBackupCodeUpdateManyWithWhereWithoutUserInput = {
    where: MfaBackupCodeScalarWhereInput
    data: XOR<MfaBackupCodeUpdateManyMutationInput, MfaBackupCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type MfaBackupCodeScalarWhereInput = {
    AND?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
    OR?: MfaBackupCodeScalarWhereInput[]
    NOT?: MfaBackupCodeScalarWhereInput | MfaBackupCodeScalarWhereInput[]
    id?: StringFilter<"MfaBackupCode"> | string
    userId?: UuidFilter<"MfaBackupCode"> | string
    codeHash?: StringFilter<"MfaBackupCode"> | string
    usedAt?: DateTimeNullableFilter<"MfaBackupCode"> | Date | string | null
    createdAt?: DateTimeFilter<"MfaBackupCode"> | Date | string
  }

  export type UserCreateWithoutMfaBackupCodesInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMfaBackupCodesInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMfaBackupCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
  }

  export type UserUpsertWithoutMfaBackupCodesInput = {
    update: XOR<UserUpdateWithoutMfaBackupCodesInput, UserUncheckedUpdateWithoutMfaBackupCodesInput>
    create: XOR<UserCreateWithoutMfaBackupCodesInput, UserUncheckedCreateWithoutMfaBackupCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMfaBackupCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMfaBackupCodesInput, UserUncheckedUpdateWithoutMfaBackupCodesInput>
  }

  export type UserUpdateWithoutMfaBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMfaBackupCodesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionCreateWithoutServiceInput = {
    id?: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    package?: PackageCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutServiceInput = {
    id?: string
    userId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutServiceInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput>
  }

  export type SessionCreateManyServiceInputEnvelope = {
    data: SessionCreateManyServiceInput | SessionCreateManyServiceInput[]
    skipDuplicates?: boolean
  }

  export type PackageCreateWithoutServiceInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPackagesInput
    sessions?: SessionCreateNestedManyWithoutPackageInput
  }

  export type PackageUncheckedCreateWithoutServiceInput = {
    id?: string
    userId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutPackageInput
  }

  export type PackageCreateOrConnectWithoutServiceInput = {
    where: PackageWhereUniqueInput
    create: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput>
  }

  export type PackageCreateManyServiceInputEnvelope = {
    data: PackageCreateManyServiceInput | PackageCreateManyServiceInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutServiceInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutServiceInput, SessionUncheckedUpdateWithoutServiceInput>
    create: XOR<SessionCreateWithoutServiceInput, SessionUncheckedCreateWithoutServiceInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutServiceInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutServiceInput, SessionUncheckedUpdateWithoutServiceInput>
  }

  export type SessionUpdateManyWithWhereWithoutServiceInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutServiceInput>
  }

  export type PackageUpsertWithWhereUniqueWithoutServiceInput = {
    where: PackageWhereUniqueInput
    update: XOR<PackageUpdateWithoutServiceInput, PackageUncheckedUpdateWithoutServiceInput>
    create: XOR<PackageCreateWithoutServiceInput, PackageUncheckedCreateWithoutServiceInput>
  }

  export type PackageUpdateWithWhereUniqueWithoutServiceInput = {
    where: PackageWhereUniqueInput
    data: XOR<PackageUpdateWithoutServiceInput, PackageUncheckedUpdateWithoutServiceInput>
  }

  export type PackageUpdateManyWithWhereWithoutServiceInput = {
    where: PackageScalarWhereInput
    data: XOR<PackageUpdateManyMutationInput, PackageUncheckedUpdateManyWithoutServiceInput>
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type ServiceCreateWithoutSessionsInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateWithoutSessionsInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutSessionsInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutSessionsInput, ServiceUncheckedCreateWithoutSessionsInput>
  }

  export type PackageCreateWithoutSessionsInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPackagesInput
    service: ServiceCreateNestedOneWithoutPackagesInput
  }

  export type PackageUncheckedCreateWithoutSessionsInput = {
    id?: string
    userId: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageCreateOrConnectWithoutSessionsInput = {
    where: PackageWhereUniqueInput
    create: XOR<PackageCreateWithoutSessionsInput, PackageUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ServiceUpsertWithoutSessionsInput = {
    update: XOR<ServiceUpdateWithoutSessionsInput, ServiceUncheckedUpdateWithoutSessionsInput>
    create: XOR<ServiceCreateWithoutSessionsInput, ServiceUncheckedCreateWithoutSessionsInput>
    where?: ServiceWhereInput
  }

  export type ServiceUpdateToOneWithWhereWithoutSessionsInput = {
    where?: ServiceWhereInput
    data: XOR<ServiceUpdateWithoutSessionsInput, ServiceUncheckedUpdateWithoutSessionsInput>
  }

  export type ServiceUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type PackageUpsertWithoutSessionsInput = {
    update: XOR<PackageUpdateWithoutSessionsInput, PackageUncheckedUpdateWithoutSessionsInput>
    create: XOR<PackageCreateWithoutSessionsInput, PackageUncheckedCreateWithoutSessionsInput>
    where?: PackageWhereInput
  }

  export type PackageUpdateToOneWithWhereWithoutSessionsInput = {
    where?: PackageWhereInput
    data: XOR<PackageUpdateWithoutSessionsInput, PackageUncheckedUpdateWithoutSessionsInput>
  }

  export type PackageUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPackagesNestedInput
    service?: ServiceUpdateOneRequiredWithoutPackagesNestedInput
  }

  export type PackageUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutPackagesInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPackagesInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPackagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPackagesInput, UserUncheckedCreateWithoutPackagesInput>
  }

  export type ServiceCreateWithoutPackagesInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateWithoutPackagesInput = {
    id?: string
    slug: string
    name: string
    category: $Enums.ServiceCategory
    priceCents: number
    scholarshipMinCents: number
    scholarshipMaxCents: number
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutPackagesInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutPackagesInput, ServiceUncheckedCreateWithoutPackagesInput>
  }

  export type SessionCreateWithoutPackageInput = {
    id?: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    service: ServiceCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutPackageInput = {
    id?: string
    userId: string
    serviceId: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutPackageInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput>
  }

  export type SessionCreateManyPackageInputEnvelope = {
    data: SessionCreateManyPackageInput | SessionCreateManyPackageInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPackagesInput = {
    update: XOR<UserUpdateWithoutPackagesInput, UserUncheckedUpdateWithoutPackagesInput>
    create: XOR<UserCreateWithoutPackagesInput, UserUncheckedCreateWithoutPackagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPackagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPackagesInput, UserUncheckedUpdateWithoutPackagesInput>
  }

  export type UserUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ServiceUpsertWithoutPackagesInput = {
    update: XOR<ServiceUpdateWithoutPackagesInput, ServiceUncheckedUpdateWithoutPackagesInput>
    create: XOR<ServiceCreateWithoutPackagesInput, ServiceUncheckedCreateWithoutPackagesInput>
    where?: ServiceWhereInput
  }

  export type ServiceUpdateToOneWithWhereWithoutPackagesInput = {
    where?: ServiceWhereInput
    data: XOR<ServiceUpdateWithoutPackagesInput, ServiceUncheckedUpdateWithoutPackagesInput>
  }

  export type ServiceUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    priceCents?: IntFieldUpdateOperationsInput | number
    scholarshipMinCents?: IntFieldUpdateOperationsInput | number
    scholarshipMaxCents?: IntFieldUpdateOperationsInput | number
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type SessionUpsertWithWhereUniqueWithoutPackageInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutPackageInput, SessionUncheckedUpdateWithoutPackageInput>
    create: XOR<SessionCreateWithoutPackageInput, SessionUncheckedCreateWithoutPackageInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutPackageInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutPackageInput, SessionUncheckedUpdateWithoutPackageInput>
  }

  export type SessionUpdateManyWithWhereWithoutPackageInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutPackageInput>
  }

  export type UserCreateWithoutScholarshipsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutScholarshipsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutScholarshipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
  }

  export type UserUpsertWithoutScholarshipsInput = {
    update: XOR<UserUpdateWithoutScholarshipsInput, UserUncheckedUpdateWithoutScholarshipsInput>
    create: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutScholarshipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutScholarshipsInput, UserUncheckedUpdateWithoutScholarshipsInput>
  }

  export type UserUpdateWithoutScholarshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutScholarshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDonationsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDonationsInput = {
    id?: string
    firebaseUid: string
    email: string
    role?: $Enums.UserRole
    deletedAt?: Date | string | null
    suspendedAt?: Date | string | null
    suspendedBy?: string | null
    suspensionReason?: string | null
    mfaEnabled?: boolean
    mfaSecretEnc?: string | null
    mfaSecretIv?: string | null
    mfaSecretTag?: string | null
    mfaEnrolledAt?: Date | string | null
    lastMfaVerifiedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    mfaBackupCodes?: MfaBackupCodeUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDonationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDonationsInput, UserUncheckedCreateWithoutDonationsInput>
  }

  export type UserUpsertWithoutDonationsInput = {
    update: XOR<UserUpdateWithoutDonationsInput, UserUncheckedUpdateWithoutDonationsInput>
    create: XOR<UserCreateWithoutDonationsInput, UserUncheckedCreateWithoutDonationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDonationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDonationsInput, UserUncheckedUpdateWithoutDonationsInput>
  }

  export type UserUpdateWithoutDonationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDonationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedBy?: NullableStringFieldUpdateOperationsInput | string | null
    suspensionReason?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnabled?: BoolFieldUpdateOperationsInput | boolean
    mfaSecretEnc?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretIv?: NullableStringFieldUpdateOperationsInput | string | null
    mfaSecretTag?: NullableStringFieldUpdateOperationsInput | string | null
    mfaEnrolledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMfaVerifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    mfaBackupCodes?: MfaBackupCodeUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    serviceId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageCreateManyUserInput = {
    id?: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipCreateManyUserInput = {
    id?: string
    status?: $Enums.ScholarshipStatus
    requestedCents: number
    approvedCents?: number | null
    note?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationCreateManyUserInput = {
    id?: string
    tier: $Enums.DonationTier
    amountCents: number
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MfaBackupCodeCreateManyUserInput = {
    id?: string
    codeHash: string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    service?: ServiceUpdateOneRequiredWithoutSessionsNestedInput
    package?: PackageUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    service?: ServiceUpdateOneRequiredWithoutPackagesNestedInput
    sessions?: SessionUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    requestedCents?: IntFieldUpdateOperationsInput | number
    approvedCents?: NullableIntFieldUpdateOperationsInput | number | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    amountCents?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MfaBackupCodeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyServiceInput = {
    id?: string
    userId: string
    packageId?: string | null
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageCreateManyServiceInput = {
    id?: string
    userId: string
    totalSessions: number
    usedSessions?: number
    stripePaymentId?: string | null
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    package?: PackageUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPackagesNestedInput
    sessions?: SessionUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyPackageInput = {
    id?: string
    userId: string
    serviceId: string
    status?: $Enums.SessionStatus
    startsAt: Date | string
    endsAt: Date | string
    sessionTokenRef?: string | null
    stripePaymentId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    service?: ServiceUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    startsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endsAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}