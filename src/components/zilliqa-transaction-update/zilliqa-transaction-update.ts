import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getChainId } from '../../redux/preferences/selectors';
import { getWsClient } from './ws-client';
import React from 'react';
import { updateTransactionsStatus } from '../../redux/wallets/actions';
import bind from 'bind-decorator';

interface IReduxProps {
    chainId: ChainIdType;
    addresses: string[];
    updateTransactionsStatus: typeof updateTransactionsStatus;
}

const mapStateToProps = (state: IReduxState) => {
    const wallet = getSelectedWallet(state);
    return {
        chainId: getChainId(state, Blockchain.ZILLIQA),
        addresses: wallet
            ? wallet.accounts
                  .filter(acc => acc.blockchain === Blockchain.ZILLIQA)
                  .map(acc => fromBech32Address(acc.address).toLowerCase())
            : []
    };
};

const mapDispatchToProps = {
    updateTransactionsStatus
};

export class ZilliqaTransactionUpdateComponent extends React.Component<IReduxProps> {
    constructor(props: IReduxProps) {
        super(props);
        this.connectToWs();
    }

    private unsubscribe;

    @bind
    private connectToWs() {
        if (this.unsubscribe) this.unsubscribe();
        const wsClient = getWsClient(this.props.chainId.toString());

        this.unsubscribe = wsClient.onTxnLog(this.props.addresses, transactions => {
            this.props.updateTransactionsStatus(transactions);
        });
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        const prevHash = prevProps.chainId.toString() + prevProps.addresses.sort().join();
        const hash = this.props.chainId.toString() + this.props.addresses.sort().join();

        if (prevHash !== hash) {
            this.connectToWs();
        }
    }

    public render() {
        return null;
    }
}

export const ZilliqaTransactionUpdate = smartConnect(ZilliqaTransactionUpdateComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
