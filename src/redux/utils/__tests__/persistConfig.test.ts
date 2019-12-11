import { persistConfig } from '../persistConfig';

test('should set the config', () => {
    expect(persistConfig).toMatchSnapshot();
});
