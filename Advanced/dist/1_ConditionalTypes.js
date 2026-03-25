"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' };
    });
}
function getName() {
    return 'Zaffar';
}
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
function add(a, b) {
    return a + b;
}
function loadUser() {
    return __awaiter(this, void 0, void 0, function* () {
        return { id: 1, name: 'Zaffar', email: 'z@x.com', age: 22, role: 'user' };
    });
}
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
function createPost(title, content, published) { }
function schedulePost(...args) {
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
    getUser(id) {
        return { id, name: "Zaffar", email: "z@x.com", age: 22, role: "user" };
    }
}
// type: UserService (the instance, not the class itself)
// Useful when you have a reference to the CLASS not an instance
function createService(Cls) {
    return new Cls();
}
const service = createService(UserService); // type: UserService ✅
const cfg = {
    server: { host: "localhost", port: 3000 },
    db: { url: "mongodb://...", name: "mydb" },
};
function parse(value) {
    if (typeof value === "string") {
        return Number(value);
    }
    return String(value);
}
const parsed1 = parse("42"); // type: number ✅
const parsed2 = parse(42); // type: string ✅
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
