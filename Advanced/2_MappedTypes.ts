/**
 * =========================================================
 * TypeScript Mapped Types
 * =========================================================
 *
 * Covers:
 * 1. What are Mapped Types?
 * 2. Basic Mapped Types
 * 3. Modifiers (readonly, optional)
 * 4. Adding / Removing Modifiers
 * 5. Key Remapping with `as`
 * 6. Filtering Keys with `as` + Conditional Types
 * 7. Mapped Types over Unions
 * 8. Combining with infer
 * 9. Real-world Patterns
 *
 * =========================================================
 */

/**
 * =========================================================
 * 1. What are Mapped Types?
 * =========================================================
 *
 * A mapped type loops over keys of an existing type
 * and produces a NEW type — transforming each property.
 *
 * Syntax:
 *   { [K in keyof T]: SomeType }
 *
 * Read as:
 *   "For every key K in T, create a property K with this type"
 *
 * This is how ALL utility types are built internally:
 * Partial, Required, Readonly, Pick, Omit — all mapped types.
 */

/**
 * Base types used throughout this file
 */

type UserMapType = {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
};

type Role = 'admin' | 'user' | 'guest';

/**
 * =========================================================
 * 2. Basic Mapped Types
 * =========================================================
 */

/**
 * Copy a type exactly — simplest mapped type
 */

type Copy<T> = {
  [K in keyof T]: T[K];
  //  ↑              ↑
  //  loop over      keep the same value type
  //  every key
};

type UserCopy = Copy<UserMapType>;
// Identical to UserMapType — every key, same type

/**
 * Make all values a different type
 */

// All values become string
type Stringify<T> = {
  [K in keyof T]: string;
};

type StringUser = Stringify<UserMapType>;
// { id: string; name: string; email: string; age: string; isActive: string }

// All values become boolean
type Booleanify<T> = {
  [K in keyof T]: boolean;
};

type BoolUser = Booleanify<UserMapType>;
// { id: boolean; name: boolean; ... }

/**
 * Wrap every value in an array
 */

type Arrayify<T> = {
  [K in keyof T]: T[K][];
};

type ArrayUser = Arrayify<UserMapType>;
// { id: number[]; name: string[]; email: string[]; ... }

/**
 * Wrap every value in a Promise
 */

type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type AsyncUser = Promisify<UserMapType>;
// { id: Promise<number>; name: Promise<string>; ... }

/**
 * Make every value nullable
 */

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<UserMapType>;
// { id: number | null; name: string | null; ... }

/**
 * =========================================================
 * 3. Modifiers (readonly, optional)
 * =========================================================
 *
 * You can add ? or readonly to every key in a mapped type.
 * This is exactly how Partial<T> and Readonly<T> work.
 */

/**
 * Build Partial<T> from scratch
 */

type MyPartial<T> = {
  [K in keyof T]?: T[K]; // ← ? makes every key optional
};

type PartialUser = MyPartial<UserMapType>;
// { id?: number; name?: string; email?: string; ... }

/**
 * Build Readonly<T> from scratch
 */

type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]; // ← readonly on every key
};

type ReadonlyUser = MyReadonly<UserMapType>;
// { readonly id: number; readonly name: string; ... }

/**
 * Both — Readonly + Optional
 */

type ReadonlyPartial<T> = {
  readonly [K in keyof T]?: T[K];
};

type FrozenDraft = ReadonlyPartial<UserMapType>;
// { readonly id?: number; readonly name?: string; ... }

/**
 * =========================================================
 * 4. Adding / Removing Modifiers
 * =========================================================
 *
 * Use + to ADD a modifier (default, can be omitted)
 * Use - to REMOVE a modifier
 *
 * This is how Required<T> and the -readonly pattern work.
 */

/**
 * Remove optional — build Required<T> from scratch
 */

type MyRequired<T> = {
  [K in keyof T]-?: T[K]; // ← -? removes the optional marker
};

type RequiredUser = MyRequired<MyPartial<UserMapType>>;
// All fields required again — ? is stripped

/**
 * Remove readonly — make a mutable version
 */

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // ← -readonly strips the readonly
};

type MutableUser = Mutable<ReadonlyUser>;
// All readonly removed — fields are writable again

const user: Mutable<Readonly<UserMapType>> = {
  id: 1,
  name: 'Zaffar',
  email: 'z@x.com',
  age: 22,
  isActive: true,
};

user.name = 'Ali'; // ✅ mutable now

/**
 * Add AND remove together
 */

type StrictMapped<T> = {
  -readonly [K in keyof T]-?: T[K]; // remove both readonly AND optional
};

// Result: every field is required AND writable

/**
 * Modifier summary:
 *
 *  [K in keyof T]?:         add optional
 *  [K in keyof T]-?:        remove optional  (Required)
 *  readonly [K in keyof T]: add readonly
 * -readonly [K in keyof T]: remove readonly  (Mutable)
 */

