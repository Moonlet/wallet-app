import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../core/i18n';
import { IThemeProps, withTheme } from '../../../../../core/theme/with-theme';
import { smartConnect } from '../../../../../core/utils/smart-connect';

interface IProps {
    //
    amount: string;
}

interface IState {
    //
    insufficientFunds: boolean;
}

export const navigationOptions = ({ navigation }: any) => ({
    title: translate(navigation.state.params.title || 'App.labels.send')
});
export class AmountWithFeesComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: IProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);

        this.state = {
            insufficientFunds: false
        };
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                ></KeyboardAwareScrollView>
            </View>
        );
    }
}

export const AmountWithFees = smartConnect(AmountWithFeesComponent, [withTheme(stylesProvider)]);
