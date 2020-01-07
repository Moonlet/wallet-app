import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

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
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        address: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.accent
        },
        mainText: {
            fontSize: 30,
            lineHeight: 41,
            fontWeight: 'bold',
            letterSpacing: 0.4,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION * 2
        },
        secondaryText: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.textSecondary
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
