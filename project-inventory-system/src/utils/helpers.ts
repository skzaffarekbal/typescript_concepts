// =========================================================
// src/utils/helpers.ts
// =========================================================
//
// Plain TypeScript utility functions.
// These are the actual implementations — real working code.
//
// In a real project these might be a third-party JS library
// with no types. We write the .d.ts file manually to practice
// the declaration file syntax.
// =========================================================

// -------------------------------------------------------
// generateId
// -------------------------------------------------------
// Returns a unique string id
// Combines timestamp + random string to avoid collisions

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Example output: "1719234567890-k3x9z"

// -------------------------------------------------------
// formatCurrency
// -------------------------------------------------------
// Formats a number as a currency string
// symbol defaults to ₹ for Indian Rupee

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// formatCurrency(1500)        → "₹1,500.00"
// formatCurrency(1500, '$')   → "$1,500.00"

// -------------------------------------------------------
// formatDate
// -------------------------------------------------------
// Returns a human-readable date string

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// formatDate(new Date()) → "22 Jan 2025"

// -------------------------------------------------------
// truncate
// -------------------------------------------------------
// Shortens a string and adds "..." if too long
// Useful for product names in table rows

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

// truncate("Mechanical Keyboard RGB", 15) → "Mechanical Key..."
// truncate("Keyboard", 15)               → "Keyboard"

// -------------------------------------------------------
// capitalize
// -------------------------------------------------------
// Capitalizes the first letter of a string

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// capitalize("electronics") → "Electronics"
// capitalize("TOOLS")       → "Tools"

// -------------------------------------------------------
// clamp
// -------------------------------------------------------
// Keeps a number within a min/max range
// Useful for stock quantities and price inputs

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// clamp(150, 0, 100) → 100
// clamp(-5,  0, 100) → 0
// clamp(50,  0, 100) → 50

// -------------------------------------------------------
// debounce
// -------------------------------------------------------
// Delays a function call until after a wait period
// Useful for search input — don't fire on every keystroke

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// const debouncedSearch = debounce(searchProducts, 300);
// input.addEventListener('input', e => debouncedSearch(e.target.value));

// -------------------------------------------------------
// groupBy
// -------------------------------------------------------
// Groups an array of objects by a key
// Returns Record<string, T[]>

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce(
    (groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    },
    {} as Record<string, T[]>,
  );
}

// groupBy(products, 'category')
// → {
//     electronics: [Product, Product],
//     clothing:    [Product],
//     tools:       [Product, Product, Product],
//   }
