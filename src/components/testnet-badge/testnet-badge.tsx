import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { connect } from 'react-redux';
import { Blockchain } from '../../core/blockchain/types';
import { getSelectedBlockchain } from '../../redux/wallets/selectors';
import { IReduxState } from '../../redux/state';
import { getNetworkName } from '../../redux/preferences/selectors';
import { translate } from '../../core/i18n';
import { Capitalize } from '../../core/utils/format-string';

export interface IReduxProps {
    blockchain: Blockchain;
    networkName: string;
    testNet: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = getSelectedBlockchain(state) as Blockchain;

    return {
        blockchain,
        networkName: getNetworkName(state, blockchain),
        testNet: state.preferences.testNet
    };
};

export const TestnetBadgeComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    if (props.testNet) {
        return (
            <View style={props.styles.container}>
                <Text style={props.styles.text}>
                    {translate('App.labels.youAreOn', {
                        blockchain: props.blockchain ? Capitalize(props.blockchain) : '',
                        networkName: props.networkName
                    })}
                </Text>
            </View>
        );
    } else {
        return <View />;
    }
};

export const TestnetBadge = smartConnect(TestnetBadgeComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
