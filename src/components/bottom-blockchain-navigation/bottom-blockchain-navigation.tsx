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
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { Text } from '../../library';
import { openBottomSheet } from '../../redux/ui/bottomSheet/actions';
import { connect } from 'react-redux';

export interface IExternalProps {
    blockchains: Blockchain[];
    selectedBlockchain: Blockchain;
    extraSelectedBlockchain?: Blockchain;
    onSelectBlockchain: (Blockchain: Blockchain) => void;
}

export interface IReduxProps {
    openBottomSheet: typeof openBottomSheet;
}

const mapDispatchToProps = {
    openBottomSheet
};

export const BottomBlockchainNavigationComponent = (
    props: IReduxProps & IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    const renderBlockchain = (blockchain: Blockchain) => {
        return (
            <TouchableOpacity
                key={blockchain}
                style={[
                    styles.blockchainButton,
                    props.selectedBlockchain === blockchain && styles.blockchainButtonActive,
                    { width: props.blockchains.length > 4 ? SCREEN_WIDTH / 4 : 0 }
                ]}
                onPress={() => props.onSelectBlockchain(blockchain)}
            >
                <Text
                    style={
                        props.selectedBlockchain === blockchain && styles.blockchainButtonTextActive
                    }
                >
                    {blockchain && getBlockchain(blockchain).config.ui.displayName}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={props.theme.shadowGradient}
            locations={[0, 0.5]}
            style={styles.selectorGradientContainer}
        >
            <View style={styles.blockchainSelectorContainer} testID="blockchain-selector">
                <View style={styles.bottomBlockchainContainer}>
                    {props.blockchains.slice(0, 4).map(blockchain => renderBlockchain(blockchain))}

                    {props?.extraSelectedBlockchain &&
                        renderBlockchain(props.extraSelectedBlockchain)}

                    {props.blockchains.length > 4 && (
                        <TouchableOpacity
                            onPress={() =>
                                props.openBottomSheet(BottomSheetType.BLOCKCHAIN_NAVIGATION)
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
};

export const BottomBlockchainNavigation = smartConnect<IExternalProps>(
    BottomBlockchainNavigationComponent,
    [connect(null, mapDispatchToProps), withTheme(stylesProvider)]
);
