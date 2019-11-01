import { persistConfig } from '../persistConfig.web';

test('should set the config', () => {
    expect(persistConfig).toMatchSnapshot();
});
