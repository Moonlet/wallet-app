import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { I2LinesTextBannerData, ICta, IScreenModule } from '../../types';
import { NavigationService } from '../../../../navigation/navigation-service';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { IAccountState, ITokenState } from '../../../../redux/wallets/state';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { ChainIdType } from '../../../../core/blockchain/types';
import { formatDataJSXElements, formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
    account: IAccountState;
    chainId: ChainIdType;
}

const TwoLinesStakeBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles, theme } = props;
    const data = module.data as I2LinesTextBannerData;
    const cta = module.cta as ICta;

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
                    { backgroundColor: data?.backgroundColor || theme.colors.cardBackground },
                    module?.style && formatStyles(module.style)
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

export const TwoLinesStakeBanner = smartConnect<IExternalProps>(TwoLinesStakeBannerComponent, [
    withTheme(stylesProvider)
]);
