import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { AccountList } from '../account-list/account-list';
import { IAccountState } from '../../../../redux/wallets/state';
import { AddressBook } from '../address-book/address-book';
import { IContactState, IContactsState } from '../../../../redux/contacts/state';
import { formatAddress } from '../../../../core/utils/format-address';
import { Icon } from '../../../../components/icon';
import { ICON_SIZE } from '../../../../styles/dimensions';
import { Dialog } from '../../../../components/dialog/dialog';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import {
    ResolveTextCode,
    ResolveTextType,
    ResolveTextError,
    ChainIdType,
    Blockchain
} from '../../../../core/blockchain/types';
import { addContact } from '../../../../redux/contacts/actions';
import { connect } from 'react-redux';
import { QrModalReader } from '../../../../components/qr-modal/qr-modal';
import { IReduxState } from '../../../../redux/state';
import { getAccounts } from '../../../../redux/wallets/selectors';
import { getContacts } from '../../../../redux/contacts/selectors';

export interface IExternalProps {
    account: IAccountState;
    blockchain: Blockchain;
    chainId: ChainIdType;
    onChange: (address: string) => void;
}

interface IState {
    toAddress: string;
    isValidText: boolean;
    showOwnAccounts: boolean;
    errorResponseText: string;
    warningResponseText: string;
}

export interface IReduxProps {
    addContact: typeof addContact;
    accounts: IAccountState[];
    contacts: IContactsState[];
}

export const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        accounts: getAccounts(state, ownProps.blockchain),
        contacts: getContacts(state)
    };
};

const mapDispatchToProps = {
    addContact
};

