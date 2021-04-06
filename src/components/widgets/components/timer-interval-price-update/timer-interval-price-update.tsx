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
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return getStateSelectors(state, ownProps.module, {
        flowId: ownProps?.options?.flowId,
        screenKey: ownProps?.options?.screenKey
    });
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

    // public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
    //     const data = this.props.module?.data as ITimerUpdateData;

    //     const screenKey = this.props.options.screenKey;

    //     this.props.setScreenInputData(screenKey, {
    //         [data.reduxKey]: 1
    //     });
    // }

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    private onFocus() {
        this.startTimer();
    }

    private onWillBlur() {
        this.interval && clearInterval(this.interval);
    }

    private async getData(data: ITimerUpdateData, endpointData: any) {
        try {
            let response;

            switch (data.endpoint.method) {
                case 'POST':
                    response = await this.httpClient.post('', endpointData);
                    break;

                case 'GET':
                    response = await this.httpClient.get('');
                    break;

                default:
                    break;
            }

            if (response?.result?.data) {
                // response price
            }
        } catch (error) {
            // TODO: maybe do something here
        }
    }

    private async startTimer() {
        const screenKey = this.props.options.screenKey;
        const data = this.props.module?.data as ITimerUpdateData;

        const selector = this.props.module?.state?.selectors;

        if (data.numberOfSeconds) {
            this.interval && clearInterval(this.interval);
            this.remainingTime = data.numberOfSeconds;
            this.interval = setInterval(async () => {
                if (this.remainingTime !== 0) {
                    this.props.setScreenInputData(screenKey, {
                        [data.reduxKey]: this.remainingTime
                    });
                    this.remainingTime--;
                } else {
                    // fetch price;

                    const endpointData = data.endpoint.data;

                    Object.keys(data.endpoint.data).map(key => {
                        if (selector.hasOwnProperty(key)) {
                            endpointData[key] = this.props[key];
                        }
                    });

                    await this.getData(data, endpointData);
                }
            }, 1000); // interval is in seconds
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
