"use strict";
/**
 * =========================================================
 * 13. Functions in TypeScript
 * =========================================================
 */
console.info('%c13. Functions in TypeScript', 'color: yellow; font-weight: bold; font-size: 18px');
/**
 * -----------------------------------------
 * Parameter Types + Return Types
 * -----------------------------------------
 */
function addValue(a, b) {
    return a + b;
}
/**
 * If return type is not written,
 * TypeScript will infer it automatically.
 */
const multiply = (a, b) => a * b;
/**
 * -----------------------------------------
 * Optional Parameters (?)
 * -----------------------------------------
 * - Parameter may or may not be passed
 * - Must be at the END
 */
function greet(name, age) {
    if (age) {
        console.log(`Hello ${name}, Age: ${age}`);
    }
    else {
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
function greetUser(name = "Guest") {
    console.log(`Hello ${name}`);
}
greetUser(); // Guest
greetUser("Zaffar");
/**
 * -----------------------------------------
 * Rest Parameters
 * -----------------------------------------
 * - Accept multiple values as an array
 */
function sum(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
sum(1, 2, 3, 4);
const subtract = (a, b) => a - b;
function getLength(value) {
    return value.length;
}
getLength("Hello"); // string
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
