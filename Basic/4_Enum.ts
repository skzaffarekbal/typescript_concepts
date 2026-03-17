/**
 * =========================================================
 * 3. Enums
 * =========================================================
 */

/**
 * Numeric Enum (default)
 */

enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

let move: Direction = Direction.Up;

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