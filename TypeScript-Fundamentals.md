# TypeScript Fundamentals

## 1. What is TypeScript

**TypeScript** is a **strongly typed superset of JavaScript** developed
by Microsoft.

It adds **static typing and developer tooling** on top of JavaScript.

TypeScript code is compiled into **plain JavaScript**, which runs in any
browser or Node.js environment.

### Key Characteristics

-   Superset of JavaScript
-   Adds static typing
-   Improves code maintainability
-   Provides better tooling (IDE support)
-   Compiles to JavaScript

### Example

JavaScript:

``` javascript
function add(a, b) {
  return a + b;
}
```

TypeScript:

``` ts
function add(a: number, b: number): number {
  return a + b;
}
```

Here TypeScript ensures **both parameters must be numbers**.

------------------------------------------------------------------------

# 2. Why TypeScript vs JavaScript

TypeScript solves many issues that appear in large JavaScript
applications.

## Advantages

### 1. Static Type Checking

Errors are detected **during development** instead of runtime.

``` ts
let age: number = 25
age = "twenty five" // Error
```

------------------------------------------------------------------------

### 2. Better IDE Support

Modern editors like Visual Studio Code provide:

-   Autocomplete
-   Type hints
-   Refactoring tools
-   Error detection

------------------------------------------------------------------------

### 3. Improved Code Maintainability

Large applications become easier to manage.

``` ts
type User = {
  id: number
  name: string
}
```

------------------------------------------------------------------------

### 4. Safer Refactoring

Changing code becomes safer because types catch breaking changes.

------------------------------------------------------------------------

### 5. Self-Documenting Code

Types describe the structure of data.

``` ts
function createUser(name: string, age: number) {}
```

Developers immediately understand what parameters are required.

------------------------------------------------------------------------

# 3. Installing TypeScript

TypeScript is installed using **Node Package Manager** from Node.js.

## Global Installation

``` bash
npm install -g typescript
```

Check installation:

``` bash
tsc --version
```

------------------------------------------------------------------------

## Project Installation (Recommended)

``` bash
npm install typescript --save-dev
```

Initialize TypeScript configuration:

``` bash
npx tsc --init
```

This creates the **tsconfig.json** file.

------------------------------------------------------------------------

# 4. TypeScript Compiler (tsc)

The **TypeScript compiler (`tsc`)** converts `.ts` files into `.js`
files.

## Example

Create file:

    app.ts

Code:

``` ts
let message: string = "Hello TypeScript"
console.log(message)
```

Compile:

``` bash
tsc app.ts
```

Output generated:

    app.js

Generated JavaScript:

``` javascript
var message = "Hello TypeScript";
console.log(message);
```

------------------------------------------------------------------------

# 5. tsconfig.json

`tsconfig.json` is the **configuration file for the TypeScript
compiler**.

It defines how TypeScript should compile the project.

### Example

``` json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "strict": true,
    "outDir": "./dist"
  }
}
```

### Important Options

  Option   Purpose
  -------- ----------------------------------
  target   JavaScript version to compile to
  module   Module system
  strict   Enables strict type checking
  outDir   Output folder

------------------------------------------------------------------------

# 6. Compiling TypeScript to JavaScript

There are multiple ways to compile TypeScript.

## Compile Single File

``` bash
tsc app.ts
```

------------------------------------------------------------------------

## Compile Entire Project

``` bash
tsc
```

Uses **tsconfig.json** settings.

------------------------------------------------------------------------

## Watch Mode

Automatically compiles when files change.

``` bash
tsc --watch
```

------------------------------------------------------------------------

# 7. TypeScript Project Structure

A typical TypeScript project structure looks like this:

    project
    │
    ├── src
    │   ├── index.ts
    │   ├── utils.ts
    │
    ├── dist
    │   ├── index.js
    │
    ├── package.json
    ├── tsconfig.json

### Explanation

  Folder          Purpose
  --------------- ---------------------------
  src             Source TypeScript files
  dist            Compiled JavaScript files
  tsconfig.json   Compiler configuration
  package.json    Project dependencies

------------------------------------------------------------------------

# Summary

TypeScript fundamentals include:

-   Understanding TypeScript as a **typed superset of JavaScript**
-   Installing TypeScript
-   Using the **TypeScript compiler**
-   Configuring projects using **tsconfig.json**
-   Compiling `.ts` files to `.js`
-   Structuring TypeScript projects properly

These fundamentals provide the **foundation for learning advanced
TypeScript features** like generics, utility types, and advanced typing.
