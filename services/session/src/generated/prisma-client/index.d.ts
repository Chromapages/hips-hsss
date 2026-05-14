
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
 * Model SessionRecord
 * 
 */
export type SessionRecord = $Result.DefaultSelection<Prisma.$SessionRecordPayload>
/**
 * Model GroupSessionRecord
 * 
 */
export type GroupSessionRecord = $Result.DefaultSelection<Prisma.$GroupSessionRecordPayload>
/**
 * Model AuditEvent
 * 
 */
export type AuditEvent = $Result.DefaultSelection<Prisma.$AuditEventPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LiveSessionStatus: {
  LOBBY: 'LOBBY',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
  ABANDONED: 'ABANDONED'
};

export type LiveSessionStatus = (typeof LiveSessionStatus)[keyof typeof LiveSessionStatus]


export const AuditEventType: {
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

export type AuditEventType = (typeof AuditEventType)[keyof typeof AuditEventType]


export const AuditSeverity: {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

export type AuditSeverity = (typeof AuditSeverity)[keyof typeof AuditSeverity]

}

export type LiveSessionStatus = $Enums.LiveSessionStatus

export const LiveSessionStatus: typeof $Enums.LiveSessionStatus

export type AuditEventType = $Enums.AuditEventType

export const AuditEventType: typeof $Enums.AuditEventType

export type AuditSeverity = $Enums.AuditSeverity

export const AuditSeverity: typeof $Enums.AuditSeverity

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SessionRecords
 * const sessionRecords = await prisma.sessionRecord.findMany()
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
   * // Fetch zero or more SessionRecords
   * const sessionRecords = await prisma.sessionRecord.findMany()
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
   * `prisma.sessionRecord`: Exposes CRUD operations for the **SessionRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SessionRecords
    * const sessionRecords = await prisma.sessionRecord.findMany()
    * ```
    */
  get sessionRecord(): Prisma.SessionRecordDelegate<ExtArgs>;

  /**
   * `prisma.groupSessionRecord`: Exposes CRUD operations for the **GroupSessionRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GroupSessionRecords
    * const groupSessionRecords = await prisma.groupSessionRecord.findMany()
    * ```
    */
  get groupSessionRecord(): Prisma.GroupSessionRecordDelegate<ExtArgs>;

  /**
   * `prisma.auditEvent`: Exposes CRUD operations for the **AuditEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditEvents
    * const auditEvents = await prisma.auditEvent.findMany()
    * ```
    */
  get auditEvent(): Prisma.AuditEventDelegate<ExtArgs>;
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
    SessionRecord: 'SessionRecord',
    GroupSessionRecord: 'GroupSessionRecord',
    AuditEvent: 'AuditEvent'
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
      modelProps: "sessionRecord" | "groupSessionRecord" | "auditEvent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SessionRecord: {
        payload: Prisma.$SessionRecordPayload<ExtArgs>
        fields: Prisma.SessionRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          findFirst: {
            args: Prisma.SessionRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          findMany: {
            args: Prisma.SessionRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>[]
          }
          create: {
            args: Prisma.SessionRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          createMany: {
            args: Prisma.SessionRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>[]
          }
          delete: {
            args: Prisma.SessionRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          update: {
            args: Prisma.SessionRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          deleteMany: {
            args: Prisma.SessionRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionRecordPayload>
          }
          aggregate: {
            args: Prisma.SessionRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSessionRecord>
          }
          groupBy: {
            args: Prisma.SessionRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionRecordCountArgs<ExtArgs>
            result: $Utils.Optional<SessionRecordCountAggregateOutputType> | number
          }
        }
      }
      GroupSessionRecord: {
        payload: Prisma.$GroupSessionRecordPayload<ExtArgs>
        fields: Prisma.GroupSessionRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GroupSessionRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GroupSessionRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          findFirst: {
            args: Prisma.GroupSessionRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GroupSessionRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          findMany: {
            args: Prisma.GroupSessionRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>[]
          }
          create: {
            args: Prisma.GroupSessionRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          createMany: {
            args: Prisma.GroupSessionRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GroupSessionRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>[]
          }
          delete: {
            args: Prisma.GroupSessionRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          update: {
            args: Prisma.GroupSessionRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          deleteMany: {
            args: Prisma.GroupSessionRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GroupSessionRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GroupSessionRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GroupSessionRecordPayload>
          }
          aggregate: {
            args: Prisma.GroupSessionRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGroupSessionRecord>
          }
          groupBy: {
            args: Prisma.GroupSessionRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.GroupSessionRecordCountArgs<ExtArgs>
            result: $Utils.Optional<GroupSessionRecordCountAggregateOutputType> | number
          }
        }
      }
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
   * Count Type SessionRecordCountOutputType
   */

  export type SessionRecordCountOutputType = {
    auditEvents: number
  }

  export type SessionRecordCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditEvents?: boolean | SessionRecordCountOutputTypeCountAuditEventsArgs
  }

  // Custom InputTypes
  /**
   * SessionRecordCountOutputType without action
   */
  export type SessionRecordCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecordCountOutputType
     */
    select?: SessionRecordCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SessionRecordCountOutputType without action
   */
  export type SessionRecordCountOutputTypeCountAuditEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SessionRecord
   */

  export type AggregateSessionRecord = {
    _count: SessionRecordCountAggregateOutputType | null
    _min: SessionRecordMinAggregateOutputType | null
    _max: SessionRecordMaxAggregateOutputType | null
  }

  export type SessionRecordMinAggregateOutputType = {
    id: string | null
    anonSessionToken: string | null
    sessionId: string | null
    roomId: string | null
    moderatorAnonId: string | null
    participantAnonHandle: string | null
    avatarStyle: string | null
    avatarColor: string | null
    status: $Enums.LiveSessionStatus | null
    startedAt: Date | null
    endedAt: Date | null
    recordingConsent: boolean | null
    facilitatorNotes: string | null
    facilitatorAnonId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionRecordMaxAggregateOutputType = {
    id: string | null
    anonSessionToken: string | null
    sessionId: string | null
    roomId: string | null
    moderatorAnonId: string | null
    participantAnonHandle: string | null
    avatarStyle: string | null
    avatarColor: string | null
    status: $Enums.LiveSessionStatus | null
    startedAt: Date | null
    endedAt: Date | null
    recordingConsent: boolean | null
    facilitatorNotes: string | null
    facilitatorAnonId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionRecordCountAggregateOutputType = {
    id: number
    anonSessionToken: number
    sessionId: number
    roomId: number
    moderatorAnonId: number
    participantAnonHandle: number
    avatarStyle: number
    avatarColor: number
    status: number
    startedAt: number
    endedAt: number
    recordingConsent: number
    facilitatorNotes: number
    facilitatorAnonId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionRecordMinAggregateInputType = {
    id?: true
    anonSessionToken?: true
    sessionId?: true
    roomId?: true
    moderatorAnonId?: true
    participantAnonHandle?: true
    avatarStyle?: true
    avatarColor?: true
    status?: true
    startedAt?: true
    endedAt?: true
    recordingConsent?: true
    facilitatorNotes?: true
    facilitatorAnonId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionRecordMaxAggregateInputType = {
    id?: true
    anonSessionToken?: true
    sessionId?: true
    roomId?: true
    moderatorAnonId?: true
    participantAnonHandle?: true
    avatarStyle?: true
    avatarColor?: true
    status?: true
    startedAt?: true
    endedAt?: true
    recordingConsent?: true
    facilitatorNotes?: true
    facilitatorAnonId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionRecordCountAggregateInputType = {
    id?: true
    anonSessionToken?: true
    sessionId?: true
    roomId?: true
    moderatorAnonId?: true
    participantAnonHandle?: true
    avatarStyle?: true
    avatarColor?: true
    status?: true
    startedAt?: true
    endedAt?: true
    recordingConsent?: true
    facilitatorNotes?: true
    facilitatorAnonId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionRecord to aggregate.
     */
    where?: SessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionRecords to fetch.
     */
    orderBy?: SessionRecordOrderByWithRelationInput | SessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SessionRecords
    **/
    _count?: true | SessionRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionRecordMaxAggregateInputType
  }

  export type GetSessionRecordAggregateType<T extends SessionRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateSessionRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSessionRecord[P]>
      : GetScalarType<T[P], AggregateSessionRecord[P]>
  }




  export type SessionRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionRecordWhereInput
    orderBy?: SessionRecordOrderByWithAggregationInput | SessionRecordOrderByWithAggregationInput[]
    by: SessionRecordScalarFieldEnum[] | SessionRecordScalarFieldEnum
    having?: SessionRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionRecordCountAggregateInputType | true
    _min?: SessionRecordMinAggregateInputType
    _max?: SessionRecordMaxAggregateInputType
  }

  export type SessionRecordGroupByOutputType = {
    id: string
    anonSessionToken: string
    sessionId: string
    roomId: string | null
    moderatorAnonId: string | null
    participantAnonHandle: string | null
    avatarStyle: string | null
    avatarColor: string | null
    status: $Enums.LiveSessionStatus
    startedAt: Date | null
    endedAt: Date | null
    recordingConsent: boolean
    facilitatorNotes: string | null
    facilitatorAnonId: string | null
    createdAt: Date
    updatedAt: Date
    _count: SessionRecordCountAggregateOutputType | null
    _min: SessionRecordMinAggregateOutputType | null
    _max: SessionRecordMaxAggregateOutputType | null
  }

  type GetSessionRecordGroupByPayload<T extends SessionRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionRecordGroupByOutputType[P]>
            : GetScalarType<T[P], SessionRecordGroupByOutputType[P]>
        }
      >
    >


  export type SessionRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    anonSessionToken?: boolean
    sessionId?: boolean
    roomId?: boolean
    moderatorAnonId?: boolean
    participantAnonHandle?: boolean
    avatarStyle?: boolean
    avatarColor?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    recordingConsent?: boolean
    facilitatorNotes?: boolean
    facilitatorAnonId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    auditEvents?: boolean | SessionRecord$auditEventsArgs<ExtArgs>
    groupSession?: boolean | SessionRecord$groupSessionArgs<ExtArgs>
    _count?: boolean | SessionRecordCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sessionRecord"]>

  export type SessionRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    anonSessionToken?: boolean
    sessionId?: boolean
    roomId?: boolean
    moderatorAnonId?: boolean
    participantAnonHandle?: boolean
    avatarStyle?: boolean
    avatarColor?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    recordingConsent?: boolean
    facilitatorNotes?: boolean
    facilitatorAnonId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["sessionRecord"]>

  export type SessionRecordSelectScalar = {
    id?: boolean
    anonSessionToken?: boolean
    sessionId?: boolean
    roomId?: boolean
    moderatorAnonId?: boolean
    participantAnonHandle?: boolean
    avatarStyle?: boolean
    avatarColor?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    recordingConsent?: boolean
    facilitatorNotes?: boolean
    facilitatorAnonId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditEvents?: boolean | SessionRecord$auditEventsArgs<ExtArgs>
    groupSession?: boolean | SessionRecord$groupSessionArgs<ExtArgs>
    _count?: boolean | SessionRecordCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SessionRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SessionRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SessionRecord"
    objects: {
      auditEvents: Prisma.$AuditEventPayload<ExtArgs>[]
      groupSession: Prisma.$GroupSessionRecordPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      anonSessionToken: string
      sessionId: string
      roomId: string | null
      moderatorAnonId: string | null
      participantAnonHandle: string | null
      avatarStyle: string | null
      avatarColor: string | null
      status: $Enums.LiveSessionStatus
      startedAt: Date | null
      endedAt: Date | null
      recordingConsent: boolean
      facilitatorNotes: string | null
      facilitatorAnonId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["sessionRecord"]>
    composites: {}
  }

  type SessionRecordGetPayload<S extends boolean | null | undefined | SessionRecordDefaultArgs> = $Result.GetResult<Prisma.$SessionRecordPayload, S>

  type SessionRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionRecordCountAggregateInputType | true
    }

  export interface SessionRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SessionRecord'], meta: { name: 'SessionRecord' } }
    /**
     * Find zero or one SessionRecord that matches the filter.
     * @param {SessionRecordFindUniqueArgs} args - Arguments to find a SessionRecord
     * @example
     * // Get one SessionRecord
     * const sessionRecord = await prisma.sessionRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionRecordFindUniqueArgs>(args: SelectSubset<T, SessionRecordFindUniqueArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SessionRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionRecordFindUniqueOrThrowArgs} args - Arguments to find a SessionRecord
     * @example
     * // Get one SessionRecord
     * const sessionRecord = await prisma.sessionRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SessionRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordFindFirstArgs} args - Arguments to find a SessionRecord
     * @example
     * // Get one SessionRecord
     * const sessionRecord = await prisma.sessionRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionRecordFindFirstArgs>(args?: SelectSubset<T, SessionRecordFindFirstArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SessionRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordFindFirstOrThrowArgs} args - Arguments to find a SessionRecord
     * @example
     * // Get one SessionRecord
     * const sessionRecord = await prisma.sessionRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SessionRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SessionRecords
     * const sessionRecords = await prisma.sessionRecord.findMany()
     * 
     * // Get first 10 SessionRecords
     * const sessionRecords = await prisma.sessionRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionRecordWithIdOnly = await prisma.sessionRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionRecordFindManyArgs>(args?: SelectSubset<T, SessionRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SessionRecord.
     * @param {SessionRecordCreateArgs} args - Arguments to create a SessionRecord.
     * @example
     * // Create one SessionRecord
     * const SessionRecord = await prisma.sessionRecord.create({
     *   data: {
     *     // ... data to create a SessionRecord
     *   }
     * })
     * 
     */
    create<T extends SessionRecordCreateArgs>(args: SelectSubset<T, SessionRecordCreateArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SessionRecords.
     * @param {SessionRecordCreateManyArgs} args - Arguments to create many SessionRecords.
     * @example
     * // Create many SessionRecords
     * const sessionRecord = await prisma.sessionRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionRecordCreateManyArgs>(args?: SelectSubset<T, SessionRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SessionRecords and returns the data saved in the database.
     * @param {SessionRecordCreateManyAndReturnArgs} args - Arguments to create many SessionRecords.
     * @example
     * // Create many SessionRecords
     * const sessionRecord = await prisma.sessionRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SessionRecords and only return the `id`
     * const sessionRecordWithIdOnly = await prisma.sessionRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SessionRecord.
     * @param {SessionRecordDeleteArgs} args - Arguments to delete one SessionRecord.
     * @example
     * // Delete one SessionRecord
     * const SessionRecord = await prisma.sessionRecord.delete({
     *   where: {
     *     // ... filter to delete one SessionRecord
     *   }
     * })
     * 
     */
    delete<T extends SessionRecordDeleteArgs>(args: SelectSubset<T, SessionRecordDeleteArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SessionRecord.
     * @param {SessionRecordUpdateArgs} args - Arguments to update one SessionRecord.
     * @example
     * // Update one SessionRecord
     * const sessionRecord = await prisma.sessionRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionRecordUpdateArgs>(args: SelectSubset<T, SessionRecordUpdateArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SessionRecords.
     * @param {SessionRecordDeleteManyArgs} args - Arguments to filter SessionRecords to delete.
     * @example
     * // Delete a few SessionRecords
     * const { count } = await prisma.sessionRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionRecordDeleteManyArgs>(args?: SelectSubset<T, SessionRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SessionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SessionRecords
     * const sessionRecord = await prisma.sessionRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionRecordUpdateManyArgs>(args: SelectSubset<T, SessionRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SessionRecord.
     * @param {SessionRecordUpsertArgs} args - Arguments to update or create a SessionRecord.
     * @example
     * // Update or create a SessionRecord
     * const sessionRecord = await prisma.sessionRecord.upsert({
     *   create: {
     *     // ... data to create a SessionRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SessionRecord we want to update
     *   }
     * })
     */
    upsert<T extends SessionRecordUpsertArgs>(args: SelectSubset<T, SessionRecordUpsertArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SessionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordCountArgs} args - Arguments to filter SessionRecords to count.
     * @example
     * // Count the number of SessionRecords
     * const count = await prisma.sessionRecord.count({
     *   where: {
     *     // ... the filter for the SessionRecords we want to count
     *   }
     * })
    **/
    count<T extends SessionRecordCountArgs>(
      args?: Subset<T, SessionRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SessionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SessionRecordAggregateArgs>(args: Subset<T, SessionRecordAggregateArgs>): Prisma.PrismaPromise<GetSessionRecordAggregateType<T>>

    /**
     * Group by SessionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionRecordGroupByArgs} args - Group by arguments.
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
      T extends SessionRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionRecordGroupByArgs['orderBy'] }
        : { orderBy?: SessionRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SessionRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SessionRecord model
   */
  readonly fields: SessionRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SessionRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    auditEvents<T extends SessionRecord$auditEventsArgs<ExtArgs> = {}>(args?: Subset<T, SessionRecord$auditEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditEventPayload<ExtArgs>, T, "findMany"> | Null>
    groupSession<T extends SessionRecord$groupSessionArgs<ExtArgs> = {}>(args?: Subset<T, SessionRecord$groupSessionArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
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
   * Fields of the SessionRecord model
   */ 
  interface SessionRecordFieldRefs {
    readonly id: FieldRef<"SessionRecord", 'String'>
    readonly anonSessionToken: FieldRef<"SessionRecord", 'String'>
    readonly sessionId: FieldRef<"SessionRecord", 'String'>
    readonly roomId: FieldRef<"SessionRecord", 'String'>
    readonly moderatorAnonId: FieldRef<"SessionRecord", 'String'>
    readonly participantAnonHandle: FieldRef<"SessionRecord", 'String'>
    readonly avatarStyle: FieldRef<"SessionRecord", 'String'>
    readonly avatarColor: FieldRef<"SessionRecord", 'String'>
    readonly status: FieldRef<"SessionRecord", 'LiveSessionStatus'>
    readonly startedAt: FieldRef<"SessionRecord", 'DateTime'>
    readonly endedAt: FieldRef<"SessionRecord", 'DateTime'>
    readonly recordingConsent: FieldRef<"SessionRecord", 'Boolean'>
    readonly facilitatorNotes: FieldRef<"SessionRecord", 'String'>
    readonly facilitatorAnonId: FieldRef<"SessionRecord", 'String'>
    readonly createdAt: FieldRef<"SessionRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"SessionRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SessionRecord findUnique
   */
  export type SessionRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which SessionRecord to fetch.
     */
    where: SessionRecordWhereUniqueInput
  }

  /**
   * SessionRecord findUniqueOrThrow
   */
  export type SessionRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which SessionRecord to fetch.
     */
    where: SessionRecordWhereUniqueInput
  }

  /**
   * SessionRecord findFirst
   */
  export type SessionRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which SessionRecord to fetch.
     */
    where?: SessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionRecords to fetch.
     */
    orderBy?: SessionRecordOrderByWithRelationInput | SessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionRecords.
     */
    cursor?: SessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionRecords.
     */
    distinct?: SessionRecordScalarFieldEnum | SessionRecordScalarFieldEnum[]
  }

  /**
   * SessionRecord findFirstOrThrow
   */
  export type SessionRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which SessionRecord to fetch.
     */
    where?: SessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionRecords to fetch.
     */
    orderBy?: SessionRecordOrderByWithRelationInput | SessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SessionRecords.
     */
    cursor?: SessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SessionRecords.
     */
    distinct?: SessionRecordScalarFieldEnum | SessionRecordScalarFieldEnum[]
  }

  /**
   * SessionRecord findMany
   */
  export type SessionRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which SessionRecords to fetch.
     */
    where?: SessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SessionRecords to fetch.
     */
    orderBy?: SessionRecordOrderByWithRelationInput | SessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SessionRecords.
     */
    cursor?: SessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SessionRecords.
     */
    skip?: number
    distinct?: SessionRecordScalarFieldEnum | SessionRecordScalarFieldEnum[]
  }

  /**
   * SessionRecord create
   */
  export type SessionRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a SessionRecord.
     */
    data: XOR<SessionRecordCreateInput, SessionRecordUncheckedCreateInput>
  }

  /**
   * SessionRecord createMany
   */
  export type SessionRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SessionRecords.
     */
    data: SessionRecordCreateManyInput | SessionRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SessionRecord createManyAndReturn
   */
  export type SessionRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SessionRecords.
     */
    data: SessionRecordCreateManyInput | SessionRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SessionRecord update
   */
  export type SessionRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a SessionRecord.
     */
    data: XOR<SessionRecordUpdateInput, SessionRecordUncheckedUpdateInput>
    /**
     * Choose, which SessionRecord to update.
     */
    where: SessionRecordWhereUniqueInput
  }

  /**
   * SessionRecord updateMany
   */
  export type SessionRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SessionRecords.
     */
    data: XOR<SessionRecordUpdateManyMutationInput, SessionRecordUncheckedUpdateManyInput>
    /**
     * Filter which SessionRecords to update
     */
    where?: SessionRecordWhereInput
  }

  /**
   * SessionRecord upsert
   */
  export type SessionRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the SessionRecord to update in case it exists.
     */
    where: SessionRecordWhereUniqueInput
    /**
     * In case the SessionRecord found by the `where` argument doesn't exist, create a new SessionRecord with this data.
     */
    create: XOR<SessionRecordCreateInput, SessionRecordUncheckedCreateInput>
    /**
     * In case the SessionRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionRecordUpdateInput, SessionRecordUncheckedUpdateInput>
  }

  /**
   * SessionRecord delete
   */
  export type SessionRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
    /**
     * Filter which SessionRecord to delete.
     */
    where: SessionRecordWhereUniqueInput
  }

  /**
   * SessionRecord deleteMany
   */
  export type SessionRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SessionRecords to delete
     */
    where?: SessionRecordWhereInput
  }

  /**
   * SessionRecord.auditEvents
   */
  export type SessionRecord$auditEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditEvent
     */
    select?: AuditEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
    where?: AuditEventWhereInput
    orderBy?: AuditEventOrderByWithRelationInput | AuditEventOrderByWithRelationInput[]
    cursor?: AuditEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditEventScalarFieldEnum | AuditEventScalarFieldEnum[]
  }

  /**
   * SessionRecord.groupSession
   */
  export type SessionRecord$groupSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    where?: GroupSessionRecordWhereInput
  }

  /**
   * SessionRecord without action
   */
  export type SessionRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionRecord
     */
    select?: SessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionRecordInclude<ExtArgs> | null
  }


  /**
   * Model GroupSessionRecord
   */

  export type AggregateGroupSessionRecord = {
    _count: GroupSessionRecordCountAggregateOutputType | null
    _avg: GroupSessionRecordAvgAggregateOutputType | null
    _sum: GroupSessionRecordSumAggregateOutputType | null
    _min: GroupSessionRecordMinAggregateOutputType | null
    _max: GroupSessionRecordMaxAggregateOutputType | null
  }

  export type GroupSessionRecordAvgAggregateOutputType = {
    maxParticipants: number | null
    currentParticipants: number | null
  }

  export type GroupSessionRecordSumAggregateOutputType = {
    maxParticipants: number | null
    currentParticipants: number | null
  }

  export type GroupSessionRecordMinAggregateOutputType = {
    id: string | null
    sessionRecordId: string | null
    groupLabel: string | null
    maxParticipants: number | null
    currentParticipants: number | null
    lobbyActive: boolean | null
    lobbyStartedAt: Date | null
    moderatorMutedAll: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupSessionRecordMaxAggregateOutputType = {
    id: string | null
    sessionRecordId: string | null
    groupLabel: string | null
    maxParticipants: number | null
    currentParticipants: number | null
    lobbyActive: boolean | null
    lobbyStartedAt: Date | null
    moderatorMutedAll: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GroupSessionRecordCountAggregateOutputType = {
    id: number
    sessionRecordId: number
    groupLabel: number
    maxParticipants: number
    currentParticipants: number
    lobbyActive: number
    lobbyStartedAt: number
    moderatorMutedAll: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GroupSessionRecordAvgAggregateInputType = {
    maxParticipants?: true
    currentParticipants?: true
  }

  export type GroupSessionRecordSumAggregateInputType = {
    maxParticipants?: true
    currentParticipants?: true
  }

  export type GroupSessionRecordMinAggregateInputType = {
    id?: true
    sessionRecordId?: true
    groupLabel?: true
    maxParticipants?: true
    currentParticipants?: true
    lobbyActive?: true
    lobbyStartedAt?: true
    moderatorMutedAll?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupSessionRecordMaxAggregateInputType = {
    id?: true
    sessionRecordId?: true
    groupLabel?: true
    maxParticipants?: true
    currentParticipants?: true
    lobbyActive?: true
    lobbyStartedAt?: true
    moderatorMutedAll?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GroupSessionRecordCountAggregateInputType = {
    id?: true
    sessionRecordId?: true
    groupLabel?: true
    maxParticipants?: true
    currentParticipants?: true
    lobbyActive?: true
    lobbyStartedAt?: true
    moderatorMutedAll?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GroupSessionRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSessionRecord to aggregate.
     */
    where?: GroupSessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionRecords to fetch.
     */
    orderBy?: GroupSessionRecordOrderByWithRelationInput | GroupSessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GroupSessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GroupSessionRecords
    **/
    _count?: true | GroupSessionRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GroupSessionRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GroupSessionRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GroupSessionRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GroupSessionRecordMaxAggregateInputType
  }

  export type GetGroupSessionRecordAggregateType<T extends GroupSessionRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateGroupSessionRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGroupSessionRecord[P]>
      : GetScalarType<T[P], AggregateGroupSessionRecord[P]>
  }




  export type GroupSessionRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GroupSessionRecordWhereInput
    orderBy?: GroupSessionRecordOrderByWithAggregationInput | GroupSessionRecordOrderByWithAggregationInput[]
    by: GroupSessionRecordScalarFieldEnum[] | GroupSessionRecordScalarFieldEnum
    having?: GroupSessionRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GroupSessionRecordCountAggregateInputType | true
    _avg?: GroupSessionRecordAvgAggregateInputType
    _sum?: GroupSessionRecordSumAggregateInputType
    _min?: GroupSessionRecordMinAggregateInputType
    _max?: GroupSessionRecordMaxAggregateInputType
  }

  export type GroupSessionRecordGroupByOutputType = {
    id: string
    sessionRecordId: string
    groupLabel: string | null
    maxParticipants: number
    currentParticipants: number
    lobbyActive: boolean
    lobbyStartedAt: Date | null
    moderatorMutedAll: boolean
    createdAt: Date
    updatedAt: Date
    _count: GroupSessionRecordCountAggregateOutputType | null
    _avg: GroupSessionRecordAvgAggregateOutputType | null
    _sum: GroupSessionRecordSumAggregateOutputType | null
    _min: GroupSessionRecordMinAggregateOutputType | null
    _max: GroupSessionRecordMaxAggregateOutputType | null
  }

  type GetGroupSessionRecordGroupByPayload<T extends GroupSessionRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GroupSessionRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GroupSessionRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GroupSessionRecordGroupByOutputType[P]>
            : GetScalarType<T[P], GroupSessionRecordGroupByOutputType[P]>
        }
      >
    >


  export type GroupSessionRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionRecordId?: boolean
    groupLabel?: boolean
    maxParticipants?: boolean
    currentParticipants?: boolean
    lobbyActive?: boolean
    lobbyStartedAt?: boolean
    moderatorMutedAll?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupSessionRecord"]>

  export type GroupSessionRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionRecordId?: boolean
    groupLabel?: boolean
    maxParticipants?: boolean
    currentParticipants?: boolean
    lobbyActive?: boolean
    lobbyStartedAt?: boolean
    moderatorMutedAll?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["groupSessionRecord"]>

  export type GroupSessionRecordSelectScalar = {
    id?: boolean
    sessionRecordId?: boolean
    groupLabel?: boolean
    maxParticipants?: boolean
    currentParticipants?: boolean
    lobbyActive?: boolean
    lobbyStartedAt?: boolean
    moderatorMutedAll?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GroupSessionRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }
  export type GroupSessionRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }

  export type $GroupSessionRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GroupSessionRecord"
    objects: {
      sessionRecord: Prisma.$SessionRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionRecordId: string
      groupLabel: string | null
      maxParticipants: number
      currentParticipants: number
      lobbyActive: boolean
      lobbyStartedAt: Date | null
      moderatorMutedAll: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["groupSessionRecord"]>
    composites: {}
  }

  type GroupSessionRecordGetPayload<S extends boolean | null | undefined | GroupSessionRecordDefaultArgs> = $Result.GetResult<Prisma.$GroupSessionRecordPayload, S>

  type GroupSessionRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GroupSessionRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GroupSessionRecordCountAggregateInputType | true
    }

  export interface GroupSessionRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GroupSessionRecord'], meta: { name: 'GroupSessionRecord' } }
    /**
     * Find zero or one GroupSessionRecord that matches the filter.
     * @param {GroupSessionRecordFindUniqueArgs} args - Arguments to find a GroupSessionRecord
     * @example
     * // Get one GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GroupSessionRecordFindUniqueArgs>(args: SelectSubset<T, GroupSessionRecordFindUniqueArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GroupSessionRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GroupSessionRecordFindUniqueOrThrowArgs} args - Arguments to find a GroupSessionRecord
     * @example
     * // Get one GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GroupSessionRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, GroupSessionRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GroupSessionRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordFindFirstArgs} args - Arguments to find a GroupSessionRecord
     * @example
     * // Get one GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GroupSessionRecordFindFirstArgs>(args?: SelectSubset<T, GroupSessionRecordFindFirstArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GroupSessionRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordFindFirstOrThrowArgs} args - Arguments to find a GroupSessionRecord
     * @example
     * // Get one GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GroupSessionRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, GroupSessionRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GroupSessionRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GroupSessionRecords
     * const groupSessionRecords = await prisma.groupSessionRecord.findMany()
     * 
     * // Get first 10 GroupSessionRecords
     * const groupSessionRecords = await prisma.groupSessionRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const groupSessionRecordWithIdOnly = await prisma.groupSessionRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GroupSessionRecordFindManyArgs>(args?: SelectSubset<T, GroupSessionRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GroupSessionRecord.
     * @param {GroupSessionRecordCreateArgs} args - Arguments to create a GroupSessionRecord.
     * @example
     * // Create one GroupSessionRecord
     * const GroupSessionRecord = await prisma.groupSessionRecord.create({
     *   data: {
     *     // ... data to create a GroupSessionRecord
     *   }
     * })
     * 
     */
    create<T extends GroupSessionRecordCreateArgs>(args: SelectSubset<T, GroupSessionRecordCreateArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GroupSessionRecords.
     * @param {GroupSessionRecordCreateManyArgs} args - Arguments to create many GroupSessionRecords.
     * @example
     * // Create many GroupSessionRecords
     * const groupSessionRecord = await prisma.groupSessionRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GroupSessionRecordCreateManyArgs>(args?: SelectSubset<T, GroupSessionRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GroupSessionRecords and returns the data saved in the database.
     * @param {GroupSessionRecordCreateManyAndReturnArgs} args - Arguments to create many GroupSessionRecords.
     * @example
     * // Create many GroupSessionRecords
     * const groupSessionRecord = await prisma.groupSessionRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GroupSessionRecords and only return the `id`
     * const groupSessionRecordWithIdOnly = await prisma.groupSessionRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GroupSessionRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, GroupSessionRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GroupSessionRecord.
     * @param {GroupSessionRecordDeleteArgs} args - Arguments to delete one GroupSessionRecord.
     * @example
     * // Delete one GroupSessionRecord
     * const GroupSessionRecord = await prisma.groupSessionRecord.delete({
     *   where: {
     *     // ... filter to delete one GroupSessionRecord
     *   }
     * })
     * 
     */
    delete<T extends GroupSessionRecordDeleteArgs>(args: SelectSubset<T, GroupSessionRecordDeleteArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GroupSessionRecord.
     * @param {GroupSessionRecordUpdateArgs} args - Arguments to update one GroupSessionRecord.
     * @example
     * // Update one GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GroupSessionRecordUpdateArgs>(args: SelectSubset<T, GroupSessionRecordUpdateArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GroupSessionRecords.
     * @param {GroupSessionRecordDeleteManyArgs} args - Arguments to filter GroupSessionRecords to delete.
     * @example
     * // Delete a few GroupSessionRecords
     * const { count } = await prisma.groupSessionRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GroupSessionRecordDeleteManyArgs>(args?: SelectSubset<T, GroupSessionRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GroupSessionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GroupSessionRecords
     * const groupSessionRecord = await prisma.groupSessionRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GroupSessionRecordUpdateManyArgs>(args: SelectSubset<T, GroupSessionRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GroupSessionRecord.
     * @param {GroupSessionRecordUpsertArgs} args - Arguments to update or create a GroupSessionRecord.
     * @example
     * // Update or create a GroupSessionRecord
     * const groupSessionRecord = await prisma.groupSessionRecord.upsert({
     *   create: {
     *     // ... data to create a GroupSessionRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GroupSessionRecord we want to update
     *   }
     * })
     */
    upsert<T extends GroupSessionRecordUpsertArgs>(args: SelectSubset<T, GroupSessionRecordUpsertArgs<ExtArgs>>): Prisma__GroupSessionRecordClient<$Result.GetResult<Prisma.$GroupSessionRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GroupSessionRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordCountArgs} args - Arguments to filter GroupSessionRecords to count.
     * @example
     * // Count the number of GroupSessionRecords
     * const count = await prisma.groupSessionRecord.count({
     *   where: {
     *     // ... the filter for the GroupSessionRecords we want to count
     *   }
     * })
    **/
    count<T extends GroupSessionRecordCountArgs>(
      args?: Subset<T, GroupSessionRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GroupSessionRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GroupSessionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GroupSessionRecordAggregateArgs>(args: Subset<T, GroupSessionRecordAggregateArgs>): Prisma.PrismaPromise<GetGroupSessionRecordAggregateType<T>>

    /**
     * Group by GroupSessionRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GroupSessionRecordGroupByArgs} args - Group by arguments.
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
      T extends GroupSessionRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GroupSessionRecordGroupByArgs['orderBy'] }
        : { orderBy?: GroupSessionRecordGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GroupSessionRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGroupSessionRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GroupSessionRecord model
   */
  readonly fields: GroupSessionRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GroupSessionRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GroupSessionRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessionRecord<T extends SessionRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SessionRecordDefaultArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the GroupSessionRecord model
   */ 
  interface GroupSessionRecordFieldRefs {
    readonly id: FieldRef<"GroupSessionRecord", 'String'>
    readonly sessionRecordId: FieldRef<"GroupSessionRecord", 'String'>
    readonly groupLabel: FieldRef<"GroupSessionRecord", 'String'>
    readonly maxParticipants: FieldRef<"GroupSessionRecord", 'Int'>
    readonly currentParticipants: FieldRef<"GroupSessionRecord", 'Int'>
    readonly lobbyActive: FieldRef<"GroupSessionRecord", 'Boolean'>
    readonly lobbyStartedAt: FieldRef<"GroupSessionRecord", 'DateTime'>
    readonly moderatorMutedAll: FieldRef<"GroupSessionRecord", 'Boolean'>
    readonly createdAt: FieldRef<"GroupSessionRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"GroupSessionRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GroupSessionRecord findUnique
   */
  export type GroupSessionRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionRecord to fetch.
     */
    where: GroupSessionRecordWhereUniqueInput
  }

  /**
   * GroupSessionRecord findUniqueOrThrow
   */
  export type GroupSessionRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionRecord to fetch.
     */
    where: GroupSessionRecordWhereUniqueInput
  }

  /**
   * GroupSessionRecord findFirst
   */
  export type GroupSessionRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionRecord to fetch.
     */
    where?: GroupSessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionRecords to fetch.
     */
    orderBy?: GroupSessionRecordOrderByWithRelationInput | GroupSessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessionRecords.
     */
    cursor?: GroupSessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessionRecords.
     */
    distinct?: GroupSessionRecordScalarFieldEnum | GroupSessionRecordScalarFieldEnum[]
  }

  /**
   * GroupSessionRecord findFirstOrThrow
   */
  export type GroupSessionRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionRecord to fetch.
     */
    where?: GroupSessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionRecords to fetch.
     */
    orderBy?: GroupSessionRecordOrderByWithRelationInput | GroupSessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GroupSessionRecords.
     */
    cursor?: GroupSessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GroupSessionRecords.
     */
    distinct?: GroupSessionRecordScalarFieldEnum | GroupSessionRecordScalarFieldEnum[]
  }

  /**
   * GroupSessionRecord findMany
   */
  export type GroupSessionRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter, which GroupSessionRecords to fetch.
     */
    where?: GroupSessionRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GroupSessionRecords to fetch.
     */
    orderBy?: GroupSessionRecordOrderByWithRelationInput | GroupSessionRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GroupSessionRecords.
     */
    cursor?: GroupSessionRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GroupSessionRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GroupSessionRecords.
     */
    skip?: number
    distinct?: GroupSessionRecordScalarFieldEnum | GroupSessionRecordScalarFieldEnum[]
  }

  /**
   * GroupSessionRecord create
   */
  export type GroupSessionRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a GroupSessionRecord.
     */
    data: XOR<GroupSessionRecordCreateInput, GroupSessionRecordUncheckedCreateInput>
  }

  /**
   * GroupSessionRecord createMany
   */
  export type GroupSessionRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GroupSessionRecords.
     */
    data: GroupSessionRecordCreateManyInput | GroupSessionRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GroupSessionRecord createManyAndReturn
   */
  export type GroupSessionRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GroupSessionRecords.
     */
    data: GroupSessionRecordCreateManyInput | GroupSessionRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GroupSessionRecord update
   */
  export type GroupSessionRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a GroupSessionRecord.
     */
    data: XOR<GroupSessionRecordUpdateInput, GroupSessionRecordUncheckedUpdateInput>
    /**
     * Choose, which GroupSessionRecord to update.
     */
    where: GroupSessionRecordWhereUniqueInput
  }

  /**
   * GroupSessionRecord updateMany
   */
  export type GroupSessionRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GroupSessionRecords.
     */
    data: XOR<GroupSessionRecordUpdateManyMutationInput, GroupSessionRecordUncheckedUpdateManyInput>
    /**
     * Filter which GroupSessionRecords to update
     */
    where?: GroupSessionRecordWhereInput
  }

  /**
   * GroupSessionRecord upsert
   */
  export type GroupSessionRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the GroupSessionRecord to update in case it exists.
     */
    where: GroupSessionRecordWhereUniqueInput
    /**
     * In case the GroupSessionRecord found by the `where` argument doesn't exist, create a new GroupSessionRecord with this data.
     */
    create: XOR<GroupSessionRecordCreateInput, GroupSessionRecordUncheckedCreateInput>
    /**
     * In case the GroupSessionRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GroupSessionRecordUpdateInput, GroupSessionRecordUncheckedUpdateInput>
  }

  /**
   * GroupSessionRecord delete
   */
  export type GroupSessionRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
    /**
     * Filter which GroupSessionRecord to delete.
     */
    where: GroupSessionRecordWhereUniqueInput
  }

  /**
   * GroupSessionRecord deleteMany
   */
  export type GroupSessionRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GroupSessionRecords to delete
     */
    where?: GroupSessionRecordWhereInput
  }

  /**
   * GroupSessionRecord without action
   */
  export type GroupSessionRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GroupSessionRecord
     */
    select?: GroupSessionRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GroupSessionRecordInclude<ExtArgs> | null
  }


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
    sessionRecordId: string | null
    eventType: $Enums.AuditEventType | null
    severity: $Enums.AuditSeverity | null
    actorAnonId: string | null
    actorRole: string | null
    deviceFingerprintHash: string | null
    ipHash: string | null
    createdAt: Date | null
  }

  export type AuditEventMaxAggregateOutputType = {
    id: string | null
    sessionRecordId: string | null
    eventType: $Enums.AuditEventType | null
    severity: $Enums.AuditSeverity | null
    actorAnonId: string | null
    actorRole: string | null
    deviceFingerprintHash: string | null
    ipHash: string | null
    createdAt: Date | null
  }

  export type AuditEventCountAggregateOutputType = {
    id: number
    sessionRecordId: number
    eventType: number
    severity: number
    actorAnonId: number
    actorRole: number
    eventData: number
    deviceFingerprintHash: number
    ipHash: number
    createdAt: number
    _all: number
  }


  export type AuditEventMinAggregateInputType = {
    id?: true
    sessionRecordId?: true
    eventType?: true
    severity?: true
    actorAnonId?: true
    actorRole?: true
    deviceFingerprintHash?: true
    ipHash?: true
    createdAt?: true
  }

  export type AuditEventMaxAggregateInputType = {
    id?: true
    sessionRecordId?: true
    eventType?: true
    severity?: true
    actorAnonId?: true
    actorRole?: true
    deviceFingerprintHash?: true
    ipHash?: true
    createdAt?: true
  }

  export type AuditEventCountAggregateInputType = {
    id?: true
    sessionRecordId?: true
    eventType?: true
    severity?: true
    actorAnonId?: true
    actorRole?: true
    eventData?: true
    deviceFingerprintHash?: true
    ipHash?: true
    createdAt?: true
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
    sessionRecordId: string
    eventType: $Enums.AuditEventType
    severity: $Enums.AuditSeverity
    actorAnonId: string | null
    actorRole: string | null
    eventData: JsonValue | null
    deviceFingerprintHash: string | null
    ipHash: string | null
    createdAt: Date
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
    sessionRecordId?: boolean
    eventType?: boolean
    severity?: boolean
    actorAnonId?: boolean
    actorRole?: boolean
    eventData?: boolean
    deviceFingerprintHash?: boolean
    ipHash?: boolean
    createdAt?: boolean
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionRecordId?: boolean
    eventType?: boolean
    severity?: boolean
    actorAnonId?: boolean
    actorRole?: boolean
    eventData?: boolean
    deviceFingerprintHash?: boolean
    ipHash?: boolean
    createdAt?: boolean
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["auditEvent"]>

  export type AuditEventSelectScalar = {
    id?: boolean
    sessionRecordId?: boolean
    eventType?: boolean
    severity?: boolean
    actorAnonId?: boolean
    actorRole?: boolean
    eventData?: boolean
    deviceFingerprintHash?: boolean
    ipHash?: boolean
    createdAt?: boolean
  }

  export type AuditEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }
  export type AuditEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessionRecord?: boolean | SessionRecordDefaultArgs<ExtArgs>
  }

  export type $AuditEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditEvent"
    objects: {
      sessionRecord: Prisma.$SessionRecordPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionRecordId: string
      eventType: $Enums.AuditEventType
      severity: $Enums.AuditSeverity
      actorAnonId: string | null
      actorRole: string | null
      eventData: Prisma.JsonValue | null
      deviceFingerprintHash: string | null
      ipHash: string | null
      createdAt: Date
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
    sessionRecord<T extends SessionRecordDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SessionRecordDefaultArgs<ExtArgs>>): Prisma__SessionRecordClient<$Result.GetResult<Prisma.$SessionRecordPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
    readonly sessionRecordId: FieldRef<"AuditEvent", 'String'>
    readonly eventType: FieldRef<"AuditEvent", 'AuditEventType'>
    readonly severity: FieldRef<"AuditEvent", 'AuditSeverity'>
    readonly actorAnonId: FieldRef<"AuditEvent", 'String'>
    readonly actorRole: FieldRef<"AuditEvent", 'String'>
    readonly eventData: FieldRef<"AuditEvent", 'Json'>
    readonly deviceFingerprintHash: FieldRef<"AuditEvent", 'String'>
    readonly ipHash: FieldRef<"AuditEvent", 'String'>
    readonly createdAt: FieldRef<"AuditEvent", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventIncludeCreateManyAndReturn<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditEventInclude<ExtArgs> | null
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


  export const SessionRecordScalarFieldEnum: {
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

  export type SessionRecordScalarFieldEnum = (typeof SessionRecordScalarFieldEnum)[keyof typeof SessionRecordScalarFieldEnum]


  export const GroupSessionRecordScalarFieldEnum: {
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

  export type GroupSessionRecordScalarFieldEnum = (typeof GroupSessionRecordScalarFieldEnum)[keyof typeof GroupSessionRecordScalarFieldEnum]


  export const AuditEventScalarFieldEnum: {
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

  export type AuditEventScalarFieldEnum = (typeof AuditEventScalarFieldEnum)[keyof typeof AuditEventScalarFieldEnum]


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
   * Reference to a field of type 'LiveSessionStatus'
   */
  export type EnumLiveSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveSessionStatus'>
    


  /**
   * Reference to a field of type 'LiveSessionStatus[]'
   */
  export type ListEnumLiveSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LiveSessionStatus[]'>
    


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AuditEventType'
   */
  export type EnumAuditEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditEventType'>
    


  /**
   * Reference to a field of type 'AuditEventType[]'
   */
  export type ListEnumAuditEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditEventType[]'>
    


  /**
   * Reference to a field of type 'AuditSeverity'
   */
  export type EnumAuditSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditSeverity'>
    


  /**
   * Reference to a field of type 'AuditSeverity[]'
   */
  export type ListEnumAuditSeverityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuditSeverity[]'>
    


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


  export type SessionRecordWhereInput = {
    AND?: SessionRecordWhereInput | SessionRecordWhereInput[]
    OR?: SessionRecordWhereInput[]
    NOT?: SessionRecordWhereInput | SessionRecordWhereInput[]
    id?: StringFilter<"SessionRecord"> | string
    anonSessionToken?: StringFilter<"SessionRecord"> | string
    sessionId?: StringFilter<"SessionRecord"> | string
    roomId?: StringNullableFilter<"SessionRecord"> | string | null
    moderatorAnonId?: StringNullableFilter<"SessionRecord"> | string | null
    participantAnonHandle?: StringNullableFilter<"SessionRecord"> | string | null
    avatarStyle?: StringNullableFilter<"SessionRecord"> | string | null
    avatarColor?: StringNullableFilter<"SessionRecord"> | string | null
    status?: EnumLiveSessionStatusFilter<"SessionRecord"> | $Enums.LiveSessionStatus
    startedAt?: DateTimeNullableFilter<"SessionRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"SessionRecord"> | Date | string | null
    recordingConsent?: BoolFilter<"SessionRecord"> | boolean
    facilitatorNotes?: StringNullableFilter<"SessionRecord"> | string | null
    facilitatorAnonId?: StringNullableFilter<"SessionRecord"> | string | null
    createdAt?: DateTimeFilter<"SessionRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SessionRecord"> | Date | string
    auditEvents?: AuditEventListRelationFilter
    groupSession?: XOR<GroupSessionRecordNullableRelationFilter, GroupSessionRecordWhereInput> | null
  }

  export type SessionRecordOrderByWithRelationInput = {
    id?: SortOrder
    anonSessionToken?: SortOrder
    sessionId?: SortOrder
    roomId?: SortOrderInput | SortOrder
    moderatorAnonId?: SortOrderInput | SortOrder
    participantAnonHandle?: SortOrderInput | SortOrder
    avatarStyle?: SortOrderInput | SortOrder
    avatarColor?: SortOrderInput | SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    recordingConsent?: SortOrder
    facilitatorNotes?: SortOrderInput | SortOrder
    facilitatorAnonId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    auditEvents?: AuditEventOrderByRelationAggregateInput
    groupSession?: GroupSessionRecordOrderByWithRelationInput
  }

  export type SessionRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    anonSessionToken?: string
    AND?: SessionRecordWhereInput | SessionRecordWhereInput[]
    OR?: SessionRecordWhereInput[]
    NOT?: SessionRecordWhereInput | SessionRecordWhereInput[]
    sessionId?: StringFilter<"SessionRecord"> | string
    roomId?: StringNullableFilter<"SessionRecord"> | string | null
    moderatorAnonId?: StringNullableFilter<"SessionRecord"> | string | null
    participantAnonHandle?: StringNullableFilter<"SessionRecord"> | string | null
    avatarStyle?: StringNullableFilter<"SessionRecord"> | string | null
    avatarColor?: StringNullableFilter<"SessionRecord"> | string | null
    status?: EnumLiveSessionStatusFilter<"SessionRecord"> | $Enums.LiveSessionStatus
    startedAt?: DateTimeNullableFilter<"SessionRecord"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"SessionRecord"> | Date | string | null
    recordingConsent?: BoolFilter<"SessionRecord"> | boolean
    facilitatorNotes?: StringNullableFilter<"SessionRecord"> | string | null
    facilitatorAnonId?: StringNullableFilter<"SessionRecord"> | string | null
    createdAt?: DateTimeFilter<"SessionRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SessionRecord"> | Date | string
    auditEvents?: AuditEventListRelationFilter
    groupSession?: XOR<GroupSessionRecordNullableRelationFilter, GroupSessionRecordWhereInput> | null
  }, "id" | "anonSessionToken">

  export type SessionRecordOrderByWithAggregationInput = {
    id?: SortOrder
    anonSessionToken?: SortOrder
    sessionId?: SortOrder
    roomId?: SortOrderInput | SortOrder
    moderatorAnonId?: SortOrderInput | SortOrder
    participantAnonHandle?: SortOrderInput | SortOrder
    avatarStyle?: SortOrderInput | SortOrder
    avatarColor?: SortOrderInput | SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    recordingConsent?: SortOrder
    facilitatorNotes?: SortOrderInput | SortOrder
    facilitatorAnonId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionRecordCountOrderByAggregateInput
    _max?: SessionRecordMaxOrderByAggregateInput
    _min?: SessionRecordMinOrderByAggregateInput
  }

  export type SessionRecordScalarWhereWithAggregatesInput = {
    AND?: SessionRecordScalarWhereWithAggregatesInput | SessionRecordScalarWhereWithAggregatesInput[]
    OR?: SessionRecordScalarWhereWithAggregatesInput[]
    NOT?: SessionRecordScalarWhereWithAggregatesInput | SessionRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SessionRecord"> | string
    anonSessionToken?: StringWithAggregatesFilter<"SessionRecord"> | string
    sessionId?: StringWithAggregatesFilter<"SessionRecord"> | string
    roomId?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    moderatorAnonId?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    participantAnonHandle?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    avatarStyle?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    avatarColor?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    status?: EnumLiveSessionStatusWithAggregatesFilter<"SessionRecord"> | $Enums.LiveSessionStatus
    startedAt?: DateTimeNullableWithAggregatesFilter<"SessionRecord"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"SessionRecord"> | Date | string | null
    recordingConsent?: BoolWithAggregatesFilter<"SessionRecord"> | boolean
    facilitatorNotes?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    facilitatorAnonId?: StringNullableWithAggregatesFilter<"SessionRecord"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SessionRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SessionRecord"> | Date | string
  }

  export type GroupSessionRecordWhereInput = {
    AND?: GroupSessionRecordWhereInput | GroupSessionRecordWhereInput[]
    OR?: GroupSessionRecordWhereInput[]
    NOT?: GroupSessionRecordWhereInput | GroupSessionRecordWhereInput[]
    id?: StringFilter<"GroupSessionRecord"> | string
    sessionRecordId?: StringFilter<"GroupSessionRecord"> | string
    groupLabel?: StringNullableFilter<"GroupSessionRecord"> | string | null
    maxParticipants?: IntFilter<"GroupSessionRecord"> | number
    currentParticipants?: IntFilter<"GroupSessionRecord"> | number
    lobbyActive?: BoolFilter<"GroupSessionRecord"> | boolean
    lobbyStartedAt?: DateTimeNullableFilter<"GroupSessionRecord"> | Date | string | null
    moderatorMutedAll?: BoolFilter<"GroupSessionRecord"> | boolean
    createdAt?: DateTimeFilter<"GroupSessionRecord"> | Date | string
    updatedAt?: DateTimeFilter<"GroupSessionRecord"> | Date | string
    sessionRecord?: XOR<SessionRecordRelationFilter, SessionRecordWhereInput>
  }

  export type GroupSessionRecordOrderByWithRelationInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    groupLabel?: SortOrderInput | SortOrder
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
    lobbyActive?: SortOrder
    lobbyStartedAt?: SortOrderInput | SortOrder
    moderatorMutedAll?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessionRecord?: SessionRecordOrderByWithRelationInput
  }

  export type GroupSessionRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionRecordId?: string
    AND?: GroupSessionRecordWhereInput | GroupSessionRecordWhereInput[]
    OR?: GroupSessionRecordWhereInput[]
    NOT?: GroupSessionRecordWhereInput | GroupSessionRecordWhereInput[]
    groupLabel?: StringNullableFilter<"GroupSessionRecord"> | string | null
    maxParticipants?: IntFilter<"GroupSessionRecord"> | number
    currentParticipants?: IntFilter<"GroupSessionRecord"> | number
    lobbyActive?: BoolFilter<"GroupSessionRecord"> | boolean
    lobbyStartedAt?: DateTimeNullableFilter<"GroupSessionRecord"> | Date | string | null
    moderatorMutedAll?: BoolFilter<"GroupSessionRecord"> | boolean
    createdAt?: DateTimeFilter<"GroupSessionRecord"> | Date | string
    updatedAt?: DateTimeFilter<"GroupSessionRecord"> | Date | string
    sessionRecord?: XOR<SessionRecordRelationFilter, SessionRecordWhereInput>
  }, "id" | "sessionRecordId">

  export type GroupSessionRecordOrderByWithAggregationInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    groupLabel?: SortOrderInput | SortOrder
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
    lobbyActive?: SortOrder
    lobbyStartedAt?: SortOrderInput | SortOrder
    moderatorMutedAll?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GroupSessionRecordCountOrderByAggregateInput
    _avg?: GroupSessionRecordAvgOrderByAggregateInput
    _max?: GroupSessionRecordMaxOrderByAggregateInput
    _min?: GroupSessionRecordMinOrderByAggregateInput
    _sum?: GroupSessionRecordSumOrderByAggregateInput
  }

  export type GroupSessionRecordScalarWhereWithAggregatesInput = {
    AND?: GroupSessionRecordScalarWhereWithAggregatesInput | GroupSessionRecordScalarWhereWithAggregatesInput[]
    OR?: GroupSessionRecordScalarWhereWithAggregatesInput[]
    NOT?: GroupSessionRecordScalarWhereWithAggregatesInput | GroupSessionRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GroupSessionRecord"> | string
    sessionRecordId?: StringWithAggregatesFilter<"GroupSessionRecord"> | string
    groupLabel?: StringNullableWithAggregatesFilter<"GroupSessionRecord"> | string | null
    maxParticipants?: IntWithAggregatesFilter<"GroupSessionRecord"> | number
    currentParticipants?: IntWithAggregatesFilter<"GroupSessionRecord"> | number
    lobbyActive?: BoolWithAggregatesFilter<"GroupSessionRecord"> | boolean
    lobbyStartedAt?: DateTimeNullableWithAggregatesFilter<"GroupSessionRecord"> | Date | string | null
    moderatorMutedAll?: BoolWithAggregatesFilter<"GroupSessionRecord"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"GroupSessionRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GroupSessionRecord"> | Date | string
  }

  export type AuditEventWhereInput = {
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    sessionRecordId?: StringFilter<"AuditEvent"> | string
    eventType?: EnumAuditEventTypeFilter<"AuditEvent"> | $Enums.AuditEventType
    severity?: EnumAuditSeverityFilter<"AuditEvent"> | $Enums.AuditSeverity
    actorAnonId?: StringNullableFilter<"AuditEvent"> | string | null
    actorRole?: StringNullableFilter<"AuditEvent"> | string | null
    eventData?: JsonNullableFilter<"AuditEvent">
    deviceFingerprintHash?: StringNullableFilter<"AuditEvent"> | string | null
    ipHash?: StringNullableFilter<"AuditEvent"> | string | null
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    sessionRecord?: XOR<SessionRecordRelationFilter, SessionRecordWhereInput>
  }

  export type AuditEventOrderByWithRelationInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    actorAnonId?: SortOrderInput | SortOrder
    actorRole?: SortOrderInput | SortOrder
    eventData?: SortOrderInput | SortOrder
    deviceFingerprintHash?: SortOrderInput | SortOrder
    ipHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    sessionRecord?: SessionRecordOrderByWithRelationInput
  }

  export type AuditEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditEventWhereInput | AuditEventWhereInput[]
    OR?: AuditEventWhereInput[]
    NOT?: AuditEventWhereInput | AuditEventWhereInput[]
    sessionRecordId?: StringFilter<"AuditEvent"> | string
    eventType?: EnumAuditEventTypeFilter<"AuditEvent"> | $Enums.AuditEventType
    severity?: EnumAuditSeverityFilter<"AuditEvent"> | $Enums.AuditSeverity
    actorAnonId?: StringNullableFilter<"AuditEvent"> | string | null
    actorRole?: StringNullableFilter<"AuditEvent"> | string | null
    eventData?: JsonNullableFilter<"AuditEvent">
    deviceFingerprintHash?: StringNullableFilter<"AuditEvent"> | string | null
    ipHash?: StringNullableFilter<"AuditEvent"> | string | null
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
    sessionRecord?: XOR<SessionRecordRelationFilter, SessionRecordWhereInput>
  }, "id">

  export type AuditEventOrderByWithAggregationInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    actorAnonId?: SortOrderInput | SortOrder
    actorRole?: SortOrderInput | SortOrder
    eventData?: SortOrderInput | SortOrder
    deviceFingerprintHash?: SortOrderInput | SortOrder
    ipHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditEventCountOrderByAggregateInput
    _max?: AuditEventMaxOrderByAggregateInput
    _min?: AuditEventMinOrderByAggregateInput
  }

  export type AuditEventScalarWhereWithAggregatesInput = {
    AND?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    OR?: AuditEventScalarWhereWithAggregatesInput[]
    NOT?: AuditEventScalarWhereWithAggregatesInput | AuditEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditEvent"> | string
    sessionRecordId?: StringWithAggregatesFilter<"AuditEvent"> | string
    eventType?: EnumAuditEventTypeWithAggregatesFilter<"AuditEvent"> | $Enums.AuditEventType
    severity?: EnumAuditSeverityWithAggregatesFilter<"AuditEvent"> | $Enums.AuditSeverity
    actorAnonId?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    actorRole?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    eventData?: JsonNullableWithAggregatesFilter<"AuditEvent">
    deviceFingerprintHash?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    ipHash?: StringNullableWithAggregatesFilter<"AuditEvent"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditEvent"> | Date | string
  }

  export type SessionRecordCreateInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditEvents?: AuditEventCreateNestedManyWithoutSessionRecordInput
    groupSession?: GroupSessionRecordCreateNestedOneWithoutSessionRecordInput
  }

  export type SessionRecordUncheckedCreateInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutSessionRecordInput
    groupSession?: GroupSessionRecordUncheckedCreateNestedOneWithoutSessionRecordInput
  }

  export type SessionRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditEvents?: AuditEventUpdateManyWithoutSessionRecordNestedInput
    groupSession?: GroupSessionRecordUpdateOneWithoutSessionRecordNestedInput
  }

  export type SessionRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditEvents?: AuditEventUncheckedUpdateManyWithoutSessionRecordNestedInput
    groupSession?: GroupSessionRecordUncheckedUpdateOneWithoutSessionRecordNestedInput
  }

  export type SessionRecordCreateManyInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionRecordCreateInput = {
    id?: string
    groupLabel?: string | null
    maxParticipants?: number
    currentParticipants?: number
    lobbyActive?: boolean
    lobbyStartedAt?: Date | string | null
    moderatorMutedAll?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessionRecord: SessionRecordCreateNestedOneWithoutGroupSessionInput
  }

  export type GroupSessionRecordUncheckedCreateInput = {
    id?: string
    sessionRecordId: string
    groupLabel?: string | null
    maxParticipants?: number
    currentParticipants?: number
    lobbyActive?: boolean
    lobbyStartedAt?: Date | string | null
    moderatorMutedAll?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionRecord?: SessionRecordUpdateOneRequiredWithoutGroupSessionNestedInput
  }

  export type GroupSessionRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRecordId?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionRecordCreateManyInput = {
    id?: string
    sessionRecordId: string
    groupLabel?: string | null
    maxParticipants?: number
    currentParticipants?: number
    lobbyActive?: boolean
    lobbyStartedAt?: Date | string | null
    moderatorMutedAll?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRecordId?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateInput = {
    id?: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
    sessionRecord: SessionRecordCreateNestedOneWithoutAuditEventsInput
  }

  export type AuditEventUncheckedCreateInput = {
    id?: string
    sessionRecordId: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
  }

  export type AuditEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessionRecord?: SessionRecordUpdateOneRequiredWithoutAuditEventsNestedInput
  }

  export type AuditEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRecordId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventCreateManyInput = {
    id?: string
    sessionRecordId: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
  }

  export type AuditEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionRecordId?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type EnumLiveSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveSessionStatus | EnumLiveSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLiveSessionStatusFilter<$PrismaModel> | $Enums.LiveSessionStatus
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

  export type AuditEventListRelationFilter = {
    every?: AuditEventWhereInput
    some?: AuditEventWhereInput
    none?: AuditEventWhereInput
  }

  export type GroupSessionRecordNullableRelationFilter = {
    is?: GroupSessionRecordWhereInput | null
    isNot?: GroupSessionRecordWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionRecordCountOrderByAggregateInput = {
    id?: SortOrder
    anonSessionToken?: SortOrder
    sessionId?: SortOrder
    roomId?: SortOrder
    moderatorAnonId?: SortOrder
    participantAnonHandle?: SortOrder
    avatarStyle?: SortOrder
    avatarColor?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    recordingConsent?: SortOrder
    facilitatorNotes?: SortOrder
    facilitatorAnonId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    anonSessionToken?: SortOrder
    sessionId?: SortOrder
    roomId?: SortOrder
    moderatorAnonId?: SortOrder
    participantAnonHandle?: SortOrder
    avatarStyle?: SortOrder
    avatarColor?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    recordingConsent?: SortOrder
    facilitatorNotes?: SortOrder
    facilitatorAnonId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionRecordMinOrderByAggregateInput = {
    id?: SortOrder
    anonSessionToken?: SortOrder
    sessionId?: SortOrder
    roomId?: SortOrder
    moderatorAnonId?: SortOrder
    participantAnonHandle?: SortOrder
    avatarStyle?: SortOrder
    avatarColor?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    recordingConsent?: SortOrder
    facilitatorNotes?: SortOrder
    facilitatorAnonId?: SortOrder
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

  export type EnumLiveSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveSessionStatus | EnumLiveSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLiveSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.LiveSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLiveSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumLiveSessionStatusFilter<$PrismaModel>
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

  export type SessionRecordRelationFilter = {
    is?: SessionRecordWhereInput
    isNot?: SessionRecordWhereInput
  }

  export type GroupSessionRecordCountOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    groupLabel?: SortOrder
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
    lobbyActive?: SortOrder
    lobbyStartedAt?: SortOrder
    moderatorMutedAll?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionRecordAvgOrderByAggregateInput = {
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
  }

  export type GroupSessionRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    groupLabel?: SortOrder
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
    lobbyActive?: SortOrder
    lobbyStartedAt?: SortOrder
    moderatorMutedAll?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionRecordMinOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    groupLabel?: SortOrder
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
    lobbyActive?: SortOrder
    lobbyStartedAt?: SortOrder
    moderatorMutedAll?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GroupSessionRecordSumOrderByAggregateInput = {
    maxParticipants?: SortOrder
    currentParticipants?: SortOrder
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

  export type EnumAuditEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditEventType | EnumAuditEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditEventTypeFilter<$PrismaModel> | $Enums.AuditEventType
  }

  export type EnumAuditSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditSeverity | EnumAuditSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditSeverityFilter<$PrismaModel> | $Enums.AuditSeverity
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

  export type AuditEventCountOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    actorAnonId?: SortOrder
    actorRole?: SortOrder
    eventData?: SortOrder
    deviceFingerprintHash?: SortOrder
    ipHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    actorAnonId?: SortOrder
    actorRole?: SortOrder
    deviceFingerprintHash?: SortOrder
    ipHash?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditEventMinOrderByAggregateInput = {
    id?: SortOrder
    sessionRecordId?: SortOrder
    eventType?: SortOrder
    severity?: SortOrder
    actorAnonId?: SortOrder
    actorRole?: SortOrder
    deviceFingerprintHash?: SortOrder
    ipHash?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAuditEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditEventType | EnumAuditEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuditEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditEventTypeFilter<$PrismaModel>
    _max?: NestedEnumAuditEventTypeFilter<$PrismaModel>
  }

  export type EnumAuditSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditSeverity | EnumAuditSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AuditSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditSeverityFilter<$PrismaModel>
    _max?: NestedEnumAuditSeverityFilter<$PrismaModel>
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

  export type AuditEventCreateNestedManyWithoutSessionRecordInput = {
    create?: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput> | AuditEventCreateWithoutSessionRecordInput[] | AuditEventUncheckedCreateWithoutSessionRecordInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutSessionRecordInput | AuditEventCreateOrConnectWithoutSessionRecordInput[]
    createMany?: AuditEventCreateManySessionRecordInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type GroupSessionRecordCreateNestedOneWithoutSessionRecordInput = {
    create?: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
    connectOrCreate?: GroupSessionRecordCreateOrConnectWithoutSessionRecordInput
    connect?: GroupSessionRecordWhereUniqueInput
  }

  export type AuditEventUncheckedCreateNestedManyWithoutSessionRecordInput = {
    create?: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput> | AuditEventCreateWithoutSessionRecordInput[] | AuditEventUncheckedCreateWithoutSessionRecordInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutSessionRecordInput | AuditEventCreateOrConnectWithoutSessionRecordInput[]
    createMany?: AuditEventCreateManySessionRecordInputEnvelope
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
  }

  export type GroupSessionRecordUncheckedCreateNestedOneWithoutSessionRecordInput = {
    create?: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
    connectOrCreate?: GroupSessionRecordCreateOrConnectWithoutSessionRecordInput
    connect?: GroupSessionRecordWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumLiveSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.LiveSessionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AuditEventUpdateManyWithoutSessionRecordNestedInput = {
    create?: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput> | AuditEventCreateWithoutSessionRecordInput[] | AuditEventUncheckedCreateWithoutSessionRecordInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutSessionRecordInput | AuditEventCreateOrConnectWithoutSessionRecordInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutSessionRecordInput | AuditEventUpsertWithWhereUniqueWithoutSessionRecordInput[]
    createMany?: AuditEventCreateManySessionRecordInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutSessionRecordInput | AuditEventUpdateWithWhereUniqueWithoutSessionRecordInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutSessionRecordInput | AuditEventUpdateManyWithWhereWithoutSessionRecordInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type GroupSessionRecordUpdateOneWithoutSessionRecordNestedInput = {
    create?: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
    connectOrCreate?: GroupSessionRecordCreateOrConnectWithoutSessionRecordInput
    upsert?: GroupSessionRecordUpsertWithoutSessionRecordInput
    disconnect?: GroupSessionRecordWhereInput | boolean
    delete?: GroupSessionRecordWhereInput | boolean
    connect?: GroupSessionRecordWhereUniqueInput
    update?: XOR<XOR<GroupSessionRecordUpdateToOneWithWhereWithoutSessionRecordInput, GroupSessionRecordUpdateWithoutSessionRecordInput>, GroupSessionRecordUncheckedUpdateWithoutSessionRecordInput>
  }

  export type AuditEventUncheckedUpdateManyWithoutSessionRecordNestedInput = {
    create?: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput> | AuditEventCreateWithoutSessionRecordInput[] | AuditEventUncheckedCreateWithoutSessionRecordInput[]
    connectOrCreate?: AuditEventCreateOrConnectWithoutSessionRecordInput | AuditEventCreateOrConnectWithoutSessionRecordInput[]
    upsert?: AuditEventUpsertWithWhereUniqueWithoutSessionRecordInput | AuditEventUpsertWithWhereUniqueWithoutSessionRecordInput[]
    createMany?: AuditEventCreateManySessionRecordInputEnvelope
    set?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    disconnect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    delete?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    connect?: AuditEventWhereUniqueInput | AuditEventWhereUniqueInput[]
    update?: AuditEventUpdateWithWhereUniqueWithoutSessionRecordInput | AuditEventUpdateWithWhereUniqueWithoutSessionRecordInput[]
    updateMany?: AuditEventUpdateManyWithWhereWithoutSessionRecordInput | AuditEventUpdateManyWithWhereWithoutSessionRecordInput[]
    deleteMany?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
  }

  export type GroupSessionRecordUncheckedUpdateOneWithoutSessionRecordNestedInput = {
    create?: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
    connectOrCreate?: GroupSessionRecordCreateOrConnectWithoutSessionRecordInput
    upsert?: GroupSessionRecordUpsertWithoutSessionRecordInput
    disconnect?: GroupSessionRecordWhereInput | boolean
    delete?: GroupSessionRecordWhereInput | boolean
    connect?: GroupSessionRecordWhereUniqueInput
    update?: XOR<XOR<GroupSessionRecordUpdateToOneWithWhereWithoutSessionRecordInput, GroupSessionRecordUpdateWithoutSessionRecordInput>, GroupSessionRecordUncheckedUpdateWithoutSessionRecordInput>
  }

  export type SessionRecordCreateNestedOneWithoutGroupSessionInput = {
    create?: XOR<SessionRecordCreateWithoutGroupSessionInput, SessionRecordUncheckedCreateWithoutGroupSessionInput>
    connectOrCreate?: SessionRecordCreateOrConnectWithoutGroupSessionInput
    connect?: SessionRecordWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SessionRecordUpdateOneRequiredWithoutGroupSessionNestedInput = {
    create?: XOR<SessionRecordCreateWithoutGroupSessionInput, SessionRecordUncheckedCreateWithoutGroupSessionInput>
    connectOrCreate?: SessionRecordCreateOrConnectWithoutGroupSessionInput
    upsert?: SessionRecordUpsertWithoutGroupSessionInput
    connect?: SessionRecordWhereUniqueInput
    update?: XOR<XOR<SessionRecordUpdateToOneWithWhereWithoutGroupSessionInput, SessionRecordUpdateWithoutGroupSessionInput>, SessionRecordUncheckedUpdateWithoutGroupSessionInput>
  }

  export type SessionRecordCreateNestedOneWithoutAuditEventsInput = {
    create?: XOR<SessionRecordCreateWithoutAuditEventsInput, SessionRecordUncheckedCreateWithoutAuditEventsInput>
    connectOrCreate?: SessionRecordCreateOrConnectWithoutAuditEventsInput
    connect?: SessionRecordWhereUniqueInput
  }

  export type EnumAuditEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.AuditEventType
  }

  export type EnumAuditSeverityFieldUpdateOperationsInput = {
    set?: $Enums.AuditSeverity
  }

  export type SessionRecordUpdateOneRequiredWithoutAuditEventsNestedInput = {
    create?: XOR<SessionRecordCreateWithoutAuditEventsInput, SessionRecordUncheckedCreateWithoutAuditEventsInput>
    connectOrCreate?: SessionRecordCreateOrConnectWithoutAuditEventsInput
    upsert?: SessionRecordUpsertWithoutAuditEventsInput
    connect?: SessionRecordWhereUniqueInput
    update?: XOR<XOR<SessionRecordUpdateToOneWithWhereWithoutAuditEventsInput, SessionRecordUpdateWithoutAuditEventsInput>, SessionRecordUncheckedUpdateWithoutAuditEventsInput>
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

  export type NestedEnumLiveSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveSessionStatus | EnumLiveSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLiveSessionStatusFilter<$PrismaModel> | $Enums.LiveSessionStatus
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

  export type NestedEnumLiveSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveSessionStatus | EnumLiveSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LiveSessionStatus[] | ListEnumLiveSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLiveSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.LiveSessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLiveSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumLiveSessionStatusFilter<$PrismaModel>
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

  export type NestedEnumAuditEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditEventType | EnumAuditEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditEventTypeFilter<$PrismaModel> | $Enums.AuditEventType
  }

  export type NestedEnumAuditSeverityFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditSeverity | EnumAuditSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditSeverityFilter<$PrismaModel> | $Enums.AuditSeverity
  }

  export type NestedEnumAuditEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditEventType | EnumAuditEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditEventType[] | ListEnumAuditEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuditEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditEventTypeFilter<$PrismaModel>
    _max?: NestedEnumAuditEventTypeFilter<$PrismaModel>
  }

  export type NestedEnumAuditSeverityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuditSeverity | EnumAuditSeverityFieldRefInput<$PrismaModel>
    in?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuditSeverity[] | ListEnumAuditSeverityFieldRefInput<$PrismaModel>
    not?: NestedEnumAuditSeverityWithAggregatesFilter<$PrismaModel> | $Enums.AuditSeverity
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuditSeverityFilter<$PrismaModel>
    _max?: NestedEnumAuditSeverityFilter<$PrismaModel>
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

  export type AuditEventCreateWithoutSessionRecordInput = {
    id?: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
  }

  export type AuditEventUncheckedCreateWithoutSessionRecordInput = {
    id?: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
  }

  export type AuditEventCreateOrConnectWithoutSessionRecordInput = {
    where: AuditEventWhereUniqueInput
    create: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput>
  }

  export type AuditEventCreateManySessionRecordInputEnvelope = {
    data: AuditEventCreateManySessionRecordInput | AuditEventCreateManySessionRecordInput[]
    skipDuplicates?: boolean
  }

  export type GroupSessionRecordCreateWithoutSessionRecordInput = {
    id?: string
    groupLabel?: string | null
    maxParticipants?: number
    currentParticipants?: number
    lobbyActive?: boolean
    lobbyStartedAt?: Date | string | null
    moderatorMutedAll?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionRecordUncheckedCreateWithoutSessionRecordInput = {
    id?: string
    groupLabel?: string | null
    maxParticipants?: number
    currentParticipants?: number
    lobbyActive?: boolean
    lobbyStartedAt?: Date | string | null
    moderatorMutedAll?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GroupSessionRecordCreateOrConnectWithoutSessionRecordInput = {
    where: GroupSessionRecordWhereUniqueInput
    create: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
  }

  export type AuditEventUpsertWithWhereUniqueWithoutSessionRecordInput = {
    where: AuditEventWhereUniqueInput
    update: XOR<AuditEventUpdateWithoutSessionRecordInput, AuditEventUncheckedUpdateWithoutSessionRecordInput>
    create: XOR<AuditEventCreateWithoutSessionRecordInput, AuditEventUncheckedCreateWithoutSessionRecordInput>
  }

  export type AuditEventUpdateWithWhereUniqueWithoutSessionRecordInput = {
    where: AuditEventWhereUniqueInput
    data: XOR<AuditEventUpdateWithoutSessionRecordInput, AuditEventUncheckedUpdateWithoutSessionRecordInput>
  }

  export type AuditEventUpdateManyWithWhereWithoutSessionRecordInput = {
    where: AuditEventScalarWhereInput
    data: XOR<AuditEventUpdateManyMutationInput, AuditEventUncheckedUpdateManyWithoutSessionRecordInput>
  }

  export type AuditEventScalarWhereInput = {
    AND?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    OR?: AuditEventScalarWhereInput[]
    NOT?: AuditEventScalarWhereInput | AuditEventScalarWhereInput[]
    id?: StringFilter<"AuditEvent"> | string
    sessionRecordId?: StringFilter<"AuditEvent"> | string
    eventType?: EnumAuditEventTypeFilter<"AuditEvent"> | $Enums.AuditEventType
    severity?: EnumAuditSeverityFilter<"AuditEvent"> | $Enums.AuditSeverity
    actorAnonId?: StringNullableFilter<"AuditEvent"> | string | null
    actorRole?: StringNullableFilter<"AuditEvent"> | string | null
    eventData?: JsonNullableFilter<"AuditEvent">
    deviceFingerprintHash?: StringNullableFilter<"AuditEvent"> | string | null
    ipHash?: StringNullableFilter<"AuditEvent"> | string | null
    createdAt?: DateTimeFilter<"AuditEvent"> | Date | string
  }

  export type GroupSessionRecordUpsertWithoutSessionRecordInput = {
    update: XOR<GroupSessionRecordUpdateWithoutSessionRecordInput, GroupSessionRecordUncheckedUpdateWithoutSessionRecordInput>
    create: XOR<GroupSessionRecordCreateWithoutSessionRecordInput, GroupSessionRecordUncheckedCreateWithoutSessionRecordInput>
    where?: GroupSessionRecordWhereInput
  }

  export type GroupSessionRecordUpdateToOneWithWhereWithoutSessionRecordInput = {
    where?: GroupSessionRecordWhereInput
    data: XOR<GroupSessionRecordUpdateWithoutSessionRecordInput, GroupSessionRecordUncheckedUpdateWithoutSessionRecordInput>
  }

  export type GroupSessionRecordUpdateWithoutSessionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GroupSessionRecordUncheckedUpdateWithoutSessionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    groupLabel?: NullableStringFieldUpdateOperationsInput | string | null
    maxParticipants?: IntFieldUpdateOperationsInput | number
    currentParticipants?: IntFieldUpdateOperationsInput | number
    lobbyActive?: BoolFieldUpdateOperationsInput | boolean
    lobbyStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    moderatorMutedAll?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionRecordCreateWithoutGroupSessionInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditEvents?: AuditEventCreateNestedManyWithoutSessionRecordInput
  }

  export type SessionRecordUncheckedCreateWithoutGroupSessionInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditEvents?: AuditEventUncheckedCreateNestedManyWithoutSessionRecordInput
  }

  export type SessionRecordCreateOrConnectWithoutGroupSessionInput = {
    where: SessionRecordWhereUniqueInput
    create: XOR<SessionRecordCreateWithoutGroupSessionInput, SessionRecordUncheckedCreateWithoutGroupSessionInput>
  }

  export type SessionRecordUpsertWithoutGroupSessionInput = {
    update: XOR<SessionRecordUpdateWithoutGroupSessionInput, SessionRecordUncheckedUpdateWithoutGroupSessionInput>
    create: XOR<SessionRecordCreateWithoutGroupSessionInput, SessionRecordUncheckedCreateWithoutGroupSessionInput>
    where?: SessionRecordWhereInput
  }

  export type SessionRecordUpdateToOneWithWhereWithoutGroupSessionInput = {
    where?: SessionRecordWhereInput
    data: XOR<SessionRecordUpdateWithoutGroupSessionInput, SessionRecordUncheckedUpdateWithoutGroupSessionInput>
  }

  export type SessionRecordUpdateWithoutGroupSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditEvents?: AuditEventUpdateManyWithoutSessionRecordNestedInput
  }

  export type SessionRecordUncheckedUpdateWithoutGroupSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditEvents?: AuditEventUncheckedUpdateManyWithoutSessionRecordNestedInput
  }

  export type SessionRecordCreateWithoutAuditEventsInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    groupSession?: GroupSessionRecordCreateNestedOneWithoutSessionRecordInput
  }

  export type SessionRecordUncheckedCreateWithoutAuditEventsInput = {
    id?: string
    anonSessionToken: string
    sessionId: string
    roomId?: string | null
    moderatorAnonId?: string | null
    participantAnonHandle?: string | null
    avatarStyle?: string | null
    avatarColor?: string | null
    status?: $Enums.LiveSessionStatus
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    recordingConsent?: boolean
    facilitatorNotes?: string | null
    facilitatorAnonId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    groupSession?: GroupSessionRecordUncheckedCreateNestedOneWithoutSessionRecordInput
  }

  export type SessionRecordCreateOrConnectWithoutAuditEventsInput = {
    where: SessionRecordWhereUniqueInput
    create: XOR<SessionRecordCreateWithoutAuditEventsInput, SessionRecordUncheckedCreateWithoutAuditEventsInput>
  }

  export type SessionRecordUpsertWithoutAuditEventsInput = {
    update: XOR<SessionRecordUpdateWithoutAuditEventsInput, SessionRecordUncheckedUpdateWithoutAuditEventsInput>
    create: XOR<SessionRecordCreateWithoutAuditEventsInput, SessionRecordUncheckedCreateWithoutAuditEventsInput>
    where?: SessionRecordWhereInput
  }

  export type SessionRecordUpdateToOneWithWhereWithoutAuditEventsInput = {
    where?: SessionRecordWhereInput
    data: XOR<SessionRecordUpdateWithoutAuditEventsInput, SessionRecordUncheckedUpdateWithoutAuditEventsInput>
  }

  export type SessionRecordUpdateWithoutAuditEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    groupSession?: GroupSessionRecordUpdateOneWithoutSessionRecordNestedInput
  }

  export type SessionRecordUncheckedUpdateWithoutAuditEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    anonSessionToken?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    roomId?: NullableStringFieldUpdateOperationsInput | string | null
    moderatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    participantAnonHandle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarStyle?: NullableStringFieldUpdateOperationsInput | string | null
    avatarColor?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumLiveSessionStatusFieldUpdateOperationsInput | $Enums.LiveSessionStatus
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    recordingConsent?: BoolFieldUpdateOperationsInput | boolean
    facilitatorNotes?: NullableStringFieldUpdateOperationsInput | string | null
    facilitatorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    groupSession?: GroupSessionRecordUncheckedUpdateOneWithoutSessionRecordNestedInput
  }

  export type AuditEventCreateManySessionRecordInput = {
    id?: string
    eventType: $Enums.AuditEventType
    severity?: $Enums.AuditSeverity
    actorAnonId?: string | null
    actorRole?: string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: string | null
    ipHash?: string | null
    createdAt?: Date | string
  }

  export type AuditEventUpdateWithoutSessionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateWithoutSessionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditEventUncheckedUpdateManyWithoutSessionRecordInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventType?: EnumAuditEventTypeFieldUpdateOperationsInput | $Enums.AuditEventType
    severity?: EnumAuditSeverityFieldUpdateOperationsInput | $Enums.AuditSeverity
    actorAnonId?: NullableStringFieldUpdateOperationsInput | string | null
    actorRole?: NullableStringFieldUpdateOperationsInput | string | null
    eventData?: NullableJsonNullValueInput | InputJsonValue
    deviceFingerprintHash?: NullableStringFieldUpdateOperationsInput | string | null
    ipHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use SessionRecordCountOutputTypeDefaultArgs instead
     */
    export type SessionRecordCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionRecordCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionRecordDefaultArgs instead
     */
    export type SessionRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GroupSessionRecordDefaultArgs instead
     */
    export type GroupSessionRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GroupSessionRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AuditEventDefaultArgs instead
     */
    export type AuditEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AuditEventDefaultArgs<ExtArgs>

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