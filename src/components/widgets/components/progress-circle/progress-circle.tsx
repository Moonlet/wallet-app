import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';

interface IExternalProps {
    radius: number;
    percent: number;
    borderWidth?: number;
}

interface IState {
    percent: number;
    borderWidth: number;
    leftTransformerDegree: string;
    rightTransformerDegree: string;
}

class PercentageCircleComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps,
    IState
> {
    constructor(
        props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
    ) {
        super(props);

        const percent = this.props.percent;
        let leftTransformerDegree = '0deg';
        let rightTransformerDegree = '0deg';

        if (percent >= 50) {
            rightTransformerDegree = '180deg';
            leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
        } else {
            rightTransformerDegree = percent * 3.6 + 'deg';
            leftTransformerDegree = '0deg';
        }

        this.state = {
            percent: this.props.percent,
            borderWidth: this.props.borderWidth || 4,
            leftTransformerDegree,
            rightTransformerDegree
        };
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.percent !== prevProps.percent) {
            const percent = this.props.percent;
            let leftTransformerDegree = '0deg';
            let rightTransformerDegree = '0deg';

            if (percent >= 50) {
                rightTransformerDegree = '180deg';
                leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
            } else {
                rightTransformerDegree = percent * 3.6 + 'deg';
            }

            this.setState({
                percent: this.props.percent,
                borderWidth: this.props.borderWidth || 4,
                leftTransformerDegree,
                rightTransformerDegree
            });
        }
    }

    public render() {
        const { styles, theme } = this.props;

        return (
            <View
                style={[
                    styles.circle,
                    {
                        width: this.props.radius * 2,
                        height: this.props.radius * 2,
                        borderRadius: this.props.radius,
                        backgroundColor: theme.colors.appBackground // this.props.bgcolor
                    }
                ]}
            >
                <View
                    style={[
                        styles.leftWrap,
                        {
                            width: this.props.radius,
                            height: this.props.radius * 2,
                            left: 0
                        }
                    ]}
                >
                    <View
                        style={[
                            styles.loader,
                            {
                                left: this.props.radius,
                                width: this.props.radius,
                                height: this.props.radius * 2,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                backgroundColor: theme.colors.accent, // this.props.color
                                transform: [
                                    { translateX: -this.props.radius / 2 },
                                    { rotate: this.state.leftTransformerDegree },
                                    { translateX: this.props.radius / 2 }
                                ]
                            }
                        ]}
                    ></View>
                </View>
                <View
                    style={[
                        styles.leftWrap,
                        {
                            left: this.props.radius,
                            width: this.props.radius,
                            height: this.props.radius * 2
                        }
                    ]}
                >
                    <View
                        style={[
                            styles.loader,
                            {
                                left: -this.props.radius,
                                width: this.props.radius,
                                height: this.props.radius * 2,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                backgroundColor: theme.colors.accent, // this.props.color
                                transform: [
                                    { translateX: this.props.radius / 2 },
                                    { rotate: this.state.rightTransformerDegree },
                                    { translateX: -this.props.radius / 2 }
                                ]
                            }
                        ]}
                    ></View>
                </View>
                <View
                    style={[
                        styles.innerCircle,
                        {
                            width: (this.props.radius - this.state.borderWidth) * 2,
                            height: (this.props.radius - this.state.borderWidth) * 2,
                            borderRadius: this.props.radius - this.state.borderWidth,
                            backgroundColor: theme.colors.cardBackground // this.props.innerColor
                        }
                    ]}
                >
                    {this.props.children}
                </View>
            </View>
        );
    }
}

export const PercentageCircle = smartConnect<IExternalProps>(PercentageCircleComponent, [
    withTheme(stylesProvider)
]);
