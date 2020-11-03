import React from 'react';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext, IScreenWidget } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData, IScreenDatas } from '../../redux/ui/screens/data/state';
import { withdraw, claimRewardNoInput } from '../../redux/wallets/actions/pos-actions';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { IAccountState } from '../../redux/wallets/state';
import { getAccountStats } from '../../redux/ui/stats/selectors';
import { AccountStats } from '../../core/blockchain/types/stats';
import { ErrorWidget } from '../../components/widgets/components/error-widget/error-widget';
import { translate } from '../../core/i18n';
import { LoadingSkeleton } from './components/loading-skeleton/loading-skeleton';

interface IExternalProps {
    context: IScreenContext;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const account = getSelectedAccount(state);
    const chainId = account && getChainId(state, account.blockchain);

    return {
        screenData: state.ui.screens.data && state.ui.screens.data[ownProps.context.screen],

        accountStats:
            account && getAccountStats(state, account.blockchain, chainId, account.address),
        walletPublicKey: getSelectedWallet(state)?.walletPublicKey,
        account,
        chainId
    };
};

interface IReduxProps {
    screenData: IScreenDatas;

    walletPublicKey: string;
    account: IAccountState;
    accountStats: AccountStats;
    chainId: string;

    fetchScreenData: typeof fetchScreenData;
    claimRewardNoInput: typeof claimRewardNoInput;
    withdraw: typeof withdraw;
}

const mapDispatchToProps = {
    fetchScreenData,
    claimRewardNoInput,
    withdraw
};

interface IState {
    loadingTimeoutInProgress: boolean;
    loadingScreenData: boolean;
}

export class SmartScreenComponent extends React.Component<IReduxProps & IExternalProps, IState> {
    private loadingTimeout: any;

    constructor(props: IReduxProps & IExternalProps) {
        super(props);
        this.state = {
            loadingTimeoutInProgress: false,
            loadingScreenData: false
        };
    }

    public componentDidMount() {
        this.props.fetchScreenData(this.props.context);
    }

    public componentDidUpdate(prevProps: IReduxProps & IExternalProps) {
        if (
            this.props.account?.address !== prevProps.account?.address ||
            this.props.walletPublicKey !== prevProps.walletPublicKey ||
            this.props.chainId !== prevProps.chainId ||
            this.props.context.screen !== prevProps.context.screen ||
            this.props.context?.tab !== prevProps.context?.tab
        ) {
            this.props.fetchScreenData(this.props.context);
        }

        this.updateLoading(prevProps);
    }

    private getScreenData(props: IReduxProps & IExternalProps): IScreenData {
        const screenKey = getScreenDataKey({
            pubKey: props.walletPublicKey,
            blockchain: props.account?.blockchain,
            chainId: props.chainId,
            address: props.account?.address,
            tab: props.context?.tab
        });

        return props.screenData && screenKey && props.screenData[screenKey];
    }

    private updateLoading(prevProps: IReduxProps & IExternalProps) {
        const screenData = this.getScreenData(this.props);
        const prevScreenData = this.getScreenData(prevProps);

        if (screenData?.isLoading !== prevScreenData?.isLoading) {
            if (screenData?.isLoading) {
                if (!screenData?.response) {
                    this.setState({
                        loadingScreenData: true,
                        loadingTimeoutInProgress: true
                    });

                    clearTimeout(this.loadingTimeout);
                    this.loadingTimeout = setTimeout(() => {
                        const localScreenData = this.getScreenData(this.props);
                        if (!localScreenData?.isLoading) {
                            this.setState({
                                loadingTimeoutInProgress: false,
                                loadingScreenData: false
                            });
                        } else {
                            this.setState({ loadingTimeoutInProgress: false });
                        }
                    }, 1500);
                }
            } else {
                if (!this.state.loadingTimeoutInProgress) {
                    this.setState({
                        loadingScreenData: false
                    });
                }
            }
        }
    }

    private renderWidgets(widgets: IScreenWidget[]) {
        return (
            <Widgets
                data={widgets}
                actions={{
                    claimRewardNoInput: this.props.claimRewardNoInput,
                    withdraw: this.props.withdraw
                }}
                account={this.props.account}
                chainId={this.props.chainId}
            />
        );
    }

    private renderErrorWidget() {
        return (
            <ErrorWidget
                header={translate('Widgets.wentWrong')}
                body={translate('Widgets.didNotLoad')}
                cta={{
                    label: translate('App.labels.retry'),
                    onPress: () => this.props.fetchScreenData(this.props.context)
                }}
            />
        );
    }

    public render() {
        const screenData = this.getScreenData(this.props);

        if (screenData) {
            if (this.state.loadingScreenData) {
                return <LoadingSkeleton />;
            }

            if (screenData.response?.widgets) {
                return this.renderWidgets(screenData.response.widgets);
            }

            if (screenData.error) {
                return this.renderErrorWidget();
            }
        }

        return null;
    }
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
