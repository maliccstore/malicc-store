---
id: analytics-events
title: Analytics / Events
sidebar_label: Analytics / Events
---

# Analytics / Events

This section documents key analytics events emitted by the frontend.

These events help track user behavior, monitor system health, and analyze critical business flows such as product discovery, checkout, and payments.

---

# 🔄 Session Events

## SESSION_START

Triggered when a user session begins.

- **Idemptotent Tracking**: Uses `sessionStorage` to ensure it only fires once per browser session.
- Initializes analytics tracking and captures device/user context.

## SESSION_END

Triggered when a user session ends.

- **Reliable Delivery**: Uses `navigator.sendBeacon` (or `fetch` with `keepalive: true`) on the `pagehide` event to ensure the event is sent even as the page closes.
- Helps measure session duration and engagement.

---

# 🔍 Discovery Events

These events track how users find products in the store.

## PRODUCT_SEARCH
Triggered when a user performs a search.
- **Payload**: `{ searchQuery: string, resultCount: number }`

## PRODUCT_FILTER
Triggered when a user applies a filter to a product list.
- **Payload**: `{ appliedFilters: { category?: string, inStock?: boolean, minPrice?: number, maxPrice?: number } }`

## PRODUCT_SORT
Triggered when a user changes the sorting order.
- **Payload**: `{ sortField: string }`

---

# 🎟️ conversion & Promotion Events

## COUPON_APPLIED
Triggered when a coupon code is successfully validated and applied.
- **Payload**: `{ couponCode: string, discountAmount: number }`

## COUPON_FAILED
Triggered when a coupon code entry fails validation.
- **Payload**: `{ couponCode: string, errorMessage: string }`

---

# 🛒 Checkout & Payment Flow (Critical)

👉 This is the **most important flow** in the system.

## Order Flow Sequence

```text
SESSION_START
   ↓
PRODUCT_SEARCH / FILTER / SORT  <-- (Discovery Phase)
   ↓
PRODUCT_VIEWED
   ↓
CART_UPDATED (ADD_TO_CART / REMOVE_FROM_CART)
   ↓
COUPON_APPLIED / FAILED
   ↓
CHECKOUT_STARTED
   ↓
PAYMENT_INITIATED
   ↓
PAYMENT_SUCCESS / PAYMENT_FAILED
   ↓
ORDER_SUBMITTED (on success)
   ↓
SESSION_END
```

