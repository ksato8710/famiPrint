import { test, expect } from '@playwright/test';

test.describe('CSS Application', () => {
  test('should apply global CSS styles to the body', async ({ page }) => {
    await page.goto('/');

    // Get the computed style of the body element
    const bodyBackgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Expect the background color to be the one defined in globals.css (which is #FFFBFE)
    // Note: Playwright might return RGB or RGBA values, so we need to convert or compare accordingly.
    // #FFFBFE in RGB is rgb(255, 251, 254)
    expect(bodyBackgroundColor).toBe('rgb(255, 251, 254)');
  });
});
