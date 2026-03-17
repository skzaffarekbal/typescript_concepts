"use strict";
/**
 * =========================================================
 * 2. Union & Intersection Types
 * =========================================================
 */
/**
 * Union Type:
 * - Value can be ONE of multiple types
 */
let id;
id = 101;
id = 'ABC';
/**
 * -----------------------------------------
 * Union Narrowing
 * -----------------------------------------
 * - TypeScript needs to determine exact type
 */
function printId(id) {
    if (typeof id === 'string') {
        console.log(id.toUpperCase()); // string
    }
    else {
        console.log(id.toFixed()); // number
    }
}
let staffMember = {
    name: 'Zaffar',
    employeeId: 123,
};
/**
 * 🔥 Key Difference:
 *
 * Union (|)        -> OR
 * Intersection (&) -> AND
 */ 
