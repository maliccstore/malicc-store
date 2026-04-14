---
id: architecture
title: Architecture
sidebar_label: Architecture
---

# Architecture

The application is built as a frontend-first e-commerce experience with a strong separation between UI, state, and backend API interaction.

## Pages

The main UI pages include:

- **Home**: featured products and navigation
- **Product listing**: category and product search
- **Product detail**: product information and add-to-cart
- **Cart**: current cart contents and subtotal
- **Checkout**: shipping, payment, and order review
- **Orders**: order history and status

## Diagram

```
[ Browser ]
     |
     v
[ UI Components ]
     |
     v
[ Redux Store ] <---> [ Services / API Clients ]
     |
     v
[ Payment / Order Flow ]
```

## Flow explanation

1. **User interaction** triggers UI events in components.
2. Components dispatch **Redux actions** or call **services**.
3. **Services** handle API requests, transform payloads, and return typed responses.
4. **Redux slices** store normalized state for products, cart, checkout, and user data.
5. The UI renders from the current store state and updates reactively.

### Frontend architecture layers

- **Presentation**: `src/components`, `src/app` pages, and layout elements.
- **State**: `src/store` slices, thunks, and typed hooks.
- **Domain**: `src/services` and business logic.
- **Types**: `src/types` and shared interface definitions.

This architecture keeps the storefront easy to extend while preserving reliable developer documentation.
