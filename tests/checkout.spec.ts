import { test, expect } from '@playwright/test';

/**
 * Shira Maman.
 * Question 5
 * Base page: https://sandbox.grow.link/6f340bc4d18a0bcb559914d970ac2870-MTE4NjI
 */

const routes = {
	root: 'https://sandbox.grow.link/6f340bc4d18a0bcb559914d970ac2870-MTE4NjI'
};

const labels = {
	selectedCounterPattern: /נבחרו\s+\d+\s+פריטים/,
	continueButton: 'המשך',
	continueButtonPayment: 'המשך לשלב הבא וביצוע תשלום מאובטח',
	totalTitle: 'סה״כ לתשלום'
};

// A. Happy path: select item(s) then proceed to payment
test.describe('Checkout - Happy Path', () => {
	test('selects an Food item and shows payment options after continue and make the final payment', async ({ page }) => {
		await page.goto(routes.root);

		// Ensure page loaded (look for page title and totals area)
		await expect(page.getByRole('heading', { name: /דבי בדיקה/ })).toBeVisible();
		await expect(page.getByText(labels.totalTitle)).toBeVisible();

		const selectedCounter = page.getByText(labels.selectedCounterPattern);
		await expect(selectedCounter).toHaveText(/נבחרו\s+0\s+פריטים/);

		await page.getByRole('heading', { name: 'חומוס' }).click();
		await page.getByRole('button', { name: 'להוספת כמות למוצר חומוס' }).click();

		// Counter should update to > 0
		await expect(selectedCounter).not.toHaveText(/נבחרו\s+0\s+פריטים/);
        await page.getByRole('button', { name: labels.continueButton }).click();

		// Fill required fields
		await page.getByRole('textbox', { name: /שם מלא/ }).fill('בדיקה אוטומטית');
		await page.getByRole('textbox', { name: /טלפון נייד/ }).fill('0551111111');
		await page.getByRole('textbox', { name: /^כתובת\s*$/ }).fill('רחוב תל אביב');
		await page.getByRole('button', { name: /מתי להתחיל להכין את ההזמנה/ }).click();
		await page.getByText('מיד', { exact: true }).click();
		const picklesYes = page.locator('[id="2934_3447"]');
		await picklesYes.check();
		await expect(picklesYes).toBeChecked();
		const chipsYes = page.locator('[id="2935_3449"]');
		await chipsYes.check();
		await expect(chipsYes).toBeChecked();
		await page.getByRole('button', { name: /נא להזין משלוח/ }).click();
		await page.getByText('איסוף', { exact: true }).click();
		await page.locator('label[for="termsCheckbox"]').click();
		await expect(page.locator('#termsCheckbox')).toBeChecked();

		await page.getByRole('button', { name: labels.continueButtonPayment }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('button', { name: /לתשלום בכרטיס אשראי|לתשלום באשראי/ }).click();
		await page.waitForTimeout(5000);

		// Card details
		const frameLocator = page.frameLocator('#Gr0W8-credit-iframe');
		const cardNumberInput = frameLocator.locator('#card-number');
		await expect(cardNumberInput).toBeVisible({ timeout: 10000 });
		await cardNumberInput.fill('4580458045804580');

		const monthSelect = frameLocator.locator('#expMonth'); 
        await expect(monthSelect).toBeVisible();
        await monthSelect.selectOption('03'); 
 
        const yearSelect = frameLocator.locator('#expYear');
        await expect(yearSelect).toBeVisible();
        await yearSelect.selectOption('30'); 

        const cvvInput = frameLocator.locator('#cvv');
        await cvvInput.fill('123');
        const idInput = frameLocator.locator('#personal-id');
        await idInput.fill('212709885');
		const payButton = frameLocator.locator('#cg-submit-btn');
        await expect(payButton).toBeVisible({ timeout: 10000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();
		const successMessage = page.locator('div.Gr0W8-header', { hasText: 'התשלום בוצע בהצלחה!' });
        await expect(successMessage).toBeVisible({ timeout: 15000 });
        await expect(successMessage).toBeVisible({ timeout: 15000 });
	});
});

//B. false path: select item(s) then proceed to payment with wrong credit card number
test.describe('Checkout - Validation and Boundary', () => {
	test('wrong credit card number', async ({ page }) => {
		await page.goto(routes.root);

		// Ensure page loaded (look for page title and totals area)
		await expect(page.getByRole('heading', { name: /דבי בדיקה/ })).toBeVisible();
		await expect(page.getByText(labels.totalTitle)).toBeVisible();

		const selectedCounter = page.getByText(labels.selectedCounterPattern);
		await expect(selectedCounter).toHaveText(/נבחרו\s+0\s+פריטים/);

		await page.getByRole('heading', { name: 'חומוס' }).click();
		await page.getByRole('button', { name: 'להוספת כמות למוצר חומוס' }).click();

		// Counter should update to > 0
		await expect(selectedCounter).not.toHaveText(/נבחרו\s+0\s+פריטים/);
        await page.getByRole('button', { name: labels.continueButton }).click();

		// Fill required fields
		await page.getByRole('textbox', { name: /שם מלא/ }).fill('בדיקה אוטומטית');
		await page.getByRole('textbox', { name: /טלפון נייד/ }).fill('0551111111');
		await page.getByRole('textbox', { name: /^כתובת\s*$/ }).fill('רחוב תל אביב');
		await page.getByRole('button', { name: /מתי להתחיל להכין את ההזמנה/ }).click();
		await page.getByText('מיד', { exact: true }).click();
		const picklesYes = page.locator('[id="2934_3447"]');
		await picklesYes.check();
		await expect(picklesYes).toBeChecked();
		const chipsYes = page.locator('[id="2935_3449"]');
		await chipsYes.check();
		await expect(chipsYes).toBeChecked();
		await page.getByRole('button', { name: /נא להזין משלוח/ }).click();
		await page.getByText('איסוף', { exact: true }).click();
		await page.locator('label[for="termsCheckbox"]').click();
		await expect(page.locator('#termsCheckbox')).toBeChecked();

		await page.getByRole('button', { name: labels.continueButtonPayment }).click();
		await page.waitForTimeout(2000);
		await page.getByRole('button', { name: /לתשלום בכרטיס אשראי|לתשלום באשראי/ }).click();
		await page.waitForTimeout(5000);

		// Card details
		const frameLocator = page.frameLocator('#Gr0W8-credit-iframe');
		const cardNumberInput = frameLocator.locator('#card-number');
		await expect(cardNumberInput).toBeVisible({ timeout: 10000 });
		await cardNumberInput.fill('458045804580458045804580');

		const monthSelect = frameLocator.locator('#expMonth'); 
        await expect(monthSelect).toBeVisible();
        await monthSelect.selectOption('03'); 
		const yearSelect = frameLocator.locator('#expYear');
        await expect(yearSelect).toBeVisible();
        await yearSelect.selectOption('30'); 

        const cvvInput = frameLocator.locator('#cvv');
        await cvvInput.fill('123');
        const idInput = frameLocator.locator('#personal-id');
        await idInput.fill('212709885');
		const payButton = frameLocator.locator('#cg-submit-btn');
        await expect(payButton).toBeVisible({ timeout: 10000 });
        await expect(payButton).toBeEnabled();
        await payButton.click();

		const cardNumberError = frameLocator.locator('#error-card-number');
        await expect(cardNumberError).toBeVisible({ timeout: 5000 });
        await expect(cardNumberError).toHaveText(/מספר כרטיס לא תקין/);

	});
});
