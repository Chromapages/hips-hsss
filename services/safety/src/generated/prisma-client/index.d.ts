
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
 * Model Escalation
 * 
 */
export type Escalation = $Result.DefaultSelection<Prisma.$EscalationPayload>
/**
 * Model CrisisEvent
 * 
 */
export type CrisisEvent = $Result.DefaultSelection<Prisma.$CrisisEventPayload>
/**
 * Model AlertLog
 * 
 */
export type AlertLog = $Result.DefaultSelection<Prisma.$AlertLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FlagType: {
  KEYWORD_MATCH: 'KEYWORD_MATCH',
  COUNSELOR_FLAG: 'COUNSELOR_FLAG',
  REPEATED_DISTRESS: 'REPEATED_DISTRESS'
};

export type FlagType = (typeof FlagType)[keyof typeof FlagType]


export const EscalationStatus: {
  SOFT_ALERT: 'SOFT_ALERT',
  ESCALATION_REVIEW: 'ESCALATION_REVIEW',
  CRISIS_ACTIVE: 'CRISIS_ACTIVE',
  RESOLVED: 'RESOLVED'
};

export type EscalationStatus = (typeof EscalationStatus)[keyof typeof EscalationStatus]


export const AlertChannel: {
  SMS_PRIMARY: 'SMS_PRIMARY',
  SMS_BACKUP: 'SMS_BACKUP',
  SLACK: 'SLACK'
};

export type AlertChannel = (typeof AlertChannel)[keyof typeof AlertChannel]

}

export type FlagType = $Enums.FlagType

export const FlagType: typeof $Enums.FlagType

export type EscalationStatus = $Enums.EscalationStatus

export const EscalationStatus: typeof $Enums.EscalationStatus

export type AlertChannel = $Enums.AlertChannel

