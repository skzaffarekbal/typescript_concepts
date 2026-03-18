"use strict";
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
console.info('%c9. Literal Types & Type Alias', 'color: yellow; font-weight: bold; font-size: 18px');
let direction;
direction = 'left'; // ✅
direction = 'right'; // ✅
let apiStatus = 'loading';
// ---------------------------------------------------------
// 2. as const
// ---------------------------------------------------------
// Without `as const` — TypeScript widens the type
const colorsArr = ["red", "green", "blue"];
// type: string[]  ← too broad
// With `as const` — freezes to exact literal types
const colorsConst = ["red", "green", "blue"];
// type: readonly ["red", "green", "blue"]  ← exact literals
// Very useful for objects too
const CONFIG = {
    endpoint: "/api/v1",
    timeout: 3000,
    method: "GET",
};
// CONFIG.method is now "GET" (literal), not string
// CONFIG.timeout = 5000; ❌ Error — readonly
// Common real-world pattern (replaces enums in many codebases)
const DIRECTIONS = ["up", "down", "left", "right"];
/**
 * Using Type Alias
 */
let user1 = {
    id: 1,
    name: 'Zaffar',
};
let userID = 101;
userID = 'abc123';
const add = (a, b) => a + b;
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
