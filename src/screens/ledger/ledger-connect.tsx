import React from 'react';
import { Platform, View } from 'react-native';
import Modal from '../../library/modal/modal';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { Deferred } from '../../core/utils/deferred';
import { IReduxState } from '../../redux/state';
import { Blockchain } from '../../core/blockchain/types';
import { HWConnection, HWModel, HWVendor } from '../../core/wallet/hw-wallet/types';
import { connect } from 'react-redux';
import { SearchLedger } from './components/search-ledger/search-ledger';
import { IconValues } from '../../components/icon/values';
import { HeaderLeft } from '../../components/header-left/header-left';
import { bind } from 'bind-decorator';
import { FailedComponent } from './components/failed-component/failed-component';
import { ConfirmConnection } from './components/confirm-connections/confirm-connection';
import { OpenApp } from './components/open-app/open-app';
import { VerifyAddress } from './components/verify-address/verify-address';
import { HWWalletFactory } from '../../core/wallet/hw-wallet/hw-wallet-factory';
import { LedgerWallet } from '../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { IWallet } from '../../core/wallet/types';

export const svgDimmensions = {
    width: 345,
    height: 253
};

const navigationOptions = () => ({
    title: translate('App.labels.connect')
});

enum ScreenStep {
    SEARCH_LEDGER = 'SEARCH_LEDGER',
    CONFIRM_CONNECTION = 'CONFIRM_CONNECTION',
    OPEN_APP = 'OPEN_APP',
    VERIFY_ADDRESS = 'VERIFY_ADDRESS'
}

export interface IState {
    currentStep: ScreenStep;
    showErrorScreen: boolean;
    ledgerDevice: any;
}

export interface IReduxProps {
    displayLedgerConnect: boolean;
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
}

export const mapStateToProps = (state: IReduxState) => ({
    displayLedgerConnect: state.ui.ledgerConnect.displayLedgerConnect,
    blockchain: state.ui.ledgerConnect.blockchain,
    deviceModel: state.ui.ledgerConnect.deviceModel,
    connectionType: state.ui.ledgerConnect.connectionType
});

export class LedgerConnectComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private modalOnHideDeffered: Deferred;

    constructor(props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            currentStep: ScreenStep.SEARCH_LEDGER,
            showErrorScreen: false,
            ledgerDevice: undefined
        };
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.displayLedgerConnect !== prevProps.displayLedgerConnect) {
            this.modalOnHideDeffered = new Deferred();
        }
    }

    private onConnectedDevice = async (item: any) => {
        this.setState({ currentStep: ScreenStep.OPEN_APP, ledgerDevice: item });

        const wallet: IWallet = await HWWalletFactory.get(
            HWVendor.LEDGER,
            this.props.deviceModel,
            item.id,
            this.props.connectionType
        );
        await (wallet as LedgerWallet).onAppOpened(this.props.blockchain);

        this.setState({ currentStep: ScreenStep.VERIFY_ADDRESS });
    };
    @bind
    private onSelectDevice() {
        this.setState({ currentStep: ScreenStep.CONFIRM_CONNECTION });
    }
    @bind
    private onErrorConnection(error: any) {
        this.setState({ showErrorScreen: true });
    }

    private displaySteps() {
        switch (this.state.currentStep) {
            case ScreenStep.SEARCH_LEDGER:
                return (
                    <SearchLedger
                        blockchain={this.props.blockchain}
                        deviceModel={this.props.deviceModel}
                        connectionType={this.props.connectionType}
                        onSelect={this.onSelectDevice}
                        onConnect={this.onConnectedDevice}
                        onError={this.onErrorConnection}
                    />
                );
            case ScreenStep.CONFIRM_CONNECTION:
                return (
                    <ConfirmConnection
                        blockchain={this.props.blockchain}
                        deviceModel={this.props.deviceModel}
                        connectionType={this.props.connectionType}
                    />
                );
            case ScreenStep.OPEN_APP:
                return (
                    <OpenApp
                        blockchain={this.props.blockchain}
                        deviceModel={this.props.deviceModel}
                        connectionType={this.props.connectionType}
                    />
                );
            case ScreenStep.VERIFY_ADDRESS:
                return (
                    <VerifyAddress
                        blockchain={this.props.blockchain}
                        deviceModel={this.props.deviceModel}
                        connectionType={this.props.connectionType}
                    />
                );
        }
    }

    public render() {
        return (
            <Modal
                isVisible={Platform.select({
                    web: false,
                    default: this.props.displayLedgerConnect || false
                })}
                animationInTiming={5}
                animationOutTiming={5}
                onModalHide={() => this.modalOnHideDeffered?.resolve()}
            >
                <View style={this.props.styles.container}>
                    <HeaderLeft
                        testID="go-back"
                        icon={IconValues.ARROW_LEFT}
                        onPress={() => {
                            //
                        }}
                    />

                    {this.state.showErrorScreen ? (
                        <FailedComponent
                            isVerification={false} // display if verificationscreen
                            blockchain={this.props.blockchain}
                            deviceModel={this.props.deviceModel}
                            connectionType={this.props.connectionType}
                        />
                    ) : (
                        this.displaySteps()
                    )}
                </View>
            </Modal>
        );
    }
}

export const LedgerConnect = smartConnect(LedgerConnectComponent, [
    withTheme(stylesProvider),
    connect(mapStateToProps, null)
]);
