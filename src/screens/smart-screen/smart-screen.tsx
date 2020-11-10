import React from 'react';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { ContextScreen, IScreenContext, IScreenWidget } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData, IScreensData } from '../../redux/ui/screens/data/state';
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
import {
    toggleValidatorMultiple,
    selectInput,
    clearInput
} from '../../redux/ui/screens/input-data/actions';

interface IExternalProps {
    context: IScreenContext;
    // getLoadingSkeleton
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
    screenData: IScreensData;

    walletPublicKey: string;
    account: IAccountState;
    accountStats: AccountStats;
    chainId: string;

    fetchScreenData: typeof fetchScreenData;
    claimRewardNoInput: typeof claimRewardNoInput;
    withdraw: typeof withdraw;
    toggleValidatorMultiple: typeof toggleValidatorMultiple;
    selectInput: typeof selectInput;
    clearInput: typeof clearInput;
}

const mapDispatchToProps = {
    fetchScreenData,
    claimRewardNoInput,
    withdraw,
    toggleValidatorMultiple,
    selectInput,
    clearInput
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

    private getScreenKey(props: IReduxProps & IExternalProps) {
        return getScreenDataKey({
            pubKey: props.walletPublicKey,
            blockchain: props.account?.blockchain,
            chainId: props.chainId,
            address: props.account?.address,
            tab: props.context?.tab
        });
    }

    private getScreenData(props: IReduxProps & IExternalProps): IScreenData {
        const screenKey = this.getScreenKey(props);

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
                screenKey={this.getScreenKey(this.props)}
                actions={{
                    claimRewardNoInput: this.props.claimRewardNoInput,
                    withdraw: this.props.withdraw,
                    toggleValidatorMultiple: this.props.toggleValidatorMultiple,
                    selectInput: this.props.selectInput,
                    clearInput: this.props.clearInput
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
                switch (this.props.context.screen) {
                    case ContextScreen.TOKEN:
                    case ContextScreen.QUICK_STAKE_SELECT_VALIDATOR:
                        return new Array(4)
                            .fill('')
                            .map((_, index: number) => (
                                <LoadingSkeleton key={`skeleton-${index}`} />
                            ));

                    default:
                        return <LoadingSkeleton />;
                }
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
