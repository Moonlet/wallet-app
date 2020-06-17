import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        selectorGradientContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: normalize(70), // used for 20px
            bottom: 0,
            justifyContent: 'flex-end'
        },
        blockchainSelectorContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: normalize(20),
            height: normalize(40),
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginHorizontal: BASE_DIMENSION * 2,
            overflow: 'hidden'
        },
        blockchainButton: {
            flex: 1,
            flexBasis: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: normalize(16),
            margin: BASE_DIMENSION / 2
        },
        blockchainButtonActive: {
            backgroundColor: theme.colors.textTertiary
        },
        blockchainButtonTextActive: {
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.accent
        },
        expandIconContainer: {
            marginRight: BASE_DIMENSION * 2,
            justifyContent: 'center'
        },
        expandIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        bottomBlockchainContainer: {
            flex: 1,
            flexDirection: 'row'
        }
    });
