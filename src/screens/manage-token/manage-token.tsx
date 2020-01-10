import React from 'react';
import { View, TextInput } from 'react-native';
import { Text, Button } from '../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IToken } from '../../redux/wallets/state';
import { formatAddress } from '../../core/utils/format-address';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

interface IState {
    token: IToken;
    contractAddress: string;
    symbol: string;
    decimals: string;
    isValidAddress: boolean;
    labelErrorAddressDisplay: boolean;
    labelWarningAddressDisplay: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: navigation.state?.params?.token
        ? translate('App.labels.editToken')
        : translate('App.labels.addToken')
});

export class ManageTokenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            contractAddress:
                this.props.navigation.state?.params?.token.contractAddress || undefined,
            symbol: this.props.navigation.state?.params?.token.symbol || undefined,
            decimals: this.props.navigation.state?.params?.token.decimals.toString() || undefined,
            token: this.props.navigation.state?.params?.token || undefined,
            isValidAddress: this.props.navigation.state?.params?.token ? true : false,
            labelErrorAddressDisplay: false,
            labelWarningAddressDisplay: false
        };
    }

    public verifyAddress = (text: string) => {
        const blockchainInstance = getBlockchain(this.props.navigation.state?.params?.blockchain);
        this.setState({ contractAddress: text });
        const addressValid = blockchainInstance.account.isValidAddress(text);

        this.setState({
            isValidAddress: addressValid,
            labelErrorAddressDisplay: !addressValid,
            labelWarningAddressDisplay: !blockchainInstance.account.isValidChecksumAddress(text)
        });
    };

    public render() {
        const { styles, theme } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={styles.contractAddressContainer}>
                        <View style={styles.contractAddressBox}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={theme.colors.textTertiary}
                                placeholder={translate('App.labels.contractAddress')}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                selectionColor={theme.colors.accent}
                                value={
                                    this.state.isValidAddress
                                        ? formatAddress(this.state.contractAddress)
                                        : this.state.contractAddress
                                }
                                onChangeText={text => this.verifyAddress(text)}
                            />
                        </View>

                        <View style={styles.addressErrors}>
                            {this.state.labelErrorAddressDisplay && (
                                <Text style={styles.displayError}>
                                    {translate('Send.recipientNotValid')}
                                </Text>
                            )}
                            {this.state.labelWarningAddressDisplay && (
                                <Text style={styles.receipientWarning}>
                                    {translate('Send.receipientWarning')}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('App.labels.symbol')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            selectionColor={theme.colors.accent}
                            value={this.state.symbol}
                            onChangeText={value => this.setState({ symbol: value })}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor={theme.colors.textTertiary}
                            placeholder={translate('App.labels.decimals')}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType="decimal-pad"
                            selectionColor={theme.colors.accent}
                            value={this.state.decimals}
                            onChangeText={value => this.setState({ decimals: value })}
                        />
                    </View>
                </View>

                <Button
                    style={styles.saveButton}
                    onPress={() => {
                        // add / edit token
                    }}
                    disabled={
                        this.state.labelErrorAddressDisplay && this.state.labelWarningAddressDisplay
                    }
                >
                    {translate('App.labels.save')}
                </Button>
            </View>
        );
    }
}

export const ManageTokenScreen = smartConnect(ManageTokenComponent, [withTheme(stylesProvider)]);
