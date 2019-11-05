import React from 'react';
import { View, TextInput } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Button } from '../../library/button/button';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { Blockchain } from '../../core/blockchain/types';
import { BlockchainFactory } from '../../core/blockchain/blockchain-factory';
import { BLOCKCHAIN_INFO } from '../../core/constants/blockchain';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export const mapStateToProps = (state: IReduxState) => ({});

interface IState {
    address: string;
    amount: string;
    fee: string;
    isValidAddress: boolean;
    blockchain: Blockchain;
}

export class SendScreenComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            address: '',
            amount: '',
            fee: '',
            isValidAddress: false,
            blockchain: Blockchain.ZILLIQA
        };
    }

    public verifyAddress = (text: string) => {
        const blockchainInstance = BlockchainFactory.get(this.state.blockchain);
        this.setState({ address: text });
        if (blockchainInstance.isValidAddress(text)) {
            this.setState({ isValidAddress: true });
        }
    };
    public addAmount = (value: string) => {
        const blockchainInstance = BlockchainFactory.get(this.state.blockchain);
        this.setState({
            amount: value,
            fee:
                blockchainInstance.getFeeForAmount(value) +
                BLOCKCHAIN_INFO[this.state.blockchain].coin
        });
    };
    public render() {
        const styles = this.props.styles;
        const theme = this.props.theme;

        return (
            <View style={styles.container}>
                <Text style={styles.address}>Reusable component</Text>
                {this.state.address !== '' ? (
                    <Text style={styles.receipientLabel}>{translate('Send.recipientLabel')}</Text>
                ) : null}
                <View style={styles.inputBoxAddress}>
                    <TextInput
                        testID="input-address"
                        style={styles.inputAddress}
                        placeholderTextColor={theme.colors.textSecondary}
                        placeholder={translate('Send.inputAddress')}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        selectionColor={theme.colors.accent}
                        value={this.state.address}
                        onChangeText={text => {
                            this.verifyAddress(text);
                        }}
                    />
                </View>
                {this.state.isValidAddress ? (
                    <View style={styles.basicFields}>
                        <View style={styles.inputBox}>
                            <TextInput
                                testID="amount"
                                style={styles.input}
                                placeholderTextColor={theme.colors.textSecondary}
                                placeholder={translate('Send.amount')}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                selectionColor={theme.colors.accent}
                                value={this.state.amount}
                                onChangeText={value => {
                                    this.addAmount(value);
                                }}
                            />
                        </View>
                        <View style={styles.inputBox}>
                            <TextInput
                                testID="fee"
                                style={styles.input}
                                placeholderTextColor={theme.colors.textSecondary}
                                placeholder={this.state.fee}
                                autoCorrect={false}
                                selectionColor={theme.colors.accent}
                                editable={false}
                            />
                        </View>
                        <View style={styles.bottom}>
                            <Button
                                testID="confirm-payment"
                                style={styles.bottomButton}
                                primary
                                disabled={!this.state.isValidAddress || this.state.amount === ''}
                                onPress={() => {
                                    this.props.navigation.navigate('ConfirmPayment');
                                }}
                            >
                                {translate('App.labels.confirmPayment')}
                            </Button>
                        </View>
                    </View>
                ) : null}
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(
        mapStateToProps,
        {}
    ),
    withTheme(stylesProvider)
]);

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Send'
});

SendScreen.navigationOptions = navigationOptions;
