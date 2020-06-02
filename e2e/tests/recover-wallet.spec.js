describe('Recover Wallet', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('Recover Flow', async () => {
        await expect(element(by.id('onboarding-screen'))).toBeVisible();

        // Recover Button
        await expect(element(by.id('recover-button'))).toBeVisible();
        await element(by.id('recover-button')).tap();

        // Legal
        await expect(element(by.id('legal-modal'))).toBeVisible();
        await expect(element(by.id('legal-accept-button'))).toBeVisible();
        await element(by.id('legal-accept-button')).tap();

        // Recover Screen
        await expect(element(by.id('confirm'))).toBeVisible();

        await expect(element(by.id('next-word'))).toBeVisible();
        await element(by.id('next-word')).tap(); // multiTap(12);
    });
});
