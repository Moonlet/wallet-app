import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginTop: BASE_DIMENSION * 3,
            marginBottom: BASE_DIMENSION * 3
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        displayError: {
            flex: 1,
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.error,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19)
        },
        displayNotice: {
            flex: 1,
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.warning,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19)
        },
        noticeView: {},
        receipientWarning: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.warning,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19)
        },
        buttonRightOptions: {
            width: '100%',
            flexDirection: 'row',
            marginVertical: BASE_DIMENSION,
            alignSelf: 'flex-end',
            justifyContent: 'space-between'
        },
        textBalance: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION / 2
        },
        allBalanceText: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.accent
        },
        addValueBox: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme.colors.textTertiary,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            marginHorizontal: BASE_DIMENSION / 2
        },
        addValueText: {
            fontSize: normalizeFontAndLineHeight(12),
            lineHeight: normalizeFontAndLineHeight(16),
            color: theme.colors.text,
            textAlign: 'center'
        },
        amountsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        receipientLabel: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        }
    });
