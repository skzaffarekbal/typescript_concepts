/**
 * =========================================================
 * TypeScript Generics
 * =========================================================
 *
 * Covers:
 * 1. Why Generics?
 * 2. Generic Functions
 * 3. Generic Interfaces
 * 4. Generic Type Aliases
 * 5. Generic Classes
 * 6. Generic Constraints (extends)
 * 7. keyof Constraint
 * 8. Multiple Type Parameters
 * 9. Default Type Parameters
 * 10. Generic Utility Patterns (real-world)
 *
 * =========================================================
 */

console.info('%c2. TypeScript Generics', 'color: yellow; font-weight: bold; font-size: 18px');

/**
 * =========================================================
 * 1. Why Generics?
 * =========================================================
 *
 * Problem: you want one function that works with multiple
 * types BUT still gives you type safety.
 *
 * Without generics you are forced to choose between:
 *   a) Write separate functions for each type  (repetitive)
 *   b) Use `any`                               (unsafe)
 */

// ❌ Option a — repetitive
function getNumberFirst(arr: number[]): number {
  return arr[0];
}
function getStringFirst(arr: string[]): string {
  return arr[0];
}

// ❌ Option b — unsafe (loses all type info)
function getFirstAny(arr: any[]): any {
  return arr[0];
}
const val = getFirstAny([1, 2, 3]);
// val is `any` — TypeScript has no idea what it is
// val.toUpperCase(); ← no error, but crashes at runtime

// ✅ Generics — one function, fully type-safe
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // T = number → returns number
const str = getFirst(['a', 'b', 'c']); // T = string → returns string
const bool = getFirst([true, false]); // T = boolean → returns boolean

console.log('Generics :', { num, str, bool });
// num.toUpperCase(); // ❌ Error — TypeScript knows it's number ✅

/**
 * =========================================================
 * 2. Generic Functions
 * =========================================================
 */

/**
 * Basic generic function
 * <T> is the type parameter — a placeholder for the actual type
 */

function identity<T>(value: T): T {
  return value;
}

identity(42); // T inferred as number
identity('Zaffar'); // T inferred as string
identity(true); // T inferred as boolean

// You can also pass the type explicitly
identity<number>(42);
identity<string>('Zaffar');

/**
 * Generic function — wrap a value
 */

function wrapInArray<T>(value: T): T[] {
  return [value];
}

const nums = wrapInArray(10); // number[]
const strs = wrapInArray('hello'); // string[]

/**
 * Generic function — pair two values
 */

function makePair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair1 = makePair('Zaffar', 22); // [string, number]
const pair2 = makePair(true, [1, 2, 3]); // [boolean, number[]]

/**
 * Generic function — merge two objects
 */

function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Zaffar' }, { age: 22 });
// type: { name: string } & { age: number }
console.log(merged.name); // ✅
console.log(merged.age); // ✅

/**
 * =========================================================
 * 3. Generic Interfaces
 * =========================================================
 */

/**
 * Basic generic interface
 */

interface Box<T> {
  value: T;
  label: string;
}

const numberBox: Box<number> = { value: 42, label: 'age' };
const stringBox: Box<string> = { value: 'Zaffar', label: 'name' };

/**
 * Generic interface — API response wrapper
 * Real-world pattern you will use constantly
 */

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

type UserGenerics = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  price: number;
};

// Same wrapper, different data shapes
const userResponse: ApiResponse<UserGenerics> = {
  data: { id: 11, name: 'Zaff' },
  status: 200,
  message: 'Ok',
  success: true,
};

const productResponse: ApiResponse<Product> = {
  data: { id: 1, price: 999 },
  status: 200,
  message: 'Ok',
  success: true,
};

// Array response
const usersResponse: ApiResponse<UserGenerics[]> = {
  data: [
    { id: 11, name: 'Zaff' },
    { id: 12, name: 'Lucky' },
  ],
  status: 200,
  message: 'Ok',
  success: true,
};

/**
 * Generic interface — Repository pattern
 * Common in backend / clean architecture
 */

interface Repository<T> {
  findById(id: number): T | undefined;
  findAll(): T[];
  save(item: T): void;
  delete(id: number): void;
}

