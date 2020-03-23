import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

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
            fontSize: normalize(theme.fontSize.large),
            color: theme.colors.textSecondary
        },
        convert: {
            marginLeft: BASE_DIMENSION / 2,
            fontSize: normalize(theme.fontSize.large),
            color: theme.colors.textSecondary
        },
        balanceSymbolFiat: {
            fontSize: normalize(18),
            color: theme.colors.textSecondary,
            marginLeft: BASE_DIMENSION
        },
        address: {
            fontSize: normalize(30),
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
