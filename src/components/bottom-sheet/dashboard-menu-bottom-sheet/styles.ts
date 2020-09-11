import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
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
            marginBottom: BASE_DIMENSION * 2
        },
        iconContainer: {
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION,
            marginRight: BASE_DIMENSION * 2,
            borderRadius: BORDER_RADIUS
        },
        icon: {
            alignSelf: 'center'
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        title: {
            lineHeight: normalizeFontAndLineHeight(21)
        },
        arrowRight: {
            alignSelf: 'center'
        },
        scrollArea: {
            flexGrow: 1,
            paddingBottom: BASE_DIMENSION * 4
        }
    });
