"use strict";
/**
 * =========================================================
 * 11. Enums
 * =========================================================
 */
/**
 * Numeric Enum (default)
 */
console.info('%c11. Enum', 'color: yellow; font-weight: bold; font-size: 18px');
var Directions;
(function (Directions) {
    Directions[Directions["Up"] = 0] = "Up";
    Directions[Directions["Down"] = 1] = "Down";
    Directions[Directions["Left"] = 2] = "Left";
    Directions[Directions["Right"] = 3] = "Right";
})(Directions || (Directions = {}));
let move = Directions.Up;
/**
 * Custom numeric values
 */
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["Success"] = 200] = "Success";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
})(StatusCode || (StatusCode = {}));
/**
 * -----------------------------------------
 * String Enum
 * -----------------------------------------
 */
var Role;
(function (Role) {
    Role["Admin"] = "ADMIN";
    Role["User"] = "USER";
    Role["Guest"] = "GUEST";
})(Role || (Role = {}));
let userRole = Role.Admin;
let color = 0 /* Colors.Red */;
/**
 * 🔥 Key Points:
 *
 * Numeric Enum -> auto numbers
 * String Enum  -> readable values
 * Const Enum   -> optimized (no runtime code)
 */ 
