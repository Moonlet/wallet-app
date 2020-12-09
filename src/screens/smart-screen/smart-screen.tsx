import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import stylesProvider from './styles';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { IScreenContext, IScreenValidation, IScreenWidget } from '../../components/widgets/types';
import { IReduxState } from '../../redux/state';
import { IScreenData, IScreensData } from '../../redux/ui/screens/data/state';
import { getScreenDataKey } from '../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../redux/wallets/selectors';
import { getChainId } from '../../redux/preferences/selectors';
import { IAccountState } from '../../redux/wallets/state';
import { ErrorWidget } from '../../components/widgets/components/error-widget/error-widget';
import { translate } from '../../core/i18n';
import { LoadingSkeleton } from '../../components/smart-screen/components/loading-skeleton/loading-skeleton';
import {
    clearScreenInputData,
    runScreenValidation,
    runScreenStateActions,
    setScreenInputData
} from '../../redux/ui/screens/input-data/actions';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import LinearGradient from 'react-native-linear-gradient';
import { v4 as uuidv4 } from 'uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { handleCta } from '../../redux/ui/screens/data/handle-cta';

interface INavigationParams {
    context: IScreenContext;
    navigationOptions?: any;
    background?: {
        color?: string;
        gradient?: string[];
    };
    newFlow?: boolean;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
    const account = getSelectedAccount(state);
    const chainId = account && getChainId(state, account.blockchain);

    return {
        screenData:
            state.ui.screens.data &&
            ownProps?.context?.screen &&
            state.ui.screens.data[ownProps.context.screen],

        walletPublicKey: getSelectedWallet(state)?.walletPublicKey,
        account,
        chainId
    };
};

interface IReduxProps {
    screenData: IScreensData;

    walletPublicKey: string;
    account: IAccountState;
    chainId: string;

    fetchScreenData: typeof fetchScreenData;
    handleCta: typeof handleCta;
    clearScreenInputData: typeof clearScreenInputData;
    runScreenValidation: typeof runScreenValidation;
    runScreenStateActions: typeof runScreenStateActions;
    setScreenInputData: typeof setScreenInputData;
}

const mapDispatchToProps = {
    fetchScreenData,
    handleCta,
    clearScreenInputData,
    runScreenValidation,
    runScreenStateActions,
    setScreenInputData
};

interface IState {
    loadingTimeoutInProgress: boolean;
    loadingScreenData: boolean;
    context: IScreenContext;
}

const navigationOptions = ({ navigation, theme }: any) =>
    navigation?.state?.params?.navigationOptions || {};

