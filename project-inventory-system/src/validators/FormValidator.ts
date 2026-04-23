// =========================================================
// src/validators/FormValidator.ts
// =========================================================
//
// A generic validator that works for ANY form.
// Not just products — pass any type T and a schema for it.
//
// Covers:
// - Mapped types       → FormSchema<T>, ValidationResult<T>
// - Conditional types  → HasErrors<T>
// - Template literals  → error messages
// - Generics           → FormValidator<T>
// =========================================================

// =========================================================
// Step 1 — FieldRule<V>
// =========================================================
//
// Describes the validation rules for ONE field.
// V is the value type of that field.
//
// e.g. for Product.name  → V = string
//      for Product.price → V = number
//      for Product.stock → V = number
type FieldRule<V> = {
  required?: boolean;
  minLength?: V extends string ? number : never;
  maxLength?: V extends string ? number : never;
  min?: V extends number ? number : never;
  max?: V extends number ? number : never;
  pattern?: V extends string ? RegExp : never;
  message?: string; // custom error message — overrides default
};

// minLength and maxLength only exist when V is string
// min and max only exist when V is number
// pattern only exists when V is string
//
// If you try to set minLength on a number field:
// ❌ TypeScript error — minLength does not exist on FieldRule<number>

// =========================================================
// Step 2 — FormSchema<T>
// =========================================================
//
// A MAPPED TYPE — loops over every key of T
// and maps it to an optional FieldRule for that field's type.
//
// { [K in keyof T]?: FieldRule<T[K]> }
//
// For Product this becomes:
// {
//   id?:        FieldRule<string>
//   name?:      FieldRule<string>
//   sku?:       FieldRule<string>
//   price?:     FieldRule<number>
//   stock?:     FieldRule<number>
//   category?:  FieldRule<Category>
//   status?:    FieldRule<ProductStatus>
//   createdAt?: FieldRule<Date>
// }
//
// Every field is optional (?) because you don't have to
// validate every field — only the ones you care about.

type FormSchema<T> = {
  [K in keyof T]?: FieldRule<T[K]>;
};

// =========================================================
// Step 3 — ValidationResult<T>
// =========================================================
//
// Another MAPPED TYPE — loops over every key of T
// and maps it to string | null
//
// string → there is an error message for this field
// null   → this field passed validation (no error)
//
// For Product this becomes:
// {
//   id:        string | null
//   name:      string | null
//   sku:       string | null
//   price:     string | null
//   stock:     string | null
//   category:  string | null
//   status:    string | null
//   createdAt: string | null
// }

type ValidationResult<T> = {
  [K in keyof T]: string | null;
};

// =========================================================
// Step 4 — HasErrors<T>
// =========================================================
//
// A CONDITIONAL TYPE — checks if any field has an error.
//
// T[keyof T] extracts all VALUE types from T as a union.
//
// For ValidationResult<Product>:
//   T[keyof T] = string | null
//
// If the union includes string → there are errors → true
// If the union is only null   → no errors        → false

type HasErrors<T> = string extends T[keyof T] ? true : false;

// Usage:
// type R = ValidationResult<Product>
// type Check = HasErrors<R>  → true if any field has a string error

// =========================================================
// Step 5 — Default error messages using template literals
// =========================================================
//
// These are TEMPLATE LITERAL TYPES used as runtime strings.
// The field name is inserted automatically.

function requiredMessage(field: string): string {
  return `${field} is required`;
  // "name is required"
  // "sku is required"
}

function minLengthMessage(field: string, min: number): string {
  return `${field} must be at least ${min} characters`;
  // "name must be at least 2 characters"
}

function maxLengthMessage(field: string, max: number): string {
  return `${field} must be no more than ${max} characters`;
}

function minMessage(field: string, min: number): string {
  return `${field} must be at least ${min}`;
  // "price must be at least 1"
}

function maxMessage(field: string, max: number): string {
  return `${field} must be no more than ${max}`;
}

function patternMessage(field: string): string {
  return `${field} format is invalid`;
}

// =========================================================
// Step 6 — FormValidator<T> class
// =========================================================
// =========================================================
// Step 6 — FormValidator<T> class
// =========================================================

export class FormValidator<T> {
  // schema describes which fields to validate and how
  constructor(private schema: FormSchema<T>) {}

  // -------------------------------------------------------
  // validate
  // -------------------------------------------------------
  // Takes Partial<T> because the form might be incomplete
  // Returns ValidationResult<T> — every key mapped to error or null

  validate(data: Partial<T>): ValidationResult<T> {
    // Start with all fields as null (no errors)
    const result = {} as ValidationResult<T>;

    // Loop over every key defined in the schema
    for (const key in this.schema) {
      const field = key as keyof T;
      const rule = this.schema[field] as FieldRule<any>;
      const value = data[field];

      // Default: no error
      result[field] = null;

      // Skip if no rule defined for this field
      if (!rule) continue;

      // --- required check ---
      if (rule.required) {
        const isEmpty =
          value === null ||
          value === undefined ||
          Number.isNaN(value) ||
          (typeof value === 'string' && value.trim() === '');

        if (isEmpty) {
          result[field] = rule.message ?? requiredMessage(key);
          continue; // skip other checks if required fails
        }
      }

      // Skip remaining checks if value is empty and not required
      if (value === null || value === undefined) continue;

      // --- minLength check (strings only) ---
      if (rule.minLength !== undefined && typeof value === 'string') {
        if (value.length < rule.minLength) {
          result[field] = rule.message ?? minLengthMessage(key, rule.minLength);
          continue;
        }
      }

      // --- maxLength check (strings only) ---
      if (rule.maxLength !== undefined && typeof value === 'string') {
        if (value.length > rule.maxLength) {
          result[field] = rule.message ?? maxLengthMessage(key, rule.maxLength);
          continue;
        }
      }

      // --- min check (numbers only) ---
      if (rule.min !== undefined && typeof value === 'number') {
        if (value < rule.min) {
          result[field] = rule.message ?? minMessage(key, rule.min);
          continue;
        }
      }

      // --- max check (numbers only) ---
      if (rule.max !== undefined && typeof value === 'number') {
        if (value > rule.max) {
          result[field] = rule.message ?? maxMessage(key, rule.max);
          continue;
        }
      }

      // --- pattern check (strings only) ---
      if (rule.pattern !== undefined && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          result[field] = rule.message ?? patternMessage(key);
          continue;
        }
      }
    }

    return result;
  }

  // -------------------------------------------------------
  // isValid
  // -------------------------------------------------------
  // Returns true if NO field has an error (all null)
  // Uses Object.values to check every value in the result

  isValid(result: ValidationResult<T>): boolean {
    return Object.values(result).every((error) => error === null);
  }

  // -------------------------------------------------------
  // getErrors
  // -------------------------------------------------------
  // Returns only the fields that have errors
  // Useful for displaying a summary of what went wrong

  getErrors(result: ValidationResult<T>): Partial<ValidationResult<T>> {
    const errors: Partial<ValidationResult<T>> = {};

    for (const key in result) {
      if (result[key as keyof T] !== null) {
        errors[key as keyof T] = result[key as keyof T];
      }
    }

    return errors;
  }
}

export type { FormSchema, ValidationResult, HasErrors, FieldRule };
