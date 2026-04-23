// =========================================================
// src/services/ProductService.ts
// =========================================================
//
// ProductService extends Store<Product>
// It inherits all Store methods for free — add, update,
// remove, getById, getAll, filter, sortBy, count
//
// Then adds product-specific business logic on top.
// =========================================================

import { Store, TypedStorage } from '../store/Store.js';
import { type Product, type StockMovement, APP_CONFIG } from '../types/index.js';

// =========================================================
// Decorators
// =========================================================
//
// Write decorators BEFORE the class that uses them.
// They are just plain functions — nothing special to import.

// ---------------------------------------------------------
// @Log decorator
// ---------------------------------------------------------
// Logs the method name and arguments every time it is called.
// Applied to: addProduct, moveStock

function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[LOG] ${propertyKey} called with:`, args);
    const result = original.apply(this, args);
    console.log(`[LOG] ${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

// ---------------------------------------------------------
// @Validate decorator
// ---------------------------------------------------------
// Blocks addProduct if name or sku is empty.
// If invalid — throws an error before the method even runs.

function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const data = args[0];

    if (!data.name || data.name.trim() === '')
      throw new Error('Validation failed: name is required');

    if (!data.sku || data.sku.trim() === '') throw new Error('Validation failed: sku is required');

    if (data.price <= 0) throw new Error('Validation failed: price must be greater than 0');

    if (data.stock < 0) throw new Error('Validation failed: stock cannot be negative');

    return original.apply(this, args);
  };

  return descriptor;
}

// =========================================================
// ProductService class
// =========================================================
export class ProductService extends Store<Product> {
  // TypeStorage handle localStorage
  private storage: TypedStorage<Product[]>;

  // StockMovement history - kept in memory + storage
  private movements: StockMovement[] = [];
  private movementStorage: TypedStorage<StockMovement[]>;

  constructor() {
    super(); // required — calls Store<Product> constructor

    this.storage = new TypedStorage<Product[]>('products');
    this.movementStorage = new TypedStorage<StockMovement[]>('movements');

    // Load persisted data into Store on startup
    this.loadFromStorage();
  }

  // ---------------------------------------------------------
  // loadFromStorage — called once in constructor
  // ---------------------------------------------------------

  private loadFromStorage(): void {
    const savedProducts = this.storage.load();
    if (savedProducts) {
      // add Parent Class function
      savedProducts.forEach((item) => this.add(item));
    }

    const savedMovements = this.movementStorage.load();
    if (savedMovements) this.movements = savedMovements;
  }

  // ---------------------------------------------------------
  // persist — called after every write operation
  // ---------------------------------------------------------

  private persist(): void {
    // getAll Parent Class function
    this.storage.save([...this.getAll()]);
  }

  private persistMovement(): void {
    this.movementStorage.save(this.movements);
  }

  // ---------------------------------------------------------
  // generateId — simple unique id helper
  // ---------------------------------------------------------
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  // ---------------------------------------------------------
  // addProduct
  // ---------------------------------------------------------
  // Takes Omit<Product, 'id' | 'createdAt'> — caller never
  // provides id or createdAt — we generate them here.
  //
  // @Validate runs FIRST — blocks if data is invalid
  // @Log runs SECOND — logs the call after validation passes
  //
  // Decorator order: bottom decorator applies first
  // So @Log wraps @Validate wraps the original method

  @Log
  @Validate
  addProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
    const product: Product = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
    };

    this.add(product); // Store method (inherited)
    this.persist(); // save to localStorage

    return product;
  }

  // ---------------------------------------------------------
  // updateProduct
  // ---------------------------------------------------------
  // Partial<Omit<Product, 'id'>> means:
  //   - cannot change the id (Omit removes it)
  //   - all other fields are optional (Partial makes them ?)
  updateProduct(id: string, changes: Partial<Omit<Product, 'id'>>): Product | undefined {
    const updated = this.update(id, changes);
    if (updated) this.persist();
    return updated;
  }

  // ---------------------------------------------------------
  // removeProduct
  // ---------------------------------------------------------
  removeProduct(id: string): boolean {
    const removed = this.remove(id);
    if (removed) {
      this.movements = this.movements.filter((item) => item.productId !== id);
      this.persist();
      this.persistMovement();
    }
    return removed;
  }

  // ---------------------------------------------------------
  // moveStock
  // ---------------------------------------------------------
  // "in"  → stock increases  (receiving new stock)
  // "out" → stock decreases  (selling or using stock)
  //
  // Auto-updates status:
  //   stock = 0       → "out-of-stock"
  //   stock <= threshold → stays "active" but flagged in UI
  //   stock > 0       → "active"
  //
  // @Log logs every stock movement

  @Log
  moveStock(productId: string, type: 'in' | 'out', quantity: number): void {
    const product = this.getById(productId); // Store method

    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (type === 'out' && product.stock < quantity) {
      throw new Error(`Not enough stock. Available: ${product.stock}, Requested: ${quantity}`);
    }

    // Calculate new stock
    const newStock = type === 'in' ? product.stock + quantity : product.stock - quantity;

    // Auto-update status based on new stock level
    const newStatus: Product['status'] =
      newStock === 0
        ? 'out-of-stock'
        : product.status === 'out-of-stock'
          ? 'active' // recovering from out-of-stock — set active
          : product.status; // was active or inactive — keep it unchanged

    // Update the product
    this.update(productId, { stock: newStock, status: newStatus });

    // Record the movement
    const movement: StockMovement = {
      productId,
      type,
      quantity,
      date: new Date(),
    };
    this.movements.push(movement);

    // Persist both
    this.persist();
    this.persistMovement();
  }

  // ---------------------------------------------------------
  // getLowStockProducts
  // ---------------------------------------------------------
  // Uses APP_CONFIG.lowStockThreshold (default: 5)
  // Returns products where stock > 0 but below threshold
  // (out-of-stock products are separate)

  getLowStockProducts(threshold = APP_CONFIG.lowStockThreshold): Product[] {
    return this.filter((p) => p.stock > 0 && p.stock <= threshold);
  }

  // ---------------------------------------------------------
  // getOutOfStockProducts
  // ---------------------------------------------------------

  getOutOfStockProducts(): Product[] {
    return this.filter((item) => item.status === 'out-of-stock');
  }

  // ---------------------------------------------------------
  // getTotalInventoryValue
  // ---------------------------------------------------------
  // price × stock for every product, summed up

  getTotalInventoryValue(): number {
    return [...this.getAll()].reduce((acc, cur) => acc + cur.stock * cur.price, 0);
  }

  // ---------------------------------------------------------
  // getMovementHistory
  // ---------------------------------------------------------
  // Returns all stock movements for a specific product
  getMovementHistory(productId: string): StockMovement[] {
    return this.movements.filter((m) => m.productId === productId);
  }

  // ---------------------------------------------------------
  // searchProducts
  // ---------------------------------------------------------
  // Filter by name or sku — case insensitive

  searchProducts(query: string): Product[] {
    const q = query.toLowerCase();
    return this.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  // ---------------------------------------------------------
  // getByCategory
  // ---------------------------------------------------------

  getByCategory(category: Product['category']): Product[] {
    return this.filter((p) => p.category === category);
  }
}
