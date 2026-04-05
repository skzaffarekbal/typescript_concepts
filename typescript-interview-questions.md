# TypeScript Interview Questions — Basic to Advanced

---

## Basic

---

### Q1. What is TypeScript and why use it over JavaScript?

TypeScript is a **statically typed superset of JavaScript**. It compiles down to plain JavaScript.

**Why use it:**
- Catches errors at compile time, not runtime
- Better IDE support (autocomplete, refactoring)
- Self-documenting code — types describe the shape of data
- Safer refactoring in large codebases

```ts
// JavaScript — error only at runtime
function add(a, b) { return a + b; }
add("5", 10); // "510" — silent bug

// TypeScript — error at compile time
function add(a: number, b: number): number { return a + b; }
add("5", 10); // ❌ Argument of type 'string' is not assignable to 'number'
```

---

### Q2. What is the difference between `any` and `unknown`?

Both accept any value — but `unknown` is the **type-safe** version of `any`.

```ts
let a: any = "hello";
a.toUpperCase();   // ✅ no error — but unsafe
a = 42;
a.toFixed();       // ✅ no error — TypeScript trusts you blindly

let b: unknown = "hello";
b.toUpperCase();   // ❌ Error — must narrow first

if (typeof b === "string") {
  b.toUpperCase(); // ✅ safe after narrowing
}
```

> **Rule:** Prefer `unknown` over `any`. Use `any` only as a last resort.

---

### Q3. What is the difference between `interface` and `type`?

```ts
// Both can describe object shapes
interface Product {
  id: number;
  name: string;
}

type Invoice = {
  id: number;
  total: number;
};
```

| Feature | `interface` | `type` |
|---|---|---|
| Declaration merging | ✅ Yes | ❌ No |
| Extends | ✅ `extends` keyword | ✅ `&` intersection |
| Unions / primitives | ❌ No | ✅ Yes |
| Best for | Objects, OOP, APIs | Unions, complex types |

```ts
// Only interface supports merging
interface Cart { items: string[] }
interface Cart { total: number }
// Result: { items: string[], total: number } ✅

// Only type supports unions
type ID = string | number; // ✅
// interface ID = string | number; ❌ not possible
```

---

### Q4. What are `void` and `never`?

```ts
// void — function finishes but returns nothing
function logOrder(id: number): void {
  console.log(`Order: ${id}`);
}

// never — function NEVER finishes (throws or infinite loop)
function crash(message: string): never {
  throw new Error(message);
}

function keepAlive(): never {
  while (true) {}
}
```

> **Key difference:** `void` ends normally, `never` never ends.

---

### Q5. What is Type Inference?

TypeScript automatically detects the type — you don't always need to annotate.

```ts
let score = 100;         // inferred: number
let label = "gold";      // inferred: string
let active = true;       // inferred: boolean

const tags = ["ts", "js"]; // inferred: string[]

// TypeScript infers return type automatically
function double(n: number) {
  return n * 2; // inferred return: number
}
```

---

### Q6. What are Literal Types?

Restrict a variable to **exact values** instead of a broad type.

```ts
type Direction = "north" | "south" | "east" | "west";
type StatusCode = 200 | 404 | 500;

let move: Direction = "north"; // ✅
// move = "up";                // ❌

function respond(code: StatusCode): void {
  console.log(code);
}

respond(200); // ✅
// respond(201); // ❌
```

---

### Q7. What is `as const`?

Freezes a value into its **exact literal types** — makes everything readonly.

```ts
// Without as const — types are widened
const config = { env: "production", version: 1 };
// type: { env: string; version: number }

// With as const — types are exact literals
const CONFIG = { env: "production", version: 1 } as const;
// type: { readonly env: "production"; readonly version: 1 }

// Common pattern — replaces enums
const ROLES = ["admin", "user", "guest"] as const;
type Role = typeof ROLES[number]; // "admin" | "user" | "guest"
```

---

### Q8. What is the difference between `null` and `undefined` in TypeScript?

