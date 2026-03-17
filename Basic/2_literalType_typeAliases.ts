/**
 * =========================================================
 * 1. Literal Types & Type Alias
 * =========================================================
 */

/**
 * Literal Types:
 * - Restrict values to specific constants
 * - Useful for strict control (e.g., API responses, UI states)
 */

let direction: 'left' | 'right';

direction = 'left'; // ✅
direction = 'right'; // ✅
// direction = "up";  ❌ Error

/**
 * Real-world example (React state)
 */

type Status = 'loading' | 'success' | 'error';

let apiStatus: Status = 'loading';

/**
 * -----------------------------------------
 * Type Alias
 * -----------------------------------------
 * - Create reusable custom types
 * - Works with primitives, objects, unions, etc.
 */

type User = {
  id: number;
  name: string;
};

/**
 * Using Type Alias
 */

let user1: User = {
  id: 1,
  name: 'Zaffar',
};

/**
 * Type Alias with Union
 */

type ID = number | string;

let userID: ID = 101;
userID = 'abc123';

/**
 * Type Alias with Functions
 */

type Add = (a: number, b: number) => number;

const add: Add = (a, b) => a + b;

/**
 * 🔥 Key Points:
 *
 * - Literal Types → restrict values
 * - Type Alias → reusable types
 */

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Literal Types  -> fixed values ("left", "right")
 * Type Alias     -> reusable types
 * Narrowing      -> refine union types
 */
