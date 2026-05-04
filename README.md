# TypeScript Concepts

A curated TypeScript learning repository covering fundamental, intermediate, and advanced concepts plus a practical inventory system project.

## 📚 What’s Included

- `Basic/` — Beginner-friendly TypeScript topics and core syntax.
- `Intermediate/` — Object-oriented patterns, utility types, generics, modules, and namespaces.
- `Advanced/` — Deep dives into conditional types, mapped types, template literal types, `infer`, decorators, and declaration files.
- `project-inventory-system/` — A real-world inventory management demo written in TypeScript, including services, store management, UI rendering, and validation.
- `TypeScript-Fundamentals.md` — A high-level guide to the TypeScript ecosystem and compiler workflow.
- `typescript-interview-questions.md` — A set of interview-ready TypeScript questions and answers from basic to advanced.

## 📂 Repository Structure

### Basic
Foundational TypeScript examples:
- `1_basicType.ts` — Core primitive types.
- `2_literalType_typeAliases.ts` — Literal types and aliases.
- `3_UnionVsIntersection.ts` — Union and intersection type differences.
- `4_Enum.ts` — Enum usage.
- `5_InterfacevsType.ts` — Interfaces versus type aliases.
- `6_Function.ts` — Function typing and return types.
- `7_Type_Narrowing.ts` — Type narrowing techniques.

### Intermediate
Key intermediate concepts:
- `1_Classes.ts` — Class-based design and inheritance.
- `2_UtilityTypes.ts` — Built-in utility types like `Partial`, `Pick`, `Omit`, and more.
- `3_Generics.ts` — Generic functions and reusable type patterns.
- `module&namespace.md` — Modules, namespaces, and organization strategies.

### Advanced
Advanced TypeScript type system features:
- `1_ConditionalTypes.ts` — Conditional types and type branching.
- `2_MappedTypes.ts` — Mapped types and property transformations.
- `3_TemplateLiteralTypes.ts` — Template literal types for type-level string composition.
- `4_InferTypes.ts` — `infer` keyword and type inference within conditional types.
- `5_DeclarationFile.md` — Writing declaration files for external modules.
- `6_Decorators.ts` — Decorators and metadata-driven patterns.

### Project Inventory System
A complete demo project built with TypeScript:
- `package.json` — Project dependencies and scripts.
- `tsconfig.json` — Compiler configuration.
- `src/main.ts` — Application entry point.
- `src/services/ProductService.ts` — Product business logic.
- `src/store/Store.ts` — Application state management.
- `src/types/index.ts` — Shared type definitions.
- `src/ui/render.ts` — Rendering the UI.
- `src/utils/helpers.ts` + `helpers.d.ts` — Utility functions with type declarations.
- `src/validators/FormValidator.ts` — Form validation logic.
- `styles.css` and `index.html` — Simple front-end layout and styling.

## 🚀 Getting Started

1. Install dependencies for the inventory project:
   ```bash
   cd project-inventory-system
   npm install
   ```

2. Run the project or compile TypeScript as needed:
   ```bash
   npm run build
   ```

3. Open `project-inventory-system/index.html` in a browser to view the demo.

## 💡 Learning Path

- Start with `Basic/` to build a strong TypeScript foundation.
- Move to `Intermediate/` once you are comfortable with classes and generic patterns.
- Explore `Advanced/` for powerful type system techniques and real-world type composition.
- Use the `project-inventory-system/` folder to see TypeScript applied in a small application.

## ✨ Notes

- This repository is ideal for TypeScript learners, interview preparation, and practical type-system exploration.
- The markdown guides included here are useful reference material for TypeScript fundamentals and interview questions.

---

Happy learning! 🎓
