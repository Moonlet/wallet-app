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
import { IAccountState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { getSelectedAccount } from '../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { formatAddress } from '../../core/utils/format-address';
import { Dialog } from '../../components/dialog/dialog';
import moment from 'moment';

interface IReduxProps {
    selectedAccount: IAccountState;
}
const mapStateToProps = (state: IReduxState) => {
    return {
        selectedAccount: getSelectedAccount(state)
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

        this.state = {
            connections: [
                // {
                //     url: 'https://www.zilliqa.com/platform',
                //     timestamp: 1597770116434
                // }
            ]
        };
    }

    private async removeConnection(connection: any) {
        if (
            await Dialog.confirm(
                translate('ConnectedWebsites.disconnectTitle'),
                translate('ConnectedWebsites.disconnectBody', {
                    url: connection.url
                })
            )
        ) {
            // TODO: remove connection
        }
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
                        const date = `${moment(connection.timestamp).format('L')}, ${moment(
                            connection.timestamp
                        ).format('LTS')}`;

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
                                            {connection.url}
                                        </Text>
                                        <Text style={styles.extraInfo}>{date}</Text>
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
