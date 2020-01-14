import React from 'react';
import { View, Clipboard } from 'react-native';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { Button } from '../../library/button/button';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import QRCode from 'react-native-qrcode-svg';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IAccountState } from '../../redux/wallets/state';
import { AccountAddress } from '../../components/account-address/account-address';
import { IReduxState } from '../../redux/state';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { getAccount } from '../../redux/wallets/selectors';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { ITokenConfig } from '../../core/blockchain/types/token';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenConfig;
}

export interface IReduxProps {
    account: IAccountState;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain)
    };
};

interface IState {
    copied: boolean;
}

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.receive')
});
export class ReceiveScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IProps & IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps<INavigationParams> & IProps & IReduxProps) {
        super(props);

        this.state = {
            copied: false
        };
    }

    public render() {
        const styles = this.props.styles;
        const account = this.props.account;
        return (
            <View style={styles.container}>
                <AccountAddress
                    account={account}
                    token={this.props.navigation.state.params.token}
                />
                <View style={styles.qrcode}>
                    <QRCode value={account.address} size={300} />
                </View>
                <View style={styles.bottom}>
                    <Button
                        testID="copy-clipboard"
                        style={styles.bottomButton}
                        onPress={() => {
                            Clipboard.setString(account.address);
                            this.setState({ copied: true });
                        }}
                    >
                        {this.state.copied
                            ? translate('App.buttons.copiedBtn')
                            : translate('App.buttons.clipboardBtn')}
                    </Button>
                </View>
            </View>
        );
    }
}

export const ReceiveScreen = smartConnect(ReceiveScreenComponent, [
    connect(mapStateToProps, {}),
    withTheme(stylesProvider),
    withNavigationParams()
]);
