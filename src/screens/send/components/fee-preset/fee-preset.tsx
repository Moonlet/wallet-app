import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';
import { ITokenConfig } from '../../../../core/blockchain/types/token';

export interface IExternalProps {
    token: ITokenConfig;
    amount: BigNumber;
    blockchain: Blockchain;
    title: string;
    presetKey: string;
    selected: boolean;
    onSelect: (key: string) => any;
}

interface IState {
    presetSelected: boolean;
}

export class FeePresetComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            presetSelected: this.props.selected
        };
    }

    public render() {
        const styles = this.props.styles;
        return (
            <TouchableOpacity
                testID="advanced-fees"
                onPress={() => this.props.onSelect(this.props.presetKey)}
                style={
                    this.props.selected
                        ? [styles.container, styles.containerSelected]
                        : styles.container
                }
            >
                <Text
                    style={
                        this.props.selected
                            ? [styles.feeTitle, styles.textSelected]
                            : styles.feeTitle
                    }
                >
                    {this.props.title}
                </Text>
                <Amount
                    style={this.props.selected ? [styles.fee, styles.textSelected] : styles.fee}
                    amount={this.props.amount}
                    blockchain={this.props.blockchain}
                    token={this.props.token.symbol} // TODO:  not working
                    tokenDecimals={this.props.token.decimals}
                />
                <View style={styles.containerFeeConverted}>
                    <Text
                        style={
                            this.props.selected
                                ? [styles.feeConverted, styles.textSelected]
                                : styles.feeConverted
                        }
                    >
                        {`~`}
                    </Text>
                    <Amount
                        style={
                            this.props.selected
                                ? [styles.feeConverted, styles.textSelected]
                                : styles.feeConverted
                        }
                        amount={this.props.amount}
                        blockchain={this.props.blockchain}
                        token={this.props.token.symbol}
                        tokenDecimals={this.props.token.decimals}
                        convert
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

export const FeePreset = withTheme(stylesProvider)(FeePresetComponent);
