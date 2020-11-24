import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IOneLineTextBannerData, IScreenModule } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { handleCta } from '../../../../redux/ui/screens/data/actions';
import { connect } from 'react-redux';
import { IReduxState } from '../../../../redux/state';
import { getStateSelectors } from '../ui-state-selectors/index';

interface IExternalProps {
    module: IScreenModule;
    actions: {
        handleCta: typeof handleCta;
    };
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return getStateSelectors(state, ownProps.module, {
        flowId: ownProps?.options?.flowId
    });
};

const OneLineTextBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { actions, module, styles } = props;
    const data = module.data as IOneLineTextBannerData;

    const moduleJSX = (
        <View style={[styles.container, module?.style && formatStyles(module.style)]}>
            {formatDataJSXElements(
                data.line,
                styles.text,
                module?.state && { translateKeys: props as any }
            )}
        </View>
    );

    if (module?.cta) {
        return (
            <TouchableOpacity
                onPress={() => actions.handleCta(module.cta, props?.options)}
                activeOpacity={0.9}
            >
                {moduleJSX}
            </TouchableOpacity>
        );
    } else {
        return moduleJSX;
    }
};

export const OneLineTextBanner = smartConnect<IExternalProps>(OneLineTextBannerComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
