import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('successful checkout shows one confirmation and order reference', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Everyday Tote to order' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Jamie Lee');
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByRole('heading', { name: 'Thank you, Jamie Lee.' })).toBeVisible();
  await expect(page.getByText(/FG-\d{5}/)).toBeVisible();
  await expect(page.locator('.confirmation')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Order placed' })).toBeDisabled();
});

test('missing required name blocks checkout without confirmation', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Desk Notebook to order' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('');
  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByRole('alert')).toContainText('Enter your full name');
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeFocused();
  await expect(page.locator('.confirmation')).toHaveCount(0);
});

test('quantity updates exact visible line and order totals', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Everyday Tote to order' }).click();
  await page.getByRole('button', { name: 'Increase Everyday Tote quantity' }).click();

  await expect(page.getByLabel('2 Everyday Tote in cart')).toBeVisible();
  await expect(page.locator('.cart-row').getByText('$48.00')).toBeVisible();
  await expect(page.locator('.summary-total')).toContainText('$48.00');
});
