import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Button } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { getSelectedAccount } from '../../redux/wallets/selectors';
import { Icon } from '../../components/icon/icon';
import { formatAddress } from '../../core/utils/format-address';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { getChainId } from '../../redux/preferences/selectors';
import {
    TokenType,
    TokenScreenComponentType,
    GENERIC_TOKEN_ICON
} from '../../core/blockchain/types/token';
import {
    ChainIdType,
    Blockchain,
    ResolveTextCode,
    ResolveTextType
} from '../../core/blockchain/types';
import { SmartImage } from '../../library/image/smart-image';
import { normalize } from '../../styles/dimensions';
import { ITokenConfigState } from '../../redux/tokens/state';
import { addToken } from '../../redux/tokens/actions';
import { CONFIG } from '../../config';
import { SearchInput } from '../../components/search-input/search-input';
import { bind } from 'bind-decorator';

export interface IReduxProps {
    selectedAccount: IAccountState;
    addToken: typeof addToken;
    chainId: ChainIdType;
    tokens: ITokenConfigState;
}

interface IState {
    fieldInput: string;
    token: ITokenConfigState;
    showError: boolean;
    isLoading: boolean;
    isTokenSelected: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        selectedAccount,
        chainId: getChainId(state, selectedAccount.blockchain),
        tokens: state.tokens[selectedAccount.blockchain]
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

    public getTokenType(blockchain: Blockchain) {
        switch (blockchain) {
            case Blockchain.ETHEREUM:
                return TokenType.ERC20;

            case Blockchain.ZILLIQA:
                return TokenType.ZRC2;

            default:
                return TokenType.ZRC2;
        }
    }

    public getReduxTokenSymbol = (): string => {
        if (this.props.tokens) {
            const filterResult = Object.keys(this.props.tokens).filter(
                key =>
                    key === this.state.fieldInput ||
                    this.props.tokens[key].contractAddress === this.state.fieldInput
            );
            if (filterResult.length !== 0) {
                return filterResult[0];
            }
        }
        return undefined;
    };

    public convertTokenToState(staticToken: any, blockchainToken: any) {
        // TODO enforce this after eth callContract is fixed
        // if (blockchainToken) {
        if (blockchainToken) {
            if (blockchainToken.name === '') blockchainToken = undefined;
        }
        const symbol = blockchainToken ? blockchainToken.symbol : staticToken.symbol;
        const decimals = blockchainToken ? blockchainToken.decimals : staticToken.decimals;
        const contractAddress = staticToken ? staticToken.contractAddress : this.state.fieldInput;
        this.setState({
            token: {
                name: blockchainToken ? blockchainToken.name : staticToken.name,
                symbol: String(symbol).toUpperCase(),
                icon: staticToken ? { uri: staticToken.logo } : GENERIC_TOKEN_ICON,
                type: this.getTokenType(this.props.selectedAccount.blockchain),
                removable: true,
                contractAddress,
                decimals,
                ui: {
                    decimals,
                    tokenScreenComponent: TokenScreenComponentType.DEFAULT
                }
            }
        });
        // } else {
        //     this.setState({ showError: true, isLoading: false });
        // }
    }

    public async isContractAddress(input: string) {
        const blockchainInstance = getBlockchain(this.props.selectedAccount.blockchain);
        try {
            const response = await blockchainInstance
                .getClient(this.props.chainId)
                .nameService.resolveText(input);
            if (response.code === ResolveTextCode.OK || ResolveTextCode.WARN_CHECKSUM) {
                if (response.type === ResolveTextType.ADDRESS) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    public async findToken() {
        this.setState({ isLoading: true });
        const blockchain = this.props.selectedAccount.blockchain;
        const tokenSymbol = this.getReduxTokenSymbol();
        if (tokenSymbol) {
            // token found in redux
            this.setState({ token: this.props.tokens[tokenSymbol] });
            return;
        }

        const tokenType = this.getTokenType(blockchain);
        const isContractAddress = await this.isContractAddress(this.state.fieldInput);

        let staticToken;
        let blockchainToken;

        if (isContractAddress) {
            try {
                const getTokenInfo = await Promise.all([
                    fetch(
                        CONFIG.tokensUrl +
                            `${blockchain.toLocaleLowerCase()}/${this.state.fieldInput.toLocaleLowerCase()}.json`
                    ),
                    getBlockchain(blockchain)
                        .getClient(this.props.chainId)
                        .tokens[tokenType].getTokenInfo(this.state.fieldInput)
                ]);
                if (getTokenInfo[0].status === 200) {
                    staticToken = await getTokenInfo[0].json();
                }
                blockchainToken = getTokenInfo[1];
            } catch {
                //
            }
        } else {
            try {
                const fetchResponse = await fetch(
                    CONFIG.tokensUrl +
                        `${blockchain.toLocaleLowerCase()}/${this.state.fieldInput.toLocaleLowerCase()}.json`
                );
                if (fetchResponse.status === 200) {
                    staticToken = await fetchResponse.json();
                    blockchainToken = await getBlockchain(blockchain)
                        .getClient(this.props.chainId)
                        .tokens[tokenType].getTokenInfo(staticToken.contractAddress);
                } else {
                    this.setState({ showError: true, isLoading: false });
                }
            } catch {
                //
            }
        }

        if (staticToken || blockchainToken) {
            this.convertTokenToState(staticToken, blockchainToken);
        } else {
            this.setState({ showError: true, isLoading: false });
        }
        this.setState({ isLoading: false });
    }

    public saveToken() {
        this.props.addToken(this.props.selectedAccount, this.state.token);
        this.props.navigation.goBack();
    }

    @bind
    public onSearchInput(text: string) {
        this.setState({ fieldInput: text, isTokenSelected: false });
    }

    @bind
    public onClose() {
        this.setState({
            fieldInput: undefined,
            token: undefined,
            showError: false,
            isLoading: false,
            isTokenSelected: false
        });
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <SearchInput
                        placeholderText={translate('Token.searchToken')}
                        onChangeText={this.onSearchInput}
                        onClose={this.onClose}
                    />
                    {this.state.isLoading && <LoadingIndicator />}

                    {this.state.token && this.state.token?.symbol && (
                        <TouchableOpacity
                            style={[
                                styles.tokenCardContainer,
                                this.state.isTokenSelected && styles.tokenSelectedContainer
                            ]}
                            onPress={() => this.setState({ isTokenSelected: true })}
                        >
                            <SmartImage source={this.state.token?.icon} />
                            <View style={styles.accountInfoContainer}>
                                <Text
                                    style={styles.tokenNameText}
                                >{`${this.state.token.name} (${this.state.token.symbol})`}</Text>
                                <Text style={styles.tokenAddressText}>
                                    {`${translate('App.labels.contract')}: ${formatAddress(
                                        this.state.token.contractAddress,
                                        this.props.selectedAccount.blockchain
                                    )}`}
                                </Text>
                            </View>
                            <View style={styles.iconContainer}>
                                {this.state.isTokenSelected && (
                                    <Icon name="check-1" size={normalize(16)} style={styles.icon} />
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
