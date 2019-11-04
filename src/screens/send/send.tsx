import React from 'react';
import { View } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { ITheme } from '../../core/theme/itheme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { Text } from '../../library';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

const mapStateToProps = (state: IReduxState) => ({});

export class SendScreenComponent extends React.Component<IProps> {
    public render() {
        const styles = this.props.styles;
        return (
            <View style={styles.container}>
                <Text style={styles.address}>Reusable component</Text>
            </View>
        );
    }
}

export const SendScreen = smartConnect(SendScreenComponent, [
    connect(
        mapStateToProps,
        {}
    ),
    withTheme(stylesProvider)
]);

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Send'
});

SendScreen.navigationOptions = navigationOptions;
