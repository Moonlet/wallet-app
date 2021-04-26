import React from 'react';
import { Animated, View, Easing } from 'react-native';
import stylesProvider from './styles';
import { IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import { Text } from '../../library';
import { Deferred } from '../../core/utils/deferred';
import { Blockchain, IBlockchainTransaction } from '../../core/blockchain/types';
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
import { LedgerWallet, LedgerSignEvent } from '../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { IWallet } from '../../core/wallet/types';
import { setInstance, waitForInstance } from '../../core/utils/class-registry';
import { AccountType, IAccountState, IWalletState } from '../../redux/wallets/state';
import { SuccessConnect } from './components/success-connect/success-connect';
import { VerificationFailed } from './components/verification-failed/verification-failed';
import { LocationRequired } from './components/location-required/location-required';
import { Troubleshooting } from './components/troubleshooting/troubleshooting';
import { ReviewTransaction } from './components/review-transaction/review-transaction';
import { delay } from '../../core/utils/time';
import { AnimatedValue } from 'react-navigation';
import { SignDeclined } from './components/sign-declined/sign-declined';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ReviewMessage } from './components/review-message/review-message';
import { SmartContractWarning } from './components/smartcontract-warning/smartcontract-warning';

const ANIMATION_TIME = 300;

export const svgDimmensions = {
    width: 345,
    height: 253
};

enum ScreenStep {
    SEARCH_LEDGER = 'SEARCH_LEDGER',
    CONFIRM_CONNECTION = 'CONFIRM_CONNECTION',
    OPEN_APP = 'OPEN_APP',
    VERIFY_ADDRESS = 'VERIFY_ADDRESS',
    ERROR_SCREEN = 'ERROR_SCREEN',
    WARNING_SMART_CONTRACT_NOT_ALLOWED = 'WARNING_SMART_CONTRACT_NOT_ALLOWED',
    SIGN_DECLINED = 'SIGN_DECLINED',
    LOCATION_REQUIRED = 'LOCATION_REQUIRED',
    VERIFICATION_FAILED = 'VERIFICATION_FAILED',
    SUCCESS_CONNECT = 'SUCCESS_CONNECT',
    TROUBLESHOOTING = 'TROUBLESHOOTING',
    REVIEW_TRANSACTION = 'REVIEW_TRANSACTION',
    REVIEW_MESSAGE = 'REVIEW_MESSAGE'
}

enum LedgerFlow {
    CREATE_WALLET = 'CREATE_WALLET',
    SIGN_TRANSACTION = 'SIGN_TRANSACTION',
    SIGN_MESSAGE = 'SIGN_MESSAGE'
}

export interface IReduxProps {
    wallet: IWalletState;
    account: IAccountState;
}

interface IState {
    step: ScreenStep;
    ledgerDevice: any;
    visible: boolean;
    blockchain: Blockchain;
    accountIndex: number;
    transaction: IBlockchainTransaction;
    message: string;
    deviceModel: HWModel;
    deviceId: string;
    connectionType: HWConnection;
    currentFlow: LedgerFlow;
    stepContainerFadeAnimation: AnimatedValue;
    stepContainerTranslateAnimation: AnimatedValue;
}

export class LedgerConnectComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps,
    IState
