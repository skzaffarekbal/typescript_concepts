/**
 * =========================================================
 * TypeScript Utility Types
 * =========================================================
 *
 * Covers:
 * 1. Partial<T>
 * 2. Required<T>
 * 3. Readonly<T>
 * 4. Pick<T, K>
 * 5. Omit<T, K>
 * 6. Record<K, V>
 * 7. Combining Utility Types (real-world patterns)
 *
 * All utility types are built-in — nothing to import.
 * They are generic types that TRANSFORM an existing type.
 *
 * =========================================================
 */

/**
 * Base type we will use throughout this file
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
 * 1. Partial<T>
 * =========================================================
 *
 * Makes ALL properties of T optional (?).
 * Every field becomes T | undefined.
 *
 * Use case: update payloads, form drafts, PATCH requests
 */
type PartialUser = Partial<User>;

// Equivalent to writing manually:
// type PartialUser = {
//   id?:    number;
//   name?:  string;
//   email?: string;
//   age?:   number;
//   role?:  "admin" | "user" | "guest";
// }

// ✅ Any combination of fields is valid
const draft: PartialUser = {};
const draft2: PartialUser = { name: 'Zaffar' };
const draft3: PartialUser = { name: 'Zaffar', age: 22 };

/**
 * Real-world: PATCH / update function
 * You only send the fields you want to change
 */
function updateUser(id: number, changes: Partial<User>): void {
  console.log(`Updating user ${id}`, changes);
}

updateUser(1, { name: 'Ali' }); // ✅ only name
updateUser(1, { age: 25, role: 'admin' }); // ✅ only age + role
updateUser(1, {}); // ✅ nothing (valid PATCH)

/**
 * How Partial<T> works internally (mapped type):
 *
 * type Partial<T> = {
 *   [K in keyof T]?: T[K];
 * }
 *
 * You will build this yourself in the Advanced section.
 */

/**
 * =========================================================
 * 2. Required<T>
 * =========================================================
 *
 * Opposite of Partial — makes ALL properties required.
 * Removes every ? from the type.
 *
 * Use case: after validation, ensure nothing is missing
 */

type PartialConfig = {
  host?: string;
  port?: number;
  debug?: boolean;
};

type FullConfig = Required<PartialConfig>;

// Equivalent to:
// type FullConfig = {
//   host:  string;
//   port:  number;
//   debug: boolean;
// }

// ✅ All fields must be present
const configRequired: FullConfig = {
  host: 'localhost',
  port: 3000,
  debug: false,
};

// const badConfig: FullConfig = { host: "localhost" }; // ❌ port and debug missing

/**
 * Real-world: validate + return a fully populated object
 */

function validateConfig(input: PartialConfig): Required<PartialConfig> {
  return {
    host: input.host ?? 'localhost',
    port: input.port ?? 3000,
    debug: input.debug ?? false,
  };
}

const safeConfig = validateConfig({ host: 'example.com' });
// safeConfig.port  → 3000   (filled in)
// safeConfig.debug → false  (filled in)

/**
 * How Required<T> works internally:
 *
 * type Required<T> = {
 *   [K in keyof T]-?: T[K];   ← the `-?` removes the optional marker
 * }
 */

/**
 * =========================================================
 * 3. Readonly<T>
 * =========================================================
 *
 * Makes ALL properties readonly.
 * Cannot reassign any property after creation.
 *
 * Use case: frozen config, immutable state, constants
 */

type ReadonlyUser = Readonly<User>;

// Equivalent to:
// type ReadonlyUser = {
//   readonly id:    number;
//   readonly name:  string;
//   readonly email: string;
//   readonly age:   number;
//   readonly role:  "admin" | "user" | "guest";
// }

const frozenUser: ReadonlyUser = {
  id: 1,
  name: 'Zaffar',
  email: 'z@example.com',
  age: 22,
  role: 'admin',
};

// frozenUser.name = "Ali"; // ❌ Cannot assign to readonly property
// frozenUser.age = 25;     // ❌ Cannot assign to readonly property

