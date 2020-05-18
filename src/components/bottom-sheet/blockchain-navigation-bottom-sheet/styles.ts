import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bottomSheetBackground,
            padding: BASE_DIMENSION * 2
        },
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: theme.colors.bottomSheetBackground,
            marginTop: BASE_DIMENSION
        },
        tokenContainer: {
            flex: Platform.OS === 'web' ? 1 / 3 : 1 / 4,
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION * 2
        },
        tokenImageContainer: {
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS * 2,
            padding: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION,
            borderWidth: 2
        },
        coinText: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text,
            textAlign: 'center'
        }
    });
