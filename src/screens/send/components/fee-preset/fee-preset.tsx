import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import { Blockchain } from '../../../../core/blockchain/types';
import { ITokenState } from '../../../../redux/wallets/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';

export interface IExternalProps {
    token: ITokenState;
    amount: string;
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
        const tokenConfig = getTokenConfig(this.props.blockchain, this.props.token.symbol);
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
                    token={tokenConfig.symbol} // TODO:  not working
                    tokenDecimals={tokenConfig.decimals}
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
                        token={tokenConfig.symbol}
                        tokenDecimals={tokenConfig.decimals}
                        convert
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

export const FeePreset = withTheme(stylesProvider)(FeePresetComponent);
