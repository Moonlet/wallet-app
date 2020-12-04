import React from 'react';
import { View, ScrollView } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { ICta, IScreenModule } from '../../components/widgets/types';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { renderCta, renderModule } from '../../components/widgets/render-module';
import { handleCta } from '../../redux/ui/screens/data/handle-cta';
import { connect } from 'react-redux';

interface INavigationParams {
    module: IScreenModule;
    cta?: ICta;
}

interface IReduxProps {
    handleCta: typeof handleCta;
}

const mapDispatchToProps = {
    handleCta
};

const navigationOptions = () => ({ title: translate('App.labels.promoDetails') });

class PromoDetailsScreenComponent extends React.Component<
    IReduxProps &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {renderModule(this.props.module, undefined, {
                        handleCta: this.props.handleCta
                    })}
                </ScrollView>
                {this.props?.cta && renderCta(this.props.cta, this.props.handleCta)}
            </View>
        );
    }
}

export const PromoDetailsScreen = smartConnect(PromoDetailsScreenComponent, [
    connect(null, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