/**
 * =========================================================
 * 5. Key Remapping with `as`
 * =========================================================
 *
 * Rename keys while mapping using `as` clause.
 * Introduced in TypeScript 4.1.
 *
 * Syntax:
 *   { [K in keyof T as NewKeyType]: T[K] }
 */

/**
 * Rename every key to uppercase
 */

type UppercaseKeys<T> = {
  [K in keyof T as Uppercase<string & K>]: T[K];
  //                ↑
  //   Uppercase<> is a built-in string manipulation type
  //   string & K narrows K to string (keys can also be symbol)
};

type UpperUser = UppercaseKeys<UserMapType>;
// { ID: number; NAME: string; EMAIL: string; AGE: number; ISACTIVE: boolean }

/**
 * Rename every key to lowercase
 */

type LowercaseKeys<T> = {
  [K in keyof T as Lowercase<string & K>]: T[K];
};

/**
 * Add a prefix to every key
 */

type WithPrefix<T, Prefix extends string> = {
  [K in keyof T as `${Prefix}${Capitalize<string & K>}`]: T[K];
};

type PrefixedUser = WithPrefix<UserMapType, 'get'>;
// { getId: number; getName: string; getEmail: string; getAge: number; getIsActive: boolean }

/**
 * Add a suffix to every key
 */

type WithSuffix<T, Suffix extends string> = {
  [K in keyof T as `${string & K}${Suffix}`]: T[K];
};

type SuffixedUser = WithSuffix<UserMapType, 'Value'>;
// { idValue: number; nameValue: string; emailValue: string; ... }

/**
 * Generate getter method names automatically
 */

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<UserMapType>;
// {
//   getId:       () => number;
//   getName:     () => string;
//   getEmail:    () => string;
//   getAge:      () => number;
//   getIsActive: () => boolean;
// }

/**
 * Generate setter method names automatically
 */

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type UserSetters = Setters<UserMapType>;
// {
//   setId:       (value: number) => void;
//   setName:     (value: string) => void;
//   setEmail:    (value: string) => void;
//   setAge:      (value: number) => void;
//   setIsActive: (value: boolean) => void;
// }

/**
 * Getters + Setters combined
 */

type GettersAndSetters<T> = Getters<T> & Setters<T>;

type UserAccessors = GettersAndSetters<UserMapType>;
// Full accessor interface — all getters + all setters ✅

/**
 * =========================================================
 * 6. Filtering Keys with `as` + Conditional Types
 * =========================================================
 *
 * Return `never` from the `as` clause to DROP a key.
 * This is how you filter properties in a mapped type.
 *
 * Key remapping to `never` = that key disappears.
 */

/**
 * Build Pick<T, K> from scratch
 */

type MyPick<T, K extends keyof T> = {
  [P in keyof T as P extends K ? P : never]: T[P];
  //              ↑
  //  if P is one of the keys we want → keep it
  //  otherwise → never (drop it)
};

type PickedUser = MyPick<UserMapType, 'id' | 'name'>;
// { id: number; name: string }

/**
 * Build Omit<T, K> from scratch
 */

type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
  //                             ↑
  //  if P is one of the keys to omit → never (drop it)
  //  otherwise → keep it
};

type OmittedUser = MyOmit<UserMapType, 'email' | 'age'>;
// { id: number; name: string; isActive: boolean }

/**
 * Keep only string-valued properties
 */

type PickStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringProps = PickStrings<UserMapType>;
// { name: string; email: string }

/**
 * Keep only number-valued properties
 */

type PickNumbers<T> = {
  [K in keyof T as T[K] extends number ? K : never]: T[K];
};

type NumberProps = PickNumbers<UserMapType>;
// { id: number; age: number }

/**
 * Keep only function-valued properties
 */

type PickMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

class UserServices {
  id: number = 1;
  name: string = 'Zaffar';
  getUser(): UserMapType {
    return {} as UserMapType;
  }
  deleteUser(): void {}
}

type ServiceMethods = PickMethods<UserServices>;
// { getUser: () => UserMapType; deleteUser: () => void }

/**
 * =========================================================
 * 7. Mapped Types over Unions
 * =========================================================
 *
 * You can map over a union directly — not just keyof T.
 * Each union member becomes a key.
 */

type RoleFlags = {
  [K in Role]: boolean;
};
// { admin: boolean; user: boolean; guest: boolean }

const flags: RoleFlags = {
  admin: true,
  user: true,
  guest: false,
};

/**
 * Union of strings → object with those keys
 */

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

type MethodHandlers = {
  [K in HttpMethods]: (path: string) => void;
};

const handlers: MethodHandlers = {
  GET: (path) => console.log(`GET ${path}`),
  POST: (path) => console.log(`POST ${path}`),
  PUT: (path) => console.log(`PUT ${path}`),
  DELETE: (path) => console.log(`DELETE ${path}`),
};

