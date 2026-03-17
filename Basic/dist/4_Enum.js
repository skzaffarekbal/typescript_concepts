"use strict";
/**
 * =========================================================
 * 3. Enums
 * =========================================================
 */
/**
 * Numeric Enum (default)
 */
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
let move = Direction.Up;
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
