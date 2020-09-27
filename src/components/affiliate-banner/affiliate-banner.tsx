import React from 'react';
import { Image } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { openURL } from '../../core/utils/linking-handler';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { IAffiliateBannerType } from './types';

interface IExternalProps {
    type: IAffiliateBannerType;
    style?: any;
}

export const AffiliateBannerComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <TouchableHighlight
            onPress={() => openURL(props.type.url)}
            underlayColor={props.theme.colors.appBackground}
            style={props?.style}
        >
            <Image source={props.type.image} style={props.styles.image} resizeMode="contain" />
        </TouchableHighlight>
    );
};

export const AffiliateBanner = smartConnect<IExternalProps>(AffiliateBannerComponent, [
    withTheme(stylesProvider)
]);
