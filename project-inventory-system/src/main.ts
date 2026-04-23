// =========================================================
// src/main.ts
// =========================================================
//
// Entry point — wires everything together.
// No business logic here.
// No DOM manipulation here.
//
// main.ts only does three things:
//   1. Creates instances of services and validators
//   2. Listens for user events
//   3. Calls the right service method + render function
//
// Think of it as the traffic controller —
// it directs requests, it does not process them.
// =========================================================

import type { Product, SortKey, Category, ProductStatus } from './types/index.js';

import { APP_CONFIG } from './types/index.js';
import { ProductService } from './services/ProductService.js';
import { FormValidator } from './validators/FormValidator.js';

import type { FormSchema } from './validators/FormValidator.js';

import {
  renderProductList,
  renderStats,
  renderValidationErrors,
  renderStockModal,
  getFormData,
  resetForm,
} from './ui/render.js';

import { debounce } from './utils/helpers.js';

// =========================================================
// 1. Create instances
// =========================================================
//
// One service instance for the entire app.
// Constructor loads from localStorage automatically.

const service = new ProductService();
let editingId: string | null = null; // track which product is being edited

// =========================================================
// 2. Form validation schema
// =========================================================
//
// Omit<Product, 'id' | 'createdAt'> because the form
// never asks for id or createdAt — we generate those.

const productSchema: FormSchema<Omit<Product, 'id' | 'createdAt'>> = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  sku: {
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: /^[A-Z0-9-]+$/i,
    message: 'SKU can only contain letters, numbers, and hyphens',
  },
  price: {
    required: true,
    min: 1,
    max: 10000000,
  },
  stock: {
    required: true,
    min: 0,
    max: 100000,
  },
  category: {
    required: true,
  },
  status: {
    required: true,
  },
};

const validator = new FormValidator(productSchema);

// =========================================================
// 3. App state
// =========================================================
//
// Keeps track of current search, sort, filter values.
// Every re-render reads from this state object.

const state = {
  search: '',
  sort: 'name-asc' as SortKey,
  category: 'all' as Category | 'all',
  status: 'all' as ProductStatus | 'all',
};

// =========================================================
// 4. render — central re-render function
// =========================================================
//
// Called after EVERY state change.
// Reads current state, gets matching products, renders.
//
// This is the ONLY place that calls render functions.
// Event handlers never call render directly — they update
// state and call render().

