import puppeteer from 'puppeteer';

const extensionPath = 'build/beta/chrome';

describe('Test extension integrity', () => {
    let browser: puppeteer.Browser;
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`
            ]
        });
    });

    test('extension build is ok', async () => {
        // const page = browser.pages[0];
        const page = await browser.newPage();

        await page.goto('chrome-extension://fppojmnjpgbjelbjpdhgnhjahaimpjeh/index.html');
        // await page.goto('https://google.ro');

        await page.waitFor('[data-testid="welcome-text"]');

        const element = await page.$('[data-testid="welcome-text"] div');
        const text = await page.evaluate(e => e.innerText, element);
        expect(text).toBe('Welcome to Moonlet!');
    }, 20000);

    afterAll(() => {
        browser.close();
    });
});
