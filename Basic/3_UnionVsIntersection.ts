/**
 * =========================================================
 * 2. Union & Intersection Types
 * =========================================================
 */

/**
 * Union Type:
 * - Value can be ONE of multiple types
 */

let id: number | string;

id = 101;
id = 'ABC';

/**
 * -----------------------------------------
 * Union Narrowing
 * -----------------------------------------
 * - TypeScript needs to determine exact type
 */

function printId(id: number | string) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // string
  } else {
    console.log(id.toFixed()); // number
  }
}

/**
 * Methods for narrowing:
 * - typeof
 * - instanceof
 * - in operator
 * - custom type guards
 */

/**
 * -----------------------------------------
 * Intersection Type
 * -----------------------------------------
 * - Combine multiple types into ONE
 */

type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
};

type Staff = Person & Employee;

let staffMember: Staff = {
  name: 'Zaffar',
  employeeId: 123,
};

/**
 * 🔥 Key Difference:
 *
 * Union (|)        -> OR
 * Intersection (&) -> AND
 */