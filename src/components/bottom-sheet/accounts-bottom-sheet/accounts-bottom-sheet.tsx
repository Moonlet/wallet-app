import React from 'react';
import { View, Platform, ScrollView } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { Text } from '../../../library';
import { BottomSheetHeader } from '../header/header';
import { IAccountState, IWalletState } from '../../../redux/wallets/state';
import { setSelectedAccount, getBalance, removeAccount } from '../../../redux/wallets/actions';
import { IReduxState } from '../../../redux/state';
import {
    getSelectedAccount,
    getAccounts,
    getSelectedWallet
} from '../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { formatAddress } from '../../../core/utils/format-address';
import { Amount } from '../../amount/amount';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { calculateBalance } from '../../../core/utils/balance';
import { translate } from '../../../core/i18n';
import { ListAccount } from '../../list-account/list-account';
import { IExchangeRates } from '../../../redux/market/state';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { getChainId } from '../../../redux/preferences/selectors';
import { ChainIdType } from '../../../core/blockchain/types';
import { IconValues } from '../../icon/values';
import { NavigationService } from '../../../navigation/navigation-service';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}
export interface IReduxProps {
    setSelectedAccount: typeof setSelectedAccount;
    selectedAccount: IAccountState;
    selectedWallet: IWalletState;
    getBalance: typeof getBalance;
    exchangeRates: IExchangeRates;
    accounts: IAccountState[];
    chainId: ChainIdType;
    removeAccount: typeof removeAccount;
}
const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);
    return {
        selectedAccount,
        exchangeRates: state.market.exchangeRates,
        accounts: selectedAccount ? getAccounts(state, selectedAccount.blockchain) : [],
        chainId: getChainId(state, selectedAccount.blockchain),
        selectedWallet: getSelectedWallet(state)
    };
};
const mapDispatchToProps = {
    setSelectedAccount,
    getBalance,
    removeAccount
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
        Platform.OS !== 'web' && this.bottomSheet.current.snapTo(1);
        this.props.accounts.map(acc => {
            this.props.getBalance(acc.blockchain, acc.address, undefined, false);
        });
    }

    public renderBottomSheetContent() {
        const blockchainConfig = getBlockchain(this.props.selectedAccount.blockchain).config;

        return (
            <View
                style={[
                    this.props.styles.container,
                    { height: this.props.snapPoints.bottomSheetHeight }
                ]}
            >
                <ScrollView
                    contentContainerStyle={[
                        this.props.styles.scrollContainer,
                        { height: this.props.snapPoints.bottomSheetHeight }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {this.props.accounts.map((account: IAccountState, index: number) => {
                        const selected = this.props.selectedAccount.address === account.address;
                        const blockchain = account.blockchain;
                        const tokenConfig = getTokenConfig(blockchain, blockchainConfig.coin);

                        const balance =
                            this.props.selectedAccount &&
                            calculateBalance(account, this.props.chainId, this.props.exchangeRates);

                        const label = (
                            <View>
                                <View style={this.props.styles.firstRow}>
                                    <Text style={this.props.styles.accountName}>
                                        {`${translate('App.labels.account')} ${account.index + 1}`}
                                    </Text>
                                    <Text style={this.props.styles.accountAddress}>
                                        {formatAddress(account.address, blockchain)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Amount
                                        style={this.props.styles.fistAmountText}
                                        amount={balance}
                                        blockchain={blockchain}
                                        token={blockchainConfig.coin}
                                        tokenDecimals={tokenConfig.decimals}
                                    />
                                    <Amount
                                        style={this.props.styles.secondAmountText}
                                        amount={balance}
                                        blockchain={blockchain}
                                        token={blockchainConfig.coin}
                                        tokenDecimals={tokenConfig.decimals}
                                        convert
                                    />
                                </View>
                            </View>
                        );

                        return (
                            <ListAccount
                                testID={
                                    'card-' +
                                    blockchain.toLocaleLowerCase() +
                                    '-account-' +
                                    (account.index + 1)
                                }
                                key={index}
                                leftIcon={blockchainConfig.iconComponent}
                                rightIcon={selected ? IconValues.CHECK : undefined}
                                label={label}
                                selected={selected}
                                onPress={() => {
                                    this.props.onClose();
                                    this.props.setSelectedAccount(account);
                                    // this.props.removeAccount(
                                    //     this.props.selectedWallet.id,
                                    //     blockchain,
                                    //     account
                                    // );
                                }}
                            />
                        );
                    })}

                    {blockchainConfig.ui.enableAccountCreation &&
                        this.props.accounts.length < blockchainConfig.ui.maxAccountsNumber && (
                            <ListAccount
                                leftIcon={blockchainConfig.iconComponent}
                                isCreate
                                label={
                                    <View style={this.props.styles.firstRow}>
                                        <Text style={this.props.styles.accountName}>
                                            {translate('AddAccount.addNearAccount')}
                                        </Text>
                                    </View>
                                }
                                onPress={() => {
                                    this.props.onClose();
                                    NavigationService.navigate('AddNearAccount', {});
                                }}
                            />
                        )}
                </ScrollView>
            </View>
        );
    }

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={() => this.renderBottomSheetContent()}
                renderHeader={() => (
                    <BottomSheetHeader
                        obRef={this.bottomSheet}
                        onClose={() => this.props.onClose()}
                    />
                )}
                enabledInnerScrolling={false}
                enabledContentTapInteraction={false}
                onCloseEnd={() => this.props.onClose()}
            />
        );
    }
}

export const AccountsBottomSheet = smartConnect<IExternalProps>(AccountsBottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
