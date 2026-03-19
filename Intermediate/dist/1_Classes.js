"use strict";
/**
 * =========================================================
 * TypeScript Classes
 * =========================================================
 *
 * Covers:
 * 1. Basic Class
 * 2. Access Modifiers (public, private, protected, readonly)
 * 3. Constructor Shorthand
 * 4. Getters & Setters
 * 5. Static Members
 * 6. Inheritance (extends)
 * 7. Abstract Classes
 * 8. Implements (Interface + Class)
 *
 * =========================================================
 */
console.info('%c1. TypeScript Classes', 'color: yellow; font-weight: bold; font-size: 18px');
/**
 * --------------------------------
 * 1. Basic Class
 * --------------------------------
 */
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    greet() {
        return `Hi, I'm ${this.name}`;
    }
}
const p = new Person('Zaffar', 22);
console.log(p.greet()); // Hi, I'm Zaffar
/**
 * --------------------------------
 * 2. Access Modifiers
 * --------------------------------
 *
 * public    → accessible everywhere (default)
 * private   → accessible only inside THIS class
 * protected → accessible inside this class + subclasses
 * readonly  → can be set once (in constructor), never changed after
 */
class BankAccount {
    constructor(holder, initialBalance) {
        this.accountHolder = holder;
        this.balance = initialBalance;
        this.bankName = 'TypeScript Bank';
        this.accountId = Math.random().toString(36).slice(2); // set once here
    }
    deposit(amount) {
        this.balance += amount; // ✅ private — accessible inside class
    }
    getBalance() {
        return this.balance; // ✅ expose private data through a method
    }
}
const account = new BankAccount('Zaffar', 1000);
console.log(account.accountHolder); // ✅ public
console.log(account.getBalance()); // ✅ through method
console.log(account.accountId); // ✅ readonly — can read
// account.balance = 9999;          // ❌ private
// account.bankName = "Other";      // ❌ protected
// account.accountId = "abc";       // ❌ readonly
/**
 * --------------------------------
 * 3. Constructor Shorthand
 * --------------------------------
 * Instead of declaring + assigning manually,
 * put the modifier directly in the constructor parameter
 */
// ❌ Long way (what you saw above)
class CarLong {
    constructor(brand, speed) {
        this.brand = brand;
        this.speed = speed;
    }
}
// ✅ Shorthand — TypeScript does both declaration + assignment automatically
class Car {
    constructor(brand, speed, year) {
        this.brand = brand;
        this.speed = speed;
        this.year = year;
    }
    describe() {
        return `${this.brand} (${this.year}) — ${this.speed}km/h`;
    }
}
const car = new Car('Toyota', 180, 2022);
console.log(car.brand); // ✅
console.log(car.year); // ✅
// car.speed;            // ❌ private
/**
 * --------------------------------
 * 4. Getters & Setters
 * --------------------------------
 * Control how private data is read and written
 */
class Temperature {
    constructor() {
        this._celsius = 0; // convention: _ prefix for backing field
    }
    get celsius() {
        return this._celsius;
    }
    set celsius(value) {
        if (value < -273.15) {
            throw new Error('Below absolute zero!');
        }
        this._celsius = value;
    }
    get fahrenheit() {
        return (this._celsius * 9) / 5 + 32; // computed on the fly
    }
}
const temp = new Temperature();
temp.celsius = 100; // calls setter
console.log(temp.celsius); // 100  — calls getter
console.log(temp.fahrenheit); // 212  — computed getter
// temp.celsius = -999;       // ❌ throws error (setter validation)
/**
 * --------------------------------
 * 5. Static Members
 * --------------------------------
 * Belong to the CLASS itself, not to instances
 * Access via ClassName.member, not this.member
 */
