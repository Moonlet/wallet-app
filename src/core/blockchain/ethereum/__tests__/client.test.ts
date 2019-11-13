import { Ethereum } from '../';
import BigNumber from 'bignumber.js';

jest.mock('../../../utils/rpc-client', () => ({
    RpcClient: class {
        public rpcResult = Promise.resolve();

        public call() {
            return this.rpcResult;
        }

        public setRpcResult(value) {
            this.rpcResult = value;
        }
    }
}));

describe('Ethereum client', () => {
    test('getBalance', async () => {
        const client = Ethereum.getClient(1);

        // @ts-ignore
        client.rpc.setRpcResult(
            Promise.resolve({
                result: '0x123'
            })
        );
        expect(await client.getBalance('ADDR')).toEqual(new BigNumber('0x123', 16));

        // @ts-ignore
        client.rpc.setRpcResult(Promise.reject('ERROR'));
        try {
            await client.getBalance('ADDR');
        } catch (e) {
            expect(e).toBe('ERROR');
        }
        expect.assertions(2);
    });

    // test('getNonce', () => {
    //     const client = Ethereum.getClient(1);
    //     expect(() => client.getNonce('addr')).toThrow();
    // });
});
