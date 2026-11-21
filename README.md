# FIELD / GOODS checkout

A small single-page React checkout demonstration. It uses local cart state only; no payment or backend is involved.

## Requirements

- Node.js 20 or newer
- npm

## Install

```bash
npm install
npx playwright install chromium
```

## Start the site

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

## Browser tests

```bash
npm test
```

The tests use Playwright Chromium and start the webpack development server automatically if it is not already running.

## Checkout risk test plan

1. **Submission with an empty cart** — highest priority: ensure checkout is blocked and a clear action is shown.
2. **Missing customer name** — high priority: ensure validation is visible, associated with the field, and the name state is preserved.
3. **Rapid duplicate submission** — high priority: ensure a single confirmation and one order reference are produced.
4. **Quantity and price arithmetic** — verify cents-based totals after add, increase, decrease, and remove actions.
5. **Responsive and keyboard use** — verify narrow-screen layout, visible focus, and accessible control names.

## Manual results

- **Empty cart:** No defects found. With no items, placing an order shows "Add at least one item to place the order." and no confirmation appears.
- **Double-clicking Place order:** No defects found. The first submission creates one confirmation and disables the order action; a repeated click cannot create another confirmation.
