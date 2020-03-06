module.exports = {
    presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
    plugins: [
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true
            }
        ]
    ],
    env: {
        test: {
            plugins: ['dynamic-import-node']
        }
    }
};
