import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        contentContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        keyWrapper: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 3
        },
        keyText: {
            color: theme.colors.text,
            fontSize: normalize(20),
            lineHeight: normalize(25),
            textAlign: 'center',
            letterSpacing: 0.38,
            flexWrap: 'wrap',
            flexShrink: 1
        },
        tipWrapper: {
            flexDirection: 'row',
            backgroundColor: theme.colors.warning,
            padding: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS,
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 3
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
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        icon: {
            paddingHorizontal: BASE_DIMENSION * 2,
            color: theme.colors.accent
        },
        textRow: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.accent
        }
    });