// Implement for a specific type
class UserRepository implements Repository<UserGenerics> {
  private users: UserGenerics[] = [];

  findById(id: number): UserGenerics | undefined {
    return this.users.find((u) => u.id === id);
  }
  findAll(): UserGenerics[] {
    return this.users;
  }
  save(user: UserGenerics): void {
    this.users.push(user);
  }
  delete(id: number): void {
    this.users = this.users.filter((u) => u.id !== id);
  }
}

/**
 * =========================================================
 * 4. Generic Type Aliases
 * =========================================================
 */

// Generic nullable
type Nullable<T> = T | null;

let userId: Nullable<number> = 12;
userId = null; // ✅

// Generic maybe (nullable + undefined)
type Maybe<T> = T | null | undefined;
let config: Maybe<string> = undefined; // ✅

// Generic pair
type Pair<T, U> = { first: T; second: U };
const coord: Pair<number, number> = { first: 99, second: 98 };

// Generic callback
type Callback<T> = (error: Error | null, result: T | null) => void;
function fetchData(cb: Callback<UserGenerics>) {
  cb(null, { id: 1, name: 'Zaff' });
}

/**
 * =========================================================
 * 5. Generic Classes
 * =========================================================
 */

/**
 * Generic Stack
 */

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  get size(): number {
    return this.items.length;
  }
  isEmpty(): boolean {
    return this.items.length - 1 === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

console.log(numberStack.peek()); // 3
console.log(numberStack.pop()); // 3
console.log(numberStack.size); // 2

const stringStack = new Stack<string>();
stringStack.push('a');
stringStack.push('b');
console.log(stringStack.peek());
// stringStack.push(99); // ❌ Error — string stack only

/**
 * Generic KeyValueStore
 */

class KeyValueStore<K extends string, V> {
  private store: Record<string, V> = {}; // Record<K, V> is a built-in TypeScript utility type.

  set(key: K, value: V): void {
    this.store[key] = value;
  }
  get(key: K): V | undefined {
    return this.store[key];
  }
  has(key: K): boolean {
    return key in this.store;
  }
}

const cache = new KeyValueStore<string, number>();
cache.set('level', 5);
cache.set('score', 100);
console.log(cache.get('score'));
console.log(cache.has('level'));

/**
 * =========================================================
 * 6. Generic Constraints (extends)
 * =========================================================
 *
 * Constraints limit what types T can be.
 * Use `extends` to say "T must have at least these properties"
 */

/**
 * Without constraint — T could be anything
 * TypeScript won't let you access .length
 */

// function logLength<T>(value: T): void {
//   console.log(value.length); // ❌ Error: T might not have .length
// }

/**
 * With constraint — T must have a length property
 */

interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): void {
  console.log(value.length); // ✅ guaranteed to exist
}

logLength('Zaffar'); // ✅ string has .length
logLength([1, 2, 3]); // ✅ array has .length
logLength({ length: 10 }); // ✅ object with .length
// logLength(42); // ❌ number has no .length

/**
 * Constraint — T must extend an object type
 */
function getProperty<T extends object>(obj: T, key: keyof T) {
  return obj[key];
}

const person = { name: 'Zaff', age: 22 };

getProperty(person, 'name'); // ✅
getProperty(person, 'age'); // ✅
// getProperty(person, "xyz"); // ❌ "xyz" not a key of person

/**
 * Constraint — T must be a class constructor
 * Used in factory patterns and decorators
 */

type Constructor<T> = new (...args: any[]) => T;

function createInstance<T>(cls: Constructor<T>): T {
  return new cls();
}

class Logger {
  log(msg: string) {
    console.log(msg);
  }
}

const logger = createInstance(Logger); // ✅ type is Logger
logger.log('Hello');

/**
 * =========================================================
 * 7. keyof Constraint
 * =========================================================
 *
 * keyof T → produces a union of all keys of T
 * Combine with generics for fully type-safe property access
 */

/**
 * Safe property getter
 */

function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const userObj = { id: 1, name: 'Zaffar', age: 22 };