class SmartScreenComponent extends React.Component<
    INavigationProps<INavigationParams> &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;

    private loadingTimeout: any;

    constructor(
        props: INavigationProps<INavigationParams> &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        this.state = {
            loadingTimeoutInProgress: false,
            loadingScreenData: false,
            context: {
                ...props.context,
                flowId: props.newFlow ? uuidv4() : props.context?.flowId
            }
        };
    }

    public componentDidMount() {
        this.props.navigationOptions &&
            this.props.navigation.setParams({
                navigationOptions: this.props.navigationOptions
            });

        this.props.fetchScreenData(this.state.context);
    }

    public componentDidUpdate(prevProps: IReduxProps & INavigationParams) {
        if (
            this.props.walletPublicKey !== prevProps.walletPublicKey ||
            this.props.account?.blockchain !== prevProps.account?.blockchain ||
            this.props.chainId !== prevProps.chainId ||
            this.props.account.address !== prevProps.account.address ||
            this.props.context.step !== prevProps.context.step ||
            this.props.context.tab !== prevProps.context.tab
        ) {
            this.props.fetchScreenData(this.state.context);
        }

        this.updateLoading(prevProps);
        this.handleScreenValidation();
        this.getResponseNavigationOptions(prevProps);
    }

    private getResponseNavigationOptions(prevProps: IReduxProps & INavigationParams) {
        const screenData = this.getScreenData(this.props);
        const prevScreenData = this.getScreenData(prevProps);

        if (
            screenData?.response?.navigationOptions !== prevScreenData?.response?.navigationOptions
        ) {
            this.props.navigation.setParams({
                navigationOptions: screenData.response.navigationOptions
            });
        }
    }

    private handleScreenValidation() {
        const screenData = this.getScreenData(this.props);

        if (screenData?.response?.validation) {
            const screenKey = this.getScreenKey(this.props);

            this.props.runScreenValidation(
                screenData.response.validation,
                this.state.context?.flowId || screenKey
            );
        }
    }

    private getScreenKey(props: IReduxProps & INavigationParams) {
        return getScreenDataKey({
            pubKey: props.walletPublicKey,
            blockchain: props.account?.blockchain,
            chainId: props.chainId,
            address: props.account?.address,
            step: props.context?.step,
            tab: props.context?.tab
        });
    }

    private getScreenData(props: IReduxProps & INavigationParams): IScreenData {
        const screenKey = this.getScreenKey(props);
        return props.screenData && screenKey && props.screenData[screenKey];
    }

    private startLoadingTimeout() {
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

    private updateLoading(prevProps: IReduxProps & INavigationParams) {
        const screenData = this.getScreenData(this.props);
        const prevScreenData = this.getScreenData(prevProps);

        if (screenData?.isLoading !== prevScreenData?.isLoading) {
            if (screenData?.isLoading) {
                if (!screenData?.response) {
                    this.setState({
                        loadingScreenData: true,
                        loadingTimeoutInProgress: true
                    });

                    this.startLoadingTimeout();
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

    private renderWidgets(widgets: IScreenWidget[], validation?: IScreenValidation) {
        return (
            <Widgets
                data={widgets}
                context={this.state.context}
                screenKey={this.getScreenKey(this.props)}
                actions={{
                    handleCta: this.props.handleCta,
                    clearScreenInputData: this.props.clearScreenInputData,
                    runScreenValidation: this.props.runScreenValidation,
                    runScreenStateActions: this.props.runScreenStateActions,
                    setScreenInputData: this.props.setScreenInputData
                }}
                blockchain={this.props.account.blockchain}
                validation={validation}
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
                    onPress: () => {
                        // Start loading
                        this.setState(
                            {
                                loadingScreenData: true,
                                loadingTimeoutInProgress: true
                            },
                            () => {
                                // Start loading screen timemout
                                this.startLoadingTimeout();
                                // Fetch screen data
                                this.props.fetchScreenData(this.state.context);
                            }
                        );
                    }
                }}
            />
        );
    }

    private renderLoadingSkeleton(nr: number = 1) {
        return new Array(nr)
            .fill('')
            .map((_, index: number) => <LoadingSkeleton key={`skeleton-${index}`} />);
    }

    public render() {
        const { background, styles } = this.props;
        const { loadingScreenData } = this.state;

        const screenData = this.getScreenData(this.props);

        return (
            <View style={styles.container}>
                {/* Color Background */}
                {background && background?.color && typeof background.color === 'string' && (
                    <View
                        style={[styles.gradientBackground, { backgroundColor: background.color }]}
                    />
                )}

                {/* Gradient Background */}
                {background && background?.gradient && Array.isArray(background.gradient) && (
                    <LinearGradient
                        colors={background.gradient}
                        style={styles.gradientBackground}
                    />
                )}

                {/* Widgets */}
                {screenData && (
                    <KeyboardAwareScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        enableOnAndroid
                    >
                        {loadingScreenData && (
                            <View style={styles.skeletonContainer}>
                                {this.renderLoadingSkeleton(6)}
                            </View>
                        )}

                        {/* Render Widgets */}
                        {!loadingScreenData &&
                            screenData.response?.widgets &&
                            this.renderWidgets(
                                screenData.response.widgets,
                                screenData.response?.validation
                            )}

                        {/* Display Error (Try again)*/}
                        {!loadingScreenData && screenData.error && (
                            <View style={styles.errorContainer}>{this.renderErrorWidget()}</View>
                        )}
                    </KeyboardAwareScrollView>
                )}

                {/* Bottom Fixed Area (only one widget)*/}
                {!loadingScreenData &&
                    screenData?.response?.bottomFixedArea &&
                    this.renderWidgets([screenData.response.bottomFixedArea])}
            </View>
        );
    }
}

export const SmartScreen = smartConnect(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
