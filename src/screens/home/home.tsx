import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { mapStateToProps, mapDispatchToProps } from '../../redux/utils/redux-decorators';
import { IReduxState } from '../../redux/state';
import { IWalletState } from '../../redux/wallets/state';
import { Icon } from '../../components/icon';
interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    money: number;
    ethusd: number;
}

interface IReduxProps {
    wallet: IWalletState;
}

@mapStateToProps(
    (state: IReduxState): IReduxProps => ({
        wallet: state.wallets[state.app.currentWalletIndex]
    })
)
export default class HomeScreen extends React.Component<IProps & IReduxProps> {
    constructor(props: IProps & IReduxProps) {
        super(props);
    }

    public render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen</Text>
                <Text>ETH: {this.props.ethusd}</Text>
                <Text>Money: {this.props.money}</Text>
                <Text>Context: {JSON.stringify(this.context)}</Text>
                <Button
                    title="Go to Settings"
                    onPress={() => this.props.navigation.navigate('Settings')}
                />

                <Icon name="bin" size={25} />
                <Button
                    title="Add money"
                    onPress={() => {
                        /* */
                    }}
                />
            </View>
        );
    }
}
