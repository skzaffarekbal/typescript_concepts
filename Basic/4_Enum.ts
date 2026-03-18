/**
 * =========================================================
 * 11. Enums
 * =========================================================
 */

/**
 * Numeric Enum (default)
 */

console.info(
  '%c11. Enum',
  'color: yellow; font-weight: bold; font-size: 18px',
);

enum Directions {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

let move: Directions = Directions.Up;

/**
 * Custom numeric values
 */

enum StatusCode {
  Success = 200,
  NotFound = 404,
}

/**
 * -----------------------------------------
 * String Enum
 * -----------------------------------------
 */

enum Role {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST',
}

let userRole: Role = Role.Admin;

/**
 * -----------------------------------------
 * Const Enum (Performance Optimized)
 * -----------------------------------------
 * - Removed during compilation
 * - Faster execution
 */

const enum Colors {
  Red,
  Green,
  Blue,
}

let color = Colors.Red;

/**
 * 🔥 Key Points:
 *
 * Numeric Enum -> auto numbers
 * String Enum  -> readable values
 * Const Enum   -> optimized (no runtime code)
 */