export const AlertChannel: typeof $Enums.AlertChannel

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Escalations
 * const escalations = await prisma.escalation.findMany()
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
   * // Fetch zero or more Escalations
   * const escalations = await prisma.escalation.findMany()
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
   * `prisma.escalation`: Exposes CRUD operations for the **Escalation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Escalations
    * const escalations = await prisma.escalation.findMany()
    * ```
    */
  get escalation(): Prisma.EscalationDelegate<ExtArgs>;

  /**
   * `prisma.crisisEvent`: Exposes CRUD operations for the **CrisisEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CrisisEvents
    * const crisisEvents = await prisma.crisisEvent.findMany()
    * ```
    */
  get crisisEvent(): Prisma.CrisisEventDelegate<ExtArgs>;

  /**
   * `prisma.alertLog`: Exposes CRUD operations for the **AlertLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlertLogs
    * const alertLogs = await prisma.alertLog.findMany()
    * ```
    */
  get alertLog(): Prisma.AlertLogDelegate<ExtArgs>;
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
    Escalation: 'Escalation',
    CrisisEvent: 'CrisisEvent',
    AlertLog: 'AlertLog'
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
      modelProps: "escalation" | "crisisEvent" | "alertLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Escalation: {
        payload: Prisma.$EscalationPayload<ExtArgs>
        fields: Prisma.EscalationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EscalationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EscalationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          findFirst: {
            args: Prisma.EscalationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EscalationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          findMany: {
            args: Prisma.EscalationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>[]
          }
          create: {
            args: Prisma.EscalationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          createMany: {
            args: Prisma.EscalationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EscalationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>[]
          }
          delete: {
            args: Prisma.EscalationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          update: {
            args: Prisma.EscalationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          deleteMany: {
            args: Prisma.EscalationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EscalationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EscalationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EscalationPayload>
          }
          aggregate: {
            args: Prisma.EscalationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEscalation>
          }
          groupBy: {
            args: Prisma.EscalationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EscalationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EscalationCountArgs<ExtArgs>
            result: $Utils.Optional<EscalationCountAggregateOutputType> | number
          }
        }
      }
      CrisisEvent: {
        payload: Prisma.$CrisisEventPayload<ExtArgs>
        fields: Prisma.CrisisEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CrisisEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CrisisEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          findFirst: {
            args: Prisma.CrisisEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CrisisEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          findMany: {
            args: Prisma.CrisisEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>[]
          }
          create: {
            args: Prisma.CrisisEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          createMany: {
            args: Prisma.CrisisEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CrisisEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>[]
          }
          delete: {
            args: Prisma.CrisisEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          update: {
            args: Prisma.CrisisEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          deleteMany: {
            args: Prisma.CrisisEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CrisisEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CrisisEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CrisisEventPayload>
          }
          aggregate: {
            args: Prisma.CrisisEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCrisisEvent>
          }
          groupBy: {
            args: Prisma.CrisisEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<CrisisEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.CrisisEventCountArgs<ExtArgs>
            result: $Utils.Optional<CrisisEventCountAggregateOutputType> | number
          }
        }
      }
      AlertLog: {
        payload: Prisma.$AlertLogPayload<ExtArgs>
        fields: Prisma.AlertLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlertLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlertLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          findFirst: {
            args: Prisma.AlertLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlertLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          findMany: {
            args: Prisma.AlertLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>[]
          }
          create: {
            args: Prisma.AlertLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          createMany: {
            args: Prisma.AlertLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlertLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>[]
          }
          delete: {
            args: Prisma.AlertLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          update: {
            args: Prisma.AlertLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          deleteMany: {
            args: Prisma.AlertLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlertLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AlertLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlertLogPayload>
          }
          aggregate: {
            args: Prisma.AlertLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlertLog>
          }
          groupBy: {
            args: Prisma.AlertLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlertLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlertLogCountArgs<ExtArgs>
            result: $Utils.Optional<AlertLogCountAggregateOutputType> | number
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
   * Model Escalation
   */

  export type AggregateEscalation = {
    _count: EscalationCountAggregateOutputType | null
    _avg: EscalationAvgAggregateOutputType | null
    _sum: EscalationSumAggregateOutputType | null
    _min: EscalationMinAggregateOutputType | null
    _max: EscalationMaxAggregateOutputType | null
  }

  export type EscalationAvgAggregateOutputType = {
    severity: number | null
  }

  export type EscalationSumAggregateOutputType = {
    severity: number | null
  }

  export type EscalationMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    flagType: $Enums.FlagType | null
    status: $Enums.EscalationStatus | null
    severity: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resolvedAt: Date | null
    resolvedBy: string | null
    resolutionNote: string | null
  }

  export type EscalationMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    flagType: $Enums.FlagType | null
    status: $Enums.EscalationStatus | null
    severity: number | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
    resolvedAt: Date | null
    resolvedBy: string | null
    resolutionNote: string | null
  }

  export type EscalationCountAggregateOutputType = {
    id: number
    sessionId: number
    flagType: number
    status: number
    severity: number
    notes: number
    createdAt: number
    updatedAt: number
    resolvedAt: number
    resolvedBy: number
    resolutionNote: number
    _all: number
  }


  export type EscalationAvgAggregateInputType = {
    severity?: true
  }

  export type EscalationSumAggregateInputType = {
    severity?: true
  }

  export type EscalationMinAggregateInputType = {
    id?: true
    sessionId?: true
    flagType?: true
    status?: true
    severity?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
    resolvedBy?: true
    resolutionNote?: true
  }

  export type EscalationMaxAggregateInputType = {
    id?: true
    sessionId?: true
    flagType?: true
    status?: true
    severity?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
    resolvedBy?: true
    resolutionNote?: true
  }

  export type EscalationCountAggregateInputType = {
    id?: true
    sessionId?: true
    flagType?: true
    status?: true
    severity?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    resolvedAt?: true
    resolvedBy?: true
    resolutionNote?: true
    _all?: true
  }

  export type EscalationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Escalation to aggregate.
     */
    where?: EscalationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Escalations to fetch.
     */
    orderBy?: EscalationOrderByWithRelationInput | EscalationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EscalationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Escalations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Escalations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Escalations
    **/
    _count?: true | EscalationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EscalationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EscalationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EscalationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EscalationMaxAggregateInputType
  }

  export type GetEscalationAggregateType<T extends EscalationAggregateArgs> = {
        [P in keyof T & keyof AggregateEscalation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEscalation[P]>
      : GetScalarType<T[P], AggregateEscalation[P]>
  }




  export type EscalationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EscalationWhereInput
    orderBy?: EscalationOrderByWithAggregationInput | EscalationOrderByWithAggregationInput[]
    by: EscalationScalarFieldEnum[] | EscalationScalarFieldEnum
    having?: EscalationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EscalationCountAggregateInputType | true
    _avg?: EscalationAvgAggregateInputType
    _sum?: EscalationSumAggregateInputType
    _min?: EscalationMinAggregateInputType
    _max?: EscalationMaxAggregateInputType
  }

  export type EscalationGroupByOutputType = {
    id: string
    sessionId: string
    flagType: $Enums.FlagType
    status: $Enums.EscalationStatus
    severity: number
    notes: string | null
    createdAt: Date
    updatedAt: Date
    resolvedAt: Date | null
    resolvedBy: string | null
    resolutionNote: string | null
    _count: EscalationCountAggregateOutputType | null
    _avg: EscalationAvgAggregateOutputType | null
    _sum: EscalationSumAggregateOutputType | null
    _min: EscalationMinAggregateOutputType | null
    _max: EscalationMaxAggregateOutputType | null
  }

  type GetEscalationGroupByPayload<T extends EscalationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EscalationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EscalationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EscalationGroupByOutputType[P]>
            : GetScalarType<T[P], EscalationGroupByOutputType[P]>
        }
      >
    >


  export type EscalationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    flagType?: boolean
    status?: boolean
    severity?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    resolutionNote?: boolean
  }, ExtArgs["result"]["escalation"]>

  export type EscalationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    flagType?: boolean
    status?: boolean
    severity?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    resolutionNote?: boolean
  }, ExtArgs["result"]["escalation"]>

  export type EscalationSelectScalar = {
    id?: boolean
    sessionId?: boolean
    flagType?: boolean
    status?: boolean
    severity?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    resolutionNote?: boolean
  }


  export type $EscalationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Escalation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      flagType: $Enums.FlagType
      status: $Enums.EscalationStatus
      severity: number
      notes: string | null
      createdAt: Date
      updatedAt: Date
      resolvedAt: Date | null
      resolvedBy: string | null
      resolutionNote: string | null
    }, ExtArgs["result"]["escalation"]>
    composites: {}
  }

  type EscalationGetPayload<S extends boolean | null | undefined | EscalationDefaultArgs> = $Result.GetResult<Prisma.$EscalationPayload, S>

  type EscalationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EscalationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EscalationCountAggregateInputType | true
    }

  export interface EscalationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Escalation'], meta: { name: 'Escalation' } }
    /**
     * Find zero or one Escalation that matches the filter.
     * @param {EscalationFindUniqueArgs} args - Arguments to find a Escalation
     * @example
     * // Get one Escalation
     * const escalation = await prisma.escalation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EscalationFindUniqueArgs>(args: SelectSubset<T, EscalationFindUniqueArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Escalation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EscalationFindUniqueOrThrowArgs} args - Arguments to find a Escalation
     * @example
     * // Get one Escalation
     * const escalation = await prisma.escalation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EscalationFindUniqueOrThrowArgs>(args: SelectSubset<T, EscalationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Escalation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationFindFirstArgs} args - Arguments to find a Escalation
     * @example
     * // Get one Escalation
     * const escalation = await prisma.escalation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EscalationFindFirstArgs>(args?: SelectSubset<T, EscalationFindFirstArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Escalation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationFindFirstOrThrowArgs} args - Arguments to find a Escalation
     * @example
     * // Get one Escalation
     * const escalation = await prisma.escalation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EscalationFindFirstOrThrowArgs>(args?: SelectSubset<T, EscalationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Escalations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Escalations
     * const escalations = await prisma.escalation.findMany()
     * 
     * // Get first 10 Escalations
     * const escalations = await prisma.escalation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const escalationWithIdOnly = await prisma.escalation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EscalationFindManyArgs>(args?: SelectSubset<T, EscalationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Escalation.
     * @param {EscalationCreateArgs} args - Arguments to create a Escalation.
     * @example
     * // Create one Escalation
     * const Escalation = await prisma.escalation.create({
     *   data: {
     *     // ... data to create a Escalation
     *   }
     * })
     * 
     */
    create<T extends EscalationCreateArgs>(args: SelectSubset<T, EscalationCreateArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Escalations.
     * @param {EscalationCreateManyArgs} args - Arguments to create many Escalations.
     * @example
     * // Create many Escalations
     * const escalation = await prisma.escalation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EscalationCreateManyArgs>(args?: SelectSubset<T, EscalationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Escalations and returns the data saved in the database.
     * @param {EscalationCreateManyAndReturnArgs} args - Arguments to create many Escalations.
     * @example
     * // Create many Escalations
     * const escalation = await prisma.escalation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Escalations and only return the `id`
     * const escalationWithIdOnly = await prisma.escalation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EscalationCreateManyAndReturnArgs>(args?: SelectSubset<T, EscalationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Escalation.
     * @param {EscalationDeleteArgs} args - Arguments to delete one Escalation.
     * @example
     * // Delete one Escalation
     * const Escalation = await prisma.escalation.delete({
     *   where: {
     *     // ... filter to delete one Escalation
     *   }
     * })
     * 
     */
    delete<T extends EscalationDeleteArgs>(args: SelectSubset<T, EscalationDeleteArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Escalation.
     * @param {EscalationUpdateArgs} args - Arguments to update one Escalation.
     * @example
     * // Update one Escalation
     * const escalation = await prisma.escalation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EscalationUpdateArgs>(args: SelectSubset<T, EscalationUpdateArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Escalations.
     * @param {EscalationDeleteManyArgs} args - Arguments to filter Escalations to delete.
     * @example
     * // Delete a few Escalations
     * const { count } = await prisma.escalation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EscalationDeleteManyArgs>(args?: SelectSubset<T, EscalationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Escalations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Escalations
     * const escalation = await prisma.escalation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EscalationUpdateManyArgs>(args: SelectSubset<T, EscalationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Escalation.
     * @param {EscalationUpsertArgs} args - Arguments to update or create a Escalation.
     * @example
     * // Update or create a Escalation
     * const escalation = await prisma.escalation.upsert({
     *   create: {
     *     // ... data to create a Escalation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Escalation we want to update
     *   }
     * })
     */
    upsert<T extends EscalationUpsertArgs>(args: SelectSubset<T, EscalationUpsertArgs<ExtArgs>>): Prisma__EscalationClient<$Result.GetResult<Prisma.$EscalationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Escalations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationCountArgs} args - Arguments to filter Escalations to count.
     * @example
     * // Count the number of Escalations
     * const count = await prisma.escalation.count({
     *   where: {
     *     // ... the filter for the Escalations we want to count
     *   }
     * })
    **/
    count<T extends EscalationCountArgs>(
      args?: Subset<T, EscalationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EscalationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Escalation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EscalationAggregateArgs>(args: Subset<T, EscalationAggregateArgs>): Prisma.PrismaPromise<GetEscalationAggregateType<T>>

    /**
     * Group by Escalation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EscalationGroupByArgs} args - Group by arguments.
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
      T extends EscalationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EscalationGroupByArgs['orderBy'] }
        : { orderBy?: EscalationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EscalationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEscalationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Escalation model
   */
  readonly fields: EscalationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Escalation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EscalationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Escalation model
   */ 
  interface EscalationFieldRefs {
    readonly id: FieldRef<"Escalation", 'String'>
    readonly sessionId: FieldRef<"Escalation", 'String'>
    readonly flagType: FieldRef<"Escalation", 'FlagType'>
    readonly status: FieldRef<"Escalation", 'EscalationStatus'>
    readonly severity: FieldRef<"Escalation", 'Int'>
    readonly notes: FieldRef<"Escalation", 'String'>
    readonly createdAt: FieldRef<"Escalation", 'DateTime'>
    readonly updatedAt: FieldRef<"Escalation", 'DateTime'>
    readonly resolvedAt: FieldRef<"Escalation", 'DateTime'>
    readonly resolvedBy: FieldRef<"Escalation", 'String'>
    readonly resolutionNote: FieldRef<"Escalation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Escalation findUnique
   */
  export type EscalationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter, which Escalation to fetch.
     */
    where: EscalationWhereUniqueInput
  }

  /**
   * Escalation findUniqueOrThrow
   */
  export type EscalationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter, which Escalation to fetch.
     */
    where: EscalationWhereUniqueInput
  }

  /**
   * Escalation findFirst
   */
  export type EscalationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter, which Escalation to fetch.
     */
    where?: EscalationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Escalations to fetch.
     */
    orderBy?: EscalationOrderByWithRelationInput | EscalationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Escalations.
     */
    cursor?: EscalationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Escalations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Escalations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Escalations.
     */
    distinct?: EscalationScalarFieldEnum | EscalationScalarFieldEnum[]
  }

  /**
   * Escalation findFirstOrThrow
   */
  export type EscalationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter, which Escalation to fetch.
     */
    where?: EscalationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Escalations to fetch.
     */
    orderBy?: EscalationOrderByWithRelationInput | EscalationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Escalations.
     */
    cursor?: EscalationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Escalations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Escalations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Escalations.
     */
    distinct?: EscalationScalarFieldEnum | EscalationScalarFieldEnum[]
  }

  /**
   * Escalation findMany
   */
  export type EscalationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter, which Escalations to fetch.
     */
    where?: EscalationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Escalations to fetch.
     */
    orderBy?: EscalationOrderByWithRelationInput | EscalationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Escalations.
     */
    cursor?: EscalationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Escalations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Escalations.
     */
    skip?: number
    distinct?: EscalationScalarFieldEnum | EscalationScalarFieldEnum[]
  }

  /**
   * Escalation create
   */
  export type EscalationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * The data needed to create a Escalation.
     */
    data: XOR<EscalationCreateInput, EscalationUncheckedCreateInput>
  }

  /**
   * Escalation createMany
   */
  export type EscalationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Escalations.
     */
    data: EscalationCreateManyInput | EscalationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Escalation createManyAndReturn
   */
  export type EscalationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Escalations.
     */
    data: EscalationCreateManyInput | EscalationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Escalation update
   */
  export type EscalationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * The data needed to update a Escalation.
     */
    data: XOR<EscalationUpdateInput, EscalationUncheckedUpdateInput>
    /**
     * Choose, which Escalation to update.
     */
    where: EscalationWhereUniqueInput
  }

  /**
   * Escalation updateMany
   */
  export type EscalationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Escalations.
     */
    data: XOR<EscalationUpdateManyMutationInput, EscalationUncheckedUpdateManyInput>
    /**
     * Filter which Escalations to update
     */
    where?: EscalationWhereInput
  }

  /**
   * Escalation upsert
   */
  export type EscalationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * The filter to search for the Escalation to update in case it exists.
     */
    where: EscalationWhereUniqueInput
    /**
     * In case the Escalation found by the `where` argument doesn't exist, create a new Escalation with this data.
     */
    create: XOR<EscalationCreateInput, EscalationUncheckedCreateInput>
    /**
     * In case the Escalation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EscalationUpdateInput, EscalationUncheckedUpdateInput>
  }

  /**
   * Escalation delete
   */
  export type EscalationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
    /**
     * Filter which Escalation to delete.
     */
    where: EscalationWhereUniqueInput
  }

  /**
   * Escalation deleteMany
   */
  export type EscalationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Escalations to delete
     */
    where?: EscalationWhereInput
  }

  /**
   * Escalation without action
   */
  export type EscalationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Escalation
     */
    select?: EscalationSelect<ExtArgs> | null
  }


  /**
   * Model CrisisEvent
   */

  export type AggregateCrisisEvent = {
    _count: CrisisEventCountAggregateOutputType | null
    _min: CrisisEventMinAggregateOutputType | null
    _max: CrisisEventMaxAggregateOutputType | null
  }

  export type CrisisEventMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    requesterId: string | null
    requesterRole: string | null
    justification: string | null
    localResource: string | null
    vaultAccessSucceeded: boolean | null
    alertsDispatched: boolean | null
    createdAt: Date | null
  }

  export type CrisisEventMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    requesterId: string | null
    requesterRole: string | null
    justification: string | null
    localResource: string | null
    vaultAccessSucceeded: boolean | null
    alertsDispatched: boolean | null
    createdAt: Date | null
  }

  export type CrisisEventCountAggregateOutputType = {
    id: number
    sessionId: number
    requesterId: number
    requesterRole: number
    justification: number
    vaultFieldsRetrieved: number
    localResource: number
    vaultAccessSucceeded: number
    alertsDispatched: number
    alertChannelsFired: number
    createdAt: number
    _all: number
  }


  export type CrisisEventMinAggregateInputType = {
    id?: true
    sessionId?: true
    requesterId?: true
    requesterRole?: true
    justification?: true
    localResource?: true
    vaultAccessSucceeded?: true
    alertsDispatched?: true
    createdAt?: true
  }

  export type CrisisEventMaxAggregateInputType = {
    id?: true
    sessionId?: true
    requesterId?: true
    requesterRole?: true
    justification?: true
    localResource?: true
    vaultAccessSucceeded?: true
    alertsDispatched?: true
    createdAt?: true
  }

  export type CrisisEventCountAggregateInputType = {
    id?: true
    sessionId?: true
    requesterId?: true
    requesterRole?: true
    justification?: true
    vaultFieldsRetrieved?: true
    localResource?: true
    vaultAccessSucceeded?: true
    alertsDispatched?: true
    alertChannelsFired?: true
    createdAt?: true
    _all?: true
  }

  export type CrisisEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrisisEvent to aggregate.
     */
    where?: CrisisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisEvents to fetch.
     */
    orderBy?: CrisisEventOrderByWithRelationInput | CrisisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CrisisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CrisisEvents
    **/
    _count?: true | CrisisEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CrisisEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CrisisEventMaxAggregateInputType
  }

  export type GetCrisisEventAggregateType<T extends CrisisEventAggregateArgs> = {
        [P in keyof T & keyof AggregateCrisisEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCrisisEvent[P]>
      : GetScalarType<T[P], AggregateCrisisEvent[P]>
  }




  export type CrisisEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CrisisEventWhereInput
    orderBy?: CrisisEventOrderByWithAggregationInput | CrisisEventOrderByWithAggregationInput[]
    by: CrisisEventScalarFieldEnum[] | CrisisEventScalarFieldEnum
    having?: CrisisEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CrisisEventCountAggregateInputType | true
    _min?: CrisisEventMinAggregateInputType
    _max?: CrisisEventMaxAggregateInputType
  }

  export type CrisisEventGroupByOutputType = {
    id: string
    sessionId: string
    requesterId: string
    requesterRole: string
    justification: string
    vaultFieldsRetrieved: string[]
    localResource: string | null
    vaultAccessSucceeded: boolean
    alertsDispatched: boolean
    alertChannelsFired: string[]
    createdAt: Date
    _count: CrisisEventCountAggregateOutputType | null
    _min: CrisisEventMinAggregateOutputType | null
    _max: CrisisEventMaxAggregateOutputType | null
  }

  type GetCrisisEventGroupByPayload<T extends CrisisEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CrisisEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CrisisEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CrisisEventGroupByOutputType[P]>
            : GetScalarType<T[P], CrisisEventGroupByOutputType[P]>
        }
      >
    >


  export type CrisisEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    requesterId?: boolean
    requesterRole?: boolean
    justification?: boolean
    vaultFieldsRetrieved?: boolean
    localResource?: boolean
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["crisisEvent"]>

  export type CrisisEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    requesterId?: boolean
    requesterRole?: boolean
    justification?: boolean
    vaultFieldsRetrieved?: boolean
    localResource?: boolean
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["crisisEvent"]>

  export type CrisisEventSelectScalar = {
    id?: boolean
    sessionId?: boolean
    requesterId?: boolean
    requesterRole?: boolean
    justification?: boolean
    vaultFieldsRetrieved?: boolean
    localResource?: boolean
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: boolean
    createdAt?: boolean
  }


  export type $CrisisEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CrisisEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      requesterId: string
      requesterRole: string
      justification: string
      vaultFieldsRetrieved: string[]
      localResource: string | null
      vaultAccessSucceeded: boolean
      alertsDispatched: boolean
      alertChannelsFired: string[]
      createdAt: Date
    }, ExtArgs["result"]["crisisEvent"]>
    composites: {}
  }

  type CrisisEventGetPayload<S extends boolean | null | undefined | CrisisEventDefaultArgs> = $Result.GetResult<Prisma.$CrisisEventPayload, S>

  type CrisisEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CrisisEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CrisisEventCountAggregateInputType | true
    }

  export interface CrisisEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CrisisEvent'], meta: { name: 'CrisisEvent' } }
    /**
     * Find zero or one CrisisEvent that matches the filter.
     * @param {CrisisEventFindUniqueArgs} args - Arguments to find a CrisisEvent
     * @example
     * // Get one CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CrisisEventFindUniqueArgs>(args: SelectSubset<T, CrisisEventFindUniqueArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CrisisEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CrisisEventFindUniqueOrThrowArgs} args - Arguments to find a CrisisEvent
     * @example
     * // Get one CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CrisisEventFindUniqueOrThrowArgs>(args: SelectSubset<T, CrisisEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CrisisEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventFindFirstArgs} args - Arguments to find a CrisisEvent
     * @example
     * // Get one CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CrisisEventFindFirstArgs>(args?: SelectSubset<T, CrisisEventFindFirstArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CrisisEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventFindFirstOrThrowArgs} args - Arguments to find a CrisisEvent
     * @example
     * // Get one CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CrisisEventFindFirstOrThrowArgs>(args?: SelectSubset<T, CrisisEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CrisisEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CrisisEvents
     * const crisisEvents = await prisma.crisisEvent.findMany()
     * 
     * // Get first 10 CrisisEvents
     * const crisisEvents = await prisma.crisisEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const crisisEventWithIdOnly = await prisma.crisisEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CrisisEventFindManyArgs>(args?: SelectSubset<T, CrisisEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CrisisEvent.
     * @param {CrisisEventCreateArgs} args - Arguments to create a CrisisEvent.
     * @example
     * // Create one CrisisEvent
     * const CrisisEvent = await prisma.crisisEvent.create({
     *   data: {
     *     // ... data to create a CrisisEvent
     *   }
     * })
     * 
     */
    create<T extends CrisisEventCreateArgs>(args: SelectSubset<T, CrisisEventCreateArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CrisisEvents.
     * @param {CrisisEventCreateManyArgs} args - Arguments to create many CrisisEvents.
     * @example
     * // Create many CrisisEvents
     * const crisisEvent = await prisma.crisisEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CrisisEventCreateManyArgs>(args?: SelectSubset<T, CrisisEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CrisisEvents and returns the data saved in the database.
     * @param {CrisisEventCreateManyAndReturnArgs} args - Arguments to create many CrisisEvents.
     * @example
     * // Create many CrisisEvents
     * const crisisEvent = await prisma.crisisEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CrisisEvents and only return the `id`
     * const crisisEventWithIdOnly = await prisma.crisisEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CrisisEventCreateManyAndReturnArgs>(args?: SelectSubset<T, CrisisEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CrisisEvent.
     * @param {CrisisEventDeleteArgs} args - Arguments to delete one CrisisEvent.
     * @example
     * // Delete one CrisisEvent
     * const CrisisEvent = await prisma.crisisEvent.delete({
     *   where: {
     *     // ... filter to delete one CrisisEvent
     *   }
     * })
     * 
     */
    delete<T extends CrisisEventDeleteArgs>(args: SelectSubset<T, CrisisEventDeleteArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CrisisEvent.
     * @param {CrisisEventUpdateArgs} args - Arguments to update one CrisisEvent.
     * @example
     * // Update one CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CrisisEventUpdateArgs>(args: SelectSubset<T, CrisisEventUpdateArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CrisisEvents.
     * @param {CrisisEventDeleteManyArgs} args - Arguments to filter CrisisEvents to delete.
     * @example
     * // Delete a few CrisisEvents
     * const { count } = await prisma.crisisEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CrisisEventDeleteManyArgs>(args?: SelectSubset<T, CrisisEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CrisisEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CrisisEvents
     * const crisisEvent = await prisma.crisisEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CrisisEventUpdateManyArgs>(args: SelectSubset<T, CrisisEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CrisisEvent.
     * @param {CrisisEventUpsertArgs} args - Arguments to update or create a CrisisEvent.
     * @example
     * // Update or create a CrisisEvent
     * const crisisEvent = await prisma.crisisEvent.upsert({
     *   create: {
     *     // ... data to create a CrisisEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CrisisEvent we want to update
     *   }
     * })
     */
    upsert<T extends CrisisEventUpsertArgs>(args: SelectSubset<T, CrisisEventUpsertArgs<ExtArgs>>): Prisma__CrisisEventClient<$Result.GetResult<Prisma.$CrisisEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CrisisEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventCountArgs} args - Arguments to filter CrisisEvents to count.
     * @example
     * // Count the number of CrisisEvents
     * const count = await prisma.crisisEvent.count({
     *   where: {
     *     // ... the filter for the CrisisEvents we want to count
     *   }
     * })
    **/
    count<T extends CrisisEventCountArgs>(
      args?: Subset<T, CrisisEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CrisisEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CrisisEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CrisisEventAggregateArgs>(args: Subset<T, CrisisEventAggregateArgs>): Prisma.PrismaPromise<GetCrisisEventAggregateType<T>>

    /**
     * Group by CrisisEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CrisisEventGroupByArgs} args - Group by arguments.
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
      T extends CrisisEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CrisisEventGroupByArgs['orderBy'] }
        : { orderBy?: CrisisEventGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CrisisEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrisisEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CrisisEvent model
   */
  readonly fields: CrisisEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CrisisEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CrisisEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the CrisisEvent model
   */ 
  interface CrisisEventFieldRefs {
    readonly id: FieldRef<"CrisisEvent", 'String'>
    readonly sessionId: FieldRef<"CrisisEvent", 'String'>
    readonly requesterId: FieldRef<"CrisisEvent", 'String'>
    readonly requesterRole: FieldRef<"CrisisEvent", 'String'>
    readonly justification: FieldRef<"CrisisEvent", 'String'>
    readonly vaultFieldsRetrieved: FieldRef<"CrisisEvent", 'String[]'>
    readonly localResource: FieldRef<"CrisisEvent", 'String'>
    readonly vaultAccessSucceeded: FieldRef<"CrisisEvent", 'Boolean'>
    readonly alertsDispatched: FieldRef<"CrisisEvent", 'Boolean'>
    readonly alertChannelsFired: FieldRef<"CrisisEvent", 'String[]'>
    readonly createdAt: FieldRef<"CrisisEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CrisisEvent findUnique
   */
  export type CrisisEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter, which CrisisEvent to fetch.
     */
    where: CrisisEventWhereUniqueInput
  }

  /**
   * CrisisEvent findUniqueOrThrow
   */
  export type CrisisEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter, which CrisisEvent to fetch.
     */
    where: CrisisEventWhereUniqueInput
  }

  /**
   * CrisisEvent findFirst
   */
  export type CrisisEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter, which CrisisEvent to fetch.
     */
    where?: CrisisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisEvents to fetch.
     */
    orderBy?: CrisisEventOrderByWithRelationInput | CrisisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrisisEvents.
     */
    cursor?: CrisisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrisisEvents.
     */
    distinct?: CrisisEventScalarFieldEnum | CrisisEventScalarFieldEnum[]
  }

  /**
   * CrisisEvent findFirstOrThrow
   */
  export type CrisisEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter, which CrisisEvent to fetch.
     */
    where?: CrisisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisEvents to fetch.
     */
    orderBy?: CrisisEventOrderByWithRelationInput | CrisisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CrisisEvents.
     */
    cursor?: CrisisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CrisisEvents.
     */
    distinct?: CrisisEventScalarFieldEnum | CrisisEventScalarFieldEnum[]
  }

  /**
   * CrisisEvent findMany
   */
  export type CrisisEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter, which CrisisEvents to fetch.
     */
    where?: CrisisEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CrisisEvents to fetch.
     */
    orderBy?: CrisisEventOrderByWithRelationInput | CrisisEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CrisisEvents.
     */
    cursor?: CrisisEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CrisisEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CrisisEvents.
     */
    skip?: number
    distinct?: CrisisEventScalarFieldEnum | CrisisEventScalarFieldEnum[]
  }

  /**
   * CrisisEvent create
   */
  export type CrisisEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * The data needed to create a CrisisEvent.
     */
    data: XOR<CrisisEventCreateInput, CrisisEventUncheckedCreateInput>
  }

  /**
   * CrisisEvent createMany
   */
  export type CrisisEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CrisisEvents.
     */
    data: CrisisEventCreateManyInput | CrisisEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrisisEvent createManyAndReturn
   */
  export type CrisisEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CrisisEvents.
     */
    data: CrisisEventCreateManyInput | CrisisEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CrisisEvent update
   */
  export type CrisisEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * The data needed to update a CrisisEvent.
     */
    data: XOR<CrisisEventUpdateInput, CrisisEventUncheckedUpdateInput>
    /**
     * Choose, which CrisisEvent to update.
     */
    where: CrisisEventWhereUniqueInput
  }

  /**
   * CrisisEvent updateMany
   */
  export type CrisisEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CrisisEvents.
     */
    data: XOR<CrisisEventUpdateManyMutationInput, CrisisEventUncheckedUpdateManyInput>
    /**
     * Filter which CrisisEvents to update
     */
    where?: CrisisEventWhereInput
  }

  /**
   * CrisisEvent upsert
   */
  export type CrisisEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * The filter to search for the CrisisEvent to update in case it exists.
     */
    where: CrisisEventWhereUniqueInput
    /**
     * In case the CrisisEvent found by the `where` argument doesn't exist, create a new CrisisEvent with this data.
     */
    create: XOR<CrisisEventCreateInput, CrisisEventUncheckedCreateInput>
    /**
     * In case the CrisisEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CrisisEventUpdateInput, CrisisEventUncheckedUpdateInput>
  }

  /**
   * CrisisEvent delete
   */
  export type CrisisEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
    /**
     * Filter which CrisisEvent to delete.
     */
    where: CrisisEventWhereUniqueInput
  }

  /**
   * CrisisEvent deleteMany
   */
  export type CrisisEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CrisisEvents to delete
     */
    where?: CrisisEventWhereInput
  }

  /**
   * CrisisEvent without action
   */
  export type CrisisEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CrisisEvent
     */
    select?: CrisisEventSelect<ExtArgs> | null
  }


  /**
   * Model AlertLog
   */

  export type AggregateAlertLog = {
    _count: AlertLogCountAggregateOutputType | null
    _min: AlertLogMinAggregateOutputType | null
    _max: AlertLogMaxAggregateOutputType | null
  }

  export type AlertLogMinAggregateOutputType = {
    id: string | null
    escalationId: string | null
    crisisEventId: string | null
    channel: $Enums.AlertChannel | null
    recipient: string | null
    status: string | null
    sentAt: Date | null
  }

  export type AlertLogMaxAggregateOutputType = {
    id: string | null
    escalationId: string | null
    crisisEventId: string | null
    channel: $Enums.AlertChannel | null
    recipient: string | null
    status: string | null
    sentAt: Date | null
  }

  export type AlertLogCountAggregateOutputType = {
    id: number
    escalationId: number
    crisisEventId: number
    channel: number
    recipient: number
    payload: number
    status: number
    sentAt: number
    _all: number
  }


  export type AlertLogMinAggregateInputType = {
    id?: true
    escalationId?: true
    crisisEventId?: true
    channel?: true
    recipient?: true
    status?: true
    sentAt?: true
  }

  export type AlertLogMaxAggregateInputType = {
    id?: true
    escalationId?: true
    crisisEventId?: true
    channel?: true
    recipient?: true
    status?: true
    sentAt?: true
  }

  export type AlertLogCountAggregateInputType = {
    id?: true
    escalationId?: true
    crisisEventId?: true
    channel?: true
    recipient?: true
    payload?: true
    status?: true
    sentAt?: true
    _all?: true
  }

  export type AlertLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertLog to aggregate.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlertLogs
    **/
    _count?: true | AlertLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlertLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlertLogMaxAggregateInputType
  }

  export type GetAlertLogAggregateType<T extends AlertLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAlertLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlertLog[P]>
      : GetScalarType<T[P], AggregateAlertLog[P]>
  }




  export type AlertLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlertLogWhereInput
    orderBy?: AlertLogOrderByWithAggregationInput | AlertLogOrderByWithAggregationInput[]
    by: AlertLogScalarFieldEnum[] | AlertLogScalarFieldEnum
    having?: AlertLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlertLogCountAggregateInputType | true
    _min?: AlertLogMinAggregateInputType
    _max?: AlertLogMaxAggregateInputType
  }

  export type AlertLogGroupByOutputType = {
    id: string
    escalationId: string | null
    crisisEventId: string | null
    channel: $Enums.AlertChannel
    recipient: string
    payload: JsonValue
    status: string
    sentAt: Date
    _count: AlertLogCountAggregateOutputType | null
    _min: AlertLogMinAggregateOutputType | null
    _max: AlertLogMaxAggregateOutputType | null
  }

  type GetAlertLogGroupByPayload<T extends AlertLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlertLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlertLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlertLogGroupByOutputType[P]>
            : GetScalarType<T[P], AlertLogGroupByOutputType[P]>
        }
      >
    >


  export type AlertLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    escalationId?: boolean
    crisisEventId?: boolean
    channel?: boolean
    recipient?: boolean
    payload?: boolean
    status?: boolean
    sentAt?: boolean
  }, ExtArgs["result"]["alertLog"]>

  export type AlertLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    escalationId?: boolean
    crisisEventId?: boolean
    channel?: boolean
    recipient?: boolean
    payload?: boolean
    status?: boolean
    sentAt?: boolean
  }, ExtArgs["result"]["alertLog"]>

  export type AlertLogSelectScalar = {
    id?: boolean
    escalationId?: boolean
    crisisEventId?: boolean
    channel?: boolean
    recipient?: boolean
    payload?: boolean
    status?: boolean
    sentAt?: boolean
  }


  export type $AlertLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlertLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      escalationId: string | null
      crisisEventId: string | null
      channel: $Enums.AlertChannel
      recipient: string
      payload: Prisma.JsonValue
      status: string
      sentAt: Date
    }, ExtArgs["result"]["alertLog"]>
    composites: {}
  }

  type AlertLogGetPayload<S extends boolean | null | undefined | AlertLogDefaultArgs> = $Result.GetResult<Prisma.$AlertLogPayload, S>

  type AlertLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AlertLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AlertLogCountAggregateInputType | true
    }

  export interface AlertLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlertLog'], meta: { name: 'AlertLog' } }
    /**
     * Find zero or one AlertLog that matches the filter.
     * @param {AlertLogFindUniqueArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlertLogFindUniqueArgs>(args: SelectSubset<T, AlertLogFindUniqueArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AlertLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AlertLogFindUniqueOrThrowArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlertLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AlertLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AlertLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindFirstArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlertLogFindFirstArgs>(args?: SelectSubset<T, AlertLogFindFirstArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AlertLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindFirstOrThrowArgs} args - Arguments to find a AlertLog
     * @example
     * // Get one AlertLog
     * const alertLog = await prisma.alertLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlertLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AlertLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AlertLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlertLogs
     * const alertLogs = await prisma.alertLog.findMany()
     * 
     * // Get first 10 AlertLogs
     * const alertLogs = await prisma.alertLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const alertLogWithIdOnly = await prisma.alertLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlertLogFindManyArgs>(args?: SelectSubset<T, AlertLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AlertLog.
     * @param {AlertLogCreateArgs} args - Arguments to create a AlertLog.
     * @example
     * // Create one AlertLog
     * const AlertLog = await prisma.alertLog.create({
     *   data: {
     *     // ... data to create a AlertLog
     *   }
     * })
     * 
     */
    create<T extends AlertLogCreateArgs>(args: SelectSubset<T, AlertLogCreateArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AlertLogs.
     * @param {AlertLogCreateManyArgs} args - Arguments to create many AlertLogs.
     * @example
     * // Create many AlertLogs
     * const alertLog = await prisma.alertLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlertLogCreateManyArgs>(args?: SelectSubset<T, AlertLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AlertLogs and returns the data saved in the database.
     * @param {AlertLogCreateManyAndReturnArgs} args - Arguments to create many AlertLogs.
     * @example
     * // Create many AlertLogs
     * const alertLog = await prisma.alertLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AlertLogs and only return the `id`
     * const alertLogWithIdOnly = await prisma.alertLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlertLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AlertLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AlertLog.
     * @param {AlertLogDeleteArgs} args - Arguments to delete one AlertLog.
     * @example
     * // Delete one AlertLog
     * const AlertLog = await prisma.alertLog.delete({
     *   where: {
     *     // ... filter to delete one AlertLog
     *   }
     * })
     * 
     */
    delete<T extends AlertLogDeleteArgs>(args: SelectSubset<T, AlertLogDeleteArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AlertLog.
     * @param {AlertLogUpdateArgs} args - Arguments to update one AlertLog.
     * @example
     * // Update one AlertLog
     * const alertLog = await prisma.alertLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlertLogUpdateArgs>(args: SelectSubset<T, AlertLogUpdateArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AlertLogs.
     * @param {AlertLogDeleteManyArgs} args - Arguments to filter AlertLogs to delete.
     * @example
     * // Delete a few AlertLogs
     * const { count } = await prisma.alertLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlertLogDeleteManyArgs>(args?: SelectSubset<T, AlertLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlertLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlertLogs
     * const alertLog = await prisma.alertLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlertLogUpdateManyArgs>(args: SelectSubset<T, AlertLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AlertLog.
     * @param {AlertLogUpsertArgs} args - Arguments to update or create a AlertLog.
     * @example
     * // Update or create a AlertLog
     * const alertLog = await prisma.alertLog.upsert({
     *   create: {
     *     // ... data to create a AlertLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlertLog we want to update
     *   }
     * })
     */
    upsert<T extends AlertLogUpsertArgs>(args: SelectSubset<T, AlertLogUpsertArgs<ExtArgs>>): Prisma__AlertLogClient<$Result.GetResult<Prisma.$AlertLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AlertLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogCountArgs} args - Arguments to filter AlertLogs to count.
     * @example
     * // Count the number of AlertLogs
     * const count = await prisma.alertLog.count({
     *   where: {
     *     // ... the filter for the AlertLogs we want to count
     *   }
     * })
    **/
    count<T extends AlertLogCountArgs>(
      args?: Subset<T, AlertLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlertLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlertLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AlertLogAggregateArgs>(args: Subset<T, AlertLogAggregateArgs>): Prisma.PrismaPromise<GetAlertLogAggregateType<T>>

    /**
     * Group by AlertLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlertLogGroupByArgs} args - Group by arguments.
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
      T extends AlertLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlertLogGroupByArgs['orderBy'] }
        : { orderBy?: AlertLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AlertLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlertLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlertLog model
   */
  readonly fields: AlertLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlertLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlertLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the AlertLog model
   */ 
  interface AlertLogFieldRefs {
    readonly id: FieldRef<"AlertLog", 'String'>
    readonly escalationId: FieldRef<"AlertLog", 'String'>
    readonly crisisEventId: FieldRef<"AlertLog", 'String'>
    readonly channel: FieldRef<"AlertLog", 'AlertChannel'>
    readonly recipient: FieldRef<"AlertLog", 'String'>
    readonly payload: FieldRef<"AlertLog", 'Json'>
    readonly status: FieldRef<"AlertLog", 'String'>
    readonly sentAt: FieldRef<"AlertLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlertLog findUnique
   */
  export type AlertLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog findUniqueOrThrow
   */
  export type AlertLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog findFirst
   */
  export type AlertLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertLogs.
     */
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog findFirstOrThrow
   */
  export type AlertLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter, which AlertLog to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlertLogs.
     */
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog findMany
   */
  export type AlertLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter, which AlertLogs to fetch.
     */
    where?: AlertLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlertLogs to fetch.
     */
    orderBy?: AlertLogOrderByWithRelationInput | AlertLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlertLogs.
     */
    cursor?: AlertLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlertLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlertLogs.
     */
    skip?: number
    distinct?: AlertLogScalarFieldEnum | AlertLogScalarFieldEnum[]
  }

  /**
   * AlertLog create
   */
  export type AlertLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * The data needed to create a AlertLog.
     */
    data: XOR<AlertLogCreateInput, AlertLogUncheckedCreateInput>
  }

  /**
   * AlertLog createMany
   */
  export type AlertLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlertLogs.
     */
    data: AlertLogCreateManyInput | AlertLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlertLog createManyAndReturn
   */
  export type AlertLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AlertLogs.
     */
    data: AlertLogCreateManyInput | AlertLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlertLog update
   */
  export type AlertLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * The data needed to update a AlertLog.
     */
    data: XOR<AlertLogUpdateInput, AlertLogUncheckedUpdateInput>
    /**
     * Choose, which AlertLog to update.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog updateMany
   */
  export type AlertLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlertLogs.
     */
    data: XOR<AlertLogUpdateManyMutationInput, AlertLogUncheckedUpdateManyInput>
    /**
     * Filter which AlertLogs to update
     */
    where?: AlertLogWhereInput
  }

  /**
   * AlertLog upsert
   */
  export type AlertLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * The filter to search for the AlertLog to update in case it exists.
     */
    where: AlertLogWhereUniqueInput
    /**
     * In case the AlertLog found by the `where` argument doesn't exist, create a new AlertLog with this data.
     */
    create: XOR<AlertLogCreateInput, AlertLogUncheckedCreateInput>
    /**
     * In case the AlertLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlertLogUpdateInput, AlertLogUncheckedUpdateInput>
  }

  /**
   * AlertLog delete
   */
  export type AlertLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
    /**
     * Filter which AlertLog to delete.
     */
    where: AlertLogWhereUniqueInput
  }

  /**
   * AlertLog deleteMany
   */
  export type AlertLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlertLogs to delete
     */
    where?: AlertLogWhereInput
  }

  /**
   * AlertLog without action
   */
  export type AlertLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlertLog
     */
    select?: AlertLogSelect<ExtArgs> | null
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


  export const EscalationScalarFieldEnum: {
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

  export type EscalationScalarFieldEnum = (typeof EscalationScalarFieldEnum)[keyof typeof EscalationScalarFieldEnum]


  export const CrisisEventScalarFieldEnum: {
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

  export type CrisisEventScalarFieldEnum = (typeof CrisisEventScalarFieldEnum)[keyof typeof CrisisEventScalarFieldEnum]


  export const AlertLogScalarFieldEnum: {
    id: 'id',
    escalationId: 'escalationId',
    crisisEventId: 'crisisEventId',
    channel: 'channel',
    recipient: 'recipient',
    payload: 'payload',
    status: 'status',
    sentAt: 'sentAt'
  };

  export type AlertLogScalarFieldEnum = (typeof AlertLogScalarFieldEnum)[keyof typeof AlertLogScalarFieldEnum]


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
   * Reference to a field of type 'FlagType'
   */
  export type EnumFlagTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlagType'>
    


  /**
   * Reference to a field of type 'FlagType[]'
   */
  export type ListEnumFlagTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlagType[]'>
    


  /**
   * Reference to a field of type 'EscalationStatus'
   */
  export type EnumEscalationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationStatus'>
    


  /**
   * Reference to a field of type 'EscalationStatus[]'
   */
  export type ListEnumEscalationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EscalationStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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
   * Reference to a field of type 'AlertChannel'
   */
  export type EnumAlertChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertChannel'>
    


  /**
   * Reference to a field of type 'AlertChannel[]'
   */
  export type ListEnumAlertChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AlertChannel[]'>
    


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


  export type EscalationWhereInput = {
    AND?: EscalationWhereInput | EscalationWhereInput[]
    OR?: EscalationWhereInput[]
    NOT?: EscalationWhereInput | EscalationWhereInput[]
    id?: StringFilter<"Escalation"> | string
    sessionId?: StringFilter<"Escalation"> | string
    flagType?: EnumFlagTypeFilter<"Escalation"> | $Enums.FlagType
    status?: EnumEscalationStatusFilter<"Escalation"> | $Enums.EscalationStatus
    severity?: IntFilter<"Escalation"> | number
    notes?: StringNullableFilter<"Escalation"> | string | null
    createdAt?: DateTimeFilter<"Escalation"> | Date | string
    updatedAt?: DateTimeFilter<"Escalation"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Escalation"> | Date | string | null
    resolvedBy?: StringNullableFilter<"Escalation"> | string | null
    resolutionNote?: StringNullableFilter<"Escalation"> | string | null
  }

  export type EscalationOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    flagType?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    resolutionNote?: SortOrderInput | SortOrder
  }

  export type EscalationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EscalationWhereInput | EscalationWhereInput[]
    OR?: EscalationWhereInput[]
    NOT?: EscalationWhereInput | EscalationWhereInput[]
    sessionId?: StringFilter<"Escalation"> | string
    flagType?: EnumFlagTypeFilter<"Escalation"> | $Enums.FlagType
    status?: EnumEscalationStatusFilter<"Escalation"> | $Enums.EscalationStatus
    severity?: IntFilter<"Escalation"> | number
    notes?: StringNullableFilter<"Escalation"> | string | null
    createdAt?: DateTimeFilter<"Escalation"> | Date | string
    updatedAt?: DateTimeFilter<"Escalation"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"Escalation"> | Date | string | null
    resolvedBy?: StringNullableFilter<"Escalation"> | string | null
    resolutionNote?: StringNullableFilter<"Escalation"> | string | null
  }, "id">

  export type EscalationOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    flagType?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    resolutionNote?: SortOrderInput | SortOrder
    _count?: EscalationCountOrderByAggregateInput
    _avg?: EscalationAvgOrderByAggregateInput
    _max?: EscalationMaxOrderByAggregateInput
    _min?: EscalationMinOrderByAggregateInput
    _sum?: EscalationSumOrderByAggregateInput
  }

  export type EscalationScalarWhereWithAggregatesInput = {
    AND?: EscalationScalarWhereWithAggregatesInput | EscalationScalarWhereWithAggregatesInput[]
    OR?: EscalationScalarWhereWithAggregatesInput[]
    NOT?: EscalationScalarWhereWithAggregatesInput | EscalationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Escalation"> | string
    sessionId?: StringWithAggregatesFilter<"Escalation"> | string
    flagType?: EnumFlagTypeWithAggregatesFilter<"Escalation"> | $Enums.FlagType
    status?: EnumEscalationStatusWithAggregatesFilter<"Escalation"> | $Enums.EscalationStatus
    severity?: IntWithAggregatesFilter<"Escalation"> | number
    notes?: StringNullableWithAggregatesFilter<"Escalation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Escalation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Escalation"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"Escalation"> | Date | string | null
    resolvedBy?: StringNullableWithAggregatesFilter<"Escalation"> | string | null
    resolutionNote?: StringNullableWithAggregatesFilter<"Escalation"> | string | null
  }

  export type CrisisEventWhereInput = {
    AND?: CrisisEventWhereInput | CrisisEventWhereInput[]
    OR?: CrisisEventWhereInput[]
    NOT?: CrisisEventWhereInput | CrisisEventWhereInput[]
    id?: StringFilter<"CrisisEvent"> | string
    sessionId?: StringFilter<"CrisisEvent"> | string
    requesterId?: StringFilter<"CrisisEvent"> | string
    requesterRole?: StringFilter<"CrisisEvent"> | string
    justification?: StringFilter<"CrisisEvent"> | string
    vaultFieldsRetrieved?: StringNullableListFilter<"CrisisEvent">
    localResource?: StringNullableFilter<"CrisisEvent"> | string | null
    vaultAccessSucceeded?: BoolFilter<"CrisisEvent"> | boolean
    alertsDispatched?: BoolFilter<"CrisisEvent"> | boolean
    alertChannelsFired?: StringNullableListFilter<"CrisisEvent">
    createdAt?: DateTimeFilter<"CrisisEvent"> | Date | string
  }

  export type CrisisEventOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    requesterId?: SortOrder
    requesterRole?: SortOrder
    justification?: SortOrder
    vaultFieldsRetrieved?: SortOrder
    localResource?: SortOrderInput | SortOrder
    vaultAccessSucceeded?: SortOrder
    alertsDispatched?: SortOrder
    alertChannelsFired?: SortOrder
    createdAt?: SortOrder
  }

  export type CrisisEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CrisisEventWhereInput | CrisisEventWhereInput[]
    OR?: CrisisEventWhereInput[]
    NOT?: CrisisEventWhereInput | CrisisEventWhereInput[]
    sessionId?: StringFilter<"CrisisEvent"> | string
    requesterId?: StringFilter<"CrisisEvent"> | string
    requesterRole?: StringFilter<"CrisisEvent"> | string
    justification?: StringFilter<"CrisisEvent"> | string
    vaultFieldsRetrieved?: StringNullableListFilter<"CrisisEvent">
    localResource?: StringNullableFilter<"CrisisEvent"> | string | null
    vaultAccessSucceeded?: BoolFilter<"CrisisEvent"> | boolean
    alertsDispatched?: BoolFilter<"CrisisEvent"> | boolean
    alertChannelsFired?: StringNullableListFilter<"CrisisEvent">
    createdAt?: DateTimeFilter<"CrisisEvent"> | Date | string
  }, "id">

  export type CrisisEventOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    requesterId?: SortOrder
    requesterRole?: SortOrder
    justification?: SortOrder
    vaultFieldsRetrieved?: SortOrder
    localResource?: SortOrderInput | SortOrder
    vaultAccessSucceeded?: SortOrder
    alertsDispatched?: SortOrder
    alertChannelsFired?: SortOrder
    createdAt?: SortOrder
    _count?: CrisisEventCountOrderByAggregateInput
    _max?: CrisisEventMaxOrderByAggregateInput
    _min?: CrisisEventMinOrderByAggregateInput
  }

  export type CrisisEventScalarWhereWithAggregatesInput = {
    AND?: CrisisEventScalarWhereWithAggregatesInput | CrisisEventScalarWhereWithAggregatesInput[]
    OR?: CrisisEventScalarWhereWithAggregatesInput[]
    NOT?: CrisisEventScalarWhereWithAggregatesInput | CrisisEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CrisisEvent"> | string
    sessionId?: StringWithAggregatesFilter<"CrisisEvent"> | string
    requesterId?: StringWithAggregatesFilter<"CrisisEvent"> | string
    requesterRole?: StringWithAggregatesFilter<"CrisisEvent"> | string
    justification?: StringWithAggregatesFilter<"CrisisEvent"> | string
    vaultFieldsRetrieved?: StringNullableListFilter<"CrisisEvent">
    localResource?: StringNullableWithAggregatesFilter<"CrisisEvent"> | string | null
    vaultAccessSucceeded?: BoolWithAggregatesFilter<"CrisisEvent"> | boolean
    alertsDispatched?: BoolWithAggregatesFilter<"CrisisEvent"> | boolean
    alertChannelsFired?: StringNullableListFilter<"CrisisEvent">
    createdAt?: DateTimeWithAggregatesFilter<"CrisisEvent"> | Date | string
  }

  export type AlertLogWhereInput = {
    AND?: AlertLogWhereInput | AlertLogWhereInput[]
    OR?: AlertLogWhereInput[]
    NOT?: AlertLogWhereInput | AlertLogWhereInput[]
    id?: StringFilter<"AlertLog"> | string
    escalationId?: StringNullableFilter<"AlertLog"> | string | null
    crisisEventId?: StringNullableFilter<"AlertLog"> | string | null
    channel?: EnumAlertChannelFilter<"AlertLog"> | $Enums.AlertChannel
    recipient?: StringFilter<"AlertLog"> | string
    payload?: JsonFilter<"AlertLog">
    status?: StringFilter<"AlertLog"> | string
    sentAt?: DateTimeFilter<"AlertLog"> | Date | string
  }

  export type AlertLogOrderByWithRelationInput = {
    id?: SortOrder
    escalationId?: SortOrderInput | SortOrder
    crisisEventId?: SortOrderInput | SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlertLogWhereInput | AlertLogWhereInput[]
    OR?: AlertLogWhereInput[]
    NOT?: AlertLogWhereInput | AlertLogWhereInput[]
    escalationId?: StringNullableFilter<"AlertLog"> | string | null
    crisisEventId?: StringNullableFilter<"AlertLog"> | string | null
    channel?: EnumAlertChannelFilter<"AlertLog"> | $Enums.AlertChannel
    recipient?: StringFilter<"AlertLog"> | string
    payload?: JsonFilter<"AlertLog">
    status?: StringFilter<"AlertLog"> | string
    sentAt?: DateTimeFilter<"AlertLog"> | Date | string
  }, "id">

  export type AlertLogOrderByWithAggregationInput = {
    id?: SortOrder
    escalationId?: SortOrderInput | SortOrder
    crisisEventId?: SortOrderInput | SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
    _count?: AlertLogCountOrderByAggregateInput
    _max?: AlertLogMaxOrderByAggregateInput
    _min?: AlertLogMinOrderByAggregateInput
  }

  export type AlertLogScalarWhereWithAggregatesInput = {
    AND?: AlertLogScalarWhereWithAggregatesInput | AlertLogScalarWhereWithAggregatesInput[]
    OR?: AlertLogScalarWhereWithAggregatesInput[]
    NOT?: AlertLogScalarWhereWithAggregatesInput | AlertLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AlertLog"> | string
    escalationId?: StringNullableWithAggregatesFilter<"AlertLog"> | string | null
    crisisEventId?: StringNullableWithAggregatesFilter<"AlertLog"> | string | null
    channel?: EnumAlertChannelWithAggregatesFilter<"AlertLog"> | $Enums.AlertChannel
    recipient?: StringWithAggregatesFilter<"AlertLog"> | string
    payload?: JsonWithAggregatesFilter<"AlertLog">
    status?: StringWithAggregatesFilter<"AlertLog"> | string
    sentAt?: DateTimeWithAggregatesFilter<"AlertLog"> | Date | string
  }

  export type EscalationCreateInput = {
    id?: string
    sessionId: string
    flagType: $Enums.FlagType
    status?: $Enums.EscalationStatus
    severity?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    resolutionNote?: string | null
  }

  export type EscalationUncheckedCreateInput = {
    id?: string
    sessionId: string
    flagType: $Enums.FlagType
    status?: $Enums.EscalationStatus
    severity?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    resolutionNote?: string | null
  }

  export type EscalationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    flagType?: EnumFlagTypeFieldUpdateOperationsInput | $Enums.FlagType
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    severity?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscalationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    flagType?: EnumFlagTypeFieldUpdateOperationsInput | $Enums.FlagType
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    severity?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscalationCreateManyInput = {
    id?: string
    sessionId: string
    flagType: $Enums.FlagType
    status?: $Enums.EscalationStatus
    severity?: number
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    resolutionNote?: string | null
  }

  export type EscalationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    flagType?: EnumFlagTypeFieldUpdateOperationsInput | $Enums.FlagType
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    severity?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EscalationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    flagType?: EnumFlagTypeFieldUpdateOperationsInput | $Enums.FlagType
    status?: EnumEscalationStatusFieldUpdateOperationsInput | $Enums.EscalationStatus
    severity?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    resolutionNote?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CrisisEventCreateInput = {
    id?: string
    sessionId: string
    requesterId: string
    requesterRole: string
    justification: string
    vaultFieldsRetrieved?: CrisisEventCreatevaultFieldsRetrievedInput | string[]
    localResource?: string | null
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: CrisisEventCreatealertChannelsFiredInput | string[]
    createdAt?: Date | string
  }

  export type CrisisEventUncheckedCreateInput = {
    id?: string
    sessionId: string
    requesterId: string
    requesterRole: string
    justification: string
    vaultFieldsRetrieved?: CrisisEventCreatevaultFieldsRetrievedInput | string[]
    localResource?: string | null
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: CrisisEventCreatealertChannelsFiredInput | string[]
    createdAt?: Date | string
  }

  export type CrisisEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterRole?: StringFieldUpdateOperationsInput | string
    justification?: StringFieldUpdateOperationsInput | string
    vaultFieldsRetrieved?: CrisisEventUpdatevaultFieldsRetrievedInput | string[]
    localResource?: NullableStringFieldUpdateOperationsInput | string | null
    vaultAccessSucceeded?: BoolFieldUpdateOperationsInput | boolean
    alertsDispatched?: BoolFieldUpdateOperationsInput | boolean
    alertChannelsFired?: CrisisEventUpdatealertChannelsFiredInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterRole?: StringFieldUpdateOperationsInput | string
    justification?: StringFieldUpdateOperationsInput | string
    vaultFieldsRetrieved?: CrisisEventUpdatevaultFieldsRetrievedInput | string[]
    localResource?: NullableStringFieldUpdateOperationsInput | string | null
    vaultAccessSucceeded?: BoolFieldUpdateOperationsInput | boolean
    alertsDispatched?: BoolFieldUpdateOperationsInput | boolean
    alertChannelsFired?: CrisisEventUpdatealertChannelsFiredInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisEventCreateManyInput = {
    id?: string
    sessionId: string
    requesterId: string
    requesterRole: string
    justification: string
    vaultFieldsRetrieved?: CrisisEventCreatevaultFieldsRetrievedInput | string[]
    localResource?: string | null
    vaultAccessSucceeded?: boolean
    alertsDispatched?: boolean
    alertChannelsFired?: CrisisEventCreatealertChannelsFiredInput | string[]
    createdAt?: Date | string
  }

  export type CrisisEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterRole?: StringFieldUpdateOperationsInput | string
    justification?: StringFieldUpdateOperationsInput | string
    vaultFieldsRetrieved?: CrisisEventUpdatevaultFieldsRetrievedInput | string[]
    localResource?: NullableStringFieldUpdateOperationsInput | string | null
    vaultAccessSucceeded?: BoolFieldUpdateOperationsInput | boolean
    alertsDispatched?: BoolFieldUpdateOperationsInput | boolean
    alertChannelsFired?: CrisisEventUpdatealertChannelsFiredInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CrisisEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    requesterRole?: StringFieldUpdateOperationsInput | string
    justification?: StringFieldUpdateOperationsInput | string
    vaultFieldsRetrieved?: CrisisEventUpdatevaultFieldsRetrievedInput | string[]
    localResource?: NullableStringFieldUpdateOperationsInput | string | null
    vaultAccessSucceeded?: BoolFieldUpdateOperationsInput | boolean
    alertsDispatched?: BoolFieldUpdateOperationsInput | boolean
    alertChannelsFired?: CrisisEventUpdatealertChannelsFiredInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogCreateInput = {
    id?: string
    escalationId?: string | null
    crisisEventId?: string | null
    channel: $Enums.AlertChannel
    recipient: string
    payload: JsonNullValueInput | InputJsonValue
    status: string
    sentAt?: Date | string
  }

  export type AlertLogUncheckedCreateInput = {
    id?: string
    escalationId?: string | null
    crisisEventId?: string | null
    channel: $Enums.AlertChannel
    recipient: string
    payload: JsonNullValueInput | InputJsonValue
    status: string
    sentAt?: Date | string
  }

  export type AlertLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    escalationId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisEventId?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumAlertChannelFieldUpdateOperationsInput | $Enums.AlertChannel
    recipient?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    escalationId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisEventId?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumAlertChannelFieldUpdateOperationsInput | $Enums.AlertChannel
    recipient?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogCreateManyInput = {
    id?: string
    escalationId?: string | null
    crisisEventId?: string | null
    channel: $Enums.AlertChannel
    recipient: string
    payload: JsonNullValueInput | InputJsonValue
    status: string
    sentAt?: Date | string
  }

  export type AlertLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    escalationId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisEventId?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumAlertChannelFieldUpdateOperationsInput | $Enums.AlertChannel
    recipient?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlertLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    escalationId?: NullableStringFieldUpdateOperationsInput | string | null
    crisisEventId?: NullableStringFieldUpdateOperationsInput | string | null
    channel?: EnumAlertChannelFieldUpdateOperationsInput | $Enums.AlertChannel
    recipient?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumFlagTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FlagType | EnumFlagTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFlagTypeFilter<$PrismaModel> | $Enums.FlagType
  }

  export type EnumEscalationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusFilter<$PrismaModel> | $Enums.EscalationStatus
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EscalationCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    flagType?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    resolutionNote?: SortOrder
  }

  export type EscalationAvgOrderByAggregateInput = {
    severity?: SortOrder
  }

  export type EscalationMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    flagType?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    resolutionNote?: SortOrder
  }

  export type EscalationMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    flagType?: SortOrder
    status?: SortOrder
    severity?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    resolutionNote?: SortOrder
  }

  export type EscalationSumOrderByAggregateInput = {
    severity?: SortOrder
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

  export type EnumFlagTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlagType | EnumFlagTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFlagTypeWithAggregatesFilter<$PrismaModel> | $Enums.FlagType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlagTypeFilter<$PrismaModel>
    _max?: NestedEnumFlagTypeFilter<$PrismaModel>
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CrisisEventCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    requesterId?: SortOrder
    requesterRole?: SortOrder
    justification?: SortOrder
    vaultFieldsRetrieved?: SortOrder
    localResource?: SortOrder
    vaultAccessSucceeded?: SortOrder
    alertsDispatched?: SortOrder
    alertChannelsFired?: SortOrder
    createdAt?: SortOrder
  }

  export type CrisisEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    requesterId?: SortOrder
    requesterRole?: SortOrder
    justification?: SortOrder
    localResource?: SortOrder
    vaultAccessSucceeded?: SortOrder
    alertsDispatched?: SortOrder
    createdAt?: SortOrder
  }

  export type CrisisEventMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    requesterId?: SortOrder
    requesterRole?: SortOrder
    justification?: SortOrder
    localResource?: SortOrder
    vaultAccessSucceeded?: SortOrder
    alertsDispatched?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAlertChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertChannel | EnumAlertChannelFieldRefInput<$PrismaModel>
    in?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertChannelFilter<$PrismaModel> | $Enums.AlertChannel
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

  export type AlertLogCountOrderByAggregateInput = {
    id?: SortOrder
    escalationId?: SortOrder
    crisisEventId?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    payload?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogMaxOrderByAggregateInput = {
    id?: SortOrder
    escalationId?: SortOrder
    crisisEventId?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
  }

  export type AlertLogMinOrderByAggregateInput = {
    id?: SortOrder
    escalationId?: SortOrder
    crisisEventId?: SortOrder
    channel?: SortOrder
    recipient?: SortOrder
    status?: SortOrder
    sentAt?: SortOrder
  }

  export type EnumAlertChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertChannel | EnumAlertChannelFieldRefInput<$PrismaModel>
    in?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertChannelWithAggregatesFilter<$PrismaModel> | $Enums.AlertChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertChannelFilter<$PrismaModel>
    _max?: NestedEnumAlertChannelFilter<$PrismaModel>
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumFlagTypeFieldUpdateOperationsInput = {
    set?: $Enums.FlagType
  }

  export type EnumEscalationStatusFieldUpdateOperationsInput = {
    set?: $Enums.EscalationStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CrisisEventCreatevaultFieldsRetrievedInput = {
    set: string[]
  }

  export type CrisisEventCreatealertChannelsFiredInput = {
    set: string[]
  }

  export type CrisisEventUpdatevaultFieldsRetrievedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CrisisEventUpdatealertChannelsFiredInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumAlertChannelFieldUpdateOperationsInput = {
    set?: $Enums.AlertChannel
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

  export type NestedEnumFlagTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FlagType | EnumFlagTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFlagTypeFilter<$PrismaModel> | $Enums.FlagType
  }

  export type NestedEnumEscalationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EscalationStatus | EnumEscalationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EscalationStatus[] | ListEnumEscalationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEscalationStatusFilter<$PrismaModel> | $Enums.EscalationStatus
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

  export type NestedEnumFlagTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlagType | EnumFlagTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlagType[] | ListEnumFlagTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFlagTypeWithAggregatesFilter<$PrismaModel> | $Enums.FlagType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlagTypeFilter<$PrismaModel>
    _max?: NestedEnumFlagTypeFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAlertChannelFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertChannel | EnumAlertChannelFieldRefInput<$PrismaModel>
    in?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertChannelFilter<$PrismaModel> | $Enums.AlertChannel
  }

  export type NestedEnumAlertChannelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AlertChannel | EnumAlertChannelFieldRefInput<$PrismaModel>
    in?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    notIn?: $Enums.AlertChannel[] | ListEnumAlertChannelFieldRefInput<$PrismaModel>
    not?: NestedEnumAlertChannelWithAggregatesFilter<$PrismaModel> | $Enums.AlertChannel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAlertChannelFilter<$PrismaModel>
    _max?: NestedEnumAlertChannelFilter<$PrismaModel>
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



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use EscalationDefaultArgs instead
     */
    export type EscalationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EscalationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CrisisEventDefaultArgs instead
     */
    export type CrisisEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CrisisEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AlertLogDefaultArgs instead
     */
    export type AlertLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AlertLogDefaultArgs<ExtArgs>

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