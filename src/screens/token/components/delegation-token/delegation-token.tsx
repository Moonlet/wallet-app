import React from 'react';
import { View } from 'react-native';
import { HeaderRight } from '../../../../components/header-right/header-right';
import stylesProvider from './styles';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { Blockchain } from '../../../../core/blockchain/types';
import { ICON_SIZE, BASE_DIMENSION } from '../../../../styles/dimensions';
import { themes } from '../../../../navigation/navigation';
import { sendTransferTransaction, getBalance } from '../../../../redux/wallets/actions';
import { TestnetBadge } from '../../../../components/testnet-badge/testnet-badge';
import { ITokenConfig } from '../../../../core/blockchain/types/token';
import FastImage from '../../../../core/utils/fast-image';

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    return {};
};

const mapDispatchToProps = {
    sendTransferTransaction,
    getBalance
};

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
    token: ITokenConfig;
}

const navigationOptions = ({ navigation, theme }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-horizontal"
            onPress={navigation.state.params ? navigation.state.params.openSettingsMenu : undefined}
        />
    ),
    headerTitle: () => (
        <View style={{ flexDirection: 'row' }}>
            <FastImage
                style={{ height: ICON_SIZE, width: ICON_SIZE, marginRight: BASE_DIMENSION }}
                resizeMode="contain"
                source={navigation.state.params.tokenLogo}
            />
            <Text
                style={{
                    fontSize: 22,
                    lineHeight: 28,
                    color: themes[theme].colors.text,
                    letterSpacing: 0.38,
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                {`${translate('App.labels.account')} ${navigation.state.params.accountIndex + 1}`}
            </Text>
        </View>
    )
});

export class DelegationTokenScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    constructor(
        props: INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <TestnetBadge />
            </View>
        );
    }
}

export const DelegationTokenScreen = smartConnect(DelegationTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
