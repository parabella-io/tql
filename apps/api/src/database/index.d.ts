
/**
 * Client
**/

import * as runtime from './runtime/client.js';
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
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model WorkspaceMember
 * 
 */
export type WorkspaceMember = $Result.DefaultSelection<Prisma.$WorkspaceMemberPayload>
/**
 * Model WorkspaceMemberInvite
 * 
 */
export type WorkspaceMemberInvite = $Result.DefaultSelection<Prisma.$WorkspaceMemberInvitePayload>
/**
 * Model WorkspaceTicketLabel
 * 
 */
export type WorkspaceTicketLabel = $Result.DefaultSelection<Prisma.$WorkspaceTicketLabelPayload>
/**
 * Model TicketList
 * 
 */
export type TicketList = $Result.DefaultSelection<Prisma.$TicketListPayload>
/**
 * Model Ticket
 * 
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>
/**
 * Model TicketAttachment
 * 
 */
export type TicketAttachment = $Result.DefaultSelection<Prisma.$TicketAttachmentPayload>
/**
 * Model TicketComment
 * 
 */
export type TicketComment = $Result.DefaultSelection<Prisma.$TicketCommentPayload>
/**
 * Model TicketLabel
 * 
 */
export type TicketLabel = $Result.DefaultSelection<Prisma.$TicketLabelPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspaceMember`: Exposes CRUD operations for the **WorkspaceMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceMembers
    * const workspaceMembers = await prisma.workspaceMember.findMany()
    * ```
    */
  get workspaceMember(): Prisma.WorkspaceMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspaceMemberInvite`: Exposes CRUD operations for the **WorkspaceMemberInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceMemberInvites
    * const workspaceMemberInvites = await prisma.workspaceMemberInvite.findMany()
    * ```
    */
  get workspaceMemberInvite(): Prisma.WorkspaceMemberInviteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspaceTicketLabel`: Exposes CRUD operations for the **WorkspaceTicketLabel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceTicketLabels
    * const workspaceTicketLabels = await prisma.workspaceTicketLabel.findMany()
    * ```
    */
  get workspaceTicketLabel(): Prisma.WorkspaceTicketLabelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketList`: Exposes CRUD operations for the **TicketList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketLists
    * const ticketLists = await prisma.ticketList.findMany()
    * ```
    */
  get ticketList(): Prisma.TicketListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketAttachment`: Exposes CRUD operations for the **TicketAttachment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketAttachments
    * const ticketAttachments = await prisma.ticketAttachment.findMany()
    * ```
    */
  get ticketAttachment(): Prisma.TicketAttachmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketComment`: Exposes CRUD operations for the **TicketComment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketComments
    * const ticketComments = await prisma.ticketComment.findMany()
    * ```
    */
  get ticketComment(): Prisma.TicketCommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticketLabel`: Exposes CRUD operations for the **TicketLabel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TicketLabels
    * const ticketLabels = await prisma.ticketLabel.findMany()
    * ```
    */
  get ticketLabel(): Prisma.TicketLabelDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    Workspace: 'Workspace',
    WorkspaceMember: 'WorkspaceMember',
    WorkspaceMemberInvite: 'WorkspaceMemberInvite',
    WorkspaceTicketLabel: 'WorkspaceTicketLabel',
    TicketList: 'TicketList',
    Ticket: 'Ticket',
    TicketAttachment: 'TicketAttachment',
    TicketComment: 'TicketComment',
    TicketLabel: 'TicketLabel'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "workspace" | "workspaceMember" | "workspaceMemberInvite" | "workspaceTicketLabel" | "ticketList" | "ticket" | "ticketAttachment" | "ticketComment" | "ticketLabel"
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
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
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
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
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
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceMember: {
        payload: Prisma.$WorkspaceMemberPayload<ExtArgs>
        fields: Prisma.WorkspaceMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          findFirst: {
            args: Prisma.WorkspaceMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          findMany: {
            args: Prisma.WorkspaceMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[]
          }
          create: {
            args: Prisma.WorkspaceMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          createMany: {
            args: Prisma.WorkspaceMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[]
          }
          delete: {
            args: Prisma.WorkspaceMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          update: {
            args: Prisma.WorkspaceMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>
          }
          aggregate: {
            args: Prisma.WorkspaceMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceMember>
          }
          groupBy: {
            args: Prisma.WorkspaceMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceMemberCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceMemberInvite: {
        payload: Prisma.$WorkspaceMemberInvitePayload<ExtArgs>
        fields: Prisma.WorkspaceMemberInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceMemberInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceMemberInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceMemberInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceMemberInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          findMany: {
            args: Prisma.WorkspaceMemberInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>[]
          }
          create: {
            args: Prisma.WorkspaceMemberInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          createMany: {
            args: Prisma.WorkspaceMemberInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceMemberInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceMemberInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          update: {
            args: Prisma.WorkspaceMemberInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceMemberInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceMemberInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceMemberInviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceMemberInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceMemberInvitePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceMemberInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceMemberInvite>
          }
          groupBy: {
            args: Prisma.WorkspaceMemberInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceMemberInviteCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceMemberInviteCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceTicketLabel: {
        payload: Prisma.$WorkspaceTicketLabelPayload<ExtArgs>
        fields: Prisma.WorkspaceTicketLabelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceTicketLabelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceTicketLabelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          findFirst: {
            args: Prisma.WorkspaceTicketLabelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceTicketLabelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          findMany: {
            args: Prisma.WorkspaceTicketLabelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>[]
          }
          create: {
            args: Prisma.WorkspaceTicketLabelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          createMany: {
            args: Prisma.WorkspaceTicketLabelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceTicketLabelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>[]
          }
          delete: {
            args: Prisma.WorkspaceTicketLabelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          update: {
            args: Prisma.WorkspaceTicketLabelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceTicketLabelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceTicketLabelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceTicketLabelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceTicketLabelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceTicketLabelPayload>
          }
          aggregate: {
            args: Prisma.WorkspaceTicketLabelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceTicketLabel>
          }
          groupBy: {
            args: Prisma.WorkspaceTicketLabelGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceTicketLabelGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceTicketLabelCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceTicketLabelCountAggregateOutputType> | number
          }
        }
      }
      TicketList: {
        payload: Prisma.$TicketListPayload<ExtArgs>
        fields: Prisma.TicketListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          findFirst: {
            args: Prisma.TicketListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          findMany: {
            args: Prisma.TicketListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>[]
          }
          create: {
            args: Prisma.TicketListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          createMany: {
            args: Prisma.TicketListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>[]
          }
          delete: {
            args: Prisma.TicketListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          update: {
            args: Prisma.TicketListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          deleteMany: {
            args: Prisma.TicketListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>[]
          }
          upsert: {
            args: Prisma.TicketListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketListPayload>
          }
          aggregate: {
            args: Prisma.TicketListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketList>
          }
          groupBy: {
            args: Prisma.TicketListGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketListGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketListCountArgs<ExtArgs>
            result: $Utils.Optional<TicketListCountAggregateOutputType> | number
          }
        }
      }
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>
        fields: Prisma.TicketFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[]
          }
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>
          }
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicket>
          }
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCountAggregateOutputType> | number
          }
        }
      }
      TicketAttachment: {
        payload: Prisma.$TicketAttachmentPayload<ExtArgs>
        fields: Prisma.TicketAttachmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketAttachmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketAttachmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          findFirst: {
            args: Prisma.TicketAttachmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketAttachmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          findMany: {
            args: Prisma.TicketAttachmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>[]
          }
          create: {
            args: Prisma.TicketAttachmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          createMany: {
            args: Prisma.TicketAttachmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketAttachmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>[]
          }
          delete: {
            args: Prisma.TicketAttachmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          update: {
            args: Prisma.TicketAttachmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          deleteMany: {
            args: Prisma.TicketAttachmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketAttachmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketAttachmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>[]
          }
          upsert: {
            args: Prisma.TicketAttachmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketAttachmentPayload>
          }
          aggregate: {
            args: Prisma.TicketAttachmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketAttachment>
          }
          groupBy: {
            args: Prisma.TicketAttachmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketAttachmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketAttachmentCountArgs<ExtArgs>
            result: $Utils.Optional<TicketAttachmentCountAggregateOutputType> | number
          }
        }
      }
      TicketComment: {
        payload: Prisma.$TicketCommentPayload<ExtArgs>
        fields: Prisma.TicketCommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketCommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketCommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          findFirst: {
            args: Prisma.TicketCommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketCommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          findMany: {
            args: Prisma.TicketCommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>[]
          }
          create: {
            args: Prisma.TicketCommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          createMany: {
            args: Prisma.TicketCommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketCommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>[]
          }
          delete: {
            args: Prisma.TicketCommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          update: {
            args: Prisma.TicketCommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          deleteMany: {
            args: Prisma.TicketCommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketCommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketCommentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>[]
          }
          upsert: {
            args: Prisma.TicketCommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketCommentPayload>
          }
          aggregate: {
            args: Prisma.TicketCommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketComment>
          }
          groupBy: {
            args: Prisma.TicketCommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketCommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketCommentCountArgs<ExtArgs>
            result: $Utils.Optional<TicketCommentCountAggregateOutputType> | number
          }
        }
      }
      TicketLabel: {
        payload: Prisma.$TicketLabelPayload<ExtArgs>
        fields: Prisma.TicketLabelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TicketLabelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TicketLabelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          findFirst: {
            args: Prisma.TicketLabelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TicketLabelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          findMany: {
            args: Prisma.TicketLabelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>[]
          }
          create: {
            args: Prisma.TicketLabelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          createMany: {
            args: Prisma.TicketLabelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TicketLabelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>[]
          }
          delete: {
            args: Prisma.TicketLabelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          update: {
            args: Prisma.TicketLabelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          deleteMany: {
            args: Prisma.TicketLabelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TicketLabelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TicketLabelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>[]
          }
          upsert: {
            args: Prisma.TicketLabelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TicketLabelPayload>
          }
          aggregate: {
            args: Prisma.TicketLabelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTicketLabel>
          }
          groupBy: {
            args: Prisma.TicketLabelGroupByArgs<ExtArgs>
            result: $Utils.Optional<TicketLabelGroupByOutputType>[]
          }
          count: {
            args: Prisma.TicketLabelCountArgs<ExtArgs>
            result: $Utils.Optional<TicketLabelCountAggregateOutputType> | number
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
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
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
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    workspace?: WorkspaceOmit
    workspaceMember?: WorkspaceMemberOmit
    workspaceMemberInvite?: WorkspaceMemberInviteOmit
    workspaceTicketLabel?: WorkspaceTicketLabelOmit
    ticketList?: TicketListOmit
    ticket?: TicketOmit
    ticketAttachment?: TicketAttachmentOmit
    ticketComment?: TicketCommentOmit
    ticketLabel?: TicketLabelOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
    | 'updateManyAndReturn'
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
    accounts: number
    members: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    members?: boolean | UserCountOutputTypeCountMembersArgs
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
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
  }


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    members: number
    tickets: number
    ticketLists: number
    ticketAttachments: number
    ticketComments: number
    ticketLabels: number
    workspaceTicketLabels: number
    workspaceMemberInvites: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | WorkspaceCountOutputTypeCountMembersArgs
    tickets?: boolean | WorkspaceCountOutputTypeCountTicketsArgs
    ticketLists?: boolean | WorkspaceCountOutputTypeCountTicketListsArgs
    ticketAttachments?: boolean | WorkspaceCountOutputTypeCountTicketAttachmentsArgs
    ticketComments?: boolean | WorkspaceCountOutputTypeCountTicketCommentsArgs
    ticketLabels?: boolean | WorkspaceCountOutputTypeCountTicketLabelsArgs
    workspaceTicketLabels?: boolean | WorkspaceCountOutputTypeCountWorkspaceTicketLabelsArgs
    workspaceMemberInvites?: boolean | WorkspaceCountOutputTypeCountWorkspaceMemberInvitesArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTicketListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketListWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTicketAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketAttachmentWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTicketCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketCommentWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTicketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketLabelWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountWorkspaceTicketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceTicketLabelWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountWorkspaceMemberInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberInviteWhereInput
  }


  /**
   * Count Type WorkspaceMemberCountOutputType
   */

  export type WorkspaceMemberCountOutputType = {
    assignedTickets: number
    reportedTickets: number
  }

  export type WorkspaceMemberCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedTickets?: boolean | WorkspaceMemberCountOutputTypeCountAssignedTicketsArgs
    reportedTickets?: boolean | WorkspaceMemberCountOutputTypeCountReportedTicketsArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceMemberCountOutputType without action
   */
  export type WorkspaceMemberCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberCountOutputType
     */
    select?: WorkspaceMemberCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceMemberCountOutputType without action
   */
  export type WorkspaceMemberCountOutputTypeCountAssignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }

  /**
   * WorkspaceMemberCountOutputType without action
   */
  export type WorkspaceMemberCountOutputTypeCountReportedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }


  /**
   * Count Type WorkspaceTicketLabelCountOutputType
   */

  export type WorkspaceTicketLabelCountOutputType = {
    ticketLabels: number
  }

  export type WorkspaceTicketLabelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticketLabels?: boolean | WorkspaceTicketLabelCountOutputTypeCountTicketLabelsArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceTicketLabelCountOutputType without action
   */
  export type WorkspaceTicketLabelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabelCountOutputType
     */
    select?: WorkspaceTicketLabelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceTicketLabelCountOutputType without action
   */
  export type WorkspaceTicketLabelCountOutputTypeCountTicketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketLabelWhereInput
  }


  /**
   * Count Type TicketListCountOutputType
   */

  export type TicketListCountOutputType = {
    tickets: number
  }

  export type TicketListCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tickets?: boolean | TicketListCountOutputTypeCountTicketsArgs
  }

  // Custom InputTypes
  /**
   * TicketListCountOutputType without action
   */
  export type TicketListCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketListCountOutputType
     */
    select?: TicketListCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TicketListCountOutputType without action
   */
  export type TicketListCountOutputTypeCountTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
  }


  /**
   * Count Type TicketCountOutputType
   */

  export type TicketCountOutputType = {
    attachments: number
    comments: number
    labels: number
  }

  export type TicketCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attachments?: boolean | TicketCountOutputTypeCountAttachmentsArgs
    comments?: boolean | TicketCountOutputTypeCountCommentsArgs
    labels?: boolean | TicketCountOutputTypeCountLabelsArgs
  }

  // Custom InputTypes
  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketCountOutputType
     */
    select?: TicketCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketAttachmentWhereInput
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketCommentWhereInput
  }

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeCountLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketLabelWhereInput
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
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
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
    name: string
    email: string
    emailVerified: boolean
    image: string | null
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
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    members?: boolean | User$membersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    members?: boolean | User$membersArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      members: Prisma.$WorkspaceMemberPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      image: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
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
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

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
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


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
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    members<T extends User$membersArgs<ExtArgs> = {}>(args?: Subset<T, User$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
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
    /**
     * Limit how many Users to delete.
     */
    limit?: number
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.members
   */
  export type User$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    cursor?: WorkspaceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
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
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
    expiresAt: Date | null
    token: string | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    ipAddress: number
    userAgent: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
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
    expiresAt: Date
    token: string
    ipAddress: string | null
    userAgent: string | null
    userId: string
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
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "ipAddress" | "userAgent" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      ipAddress: string | null
      userAgent: string | null
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
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
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

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
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

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
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

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
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

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
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

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
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


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
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
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
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
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
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
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
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
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
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Workspace$membersArgs<ExtArgs>
    tickets?: boolean | Workspace$ticketsArgs<ExtArgs>
    ticketLists?: boolean | Workspace$ticketListsArgs<ExtArgs>
    ticketAttachments?: boolean | Workspace$ticketAttachmentsArgs<ExtArgs>
    ticketComments?: boolean | Workspace$ticketCommentsArgs<ExtArgs>
    ticketLabels?: boolean | Workspace$ticketLabelsArgs<ExtArgs>
    workspaceTicketLabels?: boolean | Workspace$workspaceTicketLabelsArgs<ExtArgs>
    workspaceMemberInvites?: boolean | Workspace$workspaceMemberInvitesArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["workspace"]>
  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Workspace$membersArgs<ExtArgs>
    tickets?: boolean | Workspace$ticketsArgs<ExtArgs>
    ticketLists?: boolean | Workspace$ticketListsArgs<ExtArgs>
    ticketAttachments?: boolean | Workspace$ticketAttachmentsArgs<ExtArgs>
    ticketComments?: boolean | Workspace$ticketCommentsArgs<ExtArgs>
    ticketLabels?: boolean | Workspace$ticketLabelsArgs<ExtArgs>
    workspaceTicketLabels?: boolean | Workspace$workspaceTicketLabelsArgs<ExtArgs>
    workspaceMemberInvites?: boolean | Workspace$workspaceMemberInvitesArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      members: Prisma.$WorkspaceMemberPayload<ExtArgs>[]
      tickets: Prisma.$TicketPayload<ExtArgs>[]
      ticketLists: Prisma.$TicketListPayload<ExtArgs>[]
      ticketAttachments: Prisma.$TicketAttachmentPayload<ExtArgs>[]
      ticketComments: Prisma.$TicketCommentPayload<ExtArgs>[]
      ticketLabels: Prisma.$TicketLabelPayload<ExtArgs>[]
      workspaceTicketLabels: Prisma.$WorkspaceTicketLabelPayload<ExtArgs>[]
      workspaceMemberInvites: Prisma.$WorkspaceMemberInvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces and returns the data updated in the database.
     * @param {WorkspaceUpdateManyAndReturnArgs} args - Arguments to update many Workspaces.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
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
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Workspace$membersArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tickets<T extends Workspace$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ticketLists<T extends Workspace$ticketListsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$ticketListsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ticketAttachments<T extends Workspace$ticketAttachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$ticketAttachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ticketComments<T extends Workspace$ticketCommentsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$ticketCommentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ticketLabels<T extends Workspace$ticketLabelsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$ticketLabelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workspaceTicketLabels<T extends Workspace$workspaceTicketLabelsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$workspaceTicketLabelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    workspaceMemberInvites<T extends Workspace$workspaceMemberInvitesArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$workspaceMemberInvitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Workspace model
   */
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly createdAt: FieldRef<"Workspace", 'DateTime'>
    readonly updatedAt: FieldRef<"Workspace", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace updateManyAndReturn
   */
  export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to delete.
     */
    limit?: number
  }

  /**
   * Workspace.members
   */
  export type Workspace$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    cursor?: WorkspaceMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * Workspace.tickets
   */
  export type Workspace$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Workspace.ticketLists
   */
  export type Workspace$ticketListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    where?: TicketListWhereInput
    orderBy?: TicketListOrderByWithRelationInput | TicketListOrderByWithRelationInput[]
    cursor?: TicketListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketListScalarFieldEnum | TicketListScalarFieldEnum[]
  }

  /**
   * Workspace.ticketAttachments
   */
  export type Workspace$ticketAttachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    where?: TicketAttachmentWhereInput
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    cursor?: TicketAttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketAttachmentScalarFieldEnum | TicketAttachmentScalarFieldEnum[]
  }

  /**
   * Workspace.ticketComments
   */
  export type Workspace$ticketCommentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    where?: TicketCommentWhereInput
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    cursor?: TicketCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketCommentScalarFieldEnum | TicketCommentScalarFieldEnum[]
  }

  /**
   * Workspace.ticketLabels
   */
  export type Workspace$ticketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    where?: TicketLabelWhereInput
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    cursor?: TicketLabelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * Workspace.workspaceTicketLabels
   */
  export type Workspace$workspaceTicketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    where?: WorkspaceTicketLabelWhereInput
    orderBy?: WorkspaceTicketLabelOrderByWithRelationInput | WorkspaceTicketLabelOrderByWithRelationInput[]
    cursor?: WorkspaceTicketLabelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceTicketLabelScalarFieldEnum | WorkspaceTicketLabelScalarFieldEnum[]
  }

  /**
   * Workspace.workspaceMemberInvites
   */
  export type Workspace$workspaceMemberInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    where?: WorkspaceMemberInviteWhereInput
    orderBy?: WorkspaceMemberInviteOrderByWithRelationInput | WorkspaceMemberInviteOrderByWithRelationInput[]
    cursor?: WorkspaceMemberInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceMemberInviteScalarFieldEnum | WorkspaceMemberInviteScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceMember
   */

  export type AggregateWorkspaceMember = {
    _count: WorkspaceMemberCountAggregateOutputType | null
    _min: WorkspaceMemberMinAggregateOutputType | null
    _max: WorkspaceMemberMaxAggregateOutputType | null
  }

  export type WorkspaceMemberMinAggregateOutputType = {
    id: string | null
    isWorkspaceOwner: boolean | null
    workspaceId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMemberMaxAggregateOutputType = {
    id: string | null
    isWorkspaceOwner: boolean | null
    workspaceId: string | null
    userId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMemberCountAggregateOutputType = {
    id: number
    isWorkspaceOwner: number
    workspaceId: number
    userId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMemberMinAggregateInputType = {
    id?: true
    isWorkspaceOwner?: true
    workspaceId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMemberMaxAggregateInputType = {
    id?: true
    isWorkspaceOwner?: true
    workspaceId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMemberCountAggregateInputType = {
    id?: true
    isWorkspaceOwner?: true
    workspaceId?: true
    userId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMember to aggregate.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceMembers
    **/
    _count?: true | WorkspaceMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMemberMaxAggregateInputType
  }

  export type GetWorkspaceMemberAggregateType<T extends WorkspaceMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceMember[P]>
      : GetScalarType<T[P], AggregateWorkspaceMember[P]>
  }




  export type WorkspaceMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberWhereInput
    orderBy?: WorkspaceMemberOrderByWithAggregationInput | WorkspaceMemberOrderByWithAggregationInput[]
    by: WorkspaceMemberScalarFieldEnum[] | WorkspaceMemberScalarFieldEnum
    having?: WorkspaceMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceMemberCountAggregateInputType | true
    _min?: WorkspaceMemberMinAggregateInputType
    _max?: WorkspaceMemberMaxAggregateInputType
  }

  export type WorkspaceMemberGroupByOutputType = {
    id: string
    isWorkspaceOwner: boolean
    workspaceId: string
    userId: string
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceMemberCountAggregateOutputType | null
    _min: WorkspaceMemberMinAggregateOutputType | null
    _max: WorkspaceMemberMaxAggregateOutputType | null
  }

  type GetWorkspaceMemberGroupByPayload<T extends WorkspaceMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceMemberGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isWorkspaceOwner?: boolean
    workspaceId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    assignedTickets?: boolean | WorkspaceMember$assignedTicketsArgs<ExtArgs>
    reportedTickets?: boolean | WorkspaceMember$reportedTicketsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | WorkspaceMemberCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMember"]>

  export type WorkspaceMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isWorkspaceOwner?: boolean
    workspaceId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMember"]>

  export type WorkspaceMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    isWorkspaceOwner?: boolean
    workspaceId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMember"]>

  export type WorkspaceMemberSelectScalar = {
    id?: boolean
    isWorkspaceOwner?: boolean
    workspaceId?: boolean
    userId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "isWorkspaceOwner" | "workspaceId" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["workspaceMember"]>
  export type WorkspaceMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    assignedTickets?: boolean | WorkspaceMember$assignedTicketsArgs<ExtArgs>
    reportedTickets?: boolean | WorkspaceMember$reportedTicketsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | WorkspaceMemberCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkspaceMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkspaceMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceMember"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      assignedTickets: Prisma.$TicketPayload<ExtArgs>[]
      reportedTickets: Prisma.$TicketPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      isWorkspaceOwner: boolean
      workspaceId: string
      userId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspaceMember"]>
    composites: {}
  }

  type WorkspaceMemberGetPayload<S extends boolean | null | undefined | WorkspaceMemberDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceMemberPayload, S>

  type WorkspaceMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceMemberCountAggregateInputType | true
    }

  export interface WorkspaceMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceMember'], meta: { name: 'WorkspaceMember' } }
    /**
     * Find zero or one WorkspaceMember that matches the filter.
     * @param {WorkspaceMemberFindUniqueArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceMemberFindUniqueArgs>(args: SelectSubset<T, WorkspaceMemberFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkspaceMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceMemberFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindFirstArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceMemberFindFirstArgs>(args?: SelectSubset<T, WorkspaceMemberFindFirstArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindFirstOrThrowArgs} args - Arguments to find a WorkspaceMember
     * @example
     * // Get one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkspaceMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceMembers
     * const workspaceMembers = await prisma.workspaceMember.findMany()
     * 
     * // Get first 10 WorkspaceMembers
     * const workspaceMembers = await prisma.workspaceMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceMemberWithIdOnly = await prisma.workspaceMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceMemberFindManyArgs>(args?: SelectSubset<T, WorkspaceMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkspaceMember.
     * @param {WorkspaceMemberCreateArgs} args - Arguments to create a WorkspaceMember.
     * @example
     * // Create one WorkspaceMember
     * const WorkspaceMember = await prisma.workspaceMember.create({
     *   data: {
     *     // ... data to create a WorkspaceMember
     *   }
     * })
     * 
     */
    create<T extends WorkspaceMemberCreateArgs>(args: SelectSubset<T, WorkspaceMemberCreateArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkspaceMembers.
     * @param {WorkspaceMemberCreateManyArgs} args - Arguments to create many WorkspaceMembers.
     * @example
     * // Create many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceMemberCreateManyArgs>(args?: SelectSubset<T, WorkspaceMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceMembers and returns the data saved in the database.
     * @param {WorkspaceMemberCreateManyAndReturnArgs} args - Arguments to create many WorkspaceMembers.
     * @example
     * // Create many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceMembers and only return the `id`
     * const workspaceMemberWithIdOnly = await prisma.workspaceMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkspaceMember.
     * @param {WorkspaceMemberDeleteArgs} args - Arguments to delete one WorkspaceMember.
     * @example
     * // Delete one WorkspaceMember
     * const WorkspaceMember = await prisma.workspaceMember.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceMember
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceMemberDeleteArgs>(args: SelectSubset<T, WorkspaceMemberDeleteArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkspaceMember.
     * @param {WorkspaceMemberUpdateArgs} args - Arguments to update one WorkspaceMember.
     * @example
     * // Update one WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceMemberUpdateArgs>(args: SelectSubset<T, WorkspaceMemberUpdateArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkspaceMembers.
     * @param {WorkspaceMemberDeleteManyArgs} args - Arguments to filter WorkspaceMembers to delete.
     * @example
     * // Delete a few WorkspaceMembers
     * const { count } = await prisma.workspaceMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceMemberDeleteManyArgs>(args?: SelectSubset<T, WorkspaceMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceMemberUpdateManyArgs>(args: SelectSubset<T, WorkspaceMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceMembers and returns the data updated in the database.
     * @param {WorkspaceMemberUpdateManyAndReturnArgs} args - Arguments to update many WorkspaceMembers.
     * @example
     * // Update many WorkspaceMembers
     * const workspaceMember = await prisma.workspaceMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkspaceMembers and only return the `id`
     * const workspaceMemberWithIdOnly = await prisma.workspaceMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkspaceMember.
     * @param {WorkspaceMemberUpsertArgs} args - Arguments to update or create a WorkspaceMember.
     * @example
     * // Update or create a WorkspaceMember
     * const workspaceMember = await prisma.workspaceMember.upsert({
     *   create: {
     *     // ... data to create a WorkspaceMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceMember we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceMemberUpsertArgs>(args: SelectSubset<T, WorkspaceMemberUpsertArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkspaceMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberCountArgs} args - Arguments to filter WorkspaceMembers to count.
     * @example
     * // Count the number of WorkspaceMembers
     * const count = await prisma.workspaceMember.count({
     *   where: {
     *     // ... the filter for the WorkspaceMembers we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceMemberCountArgs>(
      args?: Subset<T, WorkspaceMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WorkspaceMemberAggregateArgs>(args: Subset<T, WorkspaceMemberAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceMemberAggregateType<T>>

    /**
     * Group by WorkspaceMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberGroupByArgs} args - Group by arguments.
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
      T extends WorkspaceMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceMemberGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceMemberGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WorkspaceMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceMember model
   */
  readonly fields: WorkspaceMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignedTickets<T extends WorkspaceMember$assignedTicketsArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceMember$assignedTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reportedTickets<T extends WorkspaceMember$reportedTicketsArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceMember$reportedTicketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WorkspaceMember model
   */
  interface WorkspaceMemberFieldRefs {
    readonly id: FieldRef<"WorkspaceMember", 'String'>
    readonly isWorkspaceOwner: FieldRef<"WorkspaceMember", 'Boolean'>
    readonly workspaceId: FieldRef<"WorkspaceMember", 'String'>
    readonly userId: FieldRef<"WorkspaceMember", 'String'>
    readonly createdAt: FieldRef<"WorkspaceMember", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkspaceMember", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceMember findUnique
   */
  export type WorkspaceMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember findUniqueOrThrow
   */
  export type WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember findFirst
   */
  export type WorkspaceMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMembers.
     */
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember findFirstOrThrow
   */
  export type WorkspaceMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMember to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMembers.
     */
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember findMany
   */
  export type WorkspaceMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMembers to fetch.
     */
    where?: WorkspaceMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMembers to fetch.
     */
    orderBy?: WorkspaceMemberOrderByWithRelationInput | WorkspaceMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceMembers.
     */
    cursor?: WorkspaceMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMembers.
     */
    distinct?: WorkspaceMemberScalarFieldEnum | WorkspaceMemberScalarFieldEnum[]
  }

  /**
   * WorkspaceMember create
   */
  export type WorkspaceMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceMember.
     */
    data: XOR<WorkspaceMemberCreateInput, WorkspaceMemberUncheckedCreateInput>
  }

  /**
   * WorkspaceMember createMany
   */
  export type WorkspaceMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceMembers.
     */
    data: WorkspaceMemberCreateManyInput | WorkspaceMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkspaceMember createManyAndReturn
   */
  export type WorkspaceMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * The data used to create many WorkspaceMembers.
     */
    data: WorkspaceMemberCreateManyInput | WorkspaceMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceMember update
   */
  export type WorkspaceMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceMember.
     */
    data: XOR<WorkspaceMemberUpdateInput, WorkspaceMemberUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceMember to update.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember updateMany
   */
  export type WorkspaceMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceMembers.
     */
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceMembers to update
     */
    where?: WorkspaceMemberWhereInput
    /**
     * Limit how many WorkspaceMembers to update.
     */
    limit?: number
  }

  /**
   * WorkspaceMember updateManyAndReturn
   */
  export type WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * The data used to update WorkspaceMembers.
     */
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceMembers to update
     */
    where?: WorkspaceMemberWhereInput
    /**
     * Limit how many WorkspaceMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceMember upsert
   */
  export type WorkspaceMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceMember to update in case it exists.
     */
    where: WorkspaceMemberWhereUniqueInput
    /**
     * In case the WorkspaceMember found by the `where` argument doesn't exist, create a new WorkspaceMember with this data.
     */
    create: XOR<WorkspaceMemberCreateInput, WorkspaceMemberUncheckedCreateInput>
    /**
     * In case the WorkspaceMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceMemberUpdateInput, WorkspaceMemberUncheckedUpdateInput>
  }

  /**
   * WorkspaceMember delete
   */
  export type WorkspaceMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceMember to delete.
     */
    where: WorkspaceMemberWhereUniqueInput
  }

  /**
   * WorkspaceMember deleteMany
   */
  export type WorkspaceMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMembers to delete
     */
    where?: WorkspaceMemberWhereInput
    /**
     * Limit how many WorkspaceMembers to delete.
     */
    limit?: number
  }

  /**
   * WorkspaceMember.assignedTickets
   */
  export type WorkspaceMember$assignedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * WorkspaceMember.reportedTickets
   */
  export type WorkspaceMember$reportedTicketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * WorkspaceMember without action
   */
  export type WorkspaceMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceMemberInvite
   */

  export type AggregateWorkspaceMemberInvite = {
    _count: WorkspaceMemberInviteCountAggregateOutputType | null
    _min: WorkspaceMemberInviteMinAggregateOutputType | null
    _max: WorkspaceMemberInviteMaxAggregateOutputType | null
  }

  export type WorkspaceMemberInviteMinAggregateOutputType = {
    id: string | null
    email: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMemberInviteMaxAggregateOutputType = {
    id: string | null
    email: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMemberInviteCountAggregateOutputType = {
    id: number
    email: number
    workspaceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMemberInviteMinAggregateInputType = {
    id?: true
    email?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMemberInviteMaxAggregateInputType = {
    id?: true
    email?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMemberInviteCountAggregateInputType = {
    id?: true
    email?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceMemberInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMemberInvite to aggregate.
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMemberInvites to fetch.
     */
    orderBy?: WorkspaceMemberInviteOrderByWithRelationInput | WorkspaceMemberInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceMemberInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMemberInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMemberInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceMemberInvites
    **/
    _count?: true | WorkspaceMemberInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMemberInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMemberInviteMaxAggregateInputType
  }

  export type GetWorkspaceMemberInviteAggregateType<T extends WorkspaceMemberInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceMemberInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceMemberInvite[P]>
      : GetScalarType<T[P], AggregateWorkspaceMemberInvite[P]>
  }




  export type WorkspaceMemberInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceMemberInviteWhereInput
    orderBy?: WorkspaceMemberInviteOrderByWithAggregationInput | WorkspaceMemberInviteOrderByWithAggregationInput[]
    by: WorkspaceMemberInviteScalarFieldEnum[] | WorkspaceMemberInviteScalarFieldEnum
    having?: WorkspaceMemberInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceMemberInviteCountAggregateInputType | true
    _min?: WorkspaceMemberInviteMinAggregateInputType
    _max?: WorkspaceMemberInviteMaxAggregateInputType
  }

  export type WorkspaceMemberInviteGroupByOutputType = {
    id: string
    email: string
    workspaceId: string
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceMemberInviteCountAggregateOutputType | null
    _min: WorkspaceMemberInviteMinAggregateOutputType | null
    _max: WorkspaceMemberInviteMaxAggregateOutputType | null
  }

  type GetWorkspaceMemberInviteGroupByPayload<T extends WorkspaceMemberInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceMemberInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceMemberInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceMemberInviteGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceMemberInviteGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceMemberInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMemberInvite"]>

  export type WorkspaceMemberInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMemberInvite"]>

  export type WorkspaceMemberInviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceMemberInvite"]>

  export type WorkspaceMemberInviteSelectScalar = {
    id?: boolean
    email?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceMemberInviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "workspaceId" | "createdAt" | "updatedAt", ExtArgs["result"]["workspaceMemberInvite"]>
  export type WorkspaceMemberInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceMemberInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceMemberInviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $WorkspaceMemberInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceMemberInvite"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      workspaceId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspaceMemberInvite"]>
    composites: {}
  }

  type WorkspaceMemberInviteGetPayload<S extends boolean | null | undefined | WorkspaceMemberInviteDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceMemberInvitePayload, S>

  type WorkspaceMemberInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceMemberInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceMemberInviteCountAggregateInputType | true
    }

  export interface WorkspaceMemberInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceMemberInvite'], meta: { name: 'WorkspaceMemberInvite' } }
    /**
     * Find zero or one WorkspaceMemberInvite that matches the filter.
     * @param {WorkspaceMemberInviteFindUniqueArgs} args - Arguments to find a WorkspaceMemberInvite
     * @example
     * // Get one WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceMemberInviteFindUniqueArgs>(args: SelectSubset<T, WorkspaceMemberInviteFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkspaceMemberInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceMemberInviteFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceMemberInvite
     * @example
     * // Get one WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceMemberInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceMemberInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceMemberInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteFindFirstArgs} args - Arguments to find a WorkspaceMemberInvite
     * @example
     * // Get one WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceMemberInviteFindFirstArgs>(args?: SelectSubset<T, WorkspaceMemberInviteFindFirstArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceMemberInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteFindFirstOrThrowArgs} args - Arguments to find a WorkspaceMemberInvite
     * @example
     * // Get one WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceMemberInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceMemberInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkspaceMemberInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceMemberInvites
     * const workspaceMemberInvites = await prisma.workspaceMemberInvite.findMany()
     * 
     * // Get first 10 WorkspaceMemberInvites
     * const workspaceMemberInvites = await prisma.workspaceMemberInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceMemberInviteWithIdOnly = await prisma.workspaceMemberInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceMemberInviteFindManyArgs>(args?: SelectSubset<T, WorkspaceMemberInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkspaceMemberInvite.
     * @param {WorkspaceMemberInviteCreateArgs} args - Arguments to create a WorkspaceMemberInvite.
     * @example
     * // Create one WorkspaceMemberInvite
     * const WorkspaceMemberInvite = await prisma.workspaceMemberInvite.create({
     *   data: {
     *     // ... data to create a WorkspaceMemberInvite
     *   }
     * })
     * 
     */
    create<T extends WorkspaceMemberInviteCreateArgs>(args: SelectSubset<T, WorkspaceMemberInviteCreateArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkspaceMemberInvites.
     * @param {WorkspaceMemberInviteCreateManyArgs} args - Arguments to create many WorkspaceMemberInvites.
     * @example
     * // Create many WorkspaceMemberInvites
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceMemberInviteCreateManyArgs>(args?: SelectSubset<T, WorkspaceMemberInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceMemberInvites and returns the data saved in the database.
     * @param {WorkspaceMemberInviteCreateManyAndReturnArgs} args - Arguments to create many WorkspaceMemberInvites.
     * @example
     * // Create many WorkspaceMemberInvites
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceMemberInvites and only return the `id`
     * const workspaceMemberInviteWithIdOnly = await prisma.workspaceMemberInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceMemberInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceMemberInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkspaceMemberInvite.
     * @param {WorkspaceMemberInviteDeleteArgs} args - Arguments to delete one WorkspaceMemberInvite.
     * @example
     * // Delete one WorkspaceMemberInvite
     * const WorkspaceMemberInvite = await prisma.workspaceMemberInvite.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceMemberInvite
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceMemberInviteDeleteArgs>(args: SelectSubset<T, WorkspaceMemberInviteDeleteArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkspaceMemberInvite.
     * @param {WorkspaceMemberInviteUpdateArgs} args - Arguments to update one WorkspaceMemberInvite.
     * @example
     * // Update one WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceMemberInviteUpdateArgs>(args: SelectSubset<T, WorkspaceMemberInviteUpdateArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkspaceMemberInvites.
     * @param {WorkspaceMemberInviteDeleteManyArgs} args - Arguments to filter WorkspaceMemberInvites to delete.
     * @example
     * // Delete a few WorkspaceMemberInvites
     * const { count } = await prisma.workspaceMemberInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceMemberInviteDeleteManyArgs>(args?: SelectSubset<T, WorkspaceMemberInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceMemberInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceMemberInvites
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceMemberInviteUpdateManyArgs>(args: SelectSubset<T, WorkspaceMemberInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceMemberInvites and returns the data updated in the database.
     * @param {WorkspaceMemberInviteUpdateManyAndReturnArgs} args - Arguments to update many WorkspaceMemberInvites.
     * @example
     * // Update many WorkspaceMemberInvites
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkspaceMemberInvites and only return the `id`
     * const workspaceMemberInviteWithIdOnly = await prisma.workspaceMemberInvite.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceMemberInviteUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceMemberInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkspaceMemberInvite.
     * @param {WorkspaceMemberInviteUpsertArgs} args - Arguments to update or create a WorkspaceMemberInvite.
     * @example
     * // Update or create a WorkspaceMemberInvite
     * const workspaceMemberInvite = await prisma.workspaceMemberInvite.upsert({
     *   create: {
     *     // ... data to create a WorkspaceMemberInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceMemberInvite we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceMemberInviteUpsertArgs>(args: SelectSubset<T, WorkspaceMemberInviteUpsertArgs<ExtArgs>>): Prisma__WorkspaceMemberInviteClient<$Result.GetResult<Prisma.$WorkspaceMemberInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkspaceMemberInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteCountArgs} args - Arguments to filter WorkspaceMemberInvites to count.
     * @example
     * // Count the number of WorkspaceMemberInvites
     * const count = await prisma.workspaceMemberInvite.count({
     *   where: {
     *     // ... the filter for the WorkspaceMemberInvites we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceMemberInviteCountArgs>(
      args?: Subset<T, WorkspaceMemberInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceMemberInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceMemberInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WorkspaceMemberInviteAggregateArgs>(args: Subset<T, WorkspaceMemberInviteAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceMemberInviteAggregateType<T>>

    /**
     * Group by WorkspaceMemberInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceMemberInviteGroupByArgs} args - Group by arguments.
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
      T extends WorkspaceMemberInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceMemberInviteGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceMemberInviteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WorkspaceMemberInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceMemberInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceMemberInvite model
   */
  readonly fields: WorkspaceMemberInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceMemberInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceMemberInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the WorkspaceMemberInvite model
   */
  interface WorkspaceMemberInviteFieldRefs {
    readonly id: FieldRef<"WorkspaceMemberInvite", 'String'>
    readonly email: FieldRef<"WorkspaceMemberInvite", 'String'>
    readonly workspaceId: FieldRef<"WorkspaceMemberInvite", 'String'>
    readonly createdAt: FieldRef<"WorkspaceMemberInvite", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkspaceMemberInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceMemberInvite findUnique
   */
  export type WorkspaceMemberInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMemberInvite to fetch.
     */
    where: WorkspaceMemberInviteWhereUniqueInput
  }

  /**
   * WorkspaceMemberInvite findUniqueOrThrow
   */
  export type WorkspaceMemberInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMemberInvite to fetch.
     */
    where: WorkspaceMemberInviteWhereUniqueInput
  }

  /**
   * WorkspaceMemberInvite findFirst
   */
  export type WorkspaceMemberInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMemberInvite to fetch.
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMemberInvites to fetch.
     */
    orderBy?: WorkspaceMemberInviteOrderByWithRelationInput | WorkspaceMemberInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMemberInvites.
     */
    cursor?: WorkspaceMemberInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMemberInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMemberInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMemberInvites.
     */
    distinct?: WorkspaceMemberInviteScalarFieldEnum | WorkspaceMemberInviteScalarFieldEnum[]
  }

  /**
   * WorkspaceMemberInvite findFirstOrThrow
   */
  export type WorkspaceMemberInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMemberInvite to fetch.
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMemberInvites to fetch.
     */
    orderBy?: WorkspaceMemberInviteOrderByWithRelationInput | WorkspaceMemberInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceMemberInvites.
     */
    cursor?: WorkspaceMemberInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMemberInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMemberInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMemberInvites.
     */
    distinct?: WorkspaceMemberInviteScalarFieldEnum | WorkspaceMemberInviteScalarFieldEnum[]
  }

  /**
   * WorkspaceMemberInvite findMany
   */
  export type WorkspaceMemberInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceMemberInvites to fetch.
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceMemberInvites to fetch.
     */
    orderBy?: WorkspaceMemberInviteOrderByWithRelationInput | WorkspaceMemberInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceMemberInvites.
     */
    cursor?: WorkspaceMemberInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceMemberInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceMemberInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceMemberInvites.
     */
    distinct?: WorkspaceMemberInviteScalarFieldEnum | WorkspaceMemberInviteScalarFieldEnum[]
  }

  /**
   * WorkspaceMemberInvite create
   */
  export type WorkspaceMemberInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceMemberInvite.
     */
    data: XOR<WorkspaceMemberInviteCreateInput, WorkspaceMemberInviteUncheckedCreateInput>
  }

  /**
   * WorkspaceMemberInvite createMany
   */
  export type WorkspaceMemberInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceMemberInvites.
     */
    data: WorkspaceMemberInviteCreateManyInput | WorkspaceMemberInviteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkspaceMemberInvite createManyAndReturn
   */
  export type WorkspaceMemberInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * The data used to create many WorkspaceMemberInvites.
     */
    data: WorkspaceMemberInviteCreateManyInput | WorkspaceMemberInviteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceMemberInvite update
   */
  export type WorkspaceMemberInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceMemberInvite.
     */
    data: XOR<WorkspaceMemberInviteUpdateInput, WorkspaceMemberInviteUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceMemberInvite to update.
     */
    where: WorkspaceMemberInviteWhereUniqueInput
  }

  /**
   * WorkspaceMemberInvite updateMany
   */
  export type WorkspaceMemberInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceMemberInvites.
     */
    data: XOR<WorkspaceMemberInviteUpdateManyMutationInput, WorkspaceMemberInviteUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceMemberInvites to update
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * Limit how many WorkspaceMemberInvites to update.
     */
    limit?: number
  }

  /**
   * WorkspaceMemberInvite updateManyAndReturn
   */
  export type WorkspaceMemberInviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * The data used to update WorkspaceMemberInvites.
     */
    data: XOR<WorkspaceMemberInviteUpdateManyMutationInput, WorkspaceMemberInviteUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceMemberInvites to update
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * Limit how many WorkspaceMemberInvites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceMemberInvite upsert
   */
  export type WorkspaceMemberInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceMemberInvite to update in case it exists.
     */
    where: WorkspaceMemberInviteWhereUniqueInput
    /**
     * In case the WorkspaceMemberInvite found by the `where` argument doesn't exist, create a new WorkspaceMemberInvite with this data.
     */
    create: XOR<WorkspaceMemberInviteCreateInput, WorkspaceMemberInviteUncheckedCreateInput>
    /**
     * In case the WorkspaceMemberInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceMemberInviteUpdateInput, WorkspaceMemberInviteUncheckedUpdateInput>
  }

  /**
   * WorkspaceMemberInvite delete
   */
  export type WorkspaceMemberInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceMemberInvite to delete.
     */
    where: WorkspaceMemberInviteWhereUniqueInput
  }

  /**
   * WorkspaceMemberInvite deleteMany
   */
  export type WorkspaceMemberInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceMemberInvites to delete
     */
    where?: WorkspaceMemberInviteWhereInput
    /**
     * Limit how many WorkspaceMemberInvites to delete.
     */
    limit?: number
  }

  /**
   * WorkspaceMemberInvite without action
   */
  export type WorkspaceMemberInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMemberInvite
     */
    select?: WorkspaceMemberInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMemberInvite
     */
    omit?: WorkspaceMemberInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInviteInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceTicketLabel
   */

  export type AggregateWorkspaceTicketLabel = {
    _count: WorkspaceTicketLabelCountAggregateOutputType | null
    _min: WorkspaceTicketLabelMinAggregateOutputType | null
    _max: WorkspaceTicketLabelMaxAggregateOutputType | null
  }

  export type WorkspaceTicketLabelMinAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceTicketLabelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceTicketLabelCountAggregateOutputType = {
    id: number
    name: number
    workspaceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceTicketLabelMinAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceTicketLabelMaxAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceTicketLabelCountAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceTicketLabelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceTicketLabel to aggregate.
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceTicketLabels to fetch.
     */
    orderBy?: WorkspaceTicketLabelOrderByWithRelationInput | WorkspaceTicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceTicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceTicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceTicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceTicketLabels
    **/
    _count?: true | WorkspaceTicketLabelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceTicketLabelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceTicketLabelMaxAggregateInputType
  }

  export type GetWorkspaceTicketLabelAggregateType<T extends WorkspaceTicketLabelAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceTicketLabel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceTicketLabel[P]>
      : GetScalarType<T[P], AggregateWorkspaceTicketLabel[P]>
  }




  export type WorkspaceTicketLabelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceTicketLabelWhereInput
    orderBy?: WorkspaceTicketLabelOrderByWithAggregationInput | WorkspaceTicketLabelOrderByWithAggregationInput[]
    by: WorkspaceTicketLabelScalarFieldEnum[] | WorkspaceTicketLabelScalarFieldEnum
    having?: WorkspaceTicketLabelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceTicketLabelCountAggregateInputType | true
    _min?: WorkspaceTicketLabelMinAggregateInputType
    _max?: WorkspaceTicketLabelMaxAggregateInputType
  }

  export type WorkspaceTicketLabelGroupByOutputType = {
    id: string
    name: string
    workspaceId: string
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceTicketLabelCountAggregateOutputType | null
    _min: WorkspaceTicketLabelMinAggregateOutputType | null
    _max: WorkspaceTicketLabelMaxAggregateOutputType | null
  }

  type GetWorkspaceTicketLabelGroupByPayload<T extends WorkspaceTicketLabelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceTicketLabelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceTicketLabelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceTicketLabelGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceTicketLabelGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceTicketLabelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketLabels?: boolean | WorkspaceTicketLabel$ticketLabelsArgs<ExtArgs>
    _count?: boolean | WorkspaceTicketLabelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceTicketLabel"]>

  export type WorkspaceTicketLabelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceTicketLabel"]>

  export type WorkspaceTicketLabelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceTicketLabel"]>

  export type WorkspaceTicketLabelSelectScalar = {
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceTicketLabelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "workspaceId" | "createdAt" | "updatedAt", ExtArgs["result"]["workspaceTicketLabel"]>
  export type WorkspaceTicketLabelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketLabels?: boolean | WorkspaceTicketLabel$ticketLabelsArgs<ExtArgs>
    _count?: boolean | WorkspaceTicketLabelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceTicketLabelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceTicketLabelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $WorkspaceTicketLabelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceTicketLabel"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      ticketLabels: Prisma.$TicketLabelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      workspaceId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspaceTicketLabel"]>
    composites: {}
  }

  type WorkspaceTicketLabelGetPayload<S extends boolean | null | undefined | WorkspaceTicketLabelDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceTicketLabelPayload, S>

  type WorkspaceTicketLabelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceTicketLabelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceTicketLabelCountAggregateInputType | true
    }

  export interface WorkspaceTicketLabelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceTicketLabel'], meta: { name: 'WorkspaceTicketLabel' } }
    /**
     * Find zero or one WorkspaceTicketLabel that matches the filter.
     * @param {WorkspaceTicketLabelFindUniqueArgs} args - Arguments to find a WorkspaceTicketLabel
     * @example
     * // Get one WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceTicketLabelFindUniqueArgs>(args: SelectSubset<T, WorkspaceTicketLabelFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkspaceTicketLabel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceTicketLabelFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceTicketLabel
     * @example
     * // Get one WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceTicketLabelFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceTicketLabelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceTicketLabel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelFindFirstArgs} args - Arguments to find a WorkspaceTicketLabel
     * @example
     * // Get one WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceTicketLabelFindFirstArgs>(args?: SelectSubset<T, WorkspaceTicketLabelFindFirstArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceTicketLabel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelFindFirstOrThrowArgs} args - Arguments to find a WorkspaceTicketLabel
     * @example
     * // Get one WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceTicketLabelFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceTicketLabelFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkspaceTicketLabels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceTicketLabels
     * const workspaceTicketLabels = await prisma.workspaceTicketLabel.findMany()
     * 
     * // Get first 10 WorkspaceTicketLabels
     * const workspaceTicketLabels = await prisma.workspaceTicketLabel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceTicketLabelWithIdOnly = await prisma.workspaceTicketLabel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceTicketLabelFindManyArgs>(args?: SelectSubset<T, WorkspaceTicketLabelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkspaceTicketLabel.
     * @param {WorkspaceTicketLabelCreateArgs} args - Arguments to create a WorkspaceTicketLabel.
     * @example
     * // Create one WorkspaceTicketLabel
     * const WorkspaceTicketLabel = await prisma.workspaceTicketLabel.create({
     *   data: {
     *     // ... data to create a WorkspaceTicketLabel
     *   }
     * })
     * 
     */
    create<T extends WorkspaceTicketLabelCreateArgs>(args: SelectSubset<T, WorkspaceTicketLabelCreateArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkspaceTicketLabels.
     * @param {WorkspaceTicketLabelCreateManyArgs} args - Arguments to create many WorkspaceTicketLabels.
     * @example
     * // Create many WorkspaceTicketLabels
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceTicketLabelCreateManyArgs>(args?: SelectSubset<T, WorkspaceTicketLabelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceTicketLabels and returns the data saved in the database.
     * @param {WorkspaceTicketLabelCreateManyAndReturnArgs} args - Arguments to create many WorkspaceTicketLabels.
     * @example
     * // Create many WorkspaceTicketLabels
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceTicketLabels and only return the `id`
     * const workspaceTicketLabelWithIdOnly = await prisma.workspaceTicketLabel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceTicketLabelCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceTicketLabelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkspaceTicketLabel.
     * @param {WorkspaceTicketLabelDeleteArgs} args - Arguments to delete one WorkspaceTicketLabel.
     * @example
     * // Delete one WorkspaceTicketLabel
     * const WorkspaceTicketLabel = await prisma.workspaceTicketLabel.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceTicketLabel
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceTicketLabelDeleteArgs>(args: SelectSubset<T, WorkspaceTicketLabelDeleteArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkspaceTicketLabel.
     * @param {WorkspaceTicketLabelUpdateArgs} args - Arguments to update one WorkspaceTicketLabel.
     * @example
     * // Update one WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceTicketLabelUpdateArgs>(args: SelectSubset<T, WorkspaceTicketLabelUpdateArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkspaceTicketLabels.
     * @param {WorkspaceTicketLabelDeleteManyArgs} args - Arguments to filter WorkspaceTicketLabels to delete.
     * @example
     * // Delete a few WorkspaceTicketLabels
     * const { count } = await prisma.workspaceTicketLabel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceTicketLabelDeleteManyArgs>(args?: SelectSubset<T, WorkspaceTicketLabelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceTicketLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceTicketLabels
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceTicketLabelUpdateManyArgs>(args: SelectSubset<T, WorkspaceTicketLabelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceTicketLabels and returns the data updated in the database.
     * @param {WorkspaceTicketLabelUpdateManyAndReturnArgs} args - Arguments to update many WorkspaceTicketLabels.
     * @example
     * // Update many WorkspaceTicketLabels
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkspaceTicketLabels and only return the `id`
     * const workspaceTicketLabelWithIdOnly = await prisma.workspaceTicketLabel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceTicketLabelUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceTicketLabelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkspaceTicketLabel.
     * @param {WorkspaceTicketLabelUpsertArgs} args - Arguments to update or create a WorkspaceTicketLabel.
     * @example
     * // Update or create a WorkspaceTicketLabel
     * const workspaceTicketLabel = await prisma.workspaceTicketLabel.upsert({
     *   create: {
     *     // ... data to create a WorkspaceTicketLabel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceTicketLabel we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceTicketLabelUpsertArgs>(args: SelectSubset<T, WorkspaceTicketLabelUpsertArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkspaceTicketLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelCountArgs} args - Arguments to filter WorkspaceTicketLabels to count.
     * @example
     * // Count the number of WorkspaceTicketLabels
     * const count = await prisma.workspaceTicketLabel.count({
     *   where: {
     *     // ... the filter for the WorkspaceTicketLabels we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceTicketLabelCountArgs>(
      args?: Subset<T, WorkspaceTicketLabelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceTicketLabelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceTicketLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WorkspaceTicketLabelAggregateArgs>(args: Subset<T, WorkspaceTicketLabelAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceTicketLabelAggregateType<T>>

    /**
     * Group by WorkspaceTicketLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceTicketLabelGroupByArgs} args - Group by arguments.
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
      T extends WorkspaceTicketLabelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceTicketLabelGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceTicketLabelGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WorkspaceTicketLabelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceTicketLabelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceTicketLabel model
   */
  readonly fields: WorkspaceTicketLabelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceTicketLabel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceTicketLabelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ticketLabels<T extends WorkspaceTicketLabel$ticketLabelsArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceTicketLabel$ticketLabelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the WorkspaceTicketLabel model
   */
  interface WorkspaceTicketLabelFieldRefs {
    readonly id: FieldRef<"WorkspaceTicketLabel", 'String'>
    readonly name: FieldRef<"WorkspaceTicketLabel", 'String'>
    readonly workspaceId: FieldRef<"WorkspaceTicketLabel", 'String'>
    readonly createdAt: FieldRef<"WorkspaceTicketLabel", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkspaceTicketLabel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceTicketLabel findUnique
   */
  export type WorkspaceTicketLabelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceTicketLabel to fetch.
     */
    where: WorkspaceTicketLabelWhereUniqueInput
  }

  /**
   * WorkspaceTicketLabel findUniqueOrThrow
   */
  export type WorkspaceTicketLabelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceTicketLabel to fetch.
     */
    where: WorkspaceTicketLabelWhereUniqueInput
  }

  /**
   * WorkspaceTicketLabel findFirst
   */
  export type WorkspaceTicketLabelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceTicketLabel to fetch.
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceTicketLabels to fetch.
     */
    orderBy?: WorkspaceTicketLabelOrderByWithRelationInput | WorkspaceTicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceTicketLabels.
     */
    cursor?: WorkspaceTicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceTicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceTicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceTicketLabels.
     */
    distinct?: WorkspaceTicketLabelScalarFieldEnum | WorkspaceTicketLabelScalarFieldEnum[]
  }

  /**
   * WorkspaceTicketLabel findFirstOrThrow
   */
  export type WorkspaceTicketLabelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceTicketLabel to fetch.
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceTicketLabels to fetch.
     */
    orderBy?: WorkspaceTicketLabelOrderByWithRelationInput | WorkspaceTicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceTicketLabels.
     */
    cursor?: WorkspaceTicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceTicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceTicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceTicketLabels.
     */
    distinct?: WorkspaceTicketLabelScalarFieldEnum | WorkspaceTicketLabelScalarFieldEnum[]
  }

  /**
   * WorkspaceTicketLabel findMany
   */
  export type WorkspaceTicketLabelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceTicketLabels to fetch.
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceTicketLabels to fetch.
     */
    orderBy?: WorkspaceTicketLabelOrderByWithRelationInput | WorkspaceTicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceTicketLabels.
     */
    cursor?: WorkspaceTicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceTicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceTicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceTicketLabels.
     */
    distinct?: WorkspaceTicketLabelScalarFieldEnum | WorkspaceTicketLabelScalarFieldEnum[]
  }

  /**
   * WorkspaceTicketLabel create
   */
  export type WorkspaceTicketLabelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceTicketLabel.
     */
    data: XOR<WorkspaceTicketLabelCreateInput, WorkspaceTicketLabelUncheckedCreateInput>
  }

  /**
   * WorkspaceTicketLabel createMany
   */
  export type WorkspaceTicketLabelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceTicketLabels.
     */
    data: WorkspaceTicketLabelCreateManyInput | WorkspaceTicketLabelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkspaceTicketLabel createManyAndReturn
   */
  export type WorkspaceTicketLabelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * The data used to create many WorkspaceTicketLabels.
     */
    data: WorkspaceTicketLabelCreateManyInput | WorkspaceTicketLabelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceTicketLabel update
   */
  export type WorkspaceTicketLabelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceTicketLabel.
     */
    data: XOR<WorkspaceTicketLabelUpdateInput, WorkspaceTicketLabelUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceTicketLabel to update.
     */
    where: WorkspaceTicketLabelWhereUniqueInput
  }

  /**
   * WorkspaceTicketLabel updateMany
   */
  export type WorkspaceTicketLabelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceTicketLabels.
     */
    data: XOR<WorkspaceTicketLabelUpdateManyMutationInput, WorkspaceTicketLabelUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceTicketLabels to update
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * Limit how many WorkspaceTicketLabels to update.
     */
    limit?: number
  }

  /**
   * WorkspaceTicketLabel updateManyAndReturn
   */
  export type WorkspaceTicketLabelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * The data used to update WorkspaceTicketLabels.
     */
    data: XOR<WorkspaceTicketLabelUpdateManyMutationInput, WorkspaceTicketLabelUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceTicketLabels to update
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * Limit how many WorkspaceTicketLabels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceTicketLabel upsert
   */
  export type WorkspaceTicketLabelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceTicketLabel to update in case it exists.
     */
    where: WorkspaceTicketLabelWhereUniqueInput
    /**
     * In case the WorkspaceTicketLabel found by the `where` argument doesn't exist, create a new WorkspaceTicketLabel with this data.
     */
    create: XOR<WorkspaceTicketLabelCreateInput, WorkspaceTicketLabelUncheckedCreateInput>
    /**
     * In case the WorkspaceTicketLabel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceTicketLabelUpdateInput, WorkspaceTicketLabelUncheckedUpdateInput>
  }

  /**
   * WorkspaceTicketLabel delete
   */
  export type WorkspaceTicketLabelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceTicketLabel to delete.
     */
    where: WorkspaceTicketLabelWhereUniqueInput
  }

  /**
   * WorkspaceTicketLabel deleteMany
   */
  export type WorkspaceTicketLabelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceTicketLabels to delete
     */
    where?: WorkspaceTicketLabelWhereInput
    /**
     * Limit how many WorkspaceTicketLabels to delete.
     */
    limit?: number
  }

  /**
   * WorkspaceTicketLabel.ticketLabels
   */
  export type WorkspaceTicketLabel$ticketLabelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    where?: TicketLabelWhereInput
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    cursor?: TicketLabelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * WorkspaceTicketLabel without action
   */
  export type WorkspaceTicketLabelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceTicketLabel
     */
    select?: WorkspaceTicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceTicketLabel
     */
    omit?: WorkspaceTicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceTicketLabelInclude<ExtArgs> | null
  }


  /**
   * Model TicketList
   */

  export type AggregateTicketList = {
    _count: TicketListCountAggregateOutputType | null
    _min: TicketListMinAggregateOutputType | null
    _max: TicketListMaxAggregateOutputType | null
  }

  export type TicketListMinAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketListMaxAggregateOutputType = {
    id: string | null
    name: string | null
    workspaceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketListCountAggregateOutputType = {
    id: number
    name: number
    workspaceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketListMinAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketListMaxAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketListCountAggregateInputType = {
    id?: true
    name?: true
    workspaceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketList to aggregate.
     */
    where?: TicketListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLists to fetch.
     */
    orderBy?: TicketListOrderByWithRelationInput | TicketListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketLists
    **/
    _count?: true | TicketListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketListMaxAggregateInputType
  }

  export type GetTicketListAggregateType<T extends TicketListAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketList[P]>
      : GetScalarType<T[P], AggregateTicketList[P]>
  }




  export type TicketListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketListWhereInput
    orderBy?: TicketListOrderByWithAggregationInput | TicketListOrderByWithAggregationInput[]
    by: TicketListScalarFieldEnum[] | TicketListScalarFieldEnum
    having?: TicketListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketListCountAggregateInputType | true
    _min?: TicketListMinAggregateInputType
    _max?: TicketListMaxAggregateInputType
  }

  export type TicketListGroupByOutputType = {
    id: string
    name: string
    workspaceId: string
    createdAt: Date
    updatedAt: Date
    _count: TicketListCountAggregateOutputType | null
    _min: TicketListMinAggregateOutputType | null
    _max: TicketListMaxAggregateOutputType | null
  }

  type GetTicketListGroupByPayload<T extends TicketListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketListGroupByOutputType[P]>
            : GetScalarType<T[P], TicketListGroupByOutputType[P]>
        }
      >
    >


  export type TicketListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    tickets?: boolean | TicketList$ticketsArgs<ExtArgs>
    _count?: boolean | TicketListCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketList"]>

  export type TicketListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketList"]>

  export type TicketListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketList"]>

  export type TicketListSelectScalar = {
    id?: boolean
    name?: boolean
    workspaceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "workspaceId" | "createdAt" | "updatedAt", ExtArgs["result"]["ticketList"]>
  export type TicketListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    tickets?: boolean | TicketList$ticketsArgs<ExtArgs>
    _count?: boolean | TicketListCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TicketListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type TicketListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $TicketListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketList"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      tickets: Prisma.$TicketPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      workspaceId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticketList"]>
    composites: {}
  }

  type TicketListGetPayload<S extends boolean | null | undefined | TicketListDefaultArgs> = $Result.GetResult<Prisma.$TicketListPayload, S>

  type TicketListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketListCountAggregateInputType | true
    }

  export interface TicketListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketList'], meta: { name: 'TicketList' } }
    /**
     * Find zero or one TicketList that matches the filter.
     * @param {TicketListFindUniqueArgs} args - Arguments to find a TicketList
     * @example
     * // Get one TicketList
     * const ticketList = await prisma.ticketList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketListFindUniqueArgs>(args: SelectSubset<T, TicketListFindUniqueArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketListFindUniqueOrThrowArgs} args - Arguments to find a TicketList
     * @example
     * // Get one TicketList
     * const ticketList = await prisma.ticketList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketListFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListFindFirstArgs} args - Arguments to find a TicketList
     * @example
     * // Get one TicketList
     * const ticketList = await prisma.ticketList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketListFindFirstArgs>(args?: SelectSubset<T, TicketListFindFirstArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListFindFirstOrThrowArgs} args - Arguments to find a TicketList
     * @example
     * // Get one TicketList
     * const ticketList = await prisma.ticketList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketListFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketListFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketLists
     * const ticketLists = await prisma.ticketList.findMany()
     * 
     * // Get first 10 TicketLists
     * const ticketLists = await prisma.ticketList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketListWithIdOnly = await prisma.ticketList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketListFindManyArgs>(args?: SelectSubset<T, TicketListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketList.
     * @param {TicketListCreateArgs} args - Arguments to create a TicketList.
     * @example
     * // Create one TicketList
     * const TicketList = await prisma.ticketList.create({
     *   data: {
     *     // ... data to create a TicketList
     *   }
     * })
     * 
     */
    create<T extends TicketListCreateArgs>(args: SelectSubset<T, TicketListCreateArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketLists.
     * @param {TicketListCreateManyArgs} args - Arguments to create many TicketLists.
     * @example
     * // Create many TicketLists
     * const ticketList = await prisma.ticketList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketListCreateManyArgs>(args?: SelectSubset<T, TicketListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketLists and returns the data saved in the database.
     * @param {TicketListCreateManyAndReturnArgs} args - Arguments to create many TicketLists.
     * @example
     * // Create many TicketLists
     * const ticketList = await prisma.ticketList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketLists and only return the `id`
     * const ticketListWithIdOnly = await prisma.ticketList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketListCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketList.
     * @param {TicketListDeleteArgs} args - Arguments to delete one TicketList.
     * @example
     * // Delete one TicketList
     * const TicketList = await prisma.ticketList.delete({
     *   where: {
     *     // ... filter to delete one TicketList
     *   }
     * })
     * 
     */
    delete<T extends TicketListDeleteArgs>(args: SelectSubset<T, TicketListDeleteArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketList.
     * @param {TicketListUpdateArgs} args - Arguments to update one TicketList.
     * @example
     * // Update one TicketList
     * const ticketList = await prisma.ticketList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketListUpdateArgs>(args: SelectSubset<T, TicketListUpdateArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketLists.
     * @param {TicketListDeleteManyArgs} args - Arguments to filter TicketLists to delete.
     * @example
     * // Delete a few TicketLists
     * const { count } = await prisma.ticketList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketListDeleteManyArgs>(args?: SelectSubset<T, TicketListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketLists
     * const ticketList = await prisma.ticketList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketListUpdateManyArgs>(args: SelectSubset<T, TicketListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketLists and returns the data updated in the database.
     * @param {TicketListUpdateManyAndReturnArgs} args - Arguments to update many TicketLists.
     * @example
     * // Update many TicketLists
     * const ticketList = await prisma.ticketList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketLists and only return the `id`
     * const ticketListWithIdOnly = await prisma.ticketList.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketListUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketList.
     * @param {TicketListUpsertArgs} args - Arguments to update or create a TicketList.
     * @example
     * // Update or create a TicketList
     * const ticketList = await prisma.ticketList.upsert({
     *   create: {
     *     // ... data to create a TicketList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketList we want to update
     *   }
     * })
     */
    upsert<T extends TicketListUpsertArgs>(args: SelectSubset<T, TicketListUpsertArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListCountArgs} args - Arguments to filter TicketLists to count.
     * @example
     * // Count the number of TicketLists
     * const count = await prisma.ticketList.count({
     *   where: {
     *     // ... the filter for the TicketLists we want to count
     *   }
     * })
    **/
    count<T extends TicketListCountArgs>(
      args?: Subset<T, TicketListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketListAggregateArgs>(args: Subset<T, TicketListAggregateArgs>): Prisma.PrismaPromise<GetTicketListAggregateType<T>>

    /**
     * Group by TicketList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketListGroupByArgs} args - Group by arguments.
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
      T extends TicketListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketListGroupByArgs['orderBy'] }
        : { orderBy?: TicketListGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketList model
   */
  readonly fields: TicketListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tickets<T extends TicketList$ticketsArgs<ExtArgs> = {}>(args?: Subset<T, TicketList$ticketsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the TicketList model
   */
  interface TicketListFieldRefs {
    readonly id: FieldRef<"TicketList", 'String'>
    readonly name: FieldRef<"TicketList", 'String'>
    readonly workspaceId: FieldRef<"TicketList", 'String'>
    readonly createdAt: FieldRef<"TicketList", 'DateTime'>
    readonly updatedAt: FieldRef<"TicketList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketList findUnique
   */
  export type TicketListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter, which TicketList to fetch.
     */
    where: TicketListWhereUniqueInput
  }

  /**
   * TicketList findUniqueOrThrow
   */
  export type TicketListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter, which TicketList to fetch.
     */
    where: TicketListWhereUniqueInput
  }

  /**
   * TicketList findFirst
   */
  export type TicketListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter, which TicketList to fetch.
     */
    where?: TicketListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLists to fetch.
     */
    orderBy?: TicketListOrderByWithRelationInput | TicketListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketLists.
     */
    cursor?: TicketListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLists.
     */
    distinct?: TicketListScalarFieldEnum | TicketListScalarFieldEnum[]
  }

  /**
   * TicketList findFirstOrThrow
   */
  export type TicketListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter, which TicketList to fetch.
     */
    where?: TicketListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLists to fetch.
     */
    orderBy?: TicketListOrderByWithRelationInput | TicketListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketLists.
     */
    cursor?: TicketListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLists.
     */
    distinct?: TicketListScalarFieldEnum | TicketListScalarFieldEnum[]
  }

  /**
   * TicketList findMany
   */
  export type TicketListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter, which TicketLists to fetch.
     */
    where?: TicketListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLists to fetch.
     */
    orderBy?: TicketListOrderByWithRelationInput | TicketListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketLists.
     */
    cursor?: TicketListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLists.
     */
    distinct?: TicketListScalarFieldEnum | TicketListScalarFieldEnum[]
  }

  /**
   * TicketList create
   */
  export type TicketListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketList.
     */
    data: XOR<TicketListCreateInput, TicketListUncheckedCreateInput>
  }

  /**
   * TicketList createMany
   */
  export type TicketListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketLists.
     */
    data: TicketListCreateManyInput | TicketListCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketList createManyAndReturn
   */
  export type TicketListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * The data used to create many TicketLists.
     */
    data: TicketListCreateManyInput | TicketListCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketList update
   */
  export type TicketListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketList.
     */
    data: XOR<TicketListUpdateInput, TicketListUncheckedUpdateInput>
    /**
     * Choose, which TicketList to update.
     */
    where: TicketListWhereUniqueInput
  }

  /**
   * TicketList updateMany
   */
  export type TicketListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketLists.
     */
    data: XOR<TicketListUpdateManyMutationInput, TicketListUncheckedUpdateManyInput>
    /**
     * Filter which TicketLists to update
     */
    where?: TicketListWhereInput
    /**
     * Limit how many TicketLists to update.
     */
    limit?: number
  }

  /**
   * TicketList updateManyAndReturn
   */
  export type TicketListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * The data used to update TicketLists.
     */
    data: XOR<TicketListUpdateManyMutationInput, TicketListUncheckedUpdateManyInput>
    /**
     * Filter which TicketLists to update
     */
    where?: TicketListWhereInput
    /**
     * Limit how many TicketLists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketList upsert
   */
  export type TicketListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketList to update in case it exists.
     */
    where: TicketListWhereUniqueInput
    /**
     * In case the TicketList found by the `where` argument doesn't exist, create a new TicketList with this data.
     */
    create: XOR<TicketListCreateInput, TicketListUncheckedCreateInput>
    /**
     * In case the TicketList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketListUpdateInput, TicketListUncheckedUpdateInput>
  }

  /**
   * TicketList delete
   */
  export type TicketListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
    /**
     * Filter which TicketList to delete.
     */
    where: TicketListWhereUniqueInput
  }

  /**
   * TicketList deleteMany
   */
  export type TicketListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketLists to delete
     */
    where?: TicketListWhereInput
    /**
     * Limit how many TicketLists to delete.
     */
    limit?: number
  }

  /**
   * TicketList.tickets
   */
  export type TicketList$ticketsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * TicketList without action
   */
  export type TicketListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketList
     */
    select?: TicketListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketList
     */
    omit?: TicketListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketListInclude<ExtArgs> | null
  }


  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    workspaceId: string | null
    ticketListId: string | null
    assigneeId: string | null
    reporterId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    workspaceId: string | null
    ticketListId: string | null
    assigneeId: string | null
    reporterId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketCountAggregateOutputType = {
    id: number
    title: number
    description: number
    workspaceId: number
    ticketListId: number
    assigneeId: number
    reporterId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    workspaceId?: true
    ticketListId?: true
    assigneeId?: true
    reporterId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    workspaceId?: true
    ticketListId?: true
    assigneeId?: true
    reporterId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    workspaceId?: true
    ticketListId?: true
    assigneeId?: true
    reporterId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketWhereInput
    orderBy?: TicketOrderByWithAggregationInput | TicketOrderByWithAggregationInput[]
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }

  export type TicketGroupByOutputType = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId: string | null
    reporterId: string
    createdAt: Date
    updatedAt: Date
    _count: TicketCountAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    workspaceId?: boolean
    ticketListId?: boolean
    assigneeId?: boolean
    reporterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
    attachments?: boolean | Ticket$attachmentsArgs<ExtArgs>
    comments?: boolean | Ticket$commentsArgs<ExtArgs>
    labels?: boolean | Ticket$labelsArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    workspaceId?: boolean
    ticketListId?: boolean
    assigneeId?: boolean
    reporterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    workspaceId?: boolean
    ticketListId?: boolean
    assigneeId?: boolean
    reporterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticket"]>

  export type TicketSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    workspaceId?: boolean
    ticketListId?: boolean
    assigneeId?: boolean
    reporterId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "workspaceId" | "ticketListId" | "assigneeId" | "reporterId" | "createdAt" | "updatedAt", ExtArgs["result"]["ticket"]>
  export type TicketInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
    attachments?: boolean | Ticket$attachmentsArgs<ExtArgs>
    comments?: boolean | Ticket$commentsArgs<ExtArgs>
    labels?: boolean | Ticket$labelsArgs<ExtArgs>
    _count?: boolean | TicketCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TicketIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
  }
  export type TicketIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    ticketList?: boolean | TicketListDefaultArgs<ExtArgs>
    assignee?: boolean | Ticket$assigneeArgs<ExtArgs>
    reporter?: boolean | WorkspaceMemberDefaultArgs<ExtArgs>
  }

  export type $TicketPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Ticket"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      ticketList: Prisma.$TicketListPayload<ExtArgs>
      assignee: Prisma.$WorkspaceMemberPayload<ExtArgs> | null
      reporter: Prisma.$WorkspaceMemberPayload<ExtArgs>
      attachments: Prisma.$TicketAttachmentPayload<ExtArgs>[]
      comments: Prisma.$TicketCommentPayload<ExtArgs>[]
      labels: Prisma.$TicketLabelPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      workspaceId: string
      ticketListId: string
      assigneeId: string | null
      reporterId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticket"]>
    composites: {}
  }

  type TicketGetPayload<S extends boolean | null | undefined | TicketDefaultArgs> = $Result.GetResult<Prisma.$TicketPayload, S>

  type TicketCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Ticket'], meta: { name: 'Ticket' } }
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketFindManyArgs>(args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
     */
    create<T extends TicketCreateArgs>(args: SelectSubset<T, TicketCreateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCreateManyArgs>(args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
     */
    delete<T extends TicketDeleteArgs>(args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketUpdateArgs>(args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketDeleteManyArgs>(args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketUpdateManyArgs>(args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets and returns the data updated in the database.
     * @param {TicketUpdateManyAndReturnArgs} args - Arguments to update many Tickets.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): Prisma.PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
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
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Ticket model
   */
  readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    ticketList<T extends TicketListDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketListDefaultArgs<ExtArgs>>): Prisma__TicketListClient<$Result.GetResult<Prisma.$TicketListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assignee<T extends Ticket$assigneeArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$assigneeArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reporter<T extends WorkspaceMemberDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceMemberDefaultArgs<ExtArgs>>): Prisma__WorkspaceMemberClient<$Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    attachments<T extends Ticket$attachmentsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$attachmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    comments<T extends Ticket$commentsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    labels<T extends Ticket$labelsArgs<ExtArgs> = {}>(args?: Subset<T, Ticket$labelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<"Ticket", 'String'>
    readonly title: FieldRef<"Ticket", 'String'>
    readonly description: FieldRef<"Ticket", 'String'>
    readonly workspaceId: FieldRef<"Ticket", 'String'>
    readonly ticketListId: FieldRef<"Ticket", 'String'>
    readonly assigneeId: FieldRef<"Ticket", 'String'>
    readonly reporterId: FieldRef<"Ticket", 'String'>
    readonly createdAt: FieldRef<"Ticket", 'DateTime'>
    readonly updatedAt: FieldRef<"Ticket", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[]
  }

  /**
   * Ticket create
   */
  export type TicketCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
  }

  /**
   * Ticket updateManyAndReturn
   */
  export type TicketUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number
  }

  /**
   * Ticket.assignee
   */
  export type Ticket$assigneeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceMember
     */
    select?: WorkspaceMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceMember
     */
    omit?: WorkspaceMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceMemberInclude<ExtArgs> | null
    where?: WorkspaceMemberWhereInput
  }

  /**
   * Ticket.attachments
   */
  export type Ticket$attachmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    where?: TicketAttachmentWhereInput
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    cursor?: TicketAttachmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketAttachmentScalarFieldEnum | TicketAttachmentScalarFieldEnum[]
  }

  /**
   * Ticket.comments
   */
  export type Ticket$commentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    where?: TicketCommentWhereInput
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    cursor?: TicketCommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketCommentScalarFieldEnum | TicketCommentScalarFieldEnum[]
  }

  /**
   * Ticket.labels
   */
  export type Ticket$labelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    where?: TicketLabelWhereInput
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    cursor?: TicketLabelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null
  }


  /**
   * Model TicketAttachment
   */

  export type AggregateTicketAttachment = {
    _count: TicketAttachmentCountAggregateOutputType | null
    _avg: TicketAttachmentAvgAggregateOutputType | null
    _sum: TicketAttachmentSumAggregateOutputType | null
    _min: TicketAttachmentMinAggregateOutputType | null
    _max: TicketAttachmentMaxAggregateOutputType | null
  }

  export type TicketAttachmentAvgAggregateOutputType = {
    size: number | null
  }

  export type TicketAttachmentSumAggregateOutputType = {
    size: number | null
  }

  export type TicketAttachmentMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    key: string | null
    name: string | null
    size: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketAttachmentMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    key: string | null
    name: string | null
    size: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketAttachmentCountAggregateOutputType = {
    id: number
    ticketId: number
    workspaceId: number
    key: number
    name: number
    size: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketAttachmentAvgAggregateInputType = {
    size?: true
  }

  export type TicketAttachmentSumAggregateInputType = {
    size?: true
  }

  export type TicketAttachmentMinAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    key?: true
    name?: true
    size?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketAttachmentMaxAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    key?: true
    name?: true
    size?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketAttachmentCountAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    key?: true
    name?: true
    size?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketAttachmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketAttachment to aggregate.
     */
    where?: TicketAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketAttachments to fetch.
     */
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketAttachments
    **/
    _count?: true | TicketAttachmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TicketAttachmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TicketAttachmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketAttachmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketAttachmentMaxAggregateInputType
  }

  export type GetTicketAttachmentAggregateType<T extends TicketAttachmentAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketAttachment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketAttachment[P]>
      : GetScalarType<T[P], AggregateTicketAttachment[P]>
  }




  export type TicketAttachmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketAttachmentWhereInput
    orderBy?: TicketAttachmentOrderByWithAggregationInput | TicketAttachmentOrderByWithAggregationInput[]
    by: TicketAttachmentScalarFieldEnum[] | TicketAttachmentScalarFieldEnum
    having?: TicketAttachmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketAttachmentCountAggregateInputType | true
    _avg?: TicketAttachmentAvgAggregateInputType
    _sum?: TicketAttachmentSumAggregateInputType
    _min?: TicketAttachmentMinAggregateInputType
    _max?: TicketAttachmentMaxAggregateInputType
  }

  export type TicketAttachmentGroupByOutputType = {
    id: string
    ticketId: string
    workspaceId: string
    key: string
    name: string
    size: number
    createdAt: Date
    updatedAt: Date
    _count: TicketAttachmentCountAggregateOutputType | null
    _avg: TicketAttachmentAvgAggregateOutputType | null
    _sum: TicketAttachmentSumAggregateOutputType | null
    _min: TicketAttachmentMinAggregateOutputType | null
    _max: TicketAttachmentMaxAggregateOutputType | null
  }

  type GetTicketAttachmentGroupByPayload<T extends TicketAttachmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketAttachmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketAttachmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketAttachmentGroupByOutputType[P]>
            : GetScalarType<T[P], TicketAttachmentGroupByOutputType[P]>
        }
      >
    >


  export type TicketAttachmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    key?: boolean
    name?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketAttachment"]>

  export type TicketAttachmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    key?: boolean
    name?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketAttachment"]>

  export type TicketAttachmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    key?: boolean
    name?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketAttachment"]>

  export type TicketAttachmentSelectScalar = {
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    key?: boolean
    name?: boolean
    size?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketAttachmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "workspaceId" | "key" | "name" | "size" | "createdAt" | "updatedAt", ExtArgs["result"]["ticketAttachment"]>
  export type TicketAttachmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type TicketAttachmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type TicketAttachmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $TicketAttachmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketAttachment"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      workspaceId: string
      key: string
      name: string
      size: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticketAttachment"]>
    composites: {}
  }

  type TicketAttachmentGetPayload<S extends boolean | null | undefined | TicketAttachmentDefaultArgs> = $Result.GetResult<Prisma.$TicketAttachmentPayload, S>

  type TicketAttachmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketAttachmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketAttachmentCountAggregateInputType | true
    }

  export interface TicketAttachmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketAttachment'], meta: { name: 'TicketAttachment' } }
    /**
     * Find zero or one TicketAttachment that matches the filter.
     * @param {TicketAttachmentFindUniqueArgs} args - Arguments to find a TicketAttachment
     * @example
     * // Get one TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketAttachmentFindUniqueArgs>(args: SelectSubset<T, TicketAttachmentFindUniqueArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketAttachment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketAttachmentFindUniqueOrThrowArgs} args - Arguments to find a TicketAttachment
     * @example
     * // Get one TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketAttachmentFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketAttachmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketAttachment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentFindFirstArgs} args - Arguments to find a TicketAttachment
     * @example
     * // Get one TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketAttachmentFindFirstArgs>(args?: SelectSubset<T, TicketAttachmentFindFirstArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketAttachment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentFindFirstOrThrowArgs} args - Arguments to find a TicketAttachment
     * @example
     * // Get one TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketAttachmentFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketAttachmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketAttachments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketAttachments
     * const ticketAttachments = await prisma.ticketAttachment.findMany()
     * 
     * // Get first 10 TicketAttachments
     * const ticketAttachments = await prisma.ticketAttachment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketAttachmentWithIdOnly = await prisma.ticketAttachment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketAttachmentFindManyArgs>(args?: SelectSubset<T, TicketAttachmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketAttachment.
     * @param {TicketAttachmentCreateArgs} args - Arguments to create a TicketAttachment.
     * @example
     * // Create one TicketAttachment
     * const TicketAttachment = await prisma.ticketAttachment.create({
     *   data: {
     *     // ... data to create a TicketAttachment
     *   }
     * })
     * 
     */
    create<T extends TicketAttachmentCreateArgs>(args: SelectSubset<T, TicketAttachmentCreateArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketAttachments.
     * @param {TicketAttachmentCreateManyArgs} args - Arguments to create many TicketAttachments.
     * @example
     * // Create many TicketAttachments
     * const ticketAttachment = await prisma.ticketAttachment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketAttachmentCreateManyArgs>(args?: SelectSubset<T, TicketAttachmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketAttachments and returns the data saved in the database.
     * @param {TicketAttachmentCreateManyAndReturnArgs} args - Arguments to create many TicketAttachments.
     * @example
     * // Create many TicketAttachments
     * const ticketAttachment = await prisma.ticketAttachment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketAttachments and only return the `id`
     * const ticketAttachmentWithIdOnly = await prisma.ticketAttachment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketAttachmentCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketAttachmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketAttachment.
     * @param {TicketAttachmentDeleteArgs} args - Arguments to delete one TicketAttachment.
     * @example
     * // Delete one TicketAttachment
     * const TicketAttachment = await prisma.ticketAttachment.delete({
     *   where: {
     *     // ... filter to delete one TicketAttachment
     *   }
     * })
     * 
     */
    delete<T extends TicketAttachmentDeleteArgs>(args: SelectSubset<T, TicketAttachmentDeleteArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketAttachment.
     * @param {TicketAttachmentUpdateArgs} args - Arguments to update one TicketAttachment.
     * @example
     * // Update one TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketAttachmentUpdateArgs>(args: SelectSubset<T, TicketAttachmentUpdateArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketAttachments.
     * @param {TicketAttachmentDeleteManyArgs} args - Arguments to filter TicketAttachments to delete.
     * @example
     * // Delete a few TicketAttachments
     * const { count } = await prisma.ticketAttachment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketAttachmentDeleteManyArgs>(args?: SelectSubset<T, TicketAttachmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketAttachments
     * const ticketAttachment = await prisma.ticketAttachment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketAttachmentUpdateManyArgs>(args: SelectSubset<T, TicketAttachmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketAttachments and returns the data updated in the database.
     * @param {TicketAttachmentUpdateManyAndReturnArgs} args - Arguments to update many TicketAttachments.
     * @example
     * // Update many TicketAttachments
     * const ticketAttachment = await prisma.ticketAttachment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketAttachments and only return the `id`
     * const ticketAttachmentWithIdOnly = await prisma.ticketAttachment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketAttachmentUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketAttachmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketAttachment.
     * @param {TicketAttachmentUpsertArgs} args - Arguments to update or create a TicketAttachment.
     * @example
     * // Update or create a TicketAttachment
     * const ticketAttachment = await prisma.ticketAttachment.upsert({
     *   create: {
     *     // ... data to create a TicketAttachment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketAttachment we want to update
     *   }
     * })
     */
    upsert<T extends TicketAttachmentUpsertArgs>(args: SelectSubset<T, TicketAttachmentUpsertArgs<ExtArgs>>): Prisma__TicketAttachmentClient<$Result.GetResult<Prisma.$TicketAttachmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketAttachments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentCountArgs} args - Arguments to filter TicketAttachments to count.
     * @example
     * // Count the number of TicketAttachments
     * const count = await prisma.ticketAttachment.count({
     *   where: {
     *     // ... the filter for the TicketAttachments we want to count
     *   }
     * })
    **/
    count<T extends TicketAttachmentCountArgs>(
      args?: Subset<T, TicketAttachmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketAttachmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketAttachmentAggregateArgs>(args: Subset<T, TicketAttachmentAggregateArgs>): Prisma.PrismaPromise<GetTicketAttachmentAggregateType<T>>

    /**
     * Group by TicketAttachment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAttachmentGroupByArgs} args - Group by arguments.
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
      T extends TicketAttachmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketAttachmentGroupByArgs['orderBy'] }
        : { orderBy?: TicketAttachmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketAttachmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketAttachmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketAttachment model
   */
  readonly fields: TicketAttachmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketAttachment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketAttachmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TicketAttachment model
   */
  interface TicketAttachmentFieldRefs {
    readonly id: FieldRef<"TicketAttachment", 'String'>
    readonly ticketId: FieldRef<"TicketAttachment", 'String'>
    readonly workspaceId: FieldRef<"TicketAttachment", 'String'>
    readonly key: FieldRef<"TicketAttachment", 'String'>
    readonly name: FieldRef<"TicketAttachment", 'String'>
    readonly size: FieldRef<"TicketAttachment", 'Int'>
    readonly createdAt: FieldRef<"TicketAttachment", 'DateTime'>
    readonly updatedAt: FieldRef<"TicketAttachment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketAttachment findUnique
   */
  export type TicketAttachmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which TicketAttachment to fetch.
     */
    where: TicketAttachmentWhereUniqueInput
  }

  /**
   * TicketAttachment findUniqueOrThrow
   */
  export type TicketAttachmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which TicketAttachment to fetch.
     */
    where: TicketAttachmentWhereUniqueInput
  }

  /**
   * TicketAttachment findFirst
   */
  export type TicketAttachmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which TicketAttachment to fetch.
     */
    where?: TicketAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketAttachments to fetch.
     */
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketAttachments.
     */
    cursor?: TicketAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketAttachments.
     */
    distinct?: TicketAttachmentScalarFieldEnum | TicketAttachmentScalarFieldEnum[]
  }

  /**
   * TicketAttachment findFirstOrThrow
   */
  export type TicketAttachmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which TicketAttachment to fetch.
     */
    where?: TicketAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketAttachments to fetch.
     */
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketAttachments.
     */
    cursor?: TicketAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketAttachments.
     */
    distinct?: TicketAttachmentScalarFieldEnum | TicketAttachmentScalarFieldEnum[]
  }

  /**
   * TicketAttachment findMany
   */
  export type TicketAttachmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter, which TicketAttachments to fetch.
     */
    where?: TicketAttachmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketAttachments to fetch.
     */
    orderBy?: TicketAttachmentOrderByWithRelationInput | TicketAttachmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketAttachments.
     */
    cursor?: TicketAttachmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketAttachments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketAttachments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketAttachments.
     */
    distinct?: TicketAttachmentScalarFieldEnum | TicketAttachmentScalarFieldEnum[]
  }

  /**
   * TicketAttachment create
   */
  export type TicketAttachmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketAttachment.
     */
    data: XOR<TicketAttachmentCreateInput, TicketAttachmentUncheckedCreateInput>
  }

  /**
   * TicketAttachment createMany
   */
  export type TicketAttachmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketAttachments.
     */
    data: TicketAttachmentCreateManyInput | TicketAttachmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketAttachment createManyAndReturn
   */
  export type TicketAttachmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * The data used to create many TicketAttachments.
     */
    data: TicketAttachmentCreateManyInput | TicketAttachmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketAttachment update
   */
  export type TicketAttachmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketAttachment.
     */
    data: XOR<TicketAttachmentUpdateInput, TicketAttachmentUncheckedUpdateInput>
    /**
     * Choose, which TicketAttachment to update.
     */
    where: TicketAttachmentWhereUniqueInput
  }

  /**
   * TicketAttachment updateMany
   */
  export type TicketAttachmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketAttachments.
     */
    data: XOR<TicketAttachmentUpdateManyMutationInput, TicketAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which TicketAttachments to update
     */
    where?: TicketAttachmentWhereInput
    /**
     * Limit how many TicketAttachments to update.
     */
    limit?: number
  }

  /**
   * TicketAttachment updateManyAndReturn
   */
  export type TicketAttachmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * The data used to update TicketAttachments.
     */
    data: XOR<TicketAttachmentUpdateManyMutationInput, TicketAttachmentUncheckedUpdateManyInput>
    /**
     * Filter which TicketAttachments to update
     */
    where?: TicketAttachmentWhereInput
    /**
     * Limit how many TicketAttachments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketAttachment upsert
   */
  export type TicketAttachmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketAttachment to update in case it exists.
     */
    where: TicketAttachmentWhereUniqueInput
    /**
     * In case the TicketAttachment found by the `where` argument doesn't exist, create a new TicketAttachment with this data.
     */
    create: XOR<TicketAttachmentCreateInput, TicketAttachmentUncheckedCreateInput>
    /**
     * In case the TicketAttachment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketAttachmentUpdateInput, TicketAttachmentUncheckedUpdateInput>
  }

  /**
   * TicketAttachment delete
   */
  export type TicketAttachmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
    /**
     * Filter which TicketAttachment to delete.
     */
    where: TicketAttachmentWhereUniqueInput
  }

  /**
   * TicketAttachment deleteMany
   */
  export type TicketAttachmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketAttachments to delete
     */
    where?: TicketAttachmentWhereInput
    /**
     * Limit how many TicketAttachments to delete.
     */
    limit?: number
  }

  /**
   * TicketAttachment without action
   */
  export type TicketAttachmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketAttachment
     */
    select?: TicketAttachmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketAttachment
     */
    omit?: TicketAttachmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketAttachmentInclude<ExtArgs> | null
  }


  /**
   * Model TicketComment
   */

  export type AggregateTicketComment = {
    _count: TicketCommentCountAggregateOutputType | null
    _min: TicketCommentMinAggregateOutputType | null
    _max: TicketCommentMaxAggregateOutputType | null
  }

  export type TicketCommentMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketCommentMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketCommentCountAggregateOutputType = {
    id: number
    ticketId: number
    workspaceId: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketCommentMinAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketCommentMaxAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketCommentCountAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketCommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketComment to aggregate.
     */
    where?: TicketCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketComments to fetch.
     */
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketComments
    **/
    _count?: true | TicketCommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketCommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketCommentMaxAggregateInputType
  }

  export type GetTicketCommentAggregateType<T extends TicketCommentAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketComment[P]>
      : GetScalarType<T[P], AggregateTicketComment[P]>
  }




  export type TicketCommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketCommentWhereInput
    orderBy?: TicketCommentOrderByWithAggregationInput | TicketCommentOrderByWithAggregationInput[]
    by: TicketCommentScalarFieldEnum[] | TicketCommentScalarFieldEnum
    having?: TicketCommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCommentCountAggregateInputType | true
    _min?: TicketCommentMinAggregateInputType
    _max?: TicketCommentMaxAggregateInputType
  }

  export type TicketCommentGroupByOutputType = {
    id: string
    ticketId: string
    workspaceId: string
    content: string
    createdAt: Date
    updatedAt: Date
    _count: TicketCommentCountAggregateOutputType | null
    _min: TicketCommentMinAggregateOutputType | null
    _max: TicketCommentMaxAggregateOutputType | null
  }

  type GetTicketCommentGroupByPayload<T extends TicketCommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketCommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketCommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketCommentGroupByOutputType[P]>
            : GetScalarType<T[P], TicketCommentGroupByOutputType[P]>
        }
      >
    >


  export type TicketCommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketComment"]>

  export type TicketCommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketComment"]>

  export type TicketCommentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketComment"]>

  export type TicketCommentSelectScalar = {
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketCommentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "workspaceId" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["ticketComment"]>
  export type TicketCommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type TicketCommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type TicketCommentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $TicketCommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketComment"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      workspaceId: string
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticketComment"]>
    composites: {}
  }

  type TicketCommentGetPayload<S extends boolean | null | undefined | TicketCommentDefaultArgs> = $Result.GetResult<Prisma.$TicketCommentPayload, S>

  type TicketCommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketCommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketCommentCountAggregateInputType | true
    }

  export interface TicketCommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketComment'], meta: { name: 'TicketComment' } }
    /**
     * Find zero or one TicketComment that matches the filter.
     * @param {TicketCommentFindUniqueArgs} args - Arguments to find a TicketComment
     * @example
     * // Get one TicketComment
     * const ticketComment = await prisma.ticketComment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketCommentFindUniqueArgs>(args: SelectSubset<T, TicketCommentFindUniqueArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketComment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketCommentFindUniqueOrThrowArgs} args - Arguments to find a TicketComment
     * @example
     * // Get one TicketComment
     * const ticketComment = await prisma.ticketComment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketCommentFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketCommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketComment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentFindFirstArgs} args - Arguments to find a TicketComment
     * @example
     * // Get one TicketComment
     * const ticketComment = await prisma.ticketComment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketCommentFindFirstArgs>(args?: SelectSubset<T, TicketCommentFindFirstArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketComment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentFindFirstOrThrowArgs} args - Arguments to find a TicketComment
     * @example
     * // Get one TicketComment
     * const ticketComment = await prisma.ticketComment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketCommentFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketCommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketComments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketComments
     * const ticketComments = await prisma.ticketComment.findMany()
     * 
     * // Get first 10 TicketComments
     * const ticketComments = await prisma.ticketComment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketCommentWithIdOnly = await prisma.ticketComment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketCommentFindManyArgs>(args?: SelectSubset<T, TicketCommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketComment.
     * @param {TicketCommentCreateArgs} args - Arguments to create a TicketComment.
     * @example
     * // Create one TicketComment
     * const TicketComment = await prisma.ticketComment.create({
     *   data: {
     *     // ... data to create a TicketComment
     *   }
     * })
     * 
     */
    create<T extends TicketCommentCreateArgs>(args: SelectSubset<T, TicketCommentCreateArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketComments.
     * @param {TicketCommentCreateManyArgs} args - Arguments to create many TicketComments.
     * @example
     * // Create many TicketComments
     * const ticketComment = await prisma.ticketComment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketCommentCreateManyArgs>(args?: SelectSubset<T, TicketCommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketComments and returns the data saved in the database.
     * @param {TicketCommentCreateManyAndReturnArgs} args - Arguments to create many TicketComments.
     * @example
     * // Create many TicketComments
     * const ticketComment = await prisma.ticketComment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketComments and only return the `id`
     * const ticketCommentWithIdOnly = await prisma.ticketComment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketCommentCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketCommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketComment.
     * @param {TicketCommentDeleteArgs} args - Arguments to delete one TicketComment.
     * @example
     * // Delete one TicketComment
     * const TicketComment = await prisma.ticketComment.delete({
     *   where: {
     *     // ... filter to delete one TicketComment
     *   }
     * })
     * 
     */
    delete<T extends TicketCommentDeleteArgs>(args: SelectSubset<T, TicketCommentDeleteArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketComment.
     * @param {TicketCommentUpdateArgs} args - Arguments to update one TicketComment.
     * @example
     * // Update one TicketComment
     * const ticketComment = await prisma.ticketComment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketCommentUpdateArgs>(args: SelectSubset<T, TicketCommentUpdateArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketComments.
     * @param {TicketCommentDeleteManyArgs} args - Arguments to filter TicketComments to delete.
     * @example
     * // Delete a few TicketComments
     * const { count } = await prisma.ticketComment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketCommentDeleteManyArgs>(args?: SelectSubset<T, TicketCommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketComments
     * const ticketComment = await prisma.ticketComment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketCommentUpdateManyArgs>(args: SelectSubset<T, TicketCommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketComments and returns the data updated in the database.
     * @param {TicketCommentUpdateManyAndReturnArgs} args - Arguments to update many TicketComments.
     * @example
     * // Update many TicketComments
     * const ticketComment = await prisma.ticketComment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketComments and only return the `id`
     * const ticketCommentWithIdOnly = await prisma.ticketComment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketCommentUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketCommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketComment.
     * @param {TicketCommentUpsertArgs} args - Arguments to update or create a TicketComment.
     * @example
     * // Update or create a TicketComment
     * const ticketComment = await prisma.ticketComment.upsert({
     *   create: {
     *     // ... data to create a TicketComment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketComment we want to update
     *   }
     * })
     */
    upsert<T extends TicketCommentUpsertArgs>(args: SelectSubset<T, TicketCommentUpsertArgs<ExtArgs>>): Prisma__TicketCommentClient<$Result.GetResult<Prisma.$TicketCommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketComments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentCountArgs} args - Arguments to filter TicketComments to count.
     * @example
     * // Count the number of TicketComments
     * const count = await prisma.ticketComment.count({
     *   where: {
     *     // ... the filter for the TicketComments we want to count
     *   }
     * })
    **/
    count<T extends TicketCommentCountArgs>(
      args?: Subset<T, TicketCommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketCommentAggregateArgs>(args: Subset<T, TicketCommentAggregateArgs>): Prisma.PrismaPromise<GetTicketCommentAggregateType<T>>

    /**
     * Group by TicketComment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCommentGroupByArgs} args - Group by arguments.
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
      T extends TicketCommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketCommentGroupByArgs['orderBy'] }
        : { orderBy?: TicketCommentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketCommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketComment model
   */
  readonly fields: TicketCommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketComment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketCommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TicketComment model
   */
  interface TicketCommentFieldRefs {
    readonly id: FieldRef<"TicketComment", 'String'>
    readonly ticketId: FieldRef<"TicketComment", 'String'>
    readonly workspaceId: FieldRef<"TicketComment", 'String'>
    readonly content: FieldRef<"TicketComment", 'String'>
    readonly createdAt: FieldRef<"TicketComment", 'DateTime'>
    readonly updatedAt: FieldRef<"TicketComment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketComment findUnique
   */
  export type TicketCommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter, which TicketComment to fetch.
     */
    where: TicketCommentWhereUniqueInput
  }

  /**
   * TicketComment findUniqueOrThrow
   */
  export type TicketCommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter, which TicketComment to fetch.
     */
    where: TicketCommentWhereUniqueInput
  }

  /**
   * TicketComment findFirst
   */
  export type TicketCommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter, which TicketComment to fetch.
     */
    where?: TicketCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketComments to fetch.
     */
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketComments.
     */
    cursor?: TicketCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketComments.
     */
    distinct?: TicketCommentScalarFieldEnum | TicketCommentScalarFieldEnum[]
  }

  /**
   * TicketComment findFirstOrThrow
   */
  export type TicketCommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter, which TicketComment to fetch.
     */
    where?: TicketCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketComments to fetch.
     */
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketComments.
     */
    cursor?: TicketCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketComments.
     */
    distinct?: TicketCommentScalarFieldEnum | TicketCommentScalarFieldEnum[]
  }

  /**
   * TicketComment findMany
   */
  export type TicketCommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter, which TicketComments to fetch.
     */
    where?: TicketCommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketComments to fetch.
     */
    orderBy?: TicketCommentOrderByWithRelationInput | TicketCommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketComments.
     */
    cursor?: TicketCommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketComments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketComments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketComments.
     */
    distinct?: TicketCommentScalarFieldEnum | TicketCommentScalarFieldEnum[]
  }

  /**
   * TicketComment create
   */
  export type TicketCommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketComment.
     */
    data: XOR<TicketCommentCreateInput, TicketCommentUncheckedCreateInput>
  }

  /**
   * TicketComment createMany
   */
  export type TicketCommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketComments.
     */
    data: TicketCommentCreateManyInput | TicketCommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketComment createManyAndReturn
   */
  export type TicketCommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * The data used to create many TicketComments.
     */
    data: TicketCommentCreateManyInput | TicketCommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketComment update
   */
  export type TicketCommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketComment.
     */
    data: XOR<TicketCommentUpdateInput, TicketCommentUncheckedUpdateInput>
    /**
     * Choose, which TicketComment to update.
     */
    where: TicketCommentWhereUniqueInput
  }

  /**
   * TicketComment updateMany
   */
  export type TicketCommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketComments.
     */
    data: XOR<TicketCommentUpdateManyMutationInput, TicketCommentUncheckedUpdateManyInput>
    /**
     * Filter which TicketComments to update
     */
    where?: TicketCommentWhereInput
    /**
     * Limit how many TicketComments to update.
     */
    limit?: number
  }

  /**
   * TicketComment updateManyAndReturn
   */
  export type TicketCommentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * The data used to update TicketComments.
     */
    data: XOR<TicketCommentUpdateManyMutationInput, TicketCommentUncheckedUpdateManyInput>
    /**
     * Filter which TicketComments to update
     */
    where?: TicketCommentWhereInput
    /**
     * Limit how many TicketComments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketComment upsert
   */
  export type TicketCommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketComment to update in case it exists.
     */
    where: TicketCommentWhereUniqueInput
    /**
     * In case the TicketComment found by the `where` argument doesn't exist, create a new TicketComment with this data.
     */
    create: XOR<TicketCommentCreateInput, TicketCommentUncheckedCreateInput>
    /**
     * In case the TicketComment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketCommentUpdateInput, TicketCommentUncheckedUpdateInput>
  }

  /**
   * TicketComment delete
   */
  export type TicketCommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
    /**
     * Filter which TicketComment to delete.
     */
    where: TicketCommentWhereUniqueInput
  }

  /**
   * TicketComment deleteMany
   */
  export type TicketCommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketComments to delete
     */
    where?: TicketCommentWhereInput
    /**
     * Limit how many TicketComments to delete.
     */
    limit?: number
  }

  /**
   * TicketComment without action
   */
  export type TicketCommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketComment
     */
    select?: TicketCommentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketComment
     */
    omit?: TicketCommentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketCommentInclude<ExtArgs> | null
  }


  /**
   * Model TicketLabel
   */

  export type AggregateTicketLabel = {
    _count: TicketLabelCountAggregateOutputType | null
    _min: TicketLabelMinAggregateOutputType | null
    _max: TicketLabelMaxAggregateOutputType | null
  }

  export type TicketLabelMinAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    labelId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketLabelMaxAggregateOutputType = {
    id: string | null
    ticketId: string | null
    workspaceId: string | null
    labelId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TicketLabelCountAggregateOutputType = {
    id: number
    ticketId: number
    workspaceId: number
    labelId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TicketLabelMinAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    labelId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketLabelMaxAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    labelId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TicketLabelCountAggregateInputType = {
    id?: true
    ticketId?: true
    workspaceId?: true
    labelId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TicketLabelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketLabel to aggregate.
     */
    where?: TicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLabels to fetch.
     */
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TicketLabels
    **/
    _count?: true | TicketLabelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketLabelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketLabelMaxAggregateInputType
  }

  export type GetTicketLabelAggregateType<T extends TicketLabelAggregateArgs> = {
        [P in keyof T & keyof AggregateTicketLabel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicketLabel[P]>
      : GetScalarType<T[P], AggregateTicketLabel[P]>
  }




  export type TicketLabelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TicketLabelWhereInput
    orderBy?: TicketLabelOrderByWithAggregationInput | TicketLabelOrderByWithAggregationInput[]
    by: TicketLabelScalarFieldEnum[] | TicketLabelScalarFieldEnum
    having?: TicketLabelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketLabelCountAggregateInputType | true
    _min?: TicketLabelMinAggregateInputType
    _max?: TicketLabelMaxAggregateInputType
  }

  export type TicketLabelGroupByOutputType = {
    id: string
    ticketId: string
    workspaceId: string
    labelId: string
    createdAt: Date
    updatedAt: Date
    _count: TicketLabelCountAggregateOutputType | null
    _min: TicketLabelMinAggregateOutputType | null
    _max: TicketLabelMaxAggregateOutputType | null
  }

  type GetTicketLabelGroupByPayload<T extends TicketLabelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TicketLabelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketLabelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketLabelGroupByOutputType[P]>
            : GetScalarType<T[P], TicketLabelGroupByOutputType[P]>
        }
      >
    >


  export type TicketLabelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    labelId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketLabel"]>

  export type TicketLabelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    labelId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketLabel"]>

  export type TicketLabelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    labelId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ticketLabel"]>

  export type TicketLabelSelectScalar = {
    id?: boolean
    ticketId?: boolean
    workspaceId?: boolean
    labelId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TicketLabelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ticketId" | "workspaceId" | "labelId" | "createdAt" | "updatedAt", ExtArgs["result"]["ticketLabel"]>
  export type TicketLabelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }
  export type TicketLabelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }
  export type TicketLabelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ticket?: boolean | TicketDefaultArgs<ExtArgs>
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    label?: boolean | WorkspaceTicketLabelDefaultArgs<ExtArgs>
  }

  export type $TicketLabelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TicketLabel"
    objects: {
      ticket: Prisma.$TicketPayload<ExtArgs>
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      label: Prisma.$WorkspaceTicketLabelPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      ticketId: string
      workspaceId: string
      labelId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["ticketLabel"]>
    composites: {}
  }

  type TicketLabelGetPayload<S extends boolean | null | undefined | TicketLabelDefaultArgs> = $Result.GetResult<Prisma.$TicketLabelPayload, S>

  type TicketLabelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TicketLabelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TicketLabelCountAggregateInputType | true
    }

  export interface TicketLabelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TicketLabel'], meta: { name: 'TicketLabel' } }
    /**
     * Find zero or one TicketLabel that matches the filter.
     * @param {TicketLabelFindUniqueArgs} args - Arguments to find a TicketLabel
     * @example
     * // Get one TicketLabel
     * const ticketLabel = await prisma.ticketLabel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketLabelFindUniqueArgs>(args: SelectSubset<T, TicketLabelFindUniqueArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TicketLabel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketLabelFindUniqueOrThrowArgs} args - Arguments to find a TicketLabel
     * @example
     * // Get one TicketLabel
     * const ticketLabel = await prisma.ticketLabel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketLabelFindUniqueOrThrowArgs>(args: SelectSubset<T, TicketLabelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketLabel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelFindFirstArgs} args - Arguments to find a TicketLabel
     * @example
     * // Get one TicketLabel
     * const ticketLabel = await prisma.ticketLabel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketLabelFindFirstArgs>(args?: SelectSubset<T, TicketLabelFindFirstArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TicketLabel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelFindFirstOrThrowArgs} args - Arguments to find a TicketLabel
     * @example
     * // Get one TicketLabel
     * const ticketLabel = await prisma.ticketLabel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketLabelFindFirstOrThrowArgs>(args?: SelectSubset<T, TicketLabelFindFirstOrThrowArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TicketLabels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TicketLabels
     * const ticketLabels = await prisma.ticketLabel.findMany()
     * 
     * // Get first 10 TicketLabels
     * const ticketLabels = await prisma.ticketLabel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ticketLabelWithIdOnly = await prisma.ticketLabel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TicketLabelFindManyArgs>(args?: SelectSubset<T, TicketLabelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TicketLabel.
     * @param {TicketLabelCreateArgs} args - Arguments to create a TicketLabel.
     * @example
     * // Create one TicketLabel
     * const TicketLabel = await prisma.ticketLabel.create({
     *   data: {
     *     // ... data to create a TicketLabel
     *   }
     * })
     * 
     */
    create<T extends TicketLabelCreateArgs>(args: SelectSubset<T, TicketLabelCreateArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TicketLabels.
     * @param {TicketLabelCreateManyArgs} args - Arguments to create many TicketLabels.
     * @example
     * // Create many TicketLabels
     * const ticketLabel = await prisma.ticketLabel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TicketLabelCreateManyArgs>(args?: SelectSubset<T, TicketLabelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TicketLabels and returns the data saved in the database.
     * @param {TicketLabelCreateManyAndReturnArgs} args - Arguments to create many TicketLabels.
     * @example
     * // Create many TicketLabels
     * const ticketLabel = await prisma.ticketLabel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TicketLabels and only return the `id`
     * const ticketLabelWithIdOnly = await prisma.ticketLabel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TicketLabelCreateManyAndReturnArgs>(args?: SelectSubset<T, TicketLabelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TicketLabel.
     * @param {TicketLabelDeleteArgs} args - Arguments to delete one TicketLabel.
     * @example
     * // Delete one TicketLabel
     * const TicketLabel = await prisma.ticketLabel.delete({
     *   where: {
     *     // ... filter to delete one TicketLabel
     *   }
     * })
     * 
     */
    delete<T extends TicketLabelDeleteArgs>(args: SelectSubset<T, TicketLabelDeleteArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TicketLabel.
     * @param {TicketLabelUpdateArgs} args - Arguments to update one TicketLabel.
     * @example
     * // Update one TicketLabel
     * const ticketLabel = await prisma.ticketLabel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TicketLabelUpdateArgs>(args: SelectSubset<T, TicketLabelUpdateArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TicketLabels.
     * @param {TicketLabelDeleteManyArgs} args - Arguments to filter TicketLabels to delete.
     * @example
     * // Delete a few TicketLabels
     * const { count } = await prisma.ticketLabel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TicketLabelDeleteManyArgs>(args?: SelectSubset<T, TicketLabelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TicketLabels
     * const ticketLabel = await prisma.ticketLabel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TicketLabelUpdateManyArgs>(args: SelectSubset<T, TicketLabelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TicketLabels and returns the data updated in the database.
     * @param {TicketLabelUpdateManyAndReturnArgs} args - Arguments to update many TicketLabels.
     * @example
     * // Update many TicketLabels
     * const ticketLabel = await prisma.ticketLabel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TicketLabels and only return the `id`
     * const ticketLabelWithIdOnly = await prisma.ticketLabel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TicketLabelUpdateManyAndReturnArgs>(args: SelectSubset<T, TicketLabelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TicketLabel.
     * @param {TicketLabelUpsertArgs} args - Arguments to update or create a TicketLabel.
     * @example
     * // Update or create a TicketLabel
     * const ticketLabel = await prisma.ticketLabel.upsert({
     *   create: {
     *     // ... data to create a TicketLabel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TicketLabel we want to update
     *   }
     * })
     */
    upsert<T extends TicketLabelUpsertArgs>(args: SelectSubset<T, TicketLabelUpsertArgs<ExtArgs>>): Prisma__TicketLabelClient<$Result.GetResult<Prisma.$TicketLabelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TicketLabels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelCountArgs} args - Arguments to filter TicketLabels to count.
     * @example
     * // Count the number of TicketLabels
     * const count = await prisma.ticketLabel.count({
     *   where: {
     *     // ... the filter for the TicketLabels we want to count
     *   }
     * })
    **/
    count<T extends TicketLabelCountArgs>(
      args?: Subset<T, TicketLabelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketLabelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TicketLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TicketLabelAggregateArgs>(args: Subset<T, TicketLabelAggregateArgs>): Prisma.PrismaPromise<GetTicketLabelAggregateType<T>>

    /**
     * Group by TicketLabel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketLabelGroupByArgs} args - Group by arguments.
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
      T extends TicketLabelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketLabelGroupByArgs['orderBy'] }
        : { orderBy?: TicketLabelGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TicketLabelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketLabelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TicketLabel model
   */
  readonly fields: TicketLabelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TicketLabel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketLabelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    ticket<T extends TicketDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TicketDefaultArgs<ExtArgs>>): Prisma__TicketClient<$Result.GetResult<Prisma.$TicketPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    label<T extends WorkspaceTicketLabelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceTicketLabelDefaultArgs<ExtArgs>>): Prisma__WorkspaceTicketLabelClient<$Result.GetResult<Prisma.$WorkspaceTicketLabelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TicketLabel model
   */
  interface TicketLabelFieldRefs {
    readonly id: FieldRef<"TicketLabel", 'String'>
    readonly ticketId: FieldRef<"TicketLabel", 'String'>
    readonly workspaceId: FieldRef<"TicketLabel", 'String'>
    readonly labelId: FieldRef<"TicketLabel", 'String'>
    readonly createdAt: FieldRef<"TicketLabel", 'DateTime'>
    readonly updatedAt: FieldRef<"TicketLabel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TicketLabel findUnique
   */
  export type TicketLabelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which TicketLabel to fetch.
     */
    where: TicketLabelWhereUniqueInput
  }

  /**
   * TicketLabel findUniqueOrThrow
   */
  export type TicketLabelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which TicketLabel to fetch.
     */
    where: TicketLabelWhereUniqueInput
  }

  /**
   * TicketLabel findFirst
   */
  export type TicketLabelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which TicketLabel to fetch.
     */
    where?: TicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLabels to fetch.
     */
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketLabels.
     */
    cursor?: TicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLabels.
     */
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * TicketLabel findFirstOrThrow
   */
  export type TicketLabelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which TicketLabel to fetch.
     */
    where?: TicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLabels to fetch.
     */
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TicketLabels.
     */
    cursor?: TicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLabels.
     */
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * TicketLabel findMany
   */
  export type TicketLabelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter, which TicketLabels to fetch.
     */
    where?: TicketLabelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TicketLabels to fetch.
     */
    orderBy?: TicketLabelOrderByWithRelationInput | TicketLabelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TicketLabels.
     */
    cursor?: TicketLabelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TicketLabels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TicketLabels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TicketLabels.
     */
    distinct?: TicketLabelScalarFieldEnum | TicketLabelScalarFieldEnum[]
  }

  /**
   * TicketLabel create
   */
  export type TicketLabelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * The data needed to create a TicketLabel.
     */
    data: XOR<TicketLabelCreateInput, TicketLabelUncheckedCreateInput>
  }

  /**
   * TicketLabel createMany
   */
  export type TicketLabelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TicketLabels.
     */
    data: TicketLabelCreateManyInput | TicketLabelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TicketLabel createManyAndReturn
   */
  export type TicketLabelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * The data used to create many TicketLabels.
     */
    data: TicketLabelCreateManyInput | TicketLabelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketLabel update
   */
  export type TicketLabelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * The data needed to update a TicketLabel.
     */
    data: XOR<TicketLabelUpdateInput, TicketLabelUncheckedUpdateInput>
    /**
     * Choose, which TicketLabel to update.
     */
    where: TicketLabelWhereUniqueInput
  }

  /**
   * TicketLabel updateMany
   */
  export type TicketLabelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TicketLabels.
     */
    data: XOR<TicketLabelUpdateManyMutationInput, TicketLabelUncheckedUpdateManyInput>
    /**
     * Filter which TicketLabels to update
     */
    where?: TicketLabelWhereInput
    /**
     * Limit how many TicketLabels to update.
     */
    limit?: number
  }

  /**
   * TicketLabel updateManyAndReturn
   */
  export type TicketLabelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * The data used to update TicketLabels.
     */
    data: XOR<TicketLabelUpdateManyMutationInput, TicketLabelUncheckedUpdateManyInput>
    /**
     * Filter which TicketLabels to update
     */
    where?: TicketLabelWhereInput
    /**
     * Limit how many TicketLabels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TicketLabel upsert
   */
  export type TicketLabelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * The filter to search for the TicketLabel to update in case it exists.
     */
    where: TicketLabelWhereUniqueInput
    /**
     * In case the TicketLabel found by the `where` argument doesn't exist, create a new TicketLabel with this data.
     */
    create: XOR<TicketLabelCreateInput, TicketLabelUncheckedCreateInput>
    /**
     * In case the TicketLabel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketLabelUpdateInput, TicketLabelUncheckedUpdateInput>
  }

  /**
   * TicketLabel delete
   */
  export type TicketLabelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
    /**
     * Filter which TicketLabel to delete.
     */
    where: TicketLabelWhereUniqueInput
  }

  /**
   * TicketLabel deleteMany
   */
  export type TicketLabelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TicketLabels to delete
     */
    where?: TicketLabelWhereInput
    /**
     * Limit how many TicketLabels to delete.
     */
    limit?: number
  }

  /**
   * TicketLabel without action
   */
  export type TicketLabelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TicketLabel
     */
    select?: TicketLabelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TicketLabel
     */
    omit?: TicketLabelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketLabelInclude<ExtArgs> | null
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
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const WorkspaceMemberScalarFieldEnum: {
    id: 'id',
    isWorkspaceOwner: 'isWorkspaceOwner',
    workspaceId: 'workspaceId',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceMemberScalarFieldEnum = (typeof WorkspaceMemberScalarFieldEnum)[keyof typeof WorkspaceMemberScalarFieldEnum]


  export const WorkspaceMemberInviteScalarFieldEnum: {
    id: 'id',
    email: 'email',
    workspaceId: 'workspaceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceMemberInviteScalarFieldEnum = (typeof WorkspaceMemberInviteScalarFieldEnum)[keyof typeof WorkspaceMemberInviteScalarFieldEnum]


  export const WorkspaceTicketLabelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    workspaceId: 'workspaceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceTicketLabelScalarFieldEnum = (typeof WorkspaceTicketLabelScalarFieldEnum)[keyof typeof WorkspaceTicketLabelScalarFieldEnum]


  export const TicketListScalarFieldEnum: {
    id: 'id',
    name: 'name',
    workspaceId: 'workspaceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketListScalarFieldEnum = (typeof TicketListScalarFieldEnum)[keyof typeof TicketListScalarFieldEnum]


  export const TicketScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    workspaceId: 'workspaceId',
    ticketListId: 'ticketListId',
    assigneeId: 'assigneeId',
    reporterId: 'reporterId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const TicketAttachmentScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    workspaceId: 'workspaceId',
    key: 'key',
    name: 'name',
    size: 'size',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketAttachmentScalarFieldEnum = (typeof TicketAttachmentScalarFieldEnum)[keyof typeof TicketAttachmentScalarFieldEnum]


  export const TicketCommentScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    workspaceId: 'workspaceId',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketCommentScalarFieldEnum = (typeof TicketCommentScalarFieldEnum)[keyof typeof TicketCommentScalarFieldEnum]


  export const TicketLabelScalarFieldEnum: {
    id: 'id',
    ticketId: 'ticketId',
    workspaceId: 'workspaceId',
    labelId: 'labelId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TicketLabelScalarFieldEnum = (typeof TicketLabelScalarFieldEnum)[keyof typeof TicketLabelScalarFieldEnum]


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    members?: WorkspaceMemberListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    members?: WorkspaceMemberOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    members?: WorkspaceMemberListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
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
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
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
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeFilter<"Verification"> | Date | string
    updatedAt?: DateTimeFilter<"Verification"> | Date | string
  }, "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    members?: WorkspaceMemberListRelationFilter
    tickets?: TicketListRelationFilter
    ticketLists?: TicketListListRelationFilter
    ticketAttachments?: TicketAttachmentListRelationFilter
    ticketComments?: TicketCommentListRelationFilter
    ticketLabels?: TicketLabelListRelationFilter
    workspaceTicketLabels?: WorkspaceTicketLabelListRelationFilter
    workspaceMemberInvites?: WorkspaceMemberInviteListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: WorkspaceMemberOrderByRelationAggregateInput
    tickets?: TicketOrderByRelationAggregateInput
    ticketLists?: TicketListOrderByRelationAggregateInput
    ticketAttachments?: TicketAttachmentOrderByRelationAggregateInput
    ticketComments?: TicketCommentOrderByRelationAggregateInput
    ticketLabels?: TicketLabelOrderByRelationAggregateInput
    workspaceTicketLabels?: WorkspaceTicketLabelOrderByRelationAggregateInput
    workspaceMemberInvites?: WorkspaceMemberInviteOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringFilter<"Workspace"> | string
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    members?: WorkspaceMemberListRelationFilter
    tickets?: TicketListRelationFilter
    ticketLists?: TicketListListRelationFilter
    ticketAttachments?: TicketAttachmentListRelationFilter
    ticketComments?: TicketCommentListRelationFilter
    ticketLabels?: TicketLabelListRelationFilter
    workspaceTicketLabels?: WorkspaceTicketLabelListRelationFilter
    workspaceMemberInvites?: WorkspaceMemberInviteListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringWithAggregatesFilter<"Workspace"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
  }

  export type WorkspaceMemberWhereInput = {
    AND?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    OR?: WorkspaceMemberWhereInput[]
    NOT?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    id?: StringFilter<"WorkspaceMember"> | string
    isWorkspaceOwner?: BoolFilter<"WorkspaceMember"> | boolean
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    userId?: StringFilter<"WorkspaceMember"> | string
    createdAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    assignedTickets?: TicketListRelationFilter
    reportedTickets?: TicketListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WorkspaceMemberOrderByWithRelationInput = {
    id?: SortOrder
    isWorkspaceOwner?: SortOrder
    workspaceId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    assignedTickets?: TicketOrderByRelationAggregateInput
    reportedTickets?: TicketOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type WorkspaceMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workspaceId_userId?: WorkspaceMemberWorkspaceIdUserIdCompoundUniqueInput
    AND?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    OR?: WorkspaceMemberWhereInput[]
    NOT?: WorkspaceMemberWhereInput | WorkspaceMemberWhereInput[]
    isWorkspaceOwner?: BoolFilter<"WorkspaceMember"> | boolean
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    userId?: StringFilter<"WorkspaceMember"> | string
    createdAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    assignedTickets?: TicketListRelationFilter
    reportedTickets?: TicketListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "workspaceId_userId">

  export type WorkspaceMemberOrderByWithAggregationInput = {
    id?: SortOrder
    isWorkspaceOwner?: SortOrder
    workspaceId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceMemberCountOrderByAggregateInput
    _max?: WorkspaceMemberMaxOrderByAggregateInput
    _min?: WorkspaceMemberMinOrderByAggregateInput
  }

  export type WorkspaceMemberScalarWhereWithAggregatesInput = {
    AND?: WorkspaceMemberScalarWhereWithAggregatesInput | WorkspaceMemberScalarWhereWithAggregatesInput[]
    OR?: WorkspaceMemberScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceMemberScalarWhereWithAggregatesInput | WorkspaceMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    isWorkspaceOwner?: BoolWithAggregatesFilter<"WorkspaceMember"> | boolean
    workspaceId?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    userId?: StringWithAggregatesFilter<"WorkspaceMember"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WorkspaceMember"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkspaceMember"> | Date | string
  }

  export type WorkspaceMemberInviteWhereInput = {
    AND?: WorkspaceMemberInviteWhereInput | WorkspaceMemberInviteWhereInput[]
    OR?: WorkspaceMemberInviteWhereInput[]
    NOT?: WorkspaceMemberInviteWhereInput | WorkspaceMemberInviteWhereInput[]
    id?: StringFilter<"WorkspaceMemberInvite"> | string
    email?: StringFilter<"WorkspaceMemberInvite"> | string
    workspaceId?: StringFilter<"WorkspaceMemberInvite"> | string
    createdAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }

  export type WorkspaceMemberInviteOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type WorkspaceMemberInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workspaceId_email?: WorkspaceMemberInviteWorkspaceIdEmailCompoundUniqueInput
    AND?: WorkspaceMemberInviteWhereInput | WorkspaceMemberInviteWhereInput[]
    OR?: WorkspaceMemberInviteWhereInput[]
    NOT?: WorkspaceMemberInviteWhereInput | WorkspaceMemberInviteWhereInput[]
    email?: StringFilter<"WorkspaceMemberInvite"> | string
    workspaceId?: StringFilter<"WorkspaceMemberInvite"> | string
    createdAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }, "id" | "workspaceId_email">

  export type WorkspaceMemberInviteOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceMemberInviteCountOrderByAggregateInput
    _max?: WorkspaceMemberInviteMaxOrderByAggregateInput
    _min?: WorkspaceMemberInviteMinOrderByAggregateInput
  }

  export type WorkspaceMemberInviteScalarWhereWithAggregatesInput = {
    AND?: WorkspaceMemberInviteScalarWhereWithAggregatesInput | WorkspaceMemberInviteScalarWhereWithAggregatesInput[]
    OR?: WorkspaceMemberInviteScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceMemberInviteScalarWhereWithAggregatesInput | WorkspaceMemberInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkspaceMemberInvite"> | string
    email?: StringWithAggregatesFilter<"WorkspaceMemberInvite"> | string
    workspaceId?: StringWithAggregatesFilter<"WorkspaceMemberInvite"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WorkspaceMemberInvite"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkspaceMemberInvite"> | Date | string
  }

  export type WorkspaceTicketLabelWhereInput = {
    AND?: WorkspaceTicketLabelWhereInput | WorkspaceTicketLabelWhereInput[]
    OR?: WorkspaceTicketLabelWhereInput[]
    NOT?: WorkspaceTicketLabelWhereInput | WorkspaceTicketLabelWhereInput[]
    id?: StringFilter<"WorkspaceTicketLabel"> | string
    name?: StringFilter<"WorkspaceTicketLabel"> | string
    workspaceId?: StringFilter<"WorkspaceTicketLabel"> | string
    createdAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    ticketLabels?: TicketLabelListRelationFilter
  }

  export type WorkspaceTicketLabelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    ticketLabels?: TicketLabelOrderByRelationAggregateInput
  }

  export type WorkspaceTicketLabelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceTicketLabelWhereInput | WorkspaceTicketLabelWhereInput[]
    OR?: WorkspaceTicketLabelWhereInput[]
    NOT?: WorkspaceTicketLabelWhereInput | WorkspaceTicketLabelWhereInput[]
    name?: StringFilter<"WorkspaceTicketLabel"> | string
    workspaceId?: StringFilter<"WorkspaceTicketLabel"> | string
    createdAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    ticketLabels?: TicketLabelListRelationFilter
  }, "id">

  export type WorkspaceTicketLabelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceTicketLabelCountOrderByAggregateInput
    _max?: WorkspaceTicketLabelMaxOrderByAggregateInput
    _min?: WorkspaceTicketLabelMinOrderByAggregateInput
  }

  export type WorkspaceTicketLabelScalarWhereWithAggregatesInput = {
    AND?: WorkspaceTicketLabelScalarWhereWithAggregatesInput | WorkspaceTicketLabelScalarWhereWithAggregatesInput[]
    OR?: WorkspaceTicketLabelScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceTicketLabelScalarWhereWithAggregatesInput | WorkspaceTicketLabelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkspaceTicketLabel"> | string
    name?: StringWithAggregatesFilter<"WorkspaceTicketLabel"> | string
    workspaceId?: StringWithAggregatesFilter<"WorkspaceTicketLabel"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WorkspaceTicketLabel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkspaceTicketLabel"> | Date | string
  }

  export type TicketListWhereInput = {
    AND?: TicketListWhereInput | TicketListWhereInput[]
    OR?: TicketListWhereInput[]
    NOT?: TicketListWhereInput | TicketListWhereInput[]
    id?: StringFilter<"TicketList"> | string
    name?: StringFilter<"TicketList"> | string
    workspaceId?: StringFilter<"TicketList"> | string
    createdAt?: DateTimeFilter<"TicketList"> | Date | string
    updatedAt?: DateTimeFilter<"TicketList"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    tickets?: TicketListRelationFilter
  }

  export type TicketListOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    tickets?: TicketOrderByRelationAggregateInput
  }

  export type TicketListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketListWhereInput | TicketListWhereInput[]
    OR?: TicketListWhereInput[]
    NOT?: TicketListWhereInput | TicketListWhereInput[]
    name?: StringFilter<"TicketList"> | string
    workspaceId?: StringFilter<"TicketList"> | string
    createdAt?: DateTimeFilter<"TicketList"> | Date | string
    updatedAt?: DateTimeFilter<"TicketList"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    tickets?: TicketListRelationFilter
  }, "id">

  export type TicketListOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketListCountOrderByAggregateInput
    _max?: TicketListMaxOrderByAggregateInput
    _min?: TicketListMinOrderByAggregateInput
  }

  export type TicketListScalarWhereWithAggregatesInput = {
    AND?: TicketListScalarWhereWithAggregatesInput | TicketListScalarWhereWithAggregatesInput[]
    OR?: TicketListScalarWhereWithAggregatesInput[]
    NOT?: TicketListScalarWhereWithAggregatesInput | TicketListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketList"> | string
    name?: StringWithAggregatesFilter<"TicketList"> | string
    workspaceId?: StringWithAggregatesFilter<"TicketList"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TicketList"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TicketList"> | Date | string
  }

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    id?: StringFilter<"Ticket"> | string
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    workspaceId?: StringFilter<"Ticket"> | string
    ticketListId?: StringFilter<"Ticket"> | string
    assigneeId?: StringNullableFilter<"Ticket"> | string | null
    reporterId?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    ticketList?: XOR<TicketListScalarRelationFilter, TicketListWhereInput>
    assignee?: XOR<WorkspaceMemberNullableScalarRelationFilter, WorkspaceMemberWhereInput> | null
    reporter?: XOR<WorkspaceMemberScalarRelationFilter, WorkspaceMemberWhereInput>
    attachments?: TicketAttachmentListRelationFilter
    comments?: TicketCommentListRelationFilter
    labels?: TicketLabelListRelationFilter
  }

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    workspaceId?: SortOrder
    ticketListId?: SortOrder
    assigneeId?: SortOrderInput | SortOrder
    reporterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    ticketList?: TicketListOrderByWithRelationInput
    assignee?: WorkspaceMemberOrderByWithRelationInput
    reporter?: WorkspaceMemberOrderByWithRelationInput
    attachments?: TicketAttachmentOrderByRelationAggregateInput
    comments?: TicketCommentOrderByRelationAggregateInput
    labels?: TicketLabelOrderByRelationAggregateInput
  }

  export type TicketWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketWhereInput | TicketWhereInput[]
    OR?: TicketWhereInput[]
    NOT?: TicketWhereInput | TicketWhereInput[]
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    workspaceId?: StringFilter<"Ticket"> | string
    ticketListId?: StringFilter<"Ticket"> | string
    assigneeId?: StringNullableFilter<"Ticket"> | string | null
    reporterId?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    ticketList?: XOR<TicketListScalarRelationFilter, TicketListWhereInput>
    assignee?: XOR<WorkspaceMemberNullableScalarRelationFilter, WorkspaceMemberWhereInput> | null
    reporter?: XOR<WorkspaceMemberScalarRelationFilter, WorkspaceMemberWhereInput>
    attachments?: TicketAttachmentListRelationFilter
    comments?: TicketCommentListRelationFilter
    labels?: TicketLabelListRelationFilter
  }, "id">

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    workspaceId?: SortOrder
    ticketListId?: SortOrder
    assigneeId?: SortOrderInput | SortOrder
    reporterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketCountOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    OR?: TicketScalarWhereWithAggregatesInput[]
    NOT?: TicketScalarWhereWithAggregatesInput | TicketScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Ticket"> | string
    title?: StringWithAggregatesFilter<"Ticket"> | string
    description?: StringWithAggregatesFilter<"Ticket"> | string
    workspaceId?: StringWithAggregatesFilter<"Ticket"> | string
    ticketListId?: StringWithAggregatesFilter<"Ticket"> | string
    assigneeId?: StringNullableWithAggregatesFilter<"Ticket"> | string | null
    reporterId?: StringWithAggregatesFilter<"Ticket"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Ticket"> | Date | string
  }

  export type TicketAttachmentWhereInput = {
    AND?: TicketAttachmentWhereInput | TicketAttachmentWhereInput[]
    OR?: TicketAttachmentWhereInput[]
    NOT?: TicketAttachmentWhereInput | TicketAttachmentWhereInput[]
    id?: StringFilter<"TicketAttachment"> | string
    ticketId?: StringFilter<"TicketAttachment"> | string
    workspaceId?: StringFilter<"TicketAttachment"> | string
    key?: StringFilter<"TicketAttachment"> | string
    name?: StringFilter<"TicketAttachment"> | string
    size?: IntFilter<"TicketAttachment"> | number
    createdAt?: DateTimeFilter<"TicketAttachment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketAttachment"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }

  export type TicketAttachmentOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    name?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type TicketAttachmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketAttachmentWhereInput | TicketAttachmentWhereInput[]
    OR?: TicketAttachmentWhereInput[]
    NOT?: TicketAttachmentWhereInput | TicketAttachmentWhereInput[]
    ticketId?: StringFilter<"TicketAttachment"> | string
    workspaceId?: StringFilter<"TicketAttachment"> | string
    key?: StringFilter<"TicketAttachment"> | string
    name?: StringFilter<"TicketAttachment"> | string
    size?: IntFilter<"TicketAttachment"> | number
    createdAt?: DateTimeFilter<"TicketAttachment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketAttachment"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }, "id">

  export type TicketAttachmentOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    name?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketAttachmentCountOrderByAggregateInput
    _avg?: TicketAttachmentAvgOrderByAggregateInput
    _max?: TicketAttachmentMaxOrderByAggregateInput
    _min?: TicketAttachmentMinOrderByAggregateInput
    _sum?: TicketAttachmentSumOrderByAggregateInput
  }

  export type TicketAttachmentScalarWhereWithAggregatesInput = {
    AND?: TicketAttachmentScalarWhereWithAggregatesInput | TicketAttachmentScalarWhereWithAggregatesInput[]
    OR?: TicketAttachmentScalarWhereWithAggregatesInput[]
    NOT?: TicketAttachmentScalarWhereWithAggregatesInput | TicketAttachmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketAttachment"> | string
    ticketId?: StringWithAggregatesFilter<"TicketAttachment"> | string
    workspaceId?: StringWithAggregatesFilter<"TicketAttachment"> | string
    key?: StringWithAggregatesFilter<"TicketAttachment"> | string
    name?: StringWithAggregatesFilter<"TicketAttachment"> | string
    size?: IntWithAggregatesFilter<"TicketAttachment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TicketAttachment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TicketAttachment"> | Date | string
  }

  export type TicketCommentWhereInput = {
    AND?: TicketCommentWhereInput | TicketCommentWhereInput[]
    OR?: TicketCommentWhereInput[]
    NOT?: TicketCommentWhereInput | TicketCommentWhereInput[]
    id?: StringFilter<"TicketComment"> | string
    ticketId?: StringFilter<"TicketComment"> | string
    workspaceId?: StringFilter<"TicketComment"> | string
    content?: StringFilter<"TicketComment"> | string
    createdAt?: DateTimeFilter<"TicketComment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketComment"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }

  export type TicketCommentOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type TicketCommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TicketCommentWhereInput | TicketCommentWhereInput[]
    OR?: TicketCommentWhereInput[]
    NOT?: TicketCommentWhereInput | TicketCommentWhereInput[]
    ticketId?: StringFilter<"TicketComment"> | string
    workspaceId?: StringFilter<"TicketComment"> | string
    content?: StringFilter<"TicketComment"> | string
    createdAt?: DateTimeFilter<"TicketComment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketComment"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }, "id">

  export type TicketCommentOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketCommentCountOrderByAggregateInput
    _max?: TicketCommentMaxOrderByAggregateInput
    _min?: TicketCommentMinOrderByAggregateInput
  }

  export type TicketCommentScalarWhereWithAggregatesInput = {
    AND?: TicketCommentScalarWhereWithAggregatesInput | TicketCommentScalarWhereWithAggregatesInput[]
    OR?: TicketCommentScalarWhereWithAggregatesInput[]
    NOT?: TicketCommentScalarWhereWithAggregatesInput | TicketCommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketComment"> | string
    ticketId?: StringWithAggregatesFilter<"TicketComment"> | string
    workspaceId?: StringWithAggregatesFilter<"TicketComment"> | string
    content?: StringWithAggregatesFilter<"TicketComment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TicketComment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TicketComment"> | Date | string
  }

  export type TicketLabelWhereInput = {
    AND?: TicketLabelWhereInput | TicketLabelWhereInput[]
    OR?: TicketLabelWhereInput[]
    NOT?: TicketLabelWhereInput | TicketLabelWhereInput[]
    id?: StringFilter<"TicketLabel"> | string
    ticketId?: StringFilter<"TicketLabel"> | string
    workspaceId?: StringFilter<"TicketLabel"> | string
    labelId?: StringFilter<"TicketLabel"> | string
    createdAt?: DateTimeFilter<"TicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"TicketLabel"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    label?: XOR<WorkspaceTicketLabelScalarRelationFilter, WorkspaceTicketLabelWhereInput>
  }

  export type TicketLabelOrderByWithRelationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    workspace?: WorkspaceOrderByWithRelationInput
    label?: WorkspaceTicketLabelOrderByWithRelationInput
  }

  export type TicketLabelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workspaceId_ticketId_labelId?: TicketLabelWorkspaceIdTicketIdLabelIdCompoundUniqueInput
    AND?: TicketLabelWhereInput | TicketLabelWhereInput[]
    OR?: TicketLabelWhereInput[]
    NOT?: TicketLabelWhereInput | TicketLabelWhereInput[]
    ticketId?: StringFilter<"TicketLabel"> | string
    workspaceId?: StringFilter<"TicketLabel"> | string
    labelId?: StringFilter<"TicketLabel"> | string
    createdAt?: DateTimeFilter<"TicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"TicketLabel"> | Date | string
    ticket?: XOR<TicketScalarRelationFilter, TicketWhereInput>
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    label?: XOR<WorkspaceTicketLabelScalarRelationFilter, WorkspaceTicketLabelWhereInput>
  }, "id" | "workspaceId_ticketId_labelId">

  export type TicketLabelOrderByWithAggregationInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TicketLabelCountOrderByAggregateInput
    _max?: TicketLabelMaxOrderByAggregateInput
    _min?: TicketLabelMinOrderByAggregateInput
  }

  export type TicketLabelScalarWhereWithAggregatesInput = {
    AND?: TicketLabelScalarWhereWithAggregatesInput | TicketLabelScalarWhereWithAggregatesInput[]
    OR?: TicketLabelScalarWhereWithAggregatesInput[]
    NOT?: TicketLabelScalarWhereWithAggregatesInput | TicketLabelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TicketLabel"> | string
    ticketId?: StringWithAggregatesFilter<"TicketLabel"> | string
    workspaceId?: StringWithAggregatesFilter<"TicketLabel"> | string
    labelId?: StringWithAggregatesFilter<"TicketLabel"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TicketLabel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TicketLabel"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUncheckedCreateInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateManyInput = {
    id: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberCreateInput = {
    id: string
    isWorkspaceOwner?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
    assignedTickets?: TicketCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketCreateNestedManyWithoutReporterInput
    user: UserCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketUncheckedCreateNestedManyWithoutReporterInput
  }

  export type WorkspaceMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUpdateManyWithoutReporterNestedInput
    user?: UserUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type WorkspaceMemberCreateManyInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteCreateInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutWorkspaceMemberInvitesInput
  }

  export type WorkspaceMemberInviteUncheckedCreateInput = {
    id: string
    email: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutWorkspaceMemberInvitesNestedInput
  }

  export type WorkspaceMemberInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteCreateManyInput = {
    id: string
    email: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceTicketLabelCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutWorkspaceTicketLabelsInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutLabelInput
  }

  export type WorkspaceTicketLabelUncheckedCreateInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutLabelInput
  }

  export type WorkspaceTicketLabelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutWorkspaceTicketLabelsNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutLabelNestedInput
  }

  export type WorkspaceTicketLabelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutLabelNestedInput
  }

  export type WorkspaceTicketLabelCreateManyInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceTicketLabelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceTicketLabelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketListCreateInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketListsInput
    tickets?: TicketCreateNestedManyWithoutTicketListInput
  }

  export type TicketListUncheckedCreateInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutTicketListInput
  }

  export type TicketListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketListsNestedInput
    tickets?: TicketUpdateManyWithoutTicketListNestedInput
  }

  export type TicketListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutTicketListNestedInput
  }

  export type TicketListCreateManyInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketCreateManyInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentCreateInput = {
    id: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutAttachmentsInput
    workspace: WorkspaceCreateNestedOneWithoutTicketAttachmentsInput
  }

  export type TicketAttachmentUncheckedCreateInput = {
    id: string
    ticketId: string
    workspaceId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutAttachmentsNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketAttachmentsNestedInput
  }

  export type TicketAttachmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentCreateManyInput = {
    id: string
    ticketId: string
    workspaceId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentCreateInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutCommentsInput
    workspace: WorkspaceCreateNestedOneWithoutTicketCommentsInput
  }

  export type TicketCommentUncheckedCreateInput = {
    id: string
    ticketId: string
    workspaceId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutCommentsNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketCommentsNestedInput
  }

  export type TicketCommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentCreateManyInput = {
    id: string
    ticketId: string
    workspaceId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelCreateInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutLabelsInput
    workspace: WorkspaceCreateNestedOneWithoutTicketLabelsInput
    label: WorkspaceTicketLabelCreateNestedOneWithoutTicketLabelsInput
  }

  export type TicketLabelUncheckedCreateInput = {
    id: string
    ticketId: string
    workspaceId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutLabelsNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketLabelsNestedInput
    label?: WorkspaceTicketLabelUpdateOneRequiredWithoutTicketLabelsNestedInput
  }

  export type TicketLabelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelCreateManyInput = {
    id: string
    ticketId: string
    workspaceId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type WorkspaceMemberListRelationFilter = {
    every?: WorkspaceMemberWhereInput
    some?: WorkspaceMemberWhereInput
    none?: WorkspaceMemberWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type TicketListListRelationFilter = {
    every?: TicketListWhereInput
    some?: TicketListWhereInput
    none?: TicketListWhereInput
  }

  export type TicketAttachmentListRelationFilter = {
    every?: TicketAttachmentWhereInput
    some?: TicketAttachmentWhereInput
    none?: TicketAttachmentWhereInput
  }

  export type TicketCommentListRelationFilter = {
    every?: TicketCommentWhereInput
    some?: TicketCommentWhereInput
    none?: TicketCommentWhereInput
  }

  export type TicketLabelListRelationFilter = {
    every?: TicketLabelWhereInput
    some?: TicketLabelWhereInput
    none?: TicketLabelWhereInput
  }

  export type WorkspaceTicketLabelListRelationFilter = {
    every?: WorkspaceTicketLabelWhereInput
    some?: WorkspaceTicketLabelWhereInput
    none?: WorkspaceTicketLabelWhereInput
  }

  export type WorkspaceMemberInviteListRelationFilter = {
    every?: WorkspaceMemberInviteWhereInput
    some?: WorkspaceMemberInviteWhereInput
    none?: WorkspaceMemberInviteWhereInput
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketAttachmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketCommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketLabelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceTicketLabelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceMemberInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceScalarRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type WorkspaceMemberWorkspaceIdUserIdCompoundUniqueInput = {
    workspaceId: string
    userId: string
  }

  export type WorkspaceMemberCountOrderByAggregateInput = {
    id?: SortOrder
    isWorkspaceOwner?: SortOrder
    workspaceId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    isWorkspaceOwner?: SortOrder
    workspaceId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMemberMinOrderByAggregateInput = {
    id?: SortOrder
    isWorkspaceOwner?: SortOrder
    workspaceId?: SortOrder
    userId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMemberInviteWorkspaceIdEmailCompoundUniqueInput = {
    workspaceId: string
    email: string
  }

  export type WorkspaceMemberInviteCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMemberInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMemberInviteMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceTicketLabelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceTicketLabelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceTicketLabelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketListCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketListMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketListMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    workspaceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketListScalarRelationFilter = {
    is?: TicketListWhereInput
    isNot?: TicketListWhereInput
  }

  export type WorkspaceMemberNullableScalarRelationFilter = {
    is?: WorkspaceMemberWhereInput | null
    isNot?: WorkspaceMemberWhereInput | null
  }

  export type WorkspaceMemberScalarRelationFilter = {
    is?: WorkspaceMemberWhereInput
    isNot?: WorkspaceMemberWhereInput
  }

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    workspaceId?: SortOrder
    ticketListId?: SortOrder
    assigneeId?: SortOrder
    reporterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    workspaceId?: SortOrder
    ticketListId?: SortOrder
    assigneeId?: SortOrder
    reporterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    workspaceId?: SortOrder
    ticketListId?: SortOrder
    assigneeId?: SortOrder
    reporterId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type TicketScalarRelationFilter = {
    is?: TicketWhereInput
    isNot?: TicketWhereInput
  }

  export type TicketAttachmentCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    name?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketAttachmentAvgOrderByAggregateInput = {
    size?: SortOrder
  }

  export type TicketAttachmentMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    name?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketAttachmentMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    name?: SortOrder
    size?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketAttachmentSumOrderByAggregateInput = {
    size?: SortOrder
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

  export type TicketCommentCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketCommentMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketCommentMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceTicketLabelScalarRelationFilter = {
    is?: WorkspaceTicketLabelWhereInput
    isNot?: WorkspaceTicketLabelWhereInput
  }

  export type TicketLabelWorkspaceIdTicketIdLabelIdCompoundUniqueInput = {
    workspaceId: string
    ticketId: string
    labelId: string
  }

  export type TicketLabelCountOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketLabelMaxOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TicketLabelMinOrderByAggregateInput = {
    id?: SortOrder
    ticketId?: SortOrder
    workspaceId?: SortOrder
    labelId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type WorkspaceMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
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

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type WorkspaceMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutUserInput | WorkspaceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
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

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput> | WorkspaceMemberCreateWithoutUserInput[] | WorkspaceMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutUserInput | WorkspaceMemberCreateOrConnectWithoutUserInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput | WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WorkspaceMemberCreateManyUserInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput | WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutUserInput | WorkspaceMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type WorkspaceMemberCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type TicketCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput> | TicketCreateWithoutWorkspaceInput[] | TicketUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutWorkspaceInput | TicketCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketCreateManyWorkspaceInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketListCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput> | TicketListCreateWithoutWorkspaceInput[] | TicketListUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketListCreateOrConnectWithoutWorkspaceInput | TicketListCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketListCreateManyWorkspaceInputEnvelope
    connect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
  }

  export type TicketAttachmentCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput> | TicketAttachmentCreateWithoutWorkspaceInput[] | TicketAttachmentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutWorkspaceInput | TicketAttachmentCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketAttachmentCreateManyWorkspaceInputEnvelope
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
  }

  export type TicketCommentCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput> | TicketCommentCreateWithoutWorkspaceInput[] | TicketCommentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutWorkspaceInput | TicketCommentCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketCommentCreateManyWorkspaceInputEnvelope
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
  }

  export type TicketLabelCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput> | TicketLabelCreateWithoutWorkspaceInput[] | TicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutWorkspaceInput | TicketLabelCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketLabelCreateManyWorkspaceInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput> | WorkspaceTicketLabelCreateWithoutWorkspaceInput[] | WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput | WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceTicketLabelCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
  }

  export type WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberInviteCreateWithoutWorkspaceInput[] | WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberInviteCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
  }

  export type WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput> | TicketCreateWithoutWorkspaceInput[] | TicketUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutWorkspaceInput | TicketCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketCreateManyWorkspaceInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketListUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput> | TicketListCreateWithoutWorkspaceInput[] | TicketListUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketListCreateOrConnectWithoutWorkspaceInput | TicketListCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketListCreateManyWorkspaceInputEnvelope
    connect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
  }

  export type TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput> | TicketAttachmentCreateWithoutWorkspaceInput[] | TicketAttachmentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutWorkspaceInput | TicketAttachmentCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketAttachmentCreateManyWorkspaceInputEnvelope
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
  }

  export type TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput> | TicketCommentCreateWithoutWorkspaceInput[] | TicketCommentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutWorkspaceInput | TicketCommentCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketCommentCreateManyWorkspaceInputEnvelope
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
  }

  export type TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput> | TicketLabelCreateWithoutWorkspaceInput[] | TicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutWorkspaceInput | TicketLabelCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TicketLabelCreateManyWorkspaceInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput> | WorkspaceTicketLabelCreateWithoutWorkspaceInput[] | WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput | WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceTicketLabelCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
  }

  export type WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberInviteCreateWithoutWorkspaceInput[] | WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberInviteCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
  }

  export type WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type TicketUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput> | TicketCreateWithoutWorkspaceInput[] | TicketUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutWorkspaceInput | TicketCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutWorkspaceInput | TicketUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketCreateManyWorkspaceInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutWorkspaceInput | TicketUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutWorkspaceInput | TicketUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketListUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput> | TicketListCreateWithoutWorkspaceInput[] | TicketListUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketListCreateOrConnectWithoutWorkspaceInput | TicketListCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketListUpsertWithWhereUniqueWithoutWorkspaceInput | TicketListUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketListCreateManyWorkspaceInputEnvelope
    set?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    disconnect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    delete?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    connect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    update?: TicketListUpdateWithWhereUniqueWithoutWorkspaceInput | TicketListUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketListUpdateManyWithWhereWithoutWorkspaceInput | TicketListUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketListScalarWhereInput | TicketListScalarWhereInput[]
  }

  export type TicketAttachmentUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput> | TicketAttachmentCreateWithoutWorkspaceInput[] | TicketAttachmentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutWorkspaceInput | TicketAttachmentCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketAttachmentUpsertWithWhereUniqueWithoutWorkspaceInput | TicketAttachmentUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketAttachmentCreateManyWorkspaceInputEnvelope
    set?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    disconnect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    delete?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    update?: TicketAttachmentUpdateWithWhereUniqueWithoutWorkspaceInput | TicketAttachmentUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketAttachmentUpdateManyWithWhereWithoutWorkspaceInput | TicketAttachmentUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
  }

  export type TicketCommentUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput> | TicketCommentCreateWithoutWorkspaceInput[] | TicketCommentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutWorkspaceInput | TicketCommentCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketCommentUpsertWithWhereUniqueWithoutWorkspaceInput | TicketCommentUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketCommentCreateManyWorkspaceInputEnvelope
    set?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    disconnect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    delete?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    update?: TicketCommentUpdateWithWhereUniqueWithoutWorkspaceInput | TicketCommentUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketCommentUpdateManyWithWhereWithoutWorkspaceInput | TicketCommentUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
  }

  export type TicketLabelUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput> | TicketLabelCreateWithoutWorkspaceInput[] | TicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutWorkspaceInput | TicketLabelCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput | TicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketLabelCreateManyWorkspaceInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput | TicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutWorkspaceInput | TicketLabelUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput> | WorkspaceTicketLabelCreateWithoutWorkspaceInput[] | WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput | WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceTicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceTicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceTicketLabelCreateManyWorkspaceInputEnvelope
    set?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    disconnect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    delete?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    connect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    update?: WorkspaceTicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceTicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceTicketLabelUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceTicketLabelUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceTicketLabelScalarWhereInput | WorkspaceTicketLabelScalarWhereInput[]
  }

  export type WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberInviteCreateWithoutWorkspaceInput[] | WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberInviteUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberInviteUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberInviteCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    disconnect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    delete?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    connect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    update?: WorkspaceMemberInviteUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberInviteUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberInviteUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberInviteUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberInviteScalarWhereInput | WorkspaceMemberInviteScalarWhereInput[]
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberCreateWithoutWorkspaceInput[] | WorkspaceMemberUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    disconnect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    delete?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    connect?: WorkspaceMemberWhereUniqueInput | WorkspaceMemberWhereUniqueInput[]
    update?: WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput> | TicketCreateWithoutWorkspaceInput[] | TicketUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutWorkspaceInput | TicketCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutWorkspaceInput | TicketUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketCreateManyWorkspaceInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutWorkspaceInput | TicketUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutWorkspaceInput | TicketUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput> | TicketListCreateWithoutWorkspaceInput[] | TicketListUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketListCreateOrConnectWithoutWorkspaceInput | TicketListCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketListUpsertWithWhereUniqueWithoutWorkspaceInput | TicketListUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketListCreateManyWorkspaceInputEnvelope
    set?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    disconnect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    delete?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    connect?: TicketListWhereUniqueInput | TicketListWhereUniqueInput[]
    update?: TicketListUpdateWithWhereUniqueWithoutWorkspaceInput | TicketListUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketListUpdateManyWithWhereWithoutWorkspaceInput | TicketListUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketListScalarWhereInput | TicketListScalarWhereInput[]
  }

  export type TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput> | TicketAttachmentCreateWithoutWorkspaceInput[] | TicketAttachmentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutWorkspaceInput | TicketAttachmentCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketAttachmentUpsertWithWhereUniqueWithoutWorkspaceInput | TicketAttachmentUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketAttachmentCreateManyWorkspaceInputEnvelope
    set?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    disconnect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    delete?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    update?: TicketAttachmentUpdateWithWhereUniqueWithoutWorkspaceInput | TicketAttachmentUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketAttachmentUpdateManyWithWhereWithoutWorkspaceInput | TicketAttachmentUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
  }

  export type TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput> | TicketCommentCreateWithoutWorkspaceInput[] | TicketCommentUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutWorkspaceInput | TicketCommentCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketCommentUpsertWithWhereUniqueWithoutWorkspaceInput | TicketCommentUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketCommentCreateManyWorkspaceInputEnvelope
    set?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    disconnect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    delete?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    update?: TicketCommentUpdateWithWhereUniqueWithoutWorkspaceInput | TicketCommentUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketCommentUpdateManyWithWhereWithoutWorkspaceInput | TicketCommentUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
  }

  export type TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput> | TicketLabelCreateWithoutWorkspaceInput[] | TicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutWorkspaceInput | TicketLabelCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput | TicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TicketLabelCreateManyWorkspaceInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput | TicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutWorkspaceInput | TicketLabelUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput> | WorkspaceTicketLabelCreateWithoutWorkspaceInput[] | WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput | WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceTicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceTicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceTicketLabelCreateManyWorkspaceInputEnvelope
    set?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    disconnect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    delete?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    connect?: WorkspaceTicketLabelWhereUniqueInput | WorkspaceTicketLabelWhereUniqueInput[]
    update?: WorkspaceTicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceTicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceTicketLabelUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceTicketLabelUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceTicketLabelScalarWhereInput | WorkspaceTicketLabelScalarWhereInput[]
  }

  export type WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput> | WorkspaceMemberInviteCreateWithoutWorkspaceInput[] | WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput | WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceMemberInviteUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberInviteUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceMemberInviteCreateManyWorkspaceInputEnvelope
    set?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    disconnect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    delete?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    connect?: WorkspaceMemberInviteWhereUniqueInput | WorkspaceMemberInviteWhereUniqueInput[]
    update?: WorkspaceMemberInviteUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceMemberInviteUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceMemberInviteUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceMemberInviteUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceMemberInviteScalarWhereInput | WorkspaceMemberInviteScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutMembersInput = {
    create?: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutMembersInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TicketCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput> | TicketCreateWithoutAssigneeInput[] | TicketUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssigneeInput | TicketCreateOrConnectWithoutAssigneeInput[]
    createMany?: TicketCreateManyAssigneeInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketCreateNestedManyWithoutReporterInput = {
    create?: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput> | TicketCreateWithoutReporterInput[] | TicketUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutReporterInput | TicketCreateOrConnectWithoutReporterInput[]
    createMany?: TicketCreateManyReporterInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutMembersInput = {
    create?: XOR<UserCreateWithoutMembersInput, UserUncheckedCreateWithoutMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembersInput
    connect?: UserWhereUniqueInput
  }

  export type TicketUncheckedCreateNestedManyWithoutAssigneeInput = {
    create?: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput> | TicketCreateWithoutAssigneeInput[] | TicketUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssigneeInput | TicketCreateOrConnectWithoutAssigneeInput[]
    createMany?: TicketCreateManyAssigneeInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutReporterInput = {
    create?: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput> | TicketCreateWithoutReporterInput[] | TicketUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutReporterInput | TicketCreateOrConnectWithoutReporterInput[]
    createMany?: TicketCreateManyReporterInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutMembersInput
    upsert?: WorkspaceUpsertWithoutMembersInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutMembersInput, WorkspaceUpdateWithoutMembersInput>, WorkspaceUncheckedUpdateWithoutMembersInput>
  }

  export type TicketUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput> | TicketCreateWithoutAssigneeInput[] | TicketUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssigneeInput | TicketCreateOrConnectWithoutAssigneeInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssigneeInput | TicketUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TicketCreateManyAssigneeInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssigneeInput | TicketUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssigneeInput | TicketUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketUpdateManyWithoutReporterNestedInput = {
    create?: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput> | TicketCreateWithoutReporterInput[] | TicketUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutReporterInput | TicketCreateOrConnectWithoutReporterInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutReporterInput | TicketUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: TicketCreateManyReporterInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutReporterInput | TicketUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutReporterInput | TicketUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<UserCreateWithoutMembersInput, UserUncheckedCreateWithoutMembersInput>
    connectOrCreate?: UserCreateOrConnectWithoutMembersInput
    upsert?: UserUpsertWithoutMembersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMembersInput, UserUpdateWithoutMembersInput>, UserUncheckedUpdateWithoutMembersInput>
  }

  export type TicketUncheckedUpdateManyWithoutAssigneeNestedInput = {
    create?: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput> | TicketCreateWithoutAssigneeInput[] | TicketUncheckedCreateWithoutAssigneeInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutAssigneeInput | TicketCreateOrConnectWithoutAssigneeInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutAssigneeInput | TicketUpsertWithWhereUniqueWithoutAssigneeInput[]
    createMany?: TicketCreateManyAssigneeInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutAssigneeInput | TicketUpdateWithWhereUniqueWithoutAssigneeInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutAssigneeInput | TicketUpdateManyWithWhereWithoutAssigneeInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutReporterNestedInput = {
    create?: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput> | TicketCreateWithoutReporterInput[] | TicketUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutReporterInput | TicketCreateOrConnectWithoutReporterInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutReporterInput | TicketUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: TicketCreateManyReporterInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutReporterInput | TicketUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutReporterInput | TicketUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutWorkspaceMemberInvitesInput = {
    create?: XOR<WorkspaceCreateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedCreateWithoutWorkspaceMemberInvitesInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutWorkspaceMemberInvitesInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type WorkspaceUpdateOneRequiredWithoutWorkspaceMemberInvitesNestedInput = {
    create?: XOR<WorkspaceCreateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedCreateWithoutWorkspaceMemberInvitesInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutWorkspaceMemberInvitesInput
    upsert?: WorkspaceUpsertWithoutWorkspaceMemberInvitesInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutWorkspaceMemberInvitesInput, WorkspaceUpdateWithoutWorkspaceMemberInvitesInput>, WorkspaceUncheckedUpdateWithoutWorkspaceMemberInvitesInput>
  }

  export type WorkspaceCreateNestedOneWithoutWorkspaceTicketLabelsInput = {
    create?: XOR<WorkspaceCreateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedCreateWithoutWorkspaceTicketLabelsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutWorkspaceTicketLabelsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TicketLabelCreateNestedManyWithoutLabelInput = {
    create?: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput> | TicketLabelCreateWithoutLabelInput[] | TicketLabelUncheckedCreateWithoutLabelInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutLabelInput | TicketLabelCreateOrConnectWithoutLabelInput[]
    createMany?: TicketLabelCreateManyLabelInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type TicketLabelUncheckedCreateNestedManyWithoutLabelInput = {
    create?: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput> | TicketLabelCreateWithoutLabelInput[] | TicketLabelUncheckedCreateWithoutLabelInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutLabelInput | TicketLabelCreateOrConnectWithoutLabelInput[]
    createMany?: TicketLabelCreateManyLabelInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutWorkspaceTicketLabelsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedCreateWithoutWorkspaceTicketLabelsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutWorkspaceTicketLabelsInput
    upsert?: WorkspaceUpsertWithoutWorkspaceTicketLabelsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutWorkspaceTicketLabelsInput, WorkspaceUpdateWithoutWorkspaceTicketLabelsInput>, WorkspaceUncheckedUpdateWithoutWorkspaceTicketLabelsInput>
  }

  export type TicketLabelUpdateManyWithoutLabelNestedInput = {
    create?: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput> | TicketLabelCreateWithoutLabelInput[] | TicketLabelUncheckedCreateWithoutLabelInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutLabelInput | TicketLabelCreateOrConnectWithoutLabelInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutLabelInput | TicketLabelUpsertWithWhereUniqueWithoutLabelInput[]
    createMany?: TicketLabelCreateManyLabelInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutLabelInput | TicketLabelUpdateWithWhereUniqueWithoutLabelInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutLabelInput | TicketLabelUpdateManyWithWhereWithoutLabelInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type TicketLabelUncheckedUpdateManyWithoutLabelNestedInput = {
    create?: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput> | TicketLabelCreateWithoutLabelInput[] | TicketLabelUncheckedCreateWithoutLabelInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutLabelInput | TicketLabelCreateOrConnectWithoutLabelInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutLabelInput | TicketLabelUpsertWithWhereUniqueWithoutLabelInput[]
    createMany?: TicketLabelCreateManyLabelInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutLabelInput | TicketLabelUpdateWithWhereUniqueWithoutLabelInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutLabelInput | TicketLabelUpdateManyWithWhereWithoutLabelInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutTicketListsInput = {
    create?: XOR<WorkspaceCreateWithoutTicketListsInput, WorkspaceUncheckedCreateWithoutTicketListsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketListsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TicketCreateNestedManyWithoutTicketListInput = {
    create?: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput> | TicketCreateWithoutTicketListInput[] | TicketUncheckedCreateWithoutTicketListInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutTicketListInput | TicketCreateOrConnectWithoutTicketListInput[]
    createMany?: TicketCreateManyTicketListInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type TicketUncheckedCreateNestedManyWithoutTicketListInput = {
    create?: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput> | TicketCreateWithoutTicketListInput[] | TicketUncheckedCreateWithoutTicketListInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutTicketListInput | TicketCreateOrConnectWithoutTicketListInput[]
    createMany?: TicketCreateManyTicketListInputEnvelope
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutTicketListsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTicketListsInput, WorkspaceUncheckedCreateWithoutTicketListsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketListsInput
    upsert?: WorkspaceUpsertWithoutTicketListsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTicketListsInput, WorkspaceUpdateWithoutTicketListsInput>, WorkspaceUncheckedUpdateWithoutTicketListsInput>
  }

  export type TicketUpdateManyWithoutTicketListNestedInput = {
    create?: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput> | TicketCreateWithoutTicketListInput[] | TicketUncheckedCreateWithoutTicketListInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutTicketListInput | TicketCreateOrConnectWithoutTicketListInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutTicketListInput | TicketUpsertWithWhereUniqueWithoutTicketListInput[]
    createMany?: TicketCreateManyTicketListInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutTicketListInput | TicketUpdateWithWhereUniqueWithoutTicketListInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutTicketListInput | TicketUpdateManyWithWhereWithoutTicketListInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type TicketUncheckedUpdateManyWithoutTicketListNestedInput = {
    create?: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput> | TicketCreateWithoutTicketListInput[] | TicketUncheckedCreateWithoutTicketListInput[]
    connectOrCreate?: TicketCreateOrConnectWithoutTicketListInput | TicketCreateOrConnectWithoutTicketListInput[]
    upsert?: TicketUpsertWithWhereUniqueWithoutTicketListInput | TicketUpsertWithWhereUniqueWithoutTicketListInput[]
    createMany?: TicketCreateManyTicketListInputEnvelope
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[]
    update?: TicketUpdateWithWhereUniqueWithoutTicketListInput | TicketUpdateWithWhereUniqueWithoutTicketListInput[]
    updateMany?: TicketUpdateManyWithWhereWithoutTicketListInput | TicketUpdateManyWithWhereWithoutTicketListInput[]
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutTicketsInput = {
    create?: XOR<WorkspaceCreateWithoutTicketsInput, WorkspaceUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TicketListCreateNestedOneWithoutTicketsInput = {
    create?: XOR<TicketListCreateWithoutTicketsInput, TicketListUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: TicketListCreateOrConnectWithoutTicketsInput
    connect?: TicketListWhereUniqueInput
  }

  export type WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput = {
    create?: XOR<WorkspaceMemberCreateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutAssignedTicketsInput
    connect?: WorkspaceMemberWhereUniqueInput
  }

  export type WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput = {
    create?: XOR<WorkspaceMemberCreateWithoutReportedTicketsInput, WorkspaceMemberUncheckedCreateWithoutReportedTicketsInput>
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutReportedTicketsInput
    connect?: WorkspaceMemberWhereUniqueInput
  }

  export type TicketAttachmentCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput> | TicketAttachmentCreateWithoutTicketInput[] | TicketAttachmentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutTicketInput | TicketAttachmentCreateOrConnectWithoutTicketInput[]
    createMany?: TicketAttachmentCreateManyTicketInputEnvelope
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
  }

  export type TicketCommentCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput> | TicketCommentCreateWithoutTicketInput[] | TicketCommentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutTicketInput | TicketCommentCreateOrConnectWithoutTicketInput[]
    createMany?: TicketCommentCreateManyTicketInputEnvelope
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
  }

  export type TicketLabelCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput> | TicketLabelCreateWithoutTicketInput[] | TicketLabelUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutTicketInput | TicketLabelCreateOrConnectWithoutTicketInput[]
    createMany?: TicketLabelCreateManyTicketInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput> | TicketAttachmentCreateWithoutTicketInput[] | TicketAttachmentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutTicketInput | TicketAttachmentCreateOrConnectWithoutTicketInput[]
    createMany?: TicketAttachmentCreateManyTicketInputEnvelope
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
  }

  export type TicketCommentUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput> | TicketCommentCreateWithoutTicketInput[] | TicketCommentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutTicketInput | TicketCommentCreateOrConnectWithoutTicketInput[]
    createMany?: TicketCommentCreateManyTicketInputEnvelope
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
  }

  export type TicketLabelUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput> | TicketLabelCreateWithoutTicketInput[] | TicketLabelUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutTicketInput | TicketLabelCreateOrConnectWithoutTicketInput[]
    createMany?: TicketLabelCreateManyTicketInputEnvelope
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTicketsInput, WorkspaceUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketsInput
    upsert?: WorkspaceUpsertWithoutTicketsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTicketsInput, WorkspaceUpdateWithoutTicketsInput>, WorkspaceUncheckedUpdateWithoutTicketsInput>
  }

  export type TicketListUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<TicketListCreateWithoutTicketsInput, TicketListUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: TicketListCreateOrConnectWithoutTicketsInput
    upsert?: TicketListUpsertWithoutTicketsInput
    connect?: TicketListWhereUniqueInput
    update?: XOR<XOR<TicketListUpdateToOneWithWhereWithoutTicketsInput, TicketListUpdateWithoutTicketsInput>, TicketListUncheckedUpdateWithoutTicketsInput>
  }

  export type WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedCreateWithoutAssignedTicketsInput>
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutAssignedTicketsInput
    upsert?: WorkspaceMemberUpsertWithoutAssignedTicketsInput
    disconnect?: WorkspaceMemberWhereInput | boolean
    delete?: WorkspaceMemberWhereInput | boolean
    connect?: WorkspaceMemberWhereUniqueInput
    update?: XOR<XOR<WorkspaceMemberUpdateToOneWithWhereWithoutAssignedTicketsInput, WorkspaceMemberUpdateWithoutAssignedTicketsInput>, WorkspaceMemberUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput = {
    create?: XOR<WorkspaceMemberCreateWithoutReportedTicketsInput, WorkspaceMemberUncheckedCreateWithoutReportedTicketsInput>
    connectOrCreate?: WorkspaceMemberCreateOrConnectWithoutReportedTicketsInput
    upsert?: WorkspaceMemberUpsertWithoutReportedTicketsInput
    connect?: WorkspaceMemberWhereUniqueInput
    update?: XOR<XOR<WorkspaceMemberUpdateToOneWithWhereWithoutReportedTicketsInput, WorkspaceMemberUpdateWithoutReportedTicketsInput>, WorkspaceMemberUncheckedUpdateWithoutReportedTicketsInput>
  }

  export type TicketAttachmentUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput> | TicketAttachmentCreateWithoutTicketInput[] | TicketAttachmentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutTicketInput | TicketAttachmentCreateOrConnectWithoutTicketInput[]
    upsert?: TicketAttachmentUpsertWithWhereUniqueWithoutTicketInput | TicketAttachmentUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketAttachmentCreateManyTicketInputEnvelope
    set?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    disconnect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    delete?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    update?: TicketAttachmentUpdateWithWhereUniqueWithoutTicketInput | TicketAttachmentUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketAttachmentUpdateManyWithWhereWithoutTicketInput | TicketAttachmentUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
  }

  export type TicketCommentUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput> | TicketCommentCreateWithoutTicketInput[] | TicketCommentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutTicketInput | TicketCommentCreateOrConnectWithoutTicketInput[]
    upsert?: TicketCommentUpsertWithWhereUniqueWithoutTicketInput | TicketCommentUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketCommentCreateManyTicketInputEnvelope
    set?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    disconnect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    delete?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    update?: TicketCommentUpdateWithWhereUniqueWithoutTicketInput | TicketCommentUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketCommentUpdateManyWithWhereWithoutTicketInput | TicketCommentUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
  }

  export type TicketLabelUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput> | TicketLabelCreateWithoutTicketInput[] | TicketLabelUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutTicketInput | TicketLabelCreateOrConnectWithoutTicketInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutTicketInput | TicketLabelUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketLabelCreateManyTicketInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutTicketInput | TicketLabelUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutTicketInput | TicketLabelUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput> | TicketAttachmentCreateWithoutTicketInput[] | TicketAttachmentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketAttachmentCreateOrConnectWithoutTicketInput | TicketAttachmentCreateOrConnectWithoutTicketInput[]
    upsert?: TicketAttachmentUpsertWithWhereUniqueWithoutTicketInput | TicketAttachmentUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketAttachmentCreateManyTicketInputEnvelope
    set?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    disconnect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    delete?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    connect?: TicketAttachmentWhereUniqueInput | TicketAttachmentWhereUniqueInput[]
    update?: TicketAttachmentUpdateWithWhereUniqueWithoutTicketInput | TicketAttachmentUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketAttachmentUpdateManyWithWhereWithoutTicketInput | TicketAttachmentUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
  }

  export type TicketCommentUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput> | TicketCommentCreateWithoutTicketInput[] | TicketCommentUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketCommentCreateOrConnectWithoutTicketInput | TicketCommentCreateOrConnectWithoutTicketInput[]
    upsert?: TicketCommentUpsertWithWhereUniqueWithoutTicketInput | TicketCommentUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketCommentCreateManyTicketInputEnvelope
    set?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    disconnect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    delete?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    connect?: TicketCommentWhereUniqueInput | TicketCommentWhereUniqueInput[]
    update?: TicketCommentUpdateWithWhereUniqueWithoutTicketInput | TicketCommentUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketCommentUpdateManyWithWhereWithoutTicketInput | TicketCommentUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
  }

  export type TicketLabelUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput> | TicketLabelCreateWithoutTicketInput[] | TicketLabelUncheckedCreateWithoutTicketInput[]
    connectOrCreate?: TicketLabelCreateOrConnectWithoutTicketInput | TicketLabelCreateOrConnectWithoutTicketInput[]
    upsert?: TicketLabelUpsertWithWhereUniqueWithoutTicketInput | TicketLabelUpsertWithWhereUniqueWithoutTicketInput[]
    createMany?: TicketLabelCreateManyTicketInputEnvelope
    set?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    disconnect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    delete?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    connect?: TicketLabelWhereUniqueInput | TicketLabelWhereUniqueInput[]
    update?: TicketLabelUpdateWithWhereUniqueWithoutTicketInput | TicketLabelUpdateWithWhereUniqueWithoutTicketInput[]
    updateMany?: TicketLabelUpdateManyWithWhereWithoutTicketInput | TicketLabelUpdateManyWithWhereWithoutTicketInput[]
    deleteMany?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
  }

  export type TicketCreateNestedOneWithoutAttachmentsInput = {
    create?: XOR<TicketCreateWithoutAttachmentsInput, TicketUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutAttachmentsInput
    connect?: TicketWhereUniqueInput
  }

  export type WorkspaceCreateNestedOneWithoutTicketAttachmentsInput = {
    create?: XOR<WorkspaceCreateWithoutTicketAttachmentsInput, WorkspaceUncheckedCreateWithoutTicketAttachmentsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketAttachmentsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TicketUpdateOneRequiredWithoutAttachmentsNestedInput = {
    create?: XOR<TicketCreateWithoutAttachmentsInput, TicketUncheckedCreateWithoutAttachmentsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutAttachmentsInput
    upsert?: TicketUpsertWithoutAttachmentsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutAttachmentsInput, TicketUpdateWithoutAttachmentsInput>, TicketUncheckedUpdateWithoutAttachmentsInput>
  }

  export type WorkspaceUpdateOneRequiredWithoutTicketAttachmentsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTicketAttachmentsInput, WorkspaceUncheckedCreateWithoutTicketAttachmentsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketAttachmentsInput
    upsert?: WorkspaceUpsertWithoutTicketAttachmentsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTicketAttachmentsInput, WorkspaceUpdateWithoutTicketAttachmentsInput>, WorkspaceUncheckedUpdateWithoutTicketAttachmentsInput>
  }

  export type TicketCreateNestedOneWithoutCommentsInput = {
    create?: XOR<TicketCreateWithoutCommentsInput, TicketUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutCommentsInput
    connect?: TicketWhereUniqueInput
  }

  export type WorkspaceCreateNestedOneWithoutTicketCommentsInput = {
    create?: XOR<WorkspaceCreateWithoutTicketCommentsInput, WorkspaceUncheckedCreateWithoutTicketCommentsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketCommentsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TicketUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<TicketCreateWithoutCommentsInput, TicketUncheckedCreateWithoutCommentsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutCommentsInput
    upsert?: TicketUpsertWithoutCommentsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutCommentsInput, TicketUpdateWithoutCommentsInput>, TicketUncheckedUpdateWithoutCommentsInput>
  }

  export type WorkspaceUpdateOneRequiredWithoutTicketCommentsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTicketCommentsInput, WorkspaceUncheckedCreateWithoutTicketCommentsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketCommentsInput
    upsert?: WorkspaceUpsertWithoutTicketCommentsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTicketCommentsInput, WorkspaceUpdateWithoutTicketCommentsInput>, WorkspaceUncheckedUpdateWithoutTicketCommentsInput>
  }

  export type TicketCreateNestedOneWithoutLabelsInput = {
    create?: XOR<TicketCreateWithoutLabelsInput, TicketUncheckedCreateWithoutLabelsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutLabelsInput
    connect?: TicketWhereUniqueInput
  }

  export type WorkspaceCreateNestedOneWithoutTicketLabelsInput = {
    create?: XOR<WorkspaceCreateWithoutTicketLabelsInput, WorkspaceUncheckedCreateWithoutTicketLabelsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketLabelsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type WorkspaceTicketLabelCreateNestedOneWithoutTicketLabelsInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedCreateWithoutTicketLabelsInput>
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutTicketLabelsInput
    connect?: WorkspaceTicketLabelWhereUniqueInput
  }

  export type TicketUpdateOneRequiredWithoutLabelsNestedInput = {
    create?: XOR<TicketCreateWithoutLabelsInput, TicketUncheckedCreateWithoutLabelsInput>
    connectOrCreate?: TicketCreateOrConnectWithoutLabelsInput
    upsert?: TicketUpsertWithoutLabelsInput
    connect?: TicketWhereUniqueInput
    update?: XOR<XOR<TicketUpdateToOneWithWhereWithoutLabelsInput, TicketUpdateWithoutLabelsInput>, TicketUncheckedUpdateWithoutLabelsInput>
  }

  export type WorkspaceUpdateOneRequiredWithoutTicketLabelsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTicketLabelsInput, WorkspaceUncheckedCreateWithoutTicketLabelsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTicketLabelsInput
    upsert?: WorkspaceUpsertWithoutTicketLabelsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTicketLabelsInput, WorkspaceUpdateWithoutTicketLabelsInput>, WorkspaceUncheckedUpdateWithoutTicketLabelsInput>
  }

  export type WorkspaceTicketLabelUpdateOneRequiredWithoutTicketLabelsNestedInput = {
    create?: XOR<WorkspaceTicketLabelCreateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedCreateWithoutTicketLabelsInput>
    connectOrCreate?: WorkspaceTicketLabelCreateOrConnectWithoutTicketLabelsInput
    upsert?: WorkspaceTicketLabelUpsertWithoutTicketLabelsInput
    connect?: WorkspaceTicketLabelWhereUniqueInput
    update?: XOR<XOR<WorkspaceTicketLabelUpdateToOneWithWhereWithoutTicketLabelsInput, WorkspaceTicketLabelUpdateWithoutTicketLabelsInput>, WorkspaceTicketLabelUncheckedUpdateWithoutTicketLabelsInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type SessionCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
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

  export type AccountCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceMemberCreateWithoutUserInput = {
    id: string
    isWorkspaceOwner?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
    assignedTickets?: TicketCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketCreateNestedManyWithoutReporterInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutUserInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketUncheckedCreateNestedManyWithoutReporterInput
  }

  export type WorkspaceMemberCreateOrConnectWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput>
  }

  export type WorkspaceMemberCreateManyUserInputEnvelope = {
    data: WorkspaceMemberCreateManyUserInput | WorkspaceMemberCreateManyUserInput[]
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
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type WorkspaceMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    update: XOR<WorkspaceMemberUpdateWithoutUserInput, WorkspaceMemberUncheckedUpdateWithoutUserInput>
    create: XOR<WorkspaceMemberCreateWithoutUserInput, WorkspaceMemberUncheckedCreateWithoutUserInput>
  }

  export type WorkspaceMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: WorkspaceMemberWhereUniqueInput
    data: XOR<WorkspaceMemberUpdateWithoutUserInput, WorkspaceMemberUncheckedUpdateWithoutUserInput>
  }

  export type WorkspaceMemberUpdateManyWithWhereWithoutUserInput = {
    where: WorkspaceMemberScalarWhereInput
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type WorkspaceMemberScalarWhereInput = {
    AND?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
    OR?: WorkspaceMemberScalarWhereInput[]
    NOT?: WorkspaceMemberScalarWhereInput | WorkspaceMemberScalarWhereInput[]
    id?: StringFilter<"WorkspaceMember"> | string
    isWorkspaceOwner?: BoolFilter<"WorkspaceMember"> | boolean
    workspaceId?: StringFilter<"WorkspaceMember"> | string
    userId?: StringFilter<"WorkspaceMember"> | string
    createdAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMember"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
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
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    members?: WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkspaceMemberCreateWithoutWorkspaceInput = {
    id: string
    isWorkspaceOwner?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketCreateNestedManyWithoutReporterInput
    user: UserCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutWorkspaceInput = {
    id: string
    isWorkspaceOwner?: boolean
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssigneeInput
    reportedTickets?: TicketUncheckedCreateNestedManyWithoutReporterInput
  }

  export type WorkspaceMemberCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberCreateManyWorkspaceInputEnvelope = {
    data: WorkspaceMemberCreateManyWorkspaceInput | WorkspaceMemberCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type TicketCreateWithoutWorkspaceInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutWorkspaceInput = {
    id: string
    title: string
    description: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutWorkspaceInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketCreateManyWorkspaceInputEnvelope = {
    data: TicketCreateManyWorkspaceInput | TicketCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type TicketListCreateWithoutWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketCreateNestedManyWithoutTicketListInput
  }

  export type TicketListUncheckedCreateWithoutWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutTicketListInput
  }

  export type TicketListCreateOrConnectWithoutWorkspaceInput = {
    where: TicketListWhereUniqueInput
    create: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketListCreateManyWorkspaceInputEnvelope = {
    data: TicketListCreateManyWorkspaceInput | TicketListCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type TicketAttachmentCreateWithoutWorkspaceInput = {
    id: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutAttachmentsInput
  }

  export type TicketAttachmentUncheckedCreateWithoutWorkspaceInput = {
    id: string
    ticketId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentCreateOrConnectWithoutWorkspaceInput = {
    where: TicketAttachmentWhereUniqueInput
    create: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketAttachmentCreateManyWorkspaceInputEnvelope = {
    data: TicketAttachmentCreateManyWorkspaceInput | TicketAttachmentCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type TicketCommentCreateWithoutWorkspaceInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutCommentsInput
  }

  export type TicketCommentUncheckedCreateWithoutWorkspaceInput = {
    id: string
    ticketId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentCreateOrConnectWithoutWorkspaceInput = {
    where: TicketCommentWhereUniqueInput
    create: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketCommentCreateManyWorkspaceInputEnvelope = {
    data: TicketCommentCreateManyWorkspaceInput | TicketCommentCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type TicketLabelCreateWithoutWorkspaceInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutLabelsInput
    label: WorkspaceTicketLabelCreateNestedOneWithoutTicketLabelsInput
  }

  export type TicketLabelUncheckedCreateWithoutWorkspaceInput = {
    id: string
    ticketId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelCreateOrConnectWithoutWorkspaceInput = {
    where: TicketLabelWhereUniqueInput
    create: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketLabelCreateManyWorkspaceInputEnvelope = {
    data: TicketLabelCreateManyWorkspaceInput | TicketLabelCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceTicketLabelCreateWithoutWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticketLabels?: TicketLabelCreateNestedManyWithoutLabelInput
  }

  export type WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutLabelInput
  }

  export type WorkspaceTicketLabelCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceTicketLabelWhereUniqueInput
    create: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceTicketLabelCreateManyWorkspaceInputEnvelope = {
    data: WorkspaceTicketLabelCreateManyWorkspaceInput | WorkspaceTicketLabelCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceMemberInviteCreateWithoutWorkspaceInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberInviteCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceMemberInviteWhereUniqueInput
    create: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberInviteCreateManyWorkspaceInputEnvelope = {
    data: WorkspaceMemberInviteCreateManyWorkspaceInput | WorkspaceMemberInviteCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceMemberUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    update: XOR<WorkspaceMemberUpdateWithoutWorkspaceInput, WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceMemberCreateWithoutWorkspaceInput, WorkspaceMemberUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberWhereUniqueInput
    data: XOR<WorkspaceMemberUpdateWithoutWorkspaceInput, WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberUpdateManyWithWhereWithoutWorkspaceInput = {
    where: WorkspaceMemberScalarWhereInput
    data: XOR<WorkspaceMemberUpdateManyMutationInput, WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutWorkspaceInput, TicketUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TicketCreateWithoutWorkspaceInput, TicketUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutWorkspaceInput, TicketUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TicketUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[]
    OR?: TicketScalarWhereInput[]
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[]
    id?: StringFilter<"Ticket"> | string
    title?: StringFilter<"Ticket"> | string
    description?: StringFilter<"Ticket"> | string
    workspaceId?: StringFilter<"Ticket"> | string
    ticketListId?: StringFilter<"Ticket"> | string
    assigneeId?: StringNullableFilter<"Ticket"> | string | null
    reporterId?: StringFilter<"Ticket"> | string
    createdAt?: DateTimeFilter<"Ticket"> | Date | string
    updatedAt?: DateTimeFilter<"Ticket"> | Date | string
  }

  export type TicketListUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketListWhereUniqueInput
    update: XOR<TicketListUpdateWithoutWorkspaceInput, TicketListUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TicketListCreateWithoutWorkspaceInput, TicketListUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketListUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketListWhereUniqueInput
    data: XOR<TicketListUpdateWithoutWorkspaceInput, TicketListUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TicketListUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TicketListScalarWhereInput
    data: XOR<TicketListUpdateManyMutationInput, TicketListUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketListScalarWhereInput = {
    AND?: TicketListScalarWhereInput | TicketListScalarWhereInput[]
    OR?: TicketListScalarWhereInput[]
    NOT?: TicketListScalarWhereInput | TicketListScalarWhereInput[]
    id?: StringFilter<"TicketList"> | string
    name?: StringFilter<"TicketList"> | string
    workspaceId?: StringFilter<"TicketList"> | string
    createdAt?: DateTimeFilter<"TicketList"> | Date | string
    updatedAt?: DateTimeFilter<"TicketList"> | Date | string
  }

  export type TicketAttachmentUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketAttachmentWhereUniqueInput
    update: XOR<TicketAttachmentUpdateWithoutWorkspaceInput, TicketAttachmentUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TicketAttachmentCreateWithoutWorkspaceInput, TicketAttachmentUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketAttachmentUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketAttachmentWhereUniqueInput
    data: XOR<TicketAttachmentUpdateWithoutWorkspaceInput, TicketAttachmentUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TicketAttachmentUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TicketAttachmentScalarWhereInput
    data: XOR<TicketAttachmentUpdateManyMutationInput, TicketAttachmentUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketAttachmentScalarWhereInput = {
    AND?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
    OR?: TicketAttachmentScalarWhereInput[]
    NOT?: TicketAttachmentScalarWhereInput | TicketAttachmentScalarWhereInput[]
    id?: StringFilter<"TicketAttachment"> | string
    ticketId?: StringFilter<"TicketAttachment"> | string
    workspaceId?: StringFilter<"TicketAttachment"> | string
    key?: StringFilter<"TicketAttachment"> | string
    name?: StringFilter<"TicketAttachment"> | string
    size?: IntFilter<"TicketAttachment"> | number
    createdAt?: DateTimeFilter<"TicketAttachment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketAttachment"> | Date | string
  }

  export type TicketCommentUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketCommentWhereUniqueInput
    update: XOR<TicketCommentUpdateWithoutWorkspaceInput, TicketCommentUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TicketCommentCreateWithoutWorkspaceInput, TicketCommentUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketCommentUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketCommentWhereUniqueInput
    data: XOR<TicketCommentUpdateWithoutWorkspaceInput, TicketCommentUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TicketCommentUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TicketCommentScalarWhereInput
    data: XOR<TicketCommentUpdateManyMutationInput, TicketCommentUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketCommentScalarWhereInput = {
    AND?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
    OR?: TicketCommentScalarWhereInput[]
    NOT?: TicketCommentScalarWhereInput | TicketCommentScalarWhereInput[]
    id?: StringFilter<"TicketComment"> | string
    ticketId?: StringFilter<"TicketComment"> | string
    workspaceId?: StringFilter<"TicketComment"> | string
    content?: StringFilter<"TicketComment"> | string
    createdAt?: DateTimeFilter<"TicketComment"> | Date | string
    updatedAt?: DateTimeFilter<"TicketComment"> | Date | string
  }

  export type TicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketLabelWhereUniqueInput
    update: XOR<TicketLabelUpdateWithoutWorkspaceInput, TicketLabelUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TicketLabelCreateWithoutWorkspaceInput, TicketLabelUncheckedCreateWithoutWorkspaceInput>
  }

  export type TicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TicketLabelWhereUniqueInput
    data: XOR<TicketLabelUpdateWithoutWorkspaceInput, TicketLabelUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TicketLabelUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TicketLabelScalarWhereInput
    data: XOR<TicketLabelUpdateManyMutationInput, TicketLabelUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type TicketLabelScalarWhereInput = {
    AND?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
    OR?: TicketLabelScalarWhereInput[]
    NOT?: TicketLabelScalarWhereInput | TicketLabelScalarWhereInput[]
    id?: StringFilter<"TicketLabel"> | string
    ticketId?: StringFilter<"TicketLabel"> | string
    workspaceId?: StringFilter<"TicketLabel"> | string
    labelId?: StringFilter<"TicketLabel"> | string
    createdAt?: DateTimeFilter<"TicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"TicketLabel"> | Date | string
  }

  export type WorkspaceTicketLabelUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceTicketLabelWhereUniqueInput
    update: XOR<WorkspaceTicketLabelUpdateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceTicketLabelCreateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceTicketLabelUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceTicketLabelWhereUniqueInput
    data: XOR<WorkspaceTicketLabelUpdateWithoutWorkspaceInput, WorkspaceTicketLabelUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceTicketLabelUpdateManyWithWhereWithoutWorkspaceInput = {
    where: WorkspaceTicketLabelScalarWhereInput
    data: XOR<WorkspaceTicketLabelUpdateManyMutationInput, WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type WorkspaceTicketLabelScalarWhereInput = {
    AND?: WorkspaceTicketLabelScalarWhereInput | WorkspaceTicketLabelScalarWhereInput[]
    OR?: WorkspaceTicketLabelScalarWhereInput[]
    NOT?: WorkspaceTicketLabelScalarWhereInput | WorkspaceTicketLabelScalarWhereInput[]
    id?: StringFilter<"WorkspaceTicketLabel"> | string
    name?: StringFilter<"WorkspaceTicketLabel"> | string
    workspaceId?: StringFilter<"WorkspaceTicketLabel"> | string
    createdAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceTicketLabel"> | Date | string
  }

  export type WorkspaceMemberInviteUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberInviteWhereUniqueInput
    update: XOR<WorkspaceMemberInviteUpdateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceMemberInviteCreateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberInviteUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceMemberInviteWhereUniqueInput
    data: XOR<WorkspaceMemberInviteUpdateWithoutWorkspaceInput, WorkspaceMemberInviteUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceMemberInviteUpdateManyWithWhereWithoutWorkspaceInput = {
    where: WorkspaceMemberInviteScalarWhereInput
    data: XOR<WorkspaceMemberInviteUpdateManyMutationInput, WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type WorkspaceMemberInviteScalarWhereInput = {
    AND?: WorkspaceMemberInviteScalarWhereInput | WorkspaceMemberInviteScalarWhereInput[]
    OR?: WorkspaceMemberInviteScalarWhereInput[]
    NOT?: WorkspaceMemberInviteScalarWhereInput | WorkspaceMemberInviteScalarWhereInput[]
    id?: StringFilter<"WorkspaceMemberInvite"> | string
    email?: StringFilter<"WorkspaceMemberInvite"> | string
    workspaceId?: StringFilter<"WorkspaceMemberInvite"> | string
    createdAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceMemberInvite"> | Date | string
  }

  export type WorkspaceCreateWithoutMembersInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutMembersInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutMembersInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
  }

  export type TicketCreateWithoutAssigneeInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutAssigneeInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutAssigneeInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput>
  }

  export type TicketCreateManyAssigneeInputEnvelope = {
    data: TicketCreateManyAssigneeInput | TicketCreateManyAssigneeInput[]
    skipDuplicates?: boolean
  }

  export type TicketCreateWithoutReporterInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutReporterInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutReporterInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput>
  }

  export type TicketCreateManyReporterInputEnvelope = {
    data: TicketCreateManyReporterInput | TicketCreateManyReporterInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutMembersInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMembersInput = {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMembersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMembersInput, UserUncheckedCreateWithoutMembersInput>
  }

  export type WorkspaceUpsertWithoutMembersInput = {
    update: XOR<WorkspaceUpdateWithoutMembersInput, WorkspaceUncheckedUpdateWithoutMembersInput>
    create: XOR<WorkspaceCreateWithoutMembersInput, WorkspaceUncheckedCreateWithoutMembersInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutMembersInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutMembersInput, WorkspaceUncheckedUpdateWithoutMembersInput>
  }

  export type WorkspaceUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketUpsertWithWhereUniqueWithoutAssigneeInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutAssigneeInput, TicketUncheckedUpdateWithoutAssigneeInput>
    create: XOR<TicketCreateWithoutAssigneeInput, TicketUncheckedCreateWithoutAssigneeInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutAssigneeInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutAssigneeInput, TicketUncheckedUpdateWithoutAssigneeInput>
  }

  export type TicketUpdateManyWithWhereWithoutAssigneeInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutAssigneeInput>
  }

  export type TicketUpsertWithWhereUniqueWithoutReporterInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutReporterInput, TicketUncheckedUpdateWithoutReporterInput>
    create: XOR<TicketCreateWithoutReporterInput, TicketUncheckedCreateWithoutReporterInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutReporterInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutReporterInput, TicketUncheckedUpdateWithoutReporterInput>
  }

  export type TicketUpdateManyWithWhereWithoutReporterInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutReporterInput>
  }

  export type UserUpsertWithoutMembersInput = {
    update: XOR<UserUpdateWithoutMembersInput, UserUncheckedUpdateWithoutMembersInput>
    create: XOR<UserCreateWithoutMembersInput, UserUncheckedCreateWithoutMembersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMembersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMembersInput, UserUncheckedUpdateWithoutMembersInput>
  }

  export type UserUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkspaceCreateWithoutWorkspaceMemberInvitesInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutWorkspaceMemberInvitesInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutWorkspaceMemberInvitesInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedCreateWithoutWorkspaceMemberInvitesInput>
  }

  export type WorkspaceUpsertWithoutWorkspaceMemberInvitesInput = {
    update: XOR<WorkspaceUpdateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedUpdateWithoutWorkspaceMemberInvitesInput>
    create: XOR<WorkspaceCreateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedCreateWithoutWorkspaceMemberInvitesInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutWorkspaceMemberInvitesInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutWorkspaceMemberInvitesInput, WorkspaceUncheckedUpdateWithoutWorkspaceMemberInvitesInput>
  }

  export type WorkspaceUpdateWithoutWorkspaceMemberInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutWorkspaceMemberInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateWithoutWorkspaceTicketLabelsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutWorkspaceTicketLabelsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutWorkspaceTicketLabelsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedCreateWithoutWorkspaceTicketLabelsInput>
  }

  export type TicketLabelCreateWithoutLabelInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ticket: TicketCreateNestedOneWithoutLabelsInput
    workspace: WorkspaceCreateNestedOneWithoutTicketLabelsInput
  }

  export type TicketLabelUncheckedCreateWithoutLabelInput = {
    id: string
    ticketId: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelCreateOrConnectWithoutLabelInput = {
    where: TicketLabelWhereUniqueInput
    create: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput>
  }

  export type TicketLabelCreateManyLabelInputEnvelope = {
    data: TicketLabelCreateManyLabelInput | TicketLabelCreateManyLabelInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutWorkspaceTicketLabelsInput = {
    update: XOR<WorkspaceUpdateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedUpdateWithoutWorkspaceTicketLabelsInput>
    create: XOR<WorkspaceCreateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedCreateWithoutWorkspaceTicketLabelsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutWorkspaceTicketLabelsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutWorkspaceTicketLabelsInput, WorkspaceUncheckedUpdateWithoutWorkspaceTicketLabelsInput>
  }

  export type WorkspaceUpdateWithoutWorkspaceTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutWorkspaceTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketLabelUpsertWithWhereUniqueWithoutLabelInput = {
    where: TicketLabelWhereUniqueInput
    update: XOR<TicketLabelUpdateWithoutLabelInput, TicketLabelUncheckedUpdateWithoutLabelInput>
    create: XOR<TicketLabelCreateWithoutLabelInput, TicketLabelUncheckedCreateWithoutLabelInput>
  }

  export type TicketLabelUpdateWithWhereUniqueWithoutLabelInput = {
    where: TicketLabelWhereUniqueInput
    data: XOR<TicketLabelUpdateWithoutLabelInput, TicketLabelUncheckedUpdateWithoutLabelInput>
  }

  export type TicketLabelUpdateManyWithWhereWithoutLabelInput = {
    where: TicketLabelScalarWhereInput
    data: XOR<TicketLabelUpdateManyMutationInput, TicketLabelUncheckedUpdateManyWithoutLabelInput>
  }

  export type WorkspaceCreateWithoutTicketListsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTicketListsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTicketListsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTicketListsInput, WorkspaceUncheckedCreateWithoutTicketListsInput>
  }

  export type TicketCreateWithoutTicketListInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutTicketListInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutTicketListInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput>
  }

  export type TicketCreateManyTicketListInputEnvelope = {
    data: TicketCreateManyTicketListInput | TicketCreateManyTicketListInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutTicketListsInput = {
    update: XOR<WorkspaceUpdateWithoutTicketListsInput, WorkspaceUncheckedUpdateWithoutTicketListsInput>
    create: XOR<WorkspaceCreateWithoutTicketListsInput, WorkspaceUncheckedCreateWithoutTicketListsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTicketListsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTicketListsInput, WorkspaceUncheckedUpdateWithoutTicketListsInput>
  }

  export type WorkspaceUpdateWithoutTicketListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTicketListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketUpsertWithWhereUniqueWithoutTicketListInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutTicketListInput, TicketUncheckedUpdateWithoutTicketListInput>
    create: XOR<TicketCreateWithoutTicketListInput, TicketUncheckedCreateWithoutTicketListInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutTicketListInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutTicketListInput, TicketUncheckedUpdateWithoutTicketListInput>
  }

  export type TicketUpdateManyWithWhereWithoutTicketListInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutTicketListInput>
  }

  export type WorkspaceCreateWithoutTicketsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTicketsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTicketsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTicketsInput, WorkspaceUncheckedCreateWithoutTicketsInput>
  }

  export type TicketListCreateWithoutTicketsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketListsInput
  }

  export type TicketListUncheckedCreateWithoutTicketsInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketListCreateOrConnectWithoutTicketsInput = {
    where: TicketListWhereUniqueInput
    create: XOR<TicketListCreateWithoutTicketsInput, TicketListUncheckedCreateWithoutTicketsInput>
  }

  export type WorkspaceMemberCreateWithoutAssignedTicketsInput = {
    id: string
    isWorkspaceOwner?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
    reportedTickets?: TicketCreateNestedManyWithoutReporterInput
    user: UserCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutAssignedTicketsInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    reportedTickets?: TicketUncheckedCreateNestedManyWithoutReporterInput
  }

  export type WorkspaceMemberCreateOrConnectWithoutAssignedTicketsInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedCreateWithoutAssignedTicketsInput>
  }

  export type WorkspaceMemberCreateWithoutReportedTicketsInput = {
    id: string
    isWorkspaceOwner?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutMembersInput
    assignedTickets?: TicketCreateNestedManyWithoutAssigneeInput
    user: UserCreateNestedOneWithoutMembersInput
  }

  export type WorkspaceMemberUncheckedCreateWithoutReportedTicketsInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedTickets?: TicketUncheckedCreateNestedManyWithoutAssigneeInput
  }

  export type WorkspaceMemberCreateOrConnectWithoutReportedTicketsInput = {
    where: WorkspaceMemberWhereUniqueInput
    create: XOR<WorkspaceMemberCreateWithoutReportedTicketsInput, WorkspaceMemberUncheckedCreateWithoutReportedTicketsInput>
  }

  export type TicketAttachmentCreateWithoutTicketInput = {
    id: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketAttachmentsInput
  }

  export type TicketAttachmentUncheckedCreateWithoutTicketInput = {
    id: string
    workspaceId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentCreateOrConnectWithoutTicketInput = {
    where: TicketAttachmentWhereUniqueInput
    create: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput>
  }

  export type TicketAttachmentCreateManyTicketInputEnvelope = {
    data: TicketAttachmentCreateManyTicketInput | TicketAttachmentCreateManyTicketInput[]
    skipDuplicates?: boolean
  }

  export type TicketCommentCreateWithoutTicketInput = {
    id: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketCommentsInput
  }

  export type TicketCommentUncheckedCreateWithoutTicketInput = {
    id: string
    workspaceId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentCreateOrConnectWithoutTicketInput = {
    where: TicketCommentWhereUniqueInput
    create: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput>
  }

  export type TicketCommentCreateManyTicketInputEnvelope = {
    data: TicketCommentCreateManyTicketInput | TicketCommentCreateManyTicketInput[]
    skipDuplicates?: boolean
  }

  export type TicketLabelCreateWithoutTicketInput = {
    id: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketLabelsInput
    label: WorkspaceTicketLabelCreateNestedOneWithoutTicketLabelsInput
  }

  export type TicketLabelUncheckedCreateWithoutTicketInput = {
    id: string
    workspaceId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelCreateOrConnectWithoutTicketInput = {
    where: TicketLabelWhereUniqueInput
    create: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput>
  }

  export type TicketLabelCreateManyTicketInputEnvelope = {
    data: TicketLabelCreateManyTicketInput | TicketLabelCreateManyTicketInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutTicketsInput = {
    update: XOR<WorkspaceUpdateWithoutTicketsInput, WorkspaceUncheckedUpdateWithoutTicketsInput>
    create: XOR<WorkspaceCreateWithoutTicketsInput, WorkspaceUncheckedCreateWithoutTicketsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTicketsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTicketsInput, WorkspaceUncheckedUpdateWithoutTicketsInput>
  }

  export type WorkspaceUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketListUpsertWithoutTicketsInput = {
    update: XOR<TicketListUpdateWithoutTicketsInput, TicketListUncheckedUpdateWithoutTicketsInput>
    create: XOR<TicketListCreateWithoutTicketsInput, TicketListUncheckedCreateWithoutTicketsInput>
    where?: TicketListWhereInput
  }

  export type TicketListUpdateToOneWithWhereWithoutTicketsInput = {
    where?: TicketListWhereInput
    data: XOR<TicketListUpdateWithoutTicketsInput, TicketListUncheckedUpdateWithoutTicketsInput>
  }

  export type TicketListUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketListsNestedInput
  }

  export type TicketListUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberUpsertWithoutAssignedTicketsInput = {
    update: XOR<WorkspaceMemberUpdateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedUpdateWithoutAssignedTicketsInput>
    create: XOR<WorkspaceMemberCreateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedCreateWithoutAssignedTicketsInput>
    where?: WorkspaceMemberWhereInput
  }

  export type WorkspaceMemberUpdateToOneWithWhereWithoutAssignedTicketsInput = {
    where?: WorkspaceMemberWhereInput
    data: XOR<WorkspaceMemberUpdateWithoutAssignedTicketsInput, WorkspaceMemberUncheckedUpdateWithoutAssignedTicketsInput>
  }

  export type WorkspaceMemberUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
    reportedTickets?: TicketUpdateManyWithoutReporterNestedInput
    user?: UserUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutAssignedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reportedTickets?: TicketUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type WorkspaceMemberUpsertWithoutReportedTicketsInput = {
    update: XOR<WorkspaceMemberUpdateWithoutReportedTicketsInput, WorkspaceMemberUncheckedUpdateWithoutReportedTicketsInput>
    create: XOR<WorkspaceMemberCreateWithoutReportedTicketsInput, WorkspaceMemberUncheckedCreateWithoutReportedTicketsInput>
    where?: WorkspaceMemberWhereInput
  }

  export type WorkspaceMemberUpdateToOneWithWhereWithoutReportedTicketsInput = {
    where?: WorkspaceMemberWhereInput
    data: XOR<WorkspaceMemberUpdateWithoutReportedTicketsInput, WorkspaceMemberUncheckedUpdateWithoutReportedTicketsInput>
  }

  export type WorkspaceMemberUpdateWithoutReportedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssigneeNestedInput
    user?: UserUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutReportedTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssigneeNestedInput
  }

  export type TicketAttachmentUpsertWithWhereUniqueWithoutTicketInput = {
    where: TicketAttachmentWhereUniqueInput
    update: XOR<TicketAttachmentUpdateWithoutTicketInput, TicketAttachmentUncheckedUpdateWithoutTicketInput>
    create: XOR<TicketAttachmentCreateWithoutTicketInput, TicketAttachmentUncheckedCreateWithoutTicketInput>
  }

  export type TicketAttachmentUpdateWithWhereUniqueWithoutTicketInput = {
    where: TicketAttachmentWhereUniqueInput
    data: XOR<TicketAttachmentUpdateWithoutTicketInput, TicketAttachmentUncheckedUpdateWithoutTicketInput>
  }

  export type TicketAttachmentUpdateManyWithWhereWithoutTicketInput = {
    where: TicketAttachmentScalarWhereInput
    data: XOR<TicketAttachmentUpdateManyMutationInput, TicketAttachmentUncheckedUpdateManyWithoutTicketInput>
  }

  export type TicketCommentUpsertWithWhereUniqueWithoutTicketInput = {
    where: TicketCommentWhereUniqueInput
    update: XOR<TicketCommentUpdateWithoutTicketInput, TicketCommentUncheckedUpdateWithoutTicketInput>
    create: XOR<TicketCommentCreateWithoutTicketInput, TicketCommentUncheckedCreateWithoutTicketInput>
  }

  export type TicketCommentUpdateWithWhereUniqueWithoutTicketInput = {
    where: TicketCommentWhereUniqueInput
    data: XOR<TicketCommentUpdateWithoutTicketInput, TicketCommentUncheckedUpdateWithoutTicketInput>
  }

  export type TicketCommentUpdateManyWithWhereWithoutTicketInput = {
    where: TicketCommentScalarWhereInput
    data: XOR<TicketCommentUpdateManyMutationInput, TicketCommentUncheckedUpdateManyWithoutTicketInput>
  }

  export type TicketLabelUpsertWithWhereUniqueWithoutTicketInput = {
    where: TicketLabelWhereUniqueInput
    update: XOR<TicketLabelUpdateWithoutTicketInput, TicketLabelUncheckedUpdateWithoutTicketInput>
    create: XOR<TicketLabelCreateWithoutTicketInput, TicketLabelUncheckedCreateWithoutTicketInput>
  }

  export type TicketLabelUpdateWithWhereUniqueWithoutTicketInput = {
    where: TicketLabelWhereUniqueInput
    data: XOR<TicketLabelUpdateWithoutTicketInput, TicketLabelUncheckedUpdateWithoutTicketInput>
  }

  export type TicketLabelUpdateManyWithWhereWithoutTicketInput = {
    where: TicketLabelScalarWhereInput
    data: XOR<TicketLabelUpdateManyMutationInput, TicketLabelUncheckedUpdateManyWithoutTicketInput>
  }

  export type TicketCreateWithoutAttachmentsInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutAttachmentsInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutAttachmentsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutAttachmentsInput, TicketUncheckedCreateWithoutAttachmentsInput>
  }

  export type WorkspaceCreateWithoutTicketAttachmentsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTicketAttachmentsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTicketAttachmentsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTicketAttachmentsInput, WorkspaceUncheckedCreateWithoutTicketAttachmentsInput>
  }

  export type TicketUpsertWithoutAttachmentsInput = {
    update: XOR<TicketUpdateWithoutAttachmentsInput, TicketUncheckedUpdateWithoutAttachmentsInput>
    create: XOR<TicketCreateWithoutAttachmentsInput, TicketUncheckedCreateWithoutAttachmentsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutAttachmentsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutAttachmentsInput, TicketUncheckedUpdateWithoutAttachmentsInput>
  }

  export type TicketUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type WorkspaceUpsertWithoutTicketAttachmentsInput = {
    update: XOR<WorkspaceUpdateWithoutTicketAttachmentsInput, WorkspaceUncheckedUpdateWithoutTicketAttachmentsInput>
    create: XOR<WorkspaceCreateWithoutTicketAttachmentsInput, WorkspaceUncheckedCreateWithoutTicketAttachmentsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTicketAttachmentsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTicketAttachmentsInput, WorkspaceUncheckedUpdateWithoutTicketAttachmentsInput>
  }

  export type WorkspaceUpdateWithoutTicketAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTicketAttachmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketCreateWithoutCommentsInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    labels?: TicketLabelCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutCommentsInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    labels?: TicketLabelUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutCommentsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutCommentsInput, TicketUncheckedCreateWithoutCommentsInput>
  }

  export type WorkspaceCreateWithoutTicketCommentsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTicketCommentsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLabels?: TicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTicketCommentsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTicketCommentsInput, WorkspaceUncheckedCreateWithoutTicketCommentsInput>
  }

  export type TicketUpsertWithoutCommentsInput = {
    update: XOR<TicketUpdateWithoutCommentsInput, TicketUncheckedUpdateWithoutCommentsInput>
    create: XOR<TicketCreateWithoutCommentsInput, TicketUncheckedCreateWithoutCommentsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutCommentsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutCommentsInput, TicketUncheckedUpdateWithoutCommentsInput>
  }

  export type TicketUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type WorkspaceUpsertWithoutTicketCommentsInput = {
    update: XOR<WorkspaceUpdateWithoutTicketCommentsInput, WorkspaceUncheckedUpdateWithoutTicketCommentsInput>
    create: XOR<WorkspaceCreateWithoutTicketCommentsInput, WorkspaceUncheckedCreateWithoutTicketCommentsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTicketCommentsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTicketCommentsInput, WorkspaceUncheckedUpdateWithoutTicketCommentsInput>
  }

  export type WorkspaceUpdateWithoutTicketCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTicketCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TicketCreateWithoutLabelsInput = {
    id: string
    title: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutTicketsInput
    ticketList: TicketListCreateNestedOneWithoutTicketsInput
    assignee?: WorkspaceMemberCreateNestedOneWithoutAssignedTicketsInput
    reporter: WorkspaceMemberCreateNestedOneWithoutReportedTicketsInput
    attachments?: TicketAttachmentCreateNestedManyWithoutTicketInput
    comments?: TicketCommentCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutLabelsInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    attachments?: TicketAttachmentUncheckedCreateNestedManyWithoutTicketInput
    comments?: TicketCommentUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutLabelsInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutLabelsInput, TicketUncheckedCreateWithoutLabelsInput>
  }

  export type WorkspaceCreateWithoutTicketLabelsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTicketLabelsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: WorkspaceMemberUncheckedCreateNestedManyWithoutWorkspaceInput
    tickets?: TicketUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketLists?: TicketListUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketAttachments?: TicketAttachmentUncheckedCreateNestedManyWithoutWorkspaceInput
    ticketComments?: TicketCommentUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedCreateNestedManyWithoutWorkspaceInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTicketLabelsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTicketLabelsInput, WorkspaceUncheckedCreateWithoutTicketLabelsInput>
  }

  export type WorkspaceTicketLabelCreateWithoutTicketLabelsInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutWorkspaceTicketLabelsInput
  }

  export type WorkspaceTicketLabelUncheckedCreateWithoutTicketLabelsInput = {
    id: string
    name: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceTicketLabelCreateOrConnectWithoutTicketLabelsInput = {
    where: WorkspaceTicketLabelWhereUniqueInput
    create: XOR<WorkspaceTicketLabelCreateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedCreateWithoutTicketLabelsInput>
  }

  export type TicketUpsertWithoutLabelsInput = {
    update: XOR<TicketUpdateWithoutLabelsInput, TicketUncheckedUpdateWithoutLabelsInput>
    create: XOR<TicketCreateWithoutLabelsInput, TicketUncheckedCreateWithoutLabelsInput>
    where?: TicketWhereInput
  }

  export type TicketUpdateToOneWithWhereWithoutLabelsInput = {
    where?: TicketWhereInput
    data: XOR<TicketUpdateWithoutLabelsInput, TicketUncheckedUpdateWithoutLabelsInput>
  }

  export type TicketUpdateWithoutLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type WorkspaceUpsertWithoutTicketLabelsInput = {
    update: XOR<WorkspaceUpdateWithoutTicketLabelsInput, WorkspaceUncheckedUpdateWithoutTicketLabelsInput>
    create: XOR<WorkspaceCreateWithoutTicketLabelsInput, WorkspaceUncheckedCreateWithoutTicketLabelsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTicketLabelsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTicketLabelsInput, WorkspaceUncheckedUpdateWithoutTicketLabelsInput>
  }

  export type WorkspaceUpdateWithoutTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceNestedInput
    tickets?: TicketUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketLists?: TicketListUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketAttachments?: TicketAttachmentUncheckedUpdateManyWithoutWorkspaceNestedInput
    ticketComments?: TicketCommentUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceTicketLabels?: WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceNestedInput
    workspaceMemberInvites?: WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceTicketLabelUpsertWithoutTicketLabelsInput = {
    update: XOR<WorkspaceTicketLabelUpdateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedUpdateWithoutTicketLabelsInput>
    create: XOR<WorkspaceTicketLabelCreateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedCreateWithoutTicketLabelsInput>
    where?: WorkspaceTicketLabelWhereInput
  }

  export type WorkspaceTicketLabelUpdateToOneWithWhereWithoutTicketLabelsInput = {
    where?: WorkspaceTicketLabelWhereInput
    data: XOR<WorkspaceTicketLabelUpdateWithoutTicketLabelsInput, WorkspaceTicketLabelUncheckedUpdateWithoutTicketLabelsInput>
  }

  export type WorkspaceTicketLabelUpdateWithoutTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutWorkspaceTicketLabelsNestedInput
  }

  export type WorkspaceTicketLabelUncheckedUpdateWithoutTicketLabelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyUserInput = {
    id: string
    expiresAt: Date | string
    token: string
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateManyUserInput = {
    id: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberCreateManyUserInput = {
    id: string
    isWorkspaceOwner?: boolean
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutMembersNestedInput
    assignedTickets?: TicketUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUpdateManyWithoutReporterNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberCreateManyWorkspaceInput = {
    id: string
    isWorkspaceOwner?: boolean
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCreateManyWorkspaceInput = {
    id: string
    title: string
    description: string
    ticketListId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketListCreateManyWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentCreateManyWorkspaceInput = {
    id: string
    ticketId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentCreateManyWorkspaceInput = {
    id: string
    ticketId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelCreateManyWorkspaceInput = {
    id: string
    ticketId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceTicketLabelCreateManyWorkspaceInput = {
    id: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberInviteCreateManyWorkspaceInput = {
    id: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceMemberUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUpdateManyWithoutReporterNestedInput
    user?: UserUpdateOneRequiredWithoutMembersNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedTickets?: TicketUncheckedUpdateManyWithoutAssigneeNestedInput
    reportedTickets?: TicketUncheckedUpdateManyWithoutReporterNestedInput
  }

  export type WorkspaceMemberUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    isWorkspaceOwner?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketListUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUpdateManyWithoutTicketListNestedInput
  }

  export type TicketListUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tickets?: TicketUncheckedUpdateManyWithoutTicketListNestedInput
  }

  export type TicketListUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutAttachmentsNestedInput
  }

  export type TicketAttachmentUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutCommentsNestedInput
  }

  export type TicketCommentUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutLabelsNestedInput
    label?: WorkspaceTicketLabelUpdateOneRequiredWithoutTicketLabelsNestedInput
  }

  export type TicketLabelUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceTicketLabelUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketLabels?: TicketLabelUpdateManyWithoutLabelNestedInput
  }

  export type WorkspaceTicketLabelUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketLabels?: TicketLabelUncheckedUpdateManyWithoutLabelNestedInput
  }

  export type WorkspaceTicketLabelUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceMemberInviteUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateManyAssigneeInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCreateManyReporterInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    ticketListId: string
    assigneeId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutAssigneeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    ticketList?: TicketListUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    ticketListId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelCreateManyLabelInput = {
    id: string
    ticketId: string
    workspaceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelUpdateWithoutLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutLabelsNestedInput
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketLabelsNestedInput
  }

  export type TicketLabelUncheckedUpdateWithoutLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUncheckedUpdateManyWithoutLabelInput = {
    id?: StringFieldUpdateOperationsInput | string
    ticketId?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCreateManyTicketListInput = {
    id: string
    title: string
    description: string
    workspaceId: string
    assigneeId?: string | null
    reporterId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketUpdateWithoutTicketListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketsNestedInput
    assignee?: WorkspaceMemberUpdateOneWithoutAssignedTicketsNestedInput
    reporter?: WorkspaceMemberUpdateOneRequiredWithoutReportedTicketsNestedInput
    attachments?: TicketAttachmentUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutTicketListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attachments?: TicketAttachmentUncheckedUpdateManyWithoutTicketNestedInput
    comments?: TicketCommentUncheckedUpdateManyWithoutTicketNestedInput
    labels?: TicketLabelUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutTicketListInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    reporterId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentCreateManyTicketInput = {
    id: string
    workspaceId: string
    key: string
    name: string
    size: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketCommentCreateManyTicketInput = {
    id: string
    workspaceId: string
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketLabelCreateManyTicketInput = {
    id: string
    workspaceId: string
    labelId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TicketAttachmentUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketAttachmentsNestedInput
  }

  export type TicketAttachmentUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketAttachmentUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketCommentsNestedInput
  }

  export type TicketCommentUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketCommentUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutTicketLabelsNestedInput
    label?: WorkspaceTicketLabelUpdateOneRequiredWithoutTicketLabelsNestedInput
  }

  export type TicketLabelUncheckedUpdateWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TicketLabelUncheckedUpdateManyWithoutTicketInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    labelId?: StringFieldUpdateOperationsInput | string
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