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

interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
}

interface IReduxProps {
    account: IAccountState;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
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
    const { account, styles } = props;

    const [copied, setCopied] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <AccountAddress account={account} token={props.navigation.state.params.token} />

            <View>
                <View style={styles.qrCodeContainer}>
                    <View style={styles.qrCode}>
                        <QRCode
                            value={account.address}
                            size={
                                Platform.OS === 'web'
                                    ? (SCREEN_WIDTH * 2) / 3
                                    : SCREEN_WIDTH - BASE_DIMENSION * 10
                            }
                        />
                    </View>
                </View>

                <View style={styles.fullAddressContainer}>
                    <Text style={styles.fullAddress}>{account.address}</Text>
                </View>
            </View>

            <Button
                testID="copy-clipboard"
                wrapperStyle={styles.bottomButton}
                onPress={() => {
                    Clipboard.setString(account.address);
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
