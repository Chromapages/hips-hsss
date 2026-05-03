
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
 * Model IdentityRecord
 * 
 */
export type IdentityRecord = $Result.DefaultSelection<Prisma.$IdentityRecordPayload>
/**
 * Model VaultAccessLog
 * 
 */
export type VaultAccessLog = $Result.DefaultSelection<Prisma.$VaultAccessLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const VaultAccessPurpose: {
  RECORD_CREATE: 'RECORD_CREATE',
  RECORD_READ: 'RECORD_READ',
  CRISIS_DISCLOSURE: 'CRISIS_DISCLOSURE',
  AUDIT_REVIEW: 'AUDIT_REVIEW'
};

export type VaultAccessPurpose = (typeof VaultAccessPurpose)[keyof typeof VaultAccessPurpose]

}

export type VaultAccessPurpose = $Enums.VaultAccessPurpose

export const VaultAccessPurpose: typeof $Enums.VaultAccessPurpose

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more IdentityRecords
 * const identityRecords = await prisma.identityRecord.findMany()
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
   * // Fetch zero or more IdentityRecords
   * const identityRecords = await prisma.identityRecord.findMany()
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
   * `prisma.identityRecord`: Exposes CRUD operations for the **IdentityRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IdentityRecords
    * const identityRecords = await prisma.identityRecord.findMany()
    * ```
    */
  get identityRecord(): Prisma.IdentityRecordDelegate<ExtArgs>;

  /**
   * `prisma.vaultAccessLog`: Exposes CRUD operations for the **VaultAccessLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VaultAccessLogs
    * const vaultAccessLogs = await prisma.vaultAccessLog.findMany()
    * ```
    */
  get vaultAccessLog(): Prisma.VaultAccessLogDelegate<ExtArgs>;
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
    IdentityRecord: 'IdentityRecord',
    VaultAccessLog: 'VaultAccessLog'
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
      modelProps: "identityRecord" | "vaultAccessLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      IdentityRecord: {
        payload: Prisma.$IdentityRecordPayload<ExtArgs>
        fields: Prisma.IdentityRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdentityRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdentityRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          findFirst: {
            args: Prisma.IdentityRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdentityRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          findMany: {
            args: Prisma.IdentityRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>[]
          }
          create: {
            args: Prisma.IdentityRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          createMany: {
            args: Prisma.IdentityRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdentityRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>[]
          }
          delete: {
            args: Prisma.IdentityRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          update: {
            args: Prisma.IdentityRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          deleteMany: {
            args: Prisma.IdentityRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdentityRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IdentityRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdentityRecordPayload>
          }
          aggregate: {
            args: Prisma.IdentityRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdentityRecord>
          }
          groupBy: {
            args: Prisma.IdentityRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdentityRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdentityRecordCountArgs<ExtArgs>
            result: $Utils.Optional<IdentityRecordCountAggregateOutputType> | number
          }
        }
      }
      VaultAccessLog: {
        payload: Prisma.$VaultAccessLogPayload<ExtArgs>
        fields: Prisma.VaultAccessLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VaultAccessLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VaultAccessLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          findFirst: {
            args: Prisma.VaultAccessLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VaultAccessLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          findMany: {
            args: Prisma.VaultAccessLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>[]
          }
          create: {
            args: Prisma.VaultAccessLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          createMany: {
            args: Prisma.VaultAccessLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VaultAccessLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>[]
          }
          delete: {
            args: Prisma.VaultAccessLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          update: {
            args: Prisma.VaultAccessLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          deleteMany: {
            args: Prisma.VaultAccessLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VaultAccessLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VaultAccessLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VaultAccessLogPayload>
          }
          aggregate: {
            args: Prisma.VaultAccessLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVaultAccessLog>
          }
          groupBy: {
            args: Prisma.VaultAccessLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<VaultAccessLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.VaultAccessLogCountArgs<ExtArgs>
            result: $Utils.Optional<VaultAccessLogCountAggregateOutputType> | number
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
   * Models
   */

  /**
   * Model IdentityRecord
   */

  export type AggregateIdentityRecord = {
    _count: IdentityRecordCountAggregateOutputType | null
    _min: IdentityRecordMinAggregateOutputType | null
    _max: IdentityRecordMaxAggregateOutputType | null
  }

  export type IdentityRecordMinAggregateOutputType = {
    id: string | null
    subjectRef: string | null
    encryptedRealName: Uint8Array | null
    encryptedEmergencyContact: Uint8Array | null
    encryptedRegion: Uint8Array | null
    encryptedDisclosure: Uint8Array | null
    encryptedIpAddress: Uint8Array | null
    encryptedDeviceFingerprint: Uint8Array | null
    ipExpiresAt: Date | null
    deviceFingerprintExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityRecordMaxAggregateOutputType = {
    id: string | null
    subjectRef: string | null
    encryptedRealName: Uint8Array | null
    encryptedEmergencyContact: Uint8Array | null
    encryptedRegion: Uint8Array | null
    encryptedDisclosure: Uint8Array | null
    encryptedIpAddress: Uint8Array | null
    encryptedDeviceFingerprint: Uint8Array | null
    ipExpiresAt: Date | null
    deviceFingerprintExpiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IdentityRecordCountAggregateOutputType = {
    id: number
    subjectRef: number
    encryptedRealName: number
    encryptedEmergencyContact: number
    encryptedRegion: number
    encryptedDisclosure: number
    encryptedIpAddress: number
    encryptedDeviceFingerprint: number
    ipExpiresAt: number
    deviceFingerprintExpiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IdentityRecordMinAggregateInputType = {
    id?: true
    subjectRef?: true
    encryptedRealName?: true
    encryptedEmergencyContact?: true
    encryptedRegion?: true
    encryptedDisclosure?: true
    encryptedIpAddress?: true
    encryptedDeviceFingerprint?: true
    ipExpiresAt?: true
    deviceFingerprintExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityRecordMaxAggregateInputType = {
    id?: true
    subjectRef?: true
    encryptedRealName?: true
    encryptedEmergencyContact?: true
    encryptedRegion?: true
    encryptedDisclosure?: true
    encryptedIpAddress?: true
    encryptedDeviceFingerprint?: true
    ipExpiresAt?: true
    deviceFingerprintExpiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IdentityRecordCountAggregateInputType = {
    id?: true
    subjectRef?: true
    encryptedRealName?: true
    encryptedEmergencyContact?: true
    encryptedRegion?: true
    encryptedDisclosure?: true
    encryptedIpAddress?: true
    encryptedDeviceFingerprint?: true
    ipExpiresAt?: true
    deviceFingerprintExpiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IdentityRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdentityRecord to aggregate.
     */
    where?: IdentityRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityRecords to fetch.
     */
    orderBy?: IdentityRecordOrderByWithRelationInput | IdentityRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdentityRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IdentityRecords
    **/
    _count?: true | IdentityRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdentityRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdentityRecordMaxAggregateInputType
  }

  export type GetIdentityRecordAggregateType<T extends IdentityRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateIdentityRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdentityRecord[P]>
      : GetScalarType<T[P], AggregateIdentityRecord[P]>
  }




  export type IdentityRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdentityRecordWhereInput
    orderBy?: IdentityRecordOrderByWithAggregationInput | IdentityRecordOrderByWithAggregationInput[]
    by: IdentityRecordScalarFieldEnum[] | IdentityRecordScalarFieldEnum
    having?: IdentityRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdentityRecordCountAggregateInputType | true
    _min?: IdentityRecordMinAggregateInputType
    _max?: IdentityRecordMaxAggregateInputType
  }

  export type IdentityRecordGroupByOutputType = {
    id: string
    subjectRef: string
    encryptedRealName: Uint8Array
    encryptedEmergencyContact: Uint8Array
    encryptedRegion: Uint8Array
    encryptedDisclosure: Uint8Array | null
    encryptedIpAddress: Uint8Array | null
    encryptedDeviceFingerprint: Uint8Array | null
    ipExpiresAt: Date | null
    deviceFingerprintExpiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: IdentityRecordCountAggregateOutputType | null
    _min: IdentityRecordMinAggregateOutputType | null
    _max: IdentityRecordMaxAggregateOutputType | null
  }

  type GetIdentityRecordGroupByPayload<T extends IdentityRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdentityRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdentityRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdentityRecordGroupByOutputType[P]>
            : GetScalarType<T[P], IdentityRecordGroupByOutputType[P]>
        }
      >
    >


  export type IdentityRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectRef?: boolean
    encryptedRealName?: boolean
    encryptedEmergencyContact?: boolean
    encryptedRegion?: boolean
    encryptedDisclosure?: boolean
    encryptedIpAddress?: boolean
    encryptedDeviceFingerprint?: boolean
    ipExpiresAt?: boolean
    deviceFingerprintExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identityRecord"]>

  export type IdentityRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectRef?: boolean
    encryptedRealName?: boolean
    encryptedEmergencyContact?: boolean
    encryptedRegion?: boolean
    encryptedDisclosure?: boolean
    encryptedIpAddress?: boolean
    encryptedDeviceFingerprint?: boolean
    ipExpiresAt?: boolean
    deviceFingerprintExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["identityRecord"]>

  export type IdentityRecordSelectScalar = {
    id?: boolean
    subjectRef?: boolean
    encryptedRealName?: boolean
    encryptedEmergencyContact?: boolean
    encryptedRegion?: boolean
    encryptedDisclosure?: boolean
    encryptedIpAddress?: boolean
    encryptedDeviceFingerprint?: boolean
    ipExpiresAt?: boolean
    deviceFingerprintExpiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $IdentityRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IdentityRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subjectRef: string
      encryptedRealName: Uint8Array
      encryptedEmergencyContact: Uint8Array
      encryptedRegion: Uint8Array
      encryptedDisclosure: Uint8Array | null
      encryptedIpAddress: Uint8Array | null
      encryptedDeviceFingerprint: Uint8Array | null
      ipExpiresAt: Date | null
      deviceFingerprintExpiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["identityRecord"]>
    composites: {}
  }

  type IdentityRecordGetPayload<S extends boolean | null | undefined | IdentityRecordDefaultArgs> = $Result.GetResult<Prisma.$IdentityRecordPayload, S>

  type IdentityRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IdentityRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IdentityRecordCountAggregateInputType | true
    }

  export interface IdentityRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IdentityRecord'], meta: { name: 'IdentityRecord' } }
    /**
     * Find zero or one IdentityRecord that matches the filter.
     * @param {IdentityRecordFindUniqueArgs} args - Arguments to find a IdentityRecord
     * @example
     * // Get one IdentityRecord
     * const identityRecord = await prisma.identityRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdentityRecordFindUniqueArgs>(args: SelectSubset<T, IdentityRecordFindUniqueArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one IdentityRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IdentityRecordFindUniqueOrThrowArgs} args - Arguments to find a IdentityRecord
     * @example
     * // Get one IdentityRecord
     * const identityRecord = await prisma.identityRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdentityRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, IdentityRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first IdentityRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordFindFirstArgs} args - Arguments to find a IdentityRecord
     * @example
     * // Get one IdentityRecord
     * const identityRecord = await prisma.identityRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdentityRecordFindFirstArgs>(args?: SelectSubset<T, IdentityRecordFindFirstArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first IdentityRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordFindFirstOrThrowArgs} args - Arguments to find a IdentityRecord
     * @example
     * // Get one IdentityRecord
     * const identityRecord = await prisma.identityRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdentityRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, IdentityRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more IdentityRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IdentityRecords
     * const identityRecords = await prisma.identityRecord.findMany()
     * 
     * // Get first 10 IdentityRecords
     * const identityRecords = await prisma.identityRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const identityRecordWithIdOnly = await prisma.identityRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IdentityRecordFindManyArgs>(args?: SelectSubset<T, IdentityRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a IdentityRecord.
     * @param {IdentityRecordCreateArgs} args - Arguments to create a IdentityRecord.
     * @example
     * // Create one IdentityRecord
     * const IdentityRecord = await prisma.identityRecord.create({
     *   data: {
     *     // ... data to create a IdentityRecord
     *   }
     * })
     * 
     */
    create<T extends IdentityRecordCreateArgs>(args: SelectSubset<T, IdentityRecordCreateArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many IdentityRecords.
     * @param {IdentityRecordCreateManyArgs} args - Arguments to create many IdentityRecords.
     * @example
     * // Create many IdentityRecords
     * const identityRecord = await prisma.identityRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdentityRecordCreateManyArgs>(args?: SelectSubset<T, IdentityRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IdentityRecords and returns the data saved in the database.
     * @param {IdentityRecordCreateManyAndReturnArgs} args - Arguments to create many IdentityRecords.
     * @example
     * // Create many IdentityRecords
     * const identityRecord = await prisma.identityRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IdentityRecords and only return the `id`
     * const identityRecordWithIdOnly = await prisma.identityRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdentityRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, IdentityRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a IdentityRecord.
     * @param {IdentityRecordDeleteArgs} args - Arguments to delete one IdentityRecord.
     * @example
     * // Delete one IdentityRecord
     * const IdentityRecord = await prisma.identityRecord.delete({
     *   where: {
     *     // ... filter to delete one IdentityRecord
     *   }
     * })
     * 
     */
    delete<T extends IdentityRecordDeleteArgs>(args: SelectSubset<T, IdentityRecordDeleteArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one IdentityRecord.
     * @param {IdentityRecordUpdateArgs} args - Arguments to update one IdentityRecord.
     * @example
     * // Update one IdentityRecord
     * const identityRecord = await prisma.identityRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdentityRecordUpdateArgs>(args: SelectSubset<T, IdentityRecordUpdateArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more IdentityRecords.
     * @param {IdentityRecordDeleteManyArgs} args - Arguments to filter IdentityRecords to delete.
     * @example
     * // Delete a few IdentityRecords
     * const { count } = await prisma.identityRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdentityRecordDeleteManyArgs>(args?: SelectSubset<T, IdentityRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdentityRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IdentityRecords
     * const identityRecord = await prisma.identityRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdentityRecordUpdateManyArgs>(args: SelectSubset<T, IdentityRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one IdentityRecord.
     * @param {IdentityRecordUpsertArgs} args - Arguments to update or create a IdentityRecord.
     * @example
     * // Update or create a IdentityRecord
     * const identityRecord = await prisma.identityRecord.upsert({
     *   create: {
     *     // ... data to create a IdentityRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IdentityRecord we want to update
     *   }
     * })
     */
    upsert<T extends IdentityRecordUpsertArgs>(args: SelectSubset<T, IdentityRecordUpsertArgs<ExtArgs>>): Prisma__IdentityRecordClient<$Result.GetResult<Prisma.$IdentityRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of IdentityRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordCountArgs} args - Arguments to filter IdentityRecords to count.
     * @example
     * // Count the number of IdentityRecords
     * const count = await prisma.identityRecord.count({
     *   where: {
     *     // ... the filter for the IdentityRecords we want to count
     *   }
     * })
    **/
    count<T extends IdentityRecordCountArgs>(
      args?: Subset<T, IdentityRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdentityRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IdentityRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends IdentityRecordAggregateArgs>(args: Subset<T, IdentityRecordAggregateArgs>): Prisma.PrismaPromise<GetIdentityRecordAggregateType<T>>

    /**
     * Group by IdentityRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdentityRecordGroupByArgs} args - Group by arguments.
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
      T extends IdentityRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdentityRecordGroupByArgs['orderBy'] }
        : { orderBy?: IdentityRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, IdentityRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdentityRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IdentityRecord model
   */
  readonly fields: IdentityRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IdentityRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdentityRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the IdentityRecord model
   */ 
  interface IdentityRecordFieldRefs {
    readonly id: FieldRef<"IdentityRecord", 'String'>
    readonly subjectRef: FieldRef<"IdentityRecord", 'String'>
    readonly encryptedRealName: FieldRef<"IdentityRecord", 'Bytes'>
    readonly encryptedEmergencyContact: FieldRef<"IdentityRecord", 'Bytes'>
    readonly encryptedRegion: FieldRef<"IdentityRecord", 'Bytes'>
    readonly encryptedDisclosure: FieldRef<"IdentityRecord", 'Bytes'>
    readonly encryptedIpAddress: FieldRef<"IdentityRecord", 'Bytes'>
    readonly encryptedDeviceFingerprint: FieldRef<"IdentityRecord", 'Bytes'>
    readonly ipExpiresAt: FieldRef<"IdentityRecord", 'DateTime'>
    readonly deviceFingerprintExpiresAt: FieldRef<"IdentityRecord", 'DateTime'>
    readonly createdAt: FieldRef<"IdentityRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"IdentityRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IdentityRecord findUnique
   */
  export type IdentityRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter, which IdentityRecord to fetch.
     */
    where: IdentityRecordWhereUniqueInput
  }

  /**
   * IdentityRecord findUniqueOrThrow
   */
  export type IdentityRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter, which IdentityRecord to fetch.
     */
    where: IdentityRecordWhereUniqueInput
  }

  /**
   * IdentityRecord findFirst
   */
  export type IdentityRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter, which IdentityRecord to fetch.
     */
    where?: IdentityRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityRecords to fetch.
     */
    orderBy?: IdentityRecordOrderByWithRelationInput | IdentityRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdentityRecords.
     */
    cursor?: IdentityRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdentityRecords.
     */
    distinct?: IdentityRecordScalarFieldEnum | IdentityRecordScalarFieldEnum[]
  }

  /**
   * IdentityRecord findFirstOrThrow
   */
  export type IdentityRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter, which IdentityRecord to fetch.
     */
    where?: IdentityRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityRecords to fetch.
     */
    orderBy?: IdentityRecordOrderByWithRelationInput | IdentityRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdentityRecords.
     */
    cursor?: IdentityRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdentityRecords.
     */
    distinct?: IdentityRecordScalarFieldEnum | IdentityRecordScalarFieldEnum[]
  }

  /**
   * IdentityRecord findMany
   */
  export type IdentityRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter, which IdentityRecords to fetch.
     */
    where?: IdentityRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdentityRecords to fetch.
     */
    orderBy?: IdentityRecordOrderByWithRelationInput | IdentityRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IdentityRecords.
     */
    cursor?: IdentityRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdentityRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdentityRecords.
     */
    skip?: number
    distinct?: IdentityRecordScalarFieldEnum | IdentityRecordScalarFieldEnum[]
  }

  /**
   * IdentityRecord create
   */
  export type IdentityRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * The data needed to create a IdentityRecord.
     */
    data: XOR<IdentityRecordCreateInput, IdentityRecordUncheckedCreateInput>
  }

  /**
   * IdentityRecord createMany
   */
  export type IdentityRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IdentityRecords.
     */
    data: IdentityRecordCreateManyInput | IdentityRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IdentityRecord createManyAndReturn
   */
  export type IdentityRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many IdentityRecords.
     */
    data: IdentityRecordCreateManyInput | IdentityRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IdentityRecord update
   */
  export type IdentityRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * The data needed to update a IdentityRecord.
     */
    data: XOR<IdentityRecordUpdateInput, IdentityRecordUncheckedUpdateInput>
    /**
     * Choose, which IdentityRecord to update.
     */
    where: IdentityRecordWhereUniqueInput
  }

  /**
   * IdentityRecord updateMany
   */
  export type IdentityRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IdentityRecords.
     */
    data: XOR<IdentityRecordUpdateManyMutationInput, IdentityRecordUncheckedUpdateManyInput>
    /**
     * Filter which IdentityRecords to update
     */
    where?: IdentityRecordWhereInput
  }

  /**
   * IdentityRecord upsert
   */
  export type IdentityRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * The filter to search for the IdentityRecord to update in case it exists.
     */
    where: IdentityRecordWhereUniqueInput
    /**
     * In case the IdentityRecord found by the `where` argument doesn't exist, create a new IdentityRecord with this data.
     */
    create: XOR<IdentityRecordCreateInput, IdentityRecordUncheckedCreateInput>
    /**
     * In case the IdentityRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdentityRecordUpdateInput, IdentityRecordUncheckedUpdateInput>
  }

  /**
   * IdentityRecord delete
   */
  export type IdentityRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
    /**
     * Filter which IdentityRecord to delete.
     */
    where: IdentityRecordWhereUniqueInput
  }

  /**
   * IdentityRecord deleteMany
   */
  export type IdentityRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdentityRecords to delete
     */
    where?: IdentityRecordWhereInput
  }

  /**
   * IdentityRecord without action
   */
  export type IdentityRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdentityRecord
     */
    select?: IdentityRecordSelect<ExtArgs> | null
  }


  /**
   * Model VaultAccessLog
   */

  export type AggregateVaultAccessLog = {
    _count: VaultAccessLogCountAggregateOutputType | null
    _min: VaultAccessLogMinAggregateOutputType | null
    _max: VaultAccessLogMaxAggregateOutputType | null
  }

  export type VaultAccessLogMinAggregateOutputType = {
    id: string | null
    subjectRef: string | null
    purpose: $Enums.VaultAccessPurpose | null
    actorRef: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type VaultAccessLogMaxAggregateOutputType = {
    id: string | null
    subjectRef: string | null
    purpose: $Enums.VaultAccessPurpose | null
    actorRef: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type VaultAccessLogCountAggregateOutputType = {
    id: number
    subjectRef: number
    purpose: number
    actorRef: number
    requestId: number
    createdAt: number
    _all: number
  }


  export type VaultAccessLogMinAggregateInputType = {
    id?: true
    subjectRef?: true
    purpose?: true
    actorRef?: true
    requestId?: true
    createdAt?: true
  }

  export type VaultAccessLogMaxAggregateInputType = {
    id?: true
    subjectRef?: true
    purpose?: true
    actorRef?: true
    requestId?: true
    createdAt?: true
  }

  export type VaultAccessLogCountAggregateInputType = {
    id?: true
    subjectRef?: true
    purpose?: true
    actorRef?: true
    requestId?: true
    createdAt?: true
    _all?: true
  }

  export type VaultAccessLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaultAccessLog to aggregate.
     */
    where?: VaultAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultAccessLogs to fetch.
     */
    orderBy?: VaultAccessLogOrderByWithRelationInput | VaultAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VaultAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VaultAccessLogs
    **/
    _count?: true | VaultAccessLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VaultAccessLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VaultAccessLogMaxAggregateInputType
  }

  export type GetVaultAccessLogAggregateType<T extends VaultAccessLogAggregateArgs> = {
        [P in keyof T & keyof AggregateVaultAccessLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVaultAccessLog[P]>
      : GetScalarType<T[P], AggregateVaultAccessLog[P]>
  }




  export type VaultAccessLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VaultAccessLogWhereInput
    orderBy?: VaultAccessLogOrderByWithAggregationInput | VaultAccessLogOrderByWithAggregationInput[]
    by: VaultAccessLogScalarFieldEnum[] | VaultAccessLogScalarFieldEnum
    having?: VaultAccessLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VaultAccessLogCountAggregateInputType | true
    _min?: VaultAccessLogMinAggregateInputType
    _max?: VaultAccessLogMaxAggregateInputType
  }

  export type VaultAccessLogGroupByOutputType = {
    id: string
    subjectRef: string
    purpose: $Enums.VaultAccessPurpose
    actorRef: string
    requestId: string
    createdAt: Date
    _count: VaultAccessLogCountAggregateOutputType | null
    _min: VaultAccessLogMinAggregateOutputType | null
    _max: VaultAccessLogMaxAggregateOutputType | null
  }

  type GetVaultAccessLogGroupByPayload<T extends VaultAccessLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VaultAccessLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VaultAccessLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VaultAccessLogGroupByOutputType[P]>
            : GetScalarType<T[P], VaultAccessLogGroupByOutputType[P]>
        }
      >
    >


  export type VaultAccessLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectRef?: boolean
    purpose?: boolean
    actorRef?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["vaultAccessLog"]>

  export type VaultAccessLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    subjectRef?: boolean
    purpose?: boolean
    actorRef?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["vaultAccessLog"]>

  export type VaultAccessLogSelectScalar = {
    id?: boolean
    subjectRef?: boolean
    purpose?: boolean
    actorRef?: boolean
    requestId?: boolean
    createdAt?: boolean
  }


  export type $VaultAccessLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VaultAccessLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      subjectRef: string
      purpose: $Enums.VaultAccessPurpose
      actorRef: string
      requestId: string
      createdAt: Date
    }, ExtArgs["result"]["vaultAccessLog"]>
    composites: {}
  }

  type VaultAccessLogGetPayload<S extends boolean | null | undefined | VaultAccessLogDefaultArgs> = $Result.GetResult<Prisma.$VaultAccessLogPayload, S>

  type VaultAccessLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VaultAccessLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VaultAccessLogCountAggregateInputType | true
    }

  export interface VaultAccessLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VaultAccessLog'], meta: { name: 'VaultAccessLog' } }
    /**
     * Find zero or one VaultAccessLog that matches the filter.
     * @param {VaultAccessLogFindUniqueArgs} args - Arguments to find a VaultAccessLog
     * @example
     * // Get one VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VaultAccessLogFindUniqueArgs>(args: SelectSubset<T, VaultAccessLogFindUniqueArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VaultAccessLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VaultAccessLogFindUniqueOrThrowArgs} args - Arguments to find a VaultAccessLog
     * @example
     * // Get one VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VaultAccessLogFindUniqueOrThrowArgs>(args: SelectSubset<T, VaultAccessLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VaultAccessLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogFindFirstArgs} args - Arguments to find a VaultAccessLog
     * @example
     * // Get one VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VaultAccessLogFindFirstArgs>(args?: SelectSubset<T, VaultAccessLogFindFirstArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VaultAccessLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogFindFirstOrThrowArgs} args - Arguments to find a VaultAccessLog
     * @example
     * // Get one VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VaultAccessLogFindFirstOrThrowArgs>(args?: SelectSubset<T, VaultAccessLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VaultAccessLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VaultAccessLogs
     * const vaultAccessLogs = await prisma.vaultAccessLog.findMany()
     * 
     * // Get first 10 VaultAccessLogs
     * const vaultAccessLogs = await prisma.vaultAccessLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vaultAccessLogWithIdOnly = await prisma.vaultAccessLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VaultAccessLogFindManyArgs>(args?: SelectSubset<T, VaultAccessLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VaultAccessLog.
     * @param {VaultAccessLogCreateArgs} args - Arguments to create a VaultAccessLog.
     * @example
     * // Create one VaultAccessLog
     * const VaultAccessLog = await prisma.vaultAccessLog.create({
     *   data: {
     *     // ... data to create a VaultAccessLog
     *   }
     * })
     * 
     */
    create<T extends VaultAccessLogCreateArgs>(args: SelectSubset<T, VaultAccessLogCreateArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VaultAccessLogs.
     * @param {VaultAccessLogCreateManyArgs} args - Arguments to create many VaultAccessLogs.
     * @example
     * // Create many VaultAccessLogs
     * const vaultAccessLog = await prisma.vaultAccessLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VaultAccessLogCreateManyArgs>(args?: SelectSubset<T, VaultAccessLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VaultAccessLogs and returns the data saved in the database.
     * @param {VaultAccessLogCreateManyAndReturnArgs} args - Arguments to create many VaultAccessLogs.
     * @example
     * // Create many VaultAccessLogs
     * const vaultAccessLog = await prisma.vaultAccessLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VaultAccessLogs and only return the `id`
     * const vaultAccessLogWithIdOnly = await prisma.vaultAccessLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VaultAccessLogCreateManyAndReturnArgs>(args?: SelectSubset<T, VaultAccessLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VaultAccessLog.
     * @param {VaultAccessLogDeleteArgs} args - Arguments to delete one VaultAccessLog.
     * @example
     * // Delete one VaultAccessLog
     * const VaultAccessLog = await prisma.vaultAccessLog.delete({
     *   where: {
     *     // ... filter to delete one VaultAccessLog
     *   }
     * })
     * 
     */
    delete<T extends VaultAccessLogDeleteArgs>(args: SelectSubset<T, VaultAccessLogDeleteArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VaultAccessLog.
     * @param {VaultAccessLogUpdateArgs} args - Arguments to update one VaultAccessLog.
     * @example
     * // Update one VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VaultAccessLogUpdateArgs>(args: SelectSubset<T, VaultAccessLogUpdateArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VaultAccessLogs.
     * @param {VaultAccessLogDeleteManyArgs} args - Arguments to filter VaultAccessLogs to delete.
     * @example
     * // Delete a few VaultAccessLogs
     * const { count } = await prisma.vaultAccessLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VaultAccessLogDeleteManyArgs>(args?: SelectSubset<T, VaultAccessLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VaultAccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VaultAccessLogs
     * const vaultAccessLog = await prisma.vaultAccessLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VaultAccessLogUpdateManyArgs>(args: SelectSubset<T, VaultAccessLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VaultAccessLog.
     * @param {VaultAccessLogUpsertArgs} args - Arguments to update or create a VaultAccessLog.
     * @example
     * // Update or create a VaultAccessLog
     * const vaultAccessLog = await prisma.vaultAccessLog.upsert({
     *   create: {
     *     // ... data to create a VaultAccessLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VaultAccessLog we want to update
     *   }
     * })
     */
    upsert<T extends VaultAccessLogUpsertArgs>(args: SelectSubset<T, VaultAccessLogUpsertArgs<ExtArgs>>): Prisma__VaultAccessLogClient<$Result.GetResult<Prisma.$VaultAccessLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VaultAccessLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogCountArgs} args - Arguments to filter VaultAccessLogs to count.
     * @example
     * // Count the number of VaultAccessLogs
     * const count = await prisma.vaultAccessLog.count({
     *   where: {
     *     // ... the filter for the VaultAccessLogs we want to count
     *   }
     * })
    **/
    count<T extends VaultAccessLogCountArgs>(
      args?: Subset<T, VaultAccessLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VaultAccessLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VaultAccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VaultAccessLogAggregateArgs>(args: Subset<T, VaultAccessLogAggregateArgs>): Prisma.PrismaPromise<GetVaultAccessLogAggregateType<T>>

    /**
     * Group by VaultAccessLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VaultAccessLogGroupByArgs} args - Group by arguments.
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
      T extends VaultAccessLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VaultAccessLogGroupByArgs['orderBy'] }
        : { orderBy?: VaultAccessLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VaultAccessLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVaultAccessLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VaultAccessLog model
   */
  readonly fields: VaultAccessLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VaultAccessLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VaultAccessLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the VaultAccessLog model
   */ 
  interface VaultAccessLogFieldRefs {
    readonly id: FieldRef<"VaultAccessLog", 'String'>
    readonly subjectRef: FieldRef<"VaultAccessLog", 'String'>
    readonly purpose: FieldRef<"VaultAccessLog", 'VaultAccessPurpose'>
    readonly actorRef: FieldRef<"VaultAccessLog", 'String'>
    readonly requestId: FieldRef<"VaultAccessLog", 'String'>
    readonly createdAt: FieldRef<"VaultAccessLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VaultAccessLog findUnique
   */
  export type VaultAccessLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which VaultAccessLog to fetch.
     */
    where: VaultAccessLogWhereUniqueInput
  }

  /**
   * VaultAccessLog findUniqueOrThrow
   */
  export type VaultAccessLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which VaultAccessLog to fetch.
     */
    where: VaultAccessLogWhereUniqueInput
  }

  /**
   * VaultAccessLog findFirst
   */
  export type VaultAccessLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which VaultAccessLog to fetch.
     */
    where?: VaultAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultAccessLogs to fetch.
     */
    orderBy?: VaultAccessLogOrderByWithRelationInput | VaultAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaultAccessLogs.
     */
    cursor?: VaultAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaultAccessLogs.
     */
    distinct?: VaultAccessLogScalarFieldEnum | VaultAccessLogScalarFieldEnum[]
  }

  /**
   * VaultAccessLog findFirstOrThrow
   */
  export type VaultAccessLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which VaultAccessLog to fetch.
     */
    where?: VaultAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultAccessLogs to fetch.
     */
    orderBy?: VaultAccessLogOrderByWithRelationInput | VaultAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VaultAccessLogs.
     */
    cursor?: VaultAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultAccessLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VaultAccessLogs.
     */
    distinct?: VaultAccessLogScalarFieldEnum | VaultAccessLogScalarFieldEnum[]
  }

  /**
   * VaultAccessLog findMany
   */
  export type VaultAccessLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter, which VaultAccessLogs to fetch.
     */
    where?: VaultAccessLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VaultAccessLogs to fetch.
     */
    orderBy?: VaultAccessLogOrderByWithRelationInput | VaultAccessLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VaultAccessLogs.
     */
    cursor?: VaultAccessLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VaultAccessLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VaultAccessLogs.
     */
    skip?: number
    distinct?: VaultAccessLogScalarFieldEnum | VaultAccessLogScalarFieldEnum[]
  }

  /**
   * VaultAccessLog create
   */
  export type VaultAccessLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * The data needed to create a VaultAccessLog.
     */
    data: XOR<VaultAccessLogCreateInput, VaultAccessLogUncheckedCreateInput>
  }

  /**
   * VaultAccessLog createMany
   */
  export type VaultAccessLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VaultAccessLogs.
     */
    data: VaultAccessLogCreateManyInput | VaultAccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VaultAccessLog createManyAndReturn
   */
  export type VaultAccessLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VaultAccessLogs.
     */
    data: VaultAccessLogCreateManyInput | VaultAccessLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VaultAccessLog update
   */
  export type VaultAccessLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * The data needed to update a VaultAccessLog.
     */
    data: XOR<VaultAccessLogUpdateInput, VaultAccessLogUncheckedUpdateInput>
    /**
     * Choose, which VaultAccessLog to update.
     */
    where: VaultAccessLogWhereUniqueInput
  }

  /**
   * VaultAccessLog updateMany
   */
  export type VaultAccessLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VaultAccessLogs.
     */
    data: XOR<VaultAccessLogUpdateManyMutationInput, VaultAccessLogUncheckedUpdateManyInput>
    /**
     * Filter which VaultAccessLogs to update
     */
    where?: VaultAccessLogWhereInput
  }

  /**
   * VaultAccessLog upsert
   */
  export type VaultAccessLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * The filter to search for the VaultAccessLog to update in case it exists.
     */
    where: VaultAccessLogWhereUniqueInput
    /**
     * In case the VaultAccessLog found by the `where` argument doesn't exist, create a new VaultAccessLog with this data.
     */
    create: XOR<VaultAccessLogCreateInput, VaultAccessLogUncheckedCreateInput>
    /**
     * In case the VaultAccessLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VaultAccessLogUpdateInput, VaultAccessLogUncheckedUpdateInput>
  }

  /**
   * VaultAccessLog delete
   */
  export type VaultAccessLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
    /**
     * Filter which VaultAccessLog to delete.
     */
    where: VaultAccessLogWhereUniqueInput
  }

  /**
   * VaultAccessLog deleteMany
   */
  export type VaultAccessLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VaultAccessLogs to delete
     */
    where?: VaultAccessLogWhereInput
  }

  /**
   * VaultAccessLog without action
   */
  export type VaultAccessLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VaultAccessLog
     */
    select?: VaultAccessLogSelect<ExtArgs> | null
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


  export const IdentityRecordScalarFieldEnum: {
    id: 'id',
    subjectRef: 'subjectRef',
    encryptedRealName: 'encryptedRealName',
    encryptedEmergencyContact: 'encryptedEmergencyContact',
    encryptedRegion: 'encryptedRegion',
    encryptedDisclosure: 'encryptedDisclosure',
    encryptedIpAddress: 'encryptedIpAddress',
    encryptedDeviceFingerprint: 'encryptedDeviceFingerprint',
    ipExpiresAt: 'ipExpiresAt',
    deviceFingerprintExpiresAt: 'deviceFingerprintExpiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IdentityRecordScalarFieldEnum = (typeof IdentityRecordScalarFieldEnum)[keyof typeof IdentityRecordScalarFieldEnum]


  export const VaultAccessLogScalarFieldEnum: {
    id: 'id',
    subjectRef: 'subjectRef',
    purpose: 'purpose',
    actorRef: 'actorRef',
    requestId: 'requestId',
    createdAt: 'createdAt'
  };

  export type VaultAccessLogScalarFieldEnum = (typeof VaultAccessLogScalarFieldEnum)[keyof typeof VaultAccessLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'VaultAccessPurpose'
   */
  export type EnumVaultAccessPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VaultAccessPurpose'>
    


  /**
   * Reference to a field of type 'VaultAccessPurpose[]'
   */
  export type ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VaultAccessPurpose[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type IdentityRecordWhereInput = {
    AND?: IdentityRecordWhereInput | IdentityRecordWhereInput[]
    OR?: IdentityRecordWhereInput[]
    NOT?: IdentityRecordWhereInput | IdentityRecordWhereInput[]
    id?: UuidFilter<"IdentityRecord"> | string
    subjectRef?: StringFilter<"IdentityRecord"> | string
    encryptedRealName?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedEmergencyContact?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedRegion?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedDisclosure?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    encryptedIpAddress?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    encryptedDeviceFingerprint?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    ipExpiresAt?: DateTimeNullableFilter<"IdentityRecord"> | Date | string | null
    deviceFingerprintExpiresAt?: DateTimeNullableFilter<"IdentityRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"IdentityRecord"> | Date | string
    updatedAt?: DateTimeFilter<"IdentityRecord"> | Date | string
  }

  export type IdentityRecordOrderByWithRelationInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    encryptedRealName?: SortOrder
    encryptedEmergencyContact?: SortOrder
    encryptedRegion?: SortOrder
    encryptedDisclosure?: SortOrderInput | SortOrder
    encryptedIpAddress?: SortOrderInput | SortOrder
    encryptedDeviceFingerprint?: SortOrderInput | SortOrder
    ipExpiresAt?: SortOrderInput | SortOrder
    deviceFingerprintExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subjectRef?: string
    AND?: IdentityRecordWhereInput | IdentityRecordWhereInput[]
    OR?: IdentityRecordWhereInput[]
    NOT?: IdentityRecordWhereInput | IdentityRecordWhereInput[]
    encryptedRealName?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedEmergencyContact?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedRegion?: BytesFilter<"IdentityRecord"> | Uint8Array
    encryptedDisclosure?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    encryptedIpAddress?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    encryptedDeviceFingerprint?: BytesNullableFilter<"IdentityRecord"> | Uint8Array | null
    ipExpiresAt?: DateTimeNullableFilter<"IdentityRecord"> | Date | string | null
    deviceFingerprintExpiresAt?: DateTimeNullableFilter<"IdentityRecord"> | Date | string | null
    createdAt?: DateTimeFilter<"IdentityRecord"> | Date | string
    updatedAt?: DateTimeFilter<"IdentityRecord"> | Date | string
  }, "id" | "subjectRef">

  export type IdentityRecordOrderByWithAggregationInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    encryptedRealName?: SortOrder
    encryptedEmergencyContact?: SortOrder
    encryptedRegion?: SortOrder
    encryptedDisclosure?: SortOrderInput | SortOrder
    encryptedIpAddress?: SortOrderInput | SortOrder
    encryptedDeviceFingerprint?: SortOrderInput | SortOrder
    ipExpiresAt?: SortOrderInput | SortOrder
    deviceFingerprintExpiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IdentityRecordCountOrderByAggregateInput
    _max?: IdentityRecordMaxOrderByAggregateInput
    _min?: IdentityRecordMinOrderByAggregateInput
  }

  export type IdentityRecordScalarWhereWithAggregatesInput = {
    AND?: IdentityRecordScalarWhereWithAggregatesInput | IdentityRecordScalarWhereWithAggregatesInput[]
    OR?: IdentityRecordScalarWhereWithAggregatesInput[]
    NOT?: IdentityRecordScalarWhereWithAggregatesInput | IdentityRecordScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"IdentityRecord"> | string
    subjectRef?: StringWithAggregatesFilter<"IdentityRecord"> | string
    encryptedRealName?: BytesWithAggregatesFilter<"IdentityRecord"> | Uint8Array
    encryptedEmergencyContact?: BytesWithAggregatesFilter<"IdentityRecord"> | Uint8Array
    encryptedRegion?: BytesWithAggregatesFilter<"IdentityRecord"> | Uint8Array
    encryptedDisclosure?: BytesNullableWithAggregatesFilter<"IdentityRecord"> | Uint8Array | null
    encryptedIpAddress?: BytesNullableWithAggregatesFilter<"IdentityRecord"> | Uint8Array | null
    encryptedDeviceFingerprint?: BytesNullableWithAggregatesFilter<"IdentityRecord"> | Uint8Array | null
    ipExpiresAt?: DateTimeNullableWithAggregatesFilter<"IdentityRecord"> | Date | string | null
    deviceFingerprintExpiresAt?: DateTimeNullableWithAggregatesFilter<"IdentityRecord"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IdentityRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IdentityRecord"> | Date | string
  }

  export type VaultAccessLogWhereInput = {
    AND?: VaultAccessLogWhereInput | VaultAccessLogWhereInput[]
    OR?: VaultAccessLogWhereInput[]
    NOT?: VaultAccessLogWhereInput | VaultAccessLogWhereInput[]
    id?: UuidFilter<"VaultAccessLog"> | string
    subjectRef?: StringFilter<"VaultAccessLog"> | string
    purpose?: EnumVaultAccessPurposeFilter<"VaultAccessLog"> | $Enums.VaultAccessPurpose
    actorRef?: StringFilter<"VaultAccessLog"> | string
    requestId?: StringFilter<"VaultAccessLog"> | string
    createdAt?: DateTimeFilter<"VaultAccessLog"> | Date | string
  }

  export type VaultAccessLogOrderByWithRelationInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    purpose?: SortOrder
    actorRef?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type VaultAccessLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VaultAccessLogWhereInput | VaultAccessLogWhereInput[]
    OR?: VaultAccessLogWhereInput[]
    NOT?: VaultAccessLogWhereInput | VaultAccessLogWhereInput[]
    subjectRef?: StringFilter<"VaultAccessLog"> | string
    purpose?: EnumVaultAccessPurposeFilter<"VaultAccessLog"> | $Enums.VaultAccessPurpose
    actorRef?: StringFilter<"VaultAccessLog"> | string
    requestId?: StringFilter<"VaultAccessLog"> | string
    createdAt?: DateTimeFilter<"VaultAccessLog"> | Date | string
  }, "id">

  export type VaultAccessLogOrderByWithAggregationInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    purpose?: SortOrder
    actorRef?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
    _count?: VaultAccessLogCountOrderByAggregateInput
    _max?: VaultAccessLogMaxOrderByAggregateInput
    _min?: VaultAccessLogMinOrderByAggregateInput
  }

  export type VaultAccessLogScalarWhereWithAggregatesInput = {
    AND?: VaultAccessLogScalarWhereWithAggregatesInput | VaultAccessLogScalarWhereWithAggregatesInput[]
    OR?: VaultAccessLogScalarWhereWithAggregatesInput[]
    NOT?: VaultAccessLogScalarWhereWithAggregatesInput | VaultAccessLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"VaultAccessLog"> | string
    subjectRef?: StringWithAggregatesFilter<"VaultAccessLog"> | string
    purpose?: EnumVaultAccessPurposeWithAggregatesFilter<"VaultAccessLog"> | $Enums.VaultAccessPurpose
    actorRef?: StringWithAggregatesFilter<"VaultAccessLog"> | string
    requestId?: StringWithAggregatesFilter<"VaultAccessLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"VaultAccessLog"> | Date | string
  }

  export type IdentityRecordCreateInput = {
    id?: string
    subjectRef: string
    encryptedRealName: Uint8Array
    encryptedEmergencyContact: Uint8Array
    encryptedRegion: Uint8Array
    encryptedDisclosure?: Uint8Array | null
    encryptedIpAddress?: Uint8Array | null
    encryptedDeviceFingerprint?: Uint8Array | null
    ipExpiresAt?: Date | string | null
    deviceFingerprintExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityRecordUncheckedCreateInput = {
    id?: string
    subjectRef: string
    encryptedRealName: Uint8Array
    encryptedEmergencyContact: Uint8Array
    encryptedRegion: Uint8Array
    encryptedDisclosure?: Uint8Array | null
    encryptedIpAddress?: Uint8Array | null
    encryptedDeviceFingerprint?: Uint8Array | null
    ipExpiresAt?: Date | string | null
    deviceFingerprintExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    encryptedRealName?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedEmergencyContact?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedRegion?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedDisclosure?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedIpAddress?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedDeviceFingerprint?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    ipExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deviceFingerprintExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    encryptedRealName?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedEmergencyContact?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedRegion?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedDisclosure?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedIpAddress?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedDeviceFingerprint?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    ipExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deviceFingerprintExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityRecordCreateManyInput = {
    id?: string
    subjectRef: string
    encryptedRealName: Uint8Array
    encryptedEmergencyContact: Uint8Array
    encryptedRegion: Uint8Array
    encryptedDisclosure?: Uint8Array | null
    encryptedIpAddress?: Uint8Array | null
    encryptedDeviceFingerprint?: Uint8Array | null
    ipExpiresAt?: Date | string | null
    deviceFingerprintExpiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IdentityRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    encryptedRealName?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedEmergencyContact?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedRegion?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedDisclosure?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedIpAddress?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedDeviceFingerprint?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    ipExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deviceFingerprintExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdentityRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    encryptedRealName?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedEmergencyContact?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedRegion?: BytesFieldUpdateOperationsInput | Uint8Array
    encryptedDisclosure?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedIpAddress?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    encryptedDeviceFingerprint?: NullableBytesFieldUpdateOperationsInput | Uint8Array | null
    ipExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deviceFingerprintExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultAccessLogCreateInput = {
    id?: string
    subjectRef: string
    purpose: $Enums.VaultAccessPurpose
    actorRef: string
    requestId: string
    createdAt?: Date | string
  }

  export type VaultAccessLogUncheckedCreateInput = {
    id?: string
    subjectRef: string
    purpose: $Enums.VaultAccessPurpose
    actorRef: string
    requestId: string
    createdAt?: Date | string
  }

  export type VaultAccessLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    purpose?: EnumVaultAccessPurposeFieldUpdateOperationsInput | $Enums.VaultAccessPurpose
    actorRef?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultAccessLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    purpose?: EnumVaultAccessPurposeFieldUpdateOperationsInput | $Enums.VaultAccessPurpose
    actorRef?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultAccessLogCreateManyInput = {
    id?: string
    subjectRef: string
    purpose: $Enums.VaultAccessPurpose
    actorRef: string
    requestId: string
    createdAt?: Date | string
  }

  export type VaultAccessLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    purpose?: EnumVaultAccessPurposeFieldUpdateOperationsInput | $Enums.VaultAccessPurpose
    actorRef?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VaultAccessLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    subjectRef?: StringFieldUpdateOperationsInput | string
    purpose?: EnumVaultAccessPurposeFieldUpdateOperationsInput | $Enums.VaultAccessPurpose
    actorRef?: StringFieldUpdateOperationsInput | string
    requestId?: StringFieldUpdateOperationsInput | string
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

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type BytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
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

  export type IdentityRecordCountOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    encryptedRealName?: SortOrder
    encryptedEmergencyContact?: SortOrder
    encryptedRegion?: SortOrder
    encryptedDisclosure?: SortOrder
    encryptedIpAddress?: SortOrder
    encryptedDeviceFingerprint?: SortOrder
    ipExpiresAt?: SortOrder
    deviceFingerprintExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    encryptedRealName?: SortOrder
    encryptedEmergencyContact?: SortOrder
    encryptedRegion?: SortOrder
    encryptedDisclosure?: SortOrder
    encryptedIpAddress?: SortOrder
    encryptedDeviceFingerprint?: SortOrder
    ipExpiresAt?: SortOrder
    deviceFingerprintExpiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IdentityRecordMinOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    encryptedRealName?: SortOrder
    encryptedEmergencyContact?: SortOrder
    encryptedRegion?: SortOrder
    encryptedDisclosure?: SortOrder
    encryptedIpAddress?: SortOrder
    encryptedDeviceFingerprint?: SortOrder
    ipExpiresAt?: SortOrder
    deviceFingerprintExpiresAt?: SortOrder
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

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type BytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
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

  export type EnumVaultAccessPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.VaultAccessPurpose | EnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaultAccessPurposeFilter<$PrismaModel> | $Enums.VaultAccessPurpose
  }

  export type VaultAccessLogCountOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    purpose?: SortOrder
    actorRef?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type VaultAccessLogMaxOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    purpose?: SortOrder
    actorRef?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type VaultAccessLogMinOrderByAggregateInput = {
    id?: SortOrder
    subjectRef?: SortOrder
    purpose?: SortOrder
    actorRef?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumVaultAccessPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VaultAccessPurpose | EnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaultAccessPurposeWithAggregatesFilter<$PrismaModel> | $Enums.VaultAccessPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVaultAccessPurposeFilter<$PrismaModel>
    _max?: NestedEnumVaultAccessPurposeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Uint8Array
  }

  export type NullableBytesFieldUpdateOperationsInput = {
    set?: Uint8Array | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumVaultAccessPurposeFieldUpdateOperationsInput = {
    set?: $Enums.VaultAccessPurpose
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

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type NestedBytesNullableFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableFilter<$PrismaModel> | Uint8Array | null
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

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type NestedBytesNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel> | null
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel> | null
    not?: NestedBytesNullableWithAggregatesFilter<$PrismaModel> | Uint8Array | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBytesNullableFilter<$PrismaModel>
    _max?: NestedBytesNullableFilter<$PrismaModel>
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

  export type NestedEnumVaultAccessPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.VaultAccessPurpose | EnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaultAccessPurposeFilter<$PrismaModel> | $Enums.VaultAccessPurpose
  }

  export type NestedEnumVaultAccessPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VaultAccessPurpose | EnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.VaultAccessPurpose[] | ListEnumVaultAccessPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumVaultAccessPurposeWithAggregatesFilter<$PrismaModel> | $Enums.VaultAccessPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVaultAccessPurposeFilter<$PrismaModel>
    _max?: NestedEnumVaultAccessPurposeFilter<$PrismaModel>
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