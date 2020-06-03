describe('Create Wallet', () => {
    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('Create Flow', async () => {
        await expect(element(by.id('onboarding-screen'))).toBeVisible();

        // Create Button
        await expect(element(by.id('create-button'))).toBeVisible();
        await element(by.id('create-button')).tap();

        // Legal
        await expect(element(by.id('legal-modal'))).toBeVisible();
        await expect(element(by.id('legal-accept-button'))).toBeVisible();
        await element(by.id('legal-accept-button')).tap();

        // Create Wallet Mnemonic Screen
    });
});
