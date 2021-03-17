import React from 'react';
import { View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IScreenContext, IScreenModule, ISmartScreenActions } from '../../types';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
}

class UrlPoolingModuleComponent extends React.Component<IExternalProps> {
    private interval: any;

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    public onFocus() {
        // const data = this.props.module?.data as IUrlPoolingData;
        // this.props.actions.setScreenInputData
        // if (data?.) {
        //     this.interval = setInterval(async () => {
        //         //
        //     }, details.interval);
        // }
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

export const UrlPoolingModule = smartConnect<IExternalProps>(UrlPoolingModuleComponent);
