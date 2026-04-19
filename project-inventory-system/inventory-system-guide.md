# Inventory Management System
### A TypeScript Learning Project

---

## Project Overview

A browser-based inventory management system built with **pure HTML, CSS, and TypeScript** — no frameworks, no backend, no database server.

You will be able to:
- Add, edit, and delete products
- Filter and sort the product list
- Track stock movements (stock in / stock out)
- See live stats — total inventory value, low stock alerts
- Validate forms before submission
- Data persists in `localStorage` — survives page refresh

---

## What TypeScript Concepts This Covers

| Concept | Where it appears |
|---|---|
| Interfaces & types | `Product`, `Category`, `StockMovement` |
| Union & literal types | `status`, `movement type` |
| `as const` | Category names, status values |
| Generics | `Store<T>`, `TypedStorage<T>`, filter functions |
| Utility types | `Omit`, `Partial`, `Readonly`, `Pick` |
| `keyof` + `typeof` | Typed sort keys, field access |
| Type narrowing | Form validation, error handling |
| Mapped types | `ValidationResult<T>`, `FormFields<T>` |
| Template literal types | Sort keys `"price-asc"`, `"price-desc"` |
| Conditional types | `RequiredFields<T>` in validator |
| `infer` | `ReturnType` of store methods |
| Decorators | `@Log`, `@Validate` on service methods |
| Declaration file | `.d.ts` for helper utilities |
| Modules | Clean split across files |

---

## Tech Stack

```
TypeScript   → all logic, types, classes
HTML         → structure and layout
CSS          → styling
localStorage → data persistence (your "database")
tsc --watch  → auto-compiles TypeScript on save
```

---

## Folder Structure

```
inventory-system/
│
├── index.html                  ← single HTML file
├── styles.css                  ← all styles
├── tsconfig.json               ← TypeScript config
│
└── src/
    │
    ├── types/
    │   └── index.ts            ← all interfaces, types, enums
    │
    ├── store/
    │   └── Store.ts            ← generic Store<T> class
    │
    ├── services/
    │   └── ProductService.ts   ← business logic + decorators
    │
    ├── validators/
    │   └── FormValidator.ts    ← generic validator with mapped types
    │
    ├── utils/
    │   ├── helpers.ts          ← utility functions
    │   └── helpers.d.ts        ← declaration file for helpers
    │
    ├── ui/
    │   └── render.ts           ← all DOM rendering functions
    │
    └── main.ts                 ← entry point, wires everything together
```

---

## How to Set Up

### Step 1 — Create the project folder

```bash
mkdir project-inventory-system
cd project-inventory-system
```

### Step 2 — Initialise npm and install TypeScript

```bash
npm init -y
npm install typescript --save-dev
```

### Step 3 — Create `tsconfig.json` in the project root

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ES2020",
    "moduleResolution": "bundler",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4 — Create all folders

```bash
mkdir -p src/types src/store src/services src/validators src/utils src/ui
```

### Step 5 — Create empty files

```bash
touch src/types/index.ts
touch src/store/Store.ts
touch src/services/ProductService.ts
touch src/validators/FormValidator.ts
touch src/utils/helpers.ts
touch src/utils/helpers.d.ts
touch src/ui/render.ts
touch src/main.ts
touch index.html
touch styles.css
```

### Step 6 — Add base `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inventory System</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <header>
    <h1>Inventory System</h1>
  </header>

  <!-- Stats bar -->
  <section id="stats">
    <div id="stat-total-products"></div>
    <div id="stat-total-value"></div>
    <div id="stat-low-stock"></div>
  </section>

  <!-- Add product form -->
  <section id="form-section">
    <form id="product-form">
      <input type="text"   id="name"     placeholder="Product name"  />
      <input type="text"   id="sku"      placeholder="SKU"           />
      <input type="number" id="price"    placeholder="Price"         />
      <input type="number" id="stock"    placeholder="Stock"         />
      <select id="category">
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="food">Food</option>
        <option value="tools">Tools</option>
      </select>
      <button type="submit">Add Product</button>
    </form>
    <div id="form-errors"></div>
  </section>

  <!-- Filters and sort -->
  <section id="controls">
    <input type="text" id="search" placeholder="Search products..." />
    <select id="sort">
      <option value="name-asc">Name A–Z</option>
      <option value="name-desc">Name Z–A</option>
      <option value="price-asc">Price Low–High</option>
      <option value="price-desc">Price High–Low</option>
      <option value="stock-asc">Stock Low–High</option>
      <option value="stock-desc">Stock High–Low</option>
    </select>
    <select id="filter-category">
      <option value="all">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="clothing">Clothing</option>
      <option value="food">Food</option>
      <option value="tools">Tools</option>
    </select>
  </section>

  <!-- Product list -->
  <section id="product-list"></section>

  <script type="module" src="dist/main.js"></script>
