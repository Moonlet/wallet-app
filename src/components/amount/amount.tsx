import React from 'react';
import { Text } from '../../library';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../core/blockchain/types';
import { getBlockchain, BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';

interface IExternalProps {
    amount: BigNumber;
    blockchain: Blockchain;
    convert?: boolean; // if this is present will convert amount to this currency
    style?: any;
}

export interface IReduxProps {
    usdPrices: any;
}

export const AmountComponent = (props: IExternalProps & IReduxProps) => {
    const formatOptions = props.convert
        ? {
              currency: 'USD'
          }
        : {
              currency: BLOCKCHAIN_INFO[props.blockchain].coin
          };
    const convertAmount = (blockchain: Blockchain, value: BigNumber): BigNumber => {
        if (value === undefined) {
            return new BigNumber(0);
        }
        const blockchainInstance = getBlockchain(blockchain);
        const conversion =
            props.usdPrices[BLOCKCHAIN_INFO[props.blockchain].coin] / props.usdPrices.USD || 0;

        const amount = blockchainInstance.account.amountFromStd(value);

        if (props.convert) {
            return (amount || new BigNumber(0)).multipliedBy(conversion);
        }

        return amount;
    };

    return (
        <Text style={props.style} format={formatOptions}>
            {convertAmount(props.blockchain, props.amount)}
        </Text>
    );
};

const mapStateToProps = (state: any) => ({
    usdPrices: state.market.usdPrices
});

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps, null)
]);
