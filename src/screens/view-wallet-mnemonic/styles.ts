import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        topContainer: {
            flex: 1
        },
        bottomContainer: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 4
        },
        mnemonicContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            alignSelf: 'stretch',
            padding: BASE_DIMENSION * 2,
            marginVertical: BASE_DIMENSION * 2
        },
        mnemonicLine: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION
        },
        mnemonicWord: {
            flex: 1,
            flexBasis: 0
        },
        tipWrapper: {
            flexDirection: 'row',
            backgroundColor: theme.colors.warning,
            padding: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS
        },
        tipText: {
            flex: 1,
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.cardBackground
        },
        alertIcon: {
            alignSelf: 'center',
            color: theme.colors.cardBackground,
            marginRight: BASE_DIMENSION
        },
        unveilButton: {
            marginTop: BASE_DIMENSION * 2
        }
    });