</body>
</html>
```

### Step 7 — Run the TypeScript compiler in watch mode

```bash
npx tsc --watch
```

Keep this running in your terminal. Every time you save a `.ts` file, TypeScript compiles it automatically into the `dist/` folder.

### Step 8 — Open `index.html` in your browser

Use the **Live Server** extension in VS Code — right click `index.html` → `Open with Live Server`.

Or just open the file directly in your browser.

---

## How to Run (every time)

```bash
# Terminal 1 — keep this running
npx tsc --watch

# Then open index.html with Live Server in VS Code
```

---

## Tasks — Step by Step

---

### Task 1 — Types Foundation
**File:** `src/types/index.ts`
**Concepts:** interfaces, `as const`, `typeof`, union types, template literal types, `Readonly`

Define all your types here first. Every other file will import from this one.

```
What to write:
- CATEGORIES constant with as const
- PRODUCT_STATUS constant with as const
- Category type from typeof CATEGORIES[number]
- ProductStatus type from typeof PRODUCT_STATUS[number]
- Product interface
- StockMovement interface
- SortKey type using template literals
- AppConfig as Readonly<{...}>
```

**Rules for this task:**
- Use `as const` for all constant arrays
- Derive union types using `typeof X[number]` — do NOT write them manually
- `AppConfig` must use `Readonly<>` — no field should be reassignable

**Done when:** No TypeScript errors and all types are exported cleanly.

---

### Task 2 — Generic Store
**File:** `src/store/Store.ts`
**Concepts:** generics, `keyof`, `Partial`, `Readonly`, constraints

Build a reusable `Store<T>` class that can store ANY entity — not just products.

```
Methods to implement:
- add(item: T): void
- update(id: string, changes: Partial<T>): T | undefined
- remove(id: string): boolean
- getById(id: string): T | undefined
- getAll(): Readonly<T[]>
- filter(predicate: (item: T) => boolean): T[]
- sortBy(key: keyof T, direction: "asc" | "desc"): T[]
```

**Rules for this task:**
- `T` must be constrained to `{ id: string }` — `Store<T extends { id: string }>`
- `getAll()` must return `Readonly<T[]>` — caller cannot mutate the array
- `sortBy()` key must be `keyof T` — no plain strings allowed

**Done when:** `new Store<Product>()` works and all methods are fully typed.

---

### Task 3 — Typed Storage
**File:** `src/store/Store.ts` (add to same file) or a new `TypedStorage.ts`
**Concepts:** generics, type assertions, null handling

Wrap `localStorage` in a typed class.

```
Methods to implement:
- save(data: T): void
- load(): T | null
- clear(): void
```

**Rules for this task:**
- Class must be generic — `TypedStorage<T>`
- `load()` returns `T | null` — never throws
- Use `JSON.parse` with a type assertion `as T`

**Done when:** You can save and load `Product[]` with full types.

---

### Task 4 — Product Service with Decorators
**File:** `src/services/ProductService.ts`
**Concepts:** decorators, `Omit`, `Partial`, `ReturnType`, class inheritance

Extend `Store<Product>` with product-specific business logic.

```
Methods to implement:
- addProduct(data: Omit<Product, "id" | "createdAt">): Product
- updateProduct(id: string, changes: Partial<Omit<Product, "id">>): Product | undefined
- removeProduct(id: string): boolean
- getLowStockProducts(): Product[]
- getTotalInventoryValue(): number
- moveStock(productId: string, type: "in" | "out", quantity: number): void
```

```
Decorators to write and apply:
- @Log       → logs method name + arguments on every call
- @Validate  → blocks addProduct if name or sku is empty
```

**Rules for this task:**
- `addProduct` takes `Omit<Product, "id" | "createdAt">` — never accept an id from outside
- `moveStock` must auto-update `status` to `"out-of-stock"` when stock reaches 0
- Use `ReturnType<typeof this.getAll>` somewhere to practice it

**Done when:** You can add a product, move stock, and decorators print to console correctly.

---

### Task 5 — Generic Form Validator
**File:** `src/validators/FormValidator.ts`
**Concepts:** mapped types, conditional types, template literal types, generics

Build a validator that works for ANY form — not just products.

```
Types to define:
- FieldRule<T>          → required?, min?, max?, pattern?, message?
- FormSchema<T>         → mapped type: every key of T → optional FieldRule
- ValidationResult<T>   → mapped type: every key of T → string | null
- HasErrors<T>          → conditional type: true if any value is not null

