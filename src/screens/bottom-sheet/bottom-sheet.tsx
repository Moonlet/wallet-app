import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { IReduxState } from '../../redux/state';
import { AccountsBottomSheet } from './accounts-bottom-sheet/accounts-bottom-sheet';
import { BottomSheetType, IBottomSheet } from '../../redux/app/state';
import { setBottomSheet } from '../../redux/app/actions';

interface IReduxProps {
    bottomSheet: IBottomSheet;
    setBottomSheet: typeof setBottomSheet;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        bottomSheet: state.app.bottomSheet
    };
};

const mapDispatchToProps = {
    setBottomSheet
};

export class BottomSheetComponent extends React.Component<IReduxProps> {
    public render() {
        switch (this.props.bottomSheet?.type) {
            case BottomSheetType.Accounts:
                return (
                    <AccountsBottomSheet
                        onClose={() => this.props.setBottomSheet(undefined, undefined)}
                    />
                );
            default:
                return <View />;
        }
    }
}

export const BottomSheet = smartConnect(BottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps)
]);
