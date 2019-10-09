export interface IState {
    wallet: {
        money: number;
    };
    market: {
        price: {
            eth: number;
        };
    };
}

// WIP
enum Blockchain {
    ZILLIQA = 'ZILLIQA',
    ETHEREUM = 'ETHEREUM'
}

interface IWallet {
    index: number;
    accounts: IAccount[];
    transactions: Map<string, ITransaction>;
}

interface IAccount {
    index: number;
    blockchain: Blockchain;
    address: string;
    publicKey: string;
    nonce: number;
    balance: number; // bignumber
    transactions: string[];
}

interface ITransaction {
    id: string;
    date: Date;
    fromAddress: string;
    toAddress: string;
    amount: number; // bignumber
    feeOptions: IFeeOptions;
    block: number;
    nonce: number;
}

interface IFeeOptions {
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
}
