import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IProgressBarData } from '../../types';
import { formatStyles } from '../../utils';
import BigNumber from 'bignumber.js';

interface IExternalProps {
    module: IScreenModule;
}

interface IState {
    barWidth: number;
}

class ProgressBarComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            barWidth: undefined
        };
    }

    public render() {
        const { module, styles } = this.props;

        const data = module.data as IProgressBarData;

        return (
            <View style={[styles.container, formatStyles(module?.style)]}>
                <View
                    style={[styles.barContainer, formatStyles(data?.backgroundStyle)]}
                    onLayout={event => this.setState({ barWidth: event.nativeEvent.layout.width })}
                >
                    <View
                        style={[
                            styles.progressBar,
                            {
                                width:
                                    this.state.barWidth && data.percentage
                                        ? Number(
                                              new BigNumber(Number(data.percentage))
                                                  .multipliedBy(100)
                                                  .dividedBy(100)
                                                  .multipliedBy(this.state.barWidth)
                                                  .dividedBy(100)
                                                  .toFixed(0)
                                          )
                                        : 0
                            },
                            formatStyles(data?.barStyle)
                        ]}
                    />
                </View>
            </View>
        );
    }
}

export const ProgressBarModule = smartConnect<IExternalProps>(ProgressBarComponent, [
    withTheme(stylesProvider)
]);
