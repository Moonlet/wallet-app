import React from 'react';
import { connect } from 'react-redux'
import { Button, View, Text } from 'react-native';
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';
import { addMoney } from '../../redux/actions/wallet';

const mapStateToProps = (state: any) => {
  return { money: state.wallet.money }; 
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    addMoney: () => {
      dispatch(addMoney(100)) 
    }
  }
}

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>,
  money: number,
  addMoney: any
}

class HomeScreen extends React.Component<Props> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Text>Money: {this.props.money}</Text>
        <Button
          title="Go to Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
        <Button
          title="Add money"
          onPress={() => this.props.addMoney()}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
