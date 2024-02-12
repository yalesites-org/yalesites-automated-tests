import { test, expect } from "@playwright/test";

test.describe('Accordion', () => {
    test('should open and close', async ({ page }) => {
        const accordionButtons = await page.$$('.accordion-item__toggle');

        accordionButtons.forEach(async (item) => {
            await item.click();
            expect(await item.getAttribute('aria-expanded')).toBe('true');
        });

        accordionButtons.forEach(async (item) => {
            await item.click();
            expect(await item.getAttribute('aria-expanded')).toBe('false');
        });
    })
});
