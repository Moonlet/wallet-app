import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from '../index';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { BORDER_RADIUS } from '../../styles/dimensions';

export interface ITabSelectProps {
    options: any;
    selected: any;
    onSelectionChange: (val: any) => void;
    styles: ReturnType<typeof stylesProvider>;
}
export const TabSelectComponent = (props: ITabSelectProps) => (
    <View style={props.styles.container}>
        {Object.keys(props.options).map((key, index) => (
            <TouchableOpacity
                key={index}
                onPress={() => {
                    props.onSelectionChange(key);
                }}
                style={[
                    props.styles.tabButton,
                    props.selected === key && props.styles.tabButtonSelected,
                    {
                        borderTopLeftRadius: index === 0 ? BORDER_RADIUS / 2 : 0,
                        borderBottomLeftRadius: index === 0 ? BORDER_RADIUS / 2 : 0,
                        borderTopRightRadius:
                            index === Object.keys(props.options).length - 1 ? BORDER_RADIUS / 2 : 0,
                        borderBottomRightRadius:
                            index === Object.keys(props.options).length - 1 ? BORDER_RADIUS / 2 : 0
                    }
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
