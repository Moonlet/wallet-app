import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 4
        },
        rowContainer: {
            flexDirection: 'row'
        },
        cumulativeText: {
            fontSize: normalizeFontAndLineHeight(20),
            color: theme.colors.text
        },
        switch: {
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flex: 1,
            paddingRight: 0
        },
        cumulativeTextInfo: {
            color: theme.colors.textSecondary,
            marginTop: BASE_DIMENSION * 4
        }
    });
