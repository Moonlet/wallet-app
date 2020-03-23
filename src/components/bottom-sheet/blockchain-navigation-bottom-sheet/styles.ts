import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';
import { normalize } from '../../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bottomSheetBackground,
            padding: normalize(BASE_DIMENSION * 2)
        },
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: theme.colors.bottomSheetBackground,
            marginTop: normalize(BASE_DIMENSION)
        },
        tokenContainer: {
            flex: Platform.OS === 'web' ? 1 / 3 : 1 / 4,
            flexDirection: 'column',
            marginBottom: normalize(BASE_DIMENSION * 2)
        },
        tokenImageContainer: {
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS * 2,
            padding: normalize(BASE_DIMENSION * 2),
            marginBottom: normalize(BASE_DIMENSION),
            borderWidth: 2
        },
        coinText: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.text,
            textAlign: 'center'
        }
    });
