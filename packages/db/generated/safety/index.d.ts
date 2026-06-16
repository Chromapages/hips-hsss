
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
 * Model AuditEvent
 * 
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>
/**
 * Model SafetyAlert
 * 
 */
export type SafetyAlert = $Result.DefaultSelection<Prisma.$SafetyAlertPayload>
/**
 * Model SafetyMitigation
 * 
 */
export type SafetyMitigation = $Result.DefaultSelection<Prisma.$SafetyMitigationPayload>
/**
 * Model SafetyStrike
 * 
 */
export type SafetyStrike = $Result.DefaultSelection<Prisma.$SafetyStrikePayload>
/**
 * Model SafetyAuditLog
 * 
 */
export type SafetyAuditLog = $Result.DefaultSelection<Prisma.$SafetyAuditLogPayload>
/**
 * Model EscalationQueue
 * 
 */
export type EscalationQueue = $Result.DefaultSelection<Prisma.$EscalationQueuePayload>
/**
 * Model KeywordRule
 * 
 */
export type KeywordRule = $Result.DefaultSelection<Prisma.$KeywordRulePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SafetySeverity: {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export type SafetySeverity = (typeof SafetySeverity)[keyof typeof SafetySeverity]


export const SafetyCategory: {
  HARM: 'HARM',
  SELF_HARM: 'SELF_HARM',
  HARASSMENT: 'HARASSMENT',
  DISCLOSURE: 'DISCLOSURE'
};

export type SafetyCategory = (typeof SafetyCategory)[keyof typeof SafetyCategory]


export const MitigationAction: {
  WARNING: 'WARNING',
  MUTE: 'MUTE',
  KICK: 'KICK',
  ESCALATE: 'ESCALATE'
};

export type MitigationAction = (typeof MitigationAction)[keyof typeof MitigationAction]


export const EscalationLevel: {
  watch: 'watch',
  urgent: 'urgent',
  crisis: 'crisis'
};

export type EscalationLevel = (typeof EscalationLevel)[keyof typeof EscalationLevel]


export const EscalationSource: {
  keyword: 'keyword',
  manual: 'manual'
};

export type EscalationSource = (typeof EscalationSource)[keyof typeof EscalationSource]


export const EscalationStatus: {
  open: 'open',
  reviewing: 'reviewing',
  resolved: 'resolved'
};

export type EscalationStatus = (typeof EscalationStatus)[keyof typeof EscalationStatus]

}

export type SafetySeverity = $Enums.SafetySeverity

export const SafetySeverity: typeof $Enums.SafetySeverity

export type SafetyCategory = $Enums.SafetyCategory

export const SafetyCategory: typeof $Enums.SafetyCategory

export type MitigationAction = $Enums.MitigationAction

export const MitigationAction: typeof $Enums.MitigationAction

export type EscalationLevel = $Enums.EscalationLevel

export const EscalationLevel: typeof $Enums.EscalationLevel

export type EscalationSource = $Enums.EscalationSource

export const EscalationSource: typeof $Enums.EscalationSource

export type EscalationStatus = $Enums.EscalationStatus

