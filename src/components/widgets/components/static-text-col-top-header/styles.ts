import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginVertical: BASE_DIMENSION
        },
        itemRow: {
            flex: 1
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        headerText: {
            marginBottom: BASE_DIMENSION / 2,
            fontSize: normalizeFontAndLineHeight(13),
            color: theme.colors.textSecondary
        },
        bodyText: {
            fontWeight: '600',
            color: theme.colors.text
        }
    });
