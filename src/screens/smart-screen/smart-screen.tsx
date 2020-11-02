import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenDatas } from '../../redux/ui/screens/data/state';
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
    loadingAnimationDone: boolean;
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
            loadingAnimationDone: false
        };
    }

    public componentDidMount() {
        this.props.fetchScreenData(this.props.context);
        this.resetLoadingAnimation();
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
            this.resetLoadingAnimation();
        }
    }

    private resetLoadingAnimation() {
        this.setState({ loadingAnimationDone: false }, () =>
            setTimeout(() => this.setState({ loadingAnimationDone: true }), 1200)
        );
    }

    public render() {
        const { screenData, styles, theme } = this.props;

        const screenKey = getScreenDataKey({
            pubKey: this.props.walletPublicKey,
            blockchain: this.props.account?.blockchain,
            chainId: this.props.chainId,
            address: this.props.account?.address,
            tab: this.props.context?.tab
        });

        if (screenData && screenKey && screenData[screenKey]) {
            const data = screenData[screenKey];

            if (!this.state.loadingAnimationDone || (data.isLoading && !data.response)) {
                return (
                    <View key={'skeleton-placeholder'} style={styles.skeletonWrapper}>
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

            if (data.response?.widgets) {
                return (
                    <View>
                        <Widgets
                            data={data.response.widgets}
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

            if (data.error) {
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
        }

        return null;
    }
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