/**
 * Real-world: immutable app config loaded at startup
 */

const APP_CONFIG: Readonly<FullConfig> = {
  host: 'api.example.com',
  port: 443,
  debug: false,
};

// APP_CONFIG.port = 80; // ❌ locked after initialization

/**
 * ⚠️ Readonly is SHALLOW
 * Nested objects are still mutable
 */

type Profile = {
  user: User;
  settings: { theme: string };
};

const readonlyProfile: Readonly<Profile> = {
  user: { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' },
  settings: { theme: 'dark' },
};

// readonlyProfile.user = { ... };       // ❌ cannot replace top-level
readonlyProfile.user.name = 'Ali'; // ⚠️ allowed — nested is not readonly
readonlyProfile.settings.theme = 'light'; // ⚠️ allowed — shallow only

/**
 * How Readonly<T> works internally:
 *
 * type Readonly<T> = {
 *   readonly [K in keyof T]: T[K];
 * }
 */

/**
 * =========================================================
 * 4. Pick<T, K>
 * =========================================================
 *
 * Creates a new type with ONLY the keys you specify.
 * K must be a union of keys that exist in T.
 *
 * Use case: API response shapes, form subsets, projections
 */

type UserPreview = Pick<User, 'id' | 'name'>;

// Equivalent to:
// type UserPreview = {
//   id:   number;
//   name: string;
// }

const preview: UserPreview = { id: 1, name: 'Zaffar' };
// preview.email; // ❌ not in the picked type

/**
 * Real-world: different shapes for different API endpoints
 */

type UserListItem = Pick<User, 'id' | 'name' | 'role'>;
type UserCardProps = Pick<User, 'name' | 'email'>;
type UserAudit = Pick<User, 'id' | 'email' | 'role'>;

function renderUserCard(props: UserCardProps): void {
  console.log(`${props.name} — ${props.email}`);
}

renderUserCard({ name: 'Zaffar', email: 'z@x.com' }); // ✅

/**
 * How Pick<T, K> works internally:
 *
 * type Pick<T, K extends keyof T> = {
 *   [P in K]: T[P];
 * }
 */

/**
 * =========================================================
 * 5. Omit<T, K>
 * =========================================================
 *
 * Opposite of Pick — creates a new type with specified
 * keys REMOVED. Everything else stays.
 *
 * Use case: strip sensitive fields, remove auto-generated fields
 */

type UserWithoutId = Omit<User, 'id'>;

// Equivalent to:
// type UserWithoutId = {
//   name:  string;
//   email: string;
//   age:   number;
//   role:  "admin" | "user" | "guest";
// }

// Omit multiple keys
type PublicUser = Omit<User, 'email' | 'age'>;
// type PublicUser = {
//   id:   number;
//   name: string;
//   role: "admin" | "user" | "guest";
// }

/**
 * Real-world: CREATE payload — strip id (server generates it)
 */

type CreateUserPayload = Omit<User, 'id'>;

function createUser(payload: CreateUserPayload): User {
  return { id: Math.random(), ...payload }; // server assigns id
}

createUser({ name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' }); // ✅

/**
 * Real-world: safe public-facing type (no sensitive fields)
 */

type SensitiveUser = User & { password: string; token: string };

type SafeUser = Omit<SensitiveUser, 'password' | 'token'>;
// password and token are gone — safe to send to frontend

/**
 * How Omit<T, K> works internally:
 *
 * type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
 *
 * It uses Pick + Exclude together under the hood.
 * You will build Exclude yourself in the Advanced section.
 */

/**
 * =========================================================
 * 6. Record<K, V>
 * =========================================================
 *
 * Creates an object type with keys of type K
 * and values of type V.
 *
 * Use case: maps, dictionaries, lookup tables, caches
 */

// Basic — string keys, number values
type ScoreMap = Record<string, number>;

const scores: ScoreMap = {
  Zaffar: 95,
  Ali: 88,
  Sara: 72,
};

/**
 * Record with literal union keys
 * Keys are constrained — only specific strings allowed
 */

type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

// permissions.superuser = [...]; // ❌ not in the key union

/**
 * Record with object values
 */

type UserCache = Record<number, User>;

const usersCache: UserCache = {
  1: { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' },
  2: { id: 2, name: 'Alex', email: 'a@x.com', age: 25, role: 'admin' },
};

function getUserFromCache(id: number): User | undefined {
  return usersCache[id];
}

/**
 * Real-world: status → UI label mapping
 */

type Status = 'loading' | 'success' | 'error' | 'idle';

type StatusConfig = Record<Status, { label: string; color: string }>;

const statusConfig: StatusConfig = {
  loading: { label: 'Loading...', color: 'blue' },
  success: { label: 'Done!', color: 'green' },
  error: { label: 'Failed', color: 'red' },
  idle: { label: 'Waiting', color: 'gray' },
};

// statusConfig.loading.label → "Loading..." ✅

/**
 * How Record<K, V> works internally:
 *
 * type Record<K extends keyof any, V> = {
 *   [P in K]: V;
 * }
 */

/**
 * =========================================================
 * 7. Combining Utility Types
 * =========================================================
 *
 * The real power comes from composing them together.
 */

/**
 * Pattern 1: Readonly + Partial
 * Immutable optional config object
 */

type AppSettings = Readonly<Partial<User>>;
// All fields optional AND all fields readonly
// Safe to pass around — nothing can be changed or forced

const settings: AppSettings = { name: 'Zaffar' };
// settings.name = "Ali"; // ❌ readonly

/**
 * Pattern 2: Pick + Partial
 * Update only specific fields (common PATCH pattern)
 */

type UpdateNameOrEmail = Partial<Pick<User, 'name' | 'email'>>;
// type: { name?: string; email?: string }

function patchNameOrEmail(id: number, data: UpdateNameOrEmail): void {
  console.log(`Patching user ${id}`, data);
}

patchNameOrEmail(1, { name: 'Ali' }); // ✅
patchNameOrEmail(1, { email: 'new@x.com' }); // ✅
patchNameOrEmail(1, {}); // ✅ nothing changed

/**
 * Pattern 3: Omit + Required
 * Full object minus id, everything else required
 * Classic CREATE endpoint shape
 */

type CreatePayload = Required<Omit<User, 'id'>>;
// id is gone, all remaining fields are required

const newUser: CreatePayload = {
  name: 'Zaffar',
  email: 'z@x.com',
  age: 22,
  role: 'user',
}; // ✅ must have all fields except id

/**
 * Pattern 4: Record + Pick
 * Lookup table with typed keys from another type
 */

type UserFields = Pick<User, 'name' | 'email' | 'role'>;
type FieldLabels = Record<keyof UserFields, string>;

const labels: FieldLabels = {
  name: 'Full Name',
  email: 'Email Address',
  role: 'Access Level',
};

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Partial<T>        → all fields optional        (PATCH payloads)
 * Required<T>       → all fields required         (after validation)
 * Readonly<T>       → all fields readonly         (immutable config)
 * Pick<T, K>        → keep only K fields          (projections)
 * Omit<T, K>        → remove K fields             (strip sensitive data)
 * Record<K, V>      → object with K keys, V values (lookup tables)
 *
 * Mental model:
 * Partial  ↔  Required   (opposites)
 * Pick     ↔  Omit       (opposites)
 * Record              →  build from scratch
 * Readonly            →  lock after creation
 *
 * Combining:
 * Partial<Pick<T,K>>        → optional subset     (PATCH specific fields)
 * Required<Omit<T,"id">>    → full minus id       (CREATE payload)
 * Readonly<Partial<T>>      → immutable draft     (frozen optional state)
 * Record<keyof T, string>   → label/config map    (form labels, UI config)
 *
 * ⚠️ Readonly is SHALLOW — nested objects are still mutable
 *
 * =========================================================
 */
