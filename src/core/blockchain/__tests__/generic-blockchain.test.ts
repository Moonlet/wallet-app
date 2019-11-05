import { GenericBlockchain } from '../generic-blockchain';
import { IAccountState } from '../../../redux/wallets/state';

class TestClass extends GenericBlockchain {
    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        throw new Error();
    }
    public getBalance(address: string): Promise<any> {
        throw new Error();
    }
    public sendTransaction(): Promise<any> {
        throw new Error();
    }
    public isValidAddress(address: string): boolean {
        return true;
    }
    public getFeeForAmount(amound: string): string {
        return '';
    }
}

export default describe('GenericBlockchain', () => {
    test('rpcCall()', () => {
        const testInstance = new TestClass(1);

        expect(testInstance.rpcCall('METHOD')).toBeInstanceOf(Promise);
    });
});
