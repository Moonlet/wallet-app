import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { IScreenContext, IScreenModule, ISmartScreenActions } from '../../types';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
}

class IntervalDataModuleComponent extends React.Component<IExternalProps> {
    private interval: any;

    public componentDidMount() {
        // const data = this.props.module?.data;
        // Take data from here: details
        // this.props.actions.setScreenInputData
        // TODO add navigationEvents
        // if (data?.) {
        //     this.interval = setInterval(async () => {
        //         //
        //     }, details.interval);
        // }
    }

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    public render() {
        return <View />;
    }
}

export const IntervalDataModule = smartConnect<IExternalProps>(IntervalDataModuleComponent);
