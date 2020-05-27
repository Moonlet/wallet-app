import { persistConfig } from '../persistConfig.extension';

test('should set the config', () => {
    expect(persistConfig).toMatchSnapshot();
});
