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
        const details = this.props.module?.details;

        // Take data from here: details

        // this.props.actions.setScreenInputData

        if (details?.interval) {
            this.interval = setInterval(async () => {
                //
            }, details.interval);
        }
    }

    public componentWillUnmount() {
        this.interval && clearInterval(this.interval);
    }

    public render() {
        return <View />;
    }
}

export const IntervalDataModule = smartConnect<IExternalProps>(IntervalDataModuleComponent);
