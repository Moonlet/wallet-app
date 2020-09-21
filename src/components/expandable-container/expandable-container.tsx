import React from 'react';
import { View, Animated, Easing } from 'react-native';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import stylesProvider from './styles';
import { bind } from 'bind-decorator';

interface IExternalProps {
    isExpanded: boolean;
}

interface IState {
    height: any;
    maxHeight: any;
}

export class ExpandableContainerComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            height: new Animated.Value(0),
            maxHeight: null
        };
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.isExpanded !== prevProps.isExpanded) {
            this.props.isExpanded ? this.open() : this.close();
        }
    }

    private close() {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: 300,
            toValue: 0
        }).start();
    }

    private open() {
        Animated.timing(this.state.height, {
            easing: Easing.inOut(Easing.ease),
            duration: 270,
            toValue: this.state.maxHeight
        }).start();
    }

    @bind
    private setMaxHeight(event: any) {
        const layoutHeight = event.nativeEvent.layout.height;
        this.setState({ maxHeight: Math.min(layoutHeight, layoutHeight) });
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.animatedView, { height: this.state.height }]}>
                    <View onLayout={this.setMaxHeight}>{this.props.children}</View>
                </Animated.View>
            </View>
        );
    }
}

export const ExpandableContainer = smartConnect<IExternalProps>(ExpandableContainerComponent, [
    withTheme(stylesProvider)
]);
