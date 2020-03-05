import { View } from 'react-native';
import React from 'react';

export interface IProps {
    containerStyle: {};
    pieStyle: {};
    outerRadius: number;
    innerRadius: number;
    data: any;
    animate: any;
}

export default class Pie extends React.Component<IProps> {
    render() {
        return <View></View>;
    }
}
