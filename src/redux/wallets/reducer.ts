import { IAction } from '../types';
import { IWalletState } from './state';
import { WalletType } from '../../core/wallet/types';
import { Blockchain } from '../../core/blockchain/types';

const intialState: IWalletState[] = [
    {
        id: 'walletId',
        type: WalletType.HD,
        accounts: [
            {
                index: 1,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 12332
            },
            {
                index: 2,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 3432
            },
            {
                index: 3,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 435
            },
            {
                index: 4,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 1323
            },
            {
                index: 5,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 3255
            },
            {
                index: 6,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 12345
            },
            {
                index: 7,
                blockchain: Blockchain.ZILLIQA,
                address: 'zil1vs74hw5k21233h432kj321l3k21b',
                publicKey: '1',
                balance: 12332
            },
            {
                index: 8,
                blockchain: Blockchain.ETHEREUM,
                address: '0xeAE3Dcc2E37AD412312ASds2d4a6065A831eF89E',
                publicKey: '1',
                balance: 3.5
            },
            {
                index: 9,
                blockchain: Blockchain.COSMOS,
                address: 'cosmos123ksdadasda',
                publicKey: '1',
                balance: 220
            },
            {
                index: 8,
                blockchain: Blockchain.STELLAR,
                address: 'STLsadlij23lj313',
                publicKey: '1',
                balance: 1234
            }
        ]
    }
];

export default (state: IWalletState[] = intialState, action: IAction) => {
    return state;
};
