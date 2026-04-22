// =========================================================
// src/utils/helpers.d.ts
// =========================================================
//
// Declaration file — describes the SHAPE of helpers.ts
// to TypeScript. No implementation here — types only.
//
// Rules:
// - Every function uses `export declare function`
// - Every type uses `export declare type` or `export type`
// - No function bodies — just signatures
// - Must exactly match what helpers.ts actually exports
// =========================================================

// -------------------------------------------------------
// generateId
// -------------------------------------------------------

export declare function generateId(): string;

// -------------------------------------------------------
// formatCurrency
// -------------------------------------------------------

export declare function formatCurrency(
  amount: number,
  symbol?: string, // ? means optional — matches default param
): string;

// -------------------------------------------------------
// formatDate
// -------------------------------------------------------

export declare function formatDate(date: Date): string;

// -------------------------------------------------------
// truncate
// -------------------------------------------------------

export declare function truncate(text: string, maxLength: number): string;

// -------------------------------------------------------
// capitalize
// -------------------------------------------------------

export declare function capitalize(text: string): string;

// -------------------------------------------------------
// clamp
// -------------------------------------------------------

export declare function clamp(value: number, min: number, max: number): number;

// -------------------------------------------------------
// debounce
// -------------------------------------------------------
// Generic declaration — T must be a function type

export declare function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void;

// -------------------------------------------------------
// groupBy
// -------------------------------------------------------

export declare function groupBy<T>(items: T[], key: keyof T): Record<string, T[]>;

// =========================================================
// The difference between the two files — side by side
// =========================================================

// helpers.ts                     helpers.d.ts
// ─────────────────────────────────────────────────────────
// export function                export declare function
// generateId(): string {         generateId(): string;
//   return `${Date.now()}...`;
// }
//
// Has a body { }                 No body — just the signature
// Compiled to .js                Never compiled — types only
// Runtime code                   Compile-time contract

// =========================================================
// When does TypeScript use .d.ts vs .ts?
// =========================================================
//
// TypeScript looks for types in this order:
//
// 1. If helpers.ts exists        → reads types from it directly
// 2. If only helpers.js exists   → looks for helpers.d.ts
// 3. If neither exists           → error: module not found
//
// In our project helpers.ts exists so TypeScript uses it.
// The .d.ts file is practice — in real projects you write
// .d.ts for third-party JS libraries that ship NO types.

// =========================================================
// Real-world example of when you NEED a .d.ts file
// =========================================================

// Suppose you install a tiny JS utility:
//   npm install price-formatter
//
// The package has no TypeScript types.
// You create: src/types/price-formatter.d.ts
//
// declare module 'price-formatter' {
//   export function format(value: number): string;
//   export function parse(value: string): number;
// }
//
// Now this works with full type safety:
//   import { format } from 'price-formatter'; ✅

// =========================================================
// Usage in the project — how other files import helpers
// =========================================================

// src/ui/render.ts
// import {
//   formatCurrency,
//   formatDate,
//   truncate,
//   capitalize,
// } from '../utils/helpers';
//
// formatCurrency(product.price)         → "₹1,500.00"
// formatDate(product.createdAt)         → "22 Jan 2025"
// truncate(product.name, 20)            → "Mechanical Keyboard..."
// capitalize(product.category)          → "Electronics"

// src/main.ts
// import { debounce, groupBy } from '../utils/helpers';
//
// const debouncedSearch = debounce(handleSearch, 300);
// searchInput.addEventListener('input', e => {
//   debouncedSearch((e.target as HTMLInputElement).value);
// });
//
// const byCategory = groupBy([...service.getAll()], 'category');

/**
 * SUMMARY
 *
 * helpers.ts
 *   → actual implementation
 *   → compiled to helpers.js in dist/
 *   → what runs in the browser
 *
 * helpers.d.ts
 *   → type contract only
 *   → never compiled
 *   → tells TypeScript what helpers.ts exports
 *
 * export declare function
 *   → "this function exists, here is its signature"
 *   → no body allowed
 *   → optional params use ?
 *
 * Real use cases for .d.ts:
 *   → third-party JS with no types
 *   → declaring global variables (window.myLib)
 *   → wildcard file imports (*.svg, *.css)
 *   → auto-generated from tsc --declaration
 *
 * Key rule:
 *   .d.ts signature MUST match .ts implementation exactly
 *   Mismatch = silent bugs at runtime
 */
