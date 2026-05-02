---
id: features
title: Features Documentation
sidebar_label: Features
---

# Features Documentation

This section describes the main frontend business logic for Malicc Store.

## Product system

- Products are loaded through `src/services/product.service.ts`.
- The UI supports category browsing, filtering, and search.
- Product details include pricing, stock, and add-to-cart actions.

## Cart

- The cart is managed in Redux with `cartSlice` and persistence middleware.
- Users can add, remove, and update quantities.
- Cart totals are calculated from the current state and displayed in the cart page.

## Checkout

- The checkout flow gathers shipping, billing, and payment information.
- Validation and error handling are handled in the checkout slice.
- The checkout page is the gateway to payment and order submission.

## Payment

- Payment requests are orchestrated from `src/services/payment.service.ts`.
- Payment order creation and verification are separated from the frontend UI.
- The frontend tracks payment status and displays confirmation messages.

## Orders

- Order management is exposed through `src/services/orderAPI.ts` and `orderSlice`.
- The order flow includes order submission, status updates, and history lookup.
- Admin-facing order routes are available in the service and API reference.
