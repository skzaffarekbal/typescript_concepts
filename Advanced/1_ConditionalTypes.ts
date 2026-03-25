/**
 * =========================================================
 * TypeScript Conditional Types
 * =========================================================
 *
 * Covers:
 * 1. Basic Conditional Types
 * 2. Conditional Types with Generics
 * 3. infer Keyword
 * 4. Distributive Conditional Types
 * 5. Nested Conditional Types
 * 6. Built-in Conditional Utility Types
 *    - Exclude<T, U>
 *    - Extract<T, U>
 *    - NonNullable<T>
 *    - ReturnType<T>
 *    - Parameters<T>
 *    - InstanceType<T>
 * 7. Real-world Patterns
 *
 * =========================================================
 */

type User = {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'guest';
};

/**
 * =========================================================
 * 1. Basic Conditional Types
 * =========================================================
 *
 * Syntax:
 *   T extends U ? X : Y
 *
 * Read as:
 *   "If T is assignable to U, use type X, otherwise use type Y"
 *
 * It is an if/else — but at the TYPE level, not value level.
 */

// Simple example — is it a string?
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
type C = IsString<'hello'>; // "yes" — string literal extends string
type D = IsString<boolean>; // "no"

/**
 * Is it an array?
 */

type IsArray<T> = T extends any[] ? 'yes' : 'no';

type E = IsArray<number[]>; // "yes"
type F = IsArray<string>; // "no"
type G = IsArray<[]>; // "yes"

/**
 * Conditional return — type changes based on input
 */

type Flatten<T> = T extends any[] ? T[number] : T;
//                                   ↑
//                        T[number] gets the element type of array T
//                        number[] → number
//                        string[] → string

type H = Flatten<number[]>; // number
type I = Flatten<string[]>; // string
type J = Flatten<boolean>; // boolean (not an array — returns as-is)

/**
 * =========================================================
 * 2. Conditional Types with Generics
 * =========================================================
 *
 * The real power — use conditional types INSIDE generic types
 * to change the output type based on what T is at call time.
 */

/**
 * TypeName — describe any type as a string literal
 */

type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends null
        ? 'null'
        : T extends undefined
          ? 'undefined'
          : T extends Function
            ? 'function'
            : 'object';

type T1 = TypeName<string>; // "string"
type T2 = TypeName<42>; // "number"
type T3 = TypeName<boolean>; // "boolean"
type T4 = TypeName<null>; // "null"
type T5 = TypeName<() => void>; // "function"
type T6 = TypeName<{ a: 1 }>; // "object"

/**
 * ToArray — wrap in array only if not already an array
 */

type ToArray<T> = T extends any[] ? T : T[];

type K = ToArray<number>; // number[]
type L = ToArray<number[]>; // number[]  (already array — unchanged)
type M = ToArray<string>; // string[]

/**
 * NonEmptyArray — a tuple with at least one element
 */

type IsNonEmpty<T extends any[]> = T extends [] ? 'empty' : 'has items';

type N = IsNonEmpty<[]>; // "empty"
type O = IsNonEmpty<[1, 2, 3]>; // "has items"

/**
 * =========================================================
 * 3. infer Keyword
 * =========================================================
 *
 * `infer` lets TypeScript EXTRACT a type from within
 * a conditional type — instead of you writing it manually.
 *
 * Think of it as: "figure out this type and give it a name"
 *
 * Only usable inside the `extends` clause of a conditional type.
 */

/**
 * Extract the return type of a function
 */

type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
//                                                       ↑
//                                          infer R = "capture whatever the return type is"

type R1 = GetReturnType<() => string>; // string
type R2 = GetReturnType<() => number[]>; // number[]
type R3 = GetReturnType<(x: number) => boolean>; // boolean
type R4 = GetReturnType<string>; // never (not a function)

// This is exactly how the built-in ReturnType<T> works internally

/**
 * Extract the first parameter type
 */

type FirstParam<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

type P1 = FirstParam<(x: number, y: string) => void>; // number
type P2 = FirstParam<(name: string) => void>; // string
type P3 = FirstParam<() => void>; // never (no params)

/**
 * Extract element type from an array
 */

type ElementType<T> = T extends (infer E)[] ? E : never;

type El1 = ElementType<string[]>; // string
type El2 = ElementType<number[]>; // number
type El3 = ElementType<[boolean, string]>; // boolean | string (union of tuple types)

/**
 * Extract the value type from a Promise
 */

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;

type Pr1 = UnwrapPromise<Promise<string>>; // string
// type Pr2 = UnwrapPromise<Promise<User>>; // User
type Pr3 = UnwrapPromise<number>; // number (not a Promise — as-is)

// Recursive — unwrap nested promises
type DeepUnwrap<T> = T extends Promise<infer V> ? DeepUnwrap<V> : T;