Class to build:
- FormValidator<T>
  - constructor(schema: FormSchema<T>)
  - validate(data: Partial<T>): ValidationResult<T>
  - isValid(result: ValidationResult<T>): boolean
```

**Rules for this task:**
- `FormSchema<T>` must be a **mapped type** — not a manual object type
- `ValidationResult<T>` must be a **mapped type** — not a manual object type
- Default error messages must use **template literal types**
- `isValid()` must use a **conditional type** internally

**Done when:** `new FormValidator<Product>(schema).validate(data)` returns typed errors per field.

---

### Task 6 — Declaration File
**File:** `src/utils/helpers.ts` + `src/utils/helpers.d.ts`
**Concepts:** declaration files, `declare`, `export declare function`

Write utility functions as plain TypeScript, then write their declaration file manually.

```
Functions to write in helpers.ts:
- generateId(): string          → returns a random unique id
- formatCurrency(amount: number, symbol: string): string
- formatDate(date: Date): string
- truncate(text: string, maxLength: number): string
```

Then in `helpers.d.ts` — declare each function using `export declare function`.

**Rules for this task:**
- Write the `.d.ts` file **by hand** — do not auto-generate it
- The `.d.ts` must match the actual implementation exactly

**Done when:** You can import from `helpers.d.ts` and get full autocomplete.

---

### Task 7 — UI Rendering
**File:** `src/ui/render.ts`
**Concepts:** type narrowing, `Pick`, DOM typing, event handling

Write all functions that touch the DOM.

```
Functions to write:
- renderProductList(products: Product[]): void
- renderStats(products: Product[], config: AppConfig): void
- renderValidationErrors(errors: ValidationResult<Product>): void
- renderProductCard(product: Product): HTMLElement
- highlightLowStock(product: Product, threshold: number): boolean
```

**Rules for this task:**
- Every DOM element must be properly typed — `HTMLInputElement`, `HTMLSelectElement` etc.
- Use `as HTMLInputElement` only when you are 100% sure — add a null check first
- `renderStats` must accept `AppConfig` — use `config.lowStockThreshold` for alerts

**Done when:** Products render on screen with correct data and low stock items are visually highlighted.

---

### Task 8 — Wire Everything Together
**File:** `src/main.ts`
**Concepts:** modules, `import type`, event handling, full integration

Connect all pieces — form → validator → service → render.

```
What to wire up:
- On page load   → load products from localStorage → render list + stats
- Form submit    → validate → if valid: addProduct → save → re-render
- Delete button  → removeProduct → save → re-render
- Sort select    → sortBy → re-render
- Search input   → filter by name → re-render
- Category filter → filter by category → re-render
```

**Rules for this task:**
- Use `import type` for all type-only imports
- No logic in `main.ts` — it only wires things together
- Every event listener callback must be typed

**Done when:** The full app works end-to-end with data persisting on refresh.

---

## Personal Rules (follow strictly)

```
1. No `any` anywhere
   → if tempted, use `unknown` and narrow it

2. Every function must have typed parameters + return type
   → no implicit returns

3. No type assertions (as X) unless absolutely necessary
   → if you use one, add a comment explaining why

4. If you copy-paste a type — make it generic instead

5. Every file must be a module
   → at least one import or export per file

6. Commit after each task
   → git init and commit so you can roll back
```

---

## Project Checklist

```
Task 1 — Types foundation          [x]
Task 2 — Generic Store             [x]
Task 3 — Typed Storage             [x]
Task 4 — Product Service           [x]
Task 5 — Form Validator            [ ]
Task 6 — Declaration file          [ ]
Task 7 — UI Rendering              [ ]
Task 8 — Wire everything           [ ]

Bonus:
  Stock movement history           [ ]
  Export to JSON                   [ ]
  Dark mode toggle                 [ ]
  Pagination                       [ ]
```

---

## How to Approach This

```
Day 1  → Task 1 (types only — nothing else)
Day 2  → Task 2 + Task 3 (Store + Storage)
Day 3  → Task 4 (ProductService + decorators)
Day 4  → Task 5 (FormValidator)
Day 5  → Task 6 + Task 7 (helpers + UI)
Day 6  → Task 8 (wire everything)
Day 7  → Polish, fix bugs, test edge cases
```

**One task at a time. Share your code after each task for review.**

---

## When You Are Stuck

Ask yourself in this order:

```
1. What TYPE does this variable need to be?
2. Is this reusable? → make it generic
3. Am I repeating a type? → use a utility type
4. Is this a union? → narrow it before using
5. Still stuck? → share the code and ask for help
```

---

> Start with Task 1 only.
> Write the types, share them here, get reviewed, then move to Task 2.
> Do not skip ahead.
