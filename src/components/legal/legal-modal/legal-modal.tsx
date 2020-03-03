import React, { useState, useEffect } from 'react';
import { View, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import Modal from '../../../library/modal/modal';
import { Legal } from '../legal';
import { getTCVersion } from '../../../core/utils/remote-feature-config';
import { appSetAcceptedTcVersion } from '../../../redux/app/actions';

export interface IReduxProps {
    tcVersion: number;
    appSetAcceptedTcVersion: typeof appSetAcceptedTcVersion;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        tcVersion: state.app.tcVersion
    };
};

const mapDispatchToProps = {
    appSetAcceptedTcVersion
};

export const LegalModalComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        const tcAcceptedVersion = getTCVersion();

        if (tcAcceptedVersion !== undefined) {
            props.appSetAcceptedTcVersion(tcAcceptedVersion);
            if (
                props.tcVersion !== undefined &&
                tcAcceptedVersion > props.tcVersion &&
                Platform.OS !== 'web'
            ) {
                setShowModal(true);
            }
        }
    });

    return (
        <Modal isVisible={showModal}>
            <View style={props.styles.container}>
                <Legal onAccept={() => setShowModal(false)} />
            </View>
        </Modal>
    );
};

export const LegalModal = smartConnect(LegalModalComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
