import { StyleSheet } from 'react-native';
import { LETTER_SPACING, MARGIN_DIMENSION, BASE_DIMENSION } from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.webAppBackground
        },
        topContainer: {
            flexDirection: 'column',
            marginTop: BASE_DIMENSION
        },
        topText: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        title: {
            fontSize: 30,
            lineHeight: 41,
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center'
        },
        subTitle: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.textSecondary,
            textAlign: 'center'
        },
        dataContainer: {
            marginTop: 14,
            marginLeft: MARGIN_DIMENSION,
            marginRight: MARGIN_DIMENSION,
            marginBottom: BASE_DIMENSION,
            borderRadius: BASE_DIMENSION,
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center'
        },
        column: {
            flex: 1
        }
    });
