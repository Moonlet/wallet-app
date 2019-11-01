import { persistConfig } from '../persistConfig';

test('should set the config', () => {
    expect(persistConfig).toEqual({ key: 'root', storage: undefined, version: 1 });
});
