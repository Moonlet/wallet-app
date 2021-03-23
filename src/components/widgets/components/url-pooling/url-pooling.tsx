import React from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
// import { HttpClient } from '../../../../core/utils/http-client';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IReduxState } from '../../../../redux/state';
import { IScreenContext, IScreenModule, ISmartScreenActions, IUrlPoolingData } from '../../types';
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

const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return getStateSelectors(state, ownProps.module, {
        flowId: ownProps?.options?.flowId,
        screenKey: ownProps?.options?.screenKey
    });
};

class UrlPoolingModuleComponent extends React.Component<IExternalProps> {
    private interval: any;
    // private httpClient: HttpClient;

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    public fetchData() {
        const data = this.props.module?.data as IUrlPoolingData;

        const selector = this.props.module?.state?.selectors;

        // this.httpClient = new HttpClient(data.endpoint.url);

        if (data.interval) {
            const endpointData = data.endpoint.data;
            Object.keys(data.endpoint.data).map(key => {
                if (selector.hasOwnProperty(key)) {
                    endpointData[key] = this.props[key];
                }
            });
            // this.httpClient = new HttpClient(data.endpoint.url);

            this.interval = setInterval(async () => {
                //
            }, data.interval);
        }

        // call fecth(dataEndpoind)

        // this.props.actions.setScreenInputData
        // if (data?.) {
    }

    public componentDidMount() {
        this.fetchData();
    }

    public onFocus() {
        this.fetchData();
    }

    public onWillBlur() {
        this.interval && clearInterval(this.interval);
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

export const UrlPoolingModule = smartConnect<IExternalProps>(UrlPoolingModuleComponent, [
    connect(mapStateToProps, null)
]);
