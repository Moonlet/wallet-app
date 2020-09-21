import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { connect } from 'react-redux';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { IReduxState } from '../../redux/state';
import { translate } from '../../core/i18n';
import { IWalletState } from '../../redux/wallets/state';
import { WalletType } from '../../core/wallet/types';
import Icon from '../icon/icon';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';

export interface IReduxProps {
    wallet: IWalletState;
}

const mapStateToProps = (state: IReduxState) => ({
    wallet: getSelectedWallet(state)
});

export const LedgerBadgeComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    if (props?.wallet.type === WalletType.HW) {
        return (
            <View testID="ledger-badge" style={props.styles.container}>
                <Text style={props.styles.text}>{translate('App.labels.youAreUsingLedger')}</Text>
                <Icon
                    name={IconValues.LEDGER_LOOGO}
                    size={normalize(16)}
                    style={props.styles.icon}
                />
                <Text style={props.styles.text}>{`Ledger`}</Text>
            </View>
        );
    } else {
        return <View />;
    }
};

export const LedgerBadge = smartConnect(LedgerBadgeComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
