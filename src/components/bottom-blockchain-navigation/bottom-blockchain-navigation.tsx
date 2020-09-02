import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import LinearGradient from 'react-native-linear-gradient';
import { smartConnect } from '../../core/utils/smart-connect';
import { normalize, SCREEN_WIDTH } from '../../styles/dimensions';
import { BottomSheetType } from '../../redux/ui/bottomSheet/state';
import { IconValues } from '../icon/values';
import Icon from '../icon/icon';
import { Blockchain } from '../../core/blockchain/types';
import { Text } from '../../library';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { connect } from 'react-redux';
import { WalletType } from '../../core/wallet/types';
import { getSelectedWallet, getSelectedBlockchain } from '../../redux/wallets/selectors';
import { IReduxState } from '../../redux/state';
import { IWalletState } from '../../redux/wallets/state';
import { getBlockchains } from '../../redux/preferences/selectors';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { setSelectedBlockchain } from '../../redux/wallets/actions';

export interface IExternalProps {
    style?: any;
}

export interface IReduxProps {
    blockchains: Blockchain[];
    selectedBlockchain: Blockchain;
    wallet: IWalletState;
    openBottomSheet: typeof openBottomSheet;
    setSelectedBlockchain: typeof setSelectedBlockchain;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        blockchains: getBlockchains(state),
        selectedBlockchain: getSelectedBlockchain(state),
        wallet: getSelectedWallet(state)
    };
};

const mapDispatchToProps = {
    openBottomSheet,
    setSelectedBlockchain
};

interface IState {
    extraSelectedBlockchain: Blockchain;
}

export class BottomBlockchainNavigationComponent extends React.Component<
    IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            extraSelectedBlockchain: undefined
        };
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.selectedBlockchain !== prevProps.selectedBlockchain) {
            const blockchainNotFound =
                this.props.blockchains.slice(0, 4).indexOf(this.props.selectedBlockchain) === -1;

            if (blockchainNotFound) {
                this.setState({ extraSelectedBlockchain: this.props.selectedBlockchain });
            }
        }
    }

    private renderBlockchain(blockchain: Blockchain) {
        const { styles } = this.props;

        return (
            <TouchableOpacity
                key={blockchain}
                style={[
                    styles.blockchainButton,
                    this.props.selectedBlockchain === blockchain && styles.blockchainButtonActive,
                    { width: this.props.blockchains.length > 4 ? SCREEN_WIDTH / 4 : 0 }
                ]}
                onPress={() => this.props.setSelectedBlockchain(blockchain)}
            >
                <Text
                    style={
                        this.props.selectedBlockchain === blockchain &&
                        styles.blockchainButtonTextActive
                    }
                >
                    {blockchain && getBlockchain(blockchain).config.ui.displayName}
                </Text>
            </TouchableOpacity>
        );
    }

    public render() {
        const { styles } = this.props;

        /* Hardware wallets can have only one blockchain active */
        let renderBottomNav = false;
        const isHWWallet = this.props.wallet ? this.props.wallet.type === WalletType.HW : false;
        if (this.props.blockchains.length > 1 && !isHWWallet) renderBottomNav = true;

        if (renderBottomNav) {
            return (
                <LinearGradient
                    colors={this.props.theme.shadowGradient}
                    locations={[0, 0.5]}
                    style={[styles.selectorGradientContainer, this.props.style]}
                >
                    <View style={styles.blockchainSelectorContainer} testID="blockchain-selector">
                        <View style={styles.bottomBlockchainContainer}>
                            {this.props.blockchains
                                .slice(0, 4)
                                .map(blockchain => this.renderBlockchain(blockchain))}

                            {this.state.extraSelectedBlockchain &&
                                this.renderBlockchain(this.state.extraSelectedBlockchain)}

                            {this.props.blockchains.length > 4 && (
                                <TouchableOpacity
                                    onPress={() =>
                                        this.props.openBottomSheet(
                                            BottomSheetType.BLOCKCHAIN_NAVIGATION
                                        )
                                    }
                                    style={styles.expandIconContainer}
                                >
                                    <Icon
                                        name={IconValues.EXPAND}
                                        size={normalize(28)}
                                        style={styles.expandIcon}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </LinearGradient>
            );
        } else {
            return null;
        }
    }
}

export const BottomBlockchainNavigation = smartConnect<IExternalProps>(
    BottomBlockchainNavigationComponent,
    [connect(mapStateToProps, mapDispatchToProps), withTheme(stylesProvider)]
);
