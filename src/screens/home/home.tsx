import React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { mapStateToProps, mapDispatchToProps } from '../../utils/redux-decorators';

import { addMoney } from '../../redux/actions/wallet';
import { fetchPrice } from '../../redux/actions/market';
import { AppContext } from '../../app-context';

interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    money: number;
    ethusd: number;
    addMoney: any;
    fetchEthPrice: any;
}

@mapStateToProps(state => ({
    money: state.wallet.money,
    ethusd: state.market.price.eth
}))
@mapDispatchToProps((dispatch: any) => ({
    addMoney: () => {
        dispatch(addMoney(100));
    },
    fetchEthPrice: () => {
        dispatch(fetchPrice());
    }
}))
export default class HomeScreen extends React.Component<IProps> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    constructor(props: IProps) {
        super(props);

        this.props.fetchEthPrice();
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
                <Button title="Add money" onPress={() => this.props.addMoney()} />
            </View>
        );
    }
}
