import React from 'react';
import { Platform, View } from 'react-native';
import Modal from '../../library/modal/modal';
import stylesProvider from './styles';
import { IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { Text } from '../../library';
import { Deferred } from '../../core/utils/deferred';
import { Blockchain } from '../../core/blockchain/types';
import { HWConnection, HWModel, HWVendor } from '../../core/wallet/hw-wallet/types';
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
import { setInstance, waitForInstance } from '../../core/utils/class-registry';
import { IAccountState } from '../../redux/wallets/state';
import { SuccessConnect } from './components/success-connect/success-connect';
import { VerificationFailed } from './components/verification-failed/verification-failed';
import { LocationRequired } from './components/location-required/location-required';

export const svgDimmensions = {
    width: 345,
    height: 253
};

const navigationOptions = () => ({
    title: translate('App.labels.connect')
});

export enum ScreenStep {
    SEARCH_LEDGER = 'SEARCH_LEDGER',
    CONFIRM_CONNECTION = 'CONFIRM_CONNECTION',
    OPEN_APP = 'OPEN_APP',
    VERIFY_ADDRESS = 'VERIFY_ADDRESS',
    ERROR_SCREEN = 'ERROR_SCREEN',
    LOCATION_REQUIRED = 'LOCATION_REQUIRED',
    VERIFICATION_FAILED = 'VERIFICATION_FAILED',
    SUCCESS_CONNECT = 'SUCCESS_CONNECT'
}

export interface IState {
    step: ScreenStep;
    showErrorScreen: boolean;
    ledgerDevice: any;
    visible: boolean;
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
}

export class LedgerConnectComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    private modalOnHideDeffered: Deferred;
    private resultDeferred: Deferred;

    public getAccountsAndDeviceId(
        blockchain: Blockchain,
        deviceModel: HWModel,
        connectionType: HWConnection
    ): Promise<{ accounts: IAccountState[]; deviceId: string }> {
        this.resultDeferred = new Deferred();
        this.modalOnHideDeffered = new Deferred();
        this.setState({
            blockchain,
            deviceModel,
            connectionType,
            visible: true,
            step: ScreenStep.SEARCH_LEDGER
        });

        return this.resultDeferred.promise;
    }

    public static async walletCreated(walletId: string) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.walletCreated(walletId)
        );
    }

    public walletCreated(walletId: string) {
        this.resultDeferred = new Deferred();
        this.modalOnHideDeffered = new Deferred();
        this.setState({
            step: ScreenStep.SUCCESS_CONNECT
        });
    }

    public static async getAccountsAndDeviceId(
        blockchain: Blockchain,
        deviceModel: HWModel,
        connectionType: HWConnection
    ) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.getAccountsAndDeviceId(blockchain, deviceModel, connectionType)
        );
    }

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        setInstance(LedgerConnectComponent, this);
        this.state = {
            step: ScreenStep.SEARCH_LEDGER,
            showErrorScreen: false,
            ledgerDevice: undefined,
            visible: false,
            blockchain: undefined,
            connectionType: undefined,
            deviceModel: undefined
        };
    }

    public componentWillUnmount() {
        //
    }

    private onConnectedDevice = async (item: any) => {
        const wallet: IWallet = await HWWalletFactory.get(
            HWVendor.LEDGER,
            this.state.deviceModel,
            item.id,
            this.state.connectionType
        );
        let appOpened = false;
        try {
            appOpened = await (wallet as LedgerWallet).isAppOpened(this.state.blockchain);
        } catch {
            appOpened = false;
        }
        if (!appOpened) {
            this.setState({ step: ScreenStep.OPEN_APP, ledgerDevice: item });
            await (wallet as LedgerWallet).onAppOpened(this.state.blockchain);
        }
        this.setState({ step: ScreenStep.VERIFY_ADDRESS });

        try {
            const accounts: IAccountState[] = await wallet.getAccounts(this.state.blockchain, 0);

            if (accounts) this.resultDeferred.resolve({ accounts, deviceId: item.id });
            else {
                this.resultDeferred.reject();
                this.setState({ step: ScreenStep.VERIFICATION_FAILED });
            }
        } catch {
            this.resultDeferred.reject();
            this.setState({ step: ScreenStep.VERIFICATION_FAILED });
        }
    };
    @bind
    private onSelectDevice() {
        this.setState({ step: ScreenStep.CONFIRM_CONNECTION });
    }
    @bind
    private onErrorConnection(error: any) {
        if (error.message === 'Location disabled')
            this.setState({ step: ScreenStep.LOCATION_REQUIRED });
        else this.setState({ step: ScreenStep.ERROR_SCREEN });
    }
    @bind
    private onContinue() {
        this.setState({ visible: false });
    }
    @bind
    private onRetry() {
        this.setState({ visible: false });
    }

    private displaySteps() {
        switch (this.state.step) {
            case ScreenStep.SEARCH_LEDGER:
                return (
                    <SearchLedger
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onSelect={this.onSelectDevice}
                        onConnect={this.onConnectedDevice}
                        onError={this.onErrorConnection}
                    />
                );
            case ScreenStep.CONFIRM_CONNECTION:
                return (
                    <ConfirmConnection
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                    />
                );
            case ScreenStep.LOCATION_REQUIRED:
                return (
                    <LocationRequired
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onPress={this.onRetry}
                    />
                );
            case ScreenStep.OPEN_APP:
                return (
                    <OpenApp
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                    />
                );
            case ScreenStep.VERIFY_ADDRESS:
                return (
                    <VerifyAddress
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                    />
                );
            case ScreenStep.SUCCESS_CONNECT:
                return (
                    <SuccessConnect
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        walletName={'Wallet 1'} // TODO
                        deviceName={
                            this.state.ledgerDevice?.localName !== undefined
                                ? this.state.ledgerDevice?.localName
                                : translate(`LedgerConnect.${this.state.deviceModel}`)
                        }
                        onContinue={this.onContinue}
                        // Pass entire wallet  - to be able to rename it
                    />
                );
            case ScreenStep.ERROR_SCREEN:
                return (
                    <FailedComponent
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onRetry={this.onRetry}
                    />
                );
            case ScreenStep.VERIFICATION_FAILED:
                return (
                    <VerificationFailed
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onRetry={this.onRetry}
                    />
                );
        }
    }

    public render() {
        const displayTopHeader =
            this.state.step !==
            (ScreenStep.SUCCESS_CONNECT ||
                ScreenStep.ERROR_SCREEN ||
                ScreenStep.VERIFICATION_FAILED);

        return (
            <Modal
                isVisible={Platform.select({
                    web: false,
                    default: this.state.visible || false
                })}
                animationInTiming={5}
                animationOutTiming={5}
                onModalHide={() => this.modalOnHideDeffered?.resolve()}
            >
                <View style={this.props.styles.container}>
                    {displayTopHeader && (
                        <View style={this.props.styles.header}>
                            <HeaderLeft
                                style={{ flex: 1 }}
                                testID="go-back"
                                icon={IconValues.ARROW_LEFT}
                                onPress={() => {
                                    this.setState({ visible: false });
                                }}
                            />
                            <Text style={this.props.styles.headerTitleStyle}>
                                {translate('App.labels.connect')}
                            </Text>
                            <View style={{ flex: 1 }} />
                        </View>
                    )}
                    {this.displaySteps()}
                </View>
            </Modal>
        );
    }
}
