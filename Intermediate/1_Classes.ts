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
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
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
  public accountHolder: string; // anyone can read/write
  private balance: number; // only BankAccount methods can touch this
  protected bankName: string; // BankAccount + subclasses can touch this
  readonly accountId: string; // set once, never changed

  constructor(holder: string, initialBalance: number) {
    this.accountHolder = holder;
    this.balance = initialBalance;
    this.bankName = 'TypeScript Bank';
    this.accountId = Math.random().toString(36).slice(2); // set once here
  }

  deposit(amount: number): void {
    this.balance += amount; // ✅ private — accessible inside class
  }

  getBalance(): number {
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
  public brand: string;
  private speed: number;

  constructor(brand: string, speed: number) {
    this.brand = brand;
    this.speed = speed;
  }
}

// ✅ Shorthand — TypeScript does both declaration + assignment automatically
class Car {
  constructor(
    public brand: string,
    private speed: number,
    readonly year: number,
  ) {}

  describe(): string {
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
  private _celsius: number = 0; // convention: _ prefix for backing field

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error('Below absolute zero!');
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
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
  static readonly PI = 3.14159;

  static circleArea(radius: number): number {
    return MathHelper.PI * radius * radius;
  }

  static add(a: number, b: number): number {
    return a + b;
  }
}

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
  constructor(public name: string) {}

  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m`);
  }

  toString(): string {
    return `Animal: ${this.name}`;
  }
}

class Dog extends Animal {
  constructor(
    name: string,
    public breed: string,
  ) {
    super(name); // ✅ must call super() first
  }

  bark(): void {
    console.log(`${this.name} says Woof!`);
  }

  // Override parent method
  override move(distance: number = 10): void {
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

abstract class Shape {
  constructor(public color: string) {}

  // Abstract method — no body, subclass MUST implement
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // Concrete method — shared logic for all shapes
  describe(): string {
    return `A ${this.color} shape with area ${this.getArea().toFixed(2)}`;
  }
}

// const s = new Shape("red"); // ❌ Cannot instantiate abstract class

class Circle extends Shape {
  constructor(
    color: string,
    public radius: number,
  ) {
    super(color);
  }

  // Must implement abstract methods
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    public width: number,
    public height: number,
  ) {
    super(color);
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const circle = new Circle('red', 5);
const rect = new Rectangle('blue', 4, 6);

console.log(circle.describe()); // A red shape with area 78.54
console.log(rect.describe()); // A blue shape with area 24.00
console.log(circle.getArea()); // 78.53...
console.log(rect.getPerimeter()); // 20

/**
 * --------------------------------
 * 8. implements (Interface + Class)
 * --------------------------------
 *
 * implements → class MUST follow the interface contract
 * A class can implement MULTIPLE interfaces
 *
 * 🔥 Key Difference:
 *
 * extends    → inherit code from parent class (one class only)
 * implements → fulfill a contract from interface (multiple allowed)
 */

interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

// Class implementing multiple interfaces
class Documents implements Printable, Serializable {
  constructor(
    public title: string,
    public content: string,
  ) {}

  // Must implement print() — required by Printable
  print(): void {
    console.log(`--- ${this.title} ---`);
    console.log(this.content);
  }

  // Must implement serialize() — required by Serializable
  serialize(): string {
    return JSON.stringify({ title: this.title, content: this.content });
  }
}

const doc = new Documents('TypeScript Notes', 'Classes are great!');
doc.print();
console.log(doc.serialize());

/**
 * --------------------------------
 * extends + implements together
 * --------------------------------
 * A class can extend one class AND implement interfaces at the same time
 */

interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class LivingThing {
  breathe(): void {
    console.log('Breathing...');
  }
}

class Duck extends LivingThing implements Flyable, Swimmable {
  fly(): void {
    console.log('Duck is flying!');
  }

  swim(): void {
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
