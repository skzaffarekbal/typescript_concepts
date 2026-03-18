/**
 * =========================================================
 * 13. Functions in TypeScript
 * =========================================================
 */

console.info(
  '%c13. Functions in TypeScript',
  'color: yellow; font-weight: bold; font-size: 18px',
);

/**
 * -----------------------------------------
 * Parameter Types + Return Types
 * -----------------------------------------
 */

function addValue(a: number, b: number): number {
  return a + b;
}

/**
 * If return type is not written,
 * TypeScript will infer it automatically.
 */

const multiply = (a: number, b: number) => a * b;

/**
 * -----------------------------------------
 * Optional Parameters (?)
 * -----------------------------------------
 * - Parameter may or may not be passed
 * - Must be at the END
 */

function greet(name: string, age?: number) {
  if (age) {
    console.log(`Hello ${name}, Age: ${age}`);
  } else {
    console.log(`Hello ${name}`);
  }
}

greet("Zaffar");
greet("Zaffar", 22);

/**
 * -----------------------------------------
 * Default Parameters
 * -----------------------------------------
 * - Assign default value if not provided
 */

function greetUser(name: string = "Guest") {
  console.log(`Hello ${name}`);
}

greetUser();        // Guest
greetUser("Zaffar");

/**
 * -----------------------------------------
 * Rest Parameters
 * -----------------------------------------
 * - Accept multiple values as an array
 */

function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

sum(1, 2, 3, 4);

/**
 * -----------------------------------------
 * Function Type Alias
 * -----------------------------------------
 */

type Operation = (a: number, b: number) => number;

const subtract: Operation = (a, b) => a - b;

/**
 * -----------------------------------------
 * Function Overloading
 * -----------------------------------------
 * - Multiple function signatures
 * - One implementation
 */

function getLength(value: string): number;
function getLength(value: any[]): number;

function getLength(value: any): number {
  return value.length;
}

getLength("Hello");   // string
getLength([1, 2, 3]); // array

/**
 * 🔥 Important:
 * Overloads define "how function can be called"
 */

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Functions:
 * - parameter types
 * - return types
 * - optional (?)
 * - default values
 * - rest parameters (...args)
 * - overloads
 *
 */
