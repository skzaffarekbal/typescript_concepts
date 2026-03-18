/**
 * =========================================================
 * 14. Type Narrowing
 * =========================================================
 * - Used when variable has multiple possible types (Union)
 * - Helps TypeScript determine exact type
 */

console.info(
  '%c14. Type Narrowing',
  'color: yellow; font-weight: bold; font-size: 18px',
);

/**
 * -----------------------------------------
 * 1. typeof Narrowing
 * -----------------------------------------
 */

function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // string
  } else {
    console.log(value.toFixed()); // number
  }
}

/**
 * -----------------------------------------
 * 2. instanceof Narrowing
 * -----------------------------------------
 */

class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

/**
 * -----------------------------------------
 * 3. "in" Operator Narrowing
 * -----------------------------------------
 */

type Admin = {
  name: string;
  privileges: string[];
};

type UserData = {
  name: string;
  startDate: Date;
};

function printUser(user: Admin | UserData) {
  if ("privileges" in user) {
    console.log(user.privileges);
  } else {
    console.log(user.startDate);
  }
}

/**
 * -----------------------------------------
 * 4. Truthiness Narrowing
 * -----------------------------------------
 */

function printMessage(message: string | null) {
  if (message) {
    console.log(message.toUpperCase());
  } else {
    console.log("No message");
  }
}

/**
 * Falsy values:
 * - false
 * - 0
 * - ""
 * - null
 * - undefined
 */

/**
 * -----------------------------------------
 * 5. Equality Narrowing
 * -----------------------------------------
 */

function compare(a: string | number, b: string | number) {
  if (a === b) {
    // Both must be same type
    console.log("Equal values:", a);
  }
}

/**
 * Example
 */

compare(10, 10);       // number
compare("hi", "hi");   // string

/**
 * -----------------------------------------
 * BONUS: Custom Type Guard
 * -----------------------------------------
 */

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function printUpper(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  }
}

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Narrowing:
 * - typeof
 * - instanceof
 * - in
 * - truthy check
 * - equality check
 *
 */

// ---------------------------------------------------------
// 4. Non-null Assertion (!) vs Optional Chaining (?.)
// ---------------------------------------------------------

// Optional chaining (?.) — safe, returns undefined if null/undefined
// Non-null assertion (!) — UNSAFE, you're telling TS "trust me, it's not null"

type UserMaybe = {
  name: string | null;
};

const u: UserMaybe = { name: "Zaffar" };

// ?. — safe, TypeScript-friendly
const safeName = u.name?.toUpperCase();   // string | undefined

// ! — unsafe, use only when YOU are 100% sure it's not null
const forcedName = u.name!.toUpperCase(); // string (no check, you promised TS)

// 🔥 Key Rule:
// ?. → TypeScript handles the null case → result includes `undefined`
// !  → YOU handle it → if you're wrong, runtime crash
