import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState, IWalletState, TokenType } from '../../redux/wallets/state';
import { addToken } from '../../redux/wallets/actions';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { Icon } from '../../components/icon';
import { formatAddress } from '../../core/utils/format-address';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { getChainId } from '../../redux/preferences/selectors';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { isValidAddress } from '../../core/blockchain/ethereum/account';
import { ChainIdType } from '../../core/blockchain/types';

const GENERIC_TOKEN_LOGO = {
    uri:
        'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/generic.png'
};

export interface IReduxProps {
    selectedAccount: IAccountState;
    wallet: IWalletState;
    addToken: typeof addToken;
    chainId: ChainIdType;
}

interface IState {
    fieldInput: string;
    token: ITokenConfig;
    showError: boolean;
    isLoading: boolean;
    isTokenSelected: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        selectedAccount,
        wallet: getSelectedWallet(state),
        chainId: getChainId(state, selectedAccount.blockchain)
    };
};

const mapDispatchToProps = {
    addToken
};

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.addToken')
});

export class ManageTokenComponent extends React.Component<
    IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: IReduxProps & INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            fieldInput: undefined,
            token: undefined,
            showError: false,
            isLoading: false,
            isTokenSelected: false
        };
    }

    public startsWith = (str: string) => str.lastIndexOf('0x', 0) === 0;

    public findToken = async () => {
        this.setState({
            isLoading: true,
            token: undefined,
            showError: false
        });

        const inputValue = this.state.fieldInput.toLocaleLowerCase();
        const blockchain = this.props.selectedAccount.blockchain.toLocaleLowerCase();

        const foundToken = await fetch(
            `https://static.moonlet.dev/tokens/${blockchain}/${inputValue}.json`,
            {
                method: 'POST'
            }
        )
            .then(res => res.json())
            .catch(err => {
                if (this.startsWith(inputValue)) {
                    // Search by address
                    if (isValidAddress(inputValue)) {
                        this.setState({
                            token: {
                                ...this.state.token,
                                contractAddress: inputValue
                            }
                        });
                    } else {
                        // Address is not valid
                        this.setState({ showError: true, isLoading: false });
                    }
                } else {
                    // Symbol
                    this.setState({ showError: true, isLoading: false });
                }
            });

        const tokenInfo = await getBlockchain(this.props.selectedAccount.blockchain)
            .getClient(this.props.chainId)
            .tokens[TokenType.ERC20].getTokenInfo(
                this.state.token?.contractAddress || foundToken?.contractAddress
            );

        if (tokenInfo) {
            this.setState({
                token: {
                    ...this.state.token,
                    contractAddress:
                        this.state.token?.contractAddress || foundToken?.contractAddress,
                    decimals: tokenInfo.decimals,
                    name: tokenInfo?.name || foundToken.name,
                    symbol: tokenInfo?.symbol || foundToken.symbol,
                    logo: { uri: foundToken?.logo } || GENERIC_TOKEN_LOGO
                },
                showError: false,
                isLoading: false
            });
        } else {
            // Token could not be found
            this.setState({ showError: true, isLoading: false });
        }
    };

    public saveToken = () => {
        this.setState(
            {
                token: {
                    ...this.state.token,

                    name: this.state.token?.name || '',
                    symbol: this.state.token.symbol,
                    logo: this.state.token?.logo || GENERIC_TOKEN_LOGO,
                    type: TokenType.ERC20,
                    contractAddress: this.state.token.contractAddress,
                    decimals: Number(this.state.token.decimals),
                    uiDecimals: 4,

                    active: true,
                    order:
                        Object.values(this.props.selectedAccount.tokens).sort(
                            (x, y) => y.order - x.order
                        )[0]?.order || 0 + 1, // check here

                    balance: {
                        value: '0',
                        timestamp: undefined,
                        inProgress: false,
                        error: undefined
                    }
                }
            },
            () => {
                this.props.addToken(
                    this.props.wallet.id,
                    this.props.selectedAccount,
                    this.state.token
                );
                this.props.navigation.goBack();
            }
        );
    };

    public render() {
        const { styles, theme } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={styles.inputBox}>
                        <Icon name="search" size={14} style={styles.searchIcon} />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('Token.searchToken')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            value={this.state.fieldInput}
                            onChangeText={value =>
                                this.setState({ fieldInput: value, isTokenSelected: false })
                            }
                        />
                        {this.state.fieldInput !== '' && this.state.fieldInput !== undefined && (
                            <TouchableOpacity
                                style={styles.closeIconContainer}
                                onPress={() =>
                                    this.setState({
                                        fieldInput: undefined,
                                        token: undefined,
                                        showError: false,
                                        isLoading: false,
                                        isTokenSelected: false
                                    })
                                }
                            >
                                <Icon name="close" size={16} style={styles.closeIcon} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {this.state.isLoading && <LoadingIndicator />}

                    {this.state.token && (
                        <TouchableOpacity
                            style={[
                                styles.tokenCardContainer,
                                this.state.isTokenSelected && styles.tokenSelectedContainer
                            ]}
                            onPress={() => this.setState({ isTokenSelected: true })}
                        >
                            <View style={styles.iconContainer}>
                                <Image
                                    style={styles.tokenLogo}
                                    resizeMode="contain"
                                    source={this.state.token?.logo}
                                />
                            </View>
                            <View style={styles.accountInfoContainer}>
                                <Text
                                    style={styles.tokenNameText}
                                >{`${this.state.token.name} (${this.state.token.symbol})`}</Text>
                                <Text style={styles.tokenAddressText}>
                                    {`${translate('App.labels.contract')}: ${formatAddress(
                                        this.state.token.contractAddress
                                    )}`}
                                </Text>
                            </View>
                            <View style={styles.iconContainer}>
                                {this.state.isTokenSelected && (
                                    <Icon name="check-1" size={16} style={styles.icon} />
                                )}
                            </View>
                        </TouchableOpacity>
                    )}

                    {this.state.showError && (
                        <View style={styles.errorWrapper}>
                            <Text style={styles.noMatchText}>{translate('Token.noMatch')}</Text>
                            <Text style={styles.noGiveUpText}>{translate('Token.noGiveUp')}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.bottomButtonContainer}>
                    <Button
                        onPress={() =>
                            this.state.isTokenSelected ? this.saveToken() : this.findToken()
                        }
                        disabledSecondary={
                            this.state.fieldInput === '' || this.state.fieldInput === undefined
                        }
                    >
                        {this.state.isTokenSelected
                            ? translate('App.labels.save')
                            : translate('App.labels.find')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const ManageTokenScreen = smartConnect(ManageTokenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
