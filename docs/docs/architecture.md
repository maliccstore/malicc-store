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

## 📊 Real-Time Analytics

The store features a robust real-time analytics system designed for low-latency feedback on the Admin Dashboard.

### Core Components

1.  **Event Tracker (`AnalyticsTracker.tsx`)**: A top-level component that manages the session lifecycle and handles event deduplication.
2.  **Service Layer**:
    -   `trackEvent`: Sends mutations for search, filter, sort, and checkout events.
    -   `subscribeToLiveAnalytics`: Establishes a GraphQL WS subscription for real-time metrics (`activeSessions`, `todayVisitors`, etc.).
3.  **Session Logic**:
    -   **Idempotent Sessions**: Uses `sessionStorage` keys (e.g., `session_start_sent_<id>`) to ensure unique visitor counts.
    -   **Beacon Persistence**: Leverages `navigator.sendBeacon` to reliably signal `SESSION_END` when the user navigates away or closes the tab.

### Data Flow for Live Stats

1.  Backend `EventProcessor` detects session changes.
2.  Subscription triggers a push to the frontend.
3.  `AnalyticsTracker` receives the update and dispatches to `dashboardSlice`.
4.  Admin Dashboard UI re-renders with live visitor counts.

This architecture ensures the storefront remains performant while providing actionable insights.

