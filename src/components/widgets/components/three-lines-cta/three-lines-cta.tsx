import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button } from '../../../../library';
import { I3LinesCtaData, ICta, IScreenModule, ISmartScreenActions } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { connect } from 'react-redux';
import { IReduxState } from '../../../../redux/state';
import { getStateSelectors } from '../ui-state-selectors';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return getStateSelectors(state, ownProps.module, {
        flowId: ownProps?.options?.flowId,
        screenKey: ownProps?.options?.screenKey
    });
};

const ThreeLinesCtaComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { actions, module, styles } = props;
    const data = module.data as I3LinesCtaData;
    const cta = module.cta as ICta;

    const handleOnPress = () => actions.handleCta(cta);

    return (
        <View style={[styles.container, formatStyles(module?.style)]}>
            <View style={styles.generalFlex}>
                <View style={styles.row}>
                    {formatDataJSXElements(
                        data.firstLine,
                        styles.firstLineText,
                        module?.state && { translateKeys: props as any }
                    )}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(
                        data.secondLine,
                        styles.secondLine,
                        module?.state && { translateKeys: props as any }
                    )}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(
                        data.thirdLine,
                        styles.thirdLine,
                        module?.state && { translateKeys: props as any }
                    )}
                </View>
            </View>

            <View style={styles.actionButtonContainer}>
                <Button
                    primary={cta?.buttonProps?.primary}
                    secondary={cta?.buttonProps?.secondary}
                    disabled={cta?.buttonProps?.disabled}
                    disabledSecondary={cta?.buttonProps?.disabledSecondary}
                    leftIcon={cta?.buttonProps?.leftIcon}
                    wrapperStyle={formatStyles(cta?.buttonProps?.wrapperStyle)}
                    style={[
                        cta?.buttonProps?.colors?.bg && {
                            backgroundColor: cta.buttonProps.colors.bg,
                            borderColor: cta.buttonProps.colors.bg
                        },
                        formatStyles(cta?.buttonProps?.buttonStyle)
                    ]}
                    textStyle={formatStyles(cta?.buttonProps?.textStyle)}
                    onPress={handleOnPress}
                >
                    {cta.label}
                </Button>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<IExternalProps>(ThreeLinesCtaComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
