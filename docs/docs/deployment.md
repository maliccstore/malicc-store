---
id: deployment
title: Deployment
sidebar_label: Deployment
---

# Deployment

This section covers build commands and environment configuration for production.

## Build commands

- `npm run build` — build the frontend application
- `npm run start` — start the production server
- `npm run build:dev` — build the documentation site

## Environment configuration

Make sure production environment variables are set correctly before deployment.

### Example variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_APP_NAME=MaliccStore
```

## Deployment notes

- Ensure `NEXT_PUBLIC_API_URL` points to your backend API.
- Use secure Razorpay keys in production.
- Verify documentation with `npm run build:dev` after config changes.
