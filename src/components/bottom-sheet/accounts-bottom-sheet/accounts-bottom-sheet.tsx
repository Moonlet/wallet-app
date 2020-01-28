import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Text } from '../../../library';
import { BottomSheetHeader } from '../header/header';
import { IAccountState } from '../../../redux/wallets/state';
import { setSelectedAccount, getBalance } from '../../../redux/wallets/actions';
import { IReduxState } from '../../../redux/state';
import {
    getSelectedWallet,
    getSelectedAccount,
    getAccounts
} from '../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { formatAddress } from '../../../core/utils/format-address';
import { ListAccount } from '../../../screens/token/components/list-account/list-account';
import { Blockchain } from '../../../core/blockchain/types';
import { Amount } from '../../amount/amount';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { calculateBalance } from '../../../core/blockchain/common/account';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onOpenStart: () => void;
    onCloseEnd: () => void;
}
export interface IReduxProps {
    setSelectedAccount: typeof setSelectedAccount;
    selectedAccount: IAccountState;
    getBalance: typeof getBalance;
    exchangeRates: any;
    accounts: IAccountState[];
}
const mapStateToProps = (state: IReduxState) => {
    return {
        wallet: getSelectedWallet(state),
        selectedAccount: getSelectedAccount(state),
        exchangeRates: (state as any).market.exchangeRates,
        accounts: getAccounts(state, getSelectedAccount(state).blockchain)
    };
};
const mapDispatchToProps = {
    setSelectedAccount,
    getBalance
};

export class AccountsBottomSheetComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;

    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        this.bottomSheet.current.props.onOpenStart();
        Platform.OS !== 'web' ? this.bottomSheet.current.snapTo(1) : null;
        this.props.accounts.map(acc => {
            this.props.getBalance(acc.blockchain, acc.address, undefined, true);
        });
    }

    public renderBottomSheetContent = () => (
        <View
            style={[
                this.props.styles.container,
                { height: this.props.snapPoints.bottomSheetHeight }
            ]}
        >
            <View style={this.props.styles.container}>
                {this.props.accounts.map((account: IAccountState, index: number) => {
                    const selected = this.props.selectedAccount.address === account.address;
                    const blockchain = account.blockchain;

                    const label = (
                        <View>
                            <View style={this.props.styles.firstRow}>
                                <Text style={this.props.styles.accountName}>
                                    {`Account ${account.index + 1}`}
                                </Text>
                                <Text style={this.props.styles.accountAddress}>
                                    {formatAddress(account.address)}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Amount
                                    style={this.props.styles.fistAmountText}
                                    amount={calculateBalance(account)}
                                    blockchain={blockchain}
                                    token={getBlockchain(blockchain).config.coin}
                                    tokenDecimals={
                                        getBlockchain(blockchain).config.tokens[
                                            getBlockchain(blockchain).config.coin
                                        ].decimals
                                    }
                                />
                                <Amount
                                    style={this.props.styles.secondAmountText}
                                    amount={calculateBalance(account)}
                                    blockchain={blockchain}
                                    token={getBlockchain(blockchain).config.coin}
                                    tokenDecimals={
                                        getBlockchain(blockchain).config.tokens[
                                            getBlockchain(blockchain).config.coin
                                        ].decimals
                                    }
                                    convert
                                />
                            </View>
                        </View>
                    );
                    return (
                        <ListAccount
                            key={index}
                            leftIcon={
                                blockchain === Blockchain.ETHEREUM
                                    ? require('../../../assets/images/png/eth.png')
                                    : blockchain === Blockchain.ZILLIQA
                                    ? require('../../../assets/images/png/zil.png')
                                    : undefined
                            }
                            rightIcon={selected ? 'check-1' : undefined}
                            label={label}
                            selected={selected}
                            onPress={() =>
                                this.props.setSelectedAccount({
                                    index: account.index,
                                    blockchain
                                })
                            }
                        />
                    );
                })}
            </View>
        </View>
    );

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                // initialSnap={0}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={this.renderBottomSheetContent}
                renderHeader={() => <BottomSheetHeader obRef={this.bottomSheet} />}
                onOpenStart={this.props.onOpenStart}
                onCloseEnd={this.props.onCloseEnd}
            />
        );
    }
}

export const AccountsBottomSheet = smartConnect<IExternalProps>(AccountsBottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