class MathHelper {
    static circleArea(radius) {
        return MathHelper.PI * radius * radius;
    }
    static add(a, b) {
        return a + b;
    }
}
MathHelper.PI = 3.14159;
console.log(MathHelper.PI); // ✅ no instance needed
console.log(MathHelper.circleArea(5)); // ✅
console.log(MathHelper.add(2, 3)); // ✅
// const m = new MathHelper();
// m.PI; // ❌ static members not on instances
/**
 * --------------------------------
 * 6. Inheritance (extends)
 * --------------------------------
 * Child class inherits from parent
 * Use super() to call parent constructor
 * Use super.method() to call parent method
 */
class Animal {
    constructor(name) {
        this.name = name;
    }
    move(distance = 0) {
        console.log(`${this.name} moved ${distance}m`);
    }
    toString() {
        return `Animal: ${this.name}`;
    }
}
class Dog extends Animal {
    constructor(name, breed) {
        super(name); // ✅ must call super() first
        this.breed = breed;
    }
    bark() {
        console.log(`${this.name} says Woof!`);
    }
    // Override parent method
    move(distance = 10) {
        console.log(`${this.name} runs...`);
        super.move(distance); // call parent's move too
    }
}
const dog = new Dog('Bruno', 'Labrador');
dog.bark(); // Bruno says Woof!
dog.move(50); // Bruno runs... → Bruno moved 50m
console.log(dog.name); // ✅ inherited from Animal
console.log(dog.breed); // ✅ own property
/**
 * --------------------------------
 * 7. Abstract Classes
 * --------------------------------
 *
 * abstract class:
 * - CANNOT be instantiated directly (no `new AbstractClass()`)
 * - Acts as a blueprint for subclasses
 * - Can have:
 *     abstract methods  → subclass MUST implement
 *     concrete methods  → shared logic subclass inherits
 */
class Shape {
    constructor(color) {
        this.color = color;
    }
    // Concrete method — shared logic for all shapes
    describe() {
        return `A ${this.color} shape with area ${this.getArea().toFixed(2)}`;
    }
}
// const s = new Shape("red"); // ❌ Cannot instantiate abstract class
class Circle extends Shape {
    constructor(color, radius) {
        super(color);
        this.radius = radius;
    }
    // Must implement abstract methods
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}
class Rectangle extends Shape {
    constructor(color, width, height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}
const circle = new Circle('red', 5);
const rect = new Rectangle('blue', 4, 6);
console.log(circle.describe()); // A red shape with area 78.54
console.log(rect.describe()); // A blue shape with area 24.00
console.log(circle.getArea()); // 78.53...
console.log(rect.getPerimeter()); // 20
// Class implementing multiple interfaces
class Documents {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
    // Must implement print() — required by Printable
    print() {
        console.log(`--- ${this.title} ---`);
        console.log(this.content);
    }
    // Must implement serialize() — required by Serializable
    serialize() {
        return JSON.stringify({ title: this.title, content: this.content });
    }
}
const doc = new Documents('TypeScript Notes', 'Classes are great!');
doc.print();
console.log(doc.serialize());
class LivingThing {
    breathe() {
        console.log('Breathing...');
    }
}
class Duck extends LivingThing {
    fly() {
        console.log('Duck is flying!');
    }
    swim() {
        console.log('Duck is swimming!');
    }
}
const duck = new Duck();
duck.breathe(); // inherited from LivingThing
duck.fly(); // implemented from Flyable
duck.swim(); // implemented from Swimmable
/**
 * =========================================================
 * FINAL INTERVIEW SUMMARY
 * =========================================================
 *
 * public      → accessible everywhere (default)
 * private     → only inside this class
 * protected   → this class + subclasses
 * readonly    → set once, never changed
 *
 * Shorthand   → modifiers in constructor params
 * get/set     → control private data access
 * static      → belongs to class, not instance
 *
 * extends     → inherit from parent (one only)
 * abstract    → blueprint, cannot instantiate
 * implements  → fulfill interface contract (multiple ok)
 *
 * extends vs implements:
 * extends    → IS-A relationship (Dog IS-A Animal)
 * implements → CAN-DO relationship (Duck CAN fly, CAN swim)
 *
 * =========================================================
 */
