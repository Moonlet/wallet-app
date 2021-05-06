import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { withNavigationParams } from '../../../navigation/with-navigation-params';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';
import klona from 'klona';
import {
    handleDynamicCta,
    IHandleCtaActionContext
} from '../../../redux/ui/screens/data/actions/index';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';

interface IReduxProps {
    handleDynamicCta: typeof handleDynamicCta;
}

const mapDispatchToProps = {
    handleDynamicCta
};

const navigationOptions = () => ({ header: null });

class PosBasicActionSmartScreenWrapperComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private sanitisedProps() {
        const props: any = klona(this.props);

        if (props?.theme) delete props.theme;
        if (props?.styles) delete props.styles;
        if (props?.navigation) delete props.navigation;

        return props;
    }

    public componentDidMount() {
        const context: IHandleCtaActionContext = {
            action: {
                type: undefined,
                params: {
                    params: {
                        context: { screen: 'ZilContractStakingPause' },
                        extraParams: this.sanitisedProps()
                    }
                }
            }
        };

        this.props.handleDynamicCta(context);
    }

    public render() {
        return (
            <View style={this.props.styles.container}>
                <LoadingIndicator />
            </View>
        );
    }
}

export const PosBasicActionSmartScreenWrapper = smartConnect(
    PosBasicActionSmartScreenWrapperComponent,
    [connect(undefined, mapDispatchToProps), withTheme(stylesProvider), withNavigationParams()]
);
