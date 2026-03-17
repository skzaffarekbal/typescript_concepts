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

let num: number = 10;
let str: string = 'Hello';
let isActive: boolean = true;

let nothing: null = null;
let notDefined: undefined = undefined;

// bigint
let bigNumber: bigint = 12345678901234567890n;

// symbol
let sym: symbol = Symbol('id');

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

let valueAny: any = 'Hello';

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

let valueUnknown: unknown = 'Hello';

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

function logMessage(msg: string): void {
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

function throwError(message: string): never {
  throw new Error(message);
}

// Infinite loop example
function infiniteLoop(): never {
  while (true) {}
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

let numbers: number[] = [1, 2, 3];

let names: Array<string> = ['A', 'B', 'C'];

/**
 * ------------------------------------------
 * Readonly Arrays
 * ------------------------------------------
 * - Cannot modify array after creation
 */

let readonlyArr: readonly number[] = [1, 2, 3];

// readonlyArr.push(4); ❌ Error
// readonlyArr[0] = 10; ❌ Error

/**
 * Another way using Readonly<>
 */

let readonlyArr2: Readonly<number[]> = [1, 2, 3];

// readonlyArr2.pop(); ❌ Error

/**
 * --------------------------------
 * 8. Tuples
 * --------------------------------
 * Fixed length + fixed types at each position
 */

let user: [string, number] = ['Zaffar', 25];

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

let person: [name: string, age: number] = ['Zaffar', 25];

/**
 * Benefits:
 * - Improves readability
 * - Useful in APIs and function returns
 */

function getUser(): [userId: number, userName: string] {
  return [1, 'Zaffar'];
}

const [userId, userName] = getUser();

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
