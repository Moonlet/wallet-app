import React from 'react';
import { IAccountState } from '../../../../redux/wallets/state';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { translate } from '../../../../core/i18n';
import { GasFeeAvanced } from '../gas-fee-advanced/gas-fee-advanced';
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
    toAddress: string;
    onFeesChanged: (feeOptions: any) => any;
}

interface IState {
    feeOptions: any;
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
            feeOptions: undefined,
            blockchainConfig: BLOCKCHAIN_INFO[props.account.blockchain],
            showAdvancedOptions: false,
            hasAdvancedOptions: feeOptions.ui.feeComponentAdvanced === 'GasFeeAdvanced',
            selectedPreset: feeOptions.ui.defaultPreset
        };
        this.estimatedFees();
    }

    public estimatedFees = async () => {
        const blockchainInstance = getBlockchain(this.props.account.blockchain);
        const fees = await blockchainInstance
            .getClient(this.props.chainId)
            .calculatedFees(this.props.account.address, this.props.toAddress);

        this.setState({
            feeOptions: fees
        });
        this.props.onFeesChanged(fees);
    };

    public onSelectFeePreset = (key: string) => {
        const gasPrice = new BigNumber(this.state.feeOptions.presets[key]);
        const gasLimit = new BigNumber(this.state.feeOptions.gasLimit);
        this.setState({
            selectedPreset: key,
            feeOptions: {
                ...this.state.feeOptions,
                gasPrice,
                gasLimit,
                feeTotal: gasPrice.multipliedBy(gasLimit)
            }
        });
        this.props.onFeesChanged({
            gasPrice,
            gasLimit,
            feeTotal: gasPrice.multipliedBy(gasLimit)
        });
    };

    public onInputAdvancedFees = (gasPrice: BigNumber, gasLimit: BigNumber) => {
        this.setState({
            feeOptions: {
                ...this.state.feeOptions,
                gasPrice,
                gasLimit
            }
        });
        this.props.onFeesChanged({ gasPrice, gasLimit });
    };

    public onAdvancedButton = () => {
        const currentState = this.state.showAdvancedOptions;
        this.setState({
            showAdvancedOptions: !currentState
        });
    };

    public renderSimpleFees() {
        const styles = this.props.styles;
        switch (this.state.blockchainConfig.feeOptions.ui.feeComponent) {
            case 'FeeTotal':
                return this.state.feeOptions ? (
                    <FeeTotal
                        amount={this.state.feeOptions.feeTotal}
                        blockchain={this.props.account.blockchain}
                    />
                ) : null;
            case 'FeePresets': {
                return this.state.feeOptions ? (
                    <View style={styles.containerPresets}>
                        <FlatList
                            contentContainerStyle={styles.list}
                            onEndReachedThreshold={0.5}
                            numColumns={2}
                            scrollEnabled={false}
                            data={Object.keys(this.state.feeOptions.presets)}
                            keyExtractor={index => `${index}`}
                            renderItem={({ item }) => {
                                return (
                                    <FeePreset
                                        key={item}
                                        amount={this.state.feeOptions.presets[item]}
                                        blockchain={this.props.account.blockchain}
                                        title={translate('App.labels.' + item)}
                                        presetKey={item}
                                        onSelect={this.onSelectFeePreset}
                                        selected={this.state.selectedPreset === item}
                                    />
                                );
                            }}
                            horizontal={false}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) : null;
            }
            default:
                return null;
        }
    }
    public renderAdvancedFees() {
        if (this.state.blockchainConfig.feeOptions.ui.feeComponentAdvanced === 'GasFeeAdvanced') {
            return this.state.feeOptions ? (
                <GasFeeAvanced
                    gasPrice={this.state.feeOptions.gasPrice}
                    gasLimit={this.state.feeOptions.gasLimit}
                    blockchain={this.props.account.blockchain}
                    onInputFees={this.onInputAdvancedFees}
                />
            ) : null;
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
                                ? translate('App.labels.simple')
                                : translate('App.labels.advanced')}
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
