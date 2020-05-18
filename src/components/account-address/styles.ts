import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingBottom: BASE_DIMENSION * 2
        },
        balanceContainer: {
            marginTop: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        balance: {
            fontSize: normalizeFontAndLineHeight(theme.fontSize.large),
            color: theme.colors.textSecondary
        },
        convert: {
            marginLeft: BASE_DIMENSION / 2,
            fontSize: normalizeFontAndLineHeight(theme.fontSize.large),
            color: theme.colors.textSecondary
        },
        balanceSymbolFiat: {
            fontSize: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary,
            marginLeft: BASE_DIMENSION
        },
        address: {
            fontSize: normalizeFontAndLineHeight(30),
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
