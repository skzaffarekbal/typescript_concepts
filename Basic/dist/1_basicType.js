"use strict";
/**
 * ================================
 * TypeScript Basic Types
 * ================================
 *
 * Covers:
 * - Primitive Types
 * - Special Types (any, unknown, void, never)
 * - Arrays
 * - Tuples
 * - Literal Types
 * - Type Inference
 */
/**
 * --------------------------------
 * 1. Primitive Types
 * --------------------------------
 */
console.info('%c1. Primitive Types', 'color: yellow; font-weight: bold; font-size: 18px');
let num = 10;
let str = 'Hello';
let isActive = true;
let nothing = null;
let notDefined = undefined;
// bigint
let bigNumber = 12345678901234567890n;
// symbol
//Starting with ECMAScript 2015, symbol is a primitive data type, just like number and string. symbol values are created by calling the Symbol constructor.
let sym = Symbol('id');
let sym2 = Symbol('key');
let sym3 = Symbol('key');
sym2 === sym3; // false, symbols are unique
// Just like strings, symbols can be used as keys for object properties.
const sym1 = Symbol();
let obj = {
    [sym1]: 'value',
};
console.log(obj[sym1]); // "value"
// sym2 can only be a constant reference.
// let sym4: unique symbol = Symbol(); ❌ Error
const sym9 = Symbol();
// A variable whose type is a 'unique symbol' type must be 'const'.
// Works - refers to a unique symbol, but its identity is tied to 'sym1'.
let sym5 = sym9;
// Also works.
class C {
}
C.StaticSymbol = Symbol();
// Because each unique symbol has a completely separate identity, no two unique symbol types are assignable or comparable to each other.
const sym6 = Symbol();
const sym7 = Symbol();
/*
if (sym6 === sym7) {
This comparison appears to be unintentional because the types 'typeof sym2' and 'typeof sym3' have no overlap.
   // ...
} ❌ Error
*/
/**
 * --------------------------------
 * 2. Type Inference
 * --------------------------------
 * TypeScript automatically detects type
 */
let username = 'Zaffar'; // inferred as string
// username = 123; ❌ Error
/**
 * --------------------------------
 * 3. Any Type (Avoid Using)
 * --------------------------------
 * Disables type checking
 * - Turns OFF type checking
 * - You can do anything → unsafe
 */
let valueAny = 'Hello';
valueAny.toUpperCase(); // ✅ No error (but unsafe)
valueAny = 10;
valueAny.toFixed(); // ✅ No error
/**
 * --------------------------------
 * 4. Unknown Type (Safer than any)
 * --------------------------------
 * - Type-safe version of any
 * - You MUST check type before using
 */
let valueUnknown = 'Hello';
// valueUnknown.toUpperCase(); ❌ Error
if (typeof valueUnknown === 'string') {
    valueUnknown.toUpperCase(); // ✅ Safe
}
/**
 * 🔥 Key Difference:
 *
 * any     -> no safety ❌
 * unknown -> safe (requires type check) ✅
 */
/**
 * --------------------------------
 * 5. Void Type
 * --------------------------------
 * Used in functions that return nothing
 * It finishes execution
 */
function logMessage(msg) {
    console.log(msg);
    // return; (optional)
}
/**
 * --------------------------------
 * 6. Never Type
 * --------------------------------
 * Represents values that NEVER occur
 * - Function NEVER returns
 * - Either:
 *   1. throws error
 *   2. infinite loop
 */
function throwError(message) {
    throw new Error(message);
}
// Infinite loop example
function infiniteLoop() {
    while (true) { }
}
/**
 * 🔥 Key Difference:
 *
 * void  -> function ends normally
 * never -> function NEVER ends
 */
/**
 * --------------------------------
 * 7. Arrays
 * --------------------------------
 */
let numbers = [1, 2, 3];
let names = ['A', 'B', 'C'];
/**
 * ------------------------------------------
 * Readonly Arrays
 * ------------------------------------------
 * - Cannot modify array after creation
 */
let readonlyArr = [1, 2, 3];
// readonlyArr.push(4); ❌ Error
// readonlyArr[0] = 10; ❌ Error
/**
 * Another way using Readonly<>
 */
let readonlyArr2 = [1, 2, 3];
// readonlyArr2.pop(); ❌ Error
/**
 * --------------------------------
 * 8. Tuples
 * --------------------------------
 * Fixed length + fixed types at each position
 */
let user = ['Zaffar', 25];
// Access
console.log(user[0]); // string
console.log(user[1]); // number
/**
 * ------------------------------------------
 * Tuple Limitations
 * ------------------------------------------
 */
/**
 * ❗ Problem 1: Push still allowed (loophole)
 */
user.push('extra'); // ⚠️ Allowed (not strict at runtime)
/**
 * ❗ Problem 2: Index safety only for defined positions
 */
// user[2]; ❌ Error (compile time)
/**
 * ❗ Problem 3: Not fully strict like other languages
 */
/**
 * ------------------------------------------
 * Tuple Labels (Readable Tuples)
 * ------------------------------------------
 */
let person = ['Zaffar', 25];
/**
 * Benefits:
 * - Improves readability
 * - Useful in APIs and function returns
 */
function getUser() {
    return [1, 'Zaffar'];
}
const [userId, userName] = getUser();
// ---------------------------------------------------------
// object type & Index Signatures
// ---------------------------------------------------------
// The `object` type — anything that is not a primitive
let obj1 = { name: "Zaffar" };
let translations = {
    hello: "Hola",
    bye: "Adios",
};
let appConfig = {
    version: 1,
    theme: "dark",
    debug: true,
};
// ---------------------------------------------------------
// typeof in Type Position
// WHERE TO ADD: your Type Inference section (file 1, after section 2)
// ---------------------------------------------------------
// typeof at RUNTIME (in code) — checks value type
// typeof in TYPE POSITION — extracts TypeScript type from a variable
const apiResponse = {
    status: 200,
    data: { userId: 1, username: "Zaffar" },
};
// Equivalent to:
// type ApiResponse = { status: number; data: { userId: number; username: string } }
// Very useful with functions
function createUser(name, age) {
    return { name, age, createdAt: new Date() };
}
// type: { name: string; age: number; createdAt: Date }
// 🔥 Key Difference:
// typeof x         → at runtime: returns "string", "number", "object" etc.
// let y: typeof x  → in type position: copies x's full TypeScript type
/**
 * --------------------------------
 * Quick Interview Notes
 * --------------------------------
 *
 * any      -> no type safety ❌
 * unknown  -> type safe version of any ✅
 * void     -> no return value
 * never    -> function never returns
 * tuple    -> fixed structure array
 * literal  -> fixed allowed values
 *
 */
