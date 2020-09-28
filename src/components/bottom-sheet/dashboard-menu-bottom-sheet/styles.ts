import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    normalizeFontAndLineHeight
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        content: {
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 2
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        iconContainer: {
            backgroundColor: theme.colors.appBackground,
            marginRight: BASE_DIMENSION * 2,
            borderRadius: BORDER_RADIUS,
            height: normalize(40),
            width: normalize(40),
            justifyContent: 'center'
        },
        icon: {
            alignSelf: 'center'
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        title: {
            lineHeight: normalizeFontAndLineHeight(21)
        },
        subtitle: {
            lineHeight: normalizeFontAndLineHeight(21),
            fontSize: normalizeFontAndLineHeight(11)
        },
        arrowRight: {
            alignSelf: 'center'
        },
        scrollArea: {
            flexGrow: 1,
            paddingBottom: BASE_DIMENSION * 4
        }
    });
