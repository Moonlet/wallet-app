const puppeteer = require('puppeteer');

const extensionPath = 'build/beta/chrome';

module.exports = async function() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`]
    });
    // store the browser instance so we can teardown it later
    // this global is only available in the teardown but not in TestEnvironments
    global.__BROWSER_GLOBAL__ = browser;
};
