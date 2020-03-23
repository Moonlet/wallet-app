import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            alignItems: 'center'
        },
        darkerText: {
            color: theme.colors.textSecondary
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION
        },
        account: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        address: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.accent
        },
        mainText: {
            fontSize: normalize(30),
            lineHeight: normalize(41),
            fontWeight: 'bold',
            letterSpacing: 0.4,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION * 2
        },
        secondaryText: {
            lineHeight: normalize(21),
            color: theme.colors.textSecondary
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
