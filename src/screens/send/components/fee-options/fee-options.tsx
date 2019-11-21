import React from 'react';
import { IAccountState } from '../../../../redux/wallets/state';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { View, TouchableOpacity } from 'react-native';
import { translate } from '../../../../core/i18n';
import { FeeAvanced } from '../fee-advanced/fee-advanced';
import { FeeTotal } from '../fee-total/fee-total';
import { FeePreset } from '../fee-preset/fee-preset';
import { IBlockchainConfig } from '../../../../core/blockchain/types';
import { BLOCKCHAIN_INFO } from '../../../../core/blockchain/blockchain-factory';

export interface IExternalProps {
    account: IAccountState;
}

interface IState {
    gasPrice: number;
    gasLimit: number;
    blockchainConfig: IBlockchainConfig;
    advancedOptions: boolean;
}

export class FeeOptionsComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            gasPrice: undefined,
            gasLimit: undefined,
            blockchainConfig: BLOCKCHAIN_INFO[props.account.blockchain],
            advancedOptions: false
        };
    }
    public addGasPrice(value: string) {
        throw new Error('Method not implemented.');
    }
    public addGasLimit(value: string) {
        throw new Error('Method not implemented.');
    }
    public onSelectFeePreset(value: string) {
        throw new Error('Method not implemented.');
    }
    public onAdvancedButton = () => {
        const currentState = this.state.advancedOptions;
        this.setState({ advancedOptions: !currentState });
    };

    public renderSimpleFees() {
        if (this.state.blockchainConfig.feeOptions.ui.feeComponent === 'FeeTotal') {
            return (
                <FeeTotal
                    amount={this.props.account.balance?.value}
                    blockchain={this.props.account.blockchain}
                />
            );
        } else if (this.state.blockchainConfig.feeOptions.ui.feeComponent === 'FeePresets') {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <FeePreset
                        amount={this.props.account.balance?.value}
                        blockchain={this.props.account.blockchain}
                        title={'Cheap'}
                        onSelect={this.onSelectFeePreset}
                    />
                    <FeePreset
                        amount={this.props.account.balance?.value}
                        blockchain={this.onSelectFeePreset}
                        title={'Cheap'}
                        onSelect={this.onSelectFeePreset}
                    />
                    <FeePreset
                        amount={this.props.account.balance?.value}
                        blockchain={this.onSelectFeePreset}
                        title={'Cheap'}
                        onSelect={this.onSelectFeePreset}
                    />
                    <FeePreset
                        amount={this.props.account.balance?.value}
                        blockchain={this.onSelectFeePreset}
                        title={'Cheap'}
                        onSelect={this.onSelectFeePreset}
                        selected
                    />
                </View>
            );
        }
    }
    public renderAdvancedFees() {
        if (this.state.blockchainConfig.feeOptions.ui.feeComponentAdvanced === 'FeeAdvanced') {
            return (
                <FeeAvanced
                    amount={this.props.account.balance?.value}
                    blockchain={this.props.account.blockchain}
                />
            );
        }
    }

    public render() {
        const styles = this.props.styles;
        return (
            <View style={styles.container}>
                <Text style={styles.feeTitle}>{translate('Fee.feeTitle')}</Text>
                {this.state.advancedOptions ? this.renderSimpleFees() : this.renderAdvancedFees()}
                {this.state.advancedOptions ? (
                    <TouchableOpacity
                        testID="advanced-fees"
                        onPress={this.onAdvancedButton}
                        style={[styles.buttonRightOptions]}
                    >
                        <Text style={styles.textTranferButton}>
                            {this.state.advancedOptions
                                ? translate('App.labels.advancedSetup')
                                : translate('App.labels.simpleSetup')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }
}

export const FeeOptions = withTheme(stylesProvider)(FeeOptionsComponent);
