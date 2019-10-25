import React from 'react';
import { View } from 'react-native';

import stylesProvider from './styles';
import { IAccountState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { withTheme } from '../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';

interface IExternalProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

interface IReduxProps {
    account: IAccountState;
}

export class AccountScreenComponent extends React.Component<IReduxProps & IExternalProps> {
    public render() {
        return (
            <View style={this.props.styles.container}>
                <Text>Account screen</Text>
            </View>
        );
    }
}

export const mapStateToProps = (
    state: IReduxState,
    ownProps: IExternalProps
): IReduxProps & IExternalProps => {
    const account = {} as any;

    return {
        ...ownProps,
        account
    };
};

export const AccountScreen = smartConnect(AccountScreenComponent, [
    connect(
        mapStateToProps,
        null
    ),
    withTheme(stylesProvider)
]);