const userName = getField(userObj, 'name'); // type: string ✅
const age = getField(userObj, 'age'); // type: number ✅
// getField(userObj, "salary");          // ❌ not a key of userObj

/**
 * Safe property setter — only update existing keys
 */

function updateField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const updated = updateField(userObj, 'age', 23); // ✅
// updateField(userObj, "age", "old");              // ❌ value must be number
// updateField(userObj, "salary", 50000);           // ❌ not a key

/**
 * Pick fields from an object — simplified version of Partial
 */
function pickFields<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const picked = pickFields(userObj, ['id', 'name']);
// type: { id: number; name: string } — age is gone ✅

/**
 * =========================================================
 * 8. Multiple Type Parameters
 * =========================================================
 */

/**
 * Transform function — map one type to another
 */

function transform<TInput, TOutput>(
  value: TInput,
  transformer: (input: TInput) => TOutput,
): TOutput {
  return transformer(value);
}

const strLength = transform('Zaffar', (str) => str.length); // number
const doubled = transform(21, (n) => n * 2); // number
const wrapped = transform(42, (n) => ({ value: n })); // { value: number }

/**
 * Zip two arrays together
 */

function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  return arr1.map((item, i) => [item, arr2[i]]);
}

const zipped = zip([1, 2, 3], ['a', 'b', 'c']);
// type: [number, string][]
// [[1,"a"], [2,"b"], [3,"c"]]

/**
 * =========================================================
 * 9. Default Type Parameters
 * =========================================================
 * Like default function parameters, but for types
 */

interface PaginatedResponse<T, Meta = { total: number; page: number }> {
  data: T[];
  meta: Meta;
}

// Uses default Meta type
const page1: PaginatedResponse<UserGenerics> = {
  data: [{ id: 1, name: 'Zaffar' }],
  meta: { total: 100, page: 1 },
};

// Override with custom Meta type
type CursorMeta = { nextCursor: string; hasMore: boolean };

const page2: PaginatedResponse<UserGenerics, CursorMeta> = {
  data: [{ id: 2, name: 'Ali' }],
  meta: { nextCursor: 'abc123', hasMore: true },
};

/**
 * =========================================================
 * 10. Generic Utility Patterns (real-world)
 * =========================================================
 */

/**
 * Generic async fetcher
 */

async function fetchJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  const data: T = await res.json();
  return { data, status: res.status, message: 'OK', success: res.ok };
}

// Usage
// const users = await fetchJson<UserGenerics[]>("/api/users");
// users.data[0].name ✅ — fully typed

/**
 * Generic event emitter
 */

type EventMap = Record<string, any>;

class EventEmitter<Events extends EventMap> {
  private listeners: Partial<{ [K in keyof Events]: ((data: Events[K]) => void)[] }> = {};

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.listeners[event]?.forEach((fn) => fn(data));
  }
}

type AppEvents = {
  login: { userId: number; timestamp: Date };
  logout: { userId: number };
  error: { message: string; code: number };
};

const emitter = new EventEmitter<AppEvents>();

emitter.on('login', (data) => {
  console.log(data.userId); // ✅ number
  console.log(data.timestamp); // ✅ Date
});

emitter.emit('login', { userId: 1, timestamp: new Date() }); // ✅
// emitter.emit("login", { userId: "abc" }); // ❌ userId must be number

/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * Generic syntax:
 * <T>               → single type parameter
 * <T, U>            → multiple type parameters
 * <T extends X>     → T must satisfy X (constraint)
 * <T = string>      → T defaults to string
 * <T extends keyof U> → T must be a key of U
 *
 * Where generics go:
 * function fn<T>(arg: T): T
 * interface Box<T> { value: T }
 * type Wrap<T> = { data: T }
 * class Stack<T> { items: T[] }
 *
 * Key patterns:
 * T extends HasLength   → constrain to types with .length
 * K extends keyof T     → constrain K to keys of T
 * T[K]                  → look up value type by key
 * T & U                 → merge two generic types
 *
 * 🔥 The golden rule:
 * Use generics when the SHAPE of the logic is the same
 * but the TYPE changes — don't repeat yourself, don't use any
 *
 * =========================================================
 */
