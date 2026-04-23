// =========================================================
// src/ui/render.ts
// =========================================================
//
// All functions that touch the DOM live here.
// No business logic — only rendering.
//
// Rule: render functions take data IN, update DOM OUT.
// They never call ProductService directly.
// main.ts passes data to them.
// =========================================================

import { type Product, type AppConfig, type StockMovement, APP_CONFIG } from '../types/index.js';
import type { ValidationResult } from '../validators/FormValidator.js';
import { formatCurrency, formatDate, truncate, capitalize } from '../utils/helpers.js';

// =========================================================
// 1. DOM helpers — typed element getters
// =========================================================
//
// document.getElementById returns HTMLElement | null
// We need specific types — HTMLInputElement, HTMLSelectElement etc.
// This helper gets the element and throws if not found
// so we never silently work with null

function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element #${id} not found in DOM`);
  return el as T;
}

// Usage:
// getElement<HTMLInputElement>('name')     → HTMLInputElement
// getElement<HTMLSelectElement>('sort')    → HTMLSelectElement
// getElement<HTMLDivElement>('stats')      → HTMLDivElement

// =========================================================
// 2. renderStats
// =========================================================
//
// Shows total products, total inventory value, low stock count
// Called after every add / update / remove

export function renderStats(products: readonly Product[], config: AppConfig): void {
  const totalProducts = getElement<HTMLDivElement>('stat-total-products');
  const totalValue = getElement<HTMLDivElement>('stat-total-value');
  const lowStockEl = getElement<HTMLDivElement>('stat-low-stock');

  const value = [...products].reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= config.lowStockThreshold,
  ).length;
  const outOfStock = products.filter((p) => p.status === 'out-of-stock').length;

  totalProducts.innerHTML = `
    <span class="stat-label">Total Products</span>
    <span class="stat-value">${products.length}</span>
  `;

  totalValue.innerHTML = `
    <span class="stat-label">Inventory Value</span>
    <span class="stat-value">${formatCurrency(value, config.currency)}</span>
  `;

  lowStockEl.innerHTML = `
    <span class="stat-label">Low Stock</span>
    <span class="stat-value ${lowStock > 0 ? 'warn' : ''}">${lowStock}</span>
    <span class="stat-sub">${outOfStock} out of stock</span>
  `;
}

// =========================================================
// 3. renderProductCard
// =========================================================
//
// Builds ONE product card as an HTMLElement.
// Returns the element — does not insert it into the DOM.
// renderProductList calls this for each product.

export function renderProductCard(
  product: Product,
  config: AppConfig,
  editingId: string | null,
): HTMLElement {
  const card = document.createElement('div');
  card.className = `product-card status-${product.status}`;
  card.dataset['id'] = product.id; // data-id attribute for event delegation

  // Status badge color
  const badgeClass =
    product.status === 'active'
      ? 'badge-active'
      : product.status === 'inactive'
        ? 'badge-inactive'
        : 'badge-out';

  // Low stock warning flag
  const isLowStock = product.stock > 0 && product.stock <= 5;

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">
        <span class="product-name">${truncate(product.name, 25)}</span>
        <span class="badge ${badgeClass}">${product.status}</span>
      </div>
      <div class="card-title">
        <span class="product-sku">${product.sku}</span>
        <button class="btn-history badge" data-id="${product.id}">History</button>
      </div>
    </div>

    <div class="card-body">
      <div class="card-row">
        <span class="label">Category</span>
        <span class="value">${capitalize(product.category)}</span>
      </div>
      <div class="card-row">
        <span class="label">Price</span>
        <span class="value">${formatCurrency(product.price, config.currency)}</span>
      </div>
      <div class="card-row">
        <span class="label">Stock</span>
        <span class="value ${isLowStock ? 'warn' : ''}">
          ${product.stock} units ${isLowStock ? '⚠ Low' : ''}
        </span>
      </div>
      <div class="card-row">
        <span class="label">Added</span>
        <span class="value">${formatDate(new Date(product.createdAt))}</span>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn-stock-in" ${editingId || product.status === 'inactive' ? 'disabled' : ''} data-id="${product.id}">Stock In</button>
      <button class="btn-stock-out" ${editingId || product.status === 'inactive' ? 'disabled' : ''} data-id="${product.id}">Stock Out</button>
      <button class="btn-edit" data-id="${product.id}">Edit</button>
      <button class="btn-delete" ${editingId ? 'disabled' : ''} data-id="${product.id}">Delete</button>
    </div>
  `;

  return card;
}

// =========================================================
// 4. renderProductList
// =========================================================
//
// Renders the full list of products.
// Clears the container first, then appends fresh cards.
// Called after every state change.

export function renderProductList(products: readonly Product[], editingId: string | null): void {
  const container = getElement<HTMLDivElement>('product-list');

  // Clear existing content
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No products found.</p>
        <p>Add your first product using the form above.</p>
      </div>
    `;
    return;
  }

  // DocumentFragment — batch DOM inserts for performance
  // Appending one fragment is faster than N separate appends
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const card = renderProductCard(product, APP_CONFIG, editingId);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

