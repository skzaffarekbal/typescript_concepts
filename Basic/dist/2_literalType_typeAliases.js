"use strict";
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
let direction;
direction = 'left'; // ✅
direction = 'right'; // ✅
let apiStatus = 'loading';
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
