import React from 'react';
import Modal from 'react-native-modal';
import {
    pushInstance,
    attachListener,
    removeInstance,
    removeInstanceOnUnmount
} from './ModalWrapperHelper';
import { Animation } from 'react-native-animatable';

export interface IExternalProps {
    isVisible: boolean;
    dismissModalFromWrapper?: () => void;
    children: React.ReactNode;
    onModalHide?: () => void;
    otherProps?: any;
    animationIn?: Animation;
    animationInTiming?: number;
    animationOut?: Animation;
    animationOutTiming?: number;
}

interface IState {
    isVisible: boolean;
}

export class ModalWrapper extends React.Component<IExternalProps, IState> {
    constructor(props: IExternalProps) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    public componentDidMount() {
        const { isVisible } = this.props;
        attachListener(this.checkInstanceLength);
        if (isVisible) {
            pushInstance(this);
        }
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.isVisible !== prevProps.isVisible) {
            if (this.props.isVisible) {
                pushInstance(this);
            } else if (!this.props.isVisible) {
                this.setState({ isVisible: false });
            }
        }
    }

    public componentWillUnmount() {
        this.removeInstanceFromHelper();
    }

    public checkInstanceLength = async (length, instanceAtTop) => {
        if (length === 1 && instanceAtTop === this) {
            this.setState({ isVisible: true });
        } else if (length > 1 && instanceAtTop === this) {
            this.props.dismissModalFromWrapper && this.props.dismissModalFromWrapper();
        }
    };

    public combinedOnModalHide = () => {
        if (this.props.onModalHide) {
            this.props.onModalHide();
        }
        this.removeInstanceFromGlobal();
    };

    public removeInstanceFromGlobal = () => {
        removeInstance(this);
    };

    public removeInstanceFromHelper = () => {
        removeInstanceOnUnmount(this, this.checkInstanceLength);
    };

    public render() {
        return (
            <Modal
                animationIn={this.props?.animationIn || 'fadeIn'}
                animationInTiming={this.props?.animationInTiming || 300}
                animationOut={this.props?.animationOut || 'fadeOut'}
                animationOutTiming={this.props?.animationOutTiming || 300}
                isVisible={this.state.isVisible}
                onModalHide={this.combinedOnModalHide}
                style={{ margin: 0, alignItems: undefined, justifyContent: undefined }}
                {...this.props.otherProps}
            >
                {this.props.children}
            </Modal>
        );
    }
}

export default ModalWrapper;
