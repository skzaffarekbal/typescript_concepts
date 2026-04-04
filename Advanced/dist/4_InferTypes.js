"use strict";
/**
 * =========================================================
 * The infer Keyword
 * =========================================================
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getScore() {
    return 100;
}
function getLabel() {
    return 'gold';
}
function fetchCart() {
    return __awaiter(this, void 0, void 0, function* () {
        return { items: [] };
    });
}
function checkout(cartId, promoCode) { }
function applyDiscount(price) {
    return `$${price * 0.9}`;
}
// { input: number; output: string }
// --------------------------------------------------------
// 8. Real-world: inferring from a generic class
// --------------------------------------------------------
class Repository {
    constructor() {
        this.items = [];
    }
    add(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
}
const productRepo = new Repository();
/**
 * SUMMARY
 *
 * infer R                          → capture any type, name it R
 * T extends X<infer R> ? R : never → extract inner type of X
 *
 * Common patterns:
 * Array<infer I>              → element type
 * (...args: any[]) => infer R → return type
 * (arg: infer A) => any       → first param type
 * Promise<infer V>            → resolved value
 * `prefix${infer Rest}`       → string suffix extraction
 *
 * Rules:
 * - Only inside `extends` clause of a conditional type
 * - Can use multiple infer in one type
 * - Can be recursive (DeepAwaited)
 */
