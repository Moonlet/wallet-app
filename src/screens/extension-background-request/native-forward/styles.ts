import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalize, LETTER_SPACING } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 10
        },
        loadingHeaderContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: BASE_DIMENSION * 4
        },
        moonletLogo: {
            width: normalize(36),
            height: normalize(36),
            borderRadius: normalize(36),
            alignSelf: 'center',
            marginRight: BASE_DIMENSION
        },
        headerTitle: {
            fontSize: normalize(22),
            lineHeight: normalize(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: '#FFFFFF',
            alignSelf: 'center'
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        loadingText: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: BASE_DIMENSION * 4
        }
    });
