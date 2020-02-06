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
import { getChainName } from '../../redux/preferences/selectors';
import { translate } from '../../core/i18n';

export interface IReduxProps {
    blockchain: Blockchain;
    chainName: string;
    testNet: boolean;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = getSelectedBlockchain(state) as Blockchain;

    return {
        blockchain,
        chainName: getChainName(state, blockchain),
        testNet: state.preferences.testNet
    };
};

export class TestnetBadgeComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public render() {
        const styles = this.props.styles;

        if (this.props.testNet) {
            return (
                <View style={styles.container}>
                    <Text>
                        <Text style={styles.text}>{translate('App.labels.youAreOn')}</Text>
                        <Text style={[styles.text, { textTransform: 'capitalize' }]}>
                            {` ${this.props.blockchain} `}
                        </Text>
                        <Text style={styles.text}>
                            {`${this.props.chainName} ${translate('NetworkOptions.testnet')}`}
                        </Text>
                    </Text>
                </View>
            );
        } else {
            return <View />;
        }
    }
}

export const TestnetBadge = smartConnect(TestnetBadgeComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
