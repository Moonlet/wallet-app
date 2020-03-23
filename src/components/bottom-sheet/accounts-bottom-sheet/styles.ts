import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';
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
            marginBottom: normalize(BASE_DIMENSION * 4)
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        firstRow: {
            flexDirection: 'row',
            marginBottom: normalize(BASE_DIMENSION / 4)
        },
        accountName: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text,
            marginRight: normalize(BASE_DIMENSION)
        },
        accountAddress: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.accent
        },
        fistAmountText: {
            color: theme.colors.textSecondary
        },
        secondAmountText: {
            marginLeft: normalize(BASE_DIMENSION),
            color: theme.colors.textSecondary
        }
    });
