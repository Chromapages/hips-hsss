
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
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SafetyAlerts
 * const safetyAlerts = await prisma.safetyAlert.findMany()
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
   * // Fetch zero or more SafetyAlerts
   * const safetyAlerts = await prisma.safetyAlert.findMany()
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
    SafetyAlert: 'SafetyAlert',
    SafetyMitigation: 'SafetyMitigation',
    SafetyStrike: 'SafetyStrike',
    SafetyAuditLog: 'SafetyAuditLog'
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
      modelProps: "safetyAlert" | "safetyMitigation" | "safetyStrike" | "safetyAuditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
  }

  export type SafetyAlertCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mitigations?: boolean | SafetyAlertCountOutputTypeCountMitigationsArgs
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
   * Models
   */

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
    severity: string | null
    category: string | null
    anonymizedReason: string | null
    transcriptChunk: string | null
    isResolved: boolean | null
    createdAt: Date | null
  }

  export type SafetyAlertMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    severity: string | null
    category: string | null
    anonymizedReason: string | null
    transcriptChunk: string | null
    isResolved: boolean | null
    createdAt: Date | null
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
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk: string | null
    isResolved: boolean
    createdAt: Date
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
    mitigations?: boolean | SafetyAlert$mitigationsArgs<ExtArgs>
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
  }

  export type SafetyAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mitigations?: boolean | SafetyAlert$mitigationsArgs<ExtArgs>
    _count?: boolean | SafetyAlertCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SafetyAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SafetyAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SafetyAlert"
    objects: {
      mitigations: Prisma.$SafetyMitigationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      severity: string
      category: string
      anonymizedReason: string
      transcriptChunk: string | null
      isResolved: boolean
      createdAt: Date
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
    readonly severity: FieldRef<"SafetyAlert", 'String'>
    readonly category: FieldRef<"SafetyAlert", 'String'>
    readonly anonymizedReason: FieldRef<"SafetyAlert", 'String'>
    readonly transcriptChunk: FieldRef<"SafetyAlert", 'String'>
    readonly isResolved: FieldRef<"SafetyAlert", 'Boolean'>
    readonly createdAt: FieldRef<"SafetyAlert", 'DateTime'>
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
    action: string | null
    success: boolean | null
    createdAt: Date | null
  }

  export type SafetyMitigationMaxAggregateOutputType = {
    id: string | null
    alertId: string | null
    action: string | null
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
    action: string
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
      action: string
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
    readonly action: FieldRef<"SafetyMitigation", 'String'>
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
  }

  export type SafetyStrikeMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    participantId: string | null
    count: number | null
    lastStrikeAt: Date | null
    createdAt: Date | null
  }

  export type SafetyStrikeCountAggregateOutputType = {
    id: number
    sessionId: number
    participantId: number
    count: number
    lastStrikeAt: number
    createdAt: number
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
  }

  export type SafetyStrikeMaxAggregateInputType = {
    id?: true
    sessionId?: true
    participantId?: true
    count?: true
    lastStrikeAt?: true
    createdAt?: true
  }

  export type SafetyStrikeCountAggregateInputType = {
    id?: true
    sessionId?: true
    participantId?: true
    count?: true
    lastStrikeAt?: true
    createdAt?: true
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
  }, ExtArgs["result"]["safetyStrike"]>

  export type SafetyStrikeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    participantId?: boolean
    count?: boolean
    lastStrikeAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["safetyStrike"]>

  export type SafetyStrikeSelectScalar = {
    id?: boolean
    sessionId?: boolean
    participantId?: boolean
    count?: boolean
    lastStrikeAt?: boolean
    createdAt?: boolean
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
  }

  export type SafetyAuditLogMaxAggregateOutputType = {
    id: string | null
    action: string | null
    actor: string | null
    createdAt: Date | null
  }

  export type SafetyAuditLogCountAggregateOutputType = {
    id: number
    action: number
    actor: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type SafetyAuditLogMinAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    createdAt?: true
  }

  export type SafetyAuditLogMaxAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    createdAt?: true
  }

  export type SafetyAuditLogCountAggregateInputType = {
    id?: true
    action?: true
    actor?: true
    metadata?: true
    createdAt?: true
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
  }, ExtArgs["result"]["safetyAuditLog"]>

  export type SafetyAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    action?: boolean
    actor?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["safetyAuditLog"]>

  export type SafetyAuditLogSelectScalar = {
    id?: boolean
    action?: boolean
    actor?: boolean
    metadata?: boolean
    createdAt?: boolean
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
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SafetyAlertScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    severity: 'severity',
    category: 'category',
    anonymizedReason: 'anonymizedReason',
    transcriptChunk: 'transcriptChunk',
    isResolved: 'isResolved',
    createdAt: 'createdAt'
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
    createdAt: 'createdAt'
  };

  export type SafetyStrikeScalarFieldEnum = (typeof SafetyStrikeScalarFieldEnum)[keyof typeof SafetyStrikeScalarFieldEnum]


  export const SafetyAuditLogScalarFieldEnum: {
    id: 'id',
    action: 'action',
    actor: 'actor',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type SafetyAuditLogScalarFieldEnum = (typeof SafetyAuditLogScalarFieldEnum)[keyof typeof SafetyAuditLogScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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


  export type SafetyAlertWhereInput = {
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    id?: UuidFilter<"SafetyAlert"> | string
    sessionId?: StringFilter<"SafetyAlert"> | string
    severity?: StringFilter<"SafetyAlert"> | string
    category?: StringFilter<"SafetyAlert"> | string
    anonymizedReason?: StringFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableFilter<"SafetyAlert"> | string | null
    isResolved?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    mitigations?: SafetyMitigationListRelationFilter
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
    mitigations?: SafetyMitigationOrderByRelationAggregateInput
  }

  export type SafetyAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    OR?: SafetyAlertWhereInput[]
    NOT?: SafetyAlertWhereInput | SafetyAlertWhereInput[]
    sessionId?: StringFilter<"SafetyAlert"> | string
    severity?: StringFilter<"SafetyAlert"> | string
    category?: StringFilter<"SafetyAlert"> | string
    anonymizedReason?: StringFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableFilter<"SafetyAlert"> | string | null
    isResolved?: BoolFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeFilter<"SafetyAlert"> | Date | string
    mitigations?: SafetyMitigationListRelationFilter
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
    severity?: StringWithAggregatesFilter<"SafetyAlert"> | string
    category?: StringWithAggregatesFilter<"SafetyAlert"> | string
    anonymizedReason?: StringWithAggregatesFilter<"SafetyAlert"> | string
    transcriptChunk?: StringNullableWithAggregatesFilter<"SafetyAlert"> | string | null
    isResolved?: BoolWithAggregatesFilter<"SafetyAlert"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SafetyAlert"> | Date | string
  }

  export type SafetyMitigationWhereInput = {
    AND?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    OR?: SafetyMitigationWhereInput[]
    NOT?: SafetyMitigationWhereInput | SafetyMitigationWhereInput[]
    id?: UuidFilter<"SafetyMitigation"> | string
    alertId?: UuidFilter<"SafetyMitigation"> | string
    action?: StringFilter<"SafetyMitigation"> | string
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
    action?: StringFilter<"SafetyMitigation"> | string
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
    action?: StringWithAggregatesFilter<"SafetyMitigation"> | string
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
  }

  export type SafetyStrikeOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
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
  }, "id" | "sessionId_participantId">

  export type SafetyStrikeOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
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
  }

  export type SafetyAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
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
  }, "id">

  export type SafetyAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
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
  }

  export type SafetyAlertCreateInput = {
    id?: string
    sessionId: string
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    mitigations?: SafetyMitigationCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUncheckedCreateInput = {
    id?: string
    sessionId: string
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
    mitigations?: SafetyMitigationUncheckedCreateNestedManyWithoutAlertInput
  }

  export type SafetyAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mitigations?: SafetyMitigationUncheckedUpdateManyWithoutAlertNestedInput
  }

  export type SafetyAlertCreateManyInput = {
    id?: string
    sessionId: string
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type SafetyAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationCreateInput = {
    id?: string
    action: string
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    alert: SafetyAlertCreateNestedOneWithoutMitigationsInput
  }

  export type SafetyMitigationUncheckedCreateInput = {
    id?: string
    alertId: string
    action: string
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    alert?: SafetyAlertUpdateOneRequiredWithoutMitigationsNestedInput
  }

  export type SafetyMitigationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    alertId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationCreateManyInput = {
    id?: string
    alertId: string
    action: string
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    alertId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
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
  }

  export type SafetyStrikeUncheckedCreateInput = {
    id?: string
    sessionId: string
    participantId: string
    count?: number
    lastStrikeAt?: Date | string
    createdAt?: Date | string
  }

  export type SafetyStrikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeCreateManyInput = {
    id?: string
    sessionId: string
    participantId: string
    count?: number
    lastStrikeAt?: Date | string
    createdAt?: Date | string
  }

  export type SafetyStrikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyStrikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    lastStrikeAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogCreateInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyAuditLogUncheckedCreateInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogCreateManyInput = {
    id?: string
    action: string
    actor: string
    metadata: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    actor?: StringFieldUpdateOperationsInput | string
    metadata?: JsonNullValueInput | InputJsonValue
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

  export type SafetyMitigationListRelationFilter = {
    every?: SafetyMitigationWhereInput
    some?: SafetyMitigationWhereInput
    none?: SafetyMitigationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SafetyMitigationOrderByRelationAggregateInput = {
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
  }

  export type SafetyStrikeMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    participantId?: SortOrder
    count?: SortOrder
    lastStrikeAt?: SortOrder
    createdAt?: SortOrder
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

  export type SafetyAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type SafetyAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
    createdAt?: SortOrder
  }

  export type SafetyAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    action?: SortOrder
    actor?: SortOrder
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

  export type SafetyMitigationCreateNestedManyWithoutAlertInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
  }

  export type SafetyMitigationUncheckedCreateNestedManyWithoutAlertInput = {
    create?: XOR<SafetyMitigationCreateWithoutAlertInput, SafetyMitigationUncheckedCreateWithoutAlertInput> | SafetyMitigationCreateWithoutAlertInput[] | SafetyMitigationUncheckedCreateWithoutAlertInput[]
    connectOrCreate?: SafetyMitigationCreateOrConnectWithoutAlertInput | SafetyMitigationCreateOrConnectWithoutAlertInput[]
    createMany?: SafetyMitigationCreateManyAlertInputEnvelope
    connect?: SafetyMitigationWhereUniqueInput | SafetyMitigationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
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

  export type SafetyAlertCreateNestedOneWithoutMitigationsInput = {
    create?: XOR<SafetyAlertCreateWithoutMitigationsInput, SafetyAlertUncheckedCreateWithoutMitigationsInput>
    connectOrCreate?: SafetyAlertCreateOrConnectWithoutMitigationsInput
    connect?: SafetyAlertWhereUniqueInput
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

  export type SafetyMitigationCreateWithoutAlertInput = {
    id?: string
    action: string
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUncheckedCreateWithoutAlertInput = {
    id?: string
    action: string
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
    action?: StringFilter<"SafetyMitigation"> | string
    success?: BoolFilter<"SafetyMitigation"> | boolean
    metadata?: JsonNullableFilter<"SafetyMitigation">
    createdAt?: DateTimeFilter<"SafetyMitigation"> | Date | string
  }

  export type SafetyAlertCreateWithoutMitigationsInput = {
    id?: string
    sessionId: string
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
  }

  export type SafetyAlertUncheckedCreateWithoutMitigationsInput = {
    id?: string
    sessionId: string
    severity: string
    category: string
    anonymizedReason: string
    transcriptChunk?: string | null
    isResolved?: boolean
    createdAt?: Date | string
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
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyAlertUncheckedUpdateWithoutMitigationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    anonymizedReason?: StringFieldUpdateOperationsInput | string
    transcriptChunk?: NullableStringFieldUpdateOperationsInput | string | null
    isResolved?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationCreateManyAlertInput = {
    id?: string
    action: string
    success: boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SafetyMitigationUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SafetyMitigationUncheckedUpdateManyWithoutAlertInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    success?: BoolFieldUpdateOperationsInput | boolean
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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