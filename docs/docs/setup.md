---
id: setup
title: Setup & Getting Started
sidebar_label: Setup
---

# Setup & Getting Started

This section helps developers set up the project locally and run the frontend.

## Installation

```bash
npm install
```

## Environment variables

Create a `.env.local` file in the project root with values needed for API and payment services.

Example:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_APP_NAME=MaliccStore
```

### Common env keys

- `NEXT_PUBLIC_API_URL` — backend API root
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `NEXT_PUBLIC_APP_NAME` — application title metadata

## Running frontend

Start the app in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

Run the docs build locally:

```bash
npm run build:dev
```

This repository is designed to be runnable quickly while keeping the docs and API reference fully up to date.
