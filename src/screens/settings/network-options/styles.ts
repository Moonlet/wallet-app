import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';

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
            paddingVertical: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        textHeader: {
            color: theme.colors.textSecondary,
            fontSize: normalize(13),
            lineHeight: normalize(18),
            marginTop: BASE_DIMENSION * 2
        },
        textRow: {
            flex: 1,
            fontSize: normalize(17),
            lineHeight: normalize(21),
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        textRowValue: {
            fontSize: normalize(15),
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
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: BASE_DIMENSION
        },
        rightText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION * 2
        }
    });
