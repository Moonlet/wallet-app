import React from 'react';
import { View } from 'react-native';
import { withNavigationParams } from '../../navigation/with-navigation-params';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { Widgets } from '../../components/widgets/widgets';
import { fetchScreenData } from '../../redux/ui/screens/data/actions';
import { IScreenContext } from '../../components/widgets/types';

interface IExternalProps {
    context: IScreenContext;
}

const mapStateToProps = () => {
    return {
        //
    };
};

interface IReduxProps {
    fetchScreenData: typeof fetchScreenData;
}

const mapDispatchToProps = {
    fetchScreenData
};

export class SmartScreenComponent extends React.Component<IReduxProps & IExternalProps> {
    public componentDidMount() {
        this.props.fetchScreenData(this.props.context);
    }

    public render() {
        return (
            <View>
                <Widgets />
            </View>
        );
    }
}

export const SmartScreen = smartConnect<IExternalProps>(SmartScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withNavigationParams()
]);
