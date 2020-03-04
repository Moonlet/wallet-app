import React from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import Modal from '../../../library/modal/modal';
import { Legal } from '../legal';
import { getFirebaseTCVersion } from '../../../core/utils/remote-feature-config';

interface IExternalProps {
    navigationState: any;
}

export interface IReduxProps {
    tcAcceptedVersion: number;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        tcAcceptedVersion: state.app.tcAcceptedVersion
    };
};

interface IState {
    showModal: boolean;
    tcFirebaseVersion: number;
}

export class LegalModalComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            showModal: false,
            tcFirebaseVersion: undefined
        };
    }

    public componentDidMount() {
        this.handleShowLegalModal();
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.navigationState !== prevProps.navigationState) {
            this.handleShowLegalModal();
        }
    }

    private handleShowLegalModal = () => {
        if (this.props.navigationState) {
            const index = this.props.navigationState.index;
            const currentRoute = this.props.navigationState.routes[index].routeName;
            const tcFirebaseVersion = getFirebaseTCVersion();

            const showLegalModal =
                currentRoute !== 'OnboardingScreen' &&
                tcFirebaseVersion !== undefined &&
                (this.props.tcAcceptedVersion === undefined ||
                    tcFirebaseVersion > this.props.tcAcceptedVersion) &&
                Platform.OS !== 'web';

            if (showLegalModal) {
                this.setState({
                    tcFirebaseVersion,
                    showModal: true
                });
            }
        }
    };

    public render() {
        return (
            <Modal isVisible={this.state.showModal}>
                <View style={this.props.styles.container}>
                    <Legal
                        tcFirebaseVersion={this.state.tcFirebaseVersion}
                        onAccept={() => this.setState({ showModal: false })}
                    />
                </View>
            </Modal>
        );
    }
}

export const LegalModal = smartConnect<IExternalProps>(LegalModalComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
