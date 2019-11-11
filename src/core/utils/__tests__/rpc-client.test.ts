import { RpcClient } from '../rpc-client';

describe('RPC Client', () => {
    describe('call()', () => {
        test('all params ok', async () => {
            const rpc = new RpcClient('URL');

            // @ts-ignore
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ data: 'data' })
                })
            );
            expect(await rpc.call('METHOD', ['P1', 'P2'])).toEqual({
                data: 'data'
            });

            // @ts-ignore
            expect(global.fetch).toHaveBeenCalledWith('URL', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: '{"jsonrpc":"2.0","id":0,"method":"METHOD","params":["P1","P2"]}'
            });
        });

        test('no params', async () => {
            const rpc = new RpcClient('URL');

            // @ts-ignore
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ data: 'data' })
                })
            );
            expect(await rpc.call('METHOD')).toEqual({
                data: 'data'
            });

            // @ts-ignore
            expect(global.fetch).toHaveBeenCalledWith('URL', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: '{"jsonrpc":"2.0","id":0,"method":"METHOD","params":[]}'
            });
        });

        test('error', async () => {
            const rpc = new RpcClient('URL');

            // @ts-ignore
            global.fetch = jest.fn(() => Promise.reject('ERROR'));
            try {
                // @ts-ignore
                await rpc.call('METHOD', 'P1');
            } catch (e) {
                expect(e).toBe('ERROR');
            }

            // @ts-ignore
            expect(global.fetch).toHaveBeenCalledWith('URL', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: '{"jsonrpc":"2.0","id":0,"method":"METHOD","params":["P1"]}'
            });
            expect.assertions(2);
        });
    });
});
