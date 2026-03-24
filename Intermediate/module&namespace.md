# TypeScript Modules & Namespaces

## Contents

1. What is a Module?
2. Named Exports & Imports
3. Default Exports & Imports
4. Re-exports
5. Import Aliases
6. Type-only Imports/Exports
7. Barrel Files (index.ts pattern)
8. Namespaces
9. Declaration Merging
   - Interface Merging
   - Namespace Merging
   - Function + Namespace Merging

---

## 1. What is a Module?

In TypeScript, any file with a top-level import or export is treated as a **MODULE**.

- **Without import/export** → file is a SCRIPT (global scope, dangerous)
- **With import/export** → file is a MODULE (isolated scope, safe)

**Rule of thumb:** Always have at least one export per file.

---

## 2. Named Exports & Imports

### file: `math.ts`

```typescript
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export type MathOperation = (a: number, b: number) => number;
```

### file: `main.ts`

```typescript
import { PI, add, subtract } from "./math";
// import { MathOperation } from "./math";

console.log(PI);          // 3.14159
console.log(add(2, 3));   // 5
```

---

## 3. Default Exports & Imports

- Only **ONE** default export per file
- Importer can name it **ANYTHING**
- No curly braces needed on import

### file: `logger.ts`

```typescript
export default function log(message: string): void {
  console.log(`[LOG]: ${message}`);
}
```

### file: `main.ts`

```typescript
import log from "./logger";         // ✅ named "log"
import myLogger from "./logger";    // ✅ also valid — any name works

log("App started");
myLogger("Also works");
```

### 🔥 Named vs Default

| Aspect | Named | Default |
|--------|-------|---------|
| Syntax | `{ curly braces }` | No braces |
| Name | Must match export | Any name |
| Per file | Multiple | One only |

---

## 4. Re-exports

Export something from another file without importing it first.

### file: `utils/string.ts`

```typescript
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

### file: `utils/number.ts`

```typescript
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
```

### file: `utils/index.ts` (re-exporting everything)

```typescript
export { capitalize } from "./string";
export { clamp } from "./number";

// Re-export and rename
export { capitalize as toTitleCase } from "./string";

// Re-export everything from a file
export * from "./string";
```

### file: `main.ts`

```typescript
import { capitalize, clamp } from "./utils"; // clean single import
```

---

## 5. Import Aliases

Rename imports to avoid naming conflicts.

### file: `main.ts`

```typescript
import { add as addNumbers } from "./math";
import { add as addStrings } from "./stringUtils"; // hypothetical

addNumbers(1, 2);
addStrings("Hello", "World");

// Import entire module as a namespace object
import * as MathUtils from "./math";

console.log(MathUtils.PI);
console.log(MathUtils.add(2, 3));
```

---

## 6. Type-only Imports & Exports

`import type` — tells TypeScript this import is **ONLY a type**
- Completely erased at compile time (zero runtime cost)
- Prevents accidental value usage
- Best practice when importing only types/interfaces

### file: `types.ts`

```typescript
export type UserType = {
  id: number;
  name: string;
};

export interface ProductInterface {
  id: number;
  price: number;
}

export const TAX_RATE = 0.18; // a value, not a type
```

### file: `main.ts`

```typescript
import type { UserType, ProductInterface } from "./types";
// TAX_RATE cannot be imported with `import type` — it's a value

// ✅ Can use as type annotation
const user: UserType = { id: 1, name: "Zaffar" };

// ❌ Cannot use as a value (it's erased at runtime)
// const x = UserType; // Error
```

---

## 7. Barrel Files (index.ts pattern)

A barrel file collects and re-exports from multiple files so consumers have one clean import path.

Very common in large projects and libraries.

### Folder structure

```
src/
  models/
    user.ts
    product.ts
    order.ts
    index.ts   ← barrel file
  main.ts
```

### file: `models/user.ts`

```typescript
export type User = { id: number; name: string };
```

### file: `models/product.ts`

```typescript
export type Product = { id: number; price: number };
```

### file: `models/order.ts`

```typescript
export type Order = { id: number; userId: number };
```

### file: `models/index.ts` (barrel)

```typescript
export type { User } from "./user";
export type { Product } from "./product";
export type { Order } from "./order";
```

### file: `main.ts`

```typescript
// ❌ Without barrel — messy
import { User } from "./models/user";
import { Product } from "./models/product";
import { Order } from "./models/order";

// ✅ With barrel — clean single import
import type { User, Product, Order } from "./models";
```

---

## 8. Namespaces

Namespaces are TypeScript's **OLD** way of organizing code before ES Modules existed.

**Today:** use modules (import/export) for NEW code

Namespaces still appear in:
- Legacy codebases
- Declaration files (`.d.ts`)
- Grouping related types logically

### Basic Namespace

```typescript
namespace Validation {
  // Only exported members are accessible outside
  export interface StringValidator {
    isValid(value: string): boolean;
  }