// =========================================================
// 5. renderValidationErrors
// =========================================================
//
// Shows inline errors below each form field.
// ValidationResult<T> maps every key to string | null.
// null   → clear the error element
// string → show the error message

export function renderValidationErrors<T>(result: ValidationResult<T>): void {
  // Loop over every key in the result
  for (const key in result) {
    const field = key as keyof T;
    const error = result[field]; // string | null

    // Look for an element with id="error-{fieldName}"
    const errorEl = document.getElementById(`error-${key}`);
    if (!errorEl) continue;

    if (error) {
      errorEl.textContent = error; // show error
      errorEl.style.display = 'block';

      // Also mark the input as invalid
      const input = document.getElementById(key);
      input?.classList.add('input-error');
    } else {
      errorEl.textContent = ''; // clear error
      errorEl.style.display = 'none';

      // Remove invalid mark
      const input = document.getElementById(key);
      input?.classList.remove('input-error');
    }
  }
}

// =========================================================
// 6. clearValidationErrors
// =========================================================
//
// Clears ALL error messages — called when form resets

export function clearValidationErrors(fields: string[]): void {
  fields.forEach((key) => {
    const errorEl = document.getElementById(`error-${key}`);
    const inputEl = document.getElementById(key);

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }

    inputEl?.classList.remove('input-error');
  });
}

// =========================================================
// 7. renderStockModal
// =========================================================
//
// Shows a simple modal for stock in / stock out
// Returns a Promise that resolves with the quantity entered
// or null if cancelled