function render(): void {
  let products = [...service.getAll()];

  // Apply category filter
  if (state.category !== 'all') {
    products = products.filter((p) => p.category === state.category);
  }

  if (state.status !== 'all') {
    products = products.filter((p) => p.status === state.status);
  }

  // Apply search filter
  if (state.search.trim() !== '') {
    const q = state.search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }

  // Apply sort
  const [field, direction] = state.sort.split('-') as [keyof Product, 'asc' | 'desc'];

  products.sort((a, b) => {
    let valA = a[field];
    let valB = b[field];
    if (field == 'name') {
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
    }
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Render list and stats
  renderProductList(products, editingId);
  renderStats(service.getAll(), APP_CONFIG);
}

// =========================================================
// 5. Form submit — add product
// =========================================================

function handleFormSubmit(e: Event): void {
  e.preventDefault();

  // Read form inputs — typed as Omit<Product, 'id' | 'createdAt'>
  const data = getFormData();

  // Validate — returns ValidationResult<Omit<Product,...>>
  const result = validator.validate(data);

  // Show errors in UI (clears previous errors too)
  renderValidationErrors(result);

  // Stop if invalid
  if (!validator.isValid(result)) return;

  try {
    // Add product — @Validate and @Log decorators fire here
    service.addProduct(data);

    // Reset form and re-render
    resetForm();
    render();
  } catch (err) {
    // Decorator @Validate can also throw — catch it
    if (err instanceof Error) {
      console.error('Failed to add product:', err.message);
    }
  }
}

// =========================================================
// 6. Event delegation — product list actions
// =========================================================
//
// Instead of adding listeners to every button on every card,
// we add ONE listener to the container.
// We check e.target to find which button was clicked.
// This is called event delegation.
//
// Why: cards are dynamically added/removed — individual
// listeners would need to be added/removed with them.
// One delegated listener handles everything automatically.

async function handleProductListClick(e: MouseEvent): Promise<void> {
  const target = e.target as HTMLElement;

  // Get the product id from the button's data-id attribute
  const id = target.dataset['id'];
  if (!id) return;

  // ── Delete ──────────────────────────────────────────────
  if (target.classList.contains('btn-delete')) {
    const confirmed = confirm('Delete this product?');
    if (!confirmed) return;

    service.removeProduct(id);
    render();
    return;
  }

  // ── Edit ────────────────────────────────────────────────
  if (target.classList.contains('btn-edit')) {
    const product = service.getById(id);
    if (!product) return;

    // Populate form with product data for editing
    populateForm(product);
    render();
    return;
  }

  // ── Stock In ────────────────────────────────────────────
  if (target.classList.contains('btn-stock-in')) {
    const product = service.getById(id);
    if (!product) return;

    // renderStockModal returns Promise<number | null>
    const qty = await renderStockModal(product, 'in');
    if (qty === null) return; // cancelled

    try {
      service.moveStock(id, 'in', qty);
      render();
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    return;
  }

  // ── Stock Out ───────────────────────────────────────────
  if (target.classList.contains('btn-stock-out')) {
    const product = service.getById(id);
    if (!product) return;

    const qty = await renderStockModal(product, 'out');
    if (qty === null) return; // cancelled

    try {
      service.moveStock(id, 'out', qty);
      render();
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    }
    return;
  }
}

// =========================================================
// 7. Populate form for editing
// =========================================================
//
// Fills the form inputs with an existing product's values.
// Switches the submit button to "Update".

function populateForm(product: Product): void {
  editingId = product.id;

  // Type each input explicitly
  const nameEl = document.getElementById('name') as HTMLInputElement;
  const skuEl = document.getElementById('sku') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;
  const stockEl = document.getElementById('stock') as HTMLInputElement;
  const categoryEl = document.getElementById('category') as HTMLSelectElement;
  const statusEl = document.getElementById('status') as HTMLSelectElement;

  nameEl.value = product.name;
  skuEl.value = product.sku;
  priceEl.value = String(product.price);
  stockEl.value = String(product.stock);
  categoryEl.value = product.category;
  statusEl.value = product.status;

  // Change button label to signal edit mode
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  if (submitBtn) submitBtn.textContent = 'Update Product';

  // Scroll form into view
  document.getElementById('product-form')?.scrollIntoView({
    behavior: 'smooth',
  });
}

// =========================================================
// 8. Handle update (when form submitted in edit mode)
// =========================================================

function handleFormUpdate(e: Event): void {
  e.preventDefault();
  if (!editingId) return;

  const data = getFormData();
  const result = validator.validate(data);

  renderValidationErrors(result);
  if (!validator.isValid(result)) return;

  try {
    service.updateProduct(editingId, data);

    // Reset edit mode
    editingId = null;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    if (submitBtn) submitBtn.textContent = 'Add Product';

    resetForm();
    render();
  } catch (err) {
    if (err instanceof Error) {
      console.error('Failed to update product:', err.message);
    }
  }
}

// =========================================================
// 9. Controls — search, sort, filter
// =========================================================

function handleSearch(query: string): void {
  state.search = query;
  render();
}

function handleSort(e: Event): void {
  const select = e.target as HTMLSelectElement;
  state.sort = select.value as SortKey;
  render();
}

function handleCategoryFilter(e: Event): void {
  const select = e.target as HTMLSelectElement;
  state.category = select.value as Category | 'all';
  render();
}

function handleStatusFilter(e: Event): void {
  const select = e.target as HTMLSelectElement;
  state.status = select.value as ProductStatus | 'all';
  render();
}

// =========================================================
// 10. Wire up all event listeners
// =========================================================

function initEventListeners(): void {
  // Form submit — add or update depending on editingId
  const form = document.getElementById('product-form');
  form?.addEventListener('submit', (e: Event) => {
    if (editingId) {
      handleFormUpdate(e);
    } else {
      handleFormSubmit(e);
    }
  });

  // Product list — delegated click handler
  const list = document.getElementById('product-list');
  list?.addEventListener('click', (e: MouseEvent) => {
    handleProductListClick(e);
  });

  // Search — debounced so it doesn't fire on every keystroke
  const searchInput = document.getElementById('search') as HTMLInputElement;
  const debouncedSearch = debounce(handleSearch, 300);
  searchInput?.addEventListener('input', (e: Event) => {
    debouncedSearch((e.target as HTMLInputElement).value);
  });

  // Sort select
  const sortSelect = document.getElementById('sort');
  sortSelect?.addEventListener('change', handleSort);

  // Category filter
  const categorySelect = document.getElementById('filter-category');
  categorySelect?.addEventListener('change', handleCategoryFilter);

  // Category filter
  const statusSelect = document.getElementById('filter-status');
  statusSelect?.addEventListener('change', handleStatusFilter);
}

// =========================================================
// 11. init — called once when page loads
// =========================================================

function init(): void {
  initEventListeners(); // wire up all listeners
  render(); // initial render with data from localStorage
}

// Start the app
init();

/**
 * SUMMARY
 *
 * main.ts only:
 *   → creates instances (service, validator)
 *   → listens for events
 *   → calls service methods + render functions
 *
 * render()
 *   → single function that re-renders everything
 *   → reads from state object (search, sort, category)
 *   → called after every state change
 *
 * Event delegation
 *   → one listener on the container
 *   → checks e.target for which button was clicked
 *   → handles dynamic cards without memory leaks
 *
 * State object
 *   → { search, sort, category }
 *   → all filters live here
 *   → render() always reads from it
 *
 * SortKey split pattern:
 *   "price-asc".split('-') as [keyof Product, 'asc' | 'desc']
 *   → ['price', 'asc']
 *   → field = 'price', direction = 'asc'
 *
 * import type
 *   → Product, SortKey, Category, FormSchema
 *   → zero runtime cost — erased at compile time
 *
 * async/await in event handler
 *   → handleProductListClick is async
 *   → awaits renderStockModal (Promise<number | null>)
 *   → null = user cancelled modal
 *
 * Flow for every user action:
 *   user clicks / types
 *     → event handler fires
 *       → service method called (business logic)
 *         → render() called (UI updates)
 */
