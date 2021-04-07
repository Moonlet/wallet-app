import React from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { HttpClient } from '../../../../core/utils/http-client';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import {
    setScreenInputData,
    setSwapInputAmount
} from '../../../../redux/ui/screens/input-data/actions';
import { IScreenContext, IScreenModule, ISmartScreenActions, IPriceUpdateData } from '../../types';
import { getStateSelectors } from '../ui-state-selectors';

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
    setSwapInputAmount: typeof setSwapInputAmount;
}

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return getStateSelectors(state, ownProps.module, {
        flowId: ownProps?.options?.flowId,
        screenKey: ownProps?.options?.screenKey
    });
};

const mapDispatchToProps = {
    setScreenInputData,
    setSwapInputAmount
};

class PriceUpdateModuleComponent extends React.Component<IReduxProps & IExternalProps> {
    private interval: any;
    private httpClient: HttpClient;
    private fetchDataTimeout: any;

    public componentDidMount() {
        this.fetchData();
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        const data = this.props.module?.data as IPriceUpdateData;

        const selector = this.props.module?.state?.selectors;

        for (const key of Object.keys(data.endpoint.data)) {
            if (selector?.hasOwnProperty(key)) {
                if (
                    this.props[key] !== undefined &&
                    JSON.stringify(this.props[key]) !== JSON.stringify(prevProps[key])
                ) {
                    this.fetchDataTimeout && clearTimeout(this.fetchDataTimeout);
                    this.fetchDataTimeout = setTimeout(() => this.fetchData(), 300);
                }
            }
        }
    }

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    private onFocus() {
        this.fetchData();
    }

    private onWillBlur() {
        this.interval && clearInterval(this.interval);
    }

    private async getData(data: IPriceUpdateData, endpointData: any) {
        const screenKey = this.props.options.screenKey;

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
                this.props.setScreenInputData(screenKey, {
                    [data.reduxKey]: response.result.data
                });

                this.props.setSwapInputAmount(this.props.context, screenKey);
            }
        } catch (error) {
            // TODO: maybe do something here
        }
    }

    private async fetchData() {
        const data = this.props.module?.data as IPriceUpdateData;

        const selector = this.props.module?.state?.selectors;

        if (data.interval) {
            const endpointData = data.endpoint.data;

            Object.keys(data.endpoint.data).map(key => {
                if (selector.hasOwnProperty(key)) {
                    endpointData[key] = this.props[key];
                }
            });

            this.httpClient = new HttpClient(data.endpoint.url);

            await this.getData(data, endpointData);

            this.interval && clearInterval(this.interval);
            this.interval = setInterval(async () => {
                await this.getData(data, endpointData);
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

export const PriceUpdateModule = smartConnect<IExternalProps>(PriceUpdateModuleComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
