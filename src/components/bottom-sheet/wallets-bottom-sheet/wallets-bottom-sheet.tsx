import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { BottomSheetHeader } from '../header/header';
import { setSelectedWallet } from '../../../redux/wallets/actions';
import { IReduxState } from '../../../redux/state';
import { getSelectedWallet } from '../../../redux/wallets/selectors';
import { connect } from 'react-redux';
import { ListCard } from '../../list-card/list-card';
import { IWalletState } from '../../../redux/wallets/state';
import { WalletType } from '../../../core/wallet/types';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}
export interface IReduxProps {
    selectedWallet: IWalletState;
    wallets: IWalletState[];
    setSelectedWallet: typeof setSelectedWallet;
}
const mapStateToProps = (state: IReduxState) => {
    return {
        selectedWallet: getSelectedWallet(state),
        wallets: state.ui.bottomSheet.wallets.sort((w1, w2) => (w1.name > w2.name ? 1 : -1)) // Sort wallets alphabetically by name
    };
};
const mapDispatchToProps = {
    setSelectedWallet
};

export class WalletsBottomSheetComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public bottomSheet: any;

    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.bottomSheet = React.createRef();
    }

    public componentDidMount() {
        Platform.OS !== 'web' && this.bottomSheet.current.snapTo(1);
    }

    public renderBottomSheetContent() {
        return (
            <View
                style={[
                    this.props.styles.container,
                    { height: this.props.snapPoints.bottomSheetHeight }
                ]}
            >
                <ScrollView
                    contentContainerStyle={[
                        this.props.styles.scrollContainer,
                        { height: this.props.snapPoints.bottomSheetHeight }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {this.props.wallets.map((wallet: IWalletState) => (
                        <ListCard
                            key={wallet.id}
                            onPress={() => {
                                this.props.onClose();
                                this.props.setSelectedWallet(wallet.id);
                            }}
                            leftIcon={wallet.type === WalletType.HW ? 'ledger-logo' : 'saturn-icon'}
                            label={wallet.name}
                            rightIcon={this.props.selectedWallet.id === wallet.id && 'check-1'}
                            selected={this.props.selectedWallet.id === wallet.id}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    }

    public render() {
        return (
            <BottomSheet
                ref={this.bottomSheet}
                initialSnap={0}
                snapPoints={[
                    this.props.snapPoints.initialSnap,
                    this.props.snapPoints.bottomSheetHeight
                ]}
                renderContent={() => this.renderBottomSheetContent()}
                renderHeader={() => (
                    <BottomSheetHeader
                        obRef={this.bottomSheet}
                        onClose={() => this.props.onClose()}
                    />
                )}
                enabledInnerScrolling={false}
                enabledContentTapInteraction={false}
                onCloseEnd={() => this.props.onClose()}
            />
        );
    }
}

export const WalletsBottomSheet = smartConnect<IExternalProps>(WalletsBottomSheetComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
