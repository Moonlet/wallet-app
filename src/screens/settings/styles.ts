import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 18,
            paddingBottom: 18,
            paddingHorizontal: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: 6
        },
        textHeader: {
            color: theme.colors.textSecondary,
            fontSize: 13
        },
        textRow: {
            fontSize: 16,
            alignItems: 'center',
            lineHeight: 30
        },
        textRowValue: {
            fontSize: 15,
            color: theme.colors.textSecondary,
            paddingRight: 8
        },
        switch: {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flex: 1,
            paddingRight: 0
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.settingsDivider
        },
        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 1,
            paddingRight: 8
        },
        icon: {
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
