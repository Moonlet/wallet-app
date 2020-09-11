import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { Text } from '../../library';
import Icon from '../icon/icon';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';
import { translate } from '../../core/i18n';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { TokenScreenComponentType } from '../../core/blockchain/types/token';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../core/utils/format-number';
import { NavigationService } from '../../navigation/navigation-service';

const MIN_STAKE = '0.01';

interface IExternalProps {
    blockchain: Blockchain;
    account: IAccountState;
    chainId: ChainIdType;
    style?: any;
}

export const QuickDelegateBannerComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    const blockchainConfig = getBlockchain(props.blockchain);

    if (!props.account) {
        // account is not setup
        return null;
    }

    const token: ITokenState = props.account.tokens[props.chainId][blockchainConfig.config.coin];
    const tokenConfig = getTokenConfig(props.blockchain, token.symbol);

    if (tokenConfig.ui.tokenScreenComponent === TokenScreenComponentType.DELEGATE) {
        const amount = blockchainConfig.account.amountFromStd(
            new BigNumber(token.balance.value),
            tokenConfig.decimals
        );

        if (new BigNumber(amount).isGreaterThanOrEqualTo(new BigNumber(MIN_STAKE))) {
            const formatAmount = formatNumber(amount, {
                currency: blockchainConfig.config.coin,
                maximumFractionDigits: 4
            });

            const navigateTo = blockchainConfig.config.ui.token.accountCTA.mainCta.navigateTo;

            return (
                <TouchableHighlight
                    onPress={() =>
                        NavigationService.navigate(navigateTo.screen, {
                            ...navigateTo.params,
                            blockchain: props.blockchain,
                            accountIndex: props.account.index,
                            token
                        })
                    }
                    underlayColor={props.theme.colors.appBackground}
                >
                    <View style={[styles.container, props?.style]}>
                        <View style={styles.textContainer}>
                            <Text style={styles.mainText}>
                                {translate(`QuickDelegateBanner.mainText.${props.blockchain}`)}
                            </Text>
                            <Text style={styles.secondaryText}>
                                {translate('QuickDelegateBanner.availableAmount', {
                                    amount: formatAmount
                                })}
                            </Text>
                        </View>
                        <Icon name={IconValues.VOTE} size={normalize(50)} style={styles.icon} />
                    </View>
                </TouchableHighlight>
            );
        } else return null;
    } else return null;
};

export const QuickDelegateBanner = smartConnect<IExternalProps>(QuickDelegateBannerComponent, [
    withTheme(stylesProvider)
]);
