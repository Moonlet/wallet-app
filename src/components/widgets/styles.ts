import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        widgetContainer: {
            marginBottom: BASE_DIMENSION
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginRight: BASE_DIMENSION + 2,
            marginTop: BASE_DIMENSION + 2,
            marginHorizontal: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        headerText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '400',
            color: theme.colors.text
        },
        expandingArrow: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