export const EscalationStatus: typeof $Enums.EscalationStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AuditEvents
 * const auditEvents = await prisma.auditEvent.findMany()
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
   * // Fetch zero or more AuditEvents
   * const auditEvents = await prisma.auditEvent.findMany()
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
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs>;

  /**
   * `prisma.safetyAlert`: Exposes CRUD operations for the **SafetyAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyAlerts
    * const safetyAlerts = await prisma.safetyAlert.findMany()
    * ```
    */
  get safetyAlert(): Prisma.SafetyAlertDelegate<ExtArgs>;

  /**
   * `prisma.safetyMitigation`: Exposes CRUD operations for the **SafetyMitigation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyMitigations
    * const safetyMitigations = await prisma.safetyMitigation.findMany()
    * ```
    */
  get safetyMitigation(): Prisma.SafetyMitigationDelegate<ExtArgs>;

  /**
   * `prisma.safetyStrike`: Exposes CRUD operations for the **SafetyStrike** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyStrikes
    * const safetyStrikes = await prisma.safetyStrike.findMany()
    * ```
    */
  get safetyStrike(): Prisma.SafetyStrikeDelegate<ExtArgs>;

  /**
   * `prisma.safetyAuditLog`: Exposes CRUD operations for the **SafetyAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SafetyAuditLogs
    * const safetyAuditLogs = await prisma.safetyAuditLog.findMany()
    * ```
    */
  get safetyAuditLog(): Prisma.SafetyAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.escalationQueue`: Exposes CRUD operations for the **EscalationQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EscalationQueues
    * const escalationQueues = await prisma.escalationQueue.findMany()
    * ```
    */
  get escalationQueue(): Prisma.EscalationQueueDelegate<ExtArgs>;

  /**
   * `prisma.keywordRule`: Exposes CRUD operations for the **KeywordRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KeywordRules
    * const keywordRules = await prisma.keywordRule.findMany()
    * ```
    */
  get keywordRule(): Prisma.KeywordRuleDelegate<ExtArgs>;
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
    AuditEvent: 'AuditEvent',
    SafetyAlert: 'SafetyAlert',
    SafetyMitigation: 'SafetyMitigation',
    SafetyStrike: 'SafetyStrike',
    SafetyAuditLog: 'SafetyAuditLog',
    EscalationQueue: 'EscalationQueue',
    KeywordRule: 'KeywordRule'
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
      modelProps: "auditEvent" | "safetyAlert" | "safetyMitigation" | "safetyStrike" | "safetyAuditLog" | "escalationQueue" | "keywordRule"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AuditEvent: {
        payload: Prisma.$AuditEventPayload<ExtArgs>
        fields: Prisma.AuditEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findFirst: {
            args: Prisma.AuditEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          findMany: {
            args: Prisma.AuditEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          create: {
            args: Prisma.AuditEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          createMany: {
            args: Prisma.AuditEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>[]
          }
          delete: {
            args: Prisma.AuditEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          update: {
            args: Prisma.AuditEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          deleteMany: {
            args: Prisma.AuditEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditEventPayload>
          }
          aggregate: {
            args: Prisma.AuditEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditEvent>
          }
          groupBy: {
            args: Prisma.AuditEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditEventCountArgs<ExtArgs>
            result: $Utils.Optional<AuditEventCountAggregateOutputType> | number
          }
        }
      }
      SafetyAlert: {
        payload: Prisma.$SafetyAlertPayload<ExtArgs>
        fields: Prisma.SafetyAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          findFirst: {
            args: Prisma.SafetyAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          findMany: {
            args: Prisma.SafetyAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>[]
          }
          create: {
            args: Prisma.SafetyAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          createMany: {
            args: Prisma.SafetyAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>[]
          }
          delete: {
            args: Prisma.SafetyAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          update: {
            args: Prisma.SafetyAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          deleteMany: {
            args: Prisma.SafetyAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAlertPayload>
          }
          aggregate: {
            args: Prisma.SafetyAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyAlert>
          }
          groupBy: {
            args: Prisma.SafetyAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyAlertCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyAlertCountAggregateOutputType> | number
          }
        }
      }
      SafetyMitigation: {
        payload: Prisma.$SafetyMitigationPayload<ExtArgs>
        fields: Prisma.SafetyMitigationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyMitigationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyMitigationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          findFirst: {
            args: Prisma.SafetyMitigationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyMitigationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          findMany: {
            args: Prisma.SafetyMitigationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>[]
          }
          create: {
            args: Prisma.SafetyMitigationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          createMany: {
            args: Prisma.SafetyMitigationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyMitigationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>[]
          }
          delete: {
            args: Prisma.SafetyMitigationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          update: {
            args: Prisma.SafetyMitigationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          deleteMany: {
            args: Prisma.SafetyMitigationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyMitigationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyMitigationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyMitigationPayload>
          }
          aggregate: {
            args: Prisma.SafetyMitigationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyMitigation>
          }
          groupBy: {
            args: Prisma.SafetyMitigationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyMitigationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyMitigationCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyMitigationCountAggregateOutputType> | number
          }
        }
      }
      SafetyStrike: {
        payload: Prisma.$SafetyStrikePayload<ExtArgs>
        fields: Prisma.SafetyStrikeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyStrikeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyStrikeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          findFirst: {
            args: Prisma.SafetyStrikeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyStrikeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          findMany: {
            args: Prisma.SafetyStrikeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>[]
          }
          create: {
            args: Prisma.SafetyStrikeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          createMany: {
            args: Prisma.SafetyStrikeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyStrikeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>[]
          }
          delete: {
            args: Prisma.SafetyStrikeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          update: {
            args: Prisma.SafetyStrikeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          deleteMany: {
            args: Prisma.SafetyStrikeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyStrikeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyStrikeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyStrikePayload>
          }
          aggregate: {
            args: Prisma.SafetyStrikeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyStrike>
          }
          groupBy: {
            args: Prisma.SafetyStrikeGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyStrikeGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyStrikeCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyStrikeCountAggregateOutputType> | number
          }
        }
      }
      SafetyAuditLog: {
        payload: Prisma.$SafetyAuditLogPayload<ExtArgs>
        fields: Prisma.SafetyAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SafetyAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SafetyAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          findFirst: {
            args: Prisma.SafetyAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SafetyAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          findMany: {
            args: Prisma.SafetyAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>[]
          }
          create: {
            args: Prisma.SafetyAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          createMany: {
            args: Prisma.SafetyAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SafetyAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>[]
          }
          delete: {
            args: Prisma.SafetyAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          update: {
            args: Prisma.SafetyAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.SafetyAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SafetyAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SafetyAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SafetyAuditLogPayload>
          }
          aggregate: {
            args: Prisma.SafetyAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSafetyAuditLog>
          }
          groupBy: {
            args: Prisma.SafetyAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SafetyAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SafetyAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<SafetyAuditLogCountAggregateOutputType> | number
          }
        }
      }
      EscalationQueue: {
        payload: Prisma.$EscalationQueuePayload<ExtArgs>
        fields: Prisma.EscalationQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EscalationQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EscalationQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          findFirst: {
            args: Prisma.EscalationQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EscalationQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          findMany: {
            args: Prisma.EscalationQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>[]
          }
          create: {
            args: Prisma.EscalationQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          createMany: {
            args: Prisma.EscalationQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EscalationQueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>[]
          }
          delete: {
            args: Prisma.EscalationQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          update: {
            args: Prisma.EscalationQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          deleteMany: {
            args: Prisma.EscalationQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EscalationQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EscalationQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationQueuePayload>
          }
          aggregate: {
            args: Prisma.EscalationQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEscalationQueue>
          }
          groupBy: {
            args: Prisma.EscalationQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<EscalationQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.EscalationQueueCountArgs<ExtArgs>
            result: $Utils.Optional<EscalationQueueCountAggregateOutputType> | number
          }
        }
      }
      KeywordRule: {
        payload: Prisma.$KeywordRulePayload<ExtArgs>
        fields: Prisma.KeywordRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KeywordRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KeywordRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          findFirst: {
            args: Prisma.KeywordRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KeywordRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          findMany: {
            args: Prisma.KeywordRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>[]
          }
          create: {
            args: Prisma.KeywordRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          createMany: {
            args: Prisma.KeywordRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KeywordRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>[]
          }
          delete: {
            args: Prisma.KeywordRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          update: {
            args: Prisma.KeywordRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          deleteMany: {
            args: Prisma.KeywordRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KeywordRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KeywordRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KeywordRulePayload>
          }
          aggregate: {
            args: Prisma.KeywordRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKeywordRule>
          }
          groupBy: {
            args: Prisma.KeywordRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<KeywordRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.KeywordRuleCountArgs<ExtArgs>
            result: $Utils.Optional<KeywordRuleCountAggregateOutputType> | number
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
   * Count Type SafetyAlertCountOutputType
   */

  export type SafetyAlertCountOutputType = {
    mitigations: number
    escalations: number
  }

  export type SafetyAlertCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mitigations?: boolean | SafetyAlertCountOutputTypeCountMitigationsArgs
    escalations?: boolean | SafetyAlertCountOutputTypeCountEscalationsArgs
  }

  // Custom InputTypes
  /**
   * SafetyAlertCountOutputType without action
   */
  export type SafetyAlertCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlertCountOutputType
     */
    select?: SafetyAlertCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SafetyAlertCountOutputType without action
   */
  export type SafetyAlertCountOutputTypeCountMitigationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyMitigationWhereInput
  }

  /**
   * SafetyAlertCountOutputType without action
   */
  export type SafetyAlertCountOutputTypeCountEscalationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EscalationQueueWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AuditEvent
   */

  export type AggregateAuditEvent = {
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  export type AuditEventMinAggregateOutputType = {
    id: string | null
    service: string | null
    action: string | null
    actorRef: string | null
    subjectRef: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    service: string | null
    action: string | null
    actorRef: string | null
    subjectRef: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    service: number
    action: number
    actorRef: number
    subjectRef: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    service?: true
    action?: true
    actorRef?: true
    subjectRef?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    service?: true
    action?: true
    actorRef?: true
    subjectRef?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    service?: true
    action?: true
    actorRef?: true
    subjectRef?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AuditEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvent to aggregate.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditEvents
    **/
    _count?: true | AuditEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditEventMaxAggregateInputType
  }

  export type GetAuditEventAggregateType<T extends AuditEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditEvent[P]>
      : GetScalarType<T[P], AggregateAuditEvent[P]>
  }




  export type AuditEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithAggregationInput | AuditEventOrderByWithAggregationInput[]
    by: AuditEventScalarFieldEnum[] | AuditEventScalarFieldEnum
    having?: AuditEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditEventCountAggregateInputType | true
    _min?: AuditEventMinAggregateInputType
    _max?: AuditEventMaxAggregateInputType
  }

  export type AuditEventGroupByOutputType = {
    id: string
    service: string
    action: string
    actorRef: string
    subjectRef: string | null
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: AuditEventCountAggregateOutputType | null
    _min: AuditEventMinAggregateOutputType | null
    _max: AuditEventMaxAggregateOutputType | null
  }

  type GetAuditEventGroupByPayload<T extends AuditEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
            : GetScalarType<T[P], AuditEventGroupByOutputType[P]>
        }
      >
    >


  export type AuditEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    service?: boolean
    action?: boolean
    actorRef?: boolean
    subjectRef?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    service?: boolean
    action?: boolean
    actorRef?: boolean
    subjectRef?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    service?: boolean
    action?: boolean
    actorRef?: boolean
    subjectRef?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      service: string
      action: string
      actorRef: string
      subjectRef: string | null
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["auditEvent"]>
    composites: {}
  }

  type AuditEventGetPayload<S extends boolean | null | undefined | AuditEventDefaultArgs> = $Result.GetResult<Prisma.$AuditEventPayload, S>

  type AuditEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AuditEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AuditEventCountAggregateInputType | true
    }

  export interface AuditEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditEvent'], meta: { name: 'AuditEvent' } }
    /**
     * Find zero or one AuditEvent that matches the filter.
     * @param {AuditEventFindUniqueArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditEventFindUniqueArgs>(args: SelectSubset<T, AuditEventFindUniqueArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AuditEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AuditEventFindUniqueOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AuditEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditEventFindFirstArgs>(args?: SelectSubset<T, AuditEventFindFirstArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AuditEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindFirstOrThrowArgs} args - Arguments to find a AuditEvent
     * @example
     * // Get one AuditEvent
     * const auditEvent = await prisma.auditEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AuditEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany()
     * 
     * // Get first 10 AuditEvents
     * const auditEvents = await prisma.auditEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditEventFindManyArgs>(args?: SelectSubset<T, AuditEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AuditEvent.
     * @param {AuditEventCreateArgs} args - Arguments to create a AuditEvent.
     * @example
     * // Create one AuditEvent
     * const AuditEvent = await prisma.auditEvent.create({
     *   data: {
     *     // ... data to create a AuditEvent
     *   }
     * })
     * 
     */
    create<T extends AuditEventCreateArgs>(args: SelectSubset<T, AuditEventCreateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AuditEvents.
     * @param {AuditEventCreateManyArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditEventCreateManyArgs>(args?: SelectSubset<T, AuditEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditEvents and returns the data saved in the database.
     * @param {AuditEventCreateManyAndReturnArgs} args - Arguments to create many AuditEvents.
     * @example
     * // Create many AuditEvents
     * const auditEvent = await prisma.auditEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditEvents and only return the `id`
     * const auditEventWithIdOnly = await prisma.auditEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AuditEvent.
     * @param {AuditEventDeleteArgs} args - Arguments to delete one AuditEvent.
     * @example
     * // Delete one AuditEvent
     * const AuditEvent = await prisma.auditEvent.delete({
     *   where: {
     *     // ... filter to delete one AuditEvent
     *   }
     * })
     * 
     */
    delete<T extends AuditEventDeleteArgs>(args: SelectSubset<T, AuditEventDeleteArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AuditEvent.
     * @param {AuditEventUpdateArgs} args - Arguments to update one AuditEvent.
     * @example
     * // Update one AuditEvent
     * const auditEvent = await prisma.auditEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditEventUpdateArgs>(args: SelectSubset<T, AuditEventUpdateArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AuditEvents.
     * @param {AuditEventDeleteManyArgs} args - Arguments to filter AuditEvents to delete.
     * @example
     * // Delete a few AuditEvents
     * const { count } = await prisma.auditEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditEventDeleteManyArgs>(args?: SelectSubset<T, AuditEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditEvents
     * const auditEvent = await prisma.auditEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditEventUpdateManyArgs>(args: SelectSubset<T, AuditEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditEvent.
     * @param {AuditEventUpsertArgs} args - Arguments to update or create a AuditEvent.
     * @example
     * // Update or create a AuditEvent
     * const auditEvent = await prisma.auditEvent.upsert({
     *   create: {
     *     // ... data to create a AuditEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditEvent we want to update
     *   }
     * })
     */
    upsert<T extends AuditEventUpsertArgs>(args: SelectSubset<T, AuditEventUpsertArgs<ExtArgs>>): Prisma__AuditEventClient<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AuditEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventCountArgs} args - Arguments to filter AuditEvents to count.
     * @example
     * // Count the number of AuditEvents
     * const count = await prisma.auditEvent.count({
     *   where: {
     *     // ... the filter for the AuditEvents we want to count
     *   }
     * })
    **/
    count<T extends AuditEventCountArgs>(
      args?: Subset<T, AuditEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditEventAggregateArgs>(args: Subset<T, AuditEventAggregateArgs>): Prisma.PrismaPromise<GetAuditEventAggregateType<T>>

    /**
     * Group by AuditEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditEventGroupByArgs} args - Group by arguments.
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
      T extends AuditEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditEventGroupByArgs['orderBy'] }
        : { orderBy?: AuditEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditEvent model
   */
  readonly fields: AuditEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AuditEvent model
   */ 
  interface AuditEventFieldRefs {
    readonly id: FieldRef<"AuditEvent", 'String'>
    readonly service: FieldRef<"AuditEvent", 'String'>
    readonly action: FieldRef<"AuditEvent", 'String'>
    readonly actorRef: FieldRef<"AuditEvent", 'String'>
    readonly subjectRef: FieldRef<"AuditEvent", 'String'>
    readonly metadata: FieldRef<"AuditEvent", 'Json'>
    readonly createdAt: FieldRef<"AuditEvent", 'DateTime'>
    readonly updatedAt: FieldRef<"AuditEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditEvent findUnique
   */
  export type AuditEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findUniqueOrThrow
   */
  export type AuditEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent findFirst
   */
  export type AuditEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findFirstOrThrow
   */
  export type AuditEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter, which AuditEvent to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditEvents.
     */
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent findMany
   */
  export type AuditEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter, which AuditEvents to fetch.
     */
    where?: AuditEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditEvents to fetch.
     */
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditEvents.
     */
    cursor?: AuditEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditEvents.
     */
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * AuditEvent create
   */
  export type AuditEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * The data needed to create a AuditEvent.
     */
    data: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
  }

  /**
   * AuditEvent createMany
   */
  export type AuditEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent createManyAndReturn
   */
  export type AuditEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AuditEvents.
     */
    data: AuditEventCreateManyInput | AuditEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditEvent update
   */
  export type AuditEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * The data needed to update a AuditEvent.
     */
    data: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
    /**
     * Choose, which AuditEvent to update.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent updateMany
   */
  export type AuditEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditEvents.
     */
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyInput>
    /**
     * Filter which AuditEvents to update
     */
    where?: AuditEventWhereInput
  }

  /**
   * AuditEvent upsert
   */
  export type AuditEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * The filter to search for the AuditEvent to update in case it exists.
     */
    where: AuditEventWhereUniqueInput
    /**
     * In case the AuditEvent found by the `where` argument doesn't exist, create a new AuditEvent with this data.
     */
    create: XOR<AuditEventCreateInput, AuditEventUncheckedCreateInput>
    /**
     * In case the AuditEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditEventUpdateInput, AuditEventUncheckedUpdateInput>
  }

  /**
   * AuditEvent delete
   */
  export type AuditEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Filter which AuditEvent to delete.
     */
    where: AuditEventWhereUniqueInput
  }

  /**
   * AuditEvent deleteMany
   */
  export type AuditEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditEvents to delete
     */
    where?: AuditEventWhereInput
  }

  /**
   * AuditEvent without action
   */
  export type AuditEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
  }


  /**
   * Model SafetyAlert
   */

  export type AggregateSafetyAlert = {
    _count: SafetyAlertCountAggregateOutputType | null
    _min: SafetyAlertMinAggregateOutputType | null
    _max: SafetyAlertMaxAggregateOutputType | null
  }

  export type SafetyAlertMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    severity: $Enums.SafetySeverity | null
    category: $Enums.SafetyCategory | null
    anonymizedReason: string | null
    transcriptChunk: string | null
    isResolved: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyAlertMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    severity: $Enums.SafetySeverity | null
    category: $Enums.SafetyCategory | null
    anonymizedReason: string | null
    transcriptChunk: string | null
    isResolved: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyAlertCountAggregateOutputType = {
    id: number
    sessionId: number
    severity: number
    category: number
    anonymizedReason: number
    transcriptChunk: number
    isResolved: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SafetyAlertMinAggregateInputType = {
    id?: true
    sessionId?: true
    severity?: true
    category?: true
    anonymizedReason?: true
    transcriptChunk?: true
    isResolved?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyAlertMaxAggregateInputType = {
    id?: true
    sessionId?: true
    severity?: true
    category?: true
    anonymizedReason?: true
    transcriptChunk?: true
    isResolved?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyAlertCountAggregateInputType = {
    id?: true
    sessionId?: true
    severity?: true
    category?: true
    anonymizedReason?: true
    transcriptChunk?: true
    isResolved?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SafetyAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAlert to aggregate.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyAlerts
    **/
    _count?: true | SafetyAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyAlertMaxAggregateInputType
  }

  export type GetSafetyAlertAggregateType<T extends SafetyAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyAlert[P]>
      : GetScalarType<T[P], AggregateSafetyAlert[P]>
  }




  export type SafetyAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyAlertWhereInput
    orderBy?: SafetyAlertOrderByWithAggregationInput | SafetyAlertOrderByWithAggregationInput[]
    by: SafetyAlertScalarFieldEnum[] | SafetyAlertScalarFieldEnum
    having?: SafetyAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyAlertCountAggregateInputType | true
    _min?: SafetyAlertMinAggregateInputType
    _max?: SafetyAlertMaxAggregateInputType
  }

  export type SafetyAlertGroupByOutputType = {
    id: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk: string | null
    isResolved: boolean
    createdAt: Date
    updatedAt: Date
    _count: SafetyAlertCountAggregateOutputType | null
    _min: SafetyAlertMinAggregateOutputType | null
    _max: SafetyAlertMaxAggregateOutputType | null
  }

  type GetSafetyAlertGroupByPayload<T extends SafetyAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyAlertGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyAlertGroupByOutputType[P]>
        }
      >
    >


  export type SafetyAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    severity?: boolean
    category?: boolean
    anonymizedReason?: boolean
    transcriptChunk?: boolean
    isResolved?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    mitigations?: boolean | SafetyAlert$mitigationsArgs<ExtArgs>
    escalations?: boolean | SafetyAlert$escalationsArgs<ExtArgs>
    _count?: boolean | SafetyAlertCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["safetyAlert"]>

  export type SafetyAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    severity?: boolean
    category?: boolean
    anonymizedReason?: boolean
    transcriptChunk?: boolean
    isResolved?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyAlert"]>

  export type SafetyAlertSelectScalar = {
    id?: boolean
    sessionId?: boolean
    severity?: boolean
    category?: boolean
    anonymizedReason?: boolean
    transcriptChunk?: boolean
    isResolved?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SafetyAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mitigations?: boolean | SafetyAlert$mitigationsArgs<ExtArgs>
    escalations?: boolean | SafetyAlert$escalationsArgs<ExtArgs>
    _count?: boolean | SafetyAlertCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SafetyAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SafetyAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyAlert"
    objects: {
      mitigations: Prisma.$SafetyMitigationPayload<ExtArgs>[]
      escalations: Prisma.$EscalationQueuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      severity: $Enums.SafetySeverity
      category: $Enums.SafetyCategory
      anonymizedReason: string
      transcriptChunk: string | null
      isResolved: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["safetyAlert"]>
    composites: {}
  }

  type SafetyAlertGetPayload<S extends boolean | null | undefined | SafetyAlertDefaultArgs> = $Result.GetResult<Prisma.$SafetyAlertPayload, S>

  type SafetyAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyAlertCountAggregateInputType | true
    }

  export interface SafetyAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyAlert'], meta: { name: 'SafetyAlert' } }
    /**
     * Find zero or one SafetyAlert that matches the filter.
     * @param {SafetyAlertFindUniqueArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyAlertFindUniqueArgs>(args: SelectSubset<T, SafetyAlertFindUniqueArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyAlertFindUniqueOrThrowArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindFirstArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyAlertFindFirstArgs>(args?: SelectSubset<T, SafetyAlertFindFirstArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindFirstOrThrowArgs} args - Arguments to find a SafetyAlert
     * @example
     * // Get one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyAlerts
     * const safetyAlerts = await prisma.safetyAlert.findMany()
     * 
     * // Get first 10 SafetyAlerts
     * const safetyAlerts = await prisma.safetyAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyAlertWithIdOnly = await prisma.safetyAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyAlertFindManyArgs>(args?: SelectSubset<T, SafetyAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyAlert.
     * @param {SafetyAlertCreateArgs} args - Arguments to create a SafetyAlert.
     * @example
     * // Create one SafetyAlert
     * const SafetyAlert = await prisma.safetyAlert.create({
     *   data: {
     *     // ... data to create a SafetyAlert
     *   }
     * })
     * 
     */
    create<T extends SafetyAlertCreateArgs>(args: SelectSubset<T, SafetyAlertCreateArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyAlerts.
     * @param {SafetyAlertCreateManyArgs} args - Arguments to create many SafetyAlerts.
     * @example
     * // Create many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyAlertCreateManyArgs>(args?: SelectSubset<T, SafetyAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyAlerts and returns the data saved in the database.
     * @param {SafetyAlertCreateManyAndReturnArgs} args - Arguments to create many SafetyAlerts.
     * @example
     * // Create many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyAlerts and only return the `id`
     * const safetyAlertWithIdOnly = await prisma.safetyAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyAlert.
     * @param {SafetyAlertDeleteArgs} args - Arguments to delete one SafetyAlert.
     * @example
     * // Delete one SafetyAlert
     * const SafetyAlert = await prisma.safetyAlert.delete({
     *   where: {
     *     // ... filter to delete one SafetyAlert
     *   }
     * })
     * 
     */
    delete<T extends SafetyAlertDeleteArgs>(args: SelectSubset<T, SafetyAlertDeleteArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyAlert.
     * @param {SafetyAlertUpdateArgs} args - Arguments to update one SafetyAlert.
     * @example
     * // Update one SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyAlertUpdateArgs>(args: SelectSubset<T, SafetyAlertUpdateArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyAlerts.
     * @param {SafetyAlertDeleteManyArgs} args - Arguments to filter SafetyAlerts to delete.
     * @example
     * // Delete a few SafetyAlerts
     * const { count } = await prisma.safetyAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyAlertDeleteManyArgs>(args?: SelectSubset<T, SafetyAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyAlerts
     * const safetyAlert = await prisma.safetyAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyAlertUpdateManyArgs>(args: SelectSubset<T, SafetyAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyAlert.
     * @param {SafetyAlertUpsertArgs} args - Arguments to update or create a SafetyAlert.
     * @example
     * // Update or create a SafetyAlert
     * const safetyAlert = await prisma.safetyAlert.upsert({
     *   create: {
     *     // ... data to create a SafetyAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyAlert we want to update
     *   }
     * })
     */
    upsert<T extends SafetyAlertUpsertArgs>(args: SelectSubset<T, SafetyAlertUpsertArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertCountArgs} args - Arguments to filter SafetyAlerts to count.
     * @example
     * // Count the number of SafetyAlerts
     * const count = await prisma.safetyAlert.count({
     *   where: {
     *     // ... the filter for the SafetyAlerts we want to count
     *   }
     * })
    **/
    count<T extends SafetyAlertCountArgs>(
      args?: Subset<T, SafetyAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SafetyAlertAggregateArgs>(args: Subset<T, SafetyAlertAggregateArgs>): Prisma.PrismaPromise<GetSafetyAlertAggregateType<T>>

    /**
     * Group by SafetyAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAlertGroupByArgs} args - Group by arguments.
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
      T extends SafetyAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyAlertGroupByArgs['orderBy'] }
        : { orderBy?: SafetyAlertGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SafetyAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyAlert model
   */
  readonly fields: SafetyAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    mitigations<T extends SafetyAlert$mitigationsArgs<ExtArgs> = {}>(args?: Subset<T, SafetyAlert$mitigationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findMany"> | Null>
    escalations<T extends SafetyAlert$escalationsArgs<ExtArgs> = {}>(args?: Subset<T, SafetyAlert$escalationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the SafetyAlert model
   */ 
  interface SafetyAlertFieldRefs {
    readonly id: FieldRef<"SafetyAlert", 'String'>
    readonly sessionId: FieldRef<"SafetyAlert", 'String'>
    readonly severity: FieldRef<"SafetyAlert", 'SafetySeverity'>
    readonly category: FieldRef<"SafetyAlert", 'SafetyCategory'>
    readonly anonymizedReason: FieldRef<"SafetyAlert", 'String'>
    readonly transcriptChunk: FieldRef<"SafetyAlert", 'String'>
    readonly isResolved: FieldRef<"SafetyAlert", 'Boolean'>
    readonly createdAt: FieldRef<"SafetyAlert", 'DateTime'>
    readonly updatedAt: FieldRef<"SafetyAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyAlert findUnique
   */
  export type SafetyAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert findUniqueOrThrow
   */
  export type SafetyAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert findFirst
   */
  export type SafetyAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAlerts.
     */
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert findFirstOrThrow
   */
  export type SafetyAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter, which SafetyAlert to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAlerts.
     */
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert findMany
   */
  export type SafetyAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter, which SafetyAlerts to fetch.
     */
    where?: SafetyAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAlerts to fetch.
     */
    orderBy?: SafetyAlertOrderByWithRelationInput | SafetyAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyAlerts.
     */
    cursor?: SafetyAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAlerts.
     */
    skip?: number
    distinct?: SafetyAlertScalarFieldEnum | SafetyAlertScalarFieldEnum[]
  }

  /**
   * SafetyAlert create
   */
  export type SafetyAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * The data needed to create a SafetyAlert.
     */
    data: XOR<SafetyAlertCreateInput, SafetyAlertUncheckedCreateInput>
  }

  /**
   * SafetyAlert createMany
   */
  export type SafetyAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyAlerts.
     */
    data: SafetyAlertCreateManyInput | SafetyAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAlert createManyAndReturn
   */
  export type SafetyAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyAlerts.
     */
    data: SafetyAlertCreateManyInput | SafetyAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAlert update
   */
  export type SafetyAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * The data needed to update a SafetyAlert.
     */
    data: XOR<SafetyAlertUpdateInput, SafetyAlertUncheckedUpdateInput>
    /**
     * Choose, which SafetyAlert to update.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert updateMany
   */
  export type SafetyAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyAlerts.
     */
    data: XOR<SafetyAlertUpdateManyMutationInput, SafetyAlertUncheckedUpdateManyInput>
    /**
     * Filter which SafetyAlerts to update
     */
    where?: SafetyAlertWhereInput
  }

  /**
   * SafetyAlert upsert
   */
  export type SafetyAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * The filter to search for the SafetyAlert to update in case it exists.
     */
    where: SafetyAlertWhereUniqueInput
    /**
     * In case the SafetyAlert found by the `where` argument doesn't exist, create a new SafetyAlert with this data.
     */
    create: XOR<SafetyAlertCreateInput, SafetyAlertUncheckedCreateInput>
    /**
     * In case the SafetyAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyAlertUpdateInput, SafetyAlertUncheckedUpdateInput>
  }

  /**
   * SafetyAlert delete
   */
  export type SafetyAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    /**
     * Filter which SafetyAlert to delete.
     */
    where: SafetyAlertWhereUniqueInput
  }

  /**
   * SafetyAlert deleteMany
   */
  export type SafetyAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAlerts to delete
     */
    where?: SafetyAlertWhereInput
  }

  /**
   * SafetyAlert.mitigations
   */
  export type SafetyAlert$mitigationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    where?: SafetyMitigationWhereInput
    orderBy?: SafetyMitigationOrderByWithRelationInput | SafetyMitigationOrderByWithRelationInput[]
    cursor?: SafetyMitigationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SafetyMitigationScalarFieldEnum | SafetyMitigationScalarFieldEnum[]
  }

  /**
   * SafetyAlert.escalations
   */
  export type SafetyAlert$escalationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    where?: EscalationQueueWhereInput
    orderBy?: EscalationQueueOrderByWithRelationInput | EscalationQueueOrderByWithRelationInput[]
    cursor?: EscalationQueueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EscalationQueueScalarFieldEnum | EscalationQueueScalarFieldEnum[]
  }

  /**
   * SafetyAlert without action
   */
  export type SafetyAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
  }


  /**
   * Model SafetyMitigation
   */

  export type AggregateSafetyMitigation = {
    _count: SafetyMitigationCountAggregateOutputType | null
    _min: SafetyMitigationMinAggregateOutputType | null
    _max: SafetyMitigationMaxAggregateOutputType | null
  }

  export type SafetyMitigationMinAggregateOutputType = {
    id: string | null
    alertId: string | null
    action: $Enums.MitigationAction | null
    success: boolean | null
    createdAt: Date | null
  }

  export type SafetyMitigationMaxAggregateOutputType = {
    id: string | null
    alertId: string | null
    action: $Enums.MitigationAction | null
    success: boolean | null
    createdAt: Date | null
  }

  export type SafetyMitigationCountAggregateOutputType = {
    id: number
    alertId: number
    action: number
    success: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type SafetyMitigationMinAggregateInputType = {
    id?: true
    alertId?: true
    action?: true
    success?: true
    createdAt?: true
  }

  export type SafetyMitigationMaxAggregateInputType = {
    id?: true
    alertId?: true
    action?: true
    success?: true
    createdAt?: true
  }

  export type SafetyMitigationCountAggregateInputType = {
    id?: true
    alertId?: true
    action?: true
    success?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type SafetyMitigationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyMitigation to aggregate.
     */
    where?: SafetyMitigationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyMitigations to fetch.
     */
    orderBy?: SafetyMitigationOrderByWithRelationInput | SafetyMitigationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyMitigationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyMitigations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyMitigations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyMitigations
    **/
    _count?: true | SafetyMitigationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyMitigationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyMitigationMaxAggregateInputType
  }

  export type GetSafetyMitigationAggregateType<T extends SafetyMitigationAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyMitigation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyMitigation[P]>
      : GetScalarType<T[P], AggregateSafetyMitigation[P]>
  }




  export type SafetyMitigationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyMitigationWhereInput
    orderBy?: SafetyMitigationOrderByWithAggregationInput | SafetyMitigationOrderByWithAggregationInput[]
    by: SafetyMitigationScalarFieldEnum[] | SafetyMitigationScalarFieldEnum
    having?: SafetyMitigationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyMitigationCountAggregateInputType | true
    _min?: SafetyMitigationMinAggregateInputType
    _max?: SafetyMitigationMaxAggregateInputType
  }

  export type SafetyMitigationGroupByOutputType = {
    id: string
    alertId: string
    action: $Enums.MitigationAction
    success: boolean
    metadata: JsonValue | null
    createdAt: Date
    _count: SafetyMitigationCountAggregateOutputType | null
    _min: SafetyMitigationMinAggregateOutputType | null
    _max: SafetyMitigationMaxAggregateOutputType | null
  }

  type GetSafetyMitigationGroupByPayload<T extends SafetyMitigationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyMitigationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyMitigationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyMitigationGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyMitigationGroupByOutputType[P]>
        }
      >
    >


  export type SafetyMitigationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alertId?: boolean
    action?: boolean
    success?: boolean
    metadata?: boolean
    createdAt?: boolean
    alert?: boolean | SafetyAlertDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["safetyMitigation"]>

  export type SafetyMitigationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    alertId?: boolean
    action?: boolean
    success?: boolean
    metadata?: boolean
    createdAt?: boolean
    alert?: boolean | SafetyAlertDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["safetyMitigation"]>

  export type SafetyMitigationSelectScalar = {
    id?: boolean
    alertId?: boolean
    action?: boolean
    success?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type SafetyMitigationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alert?: boolean | SafetyAlertDefaultArgs<ExtArgs>
  }
  export type SafetyMitigationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alert?: boolean | SafetyAlertDefaultArgs<ExtArgs>
  }

  export type $SafetyMitigationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyMitigation"
    objects: {
      alert: Prisma.$SafetyAlertPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      alertId: string
      action: $Enums.MitigationAction
      success: boolean
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["safetyMitigation"]>
    composites: {}
  }

  type SafetyMitigationGetPayload<S extends boolean | null | undefined | SafetyMitigationDefaultArgs> = $Result.GetResult<Prisma.$SafetyMitigationPayload, S>

  type SafetyMitigationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyMitigationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyMitigationCountAggregateInputType | true
    }

  export interface SafetyMitigationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyMitigation'], meta: { name: 'SafetyMitigation' } }
    /**
     * Find zero or one SafetyMitigation that matches the filter.
     * @param {SafetyMitigationFindUniqueArgs} args - Arguments to find a SafetyMitigation
     * @example
     * // Get one SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyMitigationFindUniqueArgs>(args: SelectSubset<T, SafetyMitigationFindUniqueArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyMitigation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyMitigationFindUniqueOrThrowArgs} args - Arguments to find a SafetyMitigation
     * @example
     * // Get one SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyMitigationFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyMitigationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyMitigation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationFindFirstArgs} args - Arguments to find a SafetyMitigation
     * @example
     * // Get one SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyMitigationFindFirstArgs>(args?: SelectSubset<T, SafetyMitigationFindFirstArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyMitigation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationFindFirstOrThrowArgs} args - Arguments to find a SafetyMitigation
     * @example
     * // Get one SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyMitigationFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyMitigationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyMitigations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyMitigations
     * const safetyMitigations = await prisma.safetyMitigation.findMany()
     * 
     * // Get first 10 SafetyMitigations
     * const safetyMitigations = await prisma.safetyMitigation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyMitigationWithIdOnly = await prisma.safetyMitigation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyMitigationFindManyArgs>(args?: SelectSubset<T, SafetyMitigationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyMitigation.
     * @param {SafetyMitigationCreateArgs} args - Arguments to create a SafetyMitigation.
     * @example
     * // Create one SafetyMitigation
     * const SafetyMitigation = await prisma.safetyMitigation.create({
     *   data: {
     *     // ... data to create a SafetyMitigation
     *   }
     * })
     * 
     */
    create<T extends SafetyMitigationCreateArgs>(args: SelectSubset<T, SafetyMitigationCreateArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyMitigations.
     * @param {SafetyMitigationCreateManyArgs} args - Arguments to create many SafetyMitigations.
     * @example
     * // Create many SafetyMitigations
     * const safetyMitigation = await prisma.safetyMitigation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyMitigationCreateManyArgs>(args?: SelectSubset<T, SafetyMitigationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyMitigations and returns the data saved in the database.
     * @param {SafetyMitigationCreateManyAndReturnArgs} args - Arguments to create many SafetyMitigations.
     * @example
     * // Create many SafetyMitigations
     * const safetyMitigation = await prisma.safetyMitigation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyMitigations and only return the `id`
     * const safetyMitigationWithIdOnly = await prisma.safetyMitigation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyMitigationCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyMitigationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyMitigation.
     * @param {SafetyMitigationDeleteArgs} args - Arguments to delete one SafetyMitigation.
     * @example
     * // Delete one SafetyMitigation
     * const SafetyMitigation = await prisma.safetyMitigation.delete({
     *   where: {
     *     // ... filter to delete one SafetyMitigation
     *   }
     * })
     * 
     */
    delete<T extends SafetyMitigationDeleteArgs>(args: SelectSubset<T, SafetyMitigationDeleteArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyMitigation.
     * @param {SafetyMitigationUpdateArgs} args - Arguments to update one SafetyMitigation.
     * @example
     * // Update one SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyMitigationUpdateArgs>(args: SelectSubset<T, SafetyMitigationUpdateArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyMitigations.
     * @param {SafetyMitigationDeleteManyArgs} args - Arguments to filter SafetyMitigations to delete.
     * @example
     * // Delete a few SafetyMitigations
     * const { count } = await prisma.safetyMitigation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyMitigationDeleteManyArgs>(args?: SelectSubset<T, SafetyMitigationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyMitigations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyMitigations
     * const safetyMitigation = await prisma.safetyMitigation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyMitigationUpdateManyArgs>(args: SelectSubset<T, SafetyMitigationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyMitigation.
     * @param {SafetyMitigationUpsertArgs} args - Arguments to update or create a SafetyMitigation.
     * @example
     * // Update or create a SafetyMitigation
     * const safetyMitigation = await prisma.safetyMitigation.upsert({
     *   create: {
     *     // ... data to create a SafetyMitigation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyMitigation we want to update
     *   }
     * })
     */
    upsert<T extends SafetyMitigationUpsertArgs>(args: SelectSubset<T, SafetyMitigationUpsertArgs<ExtArgs>>): Prisma__SafetyMitigationClient<$Result.GetResult<Prisma.$SafetyMitigationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyMitigations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationCountArgs} args - Arguments to filter SafetyMitigations to count.
     * @example
     * // Count the number of SafetyMitigations
     * const count = await prisma.safetyMitigation.count({
     *   where: {
     *     // ... the filter for the SafetyMitigations we want to count
     *   }
     * })
    **/
    count<T extends SafetyMitigationCountArgs>(
      args?: Subset<T, SafetyMitigationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyMitigationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyMitigation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SafetyMitigationAggregateArgs>(args: Subset<T, SafetyMitigationAggregateArgs>): Prisma.PrismaPromise<GetSafetyMitigationAggregateType<T>>

    /**
     * Group by SafetyMitigation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyMitigationGroupByArgs} args - Group by arguments.
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
      T extends SafetyMitigationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyMitigationGroupByArgs['orderBy'] }
        : { orderBy?: SafetyMitigationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SafetyMitigationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyMitigationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyMitigation model
   */
  readonly fields: SafetyMitigationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyMitigation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyMitigationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alert<T extends SafetyAlertDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SafetyAlertDefaultArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the SafetyMitigation model
   */ 
  interface SafetyMitigationFieldRefs {
    readonly id: FieldRef<"SafetyMitigation", 'String'>
    readonly alertId: FieldRef<"SafetyMitigation", 'String'>
    readonly action: FieldRef<"SafetyMitigation", 'MitigationAction'>
    readonly success: FieldRef<"SafetyMitigation", 'Boolean'>
    readonly metadata: FieldRef<"SafetyMitigation", 'Json'>
    readonly createdAt: FieldRef<"SafetyMitigation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyMitigation findUnique
   */
  export type SafetyMitigationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter, which SafetyMitigation to fetch.
     */
    where: SafetyMitigationWhereUniqueInput
  }

  /**
   * SafetyMitigation findUniqueOrThrow
   */
  export type SafetyMitigationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter, which SafetyMitigation to fetch.
     */
    where: SafetyMitigationWhereUniqueInput
  }

  /**
   * SafetyMitigation findFirst
   */
  export type SafetyMitigationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter, which SafetyMitigation to fetch.
     */
    where?: SafetyMitigationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyMitigations to fetch.
     */
    orderBy?: SafetyMitigationOrderByWithRelationInput | SafetyMitigationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyMitigations.
     */
    cursor?: SafetyMitigationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyMitigations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyMitigations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyMitigations.
     */
    distinct?: SafetyMitigationScalarFieldEnum | SafetyMitigationScalarFieldEnum[]
  }

  /**
   * SafetyMitigation findFirstOrThrow
   */
  export type SafetyMitigationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter, which SafetyMitigation to fetch.
     */
    where?: SafetyMitigationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyMitigations to fetch.
     */
    orderBy?: SafetyMitigationOrderByWithRelationInput | SafetyMitigationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyMitigations.
     */
    cursor?: SafetyMitigationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyMitigations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyMitigations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyMitigations.
     */
    distinct?: SafetyMitigationScalarFieldEnum | SafetyMitigationScalarFieldEnum[]
  }

  /**
   * SafetyMitigation findMany
   */
  export type SafetyMitigationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter, which SafetyMitigations to fetch.
     */
    where?: SafetyMitigationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyMitigations to fetch.
     */
    orderBy?: SafetyMitigationOrderByWithRelationInput | SafetyMitigationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyMitigations.
     */
    cursor?: SafetyMitigationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyMitigations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyMitigations.
     */
    skip?: number
    distinct?: SafetyMitigationScalarFieldEnum | SafetyMitigationScalarFieldEnum[]
  }

  /**
   * SafetyMitigation create
   */
  export type SafetyMitigationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * The data needed to create a SafetyMitigation.
     */
    data: XOR<SafetyMitigationCreateInput, SafetyMitigationUncheckedCreateInput>
  }

  /**
   * SafetyMitigation createMany
   */
  export type SafetyMitigationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyMitigations.
     */
    data: SafetyMitigationCreateManyInput | SafetyMitigationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyMitigation createManyAndReturn
   */
  export type SafetyMitigationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyMitigations.
     */
    data: SafetyMitigationCreateManyInput | SafetyMitigationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SafetyMitigation update
   */
  export type SafetyMitigationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * The data needed to update a SafetyMitigation.
     */
    data: XOR<SafetyMitigationUpdateInput, SafetyMitigationUncheckedUpdateInput>
    /**
     * Choose, which SafetyMitigation to update.
     */
    where: SafetyMitigationWhereUniqueInput
  }

  /**
   * SafetyMitigation updateMany
   */
  export type SafetyMitigationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyMitigations.
     */
    data: XOR<SafetyMitigationUpdateManyMutationInput, SafetyMitigationUncheckedUpdateManyInput>
    /**
     * Filter which SafetyMitigations to update
     */
    where?: SafetyMitigationWhereInput
  }

  /**
   * SafetyMitigation upsert
   */
  export type SafetyMitigationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * The filter to search for the SafetyMitigation to update in case it exists.
     */
    where: SafetyMitigationWhereUniqueInput
    /**
     * In case the SafetyMitigation found by the `where` argument doesn't exist, create a new SafetyMitigation with this data.
     */
    create: XOR<SafetyMitigationCreateInput, SafetyMitigationUncheckedCreateInput>
    /**
     * In case the SafetyMitigation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyMitigationUpdateInput, SafetyMitigationUncheckedUpdateInput>
  }

  /**
   * SafetyMitigation delete
   */
  export type SafetyMitigationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
    /**
     * Filter which SafetyMitigation to delete.
     */
    where: SafetyMitigationWhereUniqueInput
  }

  /**
   * SafetyMitigation deleteMany
   */
  export type SafetyMitigationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyMitigations to delete
     */
    where?: SafetyMitigationWhereInput
  }

  /**
   * SafetyMitigation without action
   */
  export type SafetyMitigationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyMitigation
     */
    select?: SafetyMitigationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyMitigationInclude<ExtArgs> | null
  }


  /**
   * Model SafetyStrike
   */

  export type AggregateSafetyStrike = {
    _count: SafetyStrikeCountAggregateOutputType | null
    _avg: SafetyStrikeAvgAggregateOutputType | null
    _sum: SafetyStrikeSumAggregateOutputType | null
    _min: SafetyStrikeMinAggregateOutputType | null
    _max: SafetyStrikeMaxAggregateOutputType | null
  }

  export type SafetyStrikeAvgAggregateOutputType = {
    count: number | null
  }

  export type SafetyStrikeSumAggregateOutputType = {
    count: number | null
  }

  export type SafetyStrikeMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    participantId: string | null
    count: number | null
    lastStrikeAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyStrikeMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    participantId: string | null
    count: number | null
    lastStrikeAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyStrikeCountAggregateOutputType = {
    id: number
    sessionId: number
    participantId: number
    count: number
    lastStrikeAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SafetyStrikeAvgAggregateInputType = {
    count?: true
  }

  export type SafetyStrikeSumAggregateInputType = {
    count?: true
  }

  export type SafetyStrikeMinAggregateInputType = {
    id?: true
    sessionId?: true
    participantId?: true
    count?: true
    lastStrikeAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyStrikeMaxAggregateInputType = {
    id?: true
    sessionId?: true
    participantId?: true
    count?: true
    lastStrikeAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyStrikeCountAggregateInputType = {
    id?: true
    sessionId?: true
    participantId?: true
    count?: true
    lastStrikeAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SafetyStrikeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyStrike to aggregate.
     */
    where?: SafetyStrikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyStrikes to fetch.
     */
    orderBy?: SafetyStrikeOrderByWithRelationInput | SafetyStrikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyStrikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyStrikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyStrikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyStrikes
    **/
    _count?: true | SafetyStrikeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SafetyStrikeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SafetyStrikeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyStrikeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyStrikeMaxAggregateInputType
  }

  export type GetSafetyStrikeAggregateType<T extends SafetyStrikeAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyStrike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyStrike[P]>
      : GetScalarType<T[P], AggregateSafetyStrike[P]>
  }




  export type SafetyStrikeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyStrikeWhereInput
    orderBy?: SafetyStrikeOrderByWithAggregationInput | SafetyStrikeOrderByWithAggregationInput[]
    by: SafetyStrikeScalarFieldEnum[] | SafetyStrikeScalarFieldEnum
    having?: SafetyStrikeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyStrikeCountAggregateInputType | true
    _avg?: SafetyStrikeAvgAggregateInputType
    _sum?: SafetyStrikeSumAggregateInputType
    _min?: SafetyStrikeMinAggregateInputType
    _max?: SafetyStrikeMaxAggregateInputType
  }

  export type SafetyStrikeGroupByOutputType = {
    id: string
    sessionId: string
    participantId: string
    count: number
    lastStrikeAt: Date
    createdAt: Date
    updatedAt: Date
    _count: SafetyStrikeCountAggregateOutputType | null
    _avg: SafetyStrikeAvgAggregateOutputType | null
    _sum: SafetyStrikeSumAggregateOutputType | null
    _min: SafetyStrikeMinAggregateOutputType | null
    _max: SafetyStrikeMaxAggregateOutputType | null
  }

  type GetSafetyStrikeGroupByPayload<T extends SafetyStrikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyStrikeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyStrikeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyStrikeGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyStrikeGroupByOutputType[P]>
        }
      >
    >


  export type SafetyStrikeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    participantId?: boolean
    count?: boolean
    lastStrikeAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyStrike"]>

  export type SafetyStrikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    participantId?: boolean
    count?: boolean
    lastStrikeAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyStrike"]>

  export type SafetyStrikeSelectScalar = {
    id?: boolean
    sessionId?: boolean
    participantId?: boolean
    count?: boolean
    lastStrikeAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SafetyStrikePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyStrike"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      participantId: string
      count: number
      lastStrikeAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["safetyStrike"]>
    composites: {}
  }

  type SafetyStrikeGetPayload<S extends boolean | null | undefined | SafetyStrikeDefaultArgs> = $Result.GetResult<Prisma.$SafetyStrikePayload, S>

  type SafetyStrikeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyStrikeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyStrikeCountAggregateInputType | true
    }

  export interface SafetyStrikeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyStrike'], meta: { name: 'SafetyStrike' } }
    /**
     * Find zero or one SafetyStrike that matches the filter.
     * @param {SafetyStrikeFindUniqueArgs} args - Arguments to find a SafetyStrike
     * @example
     * // Get one SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyStrikeFindUniqueArgs>(args: SelectSubset<T, SafetyStrikeFindUniqueArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyStrike that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyStrikeFindUniqueOrThrowArgs} args - Arguments to find a SafetyStrike
     * @example
     * // Get one SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyStrikeFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyStrikeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyStrike that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeFindFirstArgs} args - Arguments to find a SafetyStrike
     * @example
     * // Get one SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyStrikeFindFirstArgs>(args?: SelectSubset<T, SafetyStrikeFindFirstArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyStrike that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeFindFirstOrThrowArgs} args - Arguments to find a SafetyStrike
     * @example
     * // Get one SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyStrikeFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyStrikeFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyStrikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyStrikes
     * const safetyStrikes = await prisma.safetyStrike.findMany()
     * 
     * // Get first 10 SafetyStrikes
     * const safetyStrikes = await prisma.safetyStrike.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyStrikeWithIdOnly = await prisma.safetyStrike.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyStrikeFindManyArgs>(args?: SelectSubset<T, SafetyStrikeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyStrike.
     * @param {SafetyStrikeCreateArgs} args - Arguments to create a SafetyStrike.
     * @example
     * // Create one SafetyStrike
     * const SafetyStrike = await prisma.safetyStrike.create({
     *   data: {
     *     // ... data to create a SafetyStrike
     *   }
     * })
     * 
     */
    create<T extends SafetyStrikeCreateArgs>(args: SelectSubset<T, SafetyStrikeCreateArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyStrikes.
     * @param {SafetyStrikeCreateManyArgs} args - Arguments to create many SafetyStrikes.
     * @example
     * // Create many SafetyStrikes
     * const safetyStrike = await prisma.safetyStrike.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyStrikeCreateManyArgs>(args?: SelectSubset<T, SafetyStrikeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyStrikes and returns the data saved in the database.
     * @param {SafetyStrikeCreateManyAndReturnArgs} args - Arguments to create many SafetyStrikes.
     * @example
     * // Create many SafetyStrikes
     * const safetyStrike = await prisma.safetyStrike.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyStrikes and only return the `id`
     * const safetyStrikeWithIdOnly = await prisma.safetyStrike.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyStrikeCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyStrikeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyStrike.
     * @param {SafetyStrikeDeleteArgs} args - Arguments to delete one SafetyStrike.
     * @example
     * // Delete one SafetyStrike
     * const SafetyStrike = await prisma.safetyStrike.delete({
     *   where: {
     *     // ... filter to delete one SafetyStrike
     *   }
     * })
     * 
     */
    delete<T extends SafetyStrikeDeleteArgs>(args: SelectSubset<T, SafetyStrikeDeleteArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyStrike.
     * @param {SafetyStrikeUpdateArgs} args - Arguments to update one SafetyStrike.
     * @example
     * // Update one SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyStrikeUpdateArgs>(args: SelectSubset<T, SafetyStrikeUpdateArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyStrikes.
     * @param {SafetyStrikeDeleteManyArgs} args - Arguments to filter SafetyStrikes to delete.
     * @example
     * // Delete a few SafetyStrikes
     * const { count } = await prisma.safetyStrike.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyStrikeDeleteManyArgs>(args?: SelectSubset<T, SafetyStrikeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyStrikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyStrikes
     * const safetyStrike = await prisma.safetyStrike.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyStrikeUpdateManyArgs>(args: SelectSubset<T, SafetyStrikeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyStrike.
     * @param {SafetyStrikeUpsertArgs} args - Arguments to update or create a SafetyStrike.
     * @example
     * // Update or create a SafetyStrike
     * const safetyStrike = await prisma.safetyStrike.upsert({
     *   create: {
     *     // ... data to create a SafetyStrike
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyStrike we want to update
     *   }
     * })
     */
    upsert<T extends SafetyStrikeUpsertArgs>(args: SelectSubset<T, SafetyStrikeUpsertArgs<ExtArgs>>): Prisma__SafetyStrikeClient<$Result.GetResult<Prisma.$SafetyStrikePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyStrikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeCountArgs} args - Arguments to filter SafetyStrikes to count.
     * @example
     * // Count the number of SafetyStrikes
     * const count = await prisma.safetyStrike.count({
     *   where: {
     *     // ... the filter for the SafetyStrikes we want to count
     *   }
     * })
    **/
    count<T extends SafetyStrikeCountArgs>(
      args?: Subset<T, SafetyStrikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyStrikeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyStrike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SafetyStrikeAggregateArgs>(args: Subset<T, SafetyStrikeAggregateArgs>): Prisma.PrismaPromise<GetSafetyStrikeAggregateType<T>>

    /**
     * Group by SafetyStrike.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyStrikeGroupByArgs} args - Group by arguments.
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
      T extends SafetyStrikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyStrikeGroupByArgs['orderBy'] }
        : { orderBy?: SafetyStrikeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SafetyStrikeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyStrikeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyStrike model
   */
  readonly fields: SafetyStrikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyStrike.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyStrikeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SafetyStrike model
   */ 
  interface SafetyStrikeFieldRefs {
    readonly id: FieldRef<"SafetyStrike", 'String'>
    readonly sessionId: FieldRef<"SafetyStrike", 'String'>
    readonly participantId: FieldRef<"SafetyStrike", 'String'>
    readonly count: FieldRef<"SafetyStrike", 'Int'>
    readonly lastStrikeAt: FieldRef<"SafetyStrike", 'DateTime'>
    readonly createdAt: FieldRef<"SafetyStrike", 'DateTime'>
    readonly updatedAt: FieldRef<"SafetyStrike", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyStrike findUnique
   */
  export type SafetyStrikeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter, which SafetyStrike to fetch.
     */
    where: SafetyStrikeWhereUniqueInput
  }

  /**
   * SafetyStrike findUniqueOrThrow
   */
  export type SafetyStrikeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter, which SafetyStrike to fetch.
     */
    where: SafetyStrikeWhereUniqueInput
  }

  /**
   * SafetyStrike findFirst
   */
  export type SafetyStrikeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter, which SafetyStrike to fetch.
     */
    where?: SafetyStrikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyStrikes to fetch.
     */
    orderBy?: SafetyStrikeOrderByWithRelationInput | SafetyStrikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyStrikes.
     */
    cursor?: SafetyStrikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyStrikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyStrikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyStrikes.
     */
    distinct?: SafetyStrikeScalarFieldEnum | SafetyStrikeScalarFieldEnum[]
  }

  /**
   * SafetyStrike findFirstOrThrow
   */
  export type SafetyStrikeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter, which SafetyStrike to fetch.
     */
    where?: SafetyStrikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyStrikes to fetch.
     */
    orderBy?: SafetyStrikeOrderByWithRelationInput | SafetyStrikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyStrikes.
     */
    cursor?: SafetyStrikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyStrikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyStrikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyStrikes.
     */
    distinct?: SafetyStrikeScalarFieldEnum | SafetyStrikeScalarFieldEnum[]
  }

  /**
   * SafetyStrike findMany
   */
  export type SafetyStrikeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter, which SafetyStrikes to fetch.
     */
    where?: SafetyStrikeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyStrikes to fetch.
     */
    orderBy?: SafetyStrikeOrderByWithRelationInput | SafetyStrikeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyStrikes.
     */
    cursor?: SafetyStrikeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyStrikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyStrikes.
     */
    skip?: number
    distinct?: SafetyStrikeScalarFieldEnum | SafetyStrikeScalarFieldEnum[]
  }

  /**
   * SafetyStrike create
   */
  export type SafetyStrikeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * The data needed to create a SafetyStrike.
     */
    data: XOR<SafetyStrikeCreateInput, SafetyStrikeUncheckedCreateInput>
  }

  /**
   * SafetyStrike createMany
   */
  export type SafetyStrikeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyStrikes.
     */
    data: SafetyStrikeCreateManyInput | SafetyStrikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyStrike createManyAndReturn
   */
  export type SafetyStrikeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyStrikes.
     */
    data: SafetyStrikeCreateManyInput | SafetyStrikeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyStrike update
   */
  export type SafetyStrikeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * The data needed to update a SafetyStrike.
     */
    data: XOR<SafetyStrikeUpdateInput, SafetyStrikeUncheckedUpdateInput>
    /**
     * Choose, which SafetyStrike to update.
     */
    where: SafetyStrikeWhereUniqueInput
  }

  /**
   * SafetyStrike updateMany
   */
  export type SafetyStrikeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyStrikes.
     */
    data: XOR<SafetyStrikeUpdateManyMutationInput, SafetyStrikeUncheckedUpdateManyInput>
    /**
     * Filter which SafetyStrikes to update
     */
    where?: SafetyStrikeWhereInput
  }

  /**
   * SafetyStrike upsert
   */
  export type SafetyStrikeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * The filter to search for the SafetyStrike to update in case it exists.
     */
    where: SafetyStrikeWhereUniqueInput
    /**
     * In case the SafetyStrike found by the `where` argument doesn't exist, create a new SafetyStrike with this data.
     */
    create: XOR<SafetyStrikeCreateInput, SafetyStrikeUncheckedCreateInput>
    /**
     * In case the SafetyStrike was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyStrikeUpdateInput, SafetyStrikeUncheckedUpdateInput>
  }

  /**
   * SafetyStrike delete
   */
  export type SafetyStrikeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
    /**
     * Filter which SafetyStrike to delete.
     */
    where: SafetyStrikeWhereUniqueInput
  }

  /**
   * SafetyStrike deleteMany
   */
  export type SafetyStrikeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyStrikes to delete
     */
    where?: SafetyStrikeWhereInput
  }

  /**
   * SafetyStrike without action
   */
  export type SafetyStrikeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyStrike
     */
    select?: SafetyStrikeSelect<ExtArgs> | null
  }


  /**
   * Model SafetyAuditLog
   */

  export type AggregateSafetyAuditLog = {
    _count: SafetyAuditLogCountAggregateOutputType | null
    _min: SafetyAuditLogMinAggregateOutputType | null
    _max: SafetyAuditLogMaxAggregateOutputType | null
  }

  export type SafetyAuditLogMinAggregateOutputType = {
    id: string | null
    action: string | null
    actor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyAuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    actor: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SafetyAuditLogCountAggregateOutputType = {
    id: number
    action: number
    actor: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SafetyAuditLogMinAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyAuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SafetyAuditLogCountAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SafetyAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAuditLog to aggregate.
     */
    where?: SafetyAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAuditLogs to fetch.
     */
    orderBy?: SafetyAuditLogOrderByWithRelationInput | SafetyAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SafetyAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SafetyAuditLogs
    **/
    _count?: true | SafetyAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SafetyAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SafetyAuditLogMaxAggregateInputType
  }

  export type GetSafetyAuditLogAggregateType<T extends SafetyAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSafetyAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSafetyAuditLog[P]>
      : GetScalarType<T[P], AggregateSafetyAuditLog[P]>
  }




  export type SafetyAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SafetyAuditLogWhereInput
    orderBy?: SafetyAuditLogOrderByWithAggregationInput | SafetyAuditLogOrderByWithAggregationInput[]
    by: SafetyAuditLogScalarFieldEnum[] | SafetyAuditLogScalarFieldEnum
    having?: SafetyAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SafetyAuditLogCountAggregateInputType | true
    _min?: SafetyAuditLogMinAggregateInputType
    _max?: SafetyAuditLogMaxAggregateInputType
  }

  export type SafetyAuditLogGroupByOutputType = {
    id: string
    action: string
    actor: string
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SafetyAuditLogCountAggregateOutputType | null
    _min: SafetyAuditLogMinAggregateOutputType | null
    _max: SafetyAuditLogMaxAggregateOutputType | null
  }

  type GetSafetyAuditLogGroupByPayload<T extends SafetyAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SafetyAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SafetyAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SafetyAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], SafetyAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type SafetyAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actor?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyAuditLog"]>

  export type SafetyAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actor?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["safetyAuditLog"]>

  export type SafetyAuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    actor?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $SafetyAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      action: string
      actor: string
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["safetyAuditLog"]>
    composites: {}
  }

  type SafetyAuditLogGetPayload<S extends boolean | null | undefined | SafetyAuditLogDefaultArgs> = $Result.GetResult<Prisma.$SafetyAuditLogPayload, S>

  type SafetyAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SafetyAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SafetyAuditLogCountAggregateInputType | true
    }

  export interface SafetyAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SafetyAuditLog'], meta: { name: 'SafetyAuditLog' } }
    /**
     * Find zero or one SafetyAuditLog that matches the filter.
     * @param {SafetyAuditLogFindUniqueArgs} args - Arguments to find a SafetyAuditLog
     * @example
     * // Get one SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SafetyAuditLogFindUniqueArgs>(args: SelectSubset<T, SafetyAuditLogFindUniqueArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SafetyAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SafetyAuditLogFindUniqueOrThrowArgs} args - Arguments to find a SafetyAuditLog
     * @example
     * // Get one SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SafetyAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SafetyAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SafetyAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogFindFirstArgs} args - Arguments to find a SafetyAuditLog
     * @example
     * // Get one SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SafetyAuditLogFindFirstArgs>(args?: SelectSubset<T, SafetyAuditLogFindFirstArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SafetyAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogFindFirstOrThrowArgs} args - Arguments to find a SafetyAuditLog
     * @example
     * // Get one SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SafetyAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SafetyAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SafetyAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SafetyAuditLogs
     * const safetyAuditLogs = await prisma.safetyAuditLog.findMany()
     * 
     * // Get first 10 SafetyAuditLogs
     * const safetyAuditLogs = await prisma.safetyAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const safetyAuditLogWithIdOnly = await prisma.safetyAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SafetyAuditLogFindManyArgs>(args?: SelectSubset<T, SafetyAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SafetyAuditLog.
     * @param {SafetyAuditLogCreateArgs} args - Arguments to create a SafetyAuditLog.
     * @example
     * // Create one SafetyAuditLog
     * const SafetyAuditLog = await prisma.safetyAuditLog.create({
     *   data: {
     *     // ... data to create a SafetyAuditLog
     *   }
     * })
     * 
     */
    create<T extends SafetyAuditLogCreateArgs>(args: SelectSubset<T, SafetyAuditLogCreateArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SafetyAuditLogs.
     * @param {SafetyAuditLogCreateManyArgs} args - Arguments to create many SafetyAuditLogs.
     * @example
     * // Create many SafetyAuditLogs
     * const safetyAuditLog = await prisma.safetyAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SafetyAuditLogCreateManyArgs>(args?: SelectSubset<T, SafetyAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SafetyAuditLogs and returns the data saved in the database.
     * @param {SafetyAuditLogCreateManyAndReturnArgs} args - Arguments to create many SafetyAuditLogs.
     * @example
     * // Create many SafetyAuditLogs
     * const safetyAuditLog = await prisma.safetyAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SafetyAuditLogs and only return the `id`
     * const safetyAuditLogWithIdOnly = await prisma.safetyAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SafetyAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SafetyAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SafetyAuditLog.
     * @param {SafetyAuditLogDeleteArgs} args - Arguments to delete one SafetyAuditLog.
     * @example
     * // Delete one SafetyAuditLog
     * const SafetyAuditLog = await prisma.safetyAuditLog.delete({
     *   where: {
     *     // ... filter to delete one SafetyAuditLog
     *   }
     * })
     * 
     */
    delete<T extends SafetyAuditLogDeleteArgs>(args: SelectSubset<T, SafetyAuditLogDeleteArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SafetyAuditLog.
     * @param {SafetyAuditLogUpdateArgs} args - Arguments to update one SafetyAuditLog.
     * @example
     * // Update one SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SafetyAuditLogUpdateArgs>(args: SelectSubset<T, SafetyAuditLogUpdateArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SafetyAuditLogs.
     * @param {SafetyAuditLogDeleteManyArgs} args - Arguments to filter SafetyAuditLogs to delete.
     * @example
     * // Delete a few SafetyAuditLogs
     * const { count } = await prisma.safetyAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SafetyAuditLogDeleteManyArgs>(args?: SelectSubset<T, SafetyAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SafetyAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SafetyAuditLogs
     * const safetyAuditLog = await prisma.safetyAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SafetyAuditLogUpdateManyArgs>(args: SelectSubset<T, SafetyAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SafetyAuditLog.
     * @param {SafetyAuditLogUpsertArgs} args - Arguments to update or create a SafetyAuditLog.
     * @example
     * // Update or create a SafetyAuditLog
     * const safetyAuditLog = await prisma.safetyAuditLog.upsert({
     *   create: {
     *     // ... data to create a SafetyAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SafetyAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends SafetyAuditLogUpsertArgs>(args: SelectSubset<T, SafetyAuditLogUpsertArgs<ExtArgs>>): Prisma__SafetyAuditLogClient<$Result.GetResult<Prisma.$SafetyAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SafetyAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogCountArgs} args - Arguments to filter SafetyAuditLogs to count.
     * @example
     * // Count the number of SafetyAuditLogs
     * const count = await prisma.safetyAuditLog.count({
     *   where: {
     *     // ... the filter for the SafetyAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends SafetyAuditLogCountArgs>(
      args?: Subset<T, SafetyAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SafetyAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SafetyAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SafetyAuditLogAggregateArgs>(args: Subset<T, SafetyAuditLogAggregateArgs>): Prisma.PrismaPromise<GetSafetyAuditLogAggregateType<T>>

    /**
     * Group by SafetyAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SafetyAuditLogGroupByArgs} args - Group by arguments.
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
      T extends SafetyAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SafetyAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: SafetyAuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SafetyAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSafetyAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SafetyAuditLog model
   */
  readonly fields: SafetyAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SafetyAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SafetyAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SafetyAuditLog model
   */ 
  interface SafetyAuditLogFieldRefs {
    readonly id: FieldRef<"SafetyAuditLog", 'String'>
    readonly action: FieldRef<"SafetyAuditLog", 'String'>
    readonly actor: FieldRef<"SafetyAuditLog", 'String'>
    readonly metadata: FieldRef<"SafetyAuditLog", 'Json'>
    readonly createdAt: FieldRef<"SafetyAuditLog", 'DateTime'>
    readonly updatedAt: FieldRef<"SafetyAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SafetyAuditLog findUnique
   */
  export type SafetyAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAuditLog to fetch.
     */
    where: SafetyAuditLogWhereUniqueInput
  }

  /**
   * SafetyAuditLog findUniqueOrThrow
   */
  export type SafetyAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAuditLog to fetch.
     */
    where: SafetyAuditLogWhereUniqueInput
  }

  /**
   * SafetyAuditLog findFirst
   */
  export type SafetyAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAuditLog to fetch.
     */
    where?: SafetyAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAuditLogs to fetch.
     */
    orderBy?: SafetyAuditLogOrderByWithRelationInput | SafetyAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAuditLogs.
     */
    cursor?: SafetyAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAuditLogs.
     */
    distinct?: SafetyAuditLogScalarFieldEnum | SafetyAuditLogScalarFieldEnum[]
  }

  /**
   * SafetyAuditLog findFirstOrThrow
   */
  export type SafetyAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAuditLog to fetch.
     */
    where?: SafetyAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAuditLogs to fetch.
     */
    orderBy?: SafetyAuditLogOrderByWithRelationInput | SafetyAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SafetyAuditLogs.
     */
    cursor?: SafetyAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SafetyAuditLogs.
     */
    distinct?: SafetyAuditLogScalarFieldEnum | SafetyAuditLogScalarFieldEnum[]
  }

  /**
   * SafetyAuditLog findMany
   */
  export type SafetyAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which SafetyAuditLogs to fetch.
     */
    where?: SafetyAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SafetyAuditLogs to fetch.
     */
    orderBy?: SafetyAuditLogOrderByWithRelationInput | SafetyAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SafetyAuditLogs.
     */
    cursor?: SafetyAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SafetyAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SafetyAuditLogs.
     */
    skip?: number
    distinct?: SafetyAuditLogScalarFieldEnum | SafetyAuditLogScalarFieldEnum[]
  }

  /**
   * SafetyAuditLog create
   */
  export type SafetyAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a SafetyAuditLog.
     */
    data: XOR<SafetyAuditLogCreateInput, SafetyAuditLogUncheckedCreateInput>
  }

  /**
   * SafetyAuditLog createMany
   */
  export type SafetyAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SafetyAuditLogs.
     */
    data: SafetyAuditLogCreateManyInput | SafetyAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAuditLog createManyAndReturn
   */
  export type SafetyAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SafetyAuditLogs.
     */
    data: SafetyAuditLogCreateManyInput | SafetyAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SafetyAuditLog update
   */
  export type SafetyAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a SafetyAuditLog.
     */
    data: XOR<SafetyAuditLogUpdateInput, SafetyAuditLogUncheckedUpdateInput>
    /**
     * Choose, which SafetyAuditLog to update.
     */
    where: SafetyAuditLogWhereUniqueInput
  }

  /**
   * SafetyAuditLog updateMany
   */
  export type SafetyAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SafetyAuditLogs.
     */
    data: XOR<SafetyAuditLogUpdateManyMutationInput, SafetyAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which SafetyAuditLogs to update
     */
    where?: SafetyAuditLogWhereInput
  }

  /**
   * SafetyAuditLog upsert
   */
  export type SafetyAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the SafetyAuditLog to update in case it exists.
     */
    where: SafetyAuditLogWhereUniqueInput
    /**
     * In case the SafetyAuditLog found by the `where` argument doesn't exist, create a new SafetyAuditLog with this data.
     */
    create: XOR<SafetyAuditLogCreateInput, SafetyAuditLogUncheckedCreateInput>
    /**
     * In case the SafetyAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SafetyAuditLogUpdateInput, SafetyAuditLogUncheckedUpdateInput>
  }

  /**
   * SafetyAuditLog delete
   */
  export type SafetyAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
    /**
     * Filter which SafetyAuditLog to delete.
     */
    where: SafetyAuditLogWhereUniqueInput
  }

  /**
   * SafetyAuditLog deleteMany
   */
  export type SafetyAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SafetyAuditLogs to delete
     */
    where?: SafetyAuditLogWhereInput
  }

  /**
   * SafetyAuditLog without action
   */
  export type SafetyAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAuditLog
     */
    select?: SafetyAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model EscalationQueue
   */

  export type AggregateEscalationQueue = {
    _count: EscalationQueueCountAggregateOutputType | null
    _min: EscalationQueueMinAggregateOutputType | null
    _max: EscalationQueueMaxAggregateOutputType | null
  }

  export type EscalationQueueMinAggregateOutputType = {
    id: string | null
    sessionRef: string | null
    level: $Enums.EscalationLevel | null
    source: $Enums.EscalationSource | null
    summary: string | null
    status: $Enums.EscalationStatus | null
    reviewerHandle: string | null
    createdAt: Date | null
    updatedAt: Date | null
    alertId: string | null
  }

  export type EscalationQueueMaxAggregateOutputType = {
    id: string | null
    sessionRef: string | null
    level: $Enums.EscalationLevel | null
    source: $Enums.EscalationSource | null
    summary: string | null
    status: $Enums.EscalationStatus | null
    reviewerHandle: string | null
    createdAt: Date | null
    updatedAt: Date | null
    alertId: string | null
  }

  export type EscalationQueueCountAggregateOutputType = {
    id: number
    sessionRef: number
    level: number
    source: number
    summary: number
    status: number
    reviewerHandle: number
    createdAt: number
    updatedAt: number
    alertId: number
    _all: number
  }


  export type EscalationQueueMinAggregateInputType = {
    id?: true
    sessionRef?: true
    level?: true
    source?: true
    summary?: true
    status?: true
    reviewerHandle?: true
    createdAt?: true
    updatedAt?: true
    alertId?: true
  }

  export type EscalationQueueMaxAggregateInputType = {
    id?: true
    sessionRef?: true
    level?: true
    source?: true
    summary?: true
    status?: true
    reviewerHandle?: true
    createdAt?: true
    updatedAt?: true
    alertId?: true
  }

  export type EscalationQueueCountAggregateInputType = {
    id?: true
    sessionRef?: true
    level?: true
    source?: true
    summary?: true
    status?: true
    reviewerHandle?: true
    createdAt?: true
    updatedAt?: true
    alertId?: true
    _all?: true
  }

  export type EscalationQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EscalationQueue to aggregate.
     */
    where?: EscalationQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscalationQueues to fetch.
     */
    orderBy?: EscalationQueueOrderByWithRelationInput | EscalationQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EscalationQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscalationQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscalationQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EscalationQueues
    **/
    _count?: true | EscalationQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EscalationQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EscalationQueueMaxAggregateInputType
  }

  export type GetEscalationQueueAggregateType<T extends EscalationQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateEscalationQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEscalationQueue[P]>
      : GetScalarType<T[P], AggregateEscalationQueue[P]>
  }




  export type EscalationQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EscalationQueueWhereInput
    orderBy?: EscalationQueueOrderByWithAggregationInput | EscalationQueueOrderByWithAggregationInput[]
    by: EscalationQueueScalarFieldEnum[] | EscalationQueueScalarFieldEnum
    having?: EscalationQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EscalationQueueCountAggregateInputType | true
    _min?: EscalationQueueMinAggregateInputType
    _max?: EscalationQueueMaxAggregateInputType
  }

  export type EscalationQueueGroupByOutputType = {
    id: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status: $Enums.EscalationStatus
    reviewerHandle: string | null
    createdAt: Date
    updatedAt: Date
    alertId: string | null
    _count: EscalationQueueCountAggregateOutputType | null
    _min: EscalationQueueMinAggregateOutputType | null
    _max: EscalationQueueMaxAggregateOutputType | null
  }

  type GetEscalationQueueGroupByPayload<T extends EscalationQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EscalationQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EscalationQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EscalationQueueGroupByOutputType[P]>
            : GetScalarType<T[P], EscalationQueueGroupByOutputType[P]>
        }
      >
    >


  export type EscalationQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionRef?: boolean
    level?: boolean
    source?: boolean
    summary?: boolean
    status?: boolean
    reviewerHandle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    alertId?: boolean
    alert?: boolean | EscalationQueue$alertArgs<ExtArgs>
  }, ExtArgs["result"]["escalationQueue"]>

  export type EscalationQueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionRef?: boolean
    level?: boolean
    source?: boolean
    summary?: boolean
    status?: boolean
    reviewerHandle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    alertId?: boolean
    alert?: boolean | EscalationQueue$alertArgs<ExtArgs>
  }, ExtArgs["result"]["escalationQueue"]>

  export type EscalationQueueSelectScalar = {
    id?: boolean
    sessionRef?: boolean
    level?: boolean
    source?: boolean
    summary?: boolean
    status?: boolean
    reviewerHandle?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    alertId?: boolean
  }

  export type EscalationQueueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alert?: boolean | EscalationQueue$alertArgs<ExtArgs>
  }
  export type EscalationQueueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    alert?: boolean | EscalationQueue$alertArgs<ExtArgs>
  }

  export type $EscalationQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EscalationQueue"
    objects: {
      alert: Prisma.$SafetyAlertPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionRef: string
      level: $Enums.EscalationLevel
      source: $Enums.EscalationSource
      summary: string
      status: $Enums.EscalationStatus
      reviewerHandle: string | null
      createdAt: Date
      updatedAt: Date
      alertId: string | null
    }, ExtArgs["result"]["escalationQueue"]>
    composites: {}
  }

  type EscalationQueueGetPayload<S extends boolean | null | undefined | EscalationQueueDefaultArgs> = $Result.GetResult<Prisma.$EscalationQueuePayload, S>

  type EscalationQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EscalationQueueFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EscalationQueueCountAggregateInputType | true
    }

  export interface EscalationQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EscalationQueue'], meta: { name: 'EscalationQueue' } }
    /**
     * Find zero or one EscalationQueue that matches the filter.
     * @param {EscalationQueueFindUniqueArgs} args - Arguments to find a EscalationQueue
     * @example
     * // Get one EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EscalationQueueFindUniqueArgs>(args: SelectSubset<T, EscalationQueueFindUniqueArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one EscalationQueue that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EscalationQueueFindUniqueOrThrowArgs} args - Arguments to find a EscalationQueue
     * @example
     * // Get one EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EscalationQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, EscalationQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first EscalationQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueFindFirstArgs} args - Arguments to find a EscalationQueue
     * @example
     * // Get one EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EscalationQueueFindFirstArgs>(args?: SelectSubset<T, EscalationQueueFindFirstArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first EscalationQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueFindFirstOrThrowArgs} args - Arguments to find a EscalationQueue
     * @example
     * // Get one EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EscalationQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, EscalationQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more EscalationQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EscalationQueues
     * const escalationQueues = await prisma.escalationQueue.findMany()
     * 
     * // Get first 10 EscalationQueues
     * const escalationQueues = await prisma.escalationQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const escalationQueueWithIdOnly = await prisma.escalationQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EscalationQueueFindManyArgs>(args?: SelectSubset<T, EscalationQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a EscalationQueue.
     * @param {EscalationQueueCreateArgs} args - Arguments to create a EscalationQueue.
     * @example
     * // Create one EscalationQueue
     * const EscalationQueue = await prisma.escalationQueue.create({
     *   data: {
     *     // ... data to create a EscalationQueue
     *   }
     * })
     * 
     */
    create<T extends EscalationQueueCreateArgs>(args: SelectSubset<T, EscalationQueueCreateArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many EscalationQueues.
     * @param {EscalationQueueCreateManyArgs} args - Arguments to create many EscalationQueues.
     * @example
     * // Create many EscalationQueues
     * const escalationQueue = await prisma.escalationQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EscalationQueueCreateManyArgs>(args?: SelectSubset<T, EscalationQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EscalationQueues and returns the data saved in the database.
     * @param {EscalationQueueCreateManyAndReturnArgs} args - Arguments to create many EscalationQueues.
     * @example
     * // Create many EscalationQueues
     * const escalationQueue = await prisma.escalationQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EscalationQueues and only return the `id`
     * const escalationQueueWithIdOnly = await prisma.escalationQueue.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EscalationQueueCreateManyAndReturnArgs>(args?: SelectSubset<T, EscalationQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a EscalationQueue.
     * @param {EscalationQueueDeleteArgs} args - Arguments to delete one EscalationQueue.
     * @example
     * // Delete one EscalationQueue
     * const EscalationQueue = await prisma.escalationQueue.delete({
     *   where: {
     *     // ... filter to delete one EscalationQueue
     *   }
     * })
     * 
     */
    delete<T extends EscalationQueueDeleteArgs>(args: SelectSubset<T, EscalationQueueDeleteArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one EscalationQueue.
     * @param {EscalationQueueUpdateArgs} args - Arguments to update one EscalationQueue.
     * @example
     * // Update one EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EscalationQueueUpdateArgs>(args: SelectSubset<T, EscalationQueueUpdateArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more EscalationQueues.
     * @param {EscalationQueueDeleteManyArgs} args - Arguments to filter EscalationQueues to delete.
     * @example
     * // Delete a few EscalationQueues
     * const { count } = await prisma.escalationQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EscalationQueueDeleteManyArgs>(args?: SelectSubset<T, EscalationQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EscalationQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EscalationQueues
     * const escalationQueue = await prisma.escalationQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EscalationQueueUpdateManyArgs>(args: SelectSubset<T, EscalationQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one EscalationQueue.
     * @param {EscalationQueueUpsertArgs} args - Arguments to update or create a EscalationQueue.
     * @example
     * // Update or create a EscalationQueue
     * const escalationQueue = await prisma.escalationQueue.upsert({
     *   create: {
     *     // ... data to create a EscalationQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EscalationQueue we want to update
     *   }
     * })
     */
    upsert<T extends EscalationQueueUpsertArgs>(args: SelectSubset<T, EscalationQueueUpsertArgs<ExtArgs>>): Prisma__EscalationQueueClient<$Result.GetResult<Prisma.$EscalationQueuePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of EscalationQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueCountArgs} args - Arguments to filter EscalationQueues to count.
     * @example
     * // Count the number of EscalationQueues
     * const count = await prisma.escalationQueue.count({
     *   where: {
     *     // ... the filter for the EscalationQueues we want to count
     *   }
     * })
    **/
    count<T extends EscalationQueueCountArgs>(
      args?: Subset<T, EscalationQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EscalationQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EscalationQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EscalationQueueAggregateArgs>(args: Subset<T, EscalationQueueAggregateArgs>): Prisma.PrismaPromise<GetEscalationQueueAggregateType<T>>

    /**
     * Group by EscalationQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationQueueGroupByArgs} args - Group by arguments.
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
      T extends EscalationQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EscalationQueueGroupByArgs['orderBy'] }
        : { orderBy?: EscalationQueueGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EscalationQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEscalationQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EscalationQueue model
   */
  readonly fields: EscalationQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EscalationQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EscalationQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    alert<T extends EscalationQueue$alertArgs<ExtArgs> = {}>(args?: Subset<T, EscalationQueue$alertArgs<ExtArgs>>): Prisma__SafetyAlertClient<$Result.GetResult<Prisma.$SafetyAlertPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the EscalationQueue model
   */ 
  interface EscalationQueueFieldRefs {
    readonly id: FieldRef<"EscalationQueue", 'String'>
    readonly sessionRef: FieldRef<"EscalationQueue", 'String'>
    readonly level: FieldRef<"EscalationQueue", 'EscalationLevel'>
    readonly source: FieldRef<"EscalationQueue", 'EscalationSource'>
    readonly summary: FieldRef<"EscalationQueue", 'String'>
    readonly status: FieldRef<"EscalationQueue", 'EscalationStatus'>
    readonly reviewerHandle: FieldRef<"EscalationQueue", 'String'>
    readonly createdAt: FieldRef<"EscalationQueue", 'DateTime'>
    readonly updatedAt: FieldRef<"EscalationQueue", 'DateTime'>
    readonly alertId: FieldRef<"EscalationQueue", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EscalationQueue findUnique
   */
  export type EscalationQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter, which EscalationQueue to fetch.
     */
    where: EscalationQueueWhereUniqueInput
  }

  /**
   * EscalationQueue findUniqueOrThrow
   */
  export type EscalationQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter, which EscalationQueue to fetch.
     */
    where: EscalationQueueWhereUniqueInput
  }

  /**
   * EscalationQueue findFirst
   */
  export type EscalationQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter, which EscalationQueue to fetch.
     */
    where?: EscalationQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscalationQueues to fetch.
     */
    orderBy?: EscalationQueueOrderByWithRelationInput | EscalationQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EscalationQueues.
     */
    cursor?: EscalationQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscalationQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscalationQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EscalationQueues.
     */
    distinct?: EscalationQueueScalarFieldEnum | EscalationQueueScalarFieldEnum[]
  }

  /**
   * EscalationQueue findFirstOrThrow
   */
  export type EscalationQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter, which EscalationQueue to fetch.
     */
    where?: EscalationQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscalationQueues to fetch.
     */
    orderBy?: EscalationQueueOrderByWithRelationInput | EscalationQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EscalationQueues.
     */
    cursor?: EscalationQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscalationQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscalationQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EscalationQueues.
     */
    distinct?: EscalationQueueScalarFieldEnum | EscalationQueueScalarFieldEnum[]
  }

  /**
   * EscalationQueue findMany
   */
  export type EscalationQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter, which EscalationQueues to fetch.
     */
    where?: EscalationQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EscalationQueues to fetch.
     */
    orderBy?: EscalationQueueOrderByWithRelationInput | EscalationQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EscalationQueues.
     */
    cursor?: EscalationQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EscalationQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EscalationQueues.
     */
    skip?: number
    distinct?: EscalationQueueScalarFieldEnum | EscalationQueueScalarFieldEnum[]
  }

  /**
   * EscalationQueue create
   */
  export type EscalationQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * The data needed to create a EscalationQueue.
     */
    data: XOR<EscalationQueueCreateInput, EscalationQueueUncheckedCreateInput>
  }

  /**
   * EscalationQueue createMany
   */
  export type EscalationQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EscalationQueues.
     */
    data: EscalationQueueCreateManyInput | EscalationQueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EscalationQueue createManyAndReturn
   */
  export type EscalationQueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many EscalationQueues.
     */
    data: EscalationQueueCreateManyInput | EscalationQueueCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EscalationQueue update
   */
  export type EscalationQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * The data needed to update a EscalationQueue.
     */
    data: XOR<EscalationQueueUpdateInput, EscalationQueueUncheckedUpdateInput>
    /**
     * Choose, which EscalationQueue to update.
     */
    where: EscalationQueueWhereUniqueInput
  }

  /**
   * EscalationQueue updateMany
   */
  export type EscalationQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EscalationQueues.
     */
    data: XOR<EscalationQueueUpdateManyMutationInput, EscalationQueueUncheckedUpdateManyInput>
    /**
     * Filter which EscalationQueues to update
     */
    where?: EscalationQueueWhereInput
  }

  /**
   * EscalationQueue upsert
   */
  export type EscalationQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * The filter to search for the EscalationQueue to update in case it exists.
     */
    where: EscalationQueueWhereUniqueInput
    /**
     * In case the EscalationQueue found by the `where` argument doesn't exist, create a new EscalationQueue with this data.
     */
    create: XOR<EscalationQueueCreateInput, EscalationQueueUncheckedCreateInput>
    /**
     * In case the EscalationQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EscalationQueueUpdateInput, EscalationQueueUncheckedUpdateInput>
  }

  /**
   * EscalationQueue delete
   */
  export type EscalationQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
    /**
     * Filter which EscalationQueue to delete.
     */
    where: EscalationQueueWhereUniqueInput
  }

  /**
   * EscalationQueue deleteMany
   */
  export type EscalationQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EscalationQueues to delete
     */
    where?: EscalationQueueWhereInput
  }

  /**
   * EscalationQueue.alert
   */
  export type EscalationQueue$alertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SafetyAlert
     */
    select?: SafetyAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SafetyAlertInclude<ExtArgs> | null
    where?: SafetyAlertWhereInput
  }

  /**
   * EscalationQueue without action
   */
  export type EscalationQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EscalationQueue
     */
    select?: EscalationQueueSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EscalationQueueInclude<ExtArgs> | null
  }


  /**
   * Model KeywordRule
   */

  export type AggregateKeywordRule = {
    _count: KeywordRuleCountAggregateOutputType | null
    _min: KeywordRuleMinAggregateOutputType | null
    _max: KeywordRuleMaxAggregateOutputType | null
  }

  export type KeywordRuleMinAggregateOutputType = {
    id: string | null
    term: string | null
    severity: $Enums.SafetySeverity | null
    category: $Enums.SafetyCategory | null
    enabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KeywordRuleMaxAggregateOutputType = {
    id: string | null
    term: string | null
    severity: $Enums.SafetySeverity | null
    category: $Enums.SafetyCategory | null
    enabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KeywordRuleCountAggregateOutputType = {
    id: number
    term: number
    severity: number
    category: number
    enabled: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KeywordRuleMinAggregateInputType = {
    id?: true
    term?: true
    severity?: true
    category?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KeywordRuleMaxAggregateInputType = {
    id?: true
    term?: true
    severity?: true
    category?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KeywordRuleCountAggregateInputType = {
    id?: true
    term?: true
    severity?: true
    category?: true
    enabled?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KeywordRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeywordRule to aggregate.
     */
    where?: KeywordRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeywordRules to fetch.
     */
    orderBy?: KeywordRuleOrderByWithRelationInput | KeywordRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KeywordRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeywordRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeywordRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KeywordRules
    **/
    _count?: true | KeywordRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KeywordRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KeywordRuleMaxAggregateInputType
  }

  export type GetKeywordRuleAggregateType<T extends KeywordRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateKeywordRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKeywordRule[P]>
      : GetScalarType<T[P], AggregateKeywordRule[P]>
  }




  export type KeywordRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KeywordRuleWhereInput
    orderBy?: KeywordRuleOrderByWithAggregationInput | KeywordRuleOrderByWithAggregationInput[]
    by: KeywordRuleScalarFieldEnum[] | KeywordRuleScalarFieldEnum
    having?: KeywordRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KeywordRuleCountAggregateInputType | true
    _min?: KeywordRuleMinAggregateInputType
    _max?: KeywordRuleMaxAggregateInputType
  }

  export type KeywordRuleGroupByOutputType = {
    id: string
    term: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    enabled: boolean
    createdAt: Date
    updatedAt: Date
    _count: KeywordRuleCountAggregateOutputType | null
    _min: KeywordRuleMinAggregateOutputType | null
    _max: KeywordRuleMaxAggregateOutputType | null
  }

  type GetKeywordRuleGroupByPayload<T extends KeywordRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KeywordRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KeywordRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KeywordRuleGroupByOutputType[P]>
            : GetScalarType<T[P], KeywordRuleGroupByOutputType[P]>
        }
      >
    >


  export type KeywordRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    term?: boolean
    severity?: boolean
    category?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["keywordRule"]>

  export type KeywordRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    term?: boolean
    severity?: boolean
    category?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["keywordRule"]>

  export type KeywordRuleSelectScalar = {
    id?: boolean
    term?: boolean
    severity?: boolean
    category?: boolean
    enabled?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $KeywordRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KeywordRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      term: string
      severity: $Enums.SafetySeverity
      category: $Enums.SafetyCategory
      enabled: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["keywordRule"]>
    composites: {}
  }

  type KeywordRuleGetPayload<S extends boolean | null | undefined | KeywordRuleDefaultArgs> = $Result.GetResult<Prisma.$KeywordRulePayload, S>

  type KeywordRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<KeywordRuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: KeywordRuleCountAggregateInputType | true
    }

  export interface KeywordRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KeywordRule'], meta: { name: 'KeywordRule' } }
    /**
     * Find zero or one KeywordRule that matches the filter.
     * @param {KeywordRuleFindUniqueArgs} args - Arguments to find a KeywordRule
     * @example
     * // Get one KeywordRule
     * const keywordRule = await prisma.keywordRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KeywordRuleFindUniqueArgs>(args: SelectSubset<T, KeywordRuleFindUniqueArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one KeywordRule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {KeywordRuleFindUniqueOrThrowArgs} args - Arguments to find a KeywordRule
     * @example
     * // Get one KeywordRule
     * const keywordRule = await prisma.keywordRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KeywordRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, KeywordRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first KeywordRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleFindFirstArgs} args - Arguments to find a KeywordRule
     * @example
     * // Get one KeywordRule
     * const keywordRule = await prisma.keywordRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KeywordRuleFindFirstArgs>(args?: SelectSubset<T, KeywordRuleFindFirstArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first KeywordRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleFindFirstOrThrowArgs} args - Arguments to find a KeywordRule
     * @example
     * // Get one KeywordRule
     * const keywordRule = await prisma.keywordRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KeywordRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, KeywordRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more KeywordRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KeywordRules
     * const keywordRules = await prisma.keywordRule.findMany()
     * 
     * // Get first 10 KeywordRules
     * const keywordRules = await prisma.keywordRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const keywordRuleWithIdOnly = await prisma.keywordRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KeywordRuleFindManyArgs>(args?: SelectSubset<T, KeywordRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a KeywordRule.
     * @param {KeywordRuleCreateArgs} args - Arguments to create a KeywordRule.
     * @example
     * // Create one KeywordRule
     * const KeywordRule = await prisma.keywordRule.create({
     *   data: {
     *     // ... data to create a KeywordRule
     *   }
     * })
     * 
     */
    create<T extends KeywordRuleCreateArgs>(args: SelectSubset<T, KeywordRuleCreateArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many KeywordRules.
     * @param {KeywordRuleCreateManyArgs} args - Arguments to create many KeywordRules.
     * @example
     * // Create many KeywordRules
     * const keywordRule = await prisma.keywordRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KeywordRuleCreateManyArgs>(args?: SelectSubset<T, KeywordRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KeywordRules and returns the data saved in the database.
     * @param {KeywordRuleCreateManyAndReturnArgs} args - Arguments to create many KeywordRules.
     * @example
     * // Create many KeywordRules
     * const keywordRule = await prisma.keywordRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KeywordRules and only return the `id`
     * const keywordRuleWithIdOnly = await prisma.keywordRule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KeywordRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, KeywordRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a KeywordRule.
     * @param {KeywordRuleDeleteArgs} args - Arguments to delete one KeywordRule.
     * @example
     * // Delete one KeywordRule
     * const KeywordRule = await prisma.keywordRule.delete({
     *   where: {
     *     // ... filter to delete one KeywordRule
     *   }
     * })
     * 
     */
    delete<T extends KeywordRuleDeleteArgs>(args: SelectSubset<T, KeywordRuleDeleteArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one KeywordRule.
     * @param {KeywordRuleUpdateArgs} args - Arguments to update one KeywordRule.
     * @example
     * // Update one KeywordRule
     * const keywordRule = await prisma.keywordRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KeywordRuleUpdateArgs>(args: SelectSubset<T, KeywordRuleUpdateArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more KeywordRules.
     * @param {KeywordRuleDeleteManyArgs} args - Arguments to filter KeywordRules to delete.
     * @example
     * // Delete a few KeywordRules
     * const { count } = await prisma.keywordRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KeywordRuleDeleteManyArgs>(args?: SelectSubset<T, KeywordRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KeywordRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KeywordRules
     * const keywordRule = await prisma.keywordRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KeywordRuleUpdateManyArgs>(args: SelectSubset<T, KeywordRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one KeywordRule.
     * @param {KeywordRuleUpsertArgs} args - Arguments to update or create a KeywordRule.
     * @example
     * // Update or create a KeywordRule
     * const keywordRule = await prisma.keywordRule.upsert({
     *   create: {
     *     // ... data to create a KeywordRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KeywordRule we want to update
     *   }
     * })
     */
    upsert<T extends KeywordRuleUpsertArgs>(args: SelectSubset<T, KeywordRuleUpsertArgs<ExtArgs>>): Prisma__KeywordRuleClient<$Result.GetResult<Prisma.$KeywordRulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of KeywordRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleCountArgs} args - Arguments to filter KeywordRules to count.
     * @example
     * // Count the number of KeywordRules
     * const count = await prisma.keywordRule.count({
     *   where: {
     *     // ... the filter for the KeywordRules we want to count
     *   }
     * })
    **/
    count<T extends KeywordRuleCountArgs>(
      args?: Subset<T, KeywordRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KeywordRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KeywordRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends KeywordRuleAggregateArgs>(args: Subset<T, KeywordRuleAggregateArgs>): Prisma.PrismaPromise<GetKeywordRuleAggregateType<T>>

    /**
     * Group by KeywordRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KeywordRuleGroupByArgs} args - Group by arguments.
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
      T extends KeywordRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KeywordRuleGroupByArgs['orderBy'] }
        : { orderBy?: KeywordRuleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, KeywordRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKeywordRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KeywordRule model
   */
  readonly fields: KeywordRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KeywordRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KeywordRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the KeywordRule model
   */ 
  interface KeywordRuleFieldRefs {
    readonly id: FieldRef<"KeywordRule", 'String'>
    readonly term: FieldRef<"KeywordRule", 'String'>
    readonly severity: FieldRef<"KeywordRule", 'SafetySeverity'>
    readonly category: FieldRef<"KeywordRule", 'SafetyCategory'>
    readonly enabled: FieldRef<"KeywordRule", 'Boolean'>
    readonly createdAt: FieldRef<"KeywordRule", 'DateTime'>
    readonly updatedAt: FieldRef<"KeywordRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KeywordRule findUnique
   */
  export type KeywordRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter, which KeywordRule to fetch.
     */
    where: KeywordRuleWhereUniqueInput
  }

  /**
   * KeywordRule findUniqueOrThrow
   */
  export type KeywordRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter, which KeywordRule to fetch.
     */
    where: KeywordRuleWhereUniqueInput
  }

  /**
   * KeywordRule findFirst
   */
  export type KeywordRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter, which KeywordRule to fetch.
     */
    where?: KeywordRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeywordRules to fetch.
     */
    orderBy?: KeywordRuleOrderByWithRelationInput | KeywordRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeywordRules.
     */
    cursor?: KeywordRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeywordRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeywordRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeywordRules.
     */
    distinct?: KeywordRuleScalarFieldEnum | KeywordRuleScalarFieldEnum[]
  }

  /**
   * KeywordRule findFirstOrThrow
   */
  export type KeywordRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter, which KeywordRule to fetch.
     */
    where?: KeywordRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeywordRules to fetch.
     */
    orderBy?: KeywordRuleOrderByWithRelationInput | KeywordRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KeywordRules.
     */
    cursor?: KeywordRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeywordRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeywordRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KeywordRules.
     */
    distinct?: KeywordRuleScalarFieldEnum | KeywordRuleScalarFieldEnum[]
  }

  /**
   * KeywordRule findMany
   */
  export type KeywordRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter, which KeywordRules to fetch.
     */
    where?: KeywordRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KeywordRules to fetch.
     */
    orderBy?: KeywordRuleOrderByWithRelationInput | KeywordRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KeywordRules.
     */
    cursor?: KeywordRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KeywordRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KeywordRules.
     */
    skip?: number
    distinct?: KeywordRuleScalarFieldEnum | KeywordRuleScalarFieldEnum[]
  }

  /**
   * KeywordRule create
   */
  export type KeywordRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * The data needed to create a KeywordRule.
     */
    data: XOR<KeywordRuleCreateInput, KeywordRuleUncheckedCreateInput>
  }

  /**
   * KeywordRule createMany
   */
  export type KeywordRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KeywordRules.
     */
    data: KeywordRuleCreateManyInput | KeywordRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KeywordRule createManyAndReturn
   */
  export type KeywordRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many KeywordRules.
     */
    data: KeywordRuleCreateManyInput | KeywordRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KeywordRule update
   */
  export type KeywordRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * The data needed to update a KeywordRule.
     */
    data: XOR<KeywordRuleUpdateInput, KeywordRuleUncheckedUpdateInput>
    /**
     * Choose, which KeywordRule to update.
     */
    where: KeywordRuleWhereUniqueInput
  }

  /**
   * KeywordRule updateMany
   */
  export type KeywordRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KeywordRules.
     */
    data: XOR<KeywordRuleUpdateManyMutationInput, KeywordRuleUncheckedUpdateManyInput>
    /**
     * Filter which KeywordRules to update
     */
    where?: KeywordRuleWhereInput
  }

  /**
   * KeywordRule upsert
   */
  export type KeywordRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * The filter to search for the KeywordRule to update in case it exists.
     */
    where: KeywordRuleWhereUniqueInput
    /**
     * In case the KeywordRule found by the `where` argument doesn't exist, create a new KeywordRule with this data.
     */
    create: XOR<KeywordRuleCreateInput, KeywordRuleUncheckedCreateInput>
    /**
     * In case the KeywordRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KeywordRuleUpdateInput, KeywordRuleUncheckedUpdateInput>
  }

  /**
   * KeywordRule delete
   */
  export type KeywordRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
    /**
     * Filter which KeywordRule to delete.
     */
    where: KeywordRuleWhereUniqueInput
  }

  /**
   * KeywordRule deleteMany
   */
  export type KeywordRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KeywordRules to delete
     */
    where?: KeywordRuleWhereInput
  }

  /**
   * KeywordRule without action
   */
  export type KeywordRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KeywordRule
     */
    select?: KeywordRuleSelect<ExtArgs> | null
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


  export const AuditEventScalarFieldEnum: {
    id: 'id',
    service: 'service',
    action: 'action',
    actorRef: 'actorRef',
    subjectRef: 'subjectRef',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


  export const SafetyAlertScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    severity: 'severity',
    category: 'category',
    anonymizedReason: 'anonymizedReason',
    transcriptChunk: 'transcriptChunk',
    isResolved: 'isResolved',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SafetyAlertScalarFieldEnum = (typeof SafetyAlertScalarFieldEnum)[keyof typeof SafetyAlertScalarFieldEnum]


  export const SafetyMitigationScalarFieldEnum: {
    id: 'id',
    alertId: 'alertId',
    action: 'action',
    success: 'success',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type SafetyMitigationScalarFieldEnum = (typeof SafetyMitigationScalarFieldEnum)[keyof typeof SafetyMitigationScalarFieldEnum]


  export const SafetyStrikeScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    participantId: 'participantId',
    count: 'count',
    lastStrikeAt: 'lastStrikeAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SafetyStrikeScalarFieldEnum = (typeof SafetyStrikeScalarFieldEnum)[keyof typeof SafetyStrikeScalarFieldEnum]


  export const SafetyAuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    actor: 'actor',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SafetyAuditLogScalarFieldEnum = (typeof SafetyAuditLogScalarFieldEnum)[keyof typeof SafetyAuditLogScalarFieldEnum]


  export const EscalationQueueScalarFieldEnum: {
    id: 'id',
    sessionRef: 'sessionRef',
    level: 'level',
    source: 'source',
    summary: 'summary',
    status: 'status',
    reviewerHandle: 'reviewerHandle',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    alertId: 'alertId'
  };

  export type EscalationQueueScalarFieldEnum = (typeof EscalationQueueScalarFieldEnum)[keyof typeof EscalationQueueScalarFieldEnum]


  export const KeywordRuleScalarFieldEnum: {
    id: 'id',
    term: 'term',
    severity: 'severity',
    category: 'category',
    enabled: 'enabled',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KeywordRuleScalarFieldEnum = (typeof KeywordRuleScalarFieldEnum)[keyof typeof KeywordRuleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'SafetySeverity'
   */
  export type EnumSafetySeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetySeverity'>
    


  /**
   * Reference to a field of type 'SafetySeverity[]'
   */
  export type ListEnumSafetySeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetySeverity[]'>
    


  /**
   * Reference to a field of type 'SafetyCategory'
   */
  export type EnumSafetyCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCategory'>
    


  /**
   * Reference to a field of type 'SafetyCategory[]'
   */
  export type ListEnumSafetyCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCategory[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'MitigationAction'
   */
  export type EnumMitigationActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MitigationAction'>
    


  /**
   * Reference to a field of type 'MitigationAction[]'
   */
  export type ListEnumMitigationActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MitigationAction[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'EscalationLevel'
   */
  export type EnumEscalationLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationLevel'>
    


  /**
   * Reference to a field of type 'EscalationLevel[]'
   */
  export type ListEnumEscalationLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationLevel[]'>
    


  /**
   * Reference to a field of type 'EscalationSource'
   */
  export type EnumEscalationSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationSource'>
    


  /**
   * Reference to a field of type 'EscalationSource[]'
   */
  export type ListEnumEscalationSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationSource[]'>
    


  /**
   * Reference to a field of type 'EscalationStatus'
   */
  export type EnumEscalationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationStatus'>
    


  /**
   * Reference to a field of type 'EscalationStatus[]'
   */
  export type ListEnumEscalationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationStatus[]'>
    


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


  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    service?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    actorRef?: StringFilter<"AuditEvent"> | string
    subjectRef?: StringNullableFilter<"AuditEvent"> | string | null
    metadata?: JsonFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    updatedAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    service?: SortOrder
    action?: SortOrder
    actorRef?: SortOrder
    subjectRef?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    service?: StringFilter<"AuditEvent"> | string
    action?: StringFilter<"AuditEvent"> | string
    actorRef?: StringFilter<"AuditEvent"> | string
    subjectRef?: StringNullableFilter<"AuditEvent"> | string | null
    metadata?: JsonFilter<"AuditEvent">
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    updatedAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    service?: SortOrder
    action?: SortOrder
    actorRef?: SortOrder
    subjectRef?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    service?: StringWithAggregatesFilter<"AuditEvent"> | string
    action?: StringWithAggregatesFilter<"AuditEvent"> | string
    actorRef?: StringWithAggregatesFilter<"AuditEvent"> | string
    subjectRef?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    metadata?: JsonWithAggregatesFilter<"AuditEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type SafetyAlertWhereInput = {
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    id?: UuidFilter<"SafetyAlert"> | string
    sessionId?: StringFilter<"SafetyAlert"> | string
    severity?: EnumSafetySeverityFilter<"SafetyAlert"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFilter<"SafetyAlert"> | $Enums.SafetyCategory
    anonymizedReason?: StringFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableFilter<"SafetyAlert"> | string | null
    isResolved?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    mitigations?: SafetyMitigationListRelationFilter
    escalations?: EscalationQueueListRelationFilter
  }

  export type SafetyAlertOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    anonymizedReason?: SortOrder
    transcriptChunk?: SortOrderInput | SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    mitigations?: SafetyMitigationOrderByRelationAggregateInput
    escalations?: EscalationQueueOrderByRelationAggregateInput
  }

  export type SafetyAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    sessionId?: StringFilter<"SafetyAlert"> | string
    severity?: EnumSafetySeverityFilter<"SafetyAlert"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFilter<"SafetyAlert"> | $Enums.SafetyCategory
    anonymizedReason?: StringFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableFilter<"SafetyAlert"> | string | null
    isResolved?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    mitigations?: SafetyMitigationListRelationFilter
    escalations?: EscalationQueueListRelationFilter
  }, "id">

  export type SafetyAlertOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    anonymizedReason?: SortOrder
    transcriptChunk?: SortOrderInput | SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SafetyAlertCountOrderByAggregateInput
    _max?: SafetyAlertMaxOrderByAggregateInput
    _min?: SafetyAlertMinOrderByAggregateInput
  }

  export type SafetyAlertScalarWhereWithAggregatesInput = {
    AND?: SafetyAlertScalarWhereWithAggregatesInput | SafetyAlertScalarWhereWithAggregatesInput[]
    OR?: SafetyAlertScalarWhereWithAggregatesInput[]
    NOT?: SafetyAlertScalarWhereWithAggregatesInput | SafetyAlertScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SafetyAlert"> | string
    sessionId?: StringWithAggregatesFilter<"SafetyAlert"> | string
    severity?: EnumSafetySeverityWithAggregatesFilter<"SafetyAlert"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryWithAggregatesFilter<"SafetyAlert"> | $Enums.SafetyCategory
    anonymizedReason?: StringWithAggregatesFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableWithAggregatesFilter<"SafetyAlert"> | string | null
    isResolved?: BoolWithAggregatesFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SafetyAlert"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SafetyAlert"> | Date | string
  }

  export type SafetyMitigationWhereInput = {
    AND?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    OR?: SafetyMitigationWhereInput[]
    NOT?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    id?: UuidFilter<"SafetyMitigation"> | string
    alertId?: UuidFilter<"SafetyMitigation"> | string
    action?: EnumMitigationActionFilter<"SafetyMitigation"> | $Enums.MitigationAction
    success?: BoolFilter<"SafetyMitigation"> | boolean
    metadata?: JsonNullableFilter<"SafetyMitigation">
    createdAt?: DateTimeFilter<"SafetyMitigation"> | Date | string
    alert?: XOR<SafetyAlertScalarRelationFilter, SafetyAlertWhereInput>
  }

  export type SafetyMitigationOrderByWithRelationInput = {
    id?: SortOrder
    alertId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    alert?: SafetyAlertOrderByWithRelationInput
  }

  export type SafetyMitigationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    OR?: SafetyMitigationWhereInput[]
    NOT?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    alertId?: UuidFilter<"SafetyMitigation"> | string
    action?: EnumMitigationActionFilter<"SafetyMitigation"> | $Enums.MitigationAction
    success?: BoolFilter<"SafetyMitigation"> | boolean
    metadata?: JsonNullableFilter<"SafetyMitigation">
    createdAt?: DateTimeFilter<"SafetyMitigation"> | Date | string
    alert?: XOR<SafetyAlertScalarRelationFilter, SafetyAlertWhereInput>
  }, "id">

  export type SafetyMitigationOrderByWithAggregationInput = {
    id?: SortOrder
    alertId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SafetyMitigationCountOrderByAggregateInput
    _max?: SafetyMitigationMaxOrderByAggregateInput
    _min?: SafetyMitigationMinOrderByAggregateInput
  }

  export type SafetyMitigationScalarWhereWithAggregatesInput = {
    AND?: SafetyMitigationScalarWhereWithAggregatesInput | SafetyMitigationScalarWhereWithAggregatesInput[]
    OR?: SafetyMitigationScalarWhereWithAggregatesInput[]
    NOT?: SafetyMitigationScalarWhereWithAggregatesInput | SafetyMitigationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SafetyMitigation"> | string
    alertId?: UuidWithAggregatesFilter<"SafetyMitigation"> | string
    action?: EnumMitigationActionWithAggregatesFilter<"SafetyMitigation"> | $Enums.MitigationAction
    success?: BoolWithAggregatesFilter<"SafetyMitigation"> | boolean
    metadata?: JsonNullableWithAggregatesFilter<"SafetyMitigation">
    createdAt?: DateTimeWithAggregatesFilter<"SafetyMitigation"> | Date | string
  }

  export type SafetyStrikeWhereInput = {
    AND?: SafetyStrikeWhereInput | SafetyStrikeWhereInput[]
    OR?: SafetyStrikeWhereInput[]
    NOT?: SafetyStrikeWhereInput | SafetyStrikeWhereInput[]
    id?: UuidFilter<"SafetyStrike"> | string
    sessionId?: StringFilter<"SafetyStrike"> | string
    participantId?: StringFilter<"SafetyStrike"> | string
    count?: IntFilter<"SafetyStrike"> | number
    lastStrikeAt?: DateTimeFilter<"SafetyStrike"> | Date | string
    createdAt?: DateTimeFilter<"SafetyStrike"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyStrike"> | Date | string
  }

  export type SafetyStrikeOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyStrikeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionId_participantId?: SafetyStrikeSessionIdParticipantIdCompoundUniqueInput
    AND?: SafetyStrikeWhereInput | SafetyStrikeWhereInput[]
    OR?: SafetyStrikeWhereInput[]
    NOT?: SafetyStrikeWhereInput | SafetyStrikeWhereInput[]
    sessionId?: StringFilter<"SafetyStrike"> | string
    participantId?: StringFilter<"SafetyStrike"> | string
    count?: IntFilter<"SafetyStrike"> | number
    lastStrikeAt?: DateTimeFilter<"SafetyStrike"> | Date | string
    createdAt?: DateTimeFilter<"SafetyStrike"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyStrike"> | Date | string
  }, "id" | "sessionId_participantId">

  export type SafetyStrikeOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SafetyStrikeCountOrderByAggregateInput
    _avg?: SafetyStrikeAvgOrderByAggregateInput
    _max?: SafetyStrikeMaxOrderByAggregateInput
    _min?: SafetyStrikeMinOrderByAggregateInput
    _sum?: SafetyStrikeSumOrderByAggregateInput
  }

  export type SafetyStrikeScalarWhereWithAggregatesInput = {
    AND?: SafetyStrikeScalarWhereWithAggregatesInput | SafetyStrikeScalarWhereWithAggregatesInput[]
    OR?: SafetyStrikeScalarWhereWithAggregatesInput[]
    NOT?: SafetyStrikeScalarWhereWithAggregatesInput | SafetyStrikeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SafetyStrike"> | string
    sessionId?: StringWithAggregatesFilter<"SafetyStrike"> | string
    participantId?: StringWithAggregatesFilter<"SafetyStrike"> | string
    count?: IntWithAggregatesFilter<"SafetyStrike"> | number
    lastStrikeAt?: DateTimeWithAggregatesFilter<"SafetyStrike"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"SafetyStrike"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SafetyStrike"> | Date | string
  }

  export type SafetyAuditLogWhereInput = {
    AND?: SafetyAuditLogWhereInput | SafetyAuditLogWhereInput[]
    OR?: SafetyAuditLogWhereInput[]
    NOT?: SafetyAuditLogWhereInput | SafetyAuditLogWhereInput[]
    id?: UuidFilter<"SafetyAuditLog"> | string
    action?: StringFilter<"SafetyAuditLog"> | string
    actor?: StringFilter<"SafetyAuditLog"> | string
    metadata?: JsonFilter<"SafetyAuditLog">
    createdAt?: DateTimeFilter<"SafetyAuditLog"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyAuditLog"> | Date | string
  }

  export type SafetyAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyAuditLogWhereInput | SafetyAuditLogWhereInput[]
    OR?: SafetyAuditLogWhereInput[]
    NOT?: SafetyAuditLogWhereInput | SafetyAuditLogWhereInput[]
    action?: StringFilter<"SafetyAuditLog"> | string
    actor?: StringFilter<"SafetyAuditLog"> | string
    metadata?: JsonFilter<"SafetyAuditLog">
    createdAt?: DateTimeFilter<"SafetyAuditLog"> | Date | string
    updatedAt?: DateTimeFilter<"SafetyAuditLog"> | Date | string
  }, "id">

  export type SafetyAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SafetyAuditLogCountOrderByAggregateInput
    _max?: SafetyAuditLogMaxOrderByAggregateInput
    _min?: SafetyAuditLogMinOrderByAggregateInput
  }

  export type SafetyAuditLogScalarWhereWithAggregatesInput = {
    AND?: SafetyAuditLogScalarWhereWithAggregatesInput | SafetyAuditLogScalarWhereWithAggregatesInput[]
    OR?: SafetyAuditLogScalarWhereWithAggregatesInput[]
    NOT?: SafetyAuditLogScalarWhereWithAggregatesInput | SafetyAuditLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SafetyAuditLog"> | string
    action?: StringWithAggregatesFilter<"SafetyAuditLog"> | string
    actor?: StringWithAggregatesFilter<"SafetyAuditLog"> | string
    metadata?: JsonWithAggregatesFilter<"SafetyAuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"SafetyAuditLog"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SafetyAuditLog"> | Date | string
  }

  export type EscalationQueueWhereInput = {
    AND?: EscalationQueueWhereInput | EscalationQueueWhereInput[]
    OR?: EscalationQueueWhereInput[]
    NOT?: EscalationQueueWhereInput | EscalationQueueWhereInput[]
    id?: UuidFilter<"EscalationQueue"> | string
    sessionRef?: StringFilter<"EscalationQueue"> | string
    level?: EnumEscalationLevelFilter<"EscalationQueue"> | $Enums.EscalationLevel
    source?: EnumEscalationSourceFilter<"EscalationQueue"> | $Enums.EscalationSource
    summary?: StringFilter<"EscalationQueue"> | string
    status?: EnumEscalationStatusFilter<"EscalationQueue"> | $Enums.EscalationStatus
    reviewerHandle?: StringNullableFilter<"EscalationQueue"> | string | null
    createdAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    updatedAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    alertId?: UuidNullableFilter<"EscalationQueue"> | string | null
    alert?: XOR<SafetyAlertNullableScalarRelationFilter, SafetyAlertWhereInput> | null
  }

  export type EscalationQueueOrderByWithRelationInput = {
    id?: SortOrder
    sessionRef?: SortOrder
    level?: SortOrder
    source?: SortOrder
    summary?: SortOrder
    status?: SortOrder
    reviewerHandle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    alertId?: SortOrderInput | SortOrder
    alert?: SafetyAlertOrderByWithRelationInput
  }

  export type EscalationQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EscalationQueueWhereInput | EscalationQueueWhereInput[]
    OR?: EscalationQueueWhereInput[]
    NOT?: EscalationQueueWhereInput | EscalationQueueWhereInput[]
    sessionRef?: StringFilter<"EscalationQueue"> | string
    level?: EnumEscalationLevelFilter<"EscalationQueue"> | $Enums.EscalationLevel
    source?: EnumEscalationSourceFilter<"EscalationQueue"> | $Enums.EscalationSource
    summary?: StringFilter<"EscalationQueue"> | string
    status?: EnumEscalationStatusFilter<"EscalationQueue"> | $Enums.EscalationStatus
    reviewerHandle?: StringNullableFilter<"EscalationQueue"> | string | null
    createdAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    updatedAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    alertId?: UuidNullableFilter<"EscalationQueue"> | string | null
    alert?: XOR<SafetyAlertNullableScalarRelationFilter, SafetyAlertWhereInput> | null
  }, "id">

  export type EscalationQueueOrderByWithAggregationInput = {
    id?: SortOrder
    sessionRef?: SortOrder
    level?: SortOrder
    source?: SortOrder
    summary?: SortOrder
    status?: SortOrder
    reviewerHandle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    alertId?: SortOrderInput | SortOrder
    _count?: EscalationQueueCountOrderByAggregateInput
    _max?: EscalationQueueMaxOrderByAggregateInput
    _min?: EscalationQueueMinOrderByAggregateInput
  }

  export type EscalationQueueScalarWhereWithAggregatesInput = {
    AND?: EscalationQueueScalarWhereWithAggregatesInput | EscalationQueueScalarWhereWithAggregatesInput[]
    OR?: EscalationQueueScalarWhereWithAggregatesInput[]
    NOT?: EscalationQueueScalarWhereWithAggregatesInput | EscalationQueueScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EscalationQueue"> | string
    sessionRef?: StringWithAggregatesFilter<"EscalationQueue"> | string
    level?: EnumEscalationLevelWithAggregatesFilter<"EscalationQueue"> | $Enums.EscalationLevel
    source?: EnumEscalationSourceWithAggregatesFilter<"EscalationQueue"> | $Enums.EscalationSource
    summary?: StringWithAggregatesFilter<"EscalationQueue"> | string
    status?: EnumEscalationStatusWithAggregatesFilter<"EscalationQueue"> | $Enums.EscalationStatus
    reviewerHandle?: StringNullableWithAggregatesFilter<"EscalationQueue"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"EscalationQueue"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EscalationQueue"> | Date | string
    alertId?: UuidNullableWithAggregatesFilter<"EscalationQueue"> | string | null
  }

  export type KeywordRuleWhereInput = {
    AND?: KeywordRuleWhereInput | KeywordRuleWhereInput[]
    OR?: KeywordRuleWhereInput[]
    NOT?: KeywordRuleWhereInput | KeywordRuleWhereInput[]
    id?: UuidFilter<"KeywordRule"> | string
    term?: StringFilter<"KeywordRule"> | string
    severity?: EnumSafetySeverityFilter<"KeywordRule"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFilter<"KeywordRule"> | $Enums.SafetyCategory
    enabled?: BoolFilter<"KeywordRule"> | boolean
    createdAt?: DateTimeFilter<"KeywordRule"> | Date | string
    updatedAt?: DateTimeFilter<"KeywordRule"> | Date | string
  }

  export type KeywordRuleOrderByWithRelationInput = {
    id?: SortOrder
    term?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeywordRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    term?: string
    AND?: KeywordRuleWhereInput | KeywordRuleWhereInput[]
    OR?: KeywordRuleWhereInput[]
    NOT?: KeywordRuleWhereInput | KeywordRuleWhereInput[]
    severity?: EnumSafetySeverityFilter<"KeywordRule"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFilter<"KeywordRule"> | $Enums.SafetyCategory
    enabled?: BoolFilter<"KeywordRule"> | boolean
    createdAt?: DateTimeFilter<"KeywordRule"> | Date | string
    updatedAt?: DateTimeFilter<"KeywordRule"> | Date | string
  }, "id" | "term">

  export type KeywordRuleOrderByWithAggregationInput = {
    id?: SortOrder
    term?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KeywordRuleCountOrderByAggregateInput
    _max?: KeywordRuleMaxOrderByAggregateInput
    _min?: KeywordRuleMinOrderByAggregateInput
  }

  export type KeywordRuleScalarWhereWithAggregatesInput = {
    AND?: KeywordRuleScalarWhereWithAggregatesInput | KeywordRuleScalarWhereWithAggregatesInput[]
    OR?: KeywordRuleScalarWhereWithAggregatesInput[]
    NOT?: KeywordRuleScalarWhereWithAggregatesInput | KeywordRuleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"KeywordRule"> | string
    term?: StringWithAggregatesFilter<"KeywordRule"> | string
    severity?: EnumSafetySeverityWithAggregatesFilter<"KeywordRule"> | $Enums.SafetySeverity
    category?: EnumSafetyCategoryWithAggregatesFilter<"KeywordRule"> | $Enums.SafetyCategory
    enabled?: BoolWithAggregatesFilter<"KeywordRule"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"KeywordRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KeywordRule"> | Date | string
  }

  export type AuditEventCreateInput = {
    id?: string
    service: string
    action: string
    actorRef: string
    subjectRef?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    service: string
    action: string
    actorRef: string
    subjectRef?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorRef?: StringFieldUpdateOperationsInput | string
    subjectRef?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorRef?: StringFieldUpdateOperationsInput | string
    subjectRef?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    service: string
    action: string
    actorRef: string
    subjectRef?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorRef?: StringFieldUpdateOperationsInput | string
    subjectRef?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actorRef?: StringFieldUpdateOperationsInput | string
    subjectRef?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAlertCreateInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    mitigations?: SafetyMitigationCreateNestedManyWithoutAlertInput
    escalations?: EscalationQueueCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUncheckedCreateInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    mitigations?: SafetyMitigationUncheckedCreateNestedManyWithoutAlertInput
    escalations?: EscalationQueueUncheckedCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUpdateManyWithoutAlertNestedInput
    escalations?: EscalationQueueUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUncheckedUpdateManyWithoutAlertNestedInput
    escalations?: EscalationQueueUncheckedUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertCreateManyInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationCreateInput = {
    id?: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    alert: SafetyAlertCreateNestedOneWithoutMitigationsInput
  }

  export type SafetyMitigationUncheckedCreateInput = {
    id?: string
    alertId: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alert?: SafetyAlertUpdateOneRequiredWithoutMitigationsNestedInput
  }

  export type SafetyMitigationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alertId?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationCreateManyInput = {
    id?: string
    alertId: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    alertId?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeCreateInput = {
    id?: string
    sessionId: string
    participantId: string
    count?: number
    lastStrikeAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyStrikeUncheckedCreateInput = {
    id?: string
    sessionId: string
    participantId: string
    count?: number
    lastStrikeAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyStrikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeCreateManyInput = {
    id?: string
    sessionId: string
    participantId: string
    count?: number
    lastStrikeAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyStrikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogCreateInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyAuditLogUncheckedCreateInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogCreateManyInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EscalationQueueCreateInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    alert?: SafetyAlertCreateNestedOneWithoutEscalationsInput
  }

  export type EscalationQueueUncheckedCreateInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    alertId?: string | null
  }

  export type EscalationQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alert?: SafetyAlertUpdateOneWithoutEscalationsNestedInput
  }

  export type EscalationQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alertId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscalationQueueCreateManyInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    alertId?: string | null
  }

  export type EscalationQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EscalationQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alertId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KeywordRuleCreateInput = {
    id?: string
    term: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KeywordRuleUncheckedCreateInput = {
    id?: string
    term: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KeywordRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordRuleCreateManyInput = {
    id?: string
    term: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    enabled?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KeywordRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KeywordRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    term?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    enabled?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    action?: SortOrder
    actorRef?: SortOrder
    subjectRef?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    action?: SortOrder
    actorRef?: SortOrder
    subjectRef?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    service?: SortOrder
    action?: SortOrder
    actorRef?: SortOrder
    subjectRef?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type EnumSafetySeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetySeverity | EnumSafetySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetySeverityFilter<$PrismaModel> | $Enums.SafetySeverity
  }

  export type EnumSafetyCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCategory | EnumSafetyCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyCategoryFilter<$PrismaModel> | $Enums.SafetyCategory
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SafetyMitigationListRelationFilter = {
    every?: SafetyMitigationWhereInput
    some?: SafetyMitigationWhereInput
    none?: SafetyMitigationWhereInput
  }

  export type EscalationQueueListRelationFilter = {
    every?: EscalationQueueWhereInput
    some?: EscalationQueueWhereInput
    none?: EscalationQueueWhereInput
  }

  export type SafetyMitigationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EscalationQueueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SafetyAlertCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    anonymizedReason?: SortOrder
    transcriptChunk?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    anonymizedReason?: SortOrder
    transcriptChunk?: SortOrder
    isResolved?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyAlertMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    anonymizedReason?: SortOrder
    transcriptChunk?: SortOrder
    isResolved?: SortOrder
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

  export type EnumSafetySeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetySeverity | EnumSafetySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetySeverityWithAggregatesFilter<$PrismaModel> | $Enums.SafetySeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetySeverityFilter<$PrismaModel>
    _max?: NestedEnumSafetySeverityFilter<$PrismaModel>
  }

  export type EnumSafetyCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCategory | EnumSafetyCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetyCategoryFilter<$PrismaModel>
    _max?: NestedEnumSafetyCategoryFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumMitigationActionFilter<$PrismaModel = never> = {
    equals?: $Enums.MitigationAction | EnumMitigationActionFieldRefInput<$PrismaModel>
    in?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumMitigationActionFilter<$PrismaModel> | $Enums.MitigationAction
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

  export type SafetyAlertScalarRelationFilter = {
    is?: SafetyAlertWhereInput
    isNot?: SafetyAlertWhereInput
  }

  export type SafetyMitigationCountOrderByAggregateInput = {
    id?: SortOrder
    alertId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type SafetyMitigationMaxOrderByAggregateInput = {
    id?: SortOrder
    alertId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    createdAt?: SortOrder
  }

  export type SafetyMitigationMinOrderByAggregateInput = {
    id?: SortOrder
    alertId?: SortOrder
    action?: SortOrder
    success?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMitigationActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MitigationAction | EnumMitigationActionFieldRefInput<$PrismaModel>
    in?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumMitigationActionWithAggregatesFilter<$PrismaModel> | $Enums.MitigationAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMitigationActionFilter<$PrismaModel>
    _max?: NestedEnumMitigationActionFilter<$PrismaModel>
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

  export type SafetyStrikeSessionIdParticipantIdCompoundUniqueInput = {
    sessionId: string
    participantId: string
  }

  export type SafetyStrikeCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyStrikeAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type SafetyStrikeMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyStrikeMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyStrikeSumOrderByAggregateInput = {
    count?: SortOrder
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

  export type SafetyAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SafetyAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumEscalationLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationLevel | EnumEscalationLevelFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationLevelFilter<$PrismaModel> | $Enums.EscalationLevel
  }

  export type EnumEscalationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationSource | EnumEscalationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationSourceFilter<$PrismaModel> | $Enums.EscalationSource
  }

  export type EnumEscalationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusFilter<$PrismaModel> | $Enums.EscalationStatus
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

  export type SafetyAlertNullableScalarRelationFilter = {
    is?: SafetyAlertWhereInput | null
    isNot?: SafetyAlertWhereInput | null
  }

  export type EscalationQueueCountOrderByAggregateInput = {
    id?: SortOrder
    sessionRef?: SortOrder
    level?: SortOrder
    source?: SortOrder
    summary?: SortOrder
    status?: SortOrder
    reviewerHandle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    alertId?: SortOrder
  }

  export type EscalationQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionRef?: SortOrder
    level?: SortOrder
    source?: SortOrder
    summary?: SortOrder
    status?: SortOrder
    reviewerHandle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    alertId?: SortOrder
  }

  export type EscalationQueueMinOrderByAggregateInput = {
    id?: SortOrder
    sessionRef?: SortOrder
    level?: SortOrder
    source?: SortOrder
    summary?: SortOrder
    status?: SortOrder
    reviewerHandle?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    alertId?: SortOrder
  }

  export type EnumEscalationLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationLevel | EnumEscalationLevelFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationLevelWithAggregatesFilter<$PrismaModel> | $Enums.EscalationLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationLevelFilter<$PrismaModel>
    _max?: NestedEnumEscalationLevelFilter<$PrismaModel>
  }

  export type EnumEscalationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationSource | EnumEscalationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationSourceWithAggregatesFilter<$PrismaModel> | $Enums.EscalationSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationSourceFilter<$PrismaModel>
    _max?: NestedEnumEscalationSourceFilter<$PrismaModel>
  }

  export type EnumEscalationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusWithAggregatesFilter<$PrismaModel> | $Enums.EscalationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationStatusFilter<$PrismaModel>
    _max?: NestedEnumEscalationStatusFilter<$PrismaModel>
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

  export type KeywordRuleCountOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeywordRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KeywordRuleMinOrderByAggregateInput = {
    id?: SortOrder
    term?: SortOrder
    severity?: SortOrder
    category?: SortOrder
    enabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SafetyMitigationCreateNestedManyWithoutAlertInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
  }

  export type EscalationQueueCreateNestedManyWithoutAlertInput = {
    create?: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput> | EscalationQueueCreateWithoutAlertInput[] | EscalationQueueUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: EscalationQueueCreateOrConnectWithoutAlertInput | EscalationQueueCreateOrConnectWithoutAlertInput[]
    createMany?: EscalationQueueCreateManyAlertInputEnvelope
    connect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
  }

  export type SafetyMitigationUncheckedCreateNestedManyWithoutAlertInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
  }

  export type EscalationQueueUncheckedCreateNestedManyWithoutAlertInput = {
    create?: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput> | EscalationQueueCreateWithoutAlertInput[] | EscalationQueueUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: EscalationQueueCreateOrConnectWithoutAlertInput | EscalationQueueCreateOrConnectWithoutAlertInput[]
    createMany?: EscalationQueueCreateManyAlertInputEnvelope
    connect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
  }

  export type EnumSafetySeverityFieldUpdateOperationsInput = {
    set?: $Enums.SafetySeverity
  }

  export type EnumSafetyCategoryFieldUpdateOperationsInput = {
    set?: $Enums.SafetyCategory
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SafetyMitigationUpdateManyWithoutAlertNestedInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    upsert?: SafetyMitigationUpsertWithWhereUniqueWithoutAlertInput | SafetyMitigationUpsertWithWhereUniqueWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    set?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    disconnect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    delete?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    update?: SafetyMitigationUpdateWithWhereUniqueWithoutAlertInput | SafetyMitigationUpdateWithWhereUniqueWithoutAlertInput[]
    updateMany?: SafetyMitigationUpdateManyWithWhereWithoutAlertInput | SafetyMitigationUpdateManyWithWhereWithoutAlertInput[]
    deleteMany?: SafetyMitigationScalarWhereInput | SafetyMitigationScalarWhereInput[]
  }

  export type EscalationQueueUpdateManyWithoutAlertNestedInput = {
    create?: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput> | EscalationQueueCreateWithoutAlertInput[] | EscalationQueueUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: EscalationQueueCreateOrConnectWithoutAlertInput | EscalationQueueCreateOrConnectWithoutAlertInput[]
    upsert?: EscalationQueueUpsertWithWhereUniqueWithoutAlertInput | EscalationQueueUpsertWithWhereUniqueWithoutAlertInput[]
    createMany?: EscalationQueueCreateManyAlertInputEnvelope
    set?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    disconnect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    delete?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    connect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    update?: EscalationQueueUpdateWithWhereUniqueWithoutAlertInput | EscalationQueueUpdateWithWhereUniqueWithoutAlertInput[]
    updateMany?: EscalationQueueUpdateManyWithWhereWithoutAlertInput | EscalationQueueUpdateManyWithWhereWithoutAlertInput[]
    deleteMany?: EscalationQueueScalarWhereInput | EscalationQueueScalarWhereInput[]
  }

  export type SafetyMitigationUncheckedUpdateManyWithoutAlertNestedInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    upsert?: SafetyMitigationUpsertWithWhereUniqueWithoutAlertInput | SafetyMitigationUpsertWithWhereUniqueWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    set?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    disconnect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    delete?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
    update?: SafetyMitigationUpdateWithWhereUniqueWithoutAlertInput | SafetyMitigationUpdateWithWhereUniqueWithoutAlertInput[]
    updateMany?: SafetyMitigationUpdateManyWithWhereWithoutAlertInput | SafetyMitigationUpdateManyWithWhereWithoutAlertInput[]
    deleteMany?: SafetyMitigationScalarWhereInput | SafetyMitigationScalarWhereInput[]
  }

  export type EscalationQueueUncheckedUpdateManyWithoutAlertNestedInput = {
    create?: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput> | EscalationQueueCreateWithoutAlertInput[] | EscalationQueueUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: EscalationQueueCreateOrConnectWithoutAlertInput | EscalationQueueCreateOrConnectWithoutAlertInput[]
    upsert?: EscalationQueueUpsertWithWhereUniqueWithoutAlertInput | EscalationQueueUpsertWithWhereUniqueWithoutAlertInput[]
    createMany?: EscalationQueueCreateManyAlertInputEnvelope
    set?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    disconnect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    delete?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    connect?: EscalationQueueWhereUniqueInput | EscalationQueueWhereUniqueInput[]
    update?: EscalationQueueUpdateWithWhereUniqueWithoutAlertInput | EscalationQueueUpdateWithWhereUniqueWithoutAlertInput[]
    updateMany?: EscalationQueueUpdateManyWithWhereWithoutAlertInput | EscalationQueueUpdateManyWithWhereWithoutAlertInput[]
    deleteMany?: EscalationQueueScalarWhereInput | EscalationQueueScalarWhereInput[]
  }

  export type SafetyAlertCreateNestedOneWithoutMitigationsInput = {
    create?: XOR<SafetyAlertCreateWithoutMitigationsInput, SafetyAlertUncheckedCreateWithoutMitigationsInput>
    connectOrCreate?: SafetyAlertCreateOrConnectWithoutMitigationsInput
    connect?: SafetyAlertWhereUniqueInput
  }

  export type EnumMitigationActionFieldUpdateOperationsInput = {
    set?: $Enums.MitigationAction
  }

  export type SafetyAlertUpdateOneRequiredWithoutMitigationsNestedInput = {
    create?: XOR<SafetyAlertCreateWithoutMitigationsInput, SafetyAlertUncheckedCreateWithoutMitigationsInput>
    connectOrCreate?: SafetyAlertCreateOrConnectWithoutMitigationsInput
    upsert?: SafetyAlertUpsertWithoutMitigationsInput
    connect?: SafetyAlertWhereUniqueInput
    update?: XOR<XOR<SafetyAlertUpdateToOneWithWhereWithoutMitigationsInput, SafetyAlertUpdateWithoutMitigationsInput>, SafetyAlertUncheckedUpdateWithoutMitigationsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SafetyAlertCreateNestedOneWithoutEscalationsInput = {
    create?: XOR<SafetyAlertCreateWithoutEscalationsInput, SafetyAlertUncheckedCreateWithoutEscalationsInput>
    connectOrCreate?: SafetyAlertCreateOrConnectWithoutEscalationsInput
    connect?: SafetyAlertWhereUniqueInput
  }

  export type EnumEscalationLevelFieldUpdateOperationsInput = {
    set?: $Enums.EscalationLevel
  }

  export type EnumEscalationSourceFieldUpdateOperationsInput = {
    set?: $Enums.EscalationSource
  }

  export type EnumEscalationStatusFieldUpdateOperationsInput = {
    set?: $Enums.EscalationStatus
  }

  export type SafetyAlertUpdateOneWithoutEscalationsNestedInput = {
    create?: XOR<SafetyAlertCreateWithoutEscalationsInput, SafetyAlertUncheckedCreateWithoutEscalationsInput>
    connectOrCreate?: SafetyAlertCreateOrConnectWithoutEscalationsInput
    upsert?: SafetyAlertUpsertWithoutEscalationsInput
    disconnect?: SafetyAlertWhereInput | boolean
    delete?: SafetyAlertWhereInput | boolean
    connect?: SafetyAlertWhereUniqueInput
    update?: XOR<XOR<SafetyAlertUpdateToOneWithWhereWithoutEscalationsInput, SafetyAlertUpdateWithoutEscalationsInput>, SafetyAlertUncheckedUpdateWithoutEscalationsInput>
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

  export type NestedEnumSafetySeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetySeverity | EnumSafetySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetySeverityFilter<$PrismaModel> | $Enums.SafetySeverity
  }

  export type NestedEnumSafetyCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCategory | EnumSafetyCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyCategoryFilter<$PrismaModel> | $Enums.SafetyCategory
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumSafetySeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetySeverity | EnumSafetySeverityFieldRefInput<$PrismaModel>
    in?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetySeverity[] | ListEnumSafetySeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetySeverityWithAggregatesFilter<$PrismaModel> | $Enums.SafetySeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetySeverityFilter<$PrismaModel>
    _max?: NestedEnumSafetySeverityFilter<$PrismaModel>
  }

  export type NestedEnumSafetyCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SafetyCategory | EnumSafetyCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.SafetyCategory[] | ListEnumSafetyCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumSafetyCategoryWithAggregatesFilter<$PrismaModel> | $Enums.SafetyCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSafetyCategoryFilter<$PrismaModel>
    _max?: NestedEnumSafetyCategoryFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumMitigationActionFilter<$PrismaModel = never> = {
    equals?: $Enums.MitigationAction | EnumMitigationActionFieldRefInput<$PrismaModel>
    in?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumMitigationActionFilter<$PrismaModel> | $Enums.MitigationAction
  }

  export type NestedEnumMitigationActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MitigationAction | EnumMitigationActionFieldRefInput<$PrismaModel>
    in?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.MitigationAction[] | ListEnumMitigationActionFieldRefInput<$PrismaModel>
    not?: NestedEnumMitigationActionWithAggregatesFilter<$PrismaModel> | $Enums.MitigationAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMitigationActionFilter<$PrismaModel>
    _max?: NestedEnumMitigationActionFilter<$PrismaModel>
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

  export type NestedEnumEscalationLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationLevel | EnumEscalationLevelFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationLevelFilter<$PrismaModel> | $Enums.EscalationLevel
  }

  export type NestedEnumEscalationSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationSource | EnumEscalationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationSourceFilter<$PrismaModel> | $Enums.EscalationSource
  }

  export type NestedEnumEscalationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusFilter<$PrismaModel> | $Enums.EscalationStatus
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

  export type NestedEnumEscalationLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationLevel | EnumEscalationLevelFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationLevel[] | ListEnumEscalationLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationLevelWithAggregatesFilter<$PrismaModel> | $Enums.EscalationLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationLevelFilter<$PrismaModel>
    _max?: NestedEnumEscalationLevelFilter<$PrismaModel>
  }

  export type NestedEnumEscalationSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationSource | EnumEscalationSourceFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationSource[] | ListEnumEscalationSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationSourceWithAggregatesFilter<$PrismaModel> | $Enums.EscalationSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationSourceFilter<$PrismaModel>
    _max?: NestedEnumEscalationSourceFilter<$PrismaModel>
  }

  export type NestedEnumEscalationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusWithAggregatesFilter<$PrismaModel> | $Enums.EscalationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEscalationStatusFilter<$PrismaModel>
    _max?: NestedEnumEscalationStatusFilter<$PrismaModel>
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

  export type SafetyMitigationCreateWithoutAlertInput = {
    id?: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUncheckedCreateWithoutAlertInput = {
    id?: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationCreateOrConnectWithoutAlertInput = {
    where: SafetyMitigationWhereUniqueInput
    create: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput>
  }

  export type SafetyMitigationCreateManyAlertInputEnvelope = {
    data: SafetyMitigationCreateManyAlertInput | SafetyMitigationCreateManyAlertInput[]
    skipDuplicates?: boolean
  }

  export type EscalationQueueCreateWithoutAlertInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EscalationQueueUncheckedCreateWithoutAlertInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EscalationQueueCreateOrConnectWithoutAlertInput = {
    where: EscalationQueueWhereUniqueInput
    create: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput>
  }

  export type EscalationQueueCreateManyAlertInputEnvelope = {
    data: EscalationQueueCreateManyAlertInput | EscalationQueueCreateManyAlertInput[]
    skipDuplicates?: boolean
  }

  export type SafetyMitigationUpsertWithWhereUniqueWithoutAlertInput = {
    where: SafetyMitigationWhereUniqueInput
    update: XOR<SafetyMitigationUpdateWithoutAlertInput, SafetyMitigationUncheckedUpdateWithoutAlertInput>
    create: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput>
  }

  export type SafetyMitigationUpdateWithWhereUniqueWithoutAlertInput = {
    where: SafetyMitigationWhereUniqueInput
    data: XOR<SafetyMitigationUpdateWithoutAlertInput, SafetyMitigationUncheckedUpdateWithoutAlertInput>
  }

  export type SafetyMitigationUpdateManyWithWhereWithoutAlertInput = {
    where: SafetyMitigationScalarWhereInput
    data: XOR<SafetyMitigationUpdateManyMutationInput, SafetyMitigationUncheckedUpdateManyWithoutAlertInput>
  }

  export type SafetyMitigationScalarWhereInput = {
    AND?: SafetyMitigationScalarWhereInput | SafetyMitigationScalarWhereInput[]
    OR?: SafetyMitigationScalarWhereInput[]
    NOT?: SafetyMitigationScalarWhereInput | SafetyMitigationScalarWhereInput[]
    id?: UuidFilter<"SafetyMitigation"> | string
    alertId?: UuidFilter<"SafetyMitigation"> | string
    action?: EnumMitigationActionFilter<"SafetyMitigation"> | $Enums.MitigationAction
    success?: BoolFilter<"SafetyMitigation"> | boolean
    metadata?: JsonNullableFilter<"SafetyMitigation">
    createdAt?: DateTimeFilter<"SafetyMitigation"> | Date | string
  }

  export type EscalationQueueUpsertWithWhereUniqueWithoutAlertInput = {
    where: EscalationQueueWhereUniqueInput
    update: XOR<EscalationQueueUpdateWithoutAlertInput, EscalationQueueUncheckedUpdateWithoutAlertInput>
    create: XOR<EscalationQueueCreateWithoutAlertInput, EscalationQueueUncheckedCreateWithoutAlertInput>
  }

  export type EscalationQueueUpdateWithWhereUniqueWithoutAlertInput = {
    where: EscalationQueueWhereUniqueInput
    data: XOR<EscalationQueueUpdateWithoutAlertInput, EscalationQueueUncheckedUpdateWithoutAlertInput>
  }

  export type EscalationQueueUpdateManyWithWhereWithoutAlertInput = {
    where: EscalationQueueScalarWhereInput
    data: XOR<EscalationQueueUpdateManyMutationInput, EscalationQueueUncheckedUpdateManyWithoutAlertInput>
  }

  export type EscalationQueueScalarWhereInput = {
    AND?: EscalationQueueScalarWhereInput | EscalationQueueScalarWhereInput[]
    OR?: EscalationQueueScalarWhereInput[]
    NOT?: EscalationQueueScalarWhereInput | EscalationQueueScalarWhereInput[]
    id?: UuidFilter<"EscalationQueue"> | string
    sessionRef?: StringFilter<"EscalationQueue"> | string
    level?: EnumEscalationLevelFilter<"EscalationQueue"> | $Enums.EscalationLevel
    source?: EnumEscalationSourceFilter<"EscalationQueue"> | $Enums.EscalationSource
    summary?: StringFilter<"EscalationQueue"> | string
    status?: EnumEscalationStatusFilter<"EscalationQueue"> | $Enums.EscalationStatus
    reviewerHandle?: StringNullableFilter<"EscalationQueue"> | string | null
    createdAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    updatedAt?: DateTimeFilter<"EscalationQueue"> | Date | string
    alertId?: UuidNullableFilter<"EscalationQueue"> | string | null
  }

  export type SafetyAlertCreateWithoutMitigationsInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    escalations?: EscalationQueueCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUncheckedCreateWithoutMitigationsInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    escalations?: EscalationQueueUncheckedCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertCreateOrConnectWithoutMitigationsInput = {
    where: SafetyAlertWhereUniqueInput
    create: XOR<SafetyAlertCreateWithoutMitigationsInput, SafetyAlertUncheckedCreateWithoutMitigationsInput>
  }

  export type SafetyAlertUpsertWithoutMitigationsInput = {
    update: XOR<SafetyAlertUpdateWithoutMitigationsInput, SafetyAlertUncheckedUpdateWithoutMitigationsInput>
    create: XOR<SafetyAlertCreateWithoutMitigationsInput, SafetyAlertUncheckedCreateWithoutMitigationsInput>
    where?: SafetyAlertWhereInput
  }

  export type SafetyAlertUpdateToOneWithWhereWithoutMitigationsInput = {
    where?: SafetyAlertWhereInput
    data: XOR<SafetyAlertUpdateWithoutMitigationsInput, SafetyAlertUncheckedUpdateWithoutMitigationsInput>
  }

  export type SafetyAlertUpdateWithoutMitigationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    escalations?: EscalationQueueUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertUncheckedUpdateWithoutMitigationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    escalations?: EscalationQueueUncheckedUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertCreateWithoutEscalationsInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    mitigations?: SafetyMitigationCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUncheckedCreateWithoutEscalationsInput = {
    id?: string
    sessionId: string
    severity: $Enums.SafetySeverity
    category: $Enums.SafetyCategory
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    mitigations?: SafetyMitigationUncheckedCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertCreateOrConnectWithoutEscalationsInput = {
    where: SafetyAlertWhereUniqueInput
    create: XOR<SafetyAlertCreateWithoutEscalationsInput, SafetyAlertUncheckedCreateWithoutEscalationsInput>
  }

  export type SafetyAlertUpsertWithoutEscalationsInput = {
    update: XOR<SafetyAlertUpdateWithoutEscalationsInput, SafetyAlertUncheckedUpdateWithoutEscalationsInput>
    create: XOR<SafetyAlertCreateWithoutEscalationsInput, SafetyAlertUncheckedCreateWithoutEscalationsInput>
    where?: SafetyAlertWhereInput
  }

  export type SafetyAlertUpdateToOneWithWhereWithoutEscalationsInput = {
    where?: SafetyAlertWhereInput
    data: XOR<SafetyAlertUpdateWithoutEscalationsInput, SafetyAlertUncheckedUpdateWithoutEscalationsInput>
  }

  export type SafetyAlertUpdateWithoutEscalationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertUncheckedUpdateWithoutEscalationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: EnumSafetySeverityFieldUpdateOperationsInput | $Enums.SafetySeverity
    category?: EnumSafetyCategoryFieldUpdateOperationsInput | $Enums.SafetyCategory
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUncheckedUpdateManyWithoutAlertNestedInput
  }

  export type SafetyMitigationCreateManyAlertInput = {
    id?: string
    action: $Enums.MitigationAction
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type EscalationQueueCreateManyAlertInput = {
    id?: string
    sessionRef: string
    level: $Enums.EscalationLevel
    source: $Enums.EscalationSource
    summary: string
    status?: $Enums.EscalationStatus
    reviewerHandle?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SafetyMitigationUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateManyWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumMitigationActionFieldUpdateOperationsInput | $Enums.MitigationAction
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EscalationQueueUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EscalationQueueUncheckedUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EscalationQueueUncheckedUpdateManyWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRef?: StringFieldUpdateOperationsInput | string
    level?: EnumEscalationLevelFieldUpdateOperationsInput | $Enums.EscalationLevel
    source?: EnumEscalationSourceFieldUpdateOperationsInput | $Enums.EscalationSource
    summary?: StringFieldUpdateOperationsInput | string
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    reviewerHandle?: NullableStringFieldUpdateOperationsInput | string | null
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