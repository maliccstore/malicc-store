---
id: state-management
title: State Management
sidebar_label: State Management
---

# State Management

This repository uses Redux for centralized state management and predictable data flow.

## Store structure

The store is organized into logical slices and services:

- `src/store/slices` — individual slice state and reducers
- `src/store/service` — API service integration for health checks and backend state
- `src/store/hooks.ts` — typed hooks for dispatch and state selection
- `src/store/index.ts` — store creation and middleware wiring

### Common slices

- `authSlice` — authentication and user session state
- `cartSlice` — cart contents and totals
- `checkoutSlice` — checkout progress and errors
- `orderSlice` — order history and current order state
- `productSlice` — product list and filters

## Data flow

1. A UI component dispatches an action or thunk.
2. The thunk calls a service or API client.
3. The service returns typed data.
4. The slice reducer updates the store.
5. Components re-render from the updated state.

This flow keeps UI side effects decoupled from business logic and improves testability.
