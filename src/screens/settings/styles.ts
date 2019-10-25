import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 0,
            paddingLeft: 16,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        rowContainer: {
            flexDirection: 'row',
            marginTop: 16
        },
        textHeader: {
            color: theme.colors.textDarker,
            fontSize: 13,
            lineHeight: 18
        },
        textRow: {
            fontSize: 16,
            lineHeight: 25
        },
        textRowValue: {
            fontSize: 15,
            color: theme.colors.textDarker,
            lineHeight: 16,
            paddingRight: 8
        },
        switch: {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flex: 1,
            paddingRight: 16
        },
        divider: {
            width: '100%',
            height: 1,
            marginTop: 8,
            backgroundColor: theme.colors.settingsDivider
        },
        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flex: 1,
            paddingRight: 24,
            paddingBottom: 8
        },
        icon: {
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
