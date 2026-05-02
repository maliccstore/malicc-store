# Malicc Store Documentation

This is the developer documentation site for the Malicc Store frontend, built with [Docusaurus](https://docusaurus.io/).

It contains both manual documentation (guides, architecture) and an auto-generated **API Reference** powered by TypeDoc.

## 📂 Project Structure

- `docs/` — Manual guides and documentation (Markdown files).
  - `docs/api/` — Destination for auto-generated API metadata.
- `blog/` — Release notes and developer blog posts.
- `src/` — React components for the Docusaurus landing page and custom themes.
- `static/` — Static assets (images, logos, etc.).
- `docusaurus.config.ts` — Main configuration for the documentation site.
- `tsconfig.typedoc.json` — Specific TypeScript config used for API reference generation.

## 🚀 Getting Started

### Installation

```bash
cd docs
npm install
```

### Local Development

```bash
npm start
```

By default, the documentation will be available at [http://localhost:3000](http://localhost:3000).

### 📖 API Reference Generation

The API reference is automatically generated from the source code in `@/services`, `@/store`, `@/utils`, and `@/types`. This happens automatically during `npm start` and `npm run build`.

To manually verify the TypeScript configuration for the docs:

```bash
npm run typecheck
```

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

The static files will be generated in the `build/` directory.

### Deployment

To deploy to GitHub Pages (or similar):

```bash
# Using SSH
USE_SSH=true npm run deploy

# Not using SSH
GIT_USER=<Your GitHub username> npm run deploy
```

---

*Built with ❤️ for the Malicc Store Frontend Team.*
