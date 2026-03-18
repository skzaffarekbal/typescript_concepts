"use strict";
/**
 * =========================================================
 * 12. Interfaces
 * =========================================================
 */
/**
 * Basic Interface
 */
console.info('%c12. Interfaces', 'color: yellow; font-weight: bold; font-size: 18px');
let userA = {
    name: 'Zaffar',
    age: 22,
};
let emp = {
    personName: 'Zaffar',
    employeeId: 123,
};
let myCar = {
    brand: 'Toyota',
    model: 'Fortuner',
};
const userB = { name: "Zaffar" };
// Without optional chaining ❌ — runtime crash if address is undefined
// console.log(userB.address.city);
// With optional chaining ✅ — returns undefined safely
console.log(userB.address?.city); // undefined (no crash)
console.log(userB.address?.zip); // undefined
// TypeScript knows the type is: string | undefined
const city = userB.address?.city;
// type of `city` → string | undefined
// Works with methods too
const upper = userB.address?.city?.toUpperCase(); // string | undefined
