/**
 * =========================================================
 * Decorators in TypeScript
 * =========================================================
 *
 * Covers:
 * 1. What are Decorators?
 * 2. Enabling Decorators
 * 3. Class Decorators
 * 4. Method Decorators
 * 5. Property Decorators
 * 6. Parameter Decorators
 * 7. Accessor Decorators
 * 8. Decorator Factories (decorators with arguments)
 * 9. Stacking Multiple Decorators
 * 10. Real-world Patterns
 */


// --------------------------------------------------------
// 1. What are Decorators?
// --------------------------------------------------------

// A decorator is a FUNCTION that wraps a class, method,
// property, or parameter to add extra behaviour.
//
// Syntax: @decoratorName — placed just above what it decorates.
//
// Think of it as: "before this runs, do this extra thing"
//
// Common in: Angular, NestJS, TypeORM, class-validator


// --------------------------------------------------------
// 2. Enabling Decorators
// --------------------------------------------------------

// tsconfig.json — must enable this:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true,   ← decorators (stage 2 / legacy)
//     "emitDecoratorMetadata": true      ← needed for param decorators
//   }
// }


// --------------------------------------------------------
// 3. Class Decorator
// --------------------------------------------------------

// Receives the constructor of the class.
// Can observe, modify, or replace the class entirely.

function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  // No new properties can be added to this class
}

function Log(constructor: Function) {
  console.log(`Class created: ${constructor.name}`);
}

@Log
@Sealed
class Vehicle {
  constructor(public brand: string) {}
}

// Console: "Class created: Vehicle"
// Vehicle is now sealed — no property additions allowed


// --------------------------------------------------------
// 4. Decorator Factory
// --------------------------------------------------------

// A factory is a function that RETURNS a decorator.
// This lets you pass arguments to your decorator.

function Component(config: { selector: string; template: string }) {
  return function (constructor: Function) {
    console.log(`Component registered: ${config.selector}`);
    // Attach config to the class
    (constructor as any).selector = config.selector;
    (constructor as any).template = config.template;
  };
}

@Component({
  selector: "app-header",
  template: "<header>Hello</header>",
})
class HeaderComponent {
  render() {
    console.log("Rendering header...");
  }
}

// Console: "Component registered: app-header"


// --------------------------------------------------------
// 5. Method Decorator
// --------------------------------------------------------

// Receives: target, propertyKey, descriptor
// descriptor.value = the actual method function
// Can wrap, replace, or block the method

function LogMethod(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = original.apply(this, args);
    console.log(`${propertyKey} returned`, result);
    return result;
  };

  return descriptor;
}

function Readonly2(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false; // method cannot be overwritten
  return descriptor;
}

class OrderService {
  @LogMethod
  placeOrder(itemId: number, qty: number): string {
    return `Order placed: item ${itemId} x${qty}`;
  }

  @Readonly2
  getVersion(): string {
    return "v1.0";
  }
}

const orders = new OrderService();
orders.placeOrder(101, 3);
// Console: Calling placeOrder with [101, 3]
// Console: placeOrder returned "Order placed: item 101 x3"


// --------------------------------------------------------
// 6. Property Decorator
// --------------------------------------------------------

// Receives: target, propertyKey
// Cannot directly change the value — but can add metadata
// or replace the property with a getter/setter

function Uppercase(target: any, propertyKey: string) {
  let value: string;

  Object.defineProperty(target, propertyKey, {
    get() { return value; },
    set(newValue: string) {
      value = newValue.toUpperCase(); // force uppercase on set
    },
    enumerable: true,
    configurable: true,
  });
}

function Required2(target: any, propertyKey: string) {
  // Store metadata — used by a validator at runtime
  // const required: string[] = Reflect.getMetadata("required", target) || [];
  // required.push(propertyKey);
  // Reflect.defineMetadata("required", required, target);
}

class Products {
  @Uppercase
  name: string = "";

  @Uppercase
  category: string = "";
}

const p = new Products();
p.name = "wireless mouse";
p.category = "electronics";
console.log(p.name);     // "WIRELESS MOUSE"
console.log(p.category); // "ELECTRONICS"


// --------------------------------------------------------
// 7. Accessor Decorator
// --------------------------------------------------------

// Applied to get / set accessors.
// Same signature as method decorator.

function Clamp(min: number, max: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalSet = descriptor.set!;

    descriptor.set = function (value: number) {
      const clamped = Math.min(Math.max(value, min), max);
      originalSet.call(this, clamped);
    };

    return descriptor;
  };
}

class Sensor {
  private _temperature: number = 0;

  @Clamp(-50, 150)
  set temperature(value: number) {
    this._temperature = value;
  }

