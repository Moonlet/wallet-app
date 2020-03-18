module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'inline-dotenv',
            {
                unsafe: true,
                systemVar: 'overwrite'
            }
        ],
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
