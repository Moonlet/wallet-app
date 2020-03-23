import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground
        },
        topContainer: {
            flex: 1,
            alignItems: 'center',
            paddingTop: BASE_DIMENSION * 8
        },
        bottomContainer: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 6
        },
        mnemonicContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            padding: BASE_DIMENSION,
            alignSelf: 'stretch'
        },
        mnemonicLine: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION
        },
        mnemonicWord: {
            flex: 1,
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.text
        },
        copyButton: {
            marginBottom: BASE_DIMENSION * 2
        },
        textContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 2
        },
        alertIcon: {
            color: theme.colors.warning,
            marginRight: BASE_DIMENSION
        }
    });
