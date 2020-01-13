import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState, IWalletState } from '../../redux/wallets/state';
import { addToken } from '../../redux/wallets/actions';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { selectCurrentAccount, selectCurrentWallet } from '../../redux/wallets/selectors';
import { Icon } from '../../components/icon';
import { formatAddress } from '../../core/utils/format-address';

export interface IReduxProps {
    selectCurrentAccount: IAccountState;
    wallet: IWalletState;
    addToken: typeof addToken;
}

interface IState {
    fieldInput: string;
    isSaveButton: false;
    token: any;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        selectCurrentAccount: selectCurrentAccount(state),
        wallet: selectCurrentWallet(state)
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
            isSaveButton: false,
            token: undefined
        };
    }

    public findToken = async () => {
        const token = await fetch(
            `https://static.moonlet.dev/tokens/${this.props.selectCurrentAccount.blockchain.toLocaleLowerCase()}/${this.state.fieldInput.toLocaleLowerCase()}.json`,
            {
                method: 'POST'
            }
        )
            .then(res => res.json())
            .catch(err => {
                //
            });

        if (token) {
            this.setState({ token });
        }
    };

    public saveToken = () => {
        // getTokenInfo
        // const token: IToken = {
        //     name: '',
        //     symbol: this.state.symbol, // check here if valid
        //     type: TokenType.ERC20,
        //     contractAddress: this.state.contractAddress,
        //     order: Object.keys(this.props.selectCurrentAccount.tokens).length, // check here
        //     active: true,
        //     decimals: undefined,
        //     uiDecimals: 4 // check here
        // };
        // this.props.addToken(this.props.wallet.id, this.props.selectCurrentAccount, token);
        // this.props.navigation.goBack();
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
                            onChangeText={value => this.setState({ fieldInput: value })}
                        />
                        {this.state.fieldInput !== '' && this.state.fieldInput !== undefined && (
                            <Icon name="close" size={16} style={styles.closeIcon} />
                        )}
                    </View>

                    {this.state.token && (
                        <TouchableOpacity
                            style={styles.tokenCardContainer}
                            onPress={() => {
                                //
                            }}
                        >
                            <View style={styles.iconContainer}>
                                <Image source={{ uri: this.state.token.logo }} />
                                {/* <Icon name="money-wallet-1" size={ICON_SIZE} style={styles.icon} /> */}
                            </View>
                            <View style={styles.accountInfoContainer}>
                                <Text style={styles.firstAmount}>{this.state.token.name}</Text>
                                <Text style={styles.secondAmount}>
                                    {formatAddress(this.state.token.contractAddress)}
                                </Text>
                            </View>
                            <View style={styles.iconContainer}>
                                <Icon name="chevron-right" size={18} style={styles.icon} />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.bottomButtonContainer}>
                    <Button
                        onPress={() =>
                            this.state.isSaveButton ? this.saveToken() : this.findToken()
                        }
                        disabledSecondary={
                            this.state.fieldInput === '' || this.state.fieldInput === undefined
                        }
                    >
                        {this.state.isSaveButton
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
