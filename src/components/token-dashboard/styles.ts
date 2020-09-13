import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    normalizeFontAndLineHeight,
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    SCALE
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        tokensContainer: {
            flex: 1
        },
        cardWrapper: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2 + BASE_DIMENSION / 2,
            justifyContent: 'space-between'
        },
        cardContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.cardBackground + '80', // 50% opacity
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            borderRadius: BORDER_RADIUS * 2,
            marginRight: BASE_DIMENSION
        },
        cardText: {
            fontSize: normalizeFontAndLineHeight(13),
            fontWeight: '500',
            color: theme.colors.textSecondary,
            marginLeft: BASE_DIMENSION,
            maxWidth: Platform.select({
                web: normalize(104),
                default: SCALE < 1 || Platform.OS === 'web' ? normalize(110) : null
            })
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.textSecondary
        },
        quickDelegateBannerContainer: {
            marginTop: BASE_DIMENSION
        }
    });