type Pr4 = DeepUnwrap<Promise<Promise<string>>>; // string
type Pr5 = DeepUnwrap<Promise<Promise<number[]>>>; // number[]

/**
 * Extract the type inside an array OR return as-is
 */

type Unpack<T> = T extends Array<infer Item> ? Item : T;

type Up1 = Unpack<string[]>; // string
type Up2 = Unpack<number[]>; // number
type Up3 = Unpack<boolean>; // boolean (not an array)

/**
 * =========================================================
 * 4. Distributive Conditional Types
 * =========================================================
 *
 * When T is a UNION and you apply a conditional type,
 * TypeScript automatically distributes it over each member.
 *
 * T extends U ? X : Y
 * where T = A | B | C
 *
 * becomes:
 * (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)
 */

type IsString2<T> = T extends string ? 'yes' : 'no';

// T is a union → distributes automatically
type Dist1 = IsString2<string | number>;
// = (string extends string ? "yes" : "no") | (number extends string ? "yes" : "no")
// = "yes" | "no"

type Dist2 = IsString2<string | boolean | null>;
// = "yes" | "no" | "no"
// = "yes" | "no"

/**
 * Practical: filter out specific types from a union
 */

type OnlyStrings<T> = T extends string ? T : never;
//                                            ↑
//                                  never disappears from unions

type Str1 = OnlyStrings<string | number | boolean>;
// = string | never | never
// = string

type Str2 = OnlyStrings<'admin' | 'user' | 42 | true>;
// = "admin" | "user"

/**
 * Turn off distribution — wrap in a tuple
 * Sometimes you want to check T as a whole, not distributed
 */

type IsUnion<T> = [T] extends [any] ? 'yes' : 'no';
// [T] prevents distribution — checks the union itself as one type

type U1 = IsUnion<string | number>; // "yes"
type U2 = IsUnion<string>; // "yes" (single type is also valid)

/**
 * =========================================================
 * 5. Nested Conditional Types
 * =========================================================
 *
 * Chain multiple conditions — like if / else if / else
 */

type Describe<T> = T extends null | undefined
  ? 'nullish'
  : T extends boolean
    ? 'boolean'
    : T extends number
      ? 'number'
      : T extends string
        ? 'string'
        : T extends any[]
          ? 'array'
          : T extends object
            ? 'object'
            : 'unknown';

type D1 = Describe<null>; // "nullish"
type D2 = Describe<undefined>; // "nullish"
type D3 = Describe<42>; // "number"
type D4 = Describe<'hello'>; // "string"
type D5 = Describe<number[]>; // "array"
type D6 = Describe<{ a: 1 }>; // "object"

/**
 * Nested with infer
 * Extract the resolved value from an async function
 */

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : T extends (...args: any[]) => infer R
    ? R
    : never;

