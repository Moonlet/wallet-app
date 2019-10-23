module.exports = {
    release: {
        chrome: require('./chrome').default,
        firefox: require('./firefox').default
    },
    beta: {
        chrome: require('./beta/chrome-beta').default,
        firefox: require('./beta/firefox-beta').default
    }
};
