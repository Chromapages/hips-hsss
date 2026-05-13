
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
 * Model StripeEvent
 * 
 */
export type StripeEvent = $Result.DefaultSelection<Prisma.$StripeEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  PARTICIPANT: 'PARTICIPANT',
  LEADER: 'LEADER',
  ORG_BUYER: 'ORG_BUYER',
  FACILITATOR: 'FACILITATOR',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const ServiceCategory: {
  CARE_SESSION: 'CARE_SESSION',
  COACHING: 'COACHING',
  COHORT: 'COHORT',
  WORKSHOP: 'WORKSHOP',
  RETREAT: 'RETREAT',
  DIGITAL: 'DIGITAL',
  MEMBERSHIP: 'MEMBERSHIP'
};

export type ServiceCategory = (typeof ServiceCategory)[keyof typeof ServiceCategory]


export const SessionStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const PackageStatus: {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CONSUMED: 'CONSUMED'
};

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus]


export const ScholarshipStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  EXPIRED: 'EXPIRED',
  WAITLISTED: 'WAITLISTED'
};

export type ScholarshipStatus = (typeof ScholarshipStatus)[keyof typeof ScholarshipStatus]


export const DonationTier: {
  SPONSOR_SESSION: 'SPONSOR_SESSION',
  RESTORE_SESSION: 'RESTORE_SESSION',
  RESTORE_LEADER: 'RESTORE_LEADER',
  CUSTOM: 'CUSTOM'
};

export type DonationTier = (typeof DonationTier)[keyof typeof DonationTier]


