// jest config
module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['node_modules/?!(react-navigation|@react-native-community)'],
    setupFiles: ['./jest.setup.js'],
    roots: ['src/'],
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.{ts,tsx}', '!./src/core/utils/test/'],
    globals: {
        window: {
            navigator: {
                language: 'en-US'
            }
        }
    }
};