```ts
// undefined — variable declared but not assigned
let username: string | undefined;
console.log(username); // undefined

// null — explicitly set to "no value"
let selectedItem: string | null = null;

// With strictNullChecks: true (recommended)
let name: string = null;   // ❌ Error
let name2: string | null = null; // ✅

// Optional chaining handles both safely
console.log(selectedItem?.toUpperCase()); // undefined (no crash)
```

---

## Intermediate

---

### Q9. What are Union and Intersection types?

```ts
// Union (|) — value can be ONE of the types
type Input = string | number;

function display(val: Input) {
  if (typeof val === "string") {
    console.log(val.toUpperCase());
  } else {
    console.log(val.toFixed(2));
  }
}

// Intersection (&) — value must have ALL properties
type Timestamps = { createdAt: Date; updatedAt: Date };
type BaseEntity = { id: number };

type Shipment = BaseEntity & Timestamps & {
  destination: string;
};

const s: Shipment = {
  id: 1,
  destination: "Bhubaneswar",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

---

### Q10. Explain Type Narrowing with examples.

Narrowing = helping TypeScript figure out the **exact type** inside a union.

```ts
type Payload = string | number | null;

function process(value: Payload) {
  // typeof
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // string
    return;
  }

  // truthiness
  if (!value) {
    console.log("No value"); // null or 0
    return;
  }

  console.log(value.toFixed(2)); // number
}

// in operator
type AdminUser = { role: "admin"; permissions: string[] };
type GuestUser = { role: "guest" };

function greetUser(user: AdminUser | GuestUser) {
  if ("permissions" in user) {
    console.log(user.permissions); // AdminUser
  } else {
    console.log("Guest access");   // GuestUser
  }
}

// Custom type guard
function isString(val: unknown): val is string {
  return typeof val === "string";
}
```

---

### Q11. What are Generics? Why are they useful?

Generics let you write **reusable, type-safe** code that works with any type.

```ts
// Without generics — unsafe
function firstItem(arr: any[]): any { return arr[0]; }

// With generics — type-safe
function firstItem<T>(arr: T[]): T { return arr[0]; }

const num = firstItem([1, 2, 3]);       // number ✅
const str = firstItem(["a", "b"]);      // string ✅

// Generic interface — most common real-world use
interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

type Warehouse = { id: number; location: string };

const response: ApiResponse<Warehouse> = {
  data: { id: 1, location: "Delhi" },
  status: 200,
  success: true,
};
```

---

### Q12. What are the most used Utility Types?

```ts
type Employee = {
  id: number;
  name: string;
  department: string;
  salary: number;
};

// Partial — all fields optional (PATCH / update)
type UpdateEmployee = Partial<Employee>;
const patch: UpdateEmployee = { name: "Zaffar" }; // ✅

// Required — all fields required
type StrictEmployee = Required<UpdateEmployee>;

// Readonly — no mutations
const frozen: Readonly<Employee> = {
  id: 1, name: "Zaffar", department: "Tech", salary: 50000
};
// frozen.salary = 60000; // ❌

// Pick — keep specific fields
type EmployeeCard = Pick<Employee, "id" | "name">;

// Omit — remove specific fields
type NewEmployee = Omit<Employee, "id">; // id is server-generated

// Record — key-value map
type DeptHeadcount = Record<string, number>;
const headcount: DeptHeadcount = { Tech: 10, HR: 5 };

// NonNullable — remove null | undefined
type SafeName = NonNullable<string | null | undefined>; // string
```

---

### Q13. What is the difference between `extends` and `implements`?

```ts
// extends — inherit code from a parent class (IS-A relationship)
class Animal {
  constructor(public name: string) {}
  breathe() { console.log("Breathing"); }
}

class Tiger extends Animal {
  hunt() { console.log(`${this.name} is hunting`); }
}

const t = new Tiger("Tiger");
t.breathe(); // inherited ✅
t.hunt();    // own method ✅

