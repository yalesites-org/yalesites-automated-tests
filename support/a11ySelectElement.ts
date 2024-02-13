import { expect, type Page, type ElementHandle } from "@playwright/test";

export type InputType = "mouse" | "keyboard";

export const selectElement = async (
  page: Page,
  element: ElementHandle,
  inputType: InputType,
): Promise<void> => {
  expect(inputType).toMatch(/mouse|keyboard/);

  switch (inputType) {
    case "mouse":
      await element?.click();
      break;
    case "keyboard":
      await element?.focus();
      await page.keyboard.press("Enter");
      break;
  }
};

