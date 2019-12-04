import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 3,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        rowContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        blockchainName: {
            flex: 1,
            fontSize: 20,
            lineHeight: 25,
            letterSpacing: 0.38,
            color: theme.colors.text,
            opacity: 0.87
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.settingsDivider
        },
        checkIcon: {
            padding: BASE_DIMENSION * 2
        },
        menuIcon: {
            padding: BASE_DIMENSION * 2,
            color: theme.colors.textSecondary
        }
    });
