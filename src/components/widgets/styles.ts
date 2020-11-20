import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        widgetContainer: {
            marginBottom: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS
        },
        moduleColWrapperContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
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
            color: theme.colors.text
        },
        headerTextNonExpandable: {
            margin: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        expandingArrow: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        quickDelegateBannerContainer: {
            marginBottom: BASE_DIMENSION
        },
        infoWrapper: {
            top: 0,
            position: 'absolute',
            width: normalize(40),
            height: normalize(40),
            justifyContent: 'center'
        }
    });
