/**
 * =========================================================
 * 12. Interfaces
 * =========================================================
 */

/**
 * Basic Interface
 */

console.info(
  '%c12. Interfaces',
  'color: yellow; font-weight: bold; font-size: 18px',
);

interface USER {
  name: string;
  age: number;
}

let userA: USER = {
  name: 'Zaffar',
  age: 22,
};

/**
 * -----------------------------------------
 * Extending Interfaces
 * -----------------------------------------
 */

interface PERSON {
  personName: string;
}

interface EMPLOYEE extends PERSON {
  employeeId: number;
}

let emp: EMPLOYEE = {
  personName: 'Zaffar',
  employeeId: 123,
};

/**
 * -----------------------------------------
 * Interface Merging
 * -----------------------------------------
 * - Same interface name automatically merges
 */

interface Car {
  brand: string;
}

interface Car {
  model: string;
}

let myCar: Car = {
  brand: 'Toyota',
  model: 'Fortuner',
};

/**
 * -----------------------------------------
 * Interface vs Type
 * -----------------------------------------
 */

/**
 * Similarities:
 * - Both define object structure
 */

type UserType = {
  name: string;
};

interface UserInterface {
  name: string;
}

/**
 * Differences:
 *
 * Interface:
 * - Supports declaration merging ✅
 * - Better for objects & OOP
 *
 * Type:
 * - Supports unions, primitives, tuples ✅
 * - More flexible
 */

/**
 * Example where type is better
 */

type Responses = 'success' | 'error'; // ❗ not possible with interface

/**
 * Example where interface is better
 */

interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

/**
 * 🔥 Rule of Thumb:
 *
 * Use interface -> for objects / APIs
 * Use type      -> for unions / complex types
 */

// ---------------------------------------------------------
// Optional Chaining with Types
// ---------------------------------------------------------

type Address = {
  city: string;
  zip?: string; // optional
};

type UserWithAddress = {
  name: string;
  address?: Address; // optional nested object
};

const userB: UserWithAddress = { name: "Zaffar" };

// Without optional chaining ❌ — runtime crash if address is undefined
// console.log(userB.address.city);

// With optional chaining ✅ — returns undefined safely
console.log(userB.address?.city);       // undefined (no crash)
console.log(userB.address?.zip);        // undefined

// TypeScript knows the type is: string | undefined
const city = userB.address?.city;
// type of `city` → string | undefined

// Works with methods too
const upper = userB.address?.city?.toUpperCase(); // string | undefined