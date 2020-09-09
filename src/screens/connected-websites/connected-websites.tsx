import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '../../library';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize } from '../../styles/dimensions';
import { Icon } from '../../components/icon/icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconValues } from '../../components/icon/values';
import { IAccountState, IWalletState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { formatAddress } from '../../core/utils/format-address';
import { bgPortRequest } from '../../core/communication/bg-port';

interface IReduxProps {
    selectedAccount: IAccountState;
    selectedWallet: IWalletState;
}
const mapStateToProps = (state: IReduxState) => {
    return {
        selectedAccount: getSelectedAccount(state),
        selectedWallet: getSelectedWallet(state)
    };
};

interface IState {
    connections: any; // TODO: add type here
}

const navigationOptions = () => ({
    title: translate('ConnectedWebsites.title')
});

export class ConnectedWebsitesScreenComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        bgPortRequest({
            controller: 'AccountAccessController',
            method: 'getAccessSettings',
            origin: 'extension',
            params: []
        }).then(res => {
            const domains = [];
            for (const domain in res.data) {
                if (
                    res.data[domain].find(
                        acc =>
                            acc.address === props.selectedAccount.address &&
                            acc.blockchain === props.selectedAccount.blockchain &&
                            acc.walletPubKey === props.selectedWallet.walletPublicKey
                    )
                ) {
                    domains.push(domain);
                }
            }
            this.setState({
                connections: domains.map(domain => ({ domain }))
            });
        });

        this.state = {
            connections: [
                // {
                //     domain: 'https://www.zilliqa.com/platform',
                //     timestamp: 1597770116434
                // }
            ]
        };
    }

    private async removeConnection(connection: any) {
        // console.log(connection);
        // if (
        //     await Dialog.confirm(
        //         translate('ConnectedWebsites.disconnectTitle'),
        //         translate('ConnectedWebsites.disconnectBody', {
        //             domain: connection.domain
        //         })
        //     )
        // ) {
        //     // TODO: remove connection
        // }

        await bgPortRequest({
            controller: 'AccountAccessController',
            method: 'declineAccess',
            origin: 'extension',
            params: [
                connection.domain,
                [
                    {
                        address: this.props.selectedAccount.address,
                        blockchain: this.props.selectedAccount.blockchain,
                        walletPubKey: this.props.selectedWallet.walletPublicKey
                    }
                ]
            ]
        });
        this.setState({
            connections: this.state.connections.filter(c => {
                return c.domain !== connection.domain;
            })
        });
    }

    public render() {
        const { selectedAccount, styles, theme } = this.props;
        const { connections } = this.state;

        return (
            <View style={styles.container}>
                <Text>
                    <Text style={styles.topText}>
                        {selectedAccount.name || `Account ${selectedAccount.index + 1}`}
                    </Text>
                    <Text style={[styles.topText, { color: theme.colors.accent }]}>
                        {` ${formatAddress(selectedAccount.address, selectedAccount.blockchain)} `}
                    </Text>
                    <Text style={styles.topText}>
                        {translate('ConnectedWebsites.connectedFollowing')}
                    </Text>
                </Text>

                {connections.length !== 0 ? (
                    connections.map((connection, index: number) => {
                        // const date = `${moment(connection.timestamp).format('L')}, ${moment(
                        //     connection.timestamp
                        // ).format('LTS')}`;

                        return (
                            <View key={`connection-${index}`} style={styles.connectionsContainer}>
                                <View style={styles.connectionRow}>
                                    <Icon
                                        name={IconValues.MONITOR}
                                        size={normalize(32)}
                                        style={styles.computerIcon}
                                    />
                                    <View style={styles.connDetailscontainer}>
                                        <Text style={styles.connectionInfoText}>
                                            {connection.domain}
                                        </Text>
                                        {/* <Text style={styles.extraInfo}>{date}</Text> */}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.removeConnection(connection)}
                                    >
                                        <Icon
                                            name={IconValues.FLASH_OFF}
                                            size={normalize(32)}
                                            style={styles.flashIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image
                            style={styles.moonletImage}
                            source={require('../../assets/images/png/moonlet_space_gray.png')}
                        />
                        <Text style={styles.notConnectedText}>
                            {translate('ConnectedWebsites.notConnected')}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

export const ConnectedWebsitesScreen = smartConnect(ConnectedWebsitesScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
