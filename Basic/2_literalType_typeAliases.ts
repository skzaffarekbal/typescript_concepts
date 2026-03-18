/**
 * =========================================================
 * 9. Literal Types & Type Alias
 * =========================================================
 */

/**
 * Literal Types:
 * - Restrict values to specific constants
 * - Useful for strict control (e.g., API responses, UI states)
 */
console.info(
  '%c9. Literal Types & Type Alias',
  'color: yellow; font-weight: bold; font-size: 18px',
);

let direction: 'left' | 'right';

direction = 'left'; // ✅
direction = 'right'; // ✅
// direction = "up";  ❌ Error

/**
 * Real-world example (React state)
 */

type Status = 'loading' | 'success' | 'error';

let apiStatus: Status = 'loading';

// ---------------------------------------------------------
// 2. as const
// ---------------------------------------------------------

// Without `as const` — TypeScript widens the type
const colorsArr = ["red", "green", "blue"];
// type: string[]  ← too broad

// With `as const` — freezes to exact literal types
const colorsConst = ["red", "green", "blue"] as const;
// type: readonly ["red", "green", "blue"]  ← exact literals

// Very useful for objects too
const CONFIG = {
  endpoint: "/api/v1",
  timeout: 3000,
  method: "GET",
} as const;

// CONFIG.method is now "GET" (literal), not string
// CONFIG.timeout = 5000; ❌ Error — readonly

// Common real-world pattern (replaces enums in many codebases)
const DIRECTIONS = ["up", "down", "left", "right"] as const;
type Direction = typeof DIRECTIONS[number]; // "up" | "down" | "left" | "right"

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
