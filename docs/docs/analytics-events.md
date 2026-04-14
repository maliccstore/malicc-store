---
id: analytics-events
title: Analytics / Events
sidebar_label: Analytics / Events
---

# Analytics / Events

This section documents key analytics events emitted by the frontend.

These events help track user behavior, monitor system health, and analyze critical business flows such as checkout and payments.

---

# 🔄 Session Events

## SESSION_START

Triggered when a user session begins.

- fired on app load or user entry
- initializes analytics tracking
- captures device, location, and user context (if available)

## SESSION_END

Triggered when a user session ends.

- fired on logout, tab close, or inactivity timeout
- helps measure session duration
- useful for retention and engagement metrics

---

# 🛒 Checkout & Payment Flow (Critical)

👉 This is the **most important flow** in the system.

## Order Flow Sequence

```text
SESSION_START
   ↓
PRODUCT_VIEWED
   ↓
CART_UPDATED
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