export function renderStockModal(product: Product, type: 'in' | 'out'): Promise<number | null> {
  return new Promise((resolve) => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const action = type === 'in' ? 'Add Stock' : 'Remove Stock';

    overlay.innerHTML = `
      <div class="modal">
        <h3>${action} — ${truncate(product.name, 20)}</h3>
        <p>Current stock: <strong>${product.stock}</strong> units</p>

        <div class="form-group">
          <label for="modal-qty">Quantity</label>
          <input
            type="number"
            id="modal-qty"
            min="1"
            max="${type === 'out' ? product.stock : 9999}"
            value="1"
          />
          <span id="error-modal-qty" class="error-text"></span>
        </div>

        <div class="modal-actions">
          <button id="modal-cancel">Cancel</button>
          <button id="modal-confirm" class="btn-primary">${action}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const qtyInput = getElement<HTMLInputElement>('modal-qty');
    const confirmBtn = getElement<HTMLButtonElement>('modal-confirm');
    const cancelBtn = getElement<HTMLButtonElement>('modal-cancel');
    const errorEl = getElement<HTMLSpanElement>('error-modal-qty');

    // Focus input immediately
    qtyInput.focus();

    // Confirm — parse and validate quantity
    confirmBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput.value, 10);

      if (isNaN(qty) || qty <= 0) {
        errorEl.textContent = 'Please enter a valid quantity';
        return;
      }

      if (type === 'out' && qty > product.stock) {
        errorEl.textContent = `Cannot remove more than ${product.stock} units`;
        return;
      }

      document.body.removeChild(overlay);
      resolve(qty); // resolves with the quantity
    });

    // Cancel — resolve with null
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(null); // resolves with null = cancelled
    });

    // Close on overlay click
    overlay.addEventListener('click', (e: MouseEvent) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
        resolve(null);
      }
    });

    // Enter key submits
    qtyInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') confirmBtn.click();
      if (e.key === 'Escape') cancelBtn.click();
    });
  });
}

// =========================================================
// 8. getFormData
// =========================================================
//
// Reads all form inputs and returns a typed object.
// Called in main.ts on form submit.
// Returns Omit<Product, 'id' | 'createdAt'> — exactly what
// ProductService.addProduct expects.

export function getFormData(): Omit<Product, 'id' | 'createdAt'> {
  return {
    name: getElement<HTMLInputElement>('name').value.trim(),
    sku: getElement<HTMLInputElement>('sku').value.trim().toUpperCase(),
    price: parseFloat(getElement<HTMLInputElement>('price').value),
    stock: parseInt(getElement<HTMLInputElement>('stock').value, 10),
    category: getElement<HTMLSelectElement>('category').value as Product['category'],
    status: getElement<HTMLSelectElement>('status').value as Product['status'], // new products always start as active
  };
}

// =========================================================
// 9. resetForm
// =========================================================
//
// Clears all form inputs after successful submit

export function resetForm(): void {
  const form = getElement<HTMLFormElement>('product-form');
  form.reset();

  clearValidationErrors(['name', 'sku', 'price', 'stock', 'category', 'status']);
}

/**
 * SUMMARY
 *
 * getElement<T>()
 *   → typed DOM getter — throws if element missing
 *   → T extends HTMLElement — HTMLInputElement, HTMLDivElement etc.
 *
 * renderStats()
 *   → reads Readonly<Product[]> and AppConfig
 *   → updates stat bar in DOM
 *
 * renderProductCard()
 *   → builds one card HTMLElement — does not insert it
 *   → returns HTMLElement for renderProductList to use
 *
 * renderProductList()
 *   → clears container, appends all cards via DocumentFragment
 *   → shows empty state if no products
 *
 * renderValidationErrors<T>()
 *   → generic — works with ValidationResult of any type T
 *   → loops result, shows/clears error elements by field name
 *
 * renderStockModal()
 *   → returns Promise<number | null>
 *   → null = cancelled, number = confirmed quantity
 *
 * getFormData()
 *   → reads form inputs
 *   → returns Omit<Product, 'id' | 'createdAt'>
 *   → exactly matches addProduct() parameter type
 *
 * Key DOM typing rules:
 *   getElementById()     → HTMLElement | null
 *   as HTMLInputElement  → cast when you are sure of the type
 *   ?.classList          → optional chain if element might not exist
 *   e: MouseEvent        → type event callbacks explicitly
 *   e: KeyboardEvent     → never leave events as plain `Event`
 */

// ---------------------------------------------------------
// renderMovementHistory
// ---------------------------------------------------------
// Renders a list of stock movements for ONE product.
// Called when user clicks "History" on a product card.

export function renderMovementHistory(product: Product, movements: StockMovement[]): void {
  closeHistoryPanel();

  const panel = document.createElement('div');
  panel.id = 'history-panel';
  panel.className = 'history-panel';

  panel.innerHTML = `
    <div class="hp-header">
      <div>
        <div class="hp-title">Stock History</div>
        <div class="hp-sub">${product.name} &middot; ${product.sku}</div>
      </div>
      <button class="hp-close" id="close-history">&#10005;</button>
    </div>
    <div class="hp-summary">
      <div class="hp-stat">
        <span class="hp-stat-label">Current Stock</span>
        <span class="hp-stat-value ${product.stock === 0 ? 'danger' : product.stock <= 5 ? 'warning' : 'success'}">
          ${product.stock} units
        </span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-label">Total Movements</span>
        <span class="hp-stat-value primary">${movements.length}</span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-label">Total In</span>
        <span class="hp-stat-value success">
          +${movements.filter((m) => m.type === 'in').reduce((s, m) => s + m.quantity, 0)}
        </span>
      </div>
      <div class="hp-stat">
        <span class="hp-stat-label">Total Out</span>
        <span class="hp-stat-value warning">
          -${movements.filter((m) => m.type === 'out').reduce((s, m) => s + m.quantity, 0)}
        </span>
      </div>
    </div>
    <div class="hp-list">
      ${
        movements.length === 0
          ? `<div class="hp-empty">No movements recorded yet</div>`
          : [...movements]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(
                (m, i) => `
              <div class="hp-row" style="animation-delay:${i * 0.04}s">
                <div class="hp-type ${m.type === 'in' ? 'type-in' : 'type-out'}">
                  ${m.type === 'in' ? '+' : '−'}
                </div>
                <div class="hp-info">
                  <span class="hp-qty ${m.type === 'in' ? 'success' : 'warning'}">
                    ${m.type === 'in' ? '+' : '-'}${m.quantity} units
                  </span>
                  <span class="hp-action">
                    Stock ${m.type === 'in' ? 'received' : 'dispatched'}
                  </span>
                </div>
                <div class="hp-date">${formatDate(new Date(m.date))}</div>
              </div>
            `,
              )
              .join('')
      }
    </div>
  `;

  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add('open'));

  // Close button
  document.getElementById('close-history')?.addEventListener('click', closeHistoryPanel);

  // ✅ Fix — wait for current click event to finish
  // before adding the outside-click listener
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 0);
}

// ---------------------------------------------------------
// closeHistoryPanel
// ---------------------------------------------------------

export function closeHistoryPanel(): void {
  const panel = document.getElementById('history-panel');
  if (!panel) return;

  panel.classList.remove('open');

  // Remove listener immediately so it cannot fire again
  document.removeEventListener('click', handleOutsideClick); // ✅

  panel.addEventListener('transitionend', () => panel.remove(), { once: true });
}

// ---------------------------------------------------------
// handleOutsideClick — closes panel if clicking outside
// ---------------------------------------------------------

function handleOutsideClick(e: MouseEvent): void {
  const panel = document.getElementById('history-panel');
  if (panel && !panel.contains(e.target as Node)) {
    closeHistoryPanel();
  }
}
