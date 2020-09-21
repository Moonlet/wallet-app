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
import { HWConnection, HWModel } from '../../core/wallet/hw-wallet/types';
import { connect } from 'react-redux';
import { SearchLedger } from './components/search-ledger/search-ledger';
import { IconValues } from '../../components/icon/values';
import { HeaderLeft } from '../../components/header-left/header-left';
import { bind } from 'bind-decorator';
import { FailedComponent } from './components/failed-component/failed-component';
import { ConfirmConnection } from './components/confirm-connections/confirm-connection';
import { OpenApp } from './components/open-app/open-app';

export const svgDimmensions = {
    width: 345,
    height: 253
};

const navigationOptions = () => ({
    title: translate('App.labels.connect')
});

export interface IState {
    currentStep: number;
    showErrorScreen: boolean;
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
            currentStep: 1,
            showErrorScreen: false
        };
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.displayLedgerConnect !== prevProps.displayLedgerConnect) {
            this.modalOnHideDeffered = new Deferred();
        }
    }

    @bind
    private onConnectedDevice(item: any) {
        this.setState({ currentStep: 3 });
    }
    @bind
    private onSelectDevice() {
        this.setState({ currentStep: 2 });
    }
    @bind
    private onErrorConnection(error: any) {
        this.setState({ showErrorScreen: true });
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

                    {this.state.currentStep === 3 && (
                        <SearchLedger
                            blockchain={this.props.blockchain}
                            deviceModel={this.props.deviceModel}
                            connectionType={this.props.connectionType}
                            onSelect={this.onSelectDevice}
                            onConnect={this.onConnectedDevice}
                            onError={this.onErrorConnection}
                        />
                    )}
                    {this.state.currentStep === 2 && (
                        <ConfirmConnection
                            blockchain={this.props.blockchain}
                            deviceModel={this.props.deviceModel}
                            connectionType={this.props.connectionType}
                        />
                    )}
                    {this.state.currentStep === 1 && (
                        <OpenApp
                            blockchain={this.props.blockchain}
                            deviceModel={this.props.deviceModel}
                            connectionType={this.props.connectionType}
                        />
                    )}
                    {/* <S10_X12 /> */}
                    {/* <S15_S16 /> */}
                    {/* <S11_S14_X13 /> */}
                    {/* <S12_S13_X14 /> */}

                    {this.state.showErrorScreen && (
                        <FailedComponent
                            isVerification={false}
                            blockchain={this.props.blockchain}
                            deviceModel={this.props.deviceModel}
                            connectionType={this.props.connectionType}
                        />
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
