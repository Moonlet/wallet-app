import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IAccountState } from '../../redux/wallets/state';
import { Icon } from '../icon';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Amount } from '../amount/amount';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { Blockchain } from '../../core/blockchain/types';
import { SmartImage } from '../../library/image/smart-image';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

export interface IProps {
    blockchain: Blockchain;
    token: ITokenConfig;
    account: IAccountState;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    index: number;
}

export const TokenCardComponent = (props: IProps) => {
    const styles = props.styles;

    const TokenIcon = getBlockchain(props.blockchain).config.tokens[props.token.symbol]?.icon
        ?.iconComponent;

    return (
        <TouchableOpacity
            style={[styles.container, { marginTop: props.index === 0 ? 0 : BASE_DIMENSION }]}
            onPress={() => {
                props.navigation.navigate('Token', {
                    accountIndex: props.account.index,
                    blockchain: props.account.blockchain,
                    token: props.token
                });
            }}
        >
            <SmartImage
                source={{
                    uri: props.token?.icon?.uri,
                    iconComponent: TokenIcon
                }}
                style={props.styles.imageStyle}
            />
            <View style={styles.accountInfoContainer}>
                <Amount
                    style={styles.firstAmount}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                    amount={props.token.balance?.value}
                    blockchain={props.blockchain}
                />
                <Amount
                    style={styles.secondAmount}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                    amount={props.token.balance?.value}
                    blockchain={props.blockchain}
                    convert
                />
            </View>
            <Icon name="chevron-right" size={normalize(18)} style={styles.icon} />
        </TouchableOpacity>
    );
};

export const TokenCard = withTheme(stylesProvider)(TokenCardComponent);
