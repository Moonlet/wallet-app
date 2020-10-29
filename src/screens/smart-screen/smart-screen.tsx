import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData, IScreenDatas } from '../../redux/ui/screens/data/state';
import { withdraw, claimRewardNoInput } from '../../redux/wallets/actions/pos-actions';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { IAccountState } from '../../redux/wallets/state';
import { getAccountStats } from '../../redux/ui/stats/selectors';
import { AccountStats } from '../../core/blockchain/types/stats';
import { SkeletonPlaceholder } from '../../components/skeleton-placeholder/skeleton-placeholder';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { ErrorWidget } from '../../components/widgets/components/error-widget/error-widget';
import { translate } from '../../core/i18n';

interface IExternalProps {
    context: IScreenContext;
}

const mapStateToProps = (state: IReduxState) => {
    const account = getSelectedAccount(state);
    const chainId = account && getChainId(state, account.blockchain);

    return {
        dashboard: state.ui.screens.data.dashboard,
        token: state.ui.screens.data.token,
        accountStats:
            account && getAccountStats(state, account.blockchain, chainId, account.address),
        walletPublicKey: getSelectedWallet(state)?.walletPublicKey,
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

    claimRewardNoInput: typeof claimRewardNoInput;
    withdraw: typeof withdraw;
}

const mapDispatchToProps = {
    fetchScreenData,

    claimRewardNoInput,
    withdraw
};

interface IState {
    screenData: IScreenData;
    isLoading: boolean;
    error: any;
}

export class SmartScreenComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
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
            (this.props.account && this.props.account !== prevProps.account) ||
            (this.props.walletPublicKey &&
                this.props.walletPublicKey !== prevProps.walletPublicKey) ||
            (this.props.chainId && this.props.chainId !== prevProps.chainId) ||
            this.props.context?.tab !== prevProps.context?.tab
        ) {
            this.props.fetchScreenData(this.props.context);
            this.getScreenData();
        }

        // TODO: needs to be fixed for tab account

        if (
            (this.props.dashboard && this.props.dashboard !== prevProps.dashboard) ||
            (this.props.token && this.props.token !== prevProps.token)
        ) {
            this.getScreenData();
        }
    }

    private getScreenData() {
        const { dashboard, token } = this.props;

        const screenKey = getScreenDataKey({
            pubKey: this.props.walletPublicKey,
            blockchain: this.props.account.blockchain,
            chainId: this.props.chainId,
            address: this.props.account.address,
            tab: this.props.context?.tab
        });

        if (dashboard && dashboard[screenKey]) {
            const screenData: IScreenData = dashboard[screenKey];

            screenData &&
                this.setState({
                    screenData,
                    isLoading: screenData.isLoading,
                    error: screenData.error
                });
        } else if (token && token[screenKey]) {
            const screenData: IScreenData = token[screenKey];

            screenData &&
                this.setState({
                    screenData,
                    isLoading: screenData.isLoading,
                    error: screenData.error
                });
        } else {
            this.setState({
                screenData: undefined,
                isLoading: true,
                error: undefined
            });
        }
    }

    public render() {
        const { styles, theme } = this.props;
        const { screenData } = this.state;

        if (this.state.isLoading) {
            return (
                <View style={styles.skeletonWrapper}>
                    {new Array(4).fill('').map((_, index: number) => (
                        <SkeletonPlaceholder
                            key={`skelet-${index}`}
                            backgroundColor={theme.colors.textTertiary}
                            highlightColor={theme.colors.accent}
                            speed={Math.floor(Math.random() * 700) + 1000}
                        >
                            <View style={styles.detailsSkeletonComp}>
                                <View style={styles.detailsSkeletonIcon} />
                                <View style={{ justifyContent: 'space-between' }}>
                                    <View style={styles.detailsSkeletonPrimaryValue} />
                                    <View style={styles.detailsSkeletonSecondaryValue} />
                                </View>
                            </View>
                        </SkeletonPlaceholder>
                    ))}
                </View>
            );
        }

        if (screenData?.response?.widgets) {
            return (
                <View>
                    <Widgets
                        data={screenData.response.widgets}
                        actions={{
                            claimRewardNoInput: this.props.claimRewardNoInput,
                            withdraw: this.props.withdraw
                        }}
                        account={this.props.account}
                        chainId={this.props.chainId}
                    />
                </View>
            );
        }

        if (this.state.error) {
            return (
                <ErrorWidget
                    header={translate('Widgets.wentWrong')}
                    body={translate('Widgets.didNotLoad')}
                    cta={{
                        label: translate('App.labels.retry'),
                        onPress: () => {
                            this.props.fetchScreenData(this.props.context);
                            this.getScreenData();
                            this.setState({ isLoading: true });
                        }
                    }}
                />
            );
        }

        return null;
    }
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
