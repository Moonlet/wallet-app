import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    SCREEN_HEIGHT
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT
        },
        coinBalanceCard: {
            backgroundColor: theme.colors.appBackground,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            justifyContent: 'center'
        },
        dashboardContainer: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        darkerText: {
            color: theme.colors.textSecondary
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION,
            justifyContent: 'center'
        },
        account: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION
        },
        address: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.accent
        },
        mainText: {
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.white,
            marginRight: BASE_DIMENSION
        },
        secondaryText: {
            fontSize: normalizeFontAndLineHeight(16),
            color: theme.colors.textSecondary
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.textSecondary,
            fontWeight: 'bold',
            marginLeft: BASE_DIMENSION + BASE_DIMENSION / 2
        }
    });
