module.exports = {
    getVersion: () => process.env.VERSION,
    getUniqueId: () => 'testId',
    getBundleId: () => {
        return process.env.TARGET === 'beta' ? 'com.moonlet.beta' : 'com.moonlet';
    },
    getReadableVersion: () => {
        // TODO: add build number
        return process.env.VERSION;
    }
};