export class AddAddressComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public qrCodeScanner: any;

    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            toAddress: '',
            isValidText: false,
            showOwnAccounts: false,
            errorResponseText: undefined,
            warningResponseText: undefined
        };
    }

    public async alertModalAddAddress() {
        // TODO: check this, it's not opening all the time
        const inputValue = await Dialog.prompt(
            translate('Send.alertTitle'),
            translate('Send.alertDescription')
        );

        const contactData: IContactState = {
            blockchain: this.props.account.blockchain,
            name: inputValue,
            address: this.state.toAddress
        };

        if (inputValue !== '') {
            this.props.addContact(contactData);
        }
    }

    private async onPressQrCodeIcon() {
        this.qrCodeScanner.open();
    }

    private onQrCodeScanned(value: string) {
        this.verifyInputText(value);
    }

    private onTransferBetweenAccounts() {
        const currentState = this.state.showOwnAccounts;
        this.setState({
            showOwnAccounts: !currentState,
            isValidText: false,
            toAddress: ''
        });
    }

    renderAddAddressToBook = () => {
        const { styles } = this.props;

        const addressNotInWalletAccounts =
            this.props.accounts.filter(
                account =>
                    account.blockchain === this.props.blockchain &&
                    account.address.toLocaleLowerCase() === this.state.toAddress.toLocaleLowerCase()
            ).length === 0;

        if (
            this.state.isValidText &&
            this.props.contacts[`${this.props.blockchain}|${this.state.toAddress}`] === undefined &&
            addressNotInWalletAccounts === true
        ) {
            return (
                <TouchableOpacity onPress={() => this.alertModalAddAddress()}>
                    <Text style={styles.addressNotInBookText}>
                        {translate('Send.addressNotInBook')}
                    </Text>
                </TouchableOpacity>
            );
        }
    };

    private onAccountSelection(account: IAccountState) {
        this.setState({ toAddress: account.address });
        this.verifyInputText(account.address);
    }

    private onContactSelected(contact: IContactState) {
        this.setState({ toAddress: contact.address });
        this.verifyInputText(contact.address);
    }

    private renderListOrBook() {
        if (this.state.showOwnAccounts) {
            return (
                <AccountList
                    accounts={this.props.accounts}
                    onAccountSelection={(account: IAccountState) =>
                        this.onAccountSelection(account)
                    }
                    selectedAddress={this.state.toAddress}
                />
            );
        } else {
            return (
                <AddressBook
                    blockchain={this.props.blockchain}
                    onContactSelected={(contact: IContactState) => this.onContactSelected(contact)}
                    selectedAddress={this.state.toAddress}
                />
            );
        }
    }

    public async verifyInputText(text: string) {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        this.setState({ toAddress: text });

        try {
            const response = await blockchainInstance
                .getClient(this.props.chainId)
                .nameService.resolveText(text);

            switch (response.code) {
                case ResolveTextCode.OK: {
                    if (response.type === ResolveTextType.ADDRESS) {
                        this.setState(
                            {
                                isValidText: true,
                                errorResponseText: undefined,
                                warningResponseText: undefined
                            },
                            () => this.props.onChange(this.state.toAddress)
                        );
                    } else if (response.type === ResolveTextType.NAME) {
                        this.setState({
                            isValidText: false,
                            errorResponseText: undefined,
                            warningResponseText: undefined
                        });
                    }

                    break;
                }
                case ResolveTextCode.WARN_CHECKSUM: {
                    this.setState(
                        {
                            isValidText: true,
                            errorResponseText: undefined,
                            warningResponseText: translate('Send.receipientWarning')
                        },
                        () => this.props.onChange(this.state.toAddress)
                    );
                    break;
                }
                default:
                    {
                        this.setState({
                            isValidText: false,
                            errorResponseText: translate('Send.recipientNotValid'),
                            warningResponseText: undefined
                        });
                    }
                    break;
            }
        } catch (error) {
            switch (error.error) {
                case ResolveTextError.INVALID: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.recipientNotValid'),
                        warningResponseText: undefined
                    });
                    break;
                }
                case ResolveTextError.CONNECTION_ERROR: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.genericError'),
                        warningResponseText: undefined
                    });
                    break;
                }
                default: {
                    this.setState({
                        isValidText: false,
                        errorResponseText: translate('Send.recipientNotValid'),
                        warningResponseText: undefined
                    });
                    break;
                }
            }
        }
    }

    private onPressClearInput() {
        this.setState({
            isValidText: false,
            toAddress: '',
            errorResponseText: undefined,
            warningResponseText: undefined
        });
    }

    private renderRightAddressIcon() {
        const styles = this.props.styles;
        if (Platform.OS === 'web') {
            return null;
        }

        if (!this.state.isValidText) {
            return (
                <TouchableOpacity
                    testID="qrcode-icon"
                    onPress={() => this.onPressQrCodeIcon()}
                    style={styles.rightAddressButton}
                >
                    <Icon name="qr-code-scan" size={ICON_SIZE} style={styles.icon} />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    testID="clear-address"
                    onPress={() => this.onPressClearInput()}
                    style={styles.rightAddressButton}
                >
                    <Icon name="close" size={16} style={styles.icon} />
                </TouchableOpacity>
            );
        }
    }

    public render() {
        const { styles, theme } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.receipientLabel}>
                    {this.state.toAddress !== '' ? translate('Send.recipientLabel') : ' '}
                </Text>
                <View style={styles.inputBox}>
                    <TextInput
                        testID="input-address"
                        style={styles.inputAddress}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.inputAddress')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        editable={!this.state.isValidText}
                        selectionColor={theme.colors.accent}
                        value={
                            this.state.isValidText
                                ? formatAddress(this.state.toAddress, this.props.blockchain)
                                : this.state.toAddress
                        }
                        onChangeText={text => this.verifyInputText(text)}
                    />
                    {this.renderRightAddressIcon()}
                </View>

                {this.state.errorResponseText && (
                    <Text style={styles.displayError}>{this.state.errorResponseText}</Text>
                )}

                {this.state.warningResponseText && (
                    <Text style={styles.receipientWarning}>{this.state.warningResponseText}</Text>
                )}

                <TouchableOpacity
                    testID="transfer-between-accounts"
                    onPress={() => this.onTransferBetweenAccounts()}
                    style={[styles.buttonRightOptions]}
                >
                    <Text style={styles.textTranferButton}>
                        {this.state.showOwnAccounts
                            ? translate('App.labels.close')
                            : translate('Send.transferOwnAccounts')}
                    </Text>
                </TouchableOpacity>

                {this.renderAddAddressToBook()}

                {this.renderListOrBook()}

                <QrModalReader
                    ref={ref => (this.qrCodeScanner = ref)}
                    onQrCodeScanned={value => this.onQrCodeScanned(value)}
                />
            </View>
        );
    }
}

export const AddAddress = smartConnect<IExternalProps>(AddAddressComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
