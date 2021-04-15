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
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { Blockchain } from '../../../../core/blockchain/types';

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
    blockchain: Blockchain;
    swapToken2Amount: string;
    customSlippage: string;
    token2Decimals: number;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const endpointDataScreenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: ownProps.module?.details?.step,
        tab: undefined
    });

    return {
        blockchain: account.blockchain,

        // Data from Current Screen Key
        ...getStateSelectors(state, ownProps.module, {
            flowId: ownProps?.options?.flowId,
            screenKey: ownProps?.options?.screenKey
        }),

        // Data from Custom Screen Key
        ...getStateSelectors(state, ownProps.module, {
            flowId: ownProps?.options?.flowId,
            screenKey: endpointDataScreenKey
        })
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
                    const newAmountTo = new BigNumber(response.result.data.toTokenAmount);
                    const oldAmountTo = new BigNumber(this.props.swapToken2Amount);

                    const newAmount = getBlockchain(this.props.blockchain).account.amountFromStd(
                        newAmountTo,
                        this.props.token2Decimals
                    );
                    const oldAmount = getBlockchain(this.props.blockchain).account.amountFromStd(
                        oldAmountTo,
                        this.props.token2Decimals
                    );

                    const pricesDiff = new BigNumber(newAmount)
                        .multipliedBy(100)
                        .dividedBy(oldAmount);

                    if (
                        pricesDiff.isLessThan(new BigNumber(100).minus(this.props.customSlippage))
                    ) {
                        this.props.actions.handleCta(data.cta, {
                            screenKey,
                            extraParams: {
                                priceDifference: new BigNumber(100).minus(pricesDiff).toFixed(2)
                            }
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
