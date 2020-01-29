import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bottomSheetBackground,
            padding: BASE_DIMENSION * 2
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        firstRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION
        },
        accountName: {
            fontSize: 18,
            lineHeight: 25,
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        accountAddress: {
            fontSize: 18,
            lineHeight: 25,
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.accent
        },
        fistAmountText: {
            color: theme.colors.textSecondary
        },
        secondAmountText: {
            marginLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        }
    });
