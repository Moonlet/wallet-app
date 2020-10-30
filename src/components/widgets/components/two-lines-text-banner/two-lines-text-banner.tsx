import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { I2LinesTextBannerData, ICta } from '../../types';
import { NavigationService } from '../../../../navigation/navigation-service';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ChainIdType } from '../../../../core/blockchain/types';
import { formatDataJSXElements } from '../../utils';

interface ExternalProps {
    data: I2LinesTextBannerData;
    cta: ICta;
    account: IAccountState;
    chainId: ChainIdType;
}

const TwoLinesStakeBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { cta, data, styles, theme } = props;

    return (
        <TouchableOpacity
            onPress={() => {
                if (cta.type === 'navigateTo') {
                    const blockchainConfig = getBlockchain(props.account.blockchain);

                    const token: ITokenState =
                        props.account.tokens[props.chainId][blockchainConfig.config.coin];

                    NavigationService.navigate(cta.params.screen, {
                        ...cta.params.params,
                        blockchain: props.account.blockchain,
                        accountIndex: props.account.index,
                        token
                    });
                }
            }}
            activeOpacity={0.9}
        >
            <View
                style={[
                    styles.container,
                    { backgroundColor: data?.backgroundColor || theme.colors.cardBackground }
                ]}
            >
                <View style={styles.textContainer}>
                    <View style={styles.row}>
                        {formatDataJSXElements(data.firstLine, styles.mainText)}
                    </View>
                    <View style={styles.row}>
                        {formatDataJSXElements(data.secondLine, styles.secondaryText)}
                    </View>
                </View>

                {data?.icon?.value && (
                    <Icon name={data.icon.value} size={normalize(50)} style={styles.icon} />
                )}
            </View>
        </TouchableOpacity>
    );
};

export const TwoLinesStakeBanner = smartConnect<ExternalProps>(TwoLinesStakeBannerComponent, [
    withTheme(stylesProvider)
]);
