import React from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { setScreenInputData } from '../../../../redux/ui/screens/input-data/actions';
import { IScreenContext, IScreenModule, ISmartScreenActions, ITimerUpdateData } from '../../types';
import { getStateSelectors } from '../ui-state-selectors';
import { HttpClient } from '../../../../core/utils/http-client';
import { getChainId } from '../../../../redux/preferences/selectors';
import { getScreenDataKey } from '../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../redux/wallets/selectors';
import BigNumber from 'bignumber.js';
import { getSwapPrice } from '../ui-state-selectors/swap';
interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

interface IReduxProps {
    setScreenInputData: typeof setScreenInputData;
    swapPrice: string;
    customSlippage: number;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const endpointDataScreenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: ownProps.module?.details.step,
        tab: undefined
    });

    return {
        ...getStateSelectors(state, ownProps.module, {
            flowId: ownProps?.options?.flowId,
            screenKey: ownProps?.options?.screenKey
        }),
        ...getStateSelectors(state, ownProps.module, {
            flowId: ownProps?.options?.flowId,
            screenKey: endpointDataScreenKey
        }),
        swapPrice: getSwapPrice(state, ownProps.module, { screenKey: endpointDataScreenKey }, null),
        customSlippage: state.ui.screens.inputData[endpointDataScreenKey].data.customSlippage
    };
};

const mapDispatchToProps = {
    setScreenInputData
};

class TimerIntervalPriceUpdateModuleComponent extends React.Component<
    IReduxProps & IExternalProps
> {
    private interval: any;
    private remainingTime: number;
    private httpClient: HttpClient;

    public componentDidMount() {
        this.startTimer();
    }

    public componentWillUnmount() {
        this.clearData();
    }

    private onFocus() {
        this.startTimer();
    }

    private onWillBlur() {
        this.clearData();
    }

    private clearData() {
        const screenKey = this.props.options.screenKey;
        const data = this.props.module?.data as ITimerUpdateData;
        this.props.setScreenInputData(screenKey, {
            [data.reduxKey]: undefined
        });
        this.interval && clearInterval(this.interval);
    }

    private async fetchData(data: ITimerUpdateData) {
        const screenKey = this.props.options.screenKey;
        const selector = this.props.module?.state?.selectors;

        if (this.remainingTime !== 0) {
            this.remainingTime--;
            this.props.setScreenInputData(screenKey, {
                [data.reduxKey]: this.remainingTime
            });
        } else {
            this.interval && clearInterval(this.interval);

            const endpointData = data.endpoint.data;

            Object.keys(data.endpoint.data).map(key => {
                if (selector.hasOwnProperty(key)) {
                    endpointData[key] = this.props[key];
                }
            });

            try {
                const response = await this.httpClient.post('', endpointData);
                if (response?.result?.data) {
                    // TODO: Check this
                    if (
                        new BigNumber(response.result.data.rate).isGreaterThan(this.props.swapPrice)
                    ) {
                        this.props.actions.handleCta(data.cta, {
                            screenKey
                        });
                    } else {
                        this.startTimer();
                    }
                }
            } catch (error) {
                this.startTimer();
            }
        }
    }

    private async startTimer() {
        const data = this.props.module?.data as ITimerUpdateData;

        this.httpClient = new HttpClient(data.endpoint.url);

        if (data.numSeconds) {
            this.remainingTime = data.numSeconds;

            await this.fetchData(data);

            this.interval && clearInterval(this.interval);
            this.interval = setInterval(async () => {
                await this.fetchData(data);
            }, data.interval);
        }
    }

    public render() {
        return (
            <View>
                <NavigationEvents
                    onWillFocus={() => this.onFocus()}
                    onWillBlur={() => this.onWillBlur()}
                />
            </View>
        );
    }
}

export const TimerIntervalPriceUpdateModule = smartConnect<IExternalProps>(
    TimerIntervalPriceUpdateModuleComponent,
    [connect(mapStateToProps, mapDispatchToProps)]
);
