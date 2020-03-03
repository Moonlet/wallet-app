// jest config
module.exports = {
    // preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // transformIgnorePatterns: ['node_modules/?!(react-navigation|@react-native-community)'],
    // globalSetup: './jest.setup.js',
    // globalTeardown: './jest.teardown.js',
    roots: ['./'],
    collectCoverage: true,
    collectCoverageFrom: ['./**/*.{ts,tsx}'],
    globals: {}
};
