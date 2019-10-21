module.exports = {
    preset: 'react-native',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: ['node_modules/?!(react-navigation)'],
    setupFiles: ['./jest.setup.js'],
    roots: ['src/'],
    collectCoverage: true,
    testPathIgnorePatterns: ['<rootDir>/src/navigation/']
};
