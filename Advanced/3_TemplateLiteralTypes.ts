/**
 * =========================================================
 * Template Literal Types
 * =========================================================
 */

// Syntax: backtick string — but at TYPE level
// `${T}` where T is a string literal type

// --------------------------------------------------------
// 1. Basic
// --------------------------------------------------------

type Greeting = `Hello, ${string}`;

let g: Greeting = 'Hello, Zaffar'; // ✅
// let g2: Greeting = "Hi, Zaffar"; // ❌

type EventName = 'click' | 'focus' | 'blur';
type Handler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// --------------------------------------------------------
// 2. Combining unions — auto-generates all combinations
// --------------------------------------------------------

type Size = 'sm' | 'md' | 'lg';
type Color = 'red' | 'blue';

type ClassName = `${Color}-${Size}`;
// "red-sm" | "red-md" | "red-lg" | "blue-sm" | "blue-md" | "blue-lg"

// --------------------------------------------------------
// 3. Real-world: typed CSS properties
// --------------------------------------------------------

type Side = 'top' | 'bottom' | 'left' | 'right';
type SpaceProp = `${'margin' | 'padding'}-${Side}`;
// "margin-top" | "margin-bottom" | ... | "padding-top" | ...

type Styles = Partial<Record<SpaceProp, number>>;

const box: Styles = {
  'margin-top': 16,
  'padding-left': 8,
};

// --------------------------------------------------------
// 4. Real-world: API route builder
// --------------------------------------------------------

type Resource = 'product' | 'order' | 'invoice';
type ApiRoute = `/api/${Resource}` | `/api/${Resource}/${number}`;

function fetch(route: ApiRoute) {
  console.log(route);
}

fetch('/api/product'); // ✅
fetch('/api/order/42'); // ✅
// fetch("/api/cart");     // ❌ not in Resource

// --------------------------------------------------------
// 5. Real-world: typed event emitter
// --------------------------------------------------------

type Entity = 'cart' | 'wishlist';
type Action = 'created' | 'updated' | 'deleted';
type AppEvent = `${Entity}:${Action}`;
// "cart:created" | "cart:updated" | "cart:deleted"
// "wishlist:created" | ...

function emit(event: AppEvent) {
  console.log(event);
}

emit('cart:created'); // ✅
emit('wishlist:deleted'); // ✅
// emit("cart:sold");       // ❌

// --------------------------------------------------------
// 6. infer inside template literal
// --------------------------------------------------------

// Extract the part after "on" from an event handler name
type EventFromHandler<T extends string> = T extends `on${infer E}` ? Lowercase<E> : never;

type E1 = EventFromHandler<'onClick'>; // "click"
type E2 = EventFromHandler<'onSubmit'>; // "submit"
type E3 = EventFromHandler<'submit'>; // never (no "on" prefix)

// --------------------------------------------------------
// 7. Built-in string manipulation types
// --------------------------------------------------------

type A_type = Uppercase<'hello'>; // "HELLO"
type B_type = Lowercase<'WORLD'>; // "world"
type C_type = Capitalize<'zaffar'>; // "Zaffar"
type D_type = Uncapitalize<'TypeScript'>; // "typeScript"

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