export const InquiryStatus: {
  NEW: 'NEW',
  QUOTED: 'QUOTED',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type ServiceCategory = $Enums.ServiceCategory

export const ServiceCategory: typeof $Enums.ServiceCategory

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type PackageStatus = $Enums.PackageStatus

export const PackageStatus: typeof $Enums.PackageStatus

export type ScholarshipStatus = $Enums.ScholarshipStatus

export const ScholarshipStatus: typeof $Enums.ScholarshipStatus

export type DonationTier = $Enums.DonationTier

export const DonationTier: typeof $Enums.DonationTier

export type InquiryStatus = $Enums.InquiryStatus

export const InquiryStatus: typeof $Enums.InquiryStatus

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
   * `prisma.stripeEvent`: Exposes CRUD operations for the **StripeEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StripeEvents
    * const stripeEvents = await prisma.stripeEvent.findMany()
    * ```
    */
  get stripeEvent(): Prisma.StripeEventDelegate<ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
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
    Service: 'Service',
    Session: 'Session',
    Package: 'Package',
    Scholarship: 'Scholarship',
    Donation: 'Donation',
    OrgInquiry: 'OrgInquiry',
    StripeEvent: 'StripeEvent'
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
      modelProps: "user" | "service" | "session" | "package" | "scholarship" | "donation" | "orgInquiry" | "stripeEvent"
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
      StripeEvent: {
        payload: Prisma.$StripeEventPayload<ExtArgs>
        fields: Prisma.StripeEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StripeEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StripeEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          findFirst: {
            args: Prisma.StripeEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StripeEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          findMany: {
            args: Prisma.StripeEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>[]
          }
          create: {
            args: Prisma.StripeEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          createMany: {
            args: Prisma.StripeEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StripeEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>[]
          }
          delete: {
            args: Prisma.StripeEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          update: {
            args: Prisma.StripeEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          deleteMany: {
            args: Prisma.StripeEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StripeEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StripeEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StripeEventPayload>
          }
          aggregate: {
            args: Prisma.StripeEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStripeEvent>
          }
          groupBy: {
            args: Prisma.StripeEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<StripeEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.StripeEventCountArgs<ExtArgs>
            result: $Utils.Optional<StripeEventCountAggregateOutputType> | number
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
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    packages?: boolean | UserCountOutputTypeCountPackagesArgs
    scholarships?: boolean | UserCountOutputTypeCountScholarshipsArgs
    donations?: boolean | UserCountOutputTypeCountDonationsArgs
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
   * Count Type ServiceCountOutputType
   */

  export type ServiceCountOutputType = {
    sessions: number
    packages: number
    scholarships: number
  }

  export type ServiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | ServiceCountOutputTypeCountSessionsArgs
    packages?: boolean | ServiceCountOutputTypeCountPackagesArgs
    scholarships?: boolean | ServiceCountOutputTypeCountScholarshipsArgs
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
   * ServiceCountOutputType without action
   */
  export type ServiceCountOutputTypeCountScholarshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScholarshipWhereInput
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
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    firebaseUid: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    firebaseUid: number
    role: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    firebaseUid?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    firebaseUid?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    firebaseUid?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
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
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
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
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    packages?: boolean | User$packagesArgs<ExtArgs>
    scholarships?: boolean | User$scholarshipsArgs<ExtArgs>
    donations?: boolean | User$donationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    firebaseUid?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    firebaseUid?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    packages?: boolean | User$packagesArgs<ExtArgs>
    scholarships?: boolean | User$scholarshipsArgs<ExtArgs>
    donations?: boolean | User$donationsArgs<ExtArgs>
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
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      firebaseUid: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
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
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
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
    standardPrice: Decimal | null
    scholarshipMin: Decimal | null
    scholarshipMax: Decimal | null
    durationMins: number | null
    maxSeats: number | null
  }

  export type ServiceSumAggregateOutputType = {
    standardPrice: Decimal | null
    scholarshipMin: Decimal | null
    scholarshipMax: Decimal | null
    durationMins: number | null
    maxSeats: number | null
  }

  export type ServiceMinAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    category: $Enums.ServiceCategory | null
    standardPrice: Decimal | null
    scholarshipMin: Decimal | null
    scholarshipMax: Decimal | null
    durationMins: number | null
    maxSeats: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServiceMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    name: string | null
    description: string | null
    category: $Enums.ServiceCategory | null
    standardPrice: Decimal | null
    scholarshipMin: Decimal | null
    scholarshipMax: Decimal | null
    durationMins: number | null
    maxSeats: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServiceCountAggregateOutputType = {
    id: number
    slug: number
    name: number
    description: number
    category: number
    standardPrice: number
    scholarshipMin: number
    scholarshipMax: number
    durationMins: number
    maxSeats: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServiceAvgAggregateInputType = {
    standardPrice?: true
    scholarshipMin?: true
    scholarshipMax?: true
    durationMins?: true
    maxSeats?: true
  }

  export type ServiceSumAggregateInputType = {
    standardPrice?: true
    scholarshipMin?: true
    scholarshipMax?: true
    durationMins?: true
    maxSeats?: true
  }

  export type ServiceMinAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    standardPrice?: true
    scholarshipMin?: true
    scholarshipMax?: true
    durationMins?: true
    maxSeats?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServiceMaxAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    standardPrice?: true
    scholarshipMin?: true
    scholarshipMax?: true
    durationMins?: true
    maxSeats?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServiceCountAggregateInputType = {
    id?: true
    slug?: true
    name?: true
    description?: true
    category?: true
    standardPrice?: true
    scholarshipMin?: true
    scholarshipMax?: true
    durationMins?: true
    maxSeats?: true
    isActive?: true
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
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal
    scholarshipMin: Decimal
    scholarshipMax: Decimal
    durationMins: number | null
    maxSeats: number | null
    isActive: boolean
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
    description?: boolean
    category?: boolean
    standardPrice?: boolean
    scholarshipMin?: boolean
    scholarshipMax?: boolean
    durationMins?: boolean
    maxSeats?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | Service$sessionsArgs<ExtArgs>
    packages?: boolean | Service$packagesArgs<ExtArgs>
    scholarships?: boolean | Service$scholarshipsArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    standardPrice?: boolean
    scholarshipMin?: boolean
    scholarshipMax?: boolean
    durationMins?: boolean
    maxSeats?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["service"]>

  export type ServiceSelectScalar = {
    id?: boolean
    slug?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    standardPrice?: boolean
    scholarshipMin?: boolean
    scholarshipMax?: boolean
    durationMins?: boolean
    maxSeats?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | Service$sessionsArgs<ExtArgs>
    packages?: boolean | Service$packagesArgs<ExtArgs>
    scholarships?: boolean | Service$scholarshipsArgs<ExtArgs>
    _count?: boolean | ServiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ServiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ServicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Service"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      packages: Prisma.$PackagePayload<ExtArgs>[]
      scholarships: Prisma.$ScholarshipPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      name: string
      description: string
      category: $Enums.ServiceCategory
      standardPrice: Prisma.Decimal
      scholarshipMin: Prisma.Decimal
      scholarshipMax: Prisma.Decimal
      durationMins: number | null
      maxSeats: number | null
      isActive: boolean
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
    scholarships<T extends Service$scholarshipsArgs<ExtArgs> = {}>(args?: Subset<T, Service$scholarshipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScholarshipPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly description: FieldRef<"Service", 'String'>
    readonly category: FieldRef<"Service", 'ServiceCategory'>
    readonly standardPrice: FieldRef<"Service", 'Decimal'>
    readonly scholarshipMin: FieldRef<"Service", 'Decimal'>
    readonly scholarshipMax: FieldRef<"Service", 'Decimal'>
    readonly durationMins: FieldRef<"Service", 'Int'>
    readonly maxSeats: FieldRef<"Service", 'Int'>
    readonly isActive: FieldRef<"Service", 'Boolean'>
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
   * Service.scholarships
   */
  export type Service$scholarshipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    pricePaid: Decimal | null
  }

  export type SessionSumAggregateOutputType = {
    pricePaid: Decimal | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    facilitatorId: string | null
    scheduledAt: Date | null
    status: $Enums.SessionStatus | null
    pricePaid: Decimal | null
    isScholarship: boolean | null
    scholarshipCode: string | null
    stripePaymentId: string | null
    packageId: string | null
    sessionTokenRef: string | null
    cancelReason: string | null
    completedAt: Date | null
    confirmationEmailSent: boolean | null
    balanceDueDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    facilitatorId: string | null
    scheduledAt: Date | null
    status: $Enums.SessionStatus | null
    pricePaid: Decimal | null
    isScholarship: boolean | null
    scholarshipCode: string | null
    stripePaymentId: string | null
    packageId: string | null
    sessionTokenRef: string | null
    cancelReason: string | null
    completedAt: Date | null
    confirmationEmailSent: boolean | null
    balanceDueDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    userId: number
    serviceId: number
    facilitatorId: number
    scheduledAt: number
    status: number
    pricePaid: number
    isScholarship: number
    scholarshipCode: number
    stripePaymentId: number
    packageId: number
    sessionTokenRef: number
    cancelReason: number
    completedAt: number
    confirmationEmailSent: number
    balanceDueDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    pricePaid?: true
  }

  export type SessionSumAggregateInputType = {
    pricePaid?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    facilitatorId?: true
    scheduledAt?: true
    status?: true
    pricePaid?: true
    isScholarship?: true
    scholarshipCode?: true
    stripePaymentId?: true
    packageId?: true
    sessionTokenRef?: true
    cancelReason?: true
    completedAt?: true
    confirmationEmailSent?: true
    balanceDueDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    facilitatorId?: true
    scheduledAt?: true
    status?: true
    pricePaid?: true
    isScholarship?: true
    scholarshipCode?: true
    stripePaymentId?: true
    packageId?: true
    sessionTokenRef?: true
    cancelReason?: true
    completedAt?: true
    confirmationEmailSent?: true
    balanceDueDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    facilitatorId?: true
    scheduledAt?: true
    status?: true
    pricePaid?: true
    isScholarship?: true
    scholarshipCode?: true
    stripePaymentId?: true
    packageId?: true
    sessionTokenRef?: true
    cancelReason?: true
    completedAt?: true
    confirmationEmailSent?: true
    balanceDueDate?: true
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
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
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
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    userId: string
    serviceId: string
    facilitatorId: string | null
    scheduledAt: Date
    status: $Enums.SessionStatus
    pricePaid: Decimal
    isScholarship: boolean
    scholarshipCode: string | null
    stripePaymentId: string | null
    packageId: string | null
    sessionTokenRef: string | null
    cancelReason: string | null
    completedAt: Date | null
    confirmationEmailSent: boolean
    balanceDueDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
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
    facilitatorId?: boolean
    scheduledAt?: boolean
    status?: boolean
    pricePaid?: boolean
    isScholarship?: boolean
    scholarshipCode?: boolean
    stripePaymentId?: boolean
    packageId?: boolean
    sessionTokenRef?: boolean
    cancelReason?: boolean
    completedAt?: boolean
    confirmationEmailSent?: boolean
    balanceDueDate?: boolean
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
    facilitatorId?: boolean
    scheduledAt?: boolean
    status?: boolean
    pricePaid?: boolean
    isScholarship?: boolean
    scholarshipCode?: boolean
    stripePaymentId?: boolean
    packageId?: boolean
    sessionTokenRef?: boolean
    cancelReason?: boolean
    completedAt?: boolean
    confirmationEmailSent?: boolean
    balanceDueDate?: boolean
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
    facilitatorId?: boolean
    scheduledAt?: boolean
    status?: boolean
    pricePaid?: boolean
    isScholarship?: boolean
    scholarshipCode?: boolean
    stripePaymentId?: boolean
    packageId?: boolean
    sessionTokenRef?: boolean
    cancelReason?: boolean
    completedAt?: boolean
    confirmationEmailSent?: boolean
    balanceDueDate?: boolean
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
      facilitatorId: string | null
      scheduledAt: Date
      status: $Enums.SessionStatus
      pricePaid: Prisma.Decimal
      isScholarship: boolean
      scholarshipCode: string | null
      stripePaymentId: string | null
      packageId: string | null
      sessionTokenRef: string | null
      cancelReason: string | null
      completedAt: Date | null
      confirmationEmailSent: boolean
      balanceDueDate: Date | null
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
    readonly facilitatorId: FieldRef<"Session", 'String'>
    readonly scheduledAt: FieldRef<"Session", 'DateTime'>
    readonly status: FieldRef<"Session", 'SessionStatus'>
    readonly pricePaid: FieldRef<"Session", 'Decimal'>
    readonly isScholarship: FieldRef<"Session", 'Boolean'>
    readonly scholarshipCode: FieldRef<"Session", 'String'>
    readonly stripePaymentId: FieldRef<"Session", 'String'>
    readonly packageId: FieldRef<"Session", 'String'>
    readonly sessionTokenRef: FieldRef<"Session", 'String'>
    readonly cancelReason: FieldRef<"Session", 'String'>
    readonly completedAt: FieldRef<"Session", 'DateTime'>
    readonly confirmationEmailSent: FieldRef<"Session", 'Boolean'>
    readonly balanceDueDate: FieldRef<"Session", 'DateTime'>
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
    pricePaid: Decimal | null
  }

  export type PackageSumAggregateOutputType = {
    totalSessions: number | null
    usedSessions: number | null
    pricePaid: Decimal | null
  }

  export type PackageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    totalSessions: number | null
    usedSessions: number | null
    pricePaid: Decimal | null
    expiresAt: Date | null
    stripePaymentId: string | null
    status: $Enums.PackageStatus | null
    isScholarship: boolean | null
    discountCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    totalSessions: number | null
    usedSessions: number | null
    pricePaid: Decimal | null
    expiresAt: Date | null
    stripePaymentId: string | null
    status: $Enums.PackageStatus | null
    isScholarship: boolean | null
    discountCode: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PackageCountAggregateOutputType = {
    id: number
    userId: number
    serviceId: number
    totalSessions: number
    usedSessions: number
    pricePaid: number
    expiresAt: number
    stripePaymentId: number
    status: number
    isScholarship: number
    discountCode: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PackageAvgAggregateInputType = {
    totalSessions?: true
    usedSessions?: true
    pricePaid?: true
  }

  export type PackageSumAggregateInputType = {
    totalSessions?: true
    usedSessions?: true
    pricePaid?: true
  }

  export type PackageMinAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    pricePaid?: true
    expiresAt?: true
    stripePaymentId?: true
    status?: true
    isScholarship?: true
    discountCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageMaxAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    pricePaid?: true
    expiresAt?: true
    stripePaymentId?: true
    status?: true
    isScholarship?: true
    discountCode?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PackageCountAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    totalSessions?: true
    usedSessions?: true
    pricePaid?: true
    expiresAt?: true
    stripePaymentId?: true
    status?: true
    isScholarship?: true
    discountCode?: true
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
    pricePaid: Decimal
    expiresAt: Date
    stripePaymentId: string | null
    status: $Enums.PackageStatus
    isScholarship: boolean
    discountCode: string | null
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
    pricePaid?: boolean
    expiresAt?: boolean
    stripePaymentId?: boolean
    status?: boolean
    isScholarship?: boolean
    discountCode?: boolean
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
    pricePaid?: boolean
    expiresAt?: boolean
    stripePaymentId?: boolean
    status?: boolean
    isScholarship?: boolean
    discountCode?: boolean
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
    pricePaid?: boolean
    expiresAt?: boolean
    stripePaymentId?: boolean
    status?: boolean
    isScholarship?: boolean
    discountCode?: boolean
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
      pricePaid: Prisma.Decimal
      expiresAt: Date
      stripePaymentId: string | null
      status: $Enums.PackageStatus
      isScholarship: boolean
      discountCode: string | null
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
    readonly pricePaid: FieldRef<"Package", 'Decimal'>
    readonly expiresAt: FieldRef<"Package", 'DateTime'>
    readonly stripePaymentId: FieldRef<"Package", 'String'>
    readonly status: FieldRef<"Package", 'PackageStatus'>
    readonly isScholarship: FieldRef<"Package", 'Boolean'>
    readonly discountCode: FieldRef<"Package", 'String'>
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
    requestedAmount: Decimal | null
    approvedAmount: Decimal | null
  }

  export type ScholarshipSumAggregateOutputType = {
    requestedAmount: Decimal | null
    approvedAmount: Decimal | null
  }

  export type ScholarshipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    requestedAmount: Decimal | null
    approvedAmount: Decimal | null
    reason: string | null
    status: $Enums.ScholarshipStatus | null
    discountCode: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNote: string | null
    expiresAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScholarshipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    serviceId: string | null
    requestedAmount: Decimal | null
    approvedAmount: Decimal | null
    reason: string | null
    status: $Enums.ScholarshipStatus | null
    discountCode: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNote: string | null
    expiresAt: Date | null
    rejectionReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ScholarshipCountAggregateOutputType = {
    id: number
    userId: number
    serviceId: number
    requestedAmount: number
    approvedAmount: number
    reason: number
    status: number
    discountCode: number
    reviewedBy: number
    reviewedAt: number
    reviewNote: number
    expiresAt: number
    rejectionReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ScholarshipAvgAggregateInputType = {
    requestedAmount?: true
    approvedAmount?: true
  }

  export type ScholarshipSumAggregateInputType = {
    requestedAmount?: true
    approvedAmount?: true
  }

  export type ScholarshipMinAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    requestedAmount?: true
    approvedAmount?: true
    reason?: true
    status?: true
    discountCode?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNote?: true
    expiresAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScholarshipMaxAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    requestedAmount?: true
    approvedAmount?: true
    reason?: true
    status?: true
    discountCode?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNote?: true
    expiresAt?: true
    rejectionReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ScholarshipCountAggregateInputType = {
    id?: true
    userId?: true
    serviceId?: true
    requestedAmount?: true
    approvedAmount?: true
    reason?: true
    status?: true
    discountCode?: true
    reviewedBy?: true
    reviewedAt?: true
    reviewNote?: true
    expiresAt?: true
    rejectionReason?: true
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
    serviceId: string
    requestedAmount: Decimal
    approvedAmount: Decimal | null
    reason: string
    status: $Enums.ScholarshipStatus
    discountCode: string | null
    reviewedBy: string | null
    reviewedAt: Date | null
    reviewNote: string | null
    expiresAt: Date | null
    rejectionReason: string | null
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
    serviceId?: boolean
    requestedAmount?: boolean
    approvedAmount?: boolean
    reason?: boolean
    status?: boolean
    discountCode?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    expiresAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scholarship"]>

  export type ScholarshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    requestedAmount?: boolean
    approvedAmount?: boolean
    reason?: boolean
    status?: boolean
    discountCode?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    expiresAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scholarship"]>

  export type ScholarshipSelectScalar = {
    id?: boolean
    userId?: boolean
    serviceId?: boolean
    requestedAmount?: boolean
    approvedAmount?: boolean
    reason?: boolean
    status?: boolean
    discountCode?: boolean
    reviewedBy?: boolean
    reviewedAt?: boolean
    reviewNote?: boolean
    expiresAt?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ScholarshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }
  export type ScholarshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    service?: boolean | ServiceDefaultArgs<ExtArgs>
  }

  export type $ScholarshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Scholarship"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      service: Prisma.$ServicePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      serviceId: string
      requestedAmount: Prisma.Decimal
      approvedAmount: Prisma.Decimal | null
      reason: string
      status: $Enums.ScholarshipStatus
      discountCode: string | null
      reviewedBy: string | null
      reviewedAt: Date | null
      reviewNote: string | null
      expiresAt: Date | null
      rejectionReason: string | null
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
    service<T extends ServiceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ServiceDefaultArgs<ExtArgs>>): Prisma__ServiceClient<$Result.GetResult<Prisma.$ServicePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
    readonly serviceId: FieldRef<"Scholarship", 'String'>
    readonly requestedAmount: FieldRef<"Scholarship", 'Decimal'>
    readonly approvedAmount: FieldRef<"Scholarship", 'Decimal'>
    readonly reason: FieldRef<"Scholarship", 'String'>
    readonly status: FieldRef<"Scholarship", 'ScholarshipStatus'>
    readonly discountCode: FieldRef<"Scholarship", 'String'>
    readonly reviewedBy: FieldRef<"Scholarship", 'String'>
    readonly reviewedAt: FieldRef<"Scholarship", 'DateTime'>
    readonly reviewNote: FieldRef<"Scholarship", 'String'>
    readonly expiresAt: FieldRef<"Scholarship", 'DateTime'>
    readonly rejectionReason: FieldRef<"Scholarship", 'String'>
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
    amount: Decimal | null
  }

  export type DonationSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type DonationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    donorVaultRef: string | null
    amount: Decimal | null
    tier: $Enums.DonationTier | null
    stripePaymentId: string | null
    receiptSent: boolean | null
    receiptSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DonationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    donorVaultRef: string | null
    amount: Decimal | null
    tier: $Enums.DonationTier | null
    stripePaymentId: string | null
    receiptSent: boolean | null
    receiptSentAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DonationCountAggregateOutputType = {
    id: number
    userId: number
    donorVaultRef: number
    amount: number
    tier: number
    stripePaymentId: number
    receiptSent: number
    receiptSentAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DonationAvgAggregateInputType = {
    amount?: true
  }

  export type DonationSumAggregateInputType = {
    amount?: true
  }

  export type DonationMinAggregateInputType = {
    id?: true
    userId?: true
    donorVaultRef?: true
    amount?: true
    tier?: true
    stripePaymentId?: true
    receiptSent?: true
    receiptSentAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DonationMaxAggregateInputType = {
    id?: true
    userId?: true
    donorVaultRef?: true
    amount?: true
    tier?: true
    stripePaymentId?: true
    receiptSent?: true
    receiptSentAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DonationCountAggregateInputType = {
    id?: true
    userId?: true
    donorVaultRef?: true
    amount?: true
    tier?: true
    stripePaymentId?: true
    receiptSent?: true
    receiptSentAt?: true
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
    donorVaultRef: string | null
    amount: Decimal
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent: boolean
    receiptSentAt: Date | null
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
    donorVaultRef?: boolean
    amount?: boolean
    tier?: boolean
    stripePaymentId?: boolean
    receiptSent?: boolean
    receiptSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Donation$userArgs<ExtArgs>
  }, ExtArgs["result"]["donation"]>

  export type DonationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    donorVaultRef?: boolean
    amount?: boolean
    tier?: boolean
    stripePaymentId?: boolean
    receiptSent?: boolean
    receiptSentAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Donation$userArgs<ExtArgs>
  }, ExtArgs["result"]["donation"]>

  export type DonationSelectScalar = {
    id?: boolean
    userId?: boolean
    donorVaultRef?: boolean
    amount?: boolean
    tier?: boolean
    stripePaymentId?: boolean
    receiptSent?: boolean
    receiptSentAt?: boolean
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
      donorVaultRef: string | null
      amount: Prisma.Decimal
      tier: $Enums.DonationTier
      stripePaymentId: string
      receiptSent: boolean
      receiptSentAt: Date | null
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
    readonly donorVaultRef: FieldRef<"Donation", 'String'>
    readonly amount: FieldRef<"Donation", 'Decimal'>
    readonly tier: FieldRef<"Donation", 'DonationTier'>
    readonly stripePaymentId: FieldRef<"Donation", 'String'>
    readonly receiptSent: FieldRef<"Donation", 'Boolean'>
    readonly receiptSentAt: FieldRef<"Donation", 'DateTime'>
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
    quoteAmount: Decimal | null
  }

  export type OrgInquirySumAggregateOutputType = {
    headcount: number | null
    quoteAmount: Decimal | null
  }

  export type OrgInquiryMinAggregateOutputType = {
    id: string | null
    orgName: string | null
    contactEmail: string | null
    contactName: string | null
    ein: string | null
    isNonprofit: boolean | null
    website: string | null
    eventType: string | null
    preferredDate: Date | null
    headcount: number | null
    message: string | null
    quoteAmount: Decimal | null
    status: $Enums.InquiryStatus | null
    notes: string | null
    stripeLinkId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgInquiryMaxAggregateOutputType = {
    id: string | null
    orgName: string | null
    contactEmail: string | null
    contactName: string | null
    ein: string | null
    isNonprofit: boolean | null
    website: string | null
    eventType: string | null
    preferredDate: Date | null
    headcount: number | null
    message: string | null
    quoteAmount: Decimal | null
    status: $Enums.InquiryStatus | null
    notes: string | null
    stripeLinkId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrgInquiryCountAggregateOutputType = {
    id: number
    orgName: number
    contactEmail: number
    contactName: number
    ein: number
    isNonprofit: number
    website: number
    eventType: number
    preferredDate: number
    headcount: number
    message: number
    quoteAmount: number
    status: number
    notes: number
    stripeLinkId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrgInquiryAvgAggregateInputType = {
    headcount?: true
    quoteAmount?: true
  }

  export type OrgInquirySumAggregateInputType = {
    headcount?: true
    quoteAmount?: true
  }

  export type OrgInquiryMinAggregateInputType = {
    id?: true
    orgName?: true
    contactEmail?: true
    contactName?: true
    ein?: true
    isNonprofit?: true
    website?: true
    eventType?: true
    preferredDate?: true
    headcount?: true
    message?: true
    quoteAmount?: true
    status?: true
    notes?: true
    stripeLinkId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgInquiryMaxAggregateInputType = {
    id?: true
    orgName?: true
    contactEmail?: true
    contactName?: true
    ein?: true
    isNonprofit?: true
    website?: true
    eventType?: true
    preferredDate?: true
    headcount?: true
    message?: true
    quoteAmount?: true
    status?: true
    notes?: true
    stripeLinkId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrgInquiryCountAggregateInputType = {
    id?: true
    orgName?: true
    contactEmail?: true
    contactName?: true
    ein?: true
    isNonprofit?: true
    website?: true
    eventType?: true
    preferredDate?: true
    headcount?: true
    message?: true
    quoteAmount?: true
    status?: true
    notes?: true
    stripeLinkId?: true
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
    contactEmail: string
    contactName: string | null
    ein: string | null
    isNonprofit: boolean
    website: string | null
    eventType: string
    preferredDate: Date | null
    headcount: number | null
    message: string | null
    quoteAmount: Decimal | null
    status: $Enums.InquiryStatus
    notes: string | null
    stripeLinkId: string | null
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
    contactEmail?: boolean
    contactName?: boolean
    ein?: boolean
    isNonprofit?: boolean
    website?: boolean
    eventType?: boolean
    preferredDate?: boolean
    headcount?: boolean
    message?: boolean
    quoteAmount?: boolean
    status?: boolean
    notes?: boolean
    stripeLinkId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orgInquiry"]>

  export type OrgInquirySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orgName?: boolean
    contactEmail?: boolean
    contactName?: boolean
    ein?: boolean
    isNonprofit?: boolean
    website?: boolean
    eventType?: boolean
    preferredDate?: boolean
    headcount?: boolean
    message?: boolean
    quoteAmount?: boolean
    status?: boolean
    notes?: boolean
    stripeLinkId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["orgInquiry"]>

  export type OrgInquirySelectScalar = {
    id?: boolean
    orgName?: boolean
    contactEmail?: boolean
    contactName?: boolean
    ein?: boolean
    isNonprofit?: boolean
    website?: boolean
    eventType?: boolean
    preferredDate?: boolean
    headcount?: boolean
    message?: boolean
    quoteAmount?: boolean
    status?: boolean
    notes?: boolean
    stripeLinkId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $OrgInquiryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrgInquiry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orgName: string
      contactEmail: string
      contactName: string | null
      ein: string | null
      isNonprofit: boolean
      website: string | null
      eventType: string
      preferredDate: Date | null
      headcount: number | null
      message: string | null
      quoteAmount: Prisma.Decimal | null
      status: $Enums.InquiryStatus
      notes: string | null
      stripeLinkId: string | null
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
    readonly contactEmail: FieldRef<"OrgInquiry", 'String'>
    readonly contactName: FieldRef<"OrgInquiry", 'String'>
    readonly ein: FieldRef<"OrgInquiry", 'String'>
    readonly isNonprofit: FieldRef<"OrgInquiry", 'Boolean'>
    readonly website: FieldRef<"OrgInquiry", 'String'>
    readonly eventType: FieldRef<"OrgInquiry", 'String'>
    readonly preferredDate: FieldRef<"OrgInquiry", 'DateTime'>
    readonly headcount: FieldRef<"OrgInquiry", 'Int'>
    readonly message: FieldRef<"OrgInquiry", 'String'>
    readonly quoteAmount: FieldRef<"OrgInquiry", 'Decimal'>
    readonly status: FieldRef<"OrgInquiry", 'InquiryStatus'>
    readonly notes: FieldRef<"OrgInquiry", 'String'>
    readonly stripeLinkId: FieldRef<"OrgInquiry", 'String'>
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
   * Model StripeEvent
   */

  export type AggregateStripeEvent = {
    _count: StripeEventCountAggregateOutputType | null
    _min: StripeEventMinAggregateOutputType | null
    _max: StripeEventMaxAggregateOutputType | null
  }

  export type StripeEventMinAggregateOutputType = {
    id: string | null
    stripeEventId: string | null
    eventType: string | null
    processed: boolean | null
    processedAt: Date | null
    createdAt: Date | null
  }

  export type StripeEventMaxAggregateOutputType = {
    id: string | null
    stripeEventId: string | null
    eventType: string | null
    processed: boolean | null
    processedAt: Date | null
    createdAt: Date | null
  }

  export type StripeEventCountAggregateOutputType = {
    id: number
    stripeEventId: number
    eventType: number
    payload: number
    processed: number
    processedAt: number
    createdAt: number
    _all: number
  }


  export type StripeEventMinAggregateInputType = {
    id?: true
    stripeEventId?: true
    eventType?: true
    processed?: true
    processedAt?: true
    createdAt?: true
  }

  export type StripeEventMaxAggregateInputType = {
    id?: true
    stripeEventId?: true
    eventType?: true
    processed?: true
    processedAt?: true
    createdAt?: true
  }

  export type StripeEventCountAggregateInputType = {
    id?: true
    stripeEventId?: true
    eventType?: true
    payload?: true
    processed?: true
    processedAt?: true
    createdAt?: true
    _all?: true
  }

  export type StripeEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeEvent to aggregate.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StripeEvents
    **/
    _count?: true | StripeEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StripeEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StripeEventMaxAggregateInputType
  }

  export type GetStripeEventAggregateType<T extends StripeEventAggregateArgs> = {
        [P in keyof T & keyof AggregateStripeEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStripeEvent[P]>
      : GetScalarType<T[P], AggregateStripeEvent[P]>
  }




  export type StripeEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StripeEventWhereInput
    orderBy?: StripeEventOrderByWithAggregationInput | StripeEventOrderByWithAggregationInput[]
    by: StripeEventScalarFieldEnum[] | StripeEventScalarFieldEnum
    having?: StripeEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StripeEventCountAggregateInputType | true
    _min?: StripeEventMinAggregateInputType
    _max?: StripeEventMaxAggregateInputType
  }

  export type StripeEventGroupByOutputType = {
    id: string
    stripeEventId: string
    eventType: string
    payload: JsonValue
    processed: boolean
    processedAt: Date | null
    createdAt: Date
    _count: StripeEventCountAggregateOutputType | null
    _min: StripeEventMinAggregateOutputType | null
    _max: StripeEventMaxAggregateOutputType | null
  }

  type GetStripeEventGroupByPayload<T extends StripeEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StripeEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StripeEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StripeEventGroupByOutputType[P]>
            : GetScalarType<T[P], StripeEventGroupByOutputType[P]>
        }
      >
    >


  export type StripeEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stripeEventId?: boolean
    eventType?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["stripeEvent"]>

  export type StripeEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stripeEventId?: boolean
    eventType?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["stripeEvent"]>

  export type StripeEventSelectScalar = {
    id?: boolean
    stripeEventId?: boolean
    eventType?: boolean
    payload?: boolean
    processed?: boolean
    processedAt?: boolean
    createdAt?: boolean
  }


  export type $StripeEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StripeEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      stripeEventId: string
      eventType: string
      payload: Prisma.JsonValue
      processed: boolean
      processedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["stripeEvent"]>
    composites: {}
  }

  type StripeEventGetPayload<S extends boolean | null | undefined | StripeEventDefaultArgs> = $Result.GetResult<Prisma.$StripeEventPayload, S>

  type StripeEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StripeEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StripeEventCountAggregateInputType | true
    }

  export interface StripeEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StripeEvent'], meta: { name: 'StripeEvent' } }
    /**
     * Find zero or one StripeEvent that matches the filter.
     * @param {StripeEventFindUniqueArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StripeEventFindUniqueArgs>(args: SelectSubset<T, StripeEventFindUniqueArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StripeEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StripeEventFindUniqueOrThrowArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StripeEventFindUniqueOrThrowArgs>(args: SelectSubset<T, StripeEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StripeEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindFirstArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StripeEventFindFirstArgs>(args?: SelectSubset<T, StripeEventFindFirstArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StripeEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindFirstOrThrowArgs} args - Arguments to find a StripeEvent
     * @example
     * // Get one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StripeEventFindFirstOrThrowArgs>(args?: SelectSubset<T, StripeEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StripeEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StripeEvents
     * const stripeEvents = await prisma.stripeEvent.findMany()
     * 
     * // Get first 10 StripeEvents
     * const stripeEvents = await prisma.stripeEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stripeEventWithIdOnly = await prisma.stripeEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StripeEventFindManyArgs>(args?: SelectSubset<T, StripeEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StripeEvent.
     * @param {StripeEventCreateArgs} args - Arguments to create a StripeEvent.
     * @example
     * // Create one StripeEvent
     * const StripeEvent = await prisma.stripeEvent.create({
     *   data: {
     *     // ... data to create a StripeEvent
     *   }
     * })
     * 
     */
    create<T extends StripeEventCreateArgs>(args: SelectSubset<T, StripeEventCreateArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StripeEvents.
     * @param {StripeEventCreateManyArgs} args - Arguments to create many StripeEvents.
     * @example
     * // Create many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StripeEventCreateManyArgs>(args?: SelectSubset<T, StripeEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StripeEvents and returns the data saved in the database.
     * @param {StripeEventCreateManyAndReturnArgs} args - Arguments to create many StripeEvents.
     * @example
     * // Create many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StripeEvents and only return the `id`
     * const stripeEventWithIdOnly = await prisma.stripeEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StripeEventCreateManyAndReturnArgs>(args?: SelectSubset<T, StripeEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StripeEvent.
     * @param {StripeEventDeleteArgs} args - Arguments to delete one StripeEvent.
     * @example
     * // Delete one StripeEvent
     * const StripeEvent = await prisma.stripeEvent.delete({
     *   where: {
     *     // ... filter to delete one StripeEvent
     *   }
     * })
     * 
     */
    delete<T extends StripeEventDeleteArgs>(args: SelectSubset<T, StripeEventDeleteArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StripeEvent.
     * @param {StripeEventUpdateArgs} args - Arguments to update one StripeEvent.
     * @example
     * // Update one StripeEvent
     * const stripeEvent = await prisma.stripeEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StripeEventUpdateArgs>(args: SelectSubset<T, StripeEventUpdateArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StripeEvents.
     * @param {StripeEventDeleteManyArgs} args - Arguments to filter StripeEvents to delete.
     * @example
     * // Delete a few StripeEvents
     * const { count } = await prisma.stripeEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StripeEventDeleteManyArgs>(args?: SelectSubset<T, StripeEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StripeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StripeEvents
     * const stripeEvent = await prisma.stripeEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StripeEventUpdateManyArgs>(args: SelectSubset<T, StripeEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StripeEvent.
     * @param {StripeEventUpsertArgs} args - Arguments to update or create a StripeEvent.
     * @example
     * // Update or create a StripeEvent
     * const stripeEvent = await prisma.stripeEvent.upsert({
     *   create: {
     *     // ... data to create a StripeEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StripeEvent we want to update
     *   }
     * })
     */
    upsert<T extends StripeEventUpsertArgs>(args: SelectSubset<T, StripeEventUpsertArgs<ExtArgs>>): Prisma__StripeEventClient<$Result.GetResult<Prisma.$StripeEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StripeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventCountArgs} args - Arguments to filter StripeEvents to count.
     * @example
     * // Count the number of StripeEvents
     * const count = await prisma.stripeEvent.count({
     *   where: {
     *     // ... the filter for the StripeEvents we want to count
     *   }
     * })
    **/
    count<T extends StripeEventCountArgs>(
      args?: Subset<T, StripeEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StripeEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StripeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StripeEventAggregateArgs>(args: Subset<T, StripeEventAggregateArgs>): Prisma.PrismaPromise<GetStripeEventAggregateType<T>>

    /**
     * Group by StripeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StripeEventGroupByArgs} args - Group by arguments.
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
      T extends StripeEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StripeEventGroupByArgs['orderBy'] }
        : { orderBy?: StripeEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, StripeEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStripeEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StripeEvent model
   */
  readonly fields: StripeEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StripeEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StripeEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the StripeEvent model
   */ 
  interface StripeEventFieldRefs {
    readonly id: FieldRef<"StripeEvent", 'String'>
    readonly stripeEventId: FieldRef<"StripeEvent", 'String'>
    readonly eventType: FieldRef<"StripeEvent", 'String'>
    readonly payload: FieldRef<"StripeEvent", 'Json'>
    readonly processed: FieldRef<"StripeEvent", 'Boolean'>
    readonly processedAt: FieldRef<"StripeEvent", 'DateTime'>
    readonly createdAt: FieldRef<"StripeEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StripeEvent findUnique
   */
  export type StripeEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent findUniqueOrThrow
   */
  export type StripeEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent findFirst
   */
  export type StripeEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeEvents.
     */
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent findFirstOrThrow
   */
  export type StripeEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvent to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StripeEvents.
     */
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent findMany
   */
  export type StripeEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter, which StripeEvents to fetch.
     */
    where?: StripeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StripeEvents to fetch.
     */
    orderBy?: StripeEventOrderByWithRelationInput | StripeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StripeEvents.
     */
    cursor?: StripeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StripeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StripeEvents.
     */
    skip?: number
    distinct?: StripeEventScalarFieldEnum | StripeEventScalarFieldEnum[]
  }

  /**
   * StripeEvent create
   */
  export type StripeEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The data needed to create a StripeEvent.
     */
    data: XOR<StripeEventCreateInput, StripeEventUncheckedCreateInput>
  }

  /**
   * StripeEvent createMany
   */
  export type StripeEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StripeEvents.
     */
    data: StripeEventCreateManyInput | StripeEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeEvent createManyAndReturn
   */
  export type StripeEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StripeEvents.
     */
    data: StripeEventCreateManyInput | StripeEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StripeEvent update
   */
  export type StripeEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The data needed to update a StripeEvent.
     */
    data: XOR<StripeEventUpdateInput, StripeEventUncheckedUpdateInput>
    /**
     * Choose, which StripeEvent to update.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent updateMany
   */
  export type StripeEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StripeEvents.
     */
    data: XOR<StripeEventUpdateManyMutationInput, StripeEventUncheckedUpdateManyInput>
    /**
     * Filter which StripeEvents to update
     */
    where?: StripeEventWhereInput
  }

  /**
   * StripeEvent upsert
   */
  export type StripeEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * The filter to search for the StripeEvent to update in case it exists.
     */
    where: StripeEventWhereUniqueInput
    /**
     * In case the StripeEvent found by the `where` argument doesn't exist, create a new StripeEvent with this data.
     */
    create: XOR<StripeEventCreateInput, StripeEventUncheckedCreateInput>
    /**
     * In case the StripeEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StripeEventUpdateInput, StripeEventUncheckedUpdateInput>
  }

  /**
   * StripeEvent delete
   */
  export type StripeEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
    /**
     * Filter which StripeEvent to delete.
     */
    where: StripeEventWhereUniqueInput
  }

  /**
   * StripeEvent deleteMany
   */
  export type StripeEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StripeEvents to delete
     */
    where?: StripeEventWhereInput
  }

  /**
   * StripeEvent without action
   */
  export type StripeEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StripeEvent
     */
    select?: StripeEventSelect<ExtArgs> | null
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
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ServiceScalarFieldEnum: {
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

  export type ServiceScalarFieldEnum = (typeof ServiceScalarFieldEnum)[keyof typeof ServiceScalarFieldEnum]


  export const SessionScalarFieldEnum: {
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

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const PackageScalarFieldEnum: {
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

  export type PackageScalarFieldEnum = (typeof PackageScalarFieldEnum)[keyof typeof PackageScalarFieldEnum]


  export const ScholarshipScalarFieldEnum: {
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

  export type ScholarshipScalarFieldEnum = (typeof ScholarshipScalarFieldEnum)[keyof typeof ScholarshipScalarFieldEnum]


  export const DonationScalarFieldEnum: {
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

  export type DonationScalarFieldEnum = (typeof DonationScalarFieldEnum)[keyof typeof DonationScalarFieldEnum]


  export const OrgInquiryScalarFieldEnum: {
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

  export type OrgInquiryScalarFieldEnum = (typeof OrgInquiryScalarFieldEnum)[keyof typeof OrgInquiryScalarFieldEnum]


  export const StripeEventScalarFieldEnum: {
    id: 'id',
    stripeEventId: 'stripeEventId',
    eventType: 'eventType',
    payload: 'payload',
    processed: 'processed',
    processedAt: 'processedAt',
    createdAt: 'createdAt'
  };

  export type StripeEventScalarFieldEnum = (typeof StripeEventScalarFieldEnum)[keyof typeof StripeEventScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ServiceCategory'
   */
  export type EnumServiceCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceCategory'>
    


  /**
   * Reference to a field of type 'ServiceCategory[]'
   */
  export type ListEnumServiceCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ServiceCategory[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'PackageStatus'
   */
  export type EnumPackageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PackageStatus'>
    


  /**
   * Reference to a field of type 'PackageStatus[]'
   */
  export type ListEnumPackageStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PackageStatus[]'>
    


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
    id?: StringFilter<"User"> | string
    firebaseUid?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
    donations?: DonationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    packages?: PackageOrderByRelationAggregateInput
    scholarships?: ScholarshipOrderByRelationAggregateInput
    donations?: DonationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    firebaseUid?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
    donations?: DonationListRelationFilter
  }, "id" | "firebaseUid">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    firebaseUid?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type ServiceWhereInput = {
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    id?: StringFilter<"Service"> | string
    slug?: StringFilter<"Service"> | string
    name?: StringFilter<"Service"> | string
    description?: StringFilter<"Service"> | string
    category?: EnumServiceCategoryFilter<"Service"> | $Enums.ServiceCategory
    standardPrice?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    durationMins?: IntNullableFilter<"Service"> | number | null
    maxSeats?: IntNullableFilter<"Service"> | number | null
    isActive?: BoolFilter<"Service"> | boolean
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
  }

  export type ServiceOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrderInput | SortOrder
    maxSeats?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    packages?: PackageOrderByRelationAggregateInput
    scholarships?: ScholarshipOrderByRelationAggregateInput
  }

  export type ServiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: ServiceWhereInput | ServiceWhereInput[]
    OR?: ServiceWhereInput[]
    NOT?: ServiceWhereInput | ServiceWhereInput[]
    name?: StringFilter<"Service"> | string
    description?: StringFilter<"Service"> | string
    category?: EnumServiceCategoryFilter<"Service"> | $Enums.ServiceCategory
    standardPrice?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFilter<"Service"> | Decimal | DecimalJsLike | number | string
    durationMins?: IntNullableFilter<"Service"> | number | null
    maxSeats?: IntNullableFilter<"Service"> | number | null
    isActive?: BoolFilter<"Service"> | boolean
    createdAt?: DateTimeFilter<"Service"> | Date | string
    updatedAt?: DateTimeFilter<"Service"> | Date | string
    sessions?: SessionListRelationFilter
    packages?: PackageListRelationFilter
    scholarships?: ScholarshipListRelationFilter
  }, "id" | "slug">

  export type ServiceOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrderInput | SortOrder
    maxSeats?: SortOrderInput | SortOrder
    isActive?: SortOrder
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
    id?: StringWithAggregatesFilter<"Service"> | string
    slug?: StringWithAggregatesFilter<"Service"> | string
    name?: StringWithAggregatesFilter<"Service"> | string
    description?: StringWithAggregatesFilter<"Service"> | string
    category?: EnumServiceCategoryWithAggregatesFilter<"Service"> | $Enums.ServiceCategory
    standardPrice?: DecimalWithAggregatesFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalWithAggregatesFilter<"Service"> | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalWithAggregatesFilter<"Service"> | Decimal | DecimalJsLike | number | string
    durationMins?: IntNullableWithAggregatesFilter<"Service"> | number | null
    maxSeats?: IntNullableWithAggregatesFilter<"Service"> | number | null
    isActive?: BoolWithAggregatesFilter<"Service"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Service"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    serviceId?: StringFilter<"Session"> | string
    facilitatorId?: StringNullableFilter<"Session"> | string | null
    scheduledAt?: DateTimeFilter<"Session"> | Date | string
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    pricePaid?: DecimalFilter<"Session"> | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFilter<"Session"> | boolean
    scholarshipCode?: StringNullableFilter<"Session"> | string | null
    stripePaymentId?: StringNullableFilter<"Session"> | string | null
    packageId?: StringNullableFilter<"Session"> | string | null
    sessionTokenRef?: StringNullableFilter<"Session"> | string | null
    cancelReason?: StringNullableFilter<"Session"> | string | null
    completedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    confirmationEmailSent?: BoolFilter<"Session"> | boolean
    balanceDueDate?: DateTimeNullableFilter<"Session"> | Date | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    package?: XOR<PackageNullableRelationFilter, PackageWhereInput> | null
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    facilitatorId?: SortOrderInput | SortOrder
    scheduledAt?: SortOrder
    status?: SortOrder
    pricePaid?: SortOrder
    isScholarship?: SortOrder
    scholarshipCode?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    packageId?: SortOrderInput | SortOrder
    sessionTokenRef?: SortOrderInput | SortOrder
    cancelReason?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    confirmationEmailSent?: SortOrder
    balanceDueDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    service?: ServiceOrderByWithRelationInput
    package?: PackageOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripePaymentId?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    serviceId?: StringFilter<"Session"> | string
    facilitatorId?: StringNullableFilter<"Session"> | string | null
    scheduledAt?: DateTimeFilter<"Session"> | Date | string
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    pricePaid?: DecimalFilter<"Session"> | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFilter<"Session"> | boolean
    scholarshipCode?: StringNullableFilter<"Session"> | string | null
    packageId?: StringNullableFilter<"Session"> | string | null
    sessionTokenRef?: StringNullableFilter<"Session"> | string | null
    cancelReason?: StringNullableFilter<"Session"> | string | null
    completedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    confirmationEmailSent?: BoolFilter<"Session"> | boolean
    balanceDueDate?: DateTimeNullableFilter<"Session"> | Date | string | null
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    package?: XOR<PackageNullableRelationFilter, PackageWhereInput> | null
  }, "id" | "stripePaymentId">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    facilitatorId?: SortOrderInput | SortOrder
    scheduledAt?: SortOrder
    status?: SortOrder
    pricePaid?: SortOrder
    isScholarship?: SortOrder
    scholarshipCode?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    packageId?: SortOrderInput | SortOrder
    sessionTokenRef?: SortOrderInput | SortOrder
    cancelReason?: SortOrderInput | SortOrder
    completedAt?: SortOrderInput | SortOrder
    confirmationEmailSent?: SortOrder
    balanceDueDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    serviceId?: StringWithAggregatesFilter<"Session"> | string
    facilitatorId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    scheduledAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    status?: EnumSessionStatusWithAggregatesFilter<"Session"> | $Enums.SessionStatus
    pricePaid?: DecimalWithAggregatesFilter<"Session"> | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolWithAggregatesFilter<"Session"> | boolean
    scholarshipCode?: StringNullableWithAggregatesFilter<"Session"> | string | null
    stripePaymentId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    packageId?: StringNullableWithAggregatesFilter<"Session"> | string | null
    sessionTokenRef?: StringNullableWithAggregatesFilter<"Session"> | string | null
    cancelReason?: StringNullableWithAggregatesFilter<"Session"> | string | null
    completedAt?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    confirmationEmailSent?: BoolWithAggregatesFilter<"Session"> | boolean
    balanceDueDate?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type PackageWhereInput = {
    AND?: PackageWhereInput | PackageWhereInput[]
    OR?: PackageWhereInput[]
    NOT?: PackageWhereInput | PackageWhereInput[]
    id?: StringFilter<"Package"> | string
    userId?: StringFilter<"Package"> | string
    serviceId?: StringFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    pricePaid?: DecimalFilter<"Package"> | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    stripePaymentId?: StringNullableFilter<"Package"> | string | null
    status?: EnumPackageStatusFilter<"Package"> | $Enums.PackageStatus
    isScholarship?: BoolFilter<"Package"> | boolean
    discountCode?: StringNullableFilter<"Package"> | string | null
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    sessions?: SessionListRelationFilter
  }

  export type PackageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
    expiresAt?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    status?: SortOrder
    isScholarship?: SortOrder
    discountCode?: SortOrderInput | SortOrder
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
    userId?: StringFilter<"Package"> | string
    serviceId?: StringFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    pricePaid?: DecimalFilter<"Package"> | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    status?: EnumPackageStatusFilter<"Package"> | $Enums.PackageStatus
    isScholarship?: BoolFilter<"Package"> | boolean
    discountCode?: StringNullableFilter<"Package"> | string | null
    createdAt?: DateTimeFilter<"Package"> | Date | string
    updatedAt?: DateTimeFilter<"Package"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
    sessions?: SessionListRelationFilter
  }, "id" | "stripePaymentId">

  export type PackageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
    expiresAt?: SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    status?: SortOrder
    isScholarship?: SortOrder
    discountCode?: SortOrderInput | SortOrder
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
    id?: StringWithAggregatesFilter<"Package"> | string
    userId?: StringWithAggregatesFilter<"Package"> | string
    serviceId?: StringWithAggregatesFilter<"Package"> | string
    totalSessions?: IntWithAggregatesFilter<"Package"> | number
    usedSessions?: IntWithAggregatesFilter<"Package"> | number
    pricePaid?: DecimalWithAggregatesFilter<"Package"> | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    stripePaymentId?: StringNullableWithAggregatesFilter<"Package"> | string | null
    status?: EnumPackageStatusWithAggregatesFilter<"Package"> | $Enums.PackageStatus
    isScholarship?: BoolWithAggregatesFilter<"Package"> | boolean
    discountCode?: StringNullableWithAggregatesFilter<"Package"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Package"> | Date | string
  }

  export type ScholarshipWhereInput = {
    AND?: ScholarshipWhereInput | ScholarshipWhereInput[]
    OR?: ScholarshipWhereInput[]
    NOT?: ScholarshipWhereInput | ScholarshipWhereInput[]
    id?: StringFilter<"Scholarship"> | string
    userId?: StringFilter<"Scholarship"> | string
    serviceId?: StringFilter<"Scholarship"> | string
    requestedAmount?: DecimalFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string
    approvedAmount?: DecimalNullableFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string | null
    reason?: StringFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    discountCode?: StringNullableFilter<"Scholarship"> | string | null
    reviewedBy?: StringNullableFilter<"Scholarship"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    reviewNote?: StringNullableFilter<"Scholarship"> | string | null
    expiresAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Scholarship"> | string | null
    createdAt?: DateTimeFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeFilter<"Scholarship"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
  }

  export type ScholarshipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    requestedAmount?: SortOrder
    approvedAmount?: SortOrderInput | SortOrder
    reason?: SortOrder
    status?: SortOrder
    discountCode?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNote?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    service?: ServiceOrderByWithRelationInput
  }

  export type ScholarshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    discountCode?: string
    AND?: ScholarshipWhereInput | ScholarshipWhereInput[]
    OR?: ScholarshipWhereInput[]
    NOT?: ScholarshipWhereInput | ScholarshipWhereInput[]
    userId?: StringFilter<"Scholarship"> | string
    serviceId?: StringFilter<"Scholarship"> | string
    requestedAmount?: DecimalFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string
    approvedAmount?: DecimalNullableFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string | null
    reason?: StringFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    reviewedBy?: StringNullableFilter<"Scholarship"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    reviewNote?: StringNullableFilter<"Scholarship"> | string | null
    expiresAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Scholarship"> | string | null
    createdAt?: DateTimeFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeFilter<"Scholarship"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    service?: XOR<ServiceRelationFilter, ServiceWhereInput>
  }, "id" | "discountCode">

  export type ScholarshipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    requestedAmount?: SortOrder
    approvedAmount?: SortOrderInput | SortOrder
    reason?: SortOrder
    status?: SortOrder
    discountCode?: SortOrderInput | SortOrder
    reviewedBy?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    reviewNote?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    rejectionReason?: SortOrderInput | SortOrder
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
    id?: StringWithAggregatesFilter<"Scholarship"> | string
    userId?: StringWithAggregatesFilter<"Scholarship"> | string
    serviceId?: StringWithAggregatesFilter<"Scholarship"> | string
    requestedAmount?: DecimalWithAggregatesFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string
    approvedAmount?: DecimalNullableWithAggregatesFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string | null
    reason?: StringWithAggregatesFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusWithAggregatesFilter<"Scholarship"> | $Enums.ScholarshipStatus
    discountCode?: StringNullableWithAggregatesFilter<"Scholarship"> | string | null
    reviewedBy?: StringNullableWithAggregatesFilter<"Scholarship"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"Scholarship"> | Date | string | null
    reviewNote?: StringNullableWithAggregatesFilter<"Scholarship"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Scholarship"> | Date | string | null
    rejectionReason?: StringNullableWithAggregatesFilter<"Scholarship"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Scholarship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Scholarship"> | Date | string
  }

  export type DonationWhereInput = {
    AND?: DonationWhereInput | DonationWhereInput[]
    OR?: DonationWhereInput[]
    NOT?: DonationWhereInput | DonationWhereInput[]
    id?: StringFilter<"Donation"> | string
    userId?: StringNullableFilter<"Donation"> | string | null
    donorVaultRef?: StringNullableFilter<"Donation"> | string | null
    amount?: DecimalFilter<"Donation"> | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    stripePaymentId?: StringFilter<"Donation"> | string
    receiptSent?: BoolFilter<"Donation"> | boolean
    receiptSentAt?: DateTimeNullableFilter<"Donation"> | Date | string | null
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type DonationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    donorVaultRef?: SortOrderInput | SortOrder
    amount?: SortOrder
    tier?: SortOrder
    stripePaymentId?: SortOrder
    receiptSent?: SortOrder
    receiptSentAt?: SortOrderInput | SortOrder
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
    userId?: StringNullableFilter<"Donation"> | string | null
    donorVaultRef?: StringNullableFilter<"Donation"> | string | null
    amount?: DecimalFilter<"Donation"> | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    receiptSent?: BoolFilter<"Donation"> | boolean
    receiptSentAt?: DateTimeNullableFilter<"Donation"> | Date | string | null
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "stripePaymentId">

  export type DonationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    donorVaultRef?: SortOrderInput | SortOrder
    amount?: SortOrder
    tier?: SortOrder
    stripePaymentId?: SortOrder
    receiptSent?: SortOrder
    receiptSentAt?: SortOrderInput | SortOrder
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
    id?: StringWithAggregatesFilter<"Donation"> | string
    userId?: StringNullableWithAggregatesFilter<"Donation"> | string | null
    donorVaultRef?: StringNullableWithAggregatesFilter<"Donation"> | string | null
    amount?: DecimalWithAggregatesFilter<"Donation"> | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierWithAggregatesFilter<"Donation"> | $Enums.DonationTier
    stripePaymentId?: StringWithAggregatesFilter<"Donation"> | string
    receiptSent?: BoolWithAggregatesFilter<"Donation"> | boolean
    receiptSentAt?: DateTimeNullableWithAggregatesFilter<"Donation"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Donation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Donation"> | Date | string
  }

  export type OrgInquiryWhereInput = {
    AND?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    OR?: OrgInquiryWhereInput[]
    NOT?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    id?: StringFilter<"OrgInquiry"> | string
    orgName?: StringFilter<"OrgInquiry"> | string
    contactEmail?: StringFilter<"OrgInquiry"> | string
    contactName?: StringNullableFilter<"OrgInquiry"> | string | null
    ein?: StringNullableFilter<"OrgInquiry"> | string | null
    isNonprofit?: BoolFilter<"OrgInquiry"> | boolean
    website?: StringNullableFilter<"OrgInquiry"> | string | null
    eventType?: StringFilter<"OrgInquiry"> | string
    preferredDate?: DateTimeNullableFilter<"OrgInquiry"> | Date | string | null
    headcount?: IntNullableFilter<"OrgInquiry"> | number | null
    message?: StringNullableFilter<"OrgInquiry"> | string | null
    quoteAmount?: DecimalNullableFilter<"OrgInquiry"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFilter<"OrgInquiry"> | $Enums.InquiryStatus
    notes?: StringNullableFilter<"OrgInquiry"> | string | null
    stripeLinkId?: StringNullableFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeFilter<"OrgInquiry"> | Date | string
  }

  export type OrgInquiryOrderByWithRelationInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrderInput | SortOrder
    ein?: SortOrderInput | SortOrder
    isNonprofit?: SortOrder
    website?: SortOrderInput | SortOrder
    eventType?: SortOrder
    preferredDate?: SortOrderInput | SortOrder
    headcount?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    quoteAmount?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    stripeLinkId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    OR?: OrgInquiryWhereInput[]
    NOT?: OrgInquiryWhereInput | OrgInquiryWhereInput[]
    orgName?: StringFilter<"OrgInquiry"> | string
    contactEmail?: StringFilter<"OrgInquiry"> | string
    contactName?: StringNullableFilter<"OrgInquiry"> | string | null
    ein?: StringNullableFilter<"OrgInquiry"> | string | null
    isNonprofit?: BoolFilter<"OrgInquiry"> | boolean
    website?: StringNullableFilter<"OrgInquiry"> | string | null
    eventType?: StringFilter<"OrgInquiry"> | string
    preferredDate?: DateTimeNullableFilter<"OrgInquiry"> | Date | string | null
    headcount?: IntNullableFilter<"OrgInquiry"> | number | null
    message?: StringNullableFilter<"OrgInquiry"> | string | null
    quoteAmount?: DecimalNullableFilter<"OrgInquiry"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFilter<"OrgInquiry"> | $Enums.InquiryStatus
    notes?: StringNullableFilter<"OrgInquiry"> | string | null
    stripeLinkId?: StringNullableFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeFilter<"OrgInquiry"> | Date | string
  }, "id">

  export type OrgInquiryOrderByWithAggregationInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrderInput | SortOrder
    ein?: SortOrderInput | SortOrder
    isNonprofit?: SortOrder
    website?: SortOrderInput | SortOrder
    eventType?: SortOrder
    preferredDate?: SortOrderInput | SortOrder
    headcount?: SortOrderInput | SortOrder
    message?: SortOrderInput | SortOrder
    quoteAmount?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    stripeLinkId?: SortOrderInput | SortOrder
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
    id?: StringWithAggregatesFilter<"OrgInquiry"> | string
    orgName?: StringWithAggregatesFilter<"OrgInquiry"> | string
    contactEmail?: StringWithAggregatesFilter<"OrgInquiry"> | string
    contactName?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    ein?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    isNonprofit?: BoolWithAggregatesFilter<"OrgInquiry"> | boolean
    website?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    eventType?: StringWithAggregatesFilter<"OrgInquiry"> | string
    preferredDate?: DateTimeNullableWithAggregatesFilter<"OrgInquiry"> | Date | string | null
    headcount?: IntNullableWithAggregatesFilter<"OrgInquiry"> | number | null
    message?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    quoteAmount?: DecimalNullableWithAggregatesFilter<"OrgInquiry"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusWithAggregatesFilter<"OrgInquiry"> | $Enums.InquiryStatus
    notes?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    stripeLinkId?: StringNullableWithAggregatesFilter<"OrgInquiry"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrgInquiry"> | Date | string
  }

  export type StripeEventWhereInput = {
    AND?: StripeEventWhereInput | StripeEventWhereInput[]
    OR?: StripeEventWhereInput[]
    NOT?: StripeEventWhereInput | StripeEventWhereInput[]
    id?: StringFilter<"StripeEvent"> | string
    stripeEventId?: StringFilter<"StripeEvent"> | string
    eventType?: StringFilter<"StripeEvent"> | string
    payload?: JsonFilter<"StripeEvent">
    processed?: BoolFilter<"StripeEvent"> | boolean
    processedAt?: DateTimeNullableFilter<"StripeEvent"> | Date | string | null
    createdAt?: DateTimeFilter<"StripeEvent"> | Date | string
  }

  export type StripeEventOrderByWithRelationInput = {
    id?: SortOrder
    stripeEventId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type StripeEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stripeEventId?: string
    AND?: StripeEventWhereInput | StripeEventWhereInput[]
    OR?: StripeEventWhereInput[]
    NOT?: StripeEventWhereInput | StripeEventWhereInput[]
    eventType?: StringFilter<"StripeEvent"> | string
    payload?: JsonFilter<"StripeEvent">
    processed?: BoolFilter<"StripeEvent"> | boolean
    processedAt?: DateTimeNullableFilter<"StripeEvent"> | Date | string | null
    createdAt?: DateTimeFilter<"StripeEvent"> | Date | string
  }, "id" | "stripeEventId">

  export type StripeEventOrderByWithAggregationInput = {
    id?: SortOrder
    stripeEventId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StripeEventCountOrderByAggregateInput
    _max?: StripeEventMaxOrderByAggregateInput
    _min?: StripeEventMinOrderByAggregateInput
  }

  export type StripeEventScalarWhereWithAggregatesInput = {
    AND?: StripeEventScalarWhereWithAggregatesInput | StripeEventScalarWhereWithAggregatesInput[]
    OR?: StripeEventScalarWhereWithAggregatesInput[]
    NOT?: StripeEventScalarWhereWithAggregatesInput | StripeEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StripeEvent"> | string
    stripeEventId?: StringWithAggregatesFilter<"StripeEvent"> | string
    eventType?: StringWithAggregatesFilter<"StripeEvent"> | string
    payload?: JsonWithAggregatesFilter<"StripeEvent">
    processed?: BoolWithAggregatesFilter<"StripeEvent"> | boolean
    processedAt?: DateTimeNullableWithAggregatesFilter<"StripeEvent"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"StripeEvent"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ServiceCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutServiceInput
    packages?: PackageCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutServiceInput
    packages?: PackageUncheckedCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutServiceNestedInput
    packages?: PackageUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutServiceNestedInput
    packages?: PackageUncheckedUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type ServiceCreateManyInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
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
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    userId: string
    serviceId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageCreateInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutPackageInput
  }

  export type PackageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
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
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipCreateInput = {
    id?: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutScholarshipsInput
    service: ServiceCreateNestedOneWithoutScholarshipsInput
  }

  export type ScholarshipUncheckedCreateInput = {
    id?: string
    userId: string
    serviceId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutScholarshipsNestedInput
    service?: ServiceUpdateOneRequiredWithoutScholarshipsNestedInput
  }

  export type ScholarshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipCreateManyInput = {
    id?: string
    userId: string
    serviceId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationCreateInput = {
    id?: string
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutDonationsInput
  }

  export type DonationUncheckedCreateInput = {
    id?: string
    userId?: string | null
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutDonationsNestedInput
  }

  export type DonationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationCreateManyInput = {
    id?: string
    userId?: string | null
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryCreateInput = {
    id?: string
    orgName: string
    contactEmail: string
    contactName?: string | null
    ein?: string | null
    isNonprofit?: boolean
    website?: string | null
    eventType: string
    preferredDate?: Date | string | null
    headcount?: number | null
    message?: string | null
    quoteAmount?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.InquiryStatus
    notes?: string | null
    stripeLinkId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUncheckedCreateInput = {
    id?: string
    orgName: string
    contactEmail: string
    contactName?: string | null
    ein?: string | null
    isNonprofit?: boolean
    website?: string | null
    eventType: string
    preferredDate?: Date | string | null
    headcount?: number | null
    message?: string | null
    quoteAmount?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.InquiryStatus
    notes?: string | null
    stripeLinkId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    website?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    preferredDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    headcount?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    quoteAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripeLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    website?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    preferredDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    headcount?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    quoteAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripeLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryCreateManyInput = {
    id?: string
    orgName: string
    contactEmail: string
    contactName?: string | null
    ein?: string | null
    isNonprofit?: boolean
    website?: string | null
    eventType: string
    preferredDate?: Date | string | null
    headcount?: number | null
    message?: string | null
    quoteAmount?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.InquiryStatus
    notes?: string | null
    stripeLinkId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrgInquiryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    website?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    preferredDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    headcount?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    quoteAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripeLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrgInquiryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orgName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    ein?: NullableStringFieldUpdateOperationsInput | string | null
    isNonprofit?: BoolFieldUpdateOperationsInput | boolean
    website?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    preferredDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    headcount?: NullableIntFieldUpdateOperationsInput | number | null
    message?: NullableStringFieldUpdateOperationsInput | string | null
    quoteAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumInquiryStatusFieldUpdateOperationsInput | $Enums.InquiryStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    stripeLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeEventCreateInput = {
    id?: string
    stripeEventId: string
    eventType: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type StripeEventUncheckedCreateInput = {
    id?: string
    stripeEventId: string
    eventType: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type StripeEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeEventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeEventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeEventCreateManyInput = {
    id?: string
    stripeEventId: string
    eventType: string
    payload: JsonNullValueInput | InputJsonValue
    processed?: boolean
    processedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type StripeEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeEventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StripeEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    stripeEventId?: StringFieldUpdateOperationsInput | string
    eventType?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    processed?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
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

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    firebaseUid?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
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

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type EnumServiceCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryFilter<$PrismaModel> | $Enums.ServiceCategory
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ServiceCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrder
    maxSeats?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceAvgOrderByAggregateInput = {
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrder
    maxSeats?: SortOrder
  }

  export type ServiceMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrder
    maxSeats?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrder
    maxSeats?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServiceSumOrderByAggregateInput = {
    standardPrice?: SortOrder
    scholarshipMin?: SortOrder
    scholarshipMax?: SortOrder
    durationMins?: SortOrder
    maxSeats?: SortOrder
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

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ServiceRelationFilter = {
    is?: ServiceWhereInput
    isNot?: ServiceWhereInput
  }

  export type PackageNullableRelationFilter = {
    is?: PackageWhereInput | null
    isNot?: PackageWhereInput | null
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    facilitatorId?: SortOrder
    scheduledAt?: SortOrder
    status?: SortOrder
    pricePaid?: SortOrder
    isScholarship?: SortOrder
    scholarshipCode?: SortOrder
    stripePaymentId?: SortOrder
    packageId?: SortOrder
    sessionTokenRef?: SortOrder
    cancelReason?: SortOrder
    completedAt?: SortOrder
    confirmationEmailSent?: SortOrder
    balanceDueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    pricePaid?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    facilitatorId?: SortOrder
    scheduledAt?: SortOrder
    status?: SortOrder
    pricePaid?: SortOrder
    isScholarship?: SortOrder
    scholarshipCode?: SortOrder
    stripePaymentId?: SortOrder
    packageId?: SortOrder
    sessionTokenRef?: SortOrder
    cancelReason?: SortOrder
    completedAt?: SortOrder
    confirmationEmailSent?: SortOrder
    balanceDueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    facilitatorId?: SortOrder
    scheduledAt?: SortOrder
    status?: SortOrder
    pricePaid?: SortOrder
    isScholarship?: SortOrder
    scholarshipCode?: SortOrder
    stripePaymentId?: SortOrder
    packageId?: SortOrder
    sessionTokenRef?: SortOrder
    cancelReason?: SortOrder
    completedAt?: SortOrder
    confirmationEmailSent?: SortOrder
    balanceDueDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    pricePaid?: SortOrder
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

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type EnumPackageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageStatus | EnumPackageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageStatusFilter<$PrismaModel> | $Enums.PackageStatus
  }

  export type PackageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
    expiresAt?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    isScholarship?: SortOrder
    discountCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageAvgOrderByAggregateInput = {
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
  }

  export type PackageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
    expiresAt?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    isScholarship?: SortOrder
    discountCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
    expiresAt?: SortOrder
    stripePaymentId?: SortOrder
    status?: SortOrder
    isScholarship?: SortOrder
    discountCode?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PackageSumOrderByAggregateInput = {
    totalSessions?: SortOrder
    usedSessions?: SortOrder
    pricePaid?: SortOrder
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

  export type EnumPackageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageStatus | EnumPackageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageStatusWithAggregatesFilter<$PrismaModel> | $Enums.PackageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPackageStatusFilter<$PrismaModel>
    _max?: NestedEnumPackageStatusFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumScholarshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusFilter<$PrismaModel> | $Enums.ScholarshipStatus
  }

  export type ScholarshipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    requestedAmount?: SortOrder
    approvedAmount?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    discountCode?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    expiresAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipAvgOrderByAggregateInput = {
    requestedAmount?: SortOrder
    approvedAmount?: SortOrder
  }

  export type ScholarshipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    requestedAmount?: SortOrder
    approvedAmount?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    discountCode?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    expiresAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    serviceId?: SortOrder
    requestedAmount?: SortOrder
    approvedAmount?: SortOrder
    reason?: SortOrder
    status?: SortOrder
    discountCode?: SortOrder
    reviewedBy?: SortOrder
    reviewedAt?: SortOrder
    reviewNote?: SortOrder
    expiresAt?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ScholarshipSumOrderByAggregateInput = {
    requestedAmount?: SortOrder
    approvedAmount?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type EnumDonationTierFilter<$PrismaModel = never> = {
    equals?: $Enums.DonationTier | EnumDonationTierFieldRefInput<$PrismaModel>
    in?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.DonationTier[] | ListEnumDonationTierFieldRefInput<$PrismaModel>
    not?: NestedEnumDonationTierFilter<$PrismaModel> | $Enums.DonationTier
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type DonationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    donorVaultRef?: SortOrder
    amount?: SortOrder
    tier?: SortOrder
    stripePaymentId?: SortOrder
    receiptSent?: SortOrder
    receiptSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type DonationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    donorVaultRef?: SortOrder
    amount?: SortOrder
    tier?: SortOrder
    stripePaymentId?: SortOrder
    receiptSent?: SortOrder
    receiptSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    donorVaultRef?: SortOrder
    amount?: SortOrder
    tier?: SortOrder
    stripePaymentId?: SortOrder
    receiptSent?: SortOrder
    receiptSentAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DonationSumOrderByAggregateInput = {
    amount?: SortOrder
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

  export type OrgInquiryCountOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    ein?: SortOrder
    isNonprofit?: SortOrder
    website?: SortOrder
    eventType?: SortOrder
    preferredDate?: SortOrder
    headcount?: SortOrder
    message?: SortOrder
    quoteAmount?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    stripeLinkId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryAvgOrderByAggregateInput = {
    headcount?: SortOrder
    quoteAmount?: SortOrder
  }

  export type OrgInquiryMaxOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    ein?: SortOrder
    isNonprofit?: SortOrder
    website?: SortOrder
    eventType?: SortOrder
    preferredDate?: SortOrder
    headcount?: SortOrder
    message?: SortOrder
    quoteAmount?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    stripeLinkId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquiryMinOrderByAggregateInput = {
    id?: SortOrder
    orgName?: SortOrder
    contactEmail?: SortOrder
    contactName?: SortOrder
    ein?: SortOrder
    isNonprofit?: SortOrder
    website?: SortOrder
    eventType?: SortOrder
    preferredDate?: SortOrder
    headcount?: SortOrder
    message?: SortOrder
    quoteAmount?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    stripeLinkId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrgInquirySumOrderByAggregateInput = {
    headcount?: SortOrder
    quoteAmount?: SortOrder
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
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type StripeEventCountOrderByAggregateInput = {
    id?: SortOrder
    stripeEventId?: SortOrder
    eventType?: SortOrder
    payload?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StripeEventMaxOrderByAggregateInput = {
    id?: SortOrder
    stripeEventId?: SortOrder
    eventType?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StripeEventMinOrderByAggregateInput = {
    id?: SortOrder
    stripeEventId?: SortOrder
    eventType?: SortOrder
    processed?: SortOrder
    processedAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type ScholarshipCreateNestedManyWithoutServiceInput = {
    create?: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput> | ScholarshipCreateWithoutServiceInput[] | ScholarshipUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutServiceInput | ScholarshipCreateOrConnectWithoutServiceInput[]
    createMany?: ScholarshipCreateManyServiceInputEnvelope
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
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

  export type ScholarshipUncheckedCreateNestedManyWithoutServiceInput = {
    create?: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput> | ScholarshipCreateWithoutServiceInput[] | ScholarshipUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutServiceInput | ScholarshipCreateOrConnectWithoutServiceInput[]
    createMany?: ScholarshipCreateManyServiceInputEnvelope
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
  }

  export type EnumServiceCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ServiceCategory
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
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

  export type ScholarshipUpdateManyWithoutServiceNestedInput = {
    create?: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput> | ScholarshipCreateWithoutServiceInput[] | ScholarshipUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutServiceInput | ScholarshipCreateOrConnectWithoutServiceInput[]
    upsert?: ScholarshipUpsertWithWhereUniqueWithoutServiceInput | ScholarshipUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: ScholarshipCreateManyServiceInputEnvelope
    set?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    disconnect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    delete?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    update?: ScholarshipUpdateWithWhereUniqueWithoutServiceInput | ScholarshipUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: ScholarshipUpdateManyWithWhereWithoutServiceInput | ScholarshipUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
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

  export type ScholarshipUncheckedUpdateManyWithoutServiceNestedInput = {
    create?: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput> | ScholarshipCreateWithoutServiceInput[] | ScholarshipUncheckedCreateWithoutServiceInput[]
    connectOrCreate?: ScholarshipCreateOrConnectWithoutServiceInput | ScholarshipCreateOrConnectWithoutServiceInput[]
    upsert?: ScholarshipUpsertWithWhereUniqueWithoutServiceInput | ScholarshipUpsertWithWhereUniqueWithoutServiceInput[]
    createMany?: ScholarshipCreateManyServiceInputEnvelope
    set?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    disconnect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    delete?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    connect?: ScholarshipWhereUniqueInput | ScholarshipWhereUniqueInput[]
    update?: ScholarshipUpdateWithWhereUniqueWithoutServiceInput | ScholarshipUpdateWithWhereUniqueWithoutServiceInput[]
    updateMany?: ScholarshipUpdateManyWithWhereWithoutServiceInput | ScholarshipUpdateManyWithWhereWithoutServiceInput[]
    deleteMany?: ScholarshipScalarWhereInput | ScholarshipScalarWhereInput[]
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

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPackageStatusFieldUpdateOperationsInput = {
    set?: $Enums.PackageStatus
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

  export type ServiceCreateNestedOneWithoutScholarshipsInput = {
    create?: XOR<ServiceCreateWithoutScholarshipsInput, ServiceUncheckedCreateWithoutScholarshipsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutScholarshipsInput
    connect?: ServiceWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumScholarshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.ScholarshipStatus
  }

  export type UserUpdateOneRequiredWithoutScholarshipsNestedInput = {
    create?: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutScholarshipsInput
    upsert?: UserUpsertWithoutScholarshipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutScholarshipsInput, UserUpdateWithoutScholarshipsInput>, UserUncheckedUpdateWithoutScholarshipsInput>
  }

  export type ServiceUpdateOneRequiredWithoutScholarshipsNestedInput = {
    create?: XOR<ServiceCreateWithoutScholarshipsInput, ServiceUncheckedCreateWithoutScholarshipsInput>
    connectOrCreate?: ServiceCreateOrConnectWithoutScholarshipsInput
    upsert?: ServiceUpsertWithoutScholarshipsInput
    connect?: ServiceWhereUniqueInput
    update?: XOR<XOR<ServiceUpdateToOneWithWhereWithoutScholarshipsInput, ServiceUpdateWithoutScholarshipsInput>, ServiceUncheckedUpdateWithoutScholarshipsInput>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
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

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type NestedEnumServiceCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ServiceCategory | EnumServiceCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ServiceCategory[] | ListEnumServiceCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumServiceCategoryFilter<$PrismaModel> | $Enums.ServiceCategory
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumPackageStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageStatus | EnumPackageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageStatusFilter<$PrismaModel> | $Enums.PackageStatus
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

  export type NestedEnumPackageStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageStatus | EnumPackageStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageStatus[] | ListEnumPackageStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageStatusWithAggregatesFilter<$PrismaModel> | $Enums.PackageStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPackageStatusFilter<$PrismaModel>
    _max?: NestedEnumPackageStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumScholarshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ScholarshipStatus | EnumScholarshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ScholarshipStatus[] | ListEnumScholarshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumScholarshipStatusFilter<$PrismaModel> | $Enums.ScholarshipStatus
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
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

  export type NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InquiryStatus | EnumInquiryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InquiryStatus[] | ListEnumInquiryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInquiryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InquiryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInquiryStatusFilter<$PrismaModel>
    _max?: NestedEnumInquiryStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    service: ServiceCreateNestedOneWithoutSessionsInput
    package?: PackageCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    serviceId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    service: ServiceCreateNestedOneWithoutScholarshipsInput
  }

  export type ScholarshipUncheckedCreateWithoutUserInput = {
    id?: string
    serviceId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
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
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationUncheckedCreateWithoutUserInput = {
    id?: string
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
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
    id?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    serviceId?: StringFilter<"Session"> | string
    facilitatorId?: StringNullableFilter<"Session"> | string | null
    scheduledAt?: DateTimeFilter<"Session"> | Date | string
    status?: EnumSessionStatusFilter<"Session"> | $Enums.SessionStatus
    pricePaid?: DecimalFilter<"Session"> | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFilter<"Session"> | boolean
    scholarshipCode?: StringNullableFilter<"Session"> | string | null
    stripePaymentId?: StringNullableFilter<"Session"> | string | null
    packageId?: StringNullableFilter<"Session"> | string | null
    sessionTokenRef?: StringNullableFilter<"Session"> | string | null
    cancelReason?: StringNullableFilter<"Session"> | string | null
    completedAt?: DateTimeNullableFilter<"Session"> | Date | string | null
    confirmationEmailSent?: BoolFilter<"Session"> | boolean
    balanceDueDate?: DateTimeNullableFilter<"Session"> | Date | string | null
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
    id?: StringFilter<"Package"> | string
    userId?: StringFilter<"Package"> | string
    serviceId?: StringFilter<"Package"> | string
    totalSessions?: IntFilter<"Package"> | number
    usedSessions?: IntFilter<"Package"> | number
    pricePaid?: DecimalFilter<"Package"> | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFilter<"Package"> | Date | string
    stripePaymentId?: StringNullableFilter<"Package"> | string | null
    status?: EnumPackageStatusFilter<"Package"> | $Enums.PackageStatus
    isScholarship?: BoolFilter<"Package"> | boolean
    discountCode?: StringNullableFilter<"Package"> | string | null
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
    id?: StringFilter<"Scholarship"> | string
    userId?: StringFilter<"Scholarship"> | string
    serviceId?: StringFilter<"Scholarship"> | string
    requestedAmount?: DecimalFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string
    approvedAmount?: DecimalNullableFilter<"Scholarship"> | Decimal | DecimalJsLike | number | string | null
    reason?: StringFilter<"Scholarship"> | string
    status?: EnumScholarshipStatusFilter<"Scholarship"> | $Enums.ScholarshipStatus
    discountCode?: StringNullableFilter<"Scholarship"> | string | null
    reviewedBy?: StringNullableFilter<"Scholarship"> | string | null
    reviewedAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    reviewNote?: StringNullableFilter<"Scholarship"> | string | null
    expiresAt?: DateTimeNullableFilter<"Scholarship"> | Date | string | null
    rejectionReason?: StringNullableFilter<"Scholarship"> | string | null
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
    id?: StringFilter<"Donation"> | string
    userId?: StringNullableFilter<"Donation"> | string | null
    donorVaultRef?: StringNullableFilter<"Donation"> | string | null
    amount?: DecimalFilter<"Donation"> | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFilter<"Donation"> | $Enums.DonationTier
    stripePaymentId?: StringFilter<"Donation"> | string
    receiptSent?: BoolFilter<"Donation"> | boolean
    receiptSentAt?: DateTimeNullableFilter<"Donation"> | Date | string | null
    createdAt?: DateTimeFilter<"Donation"> | Date | string
    updatedAt?: DateTimeFilter<"Donation"> | Date | string
  }

  export type SessionCreateWithoutServiceInput = {
    id?: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    package?: PackageCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutServiceInput = {
    id?: string
    userId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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

  export type ScholarshipCreateWithoutServiceInput = {
    id?: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutScholarshipsInput
  }

  export type ScholarshipUncheckedCreateWithoutServiceInput = {
    id?: string
    userId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipCreateOrConnectWithoutServiceInput = {
    where: ScholarshipWhereUniqueInput
    create: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput>
  }

  export type ScholarshipCreateManyServiceInputEnvelope = {
    data: ScholarshipCreateManyServiceInput | ScholarshipCreateManyServiceInput[]
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

  export type ScholarshipUpsertWithWhereUniqueWithoutServiceInput = {
    where: ScholarshipWhereUniqueInput
    update: XOR<ScholarshipUpdateWithoutServiceInput, ScholarshipUncheckedUpdateWithoutServiceInput>
    create: XOR<ScholarshipCreateWithoutServiceInput, ScholarshipUncheckedCreateWithoutServiceInput>
  }

  export type ScholarshipUpdateWithWhereUniqueWithoutServiceInput = {
    where: ScholarshipWhereUniqueInput
    data: XOR<ScholarshipUpdateWithoutServiceInput, ScholarshipUncheckedUpdateWithoutServiceInput>
  }

  export type ScholarshipUpdateManyWithWhereWithoutServiceInput = {
    where: ScholarshipScalarWhereInput
    data: XOR<ScholarshipUpdateManyMutationInput, ScholarshipUncheckedUpdateManyWithoutServiceInput>
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type ServiceCreateWithoutSessionsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateWithoutSessionsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    packages?: PackageUncheckedCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutSessionsInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutSessionsInput, ServiceUncheckedCreateWithoutSessionsInput>
  }

  export type PackageCreateWithoutSessionsInput = {
    id?: string
    totalSessions: number
    usedSessions?: number
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
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
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
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
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    packages?: PackageUncheckedUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutServiceNestedInput
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
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
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
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutPackagesInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPackagesInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPackagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPackagesInput, UserUncheckedCreateWithoutPackagesInput>
  }

  export type ServiceCreateWithoutPackagesInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateWithoutPackagesInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutServiceInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutPackagesInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutPackagesInput, ServiceUncheckedCreateWithoutPackagesInput>
  }

  export type SessionCreateWithoutPackageInput = {
    id?: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
    service: ServiceCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateWithoutPackageInput = {
    id?: string
    userId: string
    serviceId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
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
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
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
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateWithoutPackagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutServiceNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutServiceNestedInput
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
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    donations?: DonationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutScholarshipsInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    donations?: DonationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutScholarshipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutScholarshipsInput, UserUncheckedCreateWithoutScholarshipsInput>
  }

  export type ServiceCreateWithoutScholarshipsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutServiceInput
    packages?: PackageCreateNestedManyWithoutServiceInput
  }

  export type ServiceUncheckedCreateWithoutScholarshipsInput = {
    id?: string
    slug: string
    name: string
    description: string
    category: $Enums.ServiceCategory
    standardPrice: Decimal | DecimalJsLike | number | string
    scholarshipMin?: Decimal | DecimalJsLike | number | string
    scholarshipMax?: Decimal | DecimalJsLike | number | string
    durationMins?: number | null
    maxSeats?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutServiceInput
    packages?: PackageUncheckedCreateNestedManyWithoutServiceInput
  }

  export type ServiceCreateOrConnectWithoutScholarshipsInput = {
    where: ServiceWhereUniqueInput
    create: XOR<ServiceCreateWithoutScholarshipsInput, ServiceUncheckedCreateWithoutScholarshipsInput>
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
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    donations?: DonationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutScholarshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    donations?: DonationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ServiceUpsertWithoutScholarshipsInput = {
    update: XOR<ServiceUpdateWithoutScholarshipsInput, ServiceUncheckedUpdateWithoutScholarshipsInput>
    create: XOR<ServiceCreateWithoutScholarshipsInput, ServiceUncheckedCreateWithoutScholarshipsInput>
    where?: ServiceWhereInput
  }

  export type ServiceUpdateToOneWithWhereWithoutScholarshipsInput = {
    where?: ServiceWhereInput
    data: XOR<ServiceUpdateWithoutScholarshipsInput, ServiceUncheckedUpdateWithoutScholarshipsInput>
  }

  export type ServiceUpdateWithoutScholarshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutServiceNestedInput
    packages?: PackageUpdateManyWithoutServiceNestedInput
  }

  export type ServiceUncheckedUpdateWithoutScholarshipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: EnumServiceCategoryFieldUpdateOperationsInput | $Enums.ServiceCategory
    standardPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMin?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    scholarshipMax?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    durationMins?: NullableIntFieldUpdateOperationsInput | number | null
    maxSeats?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutServiceNestedInput
    packages?: PackageUncheckedUpdateManyWithoutServiceNestedInput
  }

  export type UserCreateWithoutDonationsInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    packages?: PackageCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDonationsInput = {
    id?: string
    firebaseUid: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    packages?: PackageUncheckedCreateNestedManyWithoutUserInput
    scholarships?: ScholarshipUncheckedCreateNestedManyWithoutUserInput
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
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    packages?: PackageUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDonationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    firebaseUid?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    packages?: PackageUncheckedUpdateManyWithoutUserNestedInput
    scholarships?: ScholarshipUncheckedUpdateManyWithoutUserNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    serviceId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageCreateManyUserInput = {
    id?: string
    serviceId: string
    totalSessions: number
    usedSessions?: number
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipCreateManyUserInput = {
    id?: string
    serviceId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DonationCreateManyUserInput = {
    id?: string
    donorVaultRef?: string | null
    amount: Decimal | DecimalJsLike | number | string
    tier: $Enums.DonationTier
    stripePaymentId: string
    receiptSent?: boolean
    receiptSentAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    service?: ServiceUpdateOneRequiredWithoutSessionsNestedInput
    package?: PackageUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
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
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    service?: ServiceUpdateOneRequiredWithoutScholarshipsNestedInput
  }

  export type ScholarshipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DonationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    donorVaultRef?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    tier?: EnumDonationTierFieldUpdateOperationsInput | $Enums.DonationTier
    stripePaymentId?: StringFieldUpdateOperationsInput | string
    receiptSent?: BoolFieldUpdateOperationsInput | boolean
    receiptSentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyServiceInput = {
    id?: string
    userId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    packageId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PackageCreateManyServiceInput = {
    id?: string
    userId: string
    totalSessions: number
    usedSessions?: number
    pricePaid: Decimal | DecimalJsLike | number | string
    expiresAt: Date | string
    stripePaymentId?: string | null
    status?: $Enums.PackageStatus
    isScholarship?: boolean
    discountCode?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ScholarshipCreateManyServiceInput = {
    id?: string
    userId: string
    requestedAmount: Decimal | DecimalJsLike | number | string
    approvedAmount?: Decimal | DecimalJsLike | number | string | null
    reason: string
    status?: $Enums.ScholarshipStatus
    discountCode?: string | null
    reviewedBy?: string | null
    reviewedAt?: Date | string | null
    reviewNote?: string | null
    expiresAt?: Date | string | null
    rejectionReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    package?: PackageUpdateOneWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    packageId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PackageUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
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
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutPackageNestedInput
  }

  export type PackageUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    totalSessions?: IntFieldUpdateOperationsInput | number
    usedSessions?: IntFieldUpdateOperationsInput | number
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumPackageStatusFieldUpdateOperationsInput | $Enums.PackageStatus
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutScholarshipsNestedInput
  }

  export type ScholarshipUncheckedUpdateWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScholarshipUncheckedUpdateManyWithoutServiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    requestedAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    approvedAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    reason?: StringFieldUpdateOperationsInput | string
    status?: EnumScholarshipStatusFieldUpdateOperationsInput | $Enums.ScholarshipStatus
    discountCode?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedBy?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    reviewNote?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyPackageInput = {
    id?: string
    userId: string
    serviceId: string
    facilitatorId?: string | null
    scheduledAt: Date | string
    status?: $Enums.SessionStatus
    pricePaid: Decimal | DecimalJsLike | number | string
    isScholarship?: boolean
    scholarshipCode?: string | null
    stripePaymentId?: string | null
    sessionTokenRef?: string | null
    cancelReason?: string | null
    completedAt?: Date | string | null
    confirmationEmailSent?: boolean
    balanceDueDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    service?: ServiceUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutPackageInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    serviceId?: StringFieldUpdateOperationsInput | string
    facilitatorId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    pricePaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isScholarship?: BoolFieldUpdateOperationsInput | boolean
    scholarshipCode?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionTokenRef?: NullableStringFieldUpdateOperationsInput | string | null
    cancelReason?: NullableStringFieldUpdateOperationsInput | string | null
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmationEmailSent?: BoolFieldUpdateOperationsInput | boolean
    balanceDueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceCountOutputTypeDefaultArgs instead
     */
    export type ServiceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PackageCountOutputTypeDefaultArgs instead
     */
    export type PackageCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PackageCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServiceDefaultArgs instead
     */
    export type ServiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServiceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PackageDefaultArgs instead
     */
    export type PackageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PackageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ScholarshipDefaultArgs instead
     */
    export type ScholarshipArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ScholarshipDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DonationDefaultArgs instead
     */
    export type DonationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DonationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrgInquiryDefaultArgs instead
     */
    export type OrgInquiryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrgInquiryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StripeEventDefaultArgs instead
     */
    export type StripeEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StripeEventDefaultArgs<ExtArgs>

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