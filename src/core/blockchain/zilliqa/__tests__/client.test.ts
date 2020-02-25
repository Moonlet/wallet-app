import { Zilliqa } from '../';
import BigNumber from 'bignumber.js';

jest.mock('../../../utils/http-client', () => ({
    HttpClient: class {
        public rpcResult = Promise.resolve();

        public jsonRpc() {
            return this.rpcResult;
        }

        public setRpcResult(value) {
            this.rpcResult = value;
        }
    }
}));

describe('Zilliqa client', () => {
    test('getBalance', async () => {
        const client = Zilliqa.getClient(1);

        // @ts-ignore
        client.http.setRpcResult(
            Promise.resolve({
                result: {
                    balance: '123'
                }
            })
        );
        expect(await client.getBalance('zil16dnnka6yaa9mdu32gararzwv5vg369p0zkhps7')).toEqual(
            new BigNumber('123')
        );

        // @ts-ignore
        client.http.setRpcResult(
            Promise.resolve({
                error: {
                    message: 'Account is not created'
                }
            })
        );
        expect(await client.getBalance('zil16dnnka6yaa9mdu32gararzwv5vg369p0zkhps7')).toEqual(
            new BigNumber('0')
        );

        // @ts-ignore
        client.http.setRpcResult(Promise.reject('ERROR'));
        try {
            await client.getBalance('zil16dnnka6yaa9mdu32gararzwv5vg369p0zkhps7');
        } catch (e) {
            expect(e).toBe('ERROR');
        }
        expect.assertions(3);
    });

    // test('getNonce', () => {
    //     const client = Zilliqa.getClient(1);
    //     expect(() => client.getNonce('addr')).toThrow();
    // });
});
