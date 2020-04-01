import React from 'react';
import { View, Platform, FlatList, TouchableHighlight } from 'react-native';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import BottomSheet from 'reanimated-bottom-sheet';
import { BottomSheetHeader } from '../header/header';
import { IReduxState } from '../../../redux/state';
import { connect } from 'react-redux';
import { getBlockchains } from '../../../redux/preferences/selectors';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getSelectedBlockchain } from '../../../redux/wallets/selectors';
import { Blockchain } from '../../../core/blockchain/types';
import { setSelectedBlockchain } from '../../../redux/wallets/actions';
import { Text } from '../../../library/text/text';
import { SmartImage } from '../../../library/image/smart-image';

interface IExternalProps {
    snapPoints: { initialSnap: number; bottomSheetHeight: number };
    onClose: () => void;
}
export interface IReduxProps {
    blockchains: Blockchain[];
    selectedBlockchain: Blockchain;
    setSelectedBlockchain: typeof setSelectedBlockchain;
}

interface IState {
    viewableItems: [];
}

const mapStateToProps = (state: IReduxState) => {
    return {
        blockchains: getBlockchains(state),
        selectedBlockchain: getSelectedBlockchain(state)
    };
};
const mapDispatchToProps = {
    setSelectedBlockchain
};

export class BlockchainNavigationBottomSheetComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
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

    public renderToken = (blockchain: Blockchain) => {
        const { styles, theme } = this.props;
        const blockchainConfig = getBlockchain(blockchain).config;

        const coin = blockchainConfig.coin;
        const BlockchainIcon = blockchainConfig.iconComponent;

        return (
            <TouchableHighlight
                onPress={() => {
                    this.props.setSelectedBlockchain(blockchain);
                    this.props.onClose();
                }}
                underlayColor={theme.colors.bottomSheetBackground}
                style={styles.tokenContainer}
            >
                <View style={{ flex: 1 }}>
                    <View
                        style={[
                            styles.tokenImageContainer,
                            {
                                borderColor:
                                    this.props.selectedBlockchain === blockchain
                                        ? theme.colors.accentSecondary
                                        : theme.colors.cardBackground
                            }
                        ]}
                    >
                        <SmartImage source={{ iconComponent: BlockchainIcon }} />
                    </View>
                    <Text style={styles.coinText}>{coin}</Text>
                </View>
            </TouchableHighlight>
        );
    };

    public renderBottomSheetContent() {
        const { styles } = this.props;

        return (
            <View style={[styles.container, { height: this.props.snapPoints.bottomSheetHeight }]}>
                <View
                    style={[
                        styles.scrollContainer,
                        { height: this.props.snapPoints.bottomSheetHeight }
                    ]}
                >
                    <FlatList
                        data={this.props.blockchains}
                        renderItem={({ item }) => this.renderToken(item)}
                        keyExtractor={(_, index) => `token-${index}`}
                        showsVerticalScrollIndicator={false}
                        numColumns={Platform.OS === 'web' ? 3 : 4}
                    />
                </View>
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
            />
        );
    }
}

export const BlockchainNavigationBottomSheet = smartConnect<IExternalProps>(
    BlockchainNavigationBottomSheetComponent,
    [connect(mapStateToProps, mapDispatchToProps), withTheme(stylesProvider)]
);
