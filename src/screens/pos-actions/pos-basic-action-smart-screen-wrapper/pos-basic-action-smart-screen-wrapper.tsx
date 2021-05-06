import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { withNavigationParams } from '../../../navigation/with-navigation-params';
import { NavigationService } from '../../../navigation/navigation-service';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';
import klona from 'klona';

class PosBasicActionSmartScreenWrapperComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private sanitisedProps() {
        const props: any = klona(this.props);

        if (props?.theme) delete props.theme;
        if (props?.styles) delete props.styles;
        if (props?.navigation) delete props.navigation;

        return props;
    }

    public componentDidMount() {
        NavigationService.replace('SmartScreen', {
            context: {
                screen: 'ZilContractStakingPause',
                key: 'zil-contract-staking-pause',
                params: this.sanitisedProps()
            },
            newFlow: true
        });
    }

    public render() {
        return <View style={this.props.styles.container} />;
    }
}

export const PosBasicActionSmartScreenWrapper = smartConnect(
    PosBasicActionSmartScreenWrapperComponent,
    [withTheme(stylesProvider), withNavigationParams()]
);
