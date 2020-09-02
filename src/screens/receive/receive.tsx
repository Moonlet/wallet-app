import React, { useState } from 'react';
import { View, Clipboard, Platform } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Text, Button } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import QRCode from 'react-native-qrcode-svg';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { AccountAddress } from '../../components/account-address/account-address';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { getAccount } from '../../redux/wallets/selectors';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { BASE_DIMENSION, SCREEN_WIDTH } from '../../styles/dimensions';

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
}

export interface IReduxProps {
    account: IAccountState;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain)
    };
};

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.receive')
});

export const ReceiveScreenComponent = (
    props: INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [copied, setCopied] = useState(false);

    return (
        <View style={props.styles.container}>
            <AccountAddress account={props.account} token={props.navigation.state.params.token} />
            <View style={props.styles.content}>
                <View style={props.styles.qrCodeContainer}>
                    <View style={props.styles.qrCode}>
                        <QRCode
                            value={props.account.address}
                            size={
                                Platform.OS === 'web'
                                    ? (SCREEN_WIDTH * 2) / 3
                                    : SCREEN_WIDTH - BASE_DIMENSION * 10
                            }
                        />
                    </View>
                </View>

                <View style={props.styles.fullAddressContainer}>
                    <Text style={props.styles.fullAddress}>{props.account.address}</Text>
                </View>
            </View>

            <Button
                testID="copy-clipboard"
                style={props.styles.bottomButton}
                onPress={() => {
                    Clipboard.setString(props.account.address);
                    setCopied(true);
                }}
            >
                {copied
                    ? translate('App.buttons.copiedBtn')
                    : translate('App.buttons.clipboardBtn')}
            </Button>
        </View>
    );
};

ReceiveScreenComponent.navigationOptions = navigationOptions;

export const ReceiveScreen = smartConnect(ReceiveScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
