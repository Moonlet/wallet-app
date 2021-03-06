module.exports = {
    getVersion: () => process.env.VERSION,
    getUniqueId: () => 'testId',
    getBundleId: () => {
        return process.env.TARGET === 'beta' ? 'com.moonlet.beta' : 'com.moonlet';
    },
    getReadableVersion: () => process.env.VERSION,
    getFontScaleSync: () => 1
};
