import React from 'react';
import { View, Platform, ScrollView, TouchableOpacity } from 'react-native';
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
import { ChainIdType, Blockchain } from '../../../core/blockchain/types';
import { IconValues } from '../../icon/values';
import { NavigationService } from '../../../navigation/navigation-service';
import Icon from '../../icon/icon';
import { normalize } from '../../../styles/dimensions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Dialog } from '../../dialog/dialog';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}

interface IReduxProps {
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
    public accountsSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

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
        setTimeout(() => this.showHints(), 500);
    }

    private showHints() {
        if (this.props.accounts && this.props.accounts.length > 1) {
            const accountIndex = `account-1`; // Account 0 cannot be deleted
            this.onSwipeableWillOpen(accountIndex);
            this.accountsSwipeableRef[accountIndex] &&
                this.accountsSwipeableRef[accountIndex].openLeft();

            setTimeout(() => this.closeCurrentOpenedSwipable(), 1000);
        }
    }

    public closeCurrentOpenedSwipable() {
        this.accountsSwipeableRef[this.currentlyOpenSwipeable] &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public renderLeftActions(account: IAccountState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={async () => {
                        if (
                            await Dialog.confirm(
                                translate('App.labels.removeAccount'),
                                translate('AddAccount.removeAccountConfirm', {
                                    name: account.address
                                })
                            )
                        ) {
                            this.props.onClose();
                            this.props.removeAccount(
                                this.props.selectedWallet.id,
                                account.blockchain,
                                account
                            );
                        }
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon
                        name={IconValues.BIN}
                        size={normalize(32)}
                        style={styles.iconActionNegative}
                    />
                    <Text style={styles.textActionNegative}>{translate('App.labels.remove')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    public onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    public renderBottomSheetContent() {
        const { selectedAccount } = this.props;

        const blockchainConfig = getBlockchain(selectedAccount.blockchain).config;

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
                    scrollEnabled={Platform.OS === 'web'}
                >
                    {this.props.accounts.map((account: IAccountState, index: number) => {
                        const selected = selectedAccount.address === account.address;
                        const blockchain = account.blockchain;
                        const tokenConfig = getTokenConfig(blockchain, blockchainConfig.coin);

                        const balance =
                            selectedAccount &&
                            calculateBalance(
                                account,
                                this.props.chainId,
                                this.props.exchangeRates,
                                tokenConfig
                            );

                        const swipeIndex = `account-${index}`;

                        const label = (
                            <View>
                                <View style={this.props.styles.firstRow}>
                                    <Text style={this.props.styles.accountName}>
                                        {`${translate('App.labels.account')} ${account.index + 1}`}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={this.props.styles.accountAddress}
                                    >
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
                            <Swipeable
                                key={index}
                                ref={ref => (this.accountsSwipeableRef[swipeIndex] = ref)}
                                renderLeftActions={() =>
                                    account.blockchain === Blockchain.NEAR &&
                                    account.index !== 0 && // cannot delete account of index 0
                                    this.renderLeftActions(account)
                                }
                                onSwipeableWillOpen={() => this.onSwipeableWillOpen(swipeIndex)}
                            >
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
                                    }}
                                />
                            </Swipeable>
                        );
                    })}

                    {Platform.OS !== 'web' && (
                        // For now this this is only implemented on NEAR
                        <ListAccount
                            leftIcon={blockchainConfig.iconComponent}
                            isCreate
                            disabled={
                                this.props.accounts.length ===
                                    blockchainConfig.ui.maxAccountsNumber ||
                                selectedAccount.blockchain !== Blockchain.NEAR
                            }
                            label={
                                <View
                                    style={[
                                        this.props.styles.firstRow,
                                        { justifyContent: 'center' }
                                    ]}
                                >
                                    <Text style={this.props.styles.accountName}>
                                        {translate('AddAccount.addNearAccount', {
                                            activeAccountsNumber: this.props.accounts.length,
                                            maxAccountsNumber: blockchainConfig.ui.maxAccountsNumber
                                        })}
                                    </Text>
                                </View>
                            }
                            onPress={() => {
                                this.props.onClose();
                                NavigationService.navigate('ManageAccounts', {});
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
