"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
function Sealed(constructor) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
    // No new properties can be added to this class
}
function Log(constructor) {
    console.log(`Class created: ${constructor.name}`);
}
let Vehicle = class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }
};
Vehicle = __decorate([
    Log,
    Sealed,
    __metadata("design:paramtypes", [String])
], Vehicle);
// Console: "Class created: Vehicle"
// Vehicle is now sealed — no property additions allowed
// --------------------------------------------------------
// 4. Decorator Factory
// --------------------------------------------------------
// A factory is a function that RETURNS a decorator.
// This lets you pass arguments to your decorator.
function Component(config) {
    return function (constructor) {
        console.log(`Component registered: ${config.selector}`);
        // Attach config to the class
        constructor.selector = config.selector;
        constructor.template = config.template;
    };
}
let HeaderComponent = class HeaderComponent {
    render() {
        console.log("Rendering header...");
    }
};
HeaderComponent = __decorate([
    Component({
        selector: "app-header",
        template: "<header>Hello</header>",
    })
], HeaderComponent);
// Console: "Component registered: app-header"
// --------------------------------------------------------
// 5. Method Decorator
// --------------------------------------------------------
// Receives: target, propertyKey, descriptor
// descriptor.value = the actual method function
// Can wrap, replace, or block the method
function LogMethod(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling ${propertyKey} with`, args);
        const result = original.apply(this, args);
        console.log(`${propertyKey} returned`, result);
        return result;
    };
    return descriptor;
}
function Readonly2(target, propertyKey, descriptor) {
    descriptor.writable = false; // method cannot be overwritten
    return descriptor;
}
class OrderService {
    placeOrder(itemId, qty) {
        return `Order placed: item ${itemId} x${qty}`;
    }
    getVersion() {
        return "v1.0";
    }
}
__decorate([
    LogMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", String)
], OrderService.prototype, "placeOrder", null);
__decorate([
    Readonly2,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], OrderService.prototype, "getVersion", null);
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
function Uppercase(target, propertyKey) {
    let value;
    Object.defineProperty(target, propertyKey, {
        get() { return value; },
        set(newValue) {
            value = newValue.toUpperCase(); // force uppercase on set
        },
        enumerable: true,
        configurable: true,
    });
}
function Required2(target, propertyKey) {
    // Store metadata — used by a validator at runtime
    // const required: string[] = Reflect.getMetadata("required", target) || [];
    // required.push(propertyKey);
    // Reflect.defineMetadata("required", required, target);
}
class Products {
    constructor() {
        this.name = "";
        this.category = "";
    }
}
__decorate([
    Uppercase,
    __metadata("design:type", String)
], Products.prototype, "name", void 0);
__decorate([
    Uppercase,
    __metadata("design:type", String)
], Products.prototype, "category", void 0);
const p = new Products();
p.name = "wireless mouse";
p.category = "electronics";
console.log(p.name); // "WIRELESS MOUSE"
console.log(p.category); // "ELECTRONICS"
// --------------------------------------------------------
// 7. Accessor Decorator
// --------------------------------------------------------
// Applied to get / set accessors.
// Same signature as method decorator.
function Clamp(min, max) {
    return function (target, propertyKey, descriptor) {
        const originalSet = descriptor.set;
        descriptor.set = function (value) {
            const clamped = Math.min(Math.max(value, min), max);
            originalSet.call(this, clamped);
        };
        return descriptor;
    };
}
class Sensor {
    constructor() {
        this._temperature = 0;
    }
    set temperature(value) {
        this._temperature = value;
    }
    get temperature() {
        return this._temperature;
    }
}
__decorate([
    Clamp(-50, 150),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], Sensor.prototype, "temperature", null);
const sensor = new Sensor();
sensor.temperature = 200; // clamped to 150
console.log(sensor.temperature); // 150
sensor.temperature = -100; // clamped to -50
console.log(sensor.temperature); // -50
// --------------------------------------------------------
// 8. Parameter Decorator
// --------------------------------------------------------
// Receives: target, methodName, parameterIndex
// Most commonly used with reflect-metadata to tag params
// Used heavily in NestJS (@Body(), @Param(), @Query())
function LogParam(target, methodName, parameterIndex) {
    console.log(`Parameter at index ${parameterIndex} in method "${methodName}" is decorated`);
}
class PaymentService {
    charge(amount, currency) {
        return `Charged ${amount} ${currency}`;
    }
}
__decorate([
    __param(0, LogParam),
    __param(1, LogParam),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", String)
], PaymentService.prototype, "charge", null);
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
    return function (target, key, desc) {
        console.log("First decorator applied");
    };
}
function Second() {
    console.log("Second factory evaluated");
    return function (target, key, desc) {
        console.log("Second decorator applied");
    };
}
class Demo {
    run() { }
}
__decorate([
    First(),
    Second(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Demo.prototype, "run", null);
// Console order:
// First factory evaluated    ← top-down evaluation
// Second factory evaluated
// Second decorator applied   ← bottom-up application
// First decorator applied
// --------------------------------------------------------
// 10. Real-world Patterns
// --------------------------------------------------------
// Pattern 1: Memoize — cache method results
function Memoize(target, propertyKey, descriptor) {
    const original = descriptor.value;
    const cache = new Map();
    descriptor.value = function (...args) {
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
    generateReport(month, year) {
        console.log("Generating report (expensive)...");
        return `Report for ${month}/${year}`;
    }
}
__decorate([
    Memoize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", String)
], ReportService.prototype, "generateReport", null);
const reports = new ReportService();
reports.generateReport(1, 2025); // generates
reports.generateReport(1, 2025); // cache hit ✅
reports.generateReport(2, 2025); // generates
// Pattern 2: Debounce — delay rapid calls
function Debounce(ms) {
    return function (target, propertyKey, descriptor) {
        const original = descriptor.value;
        let timer;
        descriptor.value = function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => original.apply(this, args), ms);
        };
        return descriptor;
    };
}
class SearchBar {
    search(query) {
        console.log(`Searching for: ${query}`);
    }
}
__decorate([
    Debounce(300),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SearchBar.prototype, "search", null);
const bar = new SearchBar();
bar.search("t"); // cancelled
bar.search("ty"); // cancelled
bar.search("type"); // runs after 300ms ✅
// Pattern 3: Validate — guard method inputs
function Validate(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args) {
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
    createInvoice(customerId, amount) {
        return `Invoice for customer ${customerId}: $${amount}`;
    }
}
__decorate([
    Validate,
    LogMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", String)
], InvoiceService.prototype, "createInvoice", null);
const inv = new InvoiceService();
inv.createInvoice(5, 299); // ✅
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