> {
    private resultDeferred: Deferred;
    private ledgerWallet: {
        deviceModel: HWModel;
        deviceId: string;
        connectionType: HWConnection;
        instance: LedgerWallet;
    };
    private ledgerSignTerminate;

    public static async getAccountsAndDeviceId(
        blockchain: Blockchain,
        deviceModel: HWModel,
        connectionType: HWConnection
    ) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.getAccountsAndDeviceId(blockchain, deviceModel, connectionType)
        );
    }

    public getAccountsAndDeviceId(
        blockchain: Blockchain,
        deviceModel: HWModel,
        connectionType: HWConnection
    ): Promise<{ accounts: IAccountState[]; deviceId: string }> {
        this.resultDeferred = new Deferred();
        this.setState({
            blockchain,
            deviceModel,
            connectionType,
            visible: true,
            step: ScreenStep.SEARCH_LEDGER,
            currentFlow: LedgerFlow.CREATE_WALLET,
            stepContainerTranslateAnimation: new Animated.Value(0)
        });

        return this.resultDeferred.promise;
    }

    public static async walletCreated(walletId: string) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.walletCreated(walletId)
        );
    }

    public async walletCreated(walletId: string) {
        await this.selectStep(ScreenStep.SUCCESS_CONNECT);
    }

    public static async sign(
        blockchain: Blockchain,
        accountIndex: number,
        transaction: IBlockchainTransaction
    ) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.sign(blockchain, accountIndex, transaction)
        );
    }

    public async sign(
        blockchain: Blockchain,
        accountIndex: number,
        transaction: IBlockchainTransaction
    ): Promise<{ accounts: IAccountState[]; deviceId: string }> {
        this.resultDeferred = new Deferred();
        const { deviceModel, deviceId, connectionType } = this.props.wallet.hwOptions;
        this.setState({
            blockchain,
            accountIndex,
            transaction,
            deviceModel,
            deviceId,
            connectionType,
            visible: true,
            step: ScreenStep.SEARCH_LEDGER,
            currentFlow: LedgerFlow.SIGN_TRANSACTION,
            stepContainerTranslateAnimation: new Animated.Value(0)
        });

        this.trySign();
        return this.resultDeferred.promise;
    }

    public static async signMessage(
        blockchain: Blockchain,
        accountIndex: number,
        accountType: AccountType,
        message: string
    ) {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.signMessage(blockchain, accountIndex, accountType, message)
        );
    }

    public async signMessage(
        blockchain: Blockchain,
        accountIndex: number,
        accountType: AccountType,
        message: string
    ): Promise<string> {
        this.resultDeferred = new Deferred();
        const { deviceModel, deviceId, connectionType } = this.props.wallet.hwOptions;

        this.setState({
            blockchain,
            accountIndex,
            message,
            deviceModel,
            deviceId,
            connectionType,
            visible: true,
            step: ScreenStep.SEARCH_LEDGER,
            currentFlow: LedgerFlow.SIGN_MESSAGE,
            stepContainerTranslateAnimation: new Animated.Value(0)
        });

        this.trySignMessage();
        return this.resultDeferred.promise;
    }

    private trySign() {
        this.selectStep(ScreenStep.SEARCH_LEDGER);

        this.getLegderWalletInstance()
            .smartSign(
                this.state.blockchain,
                this.state.accountIndex,
                this.state.transaction,
                (event: LedgerSignEvent) => {
                    switch (event) {
                        case LedgerSignEvent.LOADING:
                        case LedgerSignEvent.CONNECT_DEVICE:
                            this.selectStep(ScreenStep.SEARCH_LEDGER);
                            break;
                        case LedgerSignEvent.OPEN_APP:
                            this.selectStep(ScreenStep.OPEN_APP);
                            break;
                        case LedgerSignEvent.SIGN_TX:
                            this.selectStep(ScreenStep.REVIEW_TRANSACTION);
                            break;
                        case LedgerSignEvent.TX_SIGN_DECLINED:
                    }
                },
                terminate => (this.ledgerSignTerminate = terminate)
            )
            .then(signature => {
                this.setState({ visible: false });
                this.resultDeferred.resolve(signature);
            })
            .catch(err => {
                if (err !== 'TERMINATED') {
                    const message = err?.message || '';
                    if (message?.indexOf('denied by the user') >= 0) {
                        this.selectStep(ScreenStep.SIGN_DECLINED);
                    } else if (message?.includes('Please enable Contract data') >= 0) {
                        this.selectStep(ScreenStep.WARNING_SMART_CONTRACT_NOT_ALLOWED);
                    } else {
                        this.selectStep(ScreenStep.ERROR_SCREEN);
                    }
                }
            });
    }

    private trySignMessage() {
        this.selectStep(ScreenStep.SEARCH_LEDGER);

        this.getLegderWalletInstance()
            .smartSignMessage(
                this.state.blockchain,
                this.state.accountIndex,
                this.state.message,
                (event: LedgerSignEvent) => {
                    switch (event) {
                        case LedgerSignEvent.LOADING:
                        case LedgerSignEvent.CONNECT_DEVICE:
                            this.selectStep(ScreenStep.SEARCH_LEDGER);
                            break;
                        case LedgerSignEvent.OPEN_APP:
                            this.selectStep(ScreenStep.OPEN_APP);
                            break;
                        case LedgerSignEvent.SIGN_MSG:
                            this.selectStep(ScreenStep.REVIEW_MESSAGE);
                            break;
                        case LedgerSignEvent.MSG_SIGN_DECLINED:
                    }
                },
                terminate => (this.ledgerSignTerminate = terminate)
            )
            .then(signature => {
                const { account } = this.props;

                const messageSignature = getBlockchain(
                    account.blockchain
                ).transaction.getMessageSignature(account, this.state.message, signature);

                this.setState({ visible: false });
                this.resultDeferred.resolve(messageSignature);
            })
            .catch(err => {
                if (err !== 'TERMINATED') {
                    const message = err?.message || '';
                    if (message?.indexOf('denied by the user') >= 0) {
                        this.selectStep(ScreenStep.SIGN_DECLINED);
                    } else {
                        this.selectStep(ScreenStep.ERROR_SCREEN);
                    }
                }
            });
    }

    private getLegderWalletInstance(): LedgerWallet {
        const { deviceModel, deviceId, connectionType } = this.state;
        const ledgetWallet = this.ledgerWallet;

        if (
            deviceId === ledgetWallet?.deviceId &&
            deviceModel === ledgetWallet?.deviceModel &&
            connectionType === ledgetWallet?.connectionType &&
            ledgetWallet.instance
        ) {
            return ledgetWallet.instance;
        }

        this.ledgerWallet = {
            deviceModel,
            deviceId,
            connectionType,
            instance: new LedgerWallet(deviceModel, connectionType, deviceId)
        };

        return this.ledgerWallet.instance;
    }

    public static async close() {
        return waitForInstance<LedgerConnectComponent>(LedgerConnectComponent).then(ref =>
            ref.close()
        );
    }

    public close() {
        this.setState({ visible: false });
    }

    constructor(props: IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps) {
        super(props);
        setInstance(LedgerConnectComponent, this);
        this.state = {
            step: ScreenStep.SEARCH_LEDGER,
            ledgerDevice: undefined,
            visible: false,
            blockchain: undefined,
            accountIndex: undefined,
            transaction: undefined,
            message: undefined,
            connectionType: undefined,
            deviceModel: undefined,
            currentFlow: undefined,
            stepContainerFadeAnimation: new Animated.Value(1),
            stepContainerTranslateAnimation: new Animated.Value(0),
            deviceId: undefined
        };
    }
    public componentWillUnmount() {
        //
    }
    @bind
    private async onConnectedDevice(item: any) {
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
            this.setState({ ledgerDevice: item }, async () => {
                await this.selectStep(ScreenStep.OPEN_APP);
            });
            await (wallet as LedgerWallet).onAppOpened(this.state.blockchain);
        }

        if (this.state.currentFlow === LedgerFlow.SIGN_TRANSACTION) {
            // Review Transaction Flow
            // todo
            await this.selectStep(ScreenStep.REVIEW_TRANSACTION);
            this.resultDeferred.resolve();
        } else if (this.state.currentFlow === LedgerFlow.SIGN_MESSAGE) {
            // Review Message flow
            await this.selectStep(ScreenStep.REVIEW_MESSAGE);
            this.resultDeferred.resolve();
        } else {
            // Connect Ledger - default flow
            await this.selectStep(ScreenStep.VERIFY_ADDRESS);

            try {
                const accounts: IAccountState[] = await wallet.getAccounts(
                    this.state.blockchain,
                    this.state.blockchain === Blockchain.SOLANA
                        ? AccountType.ROOT
                        : AccountType.DEFAULT,
                    0
                );

                if (accounts) {
                    this.resultDeferred.resolve({ accounts, deviceId: item.id });
                } else {
                    this.resultDeferred.reject();
                    await this.selectStep(ScreenStep.VERIFICATION_FAILED);
                }
            } catch {
                this.resultDeferred.reject();
                await this.selectStep(ScreenStep.VERIFICATION_FAILED);
            }
        }
    }

    @bind
    private async onSelectDevice() {
        await this.selectStep(ScreenStep.CONFIRM_CONNECTION);
    }

    @bind
    private async onErrorConnection(error: any) {
        if (error.message === 'Location disabled') {
            await this.selectStep(ScreenStep.LOCATION_REQUIRED);
        } else {
            await this.selectStep(ScreenStep.ERROR_SCREEN);
        }
    }

    @bind
    private onContinue() {
        this.setState({ visible: false });
    }

    @bind
    private onRetry() {
        if (this.state.currentFlow === LedgerFlow.SIGN_TRANSACTION) {
            this.trySign();
        }
    }

    @bind
    private async showTroubleShootPage() {
        await this.selectStep(ScreenStep.TROUBLESHOOTING);
    }

    private async selectStep(step: ScreenStep) {
        if (this.state.step !== step) {
            await this.stepContainerFadeOut();
            this.setState({ step, stepContainerTranslateAnimation: new Animated.Value(400) });
            await this.stepContainerFadeIn();
        }
    }

    private async stepContainerFadeIn() {
        Animated.parallel([
            Animated.timing(this.state.stepContainerFadeAnimation, {
                toValue: 1,
                duration: ANIMATION_TIME,
                useNativeDriver: true,
                easing: Easing.ease
            }),
            Animated.timing(this.state.stepContainerTranslateAnimation, {
                toValue: 0,
                duration: ANIMATION_TIME,
                useNativeDriver: true,
                easing: Easing.ease
            })
        ]).start();

        await delay(ANIMATION_TIME);
    }

    private async stepContainerFadeOut() {
        Animated.parallel([
            Animated.timing(this.state.stepContainerFadeAnimation, {
                toValue: 0,
                duration: ANIMATION_TIME,
                useNativeDriver: true
            }),
            Animated.timing(this.state.stepContainerTranslateAnimation, {
                toValue: -300,
                duration: ANIMATION_TIME,
                useNativeDriver: true
            })
        ]).start();

        await delay(ANIMATION_TIME);
    }

    private displaySteps() {
        switch (this.state.step) {
            case ScreenStep.SEARCH_LEDGER:
                return (
                    <SearchLedger
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        deviceId={this.state.deviceId}
                        connectionType={this.state.connectionType}
                        scanForDevices={this.state.currentFlow === LedgerFlow.CREATE_WALLET}
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
                        walletName={this.props.wallet.name}
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
                        onTroubleshootPress={this.showTroubleShootPage}
                    />
                );
            case ScreenStep.WARNING_SMART_CONTRACT_NOT_ALLOWED:
                return (
                    <SmartContractWarning
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onRetry={this.onRetry}
                        onTroubleshootPress={this.showTroubleShootPage}
                    />
                );
            case ScreenStep.SIGN_DECLINED:
                return (
                    <SignDeclined
                        onRetry={this.onRetry}
                        onCancel={() => {
                            this.setState({ visible: false, step: undefined });
                            if (typeof this.ledgerSignTerminate === 'function') {
                                this.ledgerSignTerminate();
                            }
                            this.resultDeferred.reject('LEDGER_SIGN_CANCELLED');
                        }}
                    />
                );
            case ScreenStep.TROUBLESHOOTING:
                return <Troubleshooting />;
            case ScreenStep.VERIFICATION_FAILED:
                return (
                    <VerificationFailed
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                        onRetry={this.onRetry}
                    />
                );
            case ScreenStep.REVIEW_TRANSACTION:
                return (
                    <ReviewTransaction
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                    />
                );
            case ScreenStep.REVIEW_MESSAGE:
                return (
                    <ReviewMessage
                        blockchain={this.state.blockchain}
                        deviceModel={this.state.deviceModel}
                        connectionType={this.state.connectionType}
                    />
                );
            default:
                return null;
        }
    }

    public render() {
        const { styles } = this.props;

        const displayTopHeader =
            this.state.step !==
            (ScreenStep.SUCCESS_CONNECT ||
                ScreenStep.ERROR_SCREEN ||
                ScreenStep.VERIFICATION_FAILED);

        if (this.state.visible) {
            return (
                <View style={styles.container}>
                    {displayTopHeader && (
                        <View style={styles.header}>
                            <View style={styles.defaultHeaderContainer}>
                                <HeaderLeft
                                    testID="go-back"
                                    icon={IconValues.ARROW_LEFT}
                                    onPress={() => {
                                        this.setState({ visible: false, step: undefined });
                                        if (typeof this.ledgerSignTerminate === 'function') {
                                            this.ledgerSignTerminate();
                                        }
                                        if (
                                            this.state.currentFlow === LedgerFlow.SIGN_TRANSACTION
                                        ) {
                                            this.resultDeferred.reject('LEDGER_SIGN_CANCELLED');
                                        } else {
                                            this.resultDeferred.reject('LEDGER_FLOW_CANCELLED');
                                        }
                                    }}
                                />
                            </View>
                            <View style={styles.headerTitleContainer}>
                                <Text style={styles.headerTitleStyle}>
                                    {translate('App.labels.connect')}
                                </Text>
                            </View>
                            <View style={styles.defaultHeaderContainer} />
                        </View>
                    )}
                    <Animated.View
                        style={{
                            flex: 1,
                            opacity: this.state.stepContainerFadeAnimation,
                            transform: [
                                {
                                    translateX: this.state.stepContainerTranslateAnimation
                                }
                            ]
                        }}
                    >
                        {this.displaySteps()}
                    </Animated.View>
                </View>
            );
        } else {
            return null;
        }
    }
}
