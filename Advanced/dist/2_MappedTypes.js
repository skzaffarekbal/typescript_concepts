"use strict";
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
// All readonly removed — fields are writable again
const user = {
    id: 1,
    name: 'Zaffar',
    email: 'z@x.com',
    age: 22,
    isActive: true,
};
user.name = 'Ali'; // ✅ mutable now
class UserServices {
    constructor() {
        this.id = 1;
        this.name = 'Zaffar';
    }
    getUser() {
        return {};
    }
    deleteUser() { }
}
// { admin: boolean; user: boolean; guest: boolean }
const flags = {
    admin: true,
    user: true,
    guest: false,
};
const handlers = {
    GET: (path) => console.log(`GET ${path}`),
    POST: (path) => console.log(`POST ${path}`),
    PUT: (path) => console.log(`PUT ${path}`),
    DELETE: (path) => console.log(`DELETE ${path}`),
};
const statusConfig = {
    idle: { label: 'Waiting', color: 'gray', icon: 'clock' },
    loading: { label: 'Loading...', color: 'blue', icon: 'spin' },
    success: { label: 'Done!', color: 'green', icon: 'check' },
    error: { label: 'Failed', color: 'red', icon: 'cross' },
};
const partialCfg = {
    server: { host: 'localhost' }, // port is optional ✅
}; // db is optional ✅
const userValidators = {
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