async function fetchUser(): Promise<User> {
  return { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' };
}

function getName(): string {
  return 'Zaffar';
}

type AR1 = AsyncReturnType<typeof fetchUser>; // User  (unwrapped from Promise)
type AR2 = AsyncReturnType<typeof getName>; // string
type AR3 = AsyncReturnType<string>; // never (not a function)

/**
 * =========================================================
 * 6. Built-in Conditional Utility Types
 * =========================================================
 *
 * TypeScript ships several utility types built on
 * conditional types. Now you can see HOW they work.
 */

/**
 * -----------------------------------------
 * Exclude<T, U>
 * -----------------------------------------
 * Remove from T any type that is assignable to U
 *
 * Built-in implementation:
 * type Exclude<T, U> = T extends U ? never : T;
 */

type Ex1 = Exclude<string | number | boolean, string>;
// = never | number | boolean
// = number | boolean

type Ex2 = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'c'>;
// = "b" | "d"

type Ex3 = Exclude<string | null | undefined, null | undefined>;
// = string

/**
 * -----------------------------------------
 * Extract<T, U>
 * -----------------------------------------
 * Opposite of Exclude — KEEP only types assignable to U
 *
 * Built-in implementation:
 * type Extract<T, U> = T extends U ? T : never;
 */

type Ext1 = Extract<string | number | boolean, string | number>;
// = string | number

type Ext2 = Extract<'a' | 'b' | 'c', 'a' | 'c' | 'z'>;
// = "a" | "c"  ("z" not in T so ignored)

/**
 * Exclude ↔ Extract are opposites:
 * Exclude → remove matches
 * Extract → keep matches
 */

/**
 * -----------------------------------------
 * NonNullable<T>
 * -----------------------------------------
 * Remove null and undefined from T
 *
 * Built-in implementation:
 * type NonNullable<T> = T extends null | undefined ? never : T;
 */

type NN1 = NonNullable<string | null>; // string
type NN2 = NonNullable<number | undefined>; // number
type NN3 = NonNullable<string | null | undefined>; // string
type NN4 = NonNullable<null | undefined>; // never

/**
 * -----------------------------------------
 * ReturnType<T>
 * -----------------------------------------
 * Extract the return type of a function type
 *
 * Built-in implementation:
 * type ReturnType<T extends (...args: any) => any>
 *   = T extends (...args: any) => infer R ? R : any;
 */

function add(a: number, b: number): number {
  return a + b;
}
async function loadUser(): Promise<User> {
  return { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' };
}

type Ret1 = ReturnType<typeof add>; // number
type Ret2 = ReturnType<typeof loadUser>; // Promise<User>
type Ret3 = ReturnType<() => string[]>; // string[]

/**
 * -----------------------------------------
 * Parameters<T>
 * -----------------------------------------
 * Extract the parameter types of a function as a tuple
 *
 * Built-in implementation:
 * type Parameters<T extends (...args: any) => any>
 *   = T extends (...args: infer P) => any ? P : never;
 */

function createPost(title: string, content: string, published: boolean): void {}

type Params1 = Parameters<typeof createPost>;
// [title: string, content: string, published: boolean]

type Params2 = Parameters<typeof add>;
// [a: number, b: number]

// Very useful: reuse parameter types without repeating them
type CreatePostArgs = Parameters<typeof createPost>;

function schedulePost(...args: CreatePostArgs): void {
  console.log('Scheduling:', args);
}

/**
 * -----------------------------------------
 * InstanceType<T>
 * -----------------------------------------
 * Extract the instance type of a constructor function
 *
 * Built-in implementation:
 * type InstanceType<T extends abstract new (...args: any) => any>
 *   = T extends abstract new (...args: any) => infer R ? R : any;
 */

class UserService {
  getUser(id: number): User {
    return { id, name: "Zaffar", email: "z@x.com", age: 22, role: "user" };
  }
}

type ServiceInstance = InstanceType<typeof UserService>;
// type: UserService (the instance, not the class itself)

// Useful when you have a reference to the CLASS not an instance
function createService<T extends new (...args: any[]) => any>(
  Cls: T
): InstanceType<T> {
  return new Cls();
}

const service = createService(UserService); // type: UserService ✅


/**
 * =========================================================
 * 7. Real-world Patterns
 * =========================================================
 */


/**
 * Pattern 1: DeepReadonly
 * Recursively makes every nested property readonly
 * (solves the shallow problem from Utility Types lesson)
 */

type DeepReadonly<T> =
  T extends (infer E)[]
    ? ReadonlyArray<DeepReadonly<E>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

type DeepConfig = {
  server: { host: string; port: number };
  db: { url: string; name: string };
};

type FrozenConfig = DeepReadonly<DeepConfig>;

const cfg: FrozenConfig = {
  server: { host: "localhost", port: 3000 },
  db: { url: "mongodb://...", name: "mydb" },
};

// cfg.server.host = "x"; // ❌ deeply readonly ✅


/**
 * Pattern 2: PickByValue
 * Pick only keys whose VALUE matches a type
 */

type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type MixedType = {
  id: number;
  name: string;
  age: number;
  isActive: boolean;
  email: string;
};

type StringFields  = PickByValue<MixedType, string>;
// { name: string; email: string }

type NumberFields  = PickByValue<MixedType, number>;
// { id: number; age: number }

type BooleanFields = PickByValue<MixedType, boolean>;
// { isActive: boolean }


/**
 * Pattern 3: Strict function overload resolver
 * Return type changes based on argument type
 */

type ParseResult<T extends string | number> =
  T extends string ? number :
  T extends number ? string :
  never;

function parse<T extends string | number>(value: T): ParseResult<T> {
  if (typeof value === "string") {
    return Number(value) as ParseResult<T>;
  }
  return String(value) as ParseResult<T>;
}

const parsed1 = parse("42");  // type: number ✅
const parsed2 = parse(42);    // type: string ✅


/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Syntax:
 *   T extends U ? X : Y
 *   "if T is assignable to U → X, else → Y"
 *
 * infer:
 *   T extends Promise<infer V> ? V : never
 *   "extract and name a type from within a structure"
 *
 * Distribution:
 *   Applied to a union → runs per member automatically
 *   Wrap in [T] to turn off distribution
 *
 * Built-in conditional utilities:
 *   Exclude<T, U>      → remove U from T
 *   Extract<T, U>      → keep only U from T
 *   NonNullable<T>     → remove null | undefined
 *   ReturnType<T>      → return type of function
 *   Parameters<T>      → param types of function as tuple
 *   InstanceType<T>    → instance type of a class
 *
 * Pairs:
 *   Exclude  ↔  Extract      (opposites)
 *   Partial  ↔  Required     (from last lesson)
 *   Pick     ↔  Omit         (from last lesson)
 *
 * 🔥 Golden rule:
 *   Use conditional types when the OUTPUT type depends
 *   on what the INPUT type IS — not on a runtime value.
 *
 * =========================================================
 */