import * as React from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import stylesProvider from './styles';

interface IExternalProps {
    children: JSX.Element | JSX.Element[];
    backgroundColor?: string;
    highlightColor?: string;
    speed?: number;
}

export class SkeletonPlaceholderComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    private animatedValue = new Animated.Value(0);

    public componentDidMount() {
        Animated.loop(
            Animated.timing(this.animatedValue, {
                toValue: 1,
                duration: this.props?.speed || 700,
                easing: Easing.ease,
                useNativeDriver: true
            })
        ).start();
    }

    public render() {
        const translateX = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-350, 350]
        });

        const backgroundColor =
            this.props?.backgroundColor || this.props.theme.colors.textSecondary;
        const highlightColor = this.props?.highlightColor || this.props.theme.colors.accent;

        const getChildren = (element: JSX.Element | JSX.Element[]) => {
            return React.Children.map(element, (child: JSX.Element, index: number) => {
                const style = child.props.style;

                if (child.props.children) {
                    return (
                        <View key={index} style={style}>
                            {getChildren(child.props.children)}
                        </View>
                    );
                } else {
                    return (
                        <View key={index} style={{ position: 'relative' }}>
                            <View style={[style, { backgroundColor, overflow: 'hidden' }]}>
                                <Animated.View
                                    style={[
                                        StyleSheet.absoluteFill,
                                        {
                                            transform: [{ translateX }]
                                        }
                                    ]}
                                >
                                    <LinearGradient
                                        colors={
                                            [
                                                backgroundColor,
                                                highlightColor,
                                                backgroundColor
                                            ] as string[]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ flex: 1 }}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    );
                }
            });
        };

        return <React.Fragment>{getChildren(this.props.children)}</React.Fragment>;
    }
}

export const SkeletonPlaceholder = smartConnect<IExternalProps>(SkeletonPlaceholderComponent, [
    withTheme(stylesProvider)
]);