// implements — fulfill a contract (CAN-DO relationship)
interface Printable { print(): void; }
interface Exportable { export(): string; }

class Report implements Printable, Exportable {
  print(): void { console.log("Printing..."); }
  export(): string { return "PDF"; }
}
```

> `extends` = one parent only. `implements` = multiple interfaces allowed.

---

### Q14. What is Declaration Merging?

TypeScript merges multiple declarations of the **same interface name** into one.

```ts
// Common real-world use — extend a third-party type
// Express doesn't have `user` on Request by default

// express.d.ts
declare module "express" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Now in your route:
// req.user?.id   ✅ TypeScript knows this exists
```

---

## Advanced

---

### Q15. What are Conditional Types?

Types that change based on a condition — like `if/else` at the type level.

```ts
type IsArray<T> = T extends any[] ? "yes" : "no";

type A = IsArray<string[]>; // "yes"
type B = IsArray<number>;   // "no"

// Practical: flatten array type
type Flatten<T> = T extends Array<infer Item> ? Item : T;

type C = Flatten<string[]>; // string
type D = Flatten<number>;   // number (not array — as-is)

// Built-in conditional utilities
type E = NonNullable<string | null | undefined>; // string
type F = Exclude<"a" | "b" | "c", "a">;         // "b" | "c"
type G = Extract<string | number | boolean, string | number>; // string | number
```

---

### Q16. What is the `infer` keyword?

`infer` extracts and names a type from within a conditional type.

```ts
// Extract return type of any function
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function getDiscount(): number { return 0.1; }
function getLabel(): string { return "sale"; }

type R1 = GetReturn<typeof getDiscount>; // number
type R2 = GetReturn<typeof getLabel>;    // string

// Unwrap a Promise
type Unwrap<T> = T extends Promise<infer V> ? V : T;

type R3 = Unwrap<Promise<string[]>>; // string[]
type R4 = Unwrap<number>;            // number (not a promise)

// Extract string parts
type StripPrefix<T extends string> =
  T extends `get${infer Rest}` ? Uncapitalize<Rest> : T;

type R5 = StripPrefix<"getTotal">;   // "total"
type R6 = StripPrefix<"calculate">; // "calculate"
```

---

### Q17. What are Mapped Types?

Loop over keys of a type and **transform** each property.

```ts
type Subscription = {
  plan: string;
  price: number;
  active: boolean;
};

// Make all values nullable
type Nullable<T> = { [K in keyof T]: T[K] | null };
type NullableSub = Nullable<Subscription>;

// Generate getter names
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type SubGetters = Getters<Subscription>;
// { getPlan: () => string; getPrice: () => number; getActive: () => boolean }

// Filter keys by value type
type PickStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringFields = PickStrings<Subscription>;
// { plan: string }
```

---

### Q18. What are Template Literal Types?

String concatenation — but at the **type level**.

```ts
type Entity = "order" | "payment" | "refund";
type Action = "created" | "updated" | "failed";

type WebhookEvent = `${Entity}.${Action}`;
// "order.created" | "order.updated" | "order.failed"
// "payment.created" | ... etc (9 combinations auto-generated)

function handleWebhook(event: WebhookEvent) {
  console.log(event);
}

handleWebhook("order.created");   // ✅
// handleWebhook("order.sold");   // ❌

// Extract parts using infer
type GetEntity<T extends string> =
  T extends `${infer E}.${string}` ? E : never;

type R = GetEntity<"payment.updated">; // "payment"
```

---

### Q19. What is the difference between `Partial`, `Required`, and `Readonly`?

```ts
type Settings = {
  theme: string;
  language: string;
  notifications: boolean;
};

// Partial — all optional (for drafts / updates)
const draft: Partial<Settings> = { theme: "dark" }; // ✅

// Required — all mandatory (after validation)
const full: Required<Partial<Settings>> = {
  theme: "dark",
  language: "en",
  notifications: true,
}; // ✅ all fields required

