// Product Status
export const PRODUCT_STATUS = ['active', 'inactive', 'out-of-stock'] as const;
export type ProductStatus = (typeof PRODUCT_STATUS)[number];

// Categories
export const CATEGORIES = ['electronics', 'clothing', 'food', 'tools'] as const;
export type Category = (typeof CATEGORIES)[number];

// product interface
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: Category;
  status: ProductStatus;
  createdAt: Date;
}

// Sort key using template literals
export type SortDirection = 'asc' | 'desc';
export type SortField = 'name' | 'price' | 'stock';
export type SortKey = `${SortField}-${SortDirection}`;
// "price-asc" | "price-desc" | "name-asc" | "name-desc" | "stock-asc" | "stock-desc"

// StockMovement interface
export interface StockMovement {
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: Date;
}

// App config — immutable
export type AppConfig = Readonly<{
  lowStockThreshold: number;
  currency: string;
  maxProducts: number;
}>;

export const APP_CONFIG: AppConfig = {
  lowStockThreshold: 5,
  currency: '₹',
  maxProducts: 100,
};