/**
 * Status → config object
 */

type Status = 'idle' | 'loading' | 'success' | 'error';

type StatusConfig = {
  [K in Status]: {
    label: string;
    color: string;
    icon: string;
  };
};

const statusConfig: StatusConfig = {
  idle: { label: 'Waiting', color: 'gray', icon: 'clock' },
  loading: { label: 'Loading...', color: 'blue', icon: 'spin' },
  success: { label: 'Done!', color: 'green', icon: 'check' },
  error: { label: 'Failed', color: 'red', icon: 'cross' },
};

/**
 * =========================================================
 * 8. Combining Mapped Types with infer
 * =========================================================
 */

/**
 * Unwrap every Promise value in an object
 */

type AwaitedValues<T> = {
  [K in keyof T]: T[K] extends Promise<infer V> ? V : T[K];
};

type AsyncData = {
  user: Promise<UserMapType>;
  count: Promise<number>;
  message: string; // not a Promise — stays as-is
};

type ResolvedData = AwaitedValues<AsyncData>;
// { user: UserMapType; count: number; message: string }

/**
 * Extract return types of all methods in an object/class
 */

type ReturnTypes<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never;
};

type Api = {
  getUser: () => Promise<UserMapType>;
  getUserAge: () => number;
  getName: () => string;
};

type ApiReturns = ReturnTypes<Api>;
// { getUser: Promise<UserMapType>; getUserAge: number; getName: string }

/**
 * =========================================================
 * 9. Real-world Patterns
 * =========================================================
 */

/**
 * Pattern 1: FormFields
 * Generate a form state type from a data model
 */

type FormField<T> = {
  value: T;
  error: string | null;
  touched: boolean;
};

type FormFields<T> = {
  [K in keyof T]: FormField<T[K]>;
};

type UserForm = FormFields<Pick<UserMapType, 'name' | 'email' | 'age'>>;
// {
//   name:  { value: string;  error: string | null; touched: boolean };
//   email: { value: string;  error: string | null; touched: boolean };
//   age:   { value: number;  error: string | null; touched: boolean };
// }

/**
 * Pattern 2: EventHandlers
 * Generate onChange handler types from a data model
 */

type EventHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type UserHandlers = EventHandlers<Pick<UserMapType, 'name' | 'email' | 'age'>>;
// {
//   onNameChange:  (value: string) => void;
//   onEmailChange: (value: string) => void;
//   onAgeChange:   (value: number) => void;
// }

/**
 * Pattern 3: DeepPartial
 * Recursively make every nested property optional
 */

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

type DeepConfigs = {
  server: { host: string; port: number };
  db: { url: string; name: string };
  debug: boolean;
};

type PartialConfig = DeepPartial<DeepConfigs>;

const partialCfg: PartialConfig = {
  server: { host: 'localhost' }, // port is optional ✅
}; // db is optional ✅

/**
 * Pattern 4: Validation schema
 * Generate a validator function for every field
 */

type ValidationSchema<T> = {
  [K in keyof T]?: (value: T[K]) => string | null;
  //            ↑ validator is optional per field
};

const userValidators: ValidationSchema<UserMapType> = {
  name: (v) => (v.length < 2 ? 'Too short' : null),
  email: (v) => (!v.includes('@') ? 'Invalid email' : null),
  age: (v) => (v < 0 ? 'Must be positive' : null),
};

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Basic syntax:
 *   { [K in keyof T]: T[K] }       → copy type
 *   { [K in keyof T]: NewType }    → transform values
 *   { [K in keyof T]?: T[K] }      → add optional     (Partial)
 *   { [K in keyof T]-?: T[K] }     → remove optional  (Required)
 *   { readonly [K in keyof T]: T[K] }    → add readonly
 *   { -readonly [K in keyof T]: T[K] }   → remove readonly (Mutable)
 *
 * Key remapping (as):
 *   { [K in keyof T as NewKey]: T[K] }         → rename keys
 *   { [K in keyof T as `get${...}`]: ... }     → prefix keys
 *   { [K in keyof T as T[K] extends X ? K : never]: T[K] } → filter keys
 *
 * Over unions:
 *   { [K in "a" | "b" | "c"]: SomeType }   → union as keys
 *
 * With infer:
 *   { [K in keyof T]: T[K] extends Promise<infer V> ? V : T[K] }
 *
 * Built-in types built on mapped types:
 *   Partial    → [K in keyof T]?
 *   Required   → [K in keyof T]-?
 *   Readonly   → readonly [K in keyof T]
 *   Pick       → [K in keyof T as K extends Filter ? K : never]
 *   Omit       → [K in keyof T as K extends Filter ? never : K]
 *   Record     → [K in Keys]: Value
 *
 * 🔥 Golden rule:
 *   When you need to TRANSFORM every property of a type
 *   in the same way — that is a mapped type.
 *
 * =========================================================
 */
