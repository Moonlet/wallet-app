import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData, IScreenDatas } from '../../redux/ui/screens/data/state';
import { withdraw, claimRewardNoInput, activate } from '../../redux/wallets/actions/pos-actions';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { IAccountState } from '../../redux/wallets/state';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { getAccountStats } from '../../redux/ui/stats/selectors';
import { AccountStats } from '../../core/blockchain/types/stats';

interface IExternalProps {
    context: IScreenContext;
}

const mapStateToProps = (state: IReduxState) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    return {
        dashboard: state.ui.screens.data.dashboard,
        token: state.ui.screens.data.token,
        accountStats:
            account && getAccountStats(state, account.blockchain, chainId, account.address),
        walletPublicKey: getSelectedWallet(state).walletPublicKey,
        account,
        chainId
    };
};

interface IReduxProps {
    dashboard: IScreenDatas;
    token: IScreenDatas;

    walletPublicKey: string;
    account: IAccountState;
    accountStats: AccountStats;
    chainId: string;

    fetchScreenData: typeof fetchScreenData;

    activate: typeof activate;
    claimRewardNoInput: typeof claimRewardNoInput;
    withdraw: typeof withdraw;
}

const mapDispatchToProps = {
    fetchScreenData,

    activate,
    claimRewardNoInput,
    withdraw
};

interface IState {
    screenData: IScreenData;
    isLoading: boolean;
    error: any;
}

export class SmartScreenComponent extends React.Component<IReduxProps & IExternalProps, IState> {
    constructor(props: IReduxProps & IExternalProps) {
        super(props);
        this.state = {
            screenData: undefined,
            isLoading: true,
            error: undefined
        };
    }

    public componentDidMount() {
        this.props.fetchScreenData(this.props.context);
    }

    public componentDidUpdate(prevProps: IReduxProps & IExternalProps) {
        if (
            this.props.account !== prevProps.account ||
            this.props.walletPublicKey !== prevProps.walletPublicKey ||
            this.props.chainId !== prevProps.chainId ||
            this.props.context?.tab !== prevProps.context?.tab
        ) {
            this.props.fetchScreenData(this.props.context);

            // TODO: handle this
            this.setState({
                screenData: undefined,
                isLoading: true,
                error: undefined
            });
        }

        if (this.props.dashboard !== prevProps.dashboard || this.props.token !== prevProps.token) {
            this.getScreenData();
        }
    }

    private getScreenData() {
        const { dashboard } = this.props;

        const screenKey = getScreenDataKey({
            pubKey: this.props.walletPublicKey,
            blockchain: this.props.account.blockchain,
            chainId: this.props.chainId,
            address: this.props.account.address,
            tab: this.props.context?.tab
        });

        if (dashboard && dashboard[screenKey]) {
            const screenData: IScreenData = dashboard[screenKey];

            this.setState({
                screenData,
                isLoading: screenData.isLoading,
                error: screenData.error
            });
        }
    }

    public render() {
        const { screenData } = this.state;

        if (this.state.isLoading) {
            // TODO: here we should render skeleton
            return <LoadingIndicator />;
        }

        if (screenData.response?.widgets) {
            return (
                <View>
                    <Widgets
                        data={screenData.response.widgets}
                        actions={{
                            // TODO: add all acitons
                            activate: this.props.activate,
                            claimRewardNoInput: this.props.claimRewardNoInput,
                            withdraw: this.props.withdraw
                        }}
                    />
                </View>
            );
        }

        // TODO: handle error
        // if (this.state.error) {
        //     //
        // }
        return null;
    }
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
