module.exports = {
    release: {
        chrome: require('./chrome'),
        firefox: require('./firefox')
    },
    beta: {
        chrome: require('./beta/chrome-beta'),
        firefox: require('./beta/firefox-beta')
    }
};
