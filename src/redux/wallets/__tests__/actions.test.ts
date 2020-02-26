import { addWallet, createHDWallet, setSelectedWallet } from '../actions';

jest.mock('../../config');

jest.mock('../../../core/secure/keychain', () => {
    return {
        getPassword: () => Promise.resolve({ password: 'pass' })
    };
});

jest.mock('../../../core/secure/storage', () => {
    return {
        storeEncrypted: () => Promise.resolve()
    };
});

jest.mock('uuid/v4', () => {
    return {
        __esModule: true,
        default: () => 'uuid'
    };
});

const flushPromises = () => new Promise(setImmediate);

describe('wallet actions', () => {
    test('addWallet actions return correct object', () => {
        // @ts-ignore
        expect(addWallet({ data: 'test' })).toEqual({ data: { data: 'test' }, type: 'WALLET_ADD' });
        expect(setSelectedWallet('1')).toMatchSnapshot();
    });

    test('createHDWallet working properly', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn((): any => ({ wallets: [] }));
        const callback = jest.fn();
        const password = '000000';

        const mnemonic =
            'panic club above clarify orbit resist illegal feel bus remember aspect field test bubble dog trap awesome hand room rice heavy idle faint salmon';

        const response = {
            data: {
                accounts: [
                    {
                        address: '0x151250cB2bB034247c8ffBeD91B7Fb1e9f3e9FFE',
                        blockchain: 'ETHEREUM',
                        index: 0,
                        publicKey:
                            '22d185a1eda6240e2004a4794e50daff53eb3e5194bf21d4cca3be002688566ee2af4d5724dbe507646649193e5f8368ee63fb257147fbb2bafed87e63717c68'
                    },
                    {
                        address: 'zil1kqj0fp7ja409llrjt4q4tja4uvue8vtp65gahs',
                        blockchain: 'ZILLIQA',
                        index: 0,
                        publicKey:
                            '0310a8a9ad39c2c9a878bf1a42895ee122806d1f4cf510f604d274b04f5a5854cc'
                    }
                ],
                id: 'uuid',
                type: 'HD'
            },
            type: 'WALLET_ADD'
        };

        await createHDWallet(mnemonic, password, callback)(dispatch, getState);

        await flushPromises();

        expect(callback).toHaveBeenCalled();
        expect(dispatch).toMatchSnapshot();
    });
});
