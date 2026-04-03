"use strict";
/**
 * =========================================================
 * Template Literal Types
 * =========================================================
 */
let g = 'Hello, Zaffar'; // ✅
const box = {
    'margin-top': 16,
    'padding-left': 8,
};
function fetch(route) {
    console.log(route);
}
fetch('/api/product'); // ✅
fetch('/api/order/42'); // ✅
// "cart:created" | "cart:updated" | "cart:deleted"
// "wishlist:created" | ...
function emit(event) {
    console.log(event);
}
emit('cart:created'); // ✅
emit('wishlist:deleted'); // ✅
/**
 * SUMMARY
 *
 * `${A}-${B}`       → combine literal types
 * Union inside ${}  → generates all combinations
 * + Capitalize etc. → transform casing at type level
 * + infer           → extract parts of a string type
 *
 * Common uses:
 * - Event names       ("cart:created")
 * - CSS class names   ("red-sm")
 * - API routes        ("/api/product")
 * - Handler names     ("onClick" → "click")
 */
