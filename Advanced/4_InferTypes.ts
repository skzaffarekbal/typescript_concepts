/**
 * =========================================================
 * The infer Keyword
 * =========================================================
 */

// `infer` lets TypeScript EXTRACT and NAME a type
// from within a conditional type automatically.
//
// Only works inside: T extends <something with infer R>
//
// Think of it as: "figure this part out for me and call it R"

// --------------------------------------------------------
// 1. Basic idea — without vs with infer
// --------------------------------------------------------

// Without infer — you have to manually pass the inner type
type UnwrapArrayManual<T> = T extends Array<string> ? string : never;
// ❌ Only works for string arrays — not reusable

// With infer — TypeScript figures out the inner type itself
type UnwrapArray<T> = T extends Array<infer Item> ? Item : never;

type R11 = UnwrapArray<string[]>; // string
type R21 = UnwrapArray<number[]>; // number
type R31 = UnwrapArray<boolean[]>; // boolean
type R41 = UnwrapArray<string>; // never (not an array)

// --------------------------------------------------------
// 2. Extract return type of a function
// --------------------------------------------------------

type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function getScore(): number {
  return 100;
}
function getLabel(): string {
  return 'gold';
}
async function fetchCart(): Promise<{ items: string[] }> {
  return { items: [] };
}

type S1 = GetReturn<typeof getScore>; // number
type S2 = GetReturn<typeof getLabel>; // string
type S3 = GetReturn<typeof fetchCart>; // Promise<{ items: string[] }>
type S4 = GetReturn<string>; // never

// --------------------------------------------------------
// 3. Extract parameter types
// --------------------------------------------------------

type FirstArg<T> = T extends (first: infer A, ...args: any[]) => any ? A : never;
type AllArgs<T> = T extends (...args: infer A) => any ? A : never;

function checkout(cartId: string, promoCode?: string): void {}

type F1 = FirstArg<typeof checkout>; // string
type F2 = AllArgs<typeof checkout>; // [cartId: string, promoCode?: string]

// --------------------------------------------------------
// 4. Unwrap a Promise
// --------------------------------------------------------

type Awaited2<T> = T extends Promise<infer V> ? V : T;

type P11 = Awaited2<Promise<number>>; // number
type P21 = Awaited2<Promise<string[]>>; // string[]
type P31 = Awaited2<string>; // string (not a promise, as-is)

// Recursive — unwrap nested promises
type DeepAwaited<T> = T extends Promise<infer V> ? DeepAwaited<V> : T;

type P4 = DeepAwaited<Promise<Promise<number>>>; // number

// --------------------------------------------------------
// 5. infer inside template literal types
// --------------------------------------------------------

type StripGet<T extends string> = T extends `get${infer Rest}` ? Uncapitalize<Rest> : T;

type M1 = StripGet<'getProductName'>; // "productName"
type M2 = StripGet<'getTotal'>; // "total"
type M3 = StripGet<'calculate'>; // "calculate" (no "get" prefix)

type StripOn<T extends string> = T extends `on${infer Event}` ? Lowercase<Event> : never;

type M4 = StripOn<'onAddToCart'>; // "addtocart"
type M5 = StripOn<'onCheckout'>; // "checkout"

// --------------------------------------------------------
// 6. infer in object shapes
// --------------------------------------------------------

// Extract value type of a specific key
type ValueOf<T, K extends string> = T extends Record<K, infer V> ? V : never;

type Invoice = { id: number; status: 'paid' | 'pending'; total: number };

type V1 = ValueOf<Invoice, 'status'>; // "paid" | "pending"
type V2 = ValueOf<Invoice, 'total'>; // number

// Extract the resolved item type from an array inside an object
type ItemsOf<T> = T extends { items: Array<infer I> } ? I : never;

type Cart = { items: Array<{ sku: string; qty: number }> };

type CartItem = ItemsOf<Cart>; // { sku: string; qty: number }

// --------------------------------------------------------
// 7. Multiple infer in one type
// --------------------------------------------------------

// Extract both param and return type at once
type FnShape<T> = T extends (arg: infer A) => infer R ? { input: A; output: R } : never;

function applyDiscount(price: number): string {
  return `$${price * 0.9}`;
}

type Shape = FnShape<typeof applyDiscount>;
// { input: number; output: string }

// --------------------------------------------------------
// 8. Real-world: inferring from a generic class
// --------------------------------------------------------

class Repository<T> {
  private items: T[] = [];
  add(item: T) {
    this.items.push(item);
  }
  getAll(): T[] {
    return this.items;
  }
}

// Extract what T is inside any Repository<T>
type RepoItem<T> = T extends Repository<infer I> ? I : never;

type Product = { sku: string; price: number };

const productRepo = new Repository<Product>();

type R = RepoItem<typeof productRepo>; // Product ✅

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
