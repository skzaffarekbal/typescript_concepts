"use strict";
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
// Equivalent to writing manually:
// type PartialUser = {
//   id?:    number;
//   name?:  string;
//   email?: string;
//   age?:   number;
//   role?:  "admin" | "user" | "guest";
// }
// ✅ Any combination of fields is valid
const draft = {};
const draft2 = { name: 'Zaffar' };
const draft3 = { name: 'Zaffar', age: 22 };
/**
 * Real-world: PATCH / update function
 * You only send the fields you want to change
 */
function updateUser(id, changes) {
    console.log(`Updating user ${id}`, changes);
}
updateUser(1, { name: 'Ali' }); // ✅ only name
updateUser(1, { age: 25, role: 'admin' }); // ✅ only age + role
updateUser(1, {}); // ✅ nothing (valid PATCH)
// Equivalent to:
// type FullConfig = {
//   host:  string;
//   port:  number;
//   debug: boolean;
// }
// ✅ All fields must be present
const configRequired = {
    host: 'localhost',
    port: 3000,
    debug: false,
};
// const badConfig: FullConfig = { host: "localhost" }; // ❌ port and debug missing
/**
 * Real-world: validate + return a fully populated object
 */
function validateConfig(input) {
    var _a, _b, _c;
    return {
        host: (_a = input.host) !== null && _a !== void 0 ? _a : 'localhost',
        port: (_b = input.port) !== null && _b !== void 0 ? _b : 3000,
        debug: (_c = input.debug) !== null && _c !== void 0 ? _c : false,
    };
}
const safeConfig = validateConfig({ host: 'example.com' });
// Equivalent to:
// type ReadonlyUser = {
//   readonly id:    number;
//   readonly name:  string;
//   readonly email: string;
//   readonly age:   number;
//   readonly role:  "admin" | "user" | "guest";
// }
const frozenUser = {
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
const APP_CONFIG = {
    host: 'api.example.com',
    port: 443,
    debug: false,
};
const readonlyProfile = {
    user: { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' },
    settings: { theme: 'dark' },
};
// readonlyProfile.user = { ... };       // ❌ cannot replace top-level
readonlyProfile.user.name = 'Ali'; // ⚠️ allowed — nested is not readonly
readonlyProfile.settings.theme = 'light'; // ⚠️ allowed — shallow only
// Equivalent to:
// type UserPreview = {
//   id:   number;
//   name: string;
// }
const preview = { id: 1, name: 'Zaffar' };
function renderUserCard(props) {
    console.log(`${props.name} — ${props.email}`);
}
renderUserCard({ name: 'Zaffar', email: 'z@x.com' }); // ✅
function createUser(payload) {
    return Object.assign({ id: Math.random() }, payload); // server assigns id
}
createUser({ name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' }); // ✅
const scores = {
    Zaffar: 95,
    Ali: 88,
    Sara: 72,
};
const permissions = {
    admin: ['read', 'write', 'delete'],
    user: ['read', 'write'],
    guest: ['read'],
};
const usersCache = {
    1: { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' },
    2: { id: 2, name: 'Alex', email: 'a@x.com', age: 25, role: 'admin' },
};
function getUserFromCache(id) {
    return usersCache[id];
}
const statusConfig = {
    loading: { label: 'Loading...', color: 'blue' },
    success: { label: 'Done!', color: 'green' },
    error: { label: 'Failed', color: 'red' },
    idle: { label: 'Waiting', color: 'gray' },
};
// All fields optional AND all fields readonly
// Safe to pass around — nothing can be changed or forced
const settings = { name: 'Zaffar' };
// type: { name?: string; email?: string }
function patchNameOrEmail(id, data) {
    console.log(`Patching user ${id}`, data);
}
patchNameOrEmail(1, { name: 'Ali' }); // ✅
patchNameOrEmail(1, { email: 'new@x.com' }); // ✅
patchNameOrEmail(1, {}); // ✅ nothing changed
// id is gone, all remaining fields are required
const newUser = {
    name: 'Zaffar',
    email: 'z@x.com',
    age: 22,
    role: 'user',
}; // ✅ must have all fields except id
const labels = {
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