  export function isEmpty(value: string): boolean {
    return value.trim().length === 0;
  }

  // Private to namespace — not accessible outside
  const MAX_LENGTH = 100;

  export function isWithinLength(value: string): boolean {
    return value.length <= MAX_LENGTH; // can use private MAX_LENGTH here
  }
}

// Usage
const result = Validation.isEmpty("  "); // true
const withinLength = Validation.isWithinLength("Hello"); // true

// Validation.MAX_LENGTH; // ❌ not exported
```

### Nested Namespaces

```typescript
namespace App {
  export namespace Utils {
    export function formatDate(date: Date): string {
      return date.toISOString().split("T")[0];
    }
  }

  export namespace Models {
    export type AppUser = {
      id: number;
      name: string;
    };
  }
}

const today = App.Utils.formatDate(new Date());
const appUser: App.Models.AppUser = { id: 1, name: "Zaffar" };
```

---

## 9. Declaration Merging

TypeScript allows multiple declarations with the **SAME name** to be merged into a single definition.

### Works with:
- ✅ Interfaces (most common)
- ✅ Namespaces
- ✅ Function + Namespace
- ✅ Class + Namespace

### Does NOT work with:
- ❌ Type aliases (duplicate type = error)
- ❌ Classes alone

---

### 9a. Interface Merging

Same interface name = automatically merged

```typescript
interface Window {
  title: string;
}

interface Window {
  location: string;
}

// Result — TypeScript sees ONE merged interface:
// interface Window {
//   title: string;
//   location: string;
// }

const win: Window = {
  title: "TypeScript",
  location: "https://example.com",
};
```

**Real-world use case:** Extending third-party library types without editing their source

```typescript
// Suppose Express defines:
// interface Request { body: any; }

// You extend it in your own file:
// interface Request {
//   user?: { id: number; role: string };
// }

// Now req.user is available everywhere — no library edit needed
```

---

### 9b. Namespace Merging

Two namespaces with the same name merge their exports.

```typescript
namespace Shapes {
  export interface Circle {
    radius: number;
  }
}

namespace Shapes {
  export interface Square {
    side: number;
  }

  export function area(square: Square): number {
    return square.side * square.side;
  }
}

// Both declarations merge — all available under Shapes
const c: Shapes.Circle = { radius: 5 };
const sq: Shapes.Square = { side: 4 };
console.log(Shapes.area(sq)); // 16
```

---

### 9c. Function + Namespace Merging

Add properties to a function using a namespace. This is how many JS libraries are typed (e.g. moment, jest).

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}

namespace greet {
  export const defaultName = "Guest";

  export function formal(name: string): string {
    return `Good day, ${name}`;
  }
}

// Now `greet` is both a callable function AND has properties
console.log(greet("Zaffar"));               // Hello, Zaffar
console.log(greet.defaultName);             // Guest
console.log(greet.formal("Zaffar"));        // Good day, Zaffar
```

---

### 9d. Class + Namespace Merging

Add static-like helpers to a class using a namespace.

```typescript
class Color {
  constructor(public hex: string) {}
}

namespace Color {
  export const RED = new Color("#FF0000");
  export const GREEN = new Color("#00FF00");
  export const BLUE = new Color("#0000FF");

  export function fromRGB(r: number, g: number, b: number): Color {
    const hex = [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("");
    return new Color(`#${hex}`);
  }
}

const red = Color.RED;                        // Color { hex: '#FF0000' }
const custom = Color.fromRGB(100, 149, 237);  // Color { hex: '#6495ed' }
const myColor = new Color("#123456");         // normal instantiation still works
```

---

## Final Interview Summary

### Modules

- **Named export/import** → `{ curly braces }`, exact name
- **Default export** → no braces, any name, one per file
- **Re-export** → `export { x } from "./file"`
- **Import alias** → `import { x as y }`
- **Namespace import** → `import * as Obj from "./file"`
- **import type** → type-only, erased at compile time
- **Barrel file** → index.ts collects + re-exports

### Namespaces

- Old way of organizing code
- Still used in `.d.ts` files and legacy code
- **export** inside namespace = accessible outside

### Declaration Merging

- **Interface + Interface** → merged into one
- **Namespace + Namespace** → merged exports
- **Function + Namespace** → function gets properties
- **Class + Namespace** → class gets static helpers
- **type alias** → ❌ NO merging (error)

### Modules vs Namespaces

| Aspect | Modules | Namespaces |
|--------|---------|-----------|
| Era | Modern | Old |
| Organization | File-based | Single-file grouping |
| New code | ✅ Use | ❌ Avoid |
