# Declaration Files: `.d.ts`, DefinitelyTyped, Module Augmentation

Declaration files contain **only type information** — no JavaScript is generated from them. They tell TypeScript "this thing exists, here is its shape."

---

## 1. What is a `.d.ts` file?

A `.d.ts` file is the "type shadow" of a `.js` file. When you have plain JavaScript with no types, you create a companion declaration file.

```js
// discount.js
function applyDiscount(price, percent) {
  return price - (price * percent) / 100;
}
module.exports = { applyDiscount };
```

```ts
// discount.d.ts
export declare function applyDiscount(price: number, percent: number): number;
```

Now TypeScript understands the JS file fully. ✅

---

## 2. The `declare` keyword

`declare` tells TypeScript: _"This thing EXISTS at runtime — I'm just describing it, not creating it."_

```ts
// Variables injected by a bundler
declare const __APP_VERSION__: string;
declare const __IS_PROD__: boolean;

console.log(__APP_VERSION__); // ✅ TypeScript trusts it exists

// Global function loaded via CDN
declare function analytics(event: string, data?: object): void;

analytics("page_view", { page: "/home" }); // ✅

// Global class
declare class EventBus {
  on(event: string, handler: () => void): void;
  emit(event: string): void;
}
```

---

## 3. Writing a `.d.ts` for a JS module

When a third-party JS module has no types, you write a declaration file for it.

```ts
// price-utils.d.ts
declare module "price-utils" {
  export interface PriceOptions {
    currency: "USD" | "EUR" | "GBP";
    decimals?: number;
  }

  export function format(value: number, options: PriceOptions): string;
  export function parse(value: string): number;
  export function convert(amount: number, from: string, to: string): number;

  export const DEFAULT_CURRENCY: string;
}

// import { format, parse } from "price-utils"; ✅
```

---

## 4. Ambient Module — Wildcard Declarations

Declare all imports of a certain file pattern at once. Useful for assets handled by webpack/vite.

```ts
// global.d.ts
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const styles: Record<string, string>;
  export default styles;
}

// import logo from "./logo.svg";  ✅
// import "./styles.css";          ✅
```

---

## 5. DefinitelyTyped (`@types/*`)

DefinitelyTyped is a massive open-source repository of `.d.ts` files for popular JavaScript libraries.
Hosted at [github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

```bash
npm install --save-dev @types/lodash
npm install --save-dev @types/node
npm install --save-dev @types/express
```

After install — full type safety automatically:

```ts
import _ from "lodash";
_.chunk([1, 2, 3, 4], 2); // ✅ TypeScript knows the signature
```

> Many modern packages ship their own types now (axios, zod, prisma) — no `@types` needed for these. Check for a `"types"` or `"typings"` field in `package.json`.

Control which `@types` are included in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

---

## 6. Module Augmentation

Add new properties to an **existing module's types** without editing the original library source.

```ts
// express.d.ts
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: "admin" | "seller" | "buyer";
    };
  }
}

// Now in any route handler:
// app.get("/profile", (req, res) => {
//   req.user?.id;    ✅
//   req.user?.role;  ✅
// });
```

---

## 7. Global Augmentation

Add properties to built-in global types like `Window`, `Array`, etc.

```ts
// global.d.ts
declare global {
  interface Window {
    analytics: (event: string) => void;
    featureFlags: Record<string, boolean>;
  }

  interface Array<T> {
    last(): T | undefined;
  }

  type ID = string | number;
}

// This export is REQUIRED to make the file a module
export {};

// window.analytics("purchase");     ✅
// window.featureFlags["darkMode"];   ✅
// [1, 2, 3].last();                  ✅
// let id: ID = 42;                   ✅ — ID is global, no import needed
```

---

## 8. Augmenting Your Own Modules

Useful when splitting a large type across files or building a plugin system.

```ts
// catalogue.ts
export interface Catalogue {
  name: string;
  category: string;
}

// catalogue-pricing.d.ts
import "./catalogue";

declare module "./catalogue" {
  interface Catalogue {
    basePrice: number;
    discount?: number;
  }
}

// Catalogue now has: name, category, basePrice, discount ✅
```

---

## Summary

| Concept             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `.d.ts` file        | Type-only file, no JS output               |
| `declare`           | "This exists at runtime, here's its shape" |
| `declare module`    | Describe a JS module or file type pattern  |
| `declare global`    | Add to global scope (Window, Array, etc.)  |
| DefinitelyTyped     | Community `.d.ts` repository               |
| `@types/<pkg>`      | Install types for untyped JS packages      |
| Module augmentation | Add to an existing module's types          |
| Global augmentation | Add to built-in global types               |

> **Rule:** An augmentation file must be a **module** — it needs at least one `import` or `export`, otherwise merging won't work correctly.
