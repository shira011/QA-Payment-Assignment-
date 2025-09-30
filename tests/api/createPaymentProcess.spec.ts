import { test, expect } from '@playwright/test';

const BASE_URL = 'https://sandbox.meshulam.co.il/api/light/server/1.0/createPaymentProcess';

test.describe('createPaymentProcess API', () => {

	test('A valid call returns a 200 status and a valid link', async ({ request }) => {
		const response = await request.post(BASE_URL, {
			multipart: {
				pageCode: 'e19e0b687744',
				userId: '52e95954cd5c1311',
				sum: '1',
				paymentNum: '1',
				description: 'ORDER123',
				'pageField[fullName]': 'שם מלא',
				'pageField[phone]': '0534738605',
				'pageField[email]': 'debbie@meshulam.co.il',
			},
		});

		expect(response.status()).toBe(200);
		const json = await response.json();
		const link = json?.data?.paymentPageLink ?? json?.data?.url ?? json?.url;
		expect(link, 'Response should contain a link field').toBeTruthy();
		expect(String(link)).toMatch(/^https?:\/\//);
	});

	test('Missing field (pageCode) should return error', async ({ request }) => {
		const response = await request.post(BASE_URL, {
			multipart: {
				//pageCode: 'e19e0b687744',
				userId: '52e95954cd5c1311',
				sum: '1',
				paymentNum: '1',
				description: 'ORDER123',
				'pageField[fullName]': 'שם מלא',
				'pageField[phone]': '0534738605',
				'pageField[email]': 'debbie@meshulam.co.il',
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();

		expect(Number(body.status)).toBe(0);
		const expectedHebrew = 'חסרים נתונים:pageCode';
		let errObj: any = body.err;
		if (typeof errObj === 'string') {
			try { errObj = JSON.parse(errObj); } catch { /* keep as string */ }
		}
		const actualMsg = typeof errObj === 'object' && errObj?.message ? String(errObj.message) : String(errObj);
		expect(actualMsg).toContain(expectedHebrew);
	});

	test('Should return error for invalid sum value', async ({ request }) => {
		const response = await request.post(BASE_URL, {
			multipart: {
				pageCode: 'e19e0b687744',
				userId: '52e95954cd5c1311',
				sum: '0', // invalid
				paymentNum: '1',
				description: 'ORDER123',
				'pageField[fullName]': 'שם מלא',
				'pageField[phone]': '0534738605',
				'pageField[email]': 'debbie@meshulam.co.il',
			},
		});

		expect(response.status()).toBe(200);
		const body = await response.json();

		expect(Number(body.status)).toBe(0);
		const expectedHebrew = 'לא ניתן לשלם בסכום הנמוך מ- 0';
		let errObj: any = body.err;
		if (typeof errObj === 'string') {
			try { errObj = JSON.parse(errObj); } catch { /* keep as string */ }
		}
		const actualMsg = typeof errObj === 'object' && errObj?.message ? String(errObj.message) : String(errObj);
		expect(actualMsg).toContain(expectedHebrew);
	});
});
