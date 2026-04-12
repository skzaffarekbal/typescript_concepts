// =========================================================
// src/store/Store.ts
// =========================================================
//
// A generic class that can store ANY entity.
// Not just products — anything with an `id` field.
//
// T extends { id: string } means:
// "T can be any type, as long as it has an id property"
// =========================================================
export class Store<T extends { id: string }> {
  // Private array — outside world cannot touch it directly
  // Only exposed through methods below
  private items: T[] = [];

  // -------------------------------------------------------
  // add
  // -------------------------------------------------------
  // Takes a full item and adds it to the store
  // T is whatever type you created the Store with
  add(item: T): void {
    this.items.push(item);
  }

  // -------------------------------------------------------
  // update
  // -------------------------------------------------------
  // Partial<T> means "some fields of T — not all required"
  // You only pass the fields you want to change
  //
  // Returns the updated item, or undefined if id not found
  update(id: string, changes: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    this.items[index] = { ...this.items[index], ...changes };
    return this.items[index];
  }

  // -------------------------------------------------------
  // remove
  // -------------------------------------------------------
  // Returns true if removed, false if id not found
  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  // -------------------------------------------------------
  // getById
  // -------------------------------------------------------
  // Returns T if found, undefined if not
  // T | undefined forces the caller to handle the missing case
  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  // -------------------------------------------------------
  // getAll
  // -------------------------------------------------------
  // Readonly<T[]> means the caller cannot mutate the array
  // They cannot push, pop, or splice — read only
  //
  // They CAN still mutate individual objects inside the array
  // because Readonly is shallow — just like Readonly<T> utility
  getAll(): Readonly<T[]> {
    return this.items;
  }

  // -------------------------------------------------------
  // filter
  // -------------------------------------------------------
  // Takes a predicate function — return true to keep the item
  // Generic filter — works for any condition
  //
  // (item: T) => boolean  is a function type
  // item is typed as T — so autocomplete works inside the callback
  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  // -------------------------------------------------------
  // sortBy
  // -------------------------------------------------------
  // key must be keyof T — only valid property names of T allowed
  // direction is a literal union — only "asc" or "desc"
  //
  // T[K] is the value type at that key
  // e.g. if T = Product and K = "price" → T[K] = number
  sortBy<K extends keyof T>(key: K, direction: 'asc' | 'desc'): T[] {
    return [...this.items].sort((a: T, b: T) => {
      const valA = a[key];
      const valB = b[key];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // -------------------------------------------------------
  // count
  // -------------------------------------------------------
  // Simple getter — returns number of items in the store
  get count(): number {
    return this.items.length;
  }
}

// =========================================================
// How it works — read this carefully
// =========================================================

// When you write:
//   const productStore = new Store<Product>();
//
// TypeScript replaces every T in the class with Product:
//
//   add(item: Product): void
//   update(id: string, changes: Partial<Product>): Product | undefined
//   remove(id: string): boolean
//   getById(id: string): Product | undefined
//   getAll(): Readonly<Product[]>
//   filter(predicate: (item: Product) => boolean): Product[]
//   sortBy<K extends keyof Product>(key: K, direction: "asc" | "desc"): Product[]
//
// The SAME class, fully typed for Product automatically.
// You did not write a ProductStore class — you wrote one Store<T>.

// =========================================================
// Usage examples — how ProductService will use this
// =========================================================

// import { Product } from "../types";
//
// const store = new Store<Product>();
//
// store.add({
//   id: "p1",
//   name: "Keyboard",
//   sku: "KB-001",
//   price: 1500,
//   stock: 10,
//   category: "electronics",
//   status: "active",
//   createdAt: new Date(),
// });
//
// store.update("p1", { price: 1200 });
// ✅ Partial<Product> — only price changed, rest stays
//
// store.update("p1", { name: 123 });
// ❌ Error — name must be string, not number
//
// store.getById("p1");
// ✅ returns Product | undefined — you must handle both cases
//
// store.filter(p => p.stock < 5);
// ✅ p is typed as Product — autocomplete works
//
// store.sortBy("price", "asc");
// ✅ "price" is keyof Product — valid
//
// store.sortBy("xyz", "asc");
// ❌ Error — "xyz" is not a key of Product
//
// const all = store.getAll();
// all.push({ ... });
// ❌ Error — Readonly array, cannot push

// =========================================================
// TypedStorage — add this to the same file or a new file
// =========================================================
//
// Wraps localStorage with full type safety.
// T is whatever you want to save — Product[], Cart, Settings etc.

export class TypedStorage<T> {
  constructor(private key: string) {}

  save(data: T): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  load(): T | null {
    const raw = localStorage.getItem(this.key);
    if (!raw) return null;

    // `as T` — we tell TypeScript "trust us, the shape is T"
    // This is safe here because WE are the ones who saved it
    return JSON.parse(raw) as T;
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}

// Usage:
//
// import { Product } from "../types";
//
// const storage = new TypedStorage<Product[]>("products");
//
// storage.save(products);          // saves Product[] to localStorage
// const loaded = storage.load();   // returns Product[] | null
// storage.clear();                 // removes from localStorage
//
// if (loaded) {
//   loaded[0].name   // ✅ TypeScript knows this is Product[]
// }
