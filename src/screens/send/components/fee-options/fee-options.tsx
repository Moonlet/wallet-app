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
import { BLOCKCHAIN_INFO, getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import BigNumber from 'bignumber.js';
import { IReduxState } from '../../../../redux/state';
import { getChainId } from '../../../../redux/app/selectors';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { connect } from 'react-redux';

export interface IExternalProps {
    account: IAccountState;
    calculatedFees: (gasPrice: BigNumber, gasLimit: BigNumber) => any;
}

interface IState {
    gasPrice: BigNumber;
    gasLimit: BigNumber;
    blockchainConfig: IBlockchainConfig;
    hasAdvancedOptions: boolean;
    selectedPreset: string;
    showAdvancedOptions: boolean;
}

interface IReduxProps {
    chainId: number;
}

export class FeeOptionsComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps,
    IState
> {
    constructor(
        props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps
    ) {
        super(props);
        const feeOptions = BLOCKCHAIN_INFO[this.props.account.blockchain].feeOptions;

        this.state = {
            gasPrice: undefined,
            gasLimit: undefined,
            blockchainConfig: BLOCKCHAIN_INFO[props.account.blockchain],
            showAdvancedOptions: false,
            hasAdvancedOptions: feeOptions.ui.feeComponentAdvanced === 'FeeAdvanced',
            selectedPreset: feeOptions.ui.defaultPreset
        };
    }

    public componentDidMount() {
        this.estimatedFees();
    }

    public estimatedFees = () => {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const fees = blockchainInstance.getClient(this.props.chainId).estimateFees();
        this.setState({
            gasPrice: fees.gasPrice,
            gasLimit: fees.gasLimit
        });
        this.props.calculatedFees(fees.gasPrice, fees.gasLimit);
    };

    public onSelectFeePreset = (key: string) => {
        this.setState({
            selectedPreset: key,
            gasPrice: this.state.blockchainConfig.feeOptions.defaults.gasPricePresets[key],
            gasLimit: this.state.blockchainConfig.feeOptions.defaults.gasLimit
        });
        this.props.calculatedFees(
            this.state.blockchainConfig.feeOptions.defaults.gasPricePresets[key],
            this.state.blockchainConfig.feeOptions.defaults.gasLimit
        );
    };
    public onAdvancedButton = () => {
        const currentState = this.state.showAdvancedOptions;
        this.setState({
            showAdvancedOptions: !currentState
        });
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
            const presets = this.state.blockchainConfig.feeOptions.defaults.gasPricePresets;
            return (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    {Object.keys(presets).map(key => {
                        return (
                            <FeePreset
                                key={key}
                                amount={presets[key]}
                                blockchain={this.props.account.blockchain}
                                title={translate('App.labels.' + key)}
                                presetKey={key}
                                onSelect={this.onSelectFeePreset}
                                selected={this.state.selectedPreset === key}
                            />
                        );
                    })}
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
                {this.state.showAdvancedOptions
                    ? this.renderAdvancedFees()
                    : this.renderSimpleFees()}
                {this.state.hasAdvancedOptions ? (
                    <TouchableOpacity
                        testID="advanced-fees"
                        onPress={() => this.onAdvancedButton()}
                        style={[styles.buttonRightOptions]}
                    >
                        <Text style={styles.textTranferButton}>
                            {this.state.showAdvancedOptions
                                ? translate('Send.simpleSetup')
                                : translate('Send.advancedSetup')}
                        </Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }
}

export const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        chainId: getChainId(state, ownProps.account.blockchain)
    };
};

export const FeeOptions = smartConnect<IExternalProps>(FeeOptionsComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
