import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData } from '../../redux/ui/screens/data/state';
import { withdraw, claimRewardNoInput, activate } from '../../redux/wallets/actions/pos-actions';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { IAccountState } from '../../redux/wallets/state';

interface IExternalProps {
    context: IScreenContext;
}

const mapStateToProps = (state: IReduxState) => {
    const account = getSelectedAccount(state);

    return {
        dashboard: state.ui.screens.data.dashboard,
        token: state.ui.screens.data.token,

        walletPublicKey: getSelectedWallet(state).walletPublicKey,
        account,
        chainId: getChainId(state, account.blockchain)
    };
};

interface IReduxProps {
    dashboard: IScreenData;
    token: IScreenData;

    walletPublicKey: string;
    account: IAccountState;
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

export class SmartScreenComponent extends React.Component<IReduxProps & IExternalProps> {
    constructor(props: IReduxProps & IExternalProps) {
        super(props);
    }

    public componentDidMount() {
        this.fetchScreenData();
    }

    public componentDidUpdate(prevProps: IReduxProps & IExternalProps) {
        if (
            this.props.account !== prevProps.account ||
            this.props.walletPublicKey !== prevProps.walletPublicKey ||
            this.props.chainId !== prevProps.chainId ||
            this.props.context?.tab !== prevProps.context?.tab
        ) {
            this.fetchScreenData();
        }
    }

    private fetchScreenData() {
        this.props.fetchScreenData(this.props.context);

        const screenKey = getScreenDataKey({
            pubKey: this.props.walletPublicKey,
            blockchain: this.props.account.blockchain,
            chainId: this.props.chainId,
            address: this.props.account.address,
            tab: this.props.context?.tab
        });

        if (screenKey) {
            // console.log('screenKey', screenKey);
        }
    }

    public render() {
        return (
            <View>
                <Widgets
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
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
