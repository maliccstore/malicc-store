---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

# Best Practices

This section captures senior-level conventions for building and maintaining the frontend.

## Folder structure

- `src/components` — UI components and shared layouts
- `src/services` — API clients and business logic
- `src/store` — Redux slices, thunks, and hooks
- `src/types` — TypeScript interfaces and type aliases
- `docs` — developer documentation and generated API docs

## Naming conventions

- use `camelCase` for variables and functions
- use `PascalCase` for components and React elements
- name thunks with `fetch`, `create`, `update`, `delete` for clarity
- keep service methods descriptive, like `getProductById` or `createPaymentOrder`

## Type safety rules

- define explicit return types for service functions
- prefer typed payloads and request objects
- avoid `any` in shared type definitions
- use interface names that describe shape and purpose

Following these guidelines makes the codebase easier to read and safer to extend.
