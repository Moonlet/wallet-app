import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

export interface ITabSelectProps {
    options: any;
    selected: any;
    onSelectionChange: (val: any) => void;
    styles: ReturnType<typeof stylesProvider>;
}
export const TabSelectComponent = (props: ITabSelectProps) => (
    <View style={props.styles.container}>
        {Object.keys(props.options).map((key, i) => (
            <TouchableOpacity
                key={i}
                onPress={() => {
                    props.onSelectionChange(key);
                }}
                style={[
                    props.styles.tabButton,
                    props.selected === key && props.styles.tabButtonSelected
                ]}
            >
                <Text
                    style={[
                        props.styles.tabButtonText,
                        props.selected === key && props.styles.tabButtonTextSelected
                    ]}
                >
                    {props.options[key].title}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

export const TabSelect = withTheme(stylesProvider)(TabSelectComponent);