// Readonly — no reassignment after creation
const locked: Readonly<Settings> = {
  theme: "dark",
  language: "en",
  notifications: true,
};
// locked.theme = "light"; // ❌ cannot assign to readonly

// ⚠️ Readonly is SHALLOW — nested objects still mutable
```

---

### Q20. What is module augmentation and when do you use it?

Add properties to an **existing type from a library** without touching its source.

```ts
// Problem: JWT middleware adds `user` to req, but Express doesn't know

// Solution: augment Express's Request type in a .d.ts file
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: "admin" | "manager" | "staff";
    };
  }
}

// Now everywhere in your app:
// app.get("/dashboard", (req, res) => {
//   req.user?.role  ✅ fully typed
// });

// Same pattern for Window
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

// window.gtag("event", "purchase"); ✅
export {};
```

---

### Q21. What is the `keyof` operator?

Produces a **union of all keys** of a type.

```ts
type Transaction = {
  id: number;
  amount: number;
  currency: string;
  status: "pending" | "settled";
};

type TransactionKey = keyof Transaction;
// "id" | "amount" | "currency" | "status"

// Practical — type-safe property accessor
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const tx: Transaction = { id: 1, amount: 500, currency: "INR", status: "pending" };

const amount = getField(tx, "amount");   // number ✅
const status = getField(tx, "status");   // "pending" | "settled" ✅
// getField(tx, "tax");                  // ❌ not a key of Transaction
```

---

### Q22. What is `ReturnType` and `Parameters`?

Extract types **from existing functions** — no duplication needed.

```ts
function createCoupon(code: string, discount: number, expiry: Date) {
  return { code, discount, expiry, active: true };
}

// Grab the return type without writing it again
type Coupon = ReturnType<typeof createCoupon>;
// { code: string; discount: number; expiry: Date; active: boolean }

// Grab all parameter types as a tuple
type CouponArgs = Parameters<typeof createCoupon>;
// [code: string, discount: number, expiry: Date]

// Useful: reuse params in another function
function scheduleCoupon(...args: CouponArgs): void {
  const coupon = createCoupon(...args);
  console.log("Scheduled:", coupon);
}
```

---

### Q23. What are Decorators and when do you use them?

Functions that **wrap** a class, method, or property to add behaviour.

```ts
// Enable in tsconfig.json:
// "experimentalDecorators": true

// Method decorator — logs every call automatically
function Log(target: any, key: string, desc: PropertyDescriptor) {
  const original = desc.value;
  desc.value = function (...args: any[]) {
    console.log(`${key} called with`, args);
    return original.apply(this, args);
  };
  return desc;
}

// Decorator factory — accepts arguments
function Retry(times: number) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const original = desc.value;
    desc.value = async function (...args: any[]) {
      for (let i = 0; i < times; i++) {
        try { return await original.apply(this, args); }
        catch (e) { if (i === times - 1) throw e; }
      }
    };
    return desc;
  };
}

class PaymentGateway {
  @Log
  @Retry(3)
  async charge(amount: number): Promise<string> {
    return `Charged ₹${amount}`;
  }
}
```

---

## Quick Revision Cheatsheet

```
Basic:
any vs unknown      → unknown needs narrowing, any doesn't
interface vs type   → interface merges, type does unions
void vs never       → void ends, never doesn't
null vs undefined   → null = intentional, undefined = missing
as const            → freeze to literal types

Intermediate:
Union |             → OR — one of these types
Intersection &      → AND — all of these types
Generics <T>        → reusable type placeholder
Partial / Omit      → transform existing types
extends vs implements → inherit code vs fulfill contract

Advanced:
T extends U ? X : Y → conditional types (type-level if/else)
infer R             → extract a type from inside another type
{ [K in keyof T] }  → mapped types (transform every property)
`${A}-${B}`         → template literal types
keyof T             → union of all keys
ReturnType<T>       → return type of a function
```

---

> **Study tip:** For each question above, try writing the example
> from memory first, then check. That is the fastest way to lock
> these in before an interview.