  get temperature(): number {
    return this._temperature;
  }
}

const sensor = new Sensor();
sensor.temperature = 200;   // clamped to 150
console.log(sensor.temperature); // 150
sensor.temperature = -100;  // clamped to -50
console.log(sensor.temperature); // -50


// --------------------------------------------------------
// 8. Parameter Decorator
// --------------------------------------------------------

// Receives: target, methodName, parameterIndex
// Most commonly used with reflect-metadata to tag params
// Used heavily in NestJS (@Body(), @Param(), @Query())

function LogParam(
  target: any,
  methodName: string,
  parameterIndex: number
) {
  console.log(
    `Parameter at index ${parameterIndex} in method "${methodName}" is decorated`
  );
}

class PaymentService {
  charge(
    @LogParam amount: number,
    @LogParam currency: string
  ): string {
    return `Charged ${amount} ${currency}`;
  }
}

// Console:
// Parameter at index 1 in method "charge" is decorated
// Parameter at index 0 in method "charge" is decorated
// (decorators run right-to-left for parameters)


// --------------------------------------------------------
// 9. Stacking Multiple Decorators
// --------------------------------------------------------

// Multiple decorators are applied BOTTOM-UP
// but EVALUATED top-down (factories run top-down,
// returned decorators run bottom-up)

function First() {
  console.log("First factory evaluated");
  return function (target: any, key: string, desc: PropertyDescriptor) {
    console.log("First decorator applied");
  };
}

function Second() {
  console.log("Second factory evaluated");
  return function (target: any, key: string, desc: PropertyDescriptor) {
    console.log("Second decorator applied");
  };
}

class Demo {
  @First()
  @Second()
  run() {}
}

// Console order:
// First factory evaluated    ← top-down evaluation
// Second factory evaluated
// Second decorator applied   ← bottom-up application
// First decorator applied


// --------------------------------------------------------
// 10. Real-world Patterns
// --------------------------------------------------------

// Pattern 1: Memoize — cache method results
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}(${key})`);
      return cache.get(key);
    }
    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class ReportService {
  @Memoize
  generateReport(month: number, year: number): string {
    console.log("Generating report (expensive)...");
    return `Report for ${month}/${year}`;
  }
}

const reports = new ReportService();
reports.generateReport(1, 2025); // generates
reports.generateReport(1, 2025); // cache hit ✅
reports.generateReport(2, 2025); // generates


// Pattern 2: Debounce — delay rapid calls
function Debounce(ms: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    let timer: ReturnType<typeof setTimeout>;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => original.apply(this, args), ms);
    };

    return descriptor;
  };
}

class SearchBar {
  @Debounce(300)
  search(query: string): void {
    console.log(`Searching for: ${query}`);
  }
}

const bar = new SearchBar();
bar.search("t");       // cancelled
bar.search("ty");      // cancelled
bar.search("type");    // runs after 300ms ✅


// Pattern 3: Validate — guard method inputs
function Validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (...args: any[]) {
    for (const arg of args) {
      if (arg === null || arg === undefined) {
        throw new Error(`${propertyKey}: null/undefined argument not allowed`);
      }
    }
    return original.apply(this, args);
  };

  return descriptor;
}

class InvoiceService {
  @Validate
  @LogMethod
  createInvoice(customerId: number, amount: number): string {
    return `Invoice for customer ${customerId}: $${amount}`;
  }
}

const inv = new InvoiceService();
inv.createInvoice(5, 299);   // ✅
// inv.createInvoice(null, 299); // ❌ throws: null/undefined not allowed


/**
 * SUMMARY
 *
 * Decorator types:
 * @Class       → (constructor: Function)
 * @Method      → (target, key, descriptor)
 * @Property    → (target, key)
 * @Accessor    → (target, key, descriptor)
 * @Parameter   → (target, methodName, paramIndex)
 *
 * Factory:     → function that returns a decorator
 *                lets you pass arguments → @Debounce(300)
 *
 * Stacking:    → evaluated top-down, applied bottom-up
 *
 * Enable in tsconfig.json:
 * "experimentalDecorators": true
 * "emitDecoratorMetadata": true  ← for param decorators
 *
 * Common real-world uses:
 * @Log         → logging
 * @Memoize     → caching
 * @Debounce    → rate limiting
 * @Validate    → input guards
 * @Readonly    → lock methods
 * @Component   → metadata (Angular style)
 *
 * Frameworks using decorators:
 * NestJS      → @Controller, @Get, @Body, @Injectable
 * Angular     → @Component, @Injectable, @Input
 * TypeORM     → @Entity, @Column, @PrimaryGeneratedColumn
 */