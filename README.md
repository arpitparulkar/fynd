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


The tests use Playwright with Chromium. The test runner starts the development server automatically if it is not already running.
##Checkout risk test plan

1. Empty cart — highest priority: Confirm checkout is blocked and a clear message tells the customer to add an item.
2. Missing customer name — high priority: Confirm checkout is blocked, the name validation message appears, and the cart state is preserved.
3. Rapid duplicate submission — high priority: Confirm repeated clicks produce one confirmation and one order reference.
4. Quantity and price arithmetic: Confirm line totals and the order total update correctly when quantities change or items are removed.
5. Responsive and keyboard use: Check the narrow-screen layout, visible keyboard focus, and accessible control names.

##Automated test coverage

#The browser tests start each check from a clean page state and verify:
- A successful checkout displays a confirmation and order reference.
- Submitting with the required name field blank is blocked, shows a validation message, and displays no confirmation.
- Changing a quantity updates the visible quantity, line total, and exact order total.
#Manual results
- Empty cart: No defect found. Placing an order with no items shows “Add at least one item to place the order” and no confirmation appears.
- Rapid double-click: No defect found. The first submission creates one confirmation and disables the order action; a repeated click does not create another confirmation.
#Defects found
No defects found during the checks recorded above.

## Manual results

- **Empty cart:** No defects found. With no items, placing an order shows "Add at least one item to place the order." and no confirmation appears.
- **Double-clicking Place order:** No defects found. The first submission creates one confirmation and disables the order action; a repeated click cannot create another confirmation.
