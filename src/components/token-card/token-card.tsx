import React from 'react';
import { View } from 'react-native';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { Icon } from '../icon';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Amount } from '../amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { SmartImage } from '../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { getTokenConfig } from '../../redux/tokens/static-selectors';

export interface IProps {
    blockchain: Blockchain;
    token: ITokenState;
    account: IAccountState;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    index: number;
}

export const TokenCardComponent = (
    props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const styles = props.styles;

    const tokenConfig = getTokenConfig(props.account.blockchain, props.token.symbol);

    return (
        <TouchableHighlight
            style={{ marginTop: props.index === 0 ? 0 : BASE_DIMENSION }}
            underlayColor={props.theme.colors.appBackground}
            onPress={() => {
                props.navigation.navigate('Token', {
                    accountIndex: props.account.index,
                    blockchain: props.account.blockchain,
                    token: props.token
                });
            }}
        >
            <View style={props.styles.container}>
                <SmartImage source={tokenConfig.icon} style={props.styles.imageStyle} />
                <View style={styles.accountInfoContainer}>
                    <Amount
                        style={styles.firstAmount}
                        token={props.token.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        amount={props.token.balance?.value}
                        blockchain={props.blockchain}
                    />
                    <Amount
                        style={styles.secondAmount}
                        token={props.token.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        amount={props.token.balance?.value}
                        blockchain={props.blockchain}
                        convert
                    />
                </View>
                <Icon name="chevron-right" size={normalize(18)} style={styles.icon} />
            </View>
        </TouchableHighlight>
    );
};

export const TokenCard = withTheme(stylesProvider)(TokenCardComponent);
